<script>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../../store/authStore'
import { CloudApi } from '../../api/CloudApi';
export default {
  data() {
    const authStore = useAuthStore();
    const { id, login } = storeToRefs(authStore);
    return {
      id, login, authStore,
      openDialog: false,
    }
  },
  methods: {
    async logout() {
      if (confirm("Are you sure?")) {
        await CloudApi.logoutUser()
        this.openDialog = false
        this.authStore.setUser()
      }
    }
  }
}
</script>

<template>
  <div>
    <h2 class="status title" @click.stop="openDialog = !openDialog">
      {{ login }}
    </h2>
    <div v-if="openDialog && login" class="overlay" @click.stop="openDialog = false">
      <div class="dialog bordered" @click.stop="() => {}">
        <h2>User ID: {{ id }}</h2>
        <h2>Login: {{ login }}</h2>
        <button class="btn" @click.stop="logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status {
  cursor: pointer;
  user-select: none;
}
.dialog {
  display: flex;
  flex-direction: column;
  gap: var(--default-gap);
  position: absolute;
  top: var(--default-gap);
  right: var(--default-gap);
  padding: var(--default-gap);
  background-color: var(--color-background-soft);
}
</style>