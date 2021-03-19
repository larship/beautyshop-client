<template>
  <CheckInPanel></CheckInPanel>
  <div class="info-screen">
    <div class="info-common" v-if="currentBeautyshop">
      {{ currentBeautyshop.name }}<br>
      {{ currentBeautyshop.address }}<br>
      Часы работы: {{ currentBeautyshop.openHour }}:00 - {{ currentBeautyshop.closeHour }}:00
    </div>
    <div class="info-map" id="info-map" v-if="currentBeautyshop?.coordinates"></div>
    <div v-if="isAdmin && currentBeautyshop" class="info-statistics">
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
      <button @click="goToCheckIn()">Записаться</button>
      <button @click="goToList()">Назад</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import Beautyshop from '@/models/Beautyshop';
import router from '@/router';
import CheckInPanel from '@/components/CheckInPanel.vue';
import { ActionTypes } from '@/store/actions';
import { useStore } from '@/store';
import dayjs from 'dayjs';
import Utc from 'dayjs/plugin/utc';
import { createMap } from '@/services/map';
import { getClientDataExtended } from '@/services/auth';

export default defineComponent({
  components: {CheckInPanel},
  props: ['uuid'],
  setup(props) {
    const store = useStore();
    const currentBeautyshop = ref<Beautyshop | null>(store.getters.getBeautyshop(props.uuid));
    const isAdmin = ref(false);

    if (currentBeautyshop.value?.coordinates) {
      createMap('info-map', currentBeautyshop.value.coordinates as number[]);
    }

    currentBeautyshop.value?.admins.forEach((adminUuid: string) => {
      // @TODO Перенести в STORE
      if (adminUuid === getClientDataExtended()?.clientUuid) {
        isAdmin.value = true;
      }
    });

    dayjs.extend(Utc);

    store.dispatch(ActionTypes.GetBeautyshopCheckInList, {
      beautyshopUuid: props.uuid,
      dateFrom: dayjs().startOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
      dateTo: dayjs().endOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
    });

    const goToList = () => {
      router.push({name: 'List'});
    }

    const goToCheckIn = () => {
      router.push({name: 'CheckIn', params: {uuid: props.uuid}});
    }

    console.log('currentBeautyshop:', currentBeautyshop);
    console.log('CheckInList:', store.getters.getBeautyshopCheckInList());

    return {
      currentBeautyshop,
      goToCheckIn,
      goToList,
      isAdmin
    }
  }
})
</script>
