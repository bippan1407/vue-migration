<template>
    <div>test</div>
</template>
<script>
export default {
    name: 'Index',
    props: {
        name: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        }
    },
}
</script>