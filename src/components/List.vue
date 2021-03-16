<template>
  <CheckInPanel></CheckInPanel>
  <div class="list-screen">
    <header>
      <div class="header--title">
        Каталог
        <div class="location-select" @click="showChangeLocationForm = true">{{ currentLocation }}</div>
      </div>
      <div class="header--switcher">
        <span @click="currentShowState = ShowState.all"
              v-bind:class="{ 'selected': currentShowState === ShowState.all }">Все</span>
        <span @click="currentShowState = ShowState.favorite"
              v-bind:class="{ 'selected': currentShowState === ShowState.favorite }">Избранные</span>
      </div>
    </header>
    <div class="location-choose-form" v-if="showChangeLocationForm">
      <div class="location-item" @click="changeLocation('Москва')">Москва</div>
      <div class="location-item" @click="changeLocation('Санкт-Петербург')">Санкт-Петербург</div>
      <div class="location-item" @click="changeLocation('Новосибирск')">Новосибирск</div>
      <div class="location-item" @click="changeLocation('Владивосток')">Владивосток</div>
    </div>
    <div class="loading" v-if="isLoading">Загрузка...</div>
    <div class="beautyshop-list">
      <div v-for="beautyshop in beautyshopsList" v-bind:key="beautyshop.uuid" class="beautyshop">
        <div @click="openBeautyshop(beautyshop)">
          <div class="beautyshop--name">{{ beautyshop.name }}</div>
          <div class="beautyshop--address">{{ beautyshop.address }}</div>
        </div>
        <span class="beautyshop--favorite" @click="setFavorite(beautyshop, true)"
              v-if="!beautyshop.favorite">&#9734;</span>
        <span class="beautyshop--favorite" @click="setFavorite(beautyshop, false)"
              v-if="beautyshop.favorite">&#9733;</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { getLocation, setLocation } from '@/services/location';
import CheckInPanel from '@/components/CheckInPanel.vue';
import Beautyshop from '@/models/Beautyshop';
import router from '@/router';
import { useStore } from '@/store';
import { ActionTypes } from '@/store/actions';

enum ShowState {
  all = 1,
  favorite = 2,
}

export default defineComponent({
  components: {CheckInPanel},
  setup() {
    const currentLocation = ref<string>(getLocation());
    const showChangeLocationForm = ref<boolean>(false);
    const currentShowState = ref<ShowState>(ShowState.all);
    const store = useStore();
    const isLoading = computed(() => {
      return store.getters.getIsLoading();
    });
    const beautyshopsList = computed(() => {
      const items = store.getters.getBeautyshopList()?.filter((beautyshop: Beautyshop) => {
        return currentShowState.value === ShowState.all || beautyshop.favorite;
      });

      return items;
    });
    const changeLocation = (cityName: string) => {
      currentLocation.value = cityName;
      setLocation(cityName);
      showChangeLocationForm.value = false;
      store.dispatch(ActionTypes.GetBeautyshopList, {
        location: cityName
      });
    }
    const openBeautyshop = (beautyshop: Beautyshop) => {
      router.push({name: 'Info', params: {uuid: beautyshop.uuid}});
    }

    const setFavorite = (beautyshop: Beautyshop, state: boolean) => {
      beautyshop.favorite = state;

      if (state) {
        store.dispatch(ActionTypes.AddToFavorite, {
          beautyshopUuid: beautyshop.uuid
        });
      } else {
        store.dispatch(ActionTypes.RemoveFromFavorite, {
          beautyshopUuid: beautyshop.uuid
        });
      }
    }

    store.dispatch(ActionTypes.GetBeautyshopList, {
      location: currentLocation.value
    });

    return {
      showChangeLocationForm,
      changeLocation,
      currentLocation,
      beautyshopsList,
      openBeautyshop,
      isLoading,
      setFavorite,
      ShowState,
      currentShowState
    }
  }
})
</script>
