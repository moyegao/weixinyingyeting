<template>
  <div class="peopleApply">
    <page-content>
      <div class="content-padded">
        <!-- <headerThree :message='message'></headerThree> -->
        <peopleApply v-if="isPeople" @isPeopleShow="isPeopleShow"></peopleApply>
        <compApply v-else @isPeopleShow="isPeopleShow"></compApply>
      </div>
    </page-content>
  </div>
</template>

<script>
import compApply from './compApply'
import peopleApply from './peopleApply'
import headerThree from '@/comments/headerThree';
import axios from 'axios'
export default {
  components: {
    headerThree, compApply, peopleApply
  },
  data() {
    return {
      isPeople: true,//居民用水 企业用水
      message: {
        title: "居民用水申请",
        span1: "本业务适用于“居民用水报装”业务,",
        span2: "请您仔细阅读报装说明后填写相关信息",
        isShow: '',
      },
    }
  },
  mounted() {

  },
  watch: {

  },
  methods: {
    isPeopleShow(val) {
      if(val == 1){//居民用水
        $('#myTitle').html('居民用水申请');
        this.isPeople = true;
      }else if(val ==2){//企业用水
        $('#myTitle').html('企业用水申请');
        this.isPeople = false;
      }
    }
  }
}
</script>

<style scoped lang="less">
.peopleApply {
  .content-padded {
    margin: 0;
    // .img_content {
    //   height: 9rem;
    // }
  }
}
</style>