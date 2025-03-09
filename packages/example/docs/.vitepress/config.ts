import { DefaultTheme, defineConfig } from 'vitepress'
import { vitePressHelperPlugin } from 'vitepress-plugin-helper'
import { getNav, getSidebar } from './menu'


// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'My Awesome Project',
  description: 'A VitePress Site',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: getNav(),
    
    sidebar: getSidebar(),
    
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
  vite: {
    plugins: [
      vitePressHelperPlugin(),
    ],
  },
})
