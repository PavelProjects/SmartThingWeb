<script>
    export default {
        name: "InputWithLabel",
        props: {
            label: String,
            value: String,
            type: {
                type: String,
                default: "text"
            },
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
    <div :class="{legit: !validationFailed, required: validationFailed}"
        class="field-container"
    >
        <h2 
            class="field-label"
        >{{label }}</h2>
        <div class="input-with-slot">
            <input 
                :value="value"
                :disabled="disabled"
                :type="type"
            />
            <slot></slot>
        </div>
    </div>
</template>