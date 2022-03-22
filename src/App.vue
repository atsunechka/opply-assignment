<template>
  <router-view/>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { provideAppState } from '@/app.provider';
  import { RouteNames } from './types';

export default defineComponent({
  name: RouteNames.ROOT,
  setup() {
    return {
      ...provideAppState(),
      RouteNames
    }
  }
});

</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 1rem;
}

button {
  background: none;
  box-shadow: none;
  border: none;
  cursor: pointer;
}
</style>


