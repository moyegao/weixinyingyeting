 <template>
  <div class="header-two">
    <div class="row">
      <div class="col-100">
        <div class="user-card">
          <!-- <div class="card-header">
            <img :src="header" alt="" width="35%" style="margin-left: 1%;" />

          </div> -->
          <div class="header_img">
            <img src="../../static/img/header1.png" alt="" />
          </div>

          <div class="card-content">
            <ul v-if="showData.isShowUL&&showData.ctmName">
              <li>
                <span>{{showData.ctmName | dealUser}}({{showData.ctmNo}})</span>
              </li>
              <li>
                <span class="kr-addr">{{showData.ctmAddress}}</span>
              </li>
              <li>
                <span>
                  账户余额：<span style="font-weight: 600;">{{showData.accountBalance}}</span>元&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              </li>
              <li>
                <span>
                  应缴总额：<span style="font-weight: 600;">{{showData.totalArrears}}</span>元
                </span>
              </li>
              <li>
                <span>合计应缴：<span class="total_num" style="font-weight: 600;">{{showData.totalPay}}</span>元</span>
              </li>
            </ul>
            <ul v-if="showData.isShowUL&&!showData.ctmName&&!showData.isShowArea">
              <li>
                <!-- showData.userName -->
                <span>{{showData.userName|dealUser}}（{{showData.userNo}}）</span>
              </li>
              <li>
                <span class="kr-addr">{{showData.userAddr}}</span>
              </li>
              <li>
                <span>
                  账户余额：<span style="font-weight: 600;">{{showData.accountBalance}}</span>元&nbsp;&nbsp;&nbsp;&nbsp;
                </span>
              </li>
              <li>
                <span>
                  应缴总额：<span style="font-weight: 600;">{{showData.totalArrearage}}</span>元
                </span>
              </li>
              <li>
                <span>合计应缴：<span class="total_num" style="font-weight: 600;">{{showData.totalPay}}</span>元</span>
              </li>
            </ul>
            <ul v-if="!showData.isShowUL && !showData.isShowCompany" class="kr-ul">
              <li>
                <span>{{showData.ctmName | dealUser}}</span>(<span>{{showData.ctmNo}}</span>)
              </li>
              <li>
                <span>账户号：</span><span>{{showData.accountNo}}</span>
              </li>
              <li>
                <span>账户余额：<span class="total_num">{{showData.accountBalance}}</span>元</span>
              </li>
            </ul>
            <ul v-if="showData.isShowCompany" class="kr-ul">
              <li>
                <span>{{showData.userName}}</span>(<span>{{showData.userNo}}</span>)
              </li>
              <li>
                <span class="kr-addr">{{showData.userAddress}}</span>
              </li>
              <li>
                <span>所属水司：<span class="total_num">{{showData.groupName}}</span></span>
              </li>
            </ul>
            <ul v-if="showData.isShowArea" class="kr-ul">
              <li>
                <span class="total_num">{{showData.groupArea}}</span>
              </li>
              <li>
                <span>{{showData.userName}}</span>(<span>{{showData.userNo}}</span>)
              </li>
              <li>
                <span class="kr-addr">{{showData.userAddress}}</span>
              </li>
            </ul>
            <ol>
              <!-- <li class="first_li" v-if="showData.isShowMoreUser">
                <a @click="goMoreUser()">
                  <b>多户账单</b>
                </a>
              </li> -->
              <!-- <li class="first_li" v-if="showData.isShowLink">
                <a @click="goFastPay()">
                  <b>为其他户号缴费</b>
                </a>
              </li> -->
              <li style="margin-top:40%;" v-if="showData.isShowBtn">
                <m-button size="small" type="white" style="font-size: 0.8rem;background:#ed702d;color:#fff;" @click.native='pay()'>
                  充值缴费
                </m-button>
              </li>
            </ol>
          </div>

          <div class="header_link">
            <b class="link_item" @click="goFastPay()" v-if="showData.isShowLink">
              为其他户号缴费
            </b>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["showData", "title"],
  data() {
    return {
      header: require('../../static/img/header1.png'),
      url: '',
    }
  },
  filters: {
    dealUser: function (value) {
      if (value.length > 7)
        return value.slice(0, 7) + '...'
      else
        return value
    }
  },
  created() {
    this.url = window.location.href.split('#')[0]
  },
  mounted() {
    console.log(this.title, $('#myTitle').html(this.title));
    $('#myTitle').html(this.title)
  },
  methods: {
    getGroupOpenId(str) {
      let _this = this;
      let params = {//接口入参
        "data": {
          userNo: localStorage.getItem('userNo'),
          groupCode: localStorage.getItem('groupCode'),
          openId: localStorage.getItem('openId'),
          frontEndUrl: _this.url + '' + str,
        },
      }
      this.$api.fetch({
        params,//参数
        apiUrl: '/getOtherAuthorize',//接口地址
      }).then(res => {
        location.href = res;
        localStorage.setItem('groupOpenId', _this.getQueryVariable('groupOpenId'))
      })
    },
    getFormData() {
      let that = this;
      let data = {
        userNo: localStorage.getItem('userNo'),
        // area:localStorage.getItem('groupCode')
        area: "1",
      };
      let params = {
        data,
      }
      that.$api.fetch({
        params,//参数
        apiUrl: '/myWater/bindUserBill',//接口地址
      }).then(res => {
        that.showData.userName = res.userName;
        that.showData.userNo = res.userNo;
        that.showData.userAddr = res.userAddr;
        that.showData.totalArrearage = res.totalArrearage;
        that.showData.totalPay = res.totalPay;
        that.showData.accountBalance = res.accountBalance;
      })
    },
    goFastPay() {
      this.$router.push({ path: '/fastpay' })
    },
    pay() {
      console.log(localStorage.getItem('groupOpenId'));
      if (localStorage.getItem('groupOpenId') == '') {
        this.getGroupOpenId('#/recharge');
        return
      } else {
        this.$router.push({ path: '/recharge' })
      }
      // this.$router.push({path:'/pay'})
    },
    goMoreUser() {
      this.$store.state.moreUserShow = 2;
      // localStorage.setItem('moreUser','2')
      // sessionStorage.setItem('moreUser','2')
      this.BUS.$emit('goMoreUser', true)
    }
  },
  watch: {
  }
}
</script>

