<template>
  <form class="login-form" :class="{'has-error': !this.submitError}" @submit.prevent="submit">
    <div class="input storage-type">
      <label for="storage-type">Storage type</label>
      <select id="storage-type" name="storage-type" v-model="storageType">
        <option value="local" :selected="!useServer">Local</option>
        <option value="server" :selected="useServer">Server</option>
      </select>
    </div>
    <div class="input server-address" v-if="useServer">
      <label for="server-address">Server address</label>
      <input
        id="server-address"
        name="server-address"
        placeholder="Server address"
        type="text"
        v-model="serverAddress"
      />
    </div>
    <div class="input username">
      <label for="username">Username</label>
      <input
        id="username"
        name="username"
        placeholder="Username"
        type="text"
        v-model="username"
      />
    </div>
    <div class="input password">
      <label for="password">Password</label>
      <input
        id="password"
        name="password"
        placeholder="Password"
        type="password"
        v-model="password"
      />
    </div>
    <button type="submit">Log in</button>
    <div class="form-error" v-if="submitError">
      <span>{{submitError.message}}</span>
    </div>
  </form>
</template>

<script lang="ts">
import { Prop, defineComponent } from 'vue'

export type FormData = {
  storageType: 'local' | 'server'
  serverAddress?: string
  username: string
  password: string
}

// eslint-disable-next-line no-unused-vars
export type SubmitCallback = (data: FormData) => Promise<void>

export default defineComponent({
  props: {
    submitCallback: Function as Prop<SubmitCallback>
  },
  data() {
    return {
      storageType: 'local' as FormData['storageType'],
      serverAddress: '',
      username: '',
      password: '',
      submitError: null as (Error | null)
    }
  },
  computed: {
    useServer() {
      return this.storageType === 'server'
    }
  },
  methods: {
    collect(): FormData {
      return {
        storageType: this.storageType,
        serverAddress: this.useServer ? this.serverAddress : undefined,
        username: this.username,
        password: this.password
      }
    },
    async submit(e: Event) {
      e.preventDefault()
      if (!this.submitCallback) {
        this.submitError = new Error('No submit callback defined.')
        return
      }
      try {
        await this.submitCallback(this.collect())
      }
      catch (err) {
        this.submitError = err as Error
      }
    }
  }
})
</script>
