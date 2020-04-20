import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    moreUserShow: 2,//多户单户水费查缴页面的显示
    meterReadingAccount: [],//自助抄表的数据
    billData:[],//单户水费查缴数据
    notFound:0,//用户从某个页面跳入未绑定页面 0:账户多户 1:通知公告 2:电子发票 3:个人中心 4:自助抄表
  }
})

export default store;
