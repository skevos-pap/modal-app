import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    toOpenQueue: [],
    modals: [],
    activeModalId: 0
  },
  mutations: {
    openModal (obj, id) {
      if (this.state.activeModalId) {
        this.state.toOpenQueue.push(id)
      } else {
        this.state.activeModalId = id
      }
    },
    closeModal () {
      if (this.state.toOpenQueue.length) {
        this.state.activeModalId = this.state.toOpenQueue[0]
        this.state.toOpenQueue.shift()
      } else {
        this.state.activeModalId = 0
      }
    },
    push (obj, options) {
      this.state.modals.unshift({
        ...options
      })
    },
    update (obj, options) {
      this.state.modals[options.index] = { ...options.data }
    },
    remove (obj, index) {
      this.state.modals.splice(index, 1)
    }
  }
})

export default store
