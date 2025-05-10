import { Plugin } from 'vite';
import type { DefaultTheme, SiteConfig } from 'vitepress';
import { BuildNavOptions, BuildSidebarOptions } from './types.js';
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
export declare function vitePressHelperPlugin(options?: VitePressHelperOptions): Plugin;
export { vitePressHelperPlugin as VitePressHelperPlugin };
