<template>
  <div class="menu-form" v-if="isMenuShow">
    <div class="menu-item close" @click="closeMenu()">X</div>
    <div class="menu-item city" @click="isLocationChangeFormShow = true">{{ currentLocation }}</div>
    <div class="menu-item" @click="goToUserCheckInList()">Мои записи</div>
  </div>
  <LocationChangeForm v-bind:is-open="isLocationChangeFormShow" @closed="isLocationChangeFormShow = false; closeMenu();"></LocationChangeForm>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRef, watch } from 'vue';
import LocationChangeForm from '@/components/LocationChangeForm.vue';
import { useStore } from '@/store';
import router from '@/router';

export default defineComponent({
  components: {LocationChangeForm},
  emits: ['closed'],
  props: ['isOpen'],
  setup(props, {emit}) {
    const isOpen = toRef(props, 'isOpen');
    const isMenuShow = ref(false);
    const isLocationChangeFormShow = ref(false);
    const closeMenu = () => {
      isMenuShow.value = false;
      emit('closed');
    }
    const store = useStore();
    const currentLocation = computed(() => store.getters.getLocation());

    const goToUserCheckInList = () => {
      closeMenu();
      router.push({name: 'UserCheckInList'});
    }

    watch(
        isOpen,
        (value: boolean) => {
          isMenuShow.value = value;
          console.log('isOpen CHANGED:', isOpen);
        }
    );

    return {
      isMenuShow,
      closeMenu,
      currentLocation,
      isLocationChangeFormShow,
      goToUserCheckInList,
    }
  }
})
</script>
