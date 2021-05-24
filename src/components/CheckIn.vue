<template>
  <popup v-if="showCheckInPopup" @close-popup="showCheckInPopup = false" title="Вы успешно записаны в салон!"></popup>
  <div class="check-in-screen">
    <div @click="checkInOther()">
      Записать другого человека (перейти на эту же страницу) &gt;
    </div>
    <div class="data-choose-row">
      <span class="data-choose-row--title">Услуга:</span>
      <select v-model="selectedServiceName">
        <option v-for="serviceName in servicesList" v-bind:value="serviceName" v-bind:key="serviceName">
          {{ serviceName }}
        </option>
      </select>
    </div>
    <div class="data-choose-row">
      <span class="data-choose-row--title">Мастер:</span>
      <select v-model="selectedWorker">
        <option v-for="worker in workersList" v-bind:value="worker" v-bind:key="worker.uuid">
          {{ worker.fullName }}
        </option>
      </select>
    </div>
    <div class="data-choose-row">
      <span class="data-choose-row--title">Дата:</span>
      <DateChooser @dateChange="onDateChange"></DateChooser>
    </div>
    <div class="data-choose-row">
      <span class="data-choose-row--title">Время:</span>
      <TimeChooser
          v-bind:is-time-selected="isTimeSelected"
          v-bind:selected-date-item="checkInDatePlain"
          v-bind:open-hour="currentBeautyshop?.openHour"
          v-bind:close-hour="currentBeautyshop?.closeHour"
          v-bind:exclude-time-items="excludeTimeItems"
          @timeChange="onTimeChange"
          v-if="currentBeautyshop"
      >
      </TimeChooser>
    </div>
    <div class="data-choose-row">
      <span class="data-choose-row--title">Стоимость:</span>
      <div>
        <span class="price">{{ price }} <span class="price--currency">рублей</span></span>
      </div>
    </div>
    <div class="buttons-container">
      <button @click="checkIn()" v-bind:disabled="!selectedWorker || !selectedServiceName || !isTimeSelected">Записаться
      </button>
      <button @click="goToInfo()">Назад</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent, computed } from 'vue';
import Beautyshop from '@/models/Beautyshop';
import router from '@/router';
import DateChooser from '@/components/DateChooser.vue';
import TimeChooser from '@/components/TimeChooser.vue';
import { ActionTypes } from '@/store/actions';
import { useStore } from '@/store';
import dayjs from 'dayjs';
import Utc from 'dayjs/plugin/utc';
import Client from '@/models/Client';
import Worker from '@/models/Worker';
import Popup from '@/components/Popup.vue';

