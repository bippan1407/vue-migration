<template>
    <div>test</div>
</template>
<script>
export default {
    name: 'Index',
    methods: {
        ...mapActions('documents', ['requiredDocuments']),
        ...mapActions('documents', ['requiredDocuments', 'oldDocument']),
        ...mapActions({
            user: "user/isPremium",
            document: "document/newDocument",
        }),
        ...mapActions('guest', {
            isGuest: "isInterested",
        }),
        click() {
            this.$store.commit('app/newApplication')
            this.$store.dispatch('guest/username')
            this.$store.dispatch('guest/name', 'jerry')
            this.$store.dispatch('guest/age', 10)
            this.$store.dispatch('documents/toggleAccordian', { document, template });
        }
    }
}
</script>