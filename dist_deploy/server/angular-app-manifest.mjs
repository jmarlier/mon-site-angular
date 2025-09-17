
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "preload": [
      "chunk-AVAJYM24.js"
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
    'index.csr.html': {size: 20547, hash: '0144fdd75fc8372426c81d0b0181ece9b2ed4c120f8732e13cd283ad9a9cd481', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 20555, hash: '2a2c778d372a646601c04d040dba12ad2a5222b70cccd08d1a88c17aa8c7aa21', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'skills/index.html': {size: 65260, hash: '5eca0c4fb8e2a16a150268784fa2cb16cc48e10f69c8f4469d373dcb8a26d7ca', text: () => import('./assets-chunks/skills_index_html.mjs').then(m => m.default)},
    'index.html': {size: 77588, hash: '188955b039d7f310f73a4a7476fc32666b7b01697004e3a662c23223c0a1959e', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'about/index.html': {size: 70076, hash: '6f285741a67a37c8c3b9bc0f8386e4dae83aa1240325c2d512d6d37c03a5e93f', text: () => import('./assets-chunks/about_index_html.mjs').then(m => m.default)},
    'legal/index.html': {size: 65503, hash: 'dfba2a612adde548fc5f0ae19f72813118b970feb8258b7127401a778e437dd0', text: () => import('./assets-chunks/legal_index_html.mjs').then(m => m.default)},
    'contact/index.html': {size: 70338, hash: 'd52228fd3cff4370dfcc6d9648c3ae5c7ddff64afa34d3fe5de0b719e55b9dcf', text: () => import('./assets-chunks/contact_index_html.mjs').then(m => m.default)},
    'portfolio/index.html': {size: 69634, hash: 'e622c2797d0da5c2981c7bce6f965452d7a41cc016aab73243cc1c764982c3c7', text: () => import('./assets-chunks/portfolio_index_html.mjs').then(m => m.default)},
    'styles-4DZH6IBR.css': {size: 20826, hash: 'YWxESlmP//E', text: () => import('./assets-chunks/styles-4DZH6IBR_css.mjs').then(m => m.default)}
  },
};