export default defineComponent({
  components: {Popup, TimeChooser, DateChooser},
  props: ['uuid'],
  setup(props) {
    const store = useStore();
    const currentBeautyshop = ref<Beautyshop | null>(store.getters.getBeautyshop(props.uuid));
    const checkInDate = new Date();
    const checkInDatePlain = ref<string>(dayjs(checkInDate).format('DD-MM-YYYY'));
    const isTimeSelected = ref(false);
    const selectedServiceName = ref('');
    const selectedWorker = ref<Worker | null>(null);
    const showCheckInPopup = ref(false);

    dayjs.extend(Utc);

    const updateBeautyshopCheckInList = () => {
      store.dispatch(ActionTypes.GetBeautyshopCheckInList, {
        beautyshopUuid: props.uuid,
        dateFrom: dayjs().startOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
        dateTo: dayjs().endOf('day').utc().format('YYYY-MM-DD HH:mm:ss'),
      });
      console.log('CheckInList:', store.getters.getCheckInList());
    }

    updateBeautyshopCheckInList();

    const servicesList = computed(() => {
      let items: string[] = [];
      currentBeautyshop.value?.workers.forEach(worker => {
        if (!selectedWorker.value || selectedWorker.value.uuid === worker.uuid) {
          worker.services?.forEach(serviceType => {
            if (items.indexOf(serviceType.name) === -1) {
              items.push(serviceType.name);
            }
          });
        }
      });

      return items;
    });

    const workersList = computed(() => {
      let items: Worker[] = [];
      currentBeautyshop.value?.workers.forEach(worker => {
        let hasServiceType = false;

        worker.services?.forEach(serviceType => {
          if (serviceType.name === selectedServiceName.value || selectedServiceName.value === '') {
            hasServiceType = true;
          }
        });

        if (hasServiceType) {
          items.push(worker);
        }
      });

      return items;
    });

    const excludeTimeItems = computed<string[]>(() => {
      let excludeItems: string[] = [];
      const selectedDate = dayjs(checkInDate).format('DD-MM-YYYY');

      store.getters.getCheckInList()?.forEach(item => {
        const checkInDate = dayjs(item.startDate).format('DD-MM-YYYY');

        // TODO Тут также надо учитывать продолжительность процедуры
        if (item.worker.uuid === selectedWorker.value?.uuid && selectedDate === checkInDate && !item.deleted) {
          excludeItems.push(dayjs(item.startDate).format('HH:mm'));
        }
      });

      console.log('excludeItems:', excludeItems);

      return excludeItems;
    });

    const serviceTypeUuid = computed<string | null>(() => {
      let uuid: string | null = null;
      selectedWorker.value?.services.forEach(serviceType => {
        if (serviceType.name === selectedServiceName.value) {
          uuid = serviceType.uuid;
        }
      });

      return uuid;
    });

    const price = computed(() => {
      let price = '-';

      if (selectedServiceName.value) {
        if (selectedWorker.value) {
          // Точная цена
          let serviceType = selectedWorker.value.services.find(serviceType => {
            return serviceType.uuid === serviceTypeUuid.value;
          });

          if (serviceType) {
            price = '' + serviceType.price;
          }
        } else {
          // Интервал цен
          let min = 0, max = 0;

          currentBeautyshop.value?.workers.forEach(worker => {
            worker.services?.forEach(serviceType => {
              if (serviceType.name === selectedServiceName.value) {
                if (min === 0 && max === 0) {
                  min = serviceType.price;
                  max = serviceType.price;
                } else {
                  min = serviceType.price < min ? serviceType.price : min;
                  max = serviceType.price > max ? serviceType.price : max;
                }
              }
            })
          });

          price = (min === max) ? '' + min : min + ' - ' + max;
        }
      }

      return price;
    });

    const goToInfo = () => {
      router.push({name: 'Info', params: {uuid: props.uuid}});
    }

    const checkInOther = () => {
      router.push({name: 'CheckIn', params: {uuid: props.uuid}});
    }

    const onDateChange = (currentDate: Date) => {
      checkInDate.setFullYear(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      checkInDatePlain.value = dayjs(checkInDate).format('DD-MM-YYYY');
      isTimeSelected.value = false;
    }

    const onTimeChange = (currentTime: Date) => {
      checkInDate.setHours(currentTime.getHours(), currentTime.getMinutes(), 0, 0);
      isTimeSelected.value = true;
    }

    const checkIn = () => {
      let clientDataEx: Client | null = store.getters.getClient();

      if (!clientDataEx) {
        console.log('Не смогли получить информацию о клиенте');
        return;
      }

      if (!currentBeautyshop.value) {
        console.log('Не была получена информация о салоне красоты');
        return;
      }

      if (!selectedWorker.value || !serviceTypeUuid.value || !isTimeSelected.value) {
        console.log('Не были заполнены необходимые данные');
        return;
      }

      store.dispatch(ActionTypes.CreateCheckIn, {
        beautyshopUuid: currentBeautyshop.value.uuid,
        clientUuid: clientDataEx.uuid ?? '',
        workerUuid: selectedWorker.value.uuid,
        serviceTypeUuid: serviceTypeUuid.value,
        startDate: checkInDate
      });

      console.log('Создана запись в салон красоты');

      selectedServiceName.value = '';
      selectedWorker.value = null;
      isTimeSelected.value = false;

      updateBeautyshopCheckInList();

      showCheckInPopup.value = true;
    }

    return {
      currentBeautyshop,
      selectedWorker,
      servicesList,
      selectedServiceName,
      workersList,
      isTimeSelected,
      price,
      onDateChange,
      onTimeChange,
      checkInOther,
      checkIn,
      goToInfo,
      checkInDatePlain,
      excludeTimeItems,
      showCheckInPopup,
    }
  }
})
</script>
