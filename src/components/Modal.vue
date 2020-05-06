<template>
    <div class="modal" v-bind:class="{ 'is-active': activeModalId === id }">
        <div class="modal__bg"/>
        <div class="modal__content">
            <div class="modal__close" @click="onClose">
                <Icon icon="times"/>
            </div>
            <p>{{ content }}</p>
        </div>
    </div>
</template>

<script>
  export default {
    name: 'Modal',
    props: {
      content: String,
      id: Number,
      delay: Number,
      scroll: Number,
      exitIntent: Boolean,
      frequency: Number
    },
    computed: {
      activeModalId () {
        return this.$store.state.activeModalId
      }
    },
    methods: {
      onClose () {
        this.$store.commit('closeModal')
      },
      setDelay () {
        if (this.delay) {
          this.delayTimer = window.setTimeout(() => {
            if (this.activeModalId !== this.id && this.checkFrequency()) {
              this.$store.commit('openModal', this.id)
              localStorage.setItem(`modal_${this.id}`, `${Date.now()}`)
            }
          }, this.delay)
        }
      },
      setExitIntent () {
        if (this.exitIntent) {
          document.addEventListener('mouseleave', this.onMouseLeave)
          window.addEventListener('beforeunload', this.onUnload)
          document.addEventListener('click', this.onLinkVisit)
        }
      },
      setScroll () {
        if (this.scroll) {
          window.addEventListener('scroll', this.onScroll)
        }
      },
      onScroll (e) {
        if (this.scroll && this.activeModalId !== this.id && this.checkFrequency()) {
          const bodyTop = document.body.scrollTop
          const bodyHeight = document.body.scrollHeight
          const documentTop = document.documentElement.scrollTop
          const documentHeight = document.documentElement.scrollHeight
          const clientHeight = document.documentElement.clientHeight
          const percentage = (bodyTop || documentTop) / ((bodyHeight || documentHeight) - clientHeight) * 100

          if (percentage >= this.scroll) {
            this.$store.commit('openModal', this.id)
            localStorage.setItem(`modal_${this.id}`, `${Date.now()}`)
          }
        }
      },
      onMouseLeave (e) {
        if (this.activeModalId !== this.id && this.checkFrequency()) {
          this.$store.commit('openModal', this.id)
          localStorage.setItem(`modal_${this.id}`, `${Date.now()}`)
        }
      },
      onUnload (e) {
        e.preventDefault()
        event.returnValue = ''

        if (this.activeModalId !== this.id && this.checkFrequency()) {
          this.$store.commit('openModal', this.id)
          localStorage.setItem(`modal_${this.id}`, `${Date.now()}`)
        }
      },
      onLinkVisit (e) {
        if (this.activeModalId !== this.id && this.checkFrequency()) {
          if (e.target.nodeName === 'A' && e.target.href.indexOf('http') === 0) {
            e.preventDefault()
            e.stopPropagation()
            this.$store.commit('openModal', this.id)
            localStorage.setItem(`modal_${this.id}`, `${Date.now()}`)
          }
        }
      },
      checkFrequency () {
        const timestamp = parseInt(localStorage.getItem(`modal_${this.id}`) || 0)
        const now = Date.now()
        const diff = (now - timestamp) / 1000

        return diff >= (this.frequency || 0)
      }
    },
    mounted () {
      this.setDelay()
      this.setExitIntent()
      this.setScroll()
    },
    beforeDestroy () {
      clearTimeout(this.delayTimer)

      document.removeEventListener('mouseleave', this.onMouseLeave)
      window.removeEventListener('beforeunload', this.onUnload)
      document.removeEventListener('click', this.onLinkVisit)
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        z-index: 1000;
        display: none;

        &__bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
        }

        &__content {
            position: relative;
            width: 450px;
            max-width: 100%;
            top: 50%;
            left: 50%;
            background-color: #fff;
            padding: 30px;
            border-radius: 10px;
            border: 1px solid #666;
            transform: translate(-50%, -50%);
        }

        &__close {
            position: absolute;
            top: -10px;
            right: -10px;
            color: #fff;
            background-color: #000;
            width: 25px;
            height: 25px;
            line-height: 25px;
            text-align: center;
            border-radius: 50%;
            cursor: pointer;
        }

        &.is-active {
            display: block;
        }
    }
</style>
