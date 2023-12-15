<template>
    <div>test</div>
</template>
<script>
this.$refs.dropdownOptions.style.setProperty('--dd-left', `-${left}px`);
this.$refs['dropdownOptions'].style.setProperty('--dd-left', `-${left}px`);
this.$refs.dropdownOptions[0].style.setProperty('--dd-left', `-${left}px`);
</script>