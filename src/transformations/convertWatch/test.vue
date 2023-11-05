<template>
    <div>
        test
    </div>
</template>
<script>
export default {
    watch: {
        onDelete: {
            handler(value) {
                const name = "test"
            },
            deep: true
        },
        onCreate(newValue, oldValue) {
            this.validateFields();
        },
        onUpdate: {
            handler(value) {
                const name = "test"
            },
            immediate: true
        },
    },
}
</script>