<template>
  <div class="time-chooser">
    <span @click="chooseTime(time)" v-for="time in timeItems" v-bind:key="time"
          v-bind:class="{ 'selected': selectedTimeItemInternal === time }" class="time-chooser--item">{{ time }}</span>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, toRef } from 'vue';

export default defineComponent({
  emits: ['timeChange'],
  props: ['selectedTimeItem', 'openHour', 'closeHour'],
  setup(props, {emit}) {
    let timeArray: string[] = [];
    let openHour = toRef(props, 'openHour');
    let closeHour = toRef(props, 'closeHour');
    let intervalsCount = (closeHour.value - openHour.value) * 2;

    for (let i = 0; i < intervalsCount; i++) {
      let curHour = openHour.value + Math.floor(i / 2);
      let curMinutes = i % 2 === 1 ? '30' : '00';
      let hour = (curHour < 10 ? '0' + curHour : curHour) + ':' + curMinutes;

      timeArray.push(hour);
    }

    let timeItems = ref<string[]>(timeArray);
    let selectedTimeItemInternal = toRef(props, 'selectedTimeItem')

    const chooseTime = (selectedItem: string) => {
      let userDate: Date = new Date();
      let timeBlocks = selectedItem.split(':');
      userDate.setHours(+timeBlocks[0], +timeBlocks[1], 0, 0);
      selectedTimeItemInternal.value = selectedItem;

      emit('timeChange', userDate);
    }

    return {
      timeItems,
      selectedTimeItemInternal,
      chooseTime,
    }
  }
})
</script>
