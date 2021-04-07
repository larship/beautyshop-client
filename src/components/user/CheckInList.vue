<template>
  <div class="user-check-in-list-screen">
    <div class="check-in-list">

    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from '@/store';
import { ActionTypes } from '@/store/actions';

export default defineComponent({
  setup() {
    const store = useStore();
    const client = store.getters.getClient();

    if (client) {
      store.dispatch(ActionTypes.GetClientCheckInList, {
        clientUuid: client.uuid
      });
    }

    return {}
  }
})
</script>
