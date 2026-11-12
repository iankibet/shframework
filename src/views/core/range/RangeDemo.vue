<script setup>
import { ref } from 'vue'
import ShRange from '@/lib/components/ShRange.vue'

const lastEvent = ref(null)
const dark = ref(false)

const rangeSelected = (source, range) => {
  lastEvent.value = {
    source,
    period: range.period,
    from: range.from.toISO(),
    to: range.to.toISO(),
    query: range.query
  }
}
</script>
<template>
  <div class="container py-4" :data-bs-theme="dark ? 'dark' : 'light'">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="mb-0">ShRange playground</h4>
      <div class="form-check form-switch">
        <input id="rangeDark" v-model="dark" class="form-check-input" type="checkbox">
        <label for="rangeDark" class="form-check-label">Dark mode</label>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-md-6">
        <div class="card p-3 h-100">
          <h6>Default (This Month)</h6>
          <div><sh-range @range-selected="r => rangeSelected('default', r)" /></div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card p-3 h-100">
          <h6>selected="Last Month", start=2018</h6>
          <div><sh-range selected="Last Month" :start="2018" @range-selected="r => rangeSelected('last month', r)" /></div>
        </div>
      </div>
      <div class="col-12">
        <div class="card p-3">
          <div class="d-flex justify-content-between align-items-center">
            <h6 class="mb-0">Right-aligned in a toolbar (like ShTable)</h6>
            <sh-range selected="7 Days" @range-selected="r => rangeSelected('toolbar', r)" />
          </div>
        </div>
      </div>
      <div class="col-12">
        <div class="card p-3">
          <h6>Last rangeSelected payload</h6>
          <pre class="mb-0 small">{{ lastEvent ? JSON.stringify(lastEvent, null, 2) : '—' }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>
