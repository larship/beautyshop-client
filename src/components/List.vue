<template>
  <CheckInPanel></CheckInPanel>
  <div class="screen-title">
    Каталог
    <div class="location-select" @click="showChangeLocationForm = true">{{ currentLocation }}</div>
  </div>
  <div class="list-screen">
    <div class="location-choose-form" v-if="showChangeLocationForm">
      <div class="location-item" @click="changeLocation('Москва')">Москва</div>
      <div class="location-item" @click="changeLocation('Санкт-Петербург')">Санкт-Петербург</div>
      <div class="location-item" @click="changeLocation('Новосибирск')">Новосибирск</div>
      <div class="location-item" @click="changeLocation('Владивосток')">Владивосток</div>
    </div>
    <div class="loading" v-if="isLoading">Загрузка...</div>
    <div class="beautyshop-list">
      <div @click="openBeautyshop(beautyshop)" v-for="beautyshop in beautyshopsList" v-bind:key="beautyshop.uuid"
           class="beautyshop">
        <div>
          <div class="beautyshop--name">{{ beautyshop.name }}</div>
          <div class="beautyshop--address">{{ beautyshop.address }}</div>
        </div>
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
    const isLoading = ref<boolean>(true);

    const getBeautyshopsData = (cityName: string) => {
      isLoading.value = true;
      getBeautyshops(cityName).then((data: Beautyshop[]) => {
        isLoading.value = false;
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
      router.push('/check-in/' + beautyshop.uuid);
    }

    getBeautyshopsData(currentLocation.value);

    return {
      isLoading,
      showChangeLocationForm,
      changeLocation,
      currentLocation,
      beautyshopsList,
      openBeautyshop,
    }
  }
})
</script>
