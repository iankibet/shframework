<script setup>
import { DateTime } from 'luxon'
import shRepo from '../repo/helpers/ShRepo.js'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  start: {
    type: Number,
    default: 2021
  },
  selected: {
    type: String,
    default: shRepo.getShConfig('defaultRange', 'This Month')
  }
})

const emit = defineEmits(['rangeSelected'])

const isOpen = ref(false)
const rootRef = ref(null)
const selectedDate = ref(null)
const activeLabel = ref('')
const rangeLabel = ref('')
const customFrom = ref(null)
const customTo = ref(null)

const dates = ref([
  { label: 'Today', value: [DateTime.now().startOf('day'), DateTime.now().endOf('day')] },
  {
    label: 'Yesterday',
    value: [
      DateTime.now().minus({ days: 1 }).startOf('day'),
      DateTime.now().minus({ days: 1 }).endOf('day')
    ]
  },
  { label: '7 Days', value: [DateTime.now().minus({ days: 7 }).startOf('day'), DateTime.now().endOf('day')] },
  { label: 'This week', value: [DateTime.now().startOf('week'), DateTime.now().endOf('week')] },
  { label: 'This Month', value: [DateTime.now().startOf('month'), DateTime.now().endOf('day')] },
  {
    label: 'Last Month',
    value: [
      DateTime.now().minus({ months: 1 }).startOf('month'),
      DateTime.now().minus({ months: 1 }).endOf('month')
    ]
  },
  { label: 'Last 30 days', value: [DateTime.now().minus({ days: 30 }).startOf('day'), DateTime.now().endOf('day')] },
  { label: 'Last 60 days', value: [DateTime.now().minus({ days: 60 }).startOf('day'), DateTime.now().endOf('day')] },
  { label: 'Last 90 days', value: [DateTime.now().minus({ days: 90 }).startOf('day'), DateTime.now().endOf('day')] },
  { label: 'This Year', value: [DateTime.now().startOf('year'), DateTime.now().endOf('day')] },
  { label: '1 Year', value: [DateTime.now().minus({ months: 12 }).startOf('day'), DateTime.now().endOf('day')] },
  { label: 'All Time', value: [DateTime.fromObject({ year: 2018 }).startOf('year'), DateTime.now().endOf('day')] }
])

const setDate = (date, label) => {
  selectedDate.value = date
  activeLabel.value = `${label}`
  rangeLabel.value = '<strong>' + label + '</strong> <span class="sh-range-trigger-dates">(' +
    date[0].toFormat('LLL d, yyyy') + ' - ' + date[1].toFormat('LLL d, yyyy') + ')</span>'
  const from = date[0]
  const to = date[1]
  const period = label.toString().toLowerCase().replaceAll(' ', '_')
  emit('rangeSelected', {
    from: from,
    to: to,
    period: period,
    query: `from=${from.toFormat('MM/dd/yyyy')}&to=${to.toFormat('MM/dd/yyyy')}&period=${period}`
  })
}

const selectPreset = (date) => {
  setDate(date.value, date.label)
  isOpen.value = false
}

const applyCustom = () => {
  if (!customFrom.value || !customTo.value) return
  setDate([
    DateTime.fromISO(customFrom.value).startOf('day'),
    DateTime.fromISO(customTo.value).endOf('day')
  ], 'Custom')
  isOpen.value = false
}

const handleClickOutside = (event) => {
  if (rootRef.value && !rootRef.value.contains(event.target)) isOpen.value = false
}
const handleKeydown = (event) => {
  if (event.key === 'Escape') isOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)

  let end = parseInt(DateTime.now().toFormat('yyyy'))
  while (end >= props.start) {
    dates.value.push({
      label: end,
      value: [
        DateTime.fromObject({ year: end }).startOf('year'),
        DateTime.fromObject({ year: end }).endOf('year')
      ]
    })
    end--
  }

  const initial = dates.value.find(date => `${date.label}`.toLowerCase() === `${props.selected}`.toLowerCase())
  initial && setDate(initial.value, initial.label)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>
