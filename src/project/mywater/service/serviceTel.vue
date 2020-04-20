<template>
  <div class="service-tel">
    <!-- <page-header>
      <header-link :left="true" :edge="true" v-back-link><icon icon="back"></icon>返回</header-link>
      <header-title>客服热线</header-title>
    </page-header> -->
    <page-content>
      <div class="content-padded">
        <!-- <myHeader :title="title"></myHeader> -->
        <div class="yh-body">
          <div class="yh-img">
            <a :href='"tel:"+tel'>
              <img src="../../../../static/img/kfrx.png" alt="" @click="telPhone()">
              <span>{{tel}}</span>
            </a>
          </div>
          <div>
            <!-- <header class="mui-bar mui-bar-nav">
              <h1 class="mui-title">老五</h1>
            </header> -->
            <div class="mui-content">

              <!--chat.wxml-->
              <div id="cont">
                <div class="kr-send-message" v-for="(item,i) in message" :key="i">
                  <!--<div v-if="{{item.type == 1}}">-->
                  <div class="reply">
                    <div class="pic">
                      <img class="image" src="../../../../static/img/kfrx.png" />
                    </div>
                    <div class="content">
                      <div class="text">
                        {{item.replyMessage}}
                      </div>
                    </div>
                  </div>
                  <!--</div>-->
                  <!--<div v-if="{{item.type == null}}">-->
                  <!-- v-if="message.length!==1 && item.sendMessage == ''" -->
                  <div class="send" v-if="item.sendMessage !== ''">
                    <div class="content">
                      <div class="text">
                        {{item.sendMessage}}
                      </div>
                    </div>
                    <div class="pic">
                      <img class="image" src="../../../../static/img/1.png" />
                    </div>
                  </div>
                  <!--</div>-->
                </div>

                <div class="sendMessage">
                  <input id="inputs" type="text" placeholder="请输入您要说的话" />
                  <button id="btn_submit" @click="mit()">发送</button>

                </div>

              </div>
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
  components: {
    myHeader
  },
  data() {
    return {
      title: '客服热线',
      tel: '15574889090',

      message: [
        {
          replyMessage: '请问有什么可以帮助您的!',
          sendMessage: "",
        }
      ],
      inputMsg: "",
      scrollTop: 0,
      str: '',
    }
  },

  methods: {
    telPhone() {
      console.log('打电话');
    },
    mit() {
      let that = this;
      var name = document.getElementById("inputs").value;
      if (name != "") {
        // if (that.message.length == 1) {
        //   that.message[0].sendMessage = name;
        // }
        for (let i = 0; i < that.message.length; i++) {
          // if (that.message[i].sendMessage !== '') {
          //   that.message.push({
          //     replyMessage: '很高兴为您服务。',
          //     sendMessage: '',
          //   })
          // }else{
          //   that.message[i].sendMessage = name;
          //   that.message.push({
          //     replyMessage: '很高兴为您服务。',
          //     sendMessage: '',
          //   })
          // }

          if (that.message[i].sendMessage == '') {
            console.log(that.message[i]);
            that.message[i].sendMessage = name;
            that.message.push({
              replyMessage: '很高兴为您服务。',
              sendMessage: '',
            })
          }
        }

        console.log(that.message[0].sendMessage);
        document.getElementById("inputs").value = "";
      }
    },
  },
}
</script>

<style scoped lang="less">
.service-tel {
  .content-padded {
    background-color: #ececec;
    margin: 0;
    .yh-body {
      .yh-img {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1% 1%;
        background: pink;
        a {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }
      }
      .reply .pic,
      .send .pic {
        border-radius: 50%;
        padding: 10px;
      }

      .reply,
      .send {
        display: flex;
      }

      .reply .pic image,
      .send .pic image {
        border-radius: 50%;
        width: 80rpx;
        height: 80rpx;
      }

      .send {
        justify-content: flex-end;
      }

      .reply .content {
        padding: 10px 10px 10px 0;
        max-width: 480rpx;
      }

      .send .content {
        padding: 10px 0 10px 10px;
        max-width: 480rpx;
      }

      .reply .content .text,
      .send .content .text {
        background-color: #fff;
        border-radius: 5px;
        padding: 10px;
        font-size: 16px;
      }

      .send .content .text {
        background-color: #78fd75;
      }

      .sendMessage {
        display: flex;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 10px;
        background-color: #fff;
      }

      .inputMsg {
        flex: 2;
        background-color: #fff;
        height: 30px;
        font-size: 16px;
        padding: 5px 10px;
        border-bottom: 1px solid #ddd;
      }

      .sendMessage {
        position: fixed;
        bottom: 0px;
        width: 100%;
        height: 60px;
        line-height: 60px;
        background-color: #4cd964;
      }

      #inputs {
        position: absolute;
        display: inline-block;
        width: 65%;
        height: 40px;
        background-color: #fff;
        border-radius: 3px;
      }

      #btn_submit {
        position: absolute;
        width: 100px;
        display: inline-block;
        right: 10px;
        height: 40px;
        background-color: #dd524d;
        border: 0px;
        text-align: center;
        color: #fff;
        line-height: 1;
      }

      .image {
        width: 40px;
        border-radius: 50%;
        height: 40px;
      }
    }
  }
}
</style>