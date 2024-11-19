if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global2 = uni.requireGlobal();
  ArrayBuffer = global2.ArrayBuffer;
  Int8Array = global2.Int8Array;
  Uint8Array = global2.Uint8Array;
  Uint8ClampedArray = global2.Uint8ClampedArray;
  Int16Array = global2.Int16Array;
  Uint16Array = global2.Uint16Array;
  Int32Array = global2.Int32Array;
  Uint32Array = global2.Uint32Array;
  Float32Array = global2.Float32Array;
  Float64Array = global2.Float64Array;
  BigInt64Array = global2.BigInt64Array;
  BigUint64Array = global2.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const _imports_1$4 = "/static/icon/X.png";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$Q = {
    data() {
      return {
        statusBarHeight: 0
      };
    },
    onLoad: function() {
      const systemInfo = uni.getSystemInfoSync();
      this.statusBarHeight = systemInfo.statusBarHeight;
    },
    methods: {
      goToLogin() {
        uni.navigateTo({
          url: "/pages/login/camouflageLogin/inputAccount/inputAccount"
        });
      },
      goToFingerLogin() {
        uni.navigateTo({
          url: "/pages/fingerLogin/fingerLogin"
        });
      },
      goToRegister() {
        uni.navigateTo({
          url: "/pages/register/register"
        });
      }
    }
  };
  function _sfc_render$P(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "camouflagePage" }, [
      vue.createElementVNode("view", { class: "statusBar" }),
      vue.createElementVNode("view", { class: "camouflageLayout" }, [
        vue.createCommentVNode(" 推特logo "),
        vue.createElementVNode("view", { style: { "text-align": "center", "margin-top": "10px" } }, [
          vue.createElementVNode("image", {
            src: _imports_1$4,
            style: { "width": "25px", "height": "25px" }
          })
        ]),
        vue.createElementVNode("view", { style: { "margin-top": "250px", "text-align": "left" } }, [
          vue.createElementVNode("text", { style: { "letter-spacing": "3px", "font-size": "5ch", "font-family": "fantasy", "font-weight": "550", "width": "75%" } }, "查看世界各地的新鲜事。")
        ]),
        vue.createElementVNode("view", { class: "createAccount" }, [
          vue.createElementVNode("button", {
            onClick: _cache[0] || (_cache[0] = (...args) => $options.goToRegister && $options.goToRegister(...args)),
            type: "primary",
            style: { "border-radius": "20px", "background": "#1d9bf0" }
          }, "创建账号")
        ])
      ]),
      vue.createElementVNode("view", { class: "camouflageFooter" }, [
        vue.createElementVNode("view", null, [
          vue.createElementVNode("text", null, "已经有账号了？"),
          vue.createElementVNode("text", {
            onClick: _cache[1] || (_cache[1] = (...args) => $options.goToLogin && $options.goToLogin(...args)),
            style: { "color": "#1d9bf0" }
          }, "登录")
        ]),
        vue.createElementVNode("view", null, [
          vue.createElementVNode("text", {
            onClick: _cache[2] || (_cache[2] = (...args) => $options.goToFingerLogin && $options.goToFingerLogin(...args)),
            style: { "color": "#1d9bf0" }
          }, "指纹登录")
        ])
      ])
    ]);
  }
  const PagesLoginCamouflageLoginCamouflageLogin = /* @__PURE__ */ _export_sfc(_sfc_main$Q, [["render", _sfc_render$P], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/login/camouflageLogin/camouflageLogin.vue"]]);
  const ON_SHOW = "onShow";
  function requireNativePlugin(name) {
    return weex.requireModule(name);
  }
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  const createHook = (lifecycle) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onShow = /* @__PURE__ */ createHook(ON_SHOW);
  const backendHost = "http://139.196.11.210:8500/communicate";
  const BASE_URL = backendHost;
  const timeout = 5e3;
  const request = (params) => {
    let url = params.url;
    let method = params.method || "get";
    let data = params.data || {};
    let header = {
      "Content-Type": "application/json;charset=UTF-8",
      "Authorization": "Bearer " + uni.getStorageSync("token"),
      ...params.header
    };
    return new Promise((resolve, reject) => {
      uni.request({
        url: BASE_URL + url,
        method,
        header,
        data,
        timeout,
        success(response) {
          const res = response;
          if (res.statusCode == 200) {
            resolve(res.data);
          } else {
            switch (res.statusCode) {
              case 404:
                uni.showToast({
                  title: "请求地址不存在...",
                  duration: 2e3
                });
                break;
              default:
                uni.showToast({
                  title: "请重试...",
                  duration: 2e3
                });
                break;
            }
          }
        },
        fail(err) {
          formatAppLog("log", "at utils/request.js:57", err);
          if (err.errMsg.indexOf("request:fail") !== -1) {
            uni.showToast({
              title: "网络异常",
              icon: "error",
              duration: 2e3
            });
          } else {
            uni.showToast({
              title: "未知异常",
              duration: 2e3
            });
          }
          reject(err);
        },
        complete() {
          uni.hideLoading();
          uni.hideToast();
        }
      });
    }).catch(() => {
    });
  };
  const login = (params) => {
    const data = {
      account: params.account,
      password: params.password
    };
    return request({
      // url: `/user/login?account=${params.account}&password=${params.password}`,
      url: `/user/login`,
      method: "post",
      header: {
        "Authorization": ""
      },
      data
    });
  };
  const register = (params) => {
    return request({
      url: "/user/register",
      method: "post",
      data: params
    });
  };
  const logout = (params) => {
    return request({
      url: "/user/logout",
      method: "post"
    });
  };
  const searchUser = (id) => {
    return request({
      url: `/user/search/${id}`,
      method: "get"
    });
  };
  var isVue2 = false;
  function set(target, key, val) {
    if (Array.isArray(target)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val;
    }
    target[key] = val;
    return val;
  }
  function del(target, key) {
    if (Array.isArray(target)) {
      target.splice(key, 1);
      return;
    }
    delete target[key];
  }
  function getDevtoolsGlobalHook() {
    return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
  }
  function getTarget() {
    return typeof navigator !== "undefined" && typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
  }
  const isProxyAvailable = typeof Proxy === "function";
  const HOOK_SETUP = "devtools-plugin:setup";
  const HOOK_PLUGIN_SETTINGS_SET = "plugin:settings:set";
  let supported;
  let perf;
  function isPerformanceSupported() {
    var _a;
    if (supported !== void 0) {
      return supported;
    }
    if (typeof window !== "undefined" && window.performance) {
      supported = true;
      perf = window.performance;
    } else if (typeof global !== "undefined" && ((_a = global.perf_hooks) === null || _a === void 0 ? void 0 : _a.performance)) {
      supported = true;
      perf = global.perf_hooks.performance;
    } else {
      supported = false;
    }
    return supported;
  }
  function now() {
    return isPerformanceSupported() ? perf.now() : Date.now();
  }
  class ApiProxy {
    constructor(plugin, hook) {
      this.target = null;
      this.targetQueue = [];
      this.onQueue = [];
      this.plugin = plugin;
      this.hook = hook;
      const defaultSettings = {};
      if (plugin.settings) {
        for (const id in plugin.settings) {
          const item = plugin.settings[id];
          defaultSettings[id] = item.defaultValue;
        }
      }
      const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
      let currentSettings = Object.assign({}, defaultSettings);
      try {
        const raw = localStorage.getItem(localSettingsSaveId);
        const data = JSON.parse(raw);
        Object.assign(currentSettings, data);
      } catch (e2) {
      }
      this.fallbacks = {
        getSettings() {
          return currentSettings;
        },
        setSettings(value) {
          try {
            localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
          } catch (e2) {
          }
          currentSettings = value;
        },
        now() {
          return now();
        }
      };
      if (hook) {
        hook.on(HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
          if (pluginId === this.plugin.id) {
            this.fallbacks.setSettings(value);
          }
        });
      }
      this.proxiedOn = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target.on[prop];
          } else {
            return (...args) => {
              this.onQueue.push({
                method: prop,
                args
              });
            };
          }
        }
      });
      this.proxiedTarget = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target[prop];
          } else if (prop === "on") {
            return this.proxiedOn;
          } else if (Object.keys(this.fallbacks).includes(prop)) {
            return (...args) => {
              this.targetQueue.push({
                method: prop,
                args,
                resolve: () => {
                }
              });
              return this.fallbacks[prop](...args);
            };
          } else {
            return (...args) => {
              return new Promise((resolve) => {
                this.targetQueue.push({
                  method: prop,
                  args,
                  resolve
                });
              });
            };
          }
        }
      });
    }
    async setRealTarget(target) {
      this.target = target;
      for (const item of this.onQueue) {
        this.target.on[item.method](...item.args);
      }
      for (const item of this.targetQueue) {
        item.resolve(await this.target[item.method](...item.args));
      }
    }
  }
  function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
    const descriptor = pluginDescriptor;
    const target = getTarget();
    const hook = getDevtoolsGlobalHook();
    const enableProxy = isProxyAvailable && descriptor.enableEarlyProxy;
    if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
      hook.emit(HOOK_SETUP, pluginDescriptor, setupFn);
    } else {
      const proxy = enableProxy ? new ApiProxy(descriptor, hook) : null;
      const list = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
      list.push({
        pluginDescriptor: descriptor,
        setupFn,
        proxy
      });
      if (proxy)
        setupFn(proxy.proxiedTarget);
    }
  }
  /*!
   * pinia v2.1.7
   * (c) 2023 Eduardo San Martin Morote
   * @license MIT
   */
  let activePinia;
  const setActivePinia = (pinia) => activePinia = pinia;
  const piniaSymbol = Symbol("pinia");
  function isPlainObject(o2) {
    return o2 && typeof o2 === "object" && Object.prototype.toString.call(o2) === "[object Object]" && typeof o2.toJSON !== "function";
  }
  var MutationType;
  (function(MutationType2) {
    MutationType2["direct"] = "direct";
    MutationType2["patchObject"] = "patch object";
    MutationType2["patchFunction"] = "patch function";
  })(MutationType || (MutationType = {}));
  const IS_CLIENT = typeof window !== "undefined";
  const USE_DEVTOOLS = IS_CLIENT;
  const _global = /* @__PURE__ */ (() => typeof window === "object" && window.window === window ? window : typeof self === "object" && self.self === self ? self : typeof global === "object" && global.global === global ? global : typeof globalThis === "object" ? globalThis : { HTMLElement: null })();
  function bom(blob, { autoBom = false } = {}) {
    if (autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
      return new Blob([String.fromCharCode(65279), blob], { type: blob.type });
    }
    return blob;
  }
  function download(url, name, opts) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.onload = function() {
      saveAs(xhr.response, name, opts);
    };
    xhr.onerror = function() {
      console.error("could not download file");
    };
    xhr.send();
  }
  function corsEnabled(url) {
    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, false);
    try {
      xhr.send();
    } catch (e2) {
    }
    return xhr.status >= 200 && xhr.status <= 299;
  }
  function click(node) {
    try {
      node.dispatchEvent(new MouseEvent("click"));
    } catch (e2) {
      const evt = document.createEvent("MouseEvents");
      evt.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
      node.dispatchEvent(evt);
    }
  }
  const _navigator = typeof navigator === "object" ? navigator : { userAgent: "" };
  const isMacOSWebView = /* @__PURE__ */ (() => /Macintosh/.test(_navigator.userAgent) && /AppleWebKit/.test(_navigator.userAgent) && !/Safari/.test(_navigator.userAgent))();
  const saveAs = !IS_CLIENT ? () => {
  } : (
    // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView or mini program
    typeof HTMLAnchorElement !== "undefined" && "download" in HTMLAnchorElement.prototype && !isMacOSWebView ? downloadSaveAs : (
      // Use msSaveOrOpenBlob as a second approach
      "msSaveOrOpenBlob" in _navigator ? msSaveAs : (
        // Fallback to using FileReader and a popup
        fileSaverSaveAs
      )
    )
  );
  function downloadSaveAs(blob, name = "download", opts) {
    const a2 = document.createElement("a");
    a2.download = name;
    a2.rel = "noopener";
    if (typeof blob === "string") {
      a2.href = blob;
      if (a2.origin !== location.origin) {
        if (corsEnabled(a2.href)) {
          download(blob, name, opts);
        } else {
          a2.target = "_blank";
          click(a2);
        }
      } else {
        click(a2);
      }
    } else {
      a2.href = URL.createObjectURL(blob);
      setTimeout(function() {
        URL.revokeObjectURL(a2.href);
      }, 4e4);
      setTimeout(function() {
        click(a2);
      }, 0);
    }
  }
  function msSaveAs(blob, name = "download", opts) {
    if (typeof blob === "string") {
      if (corsEnabled(blob)) {
        download(blob, name, opts);
      } else {
        const a2 = document.createElement("a");
        a2.href = blob;
        a2.target = "_blank";
        setTimeout(function() {
          click(a2);
        });
      }
    } else {
      navigator.msSaveOrOpenBlob(bom(blob, opts), name);
    }
  }
  function fileSaverSaveAs(blob, name, opts, popup) {
    popup = popup || open("", "_blank");
    if (popup) {
      popup.document.title = popup.document.body.innerText = "downloading...";
    }
    if (typeof blob === "string")
      return download(blob, name, opts);
    const force = blob.type === "application/octet-stream";
    const isSafari = /constructor/i.test(String(_global.HTMLElement)) || "safari" in _global;
    const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);
    if ((isChromeIOS || force && isSafari || isMacOSWebView) && typeof FileReader !== "undefined") {
      const reader = new FileReader();
      reader.onloadend = function() {
        let url = reader.result;
        if (typeof url !== "string") {
          popup = null;
          throw new Error("Wrong reader.result type");
        }
        url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, "data:attachment/file;");
        if (popup) {
          popup.location.href = url;
        } else {
          location.assign(url);
        }
        popup = null;
      };
      reader.readAsDataURL(blob);
    } else {
      const url = URL.createObjectURL(blob);
      if (popup)
        popup.location.assign(url);
      else
        location.href = url;
      popup = null;
      setTimeout(function() {
        URL.revokeObjectURL(url);
      }, 4e4);
    }
  }
  function toastMessage(message, type) {
    const piniaMessage = "🍍 " + message;
    if (typeof __VUE_DEVTOOLS_TOAST__ === "function") {
      __VUE_DEVTOOLS_TOAST__(piniaMessage, type);
    } else if (type === "error") {
      console.error(piniaMessage);
    } else if (type === "warn") {
      console.warn(piniaMessage);
    } else {
      console.log(piniaMessage);
    }
  }
  function isPinia(o2) {
    return "_a" in o2 && "install" in o2;
  }
  function checkClipboardAccess() {
    if (!("clipboard" in navigator)) {
      toastMessage(`Your browser doesn't support the Clipboard API`, "error");
      return true;
    }
  }
  function checkNotFocusedError(error) {
    if (error instanceof Error && error.message.toLowerCase().includes("document is not focused")) {
      toastMessage('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn");
      return true;
    }
    return false;
  }
  async function actionGlobalCopyState(pinia) {
    if (checkClipboardAccess())
      return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(pinia.state.value));
      toastMessage("Global state copied to clipboard.");
    } catch (error) {
      if (checkNotFocusedError(error))
        return;
      toastMessage(`Failed to serialize the state. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  async function actionGlobalPasteState(pinia) {
    if (checkClipboardAccess())
      return;
    try {
      loadStoresState(pinia, JSON.parse(await navigator.clipboard.readText()));
      toastMessage("Global state pasted from clipboard.");
    } catch (error) {
      if (checkNotFocusedError(error))
        return;
      toastMessage(`Failed to deserialize the state from clipboard. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  async function actionGlobalSaveState(pinia) {
    try {
      saveAs(new Blob([JSON.stringify(pinia.state.value)], {
        type: "text/plain;charset=utf-8"
      }), "pinia-state.json");
    } catch (error) {
      toastMessage(`Failed to export the state as JSON. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  let fileInput;
  function getFileOpener() {
    if (!fileInput) {
      fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".json";
    }
    function openFile() {
      return new Promise((resolve, reject) => {
        fileInput.onchange = async () => {
          const files = fileInput.files;
          if (!files)
            return resolve(null);
          const file = files.item(0);
          if (!file)
            return resolve(null);
          return resolve({ text: await file.text(), file });
        };
        fileInput.oncancel = () => resolve(null);
        fileInput.onerror = reject;
        fileInput.click();
      });
    }
    return openFile;
  }
  async function actionGlobalOpenStateFile(pinia) {
    try {
      const open2 = getFileOpener();
      const result = await open2();
      if (!result)
        return;
      const { text, file } = result;
      loadStoresState(pinia, JSON.parse(text));
      toastMessage(`Global state imported from "${file.name}".`);
    } catch (error) {
      toastMessage(`Failed to import the state from JSON. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  function loadStoresState(pinia, state) {
    for (const key in state) {
      const storeState = pinia.state.value[key];
      if (storeState) {
        Object.assign(storeState, state[key]);
      } else {
        pinia.state.value[key] = state[key];
      }
    }
  }
  function formatDisplay(display) {
    return {
      _custom: {
        display
      }
    };
  }
  const PINIA_ROOT_LABEL = "🍍 Pinia (root)";
  const PINIA_ROOT_ID = "_root";
  function formatStoreForInspectorTree(store) {
    return isPinia(store) ? {
      id: PINIA_ROOT_ID,
      label: PINIA_ROOT_LABEL
    } : {
      id: store.$id,
      label: store.$id
    };
  }
  function formatStoreForInspectorState(store) {
    if (isPinia(store)) {
      const storeNames = Array.from(store._s.keys());
      const storeMap = store._s;
      const state2 = {
        state: storeNames.map((storeId) => ({
          editable: true,
          key: storeId,
          value: store.state.value[storeId]
        })),
        getters: storeNames.filter((id) => storeMap.get(id)._getters).map((id) => {
          const store2 = storeMap.get(id);
          return {
            editable: false,
            key: id,
            value: store2._getters.reduce((getters, key) => {
              getters[key] = store2[key];
              return getters;
            }, {})
          };
        })
      };
      return state2;
    }
    const state = {
      state: Object.keys(store.$state).map((key) => ({
        editable: true,
        key,
        value: store.$state[key]
      }))
    };
    if (store._getters && store._getters.length) {
      state.getters = store._getters.map((getterName) => ({
        editable: false,
        key: getterName,
        value: store[getterName]
      }));
    }
    if (store._customProperties.size) {
      state.customProperties = Array.from(store._customProperties).map((key) => ({
        editable: true,
        key,
        value: store[key]
      }));
    }
    return state;
  }
  function formatEventData(events) {
    if (!events)
      return {};
    if (Array.isArray(events)) {
      return events.reduce((data, event2) => {
        data.keys.push(event2.key);
        data.operations.push(event2.type);
        data.oldValue[event2.key] = event2.oldValue;
        data.newValue[event2.key] = event2.newValue;
        return data;
      }, {
        oldValue: {},
        keys: [],
        operations: [],
        newValue: {}
      });
    } else {
      return {
        operation: formatDisplay(events.type),
        key: formatDisplay(events.key),
        oldValue: events.oldValue,
        newValue: events.newValue
      };
    }
  }
  function formatMutationType(type) {
    switch (type) {
      case MutationType.direct:
        return "mutation";
      case MutationType.patchFunction:
        return "$patch";
      case MutationType.patchObject:
        return "$patch";
      default:
        return "unknown";
    }
  }
  let isTimelineActive = true;
  const componentStateTypes = [];
  const MUTATIONS_LAYER_ID = "pinia:mutations";
  const INSPECTOR_ID = "pinia";
  const { assign: assign$1 } = Object;
  const getStoreType = (id) => "🍍 " + id;
  function registerPiniaDevtools(app, pinia) {
    setupDevtoolsPlugin({
      id: "dev.esm.pinia",
      label: "Pinia 🍍",
      logo: "https://pinia.vuejs.org/logo.svg",
      packageName: "pinia",
      homepage: "https://pinia.vuejs.org",
      componentStateTypes,
      app
    }, (api) => {
      if (typeof api.now !== "function") {
        toastMessage("You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html.");
      }
      api.addTimelineLayer({
        id: MUTATIONS_LAYER_ID,
        label: `Pinia 🍍`,
        color: 15064968
      });
      api.addInspector({
        id: INSPECTOR_ID,
        label: "Pinia 🍍",
        icon: "storage",
        treeFilterPlaceholder: "Search stores",
        actions: [
          {
            icon: "content_copy",
            action: () => {
              actionGlobalCopyState(pinia);
            },
            tooltip: "Serialize and copy the state"
          },
          {
            icon: "content_paste",
            action: async () => {
              await actionGlobalPasteState(pinia);
              api.sendInspectorTree(INSPECTOR_ID);
              api.sendInspectorState(INSPECTOR_ID);
            },
            tooltip: "Replace the state with the content of your clipboard"
          },
          {
            icon: "save",
            action: () => {
              actionGlobalSaveState(pinia);
            },
            tooltip: "Save the state as a JSON file"
          },
          {
            icon: "folder_open",
            action: async () => {
              await actionGlobalOpenStateFile(pinia);
              api.sendInspectorTree(INSPECTOR_ID);
              api.sendInspectorState(INSPECTOR_ID);
            },
            tooltip: "Import the state from a JSON file"
          }
        ],
        nodeActions: [
          {
            icon: "restore",
            tooltip: 'Reset the state (with "$reset")',
            action: (nodeId) => {
              const store = pinia._s.get(nodeId);
              if (!store) {
                toastMessage(`Cannot reset "${nodeId}" store because it wasn't found.`, "warn");
              } else if (typeof store.$reset !== "function") {
                toastMessage(`Cannot reset "${nodeId}" store because it doesn't have a "$reset" method implemented.`, "warn");
              } else {
                store.$reset();
                toastMessage(`Store "${nodeId}" reset.`);
              }
            }
          }
        ]
      });
      api.on.inspectComponent((payload, ctx) => {
        const proxy = payload.componentInstance && payload.componentInstance.proxy;
        if (proxy && proxy._pStores) {
          const piniaStores = payload.componentInstance.proxy._pStores;
          Object.values(piniaStores).forEach((store) => {
            payload.instanceData.state.push({
              type: getStoreType(store.$id),
              key: "state",
              editable: true,
              value: store._isOptionsAPI ? {
                _custom: {
                  value: vue.toRaw(store.$state),
                  actions: [
                    {
                      icon: "restore",
                      tooltip: "Reset the state of this store",
                      action: () => store.$reset()
                    }
                  ]
                }
              } : (
                // NOTE: workaround to unwrap transferred refs
                Object.keys(store.$state).reduce((state, key) => {
                  state[key] = store.$state[key];
                  return state;
                }, {})
              )
            });
            if (store._getters && store._getters.length) {
              payload.instanceData.state.push({
                type: getStoreType(store.$id),
                key: "getters",
                editable: false,
                value: store._getters.reduce((getters, key) => {
                  try {
                    getters[key] = store[key];
                  } catch (error) {
                    getters[key] = error;
                  }
                  return getters;
                }, {})
              });
            }
          });
        }
      });
      api.on.getInspectorTree((payload) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          let stores = [pinia];
          stores = stores.concat(Array.from(pinia._s.values()));
          payload.rootNodes = (payload.filter ? stores.filter((store) => "$id" in store ? store.$id.toLowerCase().includes(payload.filter.toLowerCase()) : PINIA_ROOT_LABEL.toLowerCase().includes(payload.filter.toLowerCase())) : stores).map(formatStoreForInspectorTree);
        }
      });
      api.on.getInspectorState((payload) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia : pinia._s.get(payload.nodeId);
          if (!inspectedStore) {
            return;
          }
          if (inspectedStore) {
            payload.state = formatStoreForInspectorState(inspectedStore);
          }
        }
      });
      api.on.editInspectorState((payload, ctx) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia : pinia._s.get(payload.nodeId);
          if (!inspectedStore) {
            return toastMessage(`store "${payload.nodeId}" not found`, "error");
          }
          const { path } = payload;
          if (!isPinia(inspectedStore)) {
            if (path.length !== 1 || !inspectedStore._customProperties.has(path[0]) || path[0] in inspectedStore.$state) {
              path.unshift("$state");
            }
          } else {
            path.unshift("state");
          }
          isTimelineActive = false;
          payload.set(inspectedStore, path, payload.state.value);
          isTimelineActive = true;
        }
      });
      api.on.editComponentState((payload) => {
        if (payload.type.startsWith("🍍")) {
          const storeId = payload.type.replace(/^🍍\s*/, "");
          const store = pinia._s.get(storeId);
          if (!store) {
            return toastMessage(`store "${storeId}" not found`, "error");
          }
          const { path } = payload;
          if (path[0] !== "state") {
            return toastMessage(`Invalid path for store "${storeId}":
${path}
Only state can be modified.`);
          }
          path[0] = "$state";
          isTimelineActive = false;
          payload.set(store, path, payload.state.value);
          isTimelineActive = true;
        }
      });
    });
  }
  function addStoreToDevtools(app, store) {
    if (!componentStateTypes.includes(getStoreType(store.$id))) {
      componentStateTypes.push(getStoreType(store.$id));
    }
    setupDevtoolsPlugin({
      id: "dev.esm.pinia",
      label: "Pinia 🍍",
      logo: "https://pinia.vuejs.org/logo.svg",
      packageName: "pinia",
      homepage: "https://pinia.vuejs.org",
      componentStateTypes,
      app,
      settings: {
        logStoreChanges: {
          label: "Notify about new/deleted stores",
          type: "boolean",
          defaultValue: true
        }
        // useEmojis: {
        //   label: 'Use emojis in messages ⚡️',
        //   type: 'boolean',
        //   defaultValue: true,
        // },
      }
    }, (api) => {
      const now2 = typeof api.now === "function" ? api.now.bind(api) : Date.now;
      store.$onAction(({ after, onError, name, args }) => {
        const groupId = runningActionId++;
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now2(),
            title: "🛫 " + name,
            subtitle: "start",
            data: {
              store: formatDisplay(store.$id),
              action: formatDisplay(name),
              args
            },
            groupId
          }
        });
        after((result) => {
          activeAction = void 0;
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: now2(),
              title: "🛬 " + name,
              subtitle: "end",
              data: {
                store: formatDisplay(store.$id),
                action: formatDisplay(name),
                args,
                result
              },
              groupId
            }
          });
        });
        onError((error) => {
          activeAction = void 0;
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: now2(),
              logType: "error",
              title: "💥 " + name,
              subtitle: "end",
              data: {
                store: formatDisplay(store.$id),
                action: formatDisplay(name),
                args,
                error
              },
              groupId
            }
          });
        });
      }, true);
      store._customProperties.forEach((name) => {
        vue.watch(() => vue.unref(store[name]), (newValue, oldValue) => {
          api.notifyComponentUpdate();
          api.sendInspectorState(INSPECTOR_ID);
          if (isTimelineActive) {
            api.addTimelineEvent({
              layerId: MUTATIONS_LAYER_ID,
              event: {
                time: now2(),
                title: "Change",
                subtitle: name,
                data: {
                  newValue,
                  oldValue
                },
                groupId: activeAction
              }
            });
          }
        }, { deep: true });
      });
      store.$subscribe(({ events, type }, state) => {
        api.notifyComponentUpdate();
        api.sendInspectorState(INSPECTOR_ID);
        if (!isTimelineActive)
          return;
        const eventData = {
          time: now2(),
          title: formatMutationType(type),
          data: assign$1({ store: formatDisplay(store.$id) }, formatEventData(events)),
          groupId: activeAction
        };
        if (type === MutationType.patchFunction) {
          eventData.subtitle = "⤵️";
        } else if (type === MutationType.patchObject) {
          eventData.subtitle = "🧩";
        } else if (events && !Array.isArray(events)) {
          eventData.subtitle = events.type;
        }
        if (events) {
          eventData.data["rawEvent(s)"] = {
            _custom: {
              display: "DebuggerEvent",
              type: "object",
              tooltip: "raw DebuggerEvent[]",
              value: events
            }
          };
        }
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: eventData
        });
      }, { detached: true, flush: "sync" });
      const hotUpdate = store._hotUpdate;
      store._hotUpdate = vue.markRaw((newStore) => {
        hotUpdate(newStore);
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now2(),
            title: "🔥 " + store.$id,
            subtitle: "HMR update",
            data: {
              store: formatDisplay(store.$id),
              info: formatDisplay(`HMR update`)
            }
          }
        });
        api.notifyComponentUpdate();
        api.sendInspectorTree(INSPECTOR_ID);
        api.sendInspectorState(INSPECTOR_ID);
      });
      const { $dispose } = store;
      store.$dispose = () => {
        $dispose();
        api.notifyComponentUpdate();
        api.sendInspectorTree(INSPECTOR_ID);
        api.sendInspectorState(INSPECTOR_ID);
        api.getSettings().logStoreChanges && toastMessage(`Disposed "${store.$id}" store 🗑`);
      };
      api.notifyComponentUpdate();
      api.sendInspectorTree(INSPECTOR_ID);
      api.sendInspectorState(INSPECTOR_ID);
      api.getSettings().logStoreChanges && toastMessage(`"${store.$id}" store installed 🆕`);
    });
  }
  let runningActionId = 0;
  let activeAction;
  function patchActionForGrouping(store, actionNames, wrapWithProxy) {
    const actions = actionNames.reduce((storeActions, actionName) => {
      storeActions[actionName] = vue.toRaw(store)[actionName];
      return storeActions;
    }, {});
    for (const actionName in actions) {
      store[actionName] = function() {
        const _actionId = runningActionId;
        const trackedStore = wrapWithProxy ? new Proxy(store, {
          get(...args) {
            activeAction = _actionId;
            return Reflect.get(...args);
          },
          set(...args) {
            activeAction = _actionId;
            return Reflect.set(...args);
          }
        }) : store;
        activeAction = _actionId;
        const retValue = actions[actionName].apply(trackedStore, arguments);
        activeAction = void 0;
        return retValue;
      };
    }
  }
  function devtoolsPlugin({ app, store, options }) {
    if (store.$id.startsWith("__hot:")) {
      return;
    }
    store._isOptionsAPI = !!options.state;
    patchActionForGrouping(store, Object.keys(options.actions), store._isOptionsAPI);
    const originalHotUpdate = store._hotUpdate;
    vue.toRaw(store)._hotUpdate = function(newStore) {
      originalHotUpdate.apply(this, arguments);
      patchActionForGrouping(store, Object.keys(newStore._hmrPayload.actions), !!store._isOptionsAPI);
    };
    addStoreToDevtools(
      app,
      // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
      store
    );
  }
  function createPinia() {
    const scope = vue.effectScope(true);
    const state = scope.run(() => vue.ref({}));
    let _p = [];
    let toBeInstalled = [];
    const pinia = vue.markRaw({
      install(app) {
        setActivePinia(pinia);
        {
          pinia._a = app;
          app.provide(piniaSymbol, pinia);
          app.config.globalProperties.$pinia = pinia;
          if (USE_DEVTOOLS) {
            registerPiniaDevtools(app, pinia);
          }
          toBeInstalled.forEach((plugin) => _p.push(plugin));
          toBeInstalled = [];
        }
      },
      use(plugin) {
        if (!this._a && !isVue2) {
          toBeInstalled.push(plugin);
        } else {
          _p.push(plugin);
        }
        return this;
      },
      _p,
      // it's actually undefined here
      // @ts-expect-error
      _a: null,
      _e: scope,
      _s: /* @__PURE__ */ new Map(),
      state
    });
    if (USE_DEVTOOLS && typeof Proxy !== "undefined") {
      pinia.use(devtoolsPlugin);
    }
    return pinia;
  }
  function patchObject(newState, oldState) {
    for (const key in oldState) {
      const subPatch = oldState[key];
      if (!(key in newState)) {
        continue;
      }
      const targetValue = newState[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        newState[key] = patchObject(targetValue, subPatch);
      } else {
        {
          newState[key] = subPatch;
        }
      }
    }
    return newState;
  }
  const noop = () => {
  };
  function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
    subscriptions.push(callback);
    const removeSubscription = () => {
      const idx = subscriptions.indexOf(callback);
      if (idx > -1) {
        subscriptions.splice(idx, 1);
        onCleanup();
      }
    };
    if (!detached && vue.getCurrentScope()) {
      vue.onScopeDispose(removeSubscription);
    }
    return removeSubscription;
  }
  function triggerSubscriptions(subscriptions, ...args) {
    subscriptions.slice().forEach((callback) => {
      callback(...args);
    });
  }
  const fallbackRunWithContext = (fn) => fn();
  function mergeReactiveObjects(target, patchToApply) {
    if (target instanceof Map && patchToApply instanceof Map) {
      patchToApply.forEach((value, key) => target.set(key, value));
    }
    if (target instanceof Set && patchToApply instanceof Set) {
      patchToApply.forEach(target.add, target);
    }
    for (const key in patchToApply) {
      if (!patchToApply.hasOwnProperty(key))
        continue;
      const subPatch = patchToApply[key];
      const targetValue = target[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        target[key] = mergeReactiveObjects(targetValue, subPatch);
      } else {
        target[key] = subPatch;
      }
    }
    return target;
  }
  const skipHydrateSymbol = Symbol("pinia:skipHydration");
  function shouldHydrate(obj) {
    return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
  }
  const { assign } = Object;
  function isComputed(o2) {
    return !!(vue.isRef(o2) && o2.effect);
  }
  function createOptionsStore(id, options, pinia, hot) {
    const { state, actions, getters } = options;
    const initialState = pinia.state.value[id];
    let store;
    function setup() {
      if (!initialState && !hot) {
        {
          pinia.state.value[id] = state ? state() : {};
        }
      }
      const localState = hot ? (
        // use ref() to unwrap refs inside state TODO: check if this is still necessary
        vue.toRefs(vue.ref(state ? state() : {}).value)
      ) : vue.toRefs(pinia.state.value[id]);
      return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
        if (name in localState) {
          console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${name}" in store "${id}".`);
        }
        computedGetters[name] = vue.markRaw(vue.computed(() => {
          setActivePinia(pinia);
          const store2 = pinia._s.get(id);
          return getters[name].call(store2, store2);
        }));
        return computedGetters;
      }, {}));
    }
    store = createSetupStore(id, setup, options, pinia, hot, true);
    return store;
  }
  function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
    let scope;
    const optionsForPlugin = assign({ actions: {} }, options);
    if (!pinia._e.active) {
      throw new Error("Pinia destroyed");
    }
    const $subscribeOptions = {
      deep: true
      // flush: 'post',
    };
    {
      $subscribeOptions.onTrigger = (event2) => {
        if (isListening) {
          debuggerEvents = event2;
        } else if (isListening == false && !store._hotUpdating) {
          if (Array.isArray(debuggerEvents)) {
            debuggerEvents.push(event2);
          } else {
            console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug.");
          }
        }
      };
    }
    let isListening;
    let isSyncListening;
    let subscriptions = [];
    let actionSubscriptions = [];
    let debuggerEvents;
    const initialState = pinia.state.value[$id];
    if (!isOptionsStore && !initialState && !hot) {
      {
        pinia.state.value[$id] = {};
      }
    }
    const hotState = vue.ref({});
    let activeListener;
    function $patch(partialStateOrMutator) {
      let subscriptionMutation;
      isListening = isSyncListening = false;
      {
        debuggerEvents = [];
      }
      if (typeof partialStateOrMutator === "function") {
        partialStateOrMutator(pinia.state.value[$id]);
        subscriptionMutation = {
          type: MutationType.patchFunction,
          storeId: $id,
          events: debuggerEvents
        };
      } else {
        mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
        subscriptionMutation = {
          type: MutationType.patchObject,
          payload: partialStateOrMutator,
          storeId: $id,
          events: debuggerEvents
        };
      }
      const myListenerId = activeListener = Symbol();
      vue.nextTick().then(() => {
        if (activeListener === myListenerId) {
          isListening = true;
        }
      });
      isSyncListening = true;
      triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
    }
    const $reset = isOptionsStore ? function $reset2() {
      const { state } = options;
      const newState = state ? state() : {};
      this.$patch(($state) => {
        assign($state, newState);
      });
    } : (
      /* istanbul ignore next */
      () => {
        throw new Error(`🍍: Store "${$id}" is built using the setup syntax and does not implement $reset().`);
      }
    );
    function $dispose() {
      scope.stop();
      subscriptions = [];
      actionSubscriptions = [];
      pinia._s.delete($id);
    }
    function wrapAction(name, action) {
      return function() {
        setActivePinia(pinia);
        const args = Array.from(arguments);
        const afterCallbackList = [];
        const onErrorCallbackList = [];
        function after(callback) {
          afterCallbackList.push(callback);
        }
        function onError(callback) {
          onErrorCallbackList.push(callback);
        }
        triggerSubscriptions(actionSubscriptions, {
          args,
          name,
          store,
          after,
          onError
        });
        let ret;
        try {
          ret = action.apply(this && this.$id === $id ? this : store, args);
        } catch (error) {
          triggerSubscriptions(onErrorCallbackList, error);
          throw error;
        }
        if (ret instanceof Promise) {
          return ret.then((value) => {
            triggerSubscriptions(afterCallbackList, value);
            return value;
          }).catch((error) => {
            triggerSubscriptions(onErrorCallbackList, error);
            return Promise.reject(error);
          });
        }
        triggerSubscriptions(afterCallbackList, ret);
        return ret;
      };
    }
    const _hmrPayload = /* @__PURE__ */ vue.markRaw({
      actions: {},
      getters: {},
      state: [],
      hotState
    });
    const partialStore = {
      _p: pinia,
      // _s: scope,
      $id,
      $onAction: addSubscription.bind(null, actionSubscriptions),
      $patch,
      $reset,
      $subscribe(callback, options2 = {}) {
        const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
        const stopWatcher = scope.run(() => vue.watch(() => pinia.state.value[$id], (state) => {
          if (options2.flush === "sync" ? isSyncListening : isListening) {
            callback({
              storeId: $id,
              type: MutationType.direct,
              events: debuggerEvents
            }, state);
          }
        }, assign({}, $subscribeOptions, options2)));
        return removeSubscription;
      },
      $dispose
    };
    const store = vue.reactive(assign(
      {
        _hmrPayload,
        _customProperties: vue.markRaw(/* @__PURE__ */ new Set())
        // devtools custom properties
      },
      partialStore
      // must be added later
      // setupStore
    ));
    pinia._s.set($id, store);
    const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
    const setupStore = runWithContext(() => pinia._e.run(() => (scope = vue.effectScope()).run(setup)));
    for (const key in setupStore) {
      const prop = setupStore[key];
      if (vue.isRef(prop) && !isComputed(prop) || vue.isReactive(prop)) {
        if (hot) {
          set(hotState.value, key, vue.toRef(setupStore, key));
        } else if (!isOptionsStore) {
          if (initialState && shouldHydrate(prop)) {
            if (vue.isRef(prop)) {
              prop.value = initialState[key];
            } else {
              mergeReactiveObjects(prop, initialState[key]);
            }
          }
          {
            pinia.state.value[$id][key] = prop;
          }
        }
        {
          _hmrPayload.state.push(key);
        }
      } else if (typeof prop === "function") {
        const actionValue = hot ? prop : wrapAction(key, prop);
        {
          setupStore[key] = actionValue;
        }
        {
          _hmrPayload.actions[key] = prop;
        }
        optionsForPlugin.actions[key] = prop;
      } else {
        if (isComputed(prop)) {
          _hmrPayload.getters[key] = isOptionsStore ? (
            // @ts-expect-error
            options.getters[key]
          ) : prop;
          if (IS_CLIENT) {
            const getters = setupStore._getters || // @ts-expect-error: same
            (setupStore._getters = vue.markRaw([]));
            getters.push(key);
          }
        }
      }
    }
    {
      assign(store, setupStore);
      assign(vue.toRaw(store), setupStore);
    }
    Object.defineProperty(store, "$state", {
      get: () => hot ? hotState.value : pinia.state.value[$id],
      set: (state) => {
        if (hot) {
          throw new Error("cannot set hotState");
        }
        $patch(($state) => {
          assign($state, state);
        });
      }
    });
    {
      store._hotUpdate = vue.markRaw((newStore) => {
        store._hotUpdating = true;
        newStore._hmrPayload.state.forEach((stateKey) => {
          if (stateKey in store.$state) {
            const newStateTarget = newStore.$state[stateKey];
            const oldStateSource = store.$state[stateKey];
            if (typeof newStateTarget === "object" && isPlainObject(newStateTarget) && isPlainObject(oldStateSource)) {
              patchObject(newStateTarget, oldStateSource);
            } else {
              newStore.$state[stateKey] = oldStateSource;
            }
          }
          set(store, stateKey, vue.toRef(newStore.$state, stateKey));
        });
        Object.keys(store.$state).forEach((stateKey) => {
          if (!(stateKey in newStore.$state)) {
            del(store, stateKey);
          }
        });
        isListening = false;
        isSyncListening = false;
        pinia.state.value[$id] = vue.toRef(newStore._hmrPayload, "hotState");
        isSyncListening = true;
        vue.nextTick().then(() => {
          isListening = true;
        });
        for (const actionName in newStore._hmrPayload.actions) {
          const action = newStore[actionName];
          set(store, actionName, wrapAction(actionName, action));
        }
        for (const getterName in newStore._hmrPayload.getters) {
          const getter = newStore._hmrPayload.getters[getterName];
          const getterValue = isOptionsStore ? (
            // special handling of options api
            vue.computed(() => {
              setActivePinia(pinia);
              return getter.call(store, store);
            })
          ) : getter;
          set(store, getterName, getterValue);
        }
        Object.keys(store._hmrPayload.getters).forEach((key) => {
          if (!(key in newStore._hmrPayload.getters)) {
            del(store, key);
          }
        });
        Object.keys(store._hmrPayload.actions).forEach((key) => {
          if (!(key in newStore._hmrPayload.actions)) {
            del(store, key);
          }
        });
        store._hmrPayload = newStore._hmrPayload;
        store._getters = newStore._getters;
        store._hotUpdating = false;
      });
    }
    if (USE_DEVTOOLS) {
      const nonEnumerable = {
        writable: true,
        configurable: true,
        // avoid warning on devtools trying to display this property
        enumerable: false
      };
      ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((p2) => {
        Object.defineProperty(store, p2, assign({ value: store[p2] }, nonEnumerable));
      });
    }
    pinia._p.forEach((extender) => {
      if (USE_DEVTOOLS) {
        const extensions = scope.run(() => extender({
          store,
          app: pinia._a,
          pinia,
          options: optionsForPlugin
        }));
        Object.keys(extensions || {}).forEach((key) => store._customProperties.add(key));
        assign(store, extensions);
      } else {
        assign(store, scope.run(() => extender({
          store,
          app: pinia._a,
          pinia,
          options: optionsForPlugin
        })));
      }
    });
    if (store.$state && typeof store.$state === "object" && typeof store.$state.constructor === "function" && !store.$state.constructor.toString().includes("[native code]")) {
      console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${store.$id}".`);
    }
    if (initialState && isOptionsStore && options.hydrate) {
      options.hydrate(store.$state, initialState);
    }
    isListening = true;
    isSyncListening = true;
    return store;
  }
  function defineStore(idOrOptions, setup, setupOptions) {
    let id;
    let options;
    const isSetupStore = typeof setup === "function";
    if (typeof idOrOptions === "string") {
      id = idOrOptions;
      options = isSetupStore ? setupOptions : setup;
    } else {
      options = idOrOptions;
      id = idOrOptions.id;
      if (typeof id !== "string") {
        throw new Error(`[🍍]: "defineStore()" must be passed a store id as its first argument.`);
      }
    }
    function useStore(pinia, hot) {
      const hasContext = vue.hasInjectionContext();
      pinia = // in test mode, ignore the argument provided as we can always retrieve a
      // pinia instance with getActivePinia()
      pinia || (hasContext ? vue.inject(piniaSymbol, null) : null);
      if (pinia)
        setActivePinia(pinia);
      if (!activePinia) {
        throw new Error(`[🍍]: "getActivePinia()" was called but there was no active Pinia. Are you trying to use a store before calling "app.use(pinia)"?
See https://pinia.vuejs.org/core-concepts/outside-component-usage.html for help.
This will fail in production.`);
      }
      pinia = activePinia;
      if (!pinia._s.has(id)) {
        if (isSetupStore) {
          createSetupStore(id, setup, options, pinia);
        } else {
          createOptionsStore(id, options, pinia);
        }
        {
          useStore._pinia = pinia;
        }
      }
      const store = pinia._s.get(id);
      if (hot) {
        const hotId = "__hot:" + id;
        const newStore = isSetupStore ? createSetupStore(hotId, setup, options, pinia, true) : createOptionsStore(hotId, assign({}, options), pinia, true);
        hot._hotUpdate(newStore);
        delete pinia.state.value[hotId];
        pinia._s.delete(hotId);
      }
      if (IS_CLIENT) {
        const currentInstance = vue.getCurrentInstance();
        if (currentInstance && currentInstance.proxy && // avoid adding stores that are just built for hot module replacement
        !hot) {
          const vm = currentInstance.proxy;
          const cache = "_pStores" in vm ? vm._pStores : vm._pStores = {};
          cache[id] = store;
        }
      }
      return store;
    }
    useStore.$id = id;
    return useStore;
  }
  const useUserStore = defineStore("user", () => {
    const state = vue.reactive({
      id: "",
      account: "",
      name: "",
      department: "",
      role: "",
      phone: "",
      created: "",
      avatar: null,
      avatarUrl: "",
      token: "",
      status: ""
    });
    function setUserData(data) {
      formatAppLog("log", "at store/userStore.js:21", "Setting user data:", data);
      Object.keys(data).forEach((key) => {
        if (key in state) {
          state[key] = data[key];
        }
      });
      formatAppLog("log", "at store/userStore.js:27", "Updated state:", state);
    }
    function clearUserData() {
      Object.keys(state).forEach((key) => {
        state[key] = state[key] instanceof Object ? null : "";
      });
    }
    function getUserData() {
      return { ...state };
    }
    return { state, setUserData, clearUserData, getUserData };
  });
  const useWebSocket = () => {
    const isConnected = vue.ref(false);
    const reconnectAttempts = vue.ref(0);
    const maxReconnectAttempts = 5;
    const connect = (userId, token) => {
      formatAppLog("log", "at pages/WebSocket/WebSocketService.vue.vue:15", token, "tokentokentokentoken");
      if (!userId || !token) {
        formatAppLog("error", "at pages/WebSocket/WebSocketService.vue.vue:17", "WebSocket 连接失败: userId 或 token 未提供", { userId, token });
        return;
      }
      if (isConnected.value) {
        formatAppLog("log", "at pages/WebSocket/WebSocketService.vue.vue:22", "WebSocket 已经连接");
        return;
      }
      const wsProtocol = backendHost.startsWith("https") ? "wss" : "ws";
      const wsUrl = `${wsProtocol}://${backendHost.split("://")[1]}/chat/${userId}`;
      formatAppLog("log", "at pages/WebSocket/WebSocketService.vue.vue:29", "尝试连接 WebSocket:", wsUrl);
      uni.connectSocket({
        url: wsUrl,
        header: {
          "content-type": "application/json"
        },
        protocols: [token],
        success: () => {
          formatAppLog("log", "at pages/WebSocket/WebSocketService.vue.vue:38", "WebSocket 连接成功");
        },
        fail: (error) => {
          formatAppLog("error", "at pages/WebSocket/WebSocketService.vue.vue:41", "WebSocket 连接失败:", error);
        }
      });
      uni.onSocketOpen((res) => {
        formatAppLog("log", "at pages/WebSocket/WebSocketService.vue.vue:46", "WebSocket 已连接", res);
        isConnected.value = true;
        reconnectAttempts.value = 0;
        startPingInterval();
      });
      uni.onSocketMessage((res) => {
        formatAppLog("log", "at pages/WebSocket/WebSocketService.vue.vue:53", "收到消息:", res.data);
        try {
          const message = JSON.parse(res.data);
          switch (message.type) {
            case "auth":
              if (message.status === "success") {
                formatAppLog("log", "at pages/WebSocket/WebSocketService.vue.vue:60", "认证成功");
              } else {
                formatAppLog("error", "at pages/WebSocket/WebSocketService.vue.vue:62", "认证失败:", message.error);
                disconnect();
              }
              break;
            case "chat":
              break;
            case "notification":
              break;
            case "pong":
              formatAppLog("log", "at pages/WebSocket/WebSocketService.vue.vue:73", "收到服务器的 pong 响应");
              break;
            default:
              formatAppLog("log", "at pages/WebSocket/WebSocketService.vue.vue:76", "未知消息类型:", message.type);
          }
        } catch (error) {
          formatAppLog("error", "at pages/WebSocket/WebSocketService.vue.vue:79", "解析消息失败:", error);
        }
      });
      uni.onSocketError((res) => {
        formatAppLog("error", "at pages/WebSocket/WebSocketService.vue.vue:84", "WebSocket 错误:", res);
      });
      uni.onSocketClose((res) => {
        formatAppLog("log", "at pages/WebSocket/WebSocketService.vue.vue:88", "WebSocket 已断开", res);
        isConnected.value = false;
        stopPingInterval();
        if (reconnectAttempts.value < maxReconnectAttempts) {
          const delay = Math.min(1e3 * Math.pow(2, reconnectAttempts.value), 3e4);
          formatAppLog("log", "at pages/WebSocket/WebSocketService.vue.vue:94", `将在 ${delay}ms 后尝试重新连接...`);
          setTimeout(() => {
            formatAppLog("log", "at pages/WebSocket/WebSocketService.vue.vue:96", `尝试重新连接... (${reconnectAttempts.value + 1}/${maxReconnectAttempts})`);
            reconnectAttempts.value++;
            connect(userId, token);
          }, delay);
        } else {
          formatAppLog("error", "at pages/WebSocket/WebSocketService.vue.vue:101", "WebSocket 重连失败，请检查网络连接或联系管理员");
        }
      });
    };
    const disconnect = () => {
      if (isConnected.value) {
        uni.closeSocket({
          success: () => {
            formatAppLog("log", "at pages/WebSocket/WebSocketService.vue.vue:110", "WebSocket 已关闭");
            isConnected.value = false;
            reconnectAttempts.value = 0;
            stopPingInterval();
          }
        });
      }
    };
    const sendMessage = (message) => {
      if (isConnected.value) {
        uni.sendSocketMessage({
          data: JSON.stringify(message),
          success: () => {
            formatAppLog("log", "at pages/WebSocket/WebSocketService.vue.vue:124", "消息发送成功");
          },
          fail: (error) => {
            formatAppLog("error", "at pages/WebSocket/WebSocketService.vue.vue:127", "消息发送失败:", error);
          }
        });
      } else {
        formatAppLog("error", "at pages/WebSocket/WebSocketService.vue.vue:131", "WebSocket 未连接，无法发送消息");
      }
    };
    const ping = () => {
      sendMessage({ type: "ping" });
    };
    let pingInterval;
    const startPingInterval = () => {
      pingInterval = setInterval(() => {
        ping();
      }, 3e4);
    };
    const stopPingInterval = () => {
      if (pingInterval) {
        clearInterval(pingInterval);
      }
    };
    return {
      isConnected,
      connect,
      disconnect,
      sendMessage
    };
  };
  const _imports_0$a = "/static/icon/login.png";
  const _sfc_main$P = {
    __name: "login",
    setup(__props, { expose: __expose }) {
      __expose();
      const { connect } = useWebSocket();
      const userStore = useUserStore();
      const autoLogin = vue.ref(false);
      const username = vue.ref("test-app");
      const password = vue.ref("Test123456");
      const goToRegister = () => {
        uni.navigateTo({
          url: "/pages/register/register"
        });
      };
      const goToForgetPassword = () => {
        uni.navigateTo({
          url: "/pages/forgetPassword/forgetPassword"
        });
      };
      const goToFingerLogin = () => {
        uni.navigateTo({
          url: "/pages/fingerLogin/fingerLogin"
        });
      };
      const goToTask = () => {
        uni.redirectTo({
          url: "/pages/tabBar/tabBar"
        });
      };
      const toggleAutoLogin = (e2) => {
        autoLogin.value = e2.detail.value.length > 0;
        if (autoLogin.value) {
          uni.navigateTo({
            url: "/pages/register/register"
          });
        }
      };
      const checkLogin = () => {
        uni.showLoading({
          title: "正在登录",
          mask: true
        });
        login({
          account: username.value,
          password: password.value
        }).then((res) => {
          if (res.code === 200) {
            uni.setStorageSync("username", username.value);
            uni.setStorageSync("password", password.value);
            uni.setStorageSync("token", res.data.token);
            const userData = {
              id: res.data.id,
              account: res.data.account,
              name: res.data.name,
              department: res.data.department,
              role: res.data.role,
              phone: res.data.phone,
              created: res.data.created,
              avatar: res.data.avatar,
              avatarUrl: res.data.avatarUrl,
              token: res.data.token,
              status: res.data.status
            };
            userStore.setUserData(userData);
            connect(res.data.id, res.data.token);
            uni.setStorageSync("userInfo", userData);
            formatAppLog("log", "at pages/login/login.vue:117", "登录成功。用户数据:", userData);
            uni.hideLoading();
            uni.showToast({
              title: "登录成功",
              duration: 2e3
            }).then(() => {
              goToTask();
            });
          } else {
            throw new Error(res.message || "登录失败");
          }
        }).catch((error) => {
          formatAppLog("error", "at pages/login/login.vue:130", "登录失败:", error);
          uni.hideLoading();
          uni.showToast({
            title: error.message || "登录失败",
            icon: "none",
            duration: 2e3
          });
        });
      };
      const __returned__ = { connect, userStore, autoLogin, username, password, goToRegister, goToForgetPassword, goToFingerLogin, goToTask, toggleAutoLogin, checkLogin, ref: vue.ref, get login() {
        return login;
      }, get useUserStore() {
        return useUserStore;
      }, useWebSocket };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$O(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "layout" }, [
      vue.createElementVNode("view", { class: "iconView" }, [
        vue.createElementVNode("image", {
          src: _imports_0$a,
          class: "icon"
        })
      ]),
      vue.createElementVNode("view", { class: "text" }, [
        vue.createElementVNode("text", null, "欢迎登录！")
      ]),
      vue.createElementVNode("view", {
        class: "account",
        style: { "margin-top": "25px" }
      }, [
        vue.createElementVNode("view", {
          class: "title",
          style: { "margin-bottom": "7px" }
        }, "用户名"),
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            class: "uni-input",
            focus: "",
            placeholder: "请输入用户名",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.username = $event)
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $setup.username]
        ]),
        vue.createElementVNode("view", {
          class: "title",
          style: { "margin": "15px 0px 7px 0px" }
        }, "密码"),
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            class: "uni-input",
            password: "",
            type: "text",
            placeholder: "请输入密码",
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.password = $event)
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $setup.password]
        ]),
        vue.createElementVNode("button", {
          onClick: $setup.checkLogin,
          type: "primary",
          style: { "margin-top": "15px" }
        }, "登录")
      ]),
      vue.createElementVNode("view", { class: "container" }, [
        vue.createElementVNode("view", { class: "left" }, [
          vue.createElementVNode("label", { class: "checkbox" }, [
            vue.createElementVNode("checkbox", {
              value: $setup.autoLogin,
              onChange: $setup.toggleAutoLogin
            }, "自动登录", 40, ["value"])
          ])
        ]),
        vue.createElementVNode("view", { class: "right" }, [
          vue.createElementVNode("text", {
            onClick: $setup.goToRegister,
            class: "clicked_text"
          }, "注册 "),
          vue.createElementVNode("text", {
            onClick: $setup.goToForgetPassword,
            class: "clicked_text"
          }, " 忘记密码"),
          vue.createElementVNode("text", null, " | "),
          vue.createElementVNode("text", {
            onClick: $setup.goToFingerLogin,
            class: "clicked_text"
          }, "指纹登录")
        ])
      ])
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$P, [["render", _sfc_render$O], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/login/login.vue"]]);
  const isObject = (val) => val !== null && typeof val === "object";
  const defaultDelimiters = ["{", "}"];
  class BaseFormatter {
    constructor() {
      this._caches = /* @__PURE__ */ Object.create(null);
    }
    interpolate(message, values, delimiters = defaultDelimiters) {
      if (!values) {
        return [message];
      }
      let tokens = this._caches[message];
      if (!tokens) {
        tokens = parse(message, delimiters);
        this._caches[message] = tokens;
      }
      return compile(tokens, values);
    }
  }
  const RE_TOKEN_LIST_VALUE = /^(?:\d)+/;
  const RE_TOKEN_NAMED_VALUE = /^(?:\w)+/;
  function parse(format, [startDelimiter, endDelimiter]) {
    const tokens = [];
    let position = 0;
    let text = "";
    while (position < format.length) {
      let char = format[position++];
      if (char === startDelimiter) {
        if (text) {
          tokens.push({ type: "text", value: text });
        }
        text = "";
        let sub = "";
        char = format[position++];
        while (char !== void 0 && char !== endDelimiter) {
          sub += char;
          char = format[position++];
        }
        const isClosed = char === endDelimiter;
        const type = RE_TOKEN_LIST_VALUE.test(sub) ? "list" : isClosed && RE_TOKEN_NAMED_VALUE.test(sub) ? "named" : "unknown";
        tokens.push({ value: sub, type });
      } else {
        text += char;
      }
    }
    text && tokens.push({ type: "text", value: text });
    return tokens;
  }
  function compile(tokens, values) {
    const compiled = [];
    let index = 0;
    const mode = Array.isArray(values) ? "list" : isObject(values) ? "named" : "unknown";
    if (mode === "unknown") {
      return compiled;
    }
    while (index < tokens.length) {
      const token = tokens[index];
      switch (token.type) {
        case "text":
          compiled.push(token.value);
          break;
        case "list":
          compiled.push(values[parseInt(token.value, 10)]);
          break;
        case "named":
          if (mode === "named") {
            compiled.push(values[token.value]);
          } else {
            {
              console.warn(`Type of token '${token.type}' and format of value '${mode}' don't match!`);
            }
          }
          break;
        case "unknown":
          {
            console.warn(`Detect 'unknown' type of token!`);
          }
          break;
      }
      index++;
    }
    return compiled;
  }
  const LOCALE_ZH_HANS = "zh-Hans";
  const LOCALE_ZH_HANT = "zh-Hant";
  const LOCALE_EN = "en";
  const LOCALE_FR = "fr";
  const LOCALE_ES = "es";
  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty.call(val, key);
  const defaultFormatter = new BaseFormatter();
  function include(str, parts) {
    return !!parts.find((part) => str.indexOf(part) !== -1);
  }
  function startsWith(str, parts) {
    return parts.find((part) => str.indexOf(part) === 0);
  }
  function normalizeLocale(locale, messages2) {
    if (!locale) {
      return;
    }
    locale = locale.trim().replace(/_/g, "-");
    if (messages2 && messages2[locale]) {
      return locale;
    }
    locale = locale.toLowerCase();
    if (locale === "chinese") {
      return LOCALE_ZH_HANS;
    }
    if (locale.indexOf("zh") === 0) {
      if (locale.indexOf("-hans") > -1) {
        return LOCALE_ZH_HANS;
      }
      if (locale.indexOf("-hant") > -1) {
        return LOCALE_ZH_HANT;
      }
      if (include(locale, ["-tw", "-hk", "-mo", "-cht"])) {
        return LOCALE_ZH_HANT;
      }
      return LOCALE_ZH_HANS;
    }
    let locales = [LOCALE_EN, LOCALE_FR, LOCALE_ES];
    if (messages2 && Object.keys(messages2).length > 0) {
      locales = Object.keys(messages2);
    }
    const lang = startsWith(locale, locales);
    if (lang) {
      return lang;
    }
  }
  class I18n {
    constructor({ locale, fallbackLocale, messages: messages2, watcher, formater: formater2 }) {
      this.locale = LOCALE_EN;
      this.fallbackLocale = LOCALE_EN;
      this.message = {};
      this.messages = {};
      this.watchers = [];
      if (fallbackLocale) {
        this.fallbackLocale = fallbackLocale;
      }
      this.formater = formater2 || defaultFormatter;
      this.messages = messages2 || {};
      this.setLocale(locale || LOCALE_EN);
      if (watcher) {
        this.watchLocale(watcher);
      }
    }
    setLocale(locale) {
      const oldLocale = this.locale;
      this.locale = normalizeLocale(locale, this.messages) || this.fallbackLocale;
      if (!this.messages[this.locale]) {
        this.messages[this.locale] = {};
      }
      this.message = this.messages[this.locale];
      if (oldLocale !== this.locale) {
        this.watchers.forEach((watcher) => {
          watcher(this.locale, oldLocale);
        });
      }
    }
    getLocale() {
      return this.locale;
    }
    watchLocale(fn) {
      const index = this.watchers.push(fn) - 1;
      return () => {
        this.watchers.splice(index, 1);
      };
    }
    add(locale, message, override = true) {
      const curMessages = this.messages[locale];
      if (curMessages) {
        if (override) {
          Object.assign(curMessages, message);
        } else {
          Object.keys(message).forEach((key) => {
            if (!hasOwn(curMessages, key)) {
              curMessages[key] = message[key];
            }
          });
        }
      } else {
        this.messages[locale] = message;
      }
    }
    f(message, values, delimiters) {
      return this.formater.interpolate(message, values, delimiters).join("");
    }
    t(key, locale, values) {
      let message = this.message;
      if (typeof locale === "string") {
        locale = normalizeLocale(locale, this.messages);
        locale && (message = this.messages[locale]);
      } else {
        values = locale;
      }
      if (!hasOwn(message, key)) {
        console.warn(`Cannot translate the value of keypath ${key}. Use the value of keypath as default.`);
        return key;
      }
      return this.formater.interpolate(message[key], values).join("");
    }
  }
  function watchAppLocale(appVm, i18n) {
    if (appVm.$watchLocale) {
      appVm.$watchLocale((newLocale) => {
        i18n.setLocale(newLocale);
      });
    } else {
      appVm.$watch(() => appVm.$locale, (newLocale) => {
        i18n.setLocale(newLocale);
      });
    }
  }
  function getDefaultLocale() {
    if (typeof uni !== "undefined" && uni.getLocale) {
      return uni.getLocale();
    }
    if (typeof global !== "undefined" && global.getLocale) {
      return global.getLocale();
    }
    return LOCALE_EN;
  }
  function initVueI18n(locale, messages2 = {}, fallbackLocale, watcher) {
    if (typeof locale !== "string") {
      const options = [
        messages2,
        locale
      ];
      locale = options[0];
      messages2 = options[1];
    }
    if (typeof locale !== "string") {
      locale = getDefaultLocale();
    }
    if (typeof fallbackLocale !== "string") {
      fallbackLocale = typeof __uniConfig !== "undefined" && __uniConfig.fallbackLocale || LOCALE_EN;
    }
    const i18n = new I18n({
      locale,
      fallbackLocale,
      messages: messages2,
      watcher
    });
    let t2 = (key, values) => {
      if (typeof getApp !== "function") {
        t2 = function(key2, values2) {
          return i18n.t(key2, values2);
        };
      } else {
        let isWatchedAppLocale = false;
        t2 = function(key2, values2) {
          const appVm = getApp().$vm;
          if (appVm) {
            appVm.$locale;
            if (!isWatchedAppLocale) {
              isWatchedAppLocale = true;
              watchAppLocale(appVm, i18n);
            }
          }
          return i18n.t(key2, values2);
        };
      }
      return t2(key, values);
    };
    return {
      i18n,
      f(message, values, delimiters) {
        return i18n.f(message, values, delimiters);
      },
      t(key, values) {
        return t2(key, values);
      },
      add(locale2, message, override = true) {
        return i18n.add(locale2, message, override);
      },
      watch(fn) {
        return i18n.watchLocale(fn);
      },
      getLocale() {
        return i18n.getLocale();
      },
      setLocale(newLocale) {
        return i18n.setLocale(newLocale);
      }
    };
  }
  const en = {
    "uni-load-more.contentdown": "Pull up to show more",
    "uni-load-more.contentrefresh": "loading...",
    "uni-load-more.contentnomore": "No more data"
  };
  const zhHans = {
    "uni-load-more.contentdown": "上拉显示更多",
    "uni-load-more.contentrefresh": "正在加载...",
    "uni-load-more.contentnomore": "没有更多数据了"
  };
  const zhHant = {
    "uni-load-more.contentdown": "上拉顯示更多",
    "uni-load-more.contentrefresh": "正在加載...",
    "uni-load-more.contentnomore": "沒有更多數據了"
  };
  const messages = {
    en,
    "zh-Hans": zhHans,
    "zh-Hant": zhHant
  };
  let platform$1;
  setTimeout(() => {
    platform$1 = uni.getSystemInfoSync().platform;
  }, 16);
  const {
    t: t$1
  } = initVueI18n(messages);
  const _sfc_main$O = {
    name: "UniLoadMore",
    emits: ["clickLoadMore"],
    props: {
      status: {
        // 上拉的状态：more-loading前；loading-loading中；noMore-没有更多了
        type: String,
        default: "more"
      },
      showIcon: {
        type: Boolean,
        default: true
      },
      iconType: {
        type: String,
        default: "auto"
      },
      iconSize: {
        type: Number,
        default: 24
      },
      color: {
        type: String,
        default: "#777777"
      },
      contentText: {
        type: Object,
        default() {
          return {
            contentdown: "",
            contentrefresh: "",
            contentnomore: ""
          };
        }
      },
      showText: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        webviewHide: false,
        platform: platform$1,
        imgBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzlBMzU3OTlEOUM0MTFFOUI0NTZDNERBQURBQzI4RkUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzlBMzU3OUFEOUM0MTFFOUI0NTZDNERBQURBQzI4RkUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDOUEzNTc5N0Q5QzQxMUU5QjQ1NkM0REFBREFDMjhGRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDOUEzNTc5OEQ5QzQxMUU5QjQ1NkM0REFBREFDMjhGRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pt+ALSwAAA6CSURBVHja1FsLkFZVHb98LM+F5bHL8khA1iSeiyQBCRM+YGqKUnnJTDLGI0BGZlKDIU2MMglUiDApEZvSsZnQtBRJtKwQNKQMFYeRDR10WOLd8ljYXdh+v8v5fR3Od+797t1dnOnO/Ofce77z+J//+b/P+ZqtXbs2sJ9MJhNUV1cHJ06cCJo3bx7EPc2aNcvpy7pWrVoF+/fvDyoqKoI2bdoE9fX1F7TjN8a+EXBn/fkfvw942Tf+wYMHg9mzZwfjxo0LDhw4EPa1x2MbFw/fOGfPng1qa2tzcCkILsLDydq2bRsunpOTMM7TD/W/tZDZhPdeKD+yGxHhdu3aBV27dg3OnDlzMVANMheLAO3btw8KCwuDmpoaX5OxbgUIMEq7K8IcPnw4KCsrC/r37x8cP378/4cAXAB3vqSkJMuiDhTkw+XcuXNhOWbMmKBly5YhUT8xArhyFvP0BfwRsAuwxJZJsm/nzp2DTp06he/OU+cZ64K6o0ePBkOHDg2GDx8e6gEbJ5Q/NHNuAJQ1hgBeHUDlR7nVTkY8rQAvAi4z34vR/mPs1FoRsaCgIJThI0eOBC1atEiFGGV+5MiRoS45efJkqFjJFXV1dQuA012m2WcwTw98fy6CqBdsaiIO4CScrGPHjvk4odhavPquRtFWXEC25VgkREKOCh/qDSq+vn37htzD/mZTOmOc5U7zKzBPEedygWshcDyWvs30igAbU+6oyMgJBCFhwQE0fccxN60Ay9iebbjoDh06hMowjQxT4fXq1SskArmHZpkArvixp/kWzHdMeArExSJEaiXIjjRjRJ4DaAGWpibLzXN3Fm1vA5teBgh3j1Rv3bp1YgKwPdmf2p9zcyNYYgPKMfY0T5f5nNYdw158nJ8QawW4CLKwiOBSEgO/hok2eBydR+3dYH+PLxA5J8Vv0KBBwenTp0P2JWAx6+yFEBfs8lMY+y0SWMBNI9E4ThKi58VKTg3FQZS1RQF1cz27eC0QHMu+3E0SkUowjhVt5VdaWhp07949ZHv2Qd1EjDXM2cla1M0nl3GxAs3J9yREzyTdFVKVFOaE9qRA8GM0WebRuo9JGZKA7Mv2SeS/Z8+eoQ9BArMfFrLGo6jvxbhHbJZnKX2Rzz1O7QhJJ9Cs2ZMaWIyq/zhdeqPNfIoHd58clIQD+JSXl4dKlyIAuBdVXZwFVWKspSSoxE++h8x4k3uCnEhE4I5KwRiFWGOU0QWKiCYLbdoRMRKAu2kQ9vkfLU6dOhX06NEjlH+yMRZSinnuyWnYosVcji8CEA/6Cg2JF+IIUBqnGKUTCNwtwBN4f89RiK1R96DEgO2o0NDmtEdvVFdVVYV+P3UAPUEs6GFwV3PHmXkD4vh74iDFJysVI/MlaQhwKeBNTLYX5VuA8T4/gZxA4MRGFxDB6R7OmYPfyykGRJbyie+XnGYnQIC/coH9+vULiYrxrkL9ZA9+0ykaHIfEpM7ge8TiJ2CsHYwyMfafAF1yCGBHYIbCVDjDjKt7BeB51D+LgQa6OkG7IDYEEtvQ7lnXLKLtLdLuJBpE4gPUXcW2+PkZwOex+4cGDhwYDBkyRL7/HFcEwUGPo/8uWRUpYnfxGHco8HkewLHLyYmAawAPuIFZxhOpDfJQ8gbUv41yORAptMWBNr6oqMhWird5+u+iHmBb2nhjDV7HWBNQTgK8y11l5NetWzc5ULscAtSj7nbNI0skhWeUZCc0W4nyH/jO4Vz0u1IeYhbk4AiwM6tjxIWByHsoZ9qcIBPJd/y+DwPfBESOmCa/QF3WiZHucLlEDpNxcNhmheEOPgdQNx6/VZFQzFZ5TN08AHXQt2Ii3EdyFuUsPtTcGPhW5iMiCNELvz+Gdn9huG4HUJaW/w3g0wxV0XaG7arG2WeKiUWYM4Y7GO5ezshTARbbWGw/DvXkpp/ivVvE0JVoMxN4rpGzJMhE5Pl+xlATsDIqikP9F9D2z3h9nOksEUFhK+qO4rcPkoalMQ/HqJLIyb3F3JdjrCcw1yZ8joyJLR5gCo54etlag7qIoeNh1N1BRYj3DTFJ0elotxPlVzkGuYAmL0VSJVGAJA41c4Z6A3BzTLfn0HYwYKEI6CUAMzZEWvLsIcQOo1AmmyyM72nHJCfYsogflGV6jEk9vyQZXSuq6w4c16NsGcGZbwOPr+H1RkOk2LEzjNepxQkihHSCQ4ynAYNRx2zMKV92CQMWqj8J0BRE8EShxRFN6YrfCRhC0x3r/Zm4IbQCcmJoV0kMamllccR6FjHqUC5F2R/wS2dcymOlfAKOS4KmzQb5cpNC2MC7JhVn5wjXoJ44rYhLh8n0eXOCorJxa7POjbSlCGVczr34/RsAmrcvo9s+wGp3tzVhntxiXiJ4nvEYb4FJkf0O8HocAePmLvCxnL0AORraVekJk6TYjDabRVXfRE2lCN1h6ZQRN1+InUbsCpKwoBZHh0dODN9JBCUffItXxEavTQkUtnfTVAplCWL3JISz29h4NjotnuSsQKJCk8dF+kJR6RARjrqFVmfPnj3ZbK8cIJ0msd6jgHPGtfVTQ8VLmlvh4mct9sobRmPic0DyDQQnx/NlfYUgyz59+oScsH379pAwXABD32nTpoUHIToESeI5mnbE/UqDdyLcafEBf2MCqgC7NwxIbMREJQ0g4D4sfJwnD+AmRrII05cfMWJE+L1169bQr+fip06dGp4oJ83lmYd5wj/EmMa4TaHivo4EeCguYZBnkB5g2aWA69OIEnUHOaGysjIYMGBAMGnSpODYsWPZwCpFmm4lNq+4gSLQA7jcX8DwtjEyRC8wjabnXEx9kfWnTJkSJkAo90xpJVV+FmcVNeYAF5zWngS4C4O91MBxmAv8blLEpbjI5sz9MTdAhcgkCT1RO8mZkAjfiYpTEvStAS53Uw1vAiUGgZ3GpuQEYvoiBqlIan7kSDHnTwJQFNiPu0+5VxCVYhcZIjNrdXUDdp+Eq5AZ3Gkg8QAyVZRZIk4Tl4QAbF9cXJxNYZMAtAokgs4BrNxEpCtteXg7DDTMDKYNSuQdKsnJBek7HxewvxaosWxLYXtw+cJp18217wql4aKCfBNoEu0O5VU+PhctJ0YeXD4C6JQpyrlpSLTojpGGGN5YwNziChdIZLk4lvLcFJ9jMX3QdiImY9bmGQU+TRUL5CHITTRlgF8D9ouD1MfmLoEPl5xokIumZ2cfgMpHt47IW9N64Hsh7wQYYjyIugWuF5fCqYncXRd5vPMWyizzvhi/32+nvG0dZc9vR6fZOu0md5e+uC408FvKSIOZwXlGvxPv95izA2Vtvg1xKFWARI+vMX66HUhpQQb643uW1bSjuTWyw2SBvDrBvjFic1eGGlz5esq3ko9uSIlBRqPuFcCv8F4WIcN12nVaBd0SaYwI6PDDImR11JkqgHcPmQssjxIn6bUshygDFJUTxPMpHk+jfjPgupgdnYV2R/g7xSjtpah8RJBewhwf0gGK6XI92u4wXFEU40afJ4DN4h5LcAd+40HI3JgJecuT0c062W0i2hQJUTcxan3/CMW1PF2K6bbA+Daz4xRs1D3Br1Cm0OihKCqizW78/nXAF/G5TXrEcVzaNMH6CyMswqsAHqDyDLEyou8lwOXnKF8DjI6KjV3KzMBiXkDH8ij/H214J5A596ekrZ3F0zXlWeL7+P5eUrNo3/QwC15uxthuzidy7DzKRwEDaAViiDgKbTbz7CJnzo0bN7pIfIiid8SuPwn25o3QCmpnyjlZkyxPP8EomCJzrGb7GJMx7tNsq4MT2xMUYaiErZOluTzKsnz3gwCeCZyVRZJfYplNEokEjwrPtxlxjeYAk+F1F74VAzPxQRNYYdtpOUvWs8J1sGhBJMNsb7igN8plJs1eSmLIhLKE4rvaCX27gOhLpLOsIzJ7qn/i+wZzcvSOZ23/du8TZjwV8zHIXoP4R3ifBxiFz1dcVpa3aPntPE+c6TmIWE9EtcMmAcPdWAhYhAXxcLOQi9L1WhD1Sc8p1d2oL7XGiRKp8F4A2i8K/nfI+y/gsTDJ/YC/8+AD5Uh04KHiGl+cIFPnBDDrPMjwRGkLXyxO4VGbfQWnDH2v0bVWE3C9QOXlepbgjEfIJQI6XDG3z5ahD9cw2pS78ipB85wyScNTvsVzlzzhL8/jRrnmVjfFJK/m3m4nj9vbgQTguT8XZTjsm672R5uJKEaQmBI/c58gyus8ZDagLpEVSJBIyHp4jn++xqPV71OgQgJYEWOtZ/haxRtKmWOBu8xdBLftWltsY84zE6WIEy/eIOWL+BaayMx+KHtL7EAkqdNDLiEXmEMUHniedtJqg9HmZtfvt26vNi0BdG3Ft3g8ZOf7PAu59TxtzivLNIekyi+wD1i8CuUiD9FXAa8C+/xS3JPmZnomyc7H+fb4/Se0bk41Fel621r4cgVxbq91V4jVqwB7HTe2M7jgB+QWHavZkDRPmZcASoZEmBx6i75bGjPcMdL4/VKGFAGWZkGzPG0XAbdL9A81G5LOmUnC9hHKJeO7dcUMjblSl12867ElFTtaGl20xvvLGPdVz/8TVuU7y0x1PG7vtNg24oz9Uo/Z412++VFWI7Fcog9tu9Lm6gvRmIPv9x1xmQAu6RDkXtbOtlGEmpgD5Nvnyc0dcv0EE6cfdi1HmhMf9wDF3k3gtRvEedhxjpgfqPb9PU9iEJHnyOUA7bQUXh6kq/D7l2iTjWv7XOD530BDr8jIrus+srXjt4MzumJMHuTsBa63YKE1+RR5lBjEikCCnWKWiHdzOgKO+nRIBAF88za/IFmJ3eMZov4CYxGBabcpGL8EYx+SeMXJeRwHNsV/h+vdxeuhEpN3ZyNY78Gm2fknJxVGhyjixPiQvVkNzT1elD9Py/aTAL64Hb9vcYmC9zfdXdT/C1LeGbg4rnBaAihDFJH12W5ulfNCNe/xTsP3bp8ikzJs5BF+5PNfAQYAPaseTdsEcaYAAAAASUVORK5CYII="
      };
    },
    computed: {
      iconSnowWidth() {
        return (Math.floor(this.iconSize / 24) || 1) * 2;
      },
      contentdownText() {
        return this.contentText.contentdown || t$1("uni-load-more.contentdown");
      },
      contentrefreshText() {
        return this.contentText.contentrefresh || t$1("uni-load-more.contentrefresh");
      },
      contentnomoreText() {
        return this.contentText.contentnomore || t$1("uni-load-more.contentnomore");
      }
    },
    mounted() {
      var pages2 = getCurrentPages();
      var page = pages2[pages2.length - 1];
      var currentWebview = page.$getAppWebview();
      currentWebview.addEventListener("hide", () => {
        this.webviewHide = true;
      });
      currentWebview.addEventListener("show", () => {
        this.webviewHide = false;
      });
    },
    methods: {
      onClick() {
        this.$emit("clickLoadMore", {
          detail: {
            status: this.status
          }
        });
      }
    }
  };
  function _sfc_render$N(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "uni-load-more",
      onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args))
    }, [
      !$data.webviewHide && ($props.iconType === "circle" || $props.iconType === "auto" && $data.platform === "android") && $props.status === "loading" && $props.showIcon ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          style: vue.normalizeStyle({ width: $props.iconSize + "px", height: $props.iconSize + "px" }),
          class: "uni-load-more__img uni-load-more__img--android-MP"
        },
        [
          vue.createElementVNode(
            "view",
            {
              class: "uni-load-more__img-icon",
              style: vue.normalizeStyle({ borderTopColor: $props.color, borderTopWidth: $props.iconSize / 12 })
            },
            null,
            4
            /* STYLE */
          ),
          vue.createElementVNode(
            "view",
            {
              class: "uni-load-more__img-icon",
              style: vue.normalizeStyle({ borderTopColor: $props.color, borderTopWidth: $props.iconSize / 12 })
            },
            null,
            4
            /* STYLE */
          ),
          vue.createElementVNode(
            "view",
            {
              class: "uni-load-more__img-icon",
              style: vue.normalizeStyle({ borderTopColor: $props.color, borderTopWidth: $props.iconSize / 12 })
            },
            null,
            4
            /* STYLE */
          )
        ],
        4
        /* STYLE */
      )) : !$data.webviewHide && $props.status === "loading" && $props.showIcon ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 1,
          style: vue.normalizeStyle({ width: $props.iconSize + "px", height: $props.iconSize + "px" }),
          class: "uni-load-more__img uni-load-more__img--ios-H5"
        },
        [
          vue.createElementVNode("image", {
            src: $data.imgBase64,
            mode: "widthFix"
          }, null, 8, ["src"])
        ],
        4
        /* STYLE */
      )) : vue.createCommentVNode("v-if", true),
      $props.showText ? (vue.openBlock(), vue.createElementBlock(
        "text",
        {
          key: 2,
          class: "uni-load-more__text",
          style: vue.normalizeStyle({ color: $props.color })
        },
        vue.toDisplayString($props.status === "more" ? $options.contentdownText : $props.status === "loading" ? $options.contentrefreshText : $options.contentnomoreText),
        5
        /* TEXT, STYLE */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_0$6 = /* @__PURE__ */ _export_sfc(_sfc_main$O, [["render", _sfc_render$N], ["__scopeId", "data-v-9245e42c"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue"]]);
  const fontData = [
    {
      "font_class": "arrow-down",
      "unicode": ""
    },
    {
      "font_class": "arrow-left",
      "unicode": ""
    },
    {
      "font_class": "arrow-right",
      "unicode": ""
    },
    {
      "font_class": "arrow-up",
      "unicode": ""
    },
    {
      "font_class": "auth",
      "unicode": ""
    },
    {
      "font_class": "auth-filled",
      "unicode": ""
    },
    {
      "font_class": "back",
      "unicode": ""
    },
    {
      "font_class": "bars",
      "unicode": ""
    },
    {
      "font_class": "calendar",
      "unicode": ""
    },
    {
      "font_class": "calendar-filled",
      "unicode": ""
    },
    {
      "font_class": "camera",
      "unicode": ""
    },
    {
      "font_class": "camera-filled",
      "unicode": ""
    },
    {
      "font_class": "cart",
      "unicode": ""
    },
    {
      "font_class": "cart-filled",
      "unicode": ""
    },
    {
      "font_class": "chat",
      "unicode": ""
    },
    {
      "font_class": "chat-filled",
      "unicode": ""
    },
    {
      "font_class": "chatboxes",
      "unicode": ""
    },
    {
      "font_class": "chatboxes-filled",
      "unicode": ""
    },
    {
      "font_class": "chatbubble",
      "unicode": ""
    },
    {
      "font_class": "chatbubble-filled",
      "unicode": ""
    },
    {
      "font_class": "checkbox",
      "unicode": ""
    },
    {
      "font_class": "checkbox-filled",
      "unicode": ""
    },
    {
      "font_class": "checkmarkempty",
      "unicode": ""
    },
    {
      "font_class": "circle",
      "unicode": ""
    },
    {
      "font_class": "circle-filled",
      "unicode": ""
    },
    {
      "font_class": "clear",
      "unicode": ""
    },
    {
      "font_class": "close",
      "unicode": ""
    },
    {
      "font_class": "closeempty",
      "unicode": ""
    },
    {
      "font_class": "cloud-download",
      "unicode": ""
    },
    {
      "font_class": "cloud-download-filled",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload",
      "unicode": ""
    },
    {
      "font_class": "cloud-upload-filled",
      "unicode": ""
    },
    {
      "font_class": "color",
      "unicode": ""
    },
    {
      "font_class": "color-filled",
      "unicode": ""
    },
    {
      "font_class": "compose",
      "unicode": ""
    },
    {
      "font_class": "contact",
      "unicode": ""
    },
    {
      "font_class": "contact-filled",
      "unicode": ""
    },
    {
      "font_class": "down",
      "unicode": ""
    },
    {
      "font_class": "bottom",
      "unicode": ""
    },
    {
      "font_class": "download",
      "unicode": ""
    },
    {
      "font_class": "download-filled",
      "unicode": ""
    },
    {
      "font_class": "email",
      "unicode": ""
    },
    {
      "font_class": "email-filled",
      "unicode": ""
    },
    {
      "font_class": "eye",
      "unicode": ""
    },
    {
      "font_class": "eye-filled",
      "unicode": ""
    },
    {
      "font_class": "eye-slash",
      "unicode": ""
    },
    {
      "font_class": "eye-slash-filled",
      "unicode": ""
    },
    {
      "font_class": "fire",
      "unicode": ""
    },
    {
      "font_class": "fire-filled",
      "unicode": ""
    },
    {
      "font_class": "flag",
      "unicode": ""
    },
    {
      "font_class": "flag-filled",
      "unicode": ""
    },
    {
      "font_class": "folder-add",
      "unicode": ""
    },
    {
      "font_class": "folder-add-filled",
      "unicode": ""
    },
    {
      "font_class": "font",
      "unicode": ""
    },
    {
      "font_class": "forward",
      "unicode": ""
    },
    {
      "font_class": "gear",
      "unicode": ""
    },
    {
      "font_class": "gear-filled",
      "unicode": ""
    },
    {
      "font_class": "gift",
      "unicode": ""
    },
    {
      "font_class": "gift-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-down",
      "unicode": ""
    },
    {
      "font_class": "hand-down-filled",
      "unicode": ""
    },
    {
      "font_class": "hand-up",
      "unicode": ""
    },
    {
      "font_class": "hand-up-filled",
      "unicode": ""
    },
    {
      "font_class": "headphones",
      "unicode": ""
    },
    {
      "font_class": "heart",
      "unicode": ""
    },
    {
      "font_class": "heart-filled",
      "unicode": ""
    },
    {
      "font_class": "help",
      "unicode": ""
    },
    {
      "font_class": "help-filled",
      "unicode": ""
    },
    {
      "font_class": "home",
      "unicode": ""
    },
    {
      "font_class": "home-filled",
      "unicode": ""
    },
    {
      "font_class": "image",
      "unicode": ""
    },
    {
      "font_class": "image-filled",
      "unicode": ""
    },
    {
      "font_class": "images",
      "unicode": ""
    },
    {
      "font_class": "images-filled",
      "unicode": ""
    },
    {
      "font_class": "info",
      "unicode": ""
    },
    {
      "font_class": "info-filled",
      "unicode": ""
    },
    {
      "font_class": "left",
      "unicode": ""
    },
    {
      "font_class": "link",
      "unicode": ""
    },
    {
      "font_class": "list",
      "unicode": ""
    },
    {
      "font_class": "location",
      "unicode": ""
    },
    {
      "font_class": "location-filled",
      "unicode": ""
    },
    {
      "font_class": "locked",
      "unicode": ""
    },
    {
      "font_class": "locked-filled",
      "unicode": ""
    },
    {
      "font_class": "loop",
      "unicode": ""
    },
    {
      "font_class": "mail-open",
      "unicode": ""
    },
    {
      "font_class": "mail-open-filled",
      "unicode": ""
    },
    {
      "font_class": "map",
      "unicode": ""
    },
    {
      "font_class": "map-filled",
      "unicode": ""
    },
    {
      "font_class": "map-pin",
      "unicode": ""
    },
    {
      "font_class": "map-pin-ellipse",
      "unicode": ""
    },
    {
      "font_class": "medal",
      "unicode": ""
    },
    {
      "font_class": "medal-filled",
      "unicode": ""
    },
    {
      "font_class": "mic",
      "unicode": ""
    },
    {
      "font_class": "mic-filled",
      "unicode": ""
    },
    {
      "font_class": "micoff",
      "unicode": ""
    },
    {
      "font_class": "micoff-filled",
      "unicode": ""
    },
    {
      "font_class": "minus",
      "unicode": ""
    },
    {
      "font_class": "minus-filled",
      "unicode": ""
    },
    {
      "font_class": "more",
      "unicode": ""
    },
    {
      "font_class": "more-filled",
      "unicode": ""
    },
    {
      "font_class": "navigate",
      "unicode": ""
    },
    {
      "font_class": "navigate-filled",
      "unicode": ""
    },
    {
      "font_class": "notification",
      "unicode": ""
    },
    {
      "font_class": "notification-filled",
      "unicode": ""
    },
    {
      "font_class": "paperclip",
      "unicode": ""
    },
    {
      "font_class": "paperplane",
      "unicode": ""
    },
    {
      "font_class": "paperplane-filled",
      "unicode": ""
    },
    {
      "font_class": "person",
      "unicode": ""
    },
    {
      "font_class": "person-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled",
      "unicode": ""
    },
    {
      "font_class": "personadd-filled-copy",
      "unicode": ""
    },
    {
      "font_class": "phone",
      "unicode": ""
    },
    {
      "font_class": "phone-filled",
      "unicode": ""
    },
    {
      "font_class": "plus",
      "unicode": ""
    },
    {
      "font_class": "plus-filled",
      "unicode": ""
    },
    {
      "font_class": "plusempty",
      "unicode": ""
    },
    {
      "font_class": "pulldown",
      "unicode": ""
    },
    {
      "font_class": "pyq",
      "unicode": ""
    },
    {
      "font_class": "qq",
      "unicode": ""
    },
    {
      "font_class": "redo",
      "unicode": ""
    },
    {
      "font_class": "redo-filled",
      "unicode": ""
    },
    {
      "font_class": "refresh",
      "unicode": ""
    },
    {
      "font_class": "refresh-filled",
      "unicode": ""
    },
    {
      "font_class": "refreshempty",
      "unicode": ""
    },
    {
      "font_class": "reload",
      "unicode": ""
    },
    {
      "font_class": "right",
      "unicode": ""
    },
    {
      "font_class": "scan",
      "unicode": ""
    },
    {
      "font_class": "search",
      "unicode": ""
    },
    {
      "font_class": "settings",
      "unicode": ""
    },
    {
      "font_class": "settings-filled",
      "unicode": ""
    },
    {
      "font_class": "shop",
      "unicode": ""
    },
    {
      "font_class": "shop-filled",
      "unicode": ""
    },
    {
      "font_class": "smallcircle",
      "unicode": ""
    },
    {
      "font_class": "smallcircle-filled",
      "unicode": ""
    },
    {
      "font_class": "sound",
      "unicode": ""
    },
    {
      "font_class": "sound-filled",
      "unicode": ""
    },
    {
      "font_class": "spinner-cycle",
      "unicode": ""
    },
    {
      "font_class": "staff",
      "unicode": ""
    },
    {
      "font_class": "staff-filled",
      "unicode": ""
    },
    {
      "font_class": "star",
      "unicode": ""
    },
    {
      "font_class": "star-filled",
      "unicode": ""
    },
    {
      "font_class": "starhalf",
      "unicode": ""
    },
    {
      "font_class": "trash",
      "unicode": ""
    },
    {
      "font_class": "trash-filled",
      "unicode": ""
    },
    {
      "font_class": "tune",
      "unicode": ""
    },
    {
      "font_class": "tune-filled",
      "unicode": ""
    },
    {
      "font_class": "undo",
      "unicode": ""
    },
    {
      "font_class": "undo-filled",
      "unicode": ""
    },
    {
      "font_class": "up",
      "unicode": ""
    },
    {
      "font_class": "top",
      "unicode": ""
    },
    {
      "font_class": "upload",
      "unicode": ""
    },
    {
      "font_class": "upload-filled",
      "unicode": ""
    },
    {
      "font_class": "videocam",
      "unicode": ""
    },
    {
      "font_class": "videocam-filled",
      "unicode": ""
    },
    {
      "font_class": "vip",
      "unicode": ""
    },
    {
      "font_class": "vip-filled",
      "unicode": ""
    },
    {
      "font_class": "wallet",
      "unicode": ""
    },
    {
      "font_class": "wallet-filled",
      "unicode": ""
    },
    {
      "font_class": "weibo",
      "unicode": ""
    },
    {
      "font_class": "weixin",
      "unicode": ""
    }
  ];
  const getVal = (val) => {
    const reg = /^[0-9]*$/g;
    return typeof val === "number" || reg.test(val) ? val + "px" : val;
  };
  const _sfc_main$N = {
    name: "UniIcons",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: ""
      },
      color: {
        type: String,
        default: "#333333"
      },
      size: {
        type: [Number, String],
        default: 16
      },
      customPrefix: {
        type: String,
        default: ""
      },
      fontFamily: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        icons: fontData
      };
    },
    computed: {
      unicode() {
        let code = this.icons.find((v2) => v2.font_class === this.type);
        if (code) {
          return code.unicode;
        }
        return "";
      },
      iconSize() {
        return getVal(this.size);
      },
      styleObj() {
        if (this.fontFamily !== "") {
          return `color: ${this.color}; font-size: ${this.iconSize}; font-family: ${this.fontFamily};`;
        }
        return `color: ${this.color}; font-size: ${this.iconSize};`;
      }
    },
    methods: {
      _onClick() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render$M(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "text",
      {
        style: vue.normalizeStyle($options.styleObj),
        class: vue.normalizeClass(["uni-icons", ["uniui-" + $props.type, $props.customPrefix, $props.customPrefix ? $props.type : ""]]),
        onClick: _cache[0] || (_cache[0] = (...args) => $options._onClick && $options._onClick(...args))
      },
      [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0$5 = /* @__PURE__ */ _export_sfc(_sfc_main$N, [["render", _sfc_render$M], ["__scopeId", "data-v-d31e1c47"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-icons/components/uni-icons/uni-icons.vue"]]);
  const pages = [
    {
      path: "pages/login/camouflageLogin/camouflageLogin",
      style: {
        navigationBarTitleText: "",
        navigationStyle: "custom",
        "app-plus": {
          scrollIndicator: "none"
        }
      }
    },
    {
      path: "pages/login/login",
      style: {
        navigationBarTitleText: "",
        "app-plus": {
          scrollIndicator: "none"
        }
      }
    },
    {
      path: "pages/register/register",
      style: {
        navigationBarTitleText: "",
        "app-plus": {
          scrollIndicator: "none"
        }
      }
    },
    {
      path: "pages/forgetPassword/forgetPassword",
      style: {
        navigationBarTitleText: "",
        "app-plus": {
          scrollIndicator: "none"
        }
      }
    },
    {
      path: "pages/fingerLogin/fingerLogin",
      style: {
        navigationBarTitleText: "",
        "app-plus": {
          scrollIndicator: "none"
        }
      }
    },
    {
      path: "pages/task/task",
      style: {
        navigationBarTitleText: "",
        "app-plus": {
          scrollIndicator: "none"
        }
      }
    },
    {
      path: "pages/task/task_detail/task_detail",
      style: {
        navigationBarTitleText: "任务列表",
        "app-plus": {
          scrollIndicator: "none",
          titleNView: {
            buttons: [
              {
                type: "menu"
              }
            ]
          }
        }
      }
    },
    {
      path: "pages/task/task_detail/document/document",
      style: {
        navigationBarTitleText: "文件",
        "app-plus": {
          scrollIndicator: "none"
        }
      }
    },
    {
      path: "pages/task/task_detail/map_test/map_test",
      style: {
        navigationBarTitleText: "高德地图测试界面"
      }
    },
    {
      path: "pages/task/task_detail/baidu_map/baidu_map",
      style: {
        navigationBarTitleText: "百度地图测试"
      }
    },
    {
      path: "pages/profile/profile",
      style: {
        navigationBarTitleText: "",
        "app-plus": {
          scrollIndicator: "none"
        }
      }
    },
    {
      path: "pages/message/main",
      style: {
        navigationBarTitleText: "",
        "app-plus": {
          scrollIndicator: "none"
        }
      }
    },
    {
      path: "pages/message/chat",
      style: {
        navigationBarTitleText: "",
        "app-plus": {
          scrollIndicator: "none"
        }
      }
    },
    {
      path: "pages/tabBar/tabBar",
      style: {
        navigationBarTitleText: "首页",
        titleNView: {
          autoBackButton: false
        },
        "app-plus": {
          scrollIndicator: "none"
        }
      }
    },
    {
      path: "pages/task/task_detail/document/uploadfile/uploadfile",
      style: {
        navigationBarTitleText: "文件上传"
      }
    },
    {
      path: "pages/message/video-call",
      style: {
        navigationBarTitleText: "视频通话"
      }
    },
    {
      path: "pages/message/ChatComponent/CallReminder",
      style: {
        navigationBarTitleText: ""
      }
    },
    {
      path: "pages/message/video-answer",
      style: {
        navigationBarTitleText: ""
      }
    },
    {
      path: "pages/login/camouflageLogin/inputAccount/inputAccount",
      style: {
        navigationBarTitleText: "",
        navigationStyle: "custom"
      }
    }
  ];
  const globalStyle = {
    navigationBarTextStyle: "black",
    navigationBarTitleText: "uni-app",
    navigationBarBackgroundColor: "#F8F8F8",
    backgroundColor: "#F8F8F8",
    "app-plus": {
      background: "#efeff4"
    }
  };
  const e = {
    pages,
    globalStyle
  };
  var define_process_env_UNI_SECURE_NETWORK_CONFIG_default = [];
  function t(e2) {
    return e2 && e2.__esModule && Object.prototype.hasOwnProperty.call(e2, "default") ? e2.default : e2;
  }
  function n(e2, t2, n2) {
    return e2(n2 = { path: t2, exports: {}, require: function(e3, t3) {
      return function() {
        throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs");
      }(null == t3 && n2.path);
    } }, n2.exports), n2.exports;
  }
  var s = n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = n2 || function(e3, t3) {
      var n3 = Object.create || /* @__PURE__ */ function() {
        function e4() {
        }
        return function(t4) {
          var n4;
          return e4.prototype = t4, n4 = new e4(), e4.prototype = null, n4;
        };
      }(), s2 = {}, r2 = s2.lib = {}, i2 = r2.Base = { extend: function(e4) {
        var t4 = n3(this);
        return e4 && t4.mixIn(e4), t4.hasOwnProperty("init") && this.init !== t4.init || (t4.init = function() {
          t4.$super.init.apply(this, arguments);
        }), t4.init.prototype = t4, t4.$super = this, t4;
      }, create: function() {
        var e4 = this.extend();
        return e4.init.apply(e4, arguments), e4;
      }, init: function() {
      }, mixIn: function(e4) {
        for (var t4 in e4)
          e4.hasOwnProperty(t4) && (this[t4] = e4[t4]);
        e4.hasOwnProperty("toString") && (this.toString = e4.toString);
      }, clone: function() {
        return this.init.prototype.extend(this);
      } }, o2 = r2.WordArray = i2.extend({ init: function(e4, n4) {
        e4 = this.words = e4 || [], this.sigBytes = n4 != t3 ? n4 : 4 * e4.length;
      }, toString: function(e4) {
        return (e4 || c2).stringify(this);
      }, concat: function(e4) {
        var t4 = this.words, n4 = e4.words, s3 = this.sigBytes, r3 = e4.sigBytes;
        if (this.clamp(), s3 % 4)
          for (var i3 = 0; i3 < r3; i3++) {
            var o3 = n4[i3 >>> 2] >>> 24 - i3 % 4 * 8 & 255;
            t4[s3 + i3 >>> 2] |= o3 << 24 - (s3 + i3) % 4 * 8;
          }
        else
          for (i3 = 0; i3 < r3; i3 += 4)
            t4[s3 + i3 >>> 2] = n4[i3 >>> 2];
        return this.sigBytes += r3, this;
      }, clamp: function() {
        var t4 = this.words, n4 = this.sigBytes;
        t4[n4 >>> 2] &= 4294967295 << 32 - n4 % 4 * 8, t4.length = e3.ceil(n4 / 4);
      }, clone: function() {
        var e4 = i2.clone.call(this);
        return e4.words = this.words.slice(0), e4;
      }, random: function(t4) {
        for (var n4, s3 = [], r3 = function(t5) {
          t5 = t5;
          var n5 = 987654321, s4 = 4294967295;
          return function() {
            var r4 = ((n5 = 36969 * (65535 & n5) + (n5 >> 16) & s4) << 16) + (t5 = 18e3 * (65535 & t5) + (t5 >> 16) & s4) & s4;
            return r4 /= 4294967296, (r4 += 0.5) * (e3.random() > 0.5 ? 1 : -1);
          };
        }, i3 = 0; i3 < t4; i3 += 4) {
          var a3 = r3(4294967296 * (n4 || e3.random()));
          n4 = 987654071 * a3(), s3.push(4294967296 * a3() | 0);
        }
        return new o2.init(s3, t4);
      } }), a2 = s2.enc = {}, c2 = a2.Hex = { stringify: function(e4) {
        for (var t4 = e4.words, n4 = e4.sigBytes, s3 = [], r3 = 0; r3 < n4; r3++) {
          var i3 = t4[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255;
          s3.push((i3 >>> 4).toString(16)), s3.push((15 & i3).toString(16));
        }
        return s3.join("");
      }, parse: function(e4) {
        for (var t4 = e4.length, n4 = [], s3 = 0; s3 < t4; s3 += 2)
          n4[s3 >>> 3] |= parseInt(e4.substr(s3, 2), 16) << 24 - s3 % 8 * 4;
        return new o2.init(n4, t4 / 2);
      } }, u2 = a2.Latin1 = { stringify: function(e4) {
        for (var t4 = e4.words, n4 = e4.sigBytes, s3 = [], r3 = 0; r3 < n4; r3++) {
          var i3 = t4[r3 >>> 2] >>> 24 - r3 % 4 * 8 & 255;
          s3.push(String.fromCharCode(i3));
        }
        return s3.join("");
      }, parse: function(e4) {
        for (var t4 = e4.length, n4 = [], s3 = 0; s3 < t4; s3++)
          n4[s3 >>> 2] |= (255 & e4.charCodeAt(s3)) << 24 - s3 % 4 * 8;
        return new o2.init(n4, t4);
      } }, l2 = a2.Utf8 = { stringify: function(e4) {
        try {
          return decodeURIComponent(escape(u2.stringify(e4)));
        } catch (e5) {
          throw new Error("Malformed UTF-8 data");
        }
      }, parse: function(e4) {
        return u2.parse(unescape(encodeURIComponent(e4)));
      } }, h2 = r2.BufferedBlockAlgorithm = i2.extend({ reset: function() {
        this._data = new o2.init(), this._nDataBytes = 0;
      }, _append: function(e4) {
        "string" == typeof e4 && (e4 = l2.parse(e4)), this._data.concat(e4), this._nDataBytes += e4.sigBytes;
      }, _process: function(t4) {
        var n4 = this._data, s3 = n4.words, r3 = n4.sigBytes, i3 = this.blockSize, a3 = r3 / (4 * i3), c3 = (a3 = t4 ? e3.ceil(a3) : e3.max((0 | a3) - this._minBufferSize, 0)) * i3, u3 = e3.min(4 * c3, r3);
        if (c3) {
          for (var l3 = 0; l3 < c3; l3 += i3)
            this._doProcessBlock(s3, l3);
          var h3 = s3.splice(0, c3);
          n4.sigBytes -= u3;
        }
        return new o2.init(h3, u3);
      }, clone: function() {
        var e4 = i2.clone.call(this);
        return e4._data = this._data.clone(), e4;
      }, _minBufferSize: 0 });
      r2.Hasher = h2.extend({ cfg: i2.extend(), init: function(e4) {
        this.cfg = this.cfg.extend(e4), this.reset();
      }, reset: function() {
        h2.reset.call(this), this._doReset();
      }, update: function(e4) {
        return this._append(e4), this._process(), this;
      }, finalize: function(e4) {
        return e4 && this._append(e4), this._doFinalize();
      }, blockSize: 16, _createHelper: function(e4) {
        return function(t4, n4) {
          return new e4.init(n4).finalize(t4);
        };
      }, _createHmacHelper: function(e4) {
        return function(t4, n4) {
          return new d2.HMAC.init(e4, n4).finalize(t4);
        };
      } });
      var d2 = s2.algo = {};
      return s2;
    }(Math), n2);
  }), r = s, i = (n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = r, function(e3) {
      var t3 = n2, s2 = t3.lib, r2 = s2.WordArray, i2 = s2.Hasher, o2 = t3.algo, a2 = [];
      !function() {
        for (var t4 = 0; t4 < 64; t4++)
          a2[t4] = 4294967296 * e3.abs(e3.sin(t4 + 1)) | 0;
      }();
      var c2 = o2.MD5 = i2.extend({ _doReset: function() {
        this._hash = new r2.init([1732584193, 4023233417, 2562383102, 271733878]);
      }, _doProcessBlock: function(e4, t4) {
        for (var n3 = 0; n3 < 16; n3++) {
          var s3 = t4 + n3, r3 = e4[s3];
          e4[s3] = 16711935 & (r3 << 8 | r3 >>> 24) | 4278255360 & (r3 << 24 | r3 >>> 8);
        }
        var i3 = this._hash.words, o3 = e4[t4 + 0], c3 = e4[t4 + 1], p2 = e4[t4 + 2], f2 = e4[t4 + 3], g2 = e4[t4 + 4], m2 = e4[t4 + 5], y2 = e4[t4 + 6], _2 = e4[t4 + 7], w2 = e4[t4 + 8], v2 = e4[t4 + 9], I2 = e4[t4 + 10], S2 = e4[t4 + 11], b2 = e4[t4 + 12], k2 = e4[t4 + 13], A2 = e4[t4 + 14], C2 = e4[t4 + 15], P2 = i3[0], T2 = i3[1], x2 = i3[2], O2 = i3[3];
        P2 = u2(P2, T2, x2, O2, o3, 7, a2[0]), O2 = u2(O2, P2, T2, x2, c3, 12, a2[1]), x2 = u2(x2, O2, P2, T2, p2, 17, a2[2]), T2 = u2(T2, x2, O2, P2, f2, 22, a2[3]), P2 = u2(P2, T2, x2, O2, g2, 7, a2[4]), O2 = u2(O2, P2, T2, x2, m2, 12, a2[5]), x2 = u2(x2, O2, P2, T2, y2, 17, a2[6]), T2 = u2(T2, x2, O2, P2, _2, 22, a2[7]), P2 = u2(P2, T2, x2, O2, w2, 7, a2[8]), O2 = u2(O2, P2, T2, x2, v2, 12, a2[9]), x2 = u2(x2, O2, P2, T2, I2, 17, a2[10]), T2 = u2(T2, x2, O2, P2, S2, 22, a2[11]), P2 = u2(P2, T2, x2, O2, b2, 7, a2[12]), O2 = u2(O2, P2, T2, x2, k2, 12, a2[13]), x2 = u2(x2, O2, P2, T2, A2, 17, a2[14]), P2 = l2(P2, T2 = u2(T2, x2, O2, P2, C2, 22, a2[15]), x2, O2, c3, 5, a2[16]), O2 = l2(O2, P2, T2, x2, y2, 9, a2[17]), x2 = l2(x2, O2, P2, T2, S2, 14, a2[18]), T2 = l2(T2, x2, O2, P2, o3, 20, a2[19]), P2 = l2(P2, T2, x2, O2, m2, 5, a2[20]), O2 = l2(O2, P2, T2, x2, I2, 9, a2[21]), x2 = l2(x2, O2, P2, T2, C2, 14, a2[22]), T2 = l2(T2, x2, O2, P2, g2, 20, a2[23]), P2 = l2(P2, T2, x2, O2, v2, 5, a2[24]), O2 = l2(O2, P2, T2, x2, A2, 9, a2[25]), x2 = l2(x2, O2, P2, T2, f2, 14, a2[26]), T2 = l2(T2, x2, O2, P2, w2, 20, a2[27]), P2 = l2(P2, T2, x2, O2, k2, 5, a2[28]), O2 = l2(O2, P2, T2, x2, p2, 9, a2[29]), x2 = l2(x2, O2, P2, T2, _2, 14, a2[30]), P2 = h2(P2, T2 = l2(T2, x2, O2, P2, b2, 20, a2[31]), x2, O2, m2, 4, a2[32]), O2 = h2(O2, P2, T2, x2, w2, 11, a2[33]), x2 = h2(x2, O2, P2, T2, S2, 16, a2[34]), T2 = h2(T2, x2, O2, P2, A2, 23, a2[35]), P2 = h2(P2, T2, x2, O2, c3, 4, a2[36]), O2 = h2(O2, P2, T2, x2, g2, 11, a2[37]), x2 = h2(x2, O2, P2, T2, _2, 16, a2[38]), T2 = h2(T2, x2, O2, P2, I2, 23, a2[39]), P2 = h2(P2, T2, x2, O2, k2, 4, a2[40]), O2 = h2(O2, P2, T2, x2, o3, 11, a2[41]), x2 = h2(x2, O2, P2, T2, f2, 16, a2[42]), T2 = h2(T2, x2, O2, P2, y2, 23, a2[43]), P2 = h2(P2, T2, x2, O2, v2, 4, a2[44]), O2 = h2(O2, P2, T2, x2, b2, 11, a2[45]), x2 = h2(x2, O2, P2, T2, C2, 16, a2[46]), P2 = d2(P2, T2 = h2(T2, x2, O2, P2, p2, 23, a2[47]), x2, O2, o3, 6, a2[48]), O2 = d2(O2, P2, T2, x2, _2, 10, a2[49]), x2 = d2(x2, O2, P2, T2, A2, 15, a2[50]), T2 = d2(T2, x2, O2, P2, m2, 21, a2[51]), P2 = d2(P2, T2, x2, O2, b2, 6, a2[52]), O2 = d2(O2, P2, T2, x2, f2, 10, a2[53]), x2 = d2(x2, O2, P2, T2, I2, 15, a2[54]), T2 = d2(T2, x2, O2, P2, c3, 21, a2[55]), P2 = d2(P2, T2, x2, O2, w2, 6, a2[56]), O2 = d2(O2, P2, T2, x2, C2, 10, a2[57]), x2 = d2(x2, O2, P2, T2, y2, 15, a2[58]), T2 = d2(T2, x2, O2, P2, k2, 21, a2[59]), P2 = d2(P2, T2, x2, O2, g2, 6, a2[60]), O2 = d2(O2, P2, T2, x2, S2, 10, a2[61]), x2 = d2(x2, O2, P2, T2, p2, 15, a2[62]), T2 = d2(T2, x2, O2, P2, v2, 21, a2[63]), i3[0] = i3[0] + P2 | 0, i3[1] = i3[1] + T2 | 0, i3[2] = i3[2] + x2 | 0, i3[3] = i3[3] + O2 | 0;
      }, _doFinalize: function() {
        var t4 = this._data, n3 = t4.words, s3 = 8 * this._nDataBytes, r3 = 8 * t4.sigBytes;
        n3[r3 >>> 5] |= 128 << 24 - r3 % 32;
        var i3 = e3.floor(s3 / 4294967296), o3 = s3;
        n3[15 + (r3 + 64 >>> 9 << 4)] = 16711935 & (i3 << 8 | i3 >>> 24) | 4278255360 & (i3 << 24 | i3 >>> 8), n3[14 + (r3 + 64 >>> 9 << 4)] = 16711935 & (o3 << 8 | o3 >>> 24) | 4278255360 & (o3 << 24 | o3 >>> 8), t4.sigBytes = 4 * (n3.length + 1), this._process();
        for (var a3 = this._hash, c3 = a3.words, u3 = 0; u3 < 4; u3++) {
          var l3 = c3[u3];
          c3[u3] = 16711935 & (l3 << 8 | l3 >>> 24) | 4278255360 & (l3 << 24 | l3 >>> 8);
        }
        return a3;
      }, clone: function() {
        var e4 = i2.clone.call(this);
        return e4._hash = this._hash.clone(), e4;
      } });
      function u2(e4, t4, n3, s3, r3, i3, o3) {
        var a3 = e4 + (t4 & n3 | ~t4 & s3) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      function l2(e4, t4, n3, s3, r3, i3, o3) {
        var a3 = e4 + (t4 & s3 | n3 & ~s3) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      function h2(e4, t4, n3, s3, r3, i3, o3) {
        var a3 = e4 + (t4 ^ n3 ^ s3) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      function d2(e4, t4, n3, s3, r3, i3, o3) {
        var a3 = e4 + (n3 ^ (t4 | ~s3)) + r3 + o3;
        return (a3 << i3 | a3 >>> 32 - i3) + t4;
      }
      t3.MD5 = i2._createHelper(c2), t3.HmacMD5 = i2._createHmacHelper(c2);
    }(Math), n2.MD5);
  }), n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = r, void function() {
      var e3 = n2, t3 = e3.lib.Base, s2 = e3.enc.Utf8;
      e3.algo.HMAC = t3.extend({ init: function(e4, t4) {
        e4 = this._hasher = new e4.init(), "string" == typeof t4 && (t4 = s2.parse(t4));
        var n3 = e4.blockSize, r2 = 4 * n3;
        t4.sigBytes > r2 && (t4 = e4.finalize(t4)), t4.clamp();
        for (var i2 = this._oKey = t4.clone(), o2 = this._iKey = t4.clone(), a2 = i2.words, c2 = o2.words, u2 = 0; u2 < n3; u2++)
          a2[u2] ^= 1549556828, c2[u2] ^= 909522486;
        i2.sigBytes = o2.sigBytes = r2, this.reset();
      }, reset: function() {
        var e4 = this._hasher;
        e4.reset(), e4.update(this._iKey);
      }, update: function(e4) {
        return this._hasher.update(e4), this;
      }, finalize: function(e4) {
        var t4 = this._hasher, n3 = t4.finalize(e4);
        return t4.reset(), t4.finalize(this._oKey.clone().concat(n3));
      } });
    }());
  }), n(function(e2, t2) {
    e2.exports = r.HmacMD5;
  })), o = n(function(e2, t2) {
    e2.exports = r.enc.Utf8;
  }), a = n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = r, function() {
      var e3 = n2, t3 = e3.lib.WordArray;
      function s2(e4, n3, s3) {
        for (var r2 = [], i2 = 0, o2 = 0; o2 < n3; o2++)
          if (o2 % 4) {
            var a2 = s3[e4.charCodeAt(o2 - 1)] << o2 % 4 * 2, c2 = s3[e4.charCodeAt(o2)] >>> 6 - o2 % 4 * 2;
            r2[i2 >>> 2] |= (a2 | c2) << 24 - i2 % 4 * 8, i2++;
          }
        return t3.create(r2, i2);
      }
      e3.enc.Base64 = { stringify: function(e4) {
        var t4 = e4.words, n3 = e4.sigBytes, s3 = this._map;
        e4.clamp();
        for (var r2 = [], i2 = 0; i2 < n3; i2 += 3)
          for (var o2 = (t4[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255) << 16 | (t4[i2 + 1 >>> 2] >>> 24 - (i2 + 1) % 4 * 8 & 255) << 8 | t4[i2 + 2 >>> 2] >>> 24 - (i2 + 2) % 4 * 8 & 255, a2 = 0; a2 < 4 && i2 + 0.75 * a2 < n3; a2++)
            r2.push(s3.charAt(o2 >>> 6 * (3 - a2) & 63));
        var c2 = s3.charAt(64);
        if (c2)
          for (; r2.length % 4; )
            r2.push(c2);
        return r2.join("");
      }, parse: function(e4) {
        var t4 = e4.length, n3 = this._map, r2 = this._reverseMap;
        if (!r2) {
          r2 = this._reverseMap = [];
          for (var i2 = 0; i2 < n3.length; i2++)
            r2[n3.charCodeAt(i2)] = i2;
        }
        var o2 = n3.charAt(64);
        if (o2) {
          var a2 = e4.indexOf(o2);
          -1 !== a2 && (t4 = a2);
        }
        return s2(e4, t4, r2);
      }, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" };
    }(), n2.enc.Base64);
  });
  const c = "FUNCTION", u = "OBJECT", l = "CLIENT_DB", h = "pending", d = "fulfilled", p = "rejected";
  function f(e2) {
    return Object.prototype.toString.call(e2).slice(8, -1).toLowerCase();
  }
  function g(e2) {
    return "object" === f(e2);
  }
  function m(e2) {
    return "function" == typeof e2;
  }
  function y(e2) {
    return function() {
      try {
        return e2.apply(e2, arguments);
      } catch (e3) {
        console.error(e3);
      }
    };
  }
  const _ = "REJECTED", w = "NOT_PENDING";
  class v {
    constructor({ createPromise: e2, retryRule: t2 = _ } = {}) {
      this.createPromise = e2, this.status = null, this.promise = null, this.retryRule = t2;
    }
    get needRetry() {
      if (!this.status)
        return true;
      switch (this.retryRule) {
        case _:
          return this.status === p;
        case w:
          return this.status !== h;
      }
    }
    exec() {
      return this.needRetry ? (this.status = h, this.promise = this.createPromise().then((e2) => (this.status = d, Promise.resolve(e2)), (e2) => (this.status = p, Promise.reject(e2))), this.promise) : this.promise;
    }
  }
  function I(e2) {
    return e2 && "string" == typeof e2 ? JSON.parse(e2) : e2;
  }
  const S = true, b = "app", A = I(define_process_env_UNI_SECURE_NETWORK_CONFIG_default), C = b, P = I(""), T = I("[]") || [];
  let O = "";
  try {
    O = "__UNI__D000952";
  } catch (e2) {
  }
  let E = {};
  function L(e2, t2 = {}) {
    var n2, s2;
    return n2 = E, s2 = e2, Object.prototype.hasOwnProperty.call(n2, s2) || (E[e2] = t2), E[e2];
  }
  E = uni._globalUniCloudObj ? uni._globalUniCloudObj : uni._globalUniCloudObj = {};
  const R = ["invoke", "success", "fail", "complete"], U = L("_globalUniCloudInterceptor");
  function N(e2, t2) {
    U[e2] || (U[e2] = {}), g(t2) && Object.keys(t2).forEach((n2) => {
      R.indexOf(n2) > -1 && function(e3, t3, n3) {
        let s2 = U[e3][t3];
        s2 || (s2 = U[e3][t3] = []), -1 === s2.indexOf(n3) && m(n3) && s2.push(n3);
      }(e2, n2, t2[n2]);
    });
  }
  function D(e2, t2) {
    U[e2] || (U[e2] = {}), g(t2) ? Object.keys(t2).forEach((n2) => {
      R.indexOf(n2) > -1 && function(e3, t3, n3) {
        const s2 = U[e3][t3];
        if (!s2)
          return;
        const r2 = s2.indexOf(n3);
        r2 > -1 && s2.splice(r2, 1);
      }(e2, n2, t2[n2]);
    }) : delete U[e2];
  }
  function M(e2, t2) {
    return e2 && 0 !== e2.length ? e2.reduce((e3, n2) => e3.then(() => n2(t2)), Promise.resolve()) : Promise.resolve();
  }
  function q(e2, t2) {
    return U[e2] && U[e2][t2] || [];
  }
  function F(e2) {
    N("callObject", e2);
  }
  const K = L("_globalUniCloudListener"), j = "response", $ = "needLogin", B = "refreshToken", W = "clientdb", H = "cloudfunction", J = "cloudobject";
  function z(e2) {
    return K[e2] || (K[e2] = []), K[e2];
  }
  function V(e2, t2) {
    const n2 = z(e2);
    n2.includes(t2) || n2.push(t2);
  }
  function G(e2, t2) {
    const n2 = z(e2), s2 = n2.indexOf(t2);
    -1 !== s2 && n2.splice(s2, 1);
  }
  function Y(e2, t2) {
    const n2 = z(e2);
    for (let e3 = 0; e3 < n2.length; e3++) {
      (0, n2[e3])(t2);
    }
  }
  let Q, X = false;
  function Z() {
    return Q || (Q = new Promise((e2) => {
      X && e2(), function t2() {
        if ("function" == typeof getCurrentPages) {
          const t3 = getCurrentPages();
          t3 && t3[0] && (X = true, e2());
        }
        X || setTimeout(() => {
          t2();
        }, 30);
      }();
    }), Q);
  }
  function ee(e2) {
    const t2 = {};
    for (const n2 in e2) {
      const s2 = e2[n2];
      m(s2) && (t2[n2] = y(s2));
    }
    return t2;
  }
  class te extends Error {
    constructor(e2) {
      super(e2.message), this.errMsg = e2.message || e2.errMsg || "unknown system error", this.code = this.errCode = e2.code || e2.errCode || "SYSTEM_ERROR", this.errSubject = this.subject = e2.subject || e2.errSubject, this.cause = e2.cause, this.requestId = e2.requestId;
    }
    toJson(e2 = 0) {
      if (!(e2 >= 10))
        return e2++, { errCode: this.errCode, errMsg: this.errMsg, errSubject: this.errSubject, cause: this.cause && this.cause.toJson ? this.cause.toJson(e2) : this.cause };
    }
  }
  var ne = { request: (e2) => uni.request(e2), uploadFile: (e2) => uni.uploadFile(e2), setStorageSync: (e2, t2) => uni.setStorageSync(e2, t2), getStorageSync: (e2) => uni.getStorageSync(e2), removeStorageSync: (e2) => uni.removeStorageSync(e2), clearStorageSync: () => uni.clearStorageSync(), connectSocket: (e2) => uni.connectSocket(e2) };
  function se(e2) {
    return e2 && se(e2.__v_raw) || e2;
  }
  function re() {
    return { token: ne.getStorageSync("uni_id_token") || ne.getStorageSync("uniIdToken"), tokenExpired: ne.getStorageSync("uni_id_token_expired") };
  }
  function ie({ token: e2, tokenExpired: t2 } = {}) {
    e2 && ne.setStorageSync("uni_id_token", e2), t2 && ne.setStorageSync("uni_id_token_expired", t2);
  }
  let oe, ae;
  function ce() {
    return oe || (oe = uni.getSystemInfoSync()), oe;
  }
  function ue() {
    let e2, t2;
    try {
      if (uni.getLaunchOptionsSync) {
        if (uni.getLaunchOptionsSync.toString().indexOf("not yet implemented") > -1)
          return;
        const { scene: n2, channel: s2 } = uni.getLaunchOptionsSync();
        e2 = s2, t2 = n2;
      }
    } catch (e3) {
    }
    return { channel: e2, scene: t2 };
  }
  let le = {};
  function he() {
    const e2 = uni.getLocale && uni.getLocale() || "en";
    if (ae)
      return { ...le, ...ae, locale: e2, LOCALE: e2 };
    const t2 = ce(), { deviceId: n2, osName: s2, uniPlatform: r2, appId: i2 } = t2, o2 = ["appId", "appLanguage", "appName", "appVersion", "appVersionCode", "appWgtVersion", "browserName", "browserVersion", "deviceBrand", "deviceId", "deviceModel", "deviceType", "osName", "osVersion", "romName", "romVersion", "ua", "hostName", "hostVersion", "uniPlatform", "uniRuntimeVersion", "uniRuntimeVersionCode", "uniCompilerVersion", "uniCompilerVersionCode"];
    for (const e3 in t2)
      Object.hasOwnProperty.call(t2, e3) && -1 === o2.indexOf(e3) && delete t2[e3];
    return ae = { PLATFORM: r2, OS: s2, APPID: i2, DEVICEID: n2, ...ue(), ...t2 }, { ...le, ...ae, locale: e2, LOCALE: e2 };
  }
  var de = { sign: function(e2, t2) {
    let n2 = "";
    return Object.keys(e2).sort().forEach(function(t3) {
      e2[t3] && (n2 = n2 + "&" + t3 + "=" + e2[t3]);
    }), n2 = n2.slice(1), i(n2, t2).toString();
  }, wrappedRequest: function(e2, t2) {
    return new Promise((n2, s2) => {
      t2(Object.assign(e2, { complete(e3) {
        e3 || (e3 = {});
        const t3 = e3.data && e3.data.header && e3.data.header["x-serverless-request-id"] || e3.header && e3.header["request-id"];
        if (!e3.statusCode || e3.statusCode >= 400) {
          const n3 = e3.data && e3.data.error && e3.data.error.code || "SYS_ERR", r3 = e3.data && e3.data.error && e3.data.error.message || e3.errMsg || "request:fail";
          return s2(new te({ code: n3, message: r3, requestId: t3 }));
        }
        const r2 = e3.data;
        if (r2.error)
          return s2(new te({ code: r2.error.code, message: r2.error.message, requestId: t3 }));
        r2.result = r2.data, r2.requestId = t3, delete r2.data, n2(r2);
      } }));
    });
  }, toBase64: function(e2) {
    return a.stringify(o.parse(e2));
  } };
  var pe = class {
    constructor(e2) {
      ["spaceId", "clientSecret"].forEach((t2) => {
        if (!Object.prototype.hasOwnProperty.call(e2, t2))
          throw new Error(`${t2} required`);
      }), this.config = Object.assign({}, { endpoint: 0 === e2.spaceId.indexOf("mp-") ? "https://api.next.bspapp.com" : "https://api.bspapp.com" }, e2), this.config.provider = "aliyun", this.config.requestUrl = this.config.endpoint + "/client", this.config.envType = this.config.envType || "public", this.config.accessTokenKey = "access_token_" + this.config.spaceId, this.adapter = ne, this._getAccessTokenPromiseHub = new v({ createPromise: () => this.requestAuth(this.setupRequest({ method: "serverless.auth.user.anonymousAuthorize", params: "{}" }, "auth")).then((e3) => {
        if (!e3.result || !e3.result.accessToken)
          throw new te({ code: "AUTH_FAILED", message: "获取accessToken失败" });
        this.setAccessToken(e3.result.accessToken);
      }), retryRule: w });
    }
    get hasAccessToken() {
      return !!this.accessToken;
    }
    setAccessToken(e2) {
      this.accessToken = e2;
    }
    requestWrapped(e2) {
      return de.wrappedRequest(e2, this.adapter.request);
    }
    requestAuth(e2) {
      return this.requestWrapped(e2);
    }
    request(e2, t2) {
      return Promise.resolve().then(() => this.hasAccessToken ? t2 ? this.requestWrapped(e2) : this.requestWrapped(e2).catch((t3) => new Promise((e3, n2) => {
        !t3 || "GATEWAY_INVALID_TOKEN" !== t3.code && "InvalidParameter.InvalidToken" !== t3.code ? n2(t3) : e3();
      }).then(() => this.getAccessToken()).then(() => {
        const t4 = this.rebuildRequest(e2);
        return this.request(t4, true);
      })) : this.getAccessToken().then(() => {
        const t3 = this.rebuildRequest(e2);
        return this.request(t3, true);
      }));
    }
    rebuildRequest(e2) {
      const t2 = Object.assign({}, e2);
      return t2.data.token = this.accessToken, t2.header["x-basement-token"] = this.accessToken, t2.header["x-serverless-sign"] = de.sign(t2.data, this.config.clientSecret), t2;
    }
    setupRequest(e2, t2) {
      const n2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now() }), s2 = { "Content-Type": "application/json" };
      return "auth" !== t2 && (n2.token = this.accessToken, s2["x-basement-token"] = this.accessToken), s2["x-serverless-sign"] = de.sign(n2, this.config.clientSecret), { url: this.config.requestUrl, method: "POST", data: n2, dataType: "json", header: s2 };
    }
    getAccessToken() {
      return this._getAccessTokenPromiseHub.exec();
    }
    async authorize() {
      await this.getAccessToken();
    }
    callFunction(e2) {
      const t2 = { method: "serverless.function.runtime.invoke", params: JSON.stringify({ functionTarget: e2.name, functionArgs: e2.data || {} }) };
      return this.request({ ...this.setupRequest(t2), timeout: e2.timeout });
    }
    getOSSUploadOptionsFromPath(e2) {
      const t2 = { method: "serverless.file.resource.generateProximalSign", params: JSON.stringify(e2) };
      return this.request(this.setupRequest(t2));
    }
    uploadFileToOSS({ url: e2, formData: t2, name: n2, filePath: s2, fileType: r2, onUploadProgress: i2 }) {
      return new Promise((o2, a2) => {
        const c2 = this.adapter.uploadFile({ url: e2, formData: t2, name: n2, filePath: s2, fileType: r2, header: { "X-OSS-server-side-encrpytion": "AES256" }, success(e3) {
          e3 && e3.statusCode < 400 ? o2(e3) : a2(new te({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
        }, fail(e3) {
          a2(new te({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "文件上传失败" }));
        } });
        "function" == typeof i2 && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((e3) => {
          i2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
        });
      });
    }
    reportOSSUpload(e2) {
      const t2 = { method: "serverless.file.resource.report", params: JSON.stringify(e2) };
      return this.request(this.setupRequest(t2));
    }
    async uploadFile({ filePath: e2, cloudPath: t2, fileType: n2 = "image", cloudPathAsRealPath: s2 = false, onUploadProgress: r2, config: i2 }) {
      if ("string" !== f(t2))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath必须为字符串类型" });
      if (!(t2 = t2.trim()))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath不可为空" });
      if (/:\/\//.test(t2))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath不合法" });
      const o2 = i2 && i2.envType || this.config.envType;
      if (s2 && ("/" !== t2[0] && (t2 = "/" + t2), t2.indexOf("\\") > -1))
        throw new te({ code: "INVALID_PARAM", message: "使用cloudPath作为路径时，cloudPath不可包含“\\”" });
      const a2 = (await this.getOSSUploadOptionsFromPath({ env: o2, filename: s2 ? t2.split("/").pop() : t2, fileId: s2 ? t2 : void 0 })).result, c2 = "https://" + a2.cdnDomain + "/" + a2.ossPath, { securityToken: u2, accessKeyId: l2, signature: h2, host: d2, ossPath: p2, id: g2, policy: m2, ossCallbackUrl: y2 } = a2, _2 = { "Cache-Control": "max-age=2592000", "Content-Disposition": "attachment", OSSAccessKeyId: l2, Signature: h2, host: d2, id: g2, key: p2, policy: m2, success_action_status: 200 };
      if (u2 && (_2["x-oss-security-token"] = u2), y2) {
        const e3 = JSON.stringify({ callbackUrl: y2, callbackBody: JSON.stringify({ fileId: g2, spaceId: this.config.spaceId }), callbackBodyType: "application/json" });
        _2.callback = de.toBase64(e3);
      }
      const w2 = { url: "https://" + a2.host, formData: _2, fileName: "file", name: "file", filePath: e2, fileType: n2 };
      if (await this.uploadFileToOSS(Object.assign({}, w2, { onUploadProgress: r2 })), y2)
        return { success: true, filePath: e2, fileID: c2 };
      if ((await this.reportOSSUpload({ id: g2 })).success)
        return { success: true, filePath: e2, fileID: c2 };
      throw new te({ code: "UPLOAD_FAILED", message: "文件上传失败" });
    }
    getTempFileURL({ fileList: e2 } = {}) {
      return new Promise((t2, n2) => {
        Array.isArray(e2) && 0 !== e2.length || n2(new te({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" })), t2({ fileList: e2.map((e3) => ({ fileID: e3, tempFileURL: e3 })) });
      });
    }
    async getFileInfo({ fileList: e2 } = {}) {
      if (!Array.isArray(e2) || 0 === e2.length)
        throw new te({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" });
      const t2 = { method: "serverless.file.resource.info", params: JSON.stringify({ id: e2.map((e3) => e3.split("?")[0]).join(",") }) };
      return { fileList: (await this.request(this.setupRequest(t2))).result };
    }
  };
  var fe = { init(e2) {
    const t2 = new pe(e2), n2 = { signInAnonymously: function() {
      return t2.authorize();
    }, getLoginState: function() {
      return Promise.resolve(false);
    } };
    return t2.auth = function() {
      return n2;
    }, t2.customAuth = t2.auth, t2;
  } };
  const ge = "undefined" != typeof location && "http:" === location.protocol ? "http:" : "https:";
  var me;
  !function(e2) {
    e2.local = "local", e2.none = "none", e2.session = "session";
  }(me || (me = {}));
  var ye = function() {
  }, _e = n(function(e2, t2) {
    var n2;
    e2.exports = (n2 = r, function(e3) {
      var t3 = n2, s2 = t3.lib, r2 = s2.WordArray, i2 = s2.Hasher, o2 = t3.algo, a2 = [], c2 = [];
      !function() {
        function t4(t5) {
          for (var n4 = e3.sqrt(t5), s4 = 2; s4 <= n4; s4++)
            if (!(t5 % s4))
              return false;
          return true;
        }
        function n3(e4) {
          return 4294967296 * (e4 - (0 | e4)) | 0;
        }
        for (var s3 = 2, r3 = 0; r3 < 64; )
          t4(s3) && (r3 < 8 && (a2[r3] = n3(e3.pow(s3, 0.5))), c2[r3] = n3(e3.pow(s3, 1 / 3)), r3++), s3++;
      }();
      var u2 = [], l2 = o2.SHA256 = i2.extend({ _doReset: function() {
        this._hash = new r2.init(a2.slice(0));
      }, _doProcessBlock: function(e4, t4) {
        for (var n3 = this._hash.words, s3 = n3[0], r3 = n3[1], i3 = n3[2], o3 = n3[3], a3 = n3[4], l3 = n3[5], h2 = n3[6], d2 = n3[7], p2 = 0; p2 < 64; p2++) {
          if (p2 < 16)
            u2[p2] = 0 | e4[t4 + p2];
          else {
            var f2 = u2[p2 - 15], g2 = (f2 << 25 | f2 >>> 7) ^ (f2 << 14 | f2 >>> 18) ^ f2 >>> 3, m2 = u2[p2 - 2], y2 = (m2 << 15 | m2 >>> 17) ^ (m2 << 13 | m2 >>> 19) ^ m2 >>> 10;
            u2[p2] = g2 + u2[p2 - 7] + y2 + u2[p2 - 16];
          }
          var _2 = s3 & r3 ^ s3 & i3 ^ r3 & i3, w2 = (s3 << 30 | s3 >>> 2) ^ (s3 << 19 | s3 >>> 13) ^ (s3 << 10 | s3 >>> 22), v2 = d2 + ((a3 << 26 | a3 >>> 6) ^ (a3 << 21 | a3 >>> 11) ^ (a3 << 7 | a3 >>> 25)) + (a3 & l3 ^ ~a3 & h2) + c2[p2] + u2[p2];
          d2 = h2, h2 = l3, l3 = a3, a3 = o3 + v2 | 0, o3 = i3, i3 = r3, r3 = s3, s3 = v2 + (w2 + _2) | 0;
        }
        n3[0] = n3[0] + s3 | 0, n3[1] = n3[1] + r3 | 0, n3[2] = n3[2] + i3 | 0, n3[3] = n3[3] + o3 | 0, n3[4] = n3[4] + a3 | 0, n3[5] = n3[5] + l3 | 0, n3[6] = n3[6] + h2 | 0, n3[7] = n3[7] + d2 | 0;
      }, _doFinalize: function() {
        var t4 = this._data, n3 = t4.words, s3 = 8 * this._nDataBytes, r3 = 8 * t4.sigBytes;
        return n3[r3 >>> 5] |= 128 << 24 - r3 % 32, n3[14 + (r3 + 64 >>> 9 << 4)] = e3.floor(s3 / 4294967296), n3[15 + (r3 + 64 >>> 9 << 4)] = s3, t4.sigBytes = 4 * n3.length, this._process(), this._hash;
      }, clone: function() {
        var e4 = i2.clone.call(this);
        return e4._hash = this._hash.clone(), e4;
      } });
      t3.SHA256 = i2._createHelper(l2), t3.HmacSHA256 = i2._createHmacHelper(l2);
    }(Math), n2.SHA256);
  }), we = _e, ve = n(function(e2, t2) {
    e2.exports = r.HmacSHA256;
  });
  const Ie = () => {
    let e2;
    if (!Promise) {
      e2 = () => {
      }, e2.promise = {};
      const t3 = () => {
        throw new te({ message: 'Your Node runtime does support ES6 Promises. Set "global.Promise" to your preferred implementation of promises.' });
      };
      return Object.defineProperty(e2.promise, "then", { get: t3 }), Object.defineProperty(e2.promise, "catch", { get: t3 }), e2;
    }
    const t2 = new Promise((t3, n2) => {
      e2 = (e3, s2) => e3 ? n2(e3) : t3(s2);
    });
    return e2.promise = t2, e2;
  };
  function Se(e2) {
    return void 0 === e2;
  }
  function be(e2) {
    return "[object Null]" === Object.prototype.toString.call(e2);
  }
  var ke;
  function Ae(e2) {
    const t2 = (n2 = e2, "[object Array]" === Object.prototype.toString.call(n2) ? e2 : [e2]);
    var n2;
    for (const e3 of t2) {
      const { isMatch: t3, genAdapter: n3, runtime: s2 } = e3;
      if (t3())
        return { adapter: n3(), runtime: s2 };
    }
  }
  !function(e2) {
    e2.WEB = "web", e2.WX_MP = "wx_mp";
  }(ke || (ke = {}));
  const Ce = { adapter: null, runtime: void 0 }, Pe = ["anonymousUuidKey"];
  class Te extends ye {
    constructor() {
      super(), Ce.adapter.root.tcbObject || (Ce.adapter.root.tcbObject = {});
    }
    setItem(e2, t2) {
      Ce.adapter.root.tcbObject[e2] = t2;
    }
    getItem(e2) {
      return Ce.adapter.root.tcbObject[e2];
    }
    removeItem(e2) {
      delete Ce.adapter.root.tcbObject[e2];
    }
    clear() {
      delete Ce.adapter.root.tcbObject;
    }
  }
  function xe(e2, t2) {
    switch (e2) {
      case "local":
        return t2.localStorage || new Te();
      case "none":
        return new Te();
      default:
        return t2.sessionStorage || new Te();
    }
  }
  class Oe {
    constructor(e2) {
      if (!this._storage) {
        this._persistence = Ce.adapter.primaryStorage || e2.persistence, this._storage = xe(this._persistence, Ce.adapter);
        const t2 = `access_token_${e2.env}`, n2 = `access_token_expire_${e2.env}`, s2 = `refresh_token_${e2.env}`, r2 = `anonymous_uuid_${e2.env}`, i2 = `login_type_${e2.env}`, o2 = `user_info_${e2.env}`;
        this.keys = { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2, anonymousUuidKey: r2, loginTypeKey: i2, userInfoKey: o2 };
      }
    }
    updatePersistence(e2) {
      if (e2 === this._persistence)
        return;
      const t2 = "local" === this._persistence;
      this._persistence = e2;
      const n2 = xe(e2, Ce.adapter);
      for (const e3 in this.keys) {
        const s2 = this.keys[e3];
        if (t2 && Pe.includes(e3))
          continue;
        const r2 = this._storage.getItem(s2);
        Se(r2) || be(r2) || (n2.setItem(s2, r2), this._storage.removeItem(s2));
      }
      this._storage = n2;
    }
    setStore(e2, t2, n2) {
      if (!this._storage)
        return;
      const s2 = { version: n2 || "localCachev1", content: t2 }, r2 = JSON.stringify(s2);
      try {
        this._storage.setItem(e2, r2);
      } catch (e3) {
        throw e3;
      }
    }
    getStore(e2, t2) {
      try {
        if (!this._storage)
          return;
      } catch (e3) {
        return "";
      }
      t2 = t2 || "localCachev1";
      const n2 = this._storage.getItem(e2);
      if (!n2)
        return "";
      if (n2.indexOf(t2) >= 0) {
        return JSON.parse(n2).content;
      }
      return "";
    }
    removeStore(e2) {
      this._storage.removeItem(e2);
    }
  }
  const Ee = {}, Le = {};
  function Re(e2) {
    return Ee[e2];
  }
  class Ue {
    constructor(e2, t2) {
      this.data = t2 || null, this.name = e2;
    }
  }
  class Ne extends Ue {
    constructor(e2, t2) {
      super("error", { error: e2, data: t2 }), this.error = e2;
    }
  }
  const De = new class {
    constructor() {
      this._listeners = {};
    }
    on(e2, t2) {
      return function(e3, t3, n2) {
        n2[e3] = n2[e3] || [], n2[e3].push(t3);
      }(e2, t2, this._listeners), this;
    }
    off(e2, t2) {
      return function(e3, t3, n2) {
        if (n2 && n2[e3]) {
          const s2 = n2[e3].indexOf(t3);
          -1 !== s2 && n2[e3].splice(s2, 1);
        }
      }(e2, t2, this._listeners), this;
    }
    fire(e2, t2) {
      if (e2 instanceof Ne)
        return console.error(e2.error), this;
      const n2 = "string" == typeof e2 ? new Ue(e2, t2 || {}) : e2;
      const s2 = n2.name;
      if (this._listens(s2)) {
        n2.target = this;
        const e3 = this._listeners[s2] ? [...this._listeners[s2]] : [];
        for (const t3 of e3)
          t3.call(this, n2);
      }
      return this;
    }
    _listens(e2) {
      return this._listeners[e2] && this._listeners[e2].length > 0;
    }
  }();
  function Me(e2, t2) {
    De.on(e2, t2);
  }
  function qe(e2, t2 = {}) {
    De.fire(e2, t2);
  }
  function Fe(e2, t2) {
    De.off(e2, t2);
  }
  const Ke = "loginStateChanged", je = "loginStateExpire", $e = "loginTypeChanged", Be = "anonymousConverted", We = "refreshAccessToken";
  var He;
  !function(e2) {
    e2.ANONYMOUS = "ANONYMOUS", e2.WECHAT = "WECHAT", e2.WECHAT_PUBLIC = "WECHAT-PUBLIC", e2.WECHAT_OPEN = "WECHAT-OPEN", e2.CUSTOM = "CUSTOM", e2.EMAIL = "EMAIL", e2.USERNAME = "USERNAME", e2.NULL = "NULL";
  }(He || (He = {}));
  const Je = ["auth.getJwt", "auth.logout", "auth.signInWithTicket", "auth.signInAnonymously", "auth.signIn", "auth.fetchAccessTokenWithRefreshToken", "auth.signUpWithEmailAndPassword", "auth.activateEndUserMail", "auth.sendPasswordResetEmail", "auth.resetPasswordWithToken", "auth.isUsernameRegistered"], ze = { "X-SDK-Version": "1.3.5" };
  function Ve(e2, t2, n2) {
    const s2 = e2[t2];
    e2[t2] = function(t3) {
      const r2 = {}, i2 = {};
      n2.forEach((n3) => {
        const { data: s3, headers: o3 } = n3.call(e2, t3);
        Object.assign(r2, s3), Object.assign(i2, o3);
      });
      const o2 = t3.data;
      return o2 && (() => {
        var e3;
        if (e3 = o2, "[object FormData]" !== Object.prototype.toString.call(e3))
          t3.data = { ...o2, ...r2 };
        else
          for (const e4 in r2)
            o2.append(e4, r2[e4]);
      })(), t3.headers = { ...t3.headers || {}, ...i2 }, s2.call(e2, t3);
    };
  }
  function Ge() {
    const e2 = Math.random().toString(16).slice(2);
    return { data: { seqId: e2 }, headers: { ...ze, "x-seqid": e2 } };
  }
  class Ye {
    constructor(e2 = {}) {
      var t2;
      this.config = e2, this._reqClass = new Ce.adapter.reqClass({ timeout: this.config.timeout, timeoutMsg: `请求在${this.config.timeout / 1e3}s内未完成，已中断`, restrictedMethods: ["post"] }), this._cache = Re(this.config.env), this._localCache = (t2 = this.config.env, Le[t2]), Ve(this._reqClass, "post", [Ge]), Ve(this._reqClass, "upload", [Ge]), Ve(this._reqClass, "download", [Ge]);
    }
    async post(e2) {
      return await this._reqClass.post(e2);
    }
    async upload(e2) {
      return await this._reqClass.upload(e2);
    }
    async download(e2) {
      return await this._reqClass.download(e2);
    }
    async refreshAccessToken() {
      let e2, t2;
      this._refreshAccessTokenPromise || (this._refreshAccessTokenPromise = this._refreshAccessToken());
      try {
        e2 = await this._refreshAccessTokenPromise;
      } catch (e3) {
        t2 = e3;
      }
      if (this._refreshAccessTokenPromise = null, this._shouldRefreshAccessTokenHook = null, t2)
        throw t2;
      return e2;
    }
    async _refreshAccessToken() {
      const { accessTokenKey: e2, accessTokenExpireKey: t2, refreshTokenKey: n2, loginTypeKey: s2, anonymousUuidKey: r2 } = this._cache.keys;
      this._cache.removeStore(e2), this._cache.removeStore(t2);
      let i2 = this._cache.getStore(n2);
      if (!i2)
        throw new te({ message: "未登录CloudBase" });
      const o2 = { refresh_token: i2 }, a2 = await this.request("auth.fetchAccessTokenWithRefreshToken", o2);
      if (a2.data.code) {
        const { code: e3 } = a2.data;
        if ("SIGN_PARAM_INVALID" === e3 || "REFRESH_TOKEN_EXPIRED" === e3 || "INVALID_REFRESH_TOKEN" === e3) {
          if (this._cache.getStore(s2) === He.ANONYMOUS && "INVALID_REFRESH_TOKEN" === e3) {
            const e4 = this._cache.getStore(r2), t3 = this._cache.getStore(n2), s3 = await this.send("auth.signInAnonymously", { anonymous_uuid: e4, refresh_token: t3 });
            return this.setRefreshToken(s3.refresh_token), this._refreshAccessToken();
          }
          qe(je), this._cache.removeStore(n2);
        }
        throw new te({ code: a2.data.code, message: `刷新access token失败：${a2.data.code}` });
      }
      if (a2.data.access_token)
        return qe(We), this._cache.setStore(e2, a2.data.access_token), this._cache.setStore(t2, a2.data.access_token_expire + Date.now()), { accessToken: a2.data.access_token, accessTokenExpire: a2.data.access_token_expire };
      a2.data.refresh_token && (this._cache.removeStore(n2), this._cache.setStore(n2, a2.data.refresh_token), this._refreshAccessToken());
    }
    async getAccessToken() {
      const { accessTokenKey: e2, accessTokenExpireKey: t2, refreshTokenKey: n2 } = this._cache.keys;
      if (!this._cache.getStore(n2))
        throw new te({ message: "refresh token不存在，登录状态异常" });
      let s2 = this._cache.getStore(e2), r2 = this._cache.getStore(t2), i2 = true;
      return this._shouldRefreshAccessTokenHook && !await this._shouldRefreshAccessTokenHook(s2, r2) && (i2 = false), (!s2 || !r2 || r2 < Date.now()) && i2 ? this.refreshAccessToken() : { accessToken: s2, accessTokenExpire: r2 };
    }
    async request(e2, t2, n2) {
      const s2 = `x-tcb-trace_${this.config.env}`;
      let r2 = "application/x-www-form-urlencoded";
      const i2 = { action: e2, env: this.config.env, dataVersion: "2019-08-16", ...t2 };
      if (-1 === Je.indexOf(e2)) {
        const { refreshTokenKey: e3 } = this._cache.keys;
        this._cache.getStore(e3) && (i2.access_token = (await this.getAccessToken()).accessToken);
      }
      let o2;
      if ("storage.uploadFile" === e2) {
        o2 = new FormData();
        for (let e3 in o2)
          o2.hasOwnProperty(e3) && void 0 !== o2[e3] && o2.append(e3, i2[e3]);
        r2 = "multipart/form-data";
      } else {
        r2 = "application/json", o2 = {};
        for (let e3 in i2)
          void 0 !== i2[e3] && (o2[e3] = i2[e3]);
      }
      let a2 = { headers: { "content-type": r2 } };
      n2 && n2.timeout && (a2.timeout = n2.timeout), n2 && n2.onUploadProgress && (a2.onUploadProgress = n2.onUploadProgress);
      const c2 = this._localCache.getStore(s2);
      c2 && (a2.headers["X-TCB-Trace"] = c2);
      const { parse: u2, inQuery: l2, search: h2 } = t2;
      let d2 = { env: this.config.env };
      u2 && (d2.parse = true), l2 && (d2 = { ...l2, ...d2 });
      let p2 = function(e3, t3, n3 = {}) {
        const s3 = /\?/.test(t3);
        let r3 = "";
        for (let e4 in n3)
          "" === r3 ? !s3 && (t3 += "?") : r3 += "&", r3 += `${e4}=${encodeURIComponent(n3[e4])}`;
        return /^http(s)?\:\/\//.test(t3 += r3) ? t3 : `${e3}${t3}`;
      }(ge, "//tcb-api.tencentcloudapi.com/web", d2);
      h2 && (p2 += h2);
      const f2 = await this.post({ url: p2, data: o2, ...a2 }), g2 = f2.header && f2.header["x-tcb-trace"];
      if (g2 && this._localCache.setStore(s2, g2), 200 !== Number(f2.status) && 200 !== Number(f2.statusCode) || !f2.data)
        throw new te({ code: "NETWORK_ERROR", message: "network request error" });
      return f2;
    }
    async send(e2, t2 = {}, n2 = {}) {
      const s2 = await this.request(e2, t2, { ...n2, onUploadProgress: t2.onUploadProgress });
      if ("ACCESS_TOKEN_EXPIRED" === s2.data.code && -1 === Je.indexOf(e2)) {
        await this.refreshAccessToken();
        const s3 = await this.request(e2, t2, { ...n2, onUploadProgress: t2.onUploadProgress });
        if (s3.data.code)
          throw new te({ code: s3.data.code, message: s3.data.message });
        return s3.data;
      }
      if (s2.data.code)
        throw new te({ code: s2.data.code, message: s2.data.message });
      return s2.data;
    }
    setRefreshToken(e2) {
      const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e2);
    }
  }
  const Qe = {};
  function Xe(e2) {
    return Qe[e2];
  }
  class Ze {
    constructor(e2) {
      this.config = e2, this._cache = Re(e2.env), this._request = Xe(e2.env);
    }
    setRefreshToken(e2) {
      const { accessTokenKey: t2, accessTokenExpireKey: n2, refreshTokenKey: s2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.removeStore(n2), this._cache.setStore(s2, e2);
    }
    setAccessToken(e2, t2) {
      const { accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys;
      this._cache.setStore(n2, e2), this._cache.setStore(s2, t2);
    }
    async refreshUserInfo() {
      const { data: e2 } = await this._request.send("auth.getUserInfo", {});
      return this.setLocalUserInfo(e2), e2;
    }
    setLocalUserInfo(e2) {
      const { userInfoKey: t2 } = this._cache.keys;
      this._cache.setStore(t2, e2);
    }
  }
  class et {
    constructor(e2) {
      if (!e2)
        throw new te({ code: "PARAM_ERROR", message: "envId is not defined" });
      this._envId = e2, this._cache = Re(this._envId), this._request = Xe(this._envId), this.setUserInfo();
    }
    linkWithTicket(e2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "ticket must be string" });
      return this._request.send("auth.linkWithTicket", { ticket: e2 });
    }
    linkWithRedirect(e2) {
      e2.signInWithRedirect();
    }
    updatePassword(e2, t2) {
      return this._request.send("auth.updatePassword", { oldPassword: t2, newPassword: e2 });
    }
    updateEmail(e2) {
      return this._request.send("auth.updateEmail", { newEmail: e2 });
    }
    updateUsername(e2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "username must be a string" });
      return this._request.send("auth.updateUsername", { username: e2 });
    }
    async getLinkedUidList() {
      const { data: e2 } = await this._request.send("auth.getLinkedUidList", {});
      let t2 = false;
      const { users: n2 } = e2;
      return n2.forEach((e3) => {
        e3.wxOpenId && e3.wxPublicId && (t2 = true);
      }), { users: n2, hasPrimaryUid: t2 };
    }
    setPrimaryUid(e2) {
      return this._request.send("auth.setPrimaryUid", { uid: e2 });
    }
    unlink(e2) {
      return this._request.send("auth.unlink", { platform: e2 });
    }
    async update(e2) {
      const { nickName: t2, gender: n2, avatarUrl: s2, province: r2, country: i2, city: o2 } = e2, { data: a2 } = await this._request.send("auth.updateUserInfo", { nickName: t2, gender: n2, avatarUrl: s2, province: r2, country: i2, city: o2 });
      this.setLocalUserInfo(a2);
    }
    async refresh() {
      const { data: e2 } = await this._request.send("auth.getUserInfo", {});
      return this.setLocalUserInfo(e2), e2;
    }
    setUserInfo() {
      const { userInfoKey: e2 } = this._cache.keys, t2 = this._cache.getStore(e2);
      ["uid", "loginType", "openid", "wxOpenId", "wxPublicId", "unionId", "qqMiniOpenId", "email", "hasPassword", "customUserId", "nickName", "gender", "avatarUrl"].forEach((e3) => {
        this[e3] = t2[e3];
      }), this.location = { country: t2.country, province: t2.province, city: t2.city };
    }
    setLocalUserInfo(e2) {
      const { userInfoKey: t2 } = this._cache.keys;
      this._cache.setStore(t2, e2), this.setUserInfo();
    }
  }
  class tt {
    constructor(e2) {
      if (!e2)
        throw new te({ code: "PARAM_ERROR", message: "envId is not defined" });
      this._cache = Re(e2);
      const { refreshTokenKey: t2, accessTokenKey: n2, accessTokenExpireKey: s2 } = this._cache.keys, r2 = this._cache.getStore(t2), i2 = this._cache.getStore(n2), o2 = this._cache.getStore(s2);
      this.credential = { refreshToken: r2, accessToken: i2, accessTokenExpire: o2 }, this.user = new et(e2);
    }
    get isAnonymousAuth() {
      return this.loginType === He.ANONYMOUS;
    }
    get isCustomAuth() {
      return this.loginType === He.CUSTOM;
    }
    get isWeixinAuth() {
      return this.loginType === He.WECHAT || this.loginType === He.WECHAT_OPEN || this.loginType === He.WECHAT_PUBLIC;
    }
    get loginType() {
      return this._cache.getStore(this._cache.keys.loginTypeKey);
    }
  }
  class nt extends Ze {
    async signIn() {
      this._cache.updatePersistence("local");
      const { anonymousUuidKey: e2, refreshTokenKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e2) || void 0, s2 = this._cache.getStore(t2) || void 0, r2 = await this._request.send("auth.signInAnonymously", { anonymous_uuid: n2, refresh_token: s2 });
      if (r2.uuid && r2.refresh_token) {
        this._setAnonymousUUID(r2.uuid), this.setRefreshToken(r2.refresh_token), await this._request.refreshAccessToken(), qe(Ke), qe($e, { env: this.config.env, loginType: He.ANONYMOUS, persistence: "local" });
        const e3 = new tt(this.config.env);
        return await e3.user.refresh(), e3;
      }
      throw new te({ message: "匿名登录失败" });
    }
    async linkAndRetrieveDataWithTicket(e2) {
      const { anonymousUuidKey: t2, refreshTokenKey: n2 } = this._cache.keys, s2 = this._cache.getStore(t2), r2 = this._cache.getStore(n2), i2 = await this._request.send("auth.linkAndRetrieveDataWithTicket", { anonymous_uuid: s2, refresh_token: r2, ticket: e2 });
      if (i2.refresh_token)
        return this._clearAnonymousUUID(), this.setRefreshToken(i2.refresh_token), await this._request.refreshAccessToken(), qe(Be, { env: this.config.env }), qe($e, { loginType: He.CUSTOM, persistence: "local" }), { credential: { refreshToken: i2.refresh_token } };
      throw new te({ message: "匿名转化失败" });
    }
    _setAnonymousUUID(e2) {
      const { anonymousUuidKey: t2, loginTypeKey: n2 } = this._cache.keys;
      this._cache.removeStore(t2), this._cache.setStore(t2, e2), this._cache.setStore(n2, He.ANONYMOUS);
    }
    _clearAnonymousUUID() {
      this._cache.removeStore(this._cache.keys.anonymousUuidKey);
    }
  }
  class st extends Ze {
    async signIn(e2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "ticket must be a string" });
      const { refreshTokenKey: t2 } = this._cache.keys, n2 = await this._request.send("auth.signInWithTicket", { ticket: e2, refresh_token: this._cache.getStore(t2) || "" });
      if (n2.refresh_token)
        return this.setRefreshToken(n2.refresh_token), await this._request.refreshAccessToken(), qe(Ke), qe($e, { env: this.config.env, loginType: He.CUSTOM, persistence: this.config.persistence }), await this.refreshUserInfo(), new tt(this.config.env);
      throw new te({ message: "自定义登录失败" });
    }
  }
  class rt extends Ze {
    async signIn(e2, t2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "email must be a string" });
      const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: "EMAIL", email: e2, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: r2, access_token: i2, access_token_expire: o2 } = s2;
      if (r2)
        return this.setRefreshToken(r2), i2 && o2 ? this.setAccessToken(i2, o2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), qe(Ke), qe($e, { env: this.config.env, loginType: He.EMAIL, persistence: this.config.persistence }), new tt(this.config.env);
      throw s2.code ? new te({ code: s2.code, message: `邮箱登录失败: ${s2.message}` }) : new te({ message: "邮箱登录失败" });
    }
    async activate(e2) {
      return this._request.send("auth.activateEndUserMail", { token: e2 });
    }
    async resetPasswordWithToken(e2, t2) {
      return this._request.send("auth.resetPasswordWithToken", { token: e2, newPassword: t2 });
    }
  }
  class it extends Ze {
    async signIn(e2, t2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "username must be a string" });
      "string" != typeof t2 && (t2 = "", console.warn("password is empty"));
      const { refreshTokenKey: n2 } = this._cache.keys, s2 = await this._request.send("auth.signIn", { loginType: He.USERNAME, username: e2, password: t2, refresh_token: this._cache.getStore(n2) || "" }), { refresh_token: r2, access_token_expire: i2, access_token: o2 } = s2;
      if (r2)
        return this.setRefreshToken(r2), o2 && i2 ? this.setAccessToken(o2, i2) : await this._request.refreshAccessToken(), await this.refreshUserInfo(), qe(Ke), qe($e, { env: this.config.env, loginType: He.USERNAME, persistence: this.config.persistence }), new tt(this.config.env);
      throw s2.code ? new te({ code: s2.code, message: `用户名密码登录失败: ${s2.message}` }) : new te({ message: "用户名密码登录失败" });
    }
  }
  class ot {
    constructor(e2) {
      this.config = e2, this._cache = Re(e2.env), this._request = Xe(e2.env), this._onAnonymousConverted = this._onAnonymousConverted.bind(this), this._onLoginTypeChanged = this._onLoginTypeChanged.bind(this), Me($e, this._onLoginTypeChanged);
    }
    get currentUser() {
      const e2 = this.hasLoginState();
      return e2 && e2.user || null;
    }
    get loginType() {
      return this._cache.getStore(this._cache.keys.loginTypeKey);
    }
    anonymousAuthProvider() {
      return new nt(this.config);
    }
    customAuthProvider() {
      return new st(this.config);
    }
    emailAuthProvider() {
      return new rt(this.config);
    }
    usernameAuthProvider() {
      return new it(this.config);
    }
    async signInAnonymously() {
      return new nt(this.config).signIn();
    }
    async signInWithEmailAndPassword(e2, t2) {
      return new rt(this.config).signIn(e2, t2);
    }
    signInWithUsernameAndPassword(e2, t2) {
      return new it(this.config).signIn(e2, t2);
    }
    async linkAndRetrieveDataWithTicket(e2) {
      this._anonymousAuthProvider || (this._anonymousAuthProvider = new nt(this.config)), Me(Be, this._onAnonymousConverted);
      return await this._anonymousAuthProvider.linkAndRetrieveDataWithTicket(e2);
    }
    async signOut() {
      if (this.loginType === He.ANONYMOUS)
        throw new te({ message: "匿名用户不支持登出操作" });
      const { refreshTokenKey: e2, accessTokenKey: t2, accessTokenExpireKey: n2 } = this._cache.keys, s2 = this._cache.getStore(e2);
      if (!s2)
        return;
      const r2 = await this._request.send("auth.logout", { refresh_token: s2 });
      return this._cache.removeStore(e2), this._cache.removeStore(t2), this._cache.removeStore(n2), qe(Ke), qe($e, { env: this.config.env, loginType: He.NULL, persistence: this.config.persistence }), r2;
    }
    async signUpWithEmailAndPassword(e2, t2) {
      return this._request.send("auth.signUpWithEmailAndPassword", { email: e2, password: t2 });
    }
    async sendPasswordResetEmail(e2) {
      return this._request.send("auth.sendPasswordResetEmail", { email: e2 });
    }
    onLoginStateChanged(e2) {
      Me(Ke, () => {
        const t3 = this.hasLoginState();
        e2.call(this, t3);
      });
      const t2 = this.hasLoginState();
      e2.call(this, t2);
    }
    onLoginStateExpired(e2) {
      Me(je, e2.bind(this));
    }
    onAccessTokenRefreshed(e2) {
      Me(We, e2.bind(this));
    }
    onAnonymousConverted(e2) {
      Me(Be, e2.bind(this));
    }
    onLoginTypeChanged(e2) {
      Me($e, () => {
        const t2 = this.hasLoginState();
        e2.call(this, t2);
      });
    }
    async getAccessToken() {
      return { accessToken: (await this._request.getAccessToken()).accessToken, env: this.config.env };
    }
    hasLoginState() {
      const { refreshTokenKey: e2 } = this._cache.keys;
      return this._cache.getStore(e2) ? new tt(this.config.env) : null;
    }
    async isUsernameRegistered(e2) {
      if ("string" != typeof e2)
        throw new te({ code: "PARAM_ERROR", message: "username must be a string" });
      const { data: t2 } = await this._request.send("auth.isUsernameRegistered", { username: e2 });
      return t2 && t2.isRegistered;
    }
    getLoginState() {
      return Promise.resolve(this.hasLoginState());
    }
    async signInWithTicket(e2) {
      return new st(this.config).signIn(e2);
    }
    shouldRefreshAccessToken(e2) {
      this._request._shouldRefreshAccessTokenHook = e2.bind(this);
    }
    getUserInfo() {
      return this._request.send("auth.getUserInfo", {}).then((e2) => e2.code ? e2 : { ...e2.data, requestId: e2.seqId });
    }
    getAuthHeader() {
      const { refreshTokenKey: e2, accessTokenKey: t2 } = this._cache.keys, n2 = this._cache.getStore(e2);
      return { "x-cloudbase-credentials": this._cache.getStore(t2) + "/@@/" + n2 };
    }
    _onAnonymousConverted(e2) {
      const { env: t2 } = e2.data;
      t2 === this.config.env && this._cache.updatePersistence(this.config.persistence);
    }
    _onLoginTypeChanged(e2) {
      const { loginType: t2, persistence: n2, env: s2 } = e2.data;
      s2 === this.config.env && (this._cache.updatePersistence(n2), this._cache.setStore(this._cache.keys.loginTypeKey, t2));
    }
  }
  const at = function(e2, t2) {
    t2 = t2 || Ie();
    const n2 = Xe(this.config.env), { cloudPath: s2, filePath: r2, onUploadProgress: i2, fileType: o2 = "image" } = e2;
    return n2.send("storage.getUploadMetadata", { path: s2 }).then((e3) => {
      const { data: { url: a2, authorization: c2, token: u2, fileId: l2, cosFileId: h2 }, requestId: d2 } = e3, p2 = { key: s2, signature: c2, "x-cos-meta-fileid": h2, success_action_status: "201", "x-cos-security-token": u2 };
      n2.upload({ url: a2, data: p2, file: r2, name: s2, fileType: o2, onUploadProgress: i2 }).then((e4) => {
        201 === e4.statusCode ? t2(null, { fileID: l2, requestId: d2 }) : t2(new te({ code: "STORAGE_REQUEST_FAIL", message: `STORAGE_REQUEST_FAIL: ${e4.data}` }));
      }).catch((e4) => {
        t2(e4);
      });
    }).catch((e3) => {
      t2(e3);
    }), t2.promise;
  }, ct = function(e2, t2) {
    t2 = t2 || Ie();
    const n2 = Xe(this.config.env), { cloudPath: s2 } = e2;
    return n2.send("storage.getUploadMetadata", { path: s2 }).then((e3) => {
      t2(null, e3);
    }).catch((e3) => {
      t2(e3);
    }), t2.promise;
  }, ut = function({ fileList: e2 }, t2) {
    if (t2 = t2 || Ie(), !e2 || !Array.isArray(e2))
      return { code: "INVALID_PARAM", message: "fileList必须是非空的数组" };
    for (let t3 of e2)
      if (!t3 || "string" != typeof t3)
        return { code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" };
    const n2 = { fileid_list: e2 };
    return Xe(this.config.env).send("storage.batchDeleteFile", n2).then((e3) => {
      e3.code ? t2(null, e3) : t2(null, { fileList: e3.data.delete_list, requestId: e3.requestId });
    }).catch((e3) => {
      t2(e3);
    }), t2.promise;
  }, lt = function({ fileList: e2 }, t2) {
    t2 = t2 || Ie(), e2 && Array.isArray(e2) || t2(null, { code: "INVALID_PARAM", message: "fileList必须是非空的数组" });
    let n2 = [];
    for (let s3 of e2)
      "object" == typeof s3 ? (s3.hasOwnProperty("fileID") && s3.hasOwnProperty("maxAge") || t2(null, { code: "INVALID_PARAM", message: "fileList的元素必须是包含fileID和maxAge的对象" }), n2.push({ fileid: s3.fileID, max_age: s3.maxAge })) : "string" == typeof s3 ? n2.push({ fileid: s3 }) : t2(null, { code: "INVALID_PARAM", message: "fileList的元素必须是字符串" });
    const s2 = { file_list: n2 };
    return Xe(this.config.env).send("storage.batchGetDownloadUrl", s2).then((e3) => {
      e3.code ? t2(null, e3) : t2(null, { fileList: e3.data.download_list, requestId: e3.requestId });
    }).catch((e3) => {
      t2(e3);
    }), t2.promise;
  }, ht = async function({ fileID: e2 }, t2) {
    const n2 = (await lt.call(this, { fileList: [{ fileID: e2, maxAge: 600 }] })).fileList[0];
    if ("SUCCESS" !== n2.code)
      return t2 ? t2(n2) : new Promise((e3) => {
        e3(n2);
      });
    const s2 = Xe(this.config.env);
    let r2 = n2.download_url;
    if (r2 = encodeURI(r2), !t2)
      return s2.download({ url: r2 });
    t2(await s2.download({ url: r2 }));
  }, dt = function({ name: e2, data: t2, query: n2, parse: s2, search: r2, timeout: i2 }, o2) {
    const a2 = o2 || Ie();
    let c2;
    try {
      c2 = t2 ? JSON.stringify(t2) : "";
    } catch (e3) {
      return Promise.reject(e3);
    }
    if (!e2)
      return Promise.reject(new te({ code: "PARAM_ERROR", message: "函数名不能为空" }));
    const u2 = { inQuery: n2, parse: s2, search: r2, function_name: e2, request_data: c2 };
    return Xe(this.config.env).send("functions.invokeFunction", u2, { timeout: i2 }).then((e3) => {
      if (e3.code)
        a2(null, e3);
      else {
        let t3 = e3.data.response_data;
        if (s2)
          a2(null, { result: t3, requestId: e3.requestId });
        else
          try {
            t3 = JSON.parse(e3.data.response_data), a2(null, { result: t3, requestId: e3.requestId });
          } catch (e4) {
            a2(new te({ message: "response data must be json" }));
          }
      }
      return a2.promise;
    }).catch((e3) => {
      a2(e3);
    }), a2.promise;
  }, pt = { timeout: 15e3, persistence: "session" }, ft = {};
  class gt {
    constructor(e2) {
      this.config = e2 || this.config, this.authObj = void 0;
    }
    init(e2) {
      switch (Ce.adapter || (this.requestClient = new Ce.adapter.reqClass({ timeout: e2.timeout || 5e3, timeoutMsg: `请求在${(e2.timeout || 5e3) / 1e3}s内未完成，已中断` })), this.config = { ...pt, ...e2 }, true) {
        case this.config.timeout > 6e5:
          console.warn("timeout大于可配置上限[10分钟]，已重置为上限数值"), this.config.timeout = 6e5;
          break;
        case this.config.timeout < 100:
          console.warn("timeout小于可配置下限[100ms]，已重置为下限数值"), this.config.timeout = 100;
      }
      return new gt(this.config);
    }
    auth({ persistence: e2 } = {}) {
      if (this.authObj)
        return this.authObj;
      const t2 = e2 || Ce.adapter.primaryStorage || pt.persistence;
      var n2;
      return t2 !== this.config.persistence && (this.config.persistence = t2), function(e3) {
        const { env: t3 } = e3;
        Ee[t3] = new Oe(e3), Le[t3] = new Oe({ ...e3, persistence: "local" });
      }(this.config), n2 = this.config, Qe[n2.env] = new Ye(n2), this.authObj = new ot(this.config), this.authObj;
    }
    on(e2, t2) {
      return Me.apply(this, [e2, t2]);
    }
    off(e2, t2) {
      return Fe.apply(this, [e2, t2]);
    }
    callFunction(e2, t2) {
      return dt.apply(this, [e2, t2]);
    }
    deleteFile(e2, t2) {
      return ut.apply(this, [e2, t2]);
    }
    getTempFileURL(e2, t2) {
      return lt.apply(this, [e2, t2]);
    }
    downloadFile(e2, t2) {
      return ht.apply(this, [e2, t2]);
    }
    uploadFile(e2, t2) {
      return at.apply(this, [e2, t2]);
    }
    getUploadMetadata(e2, t2) {
      return ct.apply(this, [e2, t2]);
    }
    registerExtension(e2) {
      ft[e2.name] = e2;
    }
    async invokeExtension(e2, t2) {
      const n2 = ft[e2];
      if (!n2)
        throw new te({ message: `扩展${e2} 必须先注册` });
      return await n2.invoke(t2, this);
    }
    useAdapters(e2) {
      const { adapter: t2, runtime: n2 } = Ae(e2) || {};
      t2 && (Ce.adapter = t2), n2 && (Ce.runtime = n2);
    }
  }
  var mt = new gt();
  function yt(e2, t2, n2) {
    void 0 === n2 && (n2 = {});
    var s2 = /\?/.test(t2), r2 = "";
    for (var i2 in n2)
      "" === r2 ? !s2 && (t2 += "?") : r2 += "&", r2 += i2 + "=" + encodeURIComponent(n2[i2]);
    return /^http(s)?:\/\//.test(t2 += r2) ? t2 : "" + e2 + t2;
  }
  class _t {
    post(e2) {
      const { url: t2, data: n2, headers: s2, timeout: r2 } = e2;
      return new Promise((e3, i2) => {
        ne.request({ url: yt("https:", t2), data: n2, method: "POST", header: s2, timeout: r2, success(t3) {
          e3(t3);
        }, fail(e4) {
          i2(e4);
        } });
      });
    }
    upload(e2) {
      return new Promise((t2, n2) => {
        const { url: s2, file: r2, data: i2, headers: o2, fileType: a2 } = e2, c2 = ne.uploadFile({ url: yt("https:", s2), name: "file", formData: Object.assign({}, i2), filePath: r2, fileType: a2, header: o2, success(e3) {
          const n3 = { statusCode: e3.statusCode, data: e3.data || {} };
          200 === e3.statusCode && i2.success_action_status && (n3.statusCode = parseInt(i2.success_action_status, 10)), t2(n3);
        }, fail(e3) {
          n2(new Error(e3.errMsg || "uploadFile:fail"));
        } });
        "function" == typeof e2.onUploadProgress && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((t3) => {
          e2.onUploadProgress({ loaded: t3.totalBytesSent, total: t3.totalBytesExpectedToSend });
        });
      });
    }
  }
  const wt = { setItem(e2, t2) {
    ne.setStorageSync(e2, t2);
  }, getItem: (e2) => ne.getStorageSync(e2), removeItem(e2) {
    ne.removeStorageSync(e2);
  }, clear() {
    ne.clearStorageSync();
  } };
  var vt = { genAdapter: function() {
    return { root: {}, reqClass: _t, localStorage: wt, primaryStorage: "local" };
  }, isMatch: function() {
    return true;
  }, runtime: "uni_app" };
  mt.useAdapters(vt);
  const It = mt, St = It.init;
  It.init = function(e2) {
    e2.env = e2.spaceId;
    const t2 = St.call(this, e2);
    t2.config.provider = "tencent", t2.config.spaceId = e2.spaceId;
    const n2 = t2.auth;
    return t2.auth = function(e3) {
      const t3 = n2.call(this, e3);
      return ["linkAndRetrieveDataWithTicket", "signInAnonymously", "signOut", "getAccessToken", "getLoginState", "signInWithTicket", "getUserInfo"].forEach((e4) => {
        var n3;
        t3[e4] = (n3 = t3[e4], function(e5) {
          e5 = e5 || {};
          const { success: t4, fail: s2, complete: r2 } = ee(e5);
          if (!(t4 || s2 || r2))
            return n3.call(this, e5);
          n3.call(this, e5).then((e6) => {
            t4 && t4(e6), r2 && r2(e6);
          }, (e6) => {
            s2 && s2(e6), r2 && r2(e6);
          });
        }).bind(t3);
      }), t3;
    }, t2.customAuth = t2.auth, t2;
  };
  var bt = It;
  async function kt(e2, t2) {
    const n2 = `http://${e2}:${t2}/system/ping`;
    try {
      const e3 = await (s2 = { url: n2, timeout: 500 }, new Promise((e4, t3) => {
        ne.request({ ...s2, success(t4) {
          e4(t4);
        }, fail(e5) {
          t3(e5);
        } });
      }));
      return !(!e3.data || 0 !== e3.data.code);
    } catch (e3) {
      return false;
    }
    var s2;
  }
  async function At(e2, t2) {
    let n2;
    for (let s2 = 0; s2 < e2.length; s2++) {
      const r2 = e2[s2];
      if (await kt(r2, t2)) {
        n2 = r2;
        break;
      }
    }
    return { address: n2, port: t2 };
  }
  const Ct = { "serverless.file.resource.generateProximalSign": "storage/generate-proximal-sign", "serverless.file.resource.report": "storage/report", "serverless.file.resource.delete": "storage/delete", "serverless.file.resource.getTempFileURL": "storage/get-temp-file-url" };
  var Pt = class {
    constructor(e2) {
      if (["spaceId", "clientSecret"].forEach((t2) => {
        if (!Object.prototype.hasOwnProperty.call(e2, t2))
          throw new Error(`${t2} required`);
      }), !e2.endpoint)
        throw new Error("集群空间未配置ApiEndpoint，配置后需要重新关联服务空间后生效");
      this.config = Object.assign({}, e2), this.config.provider = "dcloud", this.config.requestUrl = this.config.endpoint + "/client", this.config.envType = this.config.envType || "public", this.adapter = ne;
    }
    async request(e2, t2 = true) {
      const n2 = t2;
      return e2 = n2 ? await this.setupLocalRequest(e2) : this.setupRequest(e2), Promise.resolve().then(() => n2 ? this.requestLocal(e2) : de.wrappedRequest(e2, this.adapter.request));
    }
    requestLocal(e2) {
      return new Promise((t2, n2) => {
        this.adapter.request(Object.assign(e2, { complete(e3) {
          if (e3 || (e3 = {}), !e3.statusCode || e3.statusCode >= 400) {
            const t3 = e3.data && e3.data.code || "SYS_ERR", s2 = e3.data && e3.data.message || "request:fail";
            return n2(new te({ code: t3, message: s2 }));
          }
          t2({ success: true, result: e3.data });
        } }));
      });
    }
    setupRequest(e2) {
      const t2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now() }), n2 = { "Content-Type": "application/json" };
      n2["x-serverless-sign"] = de.sign(t2, this.config.clientSecret);
      const s2 = he();
      n2["x-client-info"] = encodeURIComponent(JSON.stringify(s2));
      const { token: r2 } = re();
      return n2["x-client-token"] = r2, { url: this.config.requestUrl, method: "POST", data: t2, dataType: "json", header: JSON.parse(JSON.stringify(n2)) };
    }
    async setupLocalRequest(e2) {
      const t2 = he(), { token: n2 } = re(), s2 = Object.assign({}, e2, { spaceId: this.config.spaceId, timestamp: Date.now(), clientInfo: t2, token: n2 }), { address: r2, servePort: i2 } = this.__dev__ && this.__dev__.debugInfo || {}, { address: o2 } = await At(r2, i2);
      return { url: `http://${o2}:${i2}/${Ct[e2.method]}`, method: "POST", data: s2, dataType: "json", header: JSON.parse(JSON.stringify({ "Content-Type": "application/json" })) };
    }
    callFunction(e2) {
      const t2 = { method: "serverless.function.runtime.invoke", params: JSON.stringify({ functionTarget: e2.name, functionArgs: e2.data || {} }) };
      return this.request(t2, false);
    }
    getUploadFileOptions(e2) {
      const t2 = { method: "serverless.file.resource.generateProximalSign", params: JSON.stringify(e2) };
      return this.request(t2);
    }
    reportUploadFile(e2) {
      const t2 = { method: "serverless.file.resource.report", params: JSON.stringify(e2) };
      return this.request(t2);
    }
    uploadFile({ filePath: e2, cloudPath: t2, fileType: n2 = "image", onUploadProgress: s2 }) {
      if (!t2)
        throw new te({ code: "CLOUDPATH_REQUIRED", message: "cloudPath不可为空" });
      let r2;
      return this.getUploadFileOptions({ cloudPath: t2 }).then((t3) => {
        const { url: i2, formData: o2, name: a2 } = t3.result;
        return r2 = t3.result.fileUrl, new Promise((t4, r3) => {
          const c2 = this.adapter.uploadFile({ url: i2, formData: o2, name: a2, filePath: e2, fileType: n2, success(e3) {
            e3 && e3.statusCode < 400 ? t4(e3) : r3(new te({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
          }, fail(e3) {
            r3(new te({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "文件上传失败" }));
          } });
          "function" == typeof s2 && c2 && "function" == typeof c2.onProgressUpdate && c2.onProgressUpdate((e3) => {
            s2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
          });
        });
      }).then(() => this.reportUploadFile({ cloudPath: t2 })).then((t3) => new Promise((n3, s3) => {
        t3.success ? n3({ success: true, filePath: e2, fileID: r2 }) : s3(new te({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
      }));
    }
    deleteFile({ fileList: e2 }) {
      const t2 = { method: "serverless.file.resource.delete", params: JSON.stringify({ fileList: e2 }) };
      return this.request(t2).then((e3) => {
        if (e3.success)
          return e3.result;
        throw new te({ code: "DELETE_FILE_FAILED", message: "删除文件失败" });
      });
    }
    getTempFileURL({ fileList: e2, maxAge: t2 } = {}) {
      if (!Array.isArray(e2) || 0 === e2.length)
        throw new te({ code: "INVALID_PARAM", message: "fileList的元素必须是非空的字符串" });
      const n2 = { method: "serverless.file.resource.getTempFileURL", params: JSON.stringify({ fileList: e2, maxAge: t2 }) };
      return this.request(n2).then((e3) => {
        if (e3.success)
          return { fileList: e3.result.fileList.map((e4) => ({ fileID: e4.fileID, tempFileURL: e4.tempFileURL })) };
        throw new te({ code: "GET_TEMP_FILE_URL_FAILED", message: "获取临时文件链接失败" });
      });
    }
  };
  var Tt = { init(e2) {
    const t2 = new Pt(e2), n2 = { signInAnonymously: function() {
      return Promise.resolve();
    }, getLoginState: function() {
      return Promise.resolve(false);
    } };
    return t2.auth = function() {
      return n2;
    }, t2.customAuth = t2.auth, t2;
  } }, xt = n(function(e2, t2) {
    e2.exports = r.enc.Hex;
  });
  function Ot() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(e2) {
      var t2 = 16 * Math.random() | 0;
      return ("x" === e2 ? t2 : 3 & t2 | 8).toString(16);
    });
  }
  function Et(e2 = "", t2 = {}) {
    const { data: n2, functionName: s2, method: r2, headers: i2, signHeaderKeys: o2 = [], config: a2 } = t2, c2 = Date.now(), u2 = Ot(), l2 = Object.assign({}, i2, { "x-from-app-id": a2.spaceAppId, "x-from-env-id": a2.spaceId, "x-to-env-id": a2.spaceId, "x-from-instance-id": c2, "x-from-function-name": s2, "x-client-timestamp": c2, "x-alipay-source": "client", "x-request-id": u2, "x-alipay-callid": u2, "x-trace-id": u2 }), h2 = ["x-from-app-id", "x-from-env-id", "x-to-env-id", "x-from-instance-id", "x-from-function-name", "x-client-timestamp"].concat(o2), [d2 = "", p2 = ""] = e2.split("?") || [], f2 = function(e3) {
      const t3 = e3.signedHeaders.join(";"), n3 = e3.signedHeaders.map((t4) => `${t4.toLowerCase()}:${e3.headers[t4]}
`).join(""), s3 = we(e3.body).toString(xt), r3 = `${e3.method.toUpperCase()}
${e3.path}
${e3.query}
${n3}
${t3}
${s3}
`, i3 = we(r3).toString(xt), o3 = `HMAC-SHA256
${e3.timestamp}
${i3}
`, a3 = ve(o3, e3.secretKey).toString(xt);
      return `HMAC-SHA256 Credential=${e3.secretId}, SignedHeaders=${t3}, Signature=${a3}`;
    }({ path: d2, query: p2, method: r2, headers: l2, timestamp: c2, body: JSON.stringify(n2), secretId: a2.accessKey, secretKey: a2.secretKey, signedHeaders: h2.sort() });
    return { url: `${a2.endpoint}${e2}`, headers: Object.assign({}, l2, { Authorization: f2 }) };
  }
  function Lt({ url: e2, data: t2, method: n2 = "POST", headers: s2 = {}, timeout: r2 }) {
    return new Promise((i2, o2) => {
      ne.request({ url: e2, method: n2, data: "object" == typeof t2 ? JSON.stringify(t2) : t2, header: s2, dataType: "json", timeout: r2, complete: (e3 = {}) => {
        const t3 = s2["x-trace-id"] || "";
        if (!e3.statusCode || e3.statusCode >= 400) {
          const { message: n3, errMsg: s3, trace_id: r3 } = e3.data || {};
          return o2(new te({ code: "SYS_ERR", message: n3 || s3 || "request:fail", requestId: r3 || t3 }));
        }
        i2({ status: e3.statusCode, data: e3.data, headers: e3.header, requestId: t3 });
      } });
    });
  }
  function Rt(e2, t2) {
    const { path: n2, data: s2, method: r2 = "GET" } = e2, { url: i2, headers: o2 } = Et(n2, { functionName: "", data: s2, method: r2, headers: { "x-alipay-cloud-mode": "oss", "x-data-api-type": "oss", "x-expire-timestamp": Date.now() + 6e4 }, signHeaderKeys: ["x-data-api-type", "x-expire-timestamp"], config: t2 });
    return Lt({ url: i2, data: s2, method: r2, headers: o2 }).then((e3) => {
      const t3 = e3.data || {};
      if (!t3.success)
        throw new te({ code: e3.errCode, message: e3.errMsg, requestId: e3.requestId });
      return t3.data || {};
    }).catch((e3) => {
      throw new te({ code: e3.errCode, message: e3.errMsg, requestId: e3.requestId });
    });
  }
  function Ut(e2 = "") {
    const t2 = e2.trim().replace(/^cloud:\/\//, ""), n2 = t2.indexOf("/");
    if (n2 <= 0)
      throw new te({ code: "INVALID_PARAM", message: "fileID不合法" });
    const s2 = t2.substring(0, n2), r2 = t2.substring(n2 + 1);
    return s2 !== this.config.spaceId && console.warn("file ".concat(e2, " does not belong to env ").concat(this.config.spaceId)), r2;
  }
  function Nt(e2 = "") {
    return "cloud://".concat(this.config.spaceId, "/").concat(e2.replace(/^\/+/, ""));
  }
  class Dt {
    constructor(e2) {
      this.config = e2;
    }
    signedURL(e2, t2 = {}) {
      const n2 = `/ws/function/${e2}`, s2 = this.config.wsEndpoint.replace(/^ws(s)?:\/\//, ""), r2 = Object.assign({}, t2, { accessKeyId: this.config.accessKey, signatureNonce: Ot(), timestamp: "" + Date.now() }), i2 = [n2, ["accessKeyId", "authorization", "signatureNonce", "timestamp"].sort().map(function(e3) {
        return r2[e3] ? "".concat(e3, "=").concat(r2[e3]) : null;
      }).filter(Boolean).join("&"), `host:${s2}`].join("\n"), o2 = ["HMAC-SHA256", we(i2).toString(xt)].join("\n"), a2 = ve(o2, this.config.secretKey).toString(xt), c2 = Object.keys(r2).map((e3) => `${e3}=${encodeURIComponent(r2[e3])}`).join("&");
      return `${this.config.wsEndpoint}${n2}?${c2}&signature=${a2}`;
    }
  }
  var Mt = class {
    constructor(e2) {
      if (["spaceId", "spaceAppId", "accessKey", "secretKey"].forEach((t2) => {
        if (!Object.prototype.hasOwnProperty.call(e2, t2))
          throw new Error(`${t2} required`);
      }), e2.endpoint) {
        if ("string" != typeof e2.endpoint)
          throw new Error("endpoint must be string");
        if (!/^https:\/\//.test(e2.endpoint))
          throw new Error("endpoint must start with https://");
        e2.endpoint = e2.endpoint.replace(/\/$/, "");
      }
      this.config = Object.assign({}, e2, { endpoint: e2.endpoint || `https://${e2.spaceId}.api-hz.cloudbasefunction.cn`, wsEndpoint: e2.wsEndpoint || `wss://${e2.spaceId}.api-hz.cloudbasefunction.cn` }), this._websocket = new Dt(this.config);
    }
    callFunction(e2) {
      return function(e3, t2) {
        const { name: n2, data: s2, async: r2 = false, timeout: i2 } = e3, o2 = "POST", a2 = { "x-to-function-name": n2 };
        r2 && (a2["x-function-invoke-type"] = "async");
        const { url: c2, headers: u2 } = Et("/functions/invokeFunction", { functionName: n2, data: s2, method: o2, headers: a2, signHeaderKeys: ["x-to-function-name"], config: t2 });
        return Lt({ url: c2, data: s2, method: o2, headers: u2, timeout: i2 }).then((e4) => {
          let t3 = 0;
          if (r2) {
            const n3 = e4.data || {};
            t3 = "200" === n3.errCode ? 0 : n3.errCode, e4.data = n3.data || {}, e4.errMsg = n3.errMsg;
          }
          if (0 !== t3)
            throw new te({ code: t3, message: e4.errMsg, requestId: e4.requestId });
          return { errCode: t3, success: 0 === t3, requestId: e4.requestId, result: e4.data };
        }).catch((e4) => {
          throw new te({ code: e4.errCode, message: e4.errMsg, requestId: e4.requestId });
        });
      }(e2, this.config);
    }
    uploadFileToOSS({ url: e2, filePath: t2, fileType: n2, formData: s2, onUploadProgress: r2 }) {
      return new Promise((i2, o2) => {
        const a2 = ne.uploadFile({ url: e2, filePath: t2, fileType: n2, formData: s2, name: "file", success(e3) {
          e3 && e3.statusCode < 400 ? i2(e3) : o2(new te({ code: "UPLOAD_FAILED", message: "文件上传失败" }));
        }, fail(e3) {
          o2(new te({ code: e3.code || "UPLOAD_FAILED", message: e3.message || e3.errMsg || "文件上传失败" }));
        } });
        "function" == typeof r2 && a2 && "function" == typeof a2.onProgressUpdate && a2.onProgressUpdate((e3) => {
          r2({ loaded: e3.totalBytesSent, total: e3.totalBytesExpectedToSend });
        });
      });
    }
    async uploadFile({ filePath: e2, cloudPath: t2 = "", fileType: n2 = "image", onUploadProgress: s2 }) {
      if ("string" !== f(t2))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath必须为字符串类型" });
      if (!(t2 = t2.trim()))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath不可为空" });
      if (/:\/\//.test(t2))
        throw new te({ code: "INVALID_PARAM", message: "cloudPath不合法" });
      const r2 = await Rt({ path: "/".concat(t2.replace(/^\//, ""), "?post_url") }, this.config), { file_id: i2, upload_url: o2, form_data: a2 } = r2, c2 = a2 && a2.reduce((e3, t3) => (e3[t3.key] = t3.value, e3), {});
      return this.uploadFileToOSS({ url: o2, filePath: e2, fileType: n2, formData: c2, onUploadProgress: s2 }).then(() => ({ fileID: i2 }));
    }
    async getTempFileURL({ fileList: e2 }) {
      return new Promise((t2, n2) => {
        (!e2 || e2.length < 0) && n2(new te({ errCode: "INVALID_PARAM", errMsg: "fileList不能为空数组" })), e2.length > 50 && n2(new te({ errCode: "INVALID_PARAM", errMsg: "fileList数组长度不能超过50" }));
        const s2 = [];
        for (const t3 of e2) {
          "string" !== f(t3) && n2(new te({ errCode: "INVALID_PARAM", errMsg: "fileList的元素必须是非空的字符串" }));
          const e3 = Ut.call(this, t3);
          s2.push({ file_id: e3, expire: 600 });
        }
        Rt({ path: "/?download_url", data: { file_list: s2 }, method: "POST" }, this.config).then((e3) => {
          const { file_list: n3 = [] } = e3;
          t2({ fileList: n3.map((e4) => ({ fileID: Nt.call(this, e4.file_id), tempFileURL: e4.download_url })) });
        }).catch((e3) => n2(e3));
      });
    }
    async connectWebSocket(e2) {
      const { name: t2, query: n2 } = e2;
      return ne.connectSocket({ url: this._websocket.signedURL(t2, n2), complete: () => {
      } });
    }
  };
  var qt = { init: (e2) => {
    e2.provider = "alipay";
    const t2 = new Mt(e2);
    return t2.auth = function() {
      return { signInAnonymously: function() {
        return Promise.resolve();
      }, getLoginState: function() {
        return Promise.resolve(true);
      } };
    }, t2;
  } };
  function Ft({ data: e2 }) {
    let t2;
    t2 = he();
    const n2 = JSON.parse(JSON.stringify(e2 || {}));
    if (Object.assign(n2, { clientInfo: t2 }), !n2.uniIdToken) {
      const { token: e3 } = re();
      e3 && (n2.uniIdToken = e3);
    }
    return n2;
  }
  async function Kt(e2 = {}) {
    await this.__dev__.initLocalNetwork();
    const { localAddress: t2, localPort: n2 } = this.__dev__, s2 = { aliyun: "aliyun", tencent: "tcb", alipay: "alipay", dcloud: "dcloud" }[this.config.provider], r2 = this.config.spaceId, i2 = `http://${t2}:${n2}/system/check-function`, o2 = `http://${t2}:${n2}/cloudfunctions/${e2.name}`;
    return new Promise((t3, n3) => {
      ne.request({ method: "POST", url: i2, data: { name: e2.name, platform: C, provider: s2, spaceId: r2 }, timeout: 3e3, success(e3) {
        t3(e3);
      }, fail() {
        t3({ data: { code: "NETWORK_ERROR", message: "连接本地调试服务失败，请检查客户端是否和主机在同一局域网下，自动切换为已部署的云函数。" } });
      } });
    }).then(({ data: e3 } = {}) => {
      const { code: t3, message: n3 } = e3 || {};
      return { code: 0 === t3 ? 0 : t3 || "SYS_ERR", message: n3 || "SYS_ERR" };
    }).then(({ code: t3, message: n3 }) => {
      if (0 !== t3) {
        switch (t3) {
          case "MODULE_ENCRYPTED":
            console.error(`此云函数（${e2.name}）依赖加密公共模块不可本地调试，自动切换为云端已部署的云函数`);
            break;
          case "FUNCTION_ENCRYPTED":
            console.error(`此云函数（${e2.name}）已加密不可本地调试，自动切换为云端已部署的云函数`);
            break;
          case "ACTION_ENCRYPTED":
            console.error(n3 || "需要访问加密的uni-clientDB-action，自动切换为云端环境");
            break;
          case "NETWORK_ERROR":
            console.error(n3 || "连接本地调试服务失败，请检查客户端是否和主机在同一局域网下");
            break;
          case "SWITCH_TO_CLOUD":
            break;
          default: {
            const e3 = `检测本地调试服务出现错误：${n3}，请检查网络环境或重启客户端再试`;
            throw console.error(e3), new Error(e3);
          }
        }
        return this._callCloudFunction(e2);
      }
      return new Promise((t4, n4) => {
        const r3 = Ft.call(this, { data: e2.data });
        ne.request({ method: "POST", url: o2, data: { provider: s2, platform: C, param: r3 }, timeout: e2.timeout, success: ({ statusCode: e3, data: s3 } = {}) => !e3 || e3 >= 400 ? n4(new te({ code: s3.code || "SYS_ERR", message: s3.message || "request:fail" })) : t4({ result: s3 }), fail(e3) {
          n4(new te({ code: e3.code || e3.errCode || "SYS_ERR", message: e3.message || e3.errMsg || "request:fail" }));
        } });
      });
    });
  }
  const jt = [{ rule: /fc_function_not_found|FUNCTION_NOT_FOUND/, content: "，云函数[{functionName}]在云端不存在，请检查此云函数名称是否正确以及该云函数是否已上传到服务空间", mode: "append" }];
  var $t = /[\\^$.*+?()[\]{}|]/g, Bt = RegExp($t.source);
  function Wt(e2, t2, n2) {
    return e2.replace(new RegExp((s2 = t2) && Bt.test(s2) ? s2.replace($t, "\\$&") : s2, "g"), n2);
    var s2;
  }
  const Jt = "request", zt = "response", Vt = "both";
  const En = { code: 2e4, message: "System error" }, Ln = { code: 20101, message: "Invalid client" };
  function Nn(e2) {
    const { errSubject: t2, subject: n2, errCode: s2, errMsg: r2, code: i2, message: o2, cause: a2 } = e2 || {};
    return new te({ subject: t2 || n2 || "uni-secure-network", code: s2 || i2 || En.code, message: r2 || o2, cause: a2 });
  }
  let Mn;
  function $n({ secretType: e2 } = {}) {
    return e2 === Jt || e2 === zt || e2 === Vt;
  }
  function Bn({ name: e2, data: t2 = {} } = {}) {
    return "DCloud-clientDB" === e2 && "encryption" === t2.redirectTo && "getAppClientKey" === t2.action;
  }
  function Wn({ provider: e2, spaceId: t2, functionName: n2 } = {}) {
    const { appId: s2, uniPlatform: r2, osName: i2 } = ce();
    let o2 = r2;
    "app" === r2 && (o2 = i2);
    const a2 = function({ provider: e3, spaceId: t3 } = {}) {
      const n3 = A;
      if (!n3)
        return {};
      e3 = /* @__PURE__ */ function(e4) {
        return "tencent" === e4 ? "tcb" : e4;
      }(e3);
      const s3 = n3.find((n4) => n4.provider === e3 && n4.spaceId === t3);
      return s3 && s3.config;
    }({ provider: e2, spaceId: t2 });
    if (!a2 || !a2.accessControl || !a2.accessControl.enable)
      return false;
    const c2 = a2.accessControl.function || {}, u2 = Object.keys(c2);
    if (0 === u2.length)
      return true;
    const l2 = function(e3, t3) {
      let n3, s3, r3;
      for (let i3 = 0; i3 < e3.length; i3++) {
        const o3 = e3[i3];
        o3 !== t3 ? "*" !== o3 ? o3.split(",").map((e4) => e4.trim()).indexOf(t3) > -1 && (s3 = o3) : r3 = o3 : n3 = o3;
      }
      return n3 || s3 || r3;
    }(u2, n2);
    if (!l2)
      return false;
    if ((c2[l2] || []).find((e3 = {}) => e3.appId === s2 && (e3.platform || "").toLowerCase() === o2.toLowerCase()))
      return true;
    throw console.error(`此应用[appId: ${s2}, platform: ${o2}]不在云端配置的允许访问的应用列表内，参考：https://uniapp.dcloud.net.cn/uniCloud/secure-network.html#verify-client`), Nn(Ln);
  }
  function Hn({ functionName: e2, result: t2, logPvd: n2 }) {
    if (this.__dev__.debugLog && t2 && t2.requestId) {
      const s2 = JSON.stringify({ spaceId: this.config.spaceId, functionName: e2, requestId: t2.requestId });
      console.log(`[${n2}-request]${s2}[/${n2}-request]`);
    }
  }
  function Jn(e2) {
    const t2 = e2.callFunction, n2 = function(n3) {
      const s2 = n3.name;
      n3.data = Ft.call(e2, { data: n3.data });
      const r2 = { aliyun: "aliyun", tencent: "tcb", tcb: "tcb", alipay: "alipay", dcloud: "dcloud" }[this.config.provider], i2 = $n(n3), o2 = Bn(n3), a2 = i2 || o2;
      return t2.call(this, n3).then((e3) => (e3.errCode = 0, !a2 && Hn.call(this, { functionName: s2, result: e3, logPvd: r2 }), Promise.resolve(e3)), (e3) => (!a2 && Hn.call(this, { functionName: s2, result: e3, logPvd: r2 }), e3 && e3.message && (e3.message = function({ message: e4 = "", extraInfo: t3 = {}, formatter: n4 = [] } = {}) {
        for (let s3 = 0; s3 < n4.length; s3++) {
          const { rule: r3, content: i3, mode: o3 } = n4[s3], a3 = e4.match(r3);
          if (!a3)
            continue;
          let c2 = i3;
          for (let e5 = 1; e5 < a3.length; e5++)
            c2 = Wt(c2, `{$${e5}}`, a3[e5]);
          for (const e5 in t3)
            c2 = Wt(c2, `{${e5}}`, t3[e5]);
          return "replace" === o3 ? c2 : e4 + c2;
        }
        return e4;
      }({ message: `[${n3.name}]: ${e3.message}`, formatter: jt, extraInfo: { functionName: s2 } })), Promise.reject(e3)));
    };
    e2.callFunction = function(t3) {
      const { provider: s2, spaceId: r2 } = e2.config, i2 = t3.name;
      let o2, a2;
      if (t3.data = t3.data || {}, e2.__dev__.debugInfo && !e2.__dev__.debugInfo.forceRemote && T ? (e2._callCloudFunction || (e2._callCloudFunction = n2, e2._callLocalFunction = Kt), o2 = Kt) : o2 = n2, o2 = o2.bind(e2), Bn(t3))
        a2 = n2.call(e2, t3);
      else if ($n(t3)) {
        a2 = new Mn({ secretType: t3.secretType, uniCloudIns: e2 }).wrapEncryptDataCallFunction(n2.bind(e2))(t3);
      } else if (Wn({ provider: s2, spaceId: r2, functionName: i2 })) {
        a2 = new Mn({ secretType: t3.secretType, uniCloudIns: e2 }).wrapVerifyClientCallFunction(n2.bind(e2))(t3);
      } else
        a2 = o2(t3);
      return Object.defineProperty(a2, "result", { get: () => (console.warn("当前返回结果为Promise类型，不可直接访问其result属性，详情请参考：https://uniapp.dcloud.net.cn/uniCloud/faq?id=promise"), {}) }), a2.then((e3) => ("undefined" != typeof UTSJSONObject && (e3.result = new UTSJSONObject(e3.result)), e3));
    };
  }
  Mn = class {
    constructor() {
      throw Nn({ message: `Platform ${C} is not enabled, please check whether secure network module is enabled in your manifest.json` });
    }
  };
  const zn = Symbol("CLIENT_DB_INTERNAL");
  function Vn(e2, t2) {
    return e2.then = "DoNotReturnProxyWithAFunctionNamedThen", e2._internalType = zn, e2.inspect = null, e2.__v_raw = void 0, new Proxy(e2, { get(e3, n2, s2) {
      if ("_uniClient" === n2)
        return null;
      if ("symbol" == typeof n2)
        return e3[n2];
      if (n2 in e3 || "string" != typeof n2) {
        const t3 = e3[n2];
        return "function" == typeof t3 ? t3.bind(e3) : t3;
      }
      return t2.get(e3, n2, s2);
    } });
  }
  function Gn(e2) {
    return { on: (t2, n2) => {
      e2[t2] = e2[t2] || [], e2[t2].indexOf(n2) > -1 || e2[t2].push(n2);
    }, off: (t2, n2) => {
      e2[t2] = e2[t2] || [];
      const s2 = e2[t2].indexOf(n2);
      -1 !== s2 && e2[t2].splice(s2, 1);
    } };
  }
  const Yn = ["db.Geo", "db.command", "command.aggregate"];
  function Qn(e2, t2) {
    return Yn.indexOf(`${e2}.${t2}`) > -1;
  }
  function Xn(e2) {
    switch (f(e2 = se(e2))) {
      case "array":
        return e2.map((e3) => Xn(e3));
      case "object":
        return e2._internalType === zn || Object.keys(e2).forEach((t2) => {
          e2[t2] = Xn(e2[t2]);
        }), e2;
      case "regexp":
        return { $regexp: { source: e2.source, flags: e2.flags } };
      case "date":
        return { $date: e2.toISOString() };
      default:
        return e2;
    }
  }
  function Zn(e2) {
    return e2 && e2.content && e2.content.$method;
  }
  class es {
    constructor(e2, t2, n2) {
      this.content = e2, this.prevStage = t2 || null, this.udb = null, this._database = n2;
    }
    toJSON() {
      let e2 = this;
      const t2 = [e2.content];
      for (; e2.prevStage; )
        e2 = e2.prevStage, t2.push(e2.content);
      return { $db: t2.reverse().map((e3) => ({ $method: e3.$method, $param: Xn(e3.$param) })) };
    }
    toString() {
      return JSON.stringify(this.toJSON());
    }
    getAction() {
      const e2 = this.toJSON().$db.find((e3) => "action" === e3.$method);
      return e2 && e2.$param && e2.$param[0];
    }
    getCommand() {
      return { $db: this.toJSON().$db.filter((e2) => "action" !== e2.$method) };
    }
    get isAggregate() {
      let e2 = this;
      for (; e2; ) {
        const t2 = Zn(e2), n2 = Zn(e2.prevStage);
        if ("aggregate" === t2 && "collection" === n2 || "pipeline" === t2)
          return true;
        e2 = e2.prevStage;
      }
      return false;
    }
    get isCommand() {
      let e2 = this;
      for (; e2; ) {
        if ("command" === Zn(e2))
          return true;
        e2 = e2.prevStage;
      }
      return false;
    }
    get isAggregateCommand() {
      let e2 = this;
      for (; e2; ) {
        const t2 = Zn(e2), n2 = Zn(e2.prevStage);
        if ("aggregate" === t2 && "command" === n2)
          return true;
        e2 = e2.prevStage;
      }
      return false;
    }
    getNextStageFn(e2) {
      const t2 = this;
      return function() {
        return ts({ $method: e2, $param: Xn(Array.from(arguments)) }, t2, t2._database);
      };
    }
    get count() {
      return this.isAggregate ? this.getNextStageFn("count") : function() {
        return this._send("count", Array.from(arguments));
      };
    }
    get remove() {
      return this.isCommand ? this.getNextStageFn("remove") : function() {
        return this._send("remove", Array.from(arguments));
      };
    }
    get() {
      return this._send("get", Array.from(arguments));
    }
    get add() {
      return this.isCommand ? this.getNextStageFn("add") : function() {
        return this._send("add", Array.from(arguments));
      };
    }
    update() {
      return this._send("update", Array.from(arguments));
    }
    end() {
      return this._send("end", Array.from(arguments));
    }
    get set() {
      return this.isCommand ? this.getNextStageFn("set") : function() {
        throw new Error("JQL禁止使用set方法");
      };
    }
    _send(e2, t2) {
      const n2 = this.getAction(), s2 = this.getCommand();
      if (s2.$db.push({ $method: e2, $param: Xn(t2) }), S) {
        const e3 = s2.$db.find((e4) => "collection" === e4.$method), t3 = e3 && e3.$param;
        t3 && 1 === t3.length && "string" == typeof e3.$param[0] && e3.$param[0].indexOf(",") > -1 && console.warn("检测到使用JQL语法联表查询时，未使用getTemp先过滤主表数据，在主表数据量大的情况下可能会查询缓慢。\n- 如何优化请参考此文档：https://uniapp.dcloud.net.cn/uniCloud/jql?id=lookup-with-temp \n- 如果主表数据量很小请忽略此信息，项目发行时不会出现此提示。");
      }
      return this._database._callCloudFunction({ action: n2, command: s2 });
    }
  }
  function ts(e2, t2, n2) {
    return Vn(new es(e2, t2, n2), { get(e3, t3) {
      let s2 = "db";
      return e3 && e3.content && (s2 = e3.content.$method), Qn(s2, t3) ? ts({ $method: t3 }, e3, n2) : function() {
        return ts({ $method: t3, $param: Xn(Array.from(arguments)) }, e3, n2);
      };
    } });
  }
  function ns({ path: e2, method: t2 }) {
    return class {
      constructor() {
        this.param = Array.from(arguments);
      }
      toJSON() {
        return { $newDb: [...e2.map((e3) => ({ $method: e3 })), { $method: t2, $param: this.param }] };
      }
      toString() {
        return JSON.stringify(this.toJSON());
      }
    };
  }
  function ss(e2, t2 = {}) {
    return Vn(new e2(t2), { get: (e3, t3) => Qn("db", t3) ? ts({ $method: t3 }, null, e3) : function() {
      return ts({ $method: t3, $param: Xn(Array.from(arguments)) }, null, e3);
    } });
  }
  class rs extends class {
    constructor({ uniClient: e2 = {}, isJQL: t2 = false } = {}) {
      this._uniClient = e2, this._authCallBacks = {}, this._dbCallBacks = {}, e2._isDefault && (this._dbCallBacks = L("_globalUniCloudDatabaseCallback")), t2 || (this.auth = Gn(this._authCallBacks)), this._isJQL = t2, Object.assign(this, Gn(this._dbCallBacks)), this.env = Vn({}, { get: (e3, t3) => ({ $env: t3 }) }), this.Geo = Vn({}, { get: (e3, t3) => ns({ path: ["Geo"], method: t3 }) }), this.serverDate = ns({ path: [], method: "serverDate" }), this.RegExp = ns({ path: [], method: "RegExp" });
    }
    getCloudEnv(e2) {
      if ("string" != typeof e2 || !e2.trim())
        throw new Error("getCloudEnv参数错误");
      return { $env: e2.replace("$cloudEnv_", "") };
    }
    _callback(e2, t2) {
      const n2 = this._dbCallBacks;
      n2[e2] && n2[e2].forEach((e3) => {
        e3(...t2);
      });
    }
    _callbackAuth(e2, t2) {
      const n2 = this._authCallBacks;
      n2[e2] && n2[e2].forEach((e3) => {
        e3(...t2);
      });
    }
    multiSend() {
      const e2 = Array.from(arguments), t2 = e2.map((e3) => {
        const t3 = e3.getAction(), n2 = e3.getCommand();
        if ("getTemp" !== n2.$db[n2.$db.length - 1].$method)
          throw new Error("multiSend只支持子命令内使用getTemp");
        return { action: t3, command: n2 };
      });
      return this._callCloudFunction({ multiCommand: t2, queryList: e2 });
    }
  } {
    _parseResult(e2) {
      return this._isJQL ? e2.result : e2;
    }
    _callCloudFunction({ action: e2, command: t2, multiCommand: n2, queryList: s2 }) {
      function r2(e3, t3) {
        if (n2 && s2)
          for (let n3 = 0; n3 < s2.length; n3++) {
            const r3 = s2[n3];
            r3.udb && "function" == typeof r3.udb.setResult && (t3 ? r3.udb.setResult(t3) : r3.udb.setResult(e3.result.dataList[n3]));
          }
      }
      const i2 = this, o2 = this._isJQL ? "databaseForJQL" : "database";
      function a2(e3) {
        return i2._callback("error", [e3]), M(q(o2, "fail"), e3).then(() => M(q(o2, "complete"), e3)).then(() => (r2(null, e3), Y(j, { type: W, content: e3 }), Promise.reject(e3)));
      }
      const c2 = M(q(o2, "invoke")), u2 = this._uniClient;
      return c2.then(() => u2.callFunction({ name: "DCloud-clientDB", type: l, data: { action: e2, command: t2, multiCommand: n2 } })).then((e3) => {
        const { code: t3, message: n3, token: s3, tokenExpired: c3, systemInfo: u3 = [] } = e3.result;
        if (u3)
          for (let e4 = 0; e4 < u3.length; e4++) {
            const { level: t4, message: n4, detail: s4 } = u3[e4], r3 = console["warn" === t4 ? "error" : t4] || console.log;
            let i3 = "[System Info]" + n4;
            s4 && (i3 = `${i3}
详细信息：${s4}`), r3(i3);
          }
        if (t3) {
          return a2(new te({ code: t3, message: n3, requestId: e3.requestId }));
        }
        e3.result.errCode = e3.result.errCode || e3.result.code, e3.result.errMsg = e3.result.errMsg || e3.result.message, s3 && c3 && (ie({ token: s3, tokenExpired: c3 }), this._callbackAuth("refreshToken", [{ token: s3, tokenExpired: c3 }]), this._callback("refreshToken", [{ token: s3, tokenExpired: c3 }]), Y(B, { token: s3, tokenExpired: c3 }));
        const l2 = [{ prop: "affectedDocs", tips: "affectedDocs不再推荐使用，请使用inserted/deleted/updated/data.length替代" }, { prop: "code", tips: "code不再推荐使用，请使用errCode替代" }, { prop: "message", tips: "message不再推荐使用，请使用errMsg替代" }];
        for (let t4 = 0; t4 < l2.length; t4++) {
          const { prop: n4, tips: s4 } = l2[t4];
          if (n4 in e3.result) {
            const t5 = e3.result[n4];
            Object.defineProperty(e3.result, n4, { get: () => (console.warn(s4), t5) });
          }
        }
        return function(e4) {
          return M(q(o2, "success"), e4).then(() => M(q(o2, "complete"), e4)).then(() => {
            r2(e4, null);
            const t4 = i2._parseResult(e4);
            return Y(j, { type: W, content: t4 }), Promise.resolve(t4);
          });
        }(e3);
      }, (e3) => {
        /fc_function_not_found|FUNCTION_NOT_FOUND/g.test(e3.message) && console.warn("clientDB未初始化，请在web控制台保存一次schema以开启clientDB");
        return a2(new te({ code: e3.code || "SYSTEM_ERROR", message: e3.message, requestId: e3.requestId }));
      });
    }
  }
  const is = "token无效，跳转登录页面", os = "token过期，跳转登录页面", as = { TOKEN_INVALID_TOKEN_EXPIRED: os, TOKEN_INVALID_INVALID_CLIENTID: is, TOKEN_INVALID: is, TOKEN_INVALID_WRONG_TOKEN: is, TOKEN_INVALID_ANONYMOUS_USER: is }, cs = { "uni-id-token-expired": os, "uni-id-check-token-failed": is, "uni-id-token-not-exist": is, "uni-id-check-device-feature-failed": is };
  function us(e2, t2) {
    let n2 = "";
    return n2 = e2 ? `${e2}/${t2}` : t2, n2.replace(/^\//, "");
  }
  function ls(e2 = [], t2 = "") {
    const n2 = [], s2 = [];
    return e2.forEach((e3) => {
      true === e3.needLogin ? n2.push(us(t2, e3.path)) : false === e3.needLogin && s2.push(us(t2, e3.path));
    }), { needLoginPage: n2, notNeedLoginPage: s2 };
  }
  function hs(e2) {
    return e2.split("?")[0].replace(/^\//, "");
  }
  function ds() {
    return function(e2) {
      let t2 = e2 && e2.$page && e2.$page.fullPath || "";
      return t2 ? ("/" !== t2.charAt(0) && (t2 = "/" + t2), t2) : t2;
    }(function() {
      const e2 = getCurrentPages();
      return e2[e2.length - 1];
    }());
  }
  function ps() {
    return hs(ds());
  }
  function fs(e2 = "", t2 = {}) {
    if (!e2)
      return false;
    if (!(t2 && t2.list && t2.list.length))
      return false;
    const n2 = t2.list, s2 = hs(e2);
    return n2.some((e3) => e3.pagePath === s2);
  }
  const gs = !!e.uniIdRouter;
  const { loginPage: ms, routerNeedLogin: ys, resToLogin: _s, needLoginPage: ws, notNeedLoginPage: vs, loginPageInTabBar: Is } = function({ pages: t2 = [], subPackages: n2 = [], uniIdRouter: s2 = {}, tabBar: r2 = {} } = e) {
    const { loginPage: i2, needLogin: o2 = [], resToLogin: a2 = true } = s2, { needLoginPage: c2, notNeedLoginPage: u2 } = ls(t2), { needLoginPage: l2, notNeedLoginPage: h2 } = function(e2 = []) {
      const t3 = [], n3 = [];
      return e2.forEach((e3) => {
        const { root: s3, pages: r3 = [] } = e3, { needLoginPage: i3, notNeedLoginPage: o3 } = ls(r3, s3);
        t3.push(...i3), n3.push(...o3);
      }), { needLoginPage: t3, notNeedLoginPage: n3 };
    }(n2);
    return { loginPage: i2, routerNeedLogin: o2, resToLogin: a2, needLoginPage: [...c2, ...l2], notNeedLoginPage: [...u2, ...h2], loginPageInTabBar: fs(i2, r2) };
  }();
  if (ws.indexOf(ms) > -1)
    throw new Error(`Login page [${ms}] should not be "needLogin", please check your pages.json`);
  function Ss(e2) {
    const t2 = ps();
    if ("/" === e2.charAt(0))
      return e2;
    const [n2, s2] = e2.split("?"), r2 = n2.replace(/^\//, "").split("/"), i2 = t2.split("/");
    i2.pop();
    for (let e3 = 0; e3 < r2.length; e3++) {
      const t3 = r2[e3];
      ".." === t3 ? i2.pop() : "." !== t3 && i2.push(t3);
    }
    return "" === i2[0] && i2.shift(), "/" + i2.join("/") + (s2 ? "?" + s2 : "");
  }
  function bs(e2) {
    const t2 = hs(Ss(e2));
    return !(vs.indexOf(t2) > -1) && (ws.indexOf(t2) > -1 || ys.some((t3) => function(e3, t4) {
      return new RegExp(t4).test(e3);
    }(e2, t3)));
  }
  function ks({ redirect: e2 }) {
    const t2 = hs(e2), n2 = hs(ms);
    return ps() !== n2 && t2 !== n2;
  }
  function As({ api: e2, redirect: t2 } = {}) {
    if (!t2 || !ks({ redirect: t2 }))
      return;
    const n2 = function(e3, t3) {
      return "/" !== e3.charAt(0) && (e3 = "/" + e3), t3 ? e3.indexOf("?") > -1 ? e3 + `&uniIdRedirectUrl=${encodeURIComponent(t3)}` : e3 + `?uniIdRedirectUrl=${encodeURIComponent(t3)}` : e3;
    }(ms, t2);
    Is ? "navigateTo" !== e2 && "redirectTo" !== e2 || (e2 = "switchTab") : "switchTab" === e2 && (e2 = "navigateTo");
    const s2 = { navigateTo: uni.navigateTo, redirectTo: uni.redirectTo, switchTab: uni.switchTab, reLaunch: uni.reLaunch };
    setTimeout(() => {
      s2[e2]({ url: n2 });
    }, 0);
  }
  function Cs({ url: e2 } = {}) {
    const t2 = { abortLoginPageJump: false, autoToLoginPage: false }, n2 = function() {
      const { token: e3, tokenExpired: t3 } = re();
      let n3;
      if (e3) {
        if (t3 < Date.now()) {
          const e4 = "uni-id-token-expired";
          n3 = { errCode: e4, errMsg: cs[e4] };
        }
      } else {
        const e4 = "uni-id-check-token-failed";
        n3 = { errCode: e4, errMsg: cs[e4] };
      }
      return n3;
    }();
    if (bs(e2) && n2) {
      n2.uniIdRedirectUrl = e2;
      if (z($).length > 0)
        return setTimeout(() => {
          Y($, n2);
        }, 0), t2.abortLoginPageJump = true, t2;
      t2.autoToLoginPage = true;
    }
    return t2;
  }
  function Ps() {
    !function() {
      const e3 = ds(), { abortLoginPageJump: t2, autoToLoginPage: n2 } = Cs({ url: e3 });
      t2 || n2 && As({ api: "redirectTo", redirect: e3 });
    }();
    const e2 = ["navigateTo", "redirectTo", "reLaunch", "switchTab"];
    for (let t2 = 0; t2 < e2.length; t2++) {
      const n2 = e2[t2];
      uni.addInterceptor(n2, { invoke(e3) {
        const { abortLoginPageJump: t3, autoToLoginPage: s2 } = Cs({ url: e3.url });
        return t3 ? e3 : s2 ? (As({ api: n2, redirect: Ss(e3.url) }), false) : e3;
      } });
    }
  }
  function Ts() {
    this.onResponse((e2) => {
      const { type: t2, content: n2 } = e2;
      let s2 = false;
      switch (t2) {
        case "cloudobject":
          s2 = function(e3) {
            if ("object" != typeof e3)
              return false;
            const { errCode: t3 } = e3 || {};
            return t3 in cs;
          }(n2);
          break;
        case "clientdb":
          s2 = function(e3) {
            if ("object" != typeof e3)
              return false;
            const { errCode: t3 } = e3 || {};
            return t3 in as;
          }(n2);
      }
      s2 && function(e3 = {}) {
        const t3 = z($);
        Z().then(() => {
          const n3 = ds();
          if (n3 && ks({ redirect: n3 }))
            return t3.length > 0 ? Y($, Object.assign({ uniIdRedirectUrl: n3 }, e3)) : void (ms && As({ api: "navigateTo", redirect: n3 }));
        });
      }(n2);
    });
  }
  function xs(e2) {
    !function(e3) {
      e3.onResponse = function(e4) {
        V(j, e4);
      }, e3.offResponse = function(e4) {
        G(j, e4);
      };
    }(e2), function(e3) {
      e3.onNeedLogin = function(e4) {
        V($, e4);
      }, e3.offNeedLogin = function(e4) {
        G($, e4);
      }, gs && (L("_globalUniCloudStatus").needLoginInit || (L("_globalUniCloudStatus").needLoginInit = true, Z().then(() => {
        Ps.call(e3);
      }), _s && Ts.call(e3)));
    }(e2), function(e3) {
      e3.onRefreshToken = function(e4) {
        V(B, e4);
      }, e3.offRefreshToken = function(e4) {
        G(B, e4);
      };
    }(e2);
  }
  let Os;
  const Es = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", Ls = /^(?:[A-Za-z\d+/]{4})*?(?:[A-Za-z\d+/]{2}(?:==)?|[A-Za-z\d+/]{3}=?)?$/;
  function Rs() {
    const e2 = re().token || "", t2 = e2.split(".");
    if (!e2 || 3 !== t2.length)
      return { uid: null, role: [], permission: [], tokenExpired: 0 };
    let n2;
    try {
      n2 = JSON.parse((s2 = t2[1], decodeURIComponent(Os(s2).split("").map(function(e3) {
        return "%" + ("00" + e3.charCodeAt(0).toString(16)).slice(-2);
      }).join(""))));
    } catch (e3) {
      throw new Error("获取当前用户信息出错，详细错误信息为：" + e3.message);
    }
    var s2;
    return n2.tokenExpired = 1e3 * n2.exp, delete n2.exp, delete n2.iat, n2;
  }
  Os = "function" != typeof atob ? function(e2) {
    if (e2 = String(e2).replace(/[\t\n\f\r ]+/g, ""), !Ls.test(e2))
      throw new Error("Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.");
    var t2;
    e2 += "==".slice(2 - (3 & e2.length));
    for (var n2, s2, r2 = "", i2 = 0; i2 < e2.length; )
      t2 = Es.indexOf(e2.charAt(i2++)) << 18 | Es.indexOf(e2.charAt(i2++)) << 12 | (n2 = Es.indexOf(e2.charAt(i2++))) << 6 | (s2 = Es.indexOf(e2.charAt(i2++))), r2 += 64 === n2 ? String.fromCharCode(t2 >> 16 & 255) : 64 === s2 ? String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255) : String.fromCharCode(t2 >> 16 & 255, t2 >> 8 & 255, 255 & t2);
    return r2;
  } : atob;
  var Us = n(function(e2, t2) {
    Object.defineProperty(t2, "__esModule", { value: true });
    const n2 = "chooseAndUploadFile:ok", s2 = "chooseAndUploadFile:fail";
    function r2(e3, t3) {
      return e3.tempFiles.forEach((e4, n3) => {
        e4.name || (e4.name = e4.path.substring(e4.path.lastIndexOf("/") + 1)), t3 && (e4.fileType = t3), e4.cloudPath = Date.now() + "_" + n3 + e4.name.substring(e4.name.lastIndexOf("."));
      }), e3.tempFilePaths || (e3.tempFilePaths = e3.tempFiles.map((e4) => e4.path)), e3;
    }
    function i2(e3, t3, { onChooseFile: s3, onUploadProgress: r3 }) {
      return t3.then((e4) => {
        if (s3) {
          const t4 = s3(e4);
          if (void 0 !== t4)
            return Promise.resolve(t4).then((t5) => void 0 === t5 ? e4 : t5);
        }
        return e4;
      }).then((t4) => false === t4 ? { errMsg: n2, tempFilePaths: [], tempFiles: [] } : function(e4, t5, s4 = 5, r4) {
        (t5 = Object.assign({}, t5)).errMsg = n2;
        const i3 = t5.tempFiles, o2 = i3.length;
        let a2 = 0;
        return new Promise((n3) => {
          for (; a2 < s4; )
            c2();
          function c2() {
            const s5 = a2++;
            if (s5 >= o2)
              return void (!i3.find((e5) => !e5.url && !e5.errMsg) && n3(t5));
            const u2 = i3[s5];
            e4.uploadFile({ provider: u2.provider, filePath: u2.path, cloudPath: u2.cloudPath, fileType: u2.fileType, cloudPathAsRealPath: u2.cloudPathAsRealPath, onUploadProgress(e5) {
              e5.index = s5, e5.tempFile = u2, e5.tempFilePath = u2.path, r4 && r4(e5);
            } }).then((e5) => {
              u2.url = e5.fileID, s5 < o2 && c2();
            }).catch((e5) => {
              u2.errMsg = e5.errMsg || e5.message, s5 < o2 && c2();
            });
          }
        });
      }(e3, t4, 5, r3));
    }
    t2.initChooseAndUploadFile = function(e3) {
      return function(t3 = { type: "all" }) {
        return "image" === t3.type ? i2(e3, function(e4) {
          const { count: t4, sizeType: n3, sourceType: i3 = ["album", "camera"], extension: o2 } = e4;
          return new Promise((e5, a2) => {
            uni.chooseImage({ count: t4, sizeType: n3, sourceType: i3, extension: o2, success(t5) {
              e5(r2(t5, "image"));
            }, fail(e6) {
              a2({ errMsg: e6.errMsg.replace("chooseImage:fail", s2) });
            } });
          });
        }(t3), t3) : "video" === t3.type ? i2(e3, function(e4) {
          const { camera: t4, compressed: n3, maxDuration: i3, sourceType: o2 = ["album", "camera"], extension: a2 } = e4;
          return new Promise((e5, c2) => {
            uni.chooseVideo({ camera: t4, compressed: n3, maxDuration: i3, sourceType: o2, extension: a2, success(t5) {
              const { tempFilePath: n4, duration: s3, size: i4, height: o3, width: a3 } = t5;
              e5(r2({ errMsg: "chooseVideo:ok", tempFilePaths: [n4], tempFiles: [{ name: t5.tempFile && t5.tempFile.name || "", path: n4, size: i4, type: t5.tempFile && t5.tempFile.type || "", width: a3, height: o3, duration: s3, fileType: "video", cloudPath: "" }] }, "video"));
            }, fail(e6) {
              c2({ errMsg: e6.errMsg.replace("chooseVideo:fail", s2) });
            } });
          });
        }(t3), t3) : i2(e3, function(e4) {
          const { count: t4, extension: n3 } = e4;
          return new Promise((e5, i3) => {
            let o2 = uni.chooseFile;
            if ("undefined" != typeof wx && "function" == typeof wx.chooseMessageFile && (o2 = wx.chooseMessageFile), "function" != typeof o2)
              return i3({ errMsg: s2 + " 请指定 type 类型，该平台仅支持选择 image 或 video。" });
            o2({ type: "all", count: t4, extension: n3, success(t5) {
              e5(r2(t5));
            }, fail(e6) {
              i3({ errMsg: e6.errMsg.replace("chooseFile:fail", s2) });
            } });
          });
        }(t3), t3);
      };
    };
  }), Ns = t(Us);
  const Ds = "manual";
  function Ms(e2) {
    return { props: { localdata: { type: Array, default: () => [] }, options: { type: [Object, Array], default: () => ({}) }, spaceInfo: { type: Object, default: () => ({}) }, collection: { type: [String, Array], default: "" }, action: { type: String, default: "" }, field: { type: String, default: "" }, orderby: { type: String, default: "" }, where: { type: [String, Object], default: "" }, pageData: { type: String, default: "add" }, pageCurrent: { type: Number, default: 1 }, pageSize: { type: Number, default: 20 }, getcount: { type: [Boolean, String], default: false }, gettree: { type: [Boolean, String], default: false }, gettreepath: { type: [Boolean, String], default: false }, startwith: { type: String, default: "" }, limitlevel: { type: Number, default: 10 }, groupby: { type: String, default: "" }, groupField: { type: String, default: "" }, distinct: { type: [Boolean, String], default: false }, foreignKey: { type: String, default: "" }, loadtime: { type: String, default: "auto" }, manual: { type: Boolean, default: false } }, data: () => ({ mixinDatacomLoading: false, mixinDatacomHasMore: false, mixinDatacomResData: [], mixinDatacomErrorMessage: "", mixinDatacomPage: {}, mixinDatacomError: null }), created() {
      this.mixinDatacomPage = { current: this.pageCurrent, size: this.pageSize, count: 0 }, this.$watch(() => {
        var e3 = [];
        return ["pageCurrent", "pageSize", "localdata", "collection", "action", "field", "orderby", "where", "getont", "getcount", "gettree", "groupby", "groupField", "distinct"].forEach((t2) => {
          e3.push(this[t2]);
        }), e3;
      }, (e3, t2) => {
        if (this.loadtime === Ds)
          return;
        let n2 = false;
        const s2 = [];
        for (let r2 = 2; r2 < e3.length; r2++)
          e3[r2] !== t2[r2] && (s2.push(e3[r2]), n2 = true);
        e3[0] !== t2[0] && (this.mixinDatacomPage.current = this.pageCurrent), this.mixinDatacomPage.size = this.pageSize, this.onMixinDatacomPropsChange(n2, s2);
      });
    }, methods: { onMixinDatacomPropsChange(e3, t2) {
    }, mixinDatacomEasyGet({ getone: e3 = false, success: t2, fail: n2 } = {}) {
      this.mixinDatacomLoading || (this.mixinDatacomLoading = true, this.mixinDatacomErrorMessage = "", this.mixinDatacomError = null, this.mixinDatacomGet().then((n3) => {
        this.mixinDatacomLoading = false;
        const { data: s2, count: r2 } = n3.result;
        this.getcount && (this.mixinDatacomPage.count = r2), this.mixinDatacomHasMore = s2.length < this.pageSize;
        const i2 = e3 ? s2.length ? s2[0] : void 0 : s2;
        this.mixinDatacomResData = i2, t2 && t2(i2);
      }).catch((e4) => {
        this.mixinDatacomLoading = false, this.mixinDatacomErrorMessage = e4, this.mixinDatacomError = e4, n2 && n2(e4);
      }));
    }, mixinDatacomGet(t2 = {}) {
      let n2;
      t2 = t2 || {}, n2 = "undefined" != typeof __uniX && __uniX ? e2.databaseForJQL(this.spaceInfo) : e2.database(this.spaceInfo);
      const s2 = t2.action || this.action;
      s2 && (n2 = n2.action(s2));
      const r2 = t2.collection || this.collection;
      n2 = Array.isArray(r2) ? n2.collection(...r2) : n2.collection(r2);
      const i2 = t2.where || this.where;
      i2 && Object.keys(i2).length && (n2 = n2.where(i2));
      const o2 = t2.field || this.field;
      o2 && (n2 = n2.field(o2));
      const a2 = t2.foreignKey || this.foreignKey;
      a2 && (n2 = n2.foreignKey(a2));
      const c2 = t2.groupby || this.groupby;
      c2 && (n2 = n2.groupBy(c2));
      const u2 = t2.groupField || this.groupField;
      u2 && (n2 = n2.groupField(u2));
      true === (void 0 !== t2.distinct ? t2.distinct : this.distinct) && (n2 = n2.distinct());
      const l2 = t2.orderby || this.orderby;
      l2 && (n2 = n2.orderBy(l2));
      const h2 = void 0 !== t2.pageCurrent ? t2.pageCurrent : this.mixinDatacomPage.current, d2 = void 0 !== t2.pageSize ? t2.pageSize : this.mixinDatacomPage.size, p2 = void 0 !== t2.getcount ? t2.getcount : this.getcount, f2 = void 0 !== t2.gettree ? t2.gettree : this.gettree, g2 = void 0 !== t2.gettreepath ? t2.gettreepath : this.gettreepath, m2 = { getCount: p2 }, y2 = { limitLevel: void 0 !== t2.limitlevel ? t2.limitlevel : this.limitlevel, startWith: void 0 !== t2.startwith ? t2.startwith : this.startwith };
      return f2 && (m2.getTree = y2), g2 && (m2.getTreePath = y2), n2 = n2.skip(d2 * (h2 - 1)).limit(d2).get(m2), n2;
    } } };
  }
  function qs(e2) {
    return function(t2, n2 = {}) {
      n2 = function(e3, t3 = {}) {
        return e3.customUI = t3.customUI || e3.customUI, e3.parseSystemError = t3.parseSystemError || e3.parseSystemError, Object.assign(e3.loadingOptions, t3.loadingOptions), Object.assign(e3.errorOptions, t3.errorOptions), "object" == typeof t3.secretMethods && (e3.secretMethods = t3.secretMethods), e3;
      }({ customUI: false, loadingOptions: { title: "加载中...", mask: true }, errorOptions: { type: "modal", retry: false } }, n2);
      const { customUI: s2, loadingOptions: r2, errorOptions: i2, parseSystemError: o2 } = n2, a2 = !s2;
      return new Proxy({}, { get(s3, c2) {
        switch (c2) {
          case "toString":
            return "[object UniCloudObject]";
          case "toJSON":
            return {};
        }
        return function({ fn: e3, interceptorName: t3, getCallbackArgs: n3 } = {}) {
          return async function(...s4) {
            const r3 = n3 ? n3({ params: s4 }) : {};
            let i3, o3;
            try {
              return await M(q(t3, "invoke"), { ...r3 }), i3 = await e3(...s4), await M(q(t3, "success"), { ...r3, result: i3 }), i3;
            } catch (e4) {
              throw o3 = e4, await M(q(t3, "fail"), { ...r3, error: o3 }), o3;
            } finally {
              await M(q(t3, "complete"), o3 ? { ...r3, error: o3 } : { ...r3, result: i3 });
            }
          };
        }({ fn: async function s4(...l2) {
          let h2;
          a2 && uni.showLoading({ title: r2.title, mask: r2.mask });
          const d2 = { name: t2, type: u, data: { method: c2, params: l2 } };
          "object" == typeof n2.secretMethods && function(e3, t3) {
            const n3 = t3.data.method, s5 = e3.secretMethods || {}, r3 = s5[n3] || s5["*"];
            r3 && (t3.secretType = r3);
          }(n2, d2);
          let p2 = false;
          try {
            h2 = await e2.callFunction(d2);
          } catch (e3) {
            p2 = true, h2 = { result: new te(e3) };
          }
          const { errSubject: f2, errCode: g2, errMsg: m2, newToken: y2 } = h2.result || {};
          if (a2 && uni.hideLoading(), y2 && y2.token && y2.tokenExpired && (ie(y2), Y(B, { ...y2 })), g2) {
            let e3 = m2;
            if (p2 && o2) {
              e3 = (await o2({ objectName: t2, methodName: c2, params: l2, errSubject: f2, errCode: g2, errMsg: m2 })).errMsg || m2;
            }
            if (a2)
              if ("toast" === i2.type)
                uni.showToast({ title: e3, icon: "none" });
              else {
                if ("modal" !== i2.type)
                  throw new Error(`Invalid errorOptions.type: ${i2.type}`);
                {
                  const { confirm: t3 } = await async function({ title: e4, content: t4, showCancel: n4, cancelText: s5, confirmText: r3 } = {}) {
                    return new Promise((i3, o3) => {
                      uni.showModal({ title: e4, content: t4, showCancel: n4, cancelText: s5, confirmText: r3, success(e5) {
                        i3(e5);
                      }, fail() {
                        i3({ confirm: false, cancel: true });
                      } });
                    });
                  }({ title: "提示", content: e3, showCancel: i2.retry, cancelText: "取消", confirmText: i2.retry ? "重试" : "确定" });
                  if (i2.retry && t3)
                    return s4(...l2);
                }
              }
            const n3 = new te({ subject: f2, code: g2, message: m2, requestId: h2.requestId });
            throw n3.detail = h2.result, Y(j, { type: J, content: n3 }), n3;
          }
          return Y(j, { type: J, content: h2.result }), h2.result;
        }, interceptorName: "callObject", getCallbackArgs: function({ params: e3 } = {}) {
          return { objectName: t2, methodName: c2, params: e3 };
        } });
      } });
    };
  }
  function Fs(e2) {
    return L("_globalUniCloudSecureNetworkCache__{spaceId}".replace("{spaceId}", e2.config.spaceId));
  }
  async function Ks({ openid: e2, callLoginByWeixin: t2 = false } = {}) {
    Fs(this);
    throw new Error(`[SecureNetwork] API \`initSecureNetworkByWeixin\` is not supported on platform \`${C}\``);
  }
  async function js(e2) {
    const t2 = Fs(this);
    return t2.initPromise || (t2.initPromise = Ks.call(this, e2).then((e3) => e3).catch((e3) => {
      throw delete t2.initPromise, e3;
    })), t2.initPromise;
  }
  function $s(e2) {
    return function({ openid: t2, callLoginByWeixin: n2 = false } = {}) {
      return js.call(e2, { openid: t2, callLoginByWeixin: n2 });
    };
  }
  function Bs(e2) {
    !function(e3) {
      le = e3;
    }(e2);
  }
  function Ws(e2) {
    const t2 = { getSystemInfo: uni.getSystemInfo, getPushClientId: uni.getPushClientId };
    return function(n2) {
      return new Promise((s2, r2) => {
        t2[e2]({ ...n2, success(e3) {
          s2(e3);
        }, fail(e3) {
          r2(e3);
        } });
      });
    };
  }
  class Hs extends class {
    constructor() {
      this._callback = {};
    }
    addListener(e2, t2) {
      this._callback[e2] || (this._callback[e2] = []), this._callback[e2].push(t2);
    }
    on(e2, t2) {
      return this.addListener(e2, t2);
    }
    removeListener(e2, t2) {
      if (!t2)
        throw new Error('The "listener" argument must be of type function. Received undefined');
      const n2 = this._callback[e2];
      if (!n2)
        return;
      const s2 = function(e3, t3) {
        for (let n3 = e3.length - 1; n3 >= 0; n3--)
          if (e3[n3] === t3)
            return n3;
        return -1;
      }(n2, t2);
      n2.splice(s2, 1);
    }
    off(e2, t2) {
      return this.removeListener(e2, t2);
    }
    removeAllListener(e2) {
      delete this._callback[e2];
    }
    emit(e2, ...t2) {
      const n2 = this._callback[e2];
      if (n2)
        for (let e3 = 0; e3 < n2.length; e3++)
          n2[e3](...t2);
    }
  } {
    constructor() {
      super(), this._uniPushMessageCallback = this._receivePushMessage.bind(this), this._currentMessageId = -1, this._payloadQueue = [];
    }
    init() {
      return Promise.all([Ws("getSystemInfo")(), Ws("getPushClientId")()]).then(([{ appId: e2 } = {}, { cid: t2 } = {}] = []) => {
        if (!e2)
          throw new Error("Invalid appId, please check the manifest.json file");
        if (!t2)
          throw new Error("Invalid push client id");
        this._appId = e2, this._pushClientId = t2, this._seqId = Date.now() + "-" + Math.floor(9e5 * Math.random() + 1e5), this.emit("open"), this._initMessageListener();
      }, (e2) => {
        throw this.emit("error", e2), this.close(), e2;
      });
    }
    async open() {
      return this.init();
    }
    _isUniCloudSSE(e2) {
      if ("receive" !== e2.type)
        return false;
      const t2 = e2 && e2.data && e2.data.payload;
      return !(!t2 || "UNI_CLOUD_SSE" !== t2.channel || t2.seqId !== this._seqId);
    }
    _receivePushMessage(e2) {
      if (!this._isUniCloudSSE(e2))
        return;
      const t2 = e2 && e2.data && e2.data.payload, { action: n2, messageId: s2, message: r2 } = t2;
      this._payloadQueue.push({ action: n2, messageId: s2, message: r2 }), this._consumMessage();
    }
    _consumMessage() {
      for (; ; ) {
        const e2 = this._payloadQueue.find((e3) => e3.messageId === this._currentMessageId + 1);
        if (!e2)
          break;
        this._currentMessageId++, this._parseMessagePayload(e2);
      }
    }
    _parseMessagePayload(e2) {
      const { action: t2, messageId: n2, message: s2 } = e2;
      "end" === t2 ? this._end({ messageId: n2, message: s2 }) : "message" === t2 && this._appendMessage({ messageId: n2, message: s2 });
    }
    _appendMessage({ messageId: e2, message: t2 } = {}) {
      this.emit("message", t2);
    }
    _end({ messageId: e2, message: t2 } = {}) {
      this.emit("end", t2), this.close();
    }
    _initMessageListener() {
      uni.onPushMessage(this._uniPushMessageCallback);
    }
    _destroy() {
      uni.offPushMessage(this._uniPushMessageCallback);
    }
    toJSON() {
      return { appId: this._appId, pushClientId: this._pushClientId, seqId: this._seqId };
    }
    close() {
      this._destroy(), this.emit("close");
    }
  }
  async function Js(e2) {
    {
      const { osName: e3, osVersion: t3 } = ce();
      "ios" === e3 && function(e4) {
        if (!e4 || "string" != typeof e4)
          return 0;
        const t4 = e4.match(/^(\d+)./);
        return t4 && t4[1] ? parseInt(t4[1]) : 0;
      }(t3) >= 14 && console.warn("iOS 14及以上版本连接uniCloud本地调试服务需要允许客户端查找并连接到本地网络上的设备（仅开发期间需要，发行后不需要）");
    }
    const t2 = e2.__dev__;
    if (!t2.debugInfo)
      return;
    const { address: n2, servePort: s2 } = t2.debugInfo, { address: r2 } = await At(n2, s2);
    if (r2)
      return t2.localAddress = r2, void (t2.localPort = s2);
    const i2 = console["error"];
    let o2 = "";
    if ("remote" === t2.debugInfo.initialLaunchType ? (t2.debugInfo.forceRemote = true, o2 = "当前客户端和HBuilderX不在同一局域网下（或其他网络原因无法连接HBuilderX），uniCloud本地调试服务不对当前客户端生效。\n- 如果不使用uniCloud本地调试服务，请直接忽略此信息。\n- 如需使用uniCloud本地调试服务，请将客户端与主机连接到同一局域网下并重新运行到客户端。") : o2 = "无法连接uniCloud本地调试服务，请检查当前客户端是否与主机在同一局域网下。\n- 如需使用uniCloud本地调试服务，请将客户端与主机连接到同一局域网下并重新运行到客户端。", o2 += "\n- 如果在HBuilderX开启的状态下切换过网络环境，请重启HBuilderX后再试\n- 检查系统防火墙是否拦截了HBuilderX自带的nodejs\n- 检查是否错误的使用拦截器修改uni.request方法的参数", 0 === C.indexOf("mp-") && (o2 += "\n- 小程序中如何使用uniCloud，请参考：https://uniapp.dcloud.net.cn/uniCloud/publish.html#useinmp"), !t2.debugInfo.forceRemote)
      throw new Error(o2);
    i2(o2);
  }
  function zs(e2) {
    e2._initPromiseHub || (e2._initPromiseHub = new v({ createPromise: function() {
      let t2 = Promise.resolve();
      var n2;
      n2 = 1, t2 = new Promise((e3) => {
        setTimeout(() => {
          e3();
        }, n2);
      });
      const s2 = e2.auth();
      return t2.then(() => s2.getLoginState()).then((e3) => e3 ? Promise.resolve() : s2.signInAnonymously());
    } }));
  }
  const Vs = { tcb: bt, tencent: bt, aliyun: fe, private: Tt, dcloud: Tt, alipay: qt };
  let Gs = new class {
    init(e2) {
      let t2 = {};
      const n2 = Vs[e2.provider];
      if (!n2)
        throw new Error("未提供正确的provider参数");
      t2 = n2.init(e2), function(e3) {
        const t3 = {};
        e3.__dev__ = t3, t3.debugLog = "app" === C;
        const n3 = P;
        n3 && !n3.code && (t3.debugInfo = n3);
        const s2 = new v({ createPromise: function() {
          return Js(e3);
        } });
        t3.initLocalNetwork = function() {
          return s2.exec();
        };
      }(t2), zs(t2), Jn(t2), function(e3) {
        const t3 = e3.uploadFile;
        e3.uploadFile = function(e4) {
          return t3.call(this, e4);
        };
      }(t2), function(e3) {
        e3.database = function(t3) {
          if (t3 && Object.keys(t3).length > 0)
            return e3.init(t3).database();
          if (this._database)
            return this._database;
          const n3 = ss(rs, { uniClient: e3 });
          return this._database = n3, n3;
        }, e3.databaseForJQL = function(t3) {
          if (t3 && Object.keys(t3).length > 0)
            return e3.init(t3).databaseForJQL();
          if (this._databaseForJQL)
            return this._databaseForJQL;
          const n3 = ss(rs, { uniClient: e3, isJQL: true });
          return this._databaseForJQL = n3, n3;
        };
      }(t2), function(e3) {
        e3.getCurrentUserInfo = Rs, e3.chooseAndUploadFile = Ns.initChooseAndUploadFile(e3), Object.assign(e3, { get mixinDatacom() {
          return Ms(e3);
        } }), e3.SSEChannel = Hs, e3.initSecureNetworkByWeixin = $s(e3), e3.setCustomClientInfo = Bs, e3.importObject = qs(e3);
      }(t2);
      return ["callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "chooseAndUploadFile"].forEach((e3) => {
        if (!t2[e3])
          return;
        const n3 = t2[e3];
        t2[e3] = function() {
          return n3.apply(t2, Array.from(arguments));
        }, t2[e3] = (/* @__PURE__ */ function(e4, t3) {
          return function(n4) {
            let s2 = false;
            if ("callFunction" === t3) {
              const e5 = n4 && n4.type || c;
              s2 = e5 !== c;
            }
            const r2 = "callFunction" === t3 && !s2, i2 = this._initPromiseHub.exec();
            n4 = n4 || {};
            const { success: o2, fail: a2, complete: u2 } = ee(n4), l2 = i2.then(() => s2 ? Promise.resolve() : M(q(t3, "invoke"), n4)).then(() => e4.call(this, n4)).then((e5) => s2 ? Promise.resolve(e5) : M(q(t3, "success"), e5).then(() => M(q(t3, "complete"), e5)).then(() => (r2 && Y(j, { type: H, content: e5 }), Promise.resolve(e5))), (e5) => s2 ? Promise.reject(e5) : M(q(t3, "fail"), e5).then(() => M(q(t3, "complete"), e5)).then(() => (Y(j, { type: H, content: e5 }), Promise.reject(e5))));
            if (!(o2 || a2 || u2))
              return l2;
            l2.then((e5) => {
              o2 && o2(e5), u2 && u2(e5), r2 && Y(j, { type: H, content: e5 });
            }, (e5) => {
              a2 && a2(e5), u2 && u2(e5), r2 && Y(j, { type: H, content: e5 });
            });
          };
        }(t2[e3], e3)).bind(t2);
      }), t2.init = this.init, t2;
    }
  }();
  (() => {
    const e2 = T;
    let t2 = {};
    if (e2 && 1 === e2.length)
      t2 = e2[0], Gs = Gs.init(t2), Gs._isDefault = true;
    else {
      const t3 = ["auth", "callFunction", "uploadFile", "deleteFile", "getTempFileURL", "downloadFile", "database", "getCurrentUSerInfo", "importObject"];
      let n2;
      n2 = e2 && e2.length > 0 ? "应用有多个服务空间，请通过uniCloud.init方法指定要使用的服务空间" : "应用未关联服务空间，请在uniCloud目录右键关联服务空间", t3.forEach((e3) => {
        Gs[e3] = function() {
          return console.error(n2), Promise.reject(new te({ code: "SYS_ERR", message: n2 }));
        };
      });
    }
    Object.assign(Gs, { get mixinDatacom() {
      return Ms(Gs);
    } }), xs(Gs), Gs.addInterceptor = N, Gs.removeInterceptor = D, Gs.interceptObject = F;
  })();
  var Ys = Gs;
  const dataPicker = {
    props: {
      localdata: {
        type: [Array, Object],
        default() {
          return [];
        }
      },
      spaceInfo: {
        type: Object,
        default() {
          return {};
        }
      },
      collection: {
        type: String,
        default: ""
      },
      action: {
        type: String,
        default: ""
      },
      field: {
        type: String,
        default: ""
      },
      orderby: {
        type: String,
        default: ""
      },
      where: {
        type: [String, Object],
        default: ""
      },
      pageData: {
        type: String,
        default: "add"
      },
      pageCurrent: {
        type: Number,
        default: 1
      },
      pageSize: {
        type: Number,
        default: 500
      },
      getcount: {
        type: [Boolean, String],
        default: false
      },
      getone: {
        type: [Boolean, String],
        default: false
      },
      gettree: {
        type: [Boolean, String],
        default: false
      },
      manual: {
        type: Boolean,
        default: false
      },
      value: {
        type: [Array, String, Number],
        default() {
          return [];
        }
      },
      modelValue: {
        type: [Array, String, Number],
        default() {
          return [];
        }
      },
      preload: {
        type: Boolean,
        default: false
      },
      stepSearh: {
        type: Boolean,
        default: true
      },
      selfField: {
        type: String,
        default: ""
      },
      parentField: {
        type: String,
        default: ""
      },
      multiple: {
        type: Boolean,
        default: false
      },
      map: {
        type: Object,
        default() {
          return {
            text: "text",
            value: "value"
          };
        }
      }
    },
    data() {
      return {
        loading: false,
        errorMessage: "",
        loadMore: {
          contentdown: "",
          contentrefresh: "",
          contentnomore: ""
        },
        dataList: [],
        selected: [],
        selectedIndex: 0,
        page: {
          current: this.pageCurrent,
          size: this.pageSize,
          count: 0
        }
      };
    },
    computed: {
      isLocalData() {
        return !this.collection.length;
      },
      isCloudData() {
        return this.collection.length > 0;
      },
      isCloudDataList() {
        return this.isCloudData && (!this.parentField && !this.selfField);
      },
      isCloudDataTree() {
        return this.isCloudData && this.parentField && this.selfField;
      },
      dataValue() {
        let isModelValue = Array.isArray(this.modelValue) ? this.modelValue.length > 0 : this.modelValue !== null || this.modelValue !== void 0;
        return isModelValue ? this.modelValue : this.value;
      },
      hasValue() {
        if (typeof this.dataValue === "number") {
          return true;
        }
        return this.dataValue != null && this.dataValue.length > 0;
      }
    },
    created() {
      this.$watch(() => {
        var al = [];
        [
          "pageCurrent",
          "pageSize",
          "spaceInfo",
          "value",
          "modelValue",
          "localdata",
          "collection",
          "action",
          "field",
          "orderby",
          "where",
          "getont",
          "getcount",
          "gettree"
        ].forEach((key) => {
          al.push(this[key]);
        });
        return al;
      }, (newValue, oldValue) => {
        for (let i2 = 2; i2 < newValue.length; i2++) {
          if (newValue[i2] != oldValue[i2]) {
            break;
          }
        }
        if (newValue[0] != oldValue[0]) {
          this.page.current = this.pageCurrent;
        }
        this.page.size = this.pageSize;
        this.onPropsChange();
      });
      this._treeData = [];
    },
    methods: {
      onPropsChange() {
        this._treeData = [];
      },
      // 填充 pickview 数据
      async loadData() {
        if (this.isLocalData) {
          this.loadLocalData();
        } else if (this.isCloudDataList) {
          this.loadCloudDataList();
        } else if (this.isCloudDataTree) {
          this.loadCloudDataTree();
        }
      },
      // 加载本地数据
      async loadLocalData() {
        this._treeData = [];
        this._extractTree(this.localdata, this._treeData);
        let inputValue = this.dataValue;
        if (inputValue === void 0) {
          return;
        }
        if (Array.isArray(inputValue)) {
          inputValue = inputValue[inputValue.length - 1];
          if (typeof inputValue === "object" && inputValue[this.map.value]) {
            inputValue = inputValue[this.map.value];
          }
        }
        this.selected = this._findNodePath(inputValue, this.localdata);
      },
      // 加载 Cloud 数据 (单列)
      async loadCloudDataList() {
        if (this.loading) {
          return;
        }
        this.loading = true;
        try {
          let response = await this.getCommand();
          let responseData = response.result.data;
          this._treeData = responseData;
          this._updateBindData();
          this._updateSelected();
          this.onDataChange();
        } catch (e2) {
          this.errorMessage = e2;
        } finally {
          this.loading = false;
        }
      },
      // 加载 Cloud 数据 (树形)
      async loadCloudDataTree() {
        if (this.loading) {
          return;
        }
        this.loading = true;
        try {
          let commandOptions = {
            field: this._cloudDataPostField(),
            where: this._cloudDataTreeWhere()
          };
          if (this.gettree) {
            commandOptions.startwith = `${this.selfField}=='${this.dataValue}'`;
          }
          let response = await this.getCommand(commandOptions);
          let responseData = response.result.data;
          this._treeData = responseData;
          this._updateBindData();
          this._updateSelected();
          this.onDataChange();
        } catch (e2) {
          this.errorMessage = e2;
        } finally {
          this.loading = false;
        }
      },
      // 加载 Cloud 数据 (节点)
      async loadCloudDataNode(callback) {
        if (this.loading) {
          return;
        }
        this.loading = true;
        try {
          let commandOptions = {
            field: this._cloudDataPostField(),
            where: this._cloudDataNodeWhere()
          };
          let response = await this.getCommand(commandOptions);
          let responseData = response.result.data;
          callback(responseData);
        } catch (e2) {
          this.errorMessage = e2;
        } finally {
          this.loading = false;
        }
      },
      // 回显 Cloud 数据
      getCloudDataValue() {
        if (this.isCloudDataList) {
          return this.getCloudDataListValue();
        }
        if (this.isCloudDataTree) {
          return this.getCloudDataTreeValue();
        }
      },
      // 回显 Cloud 数据 (单列)
      getCloudDataListValue() {
        let where = [];
        let whereField = this._getForeignKeyByField();
        if (whereField) {
          where.push(`${whereField} == '${this.dataValue}'`);
        }
        where = where.join(" || ");
        if (this.where) {
          where = `(${this.where}) && (${where})`;
        }
        return this.getCommand({
          field: this._cloudDataPostField(),
          where
        }).then((res) => {
          this.selected = res.result.data;
          return res.result.data;
        });
      },
      // 回显 Cloud 数据 (树形)
      getCloudDataTreeValue() {
        return this.getCommand({
          field: this._cloudDataPostField(),
          getTreePath: {
            startWith: `${this.selfField}=='${this.dataValue}'`
          }
        }).then((res) => {
          let treePath = [];
          this._extractTreePath(res.result.data, treePath);
          this.selected = treePath;
          return treePath;
        });
      },
      getCommand(options = {}) {
        let db = Ys.database(this.spaceInfo);
        const action = options.action || this.action;
        if (action) {
          db = db.action(action);
        }
        const collection = options.collection || this.collection;
        db = db.collection(collection);
        const where = options.where || this.where;
        if (!(!where || !Object.keys(where).length)) {
          db = db.where(where);
        }
        const field = options.field || this.field;
        if (field) {
          db = db.field(field);
        }
        const orderby = options.orderby || this.orderby;
        if (orderby) {
          db = db.orderBy(orderby);
        }
        const current = options.pageCurrent !== void 0 ? options.pageCurrent : this.page.current;
        const size = options.pageSize !== void 0 ? options.pageSize : this.page.size;
        const getCount = options.getcount !== void 0 ? options.getcount : this.getcount;
        const getTree = options.gettree !== void 0 ? options.gettree : this.gettree;
        const getOptions = {
          getCount,
          getTree
        };
        if (options.getTreePath) {
          getOptions.getTreePath = options.getTreePath;
        }
        db = db.skip(size * (current - 1)).limit(size).get(getOptions);
        return db;
      },
      _cloudDataPostField() {
        let fields = [this.field];
        if (this.parentField) {
          fields.push(`${this.parentField} as parent_value`);
        }
        return fields.join(",");
      },
      _cloudDataTreeWhere() {
        let result = [];
        let selected = this.selected;
        let parentField = this.parentField;
        if (parentField) {
          result.push(`${parentField} == null || ${parentField} == ""`);
        }
        if (selected.length) {
          for (var i2 = 0; i2 < selected.length - 1; i2++) {
            result.push(`${parentField} == '${selected[i2].value}'`);
          }
        }
        let where = [];
        if (this.where) {
          where.push(`(${this.where})`);
        }
        if (result.length) {
          where.push(`(${result.join(" || ")})`);
        }
        return where.join(" && ");
      },
      _cloudDataNodeWhere() {
        let where = [];
        let selected = this.selected;
        if (selected.length) {
          where.push(`${this.parentField} == '${selected[selected.length - 1].value}'`);
        }
        where = where.join(" || ");
        if (this.where) {
          return `(${this.where}) && (${where})`;
        }
        return where;
      },
      _getWhereByForeignKey() {
        let result = [];
        let whereField = this._getForeignKeyByField();
        if (whereField) {
          result.push(`${whereField} == '${this.dataValue}'`);
        }
        if (this.where) {
          return `(${this.where}) && (${result.join(" || ")})`;
        }
        return result.join(" || ");
      },
      _getForeignKeyByField() {
        let fields = this.field.split(",");
        let whereField = null;
        for (let i2 = 0; i2 < fields.length; i2++) {
          const items = fields[i2].split("as");
          if (items.length < 2) {
            continue;
          }
          if (items[1].trim() === "value") {
            whereField = items[0].trim();
            break;
          }
        }
        return whereField;
      },
      _updateBindData(node) {
        const {
          dataList,
          hasNodes
        } = this._filterData(this._treeData, this.selected);
        let isleaf = this._stepSearh === false && !hasNodes;
        if (node) {
          node.isleaf = isleaf;
        }
        this.dataList = dataList;
        this.selectedIndex = dataList.length - 1;
        if (!isleaf && this.selected.length < dataList.length) {
          this.selected.push({
            value: null,
            text: "请选择"
          });
        }
        return {
          isleaf,
          hasNodes
        };
      },
      _updateSelected() {
        let dl = this.dataList;
        let sl = this.selected;
        let textField = this.map.text;
        let valueField = this.map.value;
        for (let i2 = 0; i2 < sl.length; i2++) {
          let value = sl[i2].value;
          let dl2 = dl[i2];
          for (let j2 = 0; j2 < dl2.length; j2++) {
            let item2 = dl2[j2];
            if (item2[valueField] === value) {
              sl[i2].text = item2[textField];
              break;
            }
          }
        }
      },
      _filterData(data, paths) {
        let dataList = [];
        let hasNodes = true;
        dataList.push(data.filter((item) => {
          return item.parent_value === null || item.parent_value === void 0 || item.parent_value === "";
        }));
        for (let i2 = 0; i2 < paths.length; i2++) {
          let value = paths[i2].value;
          let nodes = data.filter((item) => {
            return item.parent_value === value;
          });
          if (nodes.length) {
            dataList.push(nodes);
          } else {
            hasNodes = false;
          }
        }
        return {
          dataList,
          hasNodes
        };
      },
      _extractTree(nodes, result, parent_value) {
        let valueField = this.map.value;
        for (let i2 = 0; i2 < nodes.length; i2++) {
          let node = nodes[i2];
          let child = {};
          for (let key in node) {
            if (key !== "children") {
              child[key] = node[key];
            }
          }
          if (parent_value !== null && parent_value !== void 0 && parent_value !== "") {
            child.parent_value = parent_value;
          }
          result.push(child);
          let children = node.children;
          if (children) {
            this._extractTree(children, result, node[valueField]);
          }
        }
      },
      _extractTreePath(nodes, result) {
        for (let i2 = 0; i2 < nodes.length; i2++) {
          let node = nodes[i2];
          let child = {};
          for (let key in node) {
            if (key !== "children") {
              child[key] = node[key];
            }
          }
          result.push(child);
          let children = node.children;
          if (children) {
            this._extractTreePath(children, result);
          }
        }
      },
      _findNodePath(key, nodes, path = []) {
        let textField = this.map.text;
        let valueField = this.map.value;
        for (let i2 = 0; i2 < nodes.length; i2++) {
          let node = nodes[i2];
          let children = node.children;
          let text = node[textField];
          let value = node[valueField];
          path.push({
            value,
            text
          });
          if (value === key) {
            return path;
          }
          if (children) {
            const p2 = this._findNodePath(key, children, path);
            if (p2.length) {
              return p2;
            }
          }
          path.pop();
        }
        return [];
      }
    }
  };
  const _sfc_main$M = {
    name: "UniDataPickerView",
    emits: ["nodeclick", "change", "datachange", "update:modelValue"],
    mixins: [dataPicker],
    props: {
      managedMode: {
        type: Boolean,
        default: false
      },
      ellipsis: {
        type: Boolean,
        default: true
      }
    },
    created() {
      if (!this.managedMode) {
        this.$nextTick(() => {
          this.loadData();
        });
      }
    },
    methods: {
      onPropsChange() {
        this._treeData = [];
        this.selectedIndex = 0;
        this.$nextTick(() => {
          this.loadData();
        });
      },
      handleSelect(index) {
        this.selectedIndex = index;
      },
      handleNodeClick(item, i2, j2) {
        if (item.disable) {
          return;
        }
        const node = this.dataList[i2][j2];
        const text = node[this.map.text];
        const value = node[this.map.value];
        if (i2 < this.selected.length - 1) {
          this.selected.splice(i2, this.selected.length - i2);
          this.selected.push({
            text,
            value
          });
        } else if (i2 === this.selected.length - 1) {
          this.selected.splice(i2, 1, {
            text,
            value
          });
        }
        if (node.isleaf) {
          this.onSelectedChange(node, node.isleaf);
          return;
        }
        const {
          isleaf,
          hasNodes
        } = this._updateBindData();
        if (this.isLocalData) {
          this.onSelectedChange(node, !hasNodes || isleaf);
        } else if (this.isCloudDataList) {
          this.onSelectedChange(node, true);
        } else if (this.isCloudDataTree) {
          if (isleaf) {
            this.onSelectedChange(node, node.isleaf);
          } else if (!hasNodes) {
            this.loadCloudDataNode((data) => {
              if (!data.length) {
                node.isleaf = true;
              } else {
                this._treeData.push(...data);
                this._updateBindData(node);
              }
              this.onSelectedChange(node, node.isleaf);
            });
          }
        }
      },
      updateData(data) {
        this._treeData = data.treeData;
        this.selected = data.selected;
        if (!this._treeData.length) {
          this.loadData();
        } else {
          this._updateBindData();
        }
      },
      onDataChange() {
        this.$emit("datachange");
      },
      onSelectedChange(node, isleaf) {
        if (isleaf) {
          this._dispatchEvent();
        }
        if (node) {
          this.$emit("nodeclick", node);
        }
      },
      _dispatchEvent() {
        this.$emit("change", this.selected.slice(0));
      }
    }
  };
  function _sfc_render$L(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_load_more = resolveEasycom(vue.resolveDynamicComponent("uni-load-more"), __easycom_0$6);
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-data-pickerview" }, [
      !_ctx.isCloudDataList ? (vue.openBlock(), vue.createElementBlock("scroll-view", {
        key: 0,
        class: "selected-area",
        "scroll-x": "true"
      }, [
        vue.createElementVNode("view", { class: "selected-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList(_ctx.selected, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: vue.normalizeClass(["selected-item", {
                  "selected-item-active": index == _ctx.selectedIndex
                }]),
                key: index,
                onClick: ($event) => $options.handleSelect(index)
              }, [
                vue.createElementVNode(
                  "text",
                  null,
                  vue.toDisplayString(item.text || ""),
                  1
                  /* TEXT */
                )
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "tab-c" }, [
        vue.createElementVNode("scroll-view", {
          class: "list",
          "scroll-y": true
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList(_ctx.dataList[_ctx.selectedIndex], (item, j2) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: vue.normalizeClass(["item", { "is-disabled": !!item.disable }]),
                key: j2,
                onClick: ($event) => $options.handleNodeClick(item, _ctx.selectedIndex, j2)
              }, [
                vue.createElementVNode(
                  "text",
                  { class: "item-text" },
                  vue.toDisplayString(item[_ctx.map.text]),
                  1
                  /* TEXT */
                ),
                _ctx.selected.length > _ctx.selectedIndex && item[_ctx.map.value] == _ctx.selected[_ctx.selectedIndex].value ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "check"
                })) : vue.createCommentVNode("v-if", true)
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        _ctx.loading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "loading-cover"
        }, [
          vue.createVNode(_component_uni_load_more, {
            class: "load-more",
            contentText: _ctx.loadMore,
            status: "loading"
          }, null, 8, ["contentText"])
        ])) : vue.createCommentVNode("v-if", true),
        _ctx.errorMessage ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "error-message"
        }, [
          vue.createElementVNode(
            "text",
            { class: "error-text" },
            vue.toDisplayString(_ctx.errorMessage),
            1
            /* TEXT */
          )
        ])) : vue.createCommentVNode("v-if", true)
      ])
    ]);
  }
  const DataPickerView = /* @__PURE__ */ _export_sfc(_sfc_main$M, [["render", _sfc_render$L], ["__scopeId", "data-v-91ec6a82"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-data-picker/components/uni-data-pickerview/uni-data-pickerview.vue"]]);
  const _sfc_main$L = {
    name: "UniDataPicker",
    emits: ["popupopened", "popupclosed", "nodeclick", "input", "change", "update:modelValue", "inputclick"],
    mixins: [dataPicker],
    components: {
      DataPickerView
    },
    props: {
      options: {
        type: [Object, Array],
        default() {
          return {};
        }
      },
      popupTitle: {
        type: String,
        default: "请选择"
      },
      placeholder: {
        type: String,
        default: "请选择"
      },
      heightMobile: {
        type: String,
        default: ""
      },
      readonly: {
        type: Boolean,
        default: false
      },
      clearIcon: {
        type: Boolean,
        default: true
      },
      border: {
        type: Boolean,
        default: true
      },
      split: {
        type: String,
        default: "/"
      },
      ellipsis: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        isOpened: false,
        inputSelected: []
      };
    },
    created() {
      this.$nextTick(() => {
        this.load();
      });
    },
    watch: {
      localdata: {
        handler() {
          this.load();
        },
        deep: true
      }
    },
    methods: {
      clear() {
        this._dispatchEvent([]);
      },
      onPropsChange() {
        this._treeData = [];
        this.selectedIndex = 0;
        this.load();
      },
      load() {
        if (this.readonly) {
          this._processReadonly(this.localdata, this.dataValue);
          return;
        }
        if (this.isLocalData) {
          this.loadData();
          this.inputSelected = this.selected.slice(0);
        } else if (this.isCloudDataList || this.isCloudDataTree) {
          this.loading = true;
          this.getCloudDataValue().then((res) => {
            this.loading = false;
            this.inputSelected = res;
          }).catch((err) => {
            this.loading = false;
            this.errorMessage = err;
          });
        }
      },
      show() {
        this.isOpened = true;
        setTimeout(() => {
          this.$refs.pickerView.updateData({
            treeData: this._treeData,
            selected: this.selected,
            selectedIndex: this.selectedIndex
          });
        }, 200);
        this.$emit("popupopened");
      },
      hide() {
        this.isOpened = false;
        this.$emit("popupclosed");
      },
      handleInput() {
        if (this.readonly) {
          this.$emit("inputclick");
          return;
        }
        this.show();
      },
      handleClose(e2) {
        this.hide();
      },
      onnodeclick(e2) {
        this.$emit("nodeclick", e2);
      },
      ondatachange(e2) {
        this._treeData = this.$refs.pickerView._treeData;
      },
      onchange(e2) {
        this.hide();
        this.$nextTick(() => {
          this.inputSelected = e2;
        });
        this._dispatchEvent(e2);
      },
      _processReadonly(dataList, value) {
        var isTree = dataList.findIndex((item2) => {
          return item2.children;
        });
        if (isTree > -1) {
          let inputValue;
          if (Array.isArray(value)) {
            inputValue = value[value.length - 1];
            if (typeof inputValue === "object" && inputValue.value) {
              inputValue = inputValue.value;
            }
          } else {
            inputValue = value;
          }
          this.inputSelected = this._findNodePath(inputValue, this.localdata);
          return;
        }
        if (!this.hasValue) {
          this.inputSelected = [];
          return;
        }
        let result = [];
        for (let i2 = 0; i2 < value.length; i2++) {
          var val = value[i2];
          var item = dataList.find((v2) => {
            return v2.value == val;
          });
          if (item) {
            result.push(item);
          }
        }
        if (result.length) {
          this.inputSelected = result;
        }
      },
      _filterForArray(data, valueArray) {
        var result = [];
        for (let i2 = 0; i2 < valueArray.length; i2++) {
          var value = valueArray[i2];
          var found = data.find((item) => {
            return item.value == value;
          });
          if (found) {
            result.push(found);
          }
        }
        return result;
      },
      _dispatchEvent(selected) {
        let item = {};
        if (selected.length) {
          var value = new Array(selected.length);
          for (var i2 = 0; i2 < selected.length; i2++) {
            value[i2] = selected[i2].value;
          }
          item = selected[selected.length - 1];
        } else {
          item.value = "";
        }
        if (this.formItem) {
          this.formItem.setValue(item.value);
        }
        this.$emit("input", item.value);
        this.$emit("update:modelValue", item.value);
        this.$emit("change", {
          detail: {
            value: selected
          }
        });
      }
    }
  };
  function _sfc_render$K(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_load_more = resolveEasycom(vue.resolveDynamicComponent("uni-load-more"), __easycom_0$6);
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$5);
    const _component_data_picker_view = vue.resolveComponent("data-picker-view");
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-data-tree" }, [
      vue.createElementVNode("view", {
        class: "uni-data-tree-input",
        onClick: _cache[1] || (_cache[1] = (...args) => $options.handleInput && $options.handleInput(...args))
      }, [
        vue.renderSlot(_ctx.$slots, "default", {
          options: $props.options,
          data: $data.inputSelected,
          error: _ctx.errorMessage
        }, () => [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["input-value", { "input-value-border": $props.border }])
            },
            [
              _ctx.errorMessage ? (vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: 0,
                  class: "selected-area error-text"
                },
                vue.toDisplayString(_ctx.errorMessage),
                1
                /* TEXT */
              )) : _ctx.loading && !$data.isOpened ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "selected-area"
              }, [
                vue.createVNode(_component_uni_load_more, {
                  class: "load-more",
                  contentText: _ctx.loadMore,
                  status: "loading"
                }, null, 8, ["contentText"])
              ])) : $data.inputSelected.length ? (vue.openBlock(), vue.createElementBlock("scroll-view", {
                key: 2,
                class: "selected-area",
                "scroll-x": "true"
              }, [
                vue.createElementVNode("view", { class: "selected-list" }, [
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($data.inputSelected, (item, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", {
                        class: "selected-item",
                        key: index
                      }, [
                        vue.createElementVNode(
                          "text",
                          { class: "text-color" },
                          vue.toDisplayString(item.text),
                          1
                          /* TEXT */
                        ),
                        index < $data.inputSelected.length - 1 ? (vue.openBlock(), vue.createElementBlock(
                          "text",
                          {
                            key: 0,
                            class: "input-split-line"
                          },
                          vue.toDisplayString($props.split),
                          1
                          /* TEXT */
                        )) : vue.createCommentVNode("v-if", true)
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ])
              ])) : (vue.openBlock(), vue.createElementBlock(
                "text",
                {
                  key: 3,
                  class: "selected-area placeholder"
                },
                vue.toDisplayString($props.placeholder),
                1
                /* TEXT */
              )),
              $props.clearIcon && !$props.readonly && $data.inputSelected.length ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 4,
                class: "icon-clear",
                onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $options.clear && $options.clear(...args), ["stop"]))
              }, [
                vue.createVNode(_component_uni_icons, {
                  type: "clear",
                  color: "#c0c4cc",
                  size: "24"
                })
              ])) : vue.createCommentVNode("v-if", true),
              (!$props.clearIcon || !$data.inputSelected.length) && !$props.readonly ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 5,
                class: "arrow-area"
              }, [
                vue.createElementVNode("view", { class: "input-arrow" })
              ])) : vue.createCommentVNode("v-if", true)
            ],
            2
            /* CLASS */
          )
        ], true)
      ]),
      $data.isOpened ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "uni-data-tree-cover",
        onClick: _cache[2] || (_cache[2] = (...args) => $options.handleClose && $options.handleClose(...args))
      })) : vue.createCommentVNode("v-if", true),
      $data.isOpened ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "uni-data-tree-dialog"
      }, [
        vue.createElementVNode("view", { class: "uni-popper__arrow" }),
        vue.createElementVNode("view", { class: "dialog-caption" }, [
          vue.createElementVNode("view", { class: "title-area" }, [
            vue.createElementVNode(
              "text",
              { class: "dialog-title" },
              vue.toDisplayString($props.popupTitle),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", {
            class: "dialog-close",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.handleClose && $options.handleClose(...args))
          }, [
            vue.createElementVNode("view", {
              class: "dialog-close-plus",
              "data-id": "close"
            }),
            vue.createElementVNode("view", {
              class: "dialog-close-plus dialog-close-rotate",
              "data-id": "close"
            })
          ])
        ]),
        vue.createVNode(_component_data_picker_view, {
          class: "picker-view",
          ref: "pickerView",
          modelValue: _ctx.dataValue,
          "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => _ctx.dataValue = $event),
          localdata: _ctx.localdata,
          preload: _ctx.preload,
          collection: _ctx.collection,
          field: _ctx.field,
          orderby: _ctx.orderby,
          where: _ctx.where,
          "step-searh": _ctx.stepSearh,
          "self-field": _ctx.selfField,
          "parent-field": _ctx.parentField,
          "managed-mode": true,
          map: _ctx.map,
          ellipsis: $props.ellipsis,
          onChange: $options.onchange,
          onDatachange: $options.ondatachange,
          onNodeclick: $options.onnodeclick
        }, null, 8, ["modelValue", "localdata", "preload", "collection", "field", "orderby", "where", "step-searh", "self-field", "parent-field", "map", "ellipsis", "onChange", "onDatachange", "onNodeclick"])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_0$4 = /* @__PURE__ */ _export_sfc(_sfc_main$L, [["render", _sfc_render$K], ["__scopeId", "data-v-2653531e"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-data-picker/components/uni-data-picker/uni-data-picker.vue"]]);
  const _sfc_main$K = {
    data() {
      return {
        account: "test-app",
        username: "test-app",
        password: "Test123456",
        confirmPassword: "Test123456",
        phone: "13888888888",
        department: "二十一室",
        departments: []
      };
    },
    mounted() {
      this.getDepartments();
    },
    methods: {
      validatePasswordComplexity(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return regex.test(password);
      },
      submitRegister() {
        const data = {
          "account": this.account,
          "department": this.department,
          "name": this.username,
          "password": this.password,
          "phone": this.phone,
          "role": "ACTOR",
          "status": "USING"
        };
        if (this.password !== this.confirmPassword) {
          uni.showToast({
            title: "两次输入的密码不一致",
            icon: "none"
          });
          return;
        }
        if (!this.validatePasswordComplexity(this.password)) {
          uni.showToast({
            title: "密码必须包含至少8个字符，且包含大小写字母和数字",
            icon: "none"
          });
          return;
        }
        register(data).then((res) => {
          formatAppLog("log", "at pages/register/register.vue:75", res);
          if (res.code == 200) {
            uni.showToast({
              title: "注册成功",
              duration: 2e3
            }).then((res2) => {
              uni.navigateTo({
                url: "/pages/login/login"
                // 替换为目标页面的路径
              });
            });
          }
        });
      },
      // 获取部门列表
      getDepartments() {
        this.departments = [
          {
            text: "二十一室",
            value: "二十一室"
          },
          {
            text: "二十二室",
            value: "二十二室"
          },
          {
            text: "二十三室",
            value: "二十三室"
          }
        ];
      },
      dataPickerChange(item) {
        this.department = item.detail.value[0].text;
        formatAppLog("log", "at pages/register/register.vue:107", this.department);
      }
    }
  };
  function _sfc_render$J(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_data_picker = resolveEasycom(vue.resolveDynamicComponent("uni-data-picker"), __easycom_0$4);
    return vue.openBlock(), vue.createElementBlock("view", { class: "layout" }, [
      vue.createElementVNode("view", { class: "text" }, [
        vue.createElementVNode("text", null, "欢迎注册！")
      ]),
      vue.createElementVNode("view", {
        class: "account",
        style: { "margin-top": "25px" }
      }, [
        vue.createElementVNode("view", {
          class: "title",
          style: { "margin-bottom": "7px" }
        }, "账户名"),
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            class: "uni-input",
            focus: "",
            placeholder: "请输入账户名",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.account = $event)
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $data.account]
        ]),
        vue.createElementVNode("view", {
          class: "title",
          style: { "margin-bottom": "7px" }
        }, "姓名"),
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            class: "uni-input",
            focus: "",
            placeholder: "请输入姓名",
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.username = $event)
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $data.username]
        ]),
        vue.createElementVNode("view", {
          class: "title",
          style: { "margin": "15px 0px 7px 0px" }
        }, "密码"),
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            class: "uni-input",
            password: "",
            type: "text",
            placeholder: "请输入密码",
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => $data.password = $event)
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $data.password]
        ]),
        vue.createElementVNode("view", {
          class: "title",
          style: { "margin": "15px 0px 7px 0px" }
        }, "再次输入密码"),
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            class: "uni-input",
            password: "",
            type: "text",
            placeholder: "请再次输入密码",
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.confirmPassword = $event)
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $data.confirmPassword]
        ]),
        vue.createElementVNode("view", {
          class: "title",
          style: { "margin": "15px 0px 7px 0px" }
        }, "部门"),
        vue.createVNode(_component_uni_data_picker, {
          localdata: $data.departments,
          "popup-title": "请选择部门",
          onChange: $options.dataPickerChange
        }, null, 8, ["localdata", "onChange"]),
        vue.createElementVNode("view", {
          class: "title",
          style: { "margin": "15px 0px 7px 0px" }
        }, "手机号"),
        vue.withDirectives(vue.createElementVNode(
          "input",
          {
            class: "uni-input",
            type: "text",
            placeholder: "请输入手机号",
            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => $data.phone = $event)
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $data.phone]
        ]),
        vue.createElementVNode("button", {
          type: "primary",
          style: { "margin-top": "30px" },
          onClick: _cache[5] || (_cache[5] = (...args) => $options.submitRegister && $options.submitRegister(...args))
        }, "注册")
      ])
    ]);
  }
  const PagesRegisterRegister = /* @__PURE__ */ _export_sfc(_sfc_main$K, [["render", _sfc_render$J], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/register/register.vue"]]);
  const _sfc_main$J = {
    data() {
      return {};
    },
    methods: {}
  };
  function _sfc_render$I(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view");
  }
  const PagesForgetPasswordForgetPassword = /* @__PURE__ */ _export_sfc(_sfc_main$J, [["render", _sfc_render$I], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/forgetPassword/forgetPassword.vue"]]);
  const _imports_0$9 = "/static/icon/finger.png";
  const _sfc_main$I = {
    data() {
      return {
        result: "",
        disabled: true,
        show: false
      };
    },
    onLoad() {
      if (!plus.fingerprint.isSupport()) {
        this.result = "此设备不支持指纹识别";
        this.disabled = true;
      } else if (!plus.fingerprint.isKeyguardSecure()) {
        this.result = "此设备未设置密码锁屏，无法使用指纹识别";
        this.disabled = true;
      } else if (!plus.fingerprint.isEnrolledFingerprints()) {
        this.result = "此设备未录入指纹，请到设置中开启";
        this.disabled = true;
      } else {
        this.result = "此设备支持指纹识别";
        this.disabled = false;
      }
    },
    methods: {
      printCancel: function() {
        plus.fingerprint.cancel();
        this.result = "停止指纹识别";
      },
      fingerprint: function() {
        let that = this;
        plus.fingerprint.authenticate(function() {
          plus.nativeUI.closeWaiting();
          that.show = false;
          that.result = "指纹识别成功";
          const username = uni.getStorageSync("username");
          const password = uni.getStorageSync("password");
          login({
            account: username,
            password
          }).then((res) => {
            formatAppLog("log", "at pages/fingerLogin/fingerLogin.vue:68", res);
            if (res.code == 200) {
              uni.setStorageSync("token", res.data.token);
              uni.setStorageSync("userInfo", res.data.account);
              formatAppLog("log", "at pages/fingerLogin/fingerLogin.vue:72", uni.getStorageSync("token"));
              uni.showToast({
                title: "登录成功",
                duration: 2e3
              }).then(
                that.goToTask()
              );
            }
          });
        }, function(e2) {
          switch (e2.code) {
            case e2.AUTHENTICATE_MISMATCH:
              plus.nativeUI.toast("指纹匹配失败，请重新输入");
              break;
            case e2.AUTHENTICATE_OVERLIMIT:
              plus.nativeUI.closeWaiting();
              plus.nativeUI.alert("指纹识别失败次数超出限制，请使用其它方式进行认证");
              break;
            case e2.CANCEL:
              plus.nativeUI.toast("已取消识别");
              break;
            default:
              plus.nativeUI.closeWaiting();
              plus.nativeUI.alert("指纹识别失败，请重试");
              break;
          }
        });
        if ("Android" == plus.os.name) {
          this.show = true;
        }
      },
      goToTask() {
        uni.redirectTo({
          url: "/pages/tabBar/tabBar"
        });
      }
    }
  };
  function _sfc_render$H(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "layout" }, [
      vue.createElementVNode("view", {
        class: "fingerView",
        onClick: _cache[0] || (_cache[0] = ($event) => $options.fingerprint()),
        disabled: $data.disabled
      }, [
        vue.createElementVNode("image", {
          src: _imports_0$9,
          class: "fingerIcon"
        })
      ], 8, ["disabled"]),
      vue.createElementVNode("view", {
        onClick: _cache[1] || (_cache[1] = ($event) => $options.fingerprint()),
        disabled: $data.disabled
      }, [
        vue.createElementVNode("text", { style: { "color": "rgb(45, 130, 254)" } }, "点击进行指纹认证")
      ], 8, ["disabled"]),
      vue.createElementVNode("view", { style: { "margin-top": "70px" } }, [
        vue.createElementVNode("text", null, [
          vue.createElementVNode("navigator", {
            url: "/pages/login/login",
            "open-type": "navigateBack",
            "hover-class": "null"
          }, "账号密码登录")
        ])
      ]),
      vue.createElementVNode(
        "view",
        { style: { "color": "red" } },
        vue.toDisplayString($data.result),
        1
        /* TEXT */
      )
    ]);
  }
  const PagesFingerLoginFingerLogin = /* @__PURE__ */ _export_sfc(_sfc_main$I, [["render", _sfc_render$H], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/fingerLogin/fingerLogin.vue"]]);
  const searchMission = (query) => {
    formatAppLog("log", "at utils/api/mission.js:6", "query", query);
    return request({
      url: `/mission/search`,
      method: "post",
      data: query
    });
  };
  const deleteMission = (missionId) => {
    return request({
      url: `/mission/delete/${missionId}`,
      method: "delete"
    });
  };
  const getMissionFileById = (missionId, curPage, pageSize) => {
    return request({
      url: `/missionFile/get/${missionId}/${curPage}/${pageSize}`,
      method: "get"
    });
  };
  const getMissionDetails = (params) => {
    return request({
      url: `/mission/details`,
      method: "post",
      data: params
    });
  };
  const _imports_0$8 = "/static/icon/location_grey.png";
  const _imports_1$3 = "/static/icon/time_grey.png";
  const _sfc_main$H = {
    name: "TaskPage",
    data() {
      return {
        currentTime: /* @__PURE__ */ new Date(),
        taskItem: [],
        tabbarIndex: 0,
        handlingType: [
          {
            value: "全部"
          },
          {
            value: "未开始"
          },
          {
            value: "进行中"
          },
          {
            value: "已完成"
          }
        ],
        query: {
          "param": {
            "curPage": 1,
            "pageSize": 10
          },
          "statuses": [
            "USING",
            "UNUSED",
            "COMING"
          ]
        }
      };
    },
    mounted() {
      this.initializeTasks();
    },
    computed: {},
    methods: {
      initializeTasks() {
        uni.showLoading({
          title: "正在加载任务",
          mask: true
        });
        searchMission(this.query).then((res) => {
          this.taskItem = res.data.records.map((e2) => ({
            id: e2.id,
            task_name: e2.missionName,
            country: e2.missionCountry,
            position: e2.missionCity,
            start_time: e2.missionStartTime,
            end_time: e2.missionEndTime,
            type: this.getTaskType(e2.missionStartTime, e2.missionEndTime),
            description: e2.missionDescription,
            key: e2.missionPassword,
            latitude: e2.latitude,
            longitude: e2.longitude
          }));
          uni.hideLoading();
        });
      },
      getItems(index) {
        switch (index) {
          case 0:
            return this.taskItem;
          case 1:
            return this.filterUpcomingTasks();
          case 2:
            return this.filterComingTasks();
          case 3:
            return this.filterEndedTasks();
        }
      },
      getTaskType(startTime, endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);
        if (this.currentTime < start) {
          return "1";
        } else if (this.currentTime >= start && this.currentTime <= end) {
          return "2";
        } else {
          return "3";
        }
      },
      getTypeString(type) {
        switch (type) {
          case "1":
            return "未开始";
          case "2":
            return "进行中";
          case "3":
            return "已完成";
        }
      },
      getColor(type) {
        switch (type) {
          case "1":
            return "#ffcccc";
          case "2":
            return "#ccffcc";
          case "3":
            return "#dadada";
          default:
            return "#ffffff";
        }
      },
      showType(tbIndex) {
        this.tabbarIndex = tbIndex;
        formatAppLog("info", "at pages/task/task.vue:178", this.tabbarIndex);
      },
      filterUpcomingTasks() {
        return this.taskItem.filter((item) => item.type === "1");
      },
      filterComingTasks() {
        return this.taskItem.filter((item) => item.type === "2");
      },
      filterEndedTasks() {
        return this.taskItem.filter((item) => item.type === "3");
      },
      goToDetail(index, tabbarIndex) {
        var jsonData = this.getItems(tabbarIndex)[index];
        var strData = JSON.stringify(jsonData);
        uni.navigateTo({
          url: `/pages/task/task_detail/task_detail?taskItem=${strData}`
        });
      }
    }
  };
  function _sfc_render$G(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createCommentVNode(" 顶部Tab菜单 "),
      vue.createElementVNode("view", { class: "topTabBar" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.handlingType, (item, tbIndex) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "grid",
              key: tbIndex,
              onClick: ($event) => $options.showType(tbIndex)
            }, [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["text", [tbIndex === $data.tabbarIndex ? "active" : ""]])
                },
                vue.toDisplayString(item.value),
                3
                /* TEXT, CLASS */
              )
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createCommentVNode(" 任务列表展示区域 "),
      vue.createElementVNode("view", { style: { "margin-top": "100upx", "padding": "0 20upx 50px 20upx" } }, [
        vue.createCommentVNode(" 循环设置四个菜单项 "),
        (vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList(4, (top_item, top_index) => {
            return vue.createElementVNode("view", { key: top_index }, [
              vue.createCommentVNode(" 根据top_index决定所属菜单项 "),
              $data.tabbarIndex === top_index ? (vue.openBlock(), vue.createElementBlock(
                vue.Fragment,
                { key: 0 },
                [
                  vue.createCommentVNode(" 任务列表 "),
                  (vue.openBlock(true), vue.createElementBlock(
                    vue.Fragment,
                    null,
                    vue.renderList($options.getItems($data.tabbarIndex), (item, index) => {
                      return vue.openBlock(), vue.createElementBlock("view", { key: index }, [
                        vue.createCommentVNode(" 列表项 "),
                        vue.createElementVNode("view", {
                          onClick: ($event) => $options.goToDetail(index, $data.tabbarIndex),
                          class: "task_item"
                        }, [
                          vue.createCommentVNode(" 任务名称、任务状态 "),
                          vue.createElementVNode("view", { class: "item_top" }, [
                            vue.createElementVNode("view", null, [
                              vue.createElementVNode(
                                "text",
                                null,
                                vue.toDisplayString(item.task_name),
                                1
                                /* TEXT */
                              )
                            ]),
                            vue.createElementVNode("view", null, [
                              vue.createElementVNode(
                                "text",
                                {
                                  style: vue.normalizeStyle({ background: $options.getColor(item.type) })
                                },
                                vue.toDisplayString($options.getTypeString(item.type)),
                                5
                                /* TEXT, STYLE */
                              )
                            ])
                          ]),
                          vue.createCommentVNode(" 任务地点 "),
                          vue.createElementVNode("view", { class: "item_bottom" }, [
                            vue.createElementVNode("view", null, [
                              vue.createElementVNode("image", {
                                src: _imports_0$8,
                                style: { "width": "15px", "height": "15px" }
                              })
                            ]),
                            vue.createElementVNode("view", { style: { "margin-left": "7px" } }, [
                              vue.createElementVNode(
                                "text",
                                { style: { "line-height": "20px", "text-align": "center" } },
                                vue.toDisplayString(item.position),
                                1
                                /* TEXT */
                              )
                            ])
                          ]),
                          vue.createCommentVNode(" 任务时间 "),
                          vue.createElementVNode("view", { class: "item_bottom" }, [
                            vue.createElementVNode("view", null, [
                              vue.createElementVNode("image", {
                                src: _imports_1$3,
                                style: { "width": "16px", "height": "16px" }
                              })
                            ]),
                            vue.createElementVNode("view", { style: { "margin-left": "7px" } }, [
                              vue.createElementVNode(
                                "text",
                                null,
                                vue.toDisplayString(item.start_time) + " - " + vue.toDisplayString(item.end_time),
                                1
                                /* TEXT */
                              )
                            ])
                          ])
                        ], 8, ["onClick"])
                      ]);
                    }),
                    128
                    /* KEYED_FRAGMENT */
                  ))
                ],
                64
                /* STABLE_FRAGMENT */
              )) : vue.createCommentVNode("v-if", true)
            ]);
          }),
          64
          /* STABLE_FRAGMENT */
        ))
      ])
    ]);
  }
  const PagesTaskTask = /* @__PURE__ */ _export_sfc(_sfc_main$H, [["render", _sfc_render$G], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/task/task.vue"]]);
  const _sfc_main$G = {
    name: "uni-data-select",
    mixins: [Ys.mixinDatacom || {}],
    props: {
      localdata: {
        type: Array,
        default() {
          return [];
        }
      },
      value: {
        type: [String, Number],
        default: ""
      },
      modelValue: {
        type: [String, Number],
        default: ""
      },
      label: {
        type: String,
        default: ""
      },
      placeholder: {
        type: String,
        default: "请选择"
      },
      emptyTips: {
        type: String,
        default: "无选项"
      },
      clear: {
        type: Boolean,
        default: true
      },
      defItem: {
        type: Number,
        default: 0
      },
      disabled: {
        type: Boolean,
        default: false
      },
      // 格式化输出 用法 field="_id as value, version as text, uni_platform as label" format="{label} - {text}"
      format: {
        type: String,
        default: ""
      },
      placement: {
        type: String,
        default: "bottom"
      }
    },
    data() {
      return {
        showSelector: false,
        current: "",
        mixinDatacomResData: [],
        apps: [],
        channels: [],
        cacheKey: "uni-data-select-lastSelectedValue"
      };
    },
    created() {
      this.debounceGet = this.debounce(() => {
        this.query();
      }, 300);
      if (this.collection && !this.localdata.length) {
        this.debounceGet();
      }
    },
    computed: {
      typePlaceholder() {
        const text = {
          "opendb-stat-app-versions": "版本",
          "opendb-app-channels": "渠道",
          "opendb-app-list": "应用"
        };
        const common = this.placeholder;
        const placeholder = text[this.collection];
        return placeholder ? common + placeholder : common;
      },
      valueCom() {
        return this.modelValue;
      },
      textShow() {
        let text = this.current;
        if (text.length > 10) {
          return text.slice(0, 25) + "...";
        }
        return text;
      },
      getOffsetByPlacement() {
        switch (this.placement) {
          case "top":
            return "bottom:calc(100% + 12px);";
          case "bottom":
            return "top:calc(100% + 12px);";
        }
      }
    },
    watch: {
      localdata: {
        immediate: true,
        handler(val, old) {
          if (Array.isArray(val) && old !== val) {
            this.mixinDatacomResData = val;
          }
        }
      },
      valueCom(val, old) {
        this.initDefVal();
      },
      mixinDatacomResData: {
        immediate: true,
        handler(val) {
          if (val.length) {
            this.initDefVal();
          }
        }
      }
    },
    methods: {
      debounce(fn, time = 100) {
        let timer = null;
        return function(...args) {
          if (timer)
            clearTimeout(timer);
          timer = setTimeout(() => {
            fn.apply(this, args);
          }, time);
        };
      },
      // 执行数据库查询
      query() {
        this.mixinDatacomEasyGet();
      },
      // 监听查询条件变更事件
      onMixinDatacomPropsChange() {
        if (this.collection) {
          this.debounceGet();
        }
      },
      initDefVal() {
        let defValue = "";
        if ((this.valueCom || this.valueCom === 0) && !this.isDisabled(this.valueCom)) {
          defValue = this.valueCom;
        } else {
          let strogeValue;
          if (this.collection) {
            strogeValue = this.getCache();
          }
          if (strogeValue || strogeValue === 0) {
            defValue = strogeValue;
          } else {
            let defItem = "";
            if (this.defItem > 0 && this.defItem <= this.mixinDatacomResData.length) {
              defItem = this.mixinDatacomResData[this.defItem - 1].value;
            }
            defValue = defItem;
          }
          if (defValue || defValue === 0) {
            this.emit(defValue);
          }
        }
        const def = this.mixinDatacomResData.find((item) => item.value === defValue);
        this.current = def ? this.formatItemName(def) : "";
      },
      /**
       * @param {[String, Number]} value
       * 判断用户给的 value 是否同时为禁用状态
       */
      isDisabled(value) {
        let isDisabled = false;
        this.mixinDatacomResData.forEach((item) => {
          if (item.value === value) {
            isDisabled = item.disable;
          }
        });
        return isDisabled;
      },
      clearVal() {
        this.emit("");
        if (this.collection) {
          this.removeCache();
        }
      },
      change(item) {
        if (!item.disable) {
          this.showSelector = false;
          this.current = this.formatItemName(item);
          this.emit(item.value);
        }
      },
      emit(val) {
        this.$emit("input", val);
        this.$emit("update:modelValue", val);
        this.$emit("change", val);
        if (this.collection) {
          this.setCache(val);
        }
      },
      toggleSelector() {
        if (this.disabled) {
          return;
        }
        this.showSelector = !this.showSelector;
      },
      formatItemName(item) {
        let {
          text,
          value,
          channel_code
        } = item;
        channel_code = channel_code ? `(${channel_code})` : "";
        if (this.format) {
          let str = "";
          str = this.format;
          for (let key in item) {
            str = str.replace(new RegExp(`{${key}}`, "g"), item[key]);
          }
          return str;
        } else {
          return this.collection.indexOf("app-list") > 0 ? `${text}(${value})` : text ? text : `未命名${channel_code}`;
        }
      },
      // 获取当前加载的数据
      getLoadData() {
        return this.mixinDatacomResData;
      },
      // 获取当前缓存key
      getCurrentCacheKey() {
        return this.collection;
      },
      // 获取缓存
      getCache(name = this.getCurrentCacheKey()) {
        let cacheData = uni.getStorageSync(this.cacheKey) || {};
        return cacheData[name];
      },
      // 设置缓存
      setCache(value, name = this.getCurrentCacheKey()) {
        let cacheData = uni.getStorageSync(this.cacheKey) || {};
        cacheData[name] = value;
        uni.setStorageSync(this.cacheKey, cacheData);
      },
      // 删除缓存
      removeCache(name = this.getCurrentCacheKey()) {
        let cacheData = uni.getStorageSync(this.cacheKey) || {};
        delete cacheData[name];
        uni.setStorageSync(this.cacheKey, cacheData);
      }
    }
  };
  function _sfc_render$F(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$5);
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-stat__select" }, [
      $props.label ? (vue.openBlock(), vue.createElementBlock(
        "span",
        {
          key: 0,
          class: "uni-label-text hide-on-phone"
        },
        vue.toDisplayString($props.label + "："),
        1
        /* TEXT */
      )) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["uni-stat-box", { "uni-stat__actived": $data.current }])
        },
        [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["uni-select", { "uni-select--disabled": $props.disabled }])
            },
            [
              vue.createElementVNode("view", {
                class: "uni-select__input-box",
                onClick: _cache[1] || (_cache[1] = (...args) => $options.toggleSelector && $options.toggleSelector(...args))
              }, [
                $data.current ? (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 0,
                    class: "uni-select__input-text"
                  },
                  vue.toDisplayString($options.textShow),
                  1
                  /* TEXT */
                )) : (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 1,
                    class: "uni-select__input-text uni-select__input-placeholder"
                  },
                  vue.toDisplayString($options.typePlaceholder),
                  1
                  /* TEXT */
                )),
                $data.current && $props.clear && !$props.disabled ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 2,
                  onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $options.clearVal && $options.clearVal(...args), ["stop"]))
                }, [
                  vue.createVNode(_component_uni_icons, {
                    type: "clear",
                    color: "#c0c4cc",
                    size: "24"
                  })
                ])) : (vue.openBlock(), vue.createElementBlock("view", { key: 3 }, [
                  vue.createVNode(_component_uni_icons, {
                    type: $data.showSelector ? "top" : "bottom",
                    size: "14",
                    color: "#999"
                  }, null, 8, ["type"])
                ]))
              ]),
              $data.showSelector ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "uni-select--mask",
                onClick: _cache[2] || (_cache[2] = (...args) => $options.toggleSelector && $options.toggleSelector(...args))
              })) : vue.createCommentVNode("v-if", true),
              $data.showSelector ? (vue.openBlock(), vue.createElementBlock(
                "view",
                {
                  key: 1,
                  class: "uni-select__selector",
                  style: vue.normalizeStyle($options.getOffsetByPlacement)
                },
                [
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass($props.placement == "bottom" ? "uni-popper__arrow_bottom" : "uni-popper__arrow_top")
                    },
                    null,
                    2
                    /* CLASS */
                  ),
                  vue.createElementVNode("scroll-view", {
                    "scroll-y": "true",
                    class: "uni-select__selector-scroll"
                  }, [
                    $data.mixinDatacomResData.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "uni-select__selector-empty"
                    }, [
                      vue.createElementVNode(
                        "text",
                        null,
                        vue.toDisplayString($props.emptyTips),
                        1
                        /* TEXT */
                      )
                    ])) : (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      { key: 1 },
                      vue.renderList($data.mixinDatacomResData, (item, index) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          class: "uni-select__selector-item",
                          key: index,
                          onClick: ($event) => $options.change(item)
                        }, [
                          vue.createElementVNode(
                            "text",
                            {
                              class: vue.normalizeClass({ "uni-select__selector__disabled": item.disable })
                            },
                            vue.toDisplayString($options.formatItemName(item)),
                            3
                            /* TEXT, CLASS */
                          )
                        ], 8, ["onClick"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])
                ],
                4
                /* STYLE */
              )) : vue.createCommentVNode("v-if", true)
            ],
            2
            /* CLASS */
          )
        ],
        2
        /* CLASS */
      )
    ]);
  }
  const __easycom_0$3 = /* @__PURE__ */ _export_sfc(_sfc_main$G, [["render", _sfc_render$F], ["__scopeId", "data-v-ddf9e0a2"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-data-select/components/uni-data-select/uni-data-select.vue"]]);
  class MPAnimation {
    constructor(options, _this) {
      this.options = options;
      this.animation = uni.createAnimation({
        ...options
      });
      this.currentStepAnimates = {};
      this.next = 0;
      this.$ = _this;
    }
    _nvuePushAnimates(type, args) {
      let aniObj = this.currentStepAnimates[this.next];
      let styles = {};
      if (!aniObj) {
        styles = {
          styles: {},
          config: {}
        };
      } else {
        styles = aniObj;
      }
      if (animateTypes1.includes(type)) {
        if (!styles.styles.transform) {
          styles.styles.transform = "";
        }
        let unit = "";
        if (type === "rotate") {
          unit = "deg";
        }
        styles.styles.transform += `${type}(${args + unit}) `;
      } else {
        styles.styles[type] = `${args}`;
      }
      this.currentStepAnimates[this.next] = styles;
    }
    _animateRun(styles = {}, config = {}) {
      let ref = this.$.$refs["ani"].ref;
      if (!ref)
        return;
      return new Promise((resolve, reject) => {
        nvueAnimation.transition(ref, {
          styles,
          ...config
        }, (res) => {
          resolve();
        });
      });
    }
    _nvueNextAnimate(animates, step = 0, fn) {
      let obj = animates[step];
      if (obj) {
        let {
          styles,
          config
        } = obj;
        this._animateRun(styles, config).then(() => {
          step += 1;
          this._nvueNextAnimate(animates, step, fn);
        });
      } else {
        this.currentStepAnimates = {};
        typeof fn === "function" && fn();
        this.isEnd = true;
      }
    }
    step(config = {}) {
      this.animation.step(config);
      return this;
    }
    run(fn) {
      this.$.animationData = this.animation.export();
      this.$.timer = setTimeout(() => {
        typeof fn === "function" && fn();
      }, this.$.durationTime);
    }
  }
  const animateTypes1 = [
    "matrix",
    "matrix3d",
    "rotate",
    "rotate3d",
    "rotateX",
    "rotateY",
    "rotateZ",
    "scale",
    "scale3d",
    "scaleX",
    "scaleY",
    "scaleZ",
    "skew",
    "skewX",
    "skewY",
    "translate",
    "translate3d",
    "translateX",
    "translateY",
    "translateZ"
  ];
  const animateTypes2 = ["opacity", "backgroundColor"];
  const animateTypes3 = ["width", "height", "left", "right", "top", "bottom"];
  animateTypes1.concat(animateTypes2, animateTypes3).forEach((type) => {
    MPAnimation.prototype[type] = function(...args) {
      this.animation[type](...args);
      return this;
    };
  });
  function createAnimation(option, _this) {
    if (!_this)
      return;
    clearTimeout(_this.timer);
    return new MPAnimation(option, _this);
  }
  const _sfc_main$F = {
    name: "uniTransition",
    emits: ["click", "change"],
    props: {
      show: {
        type: Boolean,
        default: false
      },
      modeClass: {
        type: [Array, String],
        default() {
          return "fade";
        }
      },
      duration: {
        type: Number,
        default: 300
      },
      styles: {
        type: Object,
        default() {
          return {};
        }
      },
      customClass: {
        type: String,
        default: ""
      },
      onceRender: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        isShow: false,
        transform: "",
        opacity: 1,
        animationData: {},
        durationTime: 300,
        config: {}
      };
    },
    watch: {
      show: {
        handler(newVal) {
          if (newVal) {
            this.open();
          } else {
            if (this.isShow) {
              this.close();
            }
          }
        },
        immediate: true
      }
    },
    computed: {
      // 生成样式数据
      stylesObject() {
        let styles = {
          ...this.styles,
          "transition-duration": this.duration / 1e3 + "s"
        };
        let transform = "";
        for (let i2 in styles) {
          let line = this.toLine(i2);
          transform += line + ":" + styles[i2] + ";";
        }
        return transform;
      },
      // 初始化动画条件
      transformStyles() {
        return "transform:" + this.transform + ";opacity:" + this.opacity + ";" + this.stylesObject;
      }
    },
    created() {
      this.config = {
        duration: this.duration,
        timingFunction: "ease",
        transformOrigin: "50% 50%",
        delay: 0
      };
      this.durationTime = this.duration;
    },
    methods: {
      /**
       *  ref 触发 初始化动画
       */
      init(obj = {}) {
        if (obj.duration) {
          this.durationTime = obj.duration;
        }
        this.animation = createAnimation(Object.assign(this.config, obj), this);
      },
      /**
       * 点击组件触发回调
       */
      onClick() {
        this.$emit("click", {
          detail: this.isShow
        });
      },
      /**
       * ref 触发 动画分组
       * @param {Object} obj
       */
      step(obj, config = {}) {
        if (!this.animation)
          return;
        for (let i2 in obj) {
          try {
            if (typeof obj[i2] === "object") {
              this.animation[i2](...obj[i2]);
            } else {
              this.animation[i2](obj[i2]);
            }
          } catch (e2) {
            formatAppLog("error", "at uni_modules/uni-transition/components/uni-transition/uni-transition.vue:148", `方法 ${i2} 不存在`);
          }
        }
        this.animation.step(config);
        return this;
      },
      /**
       *  ref 触发 执行动画
       */
      run(fn) {
        if (!this.animation)
          return;
        this.animation.run(fn);
      },
      // 开始过度动画
      open() {
        clearTimeout(this.timer);
        this.transform = "";
        this.isShow = true;
        let { opacity, transform } = this.styleInit(false);
        if (typeof opacity !== "undefined") {
          this.opacity = opacity;
        }
        this.transform = transform;
        this.$nextTick(() => {
          this.timer = setTimeout(() => {
            this.animation = createAnimation(this.config, this);
            this.tranfromInit(false).step();
            this.animation.run();
            this.$emit("change", {
              detail: this.isShow
            });
          }, 20);
        });
      },
      // 关闭过度动画
      close(type) {
        if (!this.animation)
          return;
        this.tranfromInit(true).step().run(() => {
          this.isShow = false;
          this.animationData = null;
          this.animation = null;
          let { opacity, transform } = this.styleInit(false);
          this.opacity = opacity || 1;
          this.transform = transform;
          this.$emit("change", {
            detail: this.isShow
          });
        });
      },
      // 处理动画开始前的默认样式
      styleInit(type) {
        let styles = {
          transform: ""
        };
        let buildStyle = (type2, mode) => {
          if (mode === "fade") {
            styles.opacity = this.animationType(type2)[mode];
          } else {
            styles.transform += this.animationType(type2)[mode] + " ";
          }
        };
        if (typeof this.modeClass === "string") {
          buildStyle(type, this.modeClass);
        } else {
          this.modeClass.forEach((mode) => {
            buildStyle(type, mode);
          });
        }
        return styles;
      },
      // 处理内置组合动画
      tranfromInit(type) {
        let buildTranfrom = (type2, mode) => {
          let aniNum = null;
          if (mode === "fade") {
            aniNum = type2 ? 0 : 1;
          } else {
            aniNum = type2 ? "-100%" : "0";
            if (mode === "zoom-in") {
              aniNum = type2 ? 0.8 : 1;
            }
            if (mode === "zoom-out") {
              aniNum = type2 ? 1.2 : 1;
            }
            if (mode === "slide-right") {
              aniNum = type2 ? "100%" : "0";
            }
            if (mode === "slide-bottom") {
              aniNum = type2 ? "100%" : "0";
            }
          }
          this.animation[this.animationMode()[mode]](aniNum);
        };
        if (typeof this.modeClass === "string") {
          buildTranfrom(type, this.modeClass);
        } else {
          this.modeClass.forEach((mode) => {
            buildTranfrom(type, mode);
          });
        }
        return this.animation;
      },
      animationType(type) {
        return {
          fade: type ? 0 : 1,
          "slide-top": `translateY(${type ? "0" : "-100%"})`,
          "slide-right": `translateX(${type ? "0" : "100%"})`,
          "slide-bottom": `translateY(${type ? "0" : "100%"})`,
          "slide-left": `translateX(${type ? "0" : "-100%"})`,
          "zoom-in": `scaleX(${type ? 1 : 0.8}) scaleY(${type ? 1 : 0.8})`,
          "zoom-out": `scaleX(${type ? 1 : 1.2}) scaleY(${type ? 1 : 1.2})`
        };
      },
      // 内置动画类型与实际动画对应字典
      animationMode() {
        return {
          fade: "opacity",
          "slide-top": "translateY",
          "slide-right": "translateX",
          "slide-bottom": "translateY",
          "slide-left": "translateX",
          "zoom-in": "scale",
          "zoom-out": "scale"
        };
      },
      // 驼峰转中横线
      toLine(name) {
        return name.replace(/([A-Z])/g, "-$1").toLowerCase();
      }
    }
  };
  function _sfc_render$E(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock("view", {
      ref: "ani",
      animation: $data.animationData,
      class: vue.normalizeClass($props.customClass),
      style: vue.normalizeStyle($options.transformStyles),
      onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args))
    }, [
      vue.renderSlot(_ctx.$slots, "default")
    ], 14, ["animation"])), [
      [vue.vShow, $data.isShow]
    ]);
  }
  const __easycom_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$F, [["render", _sfc_render$E], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-transition/components/uni-transition/uni-transition.vue"]]);
  const _sfc_main$E = {
    name: "uniPopup",
    components: {},
    emits: ["change", "maskClick"],
    props: {
      // 开启动画
      animation: {
        type: Boolean,
        default: true
      },
      // 弹出层类型，可选值，top: 顶部弹出层；bottom：底部弹出层；center：全屏弹出层
      // message: 消息提示 ; dialog : 对话框
      type: {
        type: String,
        default: "center"
      },
      // maskClick
      isMaskClick: {
        type: Boolean,
        default: null
      },
      // TODO 2 个版本后废弃属性 ，使用 isMaskClick
      maskClick: {
        type: Boolean,
        default: null
      },
      backgroundColor: {
        type: String,
        default: "none"
      },
      safeArea: {
        type: Boolean,
        default: true
      },
      maskBackgroundColor: {
        type: String,
        default: "rgba(0, 0, 0, 0.4)"
      },
      borderRadius: {
        type: String
      }
    },
    watch: {
      /**
       * 监听type类型
       */
      type: {
        handler: function(type) {
          if (!this.config[type])
            return;
          this[this.config[type]](true);
        },
        immediate: true
      },
      isDesktop: {
        handler: function(newVal) {
          if (!this.config[newVal])
            return;
          this[this.config[this.type]](true);
        },
        immediate: true
      },
      /**
       * 监听遮罩是否可点击
       * @param {Object} val
       */
      maskClick: {
        handler: function(val) {
          this.mkclick = val;
        },
        immediate: true
      },
      isMaskClick: {
        handler: function(val) {
          this.mkclick = val;
        },
        immediate: true
      },
      // H5 下禁止底部滚动
      showPopup(show) {
      }
    },
    data() {
      return {
        duration: 300,
        ani: [],
        showPopup: false,
        showTrans: false,
        popupWidth: 0,
        popupHeight: 0,
        config: {
          top: "top",
          bottom: "bottom",
          center: "center",
          left: "left",
          right: "right",
          message: "top",
          dialog: "center",
          share: "bottom"
        },
        maskClass: {
          position: "fixed",
          bottom: 0,
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)"
        },
        transClass: {
          backgroundColor: "transparent",
          borderRadius: this.borderRadius || "0",
          position: "fixed",
          left: 0,
          right: 0
        },
        maskShow: true,
        mkclick: true,
        popupstyle: "top"
      };
    },
    computed: {
      getStyles() {
        let res = { backgroundColor: this.bg };
        if (this.borderRadius || "0") {
          res = Object.assign(res, { borderRadius: this.borderRadius });
        }
        return res;
      },
      isDesktop() {
        return this.popupWidth >= 500 && this.popupHeight >= 500;
      },
      bg() {
        if (this.backgroundColor === "" || this.backgroundColor === "none") {
          return "transparent";
        }
        return this.backgroundColor;
      }
    },
    mounted() {
      const fixSize = () => {
        const {
          windowWidth,
          windowHeight,
          windowTop,
          safeArea,
          screenHeight,
          safeAreaInsets
        } = uni.getSystemInfoSync();
        this.popupWidth = windowWidth;
        this.popupHeight = windowHeight + (windowTop || 0);
        if (safeArea && this.safeArea) {
          this.safeAreaInsets = safeAreaInsets.bottom;
        } else {
          this.safeAreaInsets = 0;
        }
      };
      fixSize();
    },
    // TODO vue3
    unmounted() {
      this.setH5Visible();
    },
    activated() {
      this.setH5Visible(!this.showPopup);
    },
    deactivated() {
      this.setH5Visible(true);
    },
    created() {
      if (this.isMaskClick === null && this.maskClick === null) {
        this.mkclick = true;
      } else {
        this.mkclick = this.isMaskClick !== null ? this.isMaskClick : this.maskClick;
      }
      if (this.animation) {
        this.duration = 300;
      } else {
        this.duration = 0;
      }
      this.messageChild = null;
      this.clearPropagation = false;
      this.maskClass.backgroundColor = this.maskBackgroundColor;
    },
    methods: {
      setH5Visible(visible = true) {
      },
      /**
       * 公用方法，不显示遮罩层
       */
      closeMask() {
        this.maskShow = false;
      },
      /**
       * 公用方法，遮罩层禁止点击
       */
      disableMask() {
        this.mkclick = false;
      },
      // TODO nvue 取消冒泡
      clear(e2) {
        e2.stopPropagation();
        this.clearPropagation = true;
      },
      open(direction) {
        if (this.showPopup) {
          return;
        }
        let innerType = ["top", "center", "bottom", "left", "right", "message", "dialog", "share"];
        if (!(direction && innerType.indexOf(direction) !== -1)) {
          direction = this.type;
        }
        if (!this.config[direction]) {
          formatAppLog("error", "at uni_modules/uni-popup/components/uni-popup/uni-popup.vue:298", "缺少类型：", direction);
          return;
        }
        this[this.config[direction]]();
        this.$emit("change", {
          show: true,
          type: direction
        });
      },
      close(type) {
        this.showTrans = false;
        this.$emit("change", {
          show: false,
          type: this.type
        });
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.showPopup = false;
        }, 300);
      },
      // TODO 处理冒泡事件，头条的冒泡事件有问题 ，先这样兼容
      touchstart() {
        this.clearPropagation = false;
      },
      onTap() {
        if (this.clearPropagation) {
          this.clearPropagation = false;
          return;
        }
        this.$emit("maskClick");
        if (!this.mkclick)
          return;
        this.close();
      },
      /**
       * 顶部弹出样式处理
       */
      top(type) {
        this.popupstyle = this.isDesktop ? "fixforpc-top" : "top";
        this.ani = ["slide-top"];
        this.transClass = {
          position: "fixed",
          left: 0,
          right: 0,
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0"
        };
        if (type)
          return;
        this.showPopup = true;
        this.showTrans = true;
        this.$nextTick(() => {
          if (this.messageChild && this.type === "message") {
            this.messageChild.timerClose();
          }
        });
      },
      /**
       * 底部弹出样式处理
       */
      bottom(type) {
        this.popupstyle = "bottom";
        this.ani = ["slide-bottom"];
        this.transClass = {
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          paddingBottom: this.safeAreaInsets + "px",
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0"
        };
        if (type)
          return;
        this.showPopup = true;
        this.showTrans = true;
      },
      /**
       * 中间弹出样式处理
       */
      center(type) {
        this.popupstyle = "center";
        this.ani = ["zoom-out", "fade"];
        this.transClass = {
          position: "fixed",
          display: "flex",
          flexDirection: "column",
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: this.borderRadius || "0"
        };
        if (type)
          return;
        this.showPopup = true;
        this.showTrans = true;
      },
      left(type) {
        this.popupstyle = "left";
        this.ani = ["slide-left"];
        this.transClass = {
          position: "fixed",
          left: 0,
          bottom: 0,
          top: 0,
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0",
          display: "flex",
          flexDirection: "column"
        };
        if (type)
          return;
        this.showPopup = true;
        this.showTrans = true;
      },
      right(type) {
        this.popupstyle = "right";
        this.ani = ["slide-right"];
        this.transClass = {
          position: "fixed",
          bottom: 0,
          right: 0,
          top: 0,
          backgroundColor: this.bg,
          borderRadius: this.borderRadius || "0",
          display: "flex",
          flexDirection: "column"
        };
        if (type)
          return;
        this.showPopup = true;
        this.showTrans = true;
      }
    }
  };
  function _sfc_render$D(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_transition = resolveEasycom(vue.resolveDynamicComponent("uni-transition"), __easycom_0$2);
    return $data.showPopup ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: vue.normalizeClass(["uni-popup", [$data.popupstyle, $options.isDesktop ? "fixforpc-z-index" : ""]])
      },
      [
        vue.createElementVNode(
          "view",
          {
            onTouchstart: _cache[1] || (_cache[1] = (...args) => $options.touchstart && $options.touchstart(...args))
          },
          [
            $data.maskShow ? (vue.openBlock(), vue.createBlock(_component_uni_transition, {
              key: "1",
              name: "mask",
              "mode-class": "fade",
              styles: $data.maskClass,
              duration: $data.duration,
              show: $data.showTrans,
              onClick: $options.onTap
            }, null, 8, ["styles", "duration", "show", "onClick"])) : vue.createCommentVNode("v-if", true),
            vue.createVNode(_component_uni_transition, {
              key: "2",
              "mode-class": $data.ani,
              name: "content",
              styles: $data.transClass,
              duration: $data.duration,
              show: $data.showTrans,
              onClick: $options.onTap
            }, {
              default: vue.withCtx(() => [
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["uni-popup__wrapper", [$data.popupstyle]]),
                    style: vue.normalizeStyle($options.getStyles),
                    onClick: _cache[0] || (_cache[0] = (...args) => $options.clear && $options.clear(...args))
                  },
                  [
                    vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
                  ],
                  6
                  /* CLASS, STYLE */
                )
              ]),
              _: 3
              /* FORWARDED */
            }, 8, ["mode-class", "styles", "duration", "show", "onClick"])
          ],
          32
          /* NEED_HYDRATION */
        )
      ],
      2
      /* CLASS */
    )) : vue.createCommentVNode("v-if", true);
  }
  const __easycom_4$1 = /* @__PURE__ */ _export_sfc(_sfc_main$E, [["render", _sfc_render$D], ["__scopeId", "data-v-4dd3c44b"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-popup/components/uni-popup/uni-popup.vue"]]);
  const _sfc_main$D = {
    name: "uniCollapseItem",
    props: {
      // 列表标题
      title: {
        type: String,
        default: ""
      },
      name: {
        type: [Number, String],
        default: ""
      },
      // 是否禁用
      disabled: {
        type: Boolean,
        default: false
      },
      // 是否显示动画,app 端默认不开启动画，卡顿严重
      showAnimation: {
        type: Boolean,
        default: false
      },
      // 是否展开
      open: {
        type: Boolean,
        default: false
      },
      // 缩略图
      thumb: {
        type: String,
        default: ""
      },
      // 标题分隔线显示类型
      titleBorder: {
        type: String,
        default: "auto"
      },
      border: {
        type: Boolean,
        default: true
      },
      showArrow: {
        type: Boolean,
        default: true
      }
    },
    data() {
      const elId = `Uni_${Math.ceil(Math.random() * 1e6).toString(36)}`;
      return {
        isOpen: false,
        isheight: null,
        height: 0,
        elId,
        nameSync: 0
      };
    },
    watch: {
      open(val) {
        this.isOpen = val;
        this.onClick(val, "init");
      }
    },
    updated(e2) {
      this.$nextTick(() => {
        this.init(true);
      });
    },
    created() {
      this.collapse = this.getCollapse();
      this.oldHeight = 0;
      this.onClick(this.open, "init");
    },
    // TODO vue3
    unmounted() {
      this.__isUnmounted = true;
      this.uninstall();
    },
    mounted() {
      if (!this.collapse)
        return;
      if (this.name !== "") {
        this.nameSync = this.name;
      } else {
        this.nameSync = this.collapse.childrens.length + "";
      }
      if (this.collapse.names.indexOf(this.nameSync) === -1) {
        this.collapse.names.push(this.nameSync);
      } else {
        formatAppLog("warn", "at uni_modules/uni-collapse/components/uni-collapse-item/uni-collapse-item.vue:154", `name 值 ${this.nameSync} 重复`);
      }
      if (this.collapse.childrens.indexOf(this) === -1) {
        this.collapse.childrens.push(this);
      }
      this.init();
    },
    methods: {
      init(type) {
        this.getCollapseHeight(type);
      },
      uninstall() {
        if (this.collapse) {
          this.collapse.childrens.forEach((item, index) => {
            if (item === this) {
              this.collapse.childrens.splice(index, 1);
            }
          });
          this.collapse.names.forEach((item, index) => {
            if (item === this.nameSync) {
              this.collapse.names.splice(index, 1);
            }
          });
        }
      },
      onClick(isOpen, type) {
        if (this.disabled)
          return;
        this.isOpen = isOpen;
        if (this.isOpen && this.collapse) {
          this.collapse.setAccordion(this);
        }
        if (type !== "init") {
          this.collapse.onChange(isOpen, this);
        }
      },
      getCollapseHeight(type, index = 0) {
        const views = uni.createSelectorQuery().in(this);
        views.select(`#${this.elId}`).fields({
          size: true
        }, (data) => {
          if (index >= 10)
            return;
          if (!data) {
            index++;
            this.getCollapseHeight(false, index);
            return;
          }
          this.height = data.height;
          this.isheight = true;
          if (type)
            return;
          this.onClick(this.isOpen, "init");
        }).exec();
      },
      getNvueHwight(type) {
        dom.getComponentRect(this.$refs["collapse--hook"], (option) => {
          if (option && option.result && option.size) {
            this.height = option.size.height;
            this.isheight = true;
            if (type)
              return;
            this.onClick(this.open, "init");
          }
        });
      },
      /**
       * 获取父元素实例
       */
      getCollapse(name = "uniCollapse") {
        let parent = this.$parent;
        let parentName = parent.$options.name;
        while (parentName !== name) {
          parent = parent.$parent;
          if (!parent)
            return false;
          parentName = parent.$options.name;
        }
        return parent;
      }
    }
  };
  function _sfc_render$C(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$5);
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-collapse-item" }, [
      vue.createCommentVNode(" onClick(!isOpen) "),
      vue.createElementVNode(
        "view",
        {
          onClick: _cache[0] || (_cache[0] = ($event) => $options.onClick(!$data.isOpen)),
          class: vue.normalizeClass(["uni-collapse-item__title", { "is-open": $data.isOpen && $props.titleBorder === "auto", "uni-collapse-item-border": $props.titleBorder !== "none" }])
        },
        [
          vue.createElementVNode("view", { class: "uni-collapse-item__title-wrap" }, [
            vue.renderSlot(_ctx.$slots, "title", {}, () => [
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["uni-collapse-item__title-box", { "is-disabled": $props.disabled }])
                },
                [
                  $props.thumb ? (vue.openBlock(), vue.createElementBlock("image", {
                    key: 0,
                    src: $props.thumb,
                    class: "uni-collapse-item__title-img"
                  }, null, 8, ["src"])) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode(
                    "text",
                    { class: "uni-collapse-item__title-text" },
                    vue.toDisplayString($props.title),
                    1
                    /* TEXT */
                  )
                ],
                2
                /* CLASS */
              )
            ], true)
          ]),
          $props.showArrow ? (vue.openBlock(), vue.createElementBlock(
            "view",
            {
              key: 0,
              class: vue.normalizeClass([{ "uni-collapse-item__title-arrow-active": $data.isOpen, "uni-collapse-item--animation": $props.showAnimation === true }, "uni-collapse-item__title-arrow"])
            },
            [
              vue.createVNode(_component_uni_icons, {
                color: $props.disabled ? "#ddd" : "#bbb",
                size: "14",
                type: "bottom"
              }, null, 8, ["color"])
            ],
            2
            /* CLASS */
          )) : vue.createCommentVNode("v-if", true)
        ],
        2
        /* CLASS */
      ),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["uni-collapse-item__wrap", { "is--transition": $props.showAnimation }]),
          style: vue.normalizeStyle({ height: ($data.isOpen ? $data.height : 0) + "px" })
        },
        [
          vue.createElementVNode("view", {
            id: $data.elId,
            ref: "collapse--hook",
            class: vue.normalizeClass(["uni-collapse-item__wrap-content", { open: $data.isheight, "uni-collapse-item--border": $props.border && $data.isOpen }])
          }, [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ], 10, ["id"])
        ],
        6
        /* CLASS, STYLE */
      )
    ]);
  }
  const __easycom_2$1 = /* @__PURE__ */ _export_sfc(_sfc_main$D, [["render", _sfc_render$C], ["__scopeId", "data-v-3d2dde9f"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-collapse/components/uni-collapse-item/uni-collapse-item.vue"]]);
  const _sfc_main$C = {
    name: "uniCollapse",
    emits: ["change", "activeItem", "input", "update:modelValue"],
    props: {
      value: {
        type: [String, Array],
        default: ""
      },
      modelValue: {
        type: [String, Array],
        default: ""
      },
      accordion: {
        // 是否开启手风琴效果
        type: [Boolean, String],
        default: false
      }
    },
    data() {
      return {};
    },
    computed: {
      // TODO 兼容 vue2 和 vue3
      dataValue() {
        let value = typeof this.value === "string" && this.value === "" || Array.isArray(this.value) && this.value.length === 0;
        let modelValue = typeof this.modelValue === "string" && this.modelValue === "" || Array.isArray(this.modelValue) && this.modelValue.length === 0;
        if (value) {
          return this.modelValue;
        }
        if (modelValue) {
          return this.value;
        }
        return this.value;
      }
    },
    watch: {
      dataValue(val) {
        this.setOpen(val);
      }
    },
    created() {
      this.childrens = [];
      this.names = [];
    },
    mounted() {
      this.$nextTick(() => {
        this.setOpen(this.dataValue);
      });
    },
    methods: {
      setOpen(val) {
        let str = typeof val === "string";
        let arr = Array.isArray(val);
        this.childrens.forEach((vm, index) => {
          if (str) {
            if (val === vm.nameSync) {
              if (!this.accordion) {
                formatAppLog("warn", "at uni_modules/uni-collapse/components/uni-collapse/uni-collapse.vue:75", "accordion 属性为 false ,v-model 类型应该为 array");
                return;
              }
              vm.isOpen = true;
            }
          }
          if (arr) {
            val.forEach((v2) => {
              if (v2 === vm.nameSync) {
                if (this.accordion) {
                  formatAppLog("warn", "at uni_modules/uni-collapse/components/uni-collapse/uni-collapse.vue:85", "accordion 属性为 true ,v-model 类型应该为 string");
                  return;
                }
                vm.isOpen = true;
              }
            });
          }
        });
        this.emit(val);
      },
      setAccordion(self2) {
        if (!this.accordion)
          return;
        this.childrens.forEach((vm, index) => {
          if (self2 !== vm) {
            vm.isOpen = false;
          }
        });
      },
      resize() {
        this.childrens.forEach((vm, index) => {
          vm.getCollapseHeight();
        });
      },
      onChange(isOpen, self2) {
        let activeItem = [];
        if (this.accordion) {
          activeItem = isOpen ? self2.nameSync : "";
        } else {
          this.childrens.forEach((vm, index) => {
            if (vm.isOpen) {
              activeItem.push(vm.nameSync);
            }
          });
        }
        this.$emit("change", activeItem);
        this.emit(activeItem);
      },
      emit(val) {
        this.$emit("input", val);
        this.$emit("update:modelValue", val);
      }
    }
  };
  function _sfc_render$B(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-collapse" }, [
      vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
    ]);
  }
  const __easycom_3$1 = /* @__PURE__ */ _export_sfc(_sfc_main$C, [["render", _sfc_render$B], ["__scopeId", "data-v-3f050360"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-collapse/components/uni-collapse/uni-collapse.vue"]]);
  const _sfc_main$B = {
    name: "uniDataChecklist",
    mixins: [Ys.mixinDatacom || {}],
    emits: ["input", "update:modelValue", "change"],
    props: {
      mode: {
        type: String,
        default: "default"
      },
      multiple: {
        type: Boolean,
        default: false
      },
      value: {
        type: [Array, String, Number],
        default() {
          return "";
        }
      },
      // TODO vue3
      modelValue: {
        type: [Array, String, Number],
        default() {
          return "";
        }
      },
      localdata: {
        type: Array,
        default() {
          return [];
        }
      },
      min: {
        type: [Number, String],
        default: ""
      },
      max: {
        type: [Number, String],
        default: ""
      },
      wrap: {
        type: Boolean,
        default: false
      },
      icon: {
        type: String,
        default: "left"
      },
      selectedColor: {
        type: String,
        default: ""
      },
      selectedTextColor: {
        type: String,
        default: ""
      },
      emptyText: {
        type: String,
        default: "暂无数据"
      },
      disabled: {
        type: Boolean,
        default: false
      },
      map: {
        type: Object,
        default() {
          return {
            text: "text",
            value: "value"
          };
        }
      }
    },
    watch: {
      localdata: {
        handler(newVal) {
          this.range = newVal;
          this.dataList = this.getDataList(this.getSelectedValue(newVal));
        },
        deep: true
      },
      mixinDatacomResData(newVal) {
        this.range = newVal;
        this.dataList = this.getDataList(this.getSelectedValue(newVal));
      },
      value(newVal) {
        this.dataList = this.getDataList(newVal);
      },
      modelValue(newVal) {
        this.dataList = this.getDataList(newVal);
      }
    },
    data() {
      return {
        dataList: [],
        range: [],
        contentText: {
          contentdown: "查看更多",
          contentrefresh: "加载中",
          contentnomore: "没有更多"
        },
        isLocal: true,
        styles: {
          selectedColor: "#2979ff",
          selectedTextColor: "#666"
        },
        isTop: 0
      };
    },
    computed: {
      dataValue() {
        if (this.value === "")
          return this.modelValue;
        if (this.modelValue === "")
          return this.value;
        return this.value;
      }
    },
    created() {
      if (this.localdata && this.localdata.length !== 0) {
        this.isLocal = true;
        this.range = this.localdata;
        this.dataList = this.getDataList(this.getSelectedValue(this.range));
      } else {
        if (this.collection) {
          this.isLocal = false;
          this.loadData();
        }
      }
    },
    methods: {
      loadData() {
        this.mixinDatacomGet().then((res) => {
          this.mixinDatacomResData = res.result.data;
          if (this.mixinDatacomResData.length === 0) {
            this.isLocal = false;
            this.mixinDatacomErrorMessage = this.emptyText;
          } else {
            this.isLocal = true;
          }
        }).catch((err) => {
          this.mixinDatacomErrorMessage = err.message;
        });
      },
      /**
       * 获取父元素实例
       */
      getForm(name = "uniForms") {
        let parent = this.$parent;
        let parentName = parent.$options.name;
        while (parentName !== name) {
          parent = parent.$parent;
          if (!parent)
            return false;
          parentName = parent.$options.name;
        }
        return parent;
      },
      change(e2) {
        const values = e2.detail.value;
        let detail = {
          value: [],
          data: []
        };
        if (this.multiple) {
          this.range.forEach((item) => {
            if (values.includes(item[this.map.value] + "")) {
              detail.value.push(item[this.map.value]);
              detail.data.push(item);
            }
          });
        } else {
          const range = this.range.find((item) => item[this.map.value] + "" === values);
          if (range) {
            detail = {
              value: range[this.map.value],
              data: range
            };
          }
        }
        this.$emit("input", detail.value);
        this.$emit("update:modelValue", detail.value);
        this.$emit("change", {
          detail
        });
        if (this.multiple) {
          this.dataList = this.getDataList(detail.value, true);
        } else {
          this.dataList = this.getDataList(detail.value);
        }
      },
      /**
       * 获取渲染的新数组
       * @param {Object} value 选中内容
       */
      getDataList(value) {
        let dataList = JSON.parse(JSON.stringify(this.range));
        let list = [];
        if (this.multiple) {
          if (!Array.isArray(value)) {
            value = [];
          }
        }
        dataList.forEach((item, index) => {
          item.disabled = item.disable || item.disabled || false;
          if (this.multiple) {
            if (value.length > 0) {
              let have = value.find((val) => val === item[this.map.value]);
              item.selected = have !== void 0;
            } else {
              item.selected = false;
            }
          } else {
            item.selected = value === item[this.map.value];
          }
          list.push(item);
        });
        return this.setRange(list);
      },
      /**
       * 处理最大最小值
       * @param {Object} list
       */
      setRange(list) {
        let selectList = list.filter((item) => item.selected);
        let min = Number(this.min) || 0;
        let max = Number(this.max) || "";
        list.forEach((item, index) => {
          if (this.multiple) {
            if (selectList.length <= min) {
              let have = selectList.find((val) => val[this.map.value] === item[this.map.value]);
              if (have !== void 0) {
                item.disabled = true;
              }
            }
            if (selectList.length >= max && max !== "") {
              let have = selectList.find((val) => val[this.map.value] === item[this.map.value]);
              if (have === void 0) {
                item.disabled = true;
              }
            }
          }
          this.setStyles(item, index);
          list[index] = item;
        });
        return list;
      },
      /**
       * 设置 class
       * @param {Object} item
       * @param {Object} index
       */
      setStyles(item, index) {
        item.styleBackgroud = this.setStyleBackgroud(item);
        item.styleIcon = this.setStyleIcon(item);
        item.styleIconText = this.setStyleIconText(item);
        item.styleRightIcon = this.setStyleRightIcon(item);
      },
      /**
       * 获取选中值
       * @param {Object} range
       */
      getSelectedValue(range) {
        if (!this.multiple)
          return this.dataValue;
        let selectedArr = [];
        range.forEach((item) => {
          if (item.selected) {
            selectedArr.push(item[this.map.value]);
          }
        });
        return this.dataValue.length > 0 ? this.dataValue : selectedArr;
      },
      /**
       * 设置背景样式
       */
      setStyleBackgroud(item) {
        let styles = {};
        let selectedColor = this.selectedColor ? this.selectedColor : "#2979ff";
        if (this.selectedColor) {
          if (this.mode !== "list") {
            styles["border-color"] = item.selected ? selectedColor : "#DCDFE6";
          }
          if (this.mode === "tag") {
            styles["background-color"] = item.selected ? selectedColor : "#f5f5f5";
          }
        }
        let classles = "";
        for (let i2 in styles) {
          classles += `${i2}:${styles[i2]};`;
        }
        return classles;
      },
      setStyleIcon(item) {
        let styles = {};
        let classles = "";
        if (this.selectedColor) {
          let selectedColor = this.selectedColor ? this.selectedColor : "#2979ff";
          styles["background-color"] = item.selected ? selectedColor : "#fff";
          styles["border-color"] = item.selected ? selectedColor : "#DCDFE6";
          if (!item.selected && item.disabled) {
            styles["background-color"] = "#F2F6FC";
            styles["border-color"] = item.selected ? selectedColor : "#DCDFE6";
          }
        }
        for (let i2 in styles) {
          classles += `${i2}:${styles[i2]};`;
        }
        return classles;
      },
      setStyleIconText(item) {
        let styles = {};
        let classles = "";
        if (this.selectedColor) {
          let selectedColor = this.selectedColor ? this.selectedColor : "#2979ff";
          if (this.mode === "tag") {
            styles.color = item.selected ? this.selectedTextColor ? this.selectedTextColor : "#fff" : "#666";
          } else {
            styles.color = item.selected ? this.selectedTextColor ? this.selectedTextColor : selectedColor : "#666";
          }
          if (!item.selected && item.disabled) {
            styles.color = "#999";
          }
        }
        for (let i2 in styles) {
          classles += `${i2}:${styles[i2]};`;
        }
        return classles;
      },
      setStyleRightIcon(item) {
        let styles = {};
        let classles = "";
        if (this.mode === "list") {
          styles["border-color"] = item.selected ? this.styles.selectedColor : "#DCDFE6";
        }
        for (let i2 in styles) {
          classles += `${i2}:${styles[i2]};`;
        }
        return classles;
      }
    }
  };
  function _sfc_render$A(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_load_more = resolveEasycom(vue.resolveDynamicComponent("uni-load-more"), __easycom_0$6);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "uni-data-checklist",
        style: vue.normalizeStyle({ "margin-top": $data.isTop + "px" })
      },
      [
        !$data.isLocal ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "uni-data-loading"
        }, [
          !_ctx.mixinDatacomErrorMessage ? (vue.openBlock(), vue.createBlock(_component_uni_load_more, {
            key: 0,
            status: "loading",
            iconType: "snow",
            iconSize: 18,
            "content-text": $data.contentText
          }, null, 8, ["content-text"])) : (vue.openBlock(), vue.createElementBlock(
            "text",
            { key: 1 },
            vue.toDisplayString(_ctx.mixinDatacomErrorMessage),
            1
            /* TEXT */
          ))
        ])) : (vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          { key: 1 },
          [
            $props.multiple ? (vue.openBlock(), vue.createElementBlock(
              "checkbox-group",
              {
                key: 0,
                class: vue.normalizeClass(["checklist-group", { "is-list": $props.mode === "list" || $props.wrap }]),
                onChange: _cache[0] || (_cache[0] = (...args) => $options.change && $options.change(...args))
              },
              [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.dataList, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "label",
                      {
                        class: vue.normalizeClass(["checklist-box", ["is--" + $props.mode, item.selected ? "is-checked" : "", $props.disabled || !!item.disabled ? "is-disable" : "", index !== 0 && $props.mode === "list" ? "is-list-border" : ""]]),
                        style: vue.normalizeStyle(item.styleBackgroud),
                        key: index
                      },
                      [
                        vue.createElementVNode("checkbox", {
                          class: "hidden",
                          hidden: "",
                          disabled: $props.disabled || !!item.disabled,
                          value: item[$props.map.value] + "",
                          checked: item.selected
                        }, null, 8, ["disabled", "value", "checked"]),
                        $props.mode !== "tag" && $props.mode !== "list" || $props.mode === "list" && $props.icon === "left" ? (vue.openBlock(), vue.createElementBlock(
                          "view",
                          {
                            key: 0,
                            class: "checkbox__inner",
                            style: vue.normalizeStyle(item.styleIcon)
                          },
                          [
                            vue.createElementVNode("view", { class: "checkbox__inner-icon" })
                          ],
                          4
                          /* STYLE */
                        )) : vue.createCommentVNode("v-if", true),
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass(["checklist-content", { "list-content": $props.mode === "list" && $props.icon === "left" }])
                          },
                          [
                            vue.createElementVNode(
                              "text",
                              {
                                class: "checklist-text",
                                style: vue.normalizeStyle(item.styleIconText)
                              },
                              vue.toDisplayString(item[$props.map.text]),
                              5
                              /* TEXT, STYLE */
                            ),
                            $props.mode === "list" && $props.icon === "right" ? (vue.openBlock(), vue.createElementBlock(
                              "view",
                              {
                                key: 0,
                                class: "checkobx__list",
                                style: vue.normalizeStyle(item.styleBackgroud)
                              },
                              null,
                              4
                              /* STYLE */
                            )) : vue.createCommentVNode("v-if", true)
                          ],
                          2
                          /* CLASS */
                        )
                      ],
                      6
                      /* CLASS, STYLE */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ],
              34
              /* CLASS, NEED_HYDRATION */
            )) : (vue.openBlock(), vue.createElementBlock(
              "radio-group",
              {
                key: 1,
                class: vue.normalizeClass(["checklist-group", { "is-list": $props.mode === "list", "is-wrap": $props.wrap }]),
                onChange: _cache[1] || (_cache[1] = (...args) => $options.change && $options.change(...args))
              },
              [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.dataList, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock(
                      "label",
                      {
                        class: vue.normalizeClass(["checklist-box", ["is--" + $props.mode, item.selected ? "is-checked" : "", $props.disabled || !!item.disabled ? "is-disable" : "", index !== 0 && $props.mode === "list" ? "is-list-border" : ""]]),
                        style: vue.normalizeStyle(item.styleBackgroud),
                        key: index
                      },
                      [
                        vue.createElementVNode("radio", {
                          class: "hidden",
                          hidden: "",
                          disabled: $props.disabled || item.disabled,
                          value: item[$props.map.value] + "",
                          checked: item.selected
                        }, null, 8, ["disabled", "value", "checked"]),
                        $props.mode !== "tag" && $props.mode !== "list" || $props.mode === "list" && $props.icon === "left" ? (vue.openBlock(), vue.createElementBlock(
                          "view",
                          {
                            key: 0,
                            class: "radio__inner",
                            style: vue.normalizeStyle(item.styleBackgroud)
                          },
                          [
                            vue.createElementVNode(
                              "view",
                              {
                                class: "radio__inner-icon",
                                style: vue.normalizeStyle(item.styleIcon)
                              },
                              null,
                              4
                              /* STYLE */
                            )
                          ],
                          4
                          /* STYLE */
                        )) : vue.createCommentVNode("v-if", true),
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass(["checklist-content", { "list-content": $props.mode === "list" && $props.icon === "left" }])
                          },
                          [
                            vue.createElementVNode(
                              "text",
                              {
                                class: "checklist-text",
                                style: vue.normalizeStyle(item.styleIconText)
                              },
                              vue.toDisplayString(item[$props.map.text]),
                              5
                              /* TEXT, STYLE */
                            ),
                            $props.mode === "list" && $props.icon === "right" ? (vue.openBlock(), vue.createElementBlock(
                              "view",
                              {
                                key: 0,
                                style: vue.normalizeStyle(item.styleRightIcon),
                                class: "checkobx__list"
                              },
                              null,
                              4
                              /* STYLE */
                            )) : vue.createCommentVNode("v-if", true)
                          ],
                          2
                          /* CLASS */
                        )
                      ],
                      6
                      /* CLASS, STYLE */
                    );
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ],
              34
              /* CLASS, NEED_HYDRATION */
            ))
          ],
          64
          /* STABLE_FRAGMENT */
        ))
      ],
      4
      /* STYLE */
    );
  }
  const __easycom_4 = /* @__PURE__ */ _export_sfc(_sfc_main$B, [["render", _sfc_render$A], ["__scopeId", "data-v-2f788efd"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.vue"]]);
  const _sfc_main$A = {
    name: "uniFormsItem",
    options: {
      virtualHost: true
    },
    provide() {
      return {
        uniFormItem: this
      };
    },
    inject: {
      form: {
        from: "uniForm",
        default: null
      }
    },
    props: {
      // 表单校验规则
      rules: {
        type: Array,
        default() {
          return null;
        }
      },
      // 表单域的属性名，在使用校验规则时必填
      name: {
        type: [String, Array],
        default: ""
      },
      required: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        default: ""
      },
      // label的宽度
      labelWidth: {
        type: [String, Number],
        default: ""
      },
      // label 居中方式，默认 left 取值 left/center/right
      labelAlign: {
        type: String,
        default: ""
      },
      // 强制显示错误信息
      errorMessage: {
        type: [String, Boolean],
        default: ""
      },
      // 1.4.0 弃用，统一使用 form 的校验时机
      // validateTrigger: {
      // 	type: String,
      // 	default: ''
      // },
      // 1.4.0 弃用，统一使用 form 的label 位置
      // labelPosition: {
      // 	type: String,
      // 	default: ''
      // },
      // 1.4.0 以下属性已经废弃，请使用  #label 插槽代替
      leftIcon: String,
      iconColor: {
        type: String,
        default: "#606266"
      }
    },
    data() {
      return {
        errMsg: "",
        userRules: null,
        localLabelAlign: "left",
        localLabelWidth: "70px",
        localLabelPos: "left",
        border: false,
        isFirstBorder: false
      };
    },
    computed: {
      // 处理错误信息
      msg() {
        return this.errorMessage || this.errMsg;
      }
    },
    watch: {
      // 规则发生变化通知子组件更新
      "form.formRules"(val) {
        this.init();
      },
      "form.labelWidth"(val) {
        this.localLabelWidth = this._labelWidthUnit(val);
      },
      "form.labelPosition"(val) {
        this.localLabelPos = this._labelPosition();
      },
      "form.labelAlign"(val) {
      }
    },
    created() {
      this.init(true);
      if (this.name && this.form) {
        this.$watch(
          () => {
            const val = this.form._getDataValue(this.name, this.form.localData);
            return val;
          },
          (value, oldVal) => {
            const isEqual2 = this.form._isEqual(value, oldVal);
            if (!isEqual2) {
              const val = this.itemSetValue(value);
              this.onFieldChange(val, false);
            }
          },
          {
            immediate: false
          }
        );
      }
    },
    unmounted() {
      this.__isUnmounted = true;
      this.unInit();
    },
    methods: {
      /**
       * 外部调用方法
       * 设置规则 ，主要用于小程序自定义检验规则
       * @param {Array} rules 规则源数据
       */
      setRules(rules = null) {
        this.userRules = rules;
        this.init(false);
      },
      // 兼容老版本表单组件
      setValue() {
      },
      /**
       * 外部调用方法
       * 校验数据
       * @param {any} value 需要校验的数据
       * @param {boolean} 是否立即校验
       * @return {Array|null} 校验内容
       */
      async onFieldChange(value, formtrigger = true) {
        const {
          formData,
          localData,
          errShowType,
          validateCheck,
          validateTrigger,
          _isRequiredField,
          _realName
        } = this.form;
        const name = _realName(this.name);
        if (!value) {
          value = this.form.formData[name];
        }
        const ruleLen = this.itemRules.rules && this.itemRules.rules.length;
        if (!this.validator || !ruleLen || ruleLen === 0)
          return;
        const isRequiredField2 = _isRequiredField(this.itemRules.rules || []);
        let result = null;
        if (validateTrigger === "bind" || formtrigger) {
          result = await this.validator.validateUpdate(
            {
              [name]: value
            },
            formData
          );
          if (!isRequiredField2 && (value === void 0 || value === "")) {
            result = null;
          }
          if (result && result.errorMessage) {
            if (errShowType === "undertext") {
              this.errMsg = !result ? "" : result.errorMessage;
            }
            if (errShowType === "toast") {
              uni.showToast({
                title: result.errorMessage || "校验错误",
                icon: "none"
              });
            }
            if (errShowType === "modal") {
              uni.showModal({
                title: "提示",
                content: result.errorMessage || "校验错误"
              });
            }
          } else {
            this.errMsg = "";
          }
          validateCheck(result ? result : null);
        } else {
          this.errMsg = "";
        }
        return result ? result : null;
      },
      /**
       * 初始组件数据
       */
      init(type = false) {
        const {
          validator,
          formRules,
          childrens,
          formData,
          localData,
          _realName,
          labelWidth,
          _getDataValue,
          _setDataValue
        } = this.form || {};
        this.localLabelAlign = this._justifyContent();
        this.localLabelWidth = this._labelWidthUnit(labelWidth);
        this.localLabelPos = this._labelPosition();
        this.form && type && childrens.push(this);
        if (!validator || !formRules)
          return;
        if (!this.form.isFirstBorder) {
          this.form.isFirstBorder = true;
          this.isFirstBorder = true;
        }
        if (this.group) {
          if (!this.group.isFirstBorder) {
            this.group.isFirstBorder = true;
            this.isFirstBorder = true;
          }
        }
        this.border = this.form.border;
        const name = _realName(this.name);
        const itemRule = this.userRules || this.rules;
        if (typeof formRules === "object" && itemRule) {
          formRules[name] = {
            rules: itemRule
          };
          validator.updateSchema(formRules);
        }
        const itemRules = formRules[name] || {};
        this.itemRules = itemRules;
        this.validator = validator;
        this.itemSetValue(_getDataValue(this.name, localData));
      },
      unInit() {
        if (this.form) {
          const {
            childrens,
            formData,
            _realName
          } = this.form;
          childrens.forEach((item, index) => {
            if (item === this) {
              this.form.childrens.splice(index, 1);
              delete formData[_realName(item.name)];
            }
          });
        }
      },
      // 设置item 的值
      itemSetValue(value) {
        const name = this.form._realName(this.name);
        const rules = this.itemRules.rules || [];
        const val = this.form._getValue(name, value, rules);
        this.form._setDataValue(name, this.form.formData, val);
        return val;
      },
      /**
       * 移除该表单项的校验结果
       */
      clearValidate() {
        this.errMsg = "";
      },
      // 是否显示星号
      _isRequired() {
        return this.required;
      },
      // 处理对齐方式
      _justifyContent() {
        if (this.form) {
          const {
            labelAlign
          } = this.form;
          let labelAli = this.labelAlign ? this.labelAlign : labelAlign;
          if (labelAli === "left")
            return "flex-start";
          if (labelAli === "center")
            return "center";
          if (labelAli === "right")
            return "flex-end";
        }
        return "flex-start";
      },
      // 处理 label宽度单位 ,继承父元素的值
      _labelWidthUnit(labelWidth) {
        return this.num2px(this.labelWidth ? this.labelWidth : labelWidth || (this.label ? 70 : "auto"));
      },
      // 处理 label 位置
      _labelPosition() {
        if (this.form)
          return this.form.labelPosition || "left";
        return "left";
      },
      /**
       * 触发时机
       * @param {Object} rule 当前规则内时机
       * @param {Object} itemRlue 当前组件时机
       * @param {Object} parentRule 父组件时机
       */
      isTrigger(rule, itemRlue, parentRule) {
        if (rule === "submit" || !rule) {
          if (rule === void 0) {
            if (itemRlue !== "bind") {
              if (!itemRlue) {
                return parentRule === "" ? "bind" : "submit";
              }
              return "submit";
            }
            return "bind";
          }
          return "submit";
        }
        return "bind";
      },
      num2px(num) {
        if (typeof num === "number") {
          return `${num}px`;
        }
        return num;
      }
    }
  };
  function _sfc_render$z(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["uni-forms-item", ["is-direction-" + $data.localLabelPos, $data.border ? "uni-forms-item--border" : "", $data.border && $data.isFirstBorder ? "is-first-border" : ""]])
      },
      [
        vue.renderSlot(_ctx.$slots, "label", {}, () => [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["uni-forms-item__label", { "no-label": !$props.label && !$props.required }]),
              style: vue.normalizeStyle({ width: $data.localLabelWidth, justifyContent: $data.localLabelAlign })
            },
            [
              $props.required ? (vue.openBlock(), vue.createElementBlock("text", {
                key: 0,
                class: "is-required"
              }, "*")) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($props.label),
                1
                /* TEXT */
              )
            ],
            6
            /* CLASS, STYLE */
          )
        ], true),
        vue.createElementVNode("view", { class: "uni-forms-item__content" }, [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true),
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass(["uni-forms-item__error", { "msg--active": $options.msg }])
            },
            [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($options.msg),
                1
                /* TEXT */
              )
            ],
            2
            /* CLASS */
          )
        ])
      ],
      2
      /* CLASS */
    );
  }
  const __easycom_5$1 = /* @__PURE__ */ _export_sfc(_sfc_main$A, [["render", _sfc_render$z], ["__scopeId", "data-v-462874dd"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.vue"]]);
  function obj2strClass(obj) {
    let classess = "";
    for (let key in obj) {
      const val = obj[key];
      if (val) {
        classess += `${key} `;
      }
    }
    return classess;
  }
  function obj2strStyle(obj) {
    let style = "";
    for (let key in obj) {
      const val = obj[key];
      style += `${key}:${val};`;
    }
    return style;
  }
  const _sfc_main$z = {
    name: "uni-easyinput",
    emits: [
      "click",
      "iconClick",
      "update:modelValue",
      "input",
      "focus",
      "blur",
      "confirm",
      "clear",
      "eyes",
      "change",
      "keyboardheightchange"
    ],
    model: {
      prop: "modelValue",
      event: "update:modelValue"
    },
    options: {
      virtualHost: true
    },
    inject: {
      form: {
        from: "uniForm",
        default: null
      },
      formItem: {
        from: "uniFormItem",
        default: null
      }
    },
    props: {
      name: String,
      value: [Number, String],
      modelValue: [Number, String],
      type: {
        type: String,
        default: "text"
      },
      clearable: {
        type: Boolean,
        default: true
      },
      autoHeight: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: " "
      },
      placeholderStyle: String,
      focus: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      maxlength: {
        type: [Number, String],
        default: 140
      },
      confirmType: {
        type: String,
        default: "done"
      },
      clearSize: {
        type: [Number, String],
        default: 24
      },
      inputBorder: {
        type: Boolean,
        default: true
      },
      prefixIcon: {
        type: String,
        default: ""
      },
      suffixIcon: {
        type: String,
        default: ""
      },
      trim: {
        type: [Boolean, String],
        default: false
      },
      cursorSpacing: {
        type: Number,
        default: 0
      },
      passwordIcon: {
        type: Boolean,
        default: true
      },
      adjustPosition: {
        type: Boolean,
        default: true
      },
      primaryColor: {
        type: String,
        default: "#2979ff"
      },
      styles: {
        type: Object,
        default() {
          return {
            color: "#333",
            backgroundColor: "#fff",
            disableColor: "#F7F6F6",
            borderColor: "#e5e5e5"
          };
        }
      },
      errorMessage: {
        type: [String, Boolean],
        default: ""
      }
    },
    data() {
      return {
        focused: false,
        val: "",
        showMsg: "",
        border: false,
        isFirstBorder: false,
        showClearIcon: false,
        showPassword: false,
        focusShow: false,
        localMsg: "",
        isEnter: false
        // 用于判断当前是否是使用回车操作
      };
    },
    computed: {
      // 输入框内是否有值
      isVal() {
        const val = this.val;
        if (val || val === 0) {
          return true;
        }
        return false;
      },
      msg() {
        return this.localMsg || this.errorMessage;
      },
      // 因为uniapp的input组件的maxlength组件必须要数值，这里转为数值，用户可以传入字符串数值
      inputMaxlength() {
        return Number(this.maxlength);
      },
      // 处理外层样式的style
      boxStyle() {
        return `color:${this.inputBorder && this.msg ? "#e43d33" : this.styles.color};`;
      },
      // input 内容的类和样式处理
      inputContentClass() {
        return obj2strClass({
          "is-input-border": this.inputBorder,
          "is-input-error-border": this.inputBorder && this.msg,
          "is-textarea": this.type === "textarea",
          "is-disabled": this.disabled,
          "is-focused": this.focusShow
        });
      },
      inputContentStyle() {
        const focusColor = this.focusShow ? this.primaryColor : this.styles.borderColor;
        const borderColor = this.inputBorder && this.msg ? "#dd524d" : focusColor;
        return obj2strStyle({
          "border-color": borderColor || "#e5e5e5",
          "background-color": this.disabled ? this.styles.disableColor : this.styles.backgroundColor
        });
      },
      // input右侧样式
      inputStyle() {
        const paddingRight = this.type === "password" || this.clearable || this.prefixIcon ? "" : "10px";
        return obj2strStyle({
          "padding-right": paddingRight,
          "padding-left": this.prefixIcon ? "" : "10px"
        });
      }
    },
    watch: {
      value(newVal) {
        this.val = newVal;
      },
      modelValue(newVal) {
        this.val = newVal;
      },
      focus(newVal) {
        this.$nextTick(() => {
          this.focused = this.focus;
          this.focusShow = this.focus;
        });
      }
    },
    created() {
      this.init();
      if (this.form && this.formItem) {
        this.$watch("formItem.errMsg", (newVal) => {
          this.localMsg = newVal;
        });
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.focused = this.focus;
        this.focusShow = this.focus;
      });
    },
    methods: {
      /**
       * 初始化变量值
       */
      init() {
        if (this.value || this.value === 0) {
          this.val = this.value;
        } else if (this.modelValue || this.modelValue === 0 || this.modelValue === "") {
          this.val = this.modelValue;
        } else {
          this.val = null;
        }
      },
      /**
       * 点击图标时触发
       * @param {Object} type
       */
      onClickIcon(type) {
        this.$emit("iconClick", type);
      },
      /**
       * 显示隐藏内容，密码框时生效
       */
      onEyes() {
        this.showPassword = !this.showPassword;
        this.$emit("eyes", this.showPassword);
      },
      /**
       * 输入时触发
       * @param {Object} event
       */
      onInput(event2) {
        let value = event2.detail.value;
        if (this.trim) {
          if (typeof this.trim === "boolean" && this.trim) {
            value = this.trimStr(value);
          }
          if (typeof this.trim === "string") {
            value = this.trimStr(value, this.trim);
          }
        }
        if (this.errMsg)
          this.errMsg = "";
        this.val = value;
        this.$emit("input", value);
        this.$emit("update:modelValue", value);
      },
      /**
       * 外部调用方法
       * 获取焦点时触发
       * @param {Object} event
       */
      onFocus() {
        this.$nextTick(() => {
          this.focused = true;
        });
        this.$emit("focus", null);
      },
      _Focus(event2) {
        this.focusShow = true;
        this.$emit("focus", event2);
      },
      /**
       * 外部调用方法
       * 失去焦点时触发
       * @param {Object} event
       */
      onBlur() {
        this.focused = false;
        this.$emit("blur", null);
      },
      _Blur(event2) {
        event2.detail.value;
        this.focusShow = false;
        this.$emit("blur", event2);
        if (this.isEnter === false) {
          this.$emit("change", this.val);
        }
        if (this.form && this.formItem) {
          const { validateTrigger } = this.form;
          if (validateTrigger === "blur") {
            this.formItem.onFieldChange();
          }
        }
      },
      /**
       * 按下键盘的发送键
       * @param {Object} e
       */
      onConfirm(e2) {
        this.$emit("confirm", this.val);
        this.isEnter = true;
        this.$emit("change", this.val);
        this.$nextTick(() => {
          this.isEnter = false;
        });
      },
      /**
       * 清理内容
       * @param {Object} event
       */
      onClear(event2) {
        this.val = "";
        this.$emit("input", "");
        this.$emit("update:modelValue", "");
        this.$emit("clear");
      },
      /**
       * 键盘高度发生变化的时候触发此事件
       * 兼容性：微信小程序2.7.0+、App 3.1.0+
       * @param {Object} event
       */
      onkeyboardheightchange(event2) {
        this.$emit("keyboardheightchange", event2);
      },
      /**
       * 去除空格
       */
      trimStr(str, pos = "both") {
        if (pos === "both") {
          return str.trim();
        } else if (pos === "left") {
          return str.trimLeft();
        } else if (pos === "right") {
          return str.trimRight();
        } else if (pos === "start") {
          return str.trimStart();
        } else if (pos === "end") {
          return str.trimEnd();
        } else if (pos === "all") {
          return str.replace(/\s+/g, "");
        } else if (pos === "none") {
          return str;
        }
        return str;
      }
    }
  };
  function _sfc_render$y(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$5);
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["uni-easyinput", { "uni-easyinput-error": $options.msg }]),
        style: vue.normalizeStyle($options.boxStyle)
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["uni-easyinput__content", $options.inputContentClass]),
            style: vue.normalizeStyle($options.inputContentStyle)
          },
          [
            $props.prefixIcon ? (vue.openBlock(), vue.createBlock(_component_uni_icons, {
              key: 0,
              class: "content-clear-icon",
              type: $props.prefixIcon,
              color: "#c0c4cc",
              onClick: _cache[0] || (_cache[0] = ($event) => $options.onClickIcon("prefix")),
              size: "22"
            }, null, 8, ["type"])) : vue.createCommentVNode("v-if", true),
            vue.renderSlot(_ctx.$slots, "left", {}, void 0, true),
            $props.type === "textarea" ? (vue.openBlock(), vue.createElementBlock("textarea", {
              key: 1,
              class: vue.normalizeClass(["uni-easyinput__content-textarea", { "input-padding": $props.inputBorder }]),
              name: $props.name,
              value: $data.val,
              placeholder: $props.placeholder,
              placeholderStyle: $props.placeholderStyle,
              disabled: $props.disabled,
              "placeholder-class": "uni-easyinput__placeholder-class",
              maxlength: $options.inputMaxlength,
              focus: $data.focused,
              autoHeight: $props.autoHeight,
              "cursor-spacing": $props.cursorSpacing,
              "adjust-position": $props.adjustPosition,
              onInput: _cache[1] || (_cache[1] = (...args) => $options.onInput && $options.onInput(...args)),
              onBlur: _cache[2] || (_cache[2] = (...args) => $options._Blur && $options._Blur(...args)),
              onFocus: _cache[3] || (_cache[3] = (...args) => $options._Focus && $options._Focus(...args)),
              onConfirm: _cache[4] || (_cache[4] = (...args) => $options.onConfirm && $options.onConfirm(...args)),
              onKeyboardheightchange: _cache[5] || (_cache[5] = (...args) => $options.onkeyboardheightchange && $options.onkeyboardheightchange(...args))
            }, null, 42, ["name", "value", "placeholder", "placeholderStyle", "disabled", "maxlength", "focus", "autoHeight", "cursor-spacing", "adjust-position"])) : (vue.openBlock(), vue.createElementBlock("input", {
              key: 2,
              type: $props.type === "password" ? "text" : $props.type,
              class: "uni-easyinput__content-input",
              style: vue.normalizeStyle($options.inputStyle),
              name: $props.name,
              value: $data.val,
              password: !$data.showPassword && $props.type === "password",
              placeholder: $props.placeholder,
              placeholderStyle: $props.placeholderStyle,
              "placeholder-class": "uni-easyinput__placeholder-class",
              disabled: $props.disabled,
              maxlength: $options.inputMaxlength,
              focus: $data.focused,
              confirmType: $props.confirmType,
              "cursor-spacing": $props.cursorSpacing,
              "adjust-position": $props.adjustPosition,
              onFocus: _cache[6] || (_cache[6] = (...args) => $options._Focus && $options._Focus(...args)),
              onBlur: _cache[7] || (_cache[7] = (...args) => $options._Blur && $options._Blur(...args)),
              onInput: _cache[8] || (_cache[8] = (...args) => $options.onInput && $options.onInput(...args)),
              onConfirm: _cache[9] || (_cache[9] = (...args) => $options.onConfirm && $options.onConfirm(...args)),
              onKeyboardheightchange: _cache[10] || (_cache[10] = (...args) => $options.onkeyboardheightchange && $options.onkeyboardheightchange(...args))
            }, null, 44, ["type", "name", "value", "password", "placeholder", "placeholderStyle", "disabled", "maxlength", "focus", "confirmType", "cursor-spacing", "adjust-position"])),
            $props.type === "password" && $props.passwordIcon ? (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 3 },
              [
                vue.createCommentVNode(" 开启密码时显示小眼睛 "),
                $options.isVal ? (vue.openBlock(), vue.createBlock(_component_uni_icons, {
                  key: 0,
                  class: vue.normalizeClass(["content-clear-icon", { "is-textarea-icon": $props.type === "textarea" }]),
                  type: $data.showPassword ? "eye-slash-filled" : "eye-filled",
                  size: 22,
                  color: $data.focusShow ? $props.primaryColor : "#c0c4cc",
                  onClick: $options.onEyes
                }, null, 8, ["class", "type", "color", "onClick"])) : vue.createCommentVNode("v-if", true)
              ],
              64
              /* STABLE_FRAGMENT */
            )) : vue.createCommentVNode("v-if", true),
            $props.suffixIcon ? (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 4 },
              [
                $props.suffixIcon ? (vue.openBlock(), vue.createBlock(_component_uni_icons, {
                  key: 0,
                  class: "content-clear-icon",
                  type: $props.suffixIcon,
                  color: "#c0c4cc",
                  onClick: _cache[11] || (_cache[11] = ($event) => $options.onClickIcon("suffix")),
                  size: "22"
                }, null, 8, ["type"])) : vue.createCommentVNode("v-if", true)
              ],
              64
              /* STABLE_FRAGMENT */
            )) : (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 5 },
              [
                $props.clearable && $options.isVal && !$props.disabled && $props.type !== "textarea" ? (vue.openBlock(), vue.createBlock(_component_uni_icons, {
                  key: 0,
                  class: vue.normalizeClass(["content-clear-icon", { "is-textarea-icon": $props.type === "textarea" }]),
                  type: "clear",
                  size: $props.clearSize,
                  color: $options.msg ? "#dd524d" : $data.focusShow ? $props.primaryColor : "#c0c4cc",
                  onClick: $options.onClear
                }, null, 8, ["class", "size", "color", "onClick"])) : vue.createCommentVNode("v-if", true)
              ],
              64
              /* STABLE_FRAGMENT */
            )),
            vue.renderSlot(_ctx.$slots, "right", {}, void 0, true)
          ],
          6
          /* CLASS, STYLE */
        )
      ],
      6
      /* CLASS, STYLE */
    );
  }
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["render", _sfc_render$y], ["__scopeId", "data-v-09fd5285"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue"]]);
  var pattern = {
    email: /^\S+?@\S+?\.\S+?$/,
    idcard: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
    url: new RegExp(
      "^(?!mailto:)(?:(?:http|https|ftp)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$",
      "i"
    )
  };
  const FORMAT_MAPPING = {
    "int": "integer",
    "bool": "boolean",
    "double": "number",
    "long": "number",
    "password": "string"
    // "fileurls": 'array'
  };
  function formatMessage(args, resources = "") {
    var defaultMessage = ["label"];
    defaultMessage.forEach((item) => {
      if (args[item] === void 0) {
        args[item] = "";
      }
    });
    let str = resources;
    for (let key in args) {
      let reg = new RegExp("{" + key + "}");
      str = str.replace(reg, args[key]);
    }
    return str;
  }
  function isEmptyValue(value, type) {
    if (value === void 0 || value === null) {
      return true;
    }
    if (typeof value === "string" && !value) {
      return true;
    }
    if (Array.isArray(value) && !value.length) {
      return true;
    }
    if (type === "object" && !Object.keys(value).length) {
      return true;
    }
    return false;
  }
  const types = {
    integer(value) {
      return types.number(value) && parseInt(value, 10) === value;
    },
    string(value) {
      return typeof value === "string";
    },
    number(value) {
      if (isNaN(value)) {
        return false;
      }
      return typeof value === "number";
    },
    "boolean": function(value) {
      return typeof value === "boolean";
    },
    "float": function(value) {
      return types.number(value) && !types.integer(value);
    },
    array(value) {
      return Array.isArray(value);
    },
    object(value) {
      return typeof value === "object" && !types.array(value);
    },
    date(value) {
      return value instanceof Date;
    },
    timestamp(value) {
      if (!this.integer(value) || Math.abs(value).toString().length > 16) {
        return false;
      }
      return true;
    },
    file(value) {
      return typeof value.url === "string";
    },
    email(value) {
      return typeof value === "string" && !!value.match(pattern.email) && value.length < 255;
    },
    url(value) {
      return typeof value === "string" && !!value.match(pattern.url);
    },
    pattern(reg, value) {
      try {
        return new RegExp(reg).test(value);
      } catch (e2) {
        return false;
      }
    },
    method(value) {
      return typeof value === "function";
    },
    idcard(value) {
      return typeof value === "string" && !!value.match(pattern.idcard);
    },
    "url-https"(value) {
      return this.url(value) && value.startsWith("https://");
    },
    "url-scheme"(value) {
      return value.startsWith("://");
    },
    "url-web"(value) {
      return false;
    }
  };
  class RuleValidator {
    constructor(message) {
      this._message = message;
    }
    async validateRule(fieldKey, fieldValue, value, data, allData) {
      var result = null;
      let rules = fieldValue.rules;
      let hasRequired = rules.findIndex((item) => {
        return item.required;
      });
      if (hasRequired < 0) {
        if (value === null || value === void 0) {
          return result;
        }
        if (typeof value === "string" && !value.length) {
          return result;
        }
      }
      var message = this._message;
      if (rules === void 0) {
        return message["default"];
      }
      for (var i2 = 0; i2 < rules.length; i2++) {
        let rule = rules[i2];
        let vt2 = this._getValidateType(rule);
        Object.assign(rule, {
          label: fieldValue.label || `["${fieldKey}"]`
        });
        if (RuleValidatorHelper[vt2]) {
          result = RuleValidatorHelper[vt2](rule, value, message);
          if (result != null) {
            break;
          }
        }
        if (rule.validateExpr) {
          let now2 = Date.now();
          let resultExpr = rule.validateExpr(value, allData, now2);
          if (resultExpr === false) {
            result = this._getMessage(rule, rule.errorMessage || this._message["default"]);
            break;
          }
        }
        if (rule.validateFunction) {
          result = await this.validateFunction(rule, value, data, allData, vt2);
          if (result !== null) {
            break;
          }
        }
      }
      if (result !== null) {
        result = message.TAG + result;
      }
      return result;
    }
    async validateFunction(rule, value, data, allData, vt2) {
      let result = null;
      try {
        let callbackMessage = null;
        const res = await rule.validateFunction(rule, value, allData || data, (message) => {
          callbackMessage = message;
        });
        if (callbackMessage || typeof res === "string" && res || res === false) {
          result = this._getMessage(rule, callbackMessage || res, vt2);
        }
      } catch (e2) {
        result = this._getMessage(rule, e2.message, vt2);
      }
      return result;
    }
    _getMessage(rule, message, vt2) {
      return formatMessage(rule, message || rule.errorMessage || this._message[vt2] || message["default"]);
    }
    _getValidateType(rule) {
      var result = "";
      if (rule.required) {
        result = "required";
      } else if (rule.format) {
        result = "format";
      } else if (rule.arrayType) {
        result = "arrayTypeFormat";
      } else if (rule.range) {
        result = "range";
      } else if (rule.maximum !== void 0 || rule.minimum !== void 0) {
        result = "rangeNumber";
      } else if (rule.maxLength !== void 0 || rule.minLength !== void 0) {
        result = "rangeLength";
      } else if (rule.pattern) {
        result = "pattern";
      } else if (rule.validateFunction) {
        result = "validateFunction";
      }
      return result;
    }
  }
  const RuleValidatorHelper = {
    required(rule, value, message) {
      if (rule.required && isEmptyValue(value, rule.format || typeof value)) {
        return formatMessage(rule, rule.errorMessage || message.required);
      }
      return null;
    },
    range(rule, value, message) {
      const {
        range,
        errorMessage
      } = rule;
      let list = new Array(range.length);
      for (let i2 = 0; i2 < range.length; i2++) {
        const item = range[i2];
        if (types.object(item) && item.value !== void 0) {
          list[i2] = item.value;
        } else {
          list[i2] = item;
        }
      }
      let result = false;
      if (Array.isArray(value)) {
        result = new Set(value.concat(list)).size === list.length;
      } else {
        if (list.indexOf(value) > -1) {
          result = true;
        }
      }
      if (!result) {
        return formatMessage(rule, errorMessage || message["enum"]);
      }
      return null;
    },
    rangeNumber(rule, value, message) {
      if (!types.number(value)) {
        return formatMessage(rule, rule.errorMessage || message.pattern.mismatch);
      }
      let {
        minimum,
        maximum,
        exclusiveMinimum,
        exclusiveMaximum
      } = rule;
      let min = exclusiveMinimum ? value <= minimum : value < minimum;
      let max = exclusiveMaximum ? value >= maximum : value > maximum;
      if (minimum !== void 0 && min) {
        return formatMessage(rule, rule.errorMessage || message["number"][exclusiveMinimum ? "exclusiveMinimum" : "minimum"]);
      } else if (maximum !== void 0 && max) {
        return formatMessage(rule, rule.errorMessage || message["number"][exclusiveMaximum ? "exclusiveMaximum" : "maximum"]);
      } else if (minimum !== void 0 && maximum !== void 0 && (min || max)) {
        return formatMessage(rule, rule.errorMessage || message["number"].range);
      }
      return null;
    },
    rangeLength(rule, value, message) {
      if (!types.string(value) && !types.array(value)) {
        return formatMessage(rule, rule.errorMessage || message.pattern.mismatch);
      }
      let min = rule.minLength;
      let max = rule.maxLength;
      let val = value.length;
      if (min !== void 0 && val < min) {
        return formatMessage(rule, rule.errorMessage || message["length"].minLength);
      } else if (max !== void 0 && val > max) {
        return formatMessage(rule, rule.errorMessage || message["length"].maxLength);
      } else if (min !== void 0 && max !== void 0 && (val < min || val > max)) {
        return formatMessage(rule, rule.errorMessage || message["length"].range);
      }
      return null;
    },
    pattern(rule, value, message) {
      if (!types["pattern"](rule.pattern, value)) {
        return formatMessage(rule, rule.errorMessage || message.pattern.mismatch);
      }
      return null;
    },
    format(rule, value, message) {
      var customTypes = Object.keys(types);
      var format = FORMAT_MAPPING[rule.format] ? FORMAT_MAPPING[rule.format] : rule.format || rule.arrayType;
      if (customTypes.indexOf(format) > -1) {
        if (!types[format](value)) {
          return formatMessage(rule, rule.errorMessage || message.typeError);
        }
      }
      return null;
    },
    arrayTypeFormat(rule, value, message) {
      if (!Array.isArray(value)) {
        return formatMessage(rule, rule.errorMessage || message.typeError);
      }
      for (let i2 = 0; i2 < value.length; i2++) {
        const element = value[i2];
        let formatResult = this.format(rule, element, message);
        if (formatResult !== null) {
          return formatResult;
        }
      }
      return null;
    }
  };
  class SchemaValidator extends RuleValidator {
    constructor(schema, options) {
      super(SchemaValidator.message);
      this._schema = schema;
      this._options = options || null;
    }
    updateSchema(schema) {
      this._schema = schema;
    }
    async validate(data, allData) {
      let result = this._checkFieldInSchema(data);
      if (!result) {
        result = await this.invokeValidate(data, false, allData);
      }
      return result.length ? result[0] : null;
    }
    async validateAll(data, allData) {
      let result = this._checkFieldInSchema(data);
      if (!result) {
        result = await this.invokeValidate(data, true, allData);
      }
      return result;
    }
    async validateUpdate(data, allData) {
      let result = this._checkFieldInSchema(data);
      if (!result) {
        result = await this.invokeValidateUpdate(data, false, allData);
      }
      return result.length ? result[0] : null;
    }
    async invokeValidate(data, all, allData) {
      let result = [];
      let schema = this._schema;
      for (let key in schema) {
        let value = schema[key];
        let errorMessage = await this.validateRule(key, value, data[key], data, allData);
        if (errorMessage != null) {
          result.push({
            key,
            errorMessage
          });
          if (!all)
            break;
        }
      }
      return result;
    }
    async invokeValidateUpdate(data, all, allData) {
      let result = [];
      for (let key in data) {
        let errorMessage = await this.validateRule(key, this._schema[key], data[key], data, allData);
        if (errorMessage != null) {
          result.push({
            key,
            errorMessage
          });
          if (!all)
            break;
        }
      }
      return result;
    }
    _checkFieldInSchema(data) {
      var keys = Object.keys(data);
      var keys2 = Object.keys(this._schema);
      if (new Set(keys.concat(keys2)).size === keys2.length) {
        return "";
      }
      var noExistFields = keys.filter((key) => {
        return keys2.indexOf(key) < 0;
      });
      var errorMessage = formatMessage({
        field: JSON.stringify(noExistFields)
      }, SchemaValidator.message.TAG + SchemaValidator.message["defaultInvalid"]);
      return [{
        key: "invalid",
        errorMessage
      }];
    }
  }
  function Message$1() {
    return {
      TAG: "",
      default: "验证错误",
      defaultInvalid: "提交的字段{field}在数据库中并不存在",
      validateFunction: "验证无效",
      required: "{label}必填",
      "enum": "{label}超出范围",
      timestamp: "{label}格式无效",
      whitespace: "{label}不能为空",
      typeError: "{label}类型无效",
      date: {
        format: "{label}日期{value}格式无效",
        parse: "{label}日期无法解析,{value}无效",
        invalid: "{label}日期{value}无效"
      },
      length: {
        minLength: "{label}长度不能少于{minLength}",
        maxLength: "{label}长度不能超过{maxLength}",
        range: "{label}必须介于{minLength}和{maxLength}之间"
      },
      number: {
        minimum: "{label}不能小于{minimum}",
        maximum: "{label}不能大于{maximum}",
        exclusiveMinimum: "{label}不能小于等于{minimum}",
        exclusiveMaximum: "{label}不能大于等于{maximum}",
        range: "{label}必须介于{minimum}and{maximum}之间"
      },
      pattern: {
        mismatch: "{label}格式不匹配"
      }
    };
  }
  SchemaValidator.message = new Message$1();
  const deepCopy = (val) => {
    return JSON.parse(JSON.stringify(val));
  };
  const typeFilter = (format) => {
    return format === "int" || format === "double" || format === "number" || format === "timestamp";
  };
  const getValue = (key, value, rules) => {
    const isRuleNumType = rules.find((val) => val.format && typeFilter(val.format));
    const isRuleBoolType = rules.find((val) => val.format && val.format === "boolean" || val.format === "bool");
    if (!!isRuleNumType) {
      if (!value && value !== 0) {
        value = null;
      } else {
        value = isNumber(Number(value)) ? Number(value) : value;
      }
    }
    if (!!isRuleBoolType) {
      value = isBoolean(value) ? value : false;
    }
    return value;
  };
  const setDataValue = (field, formdata, value) => {
    formdata[field] = value;
    return value || "";
  };
  const getDataValue = (field, data) => {
    return objGet(data, field);
  };
  const realName = (name, data = {}) => {
    const base_name = _basePath(name);
    if (typeof base_name === "object" && Array.isArray(base_name) && base_name.length > 1) {
      const realname = base_name.reduce((a2, b2) => a2 += `#${b2}`, "_formdata_");
      return realname;
    }
    return base_name[0] || name;
  };
  const isRealName = (name) => {
    const reg = /^_formdata_#*/;
    return reg.test(name);
  };
  const rawData = (object = {}, name) => {
    let newData = JSON.parse(JSON.stringify(object));
    let formData = {};
    for (let i2 in newData) {
      let path = name2arr(i2);
      objSet(formData, path, newData[i2]);
    }
    return formData;
  };
  const name2arr = (name) => {
    let field = name.replace("_formdata_#", "");
    field = field.split("#").map((v2) => isNumber(v2) ? Number(v2) : v2);
    return field;
  };
  const objSet = (object, path, value) => {
    if (typeof object !== "object")
      return object;
    _basePath(path).reduce((o2, k, i2, _2) => {
      if (i2 === _2.length - 1) {
        o2[k] = value;
        return null;
      } else if (k in o2) {
        return o2[k];
      } else {
        o2[k] = /^[0-9]{1,}$/.test(_2[i2 + 1]) ? [] : {};
        return o2[k];
      }
    }, object);
    return object;
  };
  function _basePath(path) {
    if (Array.isArray(path))
      return path;
    return path.replace(/\[/g, ".").replace(/\]/g, "").split(".");
  }
  const objGet = (object, path, defaultVal = "undefined") => {
    let newPath = _basePath(path);
    let val = newPath.reduce((o2, k) => {
      return (o2 || {})[k];
    }, object);
    return !val || val !== void 0 ? val : defaultVal;
  };
  const isNumber = (num) => {
    return !isNaN(Number(num));
  };
  const isBoolean = (bool) => {
    return typeof bool === "boolean";
  };
  const isRequiredField = (rules) => {
    let isNoField = false;
    for (let i2 = 0; i2 < rules.length; i2++) {
      const ruleData = rules[i2];
      if (ruleData.required) {
        isNoField = true;
        break;
      }
    }
    return isNoField;
  };
  const isEqual = (a2, b2) => {
    if (a2 === b2) {
      return a2 !== 0 || 1 / a2 === 1 / b2;
    }
    if (a2 == null || b2 == null) {
      return a2 === b2;
    }
    var classNameA = toString.call(a2), classNameB = toString.call(b2);
    if (classNameA !== classNameB) {
      return false;
    }
    switch (classNameA) {
      case "[object RegExp]":
      case "[object String]":
        return "" + a2 === "" + b2;
      case "[object Number]":
        if (+a2 !== +a2) {
          return +b2 !== +b2;
        }
        return +a2 === 0 ? 1 / +a2 === 1 / b2 : +a2 === +b2;
      case "[object Date]":
      case "[object Boolean]":
        return +a2 === +b2;
    }
    if (classNameA == "[object Object]") {
      var propsA = Object.getOwnPropertyNames(a2), propsB = Object.getOwnPropertyNames(b2);
      if (propsA.length != propsB.length) {
        return false;
      }
      for (var i2 = 0; i2 < propsA.length; i2++) {
        var propName = propsA[i2];
        if (a2[propName] !== b2[propName]) {
          return false;
        }
      }
      return true;
    }
    if (classNameA == "[object Array]") {
      if (a2.toString() == b2.toString()) {
        return true;
      }
      return false;
    }
  };
  const _sfc_main$y = {
    name: "uniForms",
    emits: ["validate", "submit"],
    options: {
      virtualHost: true
    },
    props: {
      // 即将弃用
      value: {
        type: Object,
        default() {
          return null;
        }
      },
      // vue3 替换 value 属性
      modelValue: {
        type: Object,
        default() {
          return null;
        }
      },
      // 1.4.0 开始将不支持 v-model ，且废弃 value 和 modelValue
      model: {
        type: Object,
        default() {
          return null;
        }
      },
      // 表单校验规则
      rules: {
        type: Object,
        default() {
          return {};
        }
      },
      //校验错误信息提示方式 默认 undertext 取值 [undertext|toast|modal]
      errShowType: {
        type: String,
        default: "undertext"
      },
      // 校验触发器方式 默认 bind 取值 [bind|submit]
      validateTrigger: {
        type: String,
        default: "submit"
      },
      // label 位置，默认 left 取值  top/left
      labelPosition: {
        type: String,
        default: "left"
      },
      // label 宽度
      labelWidth: {
        type: [String, Number],
        default: ""
      },
      // label 居中方式，默认 left 取值 left/center/right
      labelAlign: {
        type: String,
        default: "left"
      },
      border: {
        type: Boolean,
        default: false
      }
    },
    provide() {
      return {
        uniForm: this
      };
    },
    data() {
      return {
        // 表单本地值的记录，不应该与传如的值进行关联
        formData: {},
        formRules: {}
      };
    },
    computed: {
      // 计算数据源变化的
      localData() {
        const localVal = this.model || this.modelValue || this.value;
        if (localVal) {
          return deepCopy(localVal);
        }
        return {};
      }
    },
    watch: {
      // 监听数据变化 ,暂时不使用，需要单独赋值
      // localData: {},
      // 监听规则变化
      rules: {
        handler: function(val, oldVal) {
          this.setRules(val);
        },
        deep: true,
        immediate: true
      }
    },
    created() {
      let getbinddata = getApp().$vm.$.appContext.config.globalProperties.binddata;
      if (!getbinddata) {
        getApp().$vm.$.appContext.config.globalProperties.binddata = function(name, value, formName) {
          if (formName) {
            this.$refs[formName].setValue(name, value);
          } else {
            let formVm;
            for (let i2 in this.$refs) {
              const vm = this.$refs[i2];
              if (vm && vm.$options && vm.$options.name === "uniForms") {
                formVm = vm;
                break;
              }
            }
            if (!formVm)
              return formatAppLog("error", "at uni_modules/uni-forms/components/uni-forms/uni-forms.vue:182", "当前 uni-froms 组件缺少 ref 属性");
            formVm.setValue(name, value);
          }
        };
      }
      this.childrens = [];
      this.inputChildrens = [];
      this.setRules(this.rules);
    },
    methods: {
      /**
       * 外部调用方法
       * 设置规则 ，主要用于小程序自定义检验规则
       * @param {Array} rules 规则源数据
       */
      setRules(rules) {
        this.formRules = Object.assign({}, this.formRules, rules);
        this.validator = new SchemaValidator(rules);
      },
      /**
       * 外部调用方法
       * 设置数据，用于设置表单数据，公开给用户使用 ， 不支持在动态表单中使用
       * @param {Object} key
       * @param {Object} value
       */
      setValue(key, value) {
        let example = this.childrens.find((child) => child.name === key);
        if (!example)
          return null;
        this.formData[key] = getValue(key, value, this.formRules[key] && this.formRules[key].rules || []);
        return example.onFieldChange(this.formData[key]);
      },
      /**
       * 外部调用方法
       * 手动提交校验表单
       * 对整个表单进行校验的方法，参数为一个回调函数。
       * @param {Array} keepitem 保留不参与校验的字段
       * @param {type} callback 方法回调
       */
      validate(keepitem, callback) {
        return this.checkAll(this.formData, keepitem, callback);
      },
      /**
       * 外部调用方法
       * 部分表单校验
       * @param {Array|String} props 需要校验的字段
       * @param {Function} 回调函数
       */
      validateField(props = [], callback) {
        props = [].concat(props);
        let invalidFields = {};
        this.childrens.forEach((item) => {
          const name = realName(item.name);
          if (props.indexOf(name) !== -1) {
            invalidFields = Object.assign({}, invalidFields, {
              [name]: this.formData[name]
            });
          }
        });
        return this.checkAll(invalidFields, [], callback);
      },
      /**
       * 外部调用方法
       * 移除表单项的校验结果。传入待移除的表单项的 prop 属性或者 prop 组成的数组，如不传则移除整个表单的校验结果
       * @param {Array|String} props 需要移除校验的字段 ，不填为所有
       */
      clearValidate(props = []) {
        props = [].concat(props);
        this.childrens.forEach((item) => {
          if (props.length === 0) {
            item.errMsg = "";
          } else {
            const name = realName(item.name);
            if (props.indexOf(name) !== -1) {
              item.errMsg = "";
            }
          }
        });
      },
      /**
       * 外部调用方法 ，即将废弃
       * 手动提交校验表单
       * 对整个表单进行校验的方法，参数为一个回调函数。
       * @param {Array} keepitem 保留不参与校验的字段
       * @param {type} callback 方法回调
       */
      submit(keepitem, callback, type) {
        for (let i2 in this.dataValue) {
          const itemData = this.childrens.find((v2) => v2.name === i2);
          if (itemData) {
            if (this.formData[i2] === void 0) {
              this.formData[i2] = this._getValue(i2, this.dataValue[i2]);
            }
          }
        }
        if (!type) {
          formatAppLog("warn", "at uni_modules/uni-forms/components/uni-forms/uni-forms.vue:289", "submit 方法即将废弃，请使用validate方法代替！");
        }
        return this.checkAll(this.formData, keepitem, callback, "submit");
      },
      // 校验所有
      async checkAll(invalidFields, keepitem, callback, type) {
        if (!this.validator)
          return;
        let childrens = [];
        for (let i2 in invalidFields) {
          const item = this.childrens.find((v2) => realName(v2.name) === i2);
          if (item) {
            childrens.push(item);
          }
        }
        if (!callback && typeof keepitem === "function") {
          callback = keepitem;
        }
        let promise;
        if (!callback && typeof callback !== "function" && Promise) {
          promise = new Promise((resolve, reject) => {
            callback = function(valid, invalidFields2) {
              !valid ? resolve(invalidFields2) : reject(valid);
            };
          });
        }
        let results = [];
        let tempFormData = JSON.parse(JSON.stringify(invalidFields));
        for (let i2 in childrens) {
          const child = childrens[i2];
          let name = realName(child.name);
          const result = await child.onFieldChange(tempFormData[name]);
          if (result) {
            results.push(result);
            if (this.errShowType === "toast" || this.errShowType === "modal")
              break;
          }
        }
        if (Array.isArray(results)) {
          if (results.length === 0)
            results = null;
        }
        if (Array.isArray(keepitem)) {
          keepitem.forEach((v2) => {
            let vName = realName(v2);
            let value = getDataValue(v2, this.localData);
            if (value !== void 0) {
              tempFormData[vName] = value;
            }
          });
        }
        if (type === "submit") {
          this.$emit("submit", {
            detail: {
              value: tempFormData,
              errors: results
            }
          });
        } else {
          this.$emit("validate", results);
        }
        let resetFormData = {};
        resetFormData = rawData(tempFormData, this.name);
        callback && typeof callback === "function" && callback(results, resetFormData);
        if (promise && callback) {
          return promise;
        } else {
          return null;
        }
      },
      /**
       * 返回validate事件
       * @param {Object} result
       */
      validateCheck(result) {
        this.$emit("validate", result);
      },
      _getValue: getValue,
      _isRequiredField: isRequiredField,
      _setDataValue: setDataValue,
      _getDataValue: getDataValue,
      _realName: realName,
      _isRealName: isRealName,
      _isEqual: isEqual
    }
  };
  function _sfc_render$x(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-forms" }, [
      vue.createElementVNode("form", null, [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ])
    ]);
  }
  const __easycom_7 = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["render", _sfc_render$x], ["__scopeId", "data-v-9a1e3c32"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-forms/components/uni-forms/uni-forms.vue"]]);
  const getOrderList = (params) => {
    return request({
      url: `/instruction/search/order/${params.missionId}/${params.curPage}/${params.pageSize}`,
      method: "get"
    });
  };
  const getWarningList = (params) => {
    return request({
      url: `/instruction/search/warning/${params.missionId}/${params.curPage}/${params.pageSize}`,
      method: "get"
    });
  };
  const _imports_0$7 = "/static/icon/alert.png";
  const _imports_1$2 = "/static/icon/flag.png";
  const _imports_2$1 = "/static/icon/document.png";
  const _imports_3 = "/static/icon/tuceng.png";
  const _imports_2 = "/static/icon/close.png";
  const _imports_5 = "/static/icon/video.png";
  const _imports_6 = "/static/icon/photo.png";
  const _imports_7 = "/static/icon/micro.png";
  const _imports_8 = "/static/icon/delete.png";
  const block0 = (Comp) => {
    (Comp.$renderjs || (Comp.$renderjs = [])).push("m");
    (Comp.$renderjsModules || (Comp.$renderjsModules = {}))["m"] = "55b5cda2";
  };
  const _sfc_main$x = {
    data() {
      return {
        recorderManager: {},
        innerAudioContext: {},
        selectedMap: "gaode",
        //当前地图
        navIndex: 0,
        filePaths: {
          imagePath: "",
          videoPath: "",
          voicePath: ""
        },
        range: [
          {
            value: "1",
            text: "未开始"
          },
          {
            value: "2",
            text: "进行中"
          },
          {
            value: "3",
            text: "已完成"
          }
        ],
        alert_form_data: {
          alert_grade: "",
          alert_time: "",
          sender_name: "",
          alert_content: ""
        },
        grades: [
          {
            text: "一般告警",
            value: "一般告警"
          },
          {
            text: "严重告警",
            value: "严重告警"
          },
          {
            text: "紧急告警",
            value: "紧急告警"
          }
        ],
        taskItem: {},
        position: {
          longitude: "120.686250",
          latitude: "24.182220"
        },
        map_options: [
          {
            key: "google",
            src: "../../../static/icon/google.png",
            htmlSrc: "/static/html/map_gaode.html",
            name: "谷歌地图"
          },
          {
            key: "gaode",
            src: "../../../static/icon/gaode.png",
            htmlSrc: "/static/html/map_gaode.html",
            name: "高德地图"
          },
          {
            key: "baidu",
            src: "../../../static/icon/baidu.png",
            htmlSrc: "/static/html/map_baidu.html",
            name: "百度地图"
          },
          {
            key: "local",
            src: "../../../static/icon/offline.png",
            htmlSrc: "/static/html/map_gaode.html",
            name: "离线地图"
          }
          // 继续添加更多图片
        ],
        task_instructions: [
          // {
          // 	src: '../../../static/uni.png',
          // 	sender_name: 'admin',
          // 	detail: '111,
          // 	isConfirmed: false
          // },
          // {
          // 	src: '../../../static/uni.png',
          // 	sender_name: 'lihua',
          // 	detail: '222',
          // 	isConfirmed: false
          // },
          // {
          // 	src: '../../../static/uni.png',
          // 	sender_name: 'wanghao',
          // 	detail: '333',
          // 	isConfirmed: false
          // },
        ],
        alert_data: [
          // {
          // 	alert_grade: '重要告警',
          // 	alert_time: '2024.5.1',
          // 	sender_name: '张三',
          // 	alert_content: '靠近目标，开始行动！1',
          // 	isConfirmed: false
          // },
          // {
          // 	alert_grade: '一般告警',
          // 	alert_time: '2024.2.6',
          // 	sender_name: '李四',
          // 	alert_content: '靠近目标，开始行动！2',
          // 	isConfirmed: false
          // },
          // {
          // 	alert_grade: '重要告警',
          // 	alert_time: '2024.1.3',
          // 	sender_name: '张三',
          // 	alert_content: '靠近目标，开始行动！3',
          // 	isConfirmed: false
          // },
          // {
          // 	alert_grade: '严重告警',
          // 	alert_time: '2024.7.9',
          // 	sender_name: '张三',
          // 	alert_content: '靠近目标，开始行动！4',
          // 	isConfirmed: false
          // },
        ],
        alert_data_mine: [
          // {
          // 	alert_grade: '一般告警',
          // 	alert_time: '2024.5.1',
          // 	sender_name: '张三',
          // 	alert_content: '目标视野丢失'
          // },
          // {
          // 	alert_grade: '一般告警',
          // 	alert_time: '2024.2.6',
          // 	sender_name: '李四',
          // 	alert_content: '发现嫌疑人'
          // },
          // {
          // 	alert_grade: '重要告警',
          // 	alert_time: '2024.1.3',
          // 	sender_name: '张三',
          // 	alert_content: '行动暂停'
          // },
          // {
          // 	alert_grade: '严重告警',
          // 	alert_time: '2024.7.9',
          // 	sender_name: '张三',
          // 	alert_content: '行动继续'
          // },
        ],
        // 行动回溯，false停止，true播放
        replay: false
      };
    },
    onNavigationBarButtonTap() {
      this.$refs.popup.open("bottom");
    },
    mounted() {
      this.getOrder();
      this.getWarning();
    },
    onLoad(options) {
      if (options.taskItem) {
        this.taskItem = JSON.parse(options.taskItem);
      } else {
        formatAppLog("error", "at pages/task/task_detail/task_detail.vue:654", "没有传递类型参数");
      }
      this.recorderManager = uni.getRecorderManager();
      this.innerAudioContext = uni.createInnerAudioContext();
      this.innerAudioContext.autoplay = true;
      formatAppLog("log", "at pages/task/task_detail/task_detail.vue:662", "uni.getRecorderManager()", uni.getRecorderManager());
      let self2 = this;
      this.recorderManager.onStop(function(res) {
        formatAppLog("log", "at pages/task/task_detail/task_detail.vue:665", "recorder stop" + JSON.stringify(res));
        self2.filePaths.voicePath = res.tempFilePath;
      });
    },
    methods: {
      take_picture() {
        uni.chooseImage({
          count: 1,
          // 默认选择一张图片
          sourceType: ["camera"],
          // 只允许从相机拍照
          success: function(res) {
            const tempFilePath = res.tempFilePaths[0];
            formatAppLog("log", "at pages/task/task_detail/task_detail.vue:678", "拍照成功，文件路径：", tempFilePath);
            uni.previewImage({
              urls: [tempFilePath]
            });
            uni.uploadFile({
              url: `${backendHost}/minio/upload?isGroup=${false}&missionId=${"d56f22fe8f3c40bdba6c0ad609e2f3e6"}&receptionId=${"69fc9284fc5d4dd7b05092af4715ab9d"}`,
              filePath: tempFilePath,
              name: "file",
              header: {
                "Content-Type": "application/form-data;charset=UTF-8",
                "Authorization": "Bearer " + uni.getStorageSync("token")
              },
              success: (uploadFileRes) => {
                var res2 = JSON.parse(uploadFileRes.data);
                if (res2.code === 200) {
                  uni.showToast({
                    title: "图片上传成功！",
                    //将值设置为 success 或者直接不用写icon这个参数
                    icon: "success",
                    //显示持续时间为 2秒
                    duration: 2e3
                  });
                } else {
                  uni.showToast({
                    title: "图片上传失败！",
                    icon: "none",
                    //显示持续时间为 2秒
                    duration: 2e3
                  });
                }
                formatAppLog("log", "at pages/task/task_detail/task_detail.vue:712", uploadFileRes.data);
              }
            });
          },
          fail: function(err) {
            formatAppLog("error", "at pages/task/task_detail/task_detail.vue:717", "拍照失败：", err);
          }
        });
      },
      take_video() {
        var self2 = this;
        uni.chooseVideo({
          sourceType: ["camera"],
          // 只允许从相机录制
          maxDuration: 60,
          // 录像时长最大为60秒
          camera: "back",
          // 使用后置摄像头
          success: function(res) {
            const tempFilePath = res.tempFilePath;
            self2.filePaths.videoPath = res.tempFilePath;
            formatAppLog("log", "at pages/task/task_detail/task_detail.vue:732", "录像成功，文件路径：", tempFilePath);
            uni.uploadFile({
              url: `${backendHost}/minio/upload?isGroup=${false}&missionId=${"d56f22fe8f3c40bdba6c0ad609e2f3e6"}&receptionId=${"69fc9284fc5d4dd7b05092af4715ab9d"}`,
              filePath: tempFilePath,
              name: "file",
              header: {
                "Content-Type": "application/form-data;charset=UTF-8",
                "Authorization": "Bearer " + uni.getStorageSync("token")
              },
              success: (uploadFileRes) => {
                var res2 = JSON.parse(uploadFileRes.data);
                if (res2.code === 200) {
                  uni.showToast({
                    title: "视频上传成功！",
                    //将值设置为 success 或者直接不用写icon这个参数
                    icon: "success",
                    //显示持续时间为 1秒
                    duration: 2e3
                  });
                } else {
                  uni.showToast({
                    title: "视频上传失败！",
                    icon: "none",
                    //显示持续时间为 1秒
                    duration: 2e3
                  });
                }
                formatAppLog("log", "at pages/task/task_detail/task_detail.vue:761", uploadFileRes.data);
              }
            });
          },
          fail: function(err) {
            formatAppLog("error", "at pages/task/task_detail/task_detail.vue:766", "录像失败：", err);
          }
        });
      },
      startRecording() {
        formatAppLog("log", "at pages/task/task_detail/task_detail.vue:771", "开始录音");
        this.recorderManager.start();
        uni.showLoading({
          title: "正在录音"
        });
      },
      stopRecording() {
        formatAppLog("log", "at pages/task/task_detail/task_detail.vue:780", "录音结束");
        this.recorderManager.stop();
        uni.hideLoading();
      },
      playVoice() {
        formatAppLog("log", "at pages/task/task_detail/task_detail.vue:785", "播放录音");
        formatAppLog("log", "at pages/task/task_detail/task_detail.vue:786", "this.voicePath", this.filePaths.voicePath);
        if (this.filePaths.voicePath) {
          this.innerAudioContext.src = this.filePaths.voicePath;
          this.innerAudioContext.play();
        }
      },
      checkIndex(index) {
        this.navIndex = index;
      },
      delete_alert(index) {
        this.alert_data.splice(index, 1);
      },
      delete_alert_mine(index) {
        this.alert_data_mine.splice(index, 1);
      },
      close() {
        this.$refs.popup.close();
      },
      open_alert_form() {
        this.$refs.alert_form_popup.open();
      },
      close_alert_form() {
        this.$refs.alert_form_popup.close();
      },
      open_alert_popup() {
        this.$refs.alert_popup.open();
      },
      close_alert_popup() {
        this.$refs.alert_popup.close();
      },
      open_map_selector() {
        this.$refs.map_selector.open();
      },
      close_map_selector() {
        this.$refs.map_selector.close();
      },
      open_task_instructions() {
        this.$refs.task_instructions.open();
      },
      close_task_instructions() {
        this.$refs.task_instructions.close();
      },
      goToDocument() {
        uni.navigateTo({
          url: "/pages/task/task_detail/document/document"
        });
      },
      goToMainPage() {
        uni.redirectTo({
          url: "/pages/tabBar/tabBar"
        });
      },
      selectImage(value) {
        this.selectedMap = value;
        this.$refs.map_selector.close();
      },
      receive_instruction(index) {
        this.task_instructions[index].isConfirmed = true;
      },
      receive_alert(index) {
        this.alert_data[index].isConfirmed = true;
      },
      isReceived(index) {
        return this.task_instructions[index].isConfirmed ? "已收到" : "收到";
      },
      isReceived_alert(index) {
        return this.alert_data[index].isConfirmed ? "已确认" : "确认";
      },
      submit(ref) {
        uni.showLoading({
          title: "正在发送",
          mask: true
        });
        formatAppLog("log", "at pages/task/task_detail/task_detail.vue:861", this.taskItem.memberIds, "memberIds");
        ({
          isOrder: false,
          message: this.alert_form_data.alert_content,
          receiverMissionMemberIds: [],
          relatedMissionId: this.taskItem.id
        });
        getMissionDetails({
          missionId: this.taskItem.id
        }).then((res) => {
          if (res.code === 200) {
            formatAppLog("log", "at pages/task/task_detail/task_detail.vue:873", res, "getMissionDetails");
          }
        });
        this.$refs.alert_form_popup.close();
        this.getWarning();
      },
      // 设置经纬度
      setPoint() {
        this.position.latitude = this.taskItem.latitude;
        this.position.longitude = this.taskItem.longitude;
      },
      // 删除任务
      deleteMisson() {
        const id = this.taskItem.id;
        uni.showModal({
          title: "提示",
          content: "确定删除任务？",
          success: function(res) {
            uni.showLoading({
              title: "正在删除",
              mask: true
            });
            deleteMission(id).then((res2) => {
              uni.hideLoading();
              if (res2.code == 200) {
                uni.showToast({
                  title: "删除成功",
                  duration: 2e3
                });
              } else {
                uni.showToast({
                  title: res2.msg,
                  duration: 2e3
                });
              }
            });
          }
        });
      },
      setReplay(value) {
        this.replay = value;
      },
      getOrder() {
        getOrderList({
          missionId: this.taskItem.id,
          curPage: 1,
          pageSize: 20
        }).then((res) => {
          if (res.code === 200) {
            this.task_instructions = res.data.records.map((item) => ({
              src: "../../../static/uni.png",
              sender_name: item.senderId,
              detail: item.message,
              isConfirmed: item.isRead
            }));
            for (let order of this.task_instructions) {
              searchUser(order.sender_name).then((res2) => {
                if (res2.code === 200) {
                  order.sender_name = res2.data.name;
                }
              });
            }
          }
        });
      },
      getWarning() {
        getWarningList({
          missionId: this.taskItem.id,
          curPage: 1,
          pageSize: 20
        }).then((res) => {
          if (res.code === 200) {
            const userInfo = uni.getStorageSync("userInfo");
            this.alert_data = res.data.records.filter((item) => item.receiverId === userInfo.id).map(
              (item) => ({
                alert_grade: "严重告警",
                alert_time: item.sendTime,
                sender_name: item.senderId,
                alert_content: item.message,
                isConfirmed: item.isRead
              })
            );
            this.alert_data_mine = res.data.records.filter((item) => item.senderId === userInfo.id).map(
              (item) => ({
                alert_grade: "严重告警",
                alert_time: item.sendTime,
                sender_name: item.senderId,
                alert_content: item.message
              })
            );
            for (let order of this.alert_data) {
              searchUser(order.sender_name).then((res2) => {
                if (res2.code === 200) {
                  order.sender_name = res2.data.name;
                }
              });
            }
            for (let order of this.alert_data_mine) {
              searchUser(order.sender_name).then((res2) => {
                if (res2.code === 200) {
                  order.sender_name = res2.data.name;
                }
              });
            }
          }
        });
      }
    }
  };
  function _sfc_render$w(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_data_select = resolveEasycom(vue.resolveDynamicComponent("uni-data-select"), __easycom_0$3);
    const _component_uni_popup = resolveEasycom(vue.resolveDynamicComponent("uni-popup"), __easycom_4$1);
    const _component_uni_collapse_item = resolveEasycom(vue.resolveDynamicComponent("uni-collapse-item"), __easycom_2$1);
    const _component_uni_collapse = resolveEasycom(vue.resolveDynamicComponent("uni-collapse"), __easycom_3$1);
    const _component_uni_data_checkbox = resolveEasycom(vue.resolveDynamicComponent("uni-data-checkbox"), __easycom_4);
    const _component_uni_forms_item = resolveEasycom(vue.resolveDynamicComponent("uni-forms-item"), __easycom_5$1);
    const _component_uni_easyinput = resolveEasycom(vue.resolveDynamicComponent("uni-easyinput"), __easycom_0$1);
    const _component_uni_forms = resolveEasycom(vue.resolveDynamicComponent("uni-forms"), __easycom_7);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(" 地图容器 "),
        vue.createElementVNode("div", {
          id: "map_container",
          selectedMap: vue.wp($data.selectedMap),
          "change:selectedMap": _ctx.m.setMapType,
          replay: $data.replay,
          "change:replay": _ctx.m.getReplay,
          position: vue.wp($data.position),
          "change:position": _ctx.m.getPosition
        }, null, 8, ["selectedMap", "change:selectedMap", "replay", "change:replay", "position", "change:position"]),
        vue.createCommentVNode(" task_detail "),
        vue.createElementVNode("view", { class: "layout_task_detail" }, [
          vue.createCommentVNode(" 按钮组 "),
          vue.createElementVNode("view", { class: "condition_icons" }, [
            vue.createCommentVNode(" 左侧-选择任务状态按钮 "),
            vue.createElementVNode("view", { class: "condition_selector" }, [
              vue.createVNode(_component_uni_data_select, {
                modelValue: $data.taskItem.type,
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.taskItem.type = $event),
                localdata: $data.range,
                clear: false
              }, null, 8, ["modelValue", "localdata"])
            ]),
            vue.createElementVNode("view", { class: "condition_selector" }, [
              vue.createElementVNode("button", {
                class: "mini-btn",
                type: "primary",
                size: "mini",
                onClick: _cache[1] || (_cache[1] = ($event) => $options.setReplay(!$data.replay))
              }, [
                !$data.replay ? (vue.openBlock(), vue.createElementBlock("text", { key: 0 }, " 行动回溯 ")) : (vue.openBlock(), vue.createElementBlock("text", { key: 1 }, " 正在回溯 "))
              ])
            ]),
            vue.createCommentVNode(" 右侧按钮组 "),
            vue.createElementVNode("view", { class: "right-button-groups" }, [
              vue.createCommentVNode(" 告警按钮 "),
              vue.createElementVNode("view", {
                class: "instructions_alert",
                onClick: _cache[2] || (_cache[2] = (...args) => $options.open_alert_popup && $options.open_alert_popup(...args))
              }, [
                vue.createElementVNode("view", {
                  class: "alert_img",
                  style: { "text-align": "center", "padding-top": "5px" }
                }, [
                  vue.createElementVNode("image", {
                    src: _imports_0$7,
                    style: { "width": "22px", "height": "22px" }
                  })
                ]),
                vue.createElementVNode("view", {
                  class: "text_setting",
                  style: { "text-align": "center" }
                }, [
                  vue.createElementVNode("text", { style: { "color": "#d81e06", "font-size": "small" } }, "告警")
                ])
              ]),
              vue.createCommentVNode(" 指令按钮 "),
              vue.createElementVNode("view", {
                class: "instructions_instruct",
                onClick: _cache[3] || (_cache[3] = (...args) => $options.open_task_instructions && $options.open_task_instructions(...args))
              }, [
                vue.createElementVNode("view", {
                  class: "alert_img",
                  style: { "text-align": "center", "padding-top": "5px" }
                }, [
                  vue.createElementVNode("image", {
                    src: _imports_1$2,
                    style: { "width": "22px", "height": "22px" }
                  })
                ]),
                vue.createElementVNode("view", {
                  class: "text_setting",
                  style: { "text-align": "center" }
                }, [
                  vue.createElementVNode("text", { style: { "color": "#3171d3", "font-size": "small" } }, "指令")
                ])
              ]),
              vue.createCommentVNode(" 文件按钮+图层按钮 "),
              vue.createElementVNode("view", { class: "instructions_document" }, [
                vue.createCommentVNode(" 文件按钮 "),
                vue.createElementVNode("view", {
                  class: "document",
                  onClick: _cache[4] || (_cache[4] = (...args) => $options.goToDocument && $options.goToDocument(...args))
                }, [
                  vue.createElementVNode("view", {
                    class: "alert_img",
                    style: { "text-align": "center", "padding-top": "5px" }
                  }, [
                    vue.createElementVNode("image", {
                      src: _imports_2$1,
                      style: { "width": "22px", "height": "22px" }
                    })
                  ]),
                  vue.createElementVNode("view", {
                    class: "text_setting",
                    style: { "text-align": "center" }
                  }, [
                    vue.createElementVNode("text", { style: { "color": "#636363", "font-size": "small" } }, "文件")
                  ])
                ]),
                vue.createCommentVNode(" 图层按钮 "),
                vue.createElementVNode("view", {
                  class: "map_selector",
                  onClick: _cache[5] || (_cache[5] = (...args) => $options.open_map_selector && $options.open_map_selector(...args))
                }, [
                  vue.createElementVNode("view", {
                    class: "alert_img",
                    style: { "text-align": "center", "padding-top": "5px" }
                  }, [
                    vue.createElementVNode("image", {
                      src: _imports_3,
                      style: { "width": "22px", "height": "22px" }
                    })
                  ]),
                  vue.createElementVNode("view", {
                    class: "text_setting",
                    style: { "text-align": "center" }
                  }, [
                    vue.createElementVNode("text", { style: { "color": "#636363", "font-size": "small" } }, "图层")
                  ])
                ])
              ])
            ])
          ]),
          vue.createCommentVNode(" 详情界面弹窗 "),
          vue.createElementVNode("view", null, [
            vue.createVNode(
              _component_uni_popup,
              {
                ref: "popup",
                type: "bottom",
                "background-color": "#fff",
                "mask-click": false
              },
              {
                default: vue.withCtx(() => [
                  vue.createElementVNode("view", {
                    class: "detail",
                    style: { "padding": "15px" }
                  }, [
                    vue.createElementVNode("view", { class: "detail_top" }, [
                      vue.createElementVNode("view", null, [
                        vue.createElementVNode(
                          "text",
                          null,
                          vue.toDisplayString($data.taskItem.task_name),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("view", {
                        style: { "margin-right": "10px" },
                        onClick: _cache[6] || (_cache[6] = (...args) => $options.close && $options.close(...args))
                      }, [
                        vue.createElementVNode("image", {
                          src: _imports_2,
                          style: { "width": "15px", "height": "15px" }
                        })
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "divider" }),
                    vue.createElementVNode("view", { class: "detail_info" }, [
                      vue.createElementVNode("view", { class: "infos" }, [
                        vue.createElementVNode(
                          "text",
                          null,
                          "任务名称: " + vue.toDisplayString($data.taskItem.task_name),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "infos" }, [
                        vue.createElementVNode(
                          "text",
                          null,
                          "任务描述: " + vue.toDisplayString($data.taskItem.description),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "infos" }, [
                        vue.createElementVNode(
                          "text",
                          null,
                          "任务国家: " + vue.toDisplayString($data.taskItem.country),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "infos" }, [
                        vue.createElementVNode(
                          "text",
                          null,
                          "任务地点: " + vue.toDisplayString($data.taskItem.position),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "infos" }, [
                        vue.createElementVNode(
                          "text",
                          null,
                          "任务时间: " + vue.toDisplayString($data.taskItem.start_time) + " - " + vue.toDisplayString($data.taskItem.end_time),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "infos" }, [
                        vue.createElementVNode(
                          "text",
                          null,
                          "任务口令: " + vue.toDisplayString($data.taskItem.key),
                          1
                          /* TEXT */
                        )
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "divider" }),
                    vue.createElementVNode("view", { class: "text_setting" }, [
                      vue.createCommentVNode(" 录制视频按钮 "),
                      vue.createElementVNode("view", { style: { "margin-right": "50px" } }, [
                        vue.createElementVNode("image", {
                          onClick: _cache[7] || (_cache[7] = ($event) => $options.take_video()),
                          src: _imports_5,
                          style: { "width": "30px", "height": "30px" }
                        })
                      ]),
                      vue.createCommentVNode(" 拍摄照片按钮 "),
                      vue.createElementVNode("view", { style: { "margin-right": "50px" } }, [
                        vue.createElementVNode("image", {
                          onClick: _cache[8] || (_cache[8] = ($event) => $options.take_picture()),
                          src: _imports_6,
                          style: { "width": "33px", "height": "33px" }
                        })
                      ]),
                      vue.createCommentVNode(" 录制音频按钮 "),
                      vue.createElementVNode("view", { style: { "margin-right": "50px" } }, [
                        vue.createElementVNode(
                          "image",
                          {
                            onLongpress: _cache[9] || (_cache[9] = ($event) => $options.startRecording()),
                            onTouchend: _cache[10] || (_cache[10] = ($event) => $options.stopRecording()),
                            src: _imports_7,
                            style: { "width": "32px", "height": "32px" }
                          },
                          null,
                          32
                          /* NEED_HYDRATION */
                        )
                      ]),
                      vue.createCommentVNode(" 删除任务按钮 "),
                      vue.createElementVNode("view", null, [
                        vue.createElementVNode("image", {
                          src: _imports_8,
                          style: { "width": "28px", "height": "28px" },
                          onClick: _cache[11] || (_cache[11] = (...args) => $options.deleteMisson && $options.deleteMisson(...args))
                        })
                      ])
                    ])
                  ])
                ]),
                _: 1
                /* STABLE */
              },
              512
              /* NEED_PATCH */
            )
          ]),
          vue.createCommentVNode(" 图层弹窗 "),
          vue.createElementVNode("view", null, [
            vue.createVNode(
              _component_uni_popup,
              {
                ref: "map_selector",
                type: "bottom",
                "background-color": "#fff",
                "mask-click": false
              },
              {
                default: vue.withCtx(() => [
                  vue.createElementVNode("view", {
                    class: "detail",
                    style: { "padding": "15px" }
                  }, [
                    vue.createElementVNode("view", { class: "detail_top" }, [
                      vue.createElementVNode("view", null, [
                        vue.createElementVNode("text", null, "图层切换")
                      ]),
                      vue.createElementVNode("view", {
                        style: { "margin-right": "10px" },
                        onClick: _cache[12] || (_cache[12] = (...args) => $options.close_map_selector && $options.close_map_selector(...args))
                      }, [
                        vue.createElementVNode("image", {
                          src: _imports_2,
                          style: { "width": "15px", "height": "15px" }
                        })
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "divider" }),
                    vue.createElementVNode("view", { style: { "margin-top": "20px" } }, [
                      vue.createElementVNode("view", { class: "map_icons" }, [
                        (vue.openBlock(true), vue.createElementBlock(
                          vue.Fragment,
                          null,
                          vue.renderList($data.map_options, (item, index) => {
                            return vue.openBlock(), vue.createElementBlock("view", { key: index }, [
                              vue.createElementVNode("view", {
                                class: "map_icon",
                                style: { "margin": "0 15px" }
                              }, [
                                vue.createCommentVNode(` 									<image :class="{ 'selected': selectedIndex === index }" @click="selectImage(index)"\r
										:src=item.src style="width: 55px; height: 55px; border-radius: 15px;"></image> `),
                                vue.createElementVNode("image", {
                                  class: vue.normalizeClass({ "selected": $data.selectedMap === item.key }),
                                  onClick: ($event) => $options.selectImage(item.key),
                                  src: item.src,
                                  style: { "width": "55px", "height": "55px", "border-radius": "15px" }
                                }, null, 10, ["onClick", "src"])
                              ]),
                              vue.createElementVNode("view", { style: { "text-align": "center" } }, [
                                vue.createElementVNode(
                                  "text",
                                  null,
                                  vue.toDisplayString(item.name),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ]);
                          }),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ])
                    ])
                  ])
                ]),
                _: 1
                /* STABLE */
              },
              512
              /* NEED_PATCH */
            )
          ]),
          vue.createCommentVNode(" 任务指令弹窗 "),
          vue.createElementVNode("view", null, [
            vue.createVNode(
              _component_uni_popup,
              {
                ref: "task_instructions",
                type: "bottom",
                "background-color": "#fff",
                "mask-click": false
              },
              {
                default: vue.withCtx(() => [
                  vue.createElementVNode("view", {
                    class: "detail",
                    style: { "padding": "15px" }
                  }, [
                    vue.createElementVNode("view", { class: "detail_top" }, [
                      vue.createElementVNode("view", null, [
                        vue.createElementVNode("text", null, "任务指令")
                      ]),
                      vue.createElementVNode("view", {
                        style: { "margin-right": "10px" },
                        onClick: _cache[13] || (_cache[13] = (...args) => $options.close_task_instructions && $options.close_task_instructions(...args))
                      }, [
                        vue.createElementVNode("image", {
                          src: _imports_2,
                          style: { "width": "15px", "height": "15px" }
                        })
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "divider" }),
                    vue.createElementVNode("view", { style: { "margin-top": "20px" } }, [
                      vue.createElementVNode("view", { class: "instructions" }, [
                        (vue.openBlock(true), vue.createElementBlock(
                          vue.Fragment,
                          null,
                          vue.renderList($data.task_instructions, (item, index) => {
                            return vue.openBlock(), vue.createElementBlock("view", {
                              key: index,
                              class: "instructions_item",
                              style: { "display": "flex", "justify-content": "space-between", "align-items": "center", "margin-bottom": "20px" }
                            }, [
                              vue.createElementVNode("view", { style: { "display": "flex" } }, [
                                vue.createElementVNode("view", { style: { "margin-right": "10px" } }, [
                                  vue.createElementVNode("image", {
                                    src: item.src,
                                    style: { "width": "45px", "height": "45px" }
                                  }, null, 8, ["src"])
                                ]),
                                vue.createElementVNode("view", null, [
                                  vue.createElementVNode("view", null, [
                                    vue.createElementVNode(
                                      "text",
                                      null,
                                      vue.toDisplayString(item.sender_name),
                                      1
                                      /* TEXT */
                                    )
                                  ]),
                                  vue.createElementVNode("view", null, [
                                    vue.createElementVNode(
                                      "text",
                                      { style: { "color": "#858585" } },
                                      vue.toDisplayString(item.detail),
                                      1
                                      /* TEXT */
                                    )
                                  ])
                                ])
                              ]),
                              vue.createElementVNode("view", null, [
                                vue.createElementVNode("button", {
                                  onClick: ($event) => $options.receive_instruction(index),
                                  disabled: item.isConfirmed,
                                  class: "mini-btn",
                                  type: "primary",
                                  size: "mini"
                                }, vue.toDisplayString($options.isReceived(index)), 9, ["onClick", "disabled"])
                              ])
                            ]);
                          }),
                          128
                          /* KEYED_FRAGMENT */
                        ))
                      ])
                    ])
                  ])
                ]),
                _: 1
                /* STABLE */
              },
              512
              /* NEED_PATCH */
            )
          ]),
          vue.createCommentVNode(" 告警弹窗 "),
          vue.createElementVNode("view", null, [
            vue.createVNode(
              _component_uni_popup,
              {
                ref: "alert_popup",
                type: "bottom",
                "background-color": "#fff"
              },
              {
                default: vue.withCtx(() => [
                  vue.createElementVNode("view", { style: { "padding": "15px" } }, [
                    vue.createElementVNode("view", { class: "detail" }, [
                      vue.createElementVNode("view", { class: "detail_top" }, [
                        vue.createElementVNode("view", null, [
                          vue.createElementVNode("text", null, "告警列表")
                        ]),
                        vue.createElementVNode("view", {
                          style: { "margin-right": "10px" },
                          onClick: _cache[14] || (_cache[14] = (...args) => $options.close_alert_popup && $options.close_alert_popup(...args))
                        }, [
                          vue.createElementVNode("image", {
                            src: _imports_2,
                            style: { "width": "15px", "height": "15px" }
                          })
                        ])
                      ]),
                      vue.createElementVNode("view", { class: "divider" })
                    ]),
                    vue.createElementVNode("view", null, [
                      vue.createElementVNode("view", { class: "head-nav" }, [
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass($data.navIndex == 0 ? "activite" : ""),
                            onClick: _cache[15] || (_cache[15] = ($event) => $options.checkIndex(0)),
                            style: { "width": "50%", "text-align": "center" }
                          },
                          "接收",
                          2
                          /* CLASS */
                        ),
                        vue.createElementVNode(
                          "view",
                          {
                            class: vue.normalizeClass($data.navIndex == 1 ? "activite" : ""),
                            onClick: _cache[16] || (_cache[16] = ($event) => $options.checkIndex(1)),
                            style: { "width": "50%", "text-align": "center" }
                          },
                          "发送",
                          2
                          /* CLASS */
                        )
                      ]),
                      vue.createCommentVNode(" 内容切换 "),
                      $data.navIndex == 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 0,
                        class: "alert_content"
                      }, [
                        vue.createVNode(
                          _component_uni_collapse,
                          {
                            ref: "collapse",
                            accordion: ""
                          },
                          {
                            default: vue.withCtx(() => [
                              (vue.openBlock(true), vue.createElementBlock(
                                vue.Fragment,
                                null,
                                vue.renderList($data.alert_data, (item, index) => {
                                  return vue.openBlock(), vue.createBlock(_component_uni_collapse_item, {
                                    key: index,
                                    title: item.alert_content
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createElementVNode("view", {
                                        class: "detail_info",
                                        style: { "margin": "0 15px 5px 0" }
                                      }, [
                                        vue.createElementVNode("view", { class: "infos" }, [
                                          vue.createElementVNode(
                                            "text",
                                            null,
                                            "告警等级: " + vue.toDisplayString(item.alert_grade),
                                            1
                                            /* TEXT */
                                          )
                                        ]),
                                        vue.createElementVNode("view", { class: "infos" }, [
                                          vue.createElementVNode(
                                            "text",
                                            null,
                                            "告警时间: " + vue.toDisplayString(item.alert_time),
                                            1
                                            /* TEXT */
                                          )
                                        ]),
                                        vue.createElementVNode("view", { class: "infos" }, [
                                          vue.createElementVNode(
                                            "text",
                                            null,
                                            "创建用户: " + vue.toDisplayString(item.sender_name),
                                            1
                                            /* TEXT */
                                          )
                                        ]),
                                        vue.createElementVNode("view", { class: "infos" }, [
                                          vue.createElementVNode(
                                            "text",
                                            null,
                                            "告警内容: " + vue.toDisplayString(item.alert_content),
                                            1
                                            /* TEXT */
                                          )
                                        ]),
                                        vue.createElementVNode("view", { style: { "text-align": "right" } }, [
                                          vue.createElementVNode("button", {
                                            class: "mini-btn",
                                            type: "warn",
                                            size: "mini",
                                            style: { "margin-right": "10px" },
                                            onClick: ($event) => $options.delete_alert(index)
                                          }, "删除", 8, ["onClick"]),
                                          vue.createElementVNode("button", {
                                            class: "mini-btn",
                                            type: "default",
                                            size: "mini",
                                            onClick: ($event) => $options.receive_alert(index),
                                            disabled: item.isConfirmed
                                          }, vue.toDisplayString($options.isReceived_alert(index)), 9, ["onClick", "disabled"])
                                        ])
                                      ])
                                    ]),
                                    _: 2
                                    /* DYNAMIC */
                                  }, 1032, ["title"]);
                                }),
                                128
                                /* KEYED_FRAGMENT */
                              ))
                            ]),
                            _: 1
                            /* STABLE */
                          },
                          512
                          /* NEED_PATCH */
                        )
                      ])) : vue.createCommentVNode("v-if", true),
                      $data.navIndex == 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 1,
                        class: "content"
                      }, [
                        vue.createVNode(
                          _component_uni_collapse,
                          {
                            ref: "collapse",
                            accordion: ""
                          },
                          {
                            default: vue.withCtx(() => [
                              (vue.openBlock(true), vue.createElementBlock(
                                vue.Fragment,
                                null,
                                vue.renderList($data.alert_data_mine, (item, index) => {
                                  return vue.openBlock(), vue.createBlock(_component_uni_collapse_item, {
                                    key: index,
                                    title: item.alert_content
                                  }, {
                                    default: vue.withCtx(() => [
                                      vue.createElementVNode("view", {
                                        class: "detail_info",
                                        style: { "margin": "0 15px 5px 0" }
                                      }, [
                                        vue.createElementVNode("view", { class: "infos" }, [
                                          vue.createElementVNode(
                                            "text",
                                            null,
                                            "告警等级: " + vue.toDisplayString(item.alert_grade),
                                            1
                                            /* TEXT */
                                          )
                                        ]),
                                        vue.createElementVNode("view", { class: "infos" }, [
                                          vue.createElementVNode(
                                            "text",
                                            null,
                                            "告警时间: " + vue.toDisplayString(item.alert_time),
                                            1
                                            /* TEXT */
                                          )
                                        ]),
                                        vue.createElementVNode("view", { class: "infos" }, [
                                          vue.createElementVNode(
                                            "text",
                                            null,
                                            "创建用户: " + vue.toDisplayString(item.sender_name),
                                            1
                                            /* TEXT */
                                          )
                                        ]),
                                        vue.createElementVNode("view", { class: "infos" }, [
                                          vue.createElementVNode(
                                            "text",
                                            null,
                                            "告警内容: " + vue.toDisplayString(item.alert_content),
                                            1
                                            /* TEXT */
                                          )
                                        ]),
                                        vue.createElementVNode("view", { style: { "text-align": "right" } }, [
                                          vue.createElementVNode("button", {
                                            class: "mini-btn",
                                            type: "warn",
                                            size: "mini",
                                            style: { "margin-right": "10px" },
                                            onClick: ($event) => $options.delete_alert_mine(index)
                                          }, "删除", 8, ["onClick"])
                                        ])
                                      ])
                                    ]),
                                    _: 2
                                    /* DYNAMIC */
                                  }, 1032, ["title"]);
                                }),
                                128
                                /* KEYED_FRAGMENT */
                              ))
                            ]),
                            _: 1
                            /* STABLE */
                          },
                          512
                          /* NEED_PATCH */
                        ),
                        vue.createElementVNode("view", null, [
                          vue.createElementVNode("button", {
                            type: "primary",
                            onClick: _cache[17] || (_cache[17] = (...args) => $options.open_alert_form && $options.open_alert_form(...args))
                          }, "发布告警")
                        ])
                      ])) : vue.createCommentVNode("v-if", true)
                    ])
                  ])
                ]),
                _: 1
                /* STABLE */
              },
              512
              /* NEED_PATCH */
            )
          ]),
          vue.createCommentVNode(" 发布告警弹窗 "),
          vue.createElementVNode("view", null, [
            vue.createVNode(
              _component_uni_popup,
              {
                ref: "alert_form_popup",
                type: "dialog"
              },
              {
                default: vue.withCtx(() => [
                  vue.createElementVNode("view", {
                    class: "example",
                    style: { "background": "#fff", "border-radius": "5px", "padding": "10px" }
                  }, [
                    vue.createElementVNode("view", { class: "detail_top" }, [
                      vue.createElementVNode("view", null, [
                        vue.createElementVNode("text", null, "发布告警")
                      ]),
                      vue.createElementVNode("view", {
                        style: { "margin-right": "10px" },
                        onClick: _cache[18] || (_cache[18] = (...args) => $options.close_alert_form && $options.close_alert_form(...args))
                      }, [
                        vue.createElementVNode("image", {
                          src: _imports_2,
                          style: { "width": "15px", "height": "15px" }
                        })
                      ])
                    ]),
                    vue.createElementVNode("view", { class: "divider" }),
                    vue.createCommentVNode(" 基础用法，不包含校验规则 "),
                    vue.createVNode(_component_uni_forms, {
                      ref: "alert_form",
                      modelValue: $data.alert_form_data
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_uni_forms_item, {
                          label: "告警等级",
                          style: { "display": "flex", "align-items": "center" }
                        }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_uni_data_checkbox, {
                              modelValue: $data.alert_form_data.alert_grade,
                              "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => $data.alert_form_data.alert_grade = $event),
                              localdata: $data.grades
                            }, null, 8, ["modelValue", "localdata"])
                          ]),
                          _: 1
                          /* STABLE */
                        }),
                        vue.createVNode(_component_uni_forms_item, { label: "告警内容" }, {
                          default: vue.withCtx(() => [
                            vue.createVNode(_component_uni_easyinput, {
                              type: "textarea",
                              modelValue: $data.alert_form_data.alert_content,
                              "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => $data.alert_form_data.alert_content = $event),
                              placeholder: "请输入告警内容"
                            }, null, 8, ["modelValue"])
                          ]),
                          _: 1
                          /* STABLE */
                        })
                      ]),
                      _: 1
                      /* STABLE */
                    }, 8, ["modelValue"]),
                    vue.createElementVNode("button", {
                      type: "primary",
                      onClick: _cache[21] || (_cache[21] = ($event) => $options.submit("alert_form"))
                    }, "提交")
                  ])
                ]),
                _: 1
                /* STABLE */
              },
              512
              /* NEED_PATCH */
            )
          ])
        ])
      ],
      64
      /* STABLE_FRAGMENT */
    );
  }
  if (typeof block0 === "function")
    block0(_sfc_main$x);
  const PagesTaskTaskDetailTaskDetail = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["render", _sfc_render$w], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/task/task_detail/task_detail.vue"]]);
  const _sfc_main$w = {
    name: "UniGridItem",
    inject: ["grid"],
    props: {
      index: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        column: 0,
        showBorder: true,
        square: true,
        highlight: true,
        left: 0,
        top: 0,
        openNum: 2,
        width: 0,
        borderColor: "#e5e5e5"
      };
    },
    created() {
      this.column = this.grid.column;
      this.showBorder = this.grid.showBorder;
      this.square = this.grid.square;
      this.highlight = this.grid.highlight;
      this.top = this.hor === 0 ? this.grid.hor : this.hor;
      this.left = this.ver === 0 ? this.grid.ver : this.ver;
      this.borderColor = this.grid.borderColor;
      this.grid.children.push(this);
      this.width = this.grid.width;
    },
    beforeDestroy() {
      this.grid.children.forEach((item, index) => {
        if (item === this) {
          this.grid.children.splice(index, 1);
        }
      });
    },
    methods: {
      _onClick() {
        this.grid.change({
          detail: {
            index: this.index
          }
        });
      }
    }
  };
  function _sfc_render$v(_ctx, _cache, $props, $setup, $data, $options) {
    return $data.width ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        style: vue.normalizeStyle("width:" + $data.width + ";" + ($data.square ? "height:" + $data.width : "")),
        class: "uni-grid-item"
      },
      [
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass([{ "uni-grid-item--border": $data.showBorder, "uni-grid-item--border-top": $data.showBorder && $props.index < $data.column, "uni-highlight": $data.highlight }, "uni-grid-item__box"]),
            style: vue.normalizeStyle({ "border-right-color": $data.borderColor, "border-bottom-color": $data.borderColor, "border-top-color": $data.borderColor }),
            onClick: _cache[0] || (_cache[0] = (...args) => $options._onClick && $options._onClick(...args))
          },
          [
            vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ],
          6
          /* CLASS, STYLE */
        )
      ],
      4
      /* STYLE */
    )) : vue.createCommentVNode("v-if", true);
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["render", _sfc_render$v], ["__scopeId", "data-v-7a807eb7"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-grid/components/uni-grid-item/uni-grid-item.vue"]]);
  const _sfc_main$v = {
    name: "UniGrid",
    emits: ["change"],
    props: {
      // 每列显示个数
      column: {
        type: Number,
        default: 3
      },
      // 是否显示边框
      showBorder: {
        type: Boolean,
        default: true
      },
      // 边框颜色
      borderColor: {
        type: String,
        default: "#D2D2D2"
      },
      // 是否正方形显示,默认为 true
      square: {
        type: Boolean,
        default: true
      },
      highlight: {
        type: Boolean,
        default: true
      }
    },
    provide() {
      return {
        grid: this
      };
    },
    data() {
      const elId = `Uni_${Math.ceil(Math.random() * 1e6).toString(36)}`;
      return {
        elId,
        width: 0
      };
    },
    created() {
      this.children = [];
    },
    mounted() {
      this.$nextTick(() => {
        this.init();
      });
    },
    methods: {
      init() {
        setTimeout(() => {
          this._getSize((width) => {
            this.children.forEach((item, index) => {
              item.width = width;
            });
          });
        }, 50);
      },
      change(e2) {
        this.$emit("change", e2);
      },
      _getSize(fn) {
        uni.createSelectorQuery().in(this).select(`#${this.elId}`).boundingClientRect().exec((ret) => {
          this.width = parseInt((ret[0].width - 1) / this.column) + "px";
          fn(this.width);
        });
      }
    }
  };
  function _sfc_render$u(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-grid-wrap" }, [
      vue.createElementVNode("view", {
        id: $data.elId,
        ref: "uni-grid",
        class: vue.normalizeClass(["uni-grid", { "uni-grid--border": $props.showBorder }]),
        style: vue.normalizeStyle({ "border-left-color": $props.borderColor })
      }, [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ], 14, ["id"])
    ]);
  }
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", _sfc_render$u], ["__scopeId", "data-v-07acefee"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-grid/components/uni-grid/uni-grid.vue"]]);
  const _sfc_main$u = {
    name: "UniSection",
    emits: ["click"],
    props: {
      type: {
        type: String,
        default: ""
      },
      title: {
        type: String,
        required: true,
        default: ""
      },
      titleFontSize: {
        type: String,
        default: "14px"
      },
      titleColor: {
        type: String,
        default: "#333"
      },
      subTitle: {
        type: String,
        default: ""
      },
      subTitleFontSize: {
        type: String,
        default: "12px"
      },
      subTitleColor: {
        type: String,
        default: "#999"
      },
      padding: {
        type: [Boolean, String],
        default: false
      }
    },
    computed: {
      _padding() {
        if (typeof this.padding === "string") {
          return this.padding;
        }
        return this.padding ? "10px" : "";
      }
    },
    watch: {
      title(newVal) {
        if (uni.report && newVal !== "") {
          uni.report("title", newVal);
        }
      }
    },
    methods: {
      onClick() {
        this.$emit("click");
      }
    }
  };
  function _sfc_render$t(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-section" }, [
      vue.createElementVNode("view", {
        class: "uni-section-header",
        onClick: _cache[0] || (_cache[0] = (...args) => $options.onClick && $options.onClick(...args))
      }, [
        $props.type ? (vue.openBlock(), vue.createElementBlock(
          "view",
          {
            key: 0,
            class: vue.normalizeClass(["uni-section-header__decoration", $props.type])
          },
          null,
          2
          /* CLASS */
        )) : vue.renderSlot(_ctx.$slots, "decoration", { key: 1 }, void 0, true),
        vue.createElementVNode("view", { class: "uni-section-header__content" }, [
          vue.createElementVNode(
            "text",
            {
              style: vue.normalizeStyle({ "font-size": $props.titleFontSize, "color": $props.titleColor }),
              class: vue.normalizeClass(["uni-section__content-title", { "distraction": !$props.subTitle }])
            },
            vue.toDisplayString($props.title),
            7
            /* TEXT, CLASS, STYLE */
          ),
          $props.subTitle ? (vue.openBlock(), vue.createElementBlock(
            "text",
            {
              key: 0,
              style: vue.normalizeStyle({ "font-size": $props.subTitleFontSize, "color": $props.subTitleColor }),
              class: "uni-section-header__content-sub"
            },
            vue.toDisplayString($props.subTitle),
            5
            /* TEXT, STYLE */
          )) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "uni-section-header__slot-right" }, [
          vue.renderSlot(_ctx.$slots, "right", {}, void 0, true)
        ])
      ]),
      vue.createElementVNode(
        "view",
        {
          class: "uni-section-content",
          style: vue.normalizeStyle({ padding: $options._padding })
        },
        [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const __easycom_2 = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$t], ["__scopeId", "data-v-637fd36b"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-section/components/uni-section/uni-section.vue"]]);
  const _sfc_main$t = {
    props: {
      urls: {
        type: Array,
        required: true,
        default: () => {
          return [];
        }
      }
    },
    data() {
      return {
        show: false,
        current: 0,
        //当前页
        scale: 1,
        isZooming: false
        // 是否处于缩放状态
      };
    },
    methods: {
      getFileName(url) {
        const fileName = url.split("/").pop();
        const nameWithoutExtension = fileName.includes(".") ? fileName.substring(0, fileName.lastIndexOf(".")) : fileName;
        return nameWithoutExtension;
      },
      //打开
      open(current) {
        this.current = this.urls.findIndex((item) => item === current);
        this.show = true;
        this.$emit("open");
      },
      //关闭
      close() {
        if (!this.isZooming) {
          this.show = false;
          this.current = 0;
          this.$emit("close");
        }
      },
      //图片改变
      swiperChange(e2) {
        this.current = e2.detail.current;
      },
      //监听长按
      onLongpress(e2) {
        this.$emit("onLongpress", e2);
      },
      handleTouchStart() {
        this.isZooming = true;
      },
      handleTouchEnd() {
        this.isZooming = false;
      }
    }
  };
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    return $data.show ? (vue.openBlock(), vue.createElementBlock("view", {
      key: 0,
      class: "previewImage",
      onClick: _cache[3] || (_cache[3] = (...args) => $options.close && $options.close(...args))
    }, [
      $props.urls.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "page"
      }, [
        vue.createElementVNode("view", null, [
          vue.createElementVNode(
            "text",
            { class: "text" },
            vue.toDisplayString($data.current + 1) + " / " + vue.toDisplayString($props.urls.length),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", null, [
          vue.createElementVNode(
            "text",
            { class: "text" },
            vue.toDisplayString($options.getFileName($props.urls[$data.current])),
            1
            /* TEXT */
          )
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("swiper", {
        class: "swiper",
        current: $data.current,
        onChange: _cache[0] || (_cache[0] = (...args) => $options.swiperChange && $options.swiperChange(...args)),
        onTouchstart: _cache[1] || (_cache[1] = (...args) => $options.handleTouchStart && $options.handleTouchStart(...args)),
        onTouchend: _cache[2] || (_cache[2] = (...args) => $options.handleTouchEnd && $options.handleTouchEnd(...args))
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($props.urls, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("swiper-item", { key: index }, [
              vue.createElementVNode("movable-area", {
                class: "movable-area",
                "scale-area": ""
              }, [
                vue.createElementVNode("movable-view", {
                  class: "movable-view",
                  direction: "all",
                  inertia: true,
                  damping: "100",
                  scale: "true",
                  "scale-min": "1",
                  "scale-max": "4",
                  "scale-value": $data.scale
                }, [
                  vue.createElementVNode("scroll-view", {
                    "scroll-y": "true",
                    class: "uni-scroll-view"
                  }, [
                    vue.createElementVNode("view", { class: "scroll-view" }, [
                      (vue.openBlock(), vue.createElementBlock("image", {
                        key: index,
                        class: "image",
                        src: item,
                        mode: "widthFix",
                        onLongpress: ($event) => $options.onLongpress(item)
                      }, null, 40, ["src", "onLongpress"]))
                    ])
                  ])
                ], 8, ["scale-value"])
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ], 40, ["current"])
    ])) : vue.createCommentVNode("v-if", true);
  }
  const __easycom_3 = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$s], ["__scopeId", "data-v-fdd21252"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/q-previewImage/components/q-previewImage/q-previewImage.vue"]]);
  const _sfc_main$s = {
    name: "ysh-file-manager",
    props: {},
    data() {
      return {};
    },
    methods: {
      _openFile() {
        this.qxcz();
      },
      qxcz() {
        plus.android.requestPermissions(["android.permission.READ_EXTERNAL_STORAGE"], (e2) => {
          if (e2.deniedAlways.length > 0) {
            uni.showToast({
              title: "您拒绝了存储权限，请去设置-应用开启存储权限！",
              icon: "none",
              duration: 2e3
            });
          }
          if (e2.deniedPresent.length > 0) {
            plus.android.requestPermissions(["android.permission.READ_EXTERNAL_STORAGE"]);
          }
          if (e2.granted.length > 0) {
            this._openFileTemp();
          }
        }, function(e2) {
          formatAppLog("log", "at components/ysh-file-manager/ysh-file-manager.vue:41", "R12133313221" + JSON.stringify(e2));
        });
      },
      _openFileTemp() {
        let CODE_REQUEST = 1e3;
        if (plus.os.name.toLowerCase() != "android") {
          uni.showModal({
            title: "提示",
            content: "仅支持Android平台！",
            success: function(res) {
            }
          });
          return false;
        }
        let that = this;
        let main2 = plus.android.runtimeMainActivity();
        let Intent = plus.android.importClass("android.content.Intent");
        let fileIntent = new Intent(Intent.ACTION_GET_CONTENT);
        fileIntent.setType("*/*");
        fileIntent.addCategory(Intent.CATEGORY_OPENABLE);
        main2.onActivityResult = function(requestCode, resultCode, data) {
          let Activity = plus.android.importClass("android.app.Activity");
          let ContentUris = plus.android.importClass("android.content.ContentUris");
          plus.android.importClass("android.database.Cursor");
          let Uri = plus.android.importClass("android.net.Uri");
          let Build = plus.android.importClass("android.os.Build");
          let Environment = plus.android.importClass("android.os.Environment");
          let DocumentsContract = plus.android.importClass("android.provider.DocumentsContract");
          let MediaStore = plus.android.importClass("android.provider.MediaStore");
          let contentResolver = main2.getContentResolver();
          plus.android.importClass(contentResolver);
          let path = "";
          let size = "";
          if (resultCode == Activity.RESULT_OK) {
            let uri = data.getData();
            if ("file" == uri.getScheme().toLowerCase()) {
              path = uri.getPath();
            } else {
              if (Build.VERSION.SDK_INT > Build.VERSION_CODES.KITKAT) {
                path = getPath(this, uri);
                let FileInputStream = plus.android.importClass("java.io.FileInputStream");
                let fileSize = new FileInputStream(path);
                size = fileSize.available();
                if (size == 0)
                  ;
                else if (size < 1024)
                  ;
                else if (size < 1048576) {
                  (size / 1024).toFixed(2) + "KB";
                } else if (size < 1073741824) {
                  (size / 1048576).toFixed(2) + "MB";
                } else {
                  (size / 1073741824).toFixed(2) + "GB";
                }
              } else {
                path = getRealPathFromURI(uri);
              }
            }
            that.$emit("result", {
              path,
              size
            });
          }
          function getPath(context, uri) {
            let isKitKat = Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT;
            let scheme = uri.getScheme().toLowerCase();
            if (isKitKat && DocumentsContract.isDocumentUri(context, uri)) {
              if (isExternalStorageDocument(uri)) {
                let docId = DocumentsContract.getDocumentId(uri);
                let split = docId.split(":");
                let type = split[0];
                if ("primary" == type.toLowerCase()) {
                  return Environment.getExternalStorageDirectory() + "/" + split[1];
                } else {
                  return "/storage/" + type + "/" + split[1];
                }
              } else if (isDownloadsDocument(uri)) {
                let id = DocumentsContract.getDocumentId(uri);
                if (id.indexOf(":") != -1) {
                  let split = id.split(":");
                  return split[1];
                } else {
                  let contentUri = ContentUris.withAppendedId(Uri.parse("content://downloads/public_downloads"), id);
                  return getDataColumn(context, contentUri, null, null);
                }
              } else if (isMediaDocument(uri)) {
                let docId = DocumentsContract.getDocumentId(uri);
                let split = docId.split(":");
                let type = split[0];
                let contentUri = null;
                if ("image" == type.toLowerCase()) {
                  contentUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI;
                } else if ("video" == type.toLowerCase()) {
                  contentUri = MediaStore.Video.Media.EXTERNAL_CONTENT_URI;
                } else if ("audio" == type.toLowerCase()) {
                  contentUri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI;
                } else if ("document" == type.toLowerCase()) {
                  contentUri = MediaStore.Files.getContentUri("external");
                }
                let selection = "_id=?";
                let selectionArgs = [split[1]];
                return getDataColumn(context, contentUri, selection, selectionArgs);
              }
            } else if ("content" == scheme) {
              return getDataColumn(context, uri, null, null);
            } else if ("file" == scheme) {
              return uri.getPath();
            }
          }
          function getRealPathFromURI(uri) {
            let res = null;
            let proj = [MediaStore.Images.Media.DATA];
            let cursor = contentResolver.query(uri, proj, null, null, null);
            if (null != cursor && cursor.moveToFirst()) {
              let column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
              res = cursor.getString(column_index);
              cursor.close();
            }
            return res;
          }
          function getDataColumn(context, uri, selection, selectionArgs) {
            let cursor = null;
            let column = "_data";
            let projection = [column];
            cursor = contentResolver.query(uri, projection, selection, selectionArgs, null);
            if (cursor != null && cursor.moveToFirst()) {
              let column_index = cursor.getColumnIndexOrThrow(column);
              return cursor.getString(column_index);
            } else {
              return "";
            }
          }
          function isExternalStorageDocument(uri) {
            return "com.android.externalstorage.documents" == uri.getAuthority() ? true : false;
          }
          function isDownloadsDocument(uri) {
            return "com.android.providers.downloads.documents" == uri.getAuthority() ? true : false;
          }
          function isMediaDocument(uri) {
            return "com.android.providers.media.documents" == uri.getAuthority() ? true : false;
          }
        };
        main2.startActivityForResult(fileIntent, CODE_REQUEST);
      }
    }
  };
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view");
  }
  const __easycom_5 = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$r], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/components/ysh-file-manager/ysh-file-manager.vue"]]);
  let platform = "other";
  const _sfc_main$r = {
    name: "UniFab",
    emits: ["fabClick", "trigger"],
    props: {
      pattern: {
        type: Object,
        default() {
          return {};
        }
      },
      horizontal: {
        type: String,
        default: "left"
      },
      vertical: {
        type: String,
        default: "bottom"
      },
      direction: {
        type: String,
        default: "horizontal"
      },
      content: {
        type: Array,
        default() {
          return [];
        }
      },
      show: {
        type: Boolean,
        default: false
      },
      popMenu: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        fabShow: false,
        isShow: false,
        isAndroidNvue: platform === "android",
        styles: {
          color: "#3c3e49",
          selectedColor: "#007AFF",
          backgroundColor: "#fff",
          buttonColor: "#007AFF",
          iconColor: "#fff",
          icon: "plusempty"
        }
      };
    },
    computed: {
      contentWidth(e2) {
        return (this.content.length + 1) * 55 + 15 + "px";
      },
      contentWidthMin() {
        return "55px";
      },
      // 动态计算宽度
      boxWidth() {
        return this.getPosition(3, "horizontal");
      },
      // 动态计算高度
      boxHeight() {
        return this.getPosition(3, "vertical");
      },
      // 计算左下位置
      leftBottom() {
        return this.getPosition(0, "left", "bottom");
      },
      // 计算右下位置
      rightBottom() {
        return this.getPosition(0, "right", "bottom");
      },
      // 计算左上位置
      leftTop() {
        return this.getPosition(0, "left", "top");
      },
      rightTop() {
        return this.getPosition(0, "right", "top");
      },
      flexDirectionStart() {
        return this.getPosition(1, "vertical", "top");
      },
      flexDirectionEnd() {
        return this.getPosition(1, "vertical", "bottom");
      },
      horizontalLeft() {
        return this.getPosition(2, "horizontal", "left");
      },
      horizontalRight() {
        return this.getPosition(2, "horizontal", "right");
      },
      // 计算 nvue bottom
      nvueBottom() {
        uni.getSystemInfoSync().windowBottom;
        return 30;
      }
    },
    watch: {
      pattern: {
        handler(val, oldVal) {
          this.styles = Object.assign({}, this.styles, val);
        },
        deep: true
      }
    },
    created() {
      this.isShow = this.show;
      if (this.top === 0) {
        this.fabShow = true;
      }
      this.styles = Object.assign({}, this.styles, this.pattern);
    },
    methods: {
      _onClick() {
        this.$emit("fabClick");
        if (!this.popMenu) {
          return;
        }
        this.isShow = !this.isShow;
      },
      open() {
        this.isShow = true;
      },
      close() {
        this.isShow = false;
      },
      /**
       * 按钮点击事件
       */
      _onItemClick(index, item) {
        if (!this.isShow) {
          return;
        }
        this.$emit("trigger", {
          index,
          item
        });
      },
      /**
       * 获取 位置信息
       */
      getPosition(types2, paramA, paramB) {
        if (types2 === 0) {
          return this.horizontal === paramA && this.vertical === paramB;
        } else if (types2 === 1) {
          return this.direction === paramA && this.vertical === paramB;
        } else if (types2 === 2) {
          return this.direction === paramA && this.horizontal === paramB;
        } else {
          return this.isShow && this.direction === paramA ? this.contentWidth : this.contentWidthMin;
        }
      }
    }
  };
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$5);
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-cursor-point" }, [
      $props.popMenu && ($options.leftBottom || $options.rightBottom || $options.leftTop || $options.rightTop) && $props.content.length > 0 ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          class: vue.normalizeClass([{
            "uni-fab--leftBottom": $options.leftBottom,
            "uni-fab--rightBottom": $options.rightBottom,
            "uni-fab--leftTop": $options.leftTop,
            "uni-fab--rightTop": $options.rightTop
          }, "uni-fab"]),
          style: vue.normalizeStyle($options.nvueBottom)
        },
        [
          vue.createElementVNode(
            "view",
            {
              class: vue.normalizeClass([{
                "uni-fab__content--left": $props.horizontal === "left",
                "uni-fab__content--right": $props.horizontal === "right",
                "uni-fab__content--flexDirection": $props.direction === "vertical",
                "uni-fab__content--flexDirectionStart": $options.flexDirectionStart,
                "uni-fab__content--flexDirectionEnd": $options.flexDirectionEnd,
                "uni-fab__content--other-platform": !$data.isAndroidNvue
              }, "uni-fab__content"]),
              style: vue.normalizeStyle({ width: $options.boxWidth, height: $options.boxHeight, backgroundColor: $data.styles.backgroundColor }),
              elevation: "5"
            },
            [
              $options.flexDirectionStart || $options.horizontalLeft ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "uni-fab__item uni-fab__item--first"
              })) : vue.createCommentVNode("v-if", true),
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($props.content, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: vue.normalizeClass([{ "uni-fab__item--active": $data.isShow }, "uni-fab__item"]),
                    onClick: ($event) => $options._onItemClick(index, item)
                  }, [
                    vue.createElementVNode("image", {
                      src: item.active ? item.selectedIconPath : item.iconPath,
                      class: "uni-fab__item-image",
                      mode: "aspectFit"
                    }, null, 8, ["src"]),
                    vue.createElementVNode(
                      "text",
                      {
                        class: "uni-fab__item-text",
                        style: vue.normalizeStyle({ color: item.active ? $data.styles.selectedColor : $data.styles.color })
                      },
                      vue.toDisplayString(item.text),
                      5
                      /* TEXT, STYLE */
                    )
                  ], 10, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              )),
              $options.flexDirectionEnd || $options.horizontalRight ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "uni-fab__item uni-fab__item--first"
              })) : vue.createCommentVNode("v-if", true)
            ],
            6
            /* CLASS, STYLE */
          )
        ],
        6
        /* CLASS, STYLE */
      )) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass([{
            "uni-fab__circle--leftBottom": $options.leftBottom,
            "uni-fab__circle--rightBottom": $options.rightBottom,
            "uni-fab__circle--leftTop": $options.leftTop,
            "uni-fab__circle--rightTop": $options.rightTop,
            "uni-fab__content--other-platform": !$data.isAndroidNvue
          }, "uni-fab__circle uni-fab__plus"]),
          style: vue.normalizeStyle({ "background-color": $data.styles.buttonColor, "bottom": $options.nvueBottom }),
          onClick: _cache[0] || (_cache[0] = (...args) => $options._onClick && $options._onClick(...args))
        },
        [
          vue.createVNode(_component_uni_icons, {
            class: vue.normalizeClass(["fab-circle-icon", { "uni-fab__plus--active": $data.isShow && $props.content.length > 0 }]),
            type: $data.styles.icon,
            color: $data.styles.iconColor,
            size: "32"
          }, null, 8, ["type", "color", "class"]),
          vue.createCommentVNode(` <view class="fab-circle-v"  :class="{'uni-fab__plus--active': isShow && content.length > 0}"></view>\r
			<view class="fab-circle-h" :class="{'uni-fab__plus--active': isShow  && content.length > 0}"></view> `)
        ],
        6
        /* CLASS, STYLE */
      )
    ]);
  }
  const __easycom_6 = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$q], ["__scopeId", "data-v-85f34dfc"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-fab/components/uni-fab/uni-fab.vue"]]);
  const _sfc_main$q = {
    data() {
      return {
        context: null,
        currentTime: 0,
        duration: 100,
        status: false
      };
    },
    props: {
      url: String,
      activeColor: {
        type: String,
        default: "#0E7EFC"
      },
      startPic: String,
      endPic: String,
      audioId: [String, Number]
    },
    created() {
      this.context = uni.createInnerAudioContext();
      this.context.src = this.url;
      this.onTimeUpdate();
      this.onCanplay();
      this.onEnded();
      uni.$on("stop", (id) => {
        if (id && id != this.audioId) {
          this.context.stop();
          this.status = false;
        } else if (!id) {
          this.context.stop();
          this.status = false;
        }
      });
    },
    methods: {
      start(id) {
        if (this.status) {
          this.context.pause();
          this.status = !this.status;
        } else {
          uni.$emit("stop", id);
          this.context.play();
          this.status = !this.status;
        }
      },
      onCanplay() {
        this.context.onCanplay(() => {
          this.context.duration;
          setTimeout(() => {
            this.duration = this.context.duration;
          }, 1e3);
        });
      },
      onTimeUpdate() {
        this.context.onTimeUpdate(() => {
          if (!Number.isFinite(this.context.duration)) {
            this.duration = this.context.currentTime + 10;
            this.currentTime = this.context.currentTime;
          } else {
            this.duration = this.context.duration;
            this.currentTime = this.context.currentTime;
          }
        });
      },
      onEnded() {
        this.context.onEnded(() => {
          this.status = false;
          this.currentTime = 0;
        });
      },
      changeAudio(e2) {
        let paused = this.context.paused;
        this.context.pause();
        this.context.seek(e2.detail.value);
        if (!paused) {
          this.context.play();
        }
      },
      getTime(time) {
        let m2 = parseInt(time / 60);
        let s2 = time % 60;
        return this.towNum(m2) + ":" + this.towNum(s2);
      },
      towNum(num) {
        if (num >= 10) {
          return num;
        } else {
          return "0" + num;
        }
      }
    }
  };
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(" 音频播放器组件 "),
        $props.url ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "flex justify-between align-center audio"
        }, [
          vue.createElementVNode("view", {
            class: "mr-3",
            onClick: _cache[0] || (_cache[0] = ($event) => $options.start($props.audioId))
          }, [
            vue.withDirectives(vue.createElementVNode("image", {
              src: $props.startPic,
              class: "icon"
            }, null, 8, ["src"]), [
              [vue.vShow, !$data.status]
            ]),
            vue.withDirectives(vue.createElementVNode("image", {
              src: $props.endPic,
              class: "icon"
            }, null, 8, ["src"]), [
              [vue.vShow, $data.status]
            ])
          ]),
          vue.createElementVNode("view", { class: "flex-1" }, [
            vue.createElementVNode("slider", {
              onChange: _cache[1] || (_cache[1] = (...args) => $options.changeAudio && $options.changeAudio(...args)),
              activeColor: $props.activeColor,
              min: 0,
              max: $data.duration.toFixed(0),
              value: $data.currentTime.toFixed(0),
              step: 0.1
            }, null, 40, ["activeColor", "max", "value"])
          ]),
          vue.createElementVNode(
            "view",
            { class: "ml-3" },
            vue.toDisplayString($options.getTime(Math.round($data.currentTime))),
            1
            /* TEXT */
          )
        ])) : vue.createCommentVNode("v-if", true)
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    );
  }
  const freeAudio = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$p], ["__scopeId", "data-v-615c0603"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/components/chengpeng-audio/free-audio.vue"]]);
  const _imports_0$6 = "/static/icon/take_video.png";
  const _imports_1$1 = "/static/icon/audio.png";
  const _sfc_main$p = {
    components: { freeAudio, yshFileManager: __easycom_5 },
    data() {
      return {
        missionId: "",
        fileInfo: [],
        pattern: {
          color: "#7A7E83",
          backgroundColor: "#fff",
          selectedColor: "#007AFF",
          buttonColor: "#007AFF",
          iconColor: "#fff"
        },
        horizontal: "right",
        vertical: "bottom",
        direction: "horizontal",
        isFullScreen: false,
        videoPlay: false,
        videoUrl: "",
        audioUrl: "",
        imgPath: [
          "../../../../static/images/taiwan_map.jpg",
          "../../../../static/images/taiwan_map.jpg",
          "../../../../static/images/taiwan_map.jpg",
          "../../../../static/images/taiwan_map.jpg",
          "../../../../static/images/taiwan_map.jpg",
          "../../../../static/images/taiwan_map.jpg",
          "../../../../static/images/taiwan_map.jpg",
          "../../../../static/images/taiwan_map.jpg",
          "../../../../static/images/taiwan_map.jpg",
          "../../../../static/images/taiwan_map.jpg",
          "../../../../static/images/taiwan_map.jpg"
        ],
        videoPath: [
          "../../../../static/videos/VID20241104093724.mp4",
          "../../../../static/videos/VID20241104093724.mp4",
          "../../../../static/videos/VID20241104093724.mp4",
          "../../../../static/videos/VID20241104093724.mp4",
          "../../../../static/videos/VID20241104093724.mp4",
          "../../../../static/videos/VID20241104093724.mp4",
          "../../../../static/videos/VID20241104093724.mp4",
          "../../../../static/videos/VID20241104093724.mp4",
          "../../../../static/videos/VID20241104093724.mp4",
          "../../../../static/videos/VID20241104093724.mp4",
          "../../../../static/videos/VID20241104093724.mp4"
        ],
        audioPath: [
          "../../../../static/file_source/许嵩 - 玫瑰花的葬礼 [mqms2].mp3",
          "../../../../static/file_source/林俊杰 - 修炼爱情 [mqms2].ogg",
          "../../../../static/file_source/刘至佳&韩瞳 - 时光背面的我 [mqms2].mp3",
          "../../../../static/file_source/周杰伦 - 半岛铁盒 [mqms2].mgg1.flac",
          "../../../../static/file_source/周杰伦 - 稻香 [mqms2].qmc0.flac"
        ],
        content: [
          {
            iconPath: "../../../../static/icon/图片-选中.png",
            selectedIconPath: "../../../../static/icon/图片-选中.png",
            text: "上传图片",
            active: false
          },
          {
            iconPath: "../../../../static/icon/video.png",
            selectedIconPath: "../../../../static/icon/video.png",
            text: "上传视频",
            active: false
          },
          {
            iconPath: "../../../../static/icon/document_select.png",
            selectedIconPath: "../../../../static/icon/document_select.png",
            text: "其他文件",
            active: false
          }
        ],
        video_src: "",
        image_src: [],
        FileTypes: [
          { type: "图片", iconName: "image" },
          { type: "视频", iconName: "camera" },
          { type: "音频", iconName: "mic" }
        ],
        videoContext: uni.createVideoContext("myVideo", this)
        // 这个是实例对象
      };
    },
    mounted() {
      this.initializeDocuments();
    },
    onLoad(options) {
    },
    methods: {
      initializeDocuments() {
        uni.showLoading({
          title: "正在加载文件",
          mask: true
        });
        getMissionFileById(this.missionId).then((res) => {
          this.fileInfo = res.data.missionFiles.records;
          formatAppLog("log", "at pages/task/task_detail/document/document.vue:165", this.fileInfo);
          uni.hideLoading();
        });
      },
      uploadFile() {
        this.$refs.filemanager._openFile();
      },
      getFileName(url) {
        const fileName = url.split("/").pop();
        const nameWithoutExtension = fileName.includes(".") ? fileName.substring(0, fileName.lastIndexOf(".")) : fileName;
        return nameWithoutExtension;
      },
      preview(url) {
        this.$refs.previewImage.open(url);
      },
      screenChange(e2) {
        this.isFullScreen = e2.detail.fullScreen;
        if (!this.isFullScreen) {
          this.videoPlay = false;
          this.videoContext.stop();
        }
      },
      // 触发全屏播放的点击事件
      async videoShow(item) {
        this.videoPlay = true;
        this.videoUrl = item;
        this.videoContext.requestFullScreen({ direction: 0 });
        this.videoContext.play();
      },
      openVideo() {
        this.videoPlay = true;
      },
      openAudioPopup(index) {
        this.$refs.audioPopup.open();
        this.audioUrl = this.audioPath[index];
      },
      clickMask() {
        this.$refs.audioPopup.close();
        uni.$emit("stop");
      },
      trigger(e2) {
        if (e2.item.text === "上传图片") {
          this.uploadImage();
        } else if (e2.item.text === "上传视频") {
          this.uploadVideo();
        } else if (e2.item.text === "其他文件") {
          this.uploadFile();
          formatAppLog("log", "at pages/task/task_detail/document/document.vue:222", resultPath());
        }
      },
      resultPath() {
        return event.composedPath();
      },
      uploadVideo: function() {
        uni.chooseVideo({
          sourceType: ["camera", "album"],
          success: function(res) {
            const tempFilePath = res.tempFilePath;
            uni.uploadFile({
              url: `http://139.196.11.210:8500/communicate/minio/upload`,
              filePath: tempFilePath,
              name: "files",
              formData: {
                "isGroup": false,
                "missionId": "d56f22fe8f3c40bdba6c0ad609e2f3e6",
                "receptionId": "f7c6e52d7aae493db0b9593202885062"
              },
              header: {
                "Content-Type": "multipart/form-data;",
                "Authorization": "Bearer " + uni.getStorageSync("token")
              },
              success: (uploadFileRes) => {
                const res2 = JSON.parse(uploadFileRes.data);
                if (res2.code === 200) {
                  uni.showToast({
                    title: "视频上传成功！",
                    //将值设置为 success 或者直接不用写icon这个参数
                    icon: "success",
                    //显示持续时间为 2秒
                    duration: 2e3
                  });
                } else {
                  uni.showToast({
                    title: "视频上传失败！",
                    icon: "none",
                    //显示持续时间为 2秒
                    duration: 2e3
                  });
                }
                formatAppLog("log", "at pages/task/task_detail/document/document.vue:265", uploadFileRes.data);
              }
            });
          }
        });
      },
      uploadImage: function() {
        uni.chooseImage({
          count: 6,
          //默认9
          sizeType: ["original", "compressed"],
          //可以指定是原图还是压缩图，默认二者都有
          sourceType: ["album", "camera"],
          success: function(res) {
            let ok = 0;
            let index = 0;
            const length = res.tempFilePaths.length;
            for (const tempFilePath of res.tempFilePaths) {
              uni.uploadFile({
                url: `http://139.196.11.210:8500/communicate/minio/upload`,
                filePath: tempFilePath,
                name: "files",
                formData: {
                  "isGroup": false,
                  "missionId": "d56f22fe8f3c40bdba6c0ad609e2f3e6",
                  "receptionId": "f7c6e52d7aae493db0b9593202885062"
                },
                header: {
                  "Content-Type": "multipart/form-data;",
                  "Authorization": "Bearer " + uni.getStorageSync("token")
                },
                success: (uploadFileRes) => {
                  const res2 = JSON.parse(uploadFileRes.data);
                  index = index + 1;
                  if (res2.code === 200) {
                    ok = ok + 1;
                  }
                  if (ok === length) {
                    uni.showToast({
                      title: "上传成功！",
                      icon: "success",
                      duration: 2e3
                    });
                  }
                  if (index === length && ok < length) {
                    const fail = length - ok;
                    uni.showToast({
                      title: fail + "张上传失败！",
                      icon: "none",
                      duration: 2e3
                    });
                  }
                }
              });
            }
          }
        });
      }
    }
  };
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_grid_item = resolveEasycom(vue.resolveDynamicComponent("uni-grid-item"), __easycom_0);
    const _component_uni_grid = resolveEasycom(vue.resolveDynamicComponent("uni-grid"), __easycom_1);
    const _component_uni_section = resolveEasycom(vue.resolveDynamicComponent("uni-section"), __easycom_2);
    const _component_q_previewImage = resolveEasycom(vue.resolveDynamicComponent("q-previewImage"), __easycom_3);
    const _component_free_audio = vue.resolveComponent("free-audio");
    const _component_uni_popup = resolveEasycom(vue.resolveDynamicComponent("uni-popup"), __easycom_4$1);
    const _component_ysh_file_manager = resolveEasycom(vue.resolveDynamicComponent("ysh-file-manager"), __easycom_5);
    const _component_uni_fab = resolveEasycom(vue.resolveDynamicComponent("uni-fab"), __easycom_6);
    return vue.openBlock(), vue.createElementBlock("view", { style: { "background": "#fff" } }, [
      vue.createElementVNode("view", { style: { "padding": "0 0 10px 7px", "box-sizing": "border-box" } }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.FileTypes, (file, file_index) => {
            return vue.openBlock(), vue.createBlock(_component_uni_section, {
              key: file_index,
              title: file.type,
              type: "line"
            }, {
              default: vue.withCtx(() => [
                vue.createVNode(
                  _component_uni_grid,
                  {
                    column: 4,
                    "show-border": false
                  },
                  {
                    default: vue.withCtx(() => [
                      vue.createCommentVNode(" 图片 "),
                      file_index === 0 ? (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        { key: 0 },
                        vue.renderList($data.imgPath, (item, index) => {
                          return vue.openBlock(), vue.createBlock(
                            _component_uni_grid_item,
                            { key: index },
                            {
                              default: vue.withCtx(() => [
                                vue.createElementVNode("view", { style: { "border-radius": "3px", "width": "83px", "height": "83px", "display": "flex", "align-items": "center", "justify-content": "center" } }, [
                                  vue.createElementVNode("image", {
                                    src: item,
                                    onClick: ($event) => $options.preview(item),
                                    style: { "width": "83px", "height": "83px" }
                                  }, null, 8, ["src", "onClick"])
                                ])
                              ]),
                              _: 2
                              /* DYNAMIC */
                            },
                            1024
                            /* DYNAMIC_SLOTS */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      )) : vue.createCommentVNode("v-if", true),
                      vue.createCommentVNode(" 视频 "),
                      file_index === 1 ? (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        { key: 1 },
                        vue.renderList($data.videoPath, (item, index) => {
                          return vue.openBlock(), vue.createBlock(
                            _component_uni_grid_item,
                            { key: index },
                            {
                              default: vue.withCtx(() => [
                                vue.createElementVNode("view", { style: { "background-color": "black", "border-radius": "3px", "width": "83px", "height": "83px", "display": "flex", "align-items": "center", "justify-content": "center" } }, [
                                  vue.createElementVNode("image", {
                                    onTouchstart: _cache[0] || (_cache[0] = ($event) => $options.openVideo()),
                                    onClick: ($event) => $options.videoShow(item),
                                    src: _imports_0$6,
                                    style: { "width": "50px", "height": "50px" }
                                  }, null, 40, ["onClick"])
                                ])
                              ]),
                              _: 2
                              /* DYNAMIC */
                            },
                            1024
                            /* DYNAMIC_SLOTS */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      )) : vue.createCommentVNode("v-if", true),
                      file_index === 2 ? (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        { key: 2 },
                        vue.renderList($data.audioPath, (item, index) => {
                          return vue.openBlock(), vue.createBlock(
                            _component_uni_grid_item,
                            { key: index },
                            {
                              default: vue.withCtx(() => [
                                vue.createElementVNode("view", { style: { "background-color": "lightgrey", "border-radius": "3px", "width": "83px", "height": "83px", "display": "flex", "align-items": "center", "justify-content": "center" } }, [
                                  vue.createElementVNode("image", {
                                    onClick: ($event) => $options.openAudioPopup(index),
                                    src: _imports_1$1,
                                    style: { "width": "35px", "height": "35px" }
                                  }, null, 8, ["onClick"])
                                ])
                              ]),
                              _: 2
                              /* DYNAMIC */
                            },
                            1024
                            /* DYNAMIC_SLOTS */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      )) : vue.createCommentVNode("v-if", true)
                    ]),
                    _: 2
                    /* DYNAMIC */
                  },
                  1024
                  /* DYNAMIC_SLOTS */
                )
              ]),
              _: 2
              /* DYNAMIC */
            }, 1032, ["title"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        vue.createCommentVNode(" 图片预览组件 "),
        vue.createVNode(_component_q_previewImage, {
          ref: "previewImage",
          urls: $data.imgPath,
          onOnLongpress: _cache[1] || (_cache[1] = () => {
          }),
          onOpen: _cache[2] || (_cache[2] = () => {
          }),
          onClose: _cache[3] || (_cache[3] = () => {
          })
        }, null, 8, ["urls"]),
        vue.createCommentVNode(" 视频预览界面 "),
        $data.videoPlay ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
          vue.createElementVNode("video", {
            id: "myVideo",
            src: $data.videoUrl,
            onFullscreenchange: _cache[4] || (_cache[4] = (...args) => $options.screenChange && $options.screenChange(...args)),
            style: { "height": "1px", "width": "1px" },
            controls: "",
            autoplay: ""
          }, null, 40, ["src"])
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createCommentVNode(" 音频预览弹窗 "),
      vue.createVNode(
        _component_uni_popup,
        {
          ref: "audioPopup",
          type: "bottom",
          onMaskClick: _cache[6] || (_cache[6] = ($event) => $options.clickMask())
        },
        {
          default: vue.withCtx(() => [
            vue.createElementVNode("view", { style: { "background": "#fff", "border-radius": "5px", "padding": "10px" } }, [
              vue.createElementVNode("view", { style: { "display": "flex", "justify-content": "space-between" } }, [
                vue.createElementVNode("view", null, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString($options.getFileName($data.audioUrl)),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", {
                  style: { "margin-right": "10px" },
                  onClick: _cache[5] || (_cache[5] = ($event) => $options.clickMask())
                }, [
                  vue.createElementVNode("image", {
                    src: _imports_2,
                    style: { "width": "15px", "height": "15px" }
                  })
                ])
              ]),
              vue.createElementVNode("view", { class: "divider" }),
              vue.createCommentVNode(" 支持mp3、ogg等 "),
              vue.createVNode(_component_free_audio, {
                startPic: "../../../../static/icon/take_video.png",
                endPic: "../../../../static/icon/pause.png",
                audioId: "audio1",
                url: $data.audioUrl
              }, null, 8, ["url"])
            ])
          ]),
          _: 1
          /* STABLE */
        },
        512
        /* NEED_PATCH */
      ),
      vue.createCommentVNode(" 文件上传 "),
      vue.createVNode(_component_ysh_file_manager, {
        ref: "filemanager",
        onResult: $options.resultPath
      }, null, 8, ["onResult"]),
      vue.createElementVNode("view", { style: { "background-color": "#fff" } }, [
        vue.createVNode(_component_uni_fab, {
          pattern: $data.pattern,
          content: $data.content,
          horizontal: $data.horizontal,
          vertical: $data.vertical,
          direction: $data.direction,
          onTrigger: $options.trigger
        }, null, 8, ["pattern", "content", "horizontal", "vertical", "direction", "onTrigger"])
      ])
    ]);
  }
  const PagesTaskTaskDetailDocumentDocument = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$o], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/task/task_detail/document/document.vue"]]);
  const _sfc_main$o = {
    data() {
      return {
        id: 0,
        // 使用 marker点击事件 需要填写id
        title: "map",
        current_latitude: 24.18222,
        current_longitude: 120.68625,
        covers: [{
          latitude: 24.18222,
          longitude: 120.68625,
          iconPath: "../../../../static/icon/location_grey.png"
        }]
      };
    },
    onLoad() {
    },
    methods: {
      async getCurrentPosition() {
        const that = this;
        uni.getLocation({
          type: "gcj02",
          isHighAccuracy: true,
          // 开启高精度
          success: function(res) {
            that.current_longitude = res.longitude;
            that.current_latitude = res.latitude;
            that.covers.push({ latitude: res.longitude, longitude: res.latitude, iconPath: "../../../../static/icon/location_grey.png" });
            formatAppLog("log", "at pages/task/task_detail/map_test/map_test.vue:43", res);
          },
          fail: function(error) {
            formatAppLog("log", "at pages/task/task_detail/map_test/map_test.vue:46", "获取失败");
          }
        });
      }
    }
  };
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode("view", { class: "page-body" }, [
        vue.createElementVNode("view", {
          class: "container",
          style: { "height": "100%" }
        }, [
          vue.createElementVNode("map", {
            style: { "width": "100%", "height": "100vh" },
            latitude: $data.current_latitude,
            longitude: $data.current_longitude,
            markers: $data.covers,
            scale: 9
          }, null, 8, ["latitude", "longitude", "markers"]),
          vue.createElementVNode("view", { class: "overlay" }, [
            vue.createElementVNode("button", {
              type: "default",
              plain: "true"
            }, "按钮")
          ])
        ])
      ])
    ]);
  }
  const PagesTaskTaskDetailMapTestMapTest = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/task/task_detail/map_test/map_test.vue"]]);
  const _sfc_main$n = {
    data() {
      return {};
    },
    mounted() {
      const subNVue = uni.getSubNVueById("condition_icons");
      subNVue.show("none", 300, function() {
        formatAppLog("log", "at pages/task/task_detail/baidu_map/baidu_map.vue:20", subNVue, "subNVue");
        subNVue.setStyle({
          top: "0px",
          bottom: "0px",
          left: "0px",
          right: "0px",
          zIndex: 999
        });
        formatAppLog("log", "at pages/task/task_detail/baidu_map/baidu_map.vue:28", "open success");
      });
    },
    methods: {}
  };
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "map-container" }, [
      vue.createElementVNode("web-view", { src: "/static/html/map_baidu.html" })
    ]);
  }
  const PagesTaskTaskDetailBaiduMapBaiduMap = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/task/task_detail/baidu_map/baidu_map.vue"]]);
  const _sfc_main$m = {
    name: "OptionPicker",
    props: {
      title: String,
      options: Array,
      selectedValue: String
    },
    methods: {
      selectOption(value) {
        this.$emit("select", value);
      }
    }
  };
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "picker-wrapper" }, [
      vue.createElementVNode("view", {
        class: "picker-overlay",
        onClick: _cache[3] || (_cache[3] = ($event) => _ctx.$emit("close"))
      }, [
        vue.createElementVNode("view", {
          class: "picker-content",
          onClick: _cache[2] || (_cache[2] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "picker-header" }, [
            vue.createElementVNode(
              "text",
              { class: "picker-title" },
              vue.toDisplayString($props.title),
              1
              /* TEXT */
            ),
            vue.createElementVNode("text", {
              class: "picker-close",
              onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("close"))
            }, "×")
          ]),
          vue.createElementVNode("view", { class: "picker-options" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($props.options, (option) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: option.value,
                  class: vue.normalizeClass(["picker-option", { "selected": $props.selectedValue === option.value }]),
                  onClick: ($event) => $options.selectOption(option.value)
                }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(option.label),
                    1
                    /* TEXT */
                  )
                ], 10, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createElementVNode("view", { class: "picker-footer" }, [
            vue.createElementVNode("button", {
              class: "picker-btn",
              onClick: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("close"))
            }, "取消")
          ])
        ])
      ])
    ]);
  }
  const OptionPicker = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__scopeId", "data-v-2798e3c8"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/profile/OptionPicker.vue"]]);
  const _imports_0$5 = "/static/my/编辑.svg";
  const _imports_1 = "/static/my/展开.svg";
  const _sfc_main$l = {
    __name: "profile",
    setup(__props, { expose: __expose }) {
      __expose();
      const userStore = useUserStore();
      const userData = vue.computed(() => userStore.getUserData());
      const locationSharing = vue.ref(false);
      const showConfirmDialog = vue.ref(false);
      const confirmMessage = vue.ref("");
      const deleteType = vue.ref("");
      const selectedStorageStrategy = vue.ref("7天");
      const storageOptions = [
        { label: "7天", value: "7天" },
        { label: "15天", value: "15天" },
        { label: "30天", value: "30天" }
      ];
      const selectedLocationInterval = vue.ref("5分钟");
      const locationIntervalOptions = [
        { label: "1分钟", value: "1分钟" },
        { label: "5分钟", value: "5分钟" },
        { label: "10分钟", value: "10分钟" },
        { label: "30分钟", value: "30分钟" }
      ];
      const showPicker = vue.ref(false);
      const pickerTitle = vue.ref("");
      const pickerOptions = vue.ref([]);
      const pickerSelectedValue = vue.ref("");
      const pickerType = vue.ref("");
      const settingItems = vue.reactive([
        { label: "定位信息回传间隔", value: "5分钟" },
        { label: "文件本地存储策略", value: "7天" },
        { label: "修改密码", value: "" }
      ]);
      const loadUserData = async () => {
        if (!userData.value.id) {
          const userInfo = uni.getStorageSync("userInfo");
          if (userInfo && typeof userInfo === "object") {
            userStore.setUserData(userInfo);
          }
        }
      };
      vue.onMounted(() => {
        loadUserData();
      });
      onShow(() => {
        loadUserData().catch((error) => {
          formatAppLog("error", "at pages/profile/profile.vue:160", "onShow 中出现错误:", error);
        });
      });
      const onSettingItemClick = (item) => {
        if (item.label === "文件本地存储策略") {
          openPicker("storage", "文件本地存储策略", storageOptions, selectedStorageStrategy.value);
        } else if (item.label === "定位信息回传间隔") {
          openPicker("location", "定位信息回传间隔", locationIntervalOptions, selectedLocationInterval.value);
        } else if (item.label === "修改密码") {
          uni.navigateTo({
            url: "/pages/forgetPassword/forgetPassword"
          });
        }
      };
      const openPicker = (type, title, options, selectedValue) => {
        pickerType.value = type;
        pickerTitle.value = title;
        pickerOptions.value = options;
        pickerSelectedValue.value = selectedValue;
        showPicker.value = true;
      };
      const closePicker = () => {
        showPicker.value = false;
      };
      const selectOption = (value) => {
        if (pickerType.value === "storage") {
          selectedStorageStrategy.value = value;
          settingItems.find((item) => item.label === "文件本地存储策略").value = value;
        } else if (pickerType.value === "location") {
          selectedLocationInterval.value = value;
          settingItems.find((item) => item.label === "定位信息回传间隔").value = value;
        }
        closePicker();
      };
      const showDeleteConfirm = (type) => {
        deleteType.value = type;
        confirmMessage.value = type === "chat" ? "确定删除聊天记录吗？" : "您确认要删除所有数据吗？";
        showConfirmDialog.value = true;
      };
      const cancelDelete = () => {
        showConfirmDialog.value = false;
      };
      const confirmDelete = () => {
        if (deleteType.value === "chat") {
          formatAppLog("log", "at pages/profile/profile.vue:211", "聊天记录已删除");
        } else {
          formatAppLog("log", "at pages/profile/profile.vue:213", "所有数据已删除");
        }
        showConfirmDialog.value = false;
      };
      const performLogout = async () => {
        uni.showLoading({
          title: "正在退出登录",
          mask: true
        });
        try {
          if (uni.getStorageSync("token")) {
            await logout();
          }
        } catch (error) {
          formatAppLog("error", "at pages/profile/profile.vue:229", "退出登录失败:", error);
        } finally {
          uni.removeStorageSync("token");
          uni.removeStorageSync("userInfo");
          userStore.clearUserData();
          uni.redirectTo({
            url: "/pages/login/camouflageLogin/camouflageLogin"
          });
          uni.hideLoading();
        }
      };
      const onLocationSharingChange = (e2) => {
        locationSharing.value = e2.detail.value;
      };
      const __returned__ = { userStore, userData, locationSharing, showConfirmDialog, confirmMessage, deleteType, selectedStorageStrategy, storageOptions, selectedLocationInterval, locationIntervalOptions, showPicker, pickerTitle, pickerOptions, pickerSelectedValue, pickerType, settingItems, loadUserData, onSettingItemClick, openPicker, closePicker, selectOption, showDeleteConfirm, cancelDelete, confirmDelete, performLogout, onLocationSharingChange, ref: vue.ref, reactive: vue.reactive, onMounted: vue.onMounted, computed: vue.computed, get onShow() {
        return onShow;
      }, OptionPicker, get useUserStore() {
        return useUserStore;
      }, get logout() {
        return logout;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createCommentVNode(" 用户头像、姓名、用户名和电话 "),
      vue.createElementVNode("view", { class: "user-info" }, [
        vue.createElementVNode("image", {
          class: "avatar",
          src: $setup.userData.avatarUrl || "/static/my/默认头像.svg"
        }, null, 8, ["src"]),
        vue.createElementVNode("view", { class: "user-details" }, [
          vue.createElementVNode("view", { class: "name-container" }, [
            vue.createElementVNode(
              "text",
              { class: "name" },
              vue.toDisplayString($setup.userData.name || "未设置"),
              1
              /* TEXT */
            ),
            vue.createElementVNode("image", {
              class: "edit-icon",
              src: _imports_0$5
            })
          ]),
          vue.createElementVNode("view", { class: "info-item" }, [
            vue.createElementVNode("text", { class: "info-label" }, "用户名："),
            vue.createElementVNode(
              "text",
              { class: "info-value" },
              vue.toDisplayString($setup.userData.account || "未设置"),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "info-item" }, [
            vue.createElementVNode("text", { class: "info-label" }, "手机："),
            vue.createElementVNode(
              "text",
              { class: "info-value" },
              vue.toDisplayString($setup.userData.phone || "未设置"),
              1
              /* TEXT */
            )
          ])
        ])
      ]),
      vue.createCommentVNode(" 位置共享开关 "),
      vue.createElementVNode("view", { class: "switch-item" }, [
        vue.createElementVNode("text", null, "是否开启位置共享"),
        vue.createElementVNode("switch", {
          color: "#4285f4",
          checked: $setup.locationSharing,
          onChange: $setup.onLocationSharingChange
        }, null, 40, ["checked"])
      ]),
      vue.createCommentVNode(" 设置列表 "),
      vue.createElementVNode("view", { class: "setting-list" }, [
        vue.createElementVNode("view", {
          class: "setting-item",
          onClick: _cache[0] || (_cache[0] = ($event) => $setup.onSettingItemClick($setup.settingItems[0]))
        }, [
          vue.createElementVNode("text", null, "定位信息回传间隔"),
          vue.createElementVNode("view", { class: "setting-value" }, [
            vue.createElementVNode(
              "text",
              { class: "setting-value-text" },
              vue.toDisplayString($setup.selectedLocationInterval),
              1
              /* TEXT */
            ),
            vue.createElementVNode("image", {
              class: "expand-icon",
              src: _imports_1
            })
          ])
        ]),
        vue.createElementVNode("view", {
          class: "setting-item",
          onClick: _cache[1] || (_cache[1] = ($event) => $setup.onSettingItemClick($setup.settingItems[1]))
        }, [
          vue.createElementVNode("text", null, "文件本地存储策略"),
          vue.createElementVNode("view", { class: "setting-value" }, [
            vue.createElementVNode(
              "text",
              { class: "setting-value-text" },
              vue.toDisplayString($setup.selectedStorageStrategy),
              1
              /* TEXT */
            ),
            vue.createElementVNode("image", {
              class: "expand-icon",
              src: _imports_1
            })
          ])
        ]),
        vue.createElementVNode("view", {
          class: "setting-item",
          onClick: _cache[2] || (_cache[2] = ($event) => $setup.onSettingItemClick($setup.settingItems[2]))
        }, [
          vue.createElementVNode("text", null, "修改密码"),
          vue.createElementVNode("view", { class: "setting-value" }, [
            vue.createElementVNode("image", {
              class: "expand-icon",
              src: _imports_1
            })
          ])
        ])
      ]),
      vue.createCommentVNode(" 删除聊天记录按钮 "),
      vue.createElementVNode("view", {
        class: "delete-chat",
        onClick: _cache[3] || (_cache[3] = ($event) => $setup.showDeleteConfirm("chat"))
      }, [
        vue.createElementVNode("text", null, "删除聊天记录")
      ]),
      vue.createElementVNode("view", {
        class: "delete-all",
        onClick: _cache[4] || (_cache[4] = ($event) => $setup.showDeleteConfirm("all"))
      }, [
        vue.createElementVNode("text", null, "一键删除")
      ]),
      vue.createCommentVNode(" 退出登录按钮 "),
      vue.createElementVNode("view", {
        class: "logout",
        onClick: $setup.performLogout
      }, [
        vue.createElementVNode("text", null, "退出登录")
      ]),
      vue.createCommentVNode(" 确认对话框 "),
      $setup.showConfirmDialog ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "dialog-overlay"
      }, [
        vue.createElementVNode("view", { class: "dialog-content" }, [
          vue.createElementVNode("view", { class: "dialog-body" }, [
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($setup.confirmMessage),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "dialog-footer" }, [
            vue.createElementVNode("button", {
              class: "dialog-btn cancel-btn",
              onClick: $setup.cancelDelete
            }, "取消"),
            vue.createElementVNode("button", {
              class: "dialog-btn confirm-btn",
              onClick: $setup.confirmDelete
            }, "确认")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 选项选择器 "),
      $setup.showPicker ? (vue.openBlock(), vue.createBlock($setup["OptionPicker"], {
        key: 1,
        title: $setup.pickerTitle,
        options: $setup.pickerOptions,
        selectedValue: $setup.pickerSelectedValue,
        onSelect: $setup.selectOption,
        onClose: $setup.closePicker
      }, null, 8, ["title", "options", "selectedValue"])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesProfileProfile = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/profile/profile.vue"]]);
  const _sfc_main$k = {
    name: "GroupAvatar",
    props: {
      avatar: {
        type: [Array, String],
        default: () => []
      }
    },
    data() {
      return {
        defaultAvatarPath: "../../static/message/默认头像.png"
      };
    },
    computed: {
      processedAvatar() {
        if (Array.isArray(this.avatar)) {
          if (this.avatar.length === 0) {
            return [this.defaultAvatarPath];
          }
          return this.avatar.map((avatarPath) => avatarPath || this.defaultAvatarPath);
        } else {
          return [this.avatar || this.defaultAvatarPath];
        }
      }
    }
  };
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("div", { class: "avatar-wrap" }, [
      $options.processedAvatar.length === 1 ? (vue.openBlock(), vue.createElementBlock("image", {
        key: 0,
        src: $options.processedAvatar[0],
        class: "horizonta-1"
      }, null, 8, ["src"])) : $options.processedAvatar.length >= 2 && $options.processedAvatar.length <= 4 ? (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        { key: 1 },
        vue.renderList($options.processedAvatar, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("image", {
            key: index,
            src: item,
            class: "horizonta-2"
          }, null, 8, ["src"]);
        }),
        128
        /* KEYED_FRAGMENT */
      )) : (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        { key: 2 },
        vue.renderList($options.processedAvatar.slice(0, 4), (item, index) => {
          return vue.openBlock(), vue.createElementBlock("image", {
            key: index,
            src: item,
            class: "horizonta-3"
          }, null, 8, ["src"]);
        }),
        128
        /* KEYED_FRAGMENT */
      ))
    ]);
  }
  const GroupAvatar = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__scopeId", "data-v-afb5909c"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/ChatComponent/GroupAvatar.vue"]]);
  const searchUsers = (params) => {
    return request({
      url: "/user/searchUsers",
      method: "post",
      data: params
    });
  };
  const getChatList = (missionId = "dc029035aec84fb5a88dd401a0942d50") => {
    return request({
      url: `/message/chatList/${missionId}`,
      method: "get"
    });
  };
  const sendMessageToUser = (data) => {
    return request({
      url: "/message/send/user",
      method: "post",
      data: {
        message: data.message,
        recipientId: data.recipientId
      }
    });
  };
  const getHistoryChatMessages = (data) => {
    return request({
      url: "/message/read/single",
      method: "post",
      data: {
        from: data.from,
        to: data.to,
        opponentId: data.opponentId
      }
    });
  };
  const _imports_0$4 = "/static/message/搜索.png";
  const _sfc_main$j = {
    name: "Messages",
    components: {
      GroupAvatar
    },
    data() {
      return {
        demoMessages: [
          {
            id: "1",
            name: "张三",
            avatar: ["/static/avatar/avatar1.png"],
            preview: "你好，最近怎么样？",
            date: "2024-11-25T10:00:00",
            type: "single",
            unreadCount: 2
          },
          {
            id: "2",
            name: "项目讨论群",
            avatar: ["/static/avatar/group1.png", "/static/avatar/group2.png", "/static/avatar/group3.png"],
            preview: "下周一开会，请大家准时参加",
            date: "2024-11-24T15:30:00",
            type: "group",
            unreadCount: 5
          }
        ],
        realMessages: [],
        defaultAvatarPath: "../../static/message/默认头像.png",
        scrollViewHeight: 0
      };
    },
    computed: {
      systemMessage() {
        return {
          title: "推送消息",
          preview: "系统版本更新",
          date: this.getCurrentDate(),
          notificationCount: Math.floor(Math.random() * 20) + 1
        };
      },
      combinedMessages() {
        return [...this.demoMessages, ...this.realMessages];
      },
      totalMessageCount() {
        const totalUnread = this.combinedMessages.reduce((sum, message) => sum + (message.unreadCount || 0), 0);
        return this.combinedMessages.length + totalUnread;
      }
    },
    mounted() {
      this.calculateScrollViewHeight();
      uni.$on("switchToMessages", this.handleSwitchToMessages);
      this.fetchChatList();
    },
    beforeDestroy() {
      uni.$off("switchToMessages", this.handleSwitchToMessages);
    },
    methods: {
      openChat(message) {
        const chatInfo = {
          id: message.id || message.userId,
          name: message.name || message.userName,
          avatar: message.avatar || this.defaultAvatarPath,
          type: message.group ? "group" : "single"
        };
        uni.navigateTo({
          url: "/pages/message/chat",
          success: (res) => {
            res.eventChannel.emit("chatInfo", { chatInfo });
          },
          fail: (err) => {
            formatAppLog("error", "at pages/message/main.vue:123", "导航到聊天页面失败:", err);
          }
        });
      },
      getCurrentDate() {
        const now2 = /* @__PURE__ */ new Date();
        const month = now2.getMonth() + 1;
        const day = now2.getDate();
        return `${month}月${day}日`;
      },
      handleSwitchToMessages() {
        uni.$emit("updateTabBarActiveTab", 1);
      },
      getAvatarSrc(avatar) {
        return Array.isArray(avatar) ? avatar[0] : avatar || this.defaultAvatarPath;
      },
      calculateScrollViewHeight() {
        const systemInfo = uni.getSystemInfoSync();
        const headerHeight = 44;
        const tabBarHeight = 50;
        this.scrollViewHeight = systemInfo.windowHeight - headerHeight - tabBarHeight;
      },
      async fetchChatList() {
        formatAppLog("log", "at pages/message/main.vue:146", "dsdsdsd");
        const response = await getChatList();
        if (response.code === 200) {
          this.realMessages = response.data.map((item) => ({
            ...item,
            avatar: this.defaultAvatarPath,
            preview: item.latestMessage,
            date: item.sendTime
          }));
        } else {
          formatAppLog("error", "at pages/message/main.vue:156", "获取聊天列表失败:", response.msg);
        }
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        const now2 = /* @__PURE__ */ new Date();
        const diffDays = Math.floor((now2 - date) / (1e3 * 60 * 60 * 24));
        if (diffDays === 0) {
          return this.formatTime(date);
        } else if (diffDays === 1) {
          return "昨天";
        } else if (diffDays < 7) {
          const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
          return weekdays[date.getDay()];
        } else {
          const month = date.getMonth() + 1;
          const day = date.getDate();
          return `${month}月${day}日`;
        }
      },
      formatTime(date) {
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
      }
    }
  };
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_group_avatar = vue.resolveComponent("group-avatar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "messages-container" }, [
      vue.createElementVNode("view", { class: "messages-view" }, [
        vue.createElementVNode("view", { class: "messages-header" }, [
          vue.createElementVNode(
            "text",
            { class: "header-title" },
            "消息(" + vue.toDisplayString($options.totalMessageCount) + ")",
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "search-icon" }, [
            vue.createElementVNode("image", {
              src: _imports_0$4,
              mode: "aspectFit",
              class: "search-image"
            })
          ])
        ]),
        vue.createElementVNode(
          "scroll-view",
          {
            class: "messages-list",
            "scroll-y": "",
            "enable-flex": "",
            style: vue.normalizeStyle({ height: $data.scrollViewHeight + "px" })
          },
          [
            vue.createElementVNode("view", { class: "message-item system-message" }, [
              vue.createElementVNode("view", { class: "message-icon system-icon" }, [
                vue.createElementVNode("text", null, "📢"),
                vue.createElementVNode(
                  "view",
                  { class: "notification-badge" },
                  vue.toDisplayString($options.systemMessage.notificationCount),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "message-content" }, [
                vue.createElementVNode(
                  "view",
                  { class: "message-title" },
                  vue.toDisplayString($options.systemMessage.title),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "message-preview" },
                  vue.toDisplayString($options.systemMessage.preview),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode(
                "view",
                { class: "message-date" },
                vue.toDisplayString($options.systemMessage.date),
                1
                /* TEXT */
              )
            ]),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($options.combinedMessages, (message, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: index,
                  class: vue.normalizeClass(["message-item", { "personal-chat": !message.group }]),
                  onClick: ($event) => $options.openChat(message)
                }, [
                  message.group ? (vue.openBlock(), vue.createBlock(_component_group_avatar, {
                    key: 0,
                    avatar: message.avatar,
                    class: "avatar"
                  }, null, 8, ["avatar"])) : (vue.openBlock(), vue.createElementBlock("image", {
                    key: 1,
                    src: $options.getAvatarSrc(message.avatar),
                    class: "avatar",
                    mode: "aspectFill"
                  }, null, 8, ["src"])),
                  vue.createElementVNode("view", { class: "message-content-wrapper" }, [
                    vue.createElementVNode("view", { class: "message-content" }, [
                      vue.createElementVNode(
                        "view",
                        { class: "message-title" },
                        vue.toDisplayString(message.name || message.userName),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "view",
                        { class: "message-preview" },
                        vue.toDisplayString(message.preview || message.latestMessage),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode(
                      "view",
                      { class: "message-date" },
                      vue.toDisplayString($options.formatDate(message.date || message.sendTime)),
                      1
                      /* TEXT */
                    )
                  ]),
                  message.unreadCount > 0 ? (vue.openBlock(), vue.createElementBlock(
                    "view",
                    {
                      key: 2,
                      class: "unread-badge"
                    },
                    vue.toDisplayString(message.unreadCount),
                    1
                    /* TEXT */
                  )) : vue.createCommentVNode("v-if", true)
                ], 10, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ],
          4
          /* STYLE */
        )
      ])
    ]);
  }
  const PagesMessageMain = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/main.vue"]]);
  const _imports_0$3 = "/static/message/返回.png";
  const _sfc_main$i = {
    name: "ChatHeader",
    components: {},
    props: {
      chatInfo: {
        type: Object,
        required: true
      }
    }
  };
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "chat-header" }, [
      vue.createElementVNode("div", {
        class: "uni-page-head-hd",
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("goBack"))
      }, [
        vue.createElementVNode("div", { class: "uni-page-head-btn" }, [
          vue.createElementVNode("image", {
            src: _imports_0$3,
            class: "back-icon",
            mode: "aspectFit"
          })
        ])
      ]),
      vue.createElementVNode("view", { class: "chat-title-container" }, [
        vue.createElementVNode(
          "text",
          { class: "chat-title" },
          vue.toDisplayString($props.chatInfo.name),
          1
          /* TEXT */
        )
      ]),
      vue.createElementVNode("text", { class: "menu-button" }, "...")
    ]);
  }
  const ChatHeader = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__scopeId", "data-v-120ff10e"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/ChatComponent/ChatHeader.vue"]]);
  const gaodeApiKey = "fc598a079d7d9cf5f54ecec04b17e414";
  const gaodeSecurityKey = "93849873dba769e7b6235a79330ae7f7";
  const AMAP_KEY = gaodeApiKey;
  const AMAP_API_URL = "https://restapi.amap.com/v3/staticmap?";
  const _sfc_main$h = {
    name: "Message",
    props: {
      message: {
        type: Object,
        required: true
      }
    },
    methods: {
      formatTime(timestamp) {
        const date = new Date(timestamp);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${month}-${day} ${hours}:${minutes}`;
      },
      previewImage(url) {
        uni.previewImage({
          urls: [url],
          current: url
        });
      },
      openMap(location2) {
        if (!location2 || !location2.latitude || !location2.longitude) {
          formatAppLog("error", "at pages/message/ChatComponent/Message.vue:79", "Invalid location data:", location2);
          return;
        }
        uni.openLocation({
          latitude: parseFloat(location2.latitude),
          longitude: parseFloat(location2.longitude),
          name: location2.name,
          address: location2.address,
          success: function() {
            formatAppLog("log", "at pages/message/ChatComponent/Message.vue:88", "Successfully opened map");
          },
          fail: function(error) {
            formatAppLog("error", "at pages/message/ChatComponent/Message.vue:91", "Failed to open map:", error);
          }
        });
      },
      getStaticMapUrl(location2) {
        return `${AMAP_API_URL}location=${location2.longitude},${location2.latitude}&zoom=14&size=480*240&scale=2&markers=mid,,A:${location2.longitude},${location2.latitude}&key=${AMAP_KEY}`;
      },
      logMessageDetails() {
        formatAppLog("log", "at pages/message/ChatComponent/Message.vue:99", "Message details:", {
          type: this.message.type || "undefined",
          content: typeof this.message.content === "object" ? JSON.stringify(this.message.content) : this.message.content,
          userType: this.message.userType
        });
        if (this.message.type === "location" && this.message.content) {
          formatAppLog("log", "at pages/message/ChatComponent/Message.vue:105", "Location details:", {
            name: this.message.content.name,
            address: this.message.content.address,
            latitude: this.message.content.latitude,
            longitude: this.message.content.longitude
          });
          formatAppLog("log", "at pages/message/ChatComponent/Message.vue:111", "Static map URL:", `${AMAP_API_URL}location=${this.message.content.longitude},${this.message.content.latitude}&zoom=14&size=480*240&scale=2&markers=mid,,A:${this.message.content.longitude},${this.message.content.latitude}&key=${AMAP_KEY}`);
        }
      }
    },
    mounted() {
      this.logMessageDetails();
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["message", [$props.message.userType]])
      },
      [
        vue.createElementVNode(
          "view",
          { class: "message-time" },
          vue.toDisplayString($options.formatTime($props.message.timestamp), $props.message),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "message-content" }, [
          vue.createElementVNode("image", {
            src: $props.message.avatar || "/static/message/默认头像.png",
            class: "avatar",
            mode: "aspectFill"
          }, null, 8, ["src"]),
          vue.createElementVNode("view", { class: "content-wrapper" }, [
            $props.message.userType === "friend" ? (vue.openBlock(), vue.createElementBlock(
              "view",
              {
                key: 0,
                class: "friend-name"
              },
              vue.toDisplayString($props.message.name),
              1
              /* TEXT */
            )) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["content", { "location-content": $props.message.type === "location" }])
              },
              [
                vue.createCommentVNode(" Location Message Type "),
                $props.message.type === "location" && $props.message.content ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "location-bubble",
                  onClick: _cache[0] || (_cache[0] = ($event) => $options.openMap($props.message.content))
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "location-title" },
                    vue.toDisplayString($props.message.content.name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "view",
                    { class: "location-address" },
                    vue.toDisplayString($props.message.content.address),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", { class: "location-map" }, [
                    vue.createElementVNode("image", {
                      class: "map-image",
                      src: $options.getStaticMapUrl($props.message.content),
                      mode: "aspectFill"
                    }, null, 8, ["src"])
                  ])
                ])) : $props.message.type === "image" ? (vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  { key: 1 },
                  [
                    vue.createCommentVNode(" Image Message Type "),
                    vue.createElementVNode("image", {
                      src: $props.message.content,
                      mode: "widthFix",
                      class: "message-image",
                      onClick: _cache[1] || (_cache[1] = ($event) => $options.previewImage($props.message.content))
                    }, null, 8, ["src"])
                  ],
                  64
                  /* STABLE_FRAGMENT */
                )) : (vue.openBlock(), vue.createElementBlock(
                  vue.Fragment,
                  { key: 2 },
                  [
                    vue.createCommentVNode(" Default Text Message Type "),
                    vue.createTextVNode(
                      vue.toDisplayString($props.message.content),
                      1
                      /* TEXT */
                    )
                  ],
                  64
                  /* STABLE_FRAGMENT */
                ))
              ],
              2
              /* CLASS */
            )
          ]),
          $props.message.userType === "self" ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "message-status"
          }, [
            $props.message.status === "sending" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "loading-icon"
            })) : $props.message.status === "failed" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "failed-icon"
            }, "!")) : vue.createCommentVNode("v-if", true)
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ],
      2
      /* CLASS */
    );
  }
  const Message = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__scopeId", "data-v-1cea873d"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/ChatComponent/Message.vue"]]);
  const _sfc_main$g = {
    name: "MessageList",
    components: {
      Message
    },
    props: {
      messages: {
        type: Array,
        required: true
      },
      scrollTop: {
        type: Number,
        default: 0
      },
      scrollIntoView: {
        type: String,
        default: ""
      }
    },
    methods: {
      onScroll(event2) {
        this.$emit("scroll", event2);
      }
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_message = vue.resolveComponent("message");
    return vue.openBlock(), vue.createElementBlock("scroll-view", {
      class: "scroll-view",
      "scroll-y": "",
      "scroll-with-animation": "",
      "scroll-top": $props.scrollTop,
      "scroll-into-view": $props.scrollIntoView,
      onScrolltoupper: _cache[1] || (_cache[1] = ($event) => _ctx.$emit("load-more")),
      onScroll: _cache[2] || (_cache[2] = (...args) => $options.onScroll && $options.onScroll(...args))
    }, [
      vue.createElementVNode("view", { style: { "padding": "30rpx 30rpx 240rpx" } }, [
        vue.createCommentVNode(" 遍历消息列表，渲染每条消息 "),
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($props.messages, (item, index) => {
            return vue.openBlock(), vue.createBlock(_component_message, {
              key: index,
              id: `message-${index}`,
              message: item,
              onViewBurnAfterReading: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("view-burn-after-reading", $event))
            }, null, 8, ["id", "message"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])
    ], 40, ["scroll-top", "scroll-into-view"]);
  }
  const MessageList = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__scopeId", "data-v-dee4eb4b"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/ChatComponent/MessageList.vue"]]);
  const _sfc_main$f = {
    name: "AttachmentMenu",
    data() {
      return {
        attachOptions: [
          { icon: "/static/message/相册.png", label: "相册", action: "album" },
          { icon: "/static/message/拍摄.png", label: "拍摄", action: "camera" },
          { icon: "/static/message/视频通话.png", label: "视频通话", action: "video-call" },
          { icon: "/static/message/文件传输.png", label: "文件传输", action: "file" },
          { icon: "/static/message/阅后即焚.png", label: "阅后即焚", action: "burn-after-reading" },
          { icon: "/static/message/位置.png", label: "位置", action: "location" }
        ],
        selectedFile: null
      };
    },
    methods: {
      handleAttachItem(action) {
        if (action === "file") {
          this.chooseFile();
        } else if (action === "location") {
          this.$emit("attach", action);
        } else if (action === "video-call") {
          this.$emit("attach", action);
        } else {
          this.$emit("attach", action);
        }
      },
      chooseFile() {
        if (uni.getSystemInfoSync().platform === "android") {
          this.chooseFileAndroid();
        } else {
          this.chooseFileIOS();
        }
      },
      chooseFileH5() {
        uni.chooseFile({
          count: 1,
          success: (res) => {
            this.handleFileSelected(res.tempFiles[0]);
          },
          fail: (err) => {
            uni.showToast({ title: "选择文件失败", icon: "none" });
          }
        });
      },
      chooseFileAndroid() {
        const main2 = plus.android.runtimeMainActivity();
        const Intent = plus.android.importClass("android.content.Intent");
        const intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("*/*");
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        main2.startActivityForResult(intent, 200);
        main2.onActivityResult = (requestCode, resultCode, data) => {
          if (requestCode === 200 && data) {
            const uri = data.getData();
            uri.getPath();
            const DocumentsContract = plus.android.importClass("android.provider.DocumentsContract");
            const docId = DocumentsContract.getDocumentId(uri);
            const split = docId.split(":");
            split[0];
            const MediaStore = plus.android.importClass("android.provider.MediaStore");
            const contentResolver = main2.getContentResolver();
            plus.android.importClass(contentResolver);
            let cursor = contentResolver.query(MediaStore.Files.getContentUri("external"), ["_data"], "_id=?", [split[1]], null);
            plus.android.importClass(cursor);
            if (cursor && cursor.moveToFirst()) {
              const columnIndex = cursor.getColumnIndexOrThrow("_data");
              const filePath = cursor.getString(columnIndex);
              cursor.close();
              plus.io.resolveLocalFileSystemURL("file://" + filePath, (entry) => {
                entry.file((file) => {
                  this.handleFileSelected({
                    name: file.name,
                    size: file.size,
                    path: filePath
                  });
                });
              });
            }
          }
        };
      },
      chooseFileIOS() {
        plus.io.chooseFile({
          title: "选择文件",
          multiple: false,
          success: (res) => {
            this.handleFileSelected({
              name: res.files[0].name,
              size: res.files[0].size,
              path: res.files[0].path
            });
          },
          fail: (err) => {
            uni.showToast({ title: "选择文件失败", icon: "none" });
          }
        });
      },
      handleFileSelected(file) {
        this.selectedFile = {
          name: file.name,
          size: this.formatFileSize(file.size),
          path: file.path
        };
        this.$emit("file-selected", this.selectedFile);
      },
      formatFileSize(bytes) {
        if (bytes < 1024)
          return bytes + " B";
        else if (bytes < 1048576)
          return (bytes / 1024).toFixed(2) + " KB";
        else if (bytes < 1073741824)
          return (bytes / 1048576).toFixed(2) + " MB";
        else
          return (bytes / 1073741824).toFixed(2) + " GB";
      }
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: vue.normalizeClass(["attach-menu", { "active": true }])
    }, [
      vue.createElementVNode("view", { class: "attach-row" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.attachOptions.slice(0, 4), (option) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: option.action,
              class: "attach-option",
              onClick: ($event) => $options.handleAttachItem(option.action)
            }, [
              vue.createElementVNode("view", { class: "icon-wrapper" }, [
                vue.createElementVNode("image", {
                  src: option.icon,
                  class: "attach-icon",
                  mode: "aspectFit"
                }, null, 8, ["src"])
              ]),
              vue.createElementVNode(
                "text",
                { class: "attach-label" },
                vue.toDisplayString(option.label),
                1
                /* TEXT */
              )
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createElementVNode("view", { class: "attach-row second-row" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.attachOptions.slice(4, 6), (option) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: option.action,
              class: "attach-option",
              onClick: ($event) => $options.handleAttachItem(option.action)
            }, [
              vue.createElementVNode("view", { class: "icon-wrapper" }, [
                vue.createElementVNode("image", {
                  src: option.icon,
                  class: "attach-icon",
                  mode: "aspectFit"
                }, null, 8, ["src"])
              ]),
              vue.createElementVNode(
                "text",
                { class: "attach-label" },
                vue.toDisplayString(option.label),
                1
                /* TEXT */
              )
            ], 8, ["onClick"]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])
    ]);
  }
  const AttachmentMenu = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__scopeId", "data-v-00ea5aaf"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/ChatComponent/ChatInputAreaComponent/AttachmentMenu.vue"]]);
  const _sfc_main$e = {
    name: "FileTransfer",
    props: {
      selectedFile: {
        type: Object,
        default: null
      }
    },
    methods: {
      uploadFile() {
        if (!this.selectedFile) {
          uni.showToast({ title: "请先选择文件", icon: "none" });
          return;
        }
        uni.uploadFile({
          url: "https://your-upload-api-url.com",
          // 替换为实际的上传 API 地址
          filePath: this.selectedFile.path,
          name: "file",
          formData: {
            "user": "test"
          },
          success: (uploadRes) => {
            formatAppLog("log", "at pages/message/ChatComponent/ChatInputAreaComponent/FileTransfer.vue:34", "上传成功", uploadRes);
            uni.showToast({ title: "上传成功", icon: "success" });
            this.$emit("file-uploaded", uploadRes);
          },
          fail: (err) => {
            formatAppLog("error", "at pages/message/ChatComponent/ChatInputAreaComponent/FileTransfer.vue:39", "上传失败", err);
            uni.showToast({ title: "上传失败，请重试", icon: "none" });
          }
        });
      }
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "file-transfer" }, [
      $props.selectedFile ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "file-info"
      }, [
        vue.createElementVNode(
          "text",
          { class: "file-name" },
          "文件名: " + vue.toDisplayString($props.selectedFile.name),
          1
          /* TEXT */
        ),
        vue.createElementVNode(
          "text",
          { class: "file-size" },
          "大小: " + vue.toDisplayString($props.selectedFile.size),
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const FileTransfer = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-ce413881"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/ChatComponent/ChatInputAreaComponent/FileTransfer.vue"]]);
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  function getAugmentedNamespace(n2) {
    if (n2.__esModule)
      return n2;
    var f2 = n2.default;
    if (typeof f2 == "function") {
      var a2 = function a3() {
        if (this instanceof a3) {
          return Reflect.construct(f2, arguments, this.constructor);
        }
        return f2.apply(this, arguments);
      };
      a2.prototype = f2.prototype;
    } else
      a2 = {};
    Object.defineProperty(a2, "__esModule", { value: true });
    Object.keys(n2).forEach(function(k) {
      var d2 = Object.getOwnPropertyDescriptor(n2, k);
      Object.defineProperty(a2, k, d2.get ? d2 : {
        enumerable: true,
        get: function() {
          return n2[k];
        }
      });
    });
    return a2;
  }
  var cryptoJs = { exports: {} };
  var lookup = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    62,
    0,
    62,
    0,
    63,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    0,
    0,
    0,
    0,
    63,
    0,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51
  ];
  function base64Decode(source, target) {
    var sourceLength = source.length;
    var paddingLength = source[sourceLength - 2] === "=" ? 2 : source[sourceLength - 1] === "=" ? 1 : 0;
    var tmp;
    var byteIndex = 0;
    var baseLength = sourceLength - paddingLength & 4294967292;
    for (var i2 = 0; i2 < baseLength; i2 += 4) {
      tmp = lookup[source.charCodeAt(i2)] << 18 | lookup[source.charCodeAt(i2 + 1)] << 12 | lookup[source.charCodeAt(i2 + 2)] << 6 | lookup[source.charCodeAt(i2 + 3)];
      target[byteIndex++] = tmp >> 16 & 255;
      target[byteIndex++] = tmp >> 8 & 255;
      target[byteIndex++] = tmp & 255;
    }
    if (paddingLength === 1) {
      tmp = lookup[source.charCodeAt(i2)] << 10 | lookup[source.charCodeAt(i2 + 1)] << 4 | lookup[source.charCodeAt(i2 + 2)] >> 2;
      target[byteIndex++] = tmp >> 8 & 255;
      target[byteIndex++] = tmp & 255;
    }
    if (paddingLength === 2) {
      tmp = lookup[source.charCodeAt(i2)] << 2 | lookup[source.charCodeAt(i2 + 1)] >> 4;
      target[byteIndex++] = tmp & 255;
    }
  }
  const $inject_window_crypto = {
    getRandomValues(arr) {
      if (!(arr instanceof Int8Array || arr instanceof Uint8Array || arr instanceof Int16Array || arr instanceof Uint16Array || arr instanceof Int32Array || arr instanceof Uint32Array || arr instanceof Uint8ClampedArray)) {
        throw new Error("Expected an integer array");
      }
      if (arr.byteLength > 65536) {
        throw new Error("Can only request a maximum of 65536 bytes");
      }
      var crypto = requireNativePlugin("DCloud-Crypto");
      base64Decode(crypto.getRandomValues(arr.byteLength), new Uint8Array(
        arr.buffer,
        arr.byteOffset,
        arr.byteLength
      ));
      return arr;
    }
  };
  function commonjsRequire(path) {
    throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
  }
  var core = { exports: {} };
  const __viteBrowserExternal = new Proxy({}, {
    get(_2, key) {
      throw new Error(`Module "" has been externalized for browser compatibility. Cannot access ".${key}" in client code.  See https://vitejs.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.`);
    }
  });
  const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __viteBrowserExternal
  }, Symbol.toStringTag, { value: "Module" }));
  const require$$0 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
  var hasRequiredCore;
  function requireCore() {
    if (hasRequiredCore)
      return core.exports;
    hasRequiredCore = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory();
        }
      })(commonjsGlobal, function() {
        var CryptoJS2 = CryptoJS2 || function(Math2, undefined$1) {
          var crypto;
          if (typeof window !== "undefined" && $inject_window_crypto) {
            crypto = $inject_window_crypto;
          }
          if (typeof self !== "undefined" && self.crypto) {
            crypto = self.crypto;
          }
          if (typeof globalThis !== "undefined" && globalThis.crypto) {
            crypto = globalThis.crypto;
          }
          if (!crypto && typeof window !== "undefined" && window.msCrypto) {
            crypto = window.msCrypto;
          }
          if (!crypto && typeof commonjsGlobal !== "undefined" && commonjsGlobal.crypto) {
            crypto = commonjsGlobal.crypto;
          }
          if (!crypto && typeof commonjsRequire === "function") {
            try {
              crypto = require$$0;
            } catch (err) {
            }
          }
          var cryptoSecureRandomInt = function() {
            if (crypto) {
              if (typeof crypto.getRandomValues === "function") {
                try {
                  return crypto.getRandomValues(new Uint32Array(1))[0];
                } catch (err) {
                }
              }
              if (typeof crypto.randomBytes === "function") {
                try {
                  return crypto.randomBytes(4).readInt32LE();
                } catch (err) {
                }
              }
            }
            throw new Error("Native crypto module could not be used to get secure random number.");
          };
          var create = Object.create || /* @__PURE__ */ function() {
            function F2() {
            }
            return function(obj) {
              var subtype;
              F2.prototype = obj;
              subtype = new F2();
              F2.prototype = null;
              return subtype;
            };
          }();
          var C2 = {};
          var C_lib = C2.lib = {};
          var Base = C_lib.Base = /* @__PURE__ */ function() {
            return {
              /**
               * Creates a new object that inherits from this object.
               *
               * @param {Object} overrides Properties to copy into the new object.
               *
               * @return {Object} The new object.
               *
               * @static
               *
               * @example
               *
               *     var MyType = CryptoJS.lib.Base.extend({
               *         field: 'value',
               *
               *         method: function () {
               *         }
               *     });
               */
              extend: function(overrides) {
                var subtype = create(this);
                if (overrides) {
                  subtype.mixIn(overrides);
                }
                if (!subtype.hasOwnProperty("init") || this.init === subtype.init) {
                  subtype.init = function() {
                    subtype.$super.init.apply(this, arguments);
                  };
                }
                subtype.init.prototype = subtype;
                subtype.$super = this;
                return subtype;
              },
              /**
               * Extends this object and runs the init method.
               * Arguments to create() will be passed to init().
               *
               * @return {Object} The new object.
               *
               * @static
               *
               * @example
               *
               *     var instance = MyType.create();
               */
              create: function() {
                var instance = this.extend();
                instance.init.apply(instance, arguments);
                return instance;
              },
              /**
               * Initializes a newly created object.
               * Override this method to add some logic when your objects are created.
               *
               * @example
               *
               *     var MyType = CryptoJS.lib.Base.extend({
               *         init: function () {
               *             // ...
               *         }
               *     });
               */
              init: function() {
              },
              /**
               * Copies properties into this object.
               *
               * @param {Object} properties The properties to mix in.
               *
               * @example
               *
               *     MyType.mixIn({
               *         field: 'value'
               *     });
               */
              mixIn: function(properties) {
                for (var propertyName in properties) {
                  if (properties.hasOwnProperty(propertyName)) {
                    this[propertyName] = properties[propertyName];
                  }
                }
                if (properties.hasOwnProperty("toString")) {
                  this.toString = properties.toString;
                }
              },
              /**
               * Creates a copy of this object.
               *
               * @return {Object} The clone.
               *
               * @example
               *
               *     var clone = instance.clone();
               */
              clone: function() {
                return this.init.prototype.extend(this);
              }
            };
          }();
          var WordArray = C_lib.WordArray = Base.extend({
            /**
             * Initializes a newly created word array.
             *
             * @param {Array} words (Optional) An array of 32-bit words.
             * @param {number} sigBytes (Optional) The number of significant bytes in the words.
             *
             * @example
             *
             *     var wordArray = CryptoJS.lib.WordArray.create();
             *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
             *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
             */
            init: function(words, sigBytes) {
              words = this.words = words || [];
              if (sigBytes != undefined$1) {
                this.sigBytes = sigBytes;
              } else {
                this.sigBytes = words.length * 4;
              }
            },
            /**
             * Converts this word array to a string.
             *
             * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
             *
             * @return {string} The stringified word array.
             *
             * @example
             *
             *     var string = wordArray + '';
             *     var string = wordArray.toString();
             *     var string = wordArray.toString(CryptoJS.enc.Utf8);
             */
            toString: function(encoder) {
              return (encoder || Hex).stringify(this);
            },
            /**
             * Concatenates a word array to this word array.
             *
             * @param {WordArray} wordArray The word array to append.
             *
             * @return {WordArray} This word array.
             *
             * @example
             *
             *     wordArray1.concat(wordArray2);
             */
            concat: function(wordArray) {
              var thisWords = this.words;
              var thatWords = wordArray.words;
              var thisSigBytes = this.sigBytes;
              var thatSigBytes = wordArray.sigBytes;
              this.clamp();
              if (thisSigBytes % 4) {
                for (var i2 = 0; i2 < thatSigBytes; i2++) {
                  var thatByte = thatWords[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255;
                  thisWords[thisSigBytes + i2 >>> 2] |= thatByte << 24 - (thisSigBytes + i2) % 4 * 8;
                }
              } else {
                for (var j2 = 0; j2 < thatSigBytes; j2 += 4) {
                  thisWords[thisSigBytes + j2 >>> 2] = thatWords[j2 >>> 2];
                }
              }
              this.sigBytes += thatSigBytes;
              return this;
            },
            /**
             * Removes insignificant bits.
             *
             * @example
             *
             *     wordArray.clamp();
             */
            clamp: function() {
              var words = this.words;
              var sigBytes = this.sigBytes;
              words[sigBytes >>> 2] &= 4294967295 << 32 - sigBytes % 4 * 8;
              words.length = Math2.ceil(sigBytes / 4);
            },
            /**
             * Creates a copy of this word array.
             *
             * @return {WordArray} The clone.
             *
             * @example
             *
             *     var clone = wordArray.clone();
             */
            clone: function() {
              var clone = Base.clone.call(this);
              clone.words = this.words.slice(0);
              return clone;
            },
            /**
             * Creates a word array filled with random bytes.
             *
             * @param {number} nBytes The number of random bytes to generate.
             *
             * @return {WordArray} The random word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.lib.WordArray.random(16);
             */
            random: function(nBytes) {
              var words = [];
              for (var i2 = 0; i2 < nBytes; i2 += 4) {
                words.push(cryptoSecureRandomInt());
              }
              return new WordArray.init(words, nBytes);
            }
          });
          var C_enc = C2.enc = {};
          var Hex = C_enc.Hex = {
            /**
             * Converts a word array to a hex string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The hex string.
             *
             * @static
             *
             * @example
             *
             *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
             */
            stringify: function(wordArray) {
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var hexChars = [];
              for (var i2 = 0; i2 < sigBytes; i2++) {
                var bite = words[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255;
                hexChars.push((bite >>> 4).toString(16));
                hexChars.push((bite & 15).toString(16));
              }
              return hexChars.join("");
            },
            /**
             * Converts a hex string to a word array.
             *
             * @param {string} hexStr The hex string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
             */
            parse: function(hexStr) {
              var hexStrLength = hexStr.length;
              var words = [];
              for (var i2 = 0; i2 < hexStrLength; i2 += 2) {
                words[i2 >>> 3] |= parseInt(hexStr.substr(i2, 2), 16) << 24 - i2 % 8 * 4;
              }
              return new WordArray.init(words, hexStrLength / 2);
            }
          };
          var Latin1 = C_enc.Latin1 = {
            /**
             * Converts a word array to a Latin1 string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The Latin1 string.
             *
             * @static
             *
             * @example
             *
             *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
             */
            stringify: function(wordArray) {
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var latin1Chars = [];
              for (var i2 = 0; i2 < sigBytes; i2++) {
                var bite = words[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255;
                latin1Chars.push(String.fromCharCode(bite));
              }
              return latin1Chars.join("");
            },
            /**
             * Converts a Latin1 string to a word array.
             *
             * @param {string} latin1Str The Latin1 string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
             */
            parse: function(latin1Str) {
              var latin1StrLength = latin1Str.length;
              var words = [];
              for (var i2 = 0; i2 < latin1StrLength; i2++) {
                words[i2 >>> 2] |= (latin1Str.charCodeAt(i2) & 255) << 24 - i2 % 4 * 8;
              }
              return new WordArray.init(words, latin1StrLength);
            }
          };
          var Utf8 = C_enc.Utf8 = {
            /**
             * Converts a word array to a UTF-8 string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The UTF-8 string.
             *
             * @static
             *
             * @example
             *
             *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
             */
            stringify: function(wordArray) {
              try {
                return decodeURIComponent(escape(Latin1.stringify(wordArray)));
              } catch (e2) {
                throw new Error("Malformed UTF-8 data");
              }
            },
            /**
             * Converts a UTF-8 string to a word array.
             *
             * @param {string} utf8Str The UTF-8 string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
             */
            parse: function(utf8Str) {
              return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
            }
          };
          var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
            /**
             * Resets this block algorithm's data buffer to its initial state.
             *
             * @example
             *
             *     bufferedBlockAlgorithm.reset();
             */
            reset: function() {
              this._data = new WordArray.init();
              this._nDataBytes = 0;
            },
            /**
             * Adds new data to this block algorithm's buffer.
             *
             * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
             *
             * @example
             *
             *     bufferedBlockAlgorithm._append('data');
             *     bufferedBlockAlgorithm._append(wordArray);
             */
            _append: function(data) {
              if (typeof data == "string") {
                data = Utf8.parse(data);
              }
              this._data.concat(data);
              this._nDataBytes += data.sigBytes;
            },
            /**
             * Processes available data blocks.
             *
             * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
             *
             * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
             *
             * @return {WordArray} The processed data.
             *
             * @example
             *
             *     var processedData = bufferedBlockAlgorithm._process();
             *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
             */
            _process: function(doFlush) {
              var processedWords;
              var data = this._data;
              var dataWords = data.words;
              var dataSigBytes = data.sigBytes;
              var blockSize = this.blockSize;
              var blockSizeBytes = blockSize * 4;
              var nBlocksReady = dataSigBytes / blockSizeBytes;
              if (doFlush) {
                nBlocksReady = Math2.ceil(nBlocksReady);
              } else {
                nBlocksReady = Math2.max((nBlocksReady | 0) - this._minBufferSize, 0);
              }
              var nWordsReady = nBlocksReady * blockSize;
              var nBytesReady = Math2.min(nWordsReady * 4, dataSigBytes);
              if (nWordsReady) {
                for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                  this._doProcessBlock(dataWords, offset);
                }
                processedWords = dataWords.splice(0, nWordsReady);
                data.sigBytes -= nBytesReady;
              }
              return new WordArray.init(processedWords, nBytesReady);
            },
            /**
             * Creates a copy of this object.
             *
             * @return {Object} The clone.
             *
             * @example
             *
             *     var clone = bufferedBlockAlgorithm.clone();
             */
            clone: function() {
              var clone = Base.clone.call(this);
              clone._data = this._data.clone();
              return clone;
            },
            _minBufferSize: 0
          });
          C_lib.Hasher = BufferedBlockAlgorithm.extend({
            /**
             * Configuration options.
             */
            cfg: Base.extend(),
            /**
             * Initializes a newly created hasher.
             *
             * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
             *
             * @example
             *
             *     var hasher = CryptoJS.algo.SHA256.create();
             */
            init: function(cfg) {
              this.cfg = this.cfg.extend(cfg);
              this.reset();
            },
            /**
             * Resets this hasher to its initial state.
             *
             * @example
             *
             *     hasher.reset();
             */
            reset: function() {
              BufferedBlockAlgorithm.reset.call(this);
              this._doReset();
            },
            /**
             * Updates this hasher with a message.
             *
             * @param {WordArray|string} messageUpdate The message to append.
             *
             * @return {Hasher} This hasher.
             *
             * @example
             *
             *     hasher.update('message');
             *     hasher.update(wordArray);
             */
            update: function(messageUpdate) {
              this._append(messageUpdate);
              this._process();
              return this;
            },
            /**
             * Finalizes the hash computation.
             * Note that the finalize operation is effectively a destructive, read-once operation.
             *
             * @param {WordArray|string} messageUpdate (Optional) A final message update.
             *
             * @return {WordArray} The hash.
             *
             * @example
             *
             *     var hash = hasher.finalize();
             *     var hash = hasher.finalize('message');
             *     var hash = hasher.finalize(wordArray);
             */
            finalize: function(messageUpdate) {
              if (messageUpdate) {
                this._append(messageUpdate);
              }
              var hash = this._doFinalize();
              return hash;
            },
            blockSize: 512 / 32,
            /**
             * Creates a shortcut function to a hasher's object interface.
             *
             * @param {Hasher} hasher The hasher to create a helper for.
             *
             * @return {Function} The shortcut function.
             *
             * @static
             *
             * @example
             *
             *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
             */
            _createHelper: function(hasher) {
              return function(message, cfg) {
                return new hasher.init(cfg).finalize(message);
              };
            },
            /**
             * Creates a shortcut function to the HMAC's object interface.
             *
             * @param {Hasher} hasher The hasher to use in this HMAC helper.
             *
             * @return {Function} The shortcut function.
             *
             * @static
             *
             * @example
             *
             *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
             */
            _createHmacHelper: function(hasher) {
              return function(message, key) {
                return new C_algo.HMAC.init(hasher, key).finalize(message);
              };
            }
          });
          var C_algo = C2.algo = {};
          return C2;
        }(Math);
        return CryptoJS2;
      });
    })(core);
    return core.exports;
  }
  var x64Core = { exports: {} };
  var hasRequiredX64Core;
  function requireX64Core() {
    if (hasRequiredX64Core)
      return x64Core.exports;
    hasRequiredX64Core = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function(undefined$1) {
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var Base = C_lib.Base;
          var X32WordArray = C_lib.WordArray;
          var C_x64 = C2.x64 = {};
          C_x64.Word = Base.extend({
            /**
             * Initializes a newly created 64-bit word.
             *
             * @param {number} high The high 32 bits.
             * @param {number} low The low 32 bits.
             *
             * @example
             *
             *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
             */
            init: function(high, low) {
              this.high = high;
              this.low = low;
            }
            /**
             * Bitwise NOTs this word.
             *
             * @return {X64Word} A new x64-Word object after negating.
             *
             * @example
             *
             *     var negated = x64Word.not();
             */
            // not: function () {
            // var high = ~this.high;
            // var low = ~this.low;
            // return X64Word.create(high, low);
            // },
            /**
             * Bitwise ANDs this word with the passed word.
             *
             * @param {X64Word} word The x64-Word to AND with this word.
             *
             * @return {X64Word} A new x64-Word object after ANDing.
             *
             * @example
             *
             *     var anded = x64Word.and(anotherX64Word);
             */
            // and: function (word) {
            // var high = this.high & word.high;
            // var low = this.low & word.low;
            // return X64Word.create(high, low);
            // },
            /**
             * Bitwise ORs this word with the passed word.
             *
             * @param {X64Word} word The x64-Word to OR with this word.
             *
             * @return {X64Word} A new x64-Word object after ORing.
             *
             * @example
             *
             *     var ored = x64Word.or(anotherX64Word);
             */
            // or: function (word) {
            // var high = this.high | word.high;
            // var low = this.low | word.low;
            // return X64Word.create(high, low);
            // },
            /**
             * Bitwise XORs this word with the passed word.
             *
             * @param {X64Word} word The x64-Word to XOR with this word.
             *
             * @return {X64Word} A new x64-Word object after XORing.
             *
             * @example
             *
             *     var xored = x64Word.xor(anotherX64Word);
             */
            // xor: function (word) {
            // var high = this.high ^ word.high;
            // var low = this.low ^ word.low;
            // return X64Word.create(high, low);
            // },
            /**
             * Shifts this word n bits to the left.
             *
             * @param {number} n The number of bits to shift.
             *
             * @return {X64Word} A new x64-Word object after shifting.
             *
             * @example
             *
             *     var shifted = x64Word.shiftL(25);
             */
            // shiftL: function (n) {
            // if (n < 32) {
            // var high = (this.high << n) | (this.low >>> (32 - n));
            // var low = this.low << n;
            // } else {
            // var high = this.low << (n - 32);
            // var low = 0;
            // }
            // return X64Word.create(high, low);
            // },
            /**
             * Shifts this word n bits to the right.
             *
             * @param {number} n The number of bits to shift.
             *
             * @return {X64Word} A new x64-Word object after shifting.
             *
             * @example
             *
             *     var shifted = x64Word.shiftR(7);
             */
            // shiftR: function (n) {
            // if (n < 32) {
            // var low = (this.low >>> n) | (this.high << (32 - n));
            // var high = this.high >>> n;
            // } else {
            // var low = this.high >>> (n - 32);
            // var high = 0;
            // }
            // return X64Word.create(high, low);
            // },
            /**
             * Rotates this word n bits to the left.
             *
             * @param {number} n The number of bits to rotate.
             *
             * @return {X64Word} A new x64-Word object after rotating.
             *
             * @example
             *
             *     var rotated = x64Word.rotL(25);
             */
            // rotL: function (n) {
            // return this.shiftL(n).or(this.shiftR(64 - n));
            // },
            /**
             * Rotates this word n bits to the right.
             *
             * @param {number} n The number of bits to rotate.
             *
             * @return {X64Word} A new x64-Word object after rotating.
             *
             * @example
             *
             *     var rotated = x64Word.rotR(7);
             */
            // rotR: function (n) {
            // return this.shiftR(n).or(this.shiftL(64 - n));
            // },
            /**
             * Adds this word with the passed word.
             *
             * @param {X64Word} word The x64-Word to add with this word.
             *
             * @return {X64Word} A new x64-Word object after adding.
             *
             * @example
             *
             *     var added = x64Word.add(anotherX64Word);
             */
            // add: function (word) {
            // var low = (this.low + word.low) | 0;
            // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
            // var high = (this.high + word.high + carry) | 0;
            // return X64Word.create(high, low);
            // }
          });
          C_x64.WordArray = Base.extend({
            /**
             * Initializes a newly created word array.
             *
             * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
             * @param {number} sigBytes (Optional) The number of significant bytes in the words.
             *
             * @example
             *
             *     var wordArray = CryptoJS.x64.WordArray.create();
             *
             *     var wordArray = CryptoJS.x64.WordArray.create([
             *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
             *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
             *     ]);
             *
             *     var wordArray = CryptoJS.x64.WordArray.create([
             *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
             *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
             *     ], 10);
             */
            init: function(words, sigBytes) {
              words = this.words = words || [];
              if (sigBytes != undefined$1) {
                this.sigBytes = sigBytes;
              } else {
                this.sigBytes = words.length * 8;
              }
            },
            /**
             * Converts this 64-bit word array to a 32-bit word array.
             *
             * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
             *
             * @example
             *
             *     var x32WordArray = x64WordArray.toX32();
             */
            toX32: function() {
              var x64Words = this.words;
              var x64WordsLength = x64Words.length;
              var x32Words = [];
              for (var i2 = 0; i2 < x64WordsLength; i2++) {
                var x64Word = x64Words[i2];
                x32Words.push(x64Word.high);
                x32Words.push(x64Word.low);
              }
              return X32WordArray.create(x32Words, this.sigBytes);
            },
            /**
             * Creates a copy of this word array.
             *
             * @return {X64WordArray} The clone.
             *
             * @example
             *
             *     var clone = x64WordArray.clone();
             */
            clone: function() {
              var clone = Base.clone.call(this);
              var words = clone.words = this.words.slice(0);
              var wordsLength = words.length;
              for (var i2 = 0; i2 < wordsLength; i2++) {
                words[i2] = words[i2].clone();
              }
              return clone;
            }
          });
        })();
        return CryptoJS2;
      });
    })(x64Core);
    return x64Core.exports;
  }
  var libTypedarrays = { exports: {} };
  var hasRequiredLibTypedarrays;
  function requireLibTypedarrays() {
    if (hasRequiredLibTypedarrays)
      return libTypedarrays.exports;
    hasRequiredLibTypedarrays = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          if (typeof ArrayBuffer != "function") {
            return;
          }
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var WordArray = C_lib.WordArray;
          var superInit = WordArray.init;
          var subInit = WordArray.init = function(typedArray) {
            if (typedArray instanceof ArrayBuffer) {
              typedArray = new Uint8Array(typedArray);
            }
            if (typedArray instanceof Int8Array || typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray || typedArray instanceof Int16Array || typedArray instanceof Uint16Array || typedArray instanceof Int32Array || typedArray instanceof Uint32Array || typedArray instanceof Float32Array || typedArray instanceof Float64Array) {
              typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
            }
            if (typedArray instanceof Uint8Array) {
              var typedArrayByteLength = typedArray.byteLength;
              var words = [];
              for (var i2 = 0; i2 < typedArrayByteLength; i2++) {
                words[i2 >>> 2] |= typedArray[i2] << 24 - i2 % 4 * 8;
              }
              superInit.call(this, words, typedArrayByteLength);
            } else {
              superInit.apply(this, arguments);
            }
          };
          subInit.prototype = WordArray;
        })();
        return CryptoJS2.lib.WordArray;
      });
    })(libTypedarrays);
    return libTypedarrays.exports;
  }
  var encUtf16 = { exports: {} };
  var hasRequiredEncUtf16;
  function requireEncUtf16() {
    if (hasRequiredEncUtf16)
      return encUtf16.exports;
    hasRequiredEncUtf16 = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var WordArray = C_lib.WordArray;
          var C_enc = C2.enc;
          C_enc.Utf16 = C_enc.Utf16BE = {
            /**
             * Converts a word array to a UTF-16 BE string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The UTF-16 BE string.
             *
             * @static
             *
             * @example
             *
             *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
             */
            stringify: function(wordArray) {
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var utf16Chars = [];
              for (var i2 = 0; i2 < sigBytes; i2 += 2) {
                var codePoint = words[i2 >>> 2] >>> 16 - i2 % 4 * 8 & 65535;
                utf16Chars.push(String.fromCharCode(codePoint));
              }
              return utf16Chars.join("");
            },
            /**
             * Converts a UTF-16 BE string to a word array.
             *
             * @param {string} utf16Str The UTF-16 BE string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
             */
            parse: function(utf16Str) {
              var utf16StrLength = utf16Str.length;
              var words = [];
              for (var i2 = 0; i2 < utf16StrLength; i2++) {
                words[i2 >>> 1] |= utf16Str.charCodeAt(i2) << 16 - i2 % 2 * 16;
              }
              return WordArray.create(words, utf16StrLength * 2);
            }
          };
          C_enc.Utf16LE = {
            /**
             * Converts a word array to a UTF-16 LE string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The UTF-16 LE string.
             *
             * @static
             *
             * @example
             *
             *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
             */
            stringify: function(wordArray) {
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var utf16Chars = [];
              for (var i2 = 0; i2 < sigBytes; i2 += 2) {
                var codePoint = swapEndian(words[i2 >>> 2] >>> 16 - i2 % 4 * 8 & 65535);
                utf16Chars.push(String.fromCharCode(codePoint));
              }
              return utf16Chars.join("");
            },
            /**
             * Converts a UTF-16 LE string to a word array.
             *
             * @param {string} utf16Str The UTF-16 LE string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
             */
            parse: function(utf16Str) {
              var utf16StrLength = utf16Str.length;
              var words = [];
              for (var i2 = 0; i2 < utf16StrLength; i2++) {
                words[i2 >>> 1] |= swapEndian(utf16Str.charCodeAt(i2) << 16 - i2 % 2 * 16);
              }
              return WordArray.create(words, utf16StrLength * 2);
            }
          };
          function swapEndian(word) {
            return word << 8 & 4278255360 | word >>> 8 & 16711935;
          }
        })();
        return CryptoJS2.enc.Utf16;
      });
    })(encUtf16);
    return encUtf16.exports;
  }
  var encBase64 = { exports: {} };
  var hasRequiredEncBase64;
  function requireEncBase64() {
    if (hasRequiredEncBase64)
      return encBase64.exports;
    hasRequiredEncBase64 = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var WordArray = C_lib.WordArray;
          var C_enc = C2.enc;
          C_enc.Base64 = {
            /**
             * Converts a word array to a Base64 string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @return {string} The Base64 string.
             *
             * @static
             *
             * @example
             *
             *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
             */
            stringify: function(wordArray) {
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var map = this._map;
              wordArray.clamp();
              var base64Chars = [];
              for (var i2 = 0; i2 < sigBytes; i2 += 3) {
                var byte1 = words[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255;
                var byte2 = words[i2 + 1 >>> 2] >>> 24 - (i2 + 1) % 4 * 8 & 255;
                var byte3 = words[i2 + 2 >>> 2] >>> 24 - (i2 + 2) % 4 * 8 & 255;
                var triplet = byte1 << 16 | byte2 << 8 | byte3;
                for (var j2 = 0; j2 < 4 && i2 + j2 * 0.75 < sigBytes; j2++) {
                  base64Chars.push(map.charAt(triplet >>> 6 * (3 - j2) & 63));
                }
              }
              var paddingChar = map.charAt(64);
              if (paddingChar) {
                while (base64Chars.length % 4) {
                  base64Chars.push(paddingChar);
                }
              }
              return base64Chars.join("");
            },
            /**
             * Converts a Base64 string to a word array.
             *
             * @param {string} base64Str The Base64 string.
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
             */
            parse: function(base64Str) {
              var base64StrLength = base64Str.length;
              var map = this._map;
              var reverseMap = this._reverseMap;
              if (!reverseMap) {
                reverseMap = this._reverseMap = [];
                for (var j2 = 0; j2 < map.length; j2++) {
                  reverseMap[map.charCodeAt(j2)] = j2;
                }
              }
              var paddingChar = map.charAt(64);
              if (paddingChar) {
                var paddingIndex = base64Str.indexOf(paddingChar);
                if (paddingIndex !== -1) {
                  base64StrLength = paddingIndex;
                }
              }
              return parseLoop(base64Str, base64StrLength, reverseMap);
            },
            _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
          };
          function parseLoop(base64Str, base64StrLength, reverseMap) {
            var words = [];
            var nBytes = 0;
            for (var i2 = 0; i2 < base64StrLength; i2++) {
              if (i2 % 4) {
                var bits1 = reverseMap[base64Str.charCodeAt(i2 - 1)] << i2 % 4 * 2;
                var bits2 = reverseMap[base64Str.charCodeAt(i2)] >>> 6 - i2 % 4 * 2;
                var bitsCombined = bits1 | bits2;
                words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
                nBytes++;
              }
            }
            return WordArray.create(words, nBytes);
          }
        })();
        return CryptoJS2.enc.Base64;
      });
    })(encBase64);
    return encBase64.exports;
  }
  var encBase64url = { exports: {} };
  var hasRequiredEncBase64url;
  function requireEncBase64url() {
    if (hasRequiredEncBase64url)
      return encBase64url.exports;
    hasRequiredEncBase64url = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var WordArray = C_lib.WordArray;
          var C_enc = C2.enc;
          C_enc.Base64url = {
            /**
             * Converts a word array to a Base64url string.
             *
             * @param {WordArray} wordArray The word array.
             *
             * @param {boolean} urlSafe Whether to use url safe
             *
             * @return {string} The Base64url string.
             *
             * @static
             *
             * @example
             *
             *     var base64String = CryptoJS.enc.Base64url.stringify(wordArray);
             */
            stringify: function(wordArray, urlSafe) {
              if (urlSafe === void 0) {
                urlSafe = true;
              }
              var words = wordArray.words;
              var sigBytes = wordArray.sigBytes;
              var map = urlSafe ? this._safe_map : this._map;
              wordArray.clamp();
              var base64Chars = [];
              for (var i2 = 0; i2 < sigBytes; i2 += 3) {
                var byte1 = words[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255;
                var byte2 = words[i2 + 1 >>> 2] >>> 24 - (i2 + 1) % 4 * 8 & 255;
                var byte3 = words[i2 + 2 >>> 2] >>> 24 - (i2 + 2) % 4 * 8 & 255;
                var triplet = byte1 << 16 | byte2 << 8 | byte3;
                for (var j2 = 0; j2 < 4 && i2 + j2 * 0.75 < sigBytes; j2++) {
                  base64Chars.push(map.charAt(triplet >>> 6 * (3 - j2) & 63));
                }
              }
              var paddingChar = map.charAt(64);
              if (paddingChar) {
                while (base64Chars.length % 4) {
                  base64Chars.push(paddingChar);
                }
              }
              return base64Chars.join("");
            },
            /**
             * Converts a Base64url string to a word array.
             *
             * @param {string} base64Str The Base64url string.
             *
             * @param {boolean} urlSafe Whether to use url safe
             *
             * @return {WordArray} The word array.
             *
             * @static
             *
             * @example
             *
             *     var wordArray = CryptoJS.enc.Base64url.parse(base64String);
             */
            parse: function(base64Str, urlSafe) {
              if (urlSafe === void 0) {
                urlSafe = true;
              }
              var base64StrLength = base64Str.length;
              var map = urlSafe ? this._safe_map : this._map;
              var reverseMap = this._reverseMap;
              if (!reverseMap) {
                reverseMap = this._reverseMap = [];
                for (var j2 = 0; j2 < map.length; j2++) {
                  reverseMap[map.charCodeAt(j2)] = j2;
                }
              }
              var paddingChar = map.charAt(64);
              if (paddingChar) {
                var paddingIndex = base64Str.indexOf(paddingChar);
                if (paddingIndex !== -1) {
                  base64StrLength = paddingIndex;
                }
              }
              return parseLoop(base64Str, base64StrLength, reverseMap);
            },
            _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            _safe_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
          };
          function parseLoop(base64Str, base64StrLength, reverseMap) {
            var words = [];
            var nBytes = 0;
            for (var i2 = 0; i2 < base64StrLength; i2++) {
              if (i2 % 4) {
                var bits1 = reverseMap[base64Str.charCodeAt(i2 - 1)] << i2 % 4 * 2;
                var bits2 = reverseMap[base64Str.charCodeAt(i2)] >>> 6 - i2 % 4 * 2;
                var bitsCombined = bits1 | bits2;
                words[nBytes >>> 2] |= bitsCombined << 24 - nBytes % 4 * 8;
                nBytes++;
              }
            }
            return WordArray.create(words, nBytes);
          }
        })();
        return CryptoJS2.enc.Base64url;
      });
    })(encBase64url);
    return encBase64url.exports;
  }
  var md5 = { exports: {} };
  var hasRequiredMd5;
  function requireMd5() {
    if (hasRequiredMd5)
      return md5.exports;
    hasRequiredMd5 = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function(Math2) {
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_algo = C2.algo;
          var T2 = [];
          (function() {
            for (var i2 = 0; i2 < 64; i2++) {
              T2[i2] = Math2.abs(Math2.sin(i2 + 1)) * 4294967296 | 0;
            }
          })();
          var MD5 = C_algo.MD5 = Hasher.extend({
            _doReset: function() {
              this._hash = new WordArray.init([
                1732584193,
                4023233417,
                2562383102,
                271733878
              ]);
            },
            _doProcessBlock: function(M2, offset) {
              for (var i2 = 0; i2 < 16; i2++) {
                var offset_i = offset + i2;
                var M_offset_i = M2[offset_i];
                M2[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 16711935 | (M_offset_i << 24 | M_offset_i >>> 8) & 4278255360;
              }
              var H2 = this._hash.words;
              var M_offset_0 = M2[offset + 0];
              var M_offset_1 = M2[offset + 1];
              var M_offset_2 = M2[offset + 2];
              var M_offset_3 = M2[offset + 3];
              var M_offset_4 = M2[offset + 4];
              var M_offset_5 = M2[offset + 5];
              var M_offset_6 = M2[offset + 6];
              var M_offset_7 = M2[offset + 7];
              var M_offset_8 = M2[offset + 8];
              var M_offset_9 = M2[offset + 9];
              var M_offset_10 = M2[offset + 10];
              var M_offset_11 = M2[offset + 11];
              var M_offset_12 = M2[offset + 12];
              var M_offset_13 = M2[offset + 13];
              var M_offset_14 = M2[offset + 14];
              var M_offset_15 = M2[offset + 15];
              var a2 = H2[0];
              var b2 = H2[1];
              var c2 = H2[2];
              var d2 = H2[3];
              a2 = FF(a2, b2, c2, d2, M_offset_0, 7, T2[0]);
              d2 = FF(d2, a2, b2, c2, M_offset_1, 12, T2[1]);
              c2 = FF(c2, d2, a2, b2, M_offset_2, 17, T2[2]);
              b2 = FF(b2, c2, d2, a2, M_offset_3, 22, T2[3]);
              a2 = FF(a2, b2, c2, d2, M_offset_4, 7, T2[4]);
              d2 = FF(d2, a2, b2, c2, M_offset_5, 12, T2[5]);
              c2 = FF(c2, d2, a2, b2, M_offset_6, 17, T2[6]);
              b2 = FF(b2, c2, d2, a2, M_offset_7, 22, T2[7]);
              a2 = FF(a2, b2, c2, d2, M_offset_8, 7, T2[8]);
              d2 = FF(d2, a2, b2, c2, M_offset_9, 12, T2[9]);
              c2 = FF(c2, d2, a2, b2, M_offset_10, 17, T2[10]);
              b2 = FF(b2, c2, d2, a2, M_offset_11, 22, T2[11]);
              a2 = FF(a2, b2, c2, d2, M_offset_12, 7, T2[12]);
              d2 = FF(d2, a2, b2, c2, M_offset_13, 12, T2[13]);
              c2 = FF(c2, d2, a2, b2, M_offset_14, 17, T2[14]);
              b2 = FF(b2, c2, d2, a2, M_offset_15, 22, T2[15]);
              a2 = GG(a2, b2, c2, d2, M_offset_1, 5, T2[16]);
              d2 = GG(d2, a2, b2, c2, M_offset_6, 9, T2[17]);
              c2 = GG(c2, d2, a2, b2, M_offset_11, 14, T2[18]);
              b2 = GG(b2, c2, d2, a2, M_offset_0, 20, T2[19]);
              a2 = GG(a2, b2, c2, d2, M_offset_5, 5, T2[20]);
              d2 = GG(d2, a2, b2, c2, M_offset_10, 9, T2[21]);
              c2 = GG(c2, d2, a2, b2, M_offset_15, 14, T2[22]);
              b2 = GG(b2, c2, d2, a2, M_offset_4, 20, T2[23]);
              a2 = GG(a2, b2, c2, d2, M_offset_9, 5, T2[24]);
              d2 = GG(d2, a2, b2, c2, M_offset_14, 9, T2[25]);
              c2 = GG(c2, d2, a2, b2, M_offset_3, 14, T2[26]);
              b2 = GG(b2, c2, d2, a2, M_offset_8, 20, T2[27]);
              a2 = GG(a2, b2, c2, d2, M_offset_13, 5, T2[28]);
              d2 = GG(d2, a2, b2, c2, M_offset_2, 9, T2[29]);
              c2 = GG(c2, d2, a2, b2, M_offset_7, 14, T2[30]);
              b2 = GG(b2, c2, d2, a2, M_offset_12, 20, T2[31]);
              a2 = HH(a2, b2, c2, d2, M_offset_5, 4, T2[32]);
              d2 = HH(d2, a2, b2, c2, M_offset_8, 11, T2[33]);
              c2 = HH(c2, d2, a2, b2, M_offset_11, 16, T2[34]);
              b2 = HH(b2, c2, d2, a2, M_offset_14, 23, T2[35]);
              a2 = HH(a2, b2, c2, d2, M_offset_1, 4, T2[36]);
              d2 = HH(d2, a2, b2, c2, M_offset_4, 11, T2[37]);
              c2 = HH(c2, d2, a2, b2, M_offset_7, 16, T2[38]);
              b2 = HH(b2, c2, d2, a2, M_offset_10, 23, T2[39]);
              a2 = HH(a2, b2, c2, d2, M_offset_13, 4, T2[40]);
              d2 = HH(d2, a2, b2, c2, M_offset_0, 11, T2[41]);
              c2 = HH(c2, d2, a2, b2, M_offset_3, 16, T2[42]);
              b2 = HH(b2, c2, d2, a2, M_offset_6, 23, T2[43]);
              a2 = HH(a2, b2, c2, d2, M_offset_9, 4, T2[44]);
              d2 = HH(d2, a2, b2, c2, M_offset_12, 11, T2[45]);
              c2 = HH(c2, d2, a2, b2, M_offset_15, 16, T2[46]);
              b2 = HH(b2, c2, d2, a2, M_offset_2, 23, T2[47]);
              a2 = II(a2, b2, c2, d2, M_offset_0, 6, T2[48]);
              d2 = II(d2, a2, b2, c2, M_offset_7, 10, T2[49]);
              c2 = II(c2, d2, a2, b2, M_offset_14, 15, T2[50]);
              b2 = II(b2, c2, d2, a2, M_offset_5, 21, T2[51]);
              a2 = II(a2, b2, c2, d2, M_offset_12, 6, T2[52]);
              d2 = II(d2, a2, b2, c2, M_offset_3, 10, T2[53]);
              c2 = II(c2, d2, a2, b2, M_offset_10, 15, T2[54]);
              b2 = II(b2, c2, d2, a2, M_offset_1, 21, T2[55]);
              a2 = II(a2, b2, c2, d2, M_offset_8, 6, T2[56]);
              d2 = II(d2, a2, b2, c2, M_offset_15, 10, T2[57]);
              c2 = II(c2, d2, a2, b2, M_offset_6, 15, T2[58]);
              b2 = II(b2, c2, d2, a2, M_offset_13, 21, T2[59]);
              a2 = II(a2, b2, c2, d2, M_offset_4, 6, T2[60]);
              d2 = II(d2, a2, b2, c2, M_offset_11, 10, T2[61]);
              c2 = II(c2, d2, a2, b2, M_offset_2, 15, T2[62]);
              b2 = II(b2, c2, d2, a2, M_offset_9, 21, T2[63]);
              H2[0] = H2[0] + a2 | 0;
              H2[1] = H2[1] + b2 | 0;
              H2[2] = H2[2] + c2 | 0;
              H2[3] = H2[3] + d2 | 0;
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
              var nBitsTotalH = Math2.floor(nBitsTotal / 4294967296);
              var nBitsTotalL = nBitsTotal;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = (nBitsTotalH << 8 | nBitsTotalH >>> 24) & 16711935 | (nBitsTotalH << 24 | nBitsTotalH >>> 8) & 4278255360;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotalL << 8 | nBitsTotalL >>> 24) & 16711935 | (nBitsTotalL << 24 | nBitsTotalL >>> 8) & 4278255360;
              data.sigBytes = (dataWords.length + 1) * 4;
              this._process();
              var hash = this._hash;
              var H2 = hash.words;
              for (var i2 = 0; i2 < 4; i2++) {
                var H_i = H2[i2];
                H2[i2] = (H_i << 8 | H_i >>> 24) & 16711935 | (H_i << 24 | H_i >>> 8) & 4278255360;
              }
              return hash;
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            }
          });
          function FF(a2, b2, c2, d2, x, s2, t2) {
            var n2 = a2 + (b2 & c2 | ~b2 & d2) + x + t2;
            return (n2 << s2 | n2 >>> 32 - s2) + b2;
          }
          function GG(a2, b2, c2, d2, x, s2, t2) {
            var n2 = a2 + (b2 & d2 | c2 & ~d2) + x + t2;
            return (n2 << s2 | n2 >>> 32 - s2) + b2;
          }
          function HH(a2, b2, c2, d2, x, s2, t2) {
            var n2 = a2 + (b2 ^ c2 ^ d2) + x + t2;
            return (n2 << s2 | n2 >>> 32 - s2) + b2;
          }
          function II(a2, b2, c2, d2, x, s2, t2) {
            var n2 = a2 + (c2 ^ (b2 | ~d2)) + x + t2;
            return (n2 << s2 | n2 >>> 32 - s2) + b2;
          }
          C2.MD5 = Hasher._createHelper(MD5);
          C2.HmacMD5 = Hasher._createHmacHelper(MD5);
        })(Math);
        return CryptoJS2.MD5;
      });
    })(md5);
    return md5.exports;
  }
  var sha1 = { exports: {} };
  var hasRequiredSha1;
  function requireSha1() {
    if (hasRequiredSha1)
      return sha1.exports;
    hasRequiredSha1 = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_algo = C2.algo;
          var W2 = [];
          var SHA1 = C_algo.SHA1 = Hasher.extend({
            _doReset: function() {
              this._hash = new WordArray.init([
                1732584193,
                4023233417,
                2562383102,
                271733878,
                3285377520
              ]);
            },
            _doProcessBlock: function(M2, offset) {
              var H2 = this._hash.words;
              var a2 = H2[0];
              var b2 = H2[1];
              var c2 = H2[2];
              var d2 = H2[3];
              var e2 = H2[4];
              for (var i2 = 0; i2 < 80; i2++) {
                if (i2 < 16) {
                  W2[i2] = M2[offset + i2] | 0;
                } else {
                  var n2 = W2[i2 - 3] ^ W2[i2 - 8] ^ W2[i2 - 14] ^ W2[i2 - 16];
                  W2[i2] = n2 << 1 | n2 >>> 31;
                }
                var t2 = (a2 << 5 | a2 >>> 27) + e2 + W2[i2];
                if (i2 < 20) {
                  t2 += (b2 & c2 | ~b2 & d2) + 1518500249;
                } else if (i2 < 40) {
                  t2 += (b2 ^ c2 ^ d2) + 1859775393;
                } else if (i2 < 60) {
                  t2 += (b2 & c2 | b2 & d2 | c2 & d2) - 1894007588;
                } else {
                  t2 += (b2 ^ c2 ^ d2) - 899497514;
                }
                e2 = d2;
                d2 = c2;
                c2 = b2 << 30 | b2 >>> 2;
                b2 = a2;
                a2 = t2;
              }
              H2[0] = H2[0] + a2 | 0;
              H2[1] = H2[1] + b2 | 0;
              H2[2] = H2[2] + c2 | 0;
              H2[3] = H2[3] + d2 | 0;
              H2[4] = H2[4] + e2 | 0;
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math.floor(nBitsTotal / 4294967296);
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
              data.sigBytes = dataWords.length * 4;
              this._process();
              return this._hash;
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            }
          });
          C2.SHA1 = Hasher._createHelper(SHA1);
          C2.HmacSHA1 = Hasher._createHmacHelper(SHA1);
        })();
        return CryptoJS2.SHA1;
      });
    })(sha1);
    return sha1.exports;
  }
  var sha256 = { exports: {} };
  var hasRequiredSha256;
  function requireSha256() {
    if (hasRequiredSha256)
      return sha256.exports;
    hasRequiredSha256 = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function(Math2) {
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_algo = C2.algo;
          var H2 = [];
          var K2 = [];
          (function() {
            function isPrime(n3) {
              var sqrtN = Math2.sqrt(n3);
              for (var factor = 2; factor <= sqrtN; factor++) {
                if (!(n3 % factor)) {
                  return false;
                }
              }
              return true;
            }
            function getFractionalBits(n3) {
              return (n3 - (n3 | 0)) * 4294967296 | 0;
            }
            var n2 = 2;
            var nPrime = 0;
            while (nPrime < 64) {
              if (isPrime(n2)) {
                if (nPrime < 8) {
                  H2[nPrime] = getFractionalBits(Math2.pow(n2, 1 / 2));
                }
                K2[nPrime] = getFractionalBits(Math2.pow(n2, 1 / 3));
                nPrime++;
              }
              n2++;
            }
          })();
          var W2 = [];
          var SHA256 = C_algo.SHA256 = Hasher.extend({
            _doReset: function() {
              this._hash = new WordArray.init(H2.slice(0));
            },
            _doProcessBlock: function(M2, offset) {
              var H3 = this._hash.words;
              var a2 = H3[0];
              var b2 = H3[1];
              var c2 = H3[2];
              var d2 = H3[3];
              var e2 = H3[4];
              var f2 = H3[5];
              var g2 = H3[6];
              var h2 = H3[7];
              for (var i2 = 0; i2 < 64; i2++) {
                if (i2 < 16) {
                  W2[i2] = M2[offset + i2] | 0;
                } else {
                  var gamma0x = W2[i2 - 15];
                  var gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;
                  var gamma1x = W2[i2 - 2];
                  var gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;
                  W2[i2] = gamma0 + W2[i2 - 7] + gamma1 + W2[i2 - 16];
                }
                var ch = e2 & f2 ^ ~e2 & g2;
                var maj = a2 & b2 ^ a2 & c2 ^ b2 & c2;
                var sigma0 = (a2 << 30 | a2 >>> 2) ^ (a2 << 19 | a2 >>> 13) ^ (a2 << 10 | a2 >>> 22);
                var sigma1 = (e2 << 26 | e2 >>> 6) ^ (e2 << 21 | e2 >>> 11) ^ (e2 << 7 | e2 >>> 25);
                var t1 = h2 + sigma1 + ch + K2[i2] + W2[i2];
                var t2 = sigma0 + maj;
                h2 = g2;
                g2 = f2;
                f2 = e2;
                e2 = d2 + t1 | 0;
                d2 = c2;
                c2 = b2;
                b2 = a2;
                a2 = t1 + t2 | 0;
              }
              H3[0] = H3[0] + a2 | 0;
              H3[1] = H3[1] + b2 | 0;
              H3[2] = H3[2] + c2 | 0;
              H3[3] = H3[3] + d2 | 0;
              H3[4] = H3[4] + e2 | 0;
              H3[5] = H3[5] + f2 | 0;
              H3[6] = H3[6] + g2 | 0;
              H3[7] = H3[7] + h2 | 0;
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = Math2.floor(nBitsTotal / 4294967296);
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 15] = nBitsTotal;
              data.sigBytes = dataWords.length * 4;
              this._process();
              return this._hash;
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            }
          });
          C2.SHA256 = Hasher._createHelper(SHA256);
          C2.HmacSHA256 = Hasher._createHmacHelper(SHA256);
        })(Math);
        return CryptoJS2.SHA256;
      });
    })(sha256);
    return sha256.exports;
  }
  var sha224 = { exports: {} };
  var hasRequiredSha224;
  function requireSha224() {
    if (hasRequiredSha224)
      return sha224.exports;
    hasRequiredSha224 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireSha256());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var WordArray = C_lib.WordArray;
          var C_algo = C2.algo;
          var SHA256 = C_algo.SHA256;
          var SHA224 = C_algo.SHA224 = SHA256.extend({
            _doReset: function() {
              this._hash = new WordArray.init([
                3238371032,
                914150663,
                812702999,
                4144912697,
                4290775857,
                1750603025,
                1694076839,
                3204075428
              ]);
            },
            _doFinalize: function() {
              var hash = SHA256._doFinalize.call(this);
              hash.sigBytes -= 4;
              return hash;
            }
          });
          C2.SHA224 = SHA256._createHelper(SHA224);
          C2.HmacSHA224 = SHA256._createHmacHelper(SHA224);
        })();
        return CryptoJS2.SHA224;
      });
    })(sha224);
    return sha224.exports;
  }
  var sha512 = { exports: {} };
  var hasRequiredSha512;
  function requireSha512() {
    if (hasRequiredSha512)
      return sha512.exports;
    hasRequiredSha512 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireX64Core());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var Hasher = C_lib.Hasher;
          var C_x64 = C2.x64;
          var X64Word = C_x64.Word;
          var X64WordArray = C_x64.WordArray;
          var C_algo = C2.algo;
          function X64Word_create() {
            return X64Word.create.apply(X64Word, arguments);
          }
          var K2 = [
            X64Word_create(1116352408, 3609767458),
            X64Word_create(1899447441, 602891725),
            X64Word_create(3049323471, 3964484399),
            X64Word_create(3921009573, 2173295548),
            X64Word_create(961987163, 4081628472),
            X64Word_create(1508970993, 3053834265),
            X64Word_create(2453635748, 2937671579),
            X64Word_create(2870763221, 3664609560),
            X64Word_create(3624381080, 2734883394),
            X64Word_create(310598401, 1164996542),
            X64Word_create(607225278, 1323610764),
            X64Word_create(1426881987, 3590304994),
            X64Word_create(1925078388, 4068182383),
            X64Word_create(2162078206, 991336113),
            X64Word_create(2614888103, 633803317),
            X64Word_create(3248222580, 3479774868),
            X64Word_create(3835390401, 2666613458),
            X64Word_create(4022224774, 944711139),
            X64Word_create(264347078, 2341262773),
            X64Word_create(604807628, 2007800933),
            X64Word_create(770255983, 1495990901),
            X64Word_create(1249150122, 1856431235),
            X64Word_create(1555081692, 3175218132),
            X64Word_create(1996064986, 2198950837),
            X64Word_create(2554220882, 3999719339),
            X64Word_create(2821834349, 766784016),
            X64Word_create(2952996808, 2566594879),
            X64Word_create(3210313671, 3203337956),
            X64Word_create(3336571891, 1034457026),
            X64Word_create(3584528711, 2466948901),
            X64Word_create(113926993, 3758326383),
            X64Word_create(338241895, 168717936),
            X64Word_create(666307205, 1188179964),
            X64Word_create(773529912, 1546045734),
            X64Word_create(1294757372, 1522805485),
            X64Word_create(1396182291, 2643833823),
            X64Word_create(1695183700, 2343527390),
            X64Word_create(1986661051, 1014477480),
            X64Word_create(2177026350, 1206759142),
            X64Word_create(2456956037, 344077627),
            X64Word_create(2730485921, 1290863460),
            X64Word_create(2820302411, 3158454273),
            X64Word_create(3259730800, 3505952657),
            X64Word_create(3345764771, 106217008),
            X64Word_create(3516065817, 3606008344),
            X64Word_create(3600352804, 1432725776),
            X64Word_create(4094571909, 1467031594),
            X64Word_create(275423344, 851169720),
            X64Word_create(430227734, 3100823752),
            X64Word_create(506948616, 1363258195),
            X64Word_create(659060556, 3750685593),
            X64Word_create(883997877, 3785050280),
            X64Word_create(958139571, 3318307427),
            X64Word_create(1322822218, 3812723403),
            X64Word_create(1537002063, 2003034995),
            X64Word_create(1747873779, 3602036899),
            X64Word_create(1955562222, 1575990012),
            X64Word_create(2024104815, 1125592928),
            X64Word_create(2227730452, 2716904306),
            X64Word_create(2361852424, 442776044),
            X64Word_create(2428436474, 593698344),
            X64Word_create(2756734187, 3733110249),
            X64Word_create(3204031479, 2999351573),
            X64Word_create(3329325298, 3815920427),
            X64Word_create(3391569614, 3928383900),
            X64Word_create(3515267271, 566280711),
            X64Word_create(3940187606, 3454069534),
            X64Word_create(4118630271, 4000239992),
            X64Word_create(116418474, 1914138554),
            X64Word_create(174292421, 2731055270),
            X64Word_create(289380356, 3203993006),
            X64Word_create(460393269, 320620315),
            X64Word_create(685471733, 587496836),
            X64Word_create(852142971, 1086792851),
            X64Word_create(1017036298, 365543100),
            X64Word_create(1126000580, 2618297676),
            X64Word_create(1288033470, 3409855158),
            X64Word_create(1501505948, 4234509866),
            X64Word_create(1607167915, 987167468),
            X64Word_create(1816402316, 1246189591)
          ];
          var W2 = [];
          (function() {
            for (var i2 = 0; i2 < 80; i2++) {
              W2[i2] = X64Word_create();
            }
          })();
          var SHA512 = C_algo.SHA512 = Hasher.extend({
            _doReset: function() {
              this._hash = new X64WordArray.init([
                new X64Word.init(1779033703, 4089235720),
                new X64Word.init(3144134277, 2227873595),
                new X64Word.init(1013904242, 4271175723),
                new X64Word.init(2773480762, 1595750129),
                new X64Word.init(1359893119, 2917565137),
                new X64Word.init(2600822924, 725511199),
                new X64Word.init(528734635, 4215389547),
                new X64Word.init(1541459225, 327033209)
              ]);
            },
            _doProcessBlock: function(M2, offset) {
              var H2 = this._hash.words;
              var H0 = H2[0];
              var H1 = H2[1];
              var H22 = H2[2];
              var H3 = H2[3];
              var H4 = H2[4];
              var H5 = H2[5];
              var H6 = H2[6];
              var H7 = H2[7];
              var H0h = H0.high;
              var H0l = H0.low;
              var H1h = H1.high;
              var H1l = H1.low;
              var H2h = H22.high;
              var H2l = H22.low;
              var H3h = H3.high;
              var H3l = H3.low;
              var H4h = H4.high;
              var H4l = H4.low;
              var H5h = H5.high;
              var H5l = H5.low;
              var H6h = H6.high;
              var H6l = H6.low;
              var H7h = H7.high;
              var H7l = H7.low;
              var ah = H0h;
              var al = H0l;
              var bh = H1h;
              var bl = H1l;
              var ch = H2h;
              var cl = H2l;
              var dh = H3h;
              var dl = H3l;
              var eh = H4h;
              var el = H4l;
              var fh = H5h;
              var fl = H5l;
              var gh = H6h;
              var gl = H6l;
              var hh = H7h;
              var hl = H7l;
              for (var i2 = 0; i2 < 80; i2++) {
                var Wil;
                var Wih;
                var Wi = W2[i2];
                if (i2 < 16) {
                  Wih = Wi.high = M2[offset + i2 * 2] | 0;
                  Wil = Wi.low = M2[offset + i2 * 2 + 1] | 0;
                } else {
                  var gamma0x = W2[i2 - 15];
                  var gamma0xh = gamma0x.high;
                  var gamma0xl = gamma0x.low;
                  var gamma0h = (gamma0xh >>> 1 | gamma0xl << 31) ^ (gamma0xh >>> 8 | gamma0xl << 24) ^ gamma0xh >>> 7;
                  var gamma0l = (gamma0xl >>> 1 | gamma0xh << 31) ^ (gamma0xl >>> 8 | gamma0xh << 24) ^ (gamma0xl >>> 7 | gamma0xh << 25);
                  var gamma1x = W2[i2 - 2];
                  var gamma1xh = gamma1x.high;
                  var gamma1xl = gamma1x.low;
                  var gamma1h = (gamma1xh >>> 19 | gamma1xl << 13) ^ (gamma1xh << 3 | gamma1xl >>> 29) ^ gamma1xh >>> 6;
                  var gamma1l = (gamma1xl >>> 19 | gamma1xh << 13) ^ (gamma1xl << 3 | gamma1xh >>> 29) ^ (gamma1xl >>> 6 | gamma1xh << 26);
                  var Wi7 = W2[i2 - 7];
                  var Wi7h = Wi7.high;
                  var Wi7l = Wi7.low;
                  var Wi16 = W2[i2 - 16];
                  var Wi16h = Wi16.high;
                  var Wi16l = Wi16.low;
                  Wil = gamma0l + Wi7l;
                  Wih = gamma0h + Wi7h + (Wil >>> 0 < gamma0l >>> 0 ? 1 : 0);
                  Wil = Wil + gamma1l;
                  Wih = Wih + gamma1h + (Wil >>> 0 < gamma1l >>> 0 ? 1 : 0);
                  Wil = Wil + Wi16l;
                  Wih = Wih + Wi16h + (Wil >>> 0 < Wi16l >>> 0 ? 1 : 0);
                  Wi.high = Wih;
                  Wi.low = Wil;
                }
                var chh = eh & fh ^ ~eh & gh;
                var chl = el & fl ^ ~el & gl;
                var majh = ah & bh ^ ah & ch ^ bh & ch;
                var majl = al & bl ^ al & cl ^ bl & cl;
                var sigma0h = (ah >>> 28 | al << 4) ^ (ah << 30 | al >>> 2) ^ (ah << 25 | al >>> 7);
                var sigma0l = (al >>> 28 | ah << 4) ^ (al << 30 | ah >>> 2) ^ (al << 25 | ah >>> 7);
                var sigma1h = (eh >>> 14 | el << 18) ^ (eh >>> 18 | el << 14) ^ (eh << 23 | el >>> 9);
                var sigma1l = (el >>> 14 | eh << 18) ^ (el >>> 18 | eh << 14) ^ (el << 23 | eh >>> 9);
                var Ki = K2[i2];
                var Kih = Ki.high;
                var Kil = Ki.low;
                var t1l = hl + sigma1l;
                var t1h = hh + sigma1h + (t1l >>> 0 < hl >>> 0 ? 1 : 0);
                var t1l = t1l + chl;
                var t1h = t1h + chh + (t1l >>> 0 < chl >>> 0 ? 1 : 0);
                var t1l = t1l + Kil;
                var t1h = t1h + Kih + (t1l >>> 0 < Kil >>> 0 ? 1 : 0);
                var t1l = t1l + Wil;
                var t1h = t1h + Wih + (t1l >>> 0 < Wil >>> 0 ? 1 : 0);
                var t2l = sigma0l + majl;
                var t2h = sigma0h + majh + (t2l >>> 0 < sigma0l >>> 0 ? 1 : 0);
                hh = gh;
                hl = gl;
                gh = fh;
                gl = fl;
                fh = eh;
                fl = el;
                el = dl + t1l | 0;
                eh = dh + t1h + (el >>> 0 < dl >>> 0 ? 1 : 0) | 0;
                dh = ch;
                dl = cl;
                ch = bh;
                cl = bl;
                bh = ah;
                bl = al;
                al = t1l + t2l | 0;
                ah = t1h + t2h + (al >>> 0 < t1l >>> 0 ? 1 : 0) | 0;
              }
              H0l = H0.low = H0l + al;
              H0.high = H0h + ah + (H0l >>> 0 < al >>> 0 ? 1 : 0);
              H1l = H1.low = H1l + bl;
              H1.high = H1h + bh + (H1l >>> 0 < bl >>> 0 ? 1 : 0);
              H2l = H22.low = H2l + cl;
              H22.high = H2h + ch + (H2l >>> 0 < cl >>> 0 ? 1 : 0);
              H3l = H3.low = H3l + dl;
              H3.high = H3h + dh + (H3l >>> 0 < dl >>> 0 ? 1 : 0);
              H4l = H4.low = H4l + el;
              H4.high = H4h + eh + (H4l >>> 0 < el >>> 0 ? 1 : 0);
              H5l = H5.low = H5l + fl;
              H5.high = H5h + fh + (H5l >>> 0 < fl >>> 0 ? 1 : 0);
              H6l = H6.low = H6l + gl;
              H6.high = H6h + gh + (H6l >>> 0 < gl >>> 0 ? 1 : 0);
              H7l = H7.low = H7l + hl;
              H7.high = H7h + hh + (H7l >>> 0 < hl >>> 0 ? 1 : 0);
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
              dataWords[(nBitsLeft + 128 >>> 10 << 5) + 30] = Math.floor(nBitsTotal / 4294967296);
              dataWords[(nBitsLeft + 128 >>> 10 << 5) + 31] = nBitsTotal;
              data.sigBytes = dataWords.length * 4;
              this._process();
              var hash = this._hash.toX32();
              return hash;
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            },
            blockSize: 1024 / 32
          });
          C2.SHA512 = Hasher._createHelper(SHA512);
          C2.HmacSHA512 = Hasher._createHmacHelper(SHA512);
        })();
        return CryptoJS2.SHA512;
      });
    })(sha512);
    return sha512.exports;
  }
  var sha384 = { exports: {} };
  var hasRequiredSha384;
  function requireSha384() {
    if (hasRequiredSha384)
      return sha384.exports;
    hasRequiredSha384 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireX64Core(), requireSha512());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C2 = CryptoJS2;
          var C_x64 = C2.x64;
          var X64Word = C_x64.Word;
          var X64WordArray = C_x64.WordArray;
          var C_algo = C2.algo;
          var SHA512 = C_algo.SHA512;
          var SHA384 = C_algo.SHA384 = SHA512.extend({
            _doReset: function() {
              this._hash = new X64WordArray.init([
                new X64Word.init(3418070365, 3238371032),
                new X64Word.init(1654270250, 914150663),
                new X64Word.init(2438529370, 812702999),
                new X64Word.init(355462360, 4144912697),
                new X64Word.init(1731405415, 4290775857),
                new X64Word.init(2394180231, 1750603025),
                new X64Word.init(3675008525, 1694076839),
                new X64Word.init(1203062813, 3204075428)
              ]);
            },
            _doFinalize: function() {
              var hash = SHA512._doFinalize.call(this);
              hash.sigBytes -= 16;
              return hash;
            }
          });
          C2.SHA384 = SHA512._createHelper(SHA384);
          C2.HmacSHA384 = SHA512._createHmacHelper(SHA384);
        })();
        return CryptoJS2.SHA384;
      });
    })(sha384);
    return sha384.exports;
  }
  var sha3 = { exports: {} };
  var hasRequiredSha3;
  function requireSha3() {
    if (hasRequiredSha3)
      return sha3.exports;
    hasRequiredSha3 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireX64Core());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function(Math2) {
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_x64 = C2.x64;
          var X64Word = C_x64.Word;
          var C_algo = C2.algo;
          var RHO_OFFSETS = [];
          var PI_INDEXES = [];
          var ROUND_CONSTANTS = [];
          (function() {
            var x = 1, y2 = 0;
            for (var t2 = 0; t2 < 24; t2++) {
              RHO_OFFSETS[x + 5 * y2] = (t2 + 1) * (t2 + 2) / 2 % 64;
              var newX = y2 % 5;
              var newY = (2 * x + 3 * y2) % 5;
              x = newX;
              y2 = newY;
            }
            for (var x = 0; x < 5; x++) {
              for (var y2 = 0; y2 < 5; y2++) {
                PI_INDEXES[x + 5 * y2] = y2 + (2 * x + 3 * y2) % 5 * 5;
              }
            }
            var LFSR = 1;
            for (var i2 = 0; i2 < 24; i2++) {
              var roundConstantMsw = 0;
              var roundConstantLsw = 0;
              for (var j2 = 0; j2 < 7; j2++) {
                if (LFSR & 1) {
                  var bitPosition = (1 << j2) - 1;
                  if (bitPosition < 32) {
                    roundConstantLsw ^= 1 << bitPosition;
                  } else {
                    roundConstantMsw ^= 1 << bitPosition - 32;
                  }
                }
                if (LFSR & 128) {
                  LFSR = LFSR << 1 ^ 113;
                } else {
                  LFSR <<= 1;
                }
              }
              ROUND_CONSTANTS[i2] = X64Word.create(roundConstantMsw, roundConstantLsw);
            }
          })();
          var T2 = [];
          (function() {
            for (var i2 = 0; i2 < 25; i2++) {
              T2[i2] = X64Word.create();
            }
          })();
          var SHA3 = C_algo.SHA3 = Hasher.extend({
            /**
             * Configuration options.
             *
             * @property {number} outputLength
             *   The desired number of bits in the output hash.
             *   Only values permitted are: 224, 256, 384, 512.
             *   Default: 512
             */
            cfg: Hasher.cfg.extend({
              outputLength: 512
            }),
            _doReset: function() {
              var state = this._state = [];
              for (var i2 = 0; i2 < 25; i2++) {
                state[i2] = new X64Word.init();
              }
              this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
            },
            _doProcessBlock: function(M2, offset) {
              var state = this._state;
              var nBlockSizeLanes = this.blockSize / 2;
              for (var i2 = 0; i2 < nBlockSizeLanes; i2++) {
                var M2i = M2[offset + 2 * i2];
                var M2i1 = M2[offset + 2 * i2 + 1];
                M2i = (M2i << 8 | M2i >>> 24) & 16711935 | (M2i << 24 | M2i >>> 8) & 4278255360;
                M2i1 = (M2i1 << 8 | M2i1 >>> 24) & 16711935 | (M2i1 << 24 | M2i1 >>> 8) & 4278255360;
                var lane = state[i2];
                lane.high ^= M2i1;
                lane.low ^= M2i;
              }
              for (var round = 0; round < 24; round++) {
                for (var x = 0; x < 5; x++) {
                  var tMsw = 0, tLsw = 0;
                  for (var y2 = 0; y2 < 5; y2++) {
                    var lane = state[x + 5 * y2];
                    tMsw ^= lane.high;
                    tLsw ^= lane.low;
                  }
                  var Tx = T2[x];
                  Tx.high = tMsw;
                  Tx.low = tLsw;
                }
                for (var x = 0; x < 5; x++) {
                  var Tx4 = T2[(x + 4) % 5];
                  var Tx1 = T2[(x + 1) % 5];
                  var Tx1Msw = Tx1.high;
                  var Tx1Lsw = Tx1.low;
                  var tMsw = Tx4.high ^ (Tx1Msw << 1 | Tx1Lsw >>> 31);
                  var tLsw = Tx4.low ^ (Tx1Lsw << 1 | Tx1Msw >>> 31);
                  for (var y2 = 0; y2 < 5; y2++) {
                    var lane = state[x + 5 * y2];
                    lane.high ^= tMsw;
                    lane.low ^= tLsw;
                  }
                }
                for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
                  var tMsw;
                  var tLsw;
                  var lane = state[laneIndex];
                  var laneMsw = lane.high;
                  var laneLsw = lane.low;
                  var rhoOffset = RHO_OFFSETS[laneIndex];
                  if (rhoOffset < 32) {
                    tMsw = laneMsw << rhoOffset | laneLsw >>> 32 - rhoOffset;
                    tLsw = laneLsw << rhoOffset | laneMsw >>> 32 - rhoOffset;
                  } else {
                    tMsw = laneLsw << rhoOffset - 32 | laneMsw >>> 64 - rhoOffset;
                    tLsw = laneMsw << rhoOffset - 32 | laneLsw >>> 64 - rhoOffset;
                  }
                  var TPiLane = T2[PI_INDEXES[laneIndex]];
                  TPiLane.high = tMsw;
                  TPiLane.low = tLsw;
                }
                var T0 = T2[0];
                var state0 = state[0];
                T0.high = state0.high;
                T0.low = state0.low;
                for (var x = 0; x < 5; x++) {
                  for (var y2 = 0; y2 < 5; y2++) {
                    var laneIndex = x + 5 * y2;
                    var lane = state[laneIndex];
                    var TLane = T2[laneIndex];
                    var Tx1Lane = T2[(x + 1) % 5 + 5 * y2];
                    var Tx2Lane = T2[(x + 2) % 5 + 5 * y2];
                    lane.high = TLane.high ^ ~Tx1Lane.high & Tx2Lane.high;
                    lane.low = TLane.low ^ ~Tx1Lane.low & Tx2Lane.low;
                  }
                }
                var lane = state[0];
                var roundConstant = ROUND_CONSTANTS[round];
                lane.high ^= roundConstant.high;
                lane.low ^= roundConstant.low;
              }
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              var blockSizeBits = this.blockSize * 32;
              dataWords[nBitsLeft >>> 5] |= 1 << 24 - nBitsLeft % 32;
              dataWords[(Math2.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits >>> 5) - 1] |= 128;
              data.sigBytes = dataWords.length * 4;
              this._process();
              var state = this._state;
              var outputLengthBytes = this.cfg.outputLength / 8;
              var outputLengthLanes = outputLengthBytes / 8;
              var hashWords = [];
              for (var i2 = 0; i2 < outputLengthLanes; i2++) {
                var lane = state[i2];
                var laneMsw = lane.high;
                var laneLsw = lane.low;
                laneMsw = (laneMsw << 8 | laneMsw >>> 24) & 16711935 | (laneMsw << 24 | laneMsw >>> 8) & 4278255360;
                laneLsw = (laneLsw << 8 | laneLsw >>> 24) & 16711935 | (laneLsw << 24 | laneLsw >>> 8) & 4278255360;
                hashWords.push(laneLsw);
                hashWords.push(laneMsw);
              }
              return new WordArray.init(hashWords, outputLengthBytes);
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              var state = clone._state = this._state.slice(0);
              for (var i2 = 0; i2 < 25; i2++) {
                state[i2] = state[i2].clone();
              }
              return clone;
            }
          });
          C2.SHA3 = Hasher._createHelper(SHA3);
          C2.HmacSHA3 = Hasher._createHmacHelper(SHA3);
        })(Math);
        return CryptoJS2.SHA3;
      });
    })(sha3);
    return sha3.exports;
  }
  var ripemd160 = { exports: {} };
  var hasRequiredRipemd160;
  function requireRipemd160() {
    if (hasRequiredRipemd160)
      return ripemd160.exports;
    hasRequiredRipemd160 = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        /** @preserve
        				(c) 2012 by Cédric Mesnil. All rights reserved.
        
        				Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
        
        				    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
        				    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
        
        				THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
        				*/
        (function(Math2) {
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var WordArray = C_lib.WordArray;
          var Hasher = C_lib.Hasher;
          var C_algo = C2.algo;
          var _zl = WordArray.create([
            0,
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15,
            7,
            4,
            13,
            1,
            10,
            6,
            15,
            3,
            12,
            0,
            9,
            5,
            2,
            14,
            11,
            8,
            3,
            10,
            14,
            4,
            9,
            15,
            8,
            1,
            2,
            7,
            0,
            6,
            13,
            11,
            5,
            12,
            1,
            9,
            11,
            10,
            0,
            8,
            12,
            4,
            13,
            3,
            7,
            15,
            14,
            5,
            6,
            2,
            4,
            0,
            5,
            9,
            7,
            12,
            2,
            10,
            14,
            1,
            3,
            8,
            11,
            6,
            15,
            13
          ]);
          var _zr = WordArray.create([
            5,
            14,
            7,
            0,
            9,
            2,
            11,
            4,
            13,
            6,
            15,
            8,
            1,
            10,
            3,
            12,
            6,
            11,
            3,
            7,
            0,
            13,
            5,
            10,
            14,
            15,
            8,
            12,
            4,
            9,
            1,
            2,
            15,
            5,
            1,
            3,
            7,
            14,
            6,
            9,
            11,
            8,
            12,
            2,
            10,
            0,
            4,
            13,
            8,
            6,
            4,
            1,
            3,
            11,
            15,
            0,
            5,
            12,
            2,
            13,
            9,
            7,
            10,
            14,
            12,
            15,
            10,
            4,
            1,
            5,
            8,
            7,
            6,
            2,
            13,
            14,
            0,
            3,
            9,
            11
          ]);
          var _sl = WordArray.create([
            11,
            14,
            15,
            12,
            5,
            8,
            7,
            9,
            11,
            13,
            14,
            15,
            6,
            7,
            9,
            8,
            7,
            6,
            8,
            13,
            11,
            9,
            7,
            15,
            7,
            12,
            15,
            9,
            11,
            7,
            13,
            12,
            11,
            13,
            6,
            7,
            14,
            9,
            13,
            15,
            14,
            8,
            13,
            6,
            5,
            12,
            7,
            5,
            11,
            12,
            14,
            15,
            14,
            15,
            9,
            8,
            9,
            14,
            5,
            6,
            8,
            6,
            5,
            12,
            9,
            15,
            5,
            11,
            6,
            8,
            13,
            12,
            5,
            12,
            13,
            14,
            11,
            8,
            5,
            6
          ]);
          var _sr = WordArray.create([
            8,
            9,
            9,
            11,
            13,
            15,
            15,
            5,
            7,
            7,
            8,
            11,
            14,
            14,
            12,
            6,
            9,
            13,
            15,
            7,
            12,
            8,
            9,
            11,
            7,
            7,
            12,
            7,
            6,
            15,
            13,
            11,
            9,
            7,
            15,
            11,
            8,
            6,
            6,
            14,
            12,
            13,
            5,
            14,
            13,
            13,
            7,
            5,
            15,
            5,
            8,
            11,
            14,
            14,
            6,
            14,
            6,
            9,
            12,
            9,
            12,
            5,
            15,
            8,
            8,
            5,
            12,
            9,
            12,
            5,
            14,
            6,
            8,
            13,
            6,
            5,
            15,
            13,
            11,
            11
          ]);
          var _hl = WordArray.create([0, 1518500249, 1859775393, 2400959708, 2840853838]);
          var _hr = WordArray.create([1352829926, 1548603684, 1836072691, 2053994217, 0]);
          var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
            _doReset: function() {
              this._hash = WordArray.create([1732584193, 4023233417, 2562383102, 271733878, 3285377520]);
            },
            _doProcessBlock: function(M2, offset) {
              for (var i2 = 0; i2 < 16; i2++) {
                var offset_i = offset + i2;
                var M_offset_i = M2[offset_i];
                M2[offset_i] = (M_offset_i << 8 | M_offset_i >>> 24) & 16711935 | (M_offset_i << 24 | M_offset_i >>> 8) & 4278255360;
              }
              var H2 = this._hash.words;
              var hl = _hl.words;
              var hr = _hr.words;
              var zl = _zl.words;
              var zr = _zr.words;
              var sl = _sl.words;
              var sr = _sr.words;
              var al, bl, cl, dl, el;
              var ar, br, cr, dr, er;
              ar = al = H2[0];
              br = bl = H2[1];
              cr = cl = H2[2];
              dr = dl = H2[3];
              er = el = H2[4];
              var t2;
              for (var i2 = 0; i2 < 80; i2 += 1) {
                t2 = al + M2[offset + zl[i2]] | 0;
                if (i2 < 16) {
                  t2 += f1(bl, cl, dl) + hl[0];
                } else if (i2 < 32) {
                  t2 += f2(bl, cl, dl) + hl[1];
                } else if (i2 < 48) {
                  t2 += f3(bl, cl, dl) + hl[2];
                } else if (i2 < 64) {
                  t2 += f4(bl, cl, dl) + hl[3];
                } else {
                  t2 += f5(bl, cl, dl) + hl[4];
                }
                t2 = t2 | 0;
                t2 = rotl(t2, sl[i2]);
                t2 = t2 + el | 0;
                al = el;
                el = dl;
                dl = rotl(cl, 10);
                cl = bl;
                bl = t2;
                t2 = ar + M2[offset + zr[i2]] | 0;
                if (i2 < 16) {
                  t2 += f5(br, cr, dr) + hr[0];
                } else if (i2 < 32) {
                  t2 += f4(br, cr, dr) + hr[1];
                } else if (i2 < 48) {
                  t2 += f3(br, cr, dr) + hr[2];
                } else if (i2 < 64) {
                  t2 += f2(br, cr, dr) + hr[3];
                } else {
                  t2 += f1(br, cr, dr) + hr[4];
                }
                t2 = t2 | 0;
                t2 = rotl(t2, sr[i2]);
                t2 = t2 + er | 0;
                ar = er;
                er = dr;
                dr = rotl(cr, 10);
                cr = br;
                br = t2;
              }
              t2 = H2[1] + cl + dr | 0;
              H2[1] = H2[2] + dl + er | 0;
              H2[2] = H2[3] + el + ar | 0;
              H2[3] = H2[4] + al + br | 0;
              H2[4] = H2[0] + bl + cr | 0;
              H2[0] = t2;
            },
            _doFinalize: function() {
              var data = this._data;
              var dataWords = data.words;
              var nBitsTotal = this._nDataBytes * 8;
              var nBitsLeft = data.sigBytes * 8;
              dataWords[nBitsLeft >>> 5] |= 128 << 24 - nBitsLeft % 32;
              dataWords[(nBitsLeft + 64 >>> 9 << 4) + 14] = (nBitsTotal << 8 | nBitsTotal >>> 24) & 16711935 | (nBitsTotal << 24 | nBitsTotal >>> 8) & 4278255360;
              data.sigBytes = (dataWords.length + 1) * 4;
              this._process();
              var hash = this._hash;
              var H2 = hash.words;
              for (var i2 = 0; i2 < 5; i2++) {
                var H_i = H2[i2];
                H2[i2] = (H_i << 8 | H_i >>> 24) & 16711935 | (H_i << 24 | H_i >>> 8) & 4278255360;
              }
              return hash;
            },
            clone: function() {
              var clone = Hasher.clone.call(this);
              clone._hash = this._hash.clone();
              return clone;
            }
          });
          function f1(x, y2, z2) {
            return x ^ y2 ^ z2;
          }
          function f2(x, y2, z2) {
            return x & y2 | ~x & z2;
          }
          function f3(x, y2, z2) {
            return (x | ~y2) ^ z2;
          }
          function f4(x, y2, z2) {
            return x & z2 | y2 & ~z2;
          }
          function f5(x, y2, z2) {
            return x ^ (y2 | ~z2);
          }
          function rotl(x, n2) {
            return x << n2 | x >>> 32 - n2;
          }
          C2.RIPEMD160 = Hasher._createHelper(RIPEMD160);
          C2.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
        })();
        return CryptoJS2.RIPEMD160;
      });
    })(ripemd160);
    return ripemd160.exports;
  }
  var hmac = { exports: {} };
  var hasRequiredHmac;
  function requireHmac() {
    if (hasRequiredHmac)
      return hmac.exports;
    hasRequiredHmac = 1;
    (function(module, exports) {
      (function(root, factory) {
        {
          module.exports = factory(requireCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var Base = C_lib.Base;
          var C_enc = C2.enc;
          var Utf8 = C_enc.Utf8;
          var C_algo = C2.algo;
          C_algo.HMAC = Base.extend({
            /**
             * Initializes a newly created HMAC.
             *
             * @param {Hasher} hasher The hash algorithm to use.
             * @param {WordArray|string} key The secret key.
             *
             * @example
             *
             *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
             */
            init: function(hasher, key) {
              hasher = this._hasher = new hasher.init();
              if (typeof key == "string") {
                key = Utf8.parse(key);
              }
              var hasherBlockSize = hasher.blockSize;
              var hasherBlockSizeBytes = hasherBlockSize * 4;
              if (key.sigBytes > hasherBlockSizeBytes) {
                key = hasher.finalize(key);
              }
              key.clamp();
              var oKey = this._oKey = key.clone();
              var iKey = this._iKey = key.clone();
              var oKeyWords = oKey.words;
              var iKeyWords = iKey.words;
              for (var i2 = 0; i2 < hasherBlockSize; i2++) {
                oKeyWords[i2] ^= 1549556828;
                iKeyWords[i2] ^= 909522486;
              }
              oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;
              this.reset();
            },
            /**
             * Resets this HMAC to its initial state.
             *
             * @example
             *
             *     hmacHasher.reset();
             */
            reset: function() {
              var hasher = this._hasher;
              hasher.reset();
              hasher.update(this._iKey);
            },
            /**
             * Updates this HMAC with a message.
             *
             * @param {WordArray|string} messageUpdate The message to append.
             *
             * @return {HMAC} This HMAC instance.
             *
             * @example
             *
             *     hmacHasher.update('message');
             *     hmacHasher.update(wordArray);
             */
            update: function(messageUpdate) {
              this._hasher.update(messageUpdate);
              return this;
            },
            /**
             * Finalizes the HMAC computation.
             * Note that the finalize operation is effectively a destructive, read-once operation.
             *
             * @param {WordArray|string} messageUpdate (Optional) A final message update.
             *
             * @return {WordArray} The HMAC.
             *
             * @example
             *
             *     var hmac = hmacHasher.finalize();
             *     var hmac = hmacHasher.finalize('message');
             *     var hmac = hmacHasher.finalize(wordArray);
             */
            finalize: function(messageUpdate) {
              var hasher = this._hasher;
              var innerHash = hasher.finalize(messageUpdate);
              hasher.reset();
              var hmac2 = hasher.finalize(this._oKey.clone().concat(innerHash));
              return hmac2;
            }
          });
        })();
      });
    })(hmac);
    return hmac.exports;
  }
  var pbkdf2 = { exports: {} };
  var hasRequiredPbkdf2;
  function requirePbkdf2() {
    if (hasRequiredPbkdf2)
      return pbkdf2.exports;
    hasRequiredPbkdf2 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireSha256(), requireHmac());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var Base = C_lib.Base;
          var WordArray = C_lib.WordArray;
          var C_algo = C2.algo;
          var SHA256 = C_algo.SHA256;
          var HMAC = C_algo.HMAC;
          var PBKDF2 = C_algo.PBKDF2 = Base.extend({
            /**
             * Configuration options.
             *
             * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
             * @property {Hasher} hasher The hasher to use. Default: SHA256
             * @property {number} iterations The number of iterations to perform. Default: 250000
             */
            cfg: Base.extend({
              keySize: 128 / 32,
              hasher: SHA256,
              iterations: 25e4
            }),
            /**
             * Initializes a newly created key derivation function.
             *
             * @param {Object} cfg (Optional) The configuration options to use for the derivation.
             *
             * @example
             *
             *     var kdf = CryptoJS.algo.PBKDF2.create();
             *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
             *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
             */
            init: function(cfg) {
              this.cfg = this.cfg.extend(cfg);
            },
            /**
             * Computes the Password-Based Key Derivation Function 2.
             *
             * @param {WordArray|string} password The password.
             * @param {WordArray|string} salt A salt.
             *
             * @return {WordArray} The derived key.
             *
             * @example
             *
             *     var key = kdf.compute(password, salt);
             */
            compute: function(password, salt) {
              var cfg = this.cfg;
              var hmac2 = HMAC.create(cfg.hasher, password);
              var derivedKey = WordArray.create();
              var blockIndex = WordArray.create([1]);
              var derivedKeyWords = derivedKey.words;
              var blockIndexWords = blockIndex.words;
              var keySize = cfg.keySize;
              var iterations = cfg.iterations;
              while (derivedKeyWords.length < keySize) {
                var block = hmac2.update(salt).finalize(blockIndex);
                hmac2.reset();
                var blockWords = block.words;
                var blockWordsLength = blockWords.length;
                var intermediate = block;
                for (var i2 = 1; i2 < iterations; i2++) {
                  intermediate = hmac2.finalize(intermediate);
                  hmac2.reset();
                  var intermediateWords = intermediate.words;
                  for (var j2 = 0; j2 < blockWordsLength; j2++) {
                    blockWords[j2] ^= intermediateWords[j2];
                  }
                }
                derivedKey.concat(block);
                blockIndexWords[0]++;
              }
              derivedKey.sigBytes = keySize * 4;
              return derivedKey;
            }
          });
          C2.PBKDF2 = function(password, salt, cfg) {
            return PBKDF2.create(cfg).compute(password, salt);
          };
        })();
        return CryptoJS2.PBKDF2;
      });
    })(pbkdf2);
    return pbkdf2.exports;
  }
  var evpkdf = { exports: {} };
  var hasRequiredEvpkdf;
  function requireEvpkdf() {
    if (hasRequiredEvpkdf)
      return evpkdf.exports;
    hasRequiredEvpkdf = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireSha1(), requireHmac());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var Base = C_lib.Base;
          var WordArray = C_lib.WordArray;
          var C_algo = C2.algo;
          var MD5 = C_algo.MD5;
          var EvpKDF = C_algo.EvpKDF = Base.extend({
            /**
             * Configuration options.
             *
             * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
             * @property {Hasher} hasher The hash algorithm to use. Default: MD5
             * @property {number} iterations The number of iterations to perform. Default: 1
             */
            cfg: Base.extend({
              keySize: 128 / 32,
              hasher: MD5,
              iterations: 1
            }),
            /**
             * Initializes a newly created key derivation function.
             *
             * @param {Object} cfg (Optional) The configuration options to use for the derivation.
             *
             * @example
             *
             *     var kdf = CryptoJS.algo.EvpKDF.create();
             *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
             *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
             */
            init: function(cfg) {
              this.cfg = this.cfg.extend(cfg);
            },
            /**
             * Derives a key from a password.
             *
             * @param {WordArray|string} password The password.
             * @param {WordArray|string} salt A salt.
             *
             * @return {WordArray} The derived key.
             *
             * @example
             *
             *     var key = kdf.compute(password, salt);
             */
            compute: function(password, salt) {
              var block;
              var cfg = this.cfg;
              var hasher = cfg.hasher.create();
              var derivedKey = WordArray.create();
              var derivedKeyWords = derivedKey.words;
              var keySize = cfg.keySize;
              var iterations = cfg.iterations;
              while (derivedKeyWords.length < keySize) {
                if (block) {
                  hasher.update(block);
                }
                block = hasher.update(password).finalize(salt);
                hasher.reset();
                for (var i2 = 1; i2 < iterations; i2++) {
                  block = hasher.finalize(block);
                  hasher.reset();
                }
                derivedKey.concat(block);
              }
              derivedKey.sigBytes = keySize * 4;
              return derivedKey;
            }
          });
          C2.EvpKDF = function(password, salt, cfg) {
            return EvpKDF.create(cfg).compute(password, salt);
          };
        })();
        return CryptoJS2.EvpKDF;
      });
    })(evpkdf);
    return evpkdf.exports;
  }
  var cipherCore = { exports: {} };
  var hasRequiredCipherCore;
  function requireCipherCore() {
    if (hasRequiredCipherCore)
      return cipherCore.exports;
    hasRequiredCipherCore = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireEvpkdf());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        CryptoJS2.lib.Cipher || function(undefined$1) {
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var Base = C_lib.Base;
          var WordArray = C_lib.WordArray;
          var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
          var C_enc = C2.enc;
          C_enc.Utf8;
          var Base64 = C_enc.Base64;
          var C_algo = C2.algo;
          var EvpKDF = C_algo.EvpKDF;
          var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
            /**
             * Configuration options.
             *
             * @property {WordArray} iv The IV to use for this operation.
             */
            cfg: Base.extend(),
            /**
             * Creates this cipher in encryption mode.
             *
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {Cipher} A cipher instance.
             *
             * @static
             *
             * @example
             *
             *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
             */
            createEncryptor: function(key, cfg) {
              return this.create(this._ENC_XFORM_MODE, key, cfg);
            },
            /**
             * Creates this cipher in decryption mode.
             *
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {Cipher} A cipher instance.
             *
             * @static
             *
             * @example
             *
             *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
             */
            createDecryptor: function(key, cfg) {
              return this.create(this._DEC_XFORM_MODE, key, cfg);
            },
            /**
             * Initializes a newly created cipher.
             *
             * @param {number} xformMode Either the encryption or decryption transormation mode constant.
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @example
             *
             *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
             */
            init: function(xformMode, key, cfg) {
              this.cfg = this.cfg.extend(cfg);
              this._xformMode = xformMode;
              this._key = key;
              this.reset();
            },
            /**
             * Resets this cipher to its initial state.
             *
             * @example
             *
             *     cipher.reset();
             */
            reset: function() {
              BufferedBlockAlgorithm.reset.call(this);
              this._doReset();
            },
            /**
             * Adds data to be encrypted or decrypted.
             *
             * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
             *
             * @return {WordArray} The data after processing.
             *
             * @example
             *
             *     var encrypted = cipher.process('data');
             *     var encrypted = cipher.process(wordArray);
             */
            process: function(dataUpdate) {
              this._append(dataUpdate);
              return this._process();
            },
            /**
             * Finalizes the encryption or decryption process.
             * Note that the finalize operation is effectively a destructive, read-once operation.
             *
             * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
             *
             * @return {WordArray} The data after final processing.
             *
             * @example
             *
             *     var encrypted = cipher.finalize();
             *     var encrypted = cipher.finalize('data');
             *     var encrypted = cipher.finalize(wordArray);
             */
            finalize: function(dataUpdate) {
              if (dataUpdate) {
                this._append(dataUpdate);
              }
              var finalProcessedData = this._doFinalize();
              return finalProcessedData;
            },
            keySize: 128 / 32,
            ivSize: 128 / 32,
            _ENC_XFORM_MODE: 1,
            _DEC_XFORM_MODE: 2,
            /**
             * Creates shortcut functions to a cipher's object interface.
             *
             * @param {Cipher} cipher The cipher to create a helper for.
             *
             * @return {Object} An object with encrypt and decrypt shortcut functions.
             *
             * @static
             *
             * @example
             *
             *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
             */
            _createHelper: /* @__PURE__ */ function() {
              function selectCipherStrategy(key) {
                if (typeof key == "string") {
                  return PasswordBasedCipher;
                } else {
                  return SerializableCipher;
                }
              }
              return function(cipher) {
                return {
                  encrypt: function(message, key, cfg) {
                    return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
                  },
                  decrypt: function(ciphertext, key, cfg) {
                    return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
                  }
                };
              };
            }()
          });
          C_lib.StreamCipher = Cipher.extend({
            _doFinalize: function() {
              var finalProcessedBlocks = this._process(true);
              return finalProcessedBlocks;
            },
            blockSize: 1
          });
          var C_mode = C2.mode = {};
          var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
            /**
             * Creates this mode for encryption.
             *
             * @param {Cipher} cipher A block cipher instance.
             * @param {Array} iv The IV words.
             *
             * @static
             *
             * @example
             *
             *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
             */
            createEncryptor: function(cipher, iv) {
              return this.Encryptor.create(cipher, iv);
            },
            /**
             * Creates this mode for decryption.
             *
             * @param {Cipher} cipher A block cipher instance.
             * @param {Array} iv The IV words.
             *
             * @static
             *
             * @example
             *
             *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
             */
            createDecryptor: function(cipher, iv) {
              return this.Decryptor.create(cipher, iv);
            },
            /**
             * Initializes a newly created mode.
             *
             * @param {Cipher} cipher A block cipher instance.
             * @param {Array} iv The IV words.
             *
             * @example
             *
             *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
             */
            init: function(cipher, iv) {
              this._cipher = cipher;
              this._iv = iv;
            }
          });
          var CBC = C_mode.CBC = function() {
            var CBC2 = BlockCipherMode.extend();
            CBC2.Encryptor = CBC2.extend({
              /**
               * Processes the data block at offset.
               *
               * @param {Array} words The data words to operate on.
               * @param {number} offset The offset where the block starts.
               *
               * @example
               *
               *     mode.processBlock(data.words, offset);
               */
              processBlock: function(words, offset) {
                var cipher = this._cipher;
                var blockSize = cipher.blockSize;
                xorBlock.call(this, words, offset, blockSize);
                cipher.encryptBlock(words, offset);
                this._prevBlock = words.slice(offset, offset + blockSize);
              }
            });
            CBC2.Decryptor = CBC2.extend({
              /**
               * Processes the data block at offset.
               *
               * @param {Array} words The data words to operate on.
               * @param {number} offset The offset where the block starts.
               *
               * @example
               *
               *     mode.processBlock(data.words, offset);
               */
              processBlock: function(words, offset) {
                var cipher = this._cipher;
                var blockSize = cipher.blockSize;
                var thisBlock = words.slice(offset, offset + blockSize);
                cipher.decryptBlock(words, offset);
                xorBlock.call(this, words, offset, blockSize);
                this._prevBlock = thisBlock;
              }
            });
            function xorBlock(words, offset, blockSize) {
              var block;
              var iv = this._iv;
              if (iv) {
                block = iv;
                this._iv = undefined$1;
              } else {
                block = this._prevBlock;
              }
              for (var i2 = 0; i2 < blockSize; i2++) {
                words[offset + i2] ^= block[i2];
              }
            }
            return CBC2;
          }();
          var C_pad = C2.pad = {};
          var Pkcs7 = C_pad.Pkcs7 = {
            /**
             * Pads data using the algorithm defined in PKCS #5/7.
             *
             * @param {WordArray} data The data to pad.
             * @param {number} blockSize The multiple that the data should be padded to.
             *
             * @static
             *
             * @example
             *
             *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
             */
            pad: function(data, blockSize) {
              var blockSizeBytes = blockSize * 4;
              var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
              var paddingWord = nPaddingBytes << 24 | nPaddingBytes << 16 | nPaddingBytes << 8 | nPaddingBytes;
              var paddingWords = [];
              for (var i2 = 0; i2 < nPaddingBytes; i2 += 4) {
                paddingWords.push(paddingWord);
              }
              var padding = WordArray.create(paddingWords, nPaddingBytes);
              data.concat(padding);
            },
            /**
             * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
             *
             * @param {WordArray} data The data to unpad.
             *
             * @static
             *
             * @example
             *
             *     CryptoJS.pad.Pkcs7.unpad(wordArray);
             */
            unpad: function(data) {
              var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
              data.sigBytes -= nPaddingBytes;
            }
          };
          C_lib.BlockCipher = Cipher.extend({
            /**
             * Configuration options.
             *
             * @property {Mode} mode The block mode to use. Default: CBC
             * @property {Padding} padding The padding strategy to use. Default: Pkcs7
             */
            cfg: Cipher.cfg.extend({
              mode: CBC,
              padding: Pkcs7
            }),
            reset: function() {
              var modeCreator;
              Cipher.reset.call(this);
              var cfg = this.cfg;
              var iv = cfg.iv;
              var mode = cfg.mode;
              if (this._xformMode == this._ENC_XFORM_MODE) {
                modeCreator = mode.createEncryptor;
              } else {
                modeCreator = mode.createDecryptor;
                this._minBufferSize = 1;
              }
              if (this._mode && this._mode.__creator == modeCreator) {
                this._mode.init(this, iv && iv.words);
              } else {
                this._mode = modeCreator.call(mode, this, iv && iv.words);
                this._mode.__creator = modeCreator;
              }
            },
            _doProcessBlock: function(words, offset) {
              this._mode.processBlock(words, offset);
            },
            _doFinalize: function() {
              var finalProcessedBlocks;
              var padding = this.cfg.padding;
              if (this._xformMode == this._ENC_XFORM_MODE) {
                padding.pad(this._data, this.blockSize);
                finalProcessedBlocks = this._process(true);
              } else {
                finalProcessedBlocks = this._process(true);
                padding.unpad(finalProcessedBlocks);
              }
              return finalProcessedBlocks;
            },
            blockSize: 128 / 32
          });
          var CipherParams = C_lib.CipherParams = Base.extend({
            /**
             * Initializes a newly created cipher params object.
             *
             * @param {Object} cipherParams An object with any of the possible cipher parameters.
             *
             * @example
             *
             *     var cipherParams = CryptoJS.lib.CipherParams.create({
             *         ciphertext: ciphertextWordArray,
             *         key: keyWordArray,
             *         iv: ivWordArray,
             *         salt: saltWordArray,
             *         algorithm: CryptoJS.algo.AES,
             *         mode: CryptoJS.mode.CBC,
             *         padding: CryptoJS.pad.PKCS7,
             *         blockSize: 4,
             *         formatter: CryptoJS.format.OpenSSL
             *     });
             */
            init: function(cipherParams) {
              this.mixIn(cipherParams);
            },
            /**
             * Converts this cipher params object to a string.
             *
             * @param {Format} formatter (Optional) The formatting strategy to use.
             *
             * @return {string} The stringified cipher params.
             *
             * @throws Error If neither the formatter nor the default formatter is set.
             *
             * @example
             *
             *     var string = cipherParams + '';
             *     var string = cipherParams.toString();
             *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
             */
            toString: function(formatter) {
              return (formatter || this.formatter).stringify(this);
            }
          });
          var C_format = C2.format = {};
          var OpenSSLFormatter = C_format.OpenSSL = {
            /**
             * Converts a cipher params object to an OpenSSL-compatible string.
             *
             * @param {CipherParams} cipherParams The cipher params object.
             *
             * @return {string} The OpenSSL-compatible string.
             *
             * @static
             *
             * @example
             *
             *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
             */
            stringify: function(cipherParams) {
              var wordArray;
              var ciphertext = cipherParams.ciphertext;
              var salt = cipherParams.salt;
              if (salt) {
                wordArray = WordArray.create([1398893684, 1701076831]).concat(salt).concat(ciphertext);
              } else {
                wordArray = ciphertext;
              }
              return wordArray.toString(Base64);
            },
            /**
             * Converts an OpenSSL-compatible string to a cipher params object.
             *
             * @param {string} openSSLStr The OpenSSL-compatible string.
             *
             * @return {CipherParams} The cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
             */
            parse: function(openSSLStr) {
              var salt;
              var ciphertext = Base64.parse(openSSLStr);
              var ciphertextWords = ciphertext.words;
              if (ciphertextWords[0] == 1398893684 && ciphertextWords[1] == 1701076831) {
                salt = WordArray.create(ciphertextWords.slice(2, 4));
                ciphertextWords.splice(0, 4);
                ciphertext.sigBytes -= 16;
              }
              return CipherParams.create({ ciphertext, salt });
            }
          };
          var SerializableCipher = C_lib.SerializableCipher = Base.extend({
            /**
             * Configuration options.
             *
             * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
             */
            cfg: Base.extend({
              format: OpenSSLFormatter
            }),
            /**
             * Encrypts a message.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {WordArray|string} message The message to encrypt.
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {CipherParams} A cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
             */
            encrypt: function(cipher, message, key, cfg) {
              cfg = this.cfg.extend(cfg);
              var encryptor = cipher.createEncryptor(key, cfg);
              var ciphertext = encryptor.finalize(message);
              var cipherCfg = encryptor.cfg;
              return CipherParams.create({
                ciphertext,
                key,
                iv: cipherCfg.iv,
                algorithm: cipher,
                mode: cipherCfg.mode,
                padding: cipherCfg.padding,
                blockSize: cipher.blockSize,
                formatter: cfg.format
              });
            },
            /**
             * Decrypts serialized ciphertext.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
             * @param {WordArray} key The key.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {WordArray} The plaintext.
             *
             * @static
             *
             * @example
             *
             *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
             *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
             */
            decrypt: function(cipher, ciphertext, key, cfg) {
              cfg = this.cfg.extend(cfg);
              ciphertext = this._parse(ciphertext, cfg.format);
              var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);
              return plaintext;
            },
            /**
             * Converts serialized ciphertext to CipherParams,
             * else assumed CipherParams already and returns ciphertext unchanged.
             *
             * @param {CipherParams|string} ciphertext The ciphertext.
             * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
             *
             * @return {CipherParams} The unserialized ciphertext.
             *
             * @static
             *
             * @example
             *
             *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
             */
            _parse: function(ciphertext, format) {
              if (typeof ciphertext == "string") {
                return format.parse(ciphertext, this);
              } else {
                return ciphertext;
              }
            }
          });
          var C_kdf = C2.kdf = {};
          var OpenSSLKdf = C_kdf.OpenSSL = {
            /**
             * Derives a key and IV from a password.
             *
             * @param {string} password The password to derive from.
             * @param {number} keySize The size in words of the key to generate.
             * @param {number} ivSize The size in words of the IV to generate.
             * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
             *
             * @return {CipherParams} A cipher params object with the key, IV, and salt.
             *
             * @static
             *
             * @example
             *
             *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
             *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
             */
            execute: function(password, keySize, ivSize, salt, hasher) {
              if (!salt) {
                salt = WordArray.random(64 / 8);
              }
              if (!hasher) {
                var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);
              } else {
                var key = EvpKDF.create({ keySize: keySize + ivSize, hasher }).compute(password, salt);
              }
              var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
              key.sigBytes = keySize * 4;
              return CipherParams.create({ key, iv, salt });
            }
          };
          var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
            /**
             * Configuration options.
             *
             * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
             */
            cfg: SerializableCipher.cfg.extend({
              kdf: OpenSSLKdf
            }),
            /**
             * Encrypts a message using a password.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {WordArray|string} message The message to encrypt.
             * @param {string} password The password.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {CipherParams} A cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
             *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
             */
            encrypt: function(cipher, message, password, cfg) {
              cfg = this.cfg.extend(cfg);
              var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, cfg.salt, cfg.hasher);
              cfg.iv = derivedParams.iv;
              var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);
              ciphertext.mixIn(derivedParams);
              return ciphertext;
            },
            /**
             * Decrypts serialized ciphertext using a password.
             *
             * @param {Cipher} cipher The cipher algorithm to use.
             * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
             * @param {string} password The password.
             * @param {Object} cfg (Optional) The configuration options to use for this operation.
             *
             * @return {WordArray} The plaintext.
             *
             * @static
             *
             * @example
             *
             *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
             *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
             */
            decrypt: function(cipher, ciphertext, password, cfg) {
              cfg = this.cfg.extend(cfg);
              ciphertext = this._parse(ciphertext, cfg.format);
              var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt, cfg.hasher);
              cfg.iv = derivedParams.iv;
              var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);
              return plaintext;
            }
          });
        }();
      });
    })(cipherCore);
    return cipherCore.exports;
  }
  var modeCfb = { exports: {} };
  var hasRequiredModeCfb;
  function requireModeCfb() {
    if (hasRequiredModeCfb)
      return modeCfb.exports;
    hasRequiredModeCfb = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        CryptoJS2.mode.CFB = function() {
          var CFB = CryptoJS2.lib.BlockCipherMode.extend();
          CFB.Encryptor = CFB.extend({
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
              this._prevBlock = words.slice(offset, offset + blockSize);
            }
          });
          CFB.Decryptor = CFB.extend({
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              var thisBlock = words.slice(offset, offset + blockSize);
              generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);
              this._prevBlock = thisBlock;
            }
          });
          function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
            var keystream;
            var iv = this._iv;
            if (iv) {
              keystream = iv.slice(0);
              this._iv = void 0;
            } else {
              keystream = this._prevBlock;
            }
            cipher.encryptBlock(keystream, 0);
            for (var i2 = 0; i2 < blockSize; i2++) {
              words[offset + i2] ^= keystream[i2];
            }
          }
          return CFB;
        }();
        return CryptoJS2.mode.CFB;
      });
    })(modeCfb);
    return modeCfb.exports;
  }
  var modeCtr = { exports: {} };
  var hasRequiredModeCtr;
  function requireModeCtr() {
    if (hasRequiredModeCtr)
      return modeCtr.exports;
    hasRequiredModeCtr = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        CryptoJS2.mode.CTR = function() {
          var CTR = CryptoJS2.lib.BlockCipherMode.extend();
          var Encryptor = CTR.Encryptor = CTR.extend({
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              var iv = this._iv;
              var counter = this._counter;
              if (iv) {
                counter = this._counter = iv.slice(0);
                this._iv = void 0;
              }
              var keystream = counter.slice(0);
              cipher.encryptBlock(keystream, 0);
              counter[blockSize - 1] = counter[blockSize - 1] + 1 | 0;
              for (var i2 = 0; i2 < blockSize; i2++) {
                words[offset + i2] ^= keystream[i2];
              }
            }
          });
          CTR.Decryptor = Encryptor;
          return CTR;
        }();
        return CryptoJS2.mode.CTR;
      });
    })(modeCtr);
    return modeCtr.exports;
  }
  var modeCtrGladman = { exports: {} };
  var hasRequiredModeCtrGladman;
  function requireModeCtrGladman() {
    if (hasRequiredModeCtrGladman)
      return modeCtrGladman.exports;
    hasRequiredModeCtrGladman = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        /** @preserve
         * Counter block mode compatible with  Dr Brian Gladman fileenc.c
         * derived from CryptoJS.mode.CTR
         * Jan Hruby jhruby.web@gmail.com
         */
        CryptoJS2.mode.CTRGladman = function() {
          var CTRGladman = CryptoJS2.lib.BlockCipherMode.extend();
          function incWord(word) {
            if ((word >> 24 & 255) === 255) {
              var b1 = word >> 16 & 255;
              var b2 = word >> 8 & 255;
              var b3 = word & 255;
              if (b1 === 255) {
                b1 = 0;
                if (b2 === 255) {
                  b2 = 0;
                  if (b3 === 255) {
                    b3 = 0;
                  } else {
                    ++b3;
                  }
                } else {
                  ++b2;
                }
              } else {
                ++b1;
              }
              word = 0;
              word += b1 << 16;
              word += b2 << 8;
              word += b3;
            } else {
              word += 1 << 24;
            }
            return word;
          }
          function incCounter(counter) {
            if ((counter[0] = incWord(counter[0])) === 0) {
              counter[1] = incWord(counter[1]);
            }
            return counter;
          }
          var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              var iv = this._iv;
              var counter = this._counter;
              if (iv) {
                counter = this._counter = iv.slice(0);
                this._iv = void 0;
              }
              incCounter(counter);
              var keystream = counter.slice(0);
              cipher.encryptBlock(keystream, 0);
              for (var i2 = 0; i2 < blockSize; i2++) {
                words[offset + i2] ^= keystream[i2];
              }
            }
          });
          CTRGladman.Decryptor = Encryptor;
          return CTRGladman;
        }();
        return CryptoJS2.mode.CTRGladman;
      });
    })(modeCtrGladman);
    return modeCtrGladman.exports;
  }
  var modeOfb = { exports: {} };
  var hasRequiredModeOfb;
  function requireModeOfb() {
    if (hasRequiredModeOfb)
      return modeOfb.exports;
    hasRequiredModeOfb = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        CryptoJS2.mode.OFB = function() {
          var OFB = CryptoJS2.lib.BlockCipherMode.extend();
          var Encryptor = OFB.Encryptor = OFB.extend({
            processBlock: function(words, offset) {
              var cipher = this._cipher;
              var blockSize = cipher.blockSize;
              var iv = this._iv;
              var keystream = this._keystream;
              if (iv) {
                keystream = this._keystream = iv.slice(0);
                this._iv = void 0;
              }
              cipher.encryptBlock(keystream, 0);
              for (var i2 = 0; i2 < blockSize; i2++) {
                words[offset + i2] ^= keystream[i2];
              }
            }
          });
          OFB.Decryptor = Encryptor;
          return OFB;
        }();
        return CryptoJS2.mode.OFB;
      });
    })(modeOfb);
    return modeOfb.exports;
  }
  var modeEcb = { exports: {} };
  var hasRequiredModeEcb;
  function requireModeEcb() {
    if (hasRequiredModeEcb)
      return modeEcb.exports;
    hasRequiredModeEcb = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        CryptoJS2.mode.ECB = function() {
          var ECB = CryptoJS2.lib.BlockCipherMode.extend();
          ECB.Encryptor = ECB.extend({
            processBlock: function(words, offset) {
              this._cipher.encryptBlock(words, offset);
            }
          });
          ECB.Decryptor = ECB.extend({
            processBlock: function(words, offset) {
              this._cipher.decryptBlock(words, offset);
            }
          });
          return ECB;
        }();
        return CryptoJS2.mode.ECB;
      });
    })(modeEcb);
    return modeEcb.exports;
  }
  var padAnsix923 = { exports: {} };
  var hasRequiredPadAnsix923;
  function requirePadAnsix923() {
    if (hasRequiredPadAnsix923)
      return padAnsix923.exports;
    hasRequiredPadAnsix923 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        CryptoJS2.pad.AnsiX923 = {
          pad: function(data, blockSize) {
            var dataSigBytes = data.sigBytes;
            var blockSizeBytes = blockSize * 4;
            var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;
            var lastBytePos = dataSigBytes + nPaddingBytes - 1;
            data.clamp();
            data.words[lastBytePos >>> 2] |= nPaddingBytes << 24 - lastBytePos % 4 * 8;
            data.sigBytes += nPaddingBytes;
          },
          unpad: function(data) {
            var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
            data.sigBytes -= nPaddingBytes;
          }
        };
        return CryptoJS2.pad.Ansix923;
      });
    })(padAnsix923);
    return padAnsix923.exports;
  }
  var padIso10126 = { exports: {} };
  var hasRequiredPadIso10126;
  function requirePadIso10126() {
    if (hasRequiredPadIso10126)
      return padIso10126.exports;
    hasRequiredPadIso10126 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        CryptoJS2.pad.Iso10126 = {
          pad: function(data, blockSize) {
            var blockSizeBytes = blockSize * 4;
            var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;
            data.concat(CryptoJS2.lib.WordArray.random(nPaddingBytes - 1)).concat(CryptoJS2.lib.WordArray.create([nPaddingBytes << 24], 1));
          },
          unpad: function(data) {
            var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
            data.sigBytes -= nPaddingBytes;
          }
        };
        return CryptoJS2.pad.Iso10126;
      });
    })(padIso10126);
    return padIso10126.exports;
  }
  var padIso97971 = { exports: {} };
  var hasRequiredPadIso97971;
  function requirePadIso97971() {
    if (hasRequiredPadIso97971)
      return padIso97971.exports;
    hasRequiredPadIso97971 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        CryptoJS2.pad.Iso97971 = {
          pad: function(data, blockSize) {
            data.concat(CryptoJS2.lib.WordArray.create([2147483648], 1));
            CryptoJS2.pad.ZeroPadding.pad(data, blockSize);
          },
          unpad: function(data) {
            CryptoJS2.pad.ZeroPadding.unpad(data);
            data.sigBytes--;
          }
        };
        return CryptoJS2.pad.Iso97971;
      });
    })(padIso97971);
    return padIso97971.exports;
  }
  var padZeropadding = { exports: {} };
  var hasRequiredPadZeropadding;
  function requirePadZeropadding() {
    if (hasRequiredPadZeropadding)
      return padZeropadding.exports;
    hasRequiredPadZeropadding = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        CryptoJS2.pad.ZeroPadding = {
          pad: function(data, blockSize) {
            var blockSizeBytes = blockSize * 4;
            data.clamp();
            data.sigBytes += blockSizeBytes - (data.sigBytes % blockSizeBytes || blockSizeBytes);
          },
          unpad: function(data) {
            var dataWords = data.words;
            var i2 = data.sigBytes - 1;
            for (var i2 = data.sigBytes - 1; i2 >= 0; i2--) {
              if (dataWords[i2 >>> 2] >>> 24 - i2 % 4 * 8 & 255) {
                data.sigBytes = i2 + 1;
                break;
              }
            }
          }
        };
        return CryptoJS2.pad.ZeroPadding;
      });
    })(padZeropadding);
    return padZeropadding.exports;
  }
  var padNopadding = { exports: {} };
  var hasRequiredPadNopadding;
  function requirePadNopadding() {
    if (hasRequiredPadNopadding)
      return padNopadding.exports;
    hasRequiredPadNopadding = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        CryptoJS2.pad.NoPadding = {
          pad: function() {
          },
          unpad: function() {
          }
        };
        return CryptoJS2.pad.NoPadding;
      });
    })(padNopadding);
    return padNopadding.exports;
  }
  var formatHex = { exports: {} };
  var hasRequiredFormatHex;
  function requireFormatHex() {
    if (hasRequiredFormatHex)
      return formatHex.exports;
    hasRequiredFormatHex = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function(undefined$1) {
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var CipherParams = C_lib.CipherParams;
          var C_enc = C2.enc;
          var Hex = C_enc.Hex;
          var C_format = C2.format;
          C_format.Hex = {
            /**
             * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
             *
             * @param {CipherParams} cipherParams The cipher params object.
             *
             * @return {string} The hexadecimally encoded string.
             *
             * @static
             *
             * @example
             *
             *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
             */
            stringify: function(cipherParams) {
              return cipherParams.ciphertext.toString(Hex);
            },
            /**
             * Converts a hexadecimally encoded ciphertext string to a cipher params object.
             *
             * @param {string} input The hexadecimally encoded string.
             *
             * @return {CipherParams} The cipher params object.
             *
             * @static
             *
             * @example
             *
             *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
             */
            parse: function(input) {
              var ciphertext = Hex.parse(input);
              return CipherParams.create({ ciphertext });
            }
          };
        })();
        return CryptoJS2.format.Hex;
      });
    })(formatHex);
    return formatHex.exports;
  }
  var aes = { exports: {} };
  var hasRequiredAes;
  function requireAes() {
    if (hasRequiredAes)
      return aes.exports;
    hasRequiredAes = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var BlockCipher = C_lib.BlockCipher;
          var C_algo = C2.algo;
          var SBOX = [];
          var INV_SBOX = [];
          var SUB_MIX_0 = [];
          var SUB_MIX_1 = [];
          var SUB_MIX_2 = [];
          var SUB_MIX_3 = [];
          var INV_SUB_MIX_0 = [];
          var INV_SUB_MIX_1 = [];
          var INV_SUB_MIX_2 = [];
          var INV_SUB_MIX_3 = [];
          (function() {
            var d2 = [];
            for (var i2 = 0; i2 < 256; i2++) {
              if (i2 < 128) {
                d2[i2] = i2 << 1;
              } else {
                d2[i2] = i2 << 1 ^ 283;
              }
            }
            var x = 0;
            var xi = 0;
            for (var i2 = 0; i2 < 256; i2++) {
              var sx = xi ^ xi << 1 ^ xi << 2 ^ xi << 3 ^ xi << 4;
              sx = sx >>> 8 ^ sx & 255 ^ 99;
              SBOX[x] = sx;
              INV_SBOX[sx] = x;
              var x2 = d2[x];
              var x4 = d2[x2];
              var x8 = d2[x4];
              var t2 = d2[sx] * 257 ^ sx * 16843008;
              SUB_MIX_0[x] = t2 << 24 | t2 >>> 8;
              SUB_MIX_1[x] = t2 << 16 | t2 >>> 16;
              SUB_MIX_2[x] = t2 << 8 | t2 >>> 24;
              SUB_MIX_3[x] = t2;
              var t2 = x8 * 16843009 ^ x4 * 65537 ^ x2 * 257 ^ x * 16843008;
              INV_SUB_MIX_0[sx] = t2 << 24 | t2 >>> 8;
              INV_SUB_MIX_1[sx] = t2 << 16 | t2 >>> 16;
              INV_SUB_MIX_2[sx] = t2 << 8 | t2 >>> 24;
              INV_SUB_MIX_3[sx] = t2;
              if (!x) {
                x = xi = 1;
              } else {
                x = x2 ^ d2[d2[d2[x8 ^ x2]]];
                xi ^= d2[d2[xi]];
              }
            }
          })();
          var RCON = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54];
          var AES = C_algo.AES = BlockCipher.extend({
            _doReset: function() {
              var t2;
              if (this._nRounds && this._keyPriorReset === this._key) {
                return;
              }
              var key = this._keyPriorReset = this._key;
              var keyWords = key.words;
              var keySize = key.sigBytes / 4;
              var nRounds = this._nRounds = keySize + 6;
              var ksRows = (nRounds + 1) * 4;
              var keySchedule = this._keySchedule = [];
              for (var ksRow = 0; ksRow < ksRows; ksRow++) {
                if (ksRow < keySize) {
                  keySchedule[ksRow] = keyWords[ksRow];
                } else {
                  t2 = keySchedule[ksRow - 1];
                  if (!(ksRow % keySize)) {
                    t2 = t2 << 8 | t2 >>> 24;
                    t2 = SBOX[t2 >>> 24] << 24 | SBOX[t2 >>> 16 & 255] << 16 | SBOX[t2 >>> 8 & 255] << 8 | SBOX[t2 & 255];
                    t2 ^= RCON[ksRow / keySize | 0] << 24;
                  } else if (keySize > 6 && ksRow % keySize == 4) {
                    t2 = SBOX[t2 >>> 24] << 24 | SBOX[t2 >>> 16 & 255] << 16 | SBOX[t2 >>> 8 & 255] << 8 | SBOX[t2 & 255];
                  }
                  keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t2;
                }
              }
              var invKeySchedule = this._invKeySchedule = [];
              for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
                var ksRow = ksRows - invKsRow;
                if (invKsRow % 4) {
                  var t2 = keySchedule[ksRow];
                } else {
                  var t2 = keySchedule[ksRow - 4];
                }
                if (invKsRow < 4 || ksRow <= 4) {
                  invKeySchedule[invKsRow] = t2;
                } else {
                  invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t2 >>> 24]] ^ INV_SUB_MIX_1[SBOX[t2 >>> 16 & 255]] ^ INV_SUB_MIX_2[SBOX[t2 >>> 8 & 255]] ^ INV_SUB_MIX_3[SBOX[t2 & 255]];
                }
              }
            },
            encryptBlock: function(M2, offset) {
              this._doCryptBlock(M2, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
            },
            decryptBlock: function(M2, offset) {
              var t2 = M2[offset + 1];
              M2[offset + 1] = M2[offset + 3];
              M2[offset + 3] = t2;
              this._doCryptBlock(M2, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);
              var t2 = M2[offset + 1];
              M2[offset + 1] = M2[offset + 3];
              M2[offset + 3] = t2;
            },
            _doCryptBlock: function(M2, offset, keySchedule, SUB_MIX_02, SUB_MIX_12, SUB_MIX_22, SUB_MIX_32, SBOX2) {
              var nRounds = this._nRounds;
              var s0 = M2[offset] ^ keySchedule[0];
              var s1 = M2[offset + 1] ^ keySchedule[1];
              var s2 = M2[offset + 2] ^ keySchedule[2];
              var s3 = M2[offset + 3] ^ keySchedule[3];
              var ksRow = 4;
              for (var round = 1; round < nRounds; round++) {
                var t0 = SUB_MIX_02[s0 >>> 24] ^ SUB_MIX_12[s1 >>> 16 & 255] ^ SUB_MIX_22[s2 >>> 8 & 255] ^ SUB_MIX_32[s3 & 255] ^ keySchedule[ksRow++];
                var t1 = SUB_MIX_02[s1 >>> 24] ^ SUB_MIX_12[s2 >>> 16 & 255] ^ SUB_MIX_22[s3 >>> 8 & 255] ^ SUB_MIX_32[s0 & 255] ^ keySchedule[ksRow++];
                var t2 = SUB_MIX_02[s2 >>> 24] ^ SUB_MIX_12[s3 >>> 16 & 255] ^ SUB_MIX_22[s0 >>> 8 & 255] ^ SUB_MIX_32[s1 & 255] ^ keySchedule[ksRow++];
                var t3 = SUB_MIX_02[s3 >>> 24] ^ SUB_MIX_12[s0 >>> 16 & 255] ^ SUB_MIX_22[s1 >>> 8 & 255] ^ SUB_MIX_32[s2 & 255] ^ keySchedule[ksRow++];
                s0 = t0;
                s1 = t1;
                s2 = t2;
                s3 = t3;
              }
              var t0 = (SBOX2[s0 >>> 24] << 24 | SBOX2[s1 >>> 16 & 255] << 16 | SBOX2[s2 >>> 8 & 255] << 8 | SBOX2[s3 & 255]) ^ keySchedule[ksRow++];
              var t1 = (SBOX2[s1 >>> 24] << 24 | SBOX2[s2 >>> 16 & 255] << 16 | SBOX2[s3 >>> 8 & 255] << 8 | SBOX2[s0 & 255]) ^ keySchedule[ksRow++];
              var t2 = (SBOX2[s2 >>> 24] << 24 | SBOX2[s3 >>> 16 & 255] << 16 | SBOX2[s0 >>> 8 & 255] << 8 | SBOX2[s1 & 255]) ^ keySchedule[ksRow++];
              var t3 = (SBOX2[s3 >>> 24] << 24 | SBOX2[s0 >>> 16 & 255] << 16 | SBOX2[s1 >>> 8 & 255] << 8 | SBOX2[s2 & 255]) ^ keySchedule[ksRow++];
              M2[offset] = t0;
              M2[offset + 1] = t1;
              M2[offset + 2] = t2;
              M2[offset + 3] = t3;
            },
            keySize: 256 / 32
          });
          C2.AES = BlockCipher._createHelper(AES);
        })();
        return CryptoJS2.AES;
      });
    })(aes);
    return aes.exports;
  }
  var tripledes = { exports: {} };
  var hasRequiredTripledes;
  function requireTripledes() {
    if (hasRequiredTripledes)
      return tripledes.exports;
    hasRequiredTripledes = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var WordArray = C_lib.WordArray;
          var BlockCipher = C_lib.BlockCipher;
          var C_algo = C2.algo;
          var PC1 = [
            57,
            49,
            41,
            33,
            25,
            17,
            9,
            1,
            58,
            50,
            42,
            34,
            26,
            18,
            10,
            2,
            59,
            51,
            43,
            35,
            27,
            19,
            11,
            3,
            60,
            52,
            44,
            36,
            63,
            55,
            47,
            39,
            31,
            23,
            15,
            7,
            62,
            54,
            46,
            38,
            30,
            22,
            14,
            6,
            61,
            53,
            45,
            37,
            29,
            21,
            13,
            5,
            28,
            20,
            12,
            4
          ];
          var PC2 = [
            14,
            17,
            11,
            24,
            1,
            5,
            3,
            28,
            15,
            6,
            21,
            10,
            23,
            19,
            12,
            4,
            26,
            8,
            16,
            7,
            27,
            20,
            13,
            2,
            41,
            52,
            31,
            37,
            47,
            55,
            30,
            40,
            51,
            45,
            33,
            48,
            44,
            49,
            39,
            56,
            34,
            53,
            46,
            42,
            50,
            36,
            29,
            32
          ];
          var BIT_SHIFTS = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];
          var SBOX_P = [
            {
              0: 8421888,
              268435456: 32768,
              536870912: 8421378,
              805306368: 2,
              1073741824: 512,
              1342177280: 8421890,
              1610612736: 8389122,
              1879048192: 8388608,
              2147483648: 514,
              2415919104: 8389120,
              2684354560: 33280,
              2952790016: 8421376,
              3221225472: 32770,
              3489660928: 8388610,
              3758096384: 0,
              4026531840: 33282,
              134217728: 0,
              402653184: 8421890,
              671088640: 33282,
              939524096: 32768,
              1207959552: 8421888,
              1476395008: 512,
              1744830464: 8421378,
              2013265920: 2,
              2281701376: 8389120,
              2550136832: 33280,
              2818572288: 8421376,
              3087007744: 8389122,
              3355443200: 8388610,
              3623878656: 32770,
              3892314112: 514,
              4160749568: 8388608,
              1: 32768,
              268435457: 2,
              536870913: 8421888,
              805306369: 8388608,
              1073741825: 8421378,
              1342177281: 33280,
              1610612737: 512,
              1879048193: 8389122,
              2147483649: 8421890,
              2415919105: 8421376,
              2684354561: 8388610,
              2952790017: 33282,
              3221225473: 514,
              3489660929: 8389120,
              3758096385: 32770,
              4026531841: 0,
              134217729: 8421890,
              402653185: 8421376,
              671088641: 8388608,
              939524097: 512,
              1207959553: 32768,
              1476395009: 8388610,
              1744830465: 2,
              2013265921: 33282,
              2281701377: 32770,
              2550136833: 8389122,
              2818572289: 514,
              3087007745: 8421888,
              3355443201: 8389120,
              3623878657: 0,
              3892314113: 33280,
              4160749569: 8421378
            },
            {
              0: 1074282512,
              16777216: 16384,
              33554432: 524288,
              50331648: 1074266128,
              67108864: 1073741840,
              83886080: 1074282496,
              100663296: 1073758208,
              117440512: 16,
              134217728: 540672,
              150994944: 1073758224,
              167772160: 1073741824,
              184549376: 540688,
              201326592: 524304,
              218103808: 0,
              234881024: 16400,
              251658240: 1074266112,
              8388608: 1073758208,
              25165824: 540688,
              41943040: 16,
              58720256: 1073758224,
              75497472: 1074282512,
              92274688: 1073741824,
              109051904: 524288,
              125829120: 1074266128,
              142606336: 524304,
              159383552: 0,
              176160768: 16384,
              192937984: 1074266112,
              209715200: 1073741840,
              226492416: 540672,
              243269632: 1074282496,
              260046848: 16400,
              268435456: 0,
              285212672: 1074266128,
              301989888: 1073758224,
              318767104: 1074282496,
              335544320: 1074266112,
              352321536: 16,
              369098752: 540688,
              385875968: 16384,
              402653184: 16400,
              419430400: 524288,
              436207616: 524304,
              452984832: 1073741840,
              469762048: 540672,
              486539264: 1073758208,
              503316480: 1073741824,
              520093696: 1074282512,
              276824064: 540688,
              293601280: 524288,
              310378496: 1074266112,
              327155712: 16384,
              343932928: 1073758208,
              360710144: 1074282512,
              377487360: 16,
              394264576: 1073741824,
              411041792: 1074282496,
              427819008: 1073741840,
              444596224: 1073758224,
              461373440: 524304,
              478150656: 0,
              494927872: 16400,
              511705088: 1074266128,
              528482304: 540672
            },
            {
              0: 260,
              1048576: 0,
              2097152: 67109120,
              3145728: 65796,
              4194304: 65540,
              5242880: 67108868,
              6291456: 67174660,
              7340032: 67174400,
              8388608: 67108864,
              9437184: 67174656,
              10485760: 65792,
              11534336: 67174404,
              12582912: 67109124,
              13631488: 65536,
              14680064: 4,
              15728640: 256,
              524288: 67174656,
              1572864: 67174404,
              2621440: 0,
              3670016: 67109120,
              4718592: 67108868,
              5767168: 65536,
              6815744: 65540,
              7864320: 260,
              8912896: 4,
              9961472: 256,
              11010048: 67174400,
              12058624: 65796,
              13107200: 65792,
              14155776: 67109124,
              15204352: 67174660,
              16252928: 67108864,
              16777216: 67174656,
              17825792: 65540,
              18874368: 65536,
              19922944: 67109120,
              20971520: 256,
              22020096: 67174660,
              23068672: 67108868,
              24117248: 0,
              25165824: 67109124,
              26214400: 67108864,
              27262976: 4,
              28311552: 65792,
              29360128: 67174400,
              30408704: 260,
              31457280: 65796,
              32505856: 67174404,
              17301504: 67108864,
              18350080: 260,
              19398656: 67174656,
              20447232: 0,
              21495808: 65540,
              22544384: 67109120,
              23592960: 256,
              24641536: 67174404,
              25690112: 65536,
              26738688: 67174660,
              27787264: 65796,
              28835840: 67108868,
              29884416: 67109124,
              30932992: 67174400,
              31981568: 4,
              33030144: 65792
            },
            {
              0: 2151682048,
              65536: 2147487808,
              131072: 4198464,
              196608: 2151677952,
              262144: 0,
              327680: 4198400,
              393216: 2147483712,
              458752: 4194368,
              524288: 2147483648,
              589824: 4194304,
              655360: 64,
              720896: 2147487744,
              786432: 2151678016,
              851968: 4160,
              917504: 4096,
              983040: 2151682112,
              32768: 2147487808,
              98304: 64,
              163840: 2151678016,
              229376: 2147487744,
              294912: 4198400,
              360448: 2151682112,
              425984: 0,
              491520: 2151677952,
              557056: 4096,
              622592: 2151682048,
              688128: 4194304,
              753664: 4160,
              819200: 2147483648,
              884736: 4194368,
              950272: 4198464,
              1015808: 2147483712,
              1048576: 4194368,
              1114112: 4198400,
              1179648: 2147483712,
              1245184: 0,
              1310720: 4160,
              1376256: 2151678016,
              1441792: 2151682048,
              1507328: 2147487808,
              1572864: 2151682112,
              1638400: 2147483648,
              1703936: 2151677952,
              1769472: 4198464,
              1835008: 2147487744,
              1900544: 4194304,
              1966080: 64,
              2031616: 4096,
              1081344: 2151677952,
              1146880: 2151682112,
              1212416: 0,
              1277952: 4198400,
              1343488: 4194368,
              1409024: 2147483648,
              1474560: 2147487808,
              1540096: 64,
              1605632: 2147483712,
              1671168: 4096,
              1736704: 2147487744,
              1802240: 2151678016,
              1867776: 4160,
              1933312: 2151682048,
              1998848: 4194304,
              2064384: 4198464
            },
            {
              0: 128,
              4096: 17039360,
              8192: 262144,
              12288: 536870912,
              16384: 537133184,
              20480: 16777344,
              24576: 553648256,
              28672: 262272,
              32768: 16777216,
              36864: 537133056,
              40960: 536871040,
              45056: 553910400,
              49152: 553910272,
              53248: 0,
              57344: 17039488,
              61440: 553648128,
              2048: 17039488,
              6144: 553648256,
              10240: 128,
              14336: 17039360,
              18432: 262144,
              22528: 537133184,
              26624: 553910272,
              30720: 536870912,
              34816: 537133056,
              38912: 0,
              43008: 553910400,
              47104: 16777344,
              51200: 536871040,
              55296: 553648128,
              59392: 16777216,
              63488: 262272,
              65536: 262144,
              69632: 128,
              73728: 536870912,
              77824: 553648256,
              81920: 16777344,
              86016: 553910272,
              90112: 537133184,
              94208: 16777216,
              98304: 553910400,
              102400: 553648128,
              106496: 17039360,
              110592: 537133056,
              114688: 262272,
              118784: 536871040,
              122880: 0,
              126976: 17039488,
              67584: 553648256,
              71680: 16777216,
              75776: 17039360,
              79872: 537133184,
              83968: 536870912,
              88064: 17039488,
              92160: 128,
              96256: 553910272,
              100352: 262272,
              104448: 553910400,
              108544: 0,
              112640: 553648128,
              116736: 16777344,
              120832: 262144,
              124928: 537133056,
              129024: 536871040
            },
            {
              0: 268435464,
              256: 8192,
              512: 270532608,
              768: 270540808,
              1024: 268443648,
              1280: 2097152,
              1536: 2097160,
              1792: 268435456,
              2048: 0,
              2304: 268443656,
              2560: 2105344,
              2816: 8,
              3072: 270532616,
              3328: 2105352,
              3584: 8200,
              3840: 270540800,
              128: 270532608,
              384: 270540808,
              640: 8,
              896: 2097152,
              1152: 2105352,
              1408: 268435464,
              1664: 268443648,
              1920: 8200,
              2176: 2097160,
              2432: 8192,
              2688: 268443656,
              2944: 270532616,
              3200: 0,
              3456: 270540800,
              3712: 2105344,
              3968: 268435456,
              4096: 268443648,
              4352: 270532616,
              4608: 270540808,
              4864: 8200,
              5120: 2097152,
              5376: 268435456,
              5632: 268435464,
              5888: 2105344,
              6144: 2105352,
              6400: 0,
              6656: 8,
              6912: 270532608,
              7168: 8192,
              7424: 268443656,
              7680: 270540800,
              7936: 2097160,
              4224: 8,
              4480: 2105344,
              4736: 2097152,
              4992: 268435464,
              5248: 268443648,
              5504: 8200,
              5760: 270540808,
              6016: 270532608,
              6272: 270540800,
              6528: 270532616,
              6784: 8192,
              7040: 2105352,
              7296: 2097160,
              7552: 0,
              7808: 268435456,
              8064: 268443656
            },
            {
              0: 1048576,
              16: 33555457,
              32: 1024,
              48: 1049601,
              64: 34604033,
              80: 0,
              96: 1,
              112: 34603009,
              128: 33555456,
              144: 1048577,
              160: 33554433,
              176: 34604032,
              192: 34603008,
              208: 1025,
              224: 1049600,
              240: 33554432,
              8: 34603009,
              24: 0,
              40: 33555457,
              56: 34604032,
              72: 1048576,
              88: 33554433,
              104: 33554432,
              120: 1025,
              136: 1049601,
              152: 33555456,
              168: 34603008,
              184: 1048577,
              200: 1024,
              216: 34604033,
              232: 1,
              248: 1049600,
              256: 33554432,
              272: 1048576,
              288: 33555457,
              304: 34603009,
              320: 1048577,
              336: 33555456,
              352: 34604032,
              368: 1049601,
              384: 1025,
              400: 34604033,
              416: 1049600,
              432: 1,
              448: 0,
              464: 34603008,
              480: 33554433,
              496: 1024,
              264: 1049600,
              280: 33555457,
              296: 34603009,
              312: 1,
              328: 33554432,
              344: 1048576,
              360: 1025,
              376: 34604032,
              392: 33554433,
              408: 34603008,
              424: 0,
              440: 34604033,
              456: 1049601,
              472: 1024,
              488: 33555456,
              504: 1048577
            },
            {
              0: 134219808,
              1: 131072,
              2: 134217728,
              3: 32,
              4: 131104,
              5: 134350880,
              6: 134350848,
              7: 2048,
              8: 134348800,
              9: 134219776,
              10: 133120,
              11: 134348832,
              12: 2080,
              13: 0,
              14: 134217760,
              15: 133152,
              2147483648: 2048,
              2147483649: 134350880,
              2147483650: 134219808,
              2147483651: 134217728,
              2147483652: 134348800,
              2147483653: 133120,
              2147483654: 133152,
              2147483655: 32,
              2147483656: 134217760,
              2147483657: 2080,
              2147483658: 131104,
              2147483659: 134350848,
              2147483660: 0,
              2147483661: 134348832,
              2147483662: 134219776,
              2147483663: 131072,
              16: 133152,
              17: 134350848,
              18: 32,
              19: 2048,
              20: 134219776,
              21: 134217760,
              22: 134348832,
              23: 131072,
              24: 0,
              25: 131104,
              26: 134348800,
              27: 134219808,
              28: 134350880,
              29: 133120,
              30: 2080,
              31: 134217728,
              2147483664: 131072,
              2147483665: 2048,
              2147483666: 134348832,
              2147483667: 133152,
              2147483668: 32,
              2147483669: 134348800,
              2147483670: 134217728,
              2147483671: 134219808,
              2147483672: 134350880,
              2147483673: 134217760,
              2147483674: 134219776,
              2147483675: 0,
              2147483676: 133120,
              2147483677: 2080,
              2147483678: 131104,
              2147483679: 134350848
            }
          ];
          var SBOX_MASK = [
            4160749569,
            528482304,
            33030144,
            2064384,
            129024,
            8064,
            504,
            2147483679
          ];
          var DES = C_algo.DES = BlockCipher.extend({
            _doReset: function() {
              var key = this._key;
              var keyWords = key.words;
              var keyBits = [];
              for (var i2 = 0; i2 < 56; i2++) {
                var keyBitPos = PC1[i2] - 1;
                keyBits[i2] = keyWords[keyBitPos >>> 5] >>> 31 - keyBitPos % 32 & 1;
              }
              var subKeys = this._subKeys = [];
              for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
                var subKey = subKeys[nSubKey] = [];
                var bitShift = BIT_SHIFTS[nSubKey];
                for (var i2 = 0; i2 < 24; i2++) {
                  subKey[i2 / 6 | 0] |= keyBits[(PC2[i2] - 1 + bitShift) % 28] << 31 - i2 % 6;
                  subKey[4 + (i2 / 6 | 0)] |= keyBits[28 + (PC2[i2 + 24] - 1 + bitShift) % 28] << 31 - i2 % 6;
                }
                subKey[0] = subKey[0] << 1 | subKey[0] >>> 31;
                for (var i2 = 1; i2 < 7; i2++) {
                  subKey[i2] = subKey[i2] >>> (i2 - 1) * 4 + 3;
                }
                subKey[7] = subKey[7] << 5 | subKey[7] >>> 27;
              }
              var invSubKeys = this._invSubKeys = [];
              for (var i2 = 0; i2 < 16; i2++) {
                invSubKeys[i2] = subKeys[15 - i2];
              }
            },
            encryptBlock: function(M2, offset) {
              this._doCryptBlock(M2, offset, this._subKeys);
            },
            decryptBlock: function(M2, offset) {
              this._doCryptBlock(M2, offset, this._invSubKeys);
            },
            _doCryptBlock: function(M2, offset, subKeys) {
              this._lBlock = M2[offset];
              this._rBlock = M2[offset + 1];
              exchangeLR.call(this, 4, 252645135);
              exchangeLR.call(this, 16, 65535);
              exchangeRL.call(this, 2, 858993459);
              exchangeRL.call(this, 8, 16711935);
              exchangeLR.call(this, 1, 1431655765);
              for (var round = 0; round < 16; round++) {
                var subKey = subKeys[round];
                var lBlock = this._lBlock;
                var rBlock = this._rBlock;
                var f2 = 0;
                for (var i2 = 0; i2 < 8; i2++) {
                  f2 |= SBOX_P[i2][((rBlock ^ subKey[i2]) & SBOX_MASK[i2]) >>> 0];
                }
                this._lBlock = rBlock;
                this._rBlock = lBlock ^ f2;
              }
              var t2 = this._lBlock;
              this._lBlock = this._rBlock;
              this._rBlock = t2;
              exchangeLR.call(this, 1, 1431655765);
              exchangeRL.call(this, 8, 16711935);
              exchangeRL.call(this, 2, 858993459);
              exchangeLR.call(this, 16, 65535);
              exchangeLR.call(this, 4, 252645135);
              M2[offset] = this._lBlock;
              M2[offset + 1] = this._rBlock;
            },
            keySize: 64 / 32,
            ivSize: 64 / 32,
            blockSize: 64 / 32
          });
          function exchangeLR(offset, mask) {
            var t2 = (this._lBlock >>> offset ^ this._rBlock) & mask;
            this._rBlock ^= t2;
            this._lBlock ^= t2 << offset;
          }
          function exchangeRL(offset, mask) {
            var t2 = (this._rBlock >>> offset ^ this._lBlock) & mask;
            this._lBlock ^= t2;
            this._rBlock ^= t2 << offset;
          }
          C2.DES = BlockCipher._createHelper(DES);
          var TripleDES = C_algo.TripleDES = BlockCipher.extend({
            _doReset: function() {
              var key = this._key;
              var keyWords = key.words;
              if (keyWords.length !== 2 && keyWords.length !== 4 && keyWords.length < 6) {
                throw new Error("Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192.");
              }
              var key1 = keyWords.slice(0, 2);
              var key2 = keyWords.length < 4 ? keyWords.slice(0, 2) : keyWords.slice(2, 4);
              var key3 = keyWords.length < 6 ? keyWords.slice(0, 2) : keyWords.slice(4, 6);
              this._des1 = DES.createEncryptor(WordArray.create(key1));
              this._des2 = DES.createEncryptor(WordArray.create(key2));
              this._des3 = DES.createEncryptor(WordArray.create(key3));
            },
            encryptBlock: function(M2, offset) {
              this._des1.encryptBlock(M2, offset);
              this._des2.decryptBlock(M2, offset);
              this._des3.encryptBlock(M2, offset);
            },
            decryptBlock: function(M2, offset) {
              this._des3.decryptBlock(M2, offset);
              this._des2.encryptBlock(M2, offset);
              this._des1.decryptBlock(M2, offset);
            },
            keySize: 192 / 32,
            ivSize: 64 / 32,
            blockSize: 64 / 32
          });
          C2.TripleDES = BlockCipher._createHelper(TripleDES);
        })();
        return CryptoJS2.TripleDES;
      });
    })(tripledes);
    return tripledes.exports;
  }
  var rc4 = { exports: {} };
  var hasRequiredRc4;
  function requireRc4() {
    if (hasRequiredRc4)
      return rc4.exports;
    hasRequiredRc4 = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var StreamCipher = C_lib.StreamCipher;
          var C_algo = C2.algo;
          var RC4 = C_algo.RC4 = StreamCipher.extend({
            _doReset: function() {
              var key = this._key;
              var keyWords = key.words;
              var keySigBytes = key.sigBytes;
              var S2 = this._S = [];
              for (var i2 = 0; i2 < 256; i2++) {
                S2[i2] = i2;
              }
              for (var i2 = 0, j2 = 0; i2 < 256; i2++) {
                var keyByteIndex = i2 % keySigBytes;
                var keyByte = keyWords[keyByteIndex >>> 2] >>> 24 - keyByteIndex % 4 * 8 & 255;
                j2 = (j2 + S2[i2] + keyByte) % 256;
                var t2 = S2[i2];
                S2[i2] = S2[j2];
                S2[j2] = t2;
              }
              this._i = this._j = 0;
            },
            _doProcessBlock: function(M2, offset) {
              M2[offset] ^= generateKeystreamWord.call(this);
            },
            keySize: 256 / 32,
            ivSize: 0
          });
          function generateKeystreamWord() {
            var S2 = this._S;
            var i2 = this._i;
            var j2 = this._j;
            var keystreamWord = 0;
            for (var n2 = 0; n2 < 4; n2++) {
              i2 = (i2 + 1) % 256;
              j2 = (j2 + S2[i2]) % 256;
              var t2 = S2[i2];
              S2[i2] = S2[j2];
              S2[j2] = t2;
              keystreamWord |= S2[(S2[i2] + S2[j2]) % 256] << 24 - n2 * 8;
            }
            this._i = i2;
            this._j = j2;
            return keystreamWord;
          }
          C2.RC4 = StreamCipher._createHelper(RC4);
          var RC4Drop = C_algo.RC4Drop = RC4.extend({
            /**
             * Configuration options.
             *
             * @property {number} drop The number of keystream words to drop. Default 192
             */
            cfg: RC4.cfg.extend({
              drop: 192
            }),
            _doReset: function() {
              RC4._doReset.call(this);
              for (var i2 = this.cfg.drop; i2 > 0; i2--) {
                generateKeystreamWord.call(this);
              }
            }
          });
          C2.RC4Drop = StreamCipher._createHelper(RC4Drop);
        })();
        return CryptoJS2.RC4;
      });
    })(rc4);
    return rc4.exports;
  }
  var rabbit = { exports: {} };
  var hasRequiredRabbit;
  function requireRabbit() {
    if (hasRequiredRabbit)
      return rabbit.exports;
    hasRequiredRabbit = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var StreamCipher = C_lib.StreamCipher;
          var C_algo = C2.algo;
          var S2 = [];
          var C_ = [];
          var G2 = [];
          var Rabbit = C_algo.Rabbit = StreamCipher.extend({
            _doReset: function() {
              var K2 = this._key.words;
              var iv = this.cfg.iv;
              for (var i2 = 0; i2 < 4; i2++) {
                K2[i2] = (K2[i2] << 8 | K2[i2] >>> 24) & 16711935 | (K2[i2] << 24 | K2[i2] >>> 8) & 4278255360;
              }
              var X2 = this._X = [
                K2[0],
                K2[3] << 16 | K2[2] >>> 16,
                K2[1],
                K2[0] << 16 | K2[3] >>> 16,
                K2[2],
                K2[1] << 16 | K2[0] >>> 16,
                K2[3],
                K2[2] << 16 | K2[1] >>> 16
              ];
              var C3 = this._C = [
                K2[2] << 16 | K2[2] >>> 16,
                K2[0] & 4294901760 | K2[1] & 65535,
                K2[3] << 16 | K2[3] >>> 16,
                K2[1] & 4294901760 | K2[2] & 65535,
                K2[0] << 16 | K2[0] >>> 16,
                K2[2] & 4294901760 | K2[3] & 65535,
                K2[1] << 16 | K2[1] >>> 16,
                K2[3] & 4294901760 | K2[0] & 65535
              ];
              this._b = 0;
              for (var i2 = 0; i2 < 4; i2++) {
                nextState.call(this);
              }
              for (var i2 = 0; i2 < 8; i2++) {
                C3[i2] ^= X2[i2 + 4 & 7];
              }
              if (iv) {
                var IV = iv.words;
                var IV_0 = IV[0];
                var IV_1 = IV[1];
                var i0 = (IV_0 << 8 | IV_0 >>> 24) & 16711935 | (IV_0 << 24 | IV_0 >>> 8) & 4278255360;
                var i22 = (IV_1 << 8 | IV_1 >>> 24) & 16711935 | (IV_1 << 24 | IV_1 >>> 8) & 4278255360;
                var i1 = i0 >>> 16 | i22 & 4294901760;
                var i3 = i22 << 16 | i0 & 65535;
                C3[0] ^= i0;
                C3[1] ^= i1;
                C3[2] ^= i22;
                C3[3] ^= i3;
                C3[4] ^= i0;
                C3[5] ^= i1;
                C3[6] ^= i22;
                C3[7] ^= i3;
                for (var i2 = 0; i2 < 4; i2++) {
                  nextState.call(this);
                }
              }
            },
            _doProcessBlock: function(M2, offset) {
              var X2 = this._X;
              nextState.call(this);
              S2[0] = X2[0] ^ X2[5] >>> 16 ^ X2[3] << 16;
              S2[1] = X2[2] ^ X2[7] >>> 16 ^ X2[5] << 16;
              S2[2] = X2[4] ^ X2[1] >>> 16 ^ X2[7] << 16;
              S2[3] = X2[6] ^ X2[3] >>> 16 ^ X2[1] << 16;
              for (var i2 = 0; i2 < 4; i2++) {
                S2[i2] = (S2[i2] << 8 | S2[i2] >>> 24) & 16711935 | (S2[i2] << 24 | S2[i2] >>> 8) & 4278255360;
                M2[offset + i2] ^= S2[i2];
              }
            },
            blockSize: 128 / 32,
            ivSize: 64 / 32
          });
          function nextState() {
            var X2 = this._X;
            var C3 = this._C;
            for (var i2 = 0; i2 < 8; i2++) {
              C_[i2] = C3[i2];
            }
            C3[0] = C3[0] + 1295307597 + this._b | 0;
            C3[1] = C3[1] + 3545052371 + (C3[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
            C3[2] = C3[2] + 886263092 + (C3[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
            C3[3] = C3[3] + 1295307597 + (C3[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
            C3[4] = C3[4] + 3545052371 + (C3[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
            C3[5] = C3[5] + 886263092 + (C3[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
            C3[6] = C3[6] + 1295307597 + (C3[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
            C3[7] = C3[7] + 3545052371 + (C3[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
            this._b = C3[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;
            for (var i2 = 0; i2 < 8; i2++) {
              var gx = X2[i2] + C3[i2];
              var ga = gx & 65535;
              var gb = gx >>> 16;
              var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
              var gl = ((gx & 4294901760) * gx | 0) + ((gx & 65535) * gx | 0);
              G2[i2] = gh ^ gl;
            }
            X2[0] = G2[0] + (G2[7] << 16 | G2[7] >>> 16) + (G2[6] << 16 | G2[6] >>> 16) | 0;
            X2[1] = G2[1] + (G2[0] << 8 | G2[0] >>> 24) + G2[7] | 0;
            X2[2] = G2[2] + (G2[1] << 16 | G2[1] >>> 16) + (G2[0] << 16 | G2[0] >>> 16) | 0;
            X2[3] = G2[3] + (G2[2] << 8 | G2[2] >>> 24) + G2[1] | 0;
            X2[4] = G2[4] + (G2[3] << 16 | G2[3] >>> 16) + (G2[2] << 16 | G2[2] >>> 16) | 0;
            X2[5] = G2[5] + (G2[4] << 8 | G2[4] >>> 24) + G2[3] | 0;
            X2[6] = G2[6] + (G2[5] << 16 | G2[5] >>> 16) + (G2[4] << 16 | G2[4] >>> 16) | 0;
            X2[7] = G2[7] + (G2[6] << 8 | G2[6] >>> 24) + G2[5] | 0;
          }
          C2.Rabbit = StreamCipher._createHelper(Rabbit);
        })();
        return CryptoJS2.Rabbit;
      });
    })(rabbit);
    return rabbit.exports;
  }
  var rabbitLegacy = { exports: {} };
  var hasRequiredRabbitLegacy;
  function requireRabbitLegacy() {
    if (hasRequiredRabbitLegacy)
      return rabbitLegacy.exports;
    hasRequiredRabbitLegacy = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var StreamCipher = C_lib.StreamCipher;
          var C_algo = C2.algo;
          var S2 = [];
          var C_ = [];
          var G2 = [];
          var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
            _doReset: function() {
              var K2 = this._key.words;
              var iv = this.cfg.iv;
              var X2 = this._X = [
                K2[0],
                K2[3] << 16 | K2[2] >>> 16,
                K2[1],
                K2[0] << 16 | K2[3] >>> 16,
                K2[2],
                K2[1] << 16 | K2[0] >>> 16,
                K2[3],
                K2[2] << 16 | K2[1] >>> 16
              ];
              var C3 = this._C = [
                K2[2] << 16 | K2[2] >>> 16,
                K2[0] & 4294901760 | K2[1] & 65535,
                K2[3] << 16 | K2[3] >>> 16,
                K2[1] & 4294901760 | K2[2] & 65535,
                K2[0] << 16 | K2[0] >>> 16,
                K2[2] & 4294901760 | K2[3] & 65535,
                K2[1] << 16 | K2[1] >>> 16,
                K2[3] & 4294901760 | K2[0] & 65535
              ];
              this._b = 0;
              for (var i2 = 0; i2 < 4; i2++) {
                nextState.call(this);
              }
              for (var i2 = 0; i2 < 8; i2++) {
                C3[i2] ^= X2[i2 + 4 & 7];
              }
              if (iv) {
                var IV = iv.words;
                var IV_0 = IV[0];
                var IV_1 = IV[1];
                var i0 = (IV_0 << 8 | IV_0 >>> 24) & 16711935 | (IV_0 << 24 | IV_0 >>> 8) & 4278255360;
                var i22 = (IV_1 << 8 | IV_1 >>> 24) & 16711935 | (IV_1 << 24 | IV_1 >>> 8) & 4278255360;
                var i1 = i0 >>> 16 | i22 & 4294901760;
                var i3 = i22 << 16 | i0 & 65535;
                C3[0] ^= i0;
                C3[1] ^= i1;
                C3[2] ^= i22;
                C3[3] ^= i3;
                C3[4] ^= i0;
                C3[5] ^= i1;
                C3[6] ^= i22;
                C3[7] ^= i3;
                for (var i2 = 0; i2 < 4; i2++) {
                  nextState.call(this);
                }
              }
            },
            _doProcessBlock: function(M2, offset) {
              var X2 = this._X;
              nextState.call(this);
              S2[0] = X2[0] ^ X2[5] >>> 16 ^ X2[3] << 16;
              S2[1] = X2[2] ^ X2[7] >>> 16 ^ X2[5] << 16;
              S2[2] = X2[4] ^ X2[1] >>> 16 ^ X2[7] << 16;
              S2[3] = X2[6] ^ X2[3] >>> 16 ^ X2[1] << 16;
              for (var i2 = 0; i2 < 4; i2++) {
                S2[i2] = (S2[i2] << 8 | S2[i2] >>> 24) & 16711935 | (S2[i2] << 24 | S2[i2] >>> 8) & 4278255360;
                M2[offset + i2] ^= S2[i2];
              }
            },
            blockSize: 128 / 32,
            ivSize: 64 / 32
          });
          function nextState() {
            var X2 = this._X;
            var C3 = this._C;
            for (var i2 = 0; i2 < 8; i2++) {
              C_[i2] = C3[i2];
            }
            C3[0] = C3[0] + 1295307597 + this._b | 0;
            C3[1] = C3[1] + 3545052371 + (C3[0] >>> 0 < C_[0] >>> 0 ? 1 : 0) | 0;
            C3[2] = C3[2] + 886263092 + (C3[1] >>> 0 < C_[1] >>> 0 ? 1 : 0) | 0;
            C3[3] = C3[3] + 1295307597 + (C3[2] >>> 0 < C_[2] >>> 0 ? 1 : 0) | 0;
            C3[4] = C3[4] + 3545052371 + (C3[3] >>> 0 < C_[3] >>> 0 ? 1 : 0) | 0;
            C3[5] = C3[5] + 886263092 + (C3[4] >>> 0 < C_[4] >>> 0 ? 1 : 0) | 0;
            C3[6] = C3[6] + 1295307597 + (C3[5] >>> 0 < C_[5] >>> 0 ? 1 : 0) | 0;
            C3[7] = C3[7] + 3545052371 + (C3[6] >>> 0 < C_[6] >>> 0 ? 1 : 0) | 0;
            this._b = C3[7] >>> 0 < C_[7] >>> 0 ? 1 : 0;
            for (var i2 = 0; i2 < 8; i2++) {
              var gx = X2[i2] + C3[i2];
              var ga = gx & 65535;
              var gb = gx >>> 16;
              var gh = ((ga * ga >>> 17) + ga * gb >>> 15) + gb * gb;
              var gl = ((gx & 4294901760) * gx | 0) + ((gx & 65535) * gx | 0);
              G2[i2] = gh ^ gl;
            }
            X2[0] = G2[0] + (G2[7] << 16 | G2[7] >>> 16) + (G2[6] << 16 | G2[6] >>> 16) | 0;
            X2[1] = G2[1] + (G2[0] << 8 | G2[0] >>> 24) + G2[7] | 0;
            X2[2] = G2[2] + (G2[1] << 16 | G2[1] >>> 16) + (G2[0] << 16 | G2[0] >>> 16) | 0;
            X2[3] = G2[3] + (G2[2] << 8 | G2[2] >>> 24) + G2[1] | 0;
            X2[4] = G2[4] + (G2[3] << 16 | G2[3] >>> 16) + (G2[2] << 16 | G2[2] >>> 16) | 0;
            X2[5] = G2[5] + (G2[4] << 8 | G2[4] >>> 24) + G2[3] | 0;
            X2[6] = G2[6] + (G2[5] << 16 | G2[5] >>> 16) + (G2[4] << 16 | G2[4] >>> 16) | 0;
            X2[7] = G2[7] + (G2[6] << 8 | G2[6] >>> 24) + G2[5] | 0;
          }
          C2.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
        })();
        return CryptoJS2.RabbitLegacy;
      });
    })(rabbitLegacy);
    return rabbitLegacy.exports;
  }
  var blowfish = { exports: {} };
  var hasRequiredBlowfish;
  function requireBlowfish() {
    if (hasRequiredBlowfish)
      return blowfish.exports;
    hasRequiredBlowfish = 1;
    (function(module, exports) {
      (function(root, factory, undef) {
        {
          module.exports = factory(requireCore(), requireEncBase64(), requireMd5(), requireEvpkdf(), requireCipherCore());
        }
      })(commonjsGlobal, function(CryptoJS2) {
        (function() {
          var C2 = CryptoJS2;
          var C_lib = C2.lib;
          var BlockCipher = C_lib.BlockCipher;
          var C_algo = C2.algo;
          const N2 = 16;
          const ORIG_P = [
            608135816,
            2242054355,
            320440878,
            57701188,
            2752067618,
            698298832,
            137296536,
            3964562569,
            1160258022,
            953160567,
            3193202383,
            887688300,
            3232508343,
            3380367581,
            1065670069,
            3041331479,
            2450970073,
            2306472731
          ];
          const ORIG_S = [
            [
              3509652390,
              2564797868,
              805139163,
              3491422135,
              3101798381,
              1780907670,
              3128725573,
              4046225305,
              614570311,
              3012652279,
              134345442,
              2240740374,
              1667834072,
              1901547113,
              2757295779,
              4103290238,
              227898511,
              1921955416,
              1904987480,
              2182433518,
              2069144605,
              3260701109,
              2620446009,
              720527379,
              3318853667,
              677414384,
              3393288472,
              3101374703,
              2390351024,
              1614419982,
              1822297739,
              2954791486,
              3608508353,
              3174124327,
              2024746970,
              1432378464,
              3864339955,
              2857741204,
              1464375394,
              1676153920,
              1439316330,
              715854006,
              3033291828,
              289532110,
              2706671279,
              2087905683,
              3018724369,
              1668267050,
              732546397,
              1947742710,
              3462151702,
              2609353502,
              2950085171,
              1814351708,
              2050118529,
              680887927,
              999245976,
              1800124847,
              3300911131,
              1713906067,
              1641548236,
              4213287313,
              1216130144,
              1575780402,
              4018429277,
              3917837745,
              3693486850,
              3949271944,
              596196993,
              3549867205,
              258830323,
              2213823033,
              772490370,
              2760122372,
              1774776394,
              2652871518,
              566650946,
              4142492826,
              1728879713,
              2882767088,
              1783734482,
              3629395816,
              2517608232,
              2874225571,
              1861159788,
              326777828,
              3124490320,
              2130389656,
              2716951837,
              967770486,
              1724537150,
              2185432712,
              2364442137,
              1164943284,
              2105845187,
              998989502,
              3765401048,
              2244026483,
              1075463327,
              1455516326,
              1322494562,
              910128902,
              469688178,
              1117454909,
              936433444,
              3490320968,
              3675253459,
              1240580251,
              122909385,
              2157517691,
              634681816,
              4142456567,
              3825094682,
              3061402683,
              2540495037,
              79693498,
              3249098678,
              1084186820,
              1583128258,
              426386531,
              1761308591,
              1047286709,
              322548459,
              995290223,
              1845252383,
              2603652396,
              3431023940,
              2942221577,
              3202600964,
              3727903485,
              1712269319,
              422464435,
              3234572375,
              1170764815,
              3523960633,
              3117677531,
              1434042557,
              442511882,
              3600875718,
              1076654713,
              1738483198,
              4213154764,
              2393238008,
              3677496056,
              1014306527,
              4251020053,
              793779912,
              2902807211,
              842905082,
              4246964064,
              1395751752,
              1040244610,
              2656851899,
              3396308128,
              445077038,
              3742853595,
              3577915638,
              679411651,
              2892444358,
              2354009459,
              1767581616,
              3150600392,
              3791627101,
              3102740896,
              284835224,
              4246832056,
              1258075500,
              768725851,
              2589189241,
              3069724005,
              3532540348,
              1274779536,
              3789419226,
              2764799539,
              1660621633,
              3471099624,
              4011903706,
              913787905,
              3497959166,
              737222580,
              2514213453,
              2928710040,
              3937242737,
              1804850592,
              3499020752,
              2949064160,
              2386320175,
              2390070455,
              2415321851,
              4061277028,
              2290661394,
              2416832540,
              1336762016,
              1754252060,
              3520065937,
              3014181293,
              791618072,
              3188594551,
              3933548030,
              2332172193,
              3852520463,
              3043980520,
              413987798,
              3465142937,
              3030929376,
              4245938359,
              2093235073,
              3534596313,
              375366246,
              2157278981,
              2479649556,
              555357303,
              3870105701,
              2008414854,
              3344188149,
              4221384143,
              3956125452,
              2067696032,
              3594591187,
              2921233993,
              2428461,
              544322398,
              577241275,
              1471733935,
              610547355,
              4027169054,
              1432588573,
              1507829418,
              2025931657,
              3646575487,
              545086370,
              48609733,
              2200306550,
              1653985193,
              298326376,
              1316178497,
              3007786442,
              2064951626,
              458293330,
              2589141269,
              3591329599,
              3164325604,
              727753846,
              2179363840,
              146436021,
              1461446943,
              4069977195,
              705550613,
              3059967265,
              3887724982,
              4281599278,
              3313849956,
              1404054877,
              2845806497,
              146425753,
              1854211946
            ],
            [
              1266315497,
              3048417604,
              3681880366,
              3289982499,
              290971e4,
              1235738493,
              2632868024,
              2414719590,
              3970600049,
              1771706367,
              1449415276,
              3266420449,
              422970021,
              1963543593,
              2690192192,
              3826793022,
              1062508698,
              1531092325,
              1804592342,
              2583117782,
              2714934279,
              4024971509,
              1294809318,
              4028980673,
              1289560198,
              2221992742,
              1669523910,
              35572830,
              157838143,
              1052438473,
              1016535060,
              1802137761,
              1753167236,
              1386275462,
              3080475397,
              2857371447,
              1040679964,
              2145300060,
              2390574316,
              1461121720,
              2956646967,
              4031777805,
              4028374788,
              33600511,
              2920084762,
              1018524850,
              629373528,
              3691585981,
              3515945977,
              2091462646,
              2486323059,
              586499841,
              988145025,
              935516892,
              3367335476,
              2599673255,
              2839830854,
              265290510,
              3972581182,
              2759138881,
              3795373465,
              1005194799,
              847297441,
              406762289,
              1314163512,
              1332590856,
              1866599683,
              4127851711,
              750260880,
              613907577,
              1450815602,
              3165620655,
              3734664991,
              3650291728,
              3012275730,
              3704569646,
              1427272223,
              778793252,
              1343938022,
              2676280711,
              2052605720,
              1946737175,
              3164576444,
              3914038668,
              3967478842,
              3682934266,
              1661551462,
              3294938066,
              4011595847,
              840292616,
              3712170807,
              616741398,
              312560963,
              711312465,
              1351876610,
              322626781,
              1910503582,
              271666773,
              2175563734,
              1594956187,
              70604529,
              3617834859,
              1007753275,
              1495573769,
              4069517037,
              2549218298,
              2663038764,
              504708206,
              2263041392,
              3941167025,
              2249088522,
              1514023603,
              1998579484,
              1312622330,
              694541497,
              2582060303,
              2151582166,
              1382467621,
              776784248,
              2618340202,
              3323268794,
              2497899128,
              2784771155,
              503983604,
              4076293799,
              907881277,
              423175695,
              432175456,
              1378068232,
              4145222326,
              3954048622,
              3938656102,
              3820766613,
              2793130115,
              2977904593,
              26017576,
              3274890735,
              3194772133,
              1700274565,
              1756076034,
              4006520079,
              3677328699,
              720338349,
              1533947780,
              354530856,
              688349552,
              3973924725,
              1637815568,
              332179504,
              3949051286,
              53804574,
              2852348879,
              3044236432,
              1282449977,
              3583942155,
              3416972820,
              4006381244,
              1617046695,
              2628476075,
              3002303598,
              1686838959,
              431878346,
              2686675385,
              1700445008,
              1080580658,
              1009431731,
              832498133,
              3223435511,
              2605976345,
              2271191193,
              2516031870,
              1648197032,
              4164389018,
              2548247927,
              300782431,
              375919233,
              238389289,
              3353747414,
              2531188641,
              2019080857,
              1475708069,
              455242339,
              2609103871,
              448939670,
              3451063019,
              1395535956,
              2413381860,
              1841049896,
              1491858159,
              885456874,
              4264095073,
              4001119347,
              1565136089,
              3898914787,
              1108368660,
              540939232,
              1173283510,
              2745871338,
              3681308437,
              4207628240,
              3343053890,
              4016749493,
              1699691293,
              1103962373,
              3625875870,
              2256883143,
              3830138730,
              1031889488,
              3479347698,
              1535977030,
              4236805024,
              3251091107,
              2132092099,
              1774941330,
              1199868427,
              1452454533,
              157007616,
              2904115357,
              342012276,
              595725824,
              1480756522,
              206960106,
              497939518,
              591360097,
              863170706,
              2375253569,
              3596610801,
              1814182875,
              2094937945,
              3421402208,
              1082520231,
              3463918190,
              2785509508,
              435703966,
              3908032597,
              1641649973,
              2842273706,
              3305899714,
              1510255612,
              2148256476,
              2655287854,
              3276092548,
              4258621189,
              236887753,
              3681803219,
              274041037,
              1734335097,
              3815195456,
              3317970021,
              1899903192,
              1026095262,
              4050517792,
              356393447,
              2410691914,
              3873677099,
              3682840055
            ],
            [
              3913112168,
              2491498743,
              4132185628,
              2489919796,
              1091903735,
              1979897079,
              3170134830,
              3567386728,
              3557303409,
              857797738,
              1136121015,
              1342202287,
              507115054,
              2535736646,
              337727348,
              3213592640,
              1301675037,
              2528481711,
              1895095763,
              1721773893,
              3216771564,
              62756741,
              2142006736,
              835421444,
              2531993523,
              1442658625,
              3659876326,
              2882144922,
              676362277,
              1392781812,
              170690266,
              3921047035,
              1759253602,
              3611846912,
              1745797284,
              664899054,
              1329594018,
              3901205900,
              3045908486,
              2062866102,
              2865634940,
              3543621612,
              3464012697,
              1080764994,
              553557557,
              3656615353,
              3996768171,
              991055499,
              499776247,
              1265440854,
              648242737,
              3940784050,
              980351604,
              3713745714,
              1749149687,
              3396870395,
              4211799374,
              3640570775,
              1161844396,
              3125318951,
              1431517754,
              545492359,
              4268468663,
              3499529547,
              1437099964,
              2702547544,
              3433638243,
              2581715763,
              2787789398,
              1060185593,
              1593081372,
              2418618748,
              4260947970,
              69676912,
              2159744348,
              86519011,
              2512459080,
              3838209314,
              1220612927,
              3339683548,
              133810670,
              1090789135,
              1078426020,
              1569222167,
              845107691,
              3583754449,
              4072456591,
              1091646820,
              628848692,
              1613405280,
              3757631651,
              526609435,
              236106946,
              48312990,
              2942717905,
              3402727701,
              1797494240,
              859738849,
              992217954,
              4005476642,
              2243076622,
              3870952857,
              3732016268,
              765654824,
              3490871365,
              2511836413,
              1685915746,
              3888969200,
              1414112111,
              2273134842,
              3281911079,
              4080962846,
              172450625,
              2569994100,
              980381355,
              4109958455,
              2819808352,
              2716589560,
              2568741196,
              3681446669,
              3329971472,
              1835478071,
              660984891,
              3704678404,
              4045999559,
              3422617507,
              3040415634,
              1762651403,
              1719377915,
              3470491036,
              2693910283,
              3642056355,
              3138596744,
              1364962596,
              2073328063,
              1983633131,
              926494387,
              3423689081,
              2150032023,
              4096667949,
              1749200295,
              3328846651,
              309677260,
              2016342300,
              1779581495,
              3079819751,
              111262694,
              1274766160,
              443224088,
              298511866,
              1025883608,
              3806446537,
              1145181785,
              168956806,
              3641502830,
              3584813610,
              1689216846,
              3666258015,
              3200248200,
              1692713982,
              2646376535,
              4042768518,
              1618508792,
              1610833997,
              3523052358,
              4130873264,
              2001055236,
              3610705100,
              2202168115,
              4028541809,
              2961195399,
              1006657119,
              2006996926,
              3186142756,
              1430667929,
              3210227297,
              1314452623,
              4074634658,
              4101304120,
              2273951170,
              1399257539,
              3367210612,
              3027628629,
              1190975929,
              2062231137,
              2333990788,
              2221543033,
              2438960610,
              1181637006,
              548689776,
              2362791313,
              3372408396,
              3104550113,
              3145860560,
              296247880,
              1970579870,
              3078560182,
              3769228297,
              1714227617,
              3291629107,
              3898220290,
              166772364,
              1251581989,
              493813264,
              448347421,
              195405023,
              2709975567,
              677966185,
              3703036547,
              1463355134,
              2715995803,
              1338867538,
              1343315457,
              2802222074,
              2684532164,
              233230375,
              2599980071,
              2000651841,
              3277868038,
              1638401717,
              4028070440,
              3237316320,
              6314154,
              819756386,
              300326615,
              590932579,
              1405279636,
              3267499572,
              3150704214,
              2428286686,
              3959192993,
              3461946742,
              1862657033,
              1266418056,
              963775037,
              2089974820,
              2263052895,
              1917689273,
              448879540,
              3550394620,
              3981727096,
              150775221,
              3627908307,
              1303187396,
              508620638,
              2975983352,
              2726630617,
              1817252668,
              1876281319,
              1457606340,
              908771278,
              3720792119,
              3617206836,
              2455994898,
              1729034894,
              1080033504
            ],
            [
              976866871,
              3556439503,
              2881648439,
              1522871579,
              1555064734,
              1336096578,
              3548522304,
              2579274686,
              3574697629,
              3205460757,
              3593280638,
              3338716283,
              3079412587,
              564236357,
              2993598910,
              1781952180,
              1464380207,
              3163844217,
              3332601554,
              1699332808,
              1393555694,
              1183702653,
              3581086237,
              1288719814,
              691649499,
              2847557200,
              2895455976,
              3193889540,
              2717570544,
              1781354906,
              1676643554,
              2592534050,
              3230253752,
              1126444790,
              2770207658,
              2633158820,
              2210423226,
              2615765581,
              2414155088,
              3127139286,
              673620729,
              2805611233,
              1269405062,
              4015350505,
              3341807571,
              4149409754,
              1057255273,
              2012875353,
              2162469141,
              2276492801,
              2601117357,
              993977747,
              3918593370,
              2654263191,
              753973209,
              36408145,
              2530585658,
              25011837,
              3520020182,
              2088578344,
              530523599,
              2918365339,
              1524020338,
              1518925132,
              3760827505,
              3759777254,
              1202760957,
              3985898139,
              3906192525,
              674977740,
              4174734889,
              2031300136,
              2019492241,
              3983892565,
              4153806404,
              3822280332,
              352677332,
              2297720250,
              60907813,
              90501309,
              3286998549,
              1016092578,
              2535922412,
              2839152426,
              457141659,
              509813237,
              4120667899,
              652014361,
              1966332200,
              2975202805,
              55981186,
              2327461051,
              676427537,
              3255491064,
              2882294119,
              3433927263,
              1307055953,
              942726286,
              933058658,
              2468411793,
              3933900994,
              4215176142,
              1361170020,
              2001714738,
              2830558078,
              3274259782,
              1222529897,
              1679025792,
              2729314320,
              3714953764,
              1770335741,
              151462246,
              3013232138,
              1682292957,
              1483529935,
              471910574,
              1539241949,
              458788160,
              3436315007,
              1807016891,
              3718408830,
              978976581,
              1043663428,
              3165965781,
              1927990952,
              4200891579,
              2372276910,
              3208408903,
              3533431907,
              1412390302,
              2931980059,
              4132332400,
              1947078029,
              3881505623,
              4168226417,
              2941484381,
              1077988104,
              1320477388,
              886195818,
              18198404,
              3786409e3,
              2509781533,
              112762804,
              3463356488,
              1866414978,
              891333506,
              18488651,
              661792760,
              1628790961,
              3885187036,
              3141171499,
              876946877,
              2693282273,
              1372485963,
              791857591,
              2686433993,
              3759982718,
              3167212022,
              3472953795,
              2716379847,
              445679433,
              3561995674,
              3504004811,
              3574258232,
              54117162,
              3331405415,
              2381918588,
              3769707343,
              4154350007,
              1140177722,
              4074052095,
              668550556,
              3214352940,
              367459370,
              261225585,
              2610173221,
              4209349473,
              3468074219,
              3265815641,
              314222801,
              3066103646,
              3808782860,
              282218597,
              3406013506,
              3773591054,
              379116347,
              1285071038,
              846784868,
              2669647154,
              3771962079,
              3550491691,
              2305946142,
              453669953,
              1268987020,
              3317592352,
              3279303384,
              3744833421,
              2610507566,
              3859509063,
              266596637,
              3847019092,
              517658769,
              3462560207,
              3443424879,
              370717030,
              4247526661,
              2224018117,
              4143653529,
              4112773975,
              2788324899,
              2477274417,
              1456262402,
              2901442914,
              1517677493,
              1846949527,
              2295493580,
              3734397586,
              2176403920,
              1280348187,
              1908823572,
              3871786941,
              846861322,
              1172426758,
              3287448474,
              3383383037,
              1655181056,
              3139813346,
              901632758,
              1897031941,
              2986607138,
              3066810236,
              3447102507,
              1393639104,
              373351379,
              950779232,
              625454576,
              3124240540,
              4148612726,
              2007998917,
              544563296,
              2244738638,
              2330496472,
              2058025392,
              1291430526,
              424198748,
              50039436,
              29584100,
              3605783033,
              2429876329,
              2791104160,
              1057563949,
              3255363231,
              3075367218,
              3463963227,
              1469046755,
              985887462
            ]
          ];
          var BLOWFISH_CTX = {
            pbox: [],
            sbox: []
          };
          function F2(ctx, x) {
            let a2 = x >> 24 & 255;
            let b2 = x >> 16 & 255;
            let c2 = x >> 8 & 255;
            let d2 = x & 255;
            let y2 = ctx.sbox[0][a2] + ctx.sbox[1][b2];
            y2 = y2 ^ ctx.sbox[2][c2];
            y2 = y2 + ctx.sbox[3][d2];
            return y2;
          }
          function BlowFish_Encrypt(ctx, left, right) {
            let Xl = left;
            let Xr = right;
            let temp;
            for (let i2 = 0; i2 < N2; ++i2) {
              Xl = Xl ^ ctx.pbox[i2];
              Xr = F2(ctx, Xl) ^ Xr;
              temp = Xl;
              Xl = Xr;
              Xr = temp;
            }
            temp = Xl;
            Xl = Xr;
            Xr = temp;
            Xr = Xr ^ ctx.pbox[N2];
            Xl = Xl ^ ctx.pbox[N2 + 1];
            return { left: Xl, right: Xr };
          }
          function BlowFish_Decrypt(ctx, left, right) {
            let Xl = left;
            let Xr = right;
            let temp;
            for (let i2 = N2 + 1; i2 > 1; --i2) {
              Xl = Xl ^ ctx.pbox[i2];
              Xr = F2(ctx, Xl) ^ Xr;
              temp = Xl;
              Xl = Xr;
              Xr = temp;
            }
            temp = Xl;
            Xl = Xr;
            Xr = temp;
            Xr = Xr ^ ctx.pbox[1];
            Xl = Xl ^ ctx.pbox[0];
            return { left: Xl, right: Xr };
          }
          function BlowFishInit(ctx, key, keysize) {
            for (let Row = 0; Row < 4; Row++) {
              ctx.sbox[Row] = [];
              for (let Col = 0; Col < 256; Col++) {
                ctx.sbox[Row][Col] = ORIG_S[Row][Col];
              }
            }
            let keyIndex = 0;
            for (let index = 0; index < N2 + 2; index++) {
              ctx.pbox[index] = ORIG_P[index] ^ key[keyIndex];
              keyIndex++;
              if (keyIndex >= keysize) {
                keyIndex = 0;
              }
            }
            let Data1 = 0;
            let Data2 = 0;
            let res = 0;
            for (let i2 = 0; i2 < N2 + 2; i2 += 2) {
              res = BlowFish_Encrypt(ctx, Data1, Data2);
              Data1 = res.left;
              Data2 = res.right;
              ctx.pbox[i2] = Data1;
              ctx.pbox[i2 + 1] = Data2;
            }
            for (let i2 = 0; i2 < 4; i2++) {
              for (let j2 = 0; j2 < 256; j2 += 2) {
                res = BlowFish_Encrypt(ctx, Data1, Data2);
                Data1 = res.left;
                Data2 = res.right;
                ctx.sbox[i2][j2] = Data1;
                ctx.sbox[i2][j2 + 1] = Data2;
              }
            }
            return true;
          }
          var Blowfish = C_algo.Blowfish = BlockCipher.extend({
            _doReset: function() {
              if (this._keyPriorReset === this._key) {
                return;
              }
              var key = this._keyPriorReset = this._key;
              var keyWords = key.words;
              var keySize = key.sigBytes / 4;
              BlowFishInit(BLOWFISH_CTX, keyWords, keySize);
            },
            encryptBlock: function(M2, offset) {
              var res = BlowFish_Encrypt(BLOWFISH_CTX, M2[offset], M2[offset + 1]);
              M2[offset] = res.left;
              M2[offset + 1] = res.right;
            },
            decryptBlock: function(M2, offset) {
              var res = BlowFish_Decrypt(BLOWFISH_CTX, M2[offset], M2[offset + 1]);
              M2[offset] = res.left;
              M2[offset + 1] = res.right;
            },
            blockSize: 64 / 32,
            keySize: 128 / 32,
            ivSize: 64 / 32
          });
          C2.Blowfish = BlockCipher._createHelper(Blowfish);
        })();
        return CryptoJS2.Blowfish;
      });
    })(blowfish);
    return blowfish.exports;
  }
  (function(module, exports) {
    (function(root, factory, undef) {
      {
        module.exports = factory(requireCore(), requireX64Core(), requireLibTypedarrays(), requireEncUtf16(), requireEncBase64(), requireEncBase64url(), requireMd5(), requireSha1(), requireSha256(), requireSha224(), requireSha512(), requireSha384(), requireSha3(), requireRipemd160(), requireHmac(), requirePbkdf2(), requireEvpkdf(), requireCipherCore(), requireModeCfb(), requireModeCtr(), requireModeCtrGladman(), requireModeOfb(), requireModeEcb(), requirePadAnsix923(), requirePadIso10126(), requirePadIso97971(), requirePadZeropadding(), requirePadNopadding(), requireFormatHex(), requireAes(), requireTripledes(), requireRc4(), requireRabbit(), requireRabbitLegacy(), requireBlowfish());
      }
    })(commonjsGlobal, function(CryptoJS2) {
      return CryptoJS2;
    });
  })(cryptoJs);
  var cryptoJsExports = cryptoJs.exports;
  const CryptoJS = /* @__PURE__ */ getDefaultExportFromCjs(cryptoJsExports);
  function signRequest(params) {
    const sortedParams = Object.keys(params).sort().map((key) => `${key}=${params[key]}`).join("&");
    const signStr = `${sortedParams}${gaodeSecurityKey}`;
    const sign = CryptoJS.MD5(signStr).toString();
    return `${sortedParams}&sig=${sign}`;
  }
  const _imports_0$2 = "/static/icons/check.png";
  const AMAP_API = "https://restapi.amap.com/v3";
  const _sfc_main$d = {
    name: "LocationSharing",
    data() {
      return {
        currentLocation: {
          latitude: 39.909604,
          longitude: 116.397228
        },
        searchKeyword: "",
        markers: [],
        nearbyPOIs: [],
        selectedPOI: null,
        searchDebounceTimer: null
      };
    },
    mounted() {
      this.getCurrentLocation();
      this.hideMessageInput();
    },
    beforeDestroy() {
      this.showMessageInput();
    },
    methods: {
      getCurrentLocation() {
        uni.getLocation({
          type: "gcj02",
          success: (res) => {
            this.currentLocation = {
              latitude: res.latitude,
              longitude: res.longitude
            };
            this.updateMarkers();
            this.searchNearbyPOIs();
          },
          fail: (err) => {
            formatAppLog("error", "at pages/message/ChatComponent/ChatInputAreaComponent/LocationSharing.vue:89", "获取位置失败:", err);
            uni.showToast({
              title: "获取位置失败，请检查定位权限",
              icon: "none"
            });
          }
        });
      },
      updateMarkers() {
        this.markers = [{
          id: 1,
          latitude: this.currentLocation.latitude,
          longitude: this.currentLocation.longitude,
          iconPath: "/static/icons/location-blue.png",
          width: 32,
          height: 32
        }];
        if (this.selectedPOI) {
          this.markers.push({
            id: 2,
            latitude: this.selectedPOI.location.split(",")[1],
            longitude: this.selectedPOI.location.split(",")[0],
            iconPath: "/static/icons/location-red.png",
            width: 32,
            height: 32
          });
        }
      },
      async searchNearbyPOIs(keyword = "") {
        try {
          const location2 = `${this.currentLocation.longitude},${this.currentLocation.latitude}`;
          const params = {
            key: gaodeApiKey,
            location: location2,
            keywords: keyword,
            radius: 1e3,
            extensions: "all"
          };
          const signedParams = signRequest(params);
          const url = `${AMAP_API}/place/around?${signedParams}`;
          const response = await uni.request({
            url,
            method: "GET"
          });
          if (response.data.status === "1") {
            this.nearbyPOIs = response.data.pois.map((poi) => ({
              id: poi.id,
              name: poi.name,
              address: poi.address,
              location: poi.location,
              distance: poi.distance
            }));
          } else {
            throw new Error(response.data.info || "未知错误");
          }
        } catch (error) {
          formatAppLog("error", "at pages/message/ChatComponent/ChatInputAreaComponent/LocationSharing.vue:148", "搜索位置失败:", error);
          let errorMessage = "搜索位置失败，请稍后重试";
          if (error.message === "USERKEY_PLAT_NOMATCH") {
            errorMessage = "API密钥配置错误，请联系管理员";
          }
          uni.showToast({
            title: errorMessage,
            icon: "none"
          });
        }
      },
      handleSearch(event2) {
        if (this.searchDebounceTimer) {
          clearTimeout(this.searchDebounceTimer);
        }
        this.searchDebounceTimer = setTimeout(() => {
          this.searchNearbyPOIs(event2.detail.value);
        }, 500);
      },
      selectLocation(poi) {
        this.selectedPOI = poi;
        this.updateMarkers();
      },
      async handleMapTap(e2) {
        const { latitude, longitude } = e2.detail;
        try {
          const params = {
            key: gaodeApiKey,
            location: `${longitude},${latitude}`
          };
          const signedParams = signRequest(params);
          const url = `${AMAP_API}/geocode/regeo?${signedParams}`;
          const response = await uni.request({ url });
          if (response.data.status === "1") {
            const regeocode = response.data.regeocode;
            this.selectedPOI = {
              id: Date.now().toString(),
              name: regeocode.formatted_address,
              address: regeocode.addressComponent.street + regeocode.addressComponent.streetNumber,
              location: `${longitude},${latitude}`
            };
            this.updateMarkers();
          } else {
            throw new Error(response.data.info || "获取地址信息失败");
          }
        } catch (error) {
          formatAppLog("error", "at pages/message/ChatComponent/ChatInputAreaComponent/LocationSharing.vue:196", "获取地址信息失败:", error);
          uni.showToast({
            title: "获取地址信息失败，请重试",
            icon: "none"
          });
        }
      },
      handleComplete() {
        if (!this.selectedPOI) {
          uni.showToast({
            title: "请选择位置",
            icon: "none"
          });
          return;
        }
        const locationData = {
          latitude: parseFloat(this.selectedPOI.location.split(",")[1]),
          longitude: parseFloat(this.selectedPOI.location.split(",")[0]),
          name: this.selectedPOI.name,
          address: this.selectedPOI.address,
          messageType: "location"
        };
        formatAppLog("log", "at pages/message/ChatComponent/ChatInputAreaComponent/LocationSharing.vue:220", "LocationSharing: 发送位置数据", locationData);
        this.$emit("location-selected", locationData);
        this.$emit("close");
      },
      formatDistance(distance) {
        if (distance < 1e3) {
          return `${distance}米`;
        }
        return `${(distance / 1e3).toFixed(1)}千米`;
      },
      hideMessageInput() {
        this.$emit("hide-message-input", true);
        uni.$emit("hide-chat-input", true);
      },
      showMessageInput() {
        this.$emit("show-message-input");
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "location-sharing" }, [
      vue.createElementVNode("view", { class: "map-container" }, [
        vue.createElementVNode("map", {
          id: "locationMap",
          class: "map",
          latitude: $data.currentLocation.latitude,
          longitude: $data.currentLocation.longitude,
          markers: $data.markers,
          scale: 16,
          "show-location": "",
          onTap: _cache[0] || (_cache[0] = (...args) => $options.handleMapTap && $options.handleMapTap(...args))
        }, null, 40, ["latitude", "longitude", "markers"])
      ]),
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("view", { class: "search-bar" }, [
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "text",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.searchKeyword = $event),
              placeholder: "搜索地点",
              onInput: _cache[2] || (_cache[2] = (...args) => $options.handleSearch && $options.handleSearch(...args))
            },
            null,
            544
            /* NEED_HYDRATION, NEED_PATCH */
          ), [
            [vue.vModelText, $data.searchKeyword]
          ])
        ]),
        vue.createElementVNode("button", {
          class: "complete-btn",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.handleComplete && $options.handleComplete(...args))
        }, "完成")
      ]),
      vue.createElementVNode("view", { class: "location-list" }, [
        vue.createElementVNode("scroll-view", {
          "scroll-y": "",
          class: "scroll-view"
        }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.nearbyPOIs, (poi, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: "location-item",
                onClick: ($event) => $options.selectLocation(poi)
              }, [
                vue.createElementVNode(
                  "view",
                  { class: "location-name" },
                  vue.toDisplayString(poi.name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "view",
                  { class: "location-address" },
                  vue.toDisplayString(poi.address),
                  1
                  /* TEXT */
                ),
                poi.distance ? (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 0,
                    class: "location-distance"
                  },
                  vue.toDisplayString($options.formatDistance(poi.distance)),
                  1
                  /* TEXT */
                )) : vue.createCommentVNode("v-if", true),
                $data.selectedPOI && $data.selectedPOI.id === poi.id ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 1,
                  class: "location-check"
                }, [
                  vue.createElementVNode("image", {
                    src: _imports_0$2,
                    class: "check-icon"
                  })
                ])) : vue.createCommentVNode("v-if", true)
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])
    ]);
  }
  const LocationSharing = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-5719cec1"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/ChatComponent/ChatInputAreaComponent/LocationSharing.vue"]]);
  const _imports_0$1 = "/static/message/语音输入.png";
  const _sfc_main$c = {
    name: "ChatInputArea",
    components: {
      AttachmentMenu,
      FileTransfer,
      LocationSharing
    },
    props: {
      showAttachMenu: {
        type: Boolean,
        default: false
      },
      recipientId: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        newMessage: "",
        showLocationSharing: false,
        _selfAvatar: "/static/avatar/avatar5.jpeg"
      };
    },
    methods: {
      async sendMessage(message) {
        formatAppLog("log", "at pages/message/ChatComponent/ChatInputArea.vue:83", "sendMessage 方法被调用");
        if (typeof message === "object" && message.type === "location") {
          this.$emit("send-message", message);
          return;
        }
        if (typeof this.newMessage !== "string" || !this.newMessage.trim()) {
          formatAppLog("log", "at pages/message/ChatComponent/ChatInputArea.vue:91", "消息为空或不是字符串，不发送");
          return;
        }
        const messageData = {
          message: this.newMessage,
          recipientId: this.recipientId
        };
        formatAppLog("log", "at pages/message/ChatComponent/ChatInputArea.vue:100", "准备发送消息:", messageData);
        this.$emit("send-message", {
          content: this.newMessage,
          status: "sending"
        });
        try {
          formatAppLog("log", "at pages/message/ChatComponent/ChatInputArea.vue:108", "调用 sendMessageToUser");
          const response = await sendMessageToUser(messageData);
          formatAppLog("log", "at pages/message/ChatComponent/ChatInputArea.vue:110", "sendMessageToUser 响应:", response);
          if (response.code === 200) {
            formatAppLog("log", "at pages/message/ChatComponent/ChatInputArea.vue:112", "消息发送成功");
            this.$emit("message-sent", { ...response.data, message: this.newMessage });
          } else {
            formatAppLog("error", "at pages/message/ChatComponent/ChatInputArea.vue:115", "消息发送失败:", response.msg);
            this.$emit("message-failed", { message: this.newMessage });
          }
        } catch (error) {
          formatAppLog("error", "at pages/message/ChatComponent/ChatInputArea.vue:119", "发送消息失败:", error);
          this.$emit("message-failed", { message: this.newMessage });
        }
        this.newMessage = "";
      },
      toggleAttachMenu() {
        formatAppLog("log", "at pages/message/ChatComponent/ChatInputArea.vue:126", "切换附件菜单");
        this.$emit("toggle-attach-menu", !this.showAttachMenu);
      },
      closeAttachMenu() {
        formatAppLog("log", "at pages/message/ChatComponent/ChatInputArea.vue:130", "关闭附件菜单");
        this.$emit("toggle-attach-menu", false);
      },
      attachItem(action) {
        formatAppLog("log", "at pages/message/ChatComponent/ChatInputArea.vue:134", "附件项被选择:", action);
        if (action === "file") {
          this.$refs.fileTransfer.chooseFile();
        } else if (action === "burn-after-reading") {
          this.chooseBurnAfterReadingImage();
        } else if (action === "camera") {
          this.takePhoto();
        } else if (action === "album") {
          this.chooseAndSendPhoto();
        } else if (action === "location") {
          this.openLocationSharing();
        } else if (action === "video-call") {
          this.$emit("video-call", action);
        } else {
          this.$emit("attach", action);
        }
        if (action !== "location") {
          this.closeAttachMenu();
        }
      },
      handleFileSelected(fileData) {
        formatAppLog("log", "at pages/message/ChatComponent/ChatInputArea.vue:155", "文件被选择:", fileData);
        this.$emit("attach", "file", fileData);
      },
      chooseBurnAfterReadingImage() {
        formatAppLog("log", "at pages/message/ChatComponent/ChatInputArea.vue:159", "选择阅后即焚图片");
        uni.chooseImage({
          count: 1,
          success: (res) => {
            const image = res.tempFilePaths[0];
            this.applyMosaicEffect(image, (mosaicImage) => {
              this.$emit("attach", "burn-after-reading", {
                originalPath: image,
                mosaicPath: mosaicImage,
                duration: 5
              });
            });
          },
          fail: (err) => {
            formatAppLog("error", "at pages/message/ChatComponent/ChatInputArea.vue:173", "选择图片失败", err);
          }
        });
      },
      applyMosaicEffect(imagePath, callback) {
        const ctx = uni.createCanvasContext("mosaicCanvas");
        ctx.drawImage(imagePath, 0, 0, 300, 300);
        ctx.setFillStyle("rgba(0, 0, 0, 0.5)");
        for (let y2 = 0; y2 < 300; y2 += 10) {
          for (let x = 0; x < 300; x += 10) {
            ctx.fillRect(x, y2, 10, 10);
          }
        }
        ctx.draw(false, () => {
          uni.canvasToTempFilePath({
            canvasId: "mosaicCanvas",
            success: (res) => {
              callback(res.tempFilePath);
            },
            fail: (err) => {
              formatAppLog("error", "at pages/message/ChatComponent/ChatInputArea.vue:196", "马赛克处理失败", err);
            }
          });
        });
      },
      async takePhoto() {
        formatAppLog("log", "at pages/message/ChatComponent/ChatInputArea.vue:202", "拍摄照片");
        uni.chooseImage({
          count: 1,
          sourceType: ["camera"],
          success: async (res) => {
            const tempFilePath = res.tempFilePaths[0];
            try {
              const response = await sendMessageToUser({
                recipientId: this.recipientId,
                content: tempFilePath,
                messageType: "IMAGE"
              });
              if (response.code === 200) {
                formatAppLog("log", "at pages/message/ChatComponent/ChatInputArea.vue:215", "图片消息发送成功");
                this.$emit("send-message", {
                  type: "image",
                  content: tempFilePath
                });
              } else {
                formatAppLog("error", "at pages/message/ChatComponent/ChatInputArea.vue:221", "发送图片消息失败:", response.msg);
                uni.showToast({
                  title: "发送失败，请重试",
                  icon: "none"
                });
              }
            } catch (error) {
              formatAppLog("error", "at pages/message/ChatComponent/ChatInputArea.vue:228", "发送图片消息出错:", error);
              uni.showToast({
                title: "发送失败，请重试",
                icon: "none"
              });
            }
          },
          fail: (err) => {
            formatAppLog("error", "at pages/message/ChatComponent/ChatInputArea.vue:236", "拍照失败:", err);
            uni.showToast({
              title: "拍照失败",
              icon: "none"
            });
          }
        });
      },
      chooseAndSendPhoto() {
        formatAppLog("log", "at pages/message/ChatComponent/ChatInputArea.vue:245", "从相册选择照片");
        uni.chooseImage({
          count: 1,
          sourceType: ["album"],
          success: async (res) => {
            const tempFilePath = res.tempFilePaths[0];
            try {
              const response = await sendMessageToUser({
                recipientId: this.recipientId,
                content: tempFilePath,
                messageType: "IMAGE"
              });
              if (response.code === 200) {
                formatAppLog("log", "at pages/message/ChatComponent/ChatInputArea.vue:258", "图片消息发送成功");
                this.$emit("send-message", {
                  type: "image",
                  content: tempFilePath
                });
              } else {
                formatAppLog("error", "at pages/message/ChatComponent/ChatInputArea.vue:264", "发送图片消息失败:", response.msg);
                uni.showToast({
                  title: "发送失败，请重试",
                  icon: "none"
                });
              }
            } catch (error) {
              formatAppLog("error", "at pages/message/ChatComponent/ChatInputArea.vue:271", "发送图片消息出错:", error);
              uni.showToast({
                title: "发送失败，请重试",
                icon: "none"
              });
            }
          },
          fail: (err) => {
            formatAppLog("error", "at pages/message/ChatComponent/ChatInputArea.vue:279", "选择图片失败:", err);
            uni.showToast({
              title: "选择图片失败",
              icon: "none"
            });
          }
        });
      },
      openLocationSharing() {
        formatAppLog("log", "at pages/message/ChatComponent/ChatInputArea.vue:288", "打开位置分享");
        this.showLocationSharing = true;
        this.closeAttachMenu();
      },
      closeLocationSharing() {
        formatAppLog("log", "at pages/message/ChatComponent/ChatInputArea.vue:293", "关闭位置分享");
        this.showLocationSharing = false;
      },
      async handleLocationSelected(location2) {
        formatAppLog("log", "at pages/message/ChatComponent/ChatInputArea.vue:297", "位置被选择:", JSON.stringify(location2));
        try {
          const response = {
            code: 200,
            msg: "位置消息发送成功",
            data: {
              id: Date.now().toString(),
              sendTime: (/* @__PURE__ */ new Date()).toISOString()
            }
          };
          formatAppLog("log", "at pages/message/ChatComponent/ChatInputArea.vue:308", "模拟发送位置消息响应:", response);
          if (response.code === 200) {
            formatAppLog("log", "at pages/message/ChatComponent/ChatInputArea.vue:310", "位置消息发送成功");
            this.$emit("send-message", {
              type: "location",
              content: location2,
              userType: "self",
              avatar: this._selfAvatar,
              timestamp: new Date(response.data.sendTime),
              id: response.data.id,
              status: "sent"
            });
          } else {
            throw new Error(response.msg || "发送失败");
          }
        } catch (error) {
          formatAppLog("error", "at pages/message/ChatComponent/ChatInputArea.vue:324", "发送位置消息失败:", error);
          uni.showToast({
            title: "发送失败，请重试",
            icon: "none"
          });
        }
        this.closeLocationSharing();
      },
      startVideoCall() {
        formatAppLog("log", "at pages/message/ChatComponent/ChatInputArea.vue:333", "开始视频通话");
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_attachment_menu = vue.resolveComponent("attachment-menu");
    const _component_location_sharing = vue.resolveComponent("location-sharing");
    const _component_file_transfer = vue.resolveComponent("file-transfer");
    return vue.openBlock(), vue.createElementBlock("view", { class: "chat-input-area" }, [
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["chat-input", { "elevated": $props.showAttachMenu }])
        },
        [
          vue.createElementVNode("view", { class: "voice-button" }, [
            vue.createElementVNode("image", {
              src: _imports_0$1,
              class: "voice-icon"
            })
          ]),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              type: "text",
              class: "text-input",
              placeholder: "输入消息...",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.newMessage = $event),
              onConfirm: _cache[1] || (_cache[1] = (...args) => $options.sendMessage && $options.sendMessage(...args)),
              ref: "messageInput"
            },
            null,
            544
            /* NEED_HYDRATION, NEED_PATCH */
          ), [
            [vue.vModelText, $data.newMessage]
          ]),
          !$props.showAttachMenu ? (vue.openBlock(), vue.createElementBlock("text", {
            key: 0,
            class: "attach-button",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.toggleAttachMenu && $options.toggleAttachMenu(...args))
          }, "+")) : vue.createCommentVNode("v-if", true),
          $props.showAttachMenu ? (vue.openBlock(), vue.createElementBlock("text", {
            key: 1,
            class: "send-button",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.sendMessage && $options.sendMessage(...args))
          }, "发送")) : vue.createCommentVNode("v-if", true)
        ],
        2
        /* CLASS */
      ),
      $props.showAttachMenu ? (vue.openBlock(), vue.createBlock(_component_attachment_menu, {
        key: 0,
        onAttach: $options.attachItem,
        onClose: $options.closeAttachMenu
      }, {
        album: vue.withCtx(() => [
          vue.createElementVNode("view", {
            onClick: _cache[4] || (_cache[4] = (...args) => $options.chooseAndSendPhoto && $options.chooseAndSendPhoto(...args))
          }, "从相册选择")
        ]),
        camera: vue.withCtx(() => [
          vue.createElementVNode("view", {
            onClick: _cache[5] || (_cache[5] = (...args) => $options.takePhoto && $options.takePhoto(...args))
          }, "拍摄")
        ]),
        "video-call": vue.withCtx(() => [
          vue.createElementVNode("view", {
            onClick: _cache[6] || (_cache[6] = (...args) => $options.startVideoCall && $options.startVideoCall(...args))
          }, "视频通话")
        ]),
        location: vue.withCtx(() => [
          vue.createElementVNode("view", {
            onClick: _cache[7] || (_cache[7] = (...args) => $options.openLocationSharing && $options.openLocationSharing(...args))
          }, "发送位置")
        ]),
        _: 1
        /* STABLE */
      }, 8, ["onAttach", "onClose"])) : vue.createCommentVNode("v-if", true),
      $data.showLocationSharing ? (vue.openBlock(), vue.createBlock(_component_location_sharing, {
        key: 1,
        onLocationSelected: $options.handleLocationSelected,
        onClose: $options.closeLocationSharing
      }, null, 8, ["onLocationSelected", "onClose"])) : vue.createCommentVNode("v-if", true),
      vue.createVNode(_component_file_transfer, {
        ref: "fileTransfer",
        onFileSelected: $options.handleFileSelected
      }, null, 8, ["onFileSelected"])
    ]);
  }
  const ChatInputArea = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-e8a570ad"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/ChatComponent/ChatInputArea.vue"]]);
  const _sfc_main$b = {
    name: "BurnAfterReading",
    props: {
      // 图片源
      imageSrc: {
        type: String,
        required: true
      },
      // 持续时间（秒）
      duration: {
        type: Number,
        default: 5
      }
    },
    data() {
      return {
        isOpen: false,
        // 控制组件是否显示
        remainingTime: 0,
        // 剩余时间
        timer: null
        // 定时器
      };
    },
    methods: {
      // 打开阅后即焚预览
      open() {
        this.isOpen = true;
        this.remainingTime = this.duration;
        this.startCountdown();
      },
      // 关闭阅后即焚预览
      close() {
        this.isOpen = false;
        this.stopCountdown();
        this.$emit("close");
      },
      // 开始倒计时
      startCountdown() {
        this.timer = setInterval(() => {
          this.remainingTime--;
          if (this.remainingTime <= 0) {
            this.close();
          }
        }, 1e3);
      },
      // 停止倒计时
      stopCountdown() {
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
      }
    },
    // 组件销毁前清除定时器
    beforeDestroy() {
      this.stopCountdown();
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return $data.isOpen ? (vue.openBlock(), vue.createElementBlock("view", {
      key: 0,
      class: "burn-after-reading-overlay",
      onClick: _cache[1] || (_cache[1] = (...args) => $options.close && $options.close(...args))
    }, [
      vue.createCommentVNode(" 阅后即焚图片 "),
      vue.createElementVNode("image", {
        src: $props.imageSrc,
        mode: "aspectFit",
        class: "burn-after-reading-image",
        onClick: _cache[0] || (_cache[0] = vue.withModifiers(() => {
        }, ["stop"]))
      }, null, 8, ["src"]),
      vue.createCommentVNode(" 倒计时 "),
      vue.createElementVNode(
        "view",
        { class: "countdown" },
        vue.toDisplayString($data.remainingTime) + "s",
        1
        /* TEXT */
      )
    ])) : vue.createCommentVNode("v-if", true);
  }
  const BurnAfterReading = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-3b98a725"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/ChatComponent/BurnAfterReading.vue.vue"]]);
  const _sfc_main$a = {
    name: "ScrollToBottomButton",
    props: {
      show: {
        type: Boolean,
        default: false
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return $props.show ? (vue.openBlock(), vue.createElementBlock("view", {
      key: 0,
      class: "scroll-to-bottom",
      onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click"))
    }, [
      vue.createElementVNode("text", { class: "scroll-to-bottom-icon" }, "↓")
    ])) : vue.createCommentVNode("v-if", true);
  }
  const ScrollToBottomButton = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-92969997"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/ChatComponent/ScrollToBottomButton.vue"]]);
  const usePeerStore = defineStore("peerStore", {
    state() {
      return {
        /**
         * 本地对等体对象
         */
        localPeer: void 0,
        /**
         * 正在通话的数据连接对象
         */
        dataConnection: void 0,
        /**
         * 正在通话的媒体连接对象
         */
        mediaConnection: void 0,
        /**
         * 是否激活通知
         */
        activateNotification: false,
        /**
         * 视频通话指令枚举值
         */
        instruction: {
          /**
           * 请求视频通话
           */
          request: 1,
          /**
           * 拒绝视频通话
           */
          reject: 2,
          /**
           * 接受视频通话
           */
          accept: 3,
          /**
           * 取消视频通话
           */
          cancel: 4,
          /**
           * 正常挂断
           */
          ringOff: 5,
          /**
           * 忙碌挂断
           */
          busy: 6
        }
      };
    }
  });
  const useFriendStore = defineStore("friendStore", {
    state() {
      return {
        onlineList: []
      };
    }
  });
  const _sfc_main$9 = {
    name: "Chat",
    components: {
      ChatHeader,
      MessageList,
      ChatInputArea,
      BurnAfterReading,
      ScrollToBottomButton
    },
    data() {
      return {
        chatInfo: {
          id: "",
          name: "",
          avatar: [],
          type: "single"
        },
        list: [],
        scrollTop: 0,
        scrollIntoView: "",
        _selfAvatar: "/static/avatar/avatar5.jpeg",
        showAttachMenu: false,
        burnAfterReadingDuration: 5,
        currentBurnAfterReadingImage: "",
        currentBurnAfterReadingMessage: null,
        isScrolledToBottom: true,
        scrollViewHeight: 0,
        scrollViewScrollHeight: 0,
        showScrollToBottom: false,
        showNewMessageTip: false,
        hasNewMessages: false,
        currentFrom: 0,
        currentTo: 10,
        hasMoreMessages: true,
        isLoading: false,
        peerStore: null,
        friendStore: null
      };
    },
    onLoad() {
      const eventChannel = this.getOpenerEventChannel();
      this.peerStore = usePeerStore();
      this.friendStore = useFriendStore();
      eventChannel.on("chatInfo", (data) => {
        this.chatInfo = data.chatInfo;
        this.initializeChat();
      });
    },
    mounted() {
      this.getScrollViewInfo();
      formatAppLog("log", "at pages/message/chat.vue:117", "聊天组件已挂载");
    },
    methods: {
      async initializeChat() {
        await this.loadHistoryMessages();
        this.$nextTick(this.scrollToBottom);
      },
      getScrollViewInfo() {
        const query = uni.createSelectorQuery().in(this);
        query.select(".scroll-view").boundingClientRect((data) => {
          if (data) {
            this.scrollViewHeight = data.height;
            formatAppLog("log", "at pages/message/chat.vue:129", "滚动视图高度:", this.scrollViewHeight);
          } else {
            formatAppLog("log", "at pages/message/chat.vue:131", "获取滚动视图高度失败");
          }
        }).exec();
      },
      goBack() {
        uni.navigateBack({
          success: () => {
            uni.$emit("updateTabBarActiveTab", 1);
          },
          fail: (err) => {
            formatAppLog("error", "at pages/message/chat.vue:141", "返回失败:", err);
            uni.reLaunch({
              url: "/pages/tabBar/tabBar",
              success: () => {
                uni.$emit("updateTabBarActiveTab", 1);
              }
            });
          }
        });
      },
      sendMessage(message) {
        formatAppLog("log", "at pages/message/chat.vue:152", "[sendMessage] 发送消息:", message);
        if (message.content) {
          const newMessage = {
            id: Date.now().toString(),
            content: message.content,
            userType: "self",
            avatar: this._selfAvatar,
            timestamp: /* @__PURE__ */ new Date(),
            status: "sending",
            type: message.type || "text"
          };
          this.addNewMessage(newMessage);
        }
      },
      handleMessageSent(sentMessage) {
        formatAppLog("log", "at pages/message/chat.vue:167", "[handleMessageSent] 消息已发送:", sentMessage);
        const tempMessage = this.list.find((m2) => m2.content === sentMessage.message);
        if (tempMessage) {
          tempMessage.id = sentMessage.id;
          tempMessage.status = "sent";
        }
      },
      handleMessageFailed(failedMessage) {
        formatAppLog("log", "at pages/message/chat.vue:175", "[handleMessageFailed] 消息发送失败:", failedMessage);
        const tempMessage = this.list.find((m2) => m2.content === failedMessage);
        if (tempMessage) {
          tempMessage.status = "failed";
        }
      },
      handleAttachment(type, data) {
        formatAppLog("log", "at pages/message/chat.vue:182", "[handleAttachment] 处理附件:", type, data);
        if (type === "location") {
          this.handleLocationMessage(data);
        } else {
          const handlers = {
            album: this.chooseImage,
            file: () => this.handleFileTransfer(data),
            "burn-after-reading": () => this.handleBurnAfterReading(data)
          };
          if (handlers[type]) {
            handlers[type]();
          }
        }
      },
      chooseImage() {
        uni.chooseImage({
          success: (res) => {
            this.addNewMessage({
              content: res.tempFilePaths[0],
              userType: "self",
              type: "image",
              avatar: this._selfAvatar,
              timestamp: /* @__PURE__ */ new Date()
            });
          }
        });
      },
      handleFileTransfer(fileData) {
        this.addNewMessage({
          content: fileData,
          userType: "self",
          type: "file",
          avatar: this._selfAvatar,
          timestamp: /* @__PURE__ */ new Date()
        });
      },
      handleBurnAfterReading(imageData) {
        this.addNewMessage({
          content: imageData,
          userType: "self",
          type: "burn-after-reading",
          avatar: this._selfAvatar,
          timestamp: /* @__PURE__ */ new Date()
        });
      },
      handleLocationMessage(locationData) {
        formatAppLog("log", "at pages/message/chat.vue:228", "[handleLocationMessage] 处理位置消息:", locationData);
        const newMessage = {
          id: Date.now().toString(),
          type: "location",
          content: locationData,
          userType: "self",
          avatar: this._selfAvatar,
          timestamp: /* @__PURE__ */ new Date(),
          status: "sending"
        };
        this.addNewMessage(newMessage);
      },
      viewBurnAfterReadingImage(message) {
        this.currentBurnAfterReadingImage = message.content.originalPath;
        this.currentBurnAfterReadingMessage = message;
        this.$nextTick(() => {
          this.$refs.burnAfterReadingRef.open();
        });
      },
      closeBurnAfterReadingPreview() {
        this.currentBurnAfterReadingImage = "";
        if (this.currentBurnAfterReadingMessage) {
          const index = this.list.indexOf(this.currentBurnAfterReadingMessage);
          if (index > -1) {
            this.list.splice(index, 1);
          }
          this.currentBurnAfterReadingMessage = null;
        }
      },
      toggleAttachMenu(show) {
        this.showAttachMenu = show;
        formatAppLog("log", "at pages/message/chat.vue:259", "附件菜单切换:", show);
      },
      handleOverlayClick() {
        this.showAttachMenu = false;
        formatAppLog("log", "at pages/message/chat.vue:263", "附件菜单已关闭");
      },
      scrollToBottom() {
        this.$nextTick(() => {
          const lastMessageIndex = this.list.length - 1;
          this.scrollIntoView = `message-${lastMessageIndex}`;
          this.showScrollToBottom = false;
          this.showNewMessageTip = false;
          this.hasNewMessages = false;
          this.isScrolledToBottom = true;
          formatAppLog("log", "at pages/message/chat.vue:273", "滚动到底部");
        });
      },
      onScroll(event2) {
        const { scrollTop, scrollHeight } = event2.detail;
        this.scrollViewScrollHeight = scrollHeight;
        const isAtBottom = scrollHeight - (scrollTop + this.scrollViewHeight) < 10;
        this.isScrolledToBottom = isAtBottom;
        this.showScrollToBottom = !isAtBottom && this.hasNewMessages;
        this.showNewMessageTip = !isAtBottom && this.hasNewMessages;
        if (isAtBottom) {
          this.hasNewMessages = false;
          this.showNewMessageTip = false;
        }
      },
      async loadMoreMessages() {
        if (this.hasMoreMessages && !this.isLoading) {
          this.isLoading = true;
          this.currentFrom = this.currentTo + 1;
          this.currentTo = this.currentTo + 10;
          await this.loadHistoryMessages(true);
          this.isLoading = false;
        }
      },
      addNewMessage(message) {
        formatAppLog("log", "at pages/message/chat.vue:299", "添加新消息:", message);
        this.list.push(message);
        if (!this.isScrolledToBottom) {
          this.hasNewMessages = true;
          this.showScrollToBottom = true;
          this.showNewMessageTip = true;
        } else {
          this.scrollToBottom();
        }
      },
      openVideoPage(action) {
        uni.navigateTo({
          url: `/pages/message/video-call?calleePeerId=${this.callerPeerId}`
        });
      },
      rejectVideoCall() {
        peerStore.dataConnection.send({
          instruction: peerStore.instruction.reject
        });
        peerStore.dataConnection = void 0;
        peerStore.activateNotification = false;
      },
      acceptVideoCall() {
        peerStore.activateNotification = false;
        uni.showLoading({
          title: "waiting for the other party to connect...",
          mask: true
        });
        let cancel = watch(() => peerStore.mediaConnection, (newValue) => {
          if (newValue) {
            uni.hideLoading();
            cancel();
            uni.navigateTo({
              url: "/pages/message/video-answer"
            });
          }
        }, { immediate: true });
        peerStore.dataConnection.send({
          instruction: peerStore.instruction.accept
        });
      },
      async loadHistoryMessages(isLoadingMore = false) {
        formatAppLog("log", "at pages/message/chat.vue:367", "[loadHistoryMessages] 加载历史消息", { isLoadingMore, from: this.currentFrom, to: this.currentTo });
        try {
          const response = await getHistoryChatMessages({
            opponentId: this.chatInfo.id,
            from: this.currentFrom,
            to: this.currentTo
          });
          formatAppLog("log", "at pages/message/chat.vue:376", "[loadHistoryMessages] 历史消息响应:", response);
          if (response.code === 200 && Array.isArray(response.data)) {
            const newMessages = response.data.reverse().map((msg) => ({
              id: msg.id,
              content: msg.message,
              userType: msg.senderId === this.chatInfo.id ? "other" : "self",
              avatar: msg.senderId === this.chatInfo.id ? this.chatInfo.avatar[0] : this._selfAvatar,
              timestamp: new Date(msg.sendTime),
              type: msg.messageType,
              isRead: msg.isRead
            }));
            if (isLoadingMore) {
              this.list = [...newMessages, ...this.list];
            } else {
              this.list = newMessages;
            }
            this.hasMoreMessages = newMessages.length === this.currentTo - this.currentFrom + 1;
            formatAppLog("log", "at pages/message/chat.vue:397", "[loadHistoryMessages] 更新后的消息列表:", this.list);
            formatAppLog("log", "at pages/message/chat.vue:398", "[loadHistoryMessages] 是否有更多消息:", this.hasMoreMessages);
            this.$nextTick(() => {
              if (!isLoadingMore) {
                formatAppLog("log", "at pages/message/chat.vue:402", "[loadHistoryMessages] 加载初始消息后滚动到底部");
                this.scrollToBottom();
              }
            });
          } else {
            formatAppLog("error", "at pages/message/chat.vue:407", "[loadHistoryMessages] 加载历史消息失败:", response.msg);
            uni.showToast({
              title: "加载历史消息失败",
              icon: "none"
            });
          }
        } catch (error) {
          formatAppLog("error", "at pages/message/chat.vue:414", "[loadHistoryMessages] 加载历史消息出错:", error);
          uni.showToast({
            title: "网络错误，请稍后重试",
            icon: "none"
          });
        }
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    var _a;
    const _component_ChatHeader = vue.resolveComponent("ChatHeader");
    const _component_MessageList = vue.resolveComponent("MessageList");
    const _component_ChatInputArea = vue.resolveComponent("ChatInputArea");
    const _component_BurnAfterReading = vue.resolveComponent("BurnAfterReading");
    const _component_ScrollToBottomButton = vue.resolveComponent("ScrollToBottomButton");
    return vue.openBlock(), vue.createElementBlock("view", { class: "page" }, [
      vue.createVNode(_component_ChatHeader, {
        "chat-info": $data.chatInfo,
        onGoBack: $options.goBack
      }, null, 8, ["chat-info", "onGoBack"]),
      vue.createVNode(_component_MessageList, {
        messages: $data.list,
        "scroll-top": $data.scrollTop,
        "scroll-into-view": $data.scrollIntoView,
        onLoadMore: $options.loadMoreMessages,
        onScroll: $options.onScroll,
        onViewBurnAfterReading: $options.viewBurnAfterReadingImage
      }, null, 8, ["messages", "scroll-top", "scroll-into-view", "onLoadMore", "onScroll", "onViewBurnAfterReading"]),
      vue.createVNode(_component_ChatInputArea, {
        onSendMessage: $options.sendMessage,
        onMessageSent: $options.handleMessageSent,
        onMessageFailed: $options.handleMessageFailed,
        onAttach: $options.handleAttachment,
        onVideoCall: $options.openVideoPage,
        onToggleAttachMenu: $options.toggleAttachMenu,
        "show-attach-menu": $data.showAttachMenu,
        recipientId: $data.chatInfo.id,
        ref: "chatInputAreaRef"
      }, null, 8, ["onSendMessage", "onMessageSent", "onMessageFailed", "onAttach", "onVideoCall", "onToggleAttachMenu", "show-attach-menu", "recipientId"]),
      $data.currentBurnAfterReadingImage ? (vue.openBlock(), vue.createBlock(_component_BurnAfterReading, {
        key: 0,
        imageSrc: $data.currentBurnAfterReadingImage,
        duration: $data.burnAfterReadingDuration,
        onClose: $options.closeBurnAfterReadingPreview,
        ref: "burnAfterReadingRef"
      }, null, 8, ["imageSrc", "duration", "onClose"])) : vue.createCommentVNode("v-if", true),
      vue.createVNode(_component_ScrollToBottomButton, {
        show: $data.showScrollToBottom,
        onClick: vue.withModifiers($options.scrollToBottom, ["stop"])
      }, null, 8, ["show", "onClick"]),
      $data.showNewMessageTip ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "new-message-tip",
        onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $options.scrollToBottom && $options.scrollToBottom(...args), ["stop"]))
      }, " 新消息 ")) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 来电提醒 "),
      $data.peerStore.activateNotification ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "modal"
      }, [
        vue.createElementVNode("view", null, [
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString((_a = $data.peerStore.dataConnection) == null ? void 0 : _a.peer) + " 邀请你视频通话",
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode("button", {
            onClick: _cache[1] || (_cache[1] = (...args) => $options.acceptVideoCall && $options.acceptVideoCall(...args)),
            type: "default"
          }, "接听"),
          vue.createElementVNode("button", {
            onClick: _cache[2] || (_cache[2] = (...args) => $options.rejectVideoCall && $options.rejectVideoCall(...args)),
            type: "warn"
          }, "拒绝")
        ])
      ])) : vue.createCommentVNode("v-if", true),
      $data.showAttachMenu ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 3,
        class: "overlay",
        onClick: _cache[3] || (_cache[3] = (...args) => $options.handleOverlayClick && $options.handleOverlayClick(...args))
      })) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesMessageChat = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-013fa921"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/chat.vue"]]);
  const _sfc_main$8 = {
    name: "ContactDetail",
    props: {
      contact: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        showModal: false,
        modalContent: "",
        modalCallback: null
      };
    },
    methods: {
      handleClose() {
        this.$emit("close");
      },
      handleRemark() {
        formatAppLog("log", "at pages/tabBar/contacts/ContactDetail.vue:93", "处理备注");
      },
      handleMessage() {
        this.navigateToChat();
      },
      handleClearHistory() {
        this.showConfirmDialog("您确认要删除所有聊天记录吗？", () => {
          formatAppLog("log", "at pages/tabBar/contacts/ContactDetail.vue:102", "清空聊天记录");
        });
      },
      handleDelete() {
        this.showConfirmDialog("您确认要删除此联系人吗？", () => {
          formatAppLog("log", "at pages/tabBar/contacts/ContactDetail.vue:108", "删除联系人");
          this.$emit("close");
        });
      },
      showConfirmDialog(content, callback) {
        this.modalContent = content;
        this.modalCallback = callback;
        this.showModal = true;
      },
      handleModalCancel() {
        this.showModal = false;
      },
      handleModalConfirm() {
        this.showModal = false;
        if (this.modalCallback) {
          this.modalCallback();
        }
      },
      navigateToChat() {
        const chatInfo = {
          id: this.contact.id,
          name: this.contact.name,
          avatar: [this.contact.avatar],
          type: "single"
        };
        uni.navigateTo({
          url: "/pages/message/chat",
          success: (res) => {
            res.eventChannel.emit("chatInfo", { chatInfo });
          },
          fail: (err) => {
            formatAppLog("error", "at pages/tabBar/contacts/ContactDetail.vue:144", "导航到聊天页面失败:", err);
          }
        });
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "contact-detail" }, [
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("view", {
          class: "back-button",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.handleClose && $options.handleClose(...args))
        }, [
          vue.createElementVNode("text", { class: "icon" }, "←")
        ]),
        vue.createElementVNode("text", { class: "header-title" }, "通讯录"),
        vue.createElementVNode("view", { class: "more-options" }, [
          vue.createElementVNode("text", { class: "icon" }, "⋯")
        ])
      ]),
      vue.createElementVNode("scroll-view", {
        class: "content",
        "scroll-y": ""
      }, [
        vue.createElementVNode("view", { class: "main-info" }, [
          vue.createElementVNode("view", { class: "profile-section" }, [
            vue.createElementVNode("image", {
              class: "avatar",
              src: $props.contact.avatar,
              mode: "aspectFill"
            }, null, 8, ["src"]),
            vue.createElementVNode("view", { class: "info-section" }, [
              vue.createElementVNode("view", { class: "name-section" }, [
                vue.createElementVNode(
                  "text",
                  { class: "name" },
                  vue.toDisplayString($props.contact.name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "badge-section" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "badge" },
                    vue.toDisplayString($props.contact.title),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "details-section" }, [
                vue.createElementVNode("view", { class: "detail-item" }, [
                  vue.createElementVNode("text", { class: "detail-label" }, "用户名"),
                  vue.createElementVNode(
                    "text",
                    { class: "detail-value" },
                    vue.toDisplayString($props.contact.username),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("view", { class: "detail-item" }, [
                  vue.createElementVNode("text", { class: "detail-label" }, "设备IP"),
                  vue.createElementVNode(
                    "text",
                    { class: "detail-value" },
                    vue.toDisplayString($props.contact.ip),
                    1
                    /* TEXT */
                  )
                ])
              ])
            ])
          ])
        ]),
        vue.createElementVNode("view", { class: "remark-section" }, [
          vue.createElementVNode("view", {
            class: "action-item",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.handleRemark && $options.handleRemark(...args))
          }, [
            vue.createElementVNode("text", { class: "action-text" }, "备注"),
            vue.createElementVNode("text", { class: "icon" }, "›")
          ])
        ]),
        vue.createElementVNode("view", {
          class: "message-button",
          onClick: _cache[2] || (_cache[2] = (...args) => $options.handleMessage && $options.handleMessage(...args))
        }, [
          vue.createElementVNode("text", { class: "button-text" }, "发信息")
        ]),
        vue.createElementVNode("view", {
          class: "clear-history",
          onClick: _cache[3] || (_cache[3] = (...args) => $options.handleClearHistory && $options.handleClearHistory(...args))
        }, [
          vue.createElementVNode("text", { class: "button-text" }, "清空聊天记录")
        ]),
        vue.createElementVNode("view", {
          class: "delete-contact",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.handleDelete && $options.handleDelete(...args))
        }, [
          vue.createElementVNode("text", { class: "button-text" }, "删除联系人")
        ])
      ]),
      vue.createCommentVNode(" 自定义弹窗 "),
      $data.showModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "modal-overlay"
      }, [
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode(
            "view",
            { class: "modal-body" },
            vue.toDisplayString($data.modalContent),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "modal-footer" }, [
            vue.createElementVNode("button", {
              class: "modal-button cancel",
              onClick: _cache[5] || (_cache[5] = (...args) => $options.handleModalCancel && $options.handleModalCancel(...args))
            }, "取消"),
            vue.createElementVNode("button", {
              class: "modal-button confirm",
              onClick: _cache[6] || (_cache[6] = (...args) => $options.handleModalConfirm && $options.handleModalConfirm(...args))
            }, "确认")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const ContactDetail = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-8c0c75e8"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/tabBar/contacts/ContactDetail.vue"]]);
  const _sfc_main$7 = {
    name: "Contacts",
    components: {
      ContactDetail
    },
    data() {
      return {
        selectedContact: null,
        defaultAvatarPath: "../../static/message/默认头像.png",
        groups: [],
        loading: false,
        curPage: 1,
        pageSize: 10,
        total: 0
      };
    },
    mounted() {
      this.loadContacts();
    },
    methods: {
      async loadContacts() {
        this.loading = true;
        try {
          const response = await searchUsers({
            keyword: "",
            param: {
              curPage: this.curPage,
              pageSize: this.pageSize
            }
          });
          if (response.code === 200) {
            this.total = response.data.total;
            const users = response.data.records;
            if (this.curPage === 1) {
              this.groups = [{
                id: "allUsers",
                name: "所有用户",
                expanded: true,
                members: users.map((user) => ({
                  id: user.id,
                  name: user.name,
                  title: user.department,
                  avatar: user.avatarUrl,
                  username: user.account,
                  phone: user.phone,
                  role: user.role
                }))
              }];
            } else {
              this.groups[0].members.push(...users.map((user) => ({
                id: user.id,
                name: user.name,
                title: user.department,
                avatar: user.avatarUrl,
                username: user.account,
                phone: user.phone,
                role: user.role
              })));
            }
          } else {
            uni.showToast({
              title: "加载联系人失败",
              icon: "none"
            });
          }
        } catch (error) {
          formatAppLog("error", "at pages/tabBar/contacts/contacts.vue:120", "加载联系人时出错:", error);
          uni.showToast({
            title: "加载联系人失败",
            icon: "none"
          });
        } finally {
          this.loading = false;
        }
      },
      async loadMoreContacts() {
        if (this.loading || this.groups[0].members.length >= this.total)
          return;
        this.curPage++;
        await this.loadContacts();
      },
      toggleGroup(groupId) {
        const group = this.groups.find((g2) => g2.id === groupId);
        if (group) {
          group.expanded = !group.expanded;
        }
      },
      showContactDetail(member) {
        this.selectedContact = member;
      },
      closeContactDetail() {
        this.selectedContact = null;
      },
      getAvatarSrc(avatar) {
        return avatar || this.defaultAvatarPath;
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_contact_detail = vue.resolveComponent("contact-detail");
    return vue.openBlock(), vue.createElementBlock("view", { class: "contacts-container" }, [
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("text", { class: "title" }, "通讯录"),
        vue.createElementVNode("view", { class: "search-icon" }, [
          (vue.openBlock(), vue.createElementBlock("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            width: "20",
            height: "20",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, [
            vue.createElementVNode("circle", {
              cx: "11",
              cy: "11",
              r: "8"
            }),
            vue.createElementVNode("line", {
              x1: "21",
              y1: "21",
              x2: "16.65",
              y2: "16.65"
            })
          ]))
        ])
      ]),
      vue.createElementVNode(
        "scroll-view",
        {
          class: "contact-list",
          "scroll-y": "",
          onScrolltolower: _cache[0] || (_cache[0] = (...args) => $options.loadMoreContacts && $options.loadMoreContacts(...args))
        },
        [
          $data.loading ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "loading"
          }, "加载中...")) : $data.groups.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "no-contacts"
          }, "暂无联系人")) : (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            { key: 2 },
            vue.renderList($data.groups, (group) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: group.id,
                class: "group"
              }, [
                vue.createElementVNode("view", {
                  class: "group-header",
                  onClick: ($event) => $options.toggleGroup(group.id)
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "group-title" },
                    vue.toDisplayString(group.name) + " (" + vue.toDisplayString(group.members.length) + "人)",
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    {
                      class: vue.normalizeClass(["group-arrow", { "expanded": group.expanded }])
                    },
                    "›",
                    2
                    /* CLASS */
                  )
                ], 8, ["onClick"]),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["group-content", { "expanded": group.expanded }])
                  },
                  [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList(group.members, (member) => {
                        return vue.openBlock(), vue.createElementBlock("view", {
                          key: member.id,
                          class: "contact-item",
                          onClick: ($event) => $options.showContactDetail(member)
                        }, [
                          vue.createElementVNode("image", {
                            class: "avatar",
                            src: $options.getAvatarSrc(member.avatar),
                            mode: "aspectFill"
                          }, null, 8, ["src"]),
                          vue.createElementVNode("view", { class: "contact-info" }, [
                            vue.createElementVNode(
                              "text",
                              { class: "contact-name" },
                              vue.toDisplayString(member.name),
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "text",
                              { class: "contact-title" },
                              vue.toDisplayString(member.title),
                              1
                              /* TEXT */
                            )
                          ])
                        ], 8, ["onClick"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ],
                  2
                  /* CLASS */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ],
        32
        /* NEED_HYDRATION */
      ),
      $data.selectedContact ? (vue.openBlock(), vue.createBlock(_component_contact_detail, {
        key: 0,
        contact: $data.selectedContact,
        onClose: $options.closeContactDetail
      }, null, 8, ["contact", "onClose"])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const Contacts = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-3d3ef74b"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/tabBar/contacts/contacts.vue"]]);
  const _sfc_main$6 = {
    name: "TabBar",
    components: {
      MainPage: PagesProfileProfile,
      Messages: PagesMessageMain,
      Contacts,
      TaskPage: PagesTaskTask
    },
    data() {
      return {
        currentTab: 0,
        tabs: [
          {
            icon_nochoice: "../../static/tabBar/首页-未选中.png",
            icon_choice: "../../static/tabBar/首页-选中.png",
            label: "首页"
          },
          {
            icon_nochoice: "../../static/tabBar/消息-未选中.png",
            icon_choice: "../../static/tabBar/消息-选中.png",
            label: "消息"
          },
          {
            icon_nochoice: "../../static/tabBar/通讯录-未选中.png",
            icon_choice: "../../static/tabBar/通讯录-选中.png",
            label: "通讯录"
          },
          {
            icon_nochoice: "../../static/tabBar/我的-未选中.png",
            icon_choice: "../../static/tabBar/我的-选中.png",
            label: "我的"
          }
        ]
      };
    },
    methods: {
      onTabClick(index) {
        this.currentTab = index;
        const title = this.tabs[index].label;
        uni.setNavigationBarTitle({
          title
        });
      },
      hideTabBar() {
        if (this.$refs.tabBar) {
          this.$refs.tabBar.style.display = "none";
        }
      },
      showTabBar() {
        if (this.$refs.tabBar) {
          this.$refs.tabBar.style.display = "flex";
        }
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_TaskPage = vue.resolveComponent("TaskPage");
    const _component_messages = vue.resolveComponent("messages");
    const _component_main_page = vue.resolveComponent("main-page");
    const _component_contacts = vue.resolveComponent("contacts");
    return vue.openBlock(), vue.createElementBlock("view", { class: "main-container" }, [
      vue.createCommentVNode(" 主要内容区域 "),
      vue.createElementVNode("view", { class: "content-area" }, [
        $data.currentTab === 0 ? (vue.openBlock(), vue.createBlock(_component_TaskPage, { key: 0 })) : $data.currentTab === 1 ? (vue.openBlock(), vue.createBlock(_component_messages, { key: 1 })) : $data.currentTab === 3 ? (vue.openBlock(), vue.createBlock(_component_main_page, { key: 2 })) : $data.currentTab === 2 ? (vue.openBlock(), vue.createBlock(_component_contacts, { key: 3 })) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 4,
          class: "placeholder-content"
        }, [
          vue.createElementVNode(
            "text",
            null,
            "这是" + vue.toDisplayString(["首页", "", "", ""][$data.currentTab]) + "的内容",
            1
            /* TEXT */
          )
        ]))
      ]),
      vue.createCommentVNode(" 底部导航栏 "),
      vue.createElementVNode(
        "view",
        {
          class: "tab-bar",
          ref: "tabBar"
        },
        [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.tabs, (tab, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: "tab-item",
                onClick: ($event) => $options.onTabClick(index)
              }, [
                vue.createElementVNode("image", {
                  src: $data.currentTab === index ? tab.icon_choice : tab.icon_nochoice,
                  class: "tab-icon",
                  mode: "aspectFit"
                }, null, 8, ["src"]),
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["tab-text", { "active": $data.currentTab === index }])
                  },
                  vue.toDisplayString(tab.label),
                  3
                  /* TEXT, CLASS */
                )
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ],
        512
        /* NEED_PATCH */
      )
    ]);
  }
  const PagesTabBarTabBar = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/tabBar/tabBar.vue"]]);
  const _sfc_main$5 = {
    data() {
      return {
        show: false,
        pathArr: []
      };
    },
    methods: {
      getPath(event2) {
        formatAppLog("log", "at pages/task/task_detail/document/uploadfile/uploadfile.vue:29", event2);
        this.pathArr = event2;
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_nk_select_file = vue.resolveComponent("nk-select-file");
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode("button", {
        type: "default",
        onClick: _cache[0] || (_cache[0] = () => {
          $data.show = true;
        }),
        style: { "width": "80%", "background-color": "#007AFF", "color": "#fff", "margin-top": "60rpx" }
      }, "选择文件"),
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($data.pathArr, (item, index) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            class: "textStyle",
            key: index
          }, [
            vue.createElementVNode(
              "view",
              null,
              " 文件名：" + vue.toDisplayString(item.name),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "view",
              null,
              " 文件地址：" + vue.toDisplayString(item.url),
              1
              /* TEXT */
            ),
            vue.createElementVNode(
              "view",
              null,
              " 文件大小：" + vue.toDisplayString(item.sizeMB),
              1
              /* TEXT */
            )
          ]);
        }),
        128
        /* KEYED_FRAGMENT */
      )),
      vue.createVNode(_component_nk_select_file, {
        modelValue: $data.show,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.show = $event),
        onConfirm: $options.getPath
      }, null, 8, ["modelValue", "onConfirm"])
    ]);
  }
  const PagesTaskTaskDetailDocumentUploadfileUploadfile = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/task/task_detail/document/uploadfile/uploadfile.vue"]]);
  const poster = "/static/icon/poster.gif";
  const _sfc_main$4 = {
    __name: "video-call",
    setup(__props, { expose: __expose }) {
      __expose();
      let mainVideo = vue.ref();
      let secondaryVideo = vue.ref();
      let localUserMedia = vue.ref();
      let peerStore2 = usePeerStore();
      let isConnected = vue.ref(false);
      let videoFacingMode = vue.ref("user");
      vue.onMounted((options) => {
        getLocalUserMedia({ audio: true, video: true }).then(
          (userMedia) => {
            mainVideo.value.srcObject = userMedia;
            mainVideo.value.muted = true;
            localUserMedia.value = userMedia;
            peerStore2.dataConnection = peerStore2.localPeer.connect(options.calleePeerId);
            peerStore2.dataConnection.on("data", (data) => {
              var _a, _b, _c;
              if (data.instruction === peerStore2.instruction.accept) {
                peerStore2.mediaConnection = peerStore2.localPeer.call(options.calleePeerId, localUserMedia.value);
                peerStore2.mediaConnection.on("stream", (userMedia2) => {
                  mainVideo.value.srcObject = userMedia2;
                  mainVideo.value.muted = false;
                  secondaryVideo.value.srcObject = localUserMedia.value;
                  secondaryVideo.value.muted = true;
                  isConnected.value = true;
                  uni.showToast({
                    title: "connected"
                  });
                });
              } else if (data.instruction === peerStore2.instruction.busy) {
                peerStore2.dataConnection.close();
                peerStore2.dataConnection = void 0;
                for (let track of (_a = localUserMedia.value) == null ? void 0 : _a.getTracks()) {
                  track.stop();
                }
                uni.showToast({
                  title: "the other party is busy on the line",
                  icon: "none"
                });
                uni.navigateBack();
              } else if (data.instruction === peerStore2.instruction.reject) {
                peerStore2.dataConnection.close();
                peerStore2.dataConnection = void 0;
                for (let track of (_b = localUserMedia.value) == null ? void 0 : _b.getTracks()) {
                  track.stop();
                }
                uni.showToast({
                  title: "the other party refused",
                  icon: "none"
                });
                uni.navigateBack();
              } else if (data.instruction === peerStore2.instruction.ringOff) {
                peerStore2.dataConnection.close();
                peerStore2.dataConnection = void 0;
                peerStore2.mediaConnection.close();
                peerStore2.mediaConnection = void 0;
                for (let track of (_c = localUserMedia.value) == null ? void 0 : _c.getTracks()) {
                  track.stop();
                }
                uni.showToast({
                  title: "the other party has hung up",
                  icon: "none"
                });
                uni.navigateBack();
              }
            });
            peerStore2.dataConnection.on("open", () => {
              peerStore2.dataConnection.send({
                instruction: peerStore2.instruction.request
              });
            });
          }
        ).catch(() => {
          uni.showToast({
            title: "获取摄像头失败！",
            icon: "none"
          });
          uni.navigateBack();
        });
      });
      function getLocalUserMedia(constrains) {
        if (navigator.mediaDevices.getUserMedia) {
          return navigator.mediaDevices.getUserMedia(constrains);
        } else if (navigator.webkitGetUserMedia) {
          return navigator.webkitGetUserMedia(constrains);
        } else if (navigator.mozGetUserMedia) {
          return navigator.mozGetUserMedia(constrains);
        } else if (navigator.getUserMedia) {
          return navigator.getUserMedia(constrains);
        }
        throw new Error("unable to get user media");
      }
      function cancelVideoCall() {
        var _a, _b;
        for (let track of (_a = localUserMedia.value) == null ? void 0 : _a.getTracks()) {
          track.stop();
        }
        (_b = peerStore2.dataConnection) == null ? void 0 : _b.send({
          instruction: peerStore2.instruction.cancel
        });
        peerStore2.dataConnection = void 0;
        uni.navigateBack();
      }
      function ringOffVideoCall() {
        var _a;
        for (let track of (_a = localUserMedia.value) == null ? void 0 : _a.getTracks()) {
          track.stop();
        }
        peerStore2.dataConnection.send({
          instruction: peerStore2.instruction.ringOff
        });
        peerStore2.dataConnection = void 0;
        peerStore2.mediaConnection = void 0;
        uni.navigateBack();
      }
      const __returned__ = { get mainVideo() {
        return mainVideo;
      }, set mainVideo(v2) {
        mainVideo = v2;
      }, get secondaryVideo() {
        return secondaryVideo;
      }, set secondaryVideo(v2) {
        secondaryVideo = v2;
      }, get localUserMedia() {
        return localUserMedia;
      }, set localUserMedia(v2) {
        localUserMedia = v2;
      }, get peerStore() {
        return peerStore2;
      }, set peerStore(v2) {
        peerStore2 = v2;
      }, get isConnected() {
        return isConnected;
      }, set isConnected(v2) {
        isConnected = v2;
      }, get videoFacingMode() {
        return videoFacingMode;
      }, set videoFacingMode(v2) {
        videoFacingMode = v2;
      }, getLocalUserMedia, cancelVideoCall, ringOffVideoCall, get poster() {
        return poster;
      }, get usePeerStore() {
        return usePeerStore;
      }, onMounted: vue.onMounted, ref: vue.ref };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createCommentVNode(" 视频画面 "),
      vue.createElementVNode("video", {
        class: "main-video",
        ref: "mainVideo",
        poster: $setup.poster,
        autoplay: ""
      }, null, 8, ["poster"]),
      vue.createElementVNode("video", {
        class: "secondary-video",
        ref: "secondaryVideo",
        poster: $setup.poster,
        autoplay: ""
      }, null, 8, ["poster"]),
      vue.createElementVNode("section", { class: "buttom-bar" }, [
        _ctx.isConnectioned ? (vue.openBlock(), vue.createElementBlock("button", {
          key: 0,
          type: "warn",
          onClick: $setup.ringOffVideoCall
        })) : (vue.openBlock(), vue.createElementBlock("button", {
          key: 1,
          type: "warn",
          onClick: $setup.cancelVideoCall
        }))
      ])
    ]);
  }
  const PagesMessageVideoCall = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/video-call.vue"]]);
  const _sfc_main$3 = {
    data() {
      return {};
    },
    methods: {}
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view");
  }
  const PagesMessageChatComponentCallReminder = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/ChatComponent/CallReminder.vue"]]);
  const _sfc_main$2 = {
    __name: "video-answer",
    setup(__props, { expose: __expose }) {
      __expose();
      let mainVideo = vue.ref();
      let secondaryVideo = vue.ref();
      let localUserMedia = vue.ref();
      let peerStore2 = usePeerStore();
      let router = useRouter();
      let isConnected = vue.ref(false);
      vue.onMounted(() => {
        getLocalUserMedia({ audio: true, video: true }).then((userMedia) => {
          mainVideo.value.srcObject = userMedia;
          localUserMedia.value = userMedia;
          peerStore2.mediaConnection.answer(localUserMedia.value);
          peerStore2.mediaConnection.on("stream", (remoteUserMedia) => {
            mainVideo.value.srcObject = remoteUserMedia;
            secondaryVideo.value.srcObject = localUserMedia.value;
            isConnected.value = true;
            uni.showToast({
              title: "connected"
            });
          });
        }).catch(() => {
          uni.showToast({
            title: "failed to obtain local video media",
            icon: "none"
          });
          uni.navigateBack();
        });
      });
      let cancel = vue.watch(() => [peerStore2.dataConnection, peerStore2.mediaConnection], ([dataConnection, mediaConnection]) => {
        if (dataConnection === void 0 && mediaConnection === void 0) {
          cancel();
          if (localUserMedia.value) {
            for (let track of localUserMedia.value.getTracks()) {
              track.stop();
            }
          }
          uni.showToast({
            title: "the other party has hung up"
          });
          uni.navigateBack();
        }
      }, { immediate: true });
      function getLocalUserMedia(constrains) {
        if (navigator.mediaDevices.getUserMedia) {
          return navigator.mediaDevices.getUserMedia(constrains);
        } else if (navigator.webkitGetUserMedia) {
          return navigator.webkitGetUserMedia(constrains);
        } else if (navigator.mozGetUserMedia) {
          return navigator.mozGetUserMedia(constrains);
        } else if (navigator.getUserMedia) {
          return navigator.getUserMedia(constrains);
        }
        throw new Error("unable to get user media");
      }
      function ringOffVideoCall() {
        var _a;
        cancel();
        for (let track of (_a = localUserMedia.value) == null ? void 0 : _a.getTracks()) {
          track.stop();
        }
        peerStore2.dataConnection.send({
          instruction: peerStore2.instruction.ringOff
        });
        peerStore2.dataConnection = void 0;
        peerStore2.mediaConnection = void 0;
        uni.navigateBack();
      }
      const __returned__ = { get mainVideo() {
        return mainVideo;
      }, set mainVideo(v2) {
        mainVideo = v2;
      }, get secondaryVideo() {
        return secondaryVideo;
      }, set secondaryVideo(v2) {
        secondaryVideo = v2;
      }, get localUserMedia() {
        return localUserMedia;
      }, set localUserMedia(v2) {
        localUserMedia = v2;
      }, get peerStore() {
        return peerStore2;
      }, set peerStore(v2) {
        peerStore2 = v2;
      }, get router() {
        return router;
      }, set router(v2) {
        router = v2;
      }, get isConnected() {
        return isConnected;
      }, set isConnected(v2) {
        isConnected = v2;
      }, get cancel() {
        return cancel;
      }, set cancel(v2) {
        cancel = v2;
      }, getLocalUserMedia, ringOffVideoCall, get poster() {
        return poster;
      }, get usePeerStore() {
        return usePeerStore;
      }, onMounted: vue.onMounted, ref: vue.ref, watch: vue.watch };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_van_button = vue.resolveComponent("van-button");
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode("section", { class: "container" }, [
        vue.createElementVNode("video", {
          class: "main-video",
          ref: "mainVideo",
          poster: $setup.poster,
          autoplay: ""
        }, null, 8, ["poster"]),
        vue.createElementVNode("video", {
          class: "secondary-video",
          ref: "secondaryVideo",
          poster: $setup.poster,
          autoplay: ""
        }, null, 8, ["poster"]),
        vue.createElementVNode("section", { class: "bottom-bar" }, [
          $setup.isConnected ? (vue.openBlock(), vue.createBlock(_component_van_button, {
            key: 0,
            type: "danger",
            block: "",
            onClick: $setup.ringOffVideoCall
          }, {
            default: vue.withCtx(() => [
              vue.createTextVNode(" 挂断视频通话 ")
            ]),
            _: 1
            /* STABLE */
          })) : vue.createCommentVNode("v-if", true)
        ])
      ])
    ]);
  }
  const PagesMessageVideoAnswer = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/video-answer.vue"]]);
  const _imports_0 = "/static/icon/关闭.png";
  const _sfc_main$1 = {
    __name: "inputAccount",
    setup(__props, { expose: __expose }) {
      __expose();
      const { connect } = useWebSocket();
      const userStore = useUserStore();
      const autoLogin = vue.ref(false);
      const statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
      const username = vue.ref("user1");
      const password = vue.ref("iecas.123");
      const backToFirstPage = () => {
        uni.navigateBack();
      };
      const goToTask = () => {
        uni.redirectTo({
          url: "/pages/tabBar/tabBar"
        });
      };
      const checkLogin = () => {
        uni.showLoading({
          title: "正在登录",
          mask: true
        });
        login({
          account: username.value,
          password: password.value
        }).then((res) => {
          if (res.code === 200) {
            uni.setStorageSync("username", username.value);
            uni.setStorageSync("password", password.value);
            uni.setStorageSync("token", res.data.token);
            const userData = {
              id: res.data.id,
              account: res.data.account,
              name: res.data.name,
              department: res.data.department,
              role: res.data.role,
              phone: res.data.phone,
              created: res.data.created,
              avatar: res.data.avatar,
              avatarUrl: res.data.avatarUrl,
              token: res.data.token,
              status: res.data.status
            };
            userStore.setUserData(userData);
            connect(res.data.id, res.data.token);
            uni.setStorageSync("userInfo", userData);
            formatAppLog("log", "at pages/login/camouflageLogin/inputAccount/inputAccount.vue:81", "登录成功。用户数据:", userData);
            uni.hideLoading();
            uni.showToast({
              title: "登录成功",
              duration: 2e3
            }).then(() => {
              goToTask();
            });
          } else {
            throw new Error(res.message || "登录失败");
          }
        }).catch((error) => {
          formatAppLog("error", "at pages/login/camouflageLogin/inputAccount/inputAccount.vue:94", "登录失败:", error);
          uni.hideLoading();
          uni.showToast({
            title: error.message || "登录失败",
            icon: "none",
            duration: 2e3
          });
        });
      };
      const __returned__ = { connect, userStore, autoLogin, statusBarHeight, username, password, backToFirstPage, goToTask, checkLogin, ref: vue.ref, onMounted: vue.onMounted, get login() {
        return login;
      }, get useUserStore() {
        return useUserStore;
      }, useWebSocket };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_easyinput = resolveEasycom(vue.resolveDynamicComponent("uni-easyinput"), __easycom_0$1);
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "inputAccountPage",
      style: { "padding": "0 15px 0 15px" }
    }, [
      vue.createElementVNode("view", { class: "inputAccountContent" }, [
        vue.createElementVNode("view", { class: "statusBarInput" }),
        vue.createElementVNode("view", { class: "inputAccountHeader" }, [
          vue.createCommentVNode(" 推特logo "),
          vue.createElementVNode("view", { class: "inputAccountHeaderLeft" }, [
            vue.createElementVNode("image", {
              onClick: $setup.backToFirstPage,
              src: _imports_0,
              style: { "width": "20px", "height": "20px" }
            })
          ]),
          vue.createElementVNode("view", { class: "inputAccountHeaderMiddle" }, [
            vue.createElementVNode("image", {
              src: _imports_1$4,
              style: { "width": "25px", "height": "25px" }
            })
          ])
        ]),
        vue.createElementVNode("view", null, [
          vue.createElementVNode("view", { style: { "text-align": "left", "margin-top": "30px" } }, [
            vue.createElementVNode("text", { style: { "letter-spacing": "3px", "font-size": "3.8ch", "font-family": "fantasy", "font-weight": "550", "width": "75%" } }, "要开始使用，请先输入你的手机号码、邮箱地址或@用户名。")
          ]),
          vue.createElementVNode("view", { style: { "margin-top": "20px" } }, [
            vue.createVNode(_component_uni_easyinput, {
              class: "inputValue",
              trim: "all",
              modelValue: $setup.username,
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.username = $event),
              placeholder: "手机号码/邮件地址或用户名"
            }, null, 8, ["modelValue"])
          ]),
          vue.createElementVNode("view", { style: { "margin-top": "20px" } }, [
            vue.createVNode(_component_uni_easyinput, {
              class: "inputValue",
              type: "password",
              trim: "all",
              modelValue: $setup.password,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.password = $event),
              placeholder: "密码"
            }, null, 8, ["modelValue"])
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "inputAccountFooter" }, [
        vue.createElementVNode("button", {
          onClick: $setup.checkLogin,
          style: { "background": "black", "border-radius": "30px", "color": "white" }
        }, "下一步")
      ])
    ]);
  }
  const PagesLoginCamouflageLoginInputAccountInputAccount = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/login/camouflageLogin/inputAccount/inputAccount.vue"]]);
  __definePage("pages/login/camouflageLogin/camouflageLogin", PagesLoginCamouflageLoginCamouflageLogin);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/register/register", PagesRegisterRegister);
  __definePage("pages/forgetPassword/forgetPassword", PagesForgetPasswordForgetPassword);
  __definePage("pages/fingerLogin/fingerLogin", PagesFingerLoginFingerLogin);
  __definePage("pages/task/task", PagesTaskTask);
  __definePage("pages/task/task_detail/task_detail", PagesTaskTaskDetailTaskDetail);
  __definePage("pages/task/task_detail/document/document", PagesTaskTaskDetailDocumentDocument);
  __definePage("pages/task/task_detail/map_test/map_test", PagesTaskTaskDetailMapTestMapTest);
  __definePage("pages/task/task_detail/baidu_map/baidu_map", PagesTaskTaskDetailBaiduMapBaiduMap);
  __definePage("pages/profile/profile", PagesProfileProfile);
  __definePage("pages/message/main", PagesMessageMain);
  __definePage("pages/message/chat", PagesMessageChat);
  __definePage("pages/tabBar/tabBar", PagesTabBarTabBar);
  __definePage("pages/task/task_detail/document/uploadfile/uploadfile", PagesTaskTaskDetailDocumentUploadfileUploadfile);
  __definePage("pages/message/video-call", PagesMessageVideoCall);
  __definePage("pages/message/ChatComponent/CallReminder", PagesMessageChatComponentCallReminder);
  __definePage("pages/message/video-answer", PagesMessageVideoAnswer);
  __definePage("pages/login/camouflageLogin/inputAccount/inputAccount", PagesLoginCamouflageLoginInputAccountInputAccount);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("warn", "at App.vue:4", "当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！");
      formatAppLog("log", "at App.vue:5", "App Launch"), plus.screen.lockOrientation("portrait-primary");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:9", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:12", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    const pinia = createPinia();
    app.use(pinia);
    return {
      app,
      pinia
    };
  }
  let main = plus.android.runtimeMainActivity();
  plus.runtime.quit = function() {
    uni.showModal({
      title: "提示",
      content: "是否退出应用？",
      success: function(res) {
        if (res.confirm) {
          if (uni.getStorageSync("token") != "") {
            logout().then((res2) => {
              uni.removeStorageSync("token");
              uni.removeStorageSync("userInfo");
            });
          }
          main.finish();
        } else if (res.cancel)
          ;
      }
    });
  };
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
