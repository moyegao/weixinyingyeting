<template>
  <div class="leak-and-repairs" v-if="leakandrepairsShow">
    <page-content>
      <headerThree :message='message'></headerThree>
      <tab :active="tabIndex" ref="tab" @click.native="tabClick(tabIndex)" id="yh-tab">
        <tab-item title="报修/报漏" @click.native="tabItemClick($event)">
          <div class="span_content">
            <van-field class="yh-my-blue" v-model="repairData.groupName" @click="showAddressChuang" readonly required left-icon="location-o" right-icon="arrow" label="所属地区" placeholder="请选择地区" size="large" />
            <van-field class="yh-my-red add-pic" label="发生地点" required left-icon="wap-home-o" disabled />
            <van-cell-group>
              <van-field v-model="repairData.leakAddress" style="width: calc(100% - 30px);display: inline-block;" rows="1" autosize type="textarea" @blur="blur(repairData.leakAddress,'leakAddress')" clearable />
              <van-icon @click="goMap" name="location" />
            </van-cell-group>
            <van-field class="yh-my-blue add-pic" label="故障设备" required left-icon="award-o" size="large" disabled />
            <van-radio-group v-model="repairData.faultEquipmentType">
              <van-radio :name="item.value" v-for="(item,i) in equipmentData" :key='i'>{{item.name}}</van-radio>
            </van-radio-group>

            <van-field class="yh-my-red add-pic" label="备注信息" left-icon="comment-o" size="large" />
            <van-cell-group class="beizhu">
               <!-- @blur="blur(repairData.repairRemark,'repairRemark')"  -->
              <van-field v-model="repairData.repairRemark" rows="1" autosize type="textarea" maxlength="100" show-word-limit placeholder="请输入备注信息" clearable />
            </van-cell-group>
            <div class="yh-my-uploader">
              <van-uploader v-model="repairFileList" multiple :max-count="3">
                <div class="uploader-content">
                  <van-icon name="/wxcss2/static/img/xiangji.png" />
                  <div class="uploader-length">{{repairFileList.length}}/3</div>
                </div>
              </van-uploader>
            </div>
            <!-- @blur="blur(repairData.contact,'contact')"  -->
            <van-field class="yh-my-blue" v-model="repairData.contact" left-icon="manager-o" label="联系人" placeholder="请输入联系人" size="large" />
             <!-- @blur="blur(repairData.phone,'phone')"  -->
            <van-field class="yh-my-red" v-model="repairData.phone" left-icon="phone-o" label="联系电话" placeholder="请输入手机号码" size="large"/>
          </div>
          <van-button type="info" class="next" @click="getFtoken">提&nbsp;&nbsp;&nbsp;交</van-button>
        </tab-item>
        <tab-item title="进度查询" @click.native="tabItemClick($event)">
          <div class="yh-content" v-if="historyData.length!==0" @touchmove="touchmove($event)" @scroll="scroll($event)">
            <div v-for="item in historyData" :key="item.id" class="yh-parent" @click="goLeakandrepairsDetail(item)">
              <div class="yh-top">
                <span>{{item.groupName}}</span>
                <span class="yh-status">{{item.status}}</span>
              </div>
              <!-- <div class="yh-top">
                <span>工单单号：</span>
                <span>{{item.source == 1 ? '正在生成中...': item.id}}</span>
              </div> -->
              <div class="yh-middle">
                <span>备注信息：</span>
                <span>{{item.repairRemark}}</span>
              </div>
              <div class="yh-bottom">
                <span>
                  <span v-if="item.repairOrLeak == 1">提交时间：</span>
                  <span v-else>提交时间：</span>
                  <span>{{item.repairOrLeakDate}}</span>
                </span>
              </div>
              <div class="yh-bottom">
                <span>
                  <span v-if="item.repairOrLeak == 1">地址：</span>
                  <span v-else>地址：</span>
                  <span class="address">{{item.leakAddress}}</span>
                </span>
              </div>
              <div class="yh-bottom" style="display: flex" v-if="(item.status == '未受理' || item.status == '已受理') && item.source != 1">
                <van-button type="info" class="returnBtn" @click="reCall($event, item)">撤&nbsp;&nbsp;&nbsp;回</van-button>
              </div>
            </div>
          </div>
          <div class="yh-content yh-nodata" v-if="historyData.length == 0">
            <span>您暂无报修报漏信息。</span>
          </div>
        </tab-item>
      </tab>
    </page-content>
    <!-- 所属地区 -->
    <van-popup position="bottom" :style="{ height: '40%' }" v-model="relationShow">
      <van-area :area-list="areaList" :value="areaNum" :columns-num="2" @confirm="sure" @cancel="exit" @change="onChange" />
    </van-popup>
    <!-- 故障设备下拉数据 -->
    <van-popup position="bottom" :style="{ height: '40%' }" v-model="equipmentShow">
      <van-picker class="timepicker" show-toolbar title="故障设备" :columns="equipmentColumns" @cancel="onCancelEquipment" @confirm="onConfirmEquipment" />
    </van-popup>
    <!-- 用户编号 -->
    <van-popup position="bottom" :style="{ height: '40%' }" v-model="userNumShow">
      <van-picker class="timepicker" show-toolbar title="用户编号" :columns="userNumColumns" @cancel="onCancelRelation" @confirm="onConfirmRelation" />
    </van-popup>
  </div>
  <myMap v-else-if="repairMapShow" :mapNeedData="mapNeedData" :leakAddress='leakAddress'></myMap>
