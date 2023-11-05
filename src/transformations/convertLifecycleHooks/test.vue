<template>
    <div>test</div>
</template>
<script>
export default {
    async mounted() {
        this.$axios.$get('/users')
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.log(error)
        })
        const response = await this.$axios.$get('/users')
    },
    beforeDestroy() {
        const add = 1 + 2
    },
    destroyed() {
        const add = 1 + 2
    },
}
</script>