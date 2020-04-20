<template>
  <div class="contacts">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title v-if="$route.query.content == 'edit'">联系人编辑</header-title>
      <header-title v-else>联系人添加</header-title>
    </page-header> -->
    <page-content>
      <div class="content-padded">
        <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
        <!-- <myHeader :title="title"></myHeader> -->
        <headerThree :message='message'></headerThree>
        <div class="row bottom_content">
          <div class="col-100">
            <div class="kr-body">
              <div class="kr-body-info">
                <div class="kr-containt">
                  <div class="kr-div">
                    <van-field class="yh-my-blue" left-icon="user-o" v-model="tableData.name" label="联系人姓名" placeholder="输入姓名" size="large" @blur='blur(tableData.name,"name")'/>
                  </div>
                  <div class="kr-line"></div>
                  <div class="kr-div">
                    <van-field class="yh-my-red" left-icon="friends-o" clearable v-model="tableData.relation" label="与户主关系" readonly placeholder="请选择与户主关系" right-icon="arrow" size="large" @click="selectRelation" @click-right-icon="selectRelation" />
                  </div>
                  <div class="kr-line"></div>
                  <div class="kr-div">
                    <van-field class="yh-my-blue" left-icon="phone-o" v-model="tableData.mobile" type="number" label="手机号码" placeholder="输入手机号码" size="large" @blur='blur(tableData.mobile,"mobile")'/>
                  </div>
                  <div class="kr-line"></div>
                  <div class="kr-div">
                    <!-- type="number" -->
                    <van-field class="yh-my-red" left-icon="phone-circle-o" v-model="tableData.tel" oninput="this.value=this.value.replace(/[^0-9-]+/,'');" label="固定电话" placeholder="输入固定电话" size="large" @blur='blur(tableData.tel,"tel")'/>
                  </div>
                </div>
              </div>
              <div class="kr-button" @click="submit">
                <m-button size='large'>完成</m-button>
              </div>
            </div>
          </div>
        </div>
        <!-- </van-pull-refresh> -->
      </div>

    </page-content>
    <!-- 与户主关系 -->
    <van-popup position="bottom" :style="{ height: '40%' }" v-model="relationShow">
      <van-picker class="timepicker" show-toolbar title="与户主关系" :columns="relationColumns" @cancel="onCancelRelation" @confirm="onConfirmRelation" />
    </van-popup>
  </div>
</template>

<script>
import myHeader from '@/comments/myHeader'
import headerThree from '@/comments/headerThree';
import { Toast, PullRefresh, Icon } from 'vant';
export default {
  components: {
    myHeader, headerThree
  },
  data() {
    return {
      message: {
        title: "",
        span1: "",
        span2: "",
        isShow: '',
      },
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离

      title: '',
      user: "小胖子",
      list: [
        {
          title: '用户编号',
          content: '1001111'
        },
        {
          title: '用户名称',
          content: '*胖子'
        },
        {
          title: '用户地址',
          content: '步埠路39号'
        },

        {
          title: '所属水司',
          content: '梧州水司'
        }
      ],
      buttons: [
        {
          name: '切换用户'
        }
      ],

      // 修改联系人数据
      tableData: {
        name: '',
        relation: '',
        mobile: '',
        tel: '',
      },
      relationShow: false,
      relationColumns: ['父亲', '母亲', '配偶', '兄弟', '姐妹', '子女'],
    }
  },
  filters: {
    dealUser: function (value) {
      if (value.length > 5)
        return value.slice(0, 5) + '...'
      else
        return value
    }
  },
  created() {
    // console.log(this.$route.query);
    if (this.$route.query.content == 'add') {
      this.message.title = '添加联系人'
    } else if (this.$route.query.content == 'edit') {
      this.message.title = '编辑联系人'
    }
  },
  mounted() {
    if (this.$route.query.content == 'edit') {
      this.init();
    }
  },
  methods: {
    blur(val,text){//输入框失去焦点验证
      let message = '';
      console.log(val,text)
      if(val === ''){
        switch (text) {
          case 'name':
            message = "联系姓名不能为空"
            break;
          case 'mobile':
            message = "手机号码不能为空"
            break;
          case 'tel':
            message = "固定电话不能为空"
            break;
          default:
          
            break;
        }
        Toast(message);
      }else {
        if(text == 'mobile' && !(/^1[3456789]\d{9}$/.test(this.tableData.mobile))){
          message = '手机号码有误!';
          Toast(message);
        }
        else if(text == 'tel' && !(/^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(this.tableData.tel))){
          message = '固定电话有误!';
          Toast(message);
        }
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
        if (this.$route.query.content == 'edit') {
          this.init();
        }
      }, 500);
    },
    // 获取要修改的联系人数据
    init() {
      let query = this.$route.query;
      this.tableData = query;
      console.log(this.tableData);
      // var _this = this;
      // let params = {//接口入参
      //   "data": this.$route.query.id
      // }
      // this.$api.fetch({
      //   params: params,//参数
      //   apiUrl: '/myWater/connecterQuery',//接口地址
      // }).then(res => {
      //   _this.tableData = res
      // })
    },
    // 修改-保存
    submit() {
      console.log(this.tableData)
      var _this = this;
      if (this.tableData.name == '') {
        Toast.fail('请填写姓名')
        return
      } else if (this.tableData.relation == '') {
        Toast.fail('请选择与户主关系')
        return
      } else if (this.tableData.mobile == '' && this.tableData.tel == '') {
        Toast.fail('请填写至少一个联系方式')
        return
      }
      // 手机号码正则校验
      if (this.tableData.mobile != '') {
        if (!(/^1[3456789]\d{9}$/.test(this.tableData.mobile))) {
          Toast.fail('手机号码有误，请重填')
          return
        }
      }
      // 手机号码正则校验
      if (this.tableData.tel != '') {
        if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(this.tableData.tel)) {
          Toast.fail('固定电话有误，请重填')
          return
        }
      }
      var url // 接口地址
      if (this.$route.query.content == 'add') {// 添加
        var params = {//接口入参
          "data": {
            "groupCode": this.$route.query.groupCode,
            "userNo": this.$route.query.userNo,
            "name": this.tableData.name,
            "relation": this.tableData.relation,
            "mobile": this.tableData.mobile,
            "tel": this.tableData.tel
          }
        }
        url = '/myWater/connecterAdd'
      } else if (this.$route.query.content == 'edit') {// 修改
        var params = {//接口入参
          "data": {
            "id": this.$route.query.id,
            "name": this.tableData.name,
            "relation": this.tableData.relation,
            "mobile": this.tableData.mobile,
            "tel": this.tableData.tel
          }
        }
        url = '/myWater/connecterUpdate'
      }
      this.$api.fetch({
        params: params,//参数
        apiUrl: url,//接口地址
      }).then(res => {
        if (_this.$route.query.content == 'add') {
          Toast.success('添加成功！');
        } else if (_this.$route.query.content == 'edit') {
          Toast.success('修改成功！');
        }
        setTimeout(() => {
          _this.$router.back()
        }, 2000);
      })
    },
    //展开关系遮罩层
    selectRelation() {
      this.relationShow = true
    },
    // 关系遮罩层返回按钮
    onCancelRelation() {
      this.relationShow = false;
    },
    // 关系遮罩层确定按钮
    onConfirmRelation(value, index) {
      this.tableData.relation = value
      this.relationShow = false;
    },
  }
}
</script>

