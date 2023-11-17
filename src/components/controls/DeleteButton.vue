<script setup>
    import SvgButton from './SvgButton.vue';
    import Delete from 'vue-material-design-icons/Delete.vue'
</script>

<template>
    <SvgButton v-slot="{ size, fillColor }" title="Delete">
        <Delete :size="size" :fillColor="fillColor"/>
    </SvgButton>
</template>