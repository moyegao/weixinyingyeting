<template>
  <Modaltwo :show='show' ref="modaltwo">
    <div slot="title">{{title}}</div>
    <div slot="content">{{content}}</div>
    <div slot="buttons" class="modal-buttons">
      <span class="modal-button modal-button-cancel" v-on:click="_onCancel()">{{cancelText}}</span>
      <span class="modal-button" @click="_onOk()">{{okText}}</span>
    </div>
  </Modaltwo>
</template>

<script>
import Modaltwo from './Modaltwo'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Alert'
    },
    content: {
      type: String,
      default: ''
    },
    okText: {
      type: String,
      default: '确认'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    onOk: {
      type: Function
    },
    onCancel: {
      type: Function
    }
  },
  components: {
    Modaltwo
  },
  methods: {
    open () {
      this.$refs.modaltwo.open()
      this.$emit('open', this)
    },
    close () {
      this.$refs.modaltwo.close()
      this.$emit('close', this)
    },
    _onOk () {
      if (this.onOk) {
        this.onOk()
      }
      this.close()
    },
    _onCancel () {
      if (this.onCancel) {
        this.onCancel()
      }
      this.close()
    }
  }
}
</script>
