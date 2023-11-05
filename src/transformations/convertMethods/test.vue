<template>
    <div>test</div>
</template>
<script>
export default {
    methods: {
        subtract() {
            return 2-1;
        },
        async addNumber() {
            const test = 1 + 2;
            return test
        },
        async multiply(a, b) {
            const test = a * b;
            return test
        },
        async divide(a, {b}) {
            const test = a / b;
            return test
        }
    },
}
</script>