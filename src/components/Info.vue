<template>
  <div class="check-in-screen">
    <div>
      {{ currentBeautyshop.name }}<br>
      {{ currentBeautyshop.address }}
    </div>
    <div style="width: 100%; height: 400px; border: 1px solid #999999;">
      КАРТА
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import Beautyshop from '@/models/Beautyshop';
import { getBeautyshop } from '@/models';

export default defineComponent({
  props: ['uuid'],
  setup(props) {
    const isLoading = ref<boolean>(false);
    const currentBeautyshop = ref<object>([]);
    const workersList = ref<object>([]);

    // checkAuth().then((client: Client|null) => {
    //     console.log(client);
    //   });

    // const fetchData = (url: string) => {
    //   isLoading.value = true;
    //
    //   return fetch(url,  {
    //     method: 'GET',
    //     headers: {
    //       'content-type': 'application/json',
    //     },
    //   }).then(res => {
    //     console.log(res);
    //     isLoading.value = false;
    //
    //     if (!res.ok) {
    //       // loadedData.value = 'Произошла ошибка: ' + res.json()
    //     }
    //
    //     return res.json();
    //   }).then(json => {
    //     // loadedData.value = JSON.stringify(json);
    //     return json;
    //   });
    // }

    getBeautyshop(props.uuid).then((beautyshop: Beautyshop | null) => {
      if (!beautyshop) {
        console.log('Не удалось получить информацию о салоне');
        return;
      }

      currentBeautyshop.value = beautyshop;
    });

    // const checkIn = () => {
    //   fetch(Config.BACKEND_URL + '/check-in?beautyshop=73b00c6d-a503-46b2-ae50-2bf609a82973',  {
    //     method: 'GET',
    //     headers: {
    //       'content-type': 'application/json',
    //     },
    //   }).then(res => {
    //     console.log(res);
    //     // isLoading.value = false;
    //
    //     if (!res.ok) {
    //       // loadedData.value = 'Произошла ошибка: ' + res.json()
    //     }
    //
    //     return res.json();
    //   }).then(json => {
    //     // loadedData.value = JSON.stringify(json);
    //   });
    // }

    return {
      isLoading,
      currentBeautyshop,
      workersList,
    }
  }
})
</script>
