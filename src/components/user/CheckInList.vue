<template>
  <div class="user-check-in-list-screen">
    <div class="check-in-list">
      <div v-for="checkInItem in checkInList" v-bind:key="checkInItem.uuid"
           v-bind:class="{ 'active': checkInItem.isActive, 'cancelled': checkInItem.isDeleted }" class="check-in-item">
        <div>
          {{ checkInItem.beautyshopName }}<br>
          {{ checkInItem.serviceTypeName }} - {{ checkInItem.workerName }}
        </div>
        <div>
          {{ checkInItem.startDate }}<br>
          {{ checkInItem.price }} рублей
        </div>
        <button v-if="checkInItem.isActive" @click="cancelCheckIn(checkInItem.uuid)" class="check-in-item--cancel">X</button>
      </div>
    </div>
    <div class="buttons-container buttons-container--single">
      <button @click="goBack()">Назад</button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from '@/store';
import { ActionTypes } from '@/store/actions';
import CheckInItem from '@/models/CheckInItem';
import dayjs from 'dayjs';
import UpdateLocale from 'dayjs/plugin/updateLocale';
import { MonthNameList } from '@/services/lang';
import router from '@/router';

interface CheckInViewItem {
  uuid: string;
  beautyshopName: string;
  serviceTypeName: string;
  workerName: string;
  startDate: string;
  price: string;
  isDeleted: boolean;
  isActive: boolean;
}

export default defineComponent({
  setup() {
    dayjs.extend(UpdateLocale);
    dayjs.updateLocale('en', {
      months: MonthNameList
    });

    const store = useStore();
    const client = store.getters.getClient();
    const checkInList = computed<CheckInViewItem[]>(() => {
      let list = store.getters.getCheckInList();

      if (!list) {
        return [];
      }

      return list.map((checkInItem: CheckInItem) => {
        return {
          uuid: checkInItem.uuid,
          beautyshopName: checkInItem.beautyshop.name,
          serviceTypeName: checkInItem.serviceType.name,
          workerName: checkInItem.worker.fullName,
          startDate: dayjs(checkInItem.startDate).format('D MMMM, HH:mm'),
          price: checkInItem.price as unknown as string,
          isDeleted: checkInItem.deleted,
          isActive: dayjs(checkInItem.endDate).isAfter(dayjs()) && !checkInItem.deleted,
        };
      });
    });

    const goBack = () => {
      router.back();
    }

    const updateList = () => {
      if (client) {
        store.dispatch(ActionTypes.GetClientCheckInList, {
          clientUuid: client.uuid
        });
      }
    }

    updateList();

    const cancelCheckIn = (checkInUuid: string) => {
      store.dispatch(ActionTypes.CancelCheckIn, {checkInUuid});
      updateList();
    }

    return {
      checkInList,
      goBack,
      cancelCheckIn
    }
  }
})
</script>
