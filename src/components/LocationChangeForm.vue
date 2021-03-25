<template>
  <div class="location-change-form" v-if="isFormShow">
    <div class="location-item" @click="changeLocation('Москва')">Москва</div>
    <div class="location-item" @click="changeLocation('Санкт-Петербург')">Санкт-Петербург</div>
    <div class="location-item" @click="changeLocation('Новосибирск')">Новосибирск</div>
    <div class="location-item" @click="changeLocation('Владивосток')">Владивосток</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRef, watch } from 'vue';
import { useStore } from '@/store';
import { ActionTypes } from '@/store/actions';

export default defineComponent({
  emits: ['closed'],
  props: ['isOpen'],
  setup(props, {emit}) {
    const isOpen = toRef(props, 'isOpen');
    const isFormShow = ref(false);
    const store = useStore();
    const changeLocation = (cityName: string) => {
      store.dispatch(ActionTypes.SetLocation, {
        location: cityName
      });
      store.dispatch(ActionTypes.GetBeautyshopList, {
        location: cityName
      });
      isFormShow.value = false;
      emit('closed');
    }

    watch(
        isOpen,
        (value: boolean) => {
          isFormShow.value = value;
        }
    );

    return {
      isFormShow,
      changeLocation,
    }
  }
})
</script>
