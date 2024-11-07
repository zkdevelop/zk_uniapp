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
  const _imports_0$6 = "/static/icon/login.png";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$L = {
    data() {
      return {
        autoLogin: false,
        // 初始状态为未选中
        username: "test-app",
        password: "test123456"
      };
    },
    methods: {
      goToRegister() {
        uni.navigateTo({
          url: "/pages/register/register"
          // 替换为目标页面的路径
        });
      },
      goToForgetPassword() {
        uni.navigateTo({
          url: "/pages/forgetPassword/forgetPassword"
        });
      },
      goToFingerLogin() {
        uni.navigateTo({
          url: "/pages/fingerLogin/fingerLogin"
        });
      },
      goToTask() {
        uni.redirectTo({
          url: "/pages/tabBar/tabBar"
        });
      },
      toggleAutoLogin(e2) {
        this.autoLogin = e2.detail.value.length > 0;
        if (this.autoLogin == true) {
          uni.navigateTo({
            url: "/pages/register/register"
            // 替换为目标页面的路径
          });
        }
      },
      checkLogin() {
        var that = this;
        uni.showLoading({
          title: "正在登录",
          mask: true
        });
        login({
          account: this.username,
          password: this.password
        }).then((res) => {
          if (res.code == 200) {
            uni.setStorageSync(
              "username",
              that.username
            );
            uni.setStorageSync(
              "password",
              that.password
            );
            formatAppLog("log", "at pages/login/login.vue:94", res.data.token, "token");
            uni.setStorageSync("token", res.data.token);
            uni.setStorageSync("userInfo", res.data.account);
            uni.hideLoading();
            uni.showToast({
              title: "登录成功",
              duration: 2e3
            }).then(
              this.goToTask()
            );
          }
        });
      }
    }
  };
  function _sfc_render$K(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "layout" }, [
      vue.createElementVNode("view", { class: "iconView" }, [
        vue.createElementVNode("image", {
          src: _imports_0$6,
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
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $data.username = $event)
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
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.password = $event)
          },
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vModelText, $data.password]
        ]),
        vue.createElementVNode("button", {
          onClick: _cache[2] || (_cache[2] = (...args) => $options.checkLogin && $options.checkLogin(...args)),
          type: "primary",
          style: { "margin-top": "15px" }
        }, "登录")
      ]),
      vue.createElementVNode("view", { class: "container" }, [
        vue.createElementVNode("view", { class: "left" }, [
          vue.createElementVNode("label", { class: "checkbox" }, [
            vue.createElementVNode("checkbox", {
              value: $data.autoLogin,
              onChange: _cache[3] || (_cache[3] = (...args) => $options.toggleAutoLogin && $options.toggleAutoLogin(...args))
            }, "自动登录", 40, ["value"])
          ])
        ]),
        vue.createElementVNode("view", { class: "right" }, [
          vue.createElementVNode("text", {
            onClick: _cache[4] || (_cache[4] = (...args) => $options.goToRegister && $options.goToRegister(...args)),
            class: "clicked_text"
          }, "注册 "),
          vue.createElementVNode("text", {
            onClick: _cache[5] || (_cache[5] = (...args) => $options.goToForgetPassword && $options.goToForgetPassword(...args)),
            class: "clicked_text"
          }, " 忘记密码"),
          vue.createElementVNode("text", null, " | "),
          vue.createElementVNode("text", {
            onClick: _cache[6] || (_cache[6] = (...args) => $options.goToFingerLogin && $options.goToFingerLogin(...args)),
            class: "clicked_text"
          }, "指纹登录")
        ])
      ]),
      vue.createCommentVNode(' <navigator url="/pages/register/register">注册</navigator> ')
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$L, [["render", _sfc_render$K], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/login/login.vue"]]);
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
  const _sfc_main$K = {
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
  function _sfc_render$J(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_0$5 = /* @__PURE__ */ _export_sfc(_sfc_main$K, [["render", _sfc_render$J], ["__scopeId", "data-v-9245e42c"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-load-more/components/uni-load-more/uni-load-more.vue"]]);
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
  const _sfc_main$J = {
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
  function _sfc_render$I(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_0$4 = /* @__PURE__ */ _export_sfc(_sfc_main$J, [["render", _sfc_render$I], ["__scopeId", "data-v-d31e1c47"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-icons/components/uni-icons/uni-icons.vue"]]);
  const pages = [
    {
      path: "pages/login/login",
      style: {
        navigationBarTitleText: "",
        "app-plus": {
          scrollIndicator: "none"
        },
        navigationStyle: "custom"
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
        navigationBarTitleText: "百度地图测试",
        "app-plus": {
          subNVues: [
            {
              id: "condition_icons",
              path: "pages/task/task_detail/baidu_map/subnvue/condition_icons",
              style: {
                display: "flex",
                "justify-content": "space-between",
                padding: "15px",
                zIndex: "100",
                position: "absolute",
                top: "0",
                left: "0",
                width: "100px",
                height: "40px"
              }
            }
          ]
        }
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
      path: "pages/login/camouflageLogin/camouflageLogin",
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
  const _sfc_main$I = {
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
  function _sfc_render$H(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_load_more = resolveEasycom(vue.resolveDynamicComponent("uni-load-more"), __easycom_0$5);
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
  const DataPickerView = /* @__PURE__ */ _export_sfc(_sfc_main$I, [["render", _sfc_render$H], ["__scopeId", "data-v-91ec6a82"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-data-picker/components/uni-data-pickerview/uni-data-pickerview.vue"]]);
  const _sfc_main$H = {
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
  function _sfc_render$G(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_load_more = resolveEasycom(vue.resolveDynamicComponent("uni-load-more"), __easycom_0$5);
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$4);
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
  const __easycom_0$3 = /* @__PURE__ */ _export_sfc(_sfc_main$H, [["render", _sfc_render$G], ["__scopeId", "data-v-2653531e"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-data-picker/components/uni-data-picker/uni-data-picker.vue"]]);
  const _sfc_main$G = {
    data() {
      return {
        account: "test-app",
        username: "test-app",
        password: "test123456",
        confirmPassword: "test123456",
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
  function _sfc_render$F(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_data_picker = resolveEasycom(vue.resolveDynamicComponent("uni-data-picker"), __easycom_0$3);
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
  const PagesRegisterRegister = /* @__PURE__ */ _export_sfc(_sfc_main$G, [["render", _sfc_render$F], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/register/register.vue"]]);
  const _sfc_main$F = {
    data() {
      return {};
    },
    methods: {}
  };
  function _sfc_render$E(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view");
  }
  const PagesForgetPasswordForgetPassword = /* @__PURE__ */ _export_sfc(_sfc_main$F, [["render", _sfc_render$E], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/forgetPassword/forgetPassword.vue"]]);
  const _imports_0$5 = "/static/icon/finger.png";
  const _sfc_main$E = {
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
  function _sfc_render$D(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "layout" }, [
      vue.createElementVNode("view", {
        class: "fingerView",
        onClick: _cache[0] || (_cache[0] = ($event) => $options.fingerprint()),
        disabled: $data.disabled
      }, [
        vue.createElementVNode("image", {
          src: _imports_0$5,
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
  const PagesFingerLoginFingerLogin = /* @__PURE__ */ _export_sfc(_sfc_main$E, [["render", _sfc_render$D], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/fingerLogin/fingerLogin.vue"]]);
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
  const _imports_0$4 = "/static/icon/location_grey.png";
  const _imports_1$2 = "/static/icon/time_grey.png";
  const _sfc_main$D = {
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
            position: e2.missionCountry,
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
        formatAppLog("info", "at pages/task/task.vue:175", this.tabbarIndex);
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
  function _sfc_render$C(_ctx, _cache, $props, $setup, $data, $options) {
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
                                src: _imports_0$4,
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
                                src: _imports_1$2,
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
  const PagesTaskTask = /* @__PURE__ */ _export_sfc(_sfc_main$D, [["render", _sfc_render$C], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/task/task.vue"]]);
  const _sfc_main$C = {
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
  function _sfc_render$B(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$4);
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
  const __easycom_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$C, [["render", _sfc_render$B], ["__scopeId", "data-v-ddf9e0a2"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-data-select/components/uni-data-select/uni-data-select.vue"]]);
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
  const _sfc_main$B = {
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
  function _sfc_render$A(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_0$1 = /* @__PURE__ */ _export_sfc(_sfc_main$B, [["render", _sfc_render$A], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-transition/components/uni-transition/uni-transition.vue"]]);
  const _sfc_main$A = {
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
  function _sfc_render$z(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_transition = resolveEasycom(vue.resolveDynamicComponent("uni-transition"), __easycom_0$1);
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
  const __easycom_4$1 = /* @__PURE__ */ _export_sfc(_sfc_main$A, [["render", _sfc_render$z], ["__scopeId", "data-v-4dd3c44b"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-popup/components/uni-popup/uni-popup.vue"]]);
  const _sfc_main$z = {
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
  function _sfc_render$y(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$4);
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
  const __easycom_2$1 = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["render", _sfc_render$y], ["__scopeId", "data-v-3d2dde9f"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-collapse/components/uni-collapse-item/uni-collapse-item.vue"]]);
  const _sfc_main$y = {
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
      setAccordion(self) {
        if (!this.accordion)
          return;
        this.childrens.forEach((vm, index) => {
          if (self !== vm) {
            vm.isOpen = false;
          }
        });
      },
      resize() {
        this.childrens.forEach((vm, index) => {
          vm.getCollapseHeight();
        });
      },
      onChange(isOpen, self) {
        let activeItem = [];
        if (this.accordion) {
          activeItem = isOpen ? self.nameSync : "";
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
  function _sfc_render$x(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-collapse" }, [
      vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
    ]);
  }
  const __easycom_3$1 = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["render", _sfc_render$x], ["__scopeId", "data-v-3f050360"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-collapse/components/uni-collapse/uni-collapse.vue"]]);
  const _sfc_main$x = {
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
  function _sfc_render$w(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_load_more = resolveEasycom(vue.resolveDynamicComponent("uni-load-more"), __easycom_0$5);
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
  const __easycom_4 = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["render", _sfc_render$w], ["__scopeId", "data-v-2f788efd"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-data-checkbox/components/uni-data-checkbox/uni-data-checkbox.vue"]]);
  const _sfc_main$w = {
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
  function _sfc_render$v(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_5$1 = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["render", _sfc_render$v], ["__scopeId", "data-v-462874dd"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-forms/components/uni-forms-item/uni-forms-item.vue"]]);
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
  const _sfc_main$v = {
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
  function _sfc_render$u(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$4);
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
  const __easycom_6$1 = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", _sfc_render$u], ["__scopeId", "data-v-09fd5285"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-easyinput/components/uni-easyinput/uni-easyinput.vue"]]);
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
          let now = Date.now();
          let resultExpr = rule.validateExpr(value, allData, now);
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
  const _sfc_main$u = {
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
  function _sfc_render$t(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "uni-forms" }, [
      vue.createElementVNode("form", null, [
        vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ])
    ]);
  }
  const __easycom_7 = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", _sfc_render$t], ["__scopeId", "data-v-9a1e3c32"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-forms/components/uni-forms/uni-forms.vue"]]);
  const _imports_0$3 = "/static/icon/alert.png";
  const _imports_1$1 = "/static/icon/flag.png";
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
  const _sfc_main$t = {
    data() {
      return {
        recorderManager: {},
        innerAudioContext: {},
        selectedMap: "",
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
          longitude: 116.397428,
          latitude: 39.90923
        },
        map_options: [
          {
            key: "google",
            src: "../../../static/icon/google.png",
            htmlSrc: "/static/html/map_gaode.html",
            name: "Google地图"
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
          {
            src: "../../../static/uni.png",
            sender_name: "admin",
            detail: "立即前往执行抓捕任务",
            isConfirmed: false
          },
          {
            src: "../../../static/uni.png",
            sender_name: "lihua",
            detail: "立即前往执行抓捕任务",
            isConfirmed: false
          },
          {
            src: "../../../static/uni.png",
            sender_name: "wanghao",
            detail: "立即前往执行抓捕任务",
            isConfirmed: false
          }
        ],
        alert_data: [
          {
            alert_grade: "重要告警",
            alert_time: "2024.5.1",
            sender_name: "张三",
            alert_content: "靠近目标，开始行动！1",
            isConfirmed: false
          },
          {
            alert_grade: "一般告警",
            alert_time: "2024.2.6",
            sender_name: "李四",
            alert_content: "靠近目标，开始行动！2",
            isConfirmed: false
          },
          {
            alert_grade: "重要告警",
            alert_time: "2024.1.3",
            sender_name: "张三",
            alert_content: "靠近目标，开始行动！3",
            isConfirmed: false
          },
          {
            alert_grade: "严重告警",
            alert_time: "2024.7.9",
            sender_name: "张三",
            alert_content: "靠近目标，开始行动！4",
            isConfirmed: false
          }
        ],
        alert_data_mine: [
          {
            alert_grade: "一般告警",
            alert_time: "2024.5.1",
            sender_name: "张三",
            alert_content: "目标视野丢失"
          },
          {
            alert_grade: "一般告警",
            alert_time: "2024.2.6",
            sender_name: "李四",
            alert_content: "发现嫌疑人"
          },
          {
            alert_grade: "重要告警",
            alert_time: "2024.1.3",
            sender_name: "张三",
            alert_content: "行动暂停"
          },
          {
            alert_grade: "严重告警",
            alert_time: "2024.7.9",
            sender_name: "张三",
            alert_content: "行动继续"
          }
        ],
        // 行动回溯，false停止，true播放
        replay: false
      };
    },
    onNavigationBarButtonTap() {
      this.$refs.popup.open("bottom");
    },
    onLoad(options) {
      if (options.taskItem) {
        this.taskItem = JSON.parse(options.taskItem);
      } else {
        formatAppLog("error", "at pages/task/task_detail/task_detail.vue:597", "没有传递类型参数");
      }
      this.recorderManager = uni.getRecorderManager();
      this.innerAudioContext = uni.createInnerAudioContext();
      this.innerAudioContext.autoplay = true;
      formatAppLog("log", "at pages/task/task_detail/task_detail.vue:605", "uni.getRecorderManager()", uni.getRecorderManager());
      let self = this;
      this.recorderManager.onStop(function(res) {
        formatAppLog("log", "at pages/task/task_detail/task_detail.vue:608", "recorder stop" + JSON.stringify(res));
        self.filePaths.voicePath = res.tempFilePath;
        const tempFilePath = res.tempFilePath;
        uni.uploadFile({
          url: `http://139.196.11.210:8500/communicate/minio/upload?isGroup=${false}&missionId=${"d56f22fe8f3c40bdba6c0ad609e2f3e6"}&receptionId=${"69fc9284fc5d4dd7b05092af4715ab9d"}`,
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
                title: "音频上传成功！",
                //将值设置为 success 或者直接不用写icon这个参数
                icon: "success",
                //显示持续时间为 1秒
                duration: 2e3
              });
            } else {
              uni.showToast({
                title: "音频上传失败！",
                icon: "none",
                //显示持续时间为 1秒
                duration: 2e3
              });
            }
            formatAppLog("log", "at pages/task/task_detail/task_detail.vue:639", uploadFileRes.data);
          }
        });
      });
      this.selectedMap = "gaode";
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
            formatAppLog("log", "at pages/task/task_detail/task_detail.vue:655", "拍照成功，文件路径：", tempFilePath);
            uni.previewImage({
              urls: [tempFilePath]
            });
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
                formatAppLog("log", "at pages/task/task_detail/task_detail.vue:693", uploadFileRes.data);
              }
            });
          },
          fail: function(err) {
            formatAppLog("error", "at pages/task/task_detail/task_detail.vue:698", "拍照失败：", err);
          }
        });
      },
      take_video() {
        var self = this;
        uni.chooseVideo({
          sourceType: ["camera"],
          // 只允许从相机录制
          maxDuration: 60,
          // 录像时长最大为60秒
          camera: "back",
          // 使用后置摄像头
          success: function(res) {
            const tempFilePath = res.tempFilePath;
            self.filePaths.videoPath = res.tempFilePath;
            formatAppLog("log", "at pages/task/task_detail/task_detail.vue:713", "录像成功，文件路径：", tempFilePath);
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
                formatAppLog("log", "at pages/task/task_detail/task_detail.vue:746", uploadFileRes.data);
              }
            });
          },
          fail: function(err) {
            formatAppLog("error", "at pages/task/task_detail/task_detail.vue:751", "录像失败：", err);
          }
        });
      },
      startRecording() {
        formatAppLog("log", "at pages/task/task_detail/task_detail.vue:756", "开始录音");
        this.recorderManager.start();
        uni.showLoading({
          title: "正在录音"
        });
      },
      stopRecording() {
        formatAppLog("log", "at pages/task/task_detail/task_detail.vue:765", "录音结束");
        this.recorderManager.stop();
        uni.hideLoading();
      },
      playVoice() {
        formatAppLog("log", "at pages/task/task_detail/task_detail.vue:770", "播放录音");
        formatAppLog("log", "at pages/task/task_detail/task_detail.vue:771", "this.voicePath", this.filePaths.voicePath);
        if (this.filePaths.voicePath) {
          this.innerAudioContext.src = this.filePaths.voicePath;
          this.innerAudioContext.play();
        }
      },
      checkIndex(index) {
        formatAppLog("log", "at pages/task/task_detail/task_detail.vue:778", index);
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
          url: `/pages/task/task_detail/document/document?missionId=${this.taskItem.id}`
        });
      },
      goToMainPage() {
        uni.redirectTo({
          url: "/pages/tabBar/tabBar"
        });
      },
      selectImage(value) {
        this.selectedMap = value;
        formatAppLog("log", "at pages/task/task_detail/task_detail.vue:827", this.selectedMap);
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
        this.$refs[ref].validate().then((res) => {
          formatAppLog("log", "at pages/task/task_detail/task_detail.vue:844", "success", res);
          uni.showToast({
            title: `发布成功`
          });
        }).catch((err) => {
          formatAppLog("log", "at pages/task/task_detail/task_detail.vue:849", "err", err);
        });
        const now = /* @__PURE__ */ new Date();
        const formattedDateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
        formatAppLog("log", "at pages/task/task_detail/task_detail.vue:857", formattedDateTime);
        this.alert_form_data.alert_time = formattedDateTime;
        this.alert_form_data.sender_name = "lihua";
        this.alert_data.push(this.alert_form_data);
        this.alert_data_mine.push(this.alert_form_data);
        this.$refs.alert_form_popup.close();
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
      }
    }
  };
  function _sfc_render$s(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_data_select = resolveEasycom(vue.resolveDynamicComponent("uni-data-select"), __easycom_0$2);
    const _component_uni_popup = resolveEasycom(vue.resolveDynamicComponent("uni-popup"), __easycom_4$1);
    const _component_uni_collapse_item = resolveEasycom(vue.resolveDynamicComponent("uni-collapse-item"), __easycom_2$1);
    const _component_uni_collapse = resolveEasycom(vue.resolveDynamicComponent("uni-collapse"), __easycom_3$1);
    const _component_uni_data_checkbox = resolveEasycom(vue.resolveDynamicComponent("uni-data-checkbox"), __easycom_4);
    const _component_uni_forms_item = resolveEasycom(vue.resolveDynamicComponent("uni-forms-item"), __easycom_5$1);
    const _component_uni_easyinput = resolveEasycom(vue.resolveDynamicComponent("uni-easyinput"), __easycom_6$1);
    const _component_uni_forms = resolveEasycom(vue.resolveDynamicComponent("uni-forms"), __easycom_7);
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(" 地图容器 "),
        vue.createElementVNode("view", {
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
                    src: _imports_0$3,
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
                    src: _imports_1$1,
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
                          style: { "width": "36px", "height": "33px" }
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
                          style: { "width": "25px", "height": "25px" },
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
    block0(_sfc_main$t);
  const PagesTaskTaskDetailTaskDetail = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", _sfc_render$s], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/task/task_detail/task_detail.vue"]]);
  const _sfc_main$s = {
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
  function _sfc_render$r(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", _sfc_render$r], ["__scopeId", "data-v-7a807eb7"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-grid/components/uni-grid-item/uni-grid-item.vue"]]);
  const _sfc_main$r = {
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
  function _sfc_render$q(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_1 = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", _sfc_render$q], ["__scopeId", "data-v-07acefee"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-grid/components/uni-grid/uni-grid.vue"]]);
  const _sfc_main$q = {
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
  function _sfc_render$p(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_2 = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", _sfc_render$p], ["__scopeId", "data-v-637fd36b"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-section/components/uni-section/uni-section.vue"]]);
  const _sfc_main$p = {
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
  function _sfc_render$o(_ctx, _cache, $props, $setup, $data, $options) {
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
  const __easycom_3 = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", _sfc_render$o], ["__scopeId", "data-v-fdd21252"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/q-previewImage/components/q-previewImage/q-previewImage.vue"]]);
  const _sfc_main$o = {
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
  function _sfc_render$n(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view");
  }
  const __easycom_5 = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", _sfc_render$n], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/components/ysh-file-manager/ysh-file-manager.vue"]]);
  let platform = "other";
  const _sfc_main$n = {
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
  function _sfc_render$m(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_uni_icons = resolveEasycom(vue.resolveDynamicComponent("uni-icons"), __easycom_0$4);
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
  const __easycom_6 = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", _sfc_render$m], ["__scopeId", "data-v-85f34dfc"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/uni_modules/uni-fab/components/uni-fab/uni-fab.vue"]]);
  const _sfc_main$m = {
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
  function _sfc_render$l(_ctx, _cache, $props, $setup, $data, $options) {
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
  const freeAudio = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", _sfc_render$l], ["__scopeId", "data-v-615c0603"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/components/chengpeng-audio/free-audio.vue"]]);
  const _imports_0$2 = "/static/icon/take_video.png";
  const _imports_1 = "/static/icon/audio.png";
  const _sfc_main$l = {
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
  function _sfc_render$k(_ctx, _cache, $props, $setup, $data, $options) {
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
                                    src: _imports_0$2,
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
                                    src: _imports_1,
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
  const PagesTaskTaskDetailDocumentDocument = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", _sfc_render$k], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/task/task_detail/document/document.vue"]]);
  const _sfc_main$k = {
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
  function _sfc_render$j(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesTaskTaskDetailMapTestMapTest = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", _sfc_render$j], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/task/task_detail/map_test/map_test.vue"]]);
  const _sfc_main$j = {
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
  function _sfc_render$i(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "map-container" }, [
      vue.createElementVNode("web-view", { src: "/static/html/map_baidu.html" })
    ]);
  }
  const PagesTaskTaskDetailBaiduMapBaiduMap = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", _sfc_render$i], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/task/task_detail/baidu_map/baidu_map.vue"]]);
  const _sfc_main$i = {
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
  function _sfc_render$h(_ctx, _cache, $props, $setup, $data, $options) {
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
  const OptionPicker = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", _sfc_render$h], ["__scopeId", "data-v-2798e3c8"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/profile/OptionPicker.vue"]]);
  const _imports_0$1 = "/static/avatar-placeholder.png";
  const _sfc_main$h = {
    name: "MainPage",
    components: {
      OptionPicker
    },
    data() {
      return {
        settingItems: [
          { label: "定位信息回传间隔", value: "5分钟" },
          { label: "文件本地存储策略", value: "7天" },
          { label: "修改密码", value: "" }
        ],
        showConfirmDialog: false,
        confirmMessage: "",
        deleteType: "",
        selectedStorageStrategy: "7天",
        storageOptions: [
          { label: "7天", value: "7天" },
          { label: "15天", value: "15天" },
          { label: "30天", value: "30天" }
        ],
        selectedLocationInterval: "5分钟",
        locationIntervalOptions: [
          { label: "1分钟", value: "1分钟" },
          { label: "5分钟", value: "5分钟" },
          { label: "10分钟", value: "10分钟" },
          { label: "30分钟", value: "30分钟" }
        ],
        showPicker: false,
        pickerTitle: "",
        pickerOptions: [],
        pickerSelectedValue: "",
        pickerType: ""
      };
    },
    methods: {
      onSettingItemClick(item) {
        if (item.label === "文件本地存储策略") {
          this.openPicker("storage", "文件本地存储策略", this.storageOptions, this.selectedStorageStrategy);
        } else if (item.label === "定位信息回传间隔") {
          this.openPicker("location", "定位信息回传间隔", this.locationIntervalOptions, this.selectedLocationInterval);
        } else if (item.label === "修改密码") {
          uni.navigateTo({
            url: "/pages/forgetPassword/forgetPassword"
          });
        }
      },
      openPicker(type, title, options, selectedValue) {
        this.pickerType = type;
        this.pickerTitle = title;
        this.pickerOptions = options;
        this.pickerSelectedValue = selectedValue;
        this.showPicker = true;
      },
      closePicker() {
        this.showPicker = false;
      },
      selectOption(value) {
        if (this.pickerType === "storage") {
          this.selectedStorageStrategy = value;
          this.settingItems.find((item) => item.label === "文件本地存储策略").value = value;
        } else if (this.pickerType === "location") {
          this.selectedLocationInterval = value;
          this.settingItems.find((item) => item.label === "定位信息回传间隔").value = value;
        }
        this.closePicker();
      },
      showDeleteConfirm(type) {
        this.deleteType = type;
        this.confirmMessage = type === "chat" ? "确定删除聊天记录吗？" : "您确认要删除所有数据吗？";
        this.showConfirmDialog = true;
      },
      cancelDelete() {
        this.showConfirmDialog = false;
      },
      confirmDelete() {
        if (this.deleteType === "chat") {
          formatAppLog("log", "at pages/profile/profile.vue:159", "聊天记录已删除");
        } else {
          formatAppLog("log", "at pages/profile/profile.vue:161", "所有数据已删除");
        }
        this.showConfirmDialog = false;
      },
      logout() {
        uni.removeStorageSync("token");
        uni.showLoading({
          title: "正在退出登录",
          mask: true
        });
        if (uni.getStorageSync("token") != "") {
          logout().then((res) => {
            uni.removeStorageSync("token");
            uni.removeStorageSync("userInfo");
            uni.redirectTo({
              url: "/pages/login/login"
            });
            uni.hideLoading();
          });
        }
      }
    }
  };
  function _sfc_render$g(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_OptionPicker = vue.resolveComponent("OptionPicker");
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode("view", { class: "container" }, [
        vue.createCommentVNode(" 用户头像和名称 "),
        vue.createElementVNode("view", { class: "user-info" }, [
          vue.createElementVNode("image", {
            class: "avatar",
            src: _imports_0$1
          }),
          vue.createElementVNode("view", { class: "name-container" }, [
            vue.createElementVNode("text", { class: "name" }, "张宁鹏"),
            vue.createElementVNode("text", { class: "edit-icon" }, "✎")
          ])
        ]),
        vue.createCommentVNode(" 用户名和设备IP "),
        vue.createElementVNode("view", { class: "info-item" }, [
          vue.createElementVNode("text", { class: "info-label" }, "用户名:"),
          vue.createElementVNode("text", { class: "info-value" }, "zhangningp")
        ]),
        vue.createElementVNode("view", { class: "info-item" }, [
          vue.createElementVNode("text", { class: "info-label" }, "设备IP:"),
          vue.createElementVNode("text", { class: "info-value" }, "192.168.178.1")
        ]),
        vue.createCommentVNode(" 位置共享开关 "),
        vue.createElementVNode("view", { class: "switch-item" }, [
          vue.createElementVNode("text", null, "是否开启位置共享"),
          vue.createElementVNode("switch", { color: "#4285f4" })
        ]),
        vue.createCommentVNode(" 设置选项列表 "),
        vue.createElementVNode("view", { class: "setting-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.settingItems, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                class: "setting-item",
                key: index,
                onClick: ($event) => $options.onSettingItemClick(item)
              }, [
                vue.createElementVNode(
                  "text",
                  null,
                  vue.toDisplayString(item.label),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "setting-value" }, [
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(item.value),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", { class: "arrow" }, ">")
                ])
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ]),
        vue.createCommentVNode(" 删除聊天记录按钮 "),
        vue.createElementVNode("view", {
          class: "delete-chat",
          onClick: _cache[0] || (_cache[0] = ($event) => $options.showDeleteConfirm("chat"))
        }, [
          vue.createElementVNode("text", null, "删除聊天记录")
        ]),
        vue.createElementVNode("view", {
          class: "delete-all",
          onClick: _cache[1] || (_cache[1] = ($event) => $options.showDeleteConfirm("all"))
        }, [
          vue.createElementVNode("text", null, "一键删除")
        ]),
        vue.createCommentVNode(" 退出登录按钮 "),
        vue.createElementVNode("view", {
          class: "logout",
          onClick: _cache[2] || (_cache[2] = ($event) => $options.logout())
        }, [
          vue.createElementVNode("text", null, "退出登录")
        ]),
        vue.createCommentVNode(" 确认弹窗 "),
        $data.showConfirmDialog ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "dialog-overlay"
        }, [
          vue.createElementVNode("view", { class: "dialog-content" }, [
            vue.createElementVNode("view", { class: "dialog-body" }, [
              vue.createElementVNode(
                "text",
                null,
                vue.toDisplayString($data.confirmMessage),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", { class: "dialog-footer" }, [
              vue.createElementVNode("button", {
                class: "dialog-btn cancel-btn",
                onClick: _cache[3] || (_cache[3] = (...args) => $options.cancelDelete && $options.cancelDelete(...args))
              }, "取消"),
              vue.createElementVNode("button", {
                class: "dialog-btn confirm-btn",
                onClick: _cache[4] || (_cache[4] = (...args) => $options.confirmDelete && $options.confirmDelete(...args))
              }, "确认")
            ])
          ])
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createCommentVNode(" 选项选择器 "),
      $data.showPicker ? (vue.openBlock(), vue.createBlock(_component_OptionPicker, {
        key: 0,
        title: $data.pickerTitle,
        options: $data.pickerOptions,
        selectedValue: $data.pickerSelectedValue,
        onSelect: $options.selectOption,
        onClose: $options.closePicker
      }, null, 8, ["title", "options", "selectedValue", "onSelect", "onClose"])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesProfileProfile = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", _sfc_render$g], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/profile/profile.vue"]]);
  const _sfc_main$g = {
    name: "GroupAvatar",
    props: {
      avatar: {
        type: Array,
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
        if (this.avatar.length === 0) {
          return [this.defaultAvatarPath];
        }
        return this.avatar.map((avatarPath) => avatarPath || this.defaultAvatarPath);
      }
    }
  };
  function _sfc_render$f(_ctx, _cache, $props, $setup, $data, $options) {
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
  const GroupAvatar = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", _sfc_render$f], ["__scopeId", "data-v-afb5909c"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/ChatComponent/GroupAvatar.vue"]]);
  const _sfc_main$f = {
    name: "Messages",
    components: {
      GroupAvatar
    },
    data() {
      return {
        messages: [
          { id: "1", name: "张宁鹏", avatar: [], preview: "你好", date: "7月21日", type: "single" },
          { id: "2", name: "杨尚基", avatar: [], preview: "[图片]", date: "7月21日", type: "single" },
          { id: "3", name: "王彦", avatar: [], preview: "[视频]", date: "7月22日", type: "single" },
          {
            id: "4",
            name: "项目讨论群",
            avatar: [
              "",
              "",
              "",
              ""
            ],
            preview: "下周一开会",
            date: "7月23日",
            type: "group"
          }
        ],
        defaultAvatarPath: "../../static/message/默认头像.png"
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
      totalMessageCount() {
        return this.messages.length + 1;
      }
    },
    mounted() {
      uni.$on("switchToMessages", this.handleSwitchToMessages);
    },
    beforeDestroy() {
      uni.$off("switchToMessages", this.handleSwitchToMessages);
    },
    methods: {
      openChat(message) {
        const chatInfo = {
          id: message.id,
          name: message.name,
          avatar: message.avatar,
          type: message.type
        };
        uni.navigateTo({
          url: "/pages/message/chat",
          success: (res) => {
            res.eventChannel.emit("chatInfo", { chatInfo });
          },
          fail: (err) => {
            formatAppLog("error", "at pages/message/main.vue:109", "导航到聊天页面失败:", err);
          }
        });
      },
      getCurrentDate() {
        const now = /* @__PURE__ */ new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        return `${month}月${day}日`;
      },
      handleSwitchToMessages() {
        uni.$emit("updateTabBarActiveTab", 1);
      },
      getAvatarSrc(avatar) {
        return avatar || this.defaultAvatarPath;
      }
    }
  };
  function _sfc_render$e(_ctx, _cache, $props, $setup, $data, $options) {
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
            vue.createElementVNode("text", null, "🔍")
          ])
        ]),
        vue.createElementVNode("scroll-view", {
          class: "messages-list",
          "scroll-y": ""
        }, [
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
            vue.renderList($data.messages, (message, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: index,
                class: "message-item",
                onClick: ($event) => $options.openChat(message)
              }, [
                message.type === "group" ? (vue.openBlock(), vue.createBlock(_component_group_avatar, {
                  key: 0,
                  avatar: message.avatar
                }, null, 8, ["avatar"])) : (vue.openBlock(), vue.createElementBlock("image", {
                  key: 1,
                  src: $options.getAvatarSrc(message.avatar[0]),
                  class: "avatar",
                  mode: "aspectFill"
                }, null, 8, ["src"])),
                vue.createElementVNode("view", { class: "message-content-wrapper" }, [
                  vue.createElementVNode("view", { class: "message-content" }, [
                    vue.createElementVNode(
                      "view",
                      { class: "message-title" },
                      vue.toDisplayString(message.name),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "view",
                      { class: "message-preview" },
                      vue.toDisplayString(message.preview),
                      1
                      /* TEXT */
                    )
                  ]),
                  vue.createElementVNode(
                    "view",
                    { class: "message-date" },
                    vue.toDisplayString(message.date),
                    1
                    /* TEXT */
                  )
                ])
              ], 8, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])
    ]);
  }
  const PagesMessageMain = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", _sfc_render$e], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/main.vue"]]);
  const _sfc_main$e = {
    name: "ChatHeader",
    components: {
      GroupAvatar
    },
    props: {
      // chatInfo: 聊天信息对象，包含聊天的基本信息
      chatInfo: {
        type: Object,
        required: true
      }
    }
  };
  function _sfc_render$d(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_group_avatar = vue.resolveComponent("group-avatar");
    return vue.openBlock(), vue.createElementBlock("view", { class: "chat-header" }, [
      vue.createCommentVNode(" 返回按钮 "),
      vue.createElementVNode("text", {
        class: "back-button",
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("goBack"))
      }, "←"),
      vue.createCommentVNode(" 聊天标题容器 "),
      vue.createElementVNode("view", { class: "chat-title-container" }, [
        vue.createCommentVNode(" 群聊头像 "),
        $props.chatInfo.type === "group" ? (vue.openBlock(), vue.createBlock(_component_group_avatar, {
          key: 0,
          avatar: $props.chatInfo.avatar
        }, null, 8, ["avatar"])) : (vue.openBlock(), vue.createElementBlock(
          vue.Fragment,
          { key: 1 },
          [
            vue.createCommentVNode(" 单聊头像 "),
            vue.createElementVNode("image", {
              src: $props.chatInfo.avatar[0],
              class: "avatar",
              mode: "aspectFill"
            }, null, 8, ["src"])
          ],
          2112
          /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
        )),
        vue.createCommentVNode(" 聊天标题 "),
        vue.createElementVNode(
          "text",
          { class: "chat-title" },
          vue.toDisplayString($props.chatInfo.name),
          1
          /* TEXT */
        )
      ]),
      vue.createCommentVNode(" 菜单按钮 "),
      vue.createElementVNode("text", { class: "menu-button" }, "...")
    ]);
  }
  const ChatHeader = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", _sfc_render$d], ["__scopeId", "data-v-120ff10e"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/ChatComponent/ChatHeader.vue"]]);
  const _sfc_main$d = {
    name: "Message",
    props: {
      // message: 消息对象，包含消息的所有相关信息
      message: {
        type: Object,
        required: true
      }
    },
    methods: {
      // formatTime: 格式化时间戳为可读的时间字符串
      formatTime(timestamp) {
        const date = new Date(timestamp);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${month}-${day} ${hours}:${minutes}`;
      }
    }
  };
  function _sfc_render$c(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: vue.normalizeClass(["message", [$props.message.userType]])
      },
      [
        vue.createCommentVNode(" 消息时间 "),
        vue.createElementVNode(
          "view",
          { class: "message-time" },
          vue.toDisplayString($options.formatTime($props.message.timestamp)),
          1
          /* TEXT */
        ),
        vue.createElementVNode("view", { class: "message-content" }, [
          vue.createCommentVNode(" 头像 "),
          vue.createElementVNode("image", {
            src: $props.message.avatar,
            class: "avatar",
            mode: "aspectFill"
          }, null, 8, ["src"]),
          vue.createElementVNode("view", { class: "content-wrapper" }, [
            vue.createCommentVNode(" 好友名称（仅在好友消息中显示） "),
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
            vue.createCommentVNode(" 图片消息 "),
            $props.message.messageType === "image" ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "content"
            }, [
              vue.createElementVNode("image", {
                src: $props.message.content,
                mode: "widthFix"
              }, null, 8, ["src"])
            ])) : $props.message.messageType === "file" ? (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 2 },
              [
                vue.createCommentVNode(" 文件消息 "),
                vue.createElementVNode("view", { class: "content file-message" }, [
                  vue.createElementVNode("view", { class: "file-icon" }, "📄"),
                  vue.createElementVNode("view", { class: "file-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "file-name" },
                      vue.toDisplayString($props.message.content.name),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "file-size" },
                      vue.toDisplayString($props.message.content.size),
                      1
                      /* TEXT */
                    )
                  ])
                ])
              ],
              2112
              /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
            )) : $props.message.messageType === "burn-after-reading" ? (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 3 },
              [
                vue.createCommentVNode(" 阅后即焚消息 "),
                vue.createElementVNode("view", { class: "content burn-after-reading" }, [
                  vue.createElementVNode("image", {
                    src: $props.message.content.mosaicPath,
                    mode: "widthFix",
                    onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("view-burn-after-reading", $props.message))
                  }, null, 8, ["src"]),
                  vue.createElementVNode("text", { class: "burn-after-reading-text" }, "阅后即焚")
                ])
              ],
              2112
              /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
            )) : (vue.openBlock(), vue.createElementBlock(
              vue.Fragment,
              { key: 4 },
              [
                vue.createCommentVNode(" 文本消息 "),
                vue.createElementVNode(
                  "view",
                  { class: "content" },
                  vue.toDisplayString($props.message.content),
                  1
                  /* TEXT */
                )
              ],
              2112
              /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
            ))
          ])
        ])
      ],
      2
      /* CLASS */
    );
  }
  const Message = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-1cea873d"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/ChatComponent/Message.vue"]]);
  const _sfc_main$c = {
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
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
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
  const MessageList = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-dee4eb4b"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/ChatComponent/MessageList.vue"]]);
  const _sfc_main$b = {
    name: "AttachmentMenu",
    data() {
      return {
        attachOptions: [
          { icon: "../icon//c1.png", label: "相册", action: "album" },
          { icon: "../../../static/c1.png", label: "拍摄", action: "camera" },
          { icon: "../../../static/c1.png", label: "视频通话", action: "video-call" },
          { icon: "../../../static/c1.png", label: "文件传输", action: "file" },
          { icon: "../../../static/c1.png", label: "阅后即焚", action: "burn-after-reading" },
          { icon: "../../../static/c1.png", label: "位置", action: "location" }
        ]
      };
    },
    methods: {
      attachItem(action) {
        this.$emit("attach", action);
      }
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: vue.normalizeClass(["attach-menu", { "active": true }])
    }, [
      (vue.openBlock(true), vue.createElementBlock(
        vue.Fragment,
        null,
        vue.renderList($data.attachOptions, (option) => {
          return vue.openBlock(), vue.createElementBlock("view", {
            key: option.action,
            class: "attach-option",
            onClick: ($event) => $options.attachItem(option.action)
          }, [
            vue.createElementVNode("image", {
              src: option.icon,
              class: "attach-icon"
            }, null, 8, ["src"]),
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString(option.label),
              1
              /* TEXT */
            )
          ], 8, ["onClick"]);
        }),
        128
        /* KEYED_FRAGMENT */
      )),
      vue.createCommentVNode(" 使用插槽为未实现的功能预留位置 "),
      vue.renderSlot(_ctx.$slots, "album", {}, void 0, true),
      vue.renderSlot(_ctx.$slots, "camera", {}, void 0, true),
      vue.renderSlot(_ctx.$slots, "video-call", {}, void 0, true),
      vue.renderSlot(_ctx.$slots, "location", {}, void 0, true)
    ]);
  }
  const AttachmentMenu = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-00ea5aaf"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/ChatComponent/ChatInputAreaComponent/AttachmentMenu.vue"]]);
  const _sfc_main$a = {
    name: "FileTransfer",
    // 组件属性定义
    props: {
      fileData: {
        type: Object,
        default: null
      }
    },
    // 组件方法
    methods: {
      chooseFile() {
        uni.chooseFile({
          count: 1,
          extension: [".doc", ".docx", ".pdf", ".txt"],
          success: (res) => {
            const file = res.tempFiles[0];
            this.$emit("file-selected", {
              name: file.name,
              size: this.formatFileSize(file.size),
              path: file.path
            });
          },
          fail: (err) => {
            formatAppLog("error", "at pages/message/ChatComponent/ChatInputAreaComponent/FileTransfer.vue:40", "选择文件失败", err);
          }
        });
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
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      vue.Fragment,
      null,
      [
        vue.createCommentVNode(" 文件传输组件 "),
        vue.createElementVNode("view", null, [
          $props.fileData ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "file-message"
          }, [
            vue.createElementVNode("view", { class: "file-icon" }, "📄"),
            vue.createElementVNode("view", { class: "file-info" }, [
              vue.createElementVNode(
                "text",
                { class: "file-name" },
                vue.toDisplayString($props.fileData.name),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "file-size" },
                vue.toDisplayString($props.fileData.size),
                1
                /* TEXT */
              )
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ],
      2112
      /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */
    );
  }
  const FileTransfer = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-ce413881"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/ChatComponent/ChatInputAreaComponent/FileTransfer.vue"]]);
  const _sfc_main$9 = {
    name: "ChatInputArea",
    components: {
      AttachmentMenu,
      FileTransfer
    },
    props: {
      showAttachMenu: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        newMessage: ""
        // 存储用户输入的消息
      };
    },
    methods: {
      // 发送消息
      sendMessage() {
        if (this.newMessage.trim()) {
          this.$emit("send-message", this.newMessage);
          this.newMessage = "";
          this.$nextTick(() => {
            this.focusInput();
          });
        }
      },
      // 聚焦输入框
      focusInput() {
        if (this.$refs.messageInput) {
          const query = uni.createSelectorQuery().in(this);
          query.select(".text-input").boundingClientRect((data) => {
            if (data) {
              uni.createSelectorQuery().in(this).select(".text-input").fields({
                context: true,
                size: true
              }, (res) => {
                res.context.focus();
              }).exec();
            }
          }).exec();
        }
      },
      // 切换附件菜单的显示状态
      toggleAttachMenu() {
        this.$emit("toggle-attach-menu", !this.showAttachMenu);
      },
      // 关闭附件菜单
      closeAttachMenu() {
        this.$emit("toggle-attach-menu", false);
      },
      // 处理附件项的点击
      attachItem(action) {
        if (action === "file") {
          this.$refs.fileTransfer.chooseFile();
        } else if (action === "burn-after-reading") {
          this.chooseBurnAfterReadingImage();
        } else {
          this.$emit("attach", action);
        }
        this.closeAttachMenu();
      },
      // 处理文件选择
      handleFileSelected(fileData) {
        this.$emit("attach", "file", fileData);
      },
      // 选择阅后即焚图片
      chooseBurnAfterReadingImage() {
        uni.chooseImage({
          count: 1,
          success: (res) => {
            const image = res.tempFilePaths[0];
            this.applyMosaicEffect(image, (mosaicImage) => {
              this.$emit("attach", "burn-after-reading", {
                originalPath: image,
                mosaicPath: mosaicImage,
                duration: 5
                // 默认持续时间为5秒
              });
            });
          },
          fail: (err) => {
            formatAppLog("error", "at pages/message/ChatComponent/ChatInputArea.vue:138", "选择图片失败", err);
          }
        });
      },
      // 应用马赛克效果到图片
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
              formatAppLog("error", "at pages/message/ChatComponent/ChatInputArea.vue:165", "马赛克处理失败", err);
            }
          });
        });
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.focusInput();
      });
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_attachment_menu = vue.resolveComponent("attachment-menu");
    const _component_file_transfer = vue.resolveComponent("file-transfer");
    return vue.openBlock(), vue.createElementBlock("view", { class: "chat-input-area" }, [
      vue.createCommentVNode(" 聊天输入框和按钮区域 "),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["chat-input", { "elevated": $props.showAttachMenu }])
        },
        [
          vue.createCommentVNode(" 语音按钮 "),
          vue.createElementVNode("text", { class: "voice-button" }, "🎤"),
          vue.createCommentVNode(" 文本输入框 "),
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
          vue.createCommentVNode(" 附件按钮（当附件菜单未显示时） "),
          !$props.showAttachMenu ? (vue.openBlock(), vue.createElementBlock("text", {
            key: 0,
            class: "attach-button",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.toggleAttachMenu && $options.toggleAttachMenu(...args))
          }, "+")) : vue.createCommentVNode("v-if", true),
          vue.createCommentVNode(" 发送按钮（当附件菜单显示时） "),
          $props.showAttachMenu ? (vue.openBlock(), vue.createElementBlock("text", {
            key: 1,
            class: "send-button",
            onClick: _cache[3] || (_cache[3] = (...args) => $options.sendMessage && $options.sendMessage(...args))
          }, "发送")) : vue.createCommentVNode("v-if", true)
        ],
        2
        /* CLASS */
      ),
      vue.createCommentVNode(" 附件菜单组件 "),
      $props.showAttachMenu ? (vue.openBlock(), vue.createBlock(_component_attachment_menu, {
        key: 0,
        onAttach: $options.attachItem,
        onClose: $options.closeAttachMenu
      }, {
        album: vue.withCtx(() => [
          vue.createCommentVNode(" 相册功能的自定义内容 ")
        ]),
        camera: vue.withCtx(() => [
          vue.createCommentVNode(" 拍摄功能的自定义内容 ")
        ]),
        "video-call": vue.withCtx(() => [
          vue.createCommentVNode(" 视频通话功能的自定义内容 ")
        ]),
        location: vue.withCtx(() => [
          vue.createCommentVNode(" 位置功能的自定义内容 ")
        ]),
        _: 1
        /* STABLE */
      }, 8, ["onAttach", "onClose"])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 文件传输组件 "),
      vue.createVNode(_component_file_transfer, {
        ref: "fileTransfer",
        onFileSelected: $options.handleFileSelected
      }, null, 8, ["onFileSelected"])
    ]);
  }
  const ChatInputArea = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-e8a570ad"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/ChatComponent/ChatInputArea.vue"]]);
  const _sfc_main$8 = {
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
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
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
  const BurnAfterReading = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-3b98a725"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/ChatComponent/BurnAfterReading.vue.vue"]]);
  const _sfc_main$7 = {
    name: "ScrollToBottomButton",
    props: {
      show: {
        type: Boolean,
        default: false
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return $props.show ? (vue.openBlock(), vue.createElementBlock("view", {
      key: 0,
      class: "scroll-to-bottom",
      onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click"))
    }, [
      vue.createElementVNode("text", { class: "scroll-to-bottom-icon" }, "↓")
    ])) : vue.createCommentVNode("v-if", true);
  }
  const ScrollToBottomButton = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-92969997"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/ChatComponent/ScrollToBottomButton.vue"]]);
  const groupChatHistory = [
    { id: 1, name: "张三", avatar: "../../static/c1.png", content: "大家好，我是张三", userType: "friend", messageType: "text", timestamp: /* @__PURE__ */ new Date("2023-07-21T10:00:00") },
    { id: 2, name: "李四", avatar: "../../static/c2.png", content: "你好张三，我是李四", userType: "friend", messageType: "text", timestamp: /* @__PURE__ */ new Date("2023-07-21T10:01:00") },
    { id: 3, name: "王五", avatar: "../../static/c3.png", content: "大家好，我是王五", userType: "friend", messageType: "text", timestamp: /* @__PURE__ */ new Date("2023-07-21T10:02:00") },
    { id: 4, name: "赵六", avatar: "../../static/c4.png", content: "../../static/image1.jpg", userType: "friend", messageType: "image", timestamp: /* @__PURE__ */ new Date("2023-07-21T10:03:00") },
    { id: 5, name: "张三", avatar: "../../static/c1.png", content: "这是一个很有意思的话题", userType: "friend", messageType: "text", timestamp: /* @__PURE__ */ new Date("2023-07-21T10:04:00") },
    { id: 6, name: "李四", avatar: "../../static/c2.png", content: { name: "会议纪要.docx", size: "2.5MB" }, userType: "friend", messageType: "file", timestamp: /* @__PURE__ */ new Date("2023-07-21T10:05:00") },
    { id: 7, name: "王五", avatar: "../../static/c3.png", content: "我同意张三的观点", userType: "friend", messageType: "text", timestamp: /* @__PURE__ */ new Date("2023-07-21T10:06:00") },
    { id: 8, name: "赵六", avatar: "../../static/c4.png", content: "我们下周一开会讨论这个问题吧", userType: "friend", messageType: "text", timestamp: /* @__PURE__ */ new Date("2023-07-21T10:07:00") }
  ];
  const _sfc_main$6 = {
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
        hasNewMessages: false
      };
    },
    onLoad() {
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.on("chatInfo", (data) => {
        this.chatInfo = data.chatInfo;
        this.initializeChat();
      });
    },
    mounted() {
      this.getScrollViewInfo();
      formatAppLog("log", "at pages/message/chat.vue:105", "聊天组件已挂载");
    },
    methods: {
      initializeChat() {
        this.list = this.chatInfo.type === "group" ? groupChatHistory : [
          {
            content: "对方历史回复消息",
            userType: "friend",
            avatar: this.chatInfo.avatar[0],
            name: this.chatInfo.name,
            timestamp: /* @__PURE__ */ new Date("2023-07-21T09:58:00")
          },
          {
            content: "历史消息",
            userType: "self",
            avatar: this._selfAvatar,
            timestamp: /* @__PURE__ */ new Date("2023-07-21T09:59:00")
          }
        ];
        this.$nextTick(this.scrollToBottom);
      },
      getScrollViewInfo() {
        const query = uni.createSelectorQuery().in(this);
        query.select(".scroll-view").boundingClientRect((data) => {
          if (data) {
            this.scrollViewHeight = data.height;
            formatAppLog("log", "at pages/message/chat.vue:131", "滚动视图高度:", this.scrollViewHeight);
          } else {
            formatAppLog("log", "at pages/message/chat.vue:133", "获取滚动视图高度失败");
          }
        }).exec();
      },
      goBack() {
        uni.navigateBack({
          success: () => {
            uni.$emit("updateTabBarActiveTab", 1);
          },
          fail: (err) => {
            formatAppLog("error", "at pages/message/chat.vue:144", "返回失败:", err);
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
        if (message.trim()) {
          this.addNewMessage({
            content: message,
            userType: "self",
            avatar: this._selfAvatar,
            timestamp: /* @__PURE__ */ new Date()
          });
          this.chatInfo.type === "group" ? this.simulateGroupResponse() : this.simulateSingleResponse();
        }
      },
      simulateGroupResponse() {
        setTimeout(() => {
          const randomMember = groupChatHistory[Math.floor(Math.random() * groupChatHistory.length)];
          this.addNewMessage({
            content: `这是来自${randomMember.name}的回复`,
            userType: "friend",
            avatar: randomMember.avatar,
            name: randomMember.name,
            timestamp: /* @__PURE__ */ new Date()
          });
        }, 1500);
      },
      simulateSingleResponse() {
        setTimeout(() => {
          this.addNewMessage({
            content: "这是对方的回复",
            userType: "friend",
            avatar: this.chatInfo.avatar[0],
            name: this.chatInfo.name,
            timestamp: /* @__PURE__ */ new Date()
          });
        }, 1500);
      },
      handleAttachment(type, data) {
        const handlers = {
          album: this.chooseImage,
          file: () => this.handleFileTransfer(data),
          "burn-after-reading": () => this.handleBurnAfterReading(data)
        };
        handlers[type] && handlers[type]();
      },
      chooseImage() {
        uni.chooseImage({
          success: (res) => {
            this.addNewMessage({
              content: res.tempFilePaths[0],
              userType: "self",
              messageType: "image",
              avatar: this._selfAvatar,
              timestamp: /* @__PURE__ */ new Date()
            });
            setTimeout(() => {
              this.addNewMessage({
                content: "你好呀，朋友~",
                userType: "friend",
                avatar: this.chatInfo.avatar[0],
                name: this.chatInfo.name,
                timestamp: /* @__PURE__ */ new Date()
              });
            }, 1500);
          }
        });
      },
      handleFileTransfer(fileData) {
        this.addNewMessage({
          content: fileData,
          userType: "self",
          messageType: "file",
          avatar: this._selfAvatar,
          timestamp: /* @__PURE__ */ new Date()
        });
        setTimeout(() => {
          this.addNewMessage({
            content: "收到文件了，谢谢！",
            userType: "friend",
            avatar: this.chatInfo.avatar[0],
            name: this.chatInfo.name,
            timestamp: /* @__PURE__ */ new Date()
          });
        }, 1500);
      },
      handleBurnAfterReading(imageData) {
        this.addNewMessage({
          content: imageData,
          userType: "self",
          messageType: "burn-after-reading",
          avatar: this._selfAvatar,
          timestamp: /* @__PURE__ */ new Date()
        });
        setTimeout(() => {
          this.addNewMessage({
            content: "收到了一张阅后即焚的图片",
            userType: "friend",
            avatar: this.chatInfo.avatar[0],
            name: this.chatInfo.name,
            timestamp: /* @__PURE__ */ new Date()
          });
        }, 1500);
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
        formatAppLog("log", "at pages/message/chat.vue:274", "附件菜单切换:", show);
      },
      handleOverlayClick() {
        this.showAttachMenu = false;
        formatAppLog("log", "at pages/message/chat.vue:278", "附件菜单已关闭");
      },
      scrollToBottom() {
        this.$nextTick(() => {
          const lastMessageIndex = this.list.length - 1;
          this.scrollIntoView = `message-${lastMessageIndex}`;
          this.showScrollToBottom = false;
          this.showNewMessageTip = false;
          this.hasNewMessages = false;
          this.isScrolledToBottom = true;
          formatAppLog("log", "at pages/message/chat.vue:288", "滚动到底部");
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
        formatAppLog("log", "at pages/message/chat.vue:303", "滚动事件:", { scrollTop, scrollHeight, isAtBottom });
      },
      loadMoreMessages() {
        formatAppLog("log", "at pages/message/chat.vue:306", "加载更多消息");
      },
      addNewMessage(message) {
        this.list.push(message);
        if (!this.isScrolledToBottom) {
          this.hasNewMessages = true;
          this.showScrollToBottom = true;
          this.showNewMessageTip = true;
        } else {
          this.scrollToBottom();
        }
        formatAppLog("log", "at pages/message/chat.vue:317", "新消息已添加:", message);
      },
      simulateNewMessage() {
        const randomMember = groupChatHistory[Math.floor(Math.random() * groupChatHistory.length)];
        this.addNewMessage({
          content: `这是一条新消息，来自${randomMember.name}`,
          userType: "friend",
          avatar: randomMember.avatar,
          name: randomMember.name,
          timestamp: /* @__PURE__ */ new Date()
        });
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
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
      vue.createElementVNode("button", {
        onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => $options.simulateNewMessage && $options.simulateNewMessage(...args), ["stop"])),
        class: "simulate-button"
      }, "模拟新消息"),
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
        onAttach: $options.handleAttachment,
        onToggleAttachMenu: $options.toggleAttachMenu,
        "show-attach-menu": $data.showAttachMenu,
        ref: "chatInputAreaRef"
      }, null, 8, ["onSendMessage", "onAttach", "onToggleAttachMenu", "show-attach-menu"]),
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
        onClick: _cache[1] || (_cache[1] = vue.withModifiers((...args) => $options.scrollToBottom && $options.scrollToBottom(...args), ["stop"]))
      }, " 新消息 ")) : vue.createCommentVNode("v-if", true),
      $data.showAttachMenu ? (vue.openBlock(), vue.createElementBlock("div", {
        key: 2,
        class: "overlay",
        onClick: _cache[2] || (_cache[2] = (...args) => $options.handleOverlayClick && $options.handleOverlayClick(...args))
      })) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesMessageChat = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-013fa921"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/message/chat.vue"]]);
  const _sfc_main$5 = {
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
        formatAppLog("log", "at pages/tabBar/contacts/ContactDetail.vue:90", "处理备注");
      },
      handleMessage() {
        this.navigateToChat();
      },
      handleClearHistory() {
        this.showConfirmDialog("您确认要删除所有聊天记录吗？", () => {
          formatAppLog("log", "at pages/tabBar/contacts/ContactDetail.vue:99", "清空聊天记录");
        });
      },
      handleDelete() {
        this.showConfirmDialog("您确认要删除此联系人吗？", () => {
          formatAppLog("log", "at pages/tabBar/contacts/ContactDetail.vue:106", "删除联系人");
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
            formatAppLog("error", "at pages/tabBar/contacts/ContactDetail.vue:143", "导航到聊天页面失败:", err);
          }
        });
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "contact-detail" }, [
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("view", {
          class: "back-button",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.handleClose && $options.handleClose(...args))
        }, [
          vue.createElementVNode("text", { class: "icon" }, "←")
        ]),
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
            vue.createElementVNode("view", { class: "name-container" }, [
              vue.createElementVNode("view", { class: "name-badge-container" }, [
                vue.createElementVNode(
                  "text",
                  { class: "name" },
                  vue.toDisplayString($props.contact.name),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode("view", { class: "badge" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "badge-text" },
                    vue.toDisplayString($props.contact.title),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "info-item" }, [
                vue.createElementVNode("text", { class: "info-label" }, "用户名"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value" },
                  vue.toDisplayString($props.contact.username),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "info-item" }, [
                vue.createElementVNode("text", { class: "info-label" }, "设备IP"),
                vue.createElementVNode(
                  "text",
                  { class: "info-value" },
                  vue.toDisplayString($props.contact.ip),
                  1
                  /* TEXT */
                )
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
  const ContactDetail = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-8c0c75e8"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/tabBar/contacts/ContactDetail.vue"]]);
  const _sfc_main$4 = {
    name: "Contacts",
    components: {
      ContactDetail
    },
    data() {
      return {
        selectedContact: null,
        groups: [
          {
            id: "group1",
            name: "分组A",
            expanded: true,
            members: [
              {
                id: 1,
                name: "admin",
                title: "称号1",
                avatar: "/placeholder.svg?height=40&width=40",
                username: "admin123",
                ip: "192.168.1.100"
              },
              {
                id: 2,
                name: "张宁鹏",
                title: "称号2",
                avatar: "/placeholder.svg?height=40&width=40",
                username: "zhangningp",
                ip: "192.168.1.101"
              },
              {
                id: 3,
                name: "杨尚基",
                title: "称号3",
                avatar: "/placeholder.svg?height=40&width=40",
                username: "yangshangji",
                ip: "192.168.1.102"
              },
              {
                id: 4,
                name: "王彦",
                title: "称号4",
                avatar: "/placeholder.svg?height=40&width=40",
                username: "wangyan",
                ip: "192.168.1.103"
              }
            ]
          },
          {
            id: "group2",
            name: "分组B",
            expanded: false,
            members: [
              {
                id: 5,
                name: "李明",
                title: "称号5",
                avatar: "/placeholder.svg?height=40&width=40",
                username: "liming",
                ip: "192.168.1.104"
              },
              {
                id: 6,
                name: "赵静",
                title: "称号6",
                avatar: "/placeholder.svg?height=40&width=40",
                username: "zhaojing",
                ip: "192.168.1.105"
              },
              {
                id: 7,
                name: "周伟",
                title: "称号7",
                avatar: "/placeholder.svg?height=40&width=40",
                username: "zhouwei",
                ip: "192.168.1.106"
              }
            ]
          },
          {
            id: "group3",
            name: "分组C",
            expanded: false,
            members: [
              {
                id: 8,
                name: "刘芳",
                title: "称号8",
                avatar: "/placeholder.svg?height=40&width=40",
                username: "liufang",
                ip: "192.168.1.107"
              },
              {
                id: 9,
                name: "陈强",
                title: "称号9",
                avatar: "/placeholder.svg?height=40&width=40",
                username: "chenqiang",
                ip: "192.168.1.108"
              }
            ]
          }
        ]
      };
    },
    methods: {
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
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
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
      vue.createElementVNode("scroll-view", {
        class: "contact-list",
        "scroll-y": ""
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
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
                          src: member.avatar,
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
      ]),
      $data.selectedContact ? (vue.openBlock(), vue.createBlock(_component_contact_detail, {
        key: 0,
        contact: $data.selectedContact,
        onClose: $options.closeContactDetail
      }, null, 8, ["contact", "onClose"])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const Contacts = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-3d3ef74b"], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/tabBar/contacts/contacts.vue"]]);
  const _sfc_main$3 = {
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
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesTabBarTabBar = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/tabBar/tabBar.vue"]]);
  const _sfc_main$2 = {
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
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
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
  const PagesTaskTaskDetailDocumentUploadfileUploadfile = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/task/task_detail/document/uploadfile/uploadfile.vue"]]);
  const _imports_0 = "/static/icon/X.png";
  const _sfc_main$1 = {
    data() {
      return {};
    },
    methods: {}
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createCommentVNode(" 推特logo "),
      vue.createElementVNode("view", { style: { "text-align": "center", "margin-top": "10px" } }, [
        vue.createElementVNode("image", {
          src: _imports_0,
          style: { "width": "30px", "height": "30px" }
        })
      ]),
      vue.createElementVNode("view", { style: { "display": "flex", "justify-content": "center", "align-items": "center", "margin-top": "150px" } }, [
        vue.createElementVNode("text", { style: { "letter-spacing": "3px", "font-size": "3ch", "font-family": "fantasy", "font-weight": "550", "width": "75%" } }, "查看世界正在发生的新鲜事。")
      ])
    ]);
  }
  const PagesLoginCamouflageLoginCamouflageLogin = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/login/camouflageLogin/camouflageLogin.vue"]]);
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
  __definePage("pages/login/camouflageLogin/camouflageLogin", PagesLoginCamouflageLoginCamouflageLogin);
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
    return {
      app
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
