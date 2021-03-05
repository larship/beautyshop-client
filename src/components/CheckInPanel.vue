<template>
  <div v-if="checkInItem" class="check-in-panel">
    <div class="check-in-panel__info">
      Вы записаны в салон {{ checkInItem.beautyshop.name }}<br>
      На стрижку, цена, время, кнопка отмены
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from '@/store';

export default defineComponent({
  setup() {
    const store = useStore();
    const checkInItem = computed(() => {
      return store.getters.getCheckInItem();
    });

    return {
      checkInItem,
    }
  }
})
</script>