<style scoped lang="less">
.contacts {
  .van-cell {
    padding: 0px 0px;
  }

  .content-padded {
    margin: 0;
  }
  .bottom_content {
    width: 94%;
    position: absolute;
    // top: 20%;
    top:6rem;
    left: 3%;
    margin-left: 0%;
    .col-100 {
      // text-align: center;
      width: 100%;
      margin-left: 0%;
    }
  }
  .img_content {
    margin: 0%;
    // height: 30%;
    height: 9rem;
    width: 100%;
    background: url("../../../../../static/img/juxing.png") no-repeat;
    background-size: 100% 100%;
  }
  .item-icon {
    position: absolute;
    left: 50%;
    top: 5%;
  }
  .col-100 {
    .list {
      margin: 0;
      .list-title {
        padding: 0;
      }
    }
    .user-card {
      border-radius: 10px;
      padding: 27% 0 0 0;
      background-size: 100%;
      &:after {
        display: block;
        width: 100%;
        height: 100%;
        content: "";
      }
      .card-header {
        .img {
          float: left;
        }
        a {
          float: right;
          b {
            font-size: 16px;
            font-weight: normal;
            text-decoration: underline;
          }
        }
      }
      .card-content {
        width: 100%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        position: relative;
        .left-img {
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          padding: 0.25rem 0;
          width: 25%;
          img {
            width: 100%;
            border-radius: 50%;
            overflow: hidden;
          }
        }
        .right-content {
          margin-left: 0.75rem;
          width: 100%;
          position: relative;
          padding: 0.9rem 0.75rem 0.4rem 0;
          color: #fff;
          h4,
          span {
            margin: 10px 0;
            font-size: 24px;
          }
          h4 {
            a {
              color: #fff;
              float: right;
              font-size: 15px;
              line-height: 27px;
              // font-family: PingFang_Regular;
              font-weight: 300;
              font-weight: 500;
            }
          }
          p {
            font-size: 16px;
            span {
              padding-left: 20px;
              background: url("../../../../../static/img/coin.png") no-repeat;
              background-position: left bottom;
              background-size: 14px;
            }
          }
        }
      }
    }
    .kr-body {
      padding: 10px 10px;
      .kr-body-info {
        border-radius: 5px;
        background: #fff;
        box-shadow: 1px 1px 5px 1px #888;
        .kr-containt {
          .kr-div {
            // border-bottom: 1px solid #ebebeb;
            padding: 15px;
            // font-family: PingFang_Regular;
            font-weight: 300;
            font-size: 15px;
            .kr-name {
              display: inline-block;
              width: 30%;
              // font-weight: 600;
            }
            .kr-title {
              color: #000;
              // font-weight: 600;
            }
            input,
            select {
              color: #000;
              // font-weight: 600;
              border: 0;
            }
            select {
              width: 30%;
            }
          }
          .kr-line {
            width: 90%;
            height: 1px;
            background: #ebebeb;
            margin: 0 auto;
          }
        }
      }
      .kr-button {
        padding: 10px;
        // font-family: PingFang_Medium;
      }
    }
  }
}
</style>