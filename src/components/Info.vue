<template>
  <div class="info-screen">
    <div class="info-common">
      {{ currentBeautyshop.name }}<br>
      {{ currentBeautyshop.address }}
    </div>
    <div class="info-map" id="info-map"></div>
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
    const currentBeautyshop = ref<object>([]);
    const workersList = ref<object>([]);

    getBeautyshop(props.uuid).then((beautyshop: Beautyshop | null) => {
      if (!beautyshop) {
        console.log('Не удалось получить информацию о салоне');
        return;
      }

      currentBeautyshop.value = beautyshop;
    });

    const goToCheckIn = () => {
      router.push({name: 'CheckIn', params: {uuid: props.uuid}});
    }

    // eslint-disable-next-line
    ymaps.ready(function () {
      // eslint-disable-next-line
      let myMap: ymaps.Map = new ymaps.Map("info-map", {
            center: [55.755723, 37.633670],
            zoom: 18
          }, {
            searchControlProvider: 'yandex#search'
          }),
          // eslint-disable-next-line
          myPlacemark = new ymaps.Placemark([55.755723, 37.633670], {
            balloonContentHeader: "Балун метки",
            balloonContentBody: "Содержимое <em>балуна</em> метки",
            balloonContentFooter: "Подdвал",
            hintContent: "Хинт метки"
          });

      myMap.geoObjects.add(myPlacemark);
    });

    return {
      isLoading,
      currentBeautyshop,
      workersList,
      goToCheckIn,
    }
  }
})
</script>
