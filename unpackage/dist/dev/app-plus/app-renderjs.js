var __renderjsModules={};

__renderjsModules["66f1555e"] = (() => {
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

  // <stdin>
  var map = null;
  var stdin_default = {
    data() {
      return {
        baiduApiKey: "A0Pr9wGe6p6C8pFIBeC2tt7QqQ8oDlCD",
        gaodeApiKey: "caa070a3ebda631bea2feff72972f28c",
        gaodeSecurityKey: "93849873dba769e7b6235a79330ae7f7"
      };
    },
    created() {
      loadMapScript(this.baiduApiKey, this.gaodeApiKey, this.gaodeSecurityKey).then(() => {
        map = new AMap.Map("map_container", {
          divMode: "2D",
          // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 divMode: '3D'
          zoom: 12,
          // 初始化地图层级
          center: [116.397428, 39.90923]
          // 初始化地图中心点
        });
        var marker = new AMap.Marker({
          position: new AMap.LngLat(116.39, 39.92),
          icon: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
          offset: new AMap.Pixel(-13, -30)
        });
        map.add(marker);
        window.map = map;
      });
    },
    mounted() {
    },
    methods: {
      changeMap(mapType) {
        switch (mapType) {
          case 0:
          case 1:
            map = new AMap.Map("map_container", {
              divMode: "2D",
              // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 divMode: '3D'
              zoom: 11,
              // 初始化地图层级
              center: [116.397428, 39.90923]
              // 初始化地图中心点
            });
            window.map = map;
            break;
          case 2:
            __f__("log", "at pages/task/task_detail/task_detail.vue:321", initMap);
            map = new BMapGL.Map("map_container");
            map.centerAndZoom(new BMapGL.Point(116.404, 39.915), 12);
            map.enableScrollWheelZoom(true);
            window.map = map;
            break;
          case 3:
            break;
          default:
            break;
        }
      }
    }
  };
  return __toCommonJS(stdin_exports);
})();


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

  // <stdin>
  var map = null;
  var stdin_default = {
    data() {
      return {
        baiduApiKey: "A0Pr9wGe6p6C8pFIBeC2tt7QqQ8oDlCD",
        gaodeApiKey: "caa070a3ebda631bea2feff72972f28c",
        gaodeSecurityKey: "93849873dba769e7b6235a79330ae7f7",
        longitude: 116.397428,
        latitude: 39.90923,
        mapType: 0
      };
    },
    mounted() {
      loadMapScript(this.baiduApiKey, this.gaodeApiKey, this.gaodeSecurityKey).then(() => {
        this.$ownerInstance.callMethod("setPoint");
      });
    },
    methods: {
      getLatitude(latitude) {
        this.latitude = latitude;
        this.$nextTick(() => {
          this.changeMap(this.mapType);
        });
      },
      getLongitude(longitude) {
        this.longitude = longitude;
        this.$nextTick(() => {
          this.changeMap(this.mapType);
        });
      },
      changeMap(mapType) {
        this.mapType = mapType;
        switch (mapType) {
          case 0:
          case 1:
            map = new AMap.Map("map_container", {
              divMode: "2D",
              // 默认使用 2D 模式，如果希望使用带有俯仰角的 3D 模式，请设置 divMode: '3D'
              zoom: 12,
              // 初始化地图层级
              center: [this.longitude, this.latitude]
              // 初始化地图中心点
            });
            break;
          case 2:
            map = new BMapGL.Map("map_container");
            map.centerAndZoom(new BMapGL.Point(this.longitude, this.latitude), 12);
            break;
          case 3:
            break;
          default:
            break;
        }
      }
    }
  };
  return __toCommonJS(stdin_exports);
})();
