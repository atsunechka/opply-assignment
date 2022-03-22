<template>
  <div>
    <div :class="$style.navigation__wrapper" v-if="isShownNavigation">
      <a v-for="(link, index) in links" :href="link.name"
         :key="index"
         :class="[currentRouteName === link.name &&  $style.active]"
         v-text="link.text"/>
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, ref } from 'vue';
  import { injectAppState } from '@/app.provider';
  import { RouteNames } from '@/types';
  import { useRouter } from '@/utils';


  export default defineComponent({
    name: RouteNames.NAVIGATION,
    setup() {
      const state = injectAppState();
      const router = useRouter();
      const currentRouteName = computed(() => router.currentRoute.value.name);
      const { hasAuthToken } = state;

      const isShownNavigation = computed(() =>
        ![RouteNames.LOGIN, RouteNames.REGISTER].includes(currentRouteName.value as RouteNames)
        && hasAuthToken.value)

      const links = ref([
        {
          name: RouteNames.SUPPLIERS,
          text: 'Suppliers',
        },
        {
          name: RouteNames.QUOTES,
          text: 'Quotes'
        }
      ])

      return {
        isShownNavigation,
        links,
        currentRouteName,
        RouteNames
      }
    }
  });

</script>

<style lang="scss" module>
  .navigation__wrapper {
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    justify-content: center;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    grid-column-gap: 1.5rem;
    border-bottom: 1px solid #232323;
    font-size: 1.2rem;

    a {
      text-decoration: none;
      color: #232323;

      &:hover {
        color: #9b5c5c;
      }

      &.active {
        color: #9b5c5c;
        user-select: none;
        pointer-events: none;
      }
    }
  }
</style>


