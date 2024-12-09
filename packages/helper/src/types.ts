/// <reference types="vite/client" />

import { DefaultTheme } from 'vitepress'


export interface CustomFrontMatter {
  title: string;
  order: number;
  ignore: boolean;
}
export interface CustomNavFrontMatter extends CustomFrontMatter {
  sidebar: boolean;
  group: boolean;
}
export interface CustomSidebarFrontMatter extends CustomFrontMatter {
  link: boolean;
  collapsed: boolean;
}


export type ExtendNavItem = NavItemWithLink | NavItemWithChildren | NavItemChildren

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

interface NavItemWithLink extends DefaultTheme.NavItemWithLink, ExtendOptions {}

export interface ExtendSidebarItem extends DefaultTheme.SidebarItem {
  order: number;
  test?: string
}

export interface BuildNavOptions {
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

export interface BuildSidebarOptions extends BuildNavOptions {
  /**
   * Whether to display statistics on the number of articles in a group
   */
  showCount?: boolean;
}
