<template>
    <div>test</div>
</template>
<script>
export default {
    computed: {
        isPremiumUser() {
            return this.isPremium;
        },
        user: {
            get() {
                return ""
            },
            set(value) {
            },
        },
    },
}
</script>