 <template>
  <div class="user-guide">
    <page-content>
      <div class="content-padded">
        <h1>拍照指南</h1>
        <!-- <h2>一、操作页面</h2> -->
        <!-- <span>①从微信公众号菜单栏进入自助抄表</span>
        <img src="../../../../static/img/vue1.png" alt="" class="img-vue">
        <span>②点击“自助抄表”后进入用户选择页面（左图），
          用户首先要选择已绑定的用户进行抄表，如果只绑定了一户，
          则直接进入读数录入页面（右图）：</span>
        <img src="../../../../static/img/vue2.png" alt="" class="img-vue">
        <img src="../../../../static/img/vue3.png" alt="" class="img-vue">
        <span>③水表抄读，并将读数填入“当前读数”，水表抄读方式如下：</span>
        <span>
          水表抄读时计量单位为立方米“m3”，
          收取水量的基本计量单位是立方米，
          凡小于1立方米的尾数均不计算。
          所以，在抄读水表时，凡分度值小于1立方米的示值可不必抄录，
          为便于抄读水表，一般水表在标度盘上均标有基本计量单位，立方米“m3”，
          标度盘上的数字符号，分度线及指针均以不同颜色表示，分度值大于或等于1立方米的均为
          <span class="title"> 黑色必须抄读</span>，
          小于1立方米的均为
          <span class="title">红色不必抄读</span>。
        </span>
        <span>1、指针、字轮式水表（数字式水表、直读式水表）：</span>
        <span>
          这种水表的指示型式是指针式水表与字轮式水表的结合，
          其标度大于或等于0.1（或1）m3的为字轮上数字显示，
          标度小于0.1（或1）m3的为指针在标度盘上指示。
          后者供校验和检定用，而前者则便于抄读。
          水表读数全部由字轮上数字显示出来，这种水表看起来很方便，
          只要按照通常的阅读习惯，由左至右依次读下去就是客户目前的水表读数。
        </span>
        <span>图1.指针、字轮式水表（<span class="title">水表读数为1 m3</span>）</span>
        <img src="../../../../static/img/water2.jpg" alt="" class="img-water">
        <span>2、指针式：水表读数全部由指针在标度盘上指示出来：</span>
        <span>
          看指针式水表就稍微复杂一些，
          指针式水表的标度盘上依次排列有四个黑色指针和四个红色指针。
          1立方米以下的水量以红色指针显示，
          按逆时针方向依次为×0.0001、×0.001、×0.01、×0.1倍率；
          1立方米以上的水量以黑色指针显示，
          按逆时针方向依次为×1、×10、100、×1000倍率。
          客户应先读出各指针方向数字，
          将指针指向的数字（若指在两数之间，取较小的那个数字）
          乘以相应的倍率再相加所得的和即水表的读数。
        </span>
        <span>图2.指针式水表（水表读数为1941 m3）</span>
        <img src="../../../../static/img/water1.jpg" alt="" class="img-water"> -->
        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;水表拍照，照片应从水表正上方进行拍取，尽量保证能从照片上清晰的看到水表读数。示例图片如下：</span>
        <img src="../../../../static/img/water3.png" alt="" class="img-water">
        <img src="../../../../static/img/water4.png" alt="" class="img-water">
      </div>
    </page-content>
  </div>
</template>

<script>
export default {
  components: {

  },
  data() {
    return {

    }
  },
  filters: {

  },
  mounted() {

  },
  methods: {

  },
  watch: {
  }
}
</script>

<style scoped lang="less">
.user-guide {
  width: 100%;
  .page-content {
    padding: 2% 2%;
    .content-padded {
      width: 100%;
      margin:0;
      h1{
        text-align: center;
        font-weight: bolder;
      }
      span{
        display: block;
      }
      .title{
        font-weight: bold;
        color:red;
        display: inline-block;
      }
      .img-vue {
        width: 45%;
      }
      .img-water {
        width: 90%;
      }
    }
  }
}
</style>