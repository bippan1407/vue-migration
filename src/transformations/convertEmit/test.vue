<template>
    <div>test</div>
</template>
<script>
export default {
    emits: ['close']
}
this.$emit('input', option.value);
this.$emit('on-change', option, test, value);
this.$emit('on-change', option, test, value);
this.$emit('on-new-change', option, test, value, { name: 'jerry' });
</script>