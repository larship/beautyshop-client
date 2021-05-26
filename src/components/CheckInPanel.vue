<template>
  <div v-if="checkInItem" class="check-in-panel">
    <div class="check-in-panel--info">
      Вы записаны в салон {{ checkInItem.beautyshop.name }} на {{ checkInDate }}
      {{ checkInItem.serviceType.name }}, {{ checkInItem.price }} рублей (TODO удалить эту панель, заменить на попап)
    </div>
    <div class="check-in-panel--cancel">
      <button @click="cancelCheckIn()">Отмена</button>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store';
import CheckInItem from '@/models/CheckInItem';
import dayjs from 'dayjs';
import LocaleRu from 'dayjs/locale/ru';
import { ActionTypes } from '@/store/actions';

export default defineComponent({
  setup() {
    dayjs.locale(LocaleRu);

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
