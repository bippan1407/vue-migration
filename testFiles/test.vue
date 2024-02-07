<template>
    <div>vue-migration</div>
</template>
<script>
import { mapGetters, mapActions, mapState } from 'vuex';
export default {
    name: 'VueMigration',
    props: {
        name: {
            type: String,
            required: true
        },
        user: {
            type: Object,
            required: true
        },
        value: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            description: "upgrade from vue 2 to vue 3"
        }
    },
    computed: {
        ...mapGetters('user', {
            isDeveloper: 'isDeveloper'
        }),
        ...mapGetters({
            isManager: 'user/isManager'
        }),
        nameAndDescription() {
            return this.name + "" + this.description
        }
    },
    watch: {
        description(newValue, oldValue) {
            this.onDescriptionChange()
        }
    },
    mounted() {
        const response = this.$axios.$get('/user')
        console.log('component mounted')
        this.$once('hook:beforDestroy', () => {
        });
    },
    destroyed() {
        console.log('component destroyed')
    },
    methods: {
        ...mapActions('developer', ['addDeveloper']),
        ...mapActions({
            createNewUser: "user/addNewUser",
        }),
        async onDescriptionChange() {
            await this.$store.dispatch("user/createUser", this.user.id);
            this.user.id
            const devName = this.$store.getters['user/devName']
            console.log('decription is changed')
            this.$store.dispatch('dev/onDescriptionChangeByDev', { developerName: devName })
        },
        onRedirect() {
            const devName = this.$store.getters['user/devName']
            this.$emit('on-redirect', { devName })
            this.$emit('on-redirect', { devName })
            this.$emit('on-redirect', { devName })
            this.$emit('input', { devName })
            this.$emit('input', { devName })
            this.$emit('input', { devName })
            this.$emit('input', { devName })
            const inputValue = this.value
            this.$router.push('https://vuejs.org/')
        }
    },
}
</script>