<template>
  <div class="info-screen">
    <div class="info-common">
      {{ currentBeautyshop?.name }}<br>
      {{ currentBeautyshop?.address }}
    </div>
    <div class="info-map" id="info-map" v-if="currentBeautyshop?.coordinates"></div>
    <div class="buttons-container">
      <button @click="goToCheckIn()">Назад</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import Beautyshop from '@/models/Beautyshop';
import { getBeautyshop } from '@/models';
import router from '@/router';

/// <reference path="../declarations/ymaps.d.ts" />
export default defineComponent({
  props: ['uuid'],
  setup(props) {
    const isLoading = ref<boolean>(false);
    const currentBeautyshop = ref<Beautyshop | null>(null);
    const workersList = ref<object>([]);

    getBeautyshop(props.uuid).then((beautyshop: Beautyshop | null) => {
      if (!beautyshop) {
        console.log('Не удалось получить информацию о салоне');
        return;
      }

      currentBeautyshop.value = beautyshop;

      if (beautyshop.coordinates) {
        // eslint-disable-next-line
        ymaps.ready(function () {
          // eslint-disable-next-line
          let myMap: ymaps.Map = new ymaps.Map("info-map", {
                center: beautyshop.coordinates as number[],
                zoom: 18,
                controls: []
              }),
              // eslint-disable-next-line
              myPlacemark = new ymaps.Placemark(beautyshop.coordinates as number[], {});

          // myMap.behaviors.enable('ruler');
          myMap.geoObjects.add(myPlacemark);
        });
      }
    });

    const goToCheckIn = () => {
      router.push({name: 'CheckIn', params: {uuid: props.uuid}});
    }

    return {
      isLoading,
      currentBeautyshop,
      workersList,
      goToCheckIn,
    }
  }
})
</script>
