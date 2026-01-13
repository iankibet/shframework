<script setup>

import { ShAutoForm } from '@'
import TestMultiStepForm from '@/components/TestMultiStepForm.vue'
import { onMounted, ref } from 'vue'

const fields = [
  {
    name: 'candidate_choice',
    type: 'select',
    allowUserInput: true,
    data: [
      {id: 1, name: 'John Doe'},
      {id: 2, name: 'Jane Doe'},
      {id: 3, name: 'John Smith'},
      {id: 4, name: 'Jane Smith'},
      {id: 5, name: 'John Johnson'},
      {id: 6, name: 'Jane Johnson'},
      {id: 7, name: 'John Brown'},
      {id: 8, name: 'Jane Brown'},
      {id: 9, name: 'John White'},
      {id: 10, name: 'Jane White'},
    ]
  },
  {
    field: 'user_id',
    type: 'hidden'
  },
  {
    field: 'phone',
    type: 'phone'
  }
]

const recaptcha = data=>{
  console.log(data)
  console.log('Recaptcha')
  return true
}
const currentData = ref({
  candidate_choice: 1
})

onMounted(()=>{

  // currentData.value= {
  //   candidate_choice: 3
  // }
})

const formCurrentData = ref({})

function setFormCurrentData(dt){
  formCurrentData.value = dt
}
</script>

<template>
<div class="row">
  <div class="col-md-12 pe-1">
    <div class="card">
      <div class="card-body">
        {{ formCurrentData }}
        <sh-auto-form :pre-submit-callback="setFormCurrentData" :current-data="currentData" :fields="fields" action="test"/>
        <test-multi-step-form/>
        <h5>Sh Suggest Test</h5>
        <sh-auto-form :steps="[
            {
              title: 'Add User',
              description: 'Add a new user to the system',
              fields: ['name']
            }
        ]" :action="`users:addUser`" :pre-submit-callback="recaptcha" :fields="fields" />
      </div>
    </div>
  </div>
</div>
</template>