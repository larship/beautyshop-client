<template>
  <CheckInPanel></CheckInPanel>
  <div class="list-screen">
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
    <div class="beautyshop-map" id="list-map">

    </div>
    <footer>
      <div class="mode-switcher">
        <span @click="currentShowState = ShowState.all"
              v-bind:class="{ 'selected': currentShowState === ShowState.all }">Все</span>
        <span @click="currentShowState = ShowState.map"
              v-bind:class="{ 'selected': currentShowState === ShowState.map }">Карта</span>
        <span @click="currentShowState = ShowState.favorite"
              v-bind:class="{ 'selected': currentShowState === ShowState.favorite }">Избранные</span>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import CheckInPanel from '@/components/CheckInPanel.vue';
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
  components: {CheckInPanel},
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
    }
  }
})
</script>
