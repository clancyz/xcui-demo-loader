<template>
  <div id="app">
    <div id="left">
      <textarea v-model="source" name="" id="" cols="30" rows="50"></textarea>
    </div>
    <div id="right" v-html="ret">
    </div>
  </div>
</template>

<script>
import "./assets/prism.css";

import loader from './lib';

export default {
  name: 'app',
  data() {
    return {
      source: ''
    }
  },
  computed: {
    ret() {
      return loader(this.source);
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
pre {
  text-align: start;
}
#left {
  float: left;
  width: 40%;
}
#right {
  float: right;
  width: 50%;
}
textarea{
  width: 100%;
}
</style>
