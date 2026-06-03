<template>
  <div v-if="paginationStyle !== 'loadMore'">
    <div class="record_count_body mb-3">
      <span class="per_page_show">Showing</span>&nbsp;
      <select
        v-if="!show_custom_per_page"
        class="select_per_page"
        v-on:change="changePerPage"
        v-model="per_page"
      >
        <option v-for="option in sortedPageOptions" :key="option" :value="option">{{  option }}</option>
        <option value="custom">Custom</option>
      </select>
      <input
        v-else
        v-model.number="custom_per_page"
        @change="applyCustomPerPage"
        @keydown.enter.prevent="applyCustomPerPage"
        @blur="cancelCustomPerPage"
        type="number"
        min="1"
        class="custom_per_page"
        placeholder="Per page"
      >
      <span class="record_counts"> Showing {{ pagination_data.record_count }} items</span>
    </div>
    <nav aria-label="Page navigation" v-if="pagination_data != null && pagination_data.end > 1">
      <ul class="pagination">
        <li :class="getActivePage === 1 ? 'disabled' : '' " class="page-item"><a @click="changeTableKey('page',getActivePage - 1)" class="page-link">«</a></li>
        <li class="page-item" v-for="page in getPages" :key="page" v-bind:class="getActivePage === page ? 'active':''">
          <a v-if="getActivePage === page" class="page-link">{{ page }}</a>
          <a v-else-if="['..','...'].includes(page)" class="page-link">{{ page }}</a>
          <a v-else v-on:click="changeTableKey('page',page)" class="page-link">{{ page }}</a>
        </li>
        <li  :class="getActivePage === this.pagination_data.end ? 'disabled' : '' "   class="page-item"><a @click="changeTableKey('page',getActivePage + 1)" class="page-link">»</a></li>
      </ul>
    </nav>
  </div>
  <div v-else>
    <div class="record_count_body mb-2 text-center" v-if="!hideLoadMore">
      <span class="per_page_show">Showing</span>&nbsp;
      <select
        v-if="!show_custom_per_page"
        class="select_per_page"
        v-on:change="changePerPage"
        v-model="per_page"
      >
        <option v-for="option in sortedPageOptions" :key="option" :value="option">{{  option }}</option>
        <option value="custom">Custom</option>
      </select>
      <input
        v-else
        v-model.number="custom_per_page"
        @change="applyCustomPerPage"
        @keydown.enter.prevent="applyCustomPerPage"
        @blur="cancelCustomPerPage"
        type="number"
        min="1"
        class="custom_per_page"
        placeholder="Per page"
      >
    </div>
    <div class="text-center" v-if="this.pagination_data.loading === 1 && loadMore && hideLoadMore">
      <div class="spinner-border" role="status">
      </div>
    </div>
    <div class="text-center" v-if="!hideCount">
      <span class="per_page_show">Showing {{ pagination_data.displayCount }} of {{ pagination_data.record_count }} items</span>
    </div>
    <div class="text-center" v-if="pagination_data.displayCount < pagination_data.record_count && !hideLoadMore">
      <button v-if="this.pagination_data.loading !== 1" class="btn btn-sm btn-primary mt-1" @click="loadMoreRecords">
        Load More
      </button>
      <span v-else class="spinner-border"></span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Pagination',
  props: ['pagination_data', 'loadMore', 'hideCount', 'hideLoadMore', 'paginationStyle','perPage'],
  data () {
    return {
      current_page: this.pagination_data.current,
      per_page: Number(this.pagination_data.per_page),
      custom_per_page: null,
      show_custom_per_page: false,
      loadingMore: 0,
      pageOptions: [10,25,50,100,200,400]
    }
  },
  mounted(){
    this.addPageOption(this.perPage)
  },
  methods: {
    addPageOption: function (value) {
      const option = Number(value)
      if (option > 0 && !this.pageOptions.includes(option)) {
        this.pageOptions.push(option)
      }
    },
    changeTableKey: function (key, value) {
      this.$emit('changeKey', key, value)
    },
    changePerPage: function () {
      if (this.per_page === 'custom') {
        this.custom_per_page = null
        this.show_custom_per_page = true
        return
      }
      this.addPageOption(this.per_page)
      this.$emit('changeKey', 'per_page', this.per_page)
    },
    applyCustomPerPage: function () {
      const customPerPage = Number(this.custom_per_page)
      if (customPerPage < 1) return
      this.addPageOption(customPerPage)
      this.per_page = customPerPage
      this.custom_per_page = null
      this.show_custom_per_page = false
      this.changePerPage()
    },
    cancelCustomPerPage: function () {
      if (!this.show_custom_per_page) return
      if (this.custom_per_page) return
      this.show_custom_per_page = false
      this.per_page = Number(this.pagination_data.per_page)
    },
    loadMoreRecords: function () {
      this.$emit('loadMoreRecords', 'now')
    }
  },
  computed: {
    sortedPageOptions: function () {
      return [...this.pageOptions].sort((a, b) => a - b)
    },
    getActivePage: function () {
      return this.pagination_data.current
    },
    getPerPage: function () {
      return this.per_page
    },
    getPages: function () {
      const pages = this.pagination_data.end
      const current = this.pagination_data.current
      var displayPages = []
      if (pages < 13) {
        return this.pagination_data.end
      } else {
        if (current < 7) {
          for (let i = 1; i < 9; i++) {
            displayPages.push(i)
          }
          displayPages.push('...')
          displayPages.push(pages - 1)
          displayPages.push(pages)
          return displayPages
        } else if ((pages - current) < 6) {
          displayPages.push(1)
          displayPages.push(2)
          displayPages.push('...')
          var max = pages - 9
          let l = 1
          for (let i = pages; i > max; i--) {
            displayPages.push(max + l)
            l++
          }
          return displayPages
        } else {
          displayPages.push(1)
          displayPages.push(2)
          displayPages.push('...')
          for (let i = current - 3; i < current + 4; i++) {
            displayPages.push(i)
          }
          displayPages.push('..')
          displayPages.push(pages - 1)
          displayPages.push(pages)
          return displayPages
        }
      }
    }
  }
}
</script>
<style scoped>
.custom_per_page {
  width: 90px;
  margin-left: 0.35rem;
  margin-right: 0.35rem;
}
</style>
