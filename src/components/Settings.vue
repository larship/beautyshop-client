<template>
  <LocationChangeForm v-bind:is-open="isLocationChangeFormShow"
                      @closed="isLocationChangeFormShow = false;"></LocationChangeForm>
  <div class="settings-screen">
    <div class="settings-item" @click="isLocationChangeFormShow = true">Выбор города</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import LocationChangeForm from '@/components/LocationChangeForm.vue';
import { useStore } from '@/store';

export default defineComponent({
  components: {LocationChangeForm},
  setup() {
    const isLocationChangeFormShow = ref(false);
    const store = useStore();
    const currentLocation = computed(() => store.getters.getLocation());

    return {
      currentLocation,
      isLocationChangeFormShow,
    }
  }
})
</script>
