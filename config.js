// config.js

// 高德地图API Key
export const gaodeApiKey = "caa070a3ebda631bea2feff72972f28c";
export const gaodeSecurityKey = "93849873dba769e7b6235a79330ae7f7";
//百度地图API Key
export const baiduApiKey = "A0Pr9wGe6p6C8pFIBeC2tt7QqQ8oDlCD";

// 后端API地址
export const backendHost = "http://139.196.11.210:8500/communicate";
// export const backendHost = 'http://127.0.0.1:8080'
<<<<<<< HEAD
export const LIVEKITURL = "ws://localhost:7880"
=======
export const LIVEKITURL = "ws://192.168.37.163:7880";
>>>>>>> 67b9d96dfec577c068db8dfc386337bdce710d97
const webSocketServer = {
  host: "192.168.224.235",
  port: 8081,
  path: "/call",
};
const peerServer = {
  // host: "139.196.11.210",
  host: "192.168.191.235",
  port: 9000,
  path: "/",
};
export default {
  webSocketServer,
  peerServer,
};
// 底图地址
export const tileUrls = {
  google: {
    url: "https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}",
    // url: 'https://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x=[x]&y=[y]&z=[z]',
    name: "谷歌地图",
    subdomains: [],
  },
  gaode: {
    url: "https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
    // url: 'https://webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x=[x]&y=[y]&z=[z]',
    name: "高德地图",
    subdomains: ["1", "2", "3", "4"],
  }, //能用的
  baidu: {
    // url: '//online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1',
    url: "https://maponline{s}.bdimg.com/tile/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&scaler=2&udt=&from=jsapi2_0",
    name: "百度地图",
    subdomains: ["0", "1", "2"],
  },
  local: {
    url: "static/tiles/map/{z}/{x}/{y}.png",
    // url: 'static/tiles/map/[z]/[x]/[y].png',
    name: "离线地图",
    subdomains: [],
  },
};
