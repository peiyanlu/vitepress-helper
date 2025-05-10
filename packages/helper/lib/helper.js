import fg from 'fast-glob';
import { existsSync } from 'fs';
import matter from 'gray-matter';
import { dirname, extname, join, parse } from 'path';
export const pathJoin = (...paths) => paths
    .join('/')
    .replace(/\/+/g, '/')
    .replace(/(\.\/)+/g, '');
export const pathToLink = (path, rootDir = '.', srcDir = '.') => path
    .replace(new RegExp(`(^(\/?)${rootDir}\/)+`, 'g'), '/')
    .replace(new RegExp(`(^(\/?)${srcDir}\/)+`, 'g'), '/')
    .replace('.md', '')
    .replace(/\/index$/g, '/')
    .replace(/\/+/g, '/');
/**
 * Get the navigation
 *
 * By default, index.md in the root directory are ignored
 * @param {string} dir
 * @param {BuildNavOptions} options
 * @returns {T[]}
 */
export const getNavItem = (dir, options) => {
    const { ignore = [], rootDir, srcDir, targetMDFile = 'index.md', } = options;
    const getItem = (dir, src) => {
        const p = (path) => pathJoin(dir, src, path);
        return fg.sync(p(`**/${targetMDFile}`), {
            onlyFiles: false,
            objectMode: true,
            ignore: [p(targetMDFile), ...ignore],
            deep: 2,
        }).reduce((groups, entry) => {
            const { path, name } = entry;
            const data = matter.read(path).data;
            if (data.ignore)
                return groups;
            const link = pathToLink(pathJoin('/', path), rootDir, srcDir);
            const item = {
                text: data.title ?? dirname(name),
                activeMatch: link,
                order: data.order ?? 0,
                sidebar: data.sidebar ?? false,
            };
            const noGroup = () => groups.push({ link, ...item });
            if (data.group) {
                const items = getItem(dirname(path), '.');
                if (items.length > 0) {
                    groups.push({ items, ...item });
                }
                else {
                    noGroup();
                }
            }
            else {
                noGroup();
            }
            return groups.sort((a, b) => a.order - b.order);
        }, []);
    };
    return getItem(dir, srcDir);
};
export const flatNavs = (nav) => {
    return nav.reduce((group, item) => {
        return group.concat(item, flatNavs('items' in item && item.items || []));
    }, []);
};
/**
 * Get the sidebar
 *
 * The img, components directories and index.md are ignored by default
 * @param {string} dir
 * @param {BuildSidebarOptions} options
 * @returns {DefaultTheme.SidebarItem[]}
 */
export const getSidebarItem = (dir, options) => {
    const { ignore = [], rootDir, srcDir, showCount, targetMDFile = 'index.md', ignoreDirs, } = options;
    const getItems = (path, src) => {
        const cwd = process.cwd();
        return fg.sync(pathJoin(src, path, `**`), {
            onlyFiles: false,
            objectMode: true,
            ignore: [pathJoin('**', targetMDFile), ...ignore],
            deep: 1,
        }).reduce((groups, article) => {
            const { path, dirent, name } = article;
            const isFile = dirent.isFile();
            if (isFile) {
                if (['.md'].includes(extname(path))) {
                    const data = matter.read(path).data;
                    if (!data.ignore) {
                        const { name: fileName } = parse(path);
                        groups.push({
                            text: data.title ?? fileName,
                            link: pathToLink(pathJoin('/', path), rootDir, srcDir),
                            order: data.order ?? fileName.charCodeAt(0),
                        });
                    }
                }
            }
            else if (!ignoreDirs?.includes(name)) {
                const items = getItems(path, '.');
                const linkPath = pathJoin(path, targetMDFile);
                const linkStr = pathToLink(pathJoin('/', linkPath), rootDir, srcDir);
                const targetExist = existsSync(join(cwd, linkPath));
                const onlyItems = () => {
                    let text = name;
                    let order = name.charCodeAt(0);
                    let collapsed = false;
                    let link = undefined;
                    const data = targetExist ? matter.read(linkPath).data : undefined;
                    if (data && !data.ignore) {
                        if (data.link)
                            link = linkStr;
                        if (data.title)
                            text = data.title;
                        if (data.order)
                            order = data.order;
                        if (data.collapsed)
                            collapsed = data.collapsed;
                    }
                    groups.push({
                        text: showCount ? `${text} [ ${items.length} ]` : text,
                        link,
                        items,
                        collapsed,
                        order,
                    });
                };
                onlyItems();
            }
            return groups.sort((a, b) => a.order - b.order);
        }, []);
    };
    return getItems(dir, srcDir);
};
