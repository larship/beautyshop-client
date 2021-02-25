<template>
  <div class="time-chooser">
    <span @click="chooseTime(time)" v-for="time in timeItems" v-bind:key="time"
          v-bind:class="{ 'selected': selectedTimeItem === time }" class="time-chooser--item">{{ time }}</span>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import { getBeautyshops, getWorkers, getServiceTypes } from '@/models';
import Beautyshop from '@/models/Beautyshop';
import Worker from '@/models/Worker';
import ServiceType from '@/models/ServiceType';

export default defineComponent({
  emits: ['timeChange'],
  setup(props, {emit}) {
    let timeArray: string[] = [];
    let startHour = 9;
    let endHour = 18;

    for (let i = 0; i < (endHour - startHour) * 2; i++) {
      let curHour = startHour + Math.floor(i / 2);
      let curMinutes = i % 2 === 1 ? '30' : '00';
      let hour = (curHour < 10 ? '0' + curHour : curHour) + ':' + curMinutes;

      timeArray.push(hour);
    }

    let timeItems = ref<string[]>(timeArray);
    let selectedTimeItem = ref<string>('');

    const chooseTime = (selectedItem: string) => {
      selectedTimeItem.value = selectedItem;

      emit('timeChange', selectedItem);
    }

    return {
      timeItems,
      selectedTimeItem,
      chooseTime,
    }
  }
})
</script>
