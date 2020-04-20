<template>
  <van-pull-refresh @refresh="onRefresh" v-model="isLoading">
    <myHeader :isShow='isShow' :title='title'></myHeader>
    <div class="row bottom_content" @touchmove="touchmove($event)" @scroll="scroll($event)">
      <slot></slot>
      <!-- <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad($event)">
        <slot></slot>
      </van-list> -->
    </div>
  </van-pull-refresh>
</template>

<script>
import myHeader from '@/comments/myHeader';
import { PullRefresh, List, Sticky } from 'vant';
export default {
  components: {
    myHeader
  },
  props:["isShow","title"],
  data() {
    return {
      //上拉刷新
      isLoading: false,
      scrollTop: 0,//滚动条隔顶部的距离
      //下拉加载
      loading: false,
      finished: false,
    }
  },
  mounted() {
    
  },
  methods: {
    onRefresh() {//上拉刷新
      this.$toast('刷新成功');
      this.isLoading = false;
    },
    onLoad(e) {//下拉加载更多
      // e.stopPropagation()
      // 异步更新数据
      setTimeout(() => {
        this.loading = false;
        if (this.needData.length) {
          this.finished = true;
        }
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
  },
  destroyed() {

  },
  watch: {
  }
}
</script>

<style lang="less">
// scoped

</style>
