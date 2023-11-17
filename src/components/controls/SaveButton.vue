<script setup>
    import SvgButton from './SvgButton.vue';
    import ContentSave from 'vue-material-design-icons/ContentSave.vue'
</script>

<template>
    <SvgButton v-slot="{ size, fillColor }" title="Save">
        <ContentSave :size="size" :fillColor="fillColor"/>
    </SvgButton>
</template>