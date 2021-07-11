<template>
  <div class="info-screen" v-bind:class="{ 'info-screen__no-map': !currentBeautyshop?.coordinates }">
    <div class="info-common" v-if="currentBeautyshop">
      {{ currentBeautyshop.name }}<br>
      {{ currentBeautyshop.address }}<br>
      Часы работы: {{ currentBeautyshop.openHour }}:00 - {{ currentBeautyshop.closeHour }}:00<br>
      <span v-for="phoneView in beautyshopPhones" v-bind:key="phoneView.number" class="info--phone">
        <a :href="'tel:' + phoneView.number">{{ phoneView.numberFormatted }}</a>
      </span>
    </div>
    <div class="info-map" id="info-map" v-if="currentBeautyshop?.coordinates"></div>
    <div class="buttons-container buttons-container__single">
      <button v-if="currentBeautyshop?.workers" @click="goToCheckIn()">Выбрать мастера</button>
      <a v-if="!currentBeautyshop?.workers" :href="'tel:' + beautyshopPhones[0].number">
        <button>Позвонить</button>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import Beautyshop from '@/models/Beautyshop';
import router from '@/router';
import { useStore } from '@/store';
import { createMap } from '@/services/map';

interface PhoneView {
  number: string;
  numberFormatted: string;
}

export default defineComponent({
  props: ['uuid'],
  setup(props) {
    const store = useStore();
    const currentBeautyshop = ref<Beautyshop | null>(store.getters.getBeautyshop(props.uuid));
    const beautyshopPhones: PhoneView[] = currentBeautyshop.value?.phones ? currentBeautyshop.value.phones.map((phone: string) => {
      const phoneElements = phone.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);

      if (!phoneElements?.[4]) {
        return {
          number: '+' + phone,
          numberFormatted: '+' + phone
        }
      }

      const phoneFormatted = '+' + phoneElements[1] + ' (' + phoneElements[2] + ') ' + phoneElements[3] + '-' + phoneElements[4] + '-' + phoneElements[5];

      return {
        number: '+' + phone,
        numberFormatted: phoneFormatted ?? ''
      }
    }) : [];

    if (currentBeautyshop.value?.coordinates) {
      createMap('info-map', [{
        title: '',
        coordinates: currentBeautyshop.value.coordinates as number[],
      }]);
    }

    const goToList = () => {
      router.push({name: 'List'});
    }

    const goToCheckIn = () => {
      router.push({name: 'CheckIn', params: {uuid: props.uuid}});
    }

    console.log('currentBeautyshop:', currentBeautyshop);

    return {
      currentBeautyshop,
      goToCheckIn,
      goToList,
      beautyshopPhones,
    }
  }
})
</script>
