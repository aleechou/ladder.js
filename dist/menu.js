/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(7)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction) {
  isProduction = _isProduction

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[data-vue-ssr-id~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mainwnd_vue__ = __webpack_require__(4);
Vue.use(VueMaterial.default);



function InitApp() {
    window.$app = new Vue({
        el: 'v-app',
        components: { MainWnd: __WEBPACK_IMPORTED_MODULE_0__mainwnd_vue__["a" /* default */] }
    });
}

// in electron
if (typeof nodeRequire != 'undefined') {
    var { ipcRenderer } = nodeRequire("electron");
    window.$ipc = ipcRenderer;

    // 向主进程请求 settings
    $ipc.send('pull-settings');

    // 从主进程接收 settings
    $ipc.on('push-settings', (from, data) => {
        // console.log(from, settings)
        window.$Settings = data[0];
        window.$UserRules = data[1];

        console.log(window.$UserRules);

        // 创建 App
        InitApp();
    });
}

// in browser
else {
        InitApp();
    }

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_13_5_0_vue_loader_lib_selector_type_script_index_0_bustCache_mainwnd_vue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_13_5_0_vue_loader_lib_template_compiler_index_id_data_v_7824bc86_hasScoped_false_buble_transforms_node_modules_13_5_0_vue_loader_lib_selector_type_template_index_0_bustCache_mainwnd_vue__ = __webpack_require__(30);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(5)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_13_5_0_vue_loader_lib_selector_type_script_index_0_bustCache_mainwnd_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_13_5_0_vue_loader_lib_template_compiler_index_id_data_v_7824bc86_hasScoped_false_buble_transforms_node_modules_13_5_0_vue_loader_lib_selector_type_template_index_0_bustCache_mainwnd_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/menu/mainwnd.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7824bc86", Component.options)
  } else {
    hotAPI.reload("data-v-7824bc86", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("351b39b2", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/.0.28.11@css-loader/index.js!../../node_modules/.13.5.0@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7824bc86\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/.13.5.0@vue-loader/lib/selector.js?type=styles&index=0&bustCache!./mainwnd.vue", function() {
     var newContent = require("!!../../node_modules/.0.28.11@css-loader/index.js!../../node_modules/.13.5.0@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7824bc86\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/.13.5.0@vue-loader/lib/selector.js?type=styles&index=0&bustCache!./mainwnd.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n.v-bottom-nav{\n    -webkit-transform: translate(0, 0px);\n    transform: translate(0, 0px);\n}\n", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__settings_vue__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tunnels_vue__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__servers_vue__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__rules_vue__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__exit_vue__ = __webpack_require__(27);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//







/* harmony default export */ __webpack_exports__["a"] = ({
    data: () => ({
        activeTunnels: 0
    }),
    mounted() {
        $(".app")[0].style.display = 'flex';
        this.$refs.rules.$el.style.display = 'flex';
    },
    methods: {
        switchPage(pageName) {
            $(".main").hide();
            this.$refs[pageName].$el.style.display = 'flex';
        },
        cbTunnelCountChanged(val) {
            this.activeTunnels = val;
        }
    },
    components: {
        Settings: __WEBPACK_IMPORTED_MODULE_0__settings_vue__["a" /* default */],
        Tunnels: __WEBPACK_IMPORTED_MODULE_1__tunnels_vue__["a" /* default */],
        Servers: __WEBPACK_IMPORTED_MODULE_2__servers_vue__["a" /* default */],
        Rules: __WEBPACK_IMPORTED_MODULE_3__rules_vue__["a" /* default */],
        Exit: __WEBPACK_IMPORTED_MODULE_4__exit_vue__["a" /* default */]
    }
});

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_13_5_0_vue_loader_lib_selector_type_script_index_0_bustCache_settings_vue__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_13_5_0_vue_loader_lib_template_compiler_index_id_data_v_e281236c_hasScoped_false_buble_transforms_node_modules_13_5_0_vue_loader_lib_selector_type_template_index_0_bustCache_settings_vue__ = __webpack_require__(13);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(10)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_13_5_0_vue_loader_lib_selector_type_script_index_0_bustCache_settings_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_13_5_0_vue_loader_lib_template_compiler_index_id_data_v_e281236c_hasScoped_false_buble_transforms_node_modules_13_5_0_vue_loader_lib_selector_type_template_index_0_bustCache_settings_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/menu/settings.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-e281236c", Component.options)
  } else {
    hotAPI.reload("data-v-e281236c", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("47e53d68", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/.0.28.11@css-loader/index.js!../../node_modules/.13.5.0@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e281236c\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/.13.5.0@vue-loader/lib/selector.js?type=styles&index=0&bustCache!./settings.vue", function() {
     var newContent = require("!!../../node_modules/.0.28.11@css-loader/index.js!../../node_modules/.13.5.0@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-e281236c\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/.13.5.0@vue-loader/lib/selector.js?type=styles&index=0&bustCache!./settings.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n#pageSettings {\n    flex-direction: column;\n}\n", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

if (typeof nodeRequire != 'undefined') var { ipcRenderer } = nodeRequire("electron");

/* harmony default export */ __webpack_exports__["a"] = ({
    name: 'Settings',
    data: () => ({
        proxy: $Settings.proxy
    }),

    methods: {
        onSettingChanged(dataName) {
            console.log(dataName);
            ipcRenderer.send('proxy-setting', dataName, this.proxy[dataName]);
        }
    }
});

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "main", attrs: { id: "pageSettings" } }, [
    _c(
      "div",
      [
        _c("v-switch", {
          attrs: { label: "全局代理" },
          on: {
            change: function($event) {
              _vm.onSettingChanged("global")
            }
          },
          model: {
            value: _vm.proxy.global,
            callback: function($$v) {
              _vm.$set(_vm.proxy, "global", $$v)
            },
            expression: "proxy.global"
          }
        })
      ],
      1
    ),
    _vm._v(" "),
    _c(
      "div",
      [
        _c("v-switch", {
          attrs: { label: "设置为操作系统的代理" },
          on: {
            change: function($event) {
              _vm.onSettingChanged("asSystemProxy")
            }
          },
          model: {
            value: _vm.proxy.asSystemProxy,
            callback: function($$v) {
              _vm.$set(_vm.proxy, "asSystemProxy", $$v)
            },
            expression: "proxy.asSystemProxy"
          }
        })
      ],
      1
    ),
    _vm._v(" "),
    _c(
      "div",
      [
        _c("v-switch", {
          attrs: { label: "设置为Git的代理" },
          on: {
            change: function($event) {
              _vm.onSettingChanged("asGitProxy")
            }
          },
          model: {
            value: _vm.proxy.asGitProxy,
            callback: function($$v) {
              _vm.$set(_vm.proxy, "asGitProxy", $$v)
            },
            expression: "proxy.asGitProxy"
          }
        })
      ],
      1
    ),
    _vm._v(" "),
    _c(
      "div",
      [
        _c("v-switch", {
          attrs: { label: "使用 gfwlist" },
          on: {
            change: function($event) {
              _vm.onSettingChanged("useGFWList")
            }
          },
          model: {
            value: _vm.proxy.useGFWList,
            callback: function($$v) {
              _vm.$set(_vm.proxy, "useGFWList", $$v)
            },
            expression: "proxy.useGFWList"
          }
        })
      ],
      1
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-e281236c", esExports)
  }
}

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_13_5_0_vue_loader_lib_selector_type_script_index_0_bustCache_tunnels_vue__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_13_5_0_vue_loader_lib_template_compiler_index_id_data_v_167b0b34_hasScoped_false_buble_transforms_node_modules_13_5_0_vue_loader_lib_selector_type_template_index_0_bustCache_tunnels_vue__ = __webpack_require__(18);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(15)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_13_5_0_vue_loader_lib_selector_type_script_index_0_bustCache_tunnels_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_13_5_0_vue_loader_lib_template_compiler_index_id_data_v_167b0b34_hasScoped_false_buble_transforms_node_modules_13_5_0_vue_loader_lib_selector_type_template_index_0_bustCache_tunnels_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/menu/tunnels.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-167b0b34", Component.options)
  } else {
    hotAPI.reload("data-v-167b0b34", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(16);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("4cec5d0f", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/.0.28.11@css-loader/index.js!../../node_modules/.13.5.0@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-167b0b34\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/.13.5.0@vue-loader/lib/selector.js?type=styles&index=0&bustCache!./tunnels.vue", function() {
     var newContent = require("!!../../node_modules/.0.28.11@css-loader/index.js!../../node_modules/.13.5.0@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-167b0b34\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/.13.5.0@vue-loader/lib/selector.js?type=styles&index=0&bustCache!./tunnels.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n.md-list-item-container{\n    font-size: 14 ;\n}\n.directly {\n    color: gray;\n}\n.md-list-item-content {\n    min-height: 40px;\n}\nv-btn.small {\n    min-width: 20px;\n    height: 18px;\n    font-size: 10px\n}\n.md-tooltip {\n    font-size: 10;\n}\n.tunnel-list{\n    overflow-x: hidden;\n    /* overflow-y: scroll; */\n}\n.tunnel-detail {\n    padding-left: 15px;\n    padding-right: 15px;\n    font-size:12;\n}\n.app-path {\n    word-wrap: break-word;\n    color: gray;\n}\n.app-path {\n    color: black;\n}\n\n/* 隧道列表动画 */\n.list-enter-active, .list-leave-active {\n  transition: all 1s;\n}\n.list-enter, .list-leave-to\n/* .list-leave-active for below version 2.1.8 */ {\n  opacity: 0;\n  transform: translateX(30px);\n}\n\n/* 隧道详情动画 */\n/* .bounce-enter-active {\n  animation: bounce-in .5s;\n}\n.bounce-leave-active {\n  animation: bounce-in .5s reverse;\n}\n@keyframes bounce-in {\n  0% {\n    transform: scale(0);\n  }\n  50% {\n    transform: scale(1.5);\n  }\n  100% {\n    transform: scale(1);\n  }\n} */\n.fade-enter-active, .fade-leave-active {\n  transition: opacity .3s;\n}\n.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {\n  opacity: 0;\n}\n\n", ""]);

// exports


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var { ipcRenderer } = typeof nodeRequire != 'undefined' ? nodeRequire("electron") : { on: () => {} };

var addrRuleCache = {};
function regexpFromAddr(addr) {
    if (!addrRuleCache[addr]) addrRuleCache[addr] = "(^|\\.)" + addr.replace(/\./g, '\\.') + "$";
    return addrRuleCache[addr];
}

var mapReqid2Tunnel = {};

/* harmony default export */ __webpack_exports__["a"] = ({
    name: 'Tunnels',
    data() {
        return {
            activeTunnels: [],
            tunnelRemains: 0,
            showDirectly: true,
            showProxy: true,
            tunnelId: 0,
            develop: !!$Settings.develop
        };
    },
    props: ['cbTunnelCountChanged'],
    created() {
        ipcRenderer.on('tunnel-new', (from, info) => {
            this.prependTunnel(info);
        });
        ipcRenderer.on('tunnel-status-changed', (from, reqid, status) => {
            mapReqid2Tunnel[reqid].status = status;
        });
        ipcRenderer.on('tunnel-closed', (from, reqid) => {
            this.tunnelRemains--;

            delete mapReqid2Tunnel[reqid];

            for (var i = 0; i < this.activeTunnels.length; i++) {
                if (this.activeTunnels[i].reqid == reqid) {
                    this.activeTunnels.splice(i, 1);
                    break;
                }
            }
        });
    },
    mounted() {},
    methods: {
        disconnect: function (tunnel) {
            ipcRenderer.send('disconnect-tunnel', tunnel.reqid);
        },

        prependTunnel(info) {
            info.detail = false;
            this.tunnelRemains++;
            this.activeTunnels.unshift(info);

            mapReqid2Tunnel[info.reqid] = info;

            this.$nextTick(() => {
                $('.tunnel-detail:not(.hasinit)').each(function () {
                    $(this).addClass('hasinit');
                });
            });
        },

        expandeTunnelDetail(currentTunnel) {
            if (currentTunnel.detail) {
                currentTunnel.detail = false;
            } else {
                for (var tunnel of this.activeTunnels) {
                    tunnel.detail = tunnel == currentTunnel;
                }
            }
        },

        userRuleHasExists(addr) {
            var regexp = regexpFromAddr(addr);
            for (var rule of $UserRules) {
                if (regexp == rule.txt) {
                    return true;
                }
            }
            return false;
        },
        addToUserRules(addr) {
            var regexp = regexpFromAddr(addr);
            $ipc.send('user-rule-new', regexp);
        }

    },
    watch: {
        tunnelRemains(val) {
            this.$props.cbTunnelCountChanged && this.$props.cbTunnelCountChanged(val);
        }

    },
    computed: {
        tunnelClasses() {}
    }
});

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "md-content",
    {
      staticClass: "main",
      staticStyle: {
        "flex-direction": "column",
        "padding-left": "10px",
        "padding-right": "10px"
      }
    },
    [
      _c("div", { staticStyle: { "font-size": "13", display: "flex" } }, [
        _vm._v("\n        显示隧道：\n        "),
        _c("label", [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.showDirectly,
                expression: "showDirectly"
              }
            ],
            attrs: { type: "checkbox" },
            domProps: {
              checked: Array.isArray(_vm.showDirectly)
                ? _vm._i(_vm.showDirectly, null) > -1
                : _vm.showDirectly
            },
            on: {
              change: function($event) {
                var $$a = _vm.showDirectly,
                  $$el = $event.target,
                  $$c = $$el.checked ? true : false
                if (Array.isArray($$a)) {
                  var $$v = null,
                    $$i = _vm._i($$a, $$v)
                  if ($$el.checked) {
                    $$i < 0 && (_vm.showDirectly = $$a.concat([$$v]))
                  } else {
                    $$i > -1 &&
                      (_vm.showDirectly = $$a
                        .slice(0, $$i)
                        .concat($$a.slice($$i + 1)))
                  }
                } else {
                  _vm.showDirectly = $$c
                }
              }
            }
          }),
          _vm._v("\n            直连\n        ")
        ]),
        _vm._v(" "),
        _c("label", { staticStyle: { "margin-left": "10" } }, [
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.showProxy,
                expression: "showProxy"
              }
            ],
            attrs: { type: "checkbox" },
            domProps: {
              checked: Array.isArray(_vm.showProxy)
                ? _vm._i(_vm.showProxy, null) > -1
                : _vm.showProxy
            },
            on: {
              change: function($event) {
                var $$a = _vm.showProxy,
                  $$el = $event.target,
                  $$c = $$el.checked ? true : false
                if (Array.isArray($$a)) {
                  var $$v = null,
                    $$i = _vm._i($$a, $$v)
                  if ($$el.checked) {
                    $$i < 0 && (_vm.showProxy = $$a.concat([$$v]))
                  } else {
                    $$i > -1 &&
                      (_vm.showProxy = $$a
                        .slice(0, $$i)
                        .concat($$a.slice($$i + 1)))
                  }
                } else {
                  _vm.showProxy = $$c
                }
              }
            }
          }),
          _vm._v("\n            代理\n        ")
        ])
      ]),
      _vm._v(" "),
      _c(
        "transition-group",
        { tag: "div", staticClass: "tunnel-list", attrs: { name: "list" } },
        _vm._l(_vm.activeTunnels, function(tunnel, index) {
          return (tunnel.directly ? _vm.showDirectly : _vm.showProxy)
            ? _c(
                "div",
                {
                  key: tunnel.reqid,
                  ref: "tunnelitems",
                  refInFor: true,
                  staticStyle: { width: "100%" },
                  on: {
                    click: function($event) {
                      _vm.expandeTunnelDetail(tunnel)
                    }
                  }
                },
                [
                  _c(
                    "div",
                    {
                      staticClass: "md-dense md-primary tunnel-summary",
                      staticStyle: {
                        cursor: "pointer",
                        width: "100%",
                        display: "flex"
                      }
                    },
                    [
                      _c(
                        "div",
                        {
                          class: { directly: !!tunnel.directly },
                          staticStyle: { flex: "1" }
                        },
                        [
                          !tunnel.directly
                            ? _c(
                                "v-icon",
                                {
                                  staticStyle: { color: "green" },
                                  attrs: { title: "通过代理连接" }
                                },
                                [_vm._v("swap_horiz")]
                              )
                            : _vm._e(),
                          _vm._v(" "),
                          _c("span", [_vm._v(_vm._s(tunnel.dstHost))]),
                          _vm._v(" "),
                          _c("span", { staticStyle: { color: "gray" } }, [
                            _vm._v(":" + _vm._s(tunnel.dstPort))
                          ]),
                          _vm._v(
                            "\n\n                        [" +
                              _vm._s(tunnel.status) +
                              "]\n\n                    "
                          )
                        ],
                        1
                      )
                    ]
                  ),
                  _vm._v(" "),
                  _c("transition", { attrs: { name: "fade" } }, [
                    _c(
                      "div",
                      {
                        directives: [
                          {
                            name: "show",
                            rawName: "v-show",
                            value: tunnel.detail,
                            expression: "tunnel.detail"
                          }
                        ],
                        staticClass: "tunnel-detail"
                      },
                      [
                        _c("div", { staticStyle: { display: "flex" } }, [
                          _c("div", { staticStyle: { flex: "1" } }, [
                            _c("b", [_vm._v("Source:")]),
                            _vm._v(
                              "\n                                " +
                                _vm._s(tunnel.srcAddr) +
                                ":" +
                                _vm._s(tunnel.srcPort) +
                                "\n                            "
                            )
                          ]),
                          _vm._v(" "),
                          _c("div", [
                            _c("b", [_vm._v("PID:")]),
                            _vm._v(
                              "\n                                " +
                                _vm._s(tunnel.srcApp.pid) +
                                "\n                            "
                            )
                          ])
                        ]),
                        _vm._v(" "),
                        _c("div", [
                          _c("b", [_vm._v("APP:")]),
                          _vm._v(" "),
                          _c("b", { staticStyle: { "margin-left": "10px" } }, [
                            _vm._v(_vm._s(tunnel.srcApp.name))
                          ])
                        ]),
                        _vm._v(" "),
                        _c("div", [
                          _c("span", { staticClass: "app-path" }, [
                            _vm._v(
                              "\n                                " +
                                _vm._s(tunnel.srcApp.path) +
                                "\n                                " +
                                _vm._s(tunnel.srcApp.argv) +
                                "\n                            "
                            )
                          ])
                        ]),
                        _vm._v(" "),
                        _c("div", [
                          _c(
                            "a",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: !_vm.userRuleHasExists(tunnel.dstAddr),
                                  expression:
                                    "!userRuleHasExists(tunnel.dstAddr)"
                                }
                              ],
                              attrs: {
                                title:
                                  "将该域名作为规则，添加到用户规则表。后续对该域名的请求，都经过代理服务器建立隧道",
                                href: "javascript:void(0)"
                              },
                              on: {
                                click: function($event) {
                                  _vm.addToUserRules(tunnel.dstAddr)
                                }
                              }
                            },
                            [
                              _vm._v(
                                "\n                                加为规则表\n                            "
                              )
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "a",
                            {
                              staticStyle: { "margin-left": "20" },
                              attrs: {
                                title: "强行关闭这个正在工作的隧道",
                                href: "javascript:void(0)"
                              },
                              on: {
                                click: function($event) {
                                  _vm.disconnect(tunnel)
                                }
                              }
                            },
                            [
                              _vm._v(
                                "\n                                断开\n                            "
                              )
                            ]
                          )
                        ])
                      ]
                    )
                  ])
                ],
                1
              )
            : _vm._e()
        })
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-167b0b34", esExports)
  }
}

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_13_5_0_vue_loader_lib_selector_type_script_index_0_bustCache_servers_vue__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_13_5_0_vue_loader_lib_template_compiler_index_id_data_v_5151058e_hasScoped_false_buble_transforms_node_modules_13_5_0_vue_loader_lib_selector_type_template_index_0_bustCache_servers_vue__ = __webpack_require__(21);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_13_5_0_vue_loader_lib_selector_type_script_index_0_bustCache_servers_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_13_5_0_vue_loader_lib_template_compiler_index_id_data_v_5151058e_hasScoped_false_buble_transforms_node_modules_13_5_0_vue_loader_lib_selector_type_template_index_0_bustCache_servers_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/menu/servers.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-5151058e", Component.options)
  } else {
    hotAPI.reload("data-v-5151058e", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["a"] = ({
    data() {
        return {
            servers: $Settings.servers
        };
    }
});

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "main" },
    [
      _c(
        "div",
        { staticStyle: { flex: "1" } },
        _vm._l(_vm.servers, function(svr) {
          return _c(
            "v-card",
            { staticClass: "white--text", attrs: { color: "blue-grey" } },
            [
              _c("v-card-title", { attrs: { "primary-title": "" } }, [
                _c(
                  "div",
                  [
                    _c("v-text-field", {
                      attrs: { placeholder: "用户名", label: "用户名" },
                      model: {
                        value: svr.username,
                        callback: function($$v) {
                          _vm.$set(svr, "username", $$v)
                        },
                        expression: "svr.username"
                      }
                    })
                  ],
                  1
                )
              ])
            ],
            1
          )
        })
      ),
      _vm._v(" "),
      _c(
        "v-btn",
        {
          attrs: { color: "info" },
          nativeOn: {
            click: function($event) {
              _vm.loader = "loading4"
            }
          }
        },
        [
          _c("v-icon", { attrs: { light: "" } }, [_vm._v("add")]),
          _vm._v("\n        添加服务器\n    ")
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-5151058e", esExports)
  }
}

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_13_5_0_vue_loader_lib_selector_type_script_index_0_bustCache_rules_vue__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_13_5_0_vue_loader_lib_template_compiler_index_id_data_v_74921160_hasScoped_false_buble_transforms_node_modules_13_5_0_vue_loader_lib_selector_type_template_index_0_bustCache_rules_vue__ = __webpack_require__(26);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(23)
}
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_13_5_0_vue_loader_lib_selector_type_script_index_0_bustCache_rules_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_13_5_0_vue_loader_lib_template_compiler_index_id_data_v_74921160_hasScoped_false_buble_transforms_node_modules_13_5_0_vue_loader_lib_selector_type_template_index_0_bustCache_rules_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/menu/rules.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-74921160", Component.options)
  } else {
    hotAPI.reload("data-v-74921160", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(24);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(2)("41900f14", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/.0.28.11@css-loader/index.js!../../node_modules/.13.5.0@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-74921160\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/.13.5.0@vue-loader/lib/selector.js?type=styles&index=0&bustCache!./rules.vue", function() {
     var newContent = require("!!../../node_modules/.0.28.11@css-loader/index.js!../../node_modules/.13.5.0@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-74921160\",\"scoped\":false,\"hasInlineConfig\":false}!../../node_modules/.13.5.0@vue-loader/lib/selector.js?type=styles&index=0&bustCache!./rules.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)(false);
// imports


// module
exports.push([module.i, "\n.list-user-rules {\n    margin-top: 20px;\n    margin-bottom: 20px;\n    margin-left: 10px;\n    margin-right: 10px;\n    overflow-y: scroll;\n    height: 100%;\n}\n.listitem-user-rule {\n    display: flex;\n    margin-bottom: 4px;\n}\n.listitem-user-rule input.checkbox {\n    margin-right: 4px;\n}\n", ""]);

// exports


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var { ipcRenderer } = typeof nodeRequire != 'undefined' ? nodeRequire("electron") : { on: () => {} };

/* harmony default export */ __webpack_exports__["a"] = ({
    data() {
        return {
            rules: $UserRules,
            editingIndex: -1
        };
    },
    created() {
        ipcRenderer.on('user-rule-new', (from, idx, rule) => {
            this.rules.push(rule);
        });
    },
    methods: {
        enableChanged(idx) {
            var rule = this.rules[idx];
            rule.enable = !rule.enable;

            // 向主进程请求 settings
            $ipc.send('user-rule-changed', idx, rule);
        },

        deleteRule(idx) {
            this.rules.splice(idx, 1);
            $ipc.send('user-rule-delete', idx);
        },

        startEditRule(idx) {
            this.editingIndex = idx;
            setTimeout(() => $(".ipt-rule-edit[idx=" + idx + "]")[0].focus(), 0);
        },

        cancelEditRule() {
            this.editingIndex = -1;
        },

        saveRule(idx) {
            $ipc.send('user-rule-changed', this.editingIndex, this.rules[this.editingIndex]);
            this.editingIndex = -1;
        }
    }
});

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "main" }, [
    _c("h3", [_vm._v("用户规则")]),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "list-user-rules" },
      _vm._l(_vm.rules, function(rule, idx) {
        return _c("div", { staticClass: "row listitem-user-rule" }, [
          _c("input", {
            staticClass: "checkbox",
            attrs: { type: "checkbox" },
            domProps: { checked: rule.enable ? "checked" : "" },
            on: {
              click: function($event) {
                _vm.enableChanged(idx)
              }
            }
          }),
          _vm._v(" "),
          _c(
            "span",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.editingIndex != idx,
                  expression: "editingIndex!=idx"
                }
              ],
              staticStyle: { flex: "1" },
              on: {
                click: function($event) {
                  _vm.startEditRule(idx)
                }
              }
            },
            [_vm._v(_vm._s(rule.txt))]
          ),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.editingIndex == idx,
                expression: "editingIndex==idx"
              },
              {
                name: "model",
                rawName: "v-model",
                value: rule.txt,
                expression: "rule.txt"
              }
            ],
            staticClass: "ipt-rule-edit",
            staticStyle: { flex: "1" },
            attrs: { idx: idx },
            domProps: { value: rule.txt },
            on: {
              keyup: function($event) {
                if (
                  !("button" in $event) &&
                  _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")
                ) {
                  return null
                }
                _vm.saveRule()
              },
              blur: function($event) {
                _vm.saveRule()
              },
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.$set(rule, "txt", $event.target.value)
              }
            }
          }),
          _vm._v(" "),
          _c(
            "a",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.editingIndex == idx,
                  expression: "editingIndex==idx"
                }
              ],
              on: {
                click: function($event) {
                  _vm.deleteRule(idx)
                }
              }
            },
            [_vm._v("删除")]
          )
        ])
      })
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-74921160", esExports)
  }
}

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_13_5_0_vue_loader_lib_selector_type_script_index_0_bustCache_exit_vue__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_13_5_0_vue_loader_lib_template_compiler_index_id_data_v_36945545_hasScoped_false_buble_transforms_node_modules_13_5_0_vue_loader_lib_selector_type_template_index_0_bustCache_exit_vue__ = __webpack_require__(29);
var disposed = false
var normalizeComponent = __webpack_require__(0)
/* script */

