import Vue from 'vue'
// import Router from 'vue-router'
// import FastClick from 'fastclick'
// import myRoutes from './project/router/routes.js'
// import Vum from './vum.js'

import echarts from 'echarts' //引入echarts
Vue.prototype.$echarts = echarts //引入组件

// 引入微信js-sdk
import wx from 'weixin-js-sdk'
Vue.prototype.wx = wx

// 公用函数工具
import common from '@/assets/js/common.js'
Vue.prototype.common = common;

// demos
import Index from './demos/Index'
import Page from './demos/Page'
import Buttons from './demos/Buttons'
import Column from './demos/Column'
import Grid from './demos/Grid'
import Modal from './demos/Modal'
import List from './demos/List'
import Contacts from './demos/Contacts'
import Form from './demos/Form'
import Icons from './demos/Icons'
import Tab from './demos/Tab'
import Scroll from './demos/Scroll'
import Popup from './demos/Popup'
import PopWindow from './demos/PopWindow'
import Preloader from './demos/Preloader'
import Actions from './demos/Actions'
import Toast from './demos/Toast'
import Searchbar from './demos/Searchbar'
import Calendar from './demos/Calendar'
import Result from './demos/Result'
import Slide from './demos/Slide'
import SidePanel from './demos/SidePanel'
import Popover from './demos/Popover'
import Stars from './demos/Stars'
import CircleProgress from './demos/CircleProgress'
import commonVum from './components/index.js'

//苹方字体
// import PingFang from './styles/index.less'

import VueAMap from 'vue-amap';

import ElementUI from 'element-ui';
import axios from 'axios'
import Vant from 'vant'
import 'vant/lib/index.css'
import api from '@/assets/js/http.js'
import FastClick from 'fastclick'
import myRoutes from './project/router/routes.js'
import Vum from './vum.js'
import Router from 'vue-router'
import store from "./store";
// 引入echarts
// import echarts from 'echarts'//解开这行代码会报重复声明错误 在引入echarts时已声明
Vue.prototype.$echarts = echarts

Vue.use(VueAMap);
Vue.use(Vant);
VueAMap.initAMapApiLoader({
    key: '691501e509b87392c0aeec4b7197a125',
    plugin: ['AMap.Geocoder','AMap.Geolocation','AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
    uiVersion: '1.0.11'
})

Vue.use(commonVum)
Vue.use(ElementUI);
Vue.use(Router)
const BUS = new Vue()
Vue.prototype.BUS = BUS
Vue.prototype.$axios = axios
Vue.prototype.$api = api;

// window.URLurl = 'http://wxapp.dev.gdhwater.com/BCFileService/fileService/fileUpload';//公司
window.URLurl = 'http://wx.guangdongwater.com/BCFileService/fileService/fileUpload';//正式环境
// window.URLurl = 'http://219.139.169.234:9992/BCFileService/fileService/fileUpload';//赤壁水司
// window.URLurl = 'http://192.168.199.12:9989/fileService/fileUpload';//杨嘉慧

Vue.config.productionTip = false
window.$baseUrl = process.env.baseUrl

Vue.use(Vum)
console.dir(Vue)

let router = new Router({
  // mode: 'history',
  // base:'/dist',
  routes: [
  ...myRoutes,
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/page',
      name:'Page',
      component: Page
    },
    {
      path: '/buttons',
      name:'Buttons',
      component: Buttons
    },
    {
      path: '/column',
      name:'Column',
      component: Column
    },
    {
      path: '/grid',
      name:'Grid',
      component: Grid
    },
    {
      path: '/modal',
      name:'Modal',
      component: Modal
    },
    {
      path: '/list',
      name:'List',
      component: List
    },
    {
      path: '/contacts',
      name:'Contacts',
      component: Contacts
    },
    {
      path: '/form',
      name:'Form',
      component: Form
    },
    {
      path: '/icons',
      name: 'icons',
      component: Icons
    },
    {
      path: '/tab',
      name:'Tab',
      component: Tab
    },
    {
      path: '/scroll',
      name:'Scroll',
      component: Scroll
    },
    {
      path: '/popup',
      name:'Popup',
      component: Popup
    },
    {
      path: '/popwindow',
      name:'PopWindow',
      component: PopWindow
    },
    {
      path: '/preloader',
      name:'Preloader',
      component: Preloader
    },
    {
      path: '/toast',
      name: 'toast',
      component: Toast
    },
    {
      path: '/actions',
      name:'Actions',
      component: Actions
    },
    {
      path: '/searchbar',
      name:'Searchbar',
      component: Searchbar
    },
    {
      path: '/calendar',
      name:'Calendar',
      component: Calendar
    },
    {
      path: '/result',
      name: 'result',
      component: Result
    },
    {
      path: '/slide',
      name: 'slide',
      component: Slide
    },
    {
      path: '/side-panel',
      name: 'side-panel',
      component: SidePanel
    },
    {
      path: '/popover',
      name: 'popover',
      component: Popover
    },
    {
      path: '/stars',
      name: 'stars',
      component: Stars
    },
    {
      path: '/circle',
      name: 'circle',
      component: CircleProgress
    }
  ]
})


new Vue({
  router,store
}).$mount('#app')

Vum.router(router)

FastClick.attach(document.body)
