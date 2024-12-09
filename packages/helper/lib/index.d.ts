import { Plugin } from 'vite';
import { DefaultTheme, SiteConfig } from 'vitepress';

interface CustomFrontMatter {
    title: string;
    order: number;
    ignore: boolean;
}
interface CustomNavFrontMatter extends CustomFrontMatter {
    sidebar: boolean;
    group: boolean;
}
interface CustomSidebarFrontMatter extends CustomFrontMatter {
    link: boolean;
    collapsed: boolean;
}
type ExtendNavItem = NavItemWithLink | NavItemWithChildren | NavItemChildren;
interface ExtendOptions {
    order: number;
    sidebar: boolean;
}
interface NavItemChildren extends DefaultTheme.NavItemChildren, ExtendOptions {
    items: NavItemWithLink[];
}
interface NavItemWithChildren extends DefaultTheme.NavItemWithChildren, ExtendOptions {
    items: (NavItemChildren | NavItemWithLink)[];
}
interface NavItemWithLink extends DefaultTheme.NavItemWithLink, ExtendOptions {
}
interface ExtendSidebarItem extends DefaultTheme.SidebarItem {
    order: number;
    test?: string;
}
interface BuildNavOptions {
    /**
     * An array of fast-glob patterns to exclude matches.
     */
    ignore?: string[];
    /**
     * Where VitePress initialize the config
     */
    rootDir: string;
    /**
     * Where your Markdown source files live
     */
    srcDir: string;
    /**
     * path to the target file
     * @default index.md
     */
    targetMDFile?: `${string}.md`;
}
interface BuildSidebarOptions extends BuildNavOptions {
    /**
     * Whether to display statistics on the number of articles in a group
     */
    showCount?: boolean;
}

declare module 'vite' {
    interface UserConfig {
        vitepress?: SiteConfig<DefaultTheme.Config>;
    }
}
interface VitePressHelperOptions {
    /** nav 和 sidebar 输出文件，默认 menu.ts */
    output?: string;
    navOptions?: Omit<BuildNavOptions, 'rootDir' | 'srcDir'>;
    sidebarOptions?: Omit<BuildSidebarOptions, 'rootDir' | 'srcDir'>;
    log?: boolean;
}
declare function VitePressHelperPlugin(options?: VitePressHelperOptions): Plugin;

declare const pathJoin: (...paths: string[]) => string;
declare const pathToLink: (path: string, rootDir?: string, srcDir?: string) => string;
/**
 * Get the navigation
 *
 * By default, index.md in the root directory are ignored
 * @param {string} dir
 * @param {BuildNavOptions} options
 * @returns {T[]}
 */
declare const getNavItem: <T extends ExtendNavItem>(dir: string, options: BuildNavOptions) => T[];
declare const flatNavs: (nav: ExtendNavItem[]) => ExtendNavItem[];
/**
 * Get the sidebar
 *
 * The img, components directories and index.md are ignored by default
 * @param {string} dir
 * @param {BuildSidebarOptions} options
 * @returns {DefaultTheme.SidebarItem[]}
 */
declare const getSidebarItem: (dir: string, options: BuildSidebarOptions) => ExtendSidebarItem[];

export { type BuildNavOptions, type BuildSidebarOptions, type CustomFrontMatter, type CustomNavFrontMatter, type CustomSidebarFrontMatter, type ExtendNavItem, type ExtendSidebarItem, VitePressHelperPlugin, flatNavs, getNavItem, getSidebarItem, pathJoin, pathToLink };
