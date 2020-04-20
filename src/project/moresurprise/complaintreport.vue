<template>
  <div class="complaint-report" v-if="complaintReportShow">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>投诉举报</header-title>
    </page-header> -->
    <page-content>
      <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
      <!-- <myHeader :title="title"></myHeader> -->
      <headerThree :message='message'></headerThree>
      <tab :active="tabIndex" ref="tab" id="yh-tab" @click.native="tabClick(tabIndex)" v-model="activeTab">
        <tab-item title="投诉" name="aaa" @click.native="tabItemClick($event)">
          <!-- <div class="kr-complain">
            <div class="kr-div">

              <div class="kr-edit">
                <span>所属地区</span>
                <input v-model="realTableData.groupName" placeholder="" @bluer="fixBug()" @click="showAddressChuang('real')" readonly>
              </div>
              <div class="kr-div-last">
                <span>联系电话</span>
                <input type="number" v-model="realTableData.phone" @blur="takeInput(realTableData.phone)">
              </div>
            </div>
            <div class="kr-div">
              <div class="kr-type">
                <span>投诉类型</span>
                <van-radio-group v-model="realTableData.complainTypeId">
                  <van-radio :name="item.value" v-for="(item,i) in complaintTypeData" :key='i'>{{item.name}}</van-radio>
                </van-radio-group>
              </div>

            </div>
            <div class="kr-title">
              <p>投诉内容</p>
              <input type="text" v-model="realTableData.complainContent" @bluer="fixBug()">
            </div>
            <van-uploader v-model="realFileList" multiple :max-count="3" style="margin-top: 3%" />
          </div> -->
          <div class="span_content">
            <van-field class="yh-my-blue" v-model="realTableData.groupName" @click="showAddressChuang('real')" readonly required left-icon="location-o" right-icon="arrow" label="所属地区" placeholder="请选择地区" size="large" />
            <van-field class="yh-my-red add-pic" label="投诉类型" required left-icon="chat-o" size="large" disabled />
            <van-radio-group v-model="realTableData.complainTypeId">
              <van-radio :name="item.value" v-for="(item,i) in complaintTypeData" :key='i'>{{item.name}}</van-radio>
            </van-radio-group>
            <van-field label="投诉内容" class="yh-my-blue add-pic" left-icon="comment-o" size="large" />
            <van-cell-group class="beizhu">
              <!-- @blur="blur(realTableData.complainContent,'complainContent')" -->
              <van-field v-model="realTableData.complainContent" rows="1" autosize type="textarea" maxlength="100" show-word-limit placeholder="请输入投诉内容" clearable />
            </van-cell-group>
            <!-- <van-field class="yh-my-blue add-pic" label="添加照片" left-icon="photo-o" size="large" disabled /> -->
            <!-- <van-uploader v-model="realFileList" multiple :max-count="3" /> -->
            <div class="yh-my-uploader">
              <!-- <van-uploader v-model="repairFileList" multiple :max-count="3" /> -->
              <van-uploader v-model="realFileList" multiple :max-count="3">
                <div class="uploader-content">
                  <van-icon name="/wxcss2/static/img/xiangji.png" />
                  <div class="uploader-length">{{realFileList.length}}/3</div>
                </div>
              </van-uploader>
            </div>
            <!-- @blur="blur(realTableData.complainant,'complainant')" -->
            <van-field class="yh-my-red" v-model="realTableData.complainant" left-icon="manager-o" label="联系人" placeholder="请输入联系人" size="large" />
            <!-- @blur="blur(realTableData.phone,'phone')"  -->
            <van-field class="yh-my-blue" v-model="realTableData.phone" left-icon="phone-o" label="联系电话" placeholder="请输入手机号码" size="large" />
            <div>
              <van-button type="info" class="next" @click="getFtoken(1)">提&nbsp;&nbsp;&nbsp;交</van-button>
            </div>
          </div>

        </tab-item>

        <tab-item title="进度查询" name="bbb" @click.native="tabItemClick($event)">
          <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
          <div class="myHistory" @touchmove="touchmove($event)" @scroll="scroll($event)">
            <!-- <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad($event)">
                <van-cell v-for="item in complaintData" :key="item.complainId + '' + item.groupCode" class="yh-content" > -->
            <div v-if="complaintData.length !== 0" v-for="item in complaintData" :key="item.complainId + '' + item.groupCode" class="yh-content" @click="goComplaintreportDetail(item)">
              <div class="yh-top">
                <span class="yh-spanR">{{item.groupName}}</span>
                <span class="yh-spanL">{{item.status}}</span>
              </div>
              <!-- <div class="yh-middle">
                <span>工单单号：</span>
                <span>{{item.source == 1 ? '正在生成中...': item.complainId}}</span>
              </div> -->
              <div class="yh-middle">
                <span>投诉内容：</span>
                <span>{{item.complainContent}}</span>
              </div>
              <div class="yh-bottom">
                <span v-if="item.type == 1">提交时间：</span>
                <span v-else>提交时间：</span>
                <span>{{item.complainDate}}</span>
              </div>
              <div class="yh-bottom" style="display: flex" v-if="(item.status == '未受理' || item.status == '已受理') && item.source != 1">
                <van-button type="info" class="returnBtn" @click="reCall($event, item)">撤&nbsp;&nbsp;&nbsp;回</van-button>
              </div>
            </div>
            <div v-if="complaintData.length == 0" class="yh-nodata">
              <span>您暂无投诉信息。</span>
            </div>
            <!-- </van-cell>
              </van-list> -->
          </div>
          <!-- </van-pull-refresh> -->
        </tab-item>
      </tab>
      <!-- </van-pull-refresh> -->
    </page-content>
    <!-- 所属地区 -->
    <van-popup position="bottom" :style="{ height: '40%' }" v-model="relationShow">
      <van-area :area-list="areaList" :columns-num="2" :value="areaNum" @confirm="sure" @cancel="exit" @change="onChange" />
    </van-popup>
    <van-popup position="bottom" :style="{ height: '40%' }" v-model="complainTypeShow">
      <van-picker class="timepicker" show-toolbar title="投诉类型" :columns="complainTypeColumns" @cancel="onCancelComplainType" @confirm="onConfirmComplainType" />
    </van-popup>
    <van-popup position="bottom" :style="{ height: '40%' }" v-model="reportTypeShow">
      <van-picker class="timepicker" show-toolbar title="举报类型" :columns="reportTypeColumns" @cancel="onCancelReportType" @confirm="onConfirmReportType" />
    </van-popup>
  </div>
  <!-- (业务逻辑修改，上传附件页面弃用) -->
  <complaintUpload v-else :upLoadNeedData="upLoadNeedData"></complaintUpload>

