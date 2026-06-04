<template>
  <div v-if="paginationStyle !== 'loadMore'">
    <div class="record_count_body sh-pagination-summary sh-pagination-summary-left mb-3">
      <template v-if="!hideLoadMore">
        <span class="per_page_show">Showing</span>
        <select
          v-if="!show_custom_per_page"
          class="select_per_page"
          v-on:change="changePerPage"
          v-model="visible_per_page"
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
      </template>
      <span v-if="!hideCount" class="record_counts">of {{ summaryText }}</span>
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
    <div class="record_count_body sh-pagination-summary mb-2" v-if="!hideCount">
      <span v-if="!hideCount" class="record_counts">{{ summaryText }}</span>
    </div>
    <div class="text-center" v-if="this.pagination_data.loading === 1 && loadMore && hideLoadMore">
      <div class="spinner-border" role="status">
      </div>
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
      visible_per_page: Number(this.pagination_data.per_page),
      custom_per_page: null,
      show_custom_per_page: false,
      loadingMore: 0,
      pageOptions: [10,25,50,100,200,400]
    }
  },
  mounted(){
    this.syncVisiblePerPage()
  },
  watch: {
    'pagination_data.per_page': 'syncVisiblePerPage',
    'pagination_data.record_count': 'syncVisiblePerPage',
    'pagination_data.displayCount': 'syncVisiblePerPage',
    perPage: 'syncVisiblePerPage'
  },
  methods: {
    syncVisiblePerPage: function () {
      this.per_page = Number(this.pagination_data.per_page)
      this.addPageOption(this.perPage)
      this.addPageOption(this.per_page)
      this.addPageOption(this.visiblePerPageValue)
      this.visible_per_page = this.visiblePerPageValue
    },
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
      if (this.visible_per_page === 'custom') {
        this.custom_per_page = null
        this.show_custom_per_page = true
        return
      }
      this.per_page = Number(this.visible_per_page)
      this.addPageOption(this.per_page)
      this.$emit('changeKey', 'per_page', this.per_page)
    },
    applyCustomPerPage: function () {
      const customPerPage = Number(this.custom_per_page)
      if (customPerPage < 1) return
      this.addPageOption(customPerPage)
      this.per_page = customPerPage
      this.visible_per_page = customPerPage
      this.show_custom_per_page = false
      this.changePerPage()
      this.custom_per_page = null
    },
    cancelCustomPerPage: function () {
      if (!this.show_custom_per_page) return
      if (this.custom_per_page) return
      this.show_custom_per_page = false
      this.visible_per_page = this.visiblePerPageValue
    },
    loadMoreRecords: function () {
      this.$emit('loadMoreRecords', 'now')
    }
  },
  computed: {
    sortedPageOptions: function () {
      return [...this.pageOptions, this.visiblePerPageValue]
        .filter((option, index, options) => options.indexOf(option) === index)
        .sort((a, b) => a - b)
    },
    summaryText: function () {
      const total = Number(this.pagination_data.record_count || 0)
      const shown = Number(this.pagination_data.displayCount || total)
      const itemText = total === 1 ? 'record' : 'records'
      if (this.paginationStyle === 'loadMore') {
        return `${shown} of ${total} ${itemText}`
      }
      return `${total} ${itemText}`
    },
    visiblePerPageValue: function () {
      const total = Number(this.pagination_data.record_count || 0)
      const perPage = Number(this.per_page)
      if (total > 0 && perPage > total) return total
      return perPage
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
.sh-pagination-summary {
  align-items: center;
  color: #1f2937;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  justify-content: center;
  line-height: 1.4;
}

.sh-pagination-summary-left {
  justify-content: flex-start;
}

.select_per_page {
  width: auto;
}

.custom_per_page {
  width: 90px;
}

.sh-pagination-divider,
.record_counts {
  color: #64748b;
}
</style>
