<template>
  <CheckInPanel></CheckInPanel>
  <div class="list-screen">
    <header>
      <div class="header--title">
        Каталог
        <div class="location-select" @click="showChangeLocationForm = true">{{ currentLocation }}</div>
      </div>
      <div class="header--switcher">
        <span class="selected">Все</span>
        <span>Избранные</span>
      </div>
    </header>
    <div class="location-choose-form" v-if="showChangeLocationForm">
      <div class="location-item" @click="changeLocation('Москва')">Москва</div>
      <div class="location-item" @click="changeLocation('Санкт-Петербург')">Санкт-Петербург</div>
      <div class="location-item" @click="changeLocation('Новосибирск')">Новосибирск</div>
      <div class="location-item" @click="changeLocation('Владивосток')">Владивосток</div>
    </div>
    <div class="loading" v-if="true">Загрузка...</div>
    <div class="beautyshop-list">
      <div @click="openBeautyshop(beautyshop)" v-for="beautyshop in beautyshopsList" v-bind:key="beautyshop.uuid"
           class="beautyshop">
        <div>
          <div class="beautyshop--name">{{ beautyshop.name }}</div>
          <div class="beautyshop--address">{{ beautyshop.address }}</div>
        </div>
        <span class="beautyshop--favorite">&#9734;</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getBeautyshops } from '@/models';
import { getLocation, setLocation } from '@/services/location';
import CheckInPanel from '@/components/CheckInPanel.vue';
import Beautyshop from '@/models/Beautyshop';
import router from '@/router';

export default defineComponent({
  components: {CheckInPanel},
  setup() {
    const currentLocation = ref<string>(getLocation());
    const showChangeLocationForm = ref<boolean>(false);
    const beautyshopsList = ref<Beautyshop[]>([]);

    // @TODO Получать из STORE
    const getBeautyshopsData = (cityName: string) => {
      getBeautyshops(cityName).then((data: Beautyshop[]) => {
        beautyshopsList.value = data
      });
    }

    const changeLocation = (cityName: string) => {
      currentLocation.value = cityName;
      setLocation(cityName);
      getBeautyshopsData(currentLocation.value);
      showChangeLocationForm.value = false;
    }

    const openBeautyshop = (beautyshop: Beautyshop) => {
      router.push({name: 'Info', params: {uuid: beautyshop.uuid}});
    }

    getBeautyshopsData(currentLocation.value);

    return {
      showChangeLocationForm,
      changeLocation,
      currentLocation,
      beautyshopsList,
      openBeautyshop,
    }
  }
})
</script>