/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = null
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_13_5_0_vue_loader_lib_selector_type_script_index_0_bustCache_exit_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_13_5_0_vue_loader_lib_template_compiler_index_id_data_v_36945545_hasScoped_false_buble_transforms_node_modules_13_5_0_vue_loader_lib_selector_type_template_index_0_bustCache_exit_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/menu/exit.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-36945545", Component.options)
  } else {
    hotAPI.reload("data-v-36945545", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["a"] = (Component.exports);


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
//
//
//
//
//
//
//
//
//
//
//
//

if (typeof nodeRequire != 'undefined') var { ipcRenderer } = nodeRequire('electron');

/* harmony default export */ __webpack_exports__["a"] = ({
    methods: {
        exit() {
            ipcRenderer.send('exit');
        }
    }
});

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "md-empty-state",
    {
      staticClass: "main",
      attrs: { "md-icon": "wifi_off", "md-label": "退出？" }
    },
    [
      _c(
        "md-button",
        { staticClass: "md-accent md-raised", on: { click: _vm.exit } },
        [_vm._v("确定退出")]
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-36945545", esExports)
  }
}

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("settings", { ref: "settings" }),
      _vm._v(" "),
      _c("tunnels", {
        ref: "tunnels",
        attrs: { cbTunnelCountChanged: _vm.cbTunnelCountChanged }
      }),
      _vm._v(" "),
      _c("servers", { ref: "servers" }),
      _vm._v(" "),
      _c("rules", { ref: "rules" }),
      _vm._v(" "),
      _c("exit", { ref: "exit" }),
      _vm._v(" "),
      _c(
        "v-bottom-nav",
        { attrs: { "md-type": "shift" } },
        [
          _c(
            "v-btn",
            {
              on: {
                click: function($event) {
                  _vm.switchPage("settings")
                }
              }
            },
            [
              _c("span", [_vm._v("设置")]),
              _vm._v(" "),
              _c("v-icon", [_vm._v("build")])
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-btn",
            {
              attrs: { id: "item-posts" },
              on: {
                click: function($event) {
                  _vm.switchPage("tunnels")
                }
              }
            },
            [
              _c(
                "v-icon",
                { staticClass: "md-bottom-bar-icon material-icons" },
                [_vm._v("swap_horiz")]
              ),
              _vm._v(" "),
              _c("span", { staticClass: "md-bottom-bar-label" }, [
                _vm._v("隧道")
              ]),
              _vm._v(" "),
              _vm.activeTunnels
                ? _c("i", { staticClass: "badge" }, [
                    _vm._v(_vm._s(_vm.activeTunnels))
                  ])
                : _vm._e()
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-btn",
            {
              on: {
                click: function($event) {
                  _vm.switchPage("servers")
                }
              }
            },
            [
              _c("span", [_vm._v("服务器")]),
              _vm._v(" "),
              _c("v-icon", [_vm._v("filter_drama")])
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-btn",
            {
              on: {
                click: function($event) {
                  _vm.switchPage("rules")
                }
              }
            },
            [
              _c("span", [_vm._v("规则")]),
              _vm._v(" "),
              _c("v-icon", [_vm._v("check_circle_outline")])
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "v-btn",
            {
              on: {
                click: function($event) {
                  _vm.switchPage("exit")
                }
              }
            },
            [
              _c("span", [_vm._v("退出")]),
              _vm._v(" "),
              _c("v-icon", [_vm._v("power_settings_new")])
            ],
            1
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-7824bc86", esExports)
  }
}

/***/ })
/******/ ]);