<template>
    <div>test</div>
</template>
<script>
export default {
    name: 'Index',
    mounted() {
        const response = this.$axios.$get('/user')
        console.log('component mounted')
        this.$once('hook:beforDestroy', () => {
        });
    },
}
</script>