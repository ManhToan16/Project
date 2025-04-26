<script>
import Home from "./components/Home.vue";
import Footer from "./components/Footer.vue";
import ChatBot from "./components/ChatBot.vue";

export default {
  components: {
    Home,
    Footer,
    ChatBot,
  },
};
</script>

<template>
  <router-view></router-view>
  <ChatBot />
</template>

<style>
body {
  background-color: #bca89f;
}
</style>
