<template>
  <div class="time-chooser">
    <span @click="chooseTime(viewItem)" v-for="viewItem in viewItems" v-bind:key="viewItem.value"
          v-bind:class="{ 'selected': selectedTimeItem === viewItem.value, 'disabled': viewItem.isDisabled }" class="time-chooser--item">{{ viewItem.value }}</span>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, toRef, watch, computed } from 'vue';
import dayjs from 'dayjs';
import CustomParseFormat from 'dayjs/plugin/customParseFormat';

interface ViewItem {
  value: string;
  isDisabled: boolean;
}

export default defineComponent({
  emits: ['timeChange'],
  props: ['isTimeSelected', 'selectedDateItem', 'openHour', 'closeHour', 'excludeTimeItems'],
  setup(props, {emit}) {
    let openHour = toRef(props, 'openHour');
    let closeHour = toRef(props, 'closeHour');
    let intervalsCount = (closeHour.value - openHour.value) * 2;
    let timeItems = ref<string[]>([]);
    // let timeItemsView = ref<ViewItem[]>([]);
    let selectedTimeItem = ref('');
    let isTimeSelected = toRef(props, 'isTimeSelected');
    let selectedDateItem = toRef(props, 'selectedDateItem');
    let excludeTimeItems = toRef(props, 'excludeTimeItems');

    dayjs.extend(CustomParseFormat)

    const chooseTime = (viewItem: ViewItem) => {
      let userDate: Date = new Date();
      let timeBlocks = viewItem.value.split(':');
      userDate.setHours(+timeBlocks[0], +timeBlocks[1], 0, 0);

      if (selectedTimeItem.value != viewItem.value && !viewItem.isDisabled) {
        selectedTimeItem.value = viewItem.value;
        // @TODO Устанавливать признак selected для ViewItem
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
        excludeTimeItems,
        (value: string[]) => {
          console.log('TimeChooser excludeTimeItems:', value);
          updateTimeItems();
        }
    );

    watch(
        selectedDateItem,
        () => {
          updateTimeItems();
        }
    );

    const viewItems = computed(
        () => {
          let viewItems: ViewItem[] = [];
          timeItems.value.forEach(item => {
            viewItems.push({
              value: item,
              isDisabled: excludeTimeItems.value.indexOf(item) !== -1,
            })
          });
          return viewItems;
        }
    );

    updateTimeItems();

    return {
      timeItems,
      selectedTimeItem,
      chooseTime,
      viewItems,
    }
  }
})
</script>
