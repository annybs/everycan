<template>
  <div class="login">
    <LoginForm :submitCallback="login"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LoginForm, { FormData } from '@/components/login/LoginForm.vue'

export default defineComponent({
  components: {
    LoginForm,
  },
  methods: {
    async login(data: FormData): Promise<void> {
      console.log(data)
      return
    }
  }
})
</script>
