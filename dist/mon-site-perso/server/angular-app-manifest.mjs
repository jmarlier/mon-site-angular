
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
    'index.csr.html': {size: 20547, hash: '9ab499a7a5bb84183980db05d98cc46fa2478812fffc13d7d8ed55f11d28f60c', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 20555, hash: '1bb524e713bddf41b3817f756db7f71f4d61d31a5d290a72e80c0480d2185ff1', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'contact/index.html': {size: 70338, hash: 'af2fd6722bcbf15235d037ae3e250121b912da5490c2027018d762808bf00995', text: () => import('./assets-chunks/contact_index_html.mjs').then(m => m.default)},
    'skills/index.html': {size: 65260, hash: 'ee13a5fe9f8783259730ad038aa2fa93b97b29f3f782f31dd43cd43c3c14c396', text: () => import('./assets-chunks/skills_index_html.mjs').then(m => m.default)},
    'index.html': {size: 77588, hash: '6516cd5f7430363181d7cd4fa3efd4d7882e06bf1fc1d65d96e22e7c4110314e', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'about/index.html': {size: 70076, hash: '816f837ad13343a7c777227521ce8408127c4b18fe0826cabea9db8e0e5b9c3a', text: () => import('./assets-chunks/about_index_html.mjs').then(m => m.default)},
    'legal/index.html': {size: 65503, hash: '8ff55674f384081120247d4f8dc2ae5f3092a5bb7cc5ed8e98b96bd3c019d293', text: () => import('./assets-chunks/legal_index_html.mjs').then(m => m.default)},
    'portfolio/index.html': {size: 69634, hash: '76eab2f06ef93843ded4f604c3ae8016c98b8ce7b7b7cc0c4874a3ebe2431520', text: () => import('./assets-chunks/portfolio_index_html.mjs').then(m => m.default)},
    'styles-4DZH6IBR.css': {size: 20826, hash: 'YWxESlmP//E', text: () => import('./assets-chunks/styles-4DZH6IBR_css.mjs').then(m => m.default)}
  },
};
