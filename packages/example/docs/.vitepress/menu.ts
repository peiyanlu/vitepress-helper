import { DefaultTheme } from "vitepress"

export const getNav = () => [
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
    "link": "/group1/",
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
] as unknown as DefaultTheme.NavItem[]

export const getSidebar = () => ({
  "/example/": [
    {
      "text": "Runtime API Examples",
      "link": "/example/api-examples",
      "order": 97
    },
    {
      "text": "Markdown Extension Examples",
      "link": "/example/markdown-examples",
      "order": 109
    }
  ],
  "/frontend/": [
    {
      "text": "JS",
      "link": "/frontend/javascript/",
      "items": [
        {
          "text": "Array",
          "link": "/frontend/javascript/js-array",
          "order": 106
        },
        {
          "text": "Object",
          "link": "/frontend/javascript/js-object",
          "order": 106
        },
        {
          "text": "String",
          "link": "/frontend/javascript/js-string",
          "order": 106
        }
      ],
      "collapsed": true,
      "order": 1
    },
    {
      "text": "CSS",
      "link": "/frontend/css/",
      "items": [
        {
          "text": "selector",
          "link": "/frontend/css/css-selector",
          "order": 99
        },
        {
          "text": "weight",
          "link": "/frontend/css/css-weight",
          "order": 99
        }
      ],
      "collapsed": true,
      "order": 99
    },
    {
      "text": "HTML",
      "items": [
        {
          "text": "tag",
          "link": "/frontend/html/html-tag",
          "order": 104
        }
      ],
      "collapsed": false,
      "order": 104
    }
  ],
  "/backend/": [
    {
      "text": "java",
      "items": [
        {
          "text": "Java-Advanced",
          "link": "/backend/java/java-advanced",
          "order": 106
        },
        {
          "text": "Java-Basics",
          "link": "/backend/java/java-start",
          "order": 106
        }
      ],
      "collapsed": false,
      "order": 106
    },
    {
      "text": "mysql",
      "items": [
        {
          "text": "MySQL-Basics",
          "link": "/backend/mysql/mysql-start",
          "order": 109
        }
      ],
      "collapsed": false,
      "order": 109
    },
    {
      "text": "node",
      "items": [
        {
          "text": "fs",
          "link": "/backend/node/node-fs",
          "order": 110
        }
      ],
      "collapsed": false,
      "order": 110
    }
  ],
  "/group1/": [],
  "/group2/": [
    {
      "text": "Group3",
      "items": [
        {
          "text": "group3-css",
          "items": [
            {
              "text": "选择器",
              "link": "/group2/group3/css/css-selector",
              "order": 99
            },
            {
              "text": "权重",
              "link": "/group2/group3/css/css-weight",
              "order": 99
            }
          ],
          "collapsed": false,
          "order": 99
        },
        {
          "text": "group3-html",
          "items": [
            {
              "text": "标签",
              "link": "/group2/group3/html/html-tag",
              "order": 104
            }
          ],
          "collapsed": false,
          "order": 104
        },
        {
          "text": "group3-js",
          "items": [
            {
              "text": "数组",
              "link": "/group2/group3/javascript/js-array",
              "order": 106
            },
            {
              "text": "对象",
              "link": "/group2/group3/javascript/js-object",
              "order": 106
            },
            {
              "text": "字符串",
              "link": "/group2/group3/javascript/js-string",
              "order": 106
            }
          ],
          "collapsed": false,
          "order": 106
        }
      ],
      "collapsed": false,
      "order": 1
    },
    {
      "text": "Backend-Copy",
      "items": [
        {
          "text": "java",
          "items": [
            {
              "text": "Java-Advanced",
              "link": "/group2/backend-copy/java/java-advanced",
              "order": 106
            },
            {
              "text": "Java-Basics",
              "link": "/group2/backend-copy/java/java-start",
              "order": 106
            }
          ],
          "collapsed": false,
          "order": 106
        },
        {
          "text": "mysql",
          "items": [
            {
              "text": "MySQL-Basics",
              "link": "/group2/backend-copy/mysql/mysql-start",
              "order": 109
            }
          ],
          "collapsed": false,
          "order": 109
        },
        {
          "text": "node",
          "items": [
            {
              "text": "fs",
              "link": "/group2/backend-copy/node/node-fs",
              "order": 110
            }
          ],
          "collapsed": false,
          "order": 110
        }
      ],
      "collapsed": false,
      "order": 98
    },
    {
      "text": "CSS-Copy",
      "items": [
        {
          "text": "selector",
          "link": "/group2/css/css-selector",
          "order": 99
        },
        {
          "text": "weight",
          "link": "/group2/css/css-weight",
          "order": 99
        }
      ],
      "collapsed": false,
      "order": 99
    }
  ],
  "/group2/backend-copy/": [
    {
      "text": "java",
      "items": [
        {
          "text": "Java-Advanced",
          "link": "/group2/backend-copy/java/java-advanced",
          "order": 106
        },
        {
          "text": "Java-Basics",
          "link": "/group2/backend-copy/java/java-start",
          "order": 106
        }
      ],
      "collapsed": false,
      "order": 106
    },
    {
      "text": "mysql",
      "items": [
        {
          "text": "MySQL-Basics",
          "link": "/group2/backend-copy/mysql/mysql-start",
          "order": 109
        }
      ],
      "collapsed": false,
      "order": 109
    },
    {
      "text": "node",
      "items": [
        {
          "text": "fs",
          "link": "/group2/backend-copy/node/node-fs",
          "order": 110
        }
      ],
      "collapsed": false,
      "order": 110
    }
  ],
  "/group2/css/": [
    {
      "text": "selector",
      "link": "/group2/css/css-selector",
      "order": 99
    },
    {
      "text": "weight",
      "link": "/group2/css/css-weight",
      "order": 99
    }
  ],
  "/group2/group3/": [
    {
      "text": "group3-css",
      "items": [
        {
          "text": "选择器",
          "link": "/group2/group3/css/css-selector",
          "order": 99
        },
        {
          "text": "权重",
          "link": "/group2/group3/css/css-weight",
          "order": 99
        }
      ],
      "collapsed": false,
      "order": 99
    },
    {
      "text": "group3-html",
      "items": [
        {
          "text": "标签",
          "link": "/group2/group3/html/html-tag",
          "order": 104
        }
      ],
      "collapsed": false,
      "order": 104
    },
    {
      "text": "group3-js",
      "items": [
        {
          "text": "数组",
          "link": "/group2/group3/javascript/js-array",
          "order": 106
        },
        {
          "text": "对象",
          "link": "/group2/group3/javascript/js-object",
          "order": 106
        },
        {
          "text": "字符串",
          "link": "/group2/group3/javascript/js-string",
          "order": 106
        }
      ],
      "collapsed": false,
      "order": 106
    }
  ],
  "/group2/group3/css/": [
    {
      "text": "选择器",
      "link": "/group2/group3/css/css-selector",
      "order": 99
    },
    {
      "text": "权重",
      "link": "/group2/group3/css/css-weight",
      "order": 99
    }
  ],
  "/group2/group3/html/": [
    {
      "text": "标签",
      "link": "/group2/group3/html/html-tag",
      "order": 104
    }
  ],
  "/group2/group3/javascript/": [
    {
      "text": "数组",
      "link": "/group2/group3/javascript/js-array",
      "order": 106
    },
    {
      "text": "对象",
      "link": "/group2/group3/javascript/js-object",
      "order": 106
    },
    {
      "text": "字符串",
      "link": "/group2/group3/javascript/js-string",
      "order": 106
    }
  ]
})