<style scoped lang="less">
.header-two {
  // height: 30%;
  border-radius: 0 0 1% 1%;
  height: 9rem;
  width: 100%;
  margin: 0;
  background: url("../../static/img/juxingtu(h).png") no-repeat 0px 0px;
  background-size: 100% 100%;
  .header_img {
    width: 100%;
    height: 27px;
    margin: 2% 1%;
    img {
      // width: 30%;
      float:right;
      height: 100%;
    }
  }
  .row {
    height: 100%;
  }
  .col-100 {
    height: 100%;
    .user-card {
      height: 100%;
      font-weight: 100;
      padding: 1% 1%;
      background-size: 100%;
      position: relative;
      .header_link {
        width: 100%;
        position: absolute;
        top: 40%;
        right: 3%;
        color: white;
        font-weight: 300;
        background: url("../../static/img/kuaisu.png") no-repeat;
        background-position: right;
        background-size: 14px;

        .link_item {
          float: right;
          font-size: 14px;
          padding-right: 4%;
          border-bottom: 1px solid white;
        }
      }
      &:after {
        display: block;
        width: 100%;
        height: 100%;
        content: "";
      }
      .card-header {
        img {
          width: 28%;
        }
        a {
          color: #e0e0e0;
          float: right;
          // font-family: PingFang_Light;
          font-weight: 100;
          // font-size: 14px;
          font-size: 1rem;
          line-height: 30px;
          font-weight: 500;
          // padding-right: 15px;
          padding: 1%;
          background: url("../../static/img/kuaisu.png") no-repeat;
          background-position: right;
          background-size: 13px;
          border-bottom: 1px solid white;
        }
      }
      .card-content {
        padding: 0 2%;
        margin-top: 6%;
        width: 100%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        position: relative;
        ul {
          width: 55%;
          // width: 58%;
          li {
            color: #fff;
            // padding: 1.5%;
            padding: 0.5%;
            font-weight: 300;
            width: 100%;
            b {
              width: 40%;
              font-weight: 300;
            }
            span {
              width: 60%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              word-break: keep-all;
            }
          }
        }
        ol {
          // width: 42%;
          width: 45%;
          li {
            padding: 6px;
            text-align: right;
            a {
              display: inline-block;
              color: #1e1f6a;
              font-weight: bolder;
              .button {
                border-radius: 0.2rem !important;
                // font-family: PingFang_Bold;
                font-weight: 600;
              }
            }
          }
        }
        .first_li {
          a {
            color: #e0e0e0 !important;
            float: right;
            // font-family: PingFang_Light;
            font-weight: 100;
            // font-size: 14px;
            font-size: 0.6rem;
            line-height: 30px;
            font-weight: 500;
            padding-right: 15px;
            background: url("../../static/img/kuaisu.png") no-repeat;
            background-position: right;
            background-size: 13px;
            border-bottom: 1px solid white;
          }
          img {
            width: 20px;
            height: 14px;
            display: inline-block;
            vertical-align: middle;
          }
        }
        .kr-ul {
          // margin-top: 6%;
          width: 100%;

          li {
            color: #fff;
            padding: 12px 7px;
            font-weight: 300;

            b {
              font-weight: 300;
            }
            font-size: 14px;
            a {
              display: inline-block;
              color: #3193f6;
              float: right;
            }
          }
        }
        .kr-addr {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: keep-all;
          // white-space:nowrap;
          // text-overflow: ellipsis;
          // overflow: hidden;
        }
      }
    }
  }
}
</style>