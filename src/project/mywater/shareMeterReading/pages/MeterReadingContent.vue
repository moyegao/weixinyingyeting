<template>
  <div class="people-apply">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link>
        <icon icon="back"></icon>返回
      </header-link>
      <header-title>抄表内容</header-title>
    </page-header> -->
    <page-content>
      <div class="content-padded">
        <myHeader :title="title"></myHeader>
        <div class="kr-body">
          <div class="kr-containt">
            <div class="kr-top">
              <h4>广东省深圳市罗湖区太宁路85号科技大厦408号</h4>
            </div>
            <div class="kr-middle">
              <div class="kr-div kr-div1">
                <p class="kr-p">水表编号</p>  
                <p>10000001</p>
              </div>
              <div class="kr-div kr-div2">
                <p class="kr-p">水表位置</p>
                <p>位置I</p>
              </div>
            </div>
            <div class="kr-middle2">
              <p>止码</p>
              <input type="text" placeholder="请输入止码"/>
            </div>
            <div class="kr-middle3">
              <img src="../../../../../static/img/juxing.png" alt="" class="kr-img kr-img1">
              <img src="../../../../../static/img/juxing.png" alt="" class="kr-img kr-img2">
              <img src="../../../../../static/img/juxing.png" alt="" class="kr-img kr-img3">
            </div>
            <div class="kr-buttom">
              <m-button size="big"  type="warning">
                <icon icon="back" class="kr-icon-left"></icon>
                  保存
                <icon icon="back" class="kr-icon-right"></icon>
              </m-button>
            </div>
          </div>
        </div>

      </div>
    </page-content>
  </div>
</template>

<script>
import myHeader from '@/comments/myHeader'
export default {
  components:{
    myHeader
  },
  data() {
    return {
      title: '抄表内容',
      list: [
        {
          title: '用户编号',
          content: '1001111'
        },
        {
          title: '用户地址',
          content: '步埠路四级39号'
        }
      ],
      buttons: [
        {
          name: '切换用户'
        },
        {
          name: '充值'
        },
        {
          name: '缴费'
        }
      ]
    }
  },
  methods: {

  }
}
</script>

<style scoped lang="less">
.people-apply {
  .content-padded{
    margin:0;
    .kr-body{
      padding:0 10px;
      .kr-containt{
        margin-top:18px;
        box-shadow: 1px 1px 5px 1px #888;
        .kr-top{
          padding: 16px 10px;
          h4{
            // font-family: PingFang_Bold;
            font-weight: 600;
            font-size:15px;
            text-align: center;
          }
        }
        .kr-middle{
          display: flex;
          width: 100%;
          .kr-div{
            width: 33.3%;
            height: 60px;
            padding: 10px 10px;
            text-align: center;
            border: 1px solid #e6e6e6;
            p{
              // font-family: PingFang_Bold;
              font-weight: 600;
              font-size:15px;
            }
            .kr-p{
              color:#ccc;
              // font-family: PingFang_Medium;
              font-size:13px;
            }
          }
          .kr-div1{
            width: 33.3%;
          }
          .kr-div2{
            width: 66.6%;
          }
        }
        .kr-middle2{
          padding:10px 10px;
          height: 60px;
          border-bottom: 1px solid #e6e6e6;
          p{
            text-align: center;
            color:#ccc;
            // font-family: PingFang_Regular;
            font-weight: 300;
            font-size:13px;
          }
          input{
            width: 100%;
            border:0;
            text-align: center;
            font-size: 15px;
            // font-family: PingFang_Medium;
          }
        }
        .kr-middle3{
          padding: 10px;
          width: 100%;
          img{
            width: 110px;
            height: 110px;
            border-radius: 10px;
          }
          .kr-img2,.kr-img3{
            margin-left: 10px;
          }
        }
        .kr-buttom{
          
          .button{
            height: 40px;
            line-height: 40px;
            border-radius: 0;
            // font-family:PingFang_Regular ;
            font-size: 16px;
            .kr-icon-left{
              display: inline-block;
              float: left;
            }
            .kr-icon-right{
              display: inline-block;
              transform: rotate(180deg);
              float: right;
            }
          }
          .button-danger {
            background: #FF4D4D;
          }
          .button-success {
            background: #49cc7c;
          }
          .button-warning{
            background: #479eff;
          }
        }
      }
    }  
    .row{
      margin-left:0; 
    }
  }

  .item-input input{
    height: 2.3rem;
  }
  .addImg {
    font-size: 24px;
    color: #fff;
    background: #3193f6;
    height: 40px;
    width: 40px;
    text-align: center;
    line-height: 40px;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .btnBox{
    margin-top: 7rem;
  }
  .button-large {
    width: 4.8rem;
    height: 1.5rem;
    line-height: 1.5rem;
    display: inline-block;
    padding: 0;
  }
  .col-50 {
    width: 29%;
  }
  .scan {
    width: 3.5rem;
    height: 1.5rem;
    line-height: 1.5rem;
    margin: 0 0 0 0;
    position: absolute;
    // bottom: 5rem;
    left: 13rem;
    top: 0.45rem;
  }
  .next {
    background: rgb(243, 242, 242);
    color: gray;
    border: 1px solid #3193f6;
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

