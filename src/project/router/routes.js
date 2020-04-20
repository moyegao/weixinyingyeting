// import Index from '@/demos/Home'
import Index from '@/project/mywater/personalcenter/index.vue'
//import WaterQuery from '@/project/mywater/waterquery/index'

const myRoutes = [
	/*
	 * 0、vum框架
	 */
  {
    path: '/',
    meta: {
      title: 'vm主页'
    },
    name: 'index',
    component: Index,
  },
  {
    path: '/notFound',
    meta: {
      title: '404'
    },
    name: 'notFound',
    component: resolve => require(['@/project/mywater/notFound.vue'], resolve),
  },
  {
    path: '/waterConcerns',
    meta: {
      title: '关注水司'
    },
    name: 'waterConcerns',
    component: resolve => require(['@/project/mywater/waterConcerns.vue'], resolve),
  },
  {
    path: '/billDown',
    meta: {
      title: '账单下载'
    },
    name: 'billDown',
    component: resolve => require(['@/project/mywater/waterquery/pages/billDown.vue'], resolve),
  },
  {
    path: '/download',
    meta: {
      title: '文件下载引导页'
    },
    name: 'download',
    component: resolve => require(['@/project/mywater/download.vue'], resolve),
  },
  {
    path: '/moreExciting',
    meta: {
      title: '更多精彩'
    },
    name: 'moreExciting',
    component: resolve => require(['@/project/mywater/moreExciting.vue'], resolve),
  },
  {
    path: '/waterInformation',
    meta: {
      title: '水司资讯'
    },
    name: 'waterInformation',
    component: resolve => require(['@/project/mywater/waterInformation.vue'], resolve),
  },
  /*
   * 1、我的用水模块路由
   */
  //水费查缴模块路由
  {
    path: '/waterquery',
    meta: {
      title: '水费查缴'
    },
    name: 'waterquery',
    component: resolve => require(['@/project/mywater/waterquery/index'], resolve),
  },
  //水费查缴模块路由
  {
    path: '/moreUser',
    meta: {
      title: '多用户水费查缴'
    },
    name: 'moreUser',
    component: resolve => require(['@/project/mywater/waterquery/pages/moreUser'], resolve),
  },
  {
    path: '/myHeader',
    meta: {
      title: '多用户水费查缴'
    },
    name: 'myHeader',
    component: resolve => require(['@/comments/myHeader'], resolve),
  },
  {
    path: '/selfHelpMeterReading',
    meta: {
      title: '自助抄表'
    },
    name: 'selfHelpMeterReading',
    component: resolve => require(['@/project/mywater/selfHelpMeterReading/index'], resolve),
  },
  {
    path: '/userGuide',
    meta: {
      title: '用户指南抄读'
    },
    name: 'userGuide',
    component: resolve => require(['@/project/mywater/selfHelpMeterReading/userGuide'], resolve),
  },
  {
    path: '/userGuideTwo',
    meta: {
      title: '用户指南拍照'
    },
    name: 'userGuideTwo',
    component: resolve => require(['@/project/mywater/selfHelpMeterReading/userGuideTwo'], resolve),
  },
  {
    path: '/meterReadingAccount',
    meta: {
      title: '自助抄表户号选择页面'
    },
    name: 'selfHelpMeterReading',
    component: resolve => require(['@/project/mywater/selfHelpMeterReading/meterReadingAccount'], resolve),
  },
  {
    path: '/shareMeterReading',
    meta: {
      title: '共享抄表'
    },
    name: 'shareMeterReading',
    component: resolve => require(['@/project/mywater/shareMeterReading/index'], resolve),
  },
  {
    path: '/MeterReading',
    meta: {
      title: '我的抄表'
    },
    name: 'MeterReading',
    component: resolve => require(['@/project/mywater/shareMeterReading/pages/MeterReading'], resolve),
  },
  {
    path: '/MeterReadingContent',
    meta: {
      title: '抄表内容'
    },
    name: 'MeterReadingContent',
    component: resolve => require(['@/project/mywater/shareMeterReading/pages/MeterReadingContent'], resolve),
  },
  {
    path: '/bill',
    meta: {
      title: '账单'
    },
    name: 'bill',
    component: resolve => require(['@/project/mywater/waterquery/pages/bill'], resolve),
  },
  {
    path: '/billRead',
    meta: {
      title: '账单预览'
    },
    name: 'billRead',
    component: resolve => require(['@/project/mywater/waterquery/pages/billRead'], resolve),
  },
  {
    path: '/fastpay',
    meta: {
      title: '快速缴费'
    },
    name: 'fastpay',
    component: resolve => require(['@/project/mywater/waterquery/pages/fastpay.vue'], resolve),
  },
  {
    path: '/pay',
    meta: {
      title: '缴费'
    },
    name: 'pay',
    component: resolve => require(['@/project/mywater/waterquery/pages/pay.vue'], resolve),
  },
  {
    path: '/recharge',
    meta: {
      title: '快速缴费'
    },
    name: 'recharge',
    component: resolve => require(['@/project/mywater/waterquery/pages/recharge.vue'], resolve),
  },
  {
    path: '/moreAccount',
    meta: {
      title: '快速缴费'
    },
    name: 'moreAccount',
    component: resolve => require(['@/project/mywater/waterquery/pages/moreAccount.vue'], resolve),
  },
  {
    path: '/billdetail',
    meta: {
      title: '快速缴费'
    },
    name: 'billdetail',
    component: resolve => require(['@/project/mywater/waterquery/pages/billdetail.vue'], resolve),
  },
  //电子发票模块路由	
  {
    path: '/eleinvoices',
    meta: {
      title: '电子发票单户'
    },
    name: 'eleinvoices',
    component: resolve => require(['@/project/mywater/eleinvoices/index'], resolve),
  },
  {
    path: '/multiHousehold',
    meta: {
      title: '电子发票多户'
    },
    name: 'multiHousehold',
    component: resolve => require(['@/project/mywater/eleinvoices/multiHousehold'], resolve),
  },
  {
    path: '/invoicesDetail',
    meta: {
      title: '电子发票'
    },
    name: 'invoicesDetail',
    component: resolve => require(['@/project/mywater/eleinvoices/pages/invoicesDetail.vue'], resolve),
  },
  //业务办理模块路由	
  {
    path: '/businesshand',
    meta: {
      title: '业务办理'
    },
    name: 'businesshand',
    component: resolve => require(['@/project/mywater/businesshand/index'], resolve),
  },
  {
    path: '/businessindex',
    meta: {
      title: '业务办理父容器'
    },
    name: 'businesshand',
    component: resolve => require(['@/project/mywater/businesshand/pages/index'], resolve),
  },
  {
    path: '/peopleApply',
    meta: {
      title: '居民用水申请'
    },
    name: 'peopleApply',
    component: resolve => require(['@/project/mywater/businesshand/pages/peopleApply.vue'], resolve),
  },
  {
    path: '/upLoad',
    meta: {
      title: '上传附件'
    },
    name: 'upLoad',
    component: resolve => require(['@/project/mywater/businesshand/pages/upLoad.vue'], resolve),
  },
  {
    path: '/compApply',
    meta: {
      title: '企业用水申请'
    },
    name: 'compApply',
    component: resolve => require(['@/project/mywater/businesshand/pages/compApply.vue'], resolve),
  },
  {
    path: '/progressQuery',
    meta: {
      title: '业务进度查询'
    },
    name: 'progressQuery',
    component: resolve => require(['@/project/mywater/businesshand/pages/progressQuery.vue'], resolve),
  },
  // {
  //   path: '/progressQueryDetail',
  //   meta: {
  //     title: '业务进度查询详情页'
  //   },
  //   name: 'progressQueryDetail',
  //   component: resolve => require(['@/project/mywater/businesshand/pages/progressQueryDetail.vue'], resolve),
  // },
  //客服服务
  {
    path: '/service',
    meta: {
      title: '客服服务'
    },
    name: 'service',
    component: resolve => require(['@/project/mywater/service/index'], resolve),
  },
  {
    path: '/serviceTel',
    meta: {
      title: '客服热线'
    },
    name: 'serviceTel',
    component: resolve => require(['@/project/mywater/service/serviceTel'], resolve),
  },
  {
    path: '/visitPre',
    meta: {
      title: '参观预约'
    },
    name: 'visitPre',
    component: resolve => require(['@/project/mywater/service/visitPre'], resolve),
  },
  {
    path: '/complaintreport',
    meta: {
      title: '投诉举报'
    },
    name:'complaintreport',
    component: resolve => require(['@/project/moresurprise/complaintreport.vue'], resolve),
  },
  {
    path: '/complaintreportDetail',
    meta: {
      title: '我的投诉详情页'
    },
    name:'complaintreportDetail',
    component: resolve => require(['@/project/moresurprise/complaintreportDetail.vue'], resolve),
  },
  //个人中心模块路由	
  {
    path: '/personalcenter',
    meta: {
      title: '个人中心'
    },
    name: 'personalcenter',
    component: resolve => require(['@/project/mywater/personalcenter/index'], resolve),
  },
  {
    path: '/userDetails',
    meta: {
      title: '用户详情'
    },
    name: 'userDetails',
    component: resolve => require(['@/project/mywater/personalcenter/pages/userDetails.vue'], resolve),
  },
  {
    path: '/accountManage',
    meta: {
      title: '账户信息'
    },
    name: 'accountManage',
    component: resolve => require(['@/project/mywater/personalcenter/pages/accountManage.vue'], resolve),
  },
  {
    path: '/personmsg',
    meta: {
      title: '个人信息'
    },
    name: 'personmsg',
    component: resolve => require(['@/project/mywater/personalcenter/pages/personmsg.vue'], resolve),
  },
  {
    path: '/accountBind',
    meta: {
      title: '账号绑定'
    },
    name: 'accountBind',
    component: resolve => require(['@/project/mywater/personalcenter/pages/accountBind.vue'], resolve),
  },
  {
    path: '/accBind',
    meta: {
      title: '选择账号绑定'
    },
    name: 'accBind',
    component: resolve => require(['@/project/mywater/personalcenter/pages/accBind.vue'], resolve),
  },
  {
    path: '/newData',
    meta: {
      title: '智慧用水'
    },
    name:'newData',
    component: resolve => require(['@/project/mywater/personalcenter/pages/newData.vue'], resolve),
  },
  {
    path: '/waterAnalyze',
    meta: {
      title: '用水分析'
    },
    name:'waterAnalyze',
    component: resolve => require(['@/project/mywater/personalcenter/pages/waterAnalyze.vue'], resolve),
  },
  {
    path: '/contacts',
    meta: {
      title: '联系人'
    },
    name:'contacts',
    component: resolve => require(['@/project/mywater/personalcenter/pages/contacts'], resolve),
  },
  {
    path: '/contactEdit',
    meta: {
      title: '联系人'
    },
    name:'contactEdit',
    component: resolve => require(['@/project/mywater/personalcenter/pages/contactEdit'], resolve),
  },
  /*
    * 2、公共服务模块路由
    */
  {
    path: '/salesNetwork',
    meta: {
      title: '营业网点'
    },
    name:'salesNetwork',
    component: resolve => require(['@/project/comserver/salesNetwork'], resolve),
  },
  {
    path: '/waterPriceAndReport',
    meta: {
      title: '水价信息/水质报告'
    },
    name:'waterPriceInfo',
    component: resolve => require(['@/project/comserver/index'], resolve),
  },
  {
    path: '/waterPriceInfo',
    meta: {
      title: '水价信息'
    },
    name:'waterPriceInfo',
    component: resolve => require(['@/project/comserver/waterPriceInfo'], resolve),
  },

  {
    path: '/qualityReport',
    meta: {
      title: '水质报告'
    },
    name:'qualityReport',
    component: resolve => require(['@/project/comserver/qualityReport'], resolve),
  },
  {
    path: '/qualityDelate',
    meta: {
      title: '水质报告'
    },
    name:'qualityDelate',
    component: resolve => require(['@/project/comserver/qualityDelate'], resolve),
  },

  {
    path: '/announcemen',
    meta: {
      title: '通知公告'
    },
    name:'announcemen',
    component: resolve => require(['@/project/comserver/announcemen'], resolve),
  },
  {
    path: '/moreAnnouncemen',
    meta: {
      title: '更多通知公告'
    },
    name:'moreAnnouncemen',
    component: resolve => require(['@/project/comserver/moreAnnouncemen'], resolve),
  },
  {
    path: '/infoDetail',
    meta: {
      title: '通知详情'
    },
    name:'infoDetail',
    component: resolve => require(['@/project/comserver/infoDetail'], resolve),
  },
  {
    path: '/gdhInfo',
    meta: {
      title: '粤海资讯'
    },
    name:'gdhInfo',
    component: resolve => require(['@/project/comserver/gdhInfo'], resolve),
  },
  /*
    * 3、更多精彩
    */
  {
    path: '/leakandrepairs',
    meta: {
      title: '报修/报漏'
    },
    name:'leakandrepairs',
    component: resolve => require(['@/project/moresurprise/leakandrepairs.vue'], resolve),
  },
  {
    path: '/myMap',
    meta: {
      title: '报修/报漏-地图'
    },
    name:'myMap',
    component: resolve => require(['@/project/moresurprise/myMap.vue'], resolve),
  },
  {
    path: '/leakandrepairsDetail',
    meta: {
      title: '保修报漏-我的历史详情页'
    },
    name:'leakandrepairsDetail',
    component: resolve => require(['@/project/moresurprise/leakandrepairsDetail.vue'], resolve),
  },
  {
    path: '/intelservice',
    meta: {
      title: '智慧客服'
    },
    name:'intelservice',
    component: resolve => require(['@/project/moresurprise/intelservice'], resolve),
  },
  {
    path: '/thePipe',
    meta: {
      title: '水管家'
    },
    name:'thePipe',
    component: resolve => require(['@/project/moresurprise/thePipe.vue'], resolve),
  },
]

export default myRoutes
