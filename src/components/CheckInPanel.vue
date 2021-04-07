<template>
  <div v-if="checkInItem" class="check-in-panel">
    <div class="check-in-panel__info">
      Вы записаны в салон {{ checkInItem.beautyshop.name }} на {{ checkInDate }}
      {{ checkInItem.serviceType.name }}, {{ checkInItem.price }} рублей
    </div>
    <div class="check-in-panel__cancel">
      <button @click="cancelCheckIn()">Отмена</button>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store';
import CheckInItem from '@/models/CheckInItem';
import dayjs from 'dayjs';
import UpdateLocale from 'dayjs/plugin/updateLocale';
import { ActionTypes } from '@/store/actions';
import { MonthNameList } from '@/services/lang';

export default defineComponent({
  setup() {
    dayjs.extend(UpdateLocale);
    dayjs.updateLocale('en', {
      months: MonthNameList
    });

    const store = useStore();
    const checkInItem = computed<CheckInItem | null>(() => {
      return store.getters.getCheckInItem();
    });

    const checkInDate = computed<string>(() => {
      return dayjs(checkInItem.value?.startDate).format('D MMMM, HH:mm');
    });

    const cancelCheckIn = () => {
      if (checkInItem.value?.uuid) {
        store.dispatch(ActionTypes.CancelCheckIn, { checkInUuid: checkInItem.value.uuid });
      }
    }

    return {
      checkInItem,
      checkInDate,
      cancelCheckIn,
    }
  }
})
</script>
