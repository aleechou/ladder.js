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
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
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

module.exports = window.Vue;

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_5_0_vue_loader_lib_selector_type_script_index_0_bustCache_node_modules_iview_loader_1_0_0_iview_loader_index_js_ref_1_1_index_vue__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_5_0_vue_loader_lib_template_compiler_index_id_data_v_4b6f85da_hasScoped_false_buble_transforms_node_modules_vue_loader_13_5_0_vue_loader_lib_selector_type_template_index_0_bustCache_node_modules_iview_loader_1_0_0_iview_loader_index_js_ref_1_1_index_vue__ = __webpack_require__(4);
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_5_0_vue_loader_lib_selector_type_script_index_0_bustCache_node_modules_iview_loader_1_0_0_iview_loader_index_js_ref_1_1_index_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_5_0_vue_loader_lib_template_compiler_index_id_data_v_4b6f85da_hasScoped_false_buble_transforms_node_modules_vue_loader_13_5_0_vue_loader_lib_selector_type_template_index_0_bustCache_node_modules_iview_loader_1_0_0_iview_loader_index_js_ref_1_1_index_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/mainwnd/settings/index.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-4b6f85da", Component.options)
  } else {
    hotAPI.reload("data-v-4b6f85da", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 3 */
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

/* harmony default export */ __webpack_exports__["a"] = ({
  data() {
    return $store.ui.mainwnd;
  }
});

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "Tabs",
    {
      attrs: { animated: false },
      model: {
        value: _vm.selectedTab,
        callback: function($$v) {
          _vm.selectedTab = $$v
        },
        expression: "selectedTab"
      }
    },
    [
      _c(
        "TabPane",
        { attrs: { label: "服务器/隧道", name: "server&tunnel" } },
        [_c("mainwnd.settings.server-tunnel")],
        1
      ),
      _vm._v(" "),
      _c("TabPane", { attrs: { label: "规则", name: "reg" } }, [
        _vm._v("\n      xxxx\n    ")
      ])
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
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-4b6f85da", esExports)
  }
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_5_0_vue_loader_lib_selector_type_script_index_0_bustCache_node_modules_iview_loader_1_0_0_iview_loader_index_js_ref_1_1_server_tunnel_vue__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_5_0_vue_loader_lib_template_compiler_index_id_data_v_be2a318c_hasScoped_false_buble_transforms_node_modules_vue_loader_13_5_0_vue_loader_lib_selector_type_template_index_0_bustCache_node_modules_iview_loader_1_0_0_iview_loader_index_js_ref_1_1_server_tunnel_vue__ = __webpack_require__(12);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(6)
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
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_13_5_0_vue_loader_lib_selector_type_script_index_0_bustCache_node_modules_iview_loader_1_0_0_iview_loader_index_js_ref_1_1_server_tunnel_vue__["a" /* default */],
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_13_5_0_vue_loader_lib_template_compiler_index_id_data_v_be2a318c_hasScoped_false_buble_transforms_node_modules_vue_loader_13_5_0_vue_loader_lib_selector_type_template_index_0_bustCache_node_modules_iview_loader_1_0_0_iview_loader_index_js_ref_1_1_server_tunnel_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/mainwnd/settings/server-tunnel.vue"
if (Component.esModule && Object.keys(Component.esModule).some(function (key) {  return key !== "default" && key.substr(0, 2) !== "__"})) {  console.error("named exports are not supported in *.vue files.")}

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-loader/node_modules/vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-be2a318c", Component.options)
  } else {
    hotAPI.reload("data-v-be2a318c", Component.options)
' + '  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(9)("4a2d0edd", content, false);
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../../node_modules/_css-loader@0.28.7@css-loader/index.js!../../../node_modules/_vue-loader@13.5.0@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-be2a318c\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/_vue-loader@13.5.0@vue-loader/lib/selector.js?type=styles&index=0&bustCache!../../../node_modules/_iview-loader@1.0.0@iview-loader/index.js?{\"prefix\":false}!./server-tunnel.vue", function() {
     var newContent = require("!!../../../node_modules/_css-loader@0.28.7@css-loader/index.js!../../../node_modules/_vue-loader@13.5.0@vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-be2a318c\",\"scoped\":false,\"hasInlineConfig\":false}!../../../node_modules/_vue-loader@13.5.0@vue-loader/lib/selector.js?type=styles&index=0&bustCache!../../../node_modules/_iview-loader@1.0.0@iview-loader/index.js?{\"prefix\":false}!./server-tunnel.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(8)(undefined);
// imports


// module
exports.push([module.i, "\n.selected {\n    background-color: rgb(102, 193, 247);\n}\n.server-li {\n    height: 30px;\n    padding-top: 6px;\n    padding-left: 10px;\n    cursor: pointer;\n}\n", ""]);

// exports


/***/ }),
/* 8 */
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
/* 9 */
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

var listToStyles = __webpack_require__(10)

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
/* 10 */
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
/* 11 */
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

/* harmony default export */ __webpack_exports__["a"] = ({
    data() {
        return {
            config: $store.config,
            currentServerIdx: 0
        };
    },

    computed: {
        currentTunnel() {
            if (!$store.config.tunnels.length) {
                $store.config.tunnels = [newEmptyServerConfig()];
                this.currentServerIdx = 0;
            }
            return $store.config.tunnels[this.currentServerIdx];
        },
        currentTitle() {
            return this.methods.serverTitle(this.currentTunnel);
        }
    },

    methods: {
        addServer() {
            $store.config.tunnels.push(newEmptyServerConfig());
        },
        removeCurrentServer() {
            $store.config.tunnels.splice(this.currentServerIdx);

            // 删除的是最后一个
            if (this.currentServerIdx >= $store.config.tunnels.length) {
                this.currentServerIdx--;
            }
        },
        serverTitle(serverConfig) {
            if (!serverConfig) return '';
            if (serverConfig.title) return serverConfig.title;else if (serverConfig.server) {
                var title = (serverConfig.username || "") + "@" + serverConfig.server;
                if (serverConfig.port != 22) title += " :" + serverConfig.port;
                return title;
            } else {
                return "<user>@<host or ip> :<port>";
            }
        },

        onClickServer(row) {
            this.currentServerIdx = row;
        }
    }
});

function genServerConfigId() {
    return hex_md5(Date.now().toString() + Math.random());
}

function newEmptyServerConfig() {
    return {
        id: genServerConfigId(),
        title: "",
        server: "",
        port: 22,
        username: "root",
        password: "",
        pubKey: "",
        priKey: '',
        useKey: true,
        type: "dynamic",
        inPort: 7070,
        connectOnStart: false,
        autoReconnect: true
    };
}

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticStyle: { display: "flex" } },
    [
      _c(
        "div",
        [
          _vm._l(_vm.config.tunnels, function(item, row) {
            return _c("ul", { staticStyle: { width: "200px" } }, [
              _c(
                "li",
                {
                  staticClass: "server-li",
                  class: { selected: row == _vm.currentServerIdx },
                  on: {
                    click: function($event) {
                      _vm.onClickServer(row)
                    }
                  }
                },
                [
                  _vm._v(
                    "\n                " +
                      _vm._s(_vm.serverTitle(item)) +
                      "\n            "
                  )
                ]
              )
            ])
          }),
          _vm._v(" "),
          _c(
            "div",
            [
              _c(
                "Button",
                {
                  attrs: { icon: "plus", size: "small" },
                  on: { click: _vm.addServer }
                },
                [_vm._v("添加")]
              ),
              _vm._v(" "),
              _c(
                "Button",
                {
                  attrs: { icon: "trash-b", size: "small" },
                  on: { click: _vm.removeCurrentServer }
                },
                [_vm._v("移除")]
              )
            ],
            1
          )
        ],
        2
      ),
      _vm._v(" "),
      _c(
        "Form",
        { attrs: { "label-position": "right", "label-width": 80 } },
        [
          _c(
            "FormItem",
            { attrs: { label: "隧道名称" } },
            [
              _c("Input", {
                attrs: { placeholder: _vm.serverTitle(_vm.currentTunnel) },
                model: {
                  value: _vm.currentTunnel.title,
                  callback: function($$v) {
                    _vm.$set(_vm.currentTunnel, "title", $$v)
                  },
                  expression: "currentTunnel.title"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "FormItem",
            { attrs: { label: "服务器" } },
            [
              _c(
                "Row",
                [
                  _c(
                    "Col",
                    { attrs: { span: "18" } },
                    [
                      _c("Input", {
                        attrs: { placeholder: "IP 或 域名" },
                        model: {
                          value: _vm.currentTunnel.server,
                          callback: function($$v) {
                            _vm.$set(_vm.currentTunnel, "server", $$v)
                          },
                          expression: "currentTunnel.server"
                        }
                      })
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "Col",
                    { attrs: { span: "6" } },
                    [
                      _c(
                        "Input",
                        {
                          attrs: { placeholder: "<端口号>, 22" },
                          model: {
                            value: _vm.currentTunnel.port,
                            callback: function($$v) {
                              _vm.$set(_vm.currentTunnel, "port", $$v)
                            },
                            expression: "currentTunnel.port"
                          }
                        },
                        [_vm._v("端口：")]
                      )
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "FormItem",
            { attrs: { label: "用户" } },
            [
              _c(
                "Row",
                [
                  _c(
                    "Col",
                    { attrs: { span: "12" } },
                    [
                      _c(
                        "Input",
                        {
                          attrs: { placeholder: "用户名" },
                          model: {
                            value: _vm.currentTunnel.username,
                            callback: function($$v) {
                              _vm.$set(_vm.currentTunnel, "username", $$v)
                            },
                            expression: "currentTunnel.username"
                          }
                        },
                        [
                          _c("Icon", {
                            attrs: {
                              slot: "prepend",
                              type: "ios-person-outline"
                            },
                            slot: "prepend"
                          })
                        ],
                        1
                      )
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "Col",
                    { attrs: { span: "12" } },
                    [
                      _c(
                        "Input",
                        {
                          attrs: {
                            type: "password",
                            disabled: !!_vm.currentTunnel.useKey,
                            placeholder: "密码"
                          },
                          model: {
                            value: _vm.currentTunnel.password,
                            callback: function($$v) {
                              _vm.$set(_vm.currentTunnel, "password", $$v)
                            },
                            expression: "currentTunnel.password"
                          }
                        },
                        [
                          _c("Icon", {
                            attrs: {
                              slot: "prepend",
                              type: "ios-locked-outline"
                            },
                            slot: "prepend"
                          })
                        ],
                        1
                      )
                    ],
                    1
                  )
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "FormItem",
            { attrs: { label: "公钥" } },
            [
              _c("Input", {
                attrs: {
                  disabled: !_vm.currentTunnel.useKey,
                  type: "textarea",
                  autosize: { minRows: 1, maxRows: 5 },
                  placeholder: ""
                },
                model: {
                  value: _vm.currentTunnel.pubKey,
                  callback: function($$v) {
                    _vm.$set(_vm.currentTunnel, "pubKey", $$v)
                  },
                  expression: "currentTunnel.pubKey"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "FormItem",
            { attrs: { label: "私钥" } },
            [
              _c("Input", {
                attrs: {
                  disabled: !_vm.currentTunnel.useKey,
                  type: "textarea",
                  autosize: { minRows: 1, maxRows: 5 },
                  placeholder: ""
                },
                model: {
                  value: _vm.currentTunnel.priKey,
                  callback: function($$v) {
                    _vm.$set(_vm.currentTunnel, "priKey", $$v)
                  },
                  expression: "currentTunnel.priKey"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "FormItem",
            { attrs: { label: "使用密钥" } },
            [
              _c(
                "i-switch",
                {
                  model: {
                    value: _vm.currentTunnel.useKey,
                    callback: function($$v) {
                      _vm.$set(_vm.currentTunnel, "useKey", $$v)
                    },
                    expression: "currentTunnel.useKey"
                  }
                },
                [
                  _c("Icon", {
                    attrs: { slot: "open", type: "android-done" },
                    slot: "open"
                  }),
                  _vm._v(" "),
                  _c("Icon", {
                    attrs: { slot: "close", type: "android-close" },
                    slot: "close"
                  })
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "FormItem",
            { attrs: { label: "隧道类型" } },
            [
              _c(
                "RadioGroup",
                {
                  model: {
                    value: _vm.currentTunnel.type,
                    callback: function($$v) {
                      _vm.$set(_vm.currentTunnel, "type", $$v)
                    },
                    expression: "currentTunnel.type"
                  }
                },
                [
                  _c("Radio", { attrs: { label: "dynamic" } }, [
                    _c("span", [_vm._v("动态(-D)")])
                  ]),
                  _vm._v(" "),
                  _c(
                    "Radio",
                    { attrs: { label: "local", sdisabled: "true" } },
                    [_c("span", [_vm._v("本地主机转发(-L)")])]
                  ),
                  _vm._v(" "),
                  _c(
                    "Radio",
                    { attrs: { label: "remove", sdisabled: "true" } },
                    [_c("span", [_vm._v("远程主机转发(-R)")])]
                  )
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "Row",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.currentTunnel.type == "dynamic",
                  expression: "currentTunnel.type=='dynamic'"
                }
              ],
              attrs: { label: "" }
            },
            [
              _vm._v("\n            (请求) ->\n            本机:"),
              _c("Input", {
                staticStyle: { width: "60px" },
                model: {
                  value: _vm.currentTunnel.inPort,
                  callback: function($$v) {
                    _vm.$set(_vm.currentTunnel, "inPort", $$v)
                  },
                  expression: "currentTunnel.inPort"
                }
              }),
              _vm._v(
                "\n            ==隧道==>\n            代理服务器\n            -> 目标服务器\n        "
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "Row",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.currentTunnel.type == "local",
                  expression: "currentTunnel.type=='local'"
                }
              ],
              attrs: { label: "" }
            },
            [
              _vm._v("\n            (请求) ->\n            本机:"),
              _c("Input", {
                staticStyle: { width: "60px" },
                model: {
                  value: _vm.currentTunnel.inPort,
                  callback: function($$v) {
                    _vm.$set(_vm.currentTunnel, "inPort", $$v)
                  },
                  expression: "currentTunnel.inPort"
                }
              }),
              _vm._v(
                "\n            ==隧道==>\n            代理服务器\n            ->\n            "
              ),
              _c("Input", {
                staticStyle: { width: "120px" },
                model: {
                  value: _vm.currentTunnel.targetHost,
                  callback: function($$v) {
                    _vm.$set(_vm.currentTunnel, "targetHost", $$v)
                  },
                  expression: "currentTunnel.targetHost"
                }
              }),
              _vm._v(" "),
              _c("Input", {
                staticStyle: { width: "60px" },
                model: {
                  value: _vm.currentTunnel.targetPort,
                  callback: function($$v) {
                    _vm.$set(_vm.currentTunnel, "targetPort", $$v)
                  },
                  expression: "currentTunnel.targetPort"
                }
              })
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "Row",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.currentTunnel.type == "remote",
                  expression: "currentTunnel.type=='remote'"
                }
              ],
              attrs: { label: "" }
            },
            [
              _vm._v("\n            (请求) ->\n            本机:"),
              _c("Input", {
                staticStyle: { width: "60px" },
                model: {
                  value: _vm.currentTunnel.inPort,
                  callback: function($$v) {
                    _vm.$set(_vm.currentTunnel, "inPort", $$v)
                  },
                  expression: "currentTunnel.inPort"
                }
              }),
              _vm._v(
                "\n            ==隧道==>\n            代理服务器\n            -> 目标服务器\n        "
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "Row",
            [
              _vm._v("\n            启动时自动连接:\n            "),
              _c(
                "i-switch",
                {
                  model: {
                    value: _vm.currentTunnel.connectOnStart,
                    callback: function($$v) {
                      _vm.$set(_vm.currentTunnel, "connectOnStart", $$v)
                    },
                    expression: "currentTunnel.connectOnStart"
                  }
                },
                [
                  _c("Icon", {
                    attrs: { slot: "open", type: "android-done" },
                    slot: "open"
                  }),
                  _vm._v(" "),
                  _c("Icon", {
                    attrs: { slot: "close", type: "android-close" },
                    slot: "close"
                  })
                ],
                1
              )
            ],
            1
          ),
          _vm._v(" "),
          _c(
            "Row",
            [
              _vm._v("\n            断开后尝试自动重连:\n            "),
              _c(
                "i-switch",
                {
                  model: {
                    value: _vm.currentTunnel.autoReconnect,
                    callback: function($$v) {
                      _vm.$set(_vm.currentTunnel, "autoReconnect", $$v)
                    },
                    expression: "currentTunnel.autoReconnect"
                  }
                },
                [
                  _c("Icon", {
                    attrs: { slot: "open", type: "android-done" },
                    slot: "open"
                  }),
                  _vm._v(" "),
                  _c("Icon", {
                    attrs: { slot: "close", type: "android-close" },
                    slot: "close"
                  })
                ],
                1
              )
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
    require("vue-loader/node_modules/vue-hot-reload-api")      .rerender("data-v-be2a318c", esExports)
  }
}

/***/ }),
/* 13 */,
/* 14 */,
/* 15 */
/***/ (function(module, exports, __webpack_require__) {


var consoleerror = console.error;
console.error = function (msg) {
    if (msg && msg.match && msg.match("Component names can only contain alphanumeric characters and the hyphen, and must start with a letter")) {
        return;
    }
    return consoleerror.apply(console, arguments);
};
const Vue = __webpack_require__(1);
Vue.component('mainwnd.settings', __webpack_require__(2).default);
Vue.component('mainwnd.settings.server-tunnel', __webpack_require__(5).default);
__webpack_require__(16);

/***/ }),
/* 16 */
/***/ (function(module, exports) {



/***/ })
/******/ ]);