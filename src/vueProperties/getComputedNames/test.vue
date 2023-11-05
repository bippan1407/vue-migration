<template>
    <div>test</div>
</template>
<script>
export default {
    computed: {
        activeMenu() {
            return this.documents.find(item => item.active);
        },
        showUser() {
            return this.filteredDocuments?.name === 'Application' && this.isGuestUser;
        },
        isNewUser() {
            return this.$route.query?.doc === 'finance';
        },
    },
}
</script>