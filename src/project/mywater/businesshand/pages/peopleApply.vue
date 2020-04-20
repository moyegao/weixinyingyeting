<template>
  <div class="peopleApply">
    <page-content>
      <div class="content-padded">
        <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
        <!-- <myHeader :title="title" class="myheader"></myHeader> -->
        <headerThree :message='message'></headerThree>
        <div class="yh-body" @touchmove="touchmove($event)" @scroll="scroll($event)">
          <span class="span_content" v-show="contentShowA" @touchmove="touchmove($event)" @scroll="scroll($event)">
            <van-radio-group v-model="applyType" @change="applyTypeChange" v-if="!isQuery">
              <span class="radio_span">
                <van-radio name="1">居民用水申请</van-radio>
              </span>
              <span class="radio_span">
                <van-radio name="2">企业用水申请</van-radio>
              </span>
            </van-radio-group>
            <van-field class="yh-my-blue" v-model="tableData.groupName" left-icon="location-o" @click="showAddressChuang" readonly required label="所属地区" :right-icon="icon" placeholder="请选择地区" size="large" />
            <!-- @blur="blur(tableData.ctmName,'ctmName')" -->
            <van-field class="yh-my-red" v-model="tableData.ctmName" left-icon="user-o" :readonly="isReadyonly" clearable label="业主名称" required :placeholder="isReadyonly?'-':'请输入业主名称'" size="large" />
            <!-- @blur="blur(tableData.ctmIdCard,'ctmIdCard')" -->
            <van-field class="yh-my-blue" v-model="tableData.ctmIdCard" left-icon="idcard" :readonly="isReadyonly" clearable label="业主身份证号码" required oninput="this.value=this.value.replace(/[^0-9xX]+/,'');" :placeholder="isReadyonly?'-':'请输入身份证号码'" size="large" />
            <!-- @blur="blur(tableData.userAddress,'userAddress')"  -->
            <van-field class="yh-my-red" v-model="tableData.userAddress" left-icon="wap-home-o" :readonly="isReadyonly" clearable label="用水地址" required :placeholder="isReadyonly?'-':'请输入用水地址'" size="large" />
            <!-- @blur="blur(tableData.operatorPhone,'operatorPhone')"  -->
            <van-field class="yh-my-blue" v-model="tableData.operatorPhone" left-icon="phone-o" :readonly="isReadyonly" clearable label="手机号码" :placeholder="isReadyonly?'-':'请输入手机号码'" type="number" required oninput="this.value=this.value.replace(/[^0-9]+/,'');" size="large" />
            <!-- @blur="blur(tableData.predictUser,'predictUser')"  -->
            <van-field class="yh-my-red" v-model="tableData.predictUser" left-icon="friends-o" :readonly="isReadyonly" clearable type="number" required oninput="this.value=this.value.replace(/[^0-9]+/,'');" label="预估月用水人数" :placeholder="isReadyonly?'-':'请输入用水人数'" size="large" />
            <!-- @blur="blur(tableData.predictWater,'predictWater')"  -->
            <van-field class="yh-my-blue" v-model="tableData.predictWater" left-icon="bar-chart-o" :readonly="isReadyonly" clearable label="预估月用水量" :placeholder="isReadyonly?'-':'请输入用水量'" oninput="this.value=this.value.replace(/[^0-9.]+/,'');" type="number" size="large" />
            <van-field class="yh-my-red" v-model="tableData.applyReason" left-icon="comment-o" :readonly="isReadyonly" clearable label="申请原因" :placeholder="isReadyonly?'-':'请输入申请原因'" size="large" />
            <div class="submit_box" v-if="btnShow">
              <!-- !($route.query.isModify == 0) && -->
              <van-button type="info" class="submit_btn" @click="submit(1,'A')" v-if="isShowBtn">暂 存</van-button>
              <van-button type="info" class="submit_btn" @click="nextA" v-if="btnShow">下一步</van-button>
            </div>
            <div class="yh-footer" v-if="btnShow">
              <div class="yh-info" @click="takeInfo()">
                <img src="../../../../../static/img/shouzhi(1).png" alt="">
                <span class="kr-span kr-info">报装说明</span>
                <!-- <van-icon v-if="!isShowInfo" name="arrow" />
                <van-icon v-if="isShowInfo" name="arrow-down" /> -->
              </div>
              <div v-if="isShowInfo">
                <span class="kr-span">申请须知：报装用户取得产权证后办理。</span>
                <span class="kr-span">业务咨询电话：9552525</span>
                <span class="kr-span">有关“产权证”说明如下：</span>
                <span class="kr-span">①有效房产证明包括：房产证、不动产证、国有土地使用证、建设用地许可证、规划许可证、集体土地证、直接与房地产公司签订的商品房买卖合同或土地买卖合同。</span>
                <span class="kr-span">②无法提供产权证原件的，用于贷款抵押的需提供银行贷款合同，或房产交易中心出具的房产证复印件，或房产交易与产权档案查询证明等。</span>
                <span class="kr-span">③产权证地址信息不详或地址已变更的，需提供居委会或派出所证明。</span>
              </div>
            </div>
          </span>

          <span class="span_content" v-show="contentShowB" @touchmove="touchmove($event)" @scroll="scroll($event)">
            <div class="top_title">&nbsp;银行代扣资料</div>
            <!-- @blur="blur(bank.openBank,'openBank')"  -->
            <van-field class="yh-my-blue" required left-icon="shop-o" v-model="bank.openBank" :readonly="isReadyonly" label="开户银行：" clearable :placeholder="isReadyonly?'-':'请输入开户银行'" size="large" />
            <!-- @blur="blur(bank.accountName,'accountName')"  -->
            <van-field class="yh-my-red" required left-icon="user-circle-o" v-model="bank.accountName" :readonly="isReadyonly" label="开户名称：" clearable :placeholder="isReadyonly?'-':'请输入开户名称'" size="large" />
            <!-- @blur="blur(bank.bankNo,'bankNo')"  -->
            <van-field class="yh-my-blue" required left-icon="contact" v-model="bank.bankNo" :readonly="isReadyonly" label="银行账户：" :placeholder="isReadyonly?'-':'请输入银行账户'" clearable size="large" />
            <div class="submit_box" v-if="btnShow">
              <van-button type="info" class="submit_btn real" @click="goBackB" v-if="btnShow">上一步</van-button>
              <!-- v-if="!($route.query.isModify == 0)" -->
              <van-button type="info" class="submit_btn real" @click="submit(1,'B')" v-if="isShowBtn">暂 存</van-button>
              <van-button type="info" class="submit_btn real" @click="goWay()">跳 过</van-button>
              <van-button type="info" class="submit_btn real" @click="nextB" v-if="btnShow">下一步</van-button>
            </div>
          </span>

          <span class="span_content" v-show="contentShowC" @touchmove="touchmove($event)" @scroll="scroll($event)">
            <div class="top_title">&nbsp;开票资料</div>
            <!-- @blur="blur(invoice.invoiceTypeName,'invoiceTypeName')" -->
            <van-field class="yh-my-blue" required left-icon="label-o" v-model="invoice.invoiceTypeName" readonly label="发票类型：" clearable :placeholder="isReadyonly?'-':'请选择发票类型'" size="large" :right-icon="icon" @click="selectRelation()" @click-right-icon="selectRelation()" />
            <!-- @blur="blur(invoice.unitName,'unitName')"  -->
            <van-field class="yh-my-red" required left-icon="shop-collect-o" v-model="invoice.unitName" :readonly="isReadyonly" label="单位名称：" :placeholder="isReadyonly?'-':'请输入单位名称'" clearable size="large" />
            <!-- @blur="blur(invoice.identifiNum,'identifiNum')"  -->
            <van-field class="yh-my-blue" required left-icon="user-o" v-model="invoice.identifiNum" :readonly="isReadyonly" label="纳税人识别号：" type="number" oninput="this.value=this.value.replace(/[^0-9.a-zA-Z]+/,'');" :placeholder="isReadyonly?'-':'请输入纳税人识别号'" clearable size="large" />
            <!-- @blur="blur(invoice.mobile,'mobile')"  -->
            <van-field class="yh-my-red" required left-icon="phone-o" v-model="invoice.mobile" :readonly="isReadyonly" label="联系电话：" type="number" oninput="this.value=this.value.replace(/[^0-9]+/,'');" clearable :placeholder="isReadyonly?'-':'请输入联系电话'" size="large" />
            <!-- @blur="blur(invoice.invOpenBank,'invOpenBank')"  -->
            <van-field class="yh-my-blue" required left-icon="gold-coin-o" v-model="invoice.invOpenBank" :readonly="isReadyonly" label="开户银行：" :placeholder="isReadyonly?'-':'请输入开户银行'" clearable size="large" />
            <!-- @blur="blur(invoice.invAccountNo,'invAccountNo')"  -->
            <van-field class="yh-my-red" required left-icon="balance-list-o" v-model="invoice.invAccountNo" :readonly="isReadyonly" label="银行账户：" :placeholder="isReadyonly?'-':'请输入银行账户'" clearable type="number" oninput="this.value=this.value.replace(/[^0-9]+/,'');" size="large" />
            <!-- @blur="blur(invoice.contactAddr,'contactAddr')"  -->
            <van-field class="yh-my-blue" required left-icon="wap-home-o" v-model="invoice.contactAddr" :readonly="isReadyonly" label="联系地址：" clearable :placeholder="isReadyonly?'-':'请输入联系地址'" size="large" />
            <!-- <div class="bottomBtn_content">
              <van-button type="info" class="next" style="float: left;margin-left: 3%" @click="goBackC" v-if="btnShow">上一步</van-button>
              <van-button type="info" class="next" @click="nextC" v-if="btnShow">下一步</van-button>
            </div> -->
            <div class="submit_box" v-if="btnShow">
              <van-button class="yh-my-blue submit_btn" type="info" @click="goBackC" v-if="btnShow">上一步</van-button>
              <!-- v-if="!($route.query.isModify == 0)" -->
              <van-button class="yh-my-red submit_btn" type="info" @click="submit(1,'C')" v-if="isShowBtn">暂 存</van-button>
              <van-button class="yh-my-blue submit_btn" type="info" @click="nextC" v-if="btnShow">下一步</van-button>
            </div>
          </span>

          <span class="span_content" v-show="contentShowD" @touchmove="touchmove($event)" @scroll="scroll($event)">
            <div v-if="PhotoShow1">
              <!-- <span style="color: red">*</span> -->
              <div class="upLoad_title">房产证</div>
              <van-uploader v-model="fileList1" :max-count="1" :deletable='!isReadyonly' />
            </div>

            <div v-if="PhotoShow2">
              <div class="upLoad_title">居民身份证正面</div>
              <van-uploader v-model="fileList2" :max-count="1" :deletable='!isReadyonly' />
            </div>

            <div v-if="PhotoShow3">
              <div class="upLoad_title">居民身份证反面</div>
              <van-uploader v-model="fileList3" :max-count="1" :deletable='!isReadyonly' />
            </div>

            <div v-if="bankPhotoShow">
              <div class="upLoad_title">银行卡照片</div>
              <van-uploader v-model="fileList4" :max-count="1" :deletable='!isReadyonly' />
            </div>

            <!-- <van-button type="info" class="next" style="float: left;margin-left: 3%;margin-top: 10px" @click="goBackD" v-if="btnShow">上一步</van-button>
            <van-button type="info" class="next" style="margin-top: 10px" @click="nextD" v-if="btnShow">下一步</van-button> -->
            <div class="submit_box" v-if="btnShow">
              <van-button type="info" class="submit_btn" @click="goBackD" v-if="btnShow">上一步</van-button>
              <van-button type="info" class="submit_btn" @click="getImgBase64(1)" v-if="(!($route.query.isModify == 0)) && isDraft">暂 存</van-button>
              <van-button type="info" class="submit_btn" @click="nextD" v-if="btnShow">下一步</van-button>
            </div>
          </span>

          <div class="submit_box" v-if="editShow">
            <van-button type="info" class="submit_btn" @click="goBackE" v-if="!btnShow && !($route.query.isModify == 0)">上一步</van-button>
            <van-button :disabled='isClick' type="info" class="submit_btn" @click="getImgBase64(1)" v-if="(!btnShow) && (!($route.query.isModify == 0)) && isDraft">暂存</van-button>
            <van-button :disabled='isClick' type="info" class="submit_btn" @click="getImgBase64(0)" v-if="(!btnShow) && (!($route.query.isModify == 0))">提交</van-button>
          </div>
          <div v-else>
            <van-button type="info" class="next" style="margin-top: 10px" @click="modify">修改</van-button>
          </div>
        </div>

        <!-- </van-pull-refresh> -->
      </div>
    </page-content>

    <!-- 所属地区 -->
    <van-popup position="bottom" :style="{ height: '40%' }" v-model="relationShow">
      <van-area :area-list="areaList" :columns-num="2" :value="areaNum" @confirm="sure" @cancel="exit" />
    </van-popup>

    <!-- 发票类型 -->
    <van-popup position="bottom" :style="{ height: '40%' }" v-model="invoiceTypeShow">
      <van-picker class="timepicker" show-toolbar title="发票类型" :columns="invoiceTypeNameList" @cancel="onCancelRelation" @confirm="onConfirmRelation" />
    </van-popup>
  </div>
  <!-- <compApply v-else></compApply> -->

