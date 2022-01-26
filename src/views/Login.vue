<template>
  <div class="login">
    <LoginForm :submitCallback="login"/>
  </div>
</template>

<script lang="ts">
import { Credentials } from '@/db'
import LoginForm from '@/components/login/LoginForm.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    LoginForm,
  },
  methods: {
    async login(creds: Credentials): Promise<void> {
      console.log(creds)
    }
  }
})
</script>
