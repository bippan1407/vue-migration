<template>
    <div>test</div>
</template>
<script>
this.$store.dispatch('guest/username')
this.$store.dispatch('guest/name', 'jerry')
this.$store.dispatch('guest/age', 10)
this.$store.dispatch('documents/toggleAccordian', { document, template });
</script>