<template>
  <div class="app-container">
    <Menu v-bind:is-open="isMenuOpen" @closed="isMenuOpen = false"></Menu>
    <header v-if="needShowHeader">
      <div class="header--title">
        <span>{{ routeTitle }}</span>
        <button class="menu-button" @click="isMenuOpen = true"></button>
      </div>
    </header>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from '@/store';
import router from '@/router';
import Menu from '@/components/Menu.vue';
import { RouteLocationNormalizedLoaded } from 'vue-router';

export default defineComponent({
  components: {Menu},
  setup() {
    const isMenuOpen = ref(false);
    const store = useStore();
    const location = computed(() => store.getters.getLocation());
    const currentRoute = computed(() => router.currentRoute.value);
    const needShowHeader = ref(false);

    const getRouteTitle = (route: RouteLocationNormalizedLoaded) => {
      switch (route.name) {
        case 'List':
          return 'Каталог - ' + store.getters.getLocation();

        case 'Info':
        case 'CheckIn': {
          let beautyshop = store.getters.getBeautyshop(route.params.uuid as string);
          return beautyshop?.name ?? 'Информация о салоне';
        }
      }

      return '';
    };

    const routeTitle = ref(getRouteTitle(currentRoute.value));

    watch(
        currentRoute,
        (value) => {
          routeTitle.value = getRouteTitle(value);
          needShowHeader.value = value.name != 'Hello';
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
      isMenuOpen,
      location,
      routeTitle,
    }
  }
})
</script>
