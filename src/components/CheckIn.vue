<template>
  <CheckInPanel></CheckInPanel>
  <div class="check-in-screen">
    <div @click="showBeautishopInfo(currentBeautyshop)">
      Информация о салоне {{ currentBeautyshop?.name }} &gt;
    </div>
    <div @click="showBeautishopInfo(currentBeautyshop)">
      Записать другого человека &gt;
    </div>
    <div class="data-choose-row">
      <div class="data-choose-row--title">Мастер:</div>
      <select v-model="workerUuid">
        <option v-for="worker in currentBeautyshop?.workers" v-bind:value="worker.uuid" v-bind:key="worker.uuid">
          {{ worker.fullName }}
        </option>
      </select>
    </div>
    <div class="data-choose-row">
      <div class="data-choose-row--title">Услуга:</div>
      <select v-model="serviceTypeUuid">
        <template v-for="worker in currentBeautyshop?.workers">
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
      <TimeChooser
          v-bind:selected-time-item="selectedTimeItem"
          v-bind:open-hour="currentBeautyshop?.openHour"
          v-bind:close-hour="currentBeautyshop?.closeHour"
          @timeChange="onTimeChange"
          v-if="currentBeautyshop"
      >
      </TimeChooser>
    </div>
    <div class="check-in-buttons">
      <button @click="checkIn()" v-bind:disabled="!workerUuid || !serviceTypeUuid || !isTimeSelected">Записаться
      </button>
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
import CheckInPanel from '@/components/CheckInPanel.vue';
import { ExtendedClientData, getClientDataExtended } from '@/services/auth';
import { ActionTypes } from '@/store/actions';
import { useStore } from '@/store';

export default defineComponent({
  components: {TimeChooser, DateChooser, CheckInPanel},
  props: ['uuid'],
  setup(props) {
    const isLoading = ref<boolean>(false);
    const workerUuid = ref<string>('');
    const serviceTypeUuid = ref<string>('');
    const beautyshopsList = ref<object[]>([]);
    const currentBeautyshop = ref<Beautyshop | null>(null);
    const workersList = ref<object>([]);

    let checkInDate: Date = new Date();
    let isTimeSelected = ref<boolean>(false);
    let selectedTimeItem = ref<string>('');

    const store = useStore();

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

    const onDateChange = (currentDate: Date) => {
      checkInDate.setFullYear(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

      console.log('checkInDate update: ', checkInDate);
    }

    const onTimeChange = (currentTime: Date) => {
      checkInDate.setHours(currentTime.getHours(), currentTime.getMinutes(), 0, 0);
      isTimeSelected.value = true;
      // Нужно для того, чтобы был вызов watch'а внутри TimeChooser компонента. Если не менять значение здесь, то watch
      // не будет изменяться, т.к. нет изменений
      selectedTimeItem.value = (currentTime.getHours() < 10 ? '0' + currentTime.getHours() : currentTime.getHours()) + ':' +
          (currentTime.getMinutes() < 10 ? '0' + currentTime.getMinutes() : currentTime.getMinutes());

      console.log('checkInDate update: ', checkInDate, selectedTimeItem.value);
    }

    const checkIn = () => {
      let clientDataEx: ExtendedClientData | null = getClientDataExtended();

      if (!clientDataEx) {
        console.log('Не смогли получить информацию о клиента');
        return;
      }

      if (!currentBeautyshop.value) {
        console.log('Не была получена информация о салоне красоты');
        return;
      }

      store.dispatch(ActionTypes.CreateCheckIn, {
        beautyshopUuid: currentBeautyshop.value.uuid,
        clientUuid: clientDataEx.clientUuid,
        workerUuid: workerUuid.value,
        serviceTypeUuid: serviceTypeUuid.value,
        startDate: checkInDate
      });

      console.log('Создана запись в салон красоты');

      serviceTypeUuid.value = '';
      workerUuid.value = '';
      selectedTimeItem.value = '';
    }

    return {
      beautyshopsList,
      isLoading,
      currentBeautyshop,
      workerUuid,
      serviceTypeUuid,
      workersList,
      isTimeSelected,
      onDateChange,
      onTimeChange,
      showBeautishopInfo,
      checkIn,
      goToList,
      selectedTimeItem,
    }
  }
})
</script>
