<template>
  <div>
    <div :class="$style.suppliers_title" v-text="'Quotes'"/>
    <div :class="$style.quote_list" v-if="quoteList">
      <div :class="$style.quote"
           v-for="(quote, key) in quoteList"
           :key="key">
        <div :class="$style.quote_info">
          <div :class="$style.quote_title" v-text="quote.title"/>
          <div :class="$style.quote_date" v-if="quote.created" v-text="`(${quote.created})`"/>
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
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { Maybe, PaginationLinks, Quote, QuotesResult, RouteNames } from '@/types';
  import { injectAppState } from '@/app.provider';
  import { useRouter } from '@/utils';
  import Pagination from '@/components/Pagination.vue';
  import { format, parseISO } from 'date-fns'

  export default defineComponent({
    name: RouteNames.QUOTES,
    components: { Pagination },
    setup() {
      const state = injectAppState()
      const { getFetchRequest } = state;
      const quoteList = ref<Quote[]>([]);
      const router = useRouter();
      const pageLinks = ref<PaginationLinks>({
        previous: null,
        next: null
      });
      const count = ref<Maybe<number>>(null);
      const collapsedRows = ref<Record<number, boolean>>({});
      const currentPage = ref(router.currentRoute.value.query?.page || 1);
      
      const getQuotes = async () => {
        const response = await getFetchRequest({
          url: 'api/v1/quotes',
          data: { page: currentPage.value },
          method: 'GET'
        }) as Maybe<QuotesResult>

        if (!response?.results)
          return;

        quoteList.value = response.results.map(quote => ({
          ...quote,
          created: format(parseISO(quote.created), 'yyyy.MM.dd')
        }));

        pageLinks.value = {
          next: response.next,
          previous: response.previous
        }

        count.value = response.count
      }

      const goToPage = (pageNumber: number) => {
        currentPage.value = pageNumber;
        router.replace({
          query: {
            page: pageNumber
          }
        })
        getQuotes()
      }


      const init = async () => {
        await router.replace({
          path: router.currentRoute.value.path,
          query: {
            page: currentPage.value,
          }
        })
        await getQuotes();
      }

      init();

      return {
        quoteList,
        count,
        collapsedRows,
        currentPage,
        pageLinks,
        goToPage
      }
    }
  });

</script>
<style lang="scss" module>
.suppliers_title {
  font-size: 2rem;
}
.quote_list {
  display: grid;
  grid-auto-flow: row;
  grid-row-gap: 0.5rem;
}

.quote {
  width: 100%;
  padding: 0.4rem 0.6rem;
}

.quote_info {
  display: flex;
  align-items: center;

  margin-left: 2.5rem;
}

.quote_title {
  margin-bottom: 0.2rem;
}

.quote_date {
  font-size: 0.7rem;
  color: #c7c7c7;
  margin-left: 1rem;
}
</style>