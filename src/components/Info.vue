<template>
  <CheckInPanel></CheckInPanel>
  <div class="info-screen">
    <div class="info-common" v-if="currentBeautyshop">
      {{ currentBeautyshop.name }}<br>
      {{ currentBeautyshop.address }}<br>
      Часы работы: {{ currentBeautyshop.openHour }}:00 - {{ currentBeautyshop.closeHour }}:00
    </div>
    <div class="info-map" id="info-map" v-if="currentBeautyshop?.coordinates"></div>
    <div class="buttons-container">
      <button @click="goToCheckIn()">Выбрать мастера</button>
      <button @click="goToList()">Назад</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import Beautyshop from '@/models/Beautyshop';
import router from '@/router';
import CheckInPanel from '@/components/CheckInPanel.vue';
import { useStore } from '@/store';
import { createMap } from '@/services/map';

export default defineComponent({
  components: {CheckInPanel},
  props: ['uuid'],
  setup(props) {
    const store = useStore();
    const currentBeautyshop = ref<Beautyshop | null>(store.getters.getBeautyshop(props.uuid));

    if (currentBeautyshop.value?.coordinates) {
      createMap('info-map', [{
        title: '',
        coordinates: currentBeautyshop.value.coordinates as number[],
      }]);
    }

    const goToList = () => {
      router.push({name: 'List'});
    }

    const goToCheckIn = () => {
      router.push({name: 'CheckIn', params: {uuid: props.uuid}});
    }

    console.log('currentBeautyshop:', currentBeautyshop);

    return {
      currentBeautyshop,
      goToCheckIn,
      goToList,
    }
  }
})
</script>
