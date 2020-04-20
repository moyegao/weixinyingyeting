<template>

</template>

<script>
export default {
  data() {
    return {

    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init(){
      let _this = this;
      let groupCode = localStorage.getItem('groupCode');
      let userNo = localStorage.getItem('userNo');
      let billMonth = _this.$route.query.billMonth;
      let params = {//接口入参
        data: {
          groupCode,
          userNo,
          billMonth,
        }
      }
      console.log(params);
      _this.$api.fetch({
        params,//参数
        apiUrl: '/myWater/billDownload',//接口地址
      }).then(res => {
        Toast.success('账单已成功发送至您邮箱，请稍后查看')
      })
    }
  },
  watch: {

  }
}
</script>

<style scoped lang="less">
</style>