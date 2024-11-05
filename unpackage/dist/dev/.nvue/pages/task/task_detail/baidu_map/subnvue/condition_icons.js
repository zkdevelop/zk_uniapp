import { resolveComponent, openBlock, createElementBlock, createCommentVNode, createElementVNode, toDisplayString, Fragment, renderList, normalizeClass, createVNode, withCtx, createTextVNode } from "vue";
function formatAppLog(type, filename, ...args) {
  if (uni.__log__) {
    uni.__log__(type, filename, ...args);
  } else {
    console[type].apply(console, [...args, filename]);
  }
}
const _imports_0 = "/static/icon/alert.png";
const _imports_1 = "/static/icon/flag.png";
const _imports_2 = "/static/icon/document.png";
const _imports_3 = "/static/icon/tuceng.png";
const _imports_4 = "/static/icon/close.png";
const _imports_5 = "/static/icon/video.png";
const _imports_6 = "/static/icon/photo.png";
const _imports_7 = "/static/icon/micro.png";
const _imports_8 = "/static/icon/delete.png";
const _style_0 = { "layout_task_detail": { "": { "zIndex": 20 } }, "condition_icons": { "": { "display": "flex", "justifyContent": "space-between", "zIndex": 100, "position": "absolute", "left": 0, "width": 100 } }, "condition_selector": { ".condition_icons ": { "width": 70, "height": 35, "backgroundColor": "#f9f9f9", "display": "flex", "justifyContent": "center", "alignItems": "center", "marginTop": 15, "marginRight": 15, "marginBottom": 15, "marginLeft": 15 } }, "right-button-groups": { ".condition_icons ": { "marginTop": 15, "marginRight": 15, "marginBottom": 15, "marginLeft": 15 } }, "instructions_alert": { "": { "width": 50, "height": 50, "backgroundColor": "#f9f9f9", "boxShadow": "2px 4px 4px rgba(0, 0, 0, 0.2)", "borderRadius": 3, "marginBottom": 10 } }, "instructions_instruct": { "": { "width": 50, "height": 50, "backgroundColor": "#f9f9f9", "boxShadow": "2px 4px 4px rgba(0, 0, 0, 0.2)", "borderRadius": 3, "marginBottom": 10 } }, "instructions_document": { "": { "width": 50, "height": 100, "backgroundColor": "#f9f9f9", "boxShadow": "2px 4px 4px rgba(0, 0, 0, 0.2)", "borderRadius": 3, "marginBottom": 10 } }, "text_setting": { "": { "display": "flex", "alignItems": "center", "justifyContent": "center" } }, "divider": { "": { "height": 1, "backgroundColor": "#cccccc", "marginTop": 10, "marginRight": 0, "marginBottom": 10, "marginLeft": 0 } }, "detail_top": { "": { "display": "flex", "justifyContent": "space-between" } }, "detail_info": { "": { "boxSizing": "border-box", "width": 100, "paddingTop": 10, "paddingRight": 10, "paddingBottom": 10, "paddingLeft": 10, "backgroundColor": "#edf2fa" } }, "infos": { "": { "marginBottom": 5 } }, "map_icons": { "": { "display": "flex", "alignItems": "center", "justifyContent": "center" } }, "selected": { "": { "borderWidth": 2, "borderStyle": "solid", "borderColor": "#288ff4" } }, "head-nav": { "": { "display": "flex", "alignItems": "center", "color": "#CCCCCC", "height": 40 } }, "activite": { "": { "color": "#04c9c3" } }, "alert_content": { "": { "height": 100 } } };
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main = {
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
          name: "Google地图"
        },
        {
          src: "/static/icon/gaode.png",
          htmlSrc: "/static/html/map_gaode.html",
          name: "高德地图"
        },
        {
          src: "/static/icon/baidu.png",
          htmlSrc: "/static/html/map_baidu.html",
          name: "百度地图"
        },
        {
          src: "/static/icon/outline.png",
          htmlSrc: "/static/html/map_gaode.html",
          name: "离线地图"
        }
        // 继续添加更多图片
      ],
      task_instructions: [
        {
          src: "/static/uni.png",
          sender_name: "admin",
          detail: "立即前往执行抓捕任务",
          isConfirmed: false
        },
        {
          src: "/static/uni.png",
          sender_name: "lihua",
          detail: "立即前往执行抓捕任务",
          isConfirmed: false
        },
        {
          src: "/static/uni.png",
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
      formatAppLog("error", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:361", "没有传递类型参数");
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
          formatAppLog("log", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:386", "拍照成功，文件路径：", tempFilePath);
          uni.predivimg({
            urls: [tempFilePath]
          });
        },
        fail: function(err) {
          formatAppLog("error", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:394", "拍照失败：", err);
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
          formatAppLog("log", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:409", "录像成功，文件路径：", tempFilePath);
        },
        fail: function(err) {
          formatAppLog("error", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:412", "录像失败：", err);
        }
      });
    },
    startRecording() {
      formatAppLog("log", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:417", "开始录音");
      this.recorderManager.start();
      uni.showLoading({
        title: "正在录音"
      });
    },
    stopRecording() {
      formatAppLog("log", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:426", "录音结束");
      this.recorderManager.stop();
      uni.hideLoading();
    },
    playVoice() {
      formatAppLog("log", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:431", "播放录音");
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
      return this.task_instructions[index].isConfirmed ? "已收到" : "收到";
    },
    isReceived_alert(index) {
      return this.alert_data[index].isConfirmed ? "已确认" : "确认";
    },
    submit(ref) {
      this.$refs[ref].validate().then((res) => {
        formatAppLog("log", "at pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue:508", "success", res);
        uni.showToast({
          title: `发布成功`
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
  const _component_button = resolveComponent("button");
  return openBlock(), createElementBlock("scroll-view", {
    scrollY: true,
    showScrollbar: true,
    enableBackToTop: true,
    bubble: "true",
    style: { flexDirection: "column" }
  }, [
    createCommentVNode(" task_detail "),
    createElementVNode("div", { class: "layout_task_detail" }, [
      createCommentVNode(" 按钮组 "),
      createElementVNode("div", { class: "condition_icons" }, [
        createCommentVNode(" 左侧-选择任务状态按钮 "),
        createElementVNode("div", { class: "condition_selector" }),
        createCommentVNode(" 右侧按钮组 "),
        createElementVNode("div", { class: "right-button-groups" }, [
          createCommentVNode(" 告警按钮 "),
          createElementVNode("div", {
            class: "instructions_alert",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.open_alert_popup && $options.open_alert_popup(...args))
          }, [
            createElementVNode("div", {
              class: "alert_img",
              style: { "text-align": "center", "padding-top": "5px" }
            }, [
              createElementVNode("img", {
                src: _imports_0,
                style: { "width": "22px", "height": "22px" }
              })
            ]),
            createElementVNode("div", {
              class: "text_setting",
              style: { "text-align": "center" }
            }, [
              createElementVNode("u-text", { style: { "color": "#d81e06", "font-size": "small" } }, "告警")
            ])
          ]),
          createCommentVNode(" 指令按钮 "),
          createElementVNode("div", {
            class: "instructions_instruct",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.open_task_instructions && $options.open_task_instructions(...args))
          }, [
            createElementVNode("div", {
              class: "alert_img",
              style: { "text-align": "center", "padding-top": "5px" }
            }, [
              createElementVNode("img", {
                src: _imports_1,
                style: { "width": "22px", "height": "22px" }
              })
            ]),
            createElementVNode("div", {
              class: "text_setting",
              style: { "text-align": "center" }
            }, [
              createElementVNode("u-text", { style: { "color": "#3171d3", "font-size": "small" } }, "指令")
            ])
          ]),
          createCommentVNode(" 文件按钮+图层按钮 "),
          createElementVNode("div", { class: "instructions_document" }, [
            createCommentVNode(" 文件按钮 "),
            createElementVNode("div", {
              class: "document",
              onClick: _cache[2] || (_cache[2] = (...args) => $options.goToDocument && $options.goToDocument(...args))
            }, [
              createElementVNode("div", {
                class: "alert_img",
                style: { "text-align": "center", "padding-top": "5px" }
              }, [
                createElementVNode("img", {
                  src: _imports_2,
                  style: { "width": "22px", "height": "22px" }
                })
              ]),
              createElementVNode("div", {
                class: "text_setting",
                style: { "text-align": "center" }
              }, [
                createElementVNode("u-text", { style: { "color": "#636363", "font-size": "small" } }, "文件")
              ])
            ]),
            createCommentVNode(" 图层按钮 "),
            createElementVNode("div", {
              class: "map_selector",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.open_map_selector && $options.open_map_selector(...args))
            }, [
              createElementVNode("div", {
                class: "alert_img",
                style: { "text-align": "center", "padding-top": "5px" }
              }, [
                createElementVNode("img", {
                  src: _imports_3,
                  style: { "width": "22px", "height": "22px" }
                })
              ]),
              createElementVNode("div", {
                class: "text_setting",
                style: { "text-align": "center" }
              }, [
                createElementVNode("u-text", { style: { "color": "#636363", "font-size": "small" } }, "图层")
              ])
            ])
          ])
        ])
      ]),
      createCommentVNode(" 详情界面弹窗 "),
      createElementVNode("div", null, [
        createElementVNode(
          "div",
          {
            ref: "popup",
            type: "bottom",
            backgroundColor: "#fff",
            maskClick: false
          },
          [
            createElementVNode("div", {
              class: "detail",
              style: { "padding": "15px" }
            }, [
              createElementVNode("div", { class: "detail_top" }, [
                createElementVNode("div", null, [
                  createElementVNode("u-text", null, "现地侦查横须贺基地情况")
                ]),
                createElementVNode("div", {
                  style: { "margin-right": "10px" },
                  onClick: _cache[4] || (_cache[4] = (...args) => $options.close && $options.close(...args))
                }, [
                  createElementVNode("img", {
                    src: _imports_4,
                    style: { "width": "15px", "height": "15px" }
                  })
                ])
              ]),
              createElementVNode("div", { class: "divider" }),
              createElementVNode("div", { class: "detail_info" }, [
                createElementVNode("div", { class: "infos" }, [
                  createElementVNode(
                    "u-text",
                    null,
                    "任务名称: " + toDisplayString($data.taskItem.task_name),
                    1
                    /* TEXT */
                  )
                ]),
                createElementVNode("div", { class: "infos" }, [
                  createElementVNode(
                    "u-text",
                    null,
                    "任务描述: " + toDisplayString($data.taskItem.description),
                    1
                    /* TEXT */
                  )
                ]),
                createElementVNode("div", { class: "infos" }, [
                  createElementVNode(
                    "u-text",
                    null,
                    "任务国家: " + toDisplayString($data.taskItem.country),
                    1
                    /* TEXT */
                  )
                ]),
                createElementVNode("div", { class: "infos" }, [
                  createElementVNode(
                    "u-text",
                    null,
                    "任务地点: " + toDisplayString($data.taskItem.position),
                    1
                    /* TEXT */
                  )
                ]),
                createElementVNode("div", { class: "infos" }, [
                  createElementVNode(
                    "u-text",
                    null,
                    "任务时间: " + toDisplayString($data.taskItem.start_time) + " - " + toDisplayString($data.taskItem.end_time),
                    1
                    /* TEXT */
                  )
                ]),
                createElementVNode("div", { class: "infos" }, [
                  createElementVNode(
                    "u-text",
                    null,
                    "任务口令: " + toDisplayString($data.taskItem.key),
                    1
                    /* TEXT */
                  )
                ])
              ]),
              createElementVNode("div", { class: "divider" }),
              createElementVNode("div", { class: "text_setting" }, [
                createElementVNode("div", { style: { "margin-right": "50px" } }, [
                  createElementVNode("img", {
                    onClick: _cache[5] || (_cache[5] = ($event) => $options.take_video()),
                    src: _imports_5,
                    style: { "width": "30px", "height": "30px" }
                  })
                ]),
                createElementVNode("div", { style: { "margin-right": "50px" } }, [
                  createElementVNode("img", {
                    onClick: _cache[6] || (_cache[6] = ($event) => $options.take_picture()),
                    src: _imports_6,
                    style: { "width": "33px", "height": "33px" }
                  })
                ]),
                createElementVNode("div", { style: { "margin-right": "50px" } }, [
                  createElementVNode(
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
                createElementVNode("div", null, [
                  createElementVNode("img", {
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
      createCommentVNode(" 图层弹窗 "),
      createElementVNode("div", null, [
        createElementVNode(
          "div",
          {
            ref: "map_selector",
            type: "bottom",
            backgroundColor: "#fff",
            maskClick: false
          },
          [
            createElementVNode("div", {
              class: "detail",
              style: { "padding": "15px" }
            }, [
              createElementVNode("div", { class: "detail_top" }, [
                createElementVNode("div", null, [
                  createElementVNode("u-text", null, "图层切换")
                ]),
                createElementVNode("div", {
                  style: { "margin-right": "10px" },
                  onClick: _cache[9] || (_cache[9] = (...args) => $options.close_map_selector && $options.close_map_selector(...args))
                }, [
                  createElementVNode("img", {
                    src: _imports_4,
                    style: { "width": "15px", "height": "15px" }
                  })
                ])
              ]),
              createElementVNode("div", { class: "divider" }),
              createElementVNode("div", { style: { "margin-top": "20px" } }, [
                createElementVNode("div", { class: "map_icons" }, [
                  (openBlock(true), createElementBlock(
                    Fragment,
                    null,
                    renderList($data.map_options, (item, index) => {
                      return openBlock(), createElementBlock("div", { key: index }, [
                        createElementVNode("div", {
                          class: "map_icon",
                          style: { "margin": "0 15px" }
                        }, [
                          createElementVNode("img", {
                            class: normalizeClass({ "selected": $data.selectedIndex === index }),
                            onClick: ($event) => $options.selectimg(index),
                            src: item.src,
                            style: { "width": "55px", "height": "55px", "border-radius": "15px" }
                          }, null, 10, ["onClick", "src"])
                        ]),
                        createElementVNode("div", { style: { "text-align": "center" } }, [
                          createElementVNode(
                            "u-text",
                            null,
                            toDisplayString(item.name),
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
      createCommentVNode(" 任务指令弹窗 "),
      createElementVNode("div", null, [
        createElementVNode(
          "div",
          {
            ref: "task_instructions",
            type: "bottom",
            backgroundColor: "#fff",
            maskClick: false
          },
          [
            createElementVNode("div", {
              class: "detail",
              style: { "padding": "15px" }
            }, [
              createElementVNode("div", { class: "detail_top" }, [
                createElementVNode("div", null, [
                  createElementVNode("u-text", null, "任务指令")
                ]),
                createElementVNode("div", {
                  style: { "margin-right": "10px" },
                  onClick: _cache[10] || (_cache[10] = (...args) => $options.close_task_instructions && $options.close_task_instructions(...args))
                }, [
                  createElementVNode("img", {
                    src: _imports_4,
                    style: { "width": "15px", "height": "15px" }
                  })
                ])
              ]),
              createElementVNode("div", { class: "divider" }),
              createElementVNode("div", { style: { "margin-top": "20px" } }, [
                createElementVNode("div", { class: "instructions" }, [
                  (openBlock(true), createElementBlock(
                    Fragment,
                    null,
                    renderList($data.task_instructions, (item, index) => {
                      return openBlock(), createElementBlock("div", {
                        key: index,
                        class: "instructions_item",
                        style: { "display": "flex", "justify-content": "space-between", "align-items": "center", "margin-bottom": "20px" }
                      }, [
                        createElementVNode("div", { style: { "display": "flex" } }, [
                          createElementVNode("div", { style: { "margin-right": "10px" } }, [
                            createElementVNode("img", {
                              src: item.src,
                              style: { "width": "45px", "height": "45px" }
                            }, null, 8, ["src"])
                          ]),
                          createElementVNode("div", null, [
                            createElementVNode("div", null, [
                              createElementVNode(
                                "u-text",
                                null,
                                toDisplayString(item.sender_name),
                                1
                                /* TEXT */
                              )
                            ]),
                            createElementVNode("div", null, [
                              createElementVNode(
                                "u-text",
                                { style: { "color": "#858585" } },
                                toDisplayString(item.detail),
                                1
                                /* TEXT */
                              )
                            ])
                          ])
                        ]),
                        createElementVNode("div", null, [
                          createVNode(_component_button, {
                            onClick: ($event) => $options.receive_instruction(index),
                            disabled: item.isConfirmed,
                            class: "mini-btn",
                            type: "primary",
                            size: "mini"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(
                                toDisplayString($options.isReceived(index)),
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
      createCommentVNode(" 告警弹窗 "),
      createElementVNode("div", null, [
        createElementVNode(
          "div",
          {
            ref: "alert_popup",
            type: "bottom",
            backgroundColor: "#fff"
          },
          [
            createElementVNode("div", { style: { "padding": "15px" } }, [
              createElementVNode("div", { class: "detail" }, [
                createElementVNode("div", { class: "detail_top" }, [
                  createElementVNode("div", null, [
                    createElementVNode("u-text", null, "告警列表")
                  ]),
                  createElementVNode("div", {
                    style: { "margin-right": "10px" },
                    onClick: _cache[11] || (_cache[11] = (...args) => $options.close_alert_popup && $options.close_alert_popup(...args))
                  }, [
                    createElementVNode("img", {
                      src: _imports_4,
                      style: { "width": "15px", "height": "15px" }
                    })
                  ])
                ]),
                createElementVNode("div", { class: "divider" })
              ]),
              createElementVNode("div", null, [
                createElementVNode("div", { class: "head-nav" }, [
                  createElementVNode(
                    "div",
                    {
                      class: normalizeClass($data.navIndex == 0 ? "activite" : ""),
                      onClick: _cache[12] || (_cache[12] = ($event) => $options.checkIndex(0)),
                      style: { "width": "50%", "text-align": "center" }
                    },
                    [
                      createElementVNode("u-text", null, "接收")
                    ],
                    2
                    /* CLASS */
                  ),
                  createElementVNode(
                    "div",
                    {
                      class: normalizeClass($data.navIndex == 1 ? "activite" : ""),
                      onClick: _cache[13] || (_cache[13] = ($event) => $options.checkIndex(1)),
                      style: { "width": "50%", "text-align": "center" }
                    },
                    [
                      createElementVNode("u-text", null, "发送")
                    ],
                    2
                    /* CLASS */
                  )
                ]),
                createCommentVNode(" 内容切换 "),
                $data.navIndex == 0 ? (openBlock(), createElementBlock("div", {
                  key: 0,
                  class: "alert_content"
                })) : createCommentVNode("v-if", true),
                $data.navIndex == 1 ? (openBlock(), createElementBlock("div", {
                  key: 1,
                  class: "content"
                }, [
                  createElementVNode("div", null, [
                    createVNode(_component_button, {
                      type: "primary",
                      onClick: $options.open_alert_form
                    }, {
                      default: withCtx(() => [
                        createTextVNode("发布告警")
                      ]),
                      _: 1
                      /* STABLE */
                    }, 8, ["onClick"])
                  ])
                ])) : createCommentVNode("v-if", true)
              ])
            ])
          ],
          512
          /* NEED_PATCH */
        )
      ]),
      createElementVNode("div", null, [
        createElementVNode(
          "div",
          {
            ref: "alert_form_popup",
            type: "dialog"
          },
          [
            createElementVNode("div", {
              class: "example",
              style: { "background": "#fff", "border-radius": "5px", "padding": "10px" }
            }, [
              createElementVNode("div", { class: "detail_top" }, [
                createElementVNode("div", null, [
                  createElementVNode("u-text", null, "发布告警")
                ]),
                createElementVNode("div", {
                  style: { "margin-right": "10px" },
                  onClick: _cache[14] || (_cache[14] = (...args) => $options.close_alert_form && $options.close_alert_form(...args))
                }, [
                  createElementVNode("img", {
                    src: _imports_4,
                    style: { "width": "15px", "height": "15px" }
                  })
                ])
              ]),
              createElementVNode("div", { class: "divider" }),
              createVNode(_component_button, {
                type: "primary",
                onClick: _cache[15] || (_cache[15] = ($event) => $options.submit("alert_form"))
              }, {
                default: withCtx(() => [
                  createTextVNode("提交")
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
const condition_icons = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["styles", [_style_0]], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/task/task_detail/baidu_map/subnvue/condition_icons.nvue"]]);
export {
  condition_icons as default
};
