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

    store.dispatch(ActionTypes.GetBeautyshopList, {
      location: store.getters.getLocation()
    });

    return {}
  }
})
</script>
