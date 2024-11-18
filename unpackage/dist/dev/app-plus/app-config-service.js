
  ;(function(){
  let u=void 0,isReady=false,onReadyCallbacks=[],isServiceReady=false,onServiceReadyCallbacks=[];
  const __uniConfig = {"pages":[],"globalStyle":{"backgroundColor":"#F8F8F8","background":"#efeff4","navigationBar":{"backgroundColor":"#F8F8F8","titleText":"uni-app","type":"default","titleColor":"#000000"},"isNVue":false},"nvue":{"compiler":"uni-app","styleCompiler":"uni-app","flex-direction":"column"},"renderer":"auto","appname":"zk_uniapp","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":true},"compilerVersion":"4.29","entryPagePath":"pages/login/login","entryPageQuery":"","realEntryPagePath":"","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000},"locales":{},"darkmode":false,"themeConfig":{}};
  const __uniRoutes = [{"path":"pages/login/login","meta":{"isQuit":true,"isEntry":true,"scrollIndicator":"none","navigationBar":{"titleText":"","style":"custom","type":"default"},"isNVue":false}},{"path":"pages/register/register","meta":{"scrollIndicator":"none","navigationBar":{"titleText":"","type":"default"},"isNVue":false}},{"path":"pages/forgetPassword/forgetPassword","meta":{"scrollIndicator":"none","navigationBar":{"titleText":"","type":"default"},"isNVue":false}},{"path":"pages/fingerLogin/fingerLogin","meta":{"scrollIndicator":"none","navigationBar":{"titleText":"","type":"default"},"isNVue":false}},{"path":"pages/task/task","meta":{"scrollIndicator":"none","navigationBar":{"titleText":"","type":"default"},"isNVue":false}},{"path":"pages/task/task_detail/task_detail","meta":{"scrollIndicator":"none","navigationBar":{"titleText":"任务列表","type":"default","buttons":[{"type":"menu","fontSize":"27px","text":""}]},"isNVue":false}},{"path":"pages/task/task_detail/document/document","meta":{"scrollIndicator":"none","navigationBar":{"titleText":"文件","type":"default"},"isNVue":false}},{"path":"pages/task/task_detail/map_test/map_test","meta":{"navigationBar":{"titleText":"高德地图测试界面","type":"default"},"isNVue":false}},{"path":"pages/task/task_detail/baidu_map/baidu_map","meta":{"navigationBar":{"titleText":"百度地图测试","type":"default"},"isNVue":false}},{"path":"pages/profile/profile","meta":{"scrollIndicator":"none","navigationBar":{"titleText":"","type":"default"},"isNVue":false}},{"path":"pages/message/main","meta":{"scrollIndicator":"none","navigationBar":{"titleText":"","type":"default"},"isNVue":false}},{"path":"pages/message/chat","meta":{"scrollIndicator":"none","navigationBar":{"titleText":"","type":"default"},"isNVue":false}},{"path":"pages/tabBar/tabBar","meta":{"scrollIndicator":"none","navigationBar":{"titleText":"首页","type":"default","autoBackButton":false},"isNVue":false}},{"path":"pages/task/task_detail/document/uploadfile/uploadfile","meta":{"navigationBar":{"titleText":"文件上传","type":"default"},"isNVue":false}},{"path":"pages/message/video-call","meta":{"navigationBar":{"titleText":"视频通话","type":"default"},"isNVue":false}},{"path":"pages/message/ChatComponent/CallReminder","meta":{"navigationBar":{"titleText":"","type":"default"},"isNVue":false}},{"path":"pages/message/video-answer","meta":{"navigationBar":{"titleText":"","type":"default"},"isNVue":false}},{"path":"pages/login/camouflageLogin/camouflageLogin","meta":{"navigationBar":{"titleText":"","style":"custom","type":"default"},"isNVue":false}}].map(uniRoute=>(uniRoute.meta.route=uniRoute.path,__uniConfig.pages.push(uniRoute.path),uniRoute.path='/'+uniRoute.path,uniRoute));
  __uniConfig.styles=[];//styles
  __uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
  __uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
  service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:16})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:u,window:u,document:u,frames:u,self:u,location:u,navigator:u,localStorage:u,history:u,Caches:u,screen:u,alert:u,confirm:u,prompt:u,fetch:u,XMLHttpRequest:u,WebSocket:u,webkit:u,print:u}}}}); 
  })();
  