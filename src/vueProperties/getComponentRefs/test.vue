<template>
    <div>test</div>
</template>
<script>
export default {
    name: 'Index',
    computed: '',
    data() {
        return {
            isDropdownOpen: false,
        };
    },
    methods: {
        click() {
            this.$refs.dropdownOptions.style.setProperty('--dd-left', `-${left}px`);
        }
    },
}
</script>