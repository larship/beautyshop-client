<template>
  <div class="time-chooser">
    <span @click="chooseTime(time)" v-for="time in timeItems" v-bind:key="time"
          v-bind:class="{ 'selected': selectedTimeItemInternal === time }" class="time-chooser--item">{{ time }}</span>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, watch } from 'vue';

export default defineComponent({
  emits: ['timeChange'],
  props: ['selectedTimeItem'],
  setup(props, {emit}) {
    let timeArray: string[] = [];
    let startHour = 9;
    let intervalsCount = 18;

    for (let i = 0; i < intervalsCount; i++) {
      let curHour = startHour + Math.floor(i / 2);
      let curMinutes = i % 2 === 1 ? '30' : '00';
      let hour = (curHour < 10 ? '0' + curHour : curHour) + ':' + curMinutes;

      timeArray.push(hour);
    }

    let timeItems = ref<string[]>(timeArray);
    let selectedTimeItemInternal = ref<string>('');

    watch(
        () => props.selectedTimeItem,
        (currentTime: string) => {
          selectedTimeItemInternal.value = currentTime;
        }
    )

    const chooseTime = (selectedItem: string) => {
      selectedTimeItemInternal.value = selectedItem;

      let userDate: Date = new Date();
      let timeBlocks = selectedItem.split(':');
      userDate.setHours(+timeBlocks[0], +timeBlocks[1], 0, 0);

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
