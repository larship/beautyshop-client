<template>
  <div class="check-in-screen">
    <div @click="showBeautishopInfo(currentBeautyshop)">
      Информация о салоне {{ currentBeautyshop.name }} &gt;&gt;&gt;
    </div>
    <div @click="showBeautishopInfo(currentBeautyshop)">
      Записать другого человека &gt;&gt;&gt;
    </div>
    <div class="data-choose-row">
      <div class="data-choose-row--title">Мастер:</div>
      <select v-model="workerUuid">
        <option v-for="worker in currentBeautyshop.workers" v-bind:value="worker.uuid" v-bind:key="worker.uuid">
          {{ worker.fullName }}
        </option>
      </select>
    </div>
    <div class="data-choose-row">
      <div class="data-choose-row--title">Услуга:</div>
      <select v-model="serviceTypeUuid">
        <template v-for="worker in currentBeautyshop.workers">
          <template v-if="workerUuid === worker.uuid">
            <option v-for="serviceType in worker.services" v-bind:value="serviceType.uuid"
                    v-bind:key="serviceType.uuid">{{ serviceType.name }}
            </option>
          </template>
        </template>
      </select>
    </div>
    <div class="data-choose-row">
      <div class="data-choose-row--title">Дата:</div>
      <div class="date-chooser">
        <div>&#9668;</div>
        <div>
          17 февраля
        </div>
        <div>&#9658;</div>
      </div>
    </div>
    <div class="data-choose-row">
      <div class="data-choose-row--title">Время:</div>
      <div class="time-chooser">
        <span>09:00</span>
        <span>10:00</span>
        <span>11:00</span>
        <span>13:30</span>
        <span>14:30</span>
      </div>
    </div>
    <div class="check-in-buttons">
      <button @click="checkIn(); showAddScheduleItemDialog = false">Записаться</button>
      <button @click="showAddScheduleItemDialog = false">Закрыть</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import Beautyshop from '@/models/Beautyshop';
import { getBeautyshop } from '@/models';
import { getLocation } from '@/location';
import router from '@/router';

export default defineComponent({
  props: ['uuid'],
  setup(props) {
    const city = getLocation();
    const isLoading = ref<boolean>(false);
    const beautyshopUuid = ref<string>('');
    const workerUuid = ref<string>('');
    const serviceTypeUuid = ref<string>('');
    const beautyshopsList = ref<object[]>([]);
    const currentBeautyshop = ref<object>([]);
    const workersList = ref<object>([]);

    // checkAuth().then((client: Client|null) => {
    //     console.log(client);
    //   });

    // const fetchData = (url: string) => {
    //   isLoading.value = true;
    //
    //   return fetch(url,  {
    //     method: 'GET',
    //     headers: {
    //       'content-type': 'application/json',
    //     },
    //   }).then(res => {
    //     console.log(res);
    //     isLoading.value = false;
    //
    //     if (!res.ok) {
    //       // loadedData.value = 'Произошла ошибка: ' + res.json()
    //     }
    //
    //     return res.json();
    //   }).then(json => {
    //     // loadedData.value = JSON.stringify(json);
    //     return json;
    //   });
    // }

    // fetchData(Config.BACKEND_URL + '/beautyshops?city=' + city).then(beautyshops => {
    //   beautyshopsList.value = beautyshops;
    //   // currentBeautyshop.value = beautyshops[0].value;
    //   console.log('beautyshopsList:', beautyshopsList);
    // })

    getBeautyshop(props.uuid).then((beautyshop: Beautyshop | null) => {
      if (!beautyshop) {
        console.log('Не удалось получить информацию о салоне');
        return;
      }

      currentBeautyshop.value = beautyshop;
    });

    const showBeautishopInfo = (beautyshop: Beautyshop) => {
      console.log('showBeautishopInfo');
      router.push('/info/' + beautyshop.uuid);
    }

    // const checkIn = () => {
    //   fetch(Config.BACKEND_URL + '/check-in?beautyshop=73b00c6d-a503-46b2-ae50-2bf609a82973',  {
    //     method: 'GET',
    //     headers: {
    //       'content-type': 'application/json',
    //     },
    //   }).then(res => {
    //     console.log(res);
    //     // isLoading.value = false;
    //
    //     if (!res.ok) {
    //       // loadedData.value = 'Произошла ошибка: ' + res.json()
    //     }
    //
    //     return res.json();
    //   }).then(json => {
    //     // loadedData.value = JSON.stringify(json);
    //   });
    // }

    return {
      beautyshopsList,
      isLoading,
      currentBeautyshop,
      showBeautishopInfo,
      beautyshopUuid,
      workerUuid,
      serviceTypeUuid,
      workersList,
    }
  }
})
</script>

