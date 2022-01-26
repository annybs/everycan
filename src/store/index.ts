import { createStore } from 'vuex'

export type userStatus = 'none' | 'loggedIn'

export default createStore({
  state: {
    username: '',
    userStatus: 'none' as userStatus
  },
  mutations: {
    setUserStatus(state, status: userStatus) {
      state.userStatus = status
    },
    setUsername(state, username: string) {
      state.username = username
    }
  },
  actions: {
  },
  modules: {
  }
})
