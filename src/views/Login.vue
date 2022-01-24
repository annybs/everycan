<template>
  <div class="login">
    <LoginForm :submitCallback="login"/>
  </div>
</template>

<script lang="ts">
import LoginForm, { FormData } from '@/components/login/LoginForm.vue'
import { defineComponent } from 'vue'

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
