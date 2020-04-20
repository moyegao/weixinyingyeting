<template>
  <div class="account-bind">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>账号绑定</header-title>
    </page-header> -->
    <page-content>
      <div class="content-padded">
        <!-- <myHeader :title='title'></myHeader> -->
        <headerThree :message = 'message'></headerThree>
        <div class="row kr-bottom">
          <div class="col-100 kr-list">
            <list>
              <div slot="title">Checkbox List</div>
              <list-item :checkbox="true" v-for="(item,i) in needData" :key="item.code" :i="item.index">
                <input type="checkbox" name="name" value="A" @click="takeChage(i,item)" :id="'checkbox'+i">
                <div class="item-content">
                  <div class="item-title-row">
                    <div class="item-title">用户编号：{{item.userNo}}</div>
                  </div>
                  <div class="item-title-row">
                    <div class="item-title">用户地址：{{item.userAddress}}</div>
                  </div>
                </div>
              </list-item>
            </list>
            <div class="content-block">
              <!-- class="col-100" -->
              <div style="text-align: center;">
                <m-button size="large" @click.native="pay">确认绑定</m-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </page-content>
  </div>
</template>

<script>
import { Toast } from 'vant';
import myHeader from '@/comments/myHeader';
import headerThree from '@/comments/headerThree';
export default {
  components: {
    myHeader,headerThree
  },
  data() {
    return {
      message:{
        title:"账号绑定",
        span1:"尊敬的"+(localStorage.getItem('nickname') === null? 'XX':localStorage.getItem('nickname')),
        span2:"请选择您要绑定的用户",
        isShow: '',
      },
      title: "账号绑定",
      needData: [],
      goAwayData: [],
    }
  },
  mounted() {
    console.log(this.$route.query, typeof (this.$route.query));//单户 object 
    this.init()
  },
  methods: {
    init() {
      let that = this;
      let data = that.$route.query;
      let str = '';
      for (let i in data) {
        that.needData.push(data[i])
        str += that.needData[i];
      }
      str = str.split('/');
      for (let j = 0; j < str.length; j++) {
        str[j] = JSON.parse(str[j])
      }
      that.needData = str
    },
    pay() {
      let that = this;
      let data = {};
      data.list = that.goAwayData;
      if (data.list.length == 0) {
        let message = '请选择一户或多户';
        Toast.fail(message);
        return
      }
      data.openId = localStorage.getItem('openId');
      // data.openId = 'ok6sbwaaL5BexHwyWbdCu4I9ddOE';
      let params = {
        data,
      }
      that.$api.fetch({
        params,//参数
        apiUrl: '/myWater/userBind',//接口地址
      }).then(res => {
        // query:that.goAwayData[0]
        let notFound = this.$store.state.notFound;
        let path = '';
        switch (notFound) {
          case 0:
            path = '/moreUser';//账单多户
            break;
          case 1:
            path = '/announcemen';//通知公告
            break;
          case 2:
            path = '/multiHousehold';//电子发票
            break;
          case 3:
            path = '/personalcenter';//个人中心
            break;
          case 4:
            path = '/meterReadingAccount';//自助抄表
            break;
          case 5:
            path = '/meterReadingAccount';//自助抄表
            break;
          default:
            break;
        }
        that.$router.push({ path})
      })
    },
    takeChage(i, item) {
      let that = this;
      if ($('#checkbox' + i).is(":checked")) {
        that.goAwayData.push(item);
      } else {
        for (let j = 0; j < that.goAwayData.length; j++) {
          if (item.userNo == that.goAwayData[j].userNo) {
            that.goAwayData.splice(j, 1);
          }
        }
      }
    },
  }
}
</script>

<style scoped lang="less">
.account-bind {
  .content-padded {
    margin: 0;
    height: 100%;
  }
  .kr-bottom {
    height: 70%;
    .kr-list {
      height: 100%;
      .list {
        margin: 0% 0;
        height: 82%;
        overflow-y: auto;
        .item-title-row {
          // font-family: PingFang_Medium;
          font-size: 15px;
          height: 2.1rem !important;
          .item-title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      .content-block {
        height: 13%;
        margin-top: 1%;
      }
    }
  }
  .item-title {
    // font-family: PingFang_Heavy;
    font-weight: bolder;
    font-size: 16px;
    // width: 23%;
  }
  .item-input input {
    height: 100%;
    // font-family: PingFang_Medium;
    font-size: 16px;
  }
  .content-block {
    .col-100 {
      text-align: center;
    }
    a {
      font-size: 0.9rem;
      height: 2.8rem;
      line-height: 2.8rem;
      width: 88%;
      background: #479eff;
      display: inline-block;
      border-radius: 3px;
      font-weight: 500;
    }
  }
}
</style>
