"use weex:vue";

if (typeof Promise !== 'undefined' && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor
    return this.then(
      value => promise.resolve(callback()).then(() => value),
      reason => promise.resolve(callback()).then(() => {
        throw reason
      })
    )
  }
};

if (typeof uni !== 'undefined' && uni && uni.requireGlobal) {
  const global = uni.requireGlobal()
  ArrayBuffer = global.ArrayBuffer
  Int8Array = global.Int8Array
  Uint8Array = global.Uint8Array
  Uint8ClampedArray = global.Uint8ClampedArray
  Int16Array = global.Int16Array
  Uint16Array = global.Uint16Array
  Int32Array = global.Int32Array
  Uint32Array = global.Uint32Array
  Float32Array = global.Float32Array
  Float64Array = global.Float64Array
  BigInt64Array = global.BigInt64Array
  BigUint64Array = global.BigUint64Array
};


(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // vue-ns:vue
  var require_vue = __commonJS({
    "vue-ns:vue"(exports, module) {
      module.exports = Vue;
    }
  });

  // E:/代码/new/zk_uniapp/unpackage/dist/dev/.nvue/pages/task/task_detail/baidu_map/subnvue/condition_icons.js
  var import_vue = __toESM(require_vue());
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  var _imports_0 = "/static/icon/alert.png";
  var _imports_1 = "/static/icon/flag.png";
  var _imports_2 = "/static/icon/document.png";
  var _imports_3 = "/static/icon/tuceng.png";
  var _imports_4 = "/static/icon/close.png";
  var _imports_5 = "/static/icon/video.png";
  var _imports_6 = "/static/icon/photo.png";
  var _imports_7 = "/static/icon/micro.png";
  var _imports_8 = "/static/icon/delete.png";
  var _style_0 = { "layout_task_detail": { "": { "zIndex": 20 } }, "condition_icons": { "": { "display": "flex", "justifyContent": "space-between", "zIndex": 100, "position": "absolute", "left": 0, "width": 100 } }, "condition_selector": { ".condition_icons ": { "width": 70, "height": 35, "backgroundColor": "#f9f9f9", "display": "flex", "justifyContent": "center", "alignItems": "center", "marginTop": 15, "marginRight": 15, "marginBottom": 15, "marginLeft": 15 } }, "right-button-groups": { ".condition_icons ": { "marginTop": 15, "marginRight": 15, "marginBottom": 15, "marginLeft": 15 } }, "instructions_alert": { "": { "width": 50, "height": 50, "backgroundColor": "#f9f9f9", "boxShadow": "2px 4px 4px rgba(0, 0, 0, 0.2)", "borderRadius": 3, "marginBottom": 10 } }, "instructions_instruct": { "": { "width": 50, "height": 50, "backgroundColor": "#f9f9f9", "boxShadow": "2px 4px 4px rgba(0, 0, 0, 0.2)", "borderRadius": 3, "marginBottom": 10 } }, "instructions_document": { "": { "width": 50, "height": 100, "backgroundColor": "#f9f9f9", "boxShadow": "2px 4px 4px rgba(0, 0, 0, 0.2)", "borderRadius": 3, "marginBottom": 10 } }, "text_setting": { "": { "display": "flex", "alignItems": "center", "justifyContent": "center" } }, "divider": { "": { "height": 1, "backgroundColor": "#cccccc", "marginTop": 10, "marginRight": 0, "marginBottom": 10, "marginLeft": 0 } }, "detail_top": { "": { "display": "flex", "justifyContent": "space-between" } }, "detail_info": { "": { "boxSizing": "border-box", "width": 100, "paddingTop": 10, "paddingRight": 10, "paddingBottom": 10, "paddingLeft": 10, "backgroundColor": "#edf2fa" } }, "infos": { "": { "marginBottom": 5 } }, "map_icons": { "": { "display": "flex", "alignItems": "center", "justifyContent": "center" } }, "selected": { "": { "borderWidth": 2, "borderStyle": "solid", "borderColor": "#288ff4" } }, "head-nav": { "": { "display": "flex", "alignItems": "center", "color": "#CCCCCC", "height": 40 } }, "activite": { "": { "color": "#04c9c3" } }, "alert_content": { "": { "height": 100 } } };
  var _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  var _sfc_main = {
    data() {
      return {
        recorderManager: {},
        innerAudioContext: {},
        selectedIndex: 0,
        // 地图默认选择0：Google地图
        navIndex: 0,
        filePaths: {
          imgPath: "",
          videoPath: "",
          voicePath: ""
        },
        range: [
          {
            value: "1",
            text: "\u672A\u5F00\u59CB"
          },
          {
            value: "2",
            text: "\u8FDB\u884C\u4E2D"
          },
          {
            value: "3",
            text: "\u5DF2\u5B8C\u6210"
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
            text: "\u4E00\u822C\u544A\u8B66",
            value: "\u4E00\u822C\u544A\u8B66"
          },
          {
            text: "\u4E25\u91CD\u544A\u8B66",
            value: "\u4E25\u91CD\u544A\u8B66"
          },
          {
            text: "\u7D27\u6025\u544A\u8B66",
            value: "\u7D27\u6025\u544A\u8B66"
          }
        ],
        // task:{
        //                 task_name: '现地侦察横须滨基地情况',
        // 	country: '日本',
        //                 position: '横须滨',
        //                 start_time: '2024.05.03',
        //                 end_time: '2026.02.01',
        //                 type: '进行中',
        //                 status: '待处理',
        // 	description: '前往目的地展开行动',
        // 	key: '123456'
        //             },
        taskItem: {},
        map_options: [
          {
            src: "/static/icon/google.png",
            htmlSrc: "/static/html/map_gaode.html",
            name: "Google\u5730\u56FE"
          },
          {
            src: "/static/icon/gaode.png",
            htmlSrc: "/static/html/map_gaode.html",
            name: "\u9AD8\u5FB7\u5730\u56FE"
          },
          {
            src: "/static/icon/baidu.png",
            htmlSrc: "/static/html/map_baidu.html",
            name: "\u767E\u5EA6\u5730\u56FE"
          },
          {
            src: "/static/icon/outline.png",
            htmlSrc: "/static/html/map_gaode.html",
            name: "\u79BB\u7EBF\u5730\u56FE"
          }
          // 继续添加更多图片
        ],
        task_instructions: [
          {
            src: "/static/uni.png",
            sender_name: "admin",
            detail: "\u7ACB\u5373\u524D\u5F80\u6267\u884C\u6293\u6355\u4EFB\u52A1",
            isConfirmed: false
          },
          {
            src: "/static/uni.png",
            sender_name: "lihua",
            detail: "\u7ACB\u5373\u524D\u5F80\u6267\u884C\u6293\u6355\u4EFB\u52A1",
            isConfirmed: false
          },
          {
            src: "/static/uni.png",
            sender_name: "wanghao",
            detail: "\u7ACB\u5373\u524D\u5F80\u6267\u884C\u6293\u6355\u4EFB\u52A1",
            isConfirmed: false
          }
        ],
        alert_data: [
          {
            alert_grade: "\u91CD\u8981\u544A\u8B66",
            alert_time: "2024.5.1",
            sender_name: "\u5F20\u4E09",
            alert_content: "\u9760\u8FD1\u76EE\u6807\uFF0C\u5F00\u59CB\u884C\u52A8\uFF011",
            isConfirmed: false
          },
          {
            alert_grade: "\u4E00\u822C\u544A\u8B66",
            alert_time: "2024.2.6",
            sender_name: "\u674E\u56DB",
            alert_content: "\u9760\u8FD1\u76EE\u6807\uFF0C\u5F00\u59CB\u884C\u52A8\uFF012",
            isConfirmed: false
          },
          {
            alert_grade: "\u91CD\u8981\u544A\u8B66",
            alert_time: "2024.1.3",
            sender_name: "\u5F20\u4E09",
            alert_content: "\u9760\u8FD1\u76EE\u6807\uFF0C\u5F00\u59CB\u884C\u52A8\uFF013",
            isConfirmed: false
          },
          {
            alert_grade: "\u4E25\u91CD\u544A\u8B66",
            alert_time: "2024.7.9",
            sender_name: "\u5F20\u4E09",
            alert_content: "\u9760\u8FD1\u76EE\u6807\uFF0C\u5F00\u59CB\u884C\u52A8\uFF014",
            isConfirmed: false
          }
        ],
        alert_data_mine: [
          {
            alert_grade: "\u4E00\u822C\u544A\u8B66",
            alert_time: "2024.5.1",
            sender_name: "\u5F20\u4E09",
            alert_content: "\u76EE\u6807\u89C6\u91CE\u4E22\u5931"
          },
          {
            alert_grade: "\u4E00\u822C\u544A\u8B66",
            alert_time: "2024.2.6",
            sender_name: "\u674E\u56DB",
            alert_content: "\u53D1\u73B0\u5ACC\u7591\u4EBA"
          },
          {
            alert_grade: "\u91CD\u8981\u544A\u8B66",
            alert_time: "2024.1.3",
            sender_name: "\u5F20\u4E09",
            alert_content: "\u884C\u52A8\u6682\u505C"
          },
          {
            alert_grade: "\u4E25\u91CD\u544A\u8B66",
            alert_time: "2024.7.9",
            sender_name: "\u5F20\u4E09",
            alert_content: "\u884C\u52A8\u7EE7\u7EED"
          }
        ],
        map: null
      };
    },
    onNavigationBarButtonTap() {
      this.$refs.popup.open("bottom");
    },
    onLoad(options) {
      if (options.taskItem) {
        this.taskItem = JSON.parse(options.taskItem);
        formatAppLog("log", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:359", this.task);
      } else {
        formatAppLog("error", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:361", "\u6CA1\u6709\u4F20\u9012\u7C7B\u578B\u53C2\u6570");
      }
      this.recorderManager = uni.getRecorderManager();
      this.innerAudioContext = uni.createInnerAudioContext();
      this.innerAudioContext.autoplay = true;
      formatAppLog("log", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:369", "uni.getRecorderManager()", uni.getRecorderManager());
      let self = this;
      this.recorderManager.onStop(function(res) {
        formatAppLog("log", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:372", "recorder stop" + JSON.stringify(res));
        self.filePaths.voicePath = res.tempFilePath;
      });
    },
    methods: {
      take_picture() {
        uni.chooseimg({
          count: 1,
          // 默认选择一张图片
          sourceType: ["camera"],
          // 只允许从相机拍照
          success: function(res) {
            const tempFilePath = res.tempFilePaths[0];
            formatAppLog("log", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:386", "\u62CD\u7167\u6210\u529F\uFF0C\u6587\u4EF6\u8DEF\u5F84\uFF1A", tempFilePath);
            uni.predivimg({
              urls: [tempFilePath]
            });
          },
          fail: function(err) {
            formatAppLog("error", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:394", "\u62CD\u7167\u5931\u8D25\uFF1A", err);
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
            formatAppLog("log", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:409", "\u5F55\u50CF\u6210\u529F\uFF0C\u6587\u4EF6\u8DEF\u5F84\uFF1A", tempFilePath);
          },
          fail: function(err) {
            formatAppLog("error", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:412", "\u5F55\u50CF\u5931\u8D25\uFF1A", err);
          }
        });
      },
      startRecording() {
        formatAppLog("log", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:417", "\u5F00\u59CB\u5F55\u97F3");
        this.recorderManager.start();
        uni.showLoading({
          title: "\u6B63\u5728\u5F55\u97F3"
        });
      },
      stopRecording() {
        formatAppLog("log", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:426", "\u5F55\u97F3\u7ED3\u675F");
        this.recorderManager.stop();
        uni.hideLoading();
      },
      playVoice() {
        formatAppLog("log", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:431", "\u64AD\u653E\u5F55\u97F3");
        formatAppLog("log", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:432", "this.voicePath", this.filePaths.voicePath);
        if (this.filePaths.voicePath) {
          this.innerAudioContext.src = this.filePaths.voicePath;
          this.innerAudioContext.play();
        }
      },
      checkIndex(index) {
        formatAppLog("log", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:439", index);
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
      selectimg(index) {
        this.selectedIndex = index;
        this.changeMap(index);
        this.$refs.map_selector.close();
      },
      receive_instruction(index) {
        this.task_instructions[index].isConfirmed = true;
      },
      receive_alert(index) {
        this.alert_data[index].isConfirmed = true;
      },
      isReceived(index) {
        return this.task_instructions[index].isConfirmed ? "\u5DF2\u6536\u5230" : "\u6536\u5230";
      },
      isReceived_alert(index) {
        return this.alert_data[index].isConfirmed ? "\u5DF2\u786E\u8BA4" : "\u786E\u8BA4";
      },
      submit(ref) {
        this.$refs[ref].validate().then((res) => {
          formatAppLog("log", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:508", "success", res);
          uni.showToast({
            title: `\u53D1\u5E03\u6210\u529F`
          });
        }).catch((err) => {
          formatAppLog("log", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:513", "err", err);
        });
        const now = /* @__PURE__ */ new Date();
        const formattedDateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
        formatAppLog("log", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:521", formattedDateTime);
        this.alert_form_data.alert_time = formattedDateTime;
        this.alert_form_data.sender_name = "lihua";
        this.alert_data.push(this.alert_form_data);
        this.alert_data_mine.push(this.alert_form_data);
        this.$refs.alert_form_popup.close();
      },
      changeMap(mapType) {
        switch (mapType) {
          case 0:
          case 1:
            window.map = new AMap.Map("map_container", {
              divMode: "2D",
              // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 divMode: '3D'
              zoom: 12,
              // 初始化地图层级
              center: [116.397428, 39.90923]
              // 初始化地图中心点
            });
            break;
          case 2:
            map = new BMapGL.Map("map_container");
            map.centerAndZoom(new BMapGL.Point(120.68625, 24.18222), 12);
            map.enableScrollWheelZoom(true);
            window.map = map;
            break;
        }
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_button = (0, import_vue.resolveComponent)("button");
    return (0, import_vue.openBlock)(), (0, import_vue.createElementBlock)("scroll-view", {
      scrollY: true,
      showScrollbar: true,
      enableBackToTop: true,
      bubble: "true",
      style: { flexDirection: "column" }
    }, [
      (0, import_vue.createCommentVNode)(" task_detail "),
      (0, import_vue.createElementVNode)("div", { class: "layout_task_detail" }, [
        (0, import_vue.createCommentVNode)(" \u6309\u94AE\u7EC4 "),
        (0, import_vue.createElementVNode)("div", { class: "condition_icons" }, [
          (0, import_vue.createCommentVNode)(" \u5DE6\u4FA7-\u9009\u62E9\u4EFB\u52A1\u72B6\u6001\u6309\u94AE "),
          (0, import_vue.createElementVNode)("div", { class: "condition_selector" }),
          (0, import_vue.createCommentVNode)(" \u53F3\u4FA7\u6309\u94AE\u7EC4 "),
          (0, import_vue.createElementVNode)("div", { class: "right-button-groups" }, [
            (0, import_vue.createCommentVNode)(" \u544A\u8B66\u6309\u94AE "),
            (0, import_vue.createElementVNode)("div", {
              class: "instructions_alert",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.open_alert_popup && $options.open_alert_popup(...args))
            }, [
              (0, import_vue.createElementVNode)("div", {
                class: "alert_img",
                style: { "text-align": "center", "padding-top": "5px" }
              }, [
                (0, import_vue.createElementVNode)("img", {
                  src: _imports_0,
                  style: { "width": "22px", "height": "22px" }
                })
              ]),
              (0, import_vue.createElementVNode)("div", {
                class: "text_setting",
                style: { "text-align": "center" }
              }, [
                (0, import_vue.createElementVNode)("u-text", { style: { "color": "#d81e06", "font-size": "small" } }, "\u544A\u8B66")
              ])
            ]),
            (0, import_vue.createCommentVNode)(" \u6307\u4EE4\u6309\u94AE "),
            (0, import_vue.createElementVNode)("div", {
              class: "instructions_instruct",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.open_task_instructions && $options.open_task_instructions(...args))
            }, [
              (0, import_vue.createElementVNode)("div", {
                class: "alert_img",
                style: { "text-align": "center", "padding-top": "5px" }
              }, [
                (0, import_vue.createElementVNode)("img", {
                  src: _imports_1,
                  style: { "width": "22px", "height": "22px" }
                })
              ]),
              (0, import_vue.createElementVNode)("div", {
                class: "text_setting",
                style: { "text-align": "center" }
              }, [
                (0, import_vue.createElementVNode)("u-text", { style: { "color": "#3171d3", "font-size": "small" } }, "\u6307\u4EE4")
              ])
            ]),
            (0, import_vue.createCommentVNode)(" \u6587\u4EF6\u6309\u94AE+\u56FE\u5C42\u6309\u94AE "),
            (0, import_vue.createElementVNode)("div", { class: "instructions_document" }, [
              (0, import_vue.createCommentVNode)(" \u6587\u4EF6\u6309\u94AE "),
              (0, import_vue.createElementVNode)("div", {
                class: "document",
                onClick: _cache[2] || (_cache[2] = (...args) => $options.goToDocument && $options.goToDocument(...args))
              }, [
                (0, import_vue.createElementVNode)("div", {
                  class: "alert_img",
                  style: { "text-align": "center", "padding-top": "5px" }
                }, [
                  (0, import_vue.createElementVNode)("img", {
                    src: _imports_2,
                    style: { "width": "22px", "height": "22px" }
                  })
                ]),
                (0, import_vue.createElementVNode)("div", {
                  class: "text_setting",
                  style: { "text-align": "center" }
                }, [
                  (0, import_vue.createElementVNode)("u-text", { style: { "color": "#636363", "font-size": "small" } }, "\u6587\u4EF6")
                ])
              ]),
              (0, import_vue.createCommentVNode)(" \u56FE\u5C42\u6309\u94AE "),
              (0, import_vue.createElementVNode)("div", {
                class: "map_selector",
                onClick: _cache[3] || (_cache[3] = (...args) => $options.open_map_selector && $options.open_map_selector(...args))
              }, [
                (0, import_vue.createElementVNode)("div", {
                  class: "alert_img",
                  style: { "text-align": "center", "padding-top": "5px" }
                }, [
                  (0, import_vue.createElementVNode)("img", {
                    src: _imports_3,
                    style: { "width": "22px", "height": "22px" }
                  })
                ]),
                (0, import_vue.createElementVNode)("div", {
                  class: "text_setting",
                  style: { "text-align": "center" }
                }, [
                  (0, import_vue.createElementVNode)("u-text", { style: { "color": "#636363", "font-size": "small" } }, "\u56FE\u5C42")
                ])
              ])
            ])
          ])
        ]),
        (0, import_vue.createCommentVNode)(" \u8BE6\u60C5\u754C\u9762\u5F39\u7A97 "),
        (0, import_vue.createElementVNode)("div", null, [
          (0, import_vue.createElementVNode)(
            "div",
            {
              ref: "popup",
              type: "bottom",
              backgroundColor: "#fff",
              maskClick: false
            },
            [
              (0, import_vue.createElementVNode)("div", {
                class: "detail",
                style: { "padding": "15px" }
              }, [
                (0, import_vue.createElementVNode)("div", { class: "detail_top" }, [
                  (0, import_vue.createElementVNode)("div", null, [
                    (0, import_vue.createElementVNode)("u-text", null, "\u73B0\u5730\u4FA6\u67E5\u6A2A\u987B\u8D3A\u57FA\u5730\u60C5\u51B5")
                  ]),
                  (0, import_vue.createElementVNode)("div", {
                    style: { "margin-right": "10px" },
                    onClick: _cache[4] || (_cache[4] = (...args) => $options.close && $options.close(...args))
                  }, [
                    (0, import_vue.createElementVNode)("img", {
                      src: _imports_4,
                      style: { "width": "15px", "height": "15px" }
                    })
                  ])
                ]),
                (0, import_vue.createElementVNode)("div", { class: "divider" }),
                (0, import_vue.createElementVNode)("div", { class: "detail_info" }, [
                  (0, import_vue.createElementVNode)("div", { class: "infos" }, [
                    (0, import_vue.createElementVNode)(
                      "u-text",
                      null,
                      "\u4EFB\u52A1\u540D\u79F0: " + (0, import_vue.toDisplayString)($data.taskItem.task_name),
                      1
                      /* TEXT */
                    )
                  ]),
                  (0, import_vue.createElementVNode)("div", { class: "infos" }, [
                    (0, import_vue.createElementVNode)(
                      "u-text",
                      null,
                      "\u4EFB\u52A1\u63CF\u8FF0: " + (0, import_vue.toDisplayString)($data.taskItem.description),
                      1
                      /* TEXT */
                    )
                  ]),
                  (0, import_vue.createElementVNode)("div", { class: "infos" }, [
                    (0, import_vue.createElementVNode)(
                      "u-text",
                      null,
                      "\u4EFB\u52A1\u56FD\u5BB6: " + (0, import_vue.toDisplayString)($data.taskItem.country),
                      1
                      /* TEXT */
                    )
                  ]),
                  (0, import_vue.createElementVNode)("div", { class: "infos" }, [
                    (0, import_vue.createElementVNode)(
                      "u-text",
                      null,
                      "\u4EFB\u52A1\u5730\u70B9: " + (0, import_vue.toDisplayString)($data.taskItem.position),
                      1
                      /* TEXT */
                    )
                  ]),
                  (0, import_vue.createElementVNode)("div", { class: "infos" }, [
                    (0, import_vue.createElementVNode)(
                      "u-text",
                      null,
                      "\u4EFB\u52A1\u65F6\u95F4: " + (0, import_vue.toDisplayString)($data.taskItem.start_time) + " - " + (0, import_vue.toDisplayString)($data.taskItem.end_time),
                      1
                      /* TEXT */
                    )
                  ]),
                  (0, import_vue.createElementVNode)("div", { class: "infos" }, [
                    (0, import_vue.createElementVNode)(
                      "u-text",
                      null,
                      "\u4EFB\u52A1\u53E3\u4EE4: " + (0, import_vue.toDisplayString)($data.taskItem.key),
                      1
                      /* TEXT */
                    )
                  ])
                ]),
                (0, import_vue.createElementVNode)("div", { class: "divider" }),
                (0, import_vue.createElementVNode)("div", { class: "text_setting" }, [
                  (0, import_vue.createElementVNode)("div", { style: { "margin-right": "50px" } }, [
                    (0, import_vue.createElementVNode)("img", {
                      onClick: _cache[5] || (_cache[5] = ($event) => $options.take_video()),
                      src: _imports_5,
                      style: { "width": "30px", "height": "30px" }
                    })
                  ]),
                  (0, import_vue.createElementVNode)("div", { style: { "margin-right": "50px" } }, [
                    (0, import_vue.createElementVNode)("img", {
                      onClick: _cache[6] || (_cache[6] = ($event) => $options.take_picture()),
                      src: _imports_6,
                      style: { "width": "33px", "height": "33px" }
                    })
                  ]),
                  (0, import_vue.createElementVNode)("div", { style: { "margin-right": "50px" } }, [
                    (0, import_vue.createElementVNode)(
                      "img",
                      {
                        onLongpress: _cache[7] || (_cache[7] = ($event) => $options.startRecording()),
                        onTouchend: _cache[8] || (_cache[8] = ($event) => $options.stopRecording()),
                        src: _imports_7,
                        style: { "width": "32px", "height": "32px" }
                      },
                      null,
                      32
                      /* NEED_HYDRATION */
                    )
                  ]),
                  (0, import_vue.createElementVNode)("div", null, [
                    (0, import_vue.createElementVNode)("img", {
                      src: _imports_8,
                      style: { "width": "28px", "height": "28px" }
                    })
                  ])
                ])
              ])
            ],
            512
            /* NEED_PATCH */
          )
        ]),
        (0, import_vue.createCommentVNode)(" \u56FE\u5C42\u5F39\u7A97 "),
        (0, import_vue.createElementVNode)("div", null, [
          (0, import_vue.createElementVNode)(
            "div",
            {
              ref: "map_selector",
              type: "bottom",
              backgroundColor: "#fff",
              maskClick: false
            },
            [
              (0, import_vue.createElementVNode)("div", {
                class: "detail",
                style: { "padding": "15px" }
              }, [
                (0, import_vue.createElementVNode)("div", { class: "detail_top" }, [
                  (0, import_vue.createElementVNode)("div", null, [
                    (0, import_vue.createElementVNode)("u-text", null, "\u56FE\u5C42\u5207\u6362")
                  ]),
                  (0, import_vue.createElementVNode)("div", {
                    style: { "margin-right": "10px" },
                    onClick: _cache[9] || (_cache[9] = (...args) => $options.close_map_selector && $options.close_map_selector(...args))
                  }, [
                    (0, import_vue.createElementVNode)("img", {
                      src: _imports_4,
                      style: { "width": "15px", "height": "15px" }
                    })
                  ])
                ]),
                (0, import_vue.createElementVNode)("div", { class: "divider" }),
                (0, import_vue.createElementVNode)("div", { style: { "margin-top": "20px" } }, [
                  (0, import_vue.createElementVNode)("div", { class: "map_icons" }, [
                    ((0, import_vue.openBlock)(true), (0, import_vue.createElementBlock)(
                      import_vue.Fragment,
                      null,
                      (0, import_vue.renderList)($data.map_options, (item, index) => {
                        return (0, import_vue.openBlock)(), (0, import_vue.createElementBlock)("div", { key: index }, [
                          (0, import_vue.createElementVNode)("div", {
                            class: "map_icon",
                            style: { "margin": "0 15px" }
                          }, [
                            (0, import_vue.createElementVNode)("img", {
                              class: (0, import_vue.normalizeClass)({ "selected": $data.selectedIndex === index }),
                              onClick: ($event) => $options.selectimg(index),
                              src: item.src,
                              style: { "width": "55px", "height": "55px", "border-radius": "15px" }
                            }, null, 10, ["onClick", "src"])
                          ]),
                          (0, import_vue.createElementVNode)("div", { style: { "text-align": "center" } }, [
                            (0, import_vue.createElementVNode)(
                              "u-text",
                              null,
                              (0, import_vue.toDisplayString)(item.name),
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
            ],
            512
            /* NEED_PATCH */
          )
        ]),
        (0, import_vue.createCommentVNode)(" \u4EFB\u52A1\u6307\u4EE4\u5F39\u7A97 "),
        (0, import_vue.createElementVNode)("div", null, [
          (0, import_vue.createElementVNode)(
            "div",
            {
              ref: "task_instructions",
              type: "bottom",
              backgroundColor: "#fff",
              maskClick: false
            },
            [
              (0, import_vue.createElementVNode)("div", {
                class: "detail",
                style: { "padding": "15px" }
              }, [
                (0, import_vue.createElementVNode)("div", { class: "detail_top" }, [
                  (0, import_vue.createElementVNode)("div", null, [
                    (0, import_vue.createElementVNode)("u-text", null, "\u4EFB\u52A1\u6307\u4EE4")
                  ]),
                  (0, import_vue.createElementVNode)("div", {
                    style: { "margin-right": "10px" },
                    onClick: _cache[10] || (_cache[10] = (...args) => $options.close_task_instructions && $options.close_task_instructions(...args))
                  }, [
                    (0, import_vue.createElementVNode)("img", {
                      src: _imports_4,
                      style: { "width": "15px", "height": "15px" }
                    })
                  ])
                ]),
                (0, import_vue.createElementVNode)("div", { class: "divider" }),
                (0, import_vue.createElementVNode)("div", { style: { "margin-top": "20px" } }, [
                  (0, import_vue.createElementVNode)("div", { class: "instructions" }, [
                    ((0, import_vue.openBlock)(true), (0, import_vue.createElementBlock)(
                      import_vue.Fragment,
                      null,
                      (0, import_vue.renderList)($data.task_instructions, (item, index) => {
                        return (0, import_vue.openBlock)(), (0, import_vue.createElementBlock)("div", {
                          key: index,
                          class: "instructions_item",
                          style: { "display": "flex", "justify-content": "space-between", "align-items": "center", "margin-bottom": "20px" }
                        }, [
                          (0, import_vue.createElementVNode)("div", { style: { "display": "flex" } }, [
                            (0, import_vue.createElementVNode)("div", { style: { "margin-right": "10px" } }, [
                              (0, import_vue.createElementVNode)("img", {
                                src: item.src,
                                style: { "width": "45px", "height": "45px" }
                              }, null, 8, ["src"])
                            ]),
                            (0, import_vue.createElementVNode)("div", null, [
                              (0, import_vue.createElementVNode)("div", null, [
                                (0, import_vue.createElementVNode)(
                                  "u-text",
                                  null,
                                  (0, import_vue.toDisplayString)(item.sender_name),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              (0, import_vue.createElementVNode)("div", null, [
                                (0, import_vue.createElementVNode)(
                                  "u-text",
                                  { style: { "color": "#858585" } },
                                  (0, import_vue.toDisplayString)(item.detail),
                                  1
                                  /* TEXT */
                                )
                              ])
                            ])
                          ]),
                          (0, import_vue.createElementVNode)("div", null, [
                            (0, import_vue.createVNode)(_component_button, {
                              onClick: ($event) => $options.receive_instruction(index),
                              disabled: item.isConfirmed,
                              class: "mini-btn",
                              type: "primary",
                              size: "mini"
                            }, {
                              default: (0, import_vue.withCtx)(() => [
                                (0, import_vue.createTextVNode)(
                                  (0, import_vue.toDisplayString)($options.isReceived(index)),
                                  1
                                  /* TEXT */
                                )
                              ]),
                              _: 2
                              /* DYNAMIC */
                            }, 1032, ["onClick", "disabled"])
                          ])
                        ]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])
                ])
              ])
            ],
            512
            /* NEED_PATCH */
          )
        ]),
        (0, import_vue.createCommentVNode)(" \u544A\u8B66\u5F39\u7A97 "),
        (0, import_vue.createElementVNode)("div", null, [
          (0, import_vue.createElementVNode)(
            "div",
            {
              ref: "alert_popup",
              type: "bottom",
              backgroundColor: "#fff"
            },
            [
              (0, import_vue.createElementVNode)("div", { style: { "padding": "15px" } }, [
                (0, import_vue.createElementVNode)("div", { class: "detail" }, [
                  (0, import_vue.createElementVNode)("div", { class: "detail_top" }, [
                    (0, import_vue.createElementVNode)("div", null, [
                      (0, import_vue.createElementVNode)("u-text", null, "\u544A\u8B66\u5217\u8868")
                    ]),
                    (0, import_vue.createElementVNode)("div", {
                      style: { "margin-right": "10px" },
                      onClick: _cache[11] || (_cache[11] = (...args) => $options.close_alert_popup && $options.close_alert_popup(...args))
                    }, [
                      (0, import_vue.createElementVNode)("img", {
                        src: _imports_4,
                        style: { "width": "15px", "height": "15px" }
                      })
                    ])
                  ]),
                  (0, import_vue.createElementVNode)("div", { class: "divider" })
                ]),
                (0, import_vue.createElementVNode)("div", null, [
                  (0, import_vue.createElementVNode)("div", { class: "head-nav" }, [
                    (0, import_vue.createElementVNode)(
                      "div",
                      {
                        class: (0, import_vue.normalizeClass)($data.navIndex == 0 ? "activite" : ""),
                        onClick: _cache[12] || (_cache[12] = ($event) => $options.checkIndex(0)),
                        style: { "width": "50%", "text-align": "center" }
                      },
                      [
                        (0, import_vue.createElementVNode)("u-text", null, "\u63A5\u6536")
                      ],
                      2
                      /* CLASS */
                    ),
                    (0, import_vue.createElementVNode)(
                      "div",
                      {
                        class: (0, import_vue.normalizeClass)($data.navIndex == 1 ? "activite" : ""),
                        onClick: _cache[13] || (_cache[13] = ($event) => $options.checkIndex(1)),
                        style: { "width": "50%", "text-align": "center" }
                      },
                      [
                        (0, import_vue.createElementVNode)("u-text", null, "\u53D1\u9001")
                      ],
                      2
                      /* CLASS */
                    )
                  ]),
                  (0, import_vue.createCommentVNode)(" \u5185\u5BB9\u5207\u6362 "),
                  $data.navIndex == 0 ? ((0, import_vue.openBlock)(), (0, import_vue.createElementBlock)("div", {
                    key: 0,
                    class: "alert_content"
                  })) : (0, import_vue.createCommentVNode)("v-if", true),
                  $data.navIndex == 1 ? ((0, import_vue.openBlock)(), (0, import_vue.createElementBlock)("div", {
                    key: 1,
                    class: "content"
                  }, [
                    (0, import_vue.createElementVNode)("div", null, [
                      (0, import_vue.createVNode)(_component_button, {
                        type: "primary",
                        onClick: $options.open_alert_form
                      }, {
                        default: (0, import_vue.withCtx)(() => [
                          (0, import_vue.createTextVNode)("\u53D1\u5E03\u544A\u8B66")
                        ]),
                        _: 1
                        /* STABLE */
                      }, 8, ["onClick"])
                    ])
                  ])) : (0, import_vue.createCommentVNode)("v-if", true)
                ])
              ])
            ],
            512
            /* NEED_PATCH */
          )
        ]),
        (0, import_vue.createElementVNode)("div", null, [
          (0, import_vue.createElementVNode)(
            "div",
            {
              ref: "alert_form_popup",
              type: "dialog"
            },
            [
              (0, import_vue.createElementVNode)("div", {
                class: "example",
                style: { "background": "#fff", "border-radius": "5px", "padding": "10px" }
              }, [
                (0, import_vue.createElementVNode)("div", { class: "detail_top" }, [
                  (0, import_vue.createElementVNode)("div", null, [
                    (0, import_vue.createElementVNode)("u-text", null, "\u53D1\u5E03\u544A\u8B66")
                  ]),
                  (0, import_vue.createElementVNode)("div", {
                    style: { "margin-right": "10px" },
                    onClick: _cache[14] || (_cache[14] = (...args) => $options.close_alert_form && $options.close_alert_form(...args))
                  }, [
                    (0, import_vue.createElementVNode)("img", {
                      src: _imports_4,
                      style: { "width": "15px", "height": "15px" }
                    })
                  ])
                ]),
                (0, import_vue.createElementVNode)("div", { class: "divider" }),
                (0, import_vue.createVNode)(_component_button, {
                  type: "primary",
                  onClick: _cache[15] || (_cache[15] = ($event) => $options.submit("alert_form"))
                }, {
                  default: (0, import_vue.withCtx)(() => [
                    (0, import_vue.createTextVNode)("\u63D0\u4EA4")
                  ]),
                  _: 1
                  /* STABLE */
                })
              ])
            ],
            512
            /* NEED_PATCH */
          )
        ])
      ])
    ]);
  }
  var condition_icons = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]], ["__file", "E:/\u4EE3\u7801/new/zk_uniapp/pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue"]]);

  // <stdin>
  var webview = plus.webview.currentWebview();
  if (webview) {
    const __pageId = parseInt(webview.id);
    const __pagePath = "pages/task/task_detail/baidu_map/subnvue/condition_icons";
    let __pageQuery = {};
    try {
      __pageQuery = JSON.parse(webview.__query__);
    } catch (e) {
    }
    condition_icons.mpType = "page";
    const app = Vue.createPageApp(condition_icons, { $store: getApp({ allowDefault: true }).$store, __pageId, __pagePath, __pageQuery });
    app.provide("__globalStyles", Vue.useCssStyles([...__uniConfig.styles, ...condition_icons.styles || []]));
    app.mount("#root");
  }
})();
