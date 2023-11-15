<script>
import { h } from 'vue';

export default {
    name: "TreeList",
    props: {
        values: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            tree: {}
        }
    },
    methods: {
        listItem(key, value) {
            return h(
                'div',
                {},
                [key + ": ", this.valueNode(value)]
            )
        },
        valueNode(value) {
            if (Array.isArray(value)) {
                const children = value.map((v) => h(
                    'p', {}, v
                ))
                return h('ul', {}, children)
            } else if (value instanceof Object) {
                const children = Object.entries(value).map(([key, v]) => h(
                    'li', {}, this.listItem(key, v)
                ))
                return h('ul', {}, children)
            } else {
                return h('span', {}, value)
            }
        },
    }
}
</script>

<template>
    <ul>
        <li 
            v-for="[key, value] in Object.entries(values)"
            :key="key"
        >
            <component :is="listItem(key, value)"></component>
        </li>
    </ul>
</template>