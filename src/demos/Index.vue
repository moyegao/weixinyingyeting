<template>
  <div class="page">
<!--  	<input type="hidden" v-model="$route.meta.title"/>-->
    <page-footer>
      <footer-item v-bind:class="{ 'active' : currentView === 'home' }" @click.native="changeView('home')">
        <span class="icon demo-icon-home"></span>
        <label>Home</label>
      </footer-item>
      <footer-item v-bind:class="{ 'active' : currentView === 'search' }" @click.native="changeView('search')">
        <span class="icon demo-icon-search"></span>
        <label>Search</label>
      </footer-item>
      <footer-item v-bind:class="{ 'active' : currentView === 'noti' }" @click.native="changeView('noti')">
        <span class="icon demo-icon-noti"></span>
        <span class="badge">2</span>
        <label>Noti</label>
      </footer-item>
      <footer-item v-bind:class="{ 'active' : currentView === 'about' }" @click.native="changeView('about')">
        <span class="icon demo-icon-me"></span>
        <label>About</label>
      </footer-item>
    </page-footer>
    <keep-alive>
      <component :is="currentView"></component>
    </keep-alive>
  </div>
</template>

<script>
import '../components/page'
import '../components/buttons/button.less'
import '../components/buttons/button-group.less'
import { Footer, Item, FooterItem } from '../components/footer'
import Home from './Home'
import Search from './Search'
import Noti from './Noti'
import About from './About'

console.log(FooterItem)
export default {
  components: {
//  Page,
    'page-footer': Footer,
    'footer-item': Item,
    'home': Home,
    'search': Search,
    'noti': Noti,
    'about': About
  },
  data () {
    return {
      currentView: 'home'
    }
  },
  monted(){
  	console.log(this.$router)
  },
  methods: {
    changeView (view) {
      this.currentView = view
    }
  },
  watch:{
  	$route: {
    handler: function(val, oldVal){
      console.log(val);
    },
    // 深度观察监听
    deep: true
  }
	}
}
</script>

<style lang="less">
.my-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  bottom: 2.8rem;
}
.demo-icon-home {
  background-image: url("../assets/images/home/home.png");
  background-size: 100%;
}
.demo-icon-search {
  background-image: url("../assets/images/home/search.png");
  background-size: 100%;
}
.demo-icon-noti {
  background-image: url("../assets/images/home/button.png");
  background-size: 100%;
}
.demo-icon-me {
  background-image: url("../assets/images/home/person.png");
  background-size: 100%;
}
</style>
