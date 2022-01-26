<template>
  <form class="login-form" :class="{'has-error': !this.submitError}" @submit.prevent="submit">
    <div class="input db-type">
      <label for="db-type">Database type</label>
      <select
        id="db-type"
        name="db-type"
        v-model="v$.dbType.$model"
      >
        <option
          v-for="(label, id) in dbTypes"
          :key="id"
          :value="id"
        >{{label}}</option>
      </select>
      <div class="error" v-for="error of v$.dbType.$errors" :key="error.$uid">{{error.$message}}</div>
    </div>
    <div class="input db-address" :class="{'has-error': v$.dbAddress.$error}" v-if="dbType === 'http'">
      <label for="db-address">Server address</label>
      <input
        id="db-address"
        name="db-address"
        placeholder="Server address"
        type="text"
        v-model="v$.dbAddress.$model"
      />
      <div class="error" v-for="error of v$.dbAddress.$errors" :key="error.$uid">{{error.$message}}</div>
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
import { Credentials, DatabaseType, dbTypes } from '@/db'
import { Prop, defineComponent } from 'vue'
import { helpers, required } from '@vuelidate/validators'

// eslint-disable-next-line no-unused-vars
export type SubmitCallback = (creds: Credentials) => Promise<void>

export default defineComponent({
  props: {
    submitCallback: Function as Prop<SubmitCallback>
  },
  data() {
    return {
      dbType: 'local' as DatabaseType,
      dbAddress: '',
      username: '',
      password: '',
      submitError: null as (Error | null)
    }
  },
  validations() {
    return {
      dbType: [
        helpers.withMessage<DatabaseType>('Invalid storage type.', v => Object.keys(dbTypes).includes(v))
      ],
      dbAddress: [
        helpers.withParams(
          { dbType: this.dbType },
          helpers.withMessage<string>('Invalid server address.', v => {
            if (this.dbType === 'http') return url(v)
            return true
          })
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
    dbTypes() {
      return dbTypes
    }
  },
  methods: {
    collect(): Credentials {
      return {
        dbType: this.dbType,
        dbAddress: this.dbType === 'http' ? this.dbAddress : undefined,
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
