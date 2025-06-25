import type { BuildNavOptions, BuildSidebarOptions, ExtendNavItem, ExtendSidebarItem } from './types.js';
export declare const pathJoin: (...paths: string[]) => string;
export declare const pathToLink: (path: string, rootDir?: string, srcDir?: string) => string;
/**
 * Get the navigation
 *
 * By default, index.md in the root directory are ignored
 * @param {string} dir
 * @param {BuildNavOptions} options
 * @returns {T[]}
 */
export declare const getNavItem: <T extends ExtendNavItem>(dir: string, options: BuildNavOptions) => T[];
export declare const flatNavs: (nav: ExtendNavItem[]) => ExtendNavItem[];
/**
 * Get the sidebar
 *
 * The img, components directories and index.md are ignored by default
 * @param {string} dir
 * @param {BuildSidebarOptions} options
 * @returns {DefaultTheme.SidebarItem[]}
 */
export declare const getSidebarItem: (dir: string, options: BuildSidebarOptions) => ExtendSidebarItem[];
