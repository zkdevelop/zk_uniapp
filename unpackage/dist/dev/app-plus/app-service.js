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
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const _imports_0$3 = "/static/icon/login.png";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$6 = {
    data() {
      return {
        autoLogin: false
        // 初始状态为未选中
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
          url: "/pages/task/task"
        });
      },
      toggleAutoLogin(e) {
        this.autoLogin = e.detail.value.length > 0;
        if (this.autoLogin == true) {
          uni.navigateTo({
            url: "/pages/register/register"
            // 替换为目标页面的路径
          });
        }
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "layout" }, [
      vue.createElementVNode("view", { class: "iconView" }, [
        vue.createElementVNode("image", {
          src: _imports_0$3,
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
        vue.createElementVNode("input", {
          class: "uni-input",
          focus: "",
          placeholder: "请输入用户名"
        }),
        vue.createElementVNode("view", {
          class: "title",
          style: { "margin": "15px 0px 7px 0px" }
        }, "密码"),
        vue.createElementVNode("input", {
          class: "uni-input",
          password: "",
          type: "text",
          placeholder: "请输入密码"
        }),
        vue.createElementVNode("button", {
          onClick: _cache[0] || (_cache[0] = (...args) => $options.goToTask && $options.goToTask(...args)),
          type: "primary",
          style: { "margin-top": "15px" }
        }, "登录")
      ]),
      vue.createElementVNode("view", { class: "container" }, [
        vue.createElementVNode("view", { class: "left" }, [
          vue.createElementVNode("label", { class: "checkbox" }, [
            vue.createElementVNode("checkbox", {
              value: $data.autoLogin,
              onChange: _cache[1] || (_cache[1] = (...args) => $options.toggleAutoLogin && $options.toggleAutoLogin(...args))
            }, "自动登录", 40, ["value"])
          ])
        ]),
        vue.createElementVNode("view", { class: "right" }, [
          vue.createElementVNode("text", {
            onClick: _cache[2] || (_cache[2] = (...args) => $options.goToRegister && $options.goToRegister(...args)),
            class: "clicked_text"
          }, "注册 "),
          vue.createElementVNode("text", {
            onClick: _cache[3] || (_cache[3] = (...args) => $options.goToForgetPassword && $options.goToForgetPassword(...args)),
            class: "clicked_text"
          }, " 忘记密码"),
          vue.createElementVNode("text", null, " | "),
          vue.createElementVNode("text", {
            onClick: _cache[4] || (_cache[4] = (...args) => $options.goToFingerLogin && $options.goToFingerLogin(...args)),
            class: "clicked_text"
          }, "指纹登录")
        ])
      ]),
      vue.createCommentVNode(' <navigator url="/pages/register/register">注册</navigator> ')
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/login/login.vue"]]);
  const _sfc_main$5 = {
    data() {
      return {};
    },
    methods: {}
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
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
        }, "用户名"),
        vue.createElementVNode("input", {
          class: "uni-input",
          focus: "",
          placeholder: "请输入用户名"
        }),
        vue.createElementVNode("view", {
          class: "title",
          style: { "margin": "15px 0px 7px 0px" }
        }, "密码"),
        vue.createElementVNode("input", {
          class: "uni-input",
          password: "",
          type: "text",
          placeholder: "请输入密码"
        }),
        vue.createElementVNode("view", {
          class: "title",
          style: { "margin": "15px 0px 7px 0px" }
        }, "再次输入密码"),
        vue.createElementVNode("input", {
          class: "uni-input",
          password: "",
          type: "text",
          placeholder: "请再次输入密码"
        }),
        vue.createElementVNode("button", {
          type: "primary",
          style: { "margin-top": "30px" }
        }, "注册")
      ])
    ]);
  }
  const PagesRegisterRegister = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/register/register.vue"]]);
  const _sfc_main$4 = {
    data() {
      return {};
    },
    methods: {}
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view");
  }
  const PagesForgetPasswordForgetPassword = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/forgetPassword/forgetPassword.vue"]]);
  const _imports_0$2 = "/static/icon/finger.png";
  const _sfc_main$3 = {
    data() {
      return {};
    },
    methods: {}
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "layout" }, [
      vue.createElementVNode("view", { class: "fingerView" }, [
        vue.createElementVNode("image", {
          src: _imports_0$2,
          class: "fingerIcon"
        })
      ]),
      vue.createElementVNode("view", null, [
        vue.createElementVNode("text", { style: { "color": "rgb(45, 130, 254)" } }, "点击进行指纹认证")
      ]),
      vue.createElementVNode("view", { style: { "margin-top": "70px" } }, [
        vue.createElementVNode("text", null, [
          vue.createElementVNode("navigator", {
            url: "/pages/login/login",
            "open-type": "navigateBack"
          }, "账号密码登录")
        ])
      ])
    ]);
  }
  const PagesFingerLoginFingerLogin = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/fingerLogin/fingerLogin.vue"]]);
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const _imports_0$1 = "/static/icon/location_grey.png";
  const _imports_1 = "/static/icon/time_grey.png";
  const _sfc_main$2 = {
    data() {
      return {
        currentTime: /* @__PURE__ */ new Date(),
        taskItem: [],
        tabbarIndex: 0,
        handlingType: [
          { value: "全部" },
          { value: "未开始" },
          { value: "进行中" },
          { value: "已完成" }
        ],
        allItems: [],
        unstartedItems: [],
        ongoingItems: [],
        completedItems: []
      };
    },
    mounted() {
      this.initializeTasks();
    },
    computed: {
      upcomingTasks() {
        return this.filterUpcomingTasks();
      },
      comingTasks() {
        return this.filterComingTasks();
      },
      endedTasks() {
        return this.filterEndedTasks();
      }
    },
    methods: {
      initializeTasks() {
        this.taskItem = [
          { task_name: "现地侦察横须滨基地情况", position: "日本横须滨", start_time: "2024.05.03", end_time: "2026.02.01", type: this.getTaskType("2024.05.03", "2026.02.01") },
          { task_name: "台风情况管控", position: "台湾省台北市", start_time: "2025.05.03", end_time: "2026.03.01", type: this.getTaskType("2025.05.03", "2026.03.01") },
          { task_name: "其他任务示例", position: "位置A", start_time: "2024.06.01", end_time: "2024.12.01", type: this.getTaskType("2024.06.01", "2024.12.01") },
          { task_name: "任务示例1", position: "位置B", start_time: "2023.10.01", end_time: "2024.05.01", type: this.getTaskType("2023.10.01", "2024.05.01") },
          { task_name: "任务示例2", position: "位置C", start_time: "2023.12.01", end_time: "2024.08.01", type: this.getTaskType("2023.12.01", "2024.08.01") },
          { task_name: "任务示例3", position: "位置D", start_time: "2024.04.01", end_time: "2024.11.01", type: this.getTaskType("2024.04.01", "2024.11.01") },
          { task_name: "任务示例4", position: "位置E", start_time: "2023.09.01", end_time: "2024.03.01", type: this.getTaskType("2023.09.01", "2024.03.01") },
          { task_name: "任务示例5", position: "位置F", start_time: "2025.01.01", end_time: "2025.07.01", type: this.getTaskType("2025.01.01", "2025.07.01") }
        ];
        this.allItems = this.taskItem;
        this.unstartedItems = this.filterUpcomingTasks();
        this.ongoingItems = this.filterComingTasks();
        this.completedItems = this.filterEndedTasks();
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
        formatAppLog("info", "at pages/task/task.vue:172", this.tabbarIndex);
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
      goToDetail() {
        uni.navigateTo({
          url: "/pages/task/task_detail/task_detail"
        });
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
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
      vue.createElementVNode("view", {
        class: "",
        style: { "margin-top": "100upx", "padding": "0 20upx" }
      }, [
        $data.tabbarIndex === 0 ? (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          { key: 0 },
          vue.renderList($data.allItems, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "",
              key: index
            }, [
              vue.createCommentVNode(" <text>{{ item }}</text> "),
              vue.createElementVNode("view", {
                onClick: _cache[0] || (_cache[0] = (...args) => $options.goToDetail && $options.goToDetail(...args)),
                class: "task_item"
              }, [
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
                vue.createElementVNode("view", { class: "item_bottom" }, [
                  vue.createElementVNode("view", null, [
                    vue.createElementVNode("image", {
                      src: _imports_0$1,
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
                vue.createElementVNode("view", { class: "item_bottom" }, [
                  vue.createElementVNode("view", null, [
                    vue.createElementVNode("image", {
                      src: _imports_1,
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
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        )) : vue.createCommentVNode("v-if", true),
        $data.tabbarIndex === 1 ? (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          { key: 1 },
          vue.renderList($data.unstartedItems, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "",
              key: index
            }, [
              vue.createElementVNode("view", { class: "task_item" }, [
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
                vue.createElementVNode("view", { class: "item_bottom" }, [
                  vue.createElementVNode("view", null, [
                    vue.createElementVNode("image", {
                      src: _imports_0$1,
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
                vue.createElementVNode("view", { class: "item_bottom" }, [
                  vue.createElementVNode("view", null, [
                    vue.createElementVNode("image", {
                      src: _imports_1,
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
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        )) : vue.createCommentVNode("v-if", true),
        $data.tabbarIndex === 2 ? (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          { key: 2 },
          vue.renderList($data.ongoingItems, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "",
              key: index
            }, [
              vue.createElementVNode("view", { class: "task_item" }, [
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
                vue.createElementVNode("view", { class: "item_bottom" }, [
                  vue.createElementVNode("view", null, [
                    vue.createElementVNode("image", {
                      src: _imports_0$1,
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
                vue.createElementVNode("view", { class: "item_bottom" }, [
                  vue.createElementVNode("view", null, [
                    vue.createElementVNode("image", {
                      src: _imports_1,
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
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        )) : vue.createCommentVNode("v-if", true),
        $data.tabbarIndex === 3 ? (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          { key: 3 },
          vue.renderList($data.completedItems, (item, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "",
              key: index
            }, [
              vue.createElementVNode("view", { class: "task_item" }, [
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
                vue.createElementVNode("view", { class: "item_bottom" }, [
                  vue.createElementVNode("view", null, [
                    vue.createElementVNode("image", {
                      src: _imports_0$1,
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
                vue.createElementVNode("view", { class: "item_bottom" }, [
                  vue.createElementVNode("view", null, [
                    vue.createElementVNode("image", {
                      src: _imports_1,
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
              ])
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        )) : vue.createCommentVNode("v-if", true)
      ])
    ]);
  }
  const PagesTaskTask = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/task/task.vue"]]);
  const _imports_0 = "/static/icon/alert.png";
  const _sfc_main$1 = {
    data() {
      return {
        options: ["未开始", "进行中", "已完成"],
        // 下拉选择器的选项
        selectedOption: "",
        // 当前选择的选项
        defaultOption: "未开始"
      };
    },
    methods: {
      onPickerChange(event) {
        const index = event.detail.value;
        this.selectedOption = this.options[index];
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "layout_task_detail" }, [
      vue.createElementVNode("view", { class: "condition_icons" }, [
        vue.createElementVNode("view", { class: "condition_selector" }, [
          vue.createElementVNode("picker", {
            mode: "selector",
            range: $data.options,
            onChange: _cache[0] || (_cache[0] = (...args) => $options.onPickerChange && $options.onPickerChange(...args))
          }, [
            vue.createElementVNode(
              "view",
              { class: "picker" },
              vue.toDisplayString($data.selectedOption ? $data.selectedOption : $data.defaultOption),
              1
              /* TEXT */
            )
          ], 40, ["range"])
        ]),
        vue.createElementVNode("view", { class: "instructions" }, [
          vue.createElementVNode("view", { class: "instructions_alert" }, [
            vue.createElementVNode("view", {
              class: "alert_img",
              style: { "text-align": "center", "padding-top": "5px" }
            }, [
              vue.createElementVNode("image", {
                src: _imports_0,
                style: { "width": "23px", "height": "23px" }
              })
            ]),
            vue.createElementVNode("view", {
              class: "text_setting",
              style: { "text-align": "center" }
            }, [
              vue.createElementVNode("text", { style: { "color": "#d81e06", "font-size": "small" } }, "告警")
            ])
          ]),
          vue.createElementVNode("view", { class: "instructions_instruct" }, [
            vue.createElementVNode("view", {
              class: "alert_img",
              style: { "text-align": "center" }
            }, [
              vue.createElementVNode("image", {
                src: _imports_0,
                style: { "width": "23px", "height": "23px" }
              })
            ])
          ]),
          vue.createElementVNode("view", { class: "instructions_document" }, [
            vue.createElementVNode("view", { class: "document" }, [
              vue.createElementVNode("view", {
                class: "alert_img",
                style: { "text-align": "center" }
              }, [
                vue.createElementVNode("image", {
                  src: _imports_0,
                  style: { "width": "23px", "height": "23px" }
                })
              ])
            ]),
            vue.createElementVNode("view", { class: "map_selector" }, [
              vue.createElementVNode("view", {
                class: "alert_img",
                style: { "text-align": "center" }
              }, [
                vue.createElementVNode("image", {
                  src: _imports_0,
                  style: { "width": "23px", "height": "23px" }
                })
              ])
            ])
          ])
        ])
      ])
    ]);
  }
  const PagesTaskTaskDetailTaskDetail = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/task/task_detail/task_detail.vue"]]);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/register/register", PagesRegisterRegister);
  __definePage("pages/forgetPassword/forgetPassword", PagesForgetPasswordForgetPassword);
  __definePage("pages/fingerLogin/fingerLogin", PagesFingerLoginFingerLogin);
  __definePage("pages/task/task", PagesTaskTask);
  __definePage("pages/task/task_detail/task_detail", PagesTaskTaskDetailTaskDetail);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("warn", "at App.vue:4", "当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！");
      formatAppLog("log", "at App.vue:5", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:8", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:11", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
