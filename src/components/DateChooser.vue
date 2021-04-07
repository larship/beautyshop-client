<template>
  <div class="date-chooser">
    <div class="date-chooser--arrow date-chooser--arrow__left" @click="changeDay(-1)"></div>
    <div>{{ selectedDateStr }}</div>
    <div class="date-chooser--arrow date-chooser--arrow__right" @click="changeDay(1)"></div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import dayjs from 'dayjs';
import UpdateLocale from 'dayjs/plugin/updateLocale';
import IsSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { MonthNameList } from '@/services/lang';

export default defineComponent({
  emits: ['dateChange'],
  setup(props, {emit}) {
    dayjs.extend(UpdateLocale);
    dayjs.extend(IsSameOrAfter);
    dayjs.updateLocale('en', {
      months: MonthNameList
    });

    let selectedDate = dayjs();
    let currentDate = dayjs();
    let selectedDateStr = ref(selectedDate.format('DD MMMM'));

    const changeDay = (direction: number) => {
      let nextDate = selectedDate.add(direction, 'day');

      if (nextDate.isSameOrAfter(currentDate)) {
        selectedDate = selectedDate.add(direction, 'day');
        selectedDateStr.value = selectedDate.format('DD MMMM');

        emit('dateChange', selectedDate.toDate());
      }
    }

    return {
      selectedDateStr,
      changeDay,
    }
  }
})
</script>
