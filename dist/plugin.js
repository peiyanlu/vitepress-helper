import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { basename, dirname, join, parse } from 'path';
import { normalizePath } from 'vite';
import { flatNavs, getNavItem, getSidebarItem } from './helper.js';
let timer;
const schedule = (fn, ms) => {
    if (timer) {
        clearTimeout(timer);
        timer = undefined;
    }
    timer = setTimeout(fn, ms);
};
export function vitePressHelperPlugin(options) {
    const { output, navOptions, sidebarOptions, log } = options ?? {};
    const n = (p) => normalizePath(p);
    let resolvedConfig;
    return {
        name: 'VitePress-plugin-helper'.toLowerCase(),
        enforce: 'post',
        apply: 'serve',
        configResolved(config) {
            resolvedConfig = config;
        },
        async configureServer(server) {
            if (!resolvedConfig.vitepress)
                return;
            const { root, srcDir, configPath, cacheDir } = resolvedConfig.vitepress;
            if (!configPath)
                return;
            const cwd = n(process.cwd());
            // 根目录名称，例如 docs
            const rootDirName = cwd === root ? '.' : basename(root);
            // 资源目录名称，例如 src
            const srcDirName = srcDir === root ? '.' : basename(srcDir);
            const configDir = dirname(configPath);
            const { ext } = parse(configPath);
            const generator = () => {
                schedule(async () => {
                    const nav = getNavItem(rootDirName, { ...navOptions, rootDir: rootDirName, srcDir: srcDirName });
                    const sidebar = flatNavs(nav)
                        .filter(nav => nav.sidebar)
                        .reduce((sidebar, nav) => {
                        if ('activeMatch' in nav && nav.activeMatch) {
                            sidebar[nav.activeMatch] = getSidebarItem(n(join(rootDirName, nav.activeMatch)), { ...sidebarOptions, rootDir: rootDirName, srcDir: srcDirName });
                        }
                        return sidebar;
                    }, {});
                    const header = `import { DefaultTheme } from "vitepress"`;
                    const navs = JSON.stringify(nav, null, 2);
                    const navStr = `export const getNav = () => ${navs} as unknown as DefaultTheme.NavItem[]`;
                    const sidebarStr = `export const getSidebar = () => (${JSON.stringify(sidebar, null, 2)})`;
                    const file = n(join(configDir, output ?? `menu${ext}`));
                    await writeFile(file, [header, navStr, sidebarStr].join('\n\n'));
                }, 300);
            };
            // 首次启动服务时可以重新生成菜单
            const trigger = n(join(cacheDir, 'plugin_helper_trigger.md'));
            if (!existsSync(cacheDir)) {
                log && console.log('init: ', 'Empty cache directory');
                generator();
            }
            else if (!existsSync(trigger)) {
                log && console.log('init: ', 'Trigger file not found');
                await writeFile(trigger, `// ${Date.now()}`);
                generator();
            }
            server
                .watcher
                .add(rootDirName)
                .on('all', (eventName, path) => {
                if (path.endsWith('.md')) {
                    if (['add', 'addDir', 'unlink', 'unlinkDir'].includes(eventName)) {
                        log && console.log('add/unlink: ', eventName, path);
                        generator();
                    }
                    else if (
                    // path.endsWith(sidebarOptions?.targetMDFile ?? 'index.md') &&
                    n(path) !== n(join(srcDir, 'index.md')) // 菜单配置相关的 md 文件修改后重新生成菜单
                    ) {
                        log && console.log('change: ', eventName, path);
                        generator();
                    }
                }
            });
        },
    };
}
export { vitePressHelperPlugin as VitePressHelperPlugin };
