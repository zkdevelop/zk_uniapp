var __renderjsModules={};

__renderjsModules["55b5cda2"] = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // <stdin>
  var stdin_exports = {};
  __export(stdin_exports, {
    default: () => stdin_default
  });

  // C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/pages/task/task_detail/map.js
  function loadMapScript(baiduApiKey, gaodeApiKey, securityJsCode) {
    return new Promise(function(resolve, reject) {
      window.init = function() {
        resolve(loadMapScript);
      };
      window._AMapSecurityConfig = {
        securityJsCode
      };
      var script1 = document.createElement("script");
      script1.type = "text/javascript";
      script1.src = `https://webapi.amap.com/maps?v=2.0&key=${gaodeApiKey}`;
      script1.onerror = reject;
      document.head.appendChild(script1);
      var script2 = document.createElement("script");
      script2.type = "text/javascript";
      script2.src = `https://api.map.baidu.com/api?v=1.0&type=webgl&ak=${baiduApiKey}&callback=init`;
      script2.onerror = reject;
      document.head.appendChild(script2);
    });
  }

  // C:/Users/qyl23/Documents/HBuilderProjects/zk_uniapp/static/route/points.js
  var points = [
    {
      id: "point-1",
      latitude: "24.182220",
      longitude: "120.686250",
      image: "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/car.png",
      time: "2024-11-5 16:02:00",
      description: "\u4EFB\u52A1\u5F00\u59CB"
    },
    {
      id: "point-2",
      latitude: "24.120192",
      longitude: "120.667024",
      image: "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/car.png",
      time: "2024-11-5 16:12:00",
      description: "\u5230\u8FBE\u5730\u70B91"
    },
    {
      id: "point-3",
      latitude: "24.142751",
      longitude: "120.699296",
      image: "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/car.png",
      time: "2024-11-5 16:22:00",
      description: "\u5230\u8FBE\u5730\u70B92"
    },
    {
      id: "point-4",
      latitude: "24.138365",
      longitude: "120.728135",
      image: "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/car.png",
      time: "2024-11-5 16:32:00",
      description: "\u5B8C\u6210\u884C\u52A8\u76EE\u6807"
    },
    {
      id: "point-5",
      latitude: "24.133979",
      longitude: "120.69655",
      image: "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/car.png",
      time: "2024-11-5 16:42:00",
      description: "\u4EFB\u52A1\u7ED3\u675F"
    }
  ];

  // <stdin>
  var map = null;
  var stdin_default = {
    data() {
      return {
        baiduApiKey: "A0Pr9wGe6p6C8pFIBeC2tt7QqQ8oDlCD",
        gaodeApiKey: "caa070a3ebda631bea2feff72972f28c",
        gaodeSecurityKey: "93849873dba769e7b6235a79330ae7f7",
        position: {
          longitude: 116.397428,
          latitude: 39.90923
        },
        mapType: "",
        map: null
      };
    },
    mounted() {
      loadMapScript(this.baiduApiKey, this.gaodeApiKey, this.gaodeSecurityKey).then(() => {
        this.$ownerInstance.callMethod("setPoint");
      });
    },
    methods: {
      getPosition(position) {
        this.position = position;
        this.$nextTick(() => {
          this.changeMap(this.mapType);
        });
      },
      setMapType(value) {
        this.mapType = value;
        this.changeMap(this.mapType);
      },
      changeMap(mapType) {
        switch (mapType) {
          case "google":
          case "gaode":
            map = new AMap.Map("map_container", {
              divMode: "2D",
              // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 divMode: '3D'
              zoom: 12,
              // 初始化地图层级
              center: [this.position.longitude, this.position.latitude]
              // 初始化地图中心点
            });
            this.map = map;
            this.getLine();
            break;
          case "baidu":
            map = new BMapGL.Map("map_container");
            map.centerAndZoom(
              new BMapGL.Point(this.position.longitude, this.position.latitude),
              12
            );
            this.map = map;
            break;
          case "local":
            break;
          default:
            break;
        }
      },
      getReplay(replay) {
        this.replay = replay;
        if (replay) {
          this.replayMission();
        }
      },
      replayMission() {
        switch (this.mapType) {
          case "google":
          case "gaode":
            let index = 1;
            this.map.setZoomAndCenter(15, [points[0].longitude, points[0].latitude], true);
            const interval = setInterval(() => {
              if (index >= points.length || !this.replay) {
                clearInterval(interval);
                return;
              }
              const point = points[index];
              this.map.setZoomAndCenter(15, [point.longitude, point.latitude], false);
              index++;
            }, 4e3);
            this.$ownerInstance.callMethod("setPoint", false);
            break;
          case "baidu":
            break;
          case "local":
            break;
          default:
            break;
        }
      },
      getMarker(point) {
        let marker = null;
        switch (this.mapType) {
          case "google":
          case "gaode":
            marker = new AMap.Marker({
              //经纬度位置
              position: new AMap.LngLat(point.longitude, point.latitude),
              //偏移量
              offset: new AMap.Pixel(-10, -24),
              //图标
              icon: new AMap.Icon({
                //大小
                size: new AMap.Size(20, 25),
                imageSize: new AMap.Size(20, 25),
                // image: 'https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/em.jpg'
                image: "https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png"
              }),
              //图标展示层级，防止被隐藏时编写
              zIndex: 100,
              //图标旁边展示内容
              label: {
                content: `<view style="display:flex;flex-direction:column"><text>${point.description}</text>
							<image src='${point.image}' style="max-width: 300px; max-height: 300px;"/></view>`,
                offset: new AMap.Pixel(10, -18)
              }
            });
            break;
          case "baidu":
            break;
          case "local":
            break;
          default:
            break;
        }
        return marker;
      },
      //绘制点与点之间的线段 Polyline类
      initLine(start, end) {
        let polyline = new AMap.Polyline({
          //颜色
          strokeColor: "#ff0000",
          //起点与终点经纬度[[longitudeStart,latitudeStart],[longitudeEnd,latitudeEnd]]
          path: [start, end]
        });
        this.map.add(polyline);
      },
      getLine() {
        let prev = null;
        let index = 0;
        for (let index2 = 0; index2 < points.length; index2++) {
          let curr = points[index2];
          this.map.add(this.getMarker(curr));
          if (index2 > 0) {
            this.initLine([prev.longitude, prev.latitude], [curr.longitude, curr.latitude]);
          }
          prev = points[index2];
        }
      }
    }
  };
  return __toCommonJS(stdin_exports);
})();
