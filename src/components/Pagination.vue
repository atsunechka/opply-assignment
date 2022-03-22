<template>
  <div :class="$style.pagination">
    <a :class="[
          $style.button_page,
          $style.prev_page,
         hasActiveButtons.previous && $style.active_button]"
       v-text="'<'"
       @click="$emit('click', currentPage - 1)"/>
    <template  v-if="currentPage !== 1">
      <div :class="$style.active_link" v-text="'1'" @click="$emit('click', 1)"/>
      <div v-text="'...'"/>
    </template>
    <div v-text="currentPage" :class="$style.current_page"/>
    <template v-if="currentPage !== lastPage">
      <div v-text="'...'"/>
      <div :class="$style.active_link" v-text="lastPage" @click="$emit('click', lastPage)"/>
    </template>
    <a :class="[
          $style.button_page,
          $style.next_page,
         hasActiveButtons.next && $style.active_button]"
       v-text="'>'"
       @click="$emit('click', currentPage + 1)"/>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, PropType, ref } from 'vue';
import { PaginationLinks } from '@/types';

export default defineComponent({
  name: 'Pagination',
  emits: ['click'],
  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    count: {
      type: Number,
      default: null
    },
    hasActiveButtons: {
      type: Object as PropType<PaginationLinks>,
      default: () => ({
        previous: null,
        next: null
      })
    }
  },
  setup (props) {
    const lastPage = computed(() => props.count
      ? Math.ceil(props.count / 10)
      : props.currentPage);

    return {
      lastPage
    }
  }
});

</script>
<style lang="scss" module>
  .pagination {
    display: grid;
    grid-auto-flow: column;
    grid-column-gap: 0.4rem;
    margin-top: 2rem;
    align-items: center;
    justify-content: center;
  }

  .button_page {
    display: flex;
    padding: 0.4rem 0.6rem;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    border-radius: 0.2rem;
    background-color: #d2d2d2;
    user-select: none;
    pointer-events: none;
  }

  .next_page {
    margin-left: 1rem;
  }

  .prev_page {
    margin-right: 1rem;
  }

  .active_button {
    cursor: pointer;
    user-select: auto;
    pointer-events: auto;
  }

  .active_link {
    cursor: pointer;
  }

  .current_page {
    color: #9b5c5c;
  }

</style>