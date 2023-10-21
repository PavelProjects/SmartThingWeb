<script>
    export default {
        name: "Combobox",
        props: {
            label: String,
            items: [Array, Object],
            value: [String, Boolean],
            notBlank: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            validationFailed: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            mapedItems() {
                if (Array.isArray(this.items)) {
                    return this.mapDefault() 
                }
                if (typeof this.items == 'object') {
                    return this.mapObject()
                }
                console.error("Can't map type " + typeof this.items)
                return []
            }
        },
        methods: {
            mapObject() {
                return Object.entries(this.items).map(([key, value]) => {
                    return {
                        key,
                        caption: value
                    }
                })
            },
            mapDefault() {
                return this.items.map((key) => {
                    return {
                        key,
                        caption: key
                    }
                })
            }
        }
    }
</script>

<template>
    <div class="field-container">
        <h2 
            :class="{legit: !validationFailed, required: validationFailed}"
            class="field-label"
        >{{ label || "Select:" }}</h2>
        <select 
            :value="value" 
            :disabled="disabled"
        >
            <option v-if="!notBlank"></option>
            <option
                v-for="{key, caption} in mapedItems"
                :key="key"
                :value="key"
            >
                {{ caption }}
            </option>
        </select>
    </div>
</template>