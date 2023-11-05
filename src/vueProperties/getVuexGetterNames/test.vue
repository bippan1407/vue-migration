<template>
    <div>test</div>
</template>
<script>
export default {
    name: 'Index',
    computed: {
        ...mapGetters('documents', ['requiredDocuments']),
        ...mapGetters('documents', ['requiredDocuments', 'oldDocument']),
        ...mapGetters({
            user: "user/isPremium",
            document: "document/newDocument",
            app: "apps/app"
        }),
        ...mapGetters('guest', {
            isGuest: "isInterested",
            newApplication: 'newApplication'
        }),
    },
    methods: {
        click() {
            this.$store.getters['guest/username']
            this.$store.state.docs.allDocs;
        }
    }
}
</script>