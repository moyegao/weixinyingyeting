 <template>
  <div class="download">
    <img v-if="is_weixin()" src="../../../static/img/download.jpg" style="width:100%;height: 100%;">
  </div>
</template>

<script>
export default {
  data() {
    return {
      downloadURL: decodeURIComponent(window.location.href.split('?url=')[1])
    }
  },
  mounted() {
    this.goDownload()
  },
  methods: {
    //判断是否是微信浏览器
    is_weixin() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        console.log('微信浏览器');
        return true;
      } else {
        console.log("不是微信浏览器");
        return false;
      }
    },
    goDownload(){
      if (this.is_weixin()) {
      } else {
        
        window.location.href = this.downloadURL
      }
    }
  },
  watch: {

  }
}
</script>

<style scoped lang="less">
.download {
}
</style>