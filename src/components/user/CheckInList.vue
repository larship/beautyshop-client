<template>
  <div class="user-check-in-list-screen">
    <div class="check-in-list">
      <div v-for="checkInItem in checkInList" v-bind:key="checkInItem.uuid" class="check-in-item">
        {{ checkInItem.beautyshopName }}<br>
        {{ checkInItem.serviceTypeName }}, {{ checkInItem.startDate }}, {{ checkInItem.price }} рублей
      </div>
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

interface CheckInViewItem {
  beautyshopName: string;
  serviceTypeName: string;
  startDate: string;
  price: string;
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
          beautyshopName: checkInItem.beautyshop.name,
          serviceTypeName: checkInItem.serviceType.name,
          startDate: dayjs(checkInItem.startDate).format('D MMMM, HH:mm'),
          price: checkInItem.price as unknown as string
        };
      });
    });

    if (client) {
      store.dispatch(ActionTypes.GetClientCheckInList, {
        clientUuid: client.uuid
      });
    }

    return {
      checkInList
    }
  }
})
</script>