</template>

<script>
import myHeader from '@/comments/myHeader'
import headerThree from '@/comments/headerThree';
import complaintUpload from '../moresurprise/complaintUpload'
import axios from 'axios'
import { Toast, PullRefresh, Dialog } from 'vant';
export default {
  components: {
    myHeader,
    complaintUpload,
    headerThree
  },
  data() {
    return {
      newAreaMap:{},
      newCityMap:{},
      message: {
        title: "投诉建议",
        span1:"尊敬的"+(localStorage.getItem('nickname') === null? 'XX':localStorage.getItem('nickname')),
        span2: "感谢您提出的宝贵建议",
        span3: "我们将尽快处理并给予反馈",
        isShow: '',
      },
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离
      //下拉加载
      loading: false,
      finished: false,

      title: '投诉建议',
      tabIndex: 0,
      complaintReportShow: true,
      upLoadNeedData: [],
      realFileList: [],
      reportFileList: [],
      fileUrlList: [],
      fileList: [],
      //投诉数据
      realTableData: {
        "groupCode": "",
        "complainant": "",
        "phone": "",
        "complainTypeId": "",
        "complainContent": "",
        "picture": []
      },
      //举报数据
      reportTableData: {
        "groupCode": "",
        "complainant": "",
        "phone": "",
        "complainTypeId": "",
        "complainContent": "",
        "picture": []
      },
      // 我的投诉数据
      complaintData: [],
      // 水司下拉框数据
      waterShow: false,
      waterColumns: [],
      waterData: [],
      // 投诉类型下拉框数据
      complainTypeShow: false,
      complainTypeColumns: [],
      complaintTypeData: [],
      // 举报类型下拉框数据
      reportTypeShow: false,
      reportTypeColumns: [],
      reportTypeData: [],

      relationShow: false,
      //  地址三级联动数据
      //   地址弹窗标识
      showAddress: false,
      // 当前选中的省市区code
      areaNum: "01013",
      // 省市区列表
      areaList: {},
      userlist: {},
      addressFor: '',
      emailURL: '',
      activeTab: 'bbb',

      myAddress: [],
    }
  },
  created() {
    // 关闭输入法后页面不回弹bug
    document.body.addEventListener('focusout', () => {
      // 回到原点  若觉得一瞬间回到底部不够炫酷，那自己可以自定义缓慢回弹效果， 可用css 、贝塞尔曲线、js的 requestAnimationFrame  等等 方法 实现体验性更好的回弹效果
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    })
    //苹果手机不能自动复原键盘的bug
    // setTimeout(() => {
    //   window.scrollTo(0, 0)
    //   this.showPice = true;
    // }, 500);
    console.log(this.activeTab, URLurl);
    this.emailURL = URLurl;
    // 从首页进去，不跳至我的投诉举报-我的历史页面
    // localStorage.setItem('ComplaintHistory', false)
    if (localStorage.getItem('ComplaintHistory') === null) {
      localStorage.setItem('ComplaintHistory', false)
      this.getArrList2()
      this.getComplaint()
    } else {
      // 是否跳转至我的历史页面
      if (localStorage.getItem('ComplaintHistory') == 'true') {
        // this.tabIndex = 2// 配合调用tab.vue子组件方法的变量
        localStorage.setItem('ComplaintHistory', false)
        this.myComplaint()
        this.getArrList2()
        this.tabIndex = 1;
        this.$refs.tab.onClick(1)
        // this.$refs.tab.onClick(2)// tab.vue子组件的方法(tab的点击)
      } else if (localStorage.getItem('ComplaintHistory') == 'false') {
        // this.$refs.tab.onClick(0)// tab.vue子组件的方法(tab的点击)
        this.getArrList2()
        this.getComplaint()
        this.tabIndex = 0// 配合调用tab.vue子组件方法的变量
        this.$refs.tab.onClick(0)
      }
    }


    // 接收上传图片页面的base64转码图片(业务逻辑修改，以下代码弃用)
    // this.BUS.$on('complainFileList', (item) => {
    //   this.fileList = item
    //   return
    //   this.getFtoken()

    // })

  },
  mounted() {

  },
  destroyed() {
    // sessionStorage.setItem('complaintId', '');
    // sessionStorage.setItem('myComplaintId', '');
    // sessionStorage.setItem('reportId', '')
  },
  methods: {
    blur(val, text) {//输入框失去焦点验证
      let message = '';
      if (val === '') {
        switch (text) {
          case 'complainContent':
            message = "投诉内容不能为空"
            break;
          case 'complainant':
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
        if (text == 'phone' && !(/^1[3456789]\d{9}$/.test(this.realTableData.phone))) {
          message = '联系电话有误!';
          Toast(message);
        }
      }
    },
    onLoad(e) {//下拉加载更多
      // e.stopPropagation()
      // 异步更新数据
      setTimeout(() => {
        console.log('1111');
        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.complaintData.length) {
          this.finished = true;
        }

      }, 500);
    },
    fixBug() {
      setTimeout(() => {
        window.scrollTo(0, 0)
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
        // this.tabIndex = 2// 配合调用tab.vue子组件方法的变量
        // this.$refs.tab.onClick(2)// tab.vue子组件的方法(tab的点击)
        this.myComplaint()
        this.getArrList2()
        this.tabIndex = 1;
        this.$refs.tab.onClick(1)
        localStorage.setItem('ComplaintHistory', false)
      }, 500);
    },

    // 模块访问
    moduleAccess(groupCode) {
      var _this = this;
      let params = {//接口入参
        "data": {
          "groupCode": groupCode,
          "openId": localStorage.getItem('openId'),
          'moduleId': '8',
        },
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/common/moduleVisitAdd',//接口地址
      }).then(res => {

      })
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
      })
    },
    // 获取投诉类型数据
    getComplaint() {
      var _this = this;
      let params = {//接口入参
        "data": ['complaint'],
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/common/dictDownList',//接口地址
      }).then(res => {
        _this.complaintTypeData = []
        _this.complaintTypeData = res.complaint
        _this.complainTypeColumns = _this.complaintTypeData.map(item => item.name)
        // _this.complainTypeShow = true
      })
    },
    // 获取举报类型数据
    getReport() {
      var _this = this;
      let params = {//接口入参
        "data": ['report'],
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/common/dictDownList',//接口地址
      }).then(res => {
        _this.reportTypeData = []
        _this.reportTypeData = res.report
        _this.reportTypeColumns = _this.reportTypeData.map(item => item.name)
        // _this.reportTypeShow = true
      })
    },
    // 获取ftoken
    getFtoken(index) {
      console.log(this.realTableData.groupName, this.realTableData.complainTypeId, this.realTableData.complainContent);
      if (this.realTableData.groupName == '') {
        Toast('所诉地区不能为空');
        return
      } else if (this.realTableData.complainTypeId == '') {
        Toast('投诉类型不能为空');
        return
      }
      // else if(this.realTableData.complainContent == ''){
      //   Toast('投诉内容不能为空');
      //   return
      // }
      var _this = this;
      let params = {//接口入参
        "data": {},
      }
      this.$api.fetch({
        params: params,
        apiUrl: '/file/getFtoken',
      }).then(res => {
        _this.ftoken = res.ftoken
        if (index == 1) {
          if (_this.realFileList.length == 0) {
            _this.submit(1)
            return
          }
          // 获取到ftoken之后调文件服务器接口取url
          for (let i = 0; i < _this.realFileList.length; i++) {
            _this.getImgUrl(_this.realFileList[i].file, index, i)
          }
        } else if (index == 2) {
          if (_this.reportFileList.length == 0) {
            _this.submit(2)
            return
          }
          // 获取到ftoken之后调文件服务器接口取url
          for (let i = 0; i < _this.reportFileList.length; i++) {
            _this.getImgUrl(_this.reportFileList[i].file, index, i)
          }
        }

      })
    },
    // 获取图片地址
    getImgUrl(item, index, i) {
      var _this = this;
      let $formData = new FormData();
      $formData.append('file', item);
      $formData.append('ftoken', this.ftoken);
      // 产生跨域问题，用降级浏览器测试
      // 需要同时调不同服务器的接口，所以该接口用原生写
      let RequestObj = {
        // url: 'http://10.13.1.248:10041/fileService/fileUpload',//公司
        // url: 'http://219.139.169.234:9992/fileService/fileUpload',//赤壁水司
        url: _this.emailURL,
        method: 'post',
        timeout: 60000,
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
        data: $formData
      };
      axios(RequestObj).then(res => {
        if (res.status === 200) {
          if (res.data.code === 0) {
            // _this.fileUrlList.push(res.data.data.path)
            _this.fileUrlList[i] = res.data.data.path
            if (index == 1) {
              if (_this.fileUrlList.length == _this.realFileList.length) {
                _this.submit(index)
              }
            } else if (index == 2) {
              if (_this.fileUrlList.length == _this.reportFileList.length) {
                _this.submit(index)
              }
            }
          }
        }
      }, err => {

      }).catch(error => {

      })
    },
    // 我的投诉列表数据
    myComplaint() {
      var _this = this;
      let params = {//接口入参
        "data": {
          openId: localStorage.getItem('openId'),
          busiType: 3
        }
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/busiListByOpenId',//接口地址
      }).then(res => {
        this.complaintData = res
      })
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
            "busiId": item.complainId,
            "busiType": 3,
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
            _this.myComplaint()
            _this.getArrList2()
          }, 2000);
        })
      }).catch(() => {
      });
    },
    // 我的历史详情页
    goComplaintreportDetail(item) {
      var content = {}
      content.groupCode = item.groupCode
      content.complainId = item.complainId
      content.complainDate = item.complainDate
      content.status = item.status
      content.type = item.type
      content.source = item.source
      this.$router.push({ path: '/complaintreportDetail', query: content })
    },
    takeChange() {
      this.waterShow = true
    },
    // 跳转上传图片页面
    goUpload() {
      this.complaintReportShow = false
      this.upLoadNeedData.type = 'add'
      this.fileUrlList = []
    },
    // 显示水司下拉框
    openWater() {
      this.waterShow = true

    },
    // 显示投诉类型下拉框
    openComplainType() {
      // this.getComplaint()
      this.complainTypeShow = true
    },
    // 显示投诉类型下拉框
    openReportType() {
      // this.getReport()
      setTimeout(() => {
        window.scrollTo(0, 0)
        this.reportTypeShow = true
      }, 500);
    },
    // 水司遮罩层返回按钮
    onCancelWater() {
      this.waterShow = false;
    },
    // 水司遮罩层确定按钮
    onConfirmWater(value, index) {
      this.tableData.groupFullName = value
      for (let i = 0; i < this.waterData.length; i++) {
        if (value == this.waterData[i].groupFullName) {
          this.tableData.groupCode = this.waterData[i].groupCode
          break;
        }
      }
      this.waterShow = false;
    },
    // 投诉类型遮罩层返回按钮
    onCancelComplainType() {
      this.complainTypeShow = false;
    },
    // 投诉类型遮罩层确定按钮
    onConfirmComplainType(value, index) {
      this.realTableData.complainTypeName = value
      for (let i = 0; i < this.complaintTypeData.length; i++) {
        if (value == this.complaintTypeData[i].name) {
          this.realTableData.complainTypeId = this.complaintTypeData[i].value
        }
      }
      this.complainTypeShow = false;
    },
    // 举报类型遮罩层返回按钮
    onCancelReportType() {
      this.reportTypeShow = false;
    },
    // 举报类型遮罩层确定按钮
    onConfirmReportType(value, index) {
      this.reportTableData.complainTypeName = value
      for (let i = 0; i < this.reportTypeData.length; i++) {
        if (value == this.reportTypeData[i].name) {
          this.reportTableData.complainTypeId = this.reportTypeData[i].value
        }
      }
      this.reportTypeShow = false;
    },
    // 确定按钮
    submit(index) {
      var _this = this;

      if (index == 1) {
        if (_this.realTableData.groupCode == '') {
          Toast('所属地区不能为空！')
          return
        }
        // else if (_this.realTableData.complainant == '') {
        //   Toast('投诉人不能为空！')
        //   return
        // } 
        else if (_this.realTableData.complainTypeName == '') {
          Toast('投诉类型必选！')
          return
        }
        //  else if (_this.realTableData.complainContent == '') {
        //   Toast('投诉内容不能为空！')
        //   return
        // }
      } else if (index == 2) {
        if (_this.reportTableData.groupCode == '') {
          Toast('所属地区不能为空！')
          return
        } else if (_this.reportTableData.complainant == '') {
          Toast('举报人不能为空！')
          return
        } else if (_this.reportTableData.complainTypeName == '') {
          Toast('举报类型必选！')
          return
        } else if (_this.reportTableData.complainContent == '') {
          Toast('举报内容不能为空！')
          return
        }
      }
      // _this.fileUrlList有可能出现该情况：[undefined, undefined，xxxxxx.jpg],此时长度正常，但没有图片地址，以下代码解决该bug
      for (let i = 0; i < _this.fileUrlList.length; i++) {
        if (_this.fileUrlList[i] === undefined) {
          return
        }
      }
      if (index == 1) {
        var params = {//接口入参
          "data": {
            "openId": localStorage.getItem('openId'),
            "busiType": 3,
            "isSave": 0,
            "groupCode": this.realTableData.groupCode,

            "data": {
              "complainant": this.realTableData.complainant,
              "phone": this.realTableData.phone,
              "complainant": this.realTableData.complainant,
              "complainTypeId": this.realTableData.complainTypeId,
              "complainContent": this.realTableData.complainContent,
              "picture": this.fileUrlList,
              "type": index
            },


          }
        }
      } else if (index == 2) {
        var params = {//接口入参
          "data": {
            "openId": localStorage.getItem('openId'),
            "busiType": 3,
            "isSave": 0,
            "groupCode": this.reportTableData.groupCode,

            "data": {
              "complainant": this.reportTableData.complainant,
              "phone": this.reportTableData.phone,
              "complainant": this.reportTableData.complainant,
              "complainTypeId": this.reportTableData.complainTypeId,
              "complainContent": this.reportTableData.complainContent,
              "picture": this.fileUrlList,
              "type": index
            },
          }
        }
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/busiApply',//接口地址
      }).then(res => {
        if (index == 1) {
          Toast.success('投诉成功！我们工作人员会尽快处理')
        } else if (index == 2) {
          Toast.success('举报成功！我们工作人员会尽快处理')
        }
        setTimeout(() => {
          if (index == 1) {
            // _this.moduleAccess(_this.realTableData.groupCode)
            _this.realTableData = {}
            _this.realFileList = []
            _this.fileUrlList = []
            // _this.tabIndex = 2// 配合调用tab.vue子组件方法的变量
            // _this.$refs.tab.onClick(2)// tab.vue子组件的方法(tab的点击)
            _this.myComplaint()
            _this.tabIndex = 1;
            _this.$refs.tab.onClick(1)
          } else if (index == 2) {
            // _this.moduleAccess(_this.reportTableData.groupCode)
            _this.reportTableData = {}
            _this.reportFileList = []
            _this.fileUrlList = []
            // _this.tabIndex = 2// 配合调用tab.vue子组件方法的变量
            // _this.$refs.tab.onClick(2)// tab.vue子组件的方法(tab的点击)
            _this.myComplaint()
            _this.tabIndex = 1;
            _this.$refs.tab.onClick(1)
          }

        }, 2000);
      })
    },
    //联系电话的校验  
    takeInput(num) {
      let message = '';
      if (num == '') {
        message = '手机号码不能为空!'
        Toast(message)
      } else if (!(/^1[3-9]\d{9}$/).test(num)) {
        message = '手机号码格式不正确!'
        Toast(message)
      }
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 500);
    },


    // 点击展示地址弹窗
    showAddressChuang(content) {
      this.addressFor = content
      setTimeout(() => {
        window.scrollTo(0, 0)
        this.relationShow = true
      }, 500);
    },
    // 三级联动点击确定按钮事件
    sure(val) {
      if (typeof (val[2]) == "undefined" || val[2].code == '') {
        if (this.addressFor == 'real') {
          this.realTableData.groupCode = val[1].code.slice(2)
          this.realTableData.groupName = val[0].name + val[1].name
          this.realTableData.groupName = this.realTableData.groupName.replace('*', '')
        } else if (this.addressFor == 'report') {
          this.reportTableData.groupCode = val[1].code.slice(2)
          this.reportTableData.groupName = val[0].name + val[1].name
          this.reportTableData.groupName = this.reportTableData.groupName.replace('*', '')
        }
      } else {
        if (this.addressFor == 'real') {
          this.realTableData.groupCode = val[2].code.slice(4)
          this.realTableData.groupName = val[0].name + val[1].name + val[2].name
          this.realTableData.groupName = this.realTableData.groupName.replace('*', '')
        } else if (this.addressFor == 'report') {
          this.reportTableData.groupCode = val[2].code.slice(4)
          this.reportTableData.groupName = val[0].name + val[1].name + val[2].name
          this.reportTableData.groupName = this.reportTableData.groupName.replace('*', '')
        }
      }
      this.realTableData.groupCode = this.common.codeTransCity(this.realTableData.groupCode,this.newCityMap);
      this.reportTableData.groupCode = this.common.codeTransCity(this.reportTableData.groupCode,this.newCityMap);
      // this.realTableData.groupCode = this.common.codeTrans(this.realTableData.groupCode,this.newAreaMap)
      // this.reportTableData.groupCode = this.common.codeTrans(this.reportTableData.groupCode,this.newAreaMap)
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
          _this.realTableData.groupCode = bindData[0].groupCode
          _this.realTableData.groupName = bindData[0].groupName
          _this.realTableData.phone = bindData[0].mobile
          _this.realTableData.complainant = bindData[0].contact

          let incode = _this.realTableData.groupCode;
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
        _this.$set(_this.realTableData, 'groupCode', res.groupCode)
        _this.$set(_this.realTableData, 'groupName', res.groupArea)
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

    //tab点击事件
    tabClick(num) {
      console.log($('#yh-tab .active').html())
      let _this = this;
      this.$nextTick(() => {
        if ($('#yh-tab .active').html() == '投诉') {
          _this.getComplaint()
        } else if ($('#yh-tab .active').html() == '举报') {
          // if (sessionStorage.getItem('complaintId') !== '0') {
          //   _this.getReport()
          // }
          // sessionStorage.setItem('complaintId', '0')
        } else if ($('#yh-tab .active').html() == '进度查询') {
          // if (sessionStorage.getItem('myComplaintId') !== "0") {
          //   _this.myComplaint();
          // }
          // sessionStorage.setItem('myComplaintId', '0')
          _this.myComplaint();
        }
      })
    },
    //tabItem点击事件
    tabItemClick(e) {
      e.stopPropagation()
    },
  },
}
</script>

