<template>
  <div>
    <div v-if="isMainPage">
      <div :class="$style.suppliers_title" v-text="'Suppliers'"/>
      <div :class="$style.suppliers__list">
        <div :class="$style.list_item"
             v-for="(item, key) in supplierList"
             :key="key"
             @click="goToSupplier(item.id)">
          <div :class="$style.list_item__row">
            <div :class="$style.list_item__name" v-text="item.name"/>
            <div :class="[$style.arrow]" v-text="'>'"/>
          </div>
        </div>
      </div>
      <Pagination
        :currentPage="Number(currentPage)"
        :count="count"
        :hasActiveButtons="pageLinks"
        @click="goToPage"
      />
    </div>
    <router-view v-else/>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, ref, unref } from 'vue';
import { Maybe, PaginationLinks, RouteNames, SuppliersResult } from '@/types';
import { injectAppState } from '@/app.provider';
import { provideSuppliersState } from '@/views/suppliers/suppliers.provider';
import { useRouter } from '@/utils';
import Pagination from '@/components/Pagination.vue';

export default defineComponent({
  name: RouteNames.SUPPLIERS,
  components: { Pagination },
  setup() {
    const state = injectAppState()
    const { getFetchRequest } = state;
    const { supplierList } = provideSuppliersState()
    const router = useRouter();
    const count = ref<Maybe<number>>(null);
    const pageLinks = ref<PaginationLinks>({
      previous: null,
      next: null
    });
    const isLoadingSuppliers = ref(true);
    const collapsedRows = ref<Record<number, boolean>>({});
    const currentPage = ref(router.currentRoute.value.query?.page || 1);
    const isMainPage = computed(() => router.currentRoute.value.name === RouteNames.SUPPLIERS)

    const goToSupplier = (id: number) => {
      router.push({
        name: RouteNames.SUPPLIER,
        params: { id }
      })
    }

    const getSuppliers = async () => {
      const response = await getFetchRequest({
        url: 'api/v1/suppliers',
        data: { page: currentPage.value },
        method: 'GET'
      }) as Maybe<SuppliersResult>

      if (!response?.results)
        return;

      isLoadingSuppliers.value = false;
      supplierList.value = response.results;

      pageLinks.value = {
        next: response.next,
        previous: response.previous
      }

      count.value = response.count;
    }

    const goToPage = (pageNumber: number) => {
      currentPage.value = pageNumber;
      router.replace({
        query: {
          page: pageNumber
        }
      })
      getSuppliers()
    }


    const init = async () => {
      await router.replace({
        path: router.currentRoute.value.path,
        query: {
          page: currentPage.value,
        }
      })
      await getSuppliers();
    }

    init();

    return {
      supplierList,
      collapsedRows,
      isMainPage,
      currentPage,
      pageLinks,
      count,
      goToPage,
      goToSupplier
    }
  }
});

</script>
<style lang="scss" module>
  .suppliers__list {
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: center;
    margin: 1rem auto;
    width: 550px;
  }
  .list_item {
    display: flex;
    flex-flow: column;
    cursor: pointer;
    width: 100%;
    padding: 0.4rem 0.8rem;
    margin-bottom: 0.2rem;
    border-radius: 0.1rem;
    background-color: #c7c7c7;
  }

  .suppliers_title {
    font-size: 2rem;
  }

  .list_item__name {
    margin-right: 1rem;
  }

  .list_item__row {
    display: flex;
    align-items: center;
    width: 100%;
  }

  .arrow {
    cursor: pointer;
    padding: 0.6rem;
    height: fit-content;
    margin-left: auto;
  }

</style>