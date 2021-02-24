<template>
  <div class="info-screen">
    <div class="info-common">
      {{ currentBeautyshop.name }}<br>
      {{ currentBeautyshop.address }}
    </div>
    <div class="info-map">
      КАРТА
    </div>
    <div class="buttons-container">
      <button @click="goToCheckIn()">Назад</button>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import Beautyshop from '@/models/Beautyshop';
import { getBeautyshop } from '@/models';
import router from '@/router';

export default defineComponent({
  props: ['uuid'],
  setup(props) {
    const isLoading = ref<boolean>(false);
    const currentBeautyshop = ref<object>([]);
    const workersList = ref<object>([]);

    getBeautyshop(props.uuid).then((beautyshop: Beautyshop | null) => {
      if (!beautyshop) {
        console.log('Не удалось получить информацию о салоне');
        return;
      }

      currentBeautyshop.value = beautyshop;
    });

    const goToCheckIn = () => {
      router.push({name: 'CheckIn', params: {uuid: props.uuid}});
    }

    return {
      isLoading,
      currentBeautyshop,
      workersList,
      goToCheckIn,
    }
  }
})
</script>
