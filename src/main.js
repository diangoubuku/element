// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import $ from 'jquery'
import FastClick from 'fastclick'
import './assets/css/bootstrap.min.css'
import './assets/css/font-awesome.min.css'
import './assets/css/animate.min.css'
import './assets/css/swiper.min.css'
import './assets/js/bootstrap.min.js'
import './assets/js/swiper.min.js'
import './assets/css/style.css'
import router from './router'
import VueSocketio from 'vue-socket.io'
import socketio from 'socket.io-client';
let Base64 = require('js-base64').Base64;
import store from './Store.js'//这里的store必须是小写，这问题搞了一天，记住！
import axios from './Axios.js'
import FilterConfig from "./Filter.js"
import Api from "./Api.js"
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import md5 from 'js-md5';
import filte from "./assets/js/filte.js"

import VueSocketIO from 'vue-socket.io'
import SocketIO from "socket.io-client"

Vue.use(new VueSocketIO({
  debug: false,
  connection: SocketIO(myConst.socketUrl)
}))


Vue.use(ElementUI)

// 自定义全局组件

// import Graph from '@/components/common/Graph.vue';
// import Linput from '@/components/common/Linput.vue';
import customize from './assets/js/customize'   //自定义函数
// Vue.use(Graph);
// Vue.component('Graph', Graph); //初始化组件
// Vue.component('Linput', Linput); //初始化组件

// let time_sign=customize.time_sign

Vue.prototype.$Api = Api;
Vue.prototype.serverStaticData = window.serverStaticData;
Vue.prototype.getTimestamp = customize.getTimestamp;
Vue.prototype.time_sign = customize.time_sign;
Vue.prototype.$md5 = md5;
Vue.prototype.getWinner = filte.getWinner;

// SignUtil.currTimeStampDiff=Math.ceil((new Date().getTime()/1000)-Vue.prototype.serverStaticData.timestamp)
// SignUtil.sign()


Vue.config.productionTip = false
FastClick.attach(document.body);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  axios,
  // Graph,
  // Linput,
  router,
  components: { App },
  template: '<App/>'
})
