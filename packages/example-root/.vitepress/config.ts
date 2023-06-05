import { DefaultTheme, defineConfig } from 'vitepress'
import { flatNavs, getNavItem, getSidebarItem, pathJoin } from 'vitepress-plugin-helper'
import './helper/restart-trigger'


const nav = getNavItem('.')
const sidebar = flatNavs(nav)
  .filter(nav => nav.sidebar)
  .reduce<DefaultTheme.SidebarMulti>((sidebar, nav) => {
    if ('activeMatch' in nav && nav.activeMatch) {
      sidebar[nav.activeMatch] = getSidebarItem(pathJoin('.', nav.activeMatch), { rootDir: '.', groupWithLink: true  })
    }
    return sidebar
  }, {})
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'My Awesome Project',
  description: 'A VitePress Site',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav,
    
    sidebar: sidebar,
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
})