</template>

<script>
import compApply from './compApply'
import myHeader from '@/comments/myHeader'
import headerThree from '@/comments/headerThree';
import axios from 'axios'
import { Toast, PullRefresh, Dialog } from 'vant';
export default {
  components: {
    myHeader, headerThree, compApply
  },
  data() {
    return {
      newCityMap: {},
      newAreaMap: {},
      isSubmit: 1,//1 为提交 0 为暂存 提交时不能暂存 暂存时不能提交
      isTestErr: true,//暂存按钮效验成功true 失败false
      isShowBtn: true,//是否显示暂存按钮
      // isSyncShow:true,
      icon: 'arrow-down',
      isPeopleShow: 0,//显示居民用水0 企业用水1
      isQuery: false,//是否从进度查询进入
      message: {
        title: "居民用水申请",
        span1: "本业务适用于“居民用水报装”业务，",
        span2: "请您仔细阅读报装说明后填写相关信息",
        isShow: '',
      },
      applyType: '1',
      isShowInfo: false,//说明
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离

      invoiceTypeList: [],
      invoiceTypeNameList: [],
      invoiceTypeShow: false,

      PhotoShow1: true,
      PhotoShow2: true,
      PhotoShow3: true,
      bankPhotoShow: false,
      title: '居民用水申请',
      contentShowA: true,
      contentShowB: false,
      contentShowC: false,
      contentShowD: false,
      btnShow: true,
      bankShow: false,
      invoiceShow: false,
      bank: {
        openBank: '',
        accountName: '',
        bankNo: '',
      },
      invoice: {
        invoiceType: '',
        invoiceTypeName: '',
        unitName: '',
        identifiNum: '',
        mobile: '',
        invOpenBank: '',
        invAccountNo: '',
        contactAddr: '',
      },
      tableData: {
        groupName: '',
        groupCode: '',
        ctmName: '',
        predictWater: '',
        predictUser: '',
        userAddress: '',
        ctmIdCard: '',
      },
      fileList1: [],// 图片1
      fileList2: [],// 图片2
      fileList3: [],// 图片3
      fileList4: [],// 图片4
      fileList: [],// 四张图片文件数组（未经过处理）
      fileUrlList: [],// 添加的图片url路径（已经过处理），未修改图片路径也存于此
      initFileList: [],// 初始化获取的图片对象 res.data.accessory
      isReadyonly: false,
      ftoken: '',
      editShow: true,

      // 所属地区
      relationShow: false,
      //  地址三级联动数据
      //   地址弹窗标识
      showAddress: false,
      // 当前选中的省市区code
      areaNum: "01013",
      // 省市区列表
      areaList: {},
      emailURL: '',
      // 是否允许点击该按钮
      isClick: false,
      // 判断是否显示暂存按钮
      isDraft: true,
    }
  },
  destroyed() {
    Dialog.close()
  },
  mounted() {
    // 从列表页点进来时将是否可以修改字段传予isDraft，用来判断是否显示暂存按钮
    if (this.$route.query.isDraft !== undefined) {
      this.isDraft = this.$route.query.isDraft
    }
    // 是否为草稿状态 暂存按钮的显示与隐藏
    if (this.$route.query.isDraft == true || this.$route.query.busiType == undefined) {
      this.isShowBtn = true
    } else {
      this.isShowBtn = false
    }
    // if(this.$route.query.isSync == '1'){
    //   this.isSyncShow = false;
    // }else{
    //   this.isSyncShow = true;
    // }
    // 关闭输入法后页面不回弹bug
    document.body.addEventListener('focusout', () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    })
    this.emailURL = URLurl;
    if (this.$route.query.isModify == 0) {// 查看，不可修改
      this.isReadyonly = true
      this.icon = '';
      this.iconType = '';
      this.init()
      this.title = '居民用水申请'
      this.contentShowA = true
      this.contentShowB = true
      this.contentShowC = true
      this.contentShowD = true
      this.btnShow = false

      this.isQuery = true;//是否从进度查询进入
    } else if (this.$route.query.isModify == 1) {// 修改
      // this.isReadyonly = false
      // this.init()
      this.isReadyonly = true
      this.icon = '';
      this.iconType = '';
      this.init()
      this.title = '居民用水申请'
      this.contentShowA = true
      this.contentShowB = true
      this.contentShowC = true
      this.contentShowD = true
      this.btnShow = false
      this.editShow = false

      this.isQuery = true;//是否进度查询进入
    } else if (this.$route.query.isModify == 2) {// 添加
      this.isReadyonly = false
      this.getArrList2()
      this.isQuery = false;//是否从进度查询进入
    } else {
      this.isReadyonly = false
      this.getArrList2()
      this.isQuery = false;//是否从进度查询进入
    }
  },
  watch: {
    fileUrlList: {
      handler(newValue, oldValue) {

      },
      deep: true
    },
  },
  methods: {
    blur(val, text) {//输入框失去焦点验证
      let message = '';
      if (this.isReadyonly == true) {
        return
      }
      if (val === '') {
        switch (text) {
          case 'ctmName':
            message = "业主名称不能为空"
            break;
          case 'ctmIdCard':
            message = "业主身份证不能为空"
            break;
          case 'userAddress':
            message = "用水地址不能为空"
            break;
          case 'operatorPhone':
            message = "手机号码不能为空"
            break;
          case 'predictWater':
            message = "预估用水量不能为空"
            break;
          case 'predictUser':
            message = '预估用水量人数不能为空'
            break;

          case 'openBank':
            message = "开户银行不能为空"
            break;
          case 'accountName':
            message = "开户名称不能为空"
            break;
          case 'bankNo':
            message = "银行账户不能为空"
            break;

          // case 'invoiceTypeName':
          //   message = "发票类型不能为空"
          //   break;
          case 'unitName':
            message = "单位名称不能为空"
            break;
          case 'identifiNum':
            message = "纳税人识别号不能为空"
            break;
          case 'mobile':
            message = "联系电话不能为空"
            break;
          case 'invOpenBank':
            message = "开户银行不能为空"
            break;
          case 'invAccountNo':
            message = "银行账户不能为空"
            break;
          case 'contactAddr':
            message = "联系地址不能为空"
            break;
          default:

            break;
        }
        Toast(message);
      } else {
        // debugger
        if (text == 'ctmIdCard' && !/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(val)) {
          message = '业主身份证号有误!';
          Toast(message);
        } else if (text == 'operatorPhone' && !(/^1[3456789]\d{9}$/.test(this.tableData.operatorPhone))) {
          message = '手机号码有误!';
          Toast(message);
        } else if (text == 'mobile' && !(/^1[3456789]\d{9}$/.test(this.invoice.mobile))) {
          message = '联系电话有误!';
          Toast(message);
        } else if (text == 'predictUser') {
          // if ( parseInt(val) > 1000) {
          //   message = '预估用水量人数超出范围!';
          //   Toast(message);
          //   this.tableData.predictUser = '';
          // }else 
          if (val == 0) {
            message = '预估用水量人数不能为0!';
            Toast(message);
            this.tableData.predictUser = '';
          }
        } else if (text == 'predictWater') {
          // if ( parseInt(val) > 1000) {
          //   message = '预估用水量超出范围!';
          //   Toast(message);
          //   this.tableData.predictWater = '';
          // }else 
          if (val == 0) {
            message = '预估用水量不能为0!';
            Toast(message);
            this.tableData.predictWater = '';
          }
        } else if (text == 'invAccountNo' && !/^([1-9]{1})(\d{14}|\d{18})$/.test(this.invoice.invAccountNo)) {
          Toast('银行账户格式有误');
        } else if (text == 'bankNo' && !/^([1-9]{1})(\d{14}|\d{18})$/.test(this.bank.bankNo)) {
          Toast('银行账户格式有误');
        }
      }
    },
    // 用水申请类型变换
    // applyTypeChange(applyType) {
    //   if (applyType == '2') {
    //     let item = {}
    //     item.isModify = '2'
    //     this.$router.push({ path: '/compApply', query: item })
    //   }
    // },
    applyTypeChange(name) {
      this.isPeopleShow = name;
      this.$emit('isPeopleShow', this.isPeopleShow);
    },
    takeInfo() {
      if (!this.isShowInfo) {
        this.isShowInfo = true;
      } else {
        this.isShowInfo = false;
      }
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
        if (this.$route.query.isModify == 0) {// 查看，不可修改
          this.isReadyonly = true
          this.icon = '';
          this.iconType = '';
          this.init()
          this.title = '居民用水申请'
          this.contentShowA = true
          this.contentShowB = true
          this.contentShowC = true
          this.contentShowD = true
          this.btnShow = false
        } else if (this.$route.query.isModify == 1) {// 修改
          this.isReadyonly = false
          this.init()
        } else if (this.$route.query.isModify == 2) {// 添加
          this.isReadyonly = false
          this.getArrList2()
        }
      }, 500);
    },

    getInvoiceType() {//获取发票类型
      let _this = this
      let params = {
        "data": ['invoice'],
      }
      _this.$api.fetch({
        params,//参数
        apiUrl: '/common/dictDownList',//接口地址
      }).then(res => {
        _this.invoiceTypeList = res.invoice;
        for (let i = 0; i < res.invoice.length; i++) {
          _this.invoiceTypeNameList.push(res.invoice[i].name)
        }
        if (_this.$route.query.isModify != 2) {
          for (let i = 0; i < _this.invoiceTypeList.length; i++) {
            if (_this.invoice.invoiceType == _this.invoiceTypeList[i].value) {
              _this.invoice.invoiceTypeName = _this.invoiceTypeList[i].name
            }

          }
        }
      })
    },
    //展开发票类型遮罩层
    selectRelation() {
      this.invoiceTypeShow = true;
    },
    // 发票类型遮罩层返回按钮
    onCancelRelation() {
      this.invoiceTypeShow = false;
    },
    //发票类型
    onConfirmRelation(value, index) {
      this.invoice.invoiceTypeName = value;
      for (let i = 0; i < this.invoiceTypeList.length; i++) {
        if (value == this.invoiceTypeList[i].name) {
          this.invoice.invoiceType = this.invoiceTypeList[i].value;
        }

      }
      this.invoiceTypeShow = false;
    },
    // 初始化
    init() {
      var _this = this;
      let params = {//接口入参
        "data": {
          "groupCode": this.$route.query.groupCode,
          "busiId": this.$route.query.busiId,
          "busiType": this.$route.query.busiType,
          "source": this.$route.query.source,
          // "isModify": this.$route.query.isModify,
        },
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/myWater/busiQuery',//接口地址
      }).then(res => {
        _this.tableData = res.data
        _this.tableData.groupCode = res.groupCode
        _this.tableData.groupName = res.groupArea
        if ('bank' in res.data) {
          if (res.data.bank !== null) {
            _this.bank = res.data.bank
            _this.bankShow = true
          } else {
            _this.contentShowB = false
            _this.bankPhotoShow = false
          }
        } else {
          _this.contentShowB = false
          _this.bankPhotoShow = false
        }
        if ('invoice' in res.data) {
          if (res.data.invoice !== null) {
            _this.invoice = res.data.invoice
            _this.invoiceShow = true
          } else {
            _this.contentShowC = false
          }
        } else {
          _this.contentShowC = false
        }
        // _this.getWater()

        // if (_this.$route.query.isModify == 2) {
        _this.getArrList2()
        // }
        for (let i = 0; i < _this.tableData.accessory.length; i++) {
          // 若path=后面没有地址（无图片），或者url = "" 。则隐藏图片组件
          if (_this.tableData.accessory[i].url.indexOf('path=') > 0) {
            if (_this.tableData.accessory[i].url.split('path=')[1] != '') {
              if (i == 0) {// 显示图片
                _this.PhotoShow1 = true
                _this.fileList1.push({ url: _this.tableData.accessory[i].url })
              } else if (i == 1) {
                _this.PhotoShow2 = true
                _this.fileList2.push({ url: _this.tableData.accessory[i].url })
              } else if (i == 2) {
                _this.PhotoShow3 = true
                _this.fileList3.push({ url: _this.tableData.accessory[i].url })
              } else if (i == 3) {
                _this.bankPhotoShow = true
                _this.fileList4.push({ url: _this.tableData.accessory[i].url })
              }
            } else {
              if (i == 0) {// 没有图片时隐藏上传图片组件
                _this.PhotoShow1 = false
              } else if (i == 1) {
                _this.PhotoShow2 = false
              } else if (i == 2) {
                _this.PhotoShow3 = false
              } else if (i == 3) {
                _this.bankPhotoShow = false
              }
            }
            console.log(i);
          } else {
            if (i == 0) {// 没有图片时隐藏上传图片组件
              _this.PhotoShow1 = false
            } else if (i == 1) {
              _this.PhotoShow2 = false
            } else if (i == 2) {
              _this.PhotoShow3 = false
            } else if (i == 3) {
              _this.bankPhotoShow = false
            }
          }
        }
        _this.initFileList = res.data.accessory
        _this.getInvoiceType()
      })
    },
    // 提交按钮流程解释：getImgBase64 ——> getFtoken ——> getImgUrl ——> submit
    getImgBase64(isSave) {
      // 禁用暂存、提交按钮
      this.isClick = true
      console.log(this.fileList1);// [{content, file}]
      console.log(this.fileList2);// []
      console.log(this.fileList3);// [{content, file}]
      console.log(this.fileList4);// [{content, file}]
      // momo
      if (this.fileList1.length > 0) {
        if ('url' in this.fileList1[0]) {// 未修改图片
          this.fileList.push(this.fileList1[0].url) // 原图片路径
        } else {// 修改了图片
          this.fileList.push(this.fileList1[0].file) // 提取file
        }
      } else {
        this.fileList.push('')
      }
      // momo
      if (this.fileList2.length > 0) {
        if ('url' in this.fileList2[0]) {// 未修改图片
          this.fileList.push(this.fileList2[0].url) // 原图片路径
        } else {// 修改了图片
          this.fileList.push(this.fileList2[0].file) // 提取file
        }
      } else {
        this.fileList.push('')
      }
      // momo
      if (this.fileList3.length > 0) {
        if ('url' in this.fileList3[0]) {// 未修改图片
          this.fileList.push(this.fileList3[0].url) // 原图片路径
        } else {// 修改了图片
          this.fileList.push(this.fileList3[0].file) // 提取file
        }
      } else {
        this.fileList.push('')
      }
      // momo
      // 银行卡照片
      if (this.fileList4.length > 0) {
        if ('url' in this.fileList4[0]) {// 未修改图片
          this.fileList.push(this.fileList4[0].url) // 原图片路径
        } else {// 修改了图片
          this.fileList.push(this.fileList4[0].file)
        }
      } else {
        this.fileList.push('')// 空字符串，占位
      }


      //isSave 字段判断是保存还是提交
      this.getFtoken(isSave)
    },
    // 修改按钮
    modify() {
      this.getArrList2()
      this.isReadyonly = false
      this.title = '居民用水申请'
      this.contentShowA = true
      this.contentShowB = false
      this.contentShowC = false
      this.contentShowD = false
      this.btnShow = true
      this.PhotoShow1 = true
      this.PhotoShow2 = true
      this.PhotoShow3 = true

      this.editShow = true
      this.icon = 'arrow-down'
    },
    // 获取ftoken
    getFtoken(isSave) {
      var _this = this;
      let params = {//接口入参
        "data": {},
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/file/getFtoken',//接口地址
      }).then(res => {
        _this.ftoken = res.ftoken
        console.log(_this.fileList);// [file, '', file, file](添加)、[url, '', url, url](修改)
        // 获取到ftoken之后调文件服务器接口取url
        if (_this.$route.query.isModify == 2) {// 添加用水申请时执行以下代码
          // 若没有添加新图片，则不进入getImgUrl()，该变量用于判断没有添加任何一张图片时能调submit()
          var goSubmit = 0
          for (let i = 0; i < _this.fileList.length; i++) {
            // _this.getImgUrl(_this.fileList[i], i, isSave)
            if (_this.fileList[i] == '') {
              _this.fileUrlList[i] = _this.fileList[i]
              goSubmit++
            } else {
              _this.getImgUrl(_this.fileList[i], i, isSave)
            }
          }

          console.log(goSubmit)
          console.log(_this.fileList.length)
          if (goSubmit == _this.fileList.length) {
            _this.submit(isSave, '1126')
          }
        } else {// 修改用水申请时执行以下代码
          // 若没有添加新图片，则不进入getImgUrl()（调不到submit()），该变量用于判断没有修改及删除部分图片后能调submit()
          var goSubmit = 0
          for (let i = 0; i < _this.fileList.length; i++) {
            if (typeof (_this.fileList[i]) == 'string') {
              _this.fileUrlList[i] = _this.fileList[i]
              goSubmit++
            } else {
              _this.getImgUrl(_this.fileList[i], i, isSave)
            }
          }
          console.log(goSubmit)
          console.log(_this.fileList.length)
          if (goSubmit == _this.fileList.length) {
            _this.submit(isSave, '1126')
          }
        }
      }).catch(err => {
        _this.isClick = false
      })
    },
    // 获取图片地址
    getImgUrl(item, i, isSave) {
      var _this = this;
      // 未选择图片
      if (item == '') {
        _this.fileUrlList[i] = ''
        if (i == 4) {
          _this.submit(isSave, '1126')
        }
        return
      }

      let $formData = new FormData();
      $formData.append('file', item);
      $formData.append('ftoken', this.ftoken);
      // 产生跨域问题，用降级浏览器测试
      // 需要同时调不同服务器的接口，所以该接口用原生写
      let RequestObj = {
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

            _this.fileUrlList[i] = res.data.data.path
            if (_this.fileUrlList.length == _this.fileList.length) {
              _this.submit(isSave, '1126')
            }
          }
        }
      }).catch(error => {
        _this.isClick = false
      })
    },
    // 模块访问
    moduleAccess(groupCode) {
      var _this = this;
      let params = {//接口入参
        "data": {
          "groupCode": groupCode,
          "openId": localStorage.getItem('openId'),
          'moduleId': '3',
        },
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: '/common/moduleVisitAdd',//接口地址
      }).then(res => {

      })
    },
    // 确定按钮
    submit(isSave, str) {
      switch (str) {
        case 'A':
          this.testA()
          break;
        case 'B':
          this.testB()
          break;
        case 'C':
          this.testC()
          break;
        default:
          break;
      }
      var _this = this;
      // 上面校验不通过，return
      if (this.isTestErr == false) {
        return
      }
      // _this.fileUrlList有可能出现该情况：[undefined, undefined，xxxxxx.jpg],此时长度正常，但没有图片地址，以下代码解决该bug
      for (let i = 0; i < _this.fileUrlList.length; i++) {
        if (_this.fileUrlList[i] === undefined) {
          return
        }
      }
      console.log(_this.fileUrlList);// ['png', '', 'png', 'png']

      let params = {//接口入参
        "data": {
          "isSave": isSave,
          "groupCode": this.tableData.groupCode,
          "busiType": 0,
          'data': {
            // 必填信息
            "ctmName": this.tableData.ctmName,
            "ctmIdCard": this.tableData.ctmIdCard,
            "userAddress": this.tableData.userAddress,
            "applyReason": this.tableData.applyReason,
            "predictWater": Number(this.tableData.predictWater),
            "predictUser": Number(this.tableData.predictUser),
            "operatorPhone": this.tableData.operatorPhone,
            "accessory": [
              {
                "fileId": "",
                "type": "房产证",
                "url": ''
              },
              {
                "fileId": "",
                "type": "居民身份证正面",
                "url": ''
              },
              {
                "fileId": "",
                "type": "居民身份证反面",
                "url": ''
              },
              {
                "fileId": "",
                "type": "银行卡照片",
                "url": ''
              }
            ],
          }
        },
      }
      console.log(params.data.data.accessory);

      // 上传图片 (图片页面是否显示 || （修改 && 草稿）) 添加 || 修改
      if (this.contentShowD || (this.$route.query.isModify == 1 && this.$route.query.isDraft == '1' && this.tableData.accessory.length > 0)) {
        params.data.data.accessory = [
          {
            "fileId": "",
            "type": "房产证",
            "url": _this.fileUrlList[0]
          },
          {
            "fileId": "",
            "type": "居民身份证正面",
            "url": _this.fileUrlList[1]
          },
          {
            "fileId": "",
            "type": "居民身份证反面",
            "url": _this.fileUrlList[2]
          },
          {
            "fileId": "",
            "type": "银行卡照片",
            "url": _this.fileUrlList[3]
          }
        ]
      }
      console.log(this.tableData);
      // 修改-如果用户在图片页面之前点击了暂存，则在此处将图片加入入参
      if (this.contentShowD == false && (this.$route.query.isModify == 1 && this.$route.query.isDraft == '1') && this.tableData.accessory.length > 0) {
        params.data.data.accessory = [
          {
            "fileId": "",
            "type": "房产证",
            "url": _this.initFileList[0].url
          },
          {
            "fileId": "",
            "type": "居民身份证正面",
            "url": _this.initFileList[1].url
          },
          {
            "fileId": "",
            "type": "居民身份证反面",
            "url": _this.initFileList[2].url
          },
          {
            "fileId": "",
            "type": "银行卡照片",
            "url": _this.initFileList[3].url
          }
        ]
      }
      // 银行代扣资料
      if (this.bankShow) {
        params.data.data.bank = {
          "openBank": this.bank.openBank,
          "accountName": this.bank.accountName,
          "bankNo": this.bank.bankNo,
        }
      } else {
        params.data.data.bank = null
      }
      // 开票资料
      if (this.invoiceShow) {
        params.data.data.invoice = {
          "invoiceType": this.invoice.invoiceType,
          "unitName": this.invoice.unitName,
          "identifiNum": this.invoice.identifiNum,
          "contactAddr": this.invoice.contactAddr,
          "mobile": this.invoice.mobile,
          "invOpenBank": this.invoice.invOpenBank,
          "invAccountNo": this.invoice.invAccountNo,
        }
      } else {
        params.data.data.invoice = null
      }

      // 存在多次调该接口的bug（图片上传不完整），处理办法：判断图片是否上传完整
      for (let i = 0; i < params.data.data.accessory.length; i++) {
        if (!('url' in params.data.data.accessory[i])) {
          return
        }
      }
      // 修改时多传以下字段
      if (_this.$route.query.isModify == 1) {
        params.data.source = _this.$route.query.source
        params.data.busiId = _this.$route.query.busiId
        for (let i = 0; i < _this.initFileList.length; i++) {
          // 如果图片存在fileId，就扔进去，如果不存在，就为空
          if ('fileId' in _this.initFileList[i]) {
            params.data.data.accessory[i].fileId = _this.initFileList[i].fileId
          } else {
            params.data.data.accessory[i].fileId = ''
          }

        }

      } else if (_this.$route.query.isModify == 2) {// 添加要，更新不要
        params.data.openId = localStorage.getItem('openId')
      }
      var url = ''
      if (_this.$route.query.isModify == 1) {
        url = '/myWater/busiUpdate'// 修改
      } else {
        url = '/myWater/busiApply'// 添加
      }
      console.log(params.data.data.accessory);
      this.$api.fetch({
        params: params,//参数
        apiUrl: url,//接口地址
      }).then(res => {
        Toast.success({
          message: '提交居民用水申请成功！',
          position: 'middle',
          duration: 3000
        });
        setTimeout(() => {
          _this.tableData = {}
          _this.$router.push({ path: '/progressQuery' })
        }, 3000);
      }).catch(err => {
        _this.isClick = false
      })
    },
    // 三级联动点击确定按钮事件
    sure(val) {
      if (typeof (val[2]) == "undefined" || val[2].code == '') {
        this.tableData.groupCode = val[1].code.slice(2)
        // this.tableData.groupName = val[0].name + "-" + val[1].name
        this.tableData.groupName = val[0].name + val[1].name
      } else {
        this.tableData.groupCode = val[2].code.slice(4);
        // this.tableData.groupName = val[0].name + "-" + val[1].name + "-" + val[2].name
        this.tableData.groupName = val[0].name + val[1].name + val[2].name
      }
      // this.tableData.groupCode = this.common.codeTrans(this.tableData.groupCode, this.newAreaMap)
      this.tableData.groupCode = this.common.codeTransCity(this.tableData.groupCode, this.newCityMap);
      this.tableData.groupName = this.tableData.groupName.replace('*', '')
      this.relationShow = false
    },
    // 三级联动点击取消按钮事件
    exit() {
      this.relationShow = false
    },
    // 获取所属地区数据
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
        console.log(_this.areaList);
        _this.getInvoiceType()

        if (_this.$route.query.isModify == 2) {
          _this.getBindData()
        }
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
        if (bindData.length > 0) {
          _this.tableData.groupCode = bindData[0].groupCode
          _this.tableData.groupName = bindData[0].groupName

          let incode = _this.tableData.groupCode;
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
        _this.$set(_this.tableData, 'groupCode', res.groupCode)
        _this.$set(_this.tableData, 'groupName', res.groupArea)
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
    // 点击展示所属地区弹窗
    showAddressChuang() {
      if (this.isReadyonly) {
        return
      }
      this.relationShow = true
    },
    // 跳过 直接从银行卡资料跳到开票
    goWay() {
      Dialog.confirm({
        message: '是否录入开票资料？',
        confirmButtonText: '前往填写',
        cancelButtonText: '暂不填写',
      }).then(() => {
        this.title = '开票资料'
        this.contentShowA = false;
        this.contentShowB = false;
        this.contentShowC = true;
        this.contentShowD = false;
        this.bankPhotoShow = false;
      }).catch(() => {
        this.contentShowC = false;
        this.nextC()
        this.invoiceShow = false;
        this.bankPhotoShow = false;
      });
    },
    // 银行卡资料的上一步按钮
    goBackB() {
      this.title = '居民用水申请'
      this.contentShowA = true
      this.contentShowB = false
      this.contentShowC = false
      this.contentShowD = false
      this.bankPhotoShow = true
    },
    // 开票资料的上一步按钮
    goBackC() {
      if (this.bankShow) {
        this.title = '银行卡资料'
        this.contentShowA = false
        this.contentShowB = true
        this.contentShowC = false
        this.contentShowD = false
        this.bankPhotoShow = true
      } else {
        setTimeout(() => {
          // 移动端输入框输入后直接点击下一步并弹出二次确认框时样式错乱（键盘所占空间在键盘消失后并没有被页面填充）
          // 处理办法：让 window 重新滚动到(0,0)的位置
          window.scrollTo(0, 0)
          Dialog.confirm({
            message: '是否需要填写银行卡资料？',
            confirmButtonText: '前往填写',
            cancelButtonText: '暂不填写',
          }).then(() => {
            this.title = '银行卡资料'
            this.contentShowA = false
            this.contentShowB = true
            this.contentShowC = false
            this.contentShowD = false
            this.bankPhotoShow = true

            this.bankShow = true
          }).catch(() => {
            this.goBackB()
            this.bankPhotoShow = false
            this.bankShow = false
          });
        }, 1000);
      }

      // this.title = '银行卡资料'
      // this.contentShowA = false
      // this.contentShowB = true
      // this.contentShowC = false
      // this.contentShowD = false
    },
    // 上传附件的上一步按钮
    goBackD() {
      if (this.invoiceShow) {
        this.title = '开票资料'
        this.contentShowA = false
        this.contentShowB = false
        // this.bankPhotoShow = false
        this.contentShowC = true
        this.contentShowD = false
      } else {
        setTimeout(() => {
          Dialog.confirm({
            message: '是否需要填写开票资料？',
            confirmButtonText: '前往填写',
            cancelButtonText: '暂不填写',
          }).then(() => {
            this.title = '开票资料'
            this.contentShowA = false
            this.contentShowB = false
            // this.bankPhotoShow = false
            this.contentShowC = true
            this.contentShowD = false

            this.invoiceShow = true
          }).catch(() => {
            this.goBackC()
            this.invoiceShow = false
          });
        }, 1000);
      }

      // this.title = '开票资料'
      // this.contentShowA = false
      // this.contentShowB = false
      // this.contentShowC = true
      // this.contentShowD = false
    },
    // 总体的上一步按钮
    goBackE() {
      this.title = '上传附件'
      this.contentShowA = false
      this.contentShowB = false
      this.contentShowC = false
      this.contentShowD = true
      this.btnShow = true
      if (this.$route.query.isModify != 0) {
        this.isReadyonly = false
      }
    },
    // 用水申请的下一步按钮
    nextA() {
      console.log(this.tableData.operatorPhone)
      if (this.tableData.groupName === '') {
        Toast('所属地区未填');
        return
      } else if (this.tableData.ctmName === '') {
        Toast('业主名称未填');
        return
      } else if (this.tableData.ctmIdCard === '') {
        Toast('业主身份证号码未填');
        return
      } else if (this.tableData.userAddress === '') {
        Toast('用水地址未填');
        return
      } else if (this.tableData.operatorPhone === '' || this.tableData.operatorPhone === undefined) {
        Toast('手机号码未填');
        return
      }
      // else if (this.tableData.predictWater === '') {
      //   Toast('预估月用水量未填');
      //   return
      // } 
      else if (this.tableData.predictUser === '') {
        Toast('预估月用水人数未填');
        return
      }
      // else if (!/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.tableData.ctmIdCard)) {
      //   Toast('身份证号码格式有误');
      //   return
      // }
      // else if(!(/^1[3456789]\d{9}$/.test(this.tableData.operatorPhone))){
      //   Toast('手机号码格式有误');
      //   return
      // }
      this.testA()
      console.log(this.isTestErr);
      if (this.isTestErr == false) {
        return
      }
      if (this.bankShow) {
        this.title = '银行卡资料'
        this.contentShowA = false
        this.contentShowB = true
        this.bankPhotoShow = true
        this.contentShowC = false
        this.contentShowD = false
      } else {
        // 移动端输入框输入后直接点击下一步并弹出二次确认框时样式错乱（键盘所占空间在键盘消失后并没有被页面填充）
        // 处理办法：让 window 重新滚动到(0,0)的位置
        window.scrollTo(0, 0)
        setTimeout(() => {
          Dialog.confirm({
            message: '是否需要填写银行卡资料？',
            confirmButtonText: '前往填写',
            cancelButtonText: '暂不填写',
          }).then(() => {
            this.title = '银行卡资料'
            this.contentShowA = false
            this.contentShowB = true
            this.bankPhotoShow = true
            this.contentShowC = false
            this.contentShowD = false

            this.bankShow = true
          }).catch(() => {
            this.contentShowB = false
            this.nextB()
            this.bankShow = false
          });
        }, 1000);
      }
    },
    testA() {
      let phoneErr = this.tableData.operatorPhone == undefined || this.tableData.operatorPhone == null || this.tableData.operatorPhone == ''
      let cardErr = this.tableData.ctmIdCard == undefined || this.tableData.ctmIdCard == null || this.tableData.ctmIdCard == ''
      console.log(this.tableData.ctmIdCard);
      // 4 41900 19 78 08 30 5012                 月份
      console.log(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.tableData.ctmIdCard));      
      if (!cardErr && !/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.tableData.ctmIdCard)) {
        Toast('业主身份证号码格式有误');
        return this.isTestErr = false;
      } else if (!phoneErr && !(/^1[3456789]\d{9}$/.test(this.tableData.operatorPhone))) {
        Toast('联系人电话格式有误');
        return this.isTestErr = false;
      }
      this.isTestErr = true;
    },
    // 银行卡资料的下一步按钮
    nextB() {
      if (this.contentShowB) {
        if (this.bank.openBank === '') {
          Toast('开户银行未填');
          return
        } else if (this.bank.accountName === '') {
          Toast('开户名称未填');
          return
        } else if (this.bank.bankNo === '') {
          Toast('银行账户未填');
          return
        }
        // this.testB();
        else if (!/^([1-9]{1})(\d{14}|\d{18})$/.test(this.bank.bankNo)) {
          Toast('银行账户格式有误');
          return
        }
      }

      if (this.invoiceShow) {
        this.title = '开票资料'
        this.contentShowA = false
        this.contentShowB = false
        this.contentShowC = true
        this.contentShowD = false
      } else {
        // 移动端输入框输入后直接点击下一步并弹出二次确认框时样式错乱（键盘所占空间在键盘消失后并没有被页面填充）
        // 处理办法：让 window 重新滚动到(0,0)的位置
        window.scrollTo(0, 0)
        setTimeout(() => {
          Dialog.confirm({
            message: '是否现在录入开票资料？',
            confirmButtonText: '前往填写',
            cancelButtonText: '暂不填写',
          }).then(() => {
            this.title = '开票资料';
            this.contentShowA = false;
            this.contentShowB = false;
            this.contentShowC = true;
            this.contentShowD = false;
            this.invoiceShow = true;
          }).catch(() => {
            this.contentShowC = false;
            this.nextC()
            this.invoiceShow = false;
          });
        }, 1000);
      }
    },
    testB() {
      if (this.bank.bankNo == '') {
        return this.isTestErr = true;
      }
      else if (!/^([1-9]{1})(\d{14}|\d{18})$/.test(this.bank.bankNo)) {
        Toast('银行账户格式有误');
        return this.isTestErr = false;
      }
      this.isTestErr = true;
    },
    // 开票资料的下一步按钮
    nextC() {
      if (this.contentShowC) {
        if (this.invoice.invoiceType === '') {
          Toast('发票类型未选');
          return
        } else if (this.invoice.unitName === '') {
          Toast('单位名称未填');
          return
        } else if (this.invoice.identifiNum === '') {
          Toast('纳税人识别号未填');
          return
        } else if (this.invoice.mobile === '') {
          Toast('联系电话未填');
          return
        }
        else if (!/^1([38]\d|5[0-35-9]|7[3678])\d{8}$/.test(this.invoice.mobile)) {
          Toast('联系电话格式有误');
          return
        }
        else if (this.invoice.invOpenBank == '') {
          Toast('开户银行未填');
          return
        } else if (this.invoice.invAccountNo == '') {
          Toast('银行账户未填');
          return
        } else if (this.invoice.contactAddr == '') {
          Toast('联系地址未填');
          return
        }
        else if (!/^([1-9]{1})(\d{14}|\d{18})$/.test(this.invoice.invAccountNo)) {
          Toast('银行账户格式有误');
          return
        }
        else {
          this.title = '上传附件'
          this.contentShowA = false
          this.contentShowB = false
          this.contentShowC = false
          this.contentShowD = true
        }
      } else {
        this.title = '上传附件'
        this.contentShowA = false
        this.contentShowB = false
        this.contentShowC = false
        this.contentShowD = true
      }

    },
    testC() {
      if (this.invoice.mobile !== '' && !/^1([38]\d|5[0-35-9]|7[3678])\d{8}$/.test(this.invoice.mobile)) {
        Toast('联系电话格式有误');
        return this.isTestErr = false;
      } else if (this.invoice.invAccountNo !== '' && !/^([1-9]{1})(\d{14}|\d{18})$/.test(this.invoice.invAccountNo)) {
        Toast('银行账户格式有误');
        return this.isTestErr = false;
      }
      this.isTestErr = true;
    },
    // 上传附件的下一步按钮
    nextD() {
      // || this.fileList4.length == 0

      // momo
      // if (this.fileList1.length == 0 || this.fileList2.length == 0 || this.fileList3.length == 0) {
      //   Toast('请先上传完整图片');
      //   return
      // }
      // if (this.bankPhotoShow && this.fileList4.length == 0) {
      //   Toast('请先上传完整图片');
      //   return
      // }
      this.title = '居民用水申请'
      this.contentShowA = true
      this.contentShowD = true
      this.isQuery = true;//隐藏
      this.btnShow = false
      if (this.$route.query.isModify != 0) {
        this.isReadyonly = true
        this.icon = '';
        this.iconType = '';
      }


      if (this.bankShow) {
        this.contentShowB = true
        this.bankPhotoShow = true
      } else {
        this.contentShowB = false
        this.bankPhotoShow = false
      }
      if (this.invoiceShow) {
        this.contentShowC = true
      } else {
        this.contentShowC = false
      }
    },
    // 取消按钮
    cancel() {
      if (this.$route.query.isModify !== 0) {
        Dialog.confirm({
          message: '数据未保存，是否确定退出？'
        }).then(() => {
          // 业务办理首页
          this.$router.push('/businesshand')
        }).catch(() => {
          return
        });
      } else {
        // 进度查询
        this.$router.push('/progressQuery')
      }

    },
  }
}
</script>

