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
      <DateChooser @dateChange="onDateChange"></DateChooser>
    </div>
    <div class="data-choose-row">
      <div class="data-choose-row--title">Время:</div>
      <TimeChooser @timeChange="onTimeChange"></TimeChooser>
    </div>
    <div class="check-in-buttons">
      <button @click="checkIn()">Записаться</button>
      <button @click="goToList()">Назад</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import Beautyshop from '@/models/Beautyshop';
import { getBeautyshop } from '@/models';
import router from '@/router';
import DateChooser from '@/components/DateChooser.vue';
import TimeChooser from '@/components/TimeChooser.vue';

export default defineComponent({
  components: {TimeChooser, DateChooser},
  props: ['uuid'],
  setup(props) {
    const isLoading = ref<boolean>(false);
    const beautyshopUuid = ref<string>('');
    const workerUuid = ref<string>('');
    const serviceTypeUuid = ref<string>('');
    const beautyshopsList = ref<object[]>([]);
    const currentBeautyshop = ref<object>([]);
    const workersList = ref<object>([]);

    const goToList = () => {
      router.push('/list');
    }

    getBeautyshop(props.uuid).then((beautyshop: Beautyshop | null) => {
      if (!beautyshop) {
        console.log('Не удалось получить информацию о салоне');
        return;
      }

      currentBeautyshop.value = beautyshop;
    });

    const showBeautishopInfo = (beautyshop: Beautyshop) => {
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

    const onDateChange = (currentDate: Date) => {
      console.log('onDateChange in CheckIn component', currentDate);
    }

    const onTimeChange = (currentTime: string) => {
      console.log('onTimeChange in CheckIn component', currentTime);
    }

    return {
      beautyshopsList,
      isLoading,
      currentBeautyshop,
      beautyshopUuid,
      workerUuid,
      serviceTypeUuid,
      workersList,
      onDateChange,
      onTimeChange,
      showBeautishopInfo,
      goToList,
    }
  }
})
</script>
