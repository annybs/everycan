<template>
  <form class="login-form" :class="{'has-error': !this.submitError}" @submit.prevent="submit">
    <div class="input storage-type">
      <label for="storage-type">Storage type</label>
      <select
        id="storage-type"
        name="storage-type"
        v-model="v$.storageType.$model"
      >
        <option value="local" :selected="!useServer">Local</option>
        <option value="server" :selected="useServer">Server</option>
      </select>
      <div class="error" v-for="error of v$.storageType.$errors" :key="error.$uid">{{error.$message}}</div>
    </div>
    <div class="input server-address" :class="{'has-error': v$.serverAddress.$error}" v-if="useServer">
      <label for="server-address">Server address</label>
      <input
        id="server-address"
        name="server-address"
        placeholder="Server address"
        type="text"
        v-model="v$.serverAddress.$model"
      />
      <div class="error" v-for="error of v$.serverAddress.$errors" :key="error.$uid">{{error.$message}}</div>
    </div>
    <div class="input username" :class="{'has-error': v$.username.$error}">
      <label for="username">Username</label>
      <input
        id="username"
        name="username"
        placeholder="Username"
        type="text"
        v-model="v$.username.$model"
      />
      <div class="error" v-for="error of v$.username.$errors" :key="error.$uid">{{error.$message}}</div>
    </div>
    <div class="input password" :class="{'has-error': v$.password.$error}">
      <label for="password">Password</label>
      <input
        id="password"
        name="password"
        placeholder="Password"
        type="password"
        v-model="v$.password.$model"
      />
      <div class="error" v-for="error of v$.password.$errors" :key="error.$uid">{{error.$message}}</div>
    </div>
    <button type="submit">Log in</button>
    <div class="form-error" v-if="submitError">
      <span>{{submitError.message}}</span>
    </div>
  </form>
</template>

<script lang="ts">
import { url } from '@/validation'
import useVuelidate from '@vuelidate/core'
import { Prop, defineComponent } from 'vue'
import { helpers, required } from '@vuelidate/validators'

export type FormData = {
  storageType: StorageType
  serverAddress?: string
  username: string
  password: string
}

type StorageType = 'local' | 'server'

// eslint-disable-next-line no-unused-vars
export type SubmitCallback = (data: FormData) => Promise<void>

const storageTypes: StorageType[] = ['local', 'server']

export default defineComponent({
  props: {
    submitCallback: Function as Prop<SubmitCallback>
  },
  data() {
    return {
      storageType: 'local' as StorageType,
      serverAddress: '',
      username: '',
      password: '',
      submitError: null as (Error | null)
    }
  },
  validations() {
    return {
      storageType: [
        helpers.withMessage<StorageType>('Invalid storage type.', v => storageTypes.includes(v))
      ],
      serverAddress: [
        helpers.withParams(
          { useServer: this.useServer },
          helpers.withMessage<string>('Invalid server address.', v => this.useServer ? url(v) : true)
        )
      ],
      username: [
        helpers.withMessage('Username required.', required)
      ],
      password: [
        helpers.withMessage('Password required.', required)
      ]
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
    async submit() {
      if (!this.submitCallback) {
        this.submitError = new Error('No submit callback defined.')
        return
      }
      if (!await this.v$.$validate()) return

      try {
        await this.submitCallback(this.collect())
      }
      catch (err) {
        this.submitError = err as Error
      }
    }
  },
  setup() {
    return {
      v$: useVuelidate()
    }
  }
})
</script>