<style scoped lang="less">
.complaint-report {
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
    border-bottom: 1px solid #eee;
    .van-radio {
      width: 33% !important;
    }
  }
  .van-uploader {
    margin-left: 4%;
    margin-right: 3%;
    margin-top: 1%;
  }
  .van-cell-group {
    border-bottom: 1px solid #eee;
  }
  .beizhu {
    border-bottom: none;
  }
  .van-cell--required::before {
    position: absolute;
    left: 8px;
    color: #ee0a24;
    font-size: 14px;
    content: "*";
  }
  .span_content {
    padding: 2% 2%;
    .add-pic {
      padding-bottom: 0;
      border: 0 !important;
      font-size: 16px;
      color: #323233;
    }
    .van-cell--large {
      padding-top: 10px;
      padding-bottom: 10px;
    }
    .van-radio-group {
      width: 100%;
      display: flex;
      padding: 1% 1%;
      .van-radio {
        width: 100%;
      }
    }
  }
  .van-cell--large {
    border-bottom: 1px solid #eee !important;
  }
  #yh-tab {
    .myHistory {
      .van-list {
        height: 100%;
      }
    }
  }
  .img_content {
    // height: auto;
    height: 9rem;
    // padding: 0 0 5% 0;
  }
  .van-uploader__upload {
    border: 2px dashed #4da1ff;
  }
  .next {
    font-size: 1rem;
    border-radius: 5px;
    width: 90%;
    margin-right: 1%;
    margin-left: 5%;
    margin-top: 3%;
    margin-bottom: 3%;
    height: 2.5rem;
    line-height: 2.5rem;
  }
  .tab-container {
    // padding: 0 10px;
    .buttons-tab {
      box-shadow: 1px 1px 5px 1px #888;
    }
    .tabs {
      margin-top: 10px !important;
      .tab {
        .col-100 {
          width: 98.8%;
          margin-left: 2%;
        }
      }
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
          color: #989898;
          font-size: 12px;
        }
        input {
          caret-color: auto;
          display: block;
          // font-family: PingFang_Medium;
          color: #000;
          border: 0;
          width: 100%;
          border-bottom: 1px solid #888;
          border-radius: 0px;
        }
        input:focus {
          outline: 0;
          caret-color: #489eff;
        }
      }
      .kr-type {
        span {
          padding: 2% 0;
        }
        .van-radio {
          width: 33%;
          .van-radio__label {
            color: #989898;
            font-size: 16px;
          }
        }
      }
      .kr-not-edit {
        input {
          height: 100%;
          line-height: 100%;
          font-size: 20px;
          // font-family: PingFang_Bold;
        }
      }
      .kr-div-last {
        margin-left: 5%;
      }
    }
    .kr-title {
      p {
        // font-family: PingFang_Bold;
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
  }
  .yh-content {
    margin-top: 10px;
    padding: 10px 20px;
    font-size: 15px;
    box-shadow: 1px 1px 5px 1px #888;
    border-radius: 10px;
    .yh-top {
      // border-bottom: 1px solid #989898;
      padding: 0 0 6px 0;
      span {
        // font-family: PingFang_Medium;
      }
      .yh-spanL {
        float: right;
        color: #489eff;
      }
    }
    .yh-middle {
      padding: 10px 0;
    }
    .yh-bottom {
      text-align: right;
      color: #989898;
      .returnBtn {
        flex: 1;
        height: 1.6rem;
        line-height: 1.6rem;
        border-radius: 15px;
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
  .item-title-row {
    margin-bottom: 1%;
  }
  .first_content {
    display: inline-block;
    width: 45%;
    border-bottom: #dcdcdc solid 1px;
    padding-left: 0.75rem;
    span {
      font-size: 13px;
      color: #989898;
      // font-family: PingFang_Bold;
    }
    input {
      width: 90%;
      font-size: 15px;
      border: none;
      // font-family: PingFang_Regular;
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
      font-size: 13px;
      color: #adadad;
      // font-family: PingFang_Bold;
    }
    input {
      width: 90%;
      font-size: 15px;
      border: none;
      // font-family: PingFang_Regular;
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
      font-size: 13px;
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
  .add_box {
    position: absolute;
    width: 20%;
    top: 60.5%;
    right: 4%;
    height: 8%;
    // z-index: 9999;
    .midle-bar {
      float: right;
    }
  }
  .header-pic {
    padding: 5px 5px 0 5px;
  }
  .list {
    margin: 0;
    .list-title {
      padding: 0;
    }
  }
  table {
    th {
      background: #51a5e8;
      color: #fff;
      padding: 0.2rem;
    }
    td {
      text-align: center;
      border-bottom: 1px solid #00b4c2;
      padding: 0.2rem;
    }
  }
  .form-list .item-content img {
    position: absolute;
    top: 0.2rem;
    left: 50%;
  }
}
</style>