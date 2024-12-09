import { existsSync as existsSync$1 } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { dirname, extname, parse, join, basename } from 'path';
import { normalizePath } from 'vite';
import fg from 'fast-glob';
import { existsSync } from 'fs';
import matter from 'gray-matter';

const pathJoin = (...paths) => paths.join("/").replace(/\/+/g, "/").replace(/(\.\/)+/g, "");
const pathToLink = (path, rootDir = ".", srcDir = ".") => path.replace(new RegExp(`(^(/?)${rootDir}/)+`, "g"), "/").replace(new RegExp(`(^(/?)${srcDir}/)+`, "g"), "/").replace(".md", "").replace(/\/index$/g, "/").replace(/\/+/g, "/");
const getNavItem = (dir, options) => {
  const {
    ignore = [],
    rootDir,
    srcDir,
    targetMDFile = "index.md"
  } = options;
  const getItem = (dir2, src) => {
    const p = (path) => pathJoin(dir2, src, path);
    return fg.sync(
      p(`**/${targetMDFile}`),
      {
        onlyFiles: false,
        objectMode: true,
        ignore: [p(targetMDFile), ...ignore],
        deep: 2
      }
    ).reduce((groups, entry) => {
      const { path, name } = entry;
      const data = matter.read(path).data;
      if (data.ignore) return groups;
      const link = pathToLink(pathJoin("/", path), rootDir, srcDir);
      const item = {
        text: data.title ?? dirname(name),
        activeMatch: link,
        order: data.order ?? 0,
        sidebar: data.sidebar ?? false
      };
      const noGroup = () => groups.push({ link, ...item });
      if (data.group) {
        const items = getItem(dirname(path), ".");
        if (items.length > 0) {
          groups.push({ items, ...item });
        } else {
          noGroup();
        }
      } else {
        noGroup();
      }
      return groups.sort((a, b) => a.order - b.order);
    }, []);
  };
  return getItem(dir, srcDir);
};
const flatNavs = (nav) => {
  return nav.reduce((group, item) => {
    return group.concat(item, flatNavs("items" in item && item.items || []));
  }, []);
};
const getSidebarItem = (dir, options) => {
  const {
    ignore = [],
    rootDir,
    srcDir,
    showCount,
    targetMDFile = "index.md"
  } = options;
  const getItems = (path, src) => {
    const cwd = process.cwd();
    return fg.sync(
      pathJoin(src, path, `**`),
      {
        onlyFiles: false,
        objectMode: true,
        ignore: [pathJoin("**", targetMDFile), ...ignore],
        deep: 1
      }
    ).reduce((groups, article) => {
      const { path: path2, dirent, name } = article;
      const isFile = dirent.isFile();
      if (isFile) {
        if ([".md"].includes(extname(path2))) {
          const data = matter.read(path2).data;
          if (!data.ignore) {
            const { name: fileName } = parse(path2);
            groups.push({
              text: data.title ?? fileName,
              link: pathToLink(pathJoin("/", path2), rootDir, srcDir),
              order: data.order ?? fileName.charCodeAt(0)
            });
          }
        }
      } else {
        const items = getItems(path2, ".");
        const linkPath = pathJoin(path2, targetMDFile);
        const linkStr = pathToLink(pathJoin("/", linkPath), rootDir, srcDir);
        const targetExist = existsSync(join(cwd, linkPath));
        const onlyItems = () => {
          let text = name;
          let order = name.charCodeAt(0);
          let collapsed = false;
          let link = void 0;
          const data = targetExist ? matter.read(linkPath).data : void 0;
          if (data && !data.ignore) {
            if (data.link) link = linkStr;
            if (data.title) text = data.title;
            if (data.order) order = data.order;
            if (data.collapsed) collapsed = data.collapsed;
          }
          groups.push({
            text: showCount ? `${text} [ ${items.length} ]` : text,
            link,
            items,
            collapsed,
            order
          });
        };
        onlyItems();
      }
      return groups.sort((a, b) => a.order - b.order);
    }, []);
  };
  return getItems(dir, srcDir);
};

let timer;
const schedule = (fn, ms) => {
  if (timer) {
    clearTimeout(timer);
    timer = void 0;
  }
  timer = setTimeout(fn, ms);
};
function VitePressHelperPlugin(options) {
  const { output, navOptions, sidebarOptions, log } = options ?? {};
  const n = (p) => normalizePath(p);
  let resolvedConfig;
  return {
    name: "VitePress-plugin-helper".toLowerCase(),
    enforce: "post",
    apply: "serve",
    configResolved(config) {
      resolvedConfig = config;
    },
    async configureServer(server) {
      if (!resolvedConfig.vitepress) return;
      const { root, srcDir, configPath, cacheDir } = resolvedConfig.vitepress;
      if (!configPath) return;
      const cwd = n(process.cwd());
      const rootDirName = cwd === root ? "." : basename(root);
      const srcDirName = srcDir === root ? "." : basename(srcDir);
      const configDir = dirname(configPath);
      const { ext } = parse(configPath);
      const generator = () => {
        schedule(async () => {
          const nav = getNavItem(rootDirName, { ...navOptions, rootDir: rootDirName, srcDir: srcDirName });
          const sidebar = flatNavs(nav).filter((nav2) => nav2.sidebar).reduce((sidebar2, nav2) => {
            if ("activeMatch" in nav2 && nav2.activeMatch) {
              sidebar2[nav2.activeMatch] = getSidebarItem(
                n(join(rootDirName, nav2.activeMatch)),
                { ...sidebarOptions, rootDir: rootDirName, srcDir: srcDirName }
              );
            }
            return sidebar2;
          }, {});
          const header = `import { DefaultTheme } from "vitepress"`;
          const navStr = `export const getNav = () => ${JSON.stringify(
            nav,
            null,
            2
          )} as unknown as DefaultTheme.NavItem[]`;
          const sidebarStr = `export const getSidebar = () => (${JSON.stringify(sidebar, null, 2)})`;
          const file = n(join(configDir, output ?? `menu${ext}`));
          await writeFile(file, [header, navStr, sidebarStr].join("\n\n"));
        }, 300);
      };
      const trigger = n(join(cacheDir, "plugin_helper_trigger.md"));
      if (!existsSync$1(cacheDir)) {
        log && console.log("init: ", "Empty cache directory");
        generator();
      } else if (!existsSync$1(trigger)) {
        log && console.log("init: ", "Trigger file not found");
        await writeFile(trigger, `// ${Date.now()}`);
        generator();
      }
      server.watcher.add(rootDirName).on("all", (eventName, path) => {
        if (path.endsWith(".md")) {
          if (["add", "addDir", "unlink", "unlinkDir"].includes(eventName)) {
            log && console.log("add/unlink: ", eventName, path);
            generator();
          } else if (
            // path.endsWith(sidebarOptions?.targetMDFile ?? 'index.md') &&
            n(path) !== n(join(srcDir, "index.md"))
          ) {
            log && console.log("change: ", eventName, path);
            generator();
          }
        }
      });
    }
  };
}

export { VitePressHelperPlugin, flatNavs, getNavItem, getSidebarItem, pathJoin, pathToLink };
