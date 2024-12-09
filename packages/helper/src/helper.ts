import fg from 'fast-glob'
import { existsSync } from 'fs'
import matter from 'gray-matter'
import { dirname, extname, join, parse } from 'path'
import type {
  BuildNavOptions,
  BuildSidebarOptions,
  CustomNavFrontMatter,
  CustomSidebarFrontMatter,
  ExtendNavItem,
  ExtendSidebarItem,
} from './types.js'


export const pathJoin = (...paths: string[]) => paths
  .join('/')
  .replace(/\/+/g, '/')
  .replace(/(\.\/)+/g, '')

export const pathToLink = (path: string, rootDir = '.', srcDir = '.'): string => path
  .replace(new RegExp(`(^(\/?)${ rootDir }\/)+`, 'g'), '/')
  .replace(new RegExp(`(^(\/?)${ srcDir }\/)+`, 'g'), '/')
  .replace('.md', '')
  .replace(/\/index$/g, '/')
  .replace(/\/+/g, '/')

/**
 * Get the navigation
 *
 * By default, index.md in the root directory are ignored
 * @param {string} dir
 * @param {BuildNavOptions} options
 * @returns {T[]}
 */
export const getNavItem = <T extends ExtendNavItem>(dir: string, options: BuildNavOptions): T[] => {
  const {
    ignore = [],
    rootDir,
    srcDir,
    targetMDFile = 'index.md',
  } = options
  
  const getItem = (dir: string, src: string) => {
    const p = (path: string) => pathJoin(dir, src, path)
    return fg.sync(
      p(`**/${ targetMDFile }`),
      {
        onlyFiles: false,
        objectMode: true,
        ignore: [ p(targetMDFile), ...ignore ],
        deep: 2,
      },
    ).reduce<T[]>((groups, entry) => {
      const { path, name } = entry
      
      const data = matter.read(path).data as CustomNavFrontMatter
      if (data.ignore) return groups
      
      const link = pathToLink(pathJoin('/', path), rootDir, srcDir)
      
      const item = {
        text: data.title ?? dirname(name),
        activeMatch: link,
        order: data.order ?? 0,
        sidebar: data.sidebar ?? false,
      } as T
      
      const noGroup = () => groups.push({ link, ...item })
      if (data.group) {
        const items = getItem(dirname(path), '.')
        if (items.length > 0) {
          groups.push({ items, ...item })
        } else {
          noGroup()
        }
      } else {
        noGroup()
      }
      
      return groups.sort((a, b) => a.order - b.order)
    }, [])
  }
  
  return getItem(dir, srcDir)
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
 * @param {string} dir
 * @param {BuildSidebarOptions} options
 * @returns {DefaultTheme.SidebarItem[]}
 */
export const getSidebarItem = (dir: string, options: BuildSidebarOptions): ExtendSidebarItem[] => {
  const {
    ignore = [],
    rootDir,
    srcDir,
    showCount,
    targetMDFile = 'index.md',
  } = options
  
  const getItems = (path: string, src: string) => {
    const cwd = process.cwd()
    
    return fg.sync(
      pathJoin(src, path, `**`),
      {
        onlyFiles: false,
        objectMode: true,
        ignore: [ pathJoin('**', targetMDFile), ...ignore ],
        deep: 1,
      },
    ).reduce<ExtendSidebarItem[]>((groups, article) => {
      const { path, dirent, name } = article
      const isFile = dirent.isFile()
      
      if (isFile) {
        if ([ '.md' ].includes(extname(path))) {
          const data = matter.read(path).data as CustomSidebarFrontMatter
          
          if (!data.ignore) {
            const { name: fileName } = parse(path)
            groups.push({
              text: data.title ?? fileName,
              link: pathToLink(pathJoin('/', path), rootDir, srcDir),
              order: data.order ?? fileName.charCodeAt(0),
            })
          }
        }
      } else {
        const items = getItems(path, '.')
        const linkPath = pathJoin(path, targetMDFile)
        const linkStr = pathToLink(pathJoin('/', linkPath), rootDir, srcDir)
        const targetExist = existsSync(join(cwd, linkPath))
        
        const onlyItems = () => {
          let text = name
          let order = name.charCodeAt(0)
          let collapsed = false
          let link: string | undefined = undefined
          
          const data = targetExist ? matter.read(linkPath).data as CustomSidebarFrontMatter : undefined
          if (data && !data.ignore) {
            if (data.link) link = linkStr
            if (data.title) text = data.title
            if (data.order) order = data.order
            if (data.collapsed) collapsed = data.collapsed
          }
          
          groups.push({
            text: showCount ? `${ text } [ ${ items.length } ]` : text,
            link,
            items,
            collapsed,
            order,
          })
        }
        
        onlyItems()
      }
      
      return groups.sort((a, b) => a.order - b.order)
    }, [])
  }
  
  return getItems(dir, srcDir)
}
