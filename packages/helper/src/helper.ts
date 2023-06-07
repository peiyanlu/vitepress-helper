import { sync } from 'fast-glob'
import fs from 'fs'
import matter from 'gray-matter'
import { dirname, extname, parse } from 'path'
import type { BuildNavOptions, BuildSidebarOptions, CustomNavFrontMatter, CustomSidebarFrontMatter, ExtendNavItem, ExtendSidebarItem } from './helper-types'


export * from './helper-types'

export const pathJoin = (...paths: string[]) => paths.join('/').replace(/\/+/g, '/')

export const pathToLink = (path: string, rootDir = 'docs'): string => path
  .replace(new RegExp(`^${ rootDir }\/`), '/')
  .replace('.md', '')
  .replace(/\/index$/g, '/')
  .replace(/\/+/g, '/')

/**
 * Get the navigation
 *
 * By default, index.md in the root directory are ignored
 * @param {string} path
 * @param {BuildNavOptions} options
 * @returns {T[]}
 */
export const getNavItem = <T extends ExtendNavItem>(path: string, options?: BuildNavOptions): T[] => {
  const { ignore = [], rootDir = 'docs', useCustomPath, targetMDFile = 'index.md' } = options || {}
  
  return sync(
    useCustomPath ? path : pathJoin(path, `/**/${ targetMDFile }`),
    {
      onlyFiles: false,
      objectMode: true,
      ignore: [ pathJoin(path, targetMDFile), ...ignore ],
      deep: 2,
    },
  ).reduce<T[]>((groups, entry) => {
    const { path, name } = entry
    const data = matter.read(path).data as CustomNavFrontMatter
    
    const link = pathToLink(path.startsWith(rootDir) ? path : pathJoin(rootDir, path), rootDir)
    
    const item = {
      text: data.title ?? dirname(name),
      activeMatch: link,
      order: data.order ?? 0,
      sidebar: data.sidebar ?? false,
    } as T
    
    const noGroup = () => {
      groups.push({
        link: link,
        ...item,
      })
    }
    if (data.group) {
      const items = getNavItem(dirname(path))
      if (items.length > 0) {
        groups.push({
          items: items,
          ...item,
        })
      } else {
        noGroup()
      }
    } else {
      noGroup()
    }
    
    return groups.sort((a, b) => a.order - b.order)
  }, [])
}

export const flatNavs = (nav: ExtendNavItem[]): ExtendNavItem[] => {
  return nav.reduce<(ExtendNavItem)[]>((group, item) => {
    return group.concat(item, flatNavs('items' in item && item.items || []))
  }, [])
}

/**
 * Get the sidebar
 *
 * The img, components directories and index.md are ignored by default
 * @param {string} path
 * @param {BuildSidebarOptions} options
 * @returns {DefaultTheme.SidebarItem[]}
 */
export const getSidebarItem = (path: string, options?: BuildSidebarOptions): ExtendSidebarItem[] => {
  const {
    ignore,
    rootDir = 'docs',
    useCustomPath,
    sidebarMapping,
    showCount,
    targetMDFile = 'index.md',
    groupWithLink,
    collapsed,
  } = options || {}
  const getItems = (path: string) => {
    return sync(
      useCustomPath ? path : pathJoin(path, `/**`),
      {
        onlyFiles: false,
        objectMode: true,
        ignore: ignore || [ '**/img/**', '**/components/**', pathJoin('**/', targetMDFile) ],
        deep: 1,
      },
    ).reduce<ExtendSidebarItem[]>((groups, article) => {
      const { path, dirent, name } = article
      const isFile = dirent.isFile()
      
      if (isFile) {
        if ([ '.md' ].includes(extname(path))) {
          const data = matter.read(path).data as CustomSidebarFrontMatter
          const { name:fileName } = parse(path)
          groups.push({
            text: data.title ?? fileName,
            link: pathToLink(path, rootDir),
            order: data.order ?? fileName.charCodeAt(0),
          })
        }
      } else {
        const items = getItems(path)
        
        const mapping = sidebarMapping?.[name]
        const isStr = typeof mapping === 'string'
        const text = isStr ? mapping : mapping?.text ?? name
        const order = isStr ? name.charCodeAt(0) : mapping?.order ?? name.charCodeAt(0)
        const collapse = isStr ? true : mapping?.collapsed ?? true
        
        const linkPath = pathJoin(path, targetMDFile)
        
        const onlyLink = () => {
          groups.push({
            text: showCount ? `[${ items.length }] ${ text }` : text,
            items: items,
            collapsed: collapsed ?? collapse,
            order: order,
          })
        }
        if (groupWithLink) {
          if (fs.existsSync(linkPath)) {
            const data = matter.read(linkPath).data as CustomSidebarFrontMatter
            groups.push({
              text: showCount ? `[${ items.length }] ${ data.title ?? text }` : data.title ?? text,
              link: pathToLink(linkPath, rootDir),
              items: items,
              collapsed: collapsed ?? data.collapsed ?? collapse,
              order: data.order ?? order,
            })
          } else {
            onlyLink()
          }
        } else {
          onlyLink()
        }
      }
      
      return groups.sort((a, b) => a.order - b.order)
    }, [])
  }
  
  return getItems(path)
}
