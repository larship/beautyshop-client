<template>
  <div class="app-container">
    <Menu v-bind:is-open="isMenuOpen" @closed="isMenuOpen = false"></Menu>
    <header>
      <div class="header--title">
        Каталог - {{ location }}
        <button class="menu-button" @click="isMenuOpen = true"></button>
      </div>
    </header>
    <router-view/>
  </div>
</template>
<script>
import Menu from "@/components/Menu";
import {computed, defineComponent, ref, watch} from "vue";
import {useStore} from "@/store";

export default defineComponent({
  components: {Menu},
  setup() {
    const isMenuOpen = ref(false);
    const store = useStore();
    const location = computed(() => store.getters.getLocation());

    watch(
      location,
      (value) => {
        console.log('LOCATION LOCATION LOCATION:', value);
      }
    )

    return {
      isMenuOpen,
      location
    }
  }
})
</script>