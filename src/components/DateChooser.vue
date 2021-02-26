<template>
  <div class="date-chooser">
    <div class="date-chooser--arrow date-chooser--arrow__left" @click="changeDay(-1)"></div>
    <div>{{ currentDateStr }}</div>
    <div class="date-chooser--arrow date-chooser--arrow__right" @click="changeDay(1)"></div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';

export default defineComponent({
  emits: ['dateChange'],
  setup(props, {emit}) {
    let currentDate = new Date();
    let monthNames = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    let currentDateStr = ref<string>(currentDate.getDate() + ' ' + monthNames[currentDate.getMonth()]);

    const changeDay = (direction: number) => {
      currentDate.setDate(currentDate.getDate() + direction)
      currentDateStr.value = currentDate.getDate() + ' ' + monthNames[currentDate.getMonth()];

      emit('dateChange', currentDate);
    }

    return {
      currentDateStr,
      changeDay,
    }
  }
})
</script>