<style scoped lang="less">
.peopleApply {
  .van-overlay {
    background-color: rgba(0, 0, 0, 0.7);
  }
  .van-cell--large {
    border-bottom: 1px solid #eee;
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .myheader {
    // height: auto;
    height: 9rem;
    // padding: 0 0 5% 0 !important;
  }
  .bottomBtn_content {
    margin-top: 10px;
  }
  .van-uploader {
    width: 100%;
  }
  .yh-body {
    // height: 70%;
    // overflow-y: auto;
  }
  .span_content {
    display: inline-block;
    width: 100%;
    padding: 0 2%;
  }
  .van-radio-group {
    padding: 2% 2%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .radio_span {
    display: inline-block;
    width: 45%;
    padding: 0% 0% 0% 0%;
    font-size: 16px;
  }
  .yh-footer {
    padding: 3% 1% 3% 3%;
    font-size: 14px;
    // background: #efefef;
    .kr-span {
      display: block;
    }
    .yh-info {
      text-align: left;
      display: flex;
      align-items: center;
      img {
        width: 8%;
        color: #232a9c;
      }
    }
    .kr-info {
      text-align: center;
      color: #3193f6;
      font-size: 0.8rem;
      display: inline-block;
    }
  }
  .page-content .list li {
    border: none;
  }
  .top_title {
    height: 1.2rem;
    line-height: 1.2rem;
    font-size: 16px;
    // font-family: PingFang_Heavy;
    font-weight: bolder;
    margin-left: 3%;
    margin-top: 3%;
    border-left: 0.25rem solid #3193f6;
  }
  .upLoad_title {
    height: 1.5rem;
    line-height: 1.5rem;
    font-size: 16px;
    // font-family: PingFang_Heavy;
    font-weight: bolder;
    margin-left: 3%;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .next {
    float: right;
    margin-right: 3%;
    height: 1.6rem;
    line-height: 1.6rem;
    margin-bottom: 0.5rem;
  }
  .submit_box {
    display: flex;
    .submit_btn {
      flex: 1;
      height: 1.6rem;
      line-height: 1.6rem;
      margin: 0 20px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .real {
      margin: 0 5px;
    }
  }

  .bottom_content {
    margin: 0px 0px 0px 0px;
    padding-bottom: 10px;
    padding-top: 10px;
    .col-100 {
      margin-left: 3%;
    }
    .list {
      margin: 1rem 0.5rem 1rem 0;
      box-shadow: 1px 1px 5px 1px #888888;
      .item-content {
        padding: 0 0 0 0;
      }
    }
    .col-100 {
      width: 94%;
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
    padding-left: 1%;
    span {
      font-size: 12px;
      color: #989898;
      // font-family: PingFang_Bold;
      font-weight: 600;
    }
    input {
      width: 90%;
      font-size: 15px;
      border: none;
      // font-family: PingFang_Medium;
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
      color: #989898;
      // font-family: PingFang_Bold;
      font-weight: 600;
    }
    input {
      width: 90%;
      font-size: 15px;
      border: none;
      // font-family: PingFang_Medium;
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
      // font-family: PingFang_Regular;
      font-weight: 300;
    }
    input {
      width: 90%;
      font-size: 15px;
      border: none;
      // font-family: PingFang_Medium;
    }
  }
  .add_box {
    position: absolute;
    width: 20%;
    top: 77.5%;
    right: 6%;
    height: 8%;
    z-index: 2000;
    .midle-bar {
      float: right;
    }
  }
  .content-padded {
    margin: 0;
    .img_content {
      height: 9rem;
    }
    // overflow-y: hidden;
  }
  .col-100 {
    .list {
      margin: 0;
      .list-title {
        padding: 0;
      }
    }
    .form-list .item-title.label {
      width: 40%;
    }
    .form-list .item-content img {
      position: absolute;
      top: 0.2rem;
      left: 50%;
    }
  }
}
</style>
