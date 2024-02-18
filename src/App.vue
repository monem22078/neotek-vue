<template>
  <div>
    <router-view></router-view>
    <div class="home">
      <the-loader v-if="showLoading"></the-loader>
    </div>
  </div>
</template>

<script>
import TheLoader from "@/components/TheLoader.vue";
import { ref } from "vue";
import { mapState } from 'vuex';

export default {
  name: "App",
  computed: {
    ...mapState({
      showLoading: state => state.showLoading,
    })
  },
  components: {
    TheLoader,
  },
  setup() {
    const modalActive = ref(false);

    const toggleModal = () => {
      modalActive.value = !modalActive.value;
    };

    return { modalActive, toggleModal };
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
