<template>
  <div class="list-screen">
    <div class="loading" v-if="isLoading">Загрузка...</div>
    <div class="mode-switcher">
      <span @click="currentShowState = ShowState.all"
            v-bind:class="{ 'selected': currentShowState === ShowState.all }">Все</span>
      <span @click="currentShowState = ShowState.favorite"
            v-bind:class="{ 'selected': currentShowState === ShowState.favorite }">Избранное</span>
      <span @click="currentShowState = ShowState.map"
            v-bind:class="{ 'selected': currentShowState === ShowState.map }">Карта</span>
    </div>
    <div class="beautyshop-list" v-show="currentShowState !== ShowState.map">
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
    <div class="beautyshop-map" id="list-map" v-show="currentShowState === ShowState.map"></div>
    <div class="footer-nav">
      <div class="menu-element menu-element__my-list" @click="goToUserCheckInList()">
        <span class="menu-element--icon"></span>
        <span class="menu-element--title">Мои записи</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import Beautyshop from '@/models/Beautyshop';
import router from '@/router';
import { useStore } from '@/store';
import { ActionTypes } from '@/store/actions';
import { createMap } from '@/services/map';

enum ShowState {
  all = 1,
  map = 2,
  favorite = 3,
}

export default defineComponent({
  setup() {
    const currentShowState = ref<ShowState>(ShowState.all);
    const store = useStore();
    const isLoading = computed(() => {
      return store.getters.getIsLoading();
    });
    const beautyshopsList = computed(() => {
      return store.getters.getBeautyshopList()?.filter((beautyshop: Beautyshop) => {
        return (currentShowState.value === ShowState.all || beautyshop.favorite) && currentShowState.value !== ShowState.map;
      });
    });
    const openBeautyshop = (beautyshop: Beautyshop) => {
      router.push({name: 'Info', params: {uuid: beautyshop.uuid}});
    }

    const mapObjects = beautyshopsList.value ? beautyshopsList.value.map(beautyshop => {
      return {
        coordinates: beautyshop.coordinates as number[],
        title: beautyshop.name
      }
    }).filter((mapObject) => mapObject.coordinates) : [];

    console.log(mapObjects);

    createMap('list-map', mapObjects);

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

    const goToUserCheckInList = () => {
      router.push({name: 'UserCheckInList'});
    }

    store.dispatch(ActionTypes.GetBeautyshopList, {
      location: store.getters.getLocation()
    });

    return {
      beautyshopsList,
      openBeautyshop,
      isLoading,
      setFavorite,
      ShowState,
      currentShowState,
      goToUserCheckInList,
    }
  }
})
</script>
