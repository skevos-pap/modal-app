<template>
    <div class="editor">
        <div class="container">
            <h1>Add new Modal {{ form.type }}</h1>
            <form v-on:submit.prevent="onSubmit">
                <label for="title">Modal Title</label>
                <input type="text" id="title" required v-model="form.title"/>
                <label for="content">Modal Content</label>
                <textarea id="content" required v-model="form.content"></textarea>
                <label for="type">Type</label>
                <select id="type" required v-model="form.type">
                    <option value="1">On Exit Intent</option>
                    <option value="2">On Scroll</option>
                    <option value="3">On Delay</option>
                </select>
                <label v-if="form.type == 2" for="perc">On Scroll Percentage (%)</label>
                <input v-if="form.type == 2" type="number" id="perc" v-model="form.perc" required/>
                <label v-if="form.type == 3" for="delay">Show after (ms)</label>
                <input v-if="form.type == 3" type="number" id="delay" v-model="form.delay" required/>
                <label for="freq">Trigger at most every</label>
                <select id="freq" required v-model="form.frequency">
                    <option value="0">Always</option>
                    <option value="10">10 seconds</option>
                    <option value="3600">1 hour</option>
                    <option value="86400">1 day</option>
                    <option value="604800">1 week</option>
                </select>
                <div class="buttons">
                    <button class="cancel" v-on:click.prevent="onCancel">Cancel</button>
                    <button type="submit" class="submit">Save</button>
                </div>
            </form>
        </div>
        <div v-if="this.$store.state.modals.length" class="container">
            <h1>Active Modals</h1>
            <div class="modals">
                <div class="modal" v-for="(m, index) in this.$store.state.modals" v-bind:key="m.id">
                    <p>{{ m.title }}</p>
                    <div class="modal__edit" v-on:click="() => onEdit(index)">
                        <Icon icon="pen"/>
                    </div>
                    <div class="modal__delete" v-on:click="() => onDelete(index)">
                        <Icon icon="trash-alt"/>
                    </div>
                </div>
            </div>
        </div>

        <router-link to="/" class="back-btn">
            <Icon icon="angle-left"/>
        </router-link>
    </div>
</template>

<script>
  export default {
    name: 'Editor',
    data () {
      return {
        form: {
          title: '',
          content: '',
          id: 0,
          type: '1',
          perc: '',
          delay: '',
          frequency: '0'
        },
        editIndex: -1
      }
    },
    methods: {
      onCancel () {
        this.form = {
          title: '',
          content: '',
          id: 0,
          type: '1',
          perc: '',
          delay: '',
          frequency: '0'
        }

        this.editIndex = -1
      },
      onSubmit () {
        const newModal = {
          id: this.form.id || Date.now(),
          title: this.form.title,
          content: this.form.content,
          delay: this.form.type === '3' ? parseInt(this.form.delay) : 0,
          scroll: this.form.type === '2' ? parseInt(this.form.perc) : 0,
          exitIntent: this.form.type === '1',
          frequency: parseInt(this.form.frequency)
        }

        if (this.editIndex !== -1) {
          this.$store.commit('update', { index: this.editIndex, data: newModal })
        } else {
          this.$store.commit('push', newModal)
        }

        this.onCancel()
      },
      onDelete (index) {
        this.$store.commit('remove', index)
      },
      onEdit (index) {
        this.form = {
          title: this.$store.state.modals[index].title,
          content: this.$store.state.modals[index].content,
          id: this.$store.state.modals[index].id,
          perc: this.$store.state.modals[index].scroll || '',
          delay: this.$store.state.modals[index].delay || '',
          frequency: this.$store.state.modals[index].frequency || '0',
          type: this.$store.state.modals[index].exitIntent ? '1' : (this.$store.state.modals[index].delay ? '3' : '2')
        }

        this.editIndex = index
      }
    }
  }
</script>
<style scoped lang="scss">
    .container {
        width: 800px;
        max-width: 100%;
        margin: 20px auto;
        background-color: #fff;
        padding: 30px;
        border-radius: 10px;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
    }

    .back-btn {
        position: fixed;
        top: 20px;
        left: 20px;
        width: 50px;
        height: 50px;
        line-height: 50px;
        font-size: 35px;
        background-color: #00aeae;
        color: #fff;
        border-radius: 50%;
        text-align: center;
        box-shadow: 1px 1px 5px rgba(0, 0, 0, 1);
        cursor: pointer;
        transition: 0.25s;

        &:hover {
            color: #00aeae;
            background-color: #fff;
        }
    }

    .buttons {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        button {
            outline: none;
            height: 40px;
            line-height: 40px;
            text-align: center;
            width: 100px;
            padding: 0;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;

            &.cancel {
                background-color: transparent;
                color: #c00;
                border: 2px solid transparent;

                &:hover {
                    color: darken(#c00, 10%);
                }
            }

            &.submit {
                background-color: #00aeae;
                border: 2px solid #00aeae;
                color: #fff;
                transition: 0.5s;

                &:hover {
                    background-color: #fff;
                    color: #00aeae;
                }
            }
        }
    }

    .modals {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .modal {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f0f0f0;
        padding: 10px 0;

        &__edit {
            width: 30px;
            color: #00aeae;
            cursor: pointer;
        }

        &__delete {
            width: 30px;
            color: #c00;
            cursor: pointer;
        }

        p {
            width: calc(100% - 60px);
            text-align: left;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin: 0;
        }
    }

    form {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    input, textarea, select {
        width: 100%;
        margin-bottom: 20px;
        outline: none;
        border: 1px solid #ccc;
        border-radius: 5px;
        height: 40px;
        padding: 0 15px;
        transition: 0.5s;

        &:focus {
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
        }
    }

    textarea {
        height: 150px;
        padding: 10px 15px;
    }

    label {
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 5px;
    }
</style>
