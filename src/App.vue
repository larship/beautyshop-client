<template>
  <div class="app-container">
    <header class="header" v-if="needShowHeader" v-bind:class="{ 'header__with-back-button': needShowBackButton }">
      <span class="header--back-arrow" v-if="needShowBackButton" @click="goBack()"></span>
      <span>{{ routeTitle }}</span>
      <button class="menu-button" v-if="needShowSettingsButton" @click="goToSettings()"></button>
    </header>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from '@/store';
import router from '@/router';
import { RouteLocationNormalizedLoaded } from 'vue-router';

export default defineComponent({
  components: {},
  setup() {
    const isMenuOpen = ref(false);
    const store = useStore();
    const location = computed(() => store.getters.getLocation());
    const currentRoute = computed(() => router.currentRoute.value);
    const needShowHeader = ref(false);
    const needShowBackButton = ref(false);
    const needShowSettingsButton = ref(false);

    const getRouteTitle = (route: RouteLocationNormalizedLoaded) => {
      switch (route.name) {
        case 'List':
          return store.getters.getLocation();

        case 'Info':
        case 'CheckIn': {
          let beautyshop = store.getters.getBeautyshop(route.params.uuid as string);
          return beautyshop?.name ?? 'Информация о салоне';
        }

        case 'Settings': {
          return 'Настройки';
        }

        case 'UserCheckInList':
          return 'Мои записи';
      }

      return '';
    };

    const goBack = () => {
      router.back();
    }

    const goToSettings = () => {
      router.push({name: 'Settings'});
    }

    const routeTitle = ref(getRouteTitle(currentRoute.value));

    watch(
        currentRoute,
        (value) => {
          routeTitle.value = getRouteTitle(value);
          needShowHeader.value = value.name !== 'Hello';
          needShowBackButton.value = value.name !== 'Hello' && value.name !== 'List';
          needShowSettingsButton.value = value.name !== 'Settings';
        }
    );

    watch(
        location,
        () => {
          routeTitle.value = getRouteTitle(router.currentRoute.value);
        }
    );

    return {
      needShowHeader,
      needShowBackButton,
      needShowSettingsButton,
      isMenuOpen,
      location,
      routeTitle,
      goBack,
      goToSettings,
    }
  }
})
</script>
