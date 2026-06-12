<script setup>
import { useRoute } from 'vue-router'
import shApis from '@/lib/repo/helpers/ShApis.js'
import { onMounted, ref } from 'vue'

const route = useRoute()
const taskId = route.query.taskId
const task = ref(null)
onMounted( async ()=>{
  // Task fetching logic removed
})
</script>
<template>
<h4>View Task</h4>
  {{ task }}
</template>

<style scoped>

</style>