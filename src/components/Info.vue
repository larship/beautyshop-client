<template>
  <div class="info-screen">
    <div class="info-common" v-if="currentBeautyshop">
      {{ currentBeautyshop.name }}<br>
      {{ currentBeautyshop.address }}<br>
      Часы работы: {{ currentBeautyshop.openHour }}:00 - {{ currentBeautyshop.closeHour }}:00
    </div>
    <div class="info-map" id="info-map" v-if="currentBeautyshop?.coordinates"></div>
    <div v-if="true && currentBeautyshop" class="info-statistics">
      <div class="info-statistics--title">Административная статистика</div>
      <select>
        <option>Сегодня</option>
        <option>Вчера</option>
        <option>Неделя</option>
        <option>Месяц</option>
        <option>Всего</option>
      </select>
      <div class="info-statistics--block">
        <span>Всего записано человек</span><span>0</span>
        <span>Оплачено услуг на сумму</span><span>0 руб.</span>
      </div>
      <div class="info-statistics--workers-title">Сотрудники</div>
      <div v-for="worker in currentBeautyshop.workers" v-bind:key="worker.uuid" class="info-statistics--worker-block">
        <div>{{ worker.fullName }}</div>
        <div class="info-statistics--block">
          <span>Записано человек</span><span>0</span>
          <span>Оплачено услуг на сумму</span><span>0 руб.</span>
        </div>
      </div>
    </div>
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
    const currentBeautyshop = ref<Beautyshop | null>(null);

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
      currentBeautyshop,
      goToCheckIn,
    }
  }
})
</script>
