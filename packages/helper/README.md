# vitepress-plugin-helper


一个 Vitepress 插件，可帮助生成 `nav` 和 `sidebar`，并监视 `MarkDown` 文件更改以重新启动服务。通过 `fast-glob` 实现


## 安装

```shell
npm install vitepress-plugin-helper -D
```

## API


### getNavItem

```ts
getNavItem(path: string, options?: BuildNavOptions)
```

- path: 指定获取 `nav` 的目录名，内部会拼接成 `fast-glob` 支持的 `patterns`。也可以通过可选参数 `useCustomPath` 完全由自己控制。
- options: 可选的配置项

#### Options类型定义

```ts
interface BuildNavOptions {
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
  targetMDFile?: `${ string }.md`;
}
```

#### 辅助生成


可以在 `MarkDown` 文件中提供以下内容，以帮助生成、排序和分组导航栏

```md
---
title: Title
order: 1
sidebar: true
group: true
---
```

`getNavItem` 会同过目录下的 `index.md(targetMDFile)` 读取目录来生成导航栏，如果指定了 `group：true`，我们需要为子目录提供一个 `targetMDFile`，否则子目录不会显示

```     
├───backend                      
│   ├───java                     
│   ├───mysql                    
│   ├───node                     
│   └───index.md                     
├───example 
│   ├───japi-examples.md                
│   ├───api-examples.md                
│   └───index.md                       
├───frontend
│   ├───css
│   ├───html
│   ├───javascript                
│   └───index.md  
├───group1                
│   └───index.md  // group: true
└───group2
    ├───backend-copy
    │   ├───java
    │   ├───mysql
    │   ├───node                
    │   └───index.md  
    ├───css                
    │   └───index.md  
    ├───group3
    │   ├───css            
    │   │   └───index.md   
    │   ├───html            
    │   │   └───index.md   
    │   ├───javascript               
    │   │   └───index.md                 
    │   └───index.md  // group: true
    │                    
    └───index.md  // group: true
```

```
[
  {
    "link": "/example/",
    "text": "Examples",
    "activeMatch": "/example/",
    "order": 0,
    "sidebar": true
  },
  {
    "link": "/frontend/",
    "text": "Frontend",
    "activeMatch": "/frontend/",
    "order": 1,
    "sidebar": true
  },
  {
    "link": "/backend/",
    "text": "Backend",
    "activeMatch": "/backend/",
    "order": 2,
    "sidebar": true
  },
  {
    "items": [],
    "text": "Group1",
    "activeMatch": "/group1/",
    "order": 2,
    "sidebar": true
  },
  {
    "items": [
      {
        "link": "/group2/backend-copy/",
        "text": "Backend-Copy",
        "activeMatch": "/group2/backend-copy/",
        "order": 0,
        "sidebar": true
      },
      {
        "link": "/group2/css/",
        "text": "CSS-Copy",
        "activeMatch": "/group2/css/",
        "order": 0,
        "sidebar": true
      },
      {
        "items": [
          {
            "link": "/group2/group3/css/",
            "text": "group3-css",
            "activeMatch": "/group2/group3/css/",
            "order": 0,
            "sidebar": true
          },
          {
            "link": "/group2/group3/html/",
            "text": "group3-html",
            "activeMatch": "/group2/group3/html/",
            "order": 0,
            "sidebar": true
          },
          {
            "link": "/group2/group3/javascript/",
            "text": "group3-js",
            "activeMatch": "/group2/group3/javascript/",
            "order": 0,
            "sidebar": true
          }
        ],
        "text": "Group3",
        "activeMatch": "/group2/group3/",
        "order": 1,
        "sidebar": true
      }
    ],
    "text": "Group2",
    "activeMatch": "/group2/",
    "order": 2,
    "sidebar": true
  }
]
```

### getSidebarItem

```ts
getSidebarItem(path:string, options?: BuildSidebarOptions)
```

- path: 指定获取 `sidebar` 的目录名，内部会拼接成 `fast-glob` 支持的 `patterns`。也可以通过可选参数 `useCustomPath` 完全由自己控制。
- options: 可选的配置项

#### Options类型定义

```ts
interface BuildSidebarOptions extends BuildNavOptions {
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

interface SidebarMapping {
  [key: string]: string | {
    text: string;
    order?: number;
    collapsed?: boolean;
  };
}
```

#### 辅助生成


可以提供以下内容以帮助显示标题和排序。分组按照文件夹名称默认排序，可以通过提供 `sidebarMapping` 来更改默认显示；
如果启用了 `groupWithLink` 会读取有 `targetMDFile` 的目录生成链接并且获取标题和排序信息，`sidebarMapping` 优先级最低

```md
---
title: Title
order: 1
collapsed: false
---
```

侧边栏也可以通过 `getNavItem` 帮助获取：

```ts
import { flatNavs, getNavItem, getSidebarItem, pathJoin } from 'vitepress-plugin-helper'
const nav = getNavItem('docs')
const sidebar = flatNavs(nav)
  .filter(nav => nav.sidebar)
  .reduce<DefaultTheme.SidebarMulti>((sidebar, nav) => {
    if ('activeMatch' in nav && nav.activeMatch) {
      sidebar[nav.activeMatch] = getSidebarItem(pathJoin('docs', nav.activeMatch))
    }
    return sidebar
  }, {})
```

### 提示

在通过 VitePress CLI 构建项目时初始化配置的位置一般是 `docs`，如果使用了自定义，需要在参数中指定 `rootDir`，如果初始化配置在根目录，使用 `rootDir: '.'`

## CLI


创建（例如，'docs/.vitepress/helper/restart-trigger.ts'）文件在 `config.ts` 中引入。
`vitepress-helper watch` 将监视指定目录中 `MarkDown` 文件的新增和删除等操作，当文件更改时它将重写 `docs/.vitepress/helper/restart-trigger.ts` 以触发服务重新启动

```shell
vitepress-helper watch --dir docs --output docs/.vitepress/helper/restart-trigger.ts
```

## 预览
![img.png](img/img.png)

