
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "preload": [
      "chunk-3UU4CX2Q.js"
    ],
    "route": "/"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-QSXJ2YQU.js"
    ],
    "route": "/about"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-PG2TI2KF.js"
    ],
    "route": "/skills"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-FABDFWYS.js"
    ],
    "route": "/portfolio"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-YLV2CD47.js"
    ],
    "route": "/legal"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-QS7KMUWR.js"
    ],
    "route": "/contact"
  },
  {
    "renderMode": 2,
    "redirectTo": "/",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 20547, hash: '9c2c7a80faac6c698a47e0cff5e0f615e0a254555915f72c813cfdbfd27f5cff', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 20555, hash: '330b599aa03a7735758e5f443531d5297c5b4e3de53868d7c50cea3bbe68134f', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 77587, hash: '11a034018aca970513799348cc1d832d3e39210e6e2b32260baa69a3a3ebc016', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'contact/index.html': {size: 70338, hash: '59811f51839616b4fefe51328dc1506d91e70dcd8e037d418809daa58ba15ce9', text: () => import('./assets-chunks/contact_index_html.mjs').then(m => m.default)},
    'legal/index.html': {size: 65503, hash: '6cb011f3fd2105e13879be22e7ba21f595416aa83f5f1bd7a42736db663889cc', text: () => import('./assets-chunks/legal_index_html.mjs').then(m => m.default)},
    'portfolio/index.html': {size: 69634, hash: '28fbe8b032b8f56ca3f6df473a1b3c2a58eb33ef3a446c7eed23de8d4ed615bc', text: () => import('./assets-chunks/portfolio_index_html.mjs').then(m => m.default)},
    'about/index.html': {size: 70076, hash: 'a92203bc0946566b276ccbe4000fbcc603df70ef53132b46f086ccf80cdbbecd', text: () => import('./assets-chunks/about_index_html.mjs').then(m => m.default)},
    'skills/index.html': {size: 65260, hash: 'f0240232305e966c980baa43c1ead05f9466d593f0a0b761e378258fcbd53876', text: () => import('./assets-chunks/skills_index_html.mjs').then(m => m.default)},
    'styles-4DZH6IBR.css': {size: 20826, hash: 'YWxESlmP//E', text: () => import('./assets-chunks/styles-4DZH6IBR_css.mjs').then(m => m.default)}
  },
};
