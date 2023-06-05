import { DefaultTheme } from 'vitepress'


export interface CustomFrontMatter {
  title: string;
  order: number;
}
export interface CustomNavFrontMatter extends CustomFrontMatter {
  sidebar: boolean;
  group: boolean;
}
export interface CustomSidebarFrontMatter extends CustomFrontMatter {
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
}

export interface BuildNavOptions {
  /**
   * An array of fast-glob patterns to exclude matches.
   */
  ignore?: string[];
  /**
   * Where VitePress initialize the config
   *
   * @default docs
   */
  rootDir?: string;
  /**
   * Whether to customize the matching path
   *
   * If `false`, give First-level directory, such as 'docs', We'll stitch it together into 'docs/**'
   *
   * If `true`, give the full path, such as 'docs/**'
   *
   * @default false
   */
  useCustomPath?: boolean;
  /**
   * path to the target file
   * @default index.md
   */
  targetMDFile?: `${string}.md`;
}

export interface BuildSidebarOptions extends BuildNavOptions {
  /**
   * The sidebar will use the directory name grouping, which you can change if you don't want to use the directory name.
   *
   * Lowest priority
   */
  sidebarMapping?: SidebarMapping;
  /**
   * Whether to display statistics on the number of articles in a group
   */
  showCount?: boolean;
  /**
   * Whether the sidebar of the grouping uses the link attribute
   *
   * If `true`, Read the [targetMDFile] in the directory, get the title and sort information, and the priority is higher than sidebarMapping
   *
   * If `false`, Sidebar grouping does not serve a routing role
   *
   * @default false
   */
  groupWithLink?: boolean;
  /**
   * collapsible
   *
   * Acts globally, with higher priority than [targetMDFile] and sidebarMapping
   */
  collapsed?: boolean;
}

export interface SidebarMapping {
  [key: string]: string | {
    text: string;
    order?: number;
    collapsed?: boolean;
  };
}
