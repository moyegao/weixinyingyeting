<template>
  <div class="tab-container">
    <div :class="{
      'buttons-tab' : yangsi === 'default',
      'buttons-group' : yangsi === 'button' || yangsi === 'button-bordered',
      'button-bordered' : yangsi === 'button-bordered',
      'button-small': size === 'small',
      'button-large': size === 'large'
      }">
      <m-button 
         v-for="(item, index) in items" 
         :key="item.id"
         :active="index === mutableActive"
         @click.native="onClick(index)"
         >{{item.title}}</m-button>
    </div>
    <div class="tabs">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { Button } from '../buttons'

export default {
  props: {
    active: {
      type: Number,
      default: 0
    },
    yangsi: {
      type: String,
      default: 'default' // default, button, button-bordered
    },
    size: {
      type: String,
      default: 'default'
    }
  },
  components: {
    'm-button': Button
  },
  data () {
    return {
      mutableActive: this.active,
      items: []
    }
  },
  methods: {
    onClick (active) {
      this.mutableActive = active
      this.$children.forEach((c) => {
        c.setShow && c.setShow(false)
      })
      this.$children[this.mutableActive].setShow(true)
    }
  }
}
</script>

<style lang="less">
@import 'tabs.less';
</style>
