import { DefaultTheme, defineConfig } from 'vitepress'
import { VitePressHelperPlugin } from 'vitepress-plugin-helper'
import { getNav, getSidebar } from './menu'


export default defineConfig({
  title: 'My Awesome Project',
  description: 'A VitePress Site',
  srcDir: './src',
  themeConfig: {
    nav: getNav(),
    
    sidebar: getSidebar(),
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
  vite: {
    plugins: [
      VitePressHelperPlugin(),
    ],
  },
})
