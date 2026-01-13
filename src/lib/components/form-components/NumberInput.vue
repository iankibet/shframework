<script setup>
import { computed } from 'vue'

const props = defineProps(['modelValue','label','min','max'])
const emit = defineEmits(['update:modelValue','clearValidationErrors'])

// Use computed for proper two-way binding
const inputModel = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('clearValidationErrors')
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <input :min="min" :max="max" type="number" v-model="inputModel">
</template>