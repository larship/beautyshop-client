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
                    v-bind:key="serviceType.uuid">{{ serviceType.name }} &ndash; {{ serviceType.price }} руб.
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
          v-bind:is-time-selected="isTimeSelected"
          v-bind:selected-date-item="checkInDatePlain"
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
import dayjs from 'dayjs';

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

    let checkInDate = new Date();
    let checkInDatePlain = ref<string>(dayjs(checkInDate).format('DD-MM-YYYY'));
    let isTimeSelected = ref<boolean>(false);

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
      checkInDatePlain.value = dayjs(checkInDate).format('DD-MM-YYYY');
      isTimeSelected.value = false;

      console.log('checkInDate update: ', checkInDate);
    }

    const onTimeChange = (currentTime: Date) => {
      checkInDate.setHours(currentTime.getHours(), currentTime.getMinutes(), 0, 0);
      isTimeSelected.value = true;
      console.log('currentTime:', currentTime);
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
      isTimeSelected.value = false;
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
      checkInDatePlain,
    }
  }
})
</script>
