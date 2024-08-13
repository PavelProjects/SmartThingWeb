<script>
import ChevronRight from 'vue-material-design-icons/ChevronRight.vue'
import ChevronLeft from 'vue-material-design-icons/ChevronLeft.vue'
import ChevronUp from 'vue-material-design-icons/ChevronUp.vue'
import ChevronDown from 'vue-material-design-icons/ChevronDown.vue'
import Container from '../base/Container.vue'

export default {
  name: 'DropdownMenu',
  components: {
    Container,
    ChevronRight,
    ChevronLeft,
    ChevronUp,
    ChevronDown
  },
  emits: ['expand'],
  props: {
    placeholder: String,
    expanded: Boolean,
    vertical: {
      type: Boolean,
      default: () => true
    }
  },
  computed: {
    slotStyle() {
      return {
        'background-color': 'var(--color-background)',
        display: this.expanded ? 'unset' : 'none'
      }
    }
  },
  methods: {
    handleClick() {
      this.$emit('expand', !this.expanded)
    }
  }
}
</script>

<template>
  <div class="dropdown-menu">
    <Container :vertical="vertical">
      <ChevronDown v-if="expanded && vertical" title="Expand" :size="35" />
      <div :style="slotStyle">
        <slot></slot>
      </div>
      <Container style="cursor: pointer" @click.stop="handleClick">
        <div v-if="expanded">
          <ChevronUp v-if="vertical" title="Hide" :size="35" />
          <ChevronLeft v-else title="Hide" :size="35" />
        </div>
        <Container v-else>
          <h2 v-if="placeholder" class="title">
            {{ placeholder }}
          </h2>
          <ChevronRight v-if="!vertical" title="Expand" :size="35" />
        </Container>
      </Container>
    </Container>
  </div>
</template>

<style scoped>
.dropdown-menu {
  z-index: 997;
}
</style>
