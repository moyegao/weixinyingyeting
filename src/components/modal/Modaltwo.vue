<template>
  <div>
    <overlay :show="mutableShow" :click="overlayClick"></overlay>
    <transition name="modaltwo">
      <div class="modaltwo" v-if="mutableShow">
        <div class="modaltwo-inner">
          <div class="modaltwo-title">
            <slot name="title">空空如也烦死了</slot>
          </div>
          <div class="modaltwo-text">
            <slot name="content"></slot>
          </div>
        </div>
        <slot name="buttons">
        </slot>
      </div>
    </transition>
  </div>
</template>

<script>
import Overlay from '../overlay'

export default {
  components: {
    Overlay
  },
  props: {
    show: { // init status
      type: Boolean,
      default: false
    },
    overlayClose: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      mutableShow: this.show
    }
  },
  methods: {
    open () {
      this.mutableShow = true
      this.$emit('open', this)
    },
    close () {
      this.mutableShow = false
      this.$emit('close', this)
    },
    overlayClick () {
      this.mutableShow = false
    }
  }
}
</script>

<style lang="less">
@import 'modal.less';
</style>