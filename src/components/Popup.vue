<template>
  <div class="popup-mask"></div>
  <div class="popup">
    <div class="popup__content">
      {{ title }}
    </div>
    <div class="popup__buttons">
      <button @click="close()">Хорошо</button>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
  emits: ['close'],
  props: ['title'],
  setup(props, {emit}) {
    const close = () => {
      emit('close');
    }

    return {
      close,
    }
  }
})
</script>
