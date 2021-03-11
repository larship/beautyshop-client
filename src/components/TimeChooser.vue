<template>
  <div class="time-chooser">
    <span @click="chooseTime(time)" v-for="time in timeItems" v-bind:key="time"
          v-bind:class="{ 'selected': selectedTimeItem === time }" class="time-chooser--item">{{ time }}</span>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, toRef, watch } from 'vue';
import dayjs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';

export default defineComponent({
  emits: ['timeChange'],
  props: ['isTimeSelected', 'selectedDateItem', 'openHour', 'closeHour'],
  setup(props, {emit}) {
    let openHour = toRef(props, 'openHour');
    let closeHour = toRef(props, 'closeHour');
    let intervalsCount = (closeHour.value - openHour.value) * 2;
    let timeItems = ref<string[]>([]);
    let selectedTimeItem = ref('');
    let isTimeSelected = toRef(props, 'isTimeSelected');
    let selectedDateItem = toRef(props, 'selectedDateItem');

    dayjs.extend(CustomParseFormat)

    const chooseTime = (selectedItem: string) => {
      let userDate: Date = new Date();
      let timeBlocks = selectedItem.split(':');
      userDate.setHours(+timeBlocks[0], +timeBlocks[1], 0, 0);

      if (selectedTimeItem.value != selectedItem) {
        selectedTimeItem.value = selectedItem;
        emit('timeChange', userDate);
      }
    }

    watch(
        isTimeSelected,
        (value: boolean) => {
          if (!value) {
            selectedTimeItem.value = '';
          }

          console.log('props.isTimeSelected:', value);
        }
    );

    const updateTimeItems = () => {
      let items = [];
      let currentDate = dayjs();
      let selectedDate = dayjs(selectedDateItem.value + ' ' + currentDate.format('HH') + ':' + currentDate.format('mm'),
          'DD-MM-YYYY HH:mm', true);
      let timeIterator = dayjs(openHour.value + ':00', 'HH:mm');

      for (let i = 0; i < intervalsCount; i++) {
        if (timeIterator.isAfter(selectedDate) || currentDate.format('DD-MM-YYYY') != selectedDate.format('DD-MM-YYYY')) {
          items.push(timeIterator.format('HH:mm'));
        }

        timeIterator = timeIterator.add(30, 'minute');
      }

      timeItems.value = items;
    }

    watch(
        selectedDateItem,
        () => {
          updateTimeItems();
        }
    )

    updateTimeItems();

    return {
      timeItems,
      selectedTimeItem,
      chooseTime,
    }
  }
})
</script>
