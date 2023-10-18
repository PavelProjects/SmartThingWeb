<script>
    export default {
        name: "InputWithLabel",
        props: {
            label: String,
            value: String,
            disabled: {
                type: Boolean,
                default: false
            },
            validationFailed: {
                type: Boolean,
                default: false
            }
        }
    }
</script>

<template>
    <div class="input-field-container">
        <h2 
            :class="{legit: !validationFailed, required: validationFailed}"
            class="input-field-label"
        >{{label }}</h2>
        <input 
            :value="value"
            :disabled="disabled"
        />
    </div>
</template>

<style scoped>
    input {
        border-radius: 10px;
        color: var(--color-text);
    }
</style>