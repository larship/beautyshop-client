<template>
  <div v-if="checkInItem" class="check-in-panel">
    <div class="check-in-panel__info">
      Вы записаны в салон {{ checkInItem.beautyshop.name }} на {{ checkInDate }}
      {{ checkInItem.serviceType.name }}, {{ checkInItem.serviceType.price }} рублей
    </div>
    <div class="check-in-panel__cancel">
      <button>Отмена</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store';
import CheckInItem from '@/models/CheckInItem';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';

export default defineComponent({
  setup() {
    dayjs.extend(updateLocale);
    dayjs.updateLocale('en', {
      months: [
        "января", "февраля", "марта", "апреля", "мая", "июня", "июля",
        "августа", "сентября", "октября", "ноября", "декабря"
      ]
    });

    const store = useStore();
    const checkInItem = computed<CheckInItem | null>(() => {
      return store.getters.getCheckInItem();
    });

    const checkInDate = computed<string>(() => {
      return dayjs(checkInItem.value?.startDate).format('D MMMM, HH:mm');
    });

    return {
      checkInItem,
      checkInDate,
    }
  }
})
</script>
