<template>
  <div v-if="supplier">
    <div :class="$style.supplier__header" v-text="'Supplier Info'"/>
    <div :class="$style.wrapper">
      <div :class="$style.name" v-text="supplier.name"/>
      <div :class="$style.description" v-text="supplier.description"/>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { RouteNames } from '@/types';
import { injectSuppliersState } from '@/views/suppliers/suppliers.provider';
import { useRouter } from '@/utils';

export default defineComponent({
  name: RouteNames.SUPPLIER,
  setup() {
    const { hashKeySuppliers } = injectSuppliersState();
    const router = useRouter();
    const supplier = computed(() =>
      hashKeySuppliers.value?.[router.currentRoute.value.params?.id as string])

    return {
      supplier
    }
  }
});
</script>
<style lang="scss" module>
  .supplier__header {
    font-size: 2rem;
  }

  .wrapper {
    margin-top: 1.2rem;
    display: flex;
    flex-flow: column;
    align-items: start;
    margin-left: 2rem;
  }
  .name {
    font-size: 1.2rem;
    margin-top: 1.2rem;
    font-weight: 500;
  }

  .description {
    margin-top: 0.4rem;
    font-size: 0.9rem;
  }
</style>