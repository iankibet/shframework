<script setup>

import ShAutoForm from '@/lib/components/ShAutoForm.vue'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import shRepo from '@/lib/repo/helpers/ShRepo.js'
import { ShModalForm, ShSuggest, useAppStore } from '@'
import ShForm from '@/lib/components/ShForm.vue'
import SuggestTemplate from '@/views/core/tasks/forms/SuggestTemplate.vue'
const route = useRoute()
const id = route.params.id
const editTask = ref(null)
// Task fetching logic removed

onMounted(()=>{
  // shRepo.showToast('Hello','success', {position: 'top-start'})
})

const fieldChanged = (field, value)=>{
  console.log(field, value )
}
const fields = [
  {
    field: 'task_id',
    label: 'Task',
    suggests: true,
    url: 'tasks/list',
    required: true,
    optionTemplate: SuggestTemplate,
    // selectedOptionTemplate: SuggestTemplate
  },
  {
    field: 'name',
    label: 'Name',
    type: 'text',
  },
  {
    field: 'description',
    label: 'Description',
    type: 'textarea',
  },
  {
    field: 'phone',
    label: 'Phone',
    type: 'phone',
    disabled: true

  }
]
</script>
<template>

  <sh-auto-form :fields="['task_id','date']"
                :required="[ 'task_id']"

                :fill-selects="{
    task_id: {
          url: 'tasks/list?all=1'
        }
  }" action="/tasks" />
<sh-auto-form :current-data="{
  // task_id: 2,
  // name: 'Task 1'

}" @field-changed="fieldChanged" @success="appStore.refresh()" success-message="Task added successfully" :fields="fields" action="tasks"></sh-auto-form>
</template>

<style scoped>

</style>
