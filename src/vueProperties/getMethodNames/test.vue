<template>
    <div>test</div>
</template>
<script>
export default {
    methods: {
        activeMenu(key) {
            return this.documents.find(item => item.active === key);
        },
        showUser() {
            return this.filteredDocuments?.name === 'Application' && this.isGuestUser;
        }
    },
}
</script>