<template>
  <div ref="rootRef" class="sh-range">
    <button
      type="button"
      class="sh-range-trigger"
      :aria-expanded="isOpen"
      aria-haspopup="true"
      @click="isOpen = !isOpen"
    >
      <span class="sh-range-trigger-label">
        <svg xmlns="http://www.w3.org/2000/svg" class="sh-range-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
        </svg>
        <span v-html="rangeLabel"></span>
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" class="sh-range-icon sh-range-chevron" :class="{ 'is-open': isOpen }" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </button>

    <transition name="sh-range-pop">
      <div v-if="isOpen" class="sh-range-dropdown">
        <div class="sh-range-presets">
          <button
            v-for="date in dates"
            :key="date.label"
            type="button"
            class="sh-range-preset"
            :class="{ active: `${date.label}` === activeLabel }"
            @click="selectPreset(date)"
          >
            {{ date.label }}
          </button>
        </div>

        <div class="sh-range-custom">
          <p class="sh-range-custom-title">Custom Range</p>
          <div class="sh-range-custom-inputs">
            <div>
              <label class="sh-range-custom-label">From</label>
              <input v-model="customFrom" type="date" class="sh-range-custom-input">
            </div>
            <div>
              <label class="sh-range-custom-label">To</label>
              <input v-model="customTo" type="date" class="sh-range-custom-input">
            </div>
          </div>
          <button
            v-if="customFrom && customTo"
            type="button"
            class="sh-range-apply"
            @click="applyCustom"
          >
            Apply Custom Range
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
<style scoped>
.sh-range {
  --sh-range-bg: var(--bs-body-bg, #fff);
  --sh-range-fg: var(--bs-emphasis-color, #0f172a);
  --sh-range-muted: var(--bs-secondary-color, #64748b);
  --sh-range-border: var(--bs-border-color, #e2e8f0);
  --sh-range-hover: var(--bs-tertiary-bg, #f8fafc);
  --sh-range-focus: rgba(var(--bs-primary-rgb, 59, 130, 246), 0.3);
  position: relative;
  display: inline-block;
  text-align: left;
  width: 100%;
}
@media (min-width: 768px) {
  .sh-range { width: auto; }
}

.sh-range-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  width: 100%;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--sh-range-fg);
  background: var(--sh-range-bg);
  border: 1px solid var(--sh-range-border);
  border-radius: 0.75rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: background-color 0.15s ease, box-shadow 0.15s ease;
}
.sh-range-trigger:hover { background: var(--sh-range-hover); }
.sh-range-trigger:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--sh-range-focus);
}
.sh-range-trigger-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sh-range-trigger :deep(.sh-range-trigger-dates) {
  font-size: 0.75rem;
  font-weight: 400;
  opacity: 0.6;
}
.sh-range-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  opacity: 0.6;
}
.sh-range-chevron { transition: transform 0.2s ease; }
.sh-range-chevron.is-open { transform: rotate(180deg); }

.sh-range-dropdown {
  position: absolute;
  right: 0;
  z-index: 1050;
  width: 20rem;
  max-width: calc(100vw - 2rem);
  margin-top: 0.5rem;
  padding: 1rem;
  background: var(--sh-range-bg);
  border: 1px solid var(--sh-range-border);
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  transform-origin: top right;
}

.sh-range-presets {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.25rem;
  max-height: 260px;
  overflow-y: auto;
  margin-bottom: 1rem;
}
.sh-range-preset {
  text-align: left;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--sh-range-muted);
  background: transparent;
  border: 0;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.sh-range-preset:hover { background: var(--sh-range-hover); color: var(--sh-range-fg); }
.sh-range-preset.active,
.sh-range-preset.active:hover {
  background: var(--sh-range-fg);
  color: var(--sh-range-bg);
}

.sh-range-custom {
  border-top: 1px solid var(--sh-range-border);
  padding-top: 0.75rem;
}
.sh-range-custom-title {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--sh-range-muted);
}
.sh-range-custom-inputs {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
}
.sh-range-custom-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--sh-range-muted);
}
.sh-range-custom-input {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  padding: 0.375rem 0.5rem;
  font-size: 0.75rem;
  color: var(--sh-range-fg);
  background: var(--sh-range-bg);
  border: 1px solid var(--sh-range-border);
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.sh-range-custom-input:focus {
  outline: none;
  border-color: var(--sh-range-muted);
  box-shadow: 0 0 0 3px var(--sh-range-focus);
}
.sh-range-apply {
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--sh-range-bg);
  background: var(--sh-range-fg);
  border: 0;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: opacity 0.15s ease;
}
.sh-range-apply:hover { opacity: 0.9; }

.sh-range-pop-enter-active { transition: opacity 0.1s ease-out, transform 0.1s ease-out; }
.sh-range-pop-leave-active { transition: opacity 0.075s ease-in, transform 0.075s ease-in; }
.sh-range-pop-enter-from,
.sh-range-pop-leave-to { opacity: 0; transform: scale(0.95); }
</style>
