<script setup>
import { computed } from 'vue'

const props = defineProps(['modelValue','label'])
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
  <input type="email" v-model="inputModel">
</template>