</template>

<script>
import myHeader from '@/comments/myHeader'
import headerThree from '@/comments/headerThree';
import myMap from './myMap'
import axios from 'axios'
import { Toast, PullRefresh, RadioGroup, Radio, Tab, Tabs, Dialog } from 'vant';
export default {
  components: {
    myHeader, headerThree, myMap
  },
  data() {
    return {
      newAreaMap:{},
      newCityMap:{},
      message: {
        title: "报修/报漏",
        span1:"尊敬的"+(localStorage.getItem('nickname') === null? 'XX':localStorage.getItem('nickname')),
        span2: "请您仔细填写报修/报漏信息",
        span3: "我们将尽快处理并给予反馈",
        isShow: '',
      },
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离
      //下拉加载
      loading: false,
      finished: false,

      leakAddress: '',
      title: '报修/报漏',
      tabIndex: 0,
      index: '',
      //报修数据
      repairData: {
        faultEquipmentType: '',
        repairRemark: '',
        leakAddress: '',
        groupCode: "",
        userNo: '',
        groupName: '',
      },
      repairFileList: [],
      // 报漏数据
      // leakData: {
        // repairRemark: "",
      //   leakAddress: '',
      //   repairOrLeakDate: '',
      //   groupName: '',
      // },
      // 我的历史数据
      historyData: [],
      // 水司下拉框数据
      waterData: [],
      waterShow: false,
      waterColumns: ['梧州水司', '梅州水司', '儋州水司'],
      //漏水设备下拉框
      leakEquipmentData: [],
      leakEquipmentShow: false,
      leakEquipmentColumns: [],
      // 故障设备下拉框
      equipmentData: [],
      equipmentShow: false,
      equipmentColumns: [],
      // 报漏时间下拉框
      // timeShow: false,
      currDate: new Date(),

      leakandrepairsShow: true,
      // leakUploadShow: false,
      repairMapShow: false,
      // 判断所属地区属于报修或报漏
      addressFor: '',
      // 省份名称
      province: '',



      upLoadNeedData: [],
      fileList: [],
      ftoken: '',
      fileUrlList: [],
      userNumData: [],
      userNumColumns: [],
      userNumShow: false,

      mapNeedData: {},

      relationShow: false,
      //  地址三级联动数据
      //   地址弹窗标识
      showAddress: false,
      // 当前选中的省市区code
      areaNum: "01013",
      // 省市区列表
      areaList: {},
      emailURL: '',
    }
  },
  mounted() {
    // 地图获取地址数据
    this.BUS.$on('getAddress', (address, content) => {
      this.repairData.leakAddress = address
      this.leakAddress = address;
      this.tabIndex = 0// 配合调用tab.vue子组件方法的变量
      this.$refs.tab.onClick(0)
    })
  },
  created() {
    document.body.addEventListener('focusout', () => {
      // 回到原点  若觉得一瞬间回到底部不够炫酷，那自己可以自定义缓慢回弹效果， 可用css 、贝塞尔曲线、js的 requestAnimationFrame  等等 方法 实现体验性更好的回弹效果
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    })

    this.emailURL = URLurl;
    if (localStorage.getItem('leakandrepairsHistory') === null) {
      this.getArrList2()
      this.getEquipment()
      //返回是不是条这里
      localStorage.setItem('leakandrepairsHistory', false)
    } else {
      // 是否跳转至我的历史页面
      if (localStorage.getItem('leakandrepairsHistory') == 'true') {
        // this.tabIndex = 2// 配合调用tab.vue子组件方法的变量
        // this.$refs.tab.onClick(2)// tab.vue子组件的方法(tab的点击)
        this.getHistoryData()
        this.getArrList2()
        this.getEquipment()
        this.tabIndex = 1;
        this.$refs.tab.onClick(1)
        localStorage.setItem('leakandrepairsHistory', false)
      } else if (localStorage.getItem('leakandrepairsHistory') == 'false') {
        this.getArrList2()
        this.getEquipment()
        this.tabIndex = 0// 配合调用tab.vue子组件方法的变量我设置为2为什么不行 我也不知道
        // this.$refs.tab.onClick(0)// tab.vue子组件的方法(tab的点击)
        this.$refs.tab.onClick(0)
      }
    }
  },
  methods: {
    blur(val, text) {//输入框失去焦点验证
      let message = '';
      if (val === '') {
        switch (text) {
          case 'leakAddress':
            message = "发生地点不能为空"
            break;
          case 'repairRemark':
            message = "备注信息不能为空"
            break;
          case 'contact':
            message = "联系人不能为空"
            break;
          case 'phone':
            message = "联系电话不能为空"
            break;
          default:

            break;
        }
        Toast(message);
      } else {
        if (text == 'phone' && !(/^1[3456789]\d{9}$/.test(this.repairData.phone))) {
          message = '联系电话有误!';
          Toast(message);
        }
      }
    },
    onLoad(e) {//下拉加载更多
      // e.stopPropagation()
      // 异步更新数据
      setTimeout(() => {
        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.historyData.length) {
          this.finished = true;
        }

      }, 500);
    },
    scroll(e) {
      if ((parseInt(e.target.clientHeight) + Math.ceil(e.target.scrollTop)) === parseInt(e.target.scrollHeight)) {
        // console.log("到底")
      } else if (e.target.scrollTop == 0) {
        // console.log("到顶")
        e.stopPropagation()
      }
      this.$set(this, 'scrollTop', e.target.scrollTop)
    },
    touchmove(e) {
      if (this.scrollTop !== 0) {
        e.stopPropagation()//阻止冒泡
      }
    },
    onRefresh() {//上拉刷新
      setTimeout(() => {
        this.$toast('刷新成功');
        this.isLoading = false;
        this.emailURL = URLurl;

        if (localStorage.getItem('leakandrepairsHistory') === null) {
          this.getArrList2()
          this.getEquipment()
          localStorage.setItem('leakandrepairsHistory', false)
        } else {
          // 是否跳转至我的历史页面
          if (localStorage.getItem('leakandrepairsHistory') == 'true') {
            // this.tabIndex = 2// 配合调用tab.vue子组件方法的变量
            this.tabIndex = 1;
            this.$refs.tab.onClick(1)
            // this.$refs.tab.onClick(2)// tab.vue子组件的方法(tab的点击)
            this.getHistoryData()
            this.getArrList2()
            this.getEquipment()
            localStorage.setItem('leakandrepairsHistory', false)
          } else if (localStorage.getItem('leakandrepairsHistory') == 'false') {
            this.tabIndex = 0// 配合调用tab.vue子组件方法的变量
            this.$refs.tab.onClick(0)
            // this.$refs.tab.onClick(0)// tab.vue子组件的方法(tab的点击)
            this.getArrList2()
            this.getEquipment()
          }
        }

        // 地图获取地址数据
        this.BUS.$on('getAddress', (address) => {
          this.repairData.leakAddress = address
          this.leakAddress = address;
          this.tabIndex = 0// 配合调用tab.vue子组件方法的变量
          this.$refs.tab.onClick(0)
        })
      }, 500);
    },

    openUserNumData() {
      this.userNumShow = true
      if (this.repairData.groupCode == '') {
        this.getUserNum('')
      } else {
        this.getUserNum(this.repairData.groupCode)
      }
    },
    getUserNum(groupCode) {
      let _this = this
      let params = {//接口入参
        "data": {
          openId: localStorage.getItem('openId'),
          groupCode: groupCode,
        }
      }
      _this.$api.fetch({
        params,//参数
        apiUrl: '/myWater/selfUserList',//接口地址
      }).then(res => {
        _this.userNumData = []
        _this.userNumData = res
        // 获取省份名称
        _this.province = res[0].groupArea.split('市')[0].split('省')[1]+'市';
        _this.userNumColumns = _this.userNumData.map(item => item.userNo)
      })
    },
    //用户编号遮罩层
    selectRelation() {
      this.userNumShow = true;
    },
    // 用户编号返回按钮
    onCancelRelation() {
      this.userNumShow = false;
    },
    // 用户编号遮罩层确定按钮  
    onConfirmRelation(value, index) {
      this.repairData.userNo = value
      for (let i = 0; i < this.userNumData.length; i++) {
        if (this.userNumData[i].userNo == this.repairData.userNo) {
          this.repairData.groupName = this.userNumData[i].groupArea;
          this.repairData.groupCode = this.userNumData[i].groupCode;
          // this.sure([{ code: "020000", name: "广西省" },{ code: "020100", name: "梧州市" },{ code: "02011", name: "河西区" }])
        }
      }
      for (const key in this.areaList.county_list) {//区
        let groupCode = key.slice(4)
        if (this.repairData.groupCode == groupCode) {
          this.areaNum = key;
        } else {
          for (const item in this.areaList.city_list) {//市
            let code = item.slice(2)
            if (this.repairData.groupCode == code) {
              this.areaNum = item;
            }
          }
        }
      }
      this.userNumShow = false;
    },
    // 模块访问
    moduleAccess(groupCode, moduleId) {
      var _this = this;
      let params = {
        "data": {
          "groupCode": groupCode,
          "openId": localStorage.getItem('openId'),
          'moduleId': moduleId,
        },
      }
      this.$api.fetch({
        params: params,
        apiUrl: '/common/moduleVisitAdd',
      }).then(res => {

      })
    },
    // 跳转地图页面
    goMap() {
      if (this.repairData.groupName == '') {
        Toast('请先选择所属地区')
        return
      }
      this.leakandrepairsShow = false
      this.repairMapShow = true
      this.mapNeedData.province = this.province
    },
    // 获取ftoken
    getFtoken() {
      console.log(this.repairData.leakAddress,this.repairData.faultEquipmentType);
      if(this.repairData.leakAddress == ''){
        Toast('发生地点不能为空');
        return
      }else if(this.repairData.faultEquipmentType == ''){
        Toast('故障设备未选');
        return
      }
      var _this = this;
      let params = {//接口入参
        "data": {},
      }
      this.$api.fetch({
        params: params,
        apiUrl: '/file/getFtoken',
      }).then(res => {
        _this.ftoken = res.ftoken
        // 获取到ftoken之后调文件服务器接口取url
        if (_this.repairFileList.length == 0) {
          _this.submit()
          return
        }
        for (let i = 0; i < _this.repairFileList.length; i++) {
          _this.getImgUrl(_this.repairFileList[i].file, i)
        }
      })


      // // 获取到ftoken之后调文件服务器接口取url
      // if (_this.repairFileList.length == 0) {
      //   _this.submit()
      //   return
      // }
      // for (let i = 0; i < _this.repairFileList.length; i++) {
      //   _this.getImgUrl(_this.repairFileList[i].file, i)
      // }
    },
    // 获取图片地址
    getImgUrl(item, i) {
      var _this = this;
      let $formData = new FormData();
      $formData.append('file', item);
      $formData.append('ftoken', _this.ftoken);
      // 产生跨域问题，用降级浏览器测试
      // 需要同时调不同服务器的接口，所以该接口用原生写
      let RequestObj = {
        url: _this.emailURL,
        // url: 'http://192.168.137.193:9986/file/fileUpload',
        method: 'post',
        timeout: 60000,
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
        data: $formData
      };
      axios(RequestObj).then(res => {
        if (res.status === 200) {
          if (res.data.code === 0) {
            _this.fileUrlList[i] = res.data.data.path
            if (_this.fileUrlList.length == _this.repairFileList.length) {
              _this.submit()
            }
          }
        }
      }, err => {

      }).catch(error => {

      })
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`
      } else if (type === 'day') {
        return `${value}日`
      }
      return value;
    },
    // 获取水司数据
    getWater() {
      var _this = this;
      let params = {//接口入参
        "data": {},
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/common/wCompanyList',//接口地址
      }).then(res => {
        _this.waterData = []
        _this.waterData = res
        _this.waterColumns = _this.waterData.map(item => item.groupFullName)

        // mounted放一个调接口方法，其他方法放在这里
        _this.getEquipment()
        // _this.getLeakEquipment()
        // _this.getHistoryData()
      })

    },
    // 显示水司下拉框
    openWater(index) {
      this.index = index
      this.waterShow = true
    },
    // 获取故障设备数据
    getEquipment() {
      var _this = this;
      let params = {//接口入参
        "data": ['equipment'],
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/common/dictDownList',//接口地址
      }).then(res => {
        _this.equipmentData = []
        _this.equipmentData = res.equipment
        _this.equipmentColumns = _this.equipmentData.map(item => item.name)
      })
    },
    // 显示故障设备下拉框
    openEquipment() {
      // this.getEquipment();
      this.equipmentShow = true
    },
    // 水司遮罩层返回按钮
    onCancelWater() {
      this.waterShow = false;
    },

    // 设备遮罩层返回按钮
    onCancelEquipment() {
      this.equipmentShow = false;
    },
    // 设备遮罩层确定按钮
    onConfirmEquipment(value, index) {
      this.repairData.faultEquipmentTypeName = value
      for (let i = 0; i < this.equipmentData.length; i++) {
        if (value == this.equipmentData[i].name) {
          this.repairData.faultEquipmentType = this.equipmentData[i].value
          break
        }

      }

      this.equipmentShow = false;
    },
    // 获取我的历史列表数据
    getHistoryData() {
      var _this = this;
      let params = {//接口入参
        "data": {
          openId: localStorage.getItem('openId'),
          busiType: 2
        },
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/busiListByOpenId',//接口地址
      }).then(res => {
        _this.historyData = res
      })
    },
    // 报障/报漏-确定按钮
    submit() {
      var _this = this;

      // _this.fileUrlList有可能出现该情况：[undefined, undefined，xxxxxx.jpg],此时长度正常，但没有图片地址，以下代码解决该bug
      for (let i = 0; i < _this.fileUrlList.length; i++) {
        if (_this.fileUrlList[i] === undefined) {
          return
        }
      }
      console.log(this.repairData.faultEquipmentType);
      var data = {}
      data = this.repairData
      var params = {//接口入参
        "data": {
          "isSave": 0,
          "groupCode": data.groupCode,
          "busiType": 2,
          "openId": localStorage.getItem('openId'),
          "data": {
            "contact": data.contact,
            "phone": data.phone,
            "faultEquipmentType": data.faultEquipmentType,
            "leakAddress": data.leakAddress,
            "repairRemark": data.repairRemark,
            "repairOrLeak": 1,
            "picture": _this.fileUrlList,
          },
        }

      }

      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/busiApply',//接口地址
      }).then(res => {
        Toast.success('报障成功，我们工作人员会尽快处理')
        setTimeout(() => {
          // _this.moduleAccess(_this.repairData.groupCode, '9')

          _this.repairData = {}
          _this.repairData.repairRemark = '';
          // _this.leakData = {}
          // _this.leakData.repairRemark = '';
          _this.fileUrlList = []
          _this.repairFileList = []
          // _this.tabIndex = 2// 配合调用tab.vue子组件方法的变量
          _this.tabIndex = 1;
          _this.$refs.tab.onClick(1)
          // _this.$refs.tab.onClick(2)// tab.vue子组件的方法(tab的点击)
          _this.getHistoryData()
        }, 2000);
      }).catch(err => {

      })
    },
    // 我的历史详情页
    goLeakandrepairsDetail(item) {
      var content = {}
      content.groupCode = item.groupCode
      content.id = item.id
      content.status = item.status
      content.repairOrLeakDate = item.repairOrLeakDate
      content.repairOrLeak = item.repairOrLeak// 1 报障 2 报漏
      content.source = item.source
      this.$router.push({ path: '/leakandrepairsDetail', query: content })
    },


    // 点击展示地址弹窗
    showAddressChuang() {
      this.relationShow = true
    },
    // 三级联动点击确定按钮事件
    sure(val) {
      console.log(val);
      if (typeof (val[2]) == "undefined" || val[2].code == '') {
        this.repairData.groupCode = val[1].code.slice(2)
        this.repairData.groupName = val[0].name + val[1].name
        this.repairData.groupName = this.repairData.groupName.replace('*', '')
      } else {
        this.repairData.groupCode = val[2].code.slice(4)
        this.repairData.groupName = val[0].name + val[1].name + val[2].name
        this.repairData.groupName = this.repairData.groupName.replace('*', '')
      }
      // this.repairData.groupCode = this.common.codeTrans(this.repairData.groupCode,this.newAreaMap)
      this.repairData.groupCode = this.common.codeTransCity(this.repairData.groupCode,this.newCityMap);
      this.getUserNum(this.repairData.groupCode)
      // 获取省份名称
      this.province = val[1].name
      this.repairData.userNo = '';
      this.relationShow = false
    },
    // 三级联动点击取消按钮事件
    exit() {
      this.relationShow = false
    },
    // 三级联动状态改变事件
    onChange() { },
    getArrList2() {
      let _this = this
      let params = {
        "data": {
          openId: localStorage.getItem('openId'),
          hasWxHall: 1
        },
      }
      _this.$api.fetch({
        params,//参数
        apiUrl: '/common/wAreaTree',//接口地址
      }).then(res => {
        _this.newAreaMap = res.areaMap;
        _this.newCityMap = res.cityMap;
        _this.areaList.province_list = res.provinceMap;//省
        // _this.areaList.city_list = res.cityMap;//市
        // _this.areaList.county_list = res.areaMap;//区
        // _this.areaList.county_list = _this.common.transCode(res.areaMap);//区
        _this.areaList.city_list = _this.common.transCodeCity(res.cityMap);//市
        _this.getBindData()
      })
    },
    // 获取绑定水司
    getBindData() {
      let _this = this
      let params = {
        "data": {},
      }
      _this.$api.fetch({
        params,//参数
        apiUrl: '/common/getUserInfo',//接口地址
      }).then(res => {

        let bindData = res.bwcList
        console.log(bindData);
        if (bindData.length > 0) {
          _this.repairData.groupCode = bindData[0].groupCode
          _this.repairData.groupName = bindData[0].groupName
          _this.repairData.phone = bindData[0].mobile
          _this.repairData.contact = bindData[0].contact
          _this.getUserNum(this.repairData.groupCode)

          _this.province = bindData[0].provice

          let incode = _this.repairData.groupCode;
          let countylist = _this.areaList.county_list;//区
          let citylist = _this.areaList.city_list;//市
          let areanum = _this.areaNum;
          _this.areaNum = _this.common.companyTree(incode, countylist, citylist, areanum);
        } else {
          _this.getGeolocation()
        }
      })
    },
    // 获取离当前位置最近的水司
    getSpaceNum(longitude, latitude) {
      let _this = this
      let params = {
        "data": {
          'longitude': longitude,
          'latitude': latitude,
        },
      }
      _this.$api.fetch({
        params,//参数
        apiUrl: '/common/getShortestComp',//接口地址
      }).then(res => {
        _this.$set(_this.repairData, 'groupCode', res.groupCode)
        _this.$set(_this.repairData, 'groupName', res.groupArea)
        _this.getUserNum(_this.repairData.groupCode)

        _this.province = bindData[0].provice
      })
    },
    // 获取当前位置经纬度
    getGeolocation() {
      let _this = this
      var map = new AMap.Map('container', {
        resizeEnable: true
      });
      AMap.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：5s
          buttonPosition: 'RB',    //定位按钮的停靠位置
          buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点

        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition(function (status, result) {
          if (status == 'complete') {
            _this.getSpaceNum(result.position.lng, result.position.lat)
          } else {
            // _this.onError(result)
          }
        });
      });
    },

    // 撤回
    reCall(e, item) {
      var _this = this;
      e.stopPropagation()//阻止冒泡
      Dialog.confirm({
        title: '是否确认撤回？',
      }).then(() => {
        let params = {//接口入参
          "data": {
            "groupCode": item.groupCode,
            "busiId": item.id,
            "busiType": 2,
            "source": '',
          },
        }
        if (item.source == 1) {
          params.data.source = 1
        }else {
          params.data.source = 2
        }
        this.$api.fetch({
          params: params,//参数
          apiUrl: '/myWater/busiReCall',//接口地址
        }).then(res => {
          Toast.success({
            message: '撤回成功！',
            position: 'middle',
            duration: 2000
          });
          setTimeout(() => {
            _this.getHistoryData()
            _this.getArrList2()
            _this.getEquipment()
          }, 2000);
        })
      }).catch(() => {
      });
    },
    //tab点击事件
    tabClick(num) {
      let _this = this;
      // console.log($('#yh-tab .active').html());
      this.$nextTick(() => {
        if ($('#yh-tab .active').html() == '报修/报漏') {
          _this.getEquipment()
        } else if ($('#yh-tab .active').html() == '报漏') {
          // if (sessionStorage.getItem('leakEquipmentId') !== '0') {
          //   _this.getLeakEquipment();
          // }
          // sessionStorage.setItem('leakEquipmentId', '0')
          _this.getLeakEquipment();
        } else if ($('#yh-tab .active').html() == '进度查询') {
          // if (sessionStorage.getItem('historyDataId') !== '0') {
          //   _this.getHistoryData();
          // }
          // sessionStorage.setItem('historyDataId', '0')
          _this.getHistoryData();
        }
      })
    },
    //tabItem点击事件
    tabItemClick(e) {
      e.stopPropagation()
    },
    //表单效验
    test(str) {

    }
  }
}
</script>

<style scoped lang="less">
.leak-and-repairs {
  .yh-my-uploader {
    padding: 10px 2%;
    border-bottom: 1px solid #eee;
    .uploader-content {
      border: 1px dashed #a6a7a8;
      height: 80px;
      width: 80px;
      color: #a6a7a8;
      border-radius: 4px;
      text-align: center;
      padding-top: 10px;

      position: relative;
      top: 50%;
      transform: translateY(-50%); /* 元素往下位移自身高度50%的距离 */
      .van-icon {
        font-size: 34px;
        color: #a6a7a8;
      }
      .uploader-length {
        font-size: 16px;
      }
    }
  }
  .van-radio-group {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    border-bottom: 1px solid #eee;
    .van-radio {
      width: 20% !important;
      padding: 2% 0%;
    }
  }
  .van-cell--required::before {
    position: absolute;
    left: 2px;
    color: #ee0a24;
    font-size: 14px;
    content: "*";
  }
  .span_content {
    padding: 2% 2% 0 2%;
    .add-pic {
      border: 0 !important;
      font-size: 16px;
      color: #323233;
      padding: 10px 2% !important;
    }
    .van-radio-group {
      width: 100%;
      display: flex;
      padding: 1% 1%;
      .van-radio {
        width: 33%;
      }
    }
  }
  .van-cell--large {
    border-bottom: 1px solid #eee !important;
    padding: 10px 2% !important;
  }
  .van-icon-location {
    font-size: 20px;
  }
  .next {
    font-size: 1rem;
    border-radius: 5px;
    width: 90%;
    margin-left: 5%;
    margin-top: 3%;
    margin-bottom: 3%;
    margin-right: 3%;
    height: 2.5rem;
    line-height: 2.5rem;
  }
  .van-cell {
    border-bottom: 1px solid #eee;
    padding: 0 0 0 0;
  }
  .beizhu .van-cell {
    border-bottom: none;
    padding: 0 0 0 0;
  }
  .address {
    // display: inline-block;
    // width: 28%;
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
  }
  .tab-container {
    // padding: 0 10px;
    .buttons-tab {
      // box-shadow: 1px 1px 5px 1px #888;
    }
    .tabs {
      .tab .col-100 {
        width: 99%;
        margin-left: 2%;
      }
    }
  }
  .bottom_content {
    margin: 0px 0px 0px 0px;
    // padding-bottom: 10px;
    // padding-top: 10px;
    .col-100 {
      margin-left: 2%;
    }
    .list {
      margin: 0.5rem 0.5rem 1rem 0;
      box-shadow: 1px 1px 10px 1px #888888;
      ul {
        padding: 10px 10px 0 0;
      }
      .item-content {
        padding: 0 0 0 0;
      }
      li {
        border-bottom: 0;
      }
      .item-inner {
        padding: 10px 0 0 0 !important;
      }
    }
    // .list .item-inner {
    // 	padding: 10px 0 0 0;
    // }
    .col-100 {
      width: 98%;
    }
    .button {
      background-color: white;
      color: #b6b6b6;
      font-size: 1.3rem;
    }
  }
  .item-title-row {
    margin-bottom: 1%;
  }
  .first_content {
    display: inline-block;
    width: 45%;
    border-bottom: #dcdcdc solid 1px;
    padding-left: 0.75rem;
    span {
      font-size: 12px;
      color: #989898;
      font-weight: 600;
    }
    input {
      width: 90%;
      font-size: 15px;
      border: none;
      // font-family: PingFang_Regular;
      font-weight: 300;
      // color: #000000;
    }
  }
  .list li + li .item-content:before {
    background-color: white;
  }
  .second_content {
    display: inline-block;
    width: 35%;
    border-bottom: #dcdcdc solid 1px;
    padding-left: 0.75rem;
    span {
      font-size: 12px;
      color: #adadad;
      // font-family: PingFang_Bold;
      font-weight: 600;
    }
    input {
      width: 90%;
      font-size: 15px;
      border: none;
      // font-family: PingFang_Regular;
      font-weight: 300;
      // color: #000000;
    }
  }
  .second_content:first-child {
    width: 25%;
  }
  .Third_content {
    display: inline-block;
    width: 100%;
    border-bottom: 1px solid #dcdcdc;
    padding-left: 0.75rem;
    span {
      font-size: 12px;
      color: #888888;
      // font-family: PingFang_Bold;
      font-weight: 600;
    }
    input {
      width: 90%;
      font-size: 15px;
      border: none;
      // font-family: PingFang_Regular;
      font-weight: 300;
    }
  }
  .kr-complain {
    margin-top: 10px;
    padding: 10px 20px;
    font-size: 15px;
    box-shadow: 1px 1px 5px 1px #888;
    .kr-div {
      display: flex;
      width: 100%;
      div {
        // width: 47%;
        width: 100%;
        span {
          // font-family: PingFang_Bold;
          font-weight: 600;
          color: #989898;
          font-size: 12px;
        }
        input {
          // font-family: PingFang_Medium;
          color: #000;
          border: 0;
          width: 100%;
          border-bottom: 1px solid #888;
          border-radius: 0px;
        }
      }
      .kr-div-last {
        margin-left: 5%;
      }
    }
    .kr-div-third {
      display: flex;
      width: 100%;
      div {
        width: 30%;
        span {
          // font-family: PingFang_Bold;
          font-weight: 600;
          color: #989898;
          font-size: 12px;
        }
        input {
          // font-family: PingFang_Medium;
          color: #000;
          border: 0;
          width: 100%;
          border-bottom: 1px solid #888;
          border-radius: 0px;
        }
      }
      .kr-div-last {
        .van-radio-group {
          width: 100%;
          display: flex;
          .van-radio {
            width: 100%;
          }
        }
      }
      .kr-radio {
        width: 100%;
        padding: 2% 0;
        span {
          padding: 1% 0;
          font-weight: 600;
          color: #989898;
          font-size: 12px;
        }
      }
    }
    .kr-title {
      p {
        // font-family: PingFang_Bold;
        font-weight: 600;
        color: #989898;
        font-size: 12px;
      }
      input,
      textarea {
        // font-family: PingFang_Medium;
        color: #000;
        border: 0;
        width: 100%;
        border-bottom: 1px solid #888;
        border-radius: 0px;
      }
      .kr-div-last {
        .van-radio-group {
          width: 100%;
          display: flex;
          .van-radio {
            width: 100%;
            .van-radio__label {
              padding: 1% 0;
              font-weight: 600;
              color: #989898;
              font-size: 12px;
            }
          }
        }
      }
      .kr-radio {
        padding: 2% 0;
        span {
          padding: 1% 0;
          font-weight: 600;
          color: #989898;
          font-size: 12px;
        }
      }
    }
  }
  .add_box {
    position: absolute;
    width: 20%;
    right: 4%;
    height: 8%;
    // z-index: 9999;
    .midle-bar {
      float: right;
    }
  }
  .add_box1 {
    top: 61.5%;
  }
  .add_box2 {
    top: 66.5%;
  }
  .list {
    margin: 0;
    .list-title {
      padding: 0;
    }
  }
  .form-list .item-content img {
    position: absolute;
    top: 0.2rem;
    left: 50%;
  }
  .yh-content {
    // box-shadow: 1px 1px 5px 1px #888;
    // margin-top: 10px;
    // margin-left: 2px;
    // margin-right: 2px;
    // margin-bottom: 2px;
    height: 96%;
    overflow-y: auto;
    .yh-parent {
      border-radius: 10px;
      box-shadow: 1px 1px 5px 1px #888;
      margin-bottom: 2%;
      margin-top: 2%;
      margin-left: 2%;
      margin-right: 2%;
      padding: 10px 12px;
      font-size: 15px;
      // font-family: PingFang_Regular;
      font-weight: 300;
      border-bottom: 1px solid #989898;
      .yh-top,
      .yh-middle,
      .yh-bottom {
        padding: 6px 0;
        .returnBtn {
          flex: 1;
          height: 1.6rem;
          line-height: 1.6rem;
          border-radius: 15px;
        }
      }
      .yh-top {
        .yh-status {
          float: right;
          color: #489eff;
        }
      }
      .yh-middle {
        // font-weight: bolder;
      }
    }
  }
  .yh-nodata {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    span {
      font-size: 1rem;
      color: #bbb;
    }
  }
  .box {
    width: 100px;
    height: 100px;
    background-color: #ed702d;
    color: #fff;
    /* Rotate div */
    transform: rotate(45deg);
    -ms-transform: rotate(45deg); /* Internet Explorer */
    -moz-transform: rotate(45deg); /* Firefox */
    -webkit-transform: rotate(45deg); /* Safari 和 Chrome */
    -o-transform: rotate(45deg); /* Opera */

    position: absolute;
    right: -50px;
    top: -50px;
    .text {
      position: absolute;
      bottom: 0;
    }
  }
}
</style>