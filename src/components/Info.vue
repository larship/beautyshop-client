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

<style scoped lang="less">
.check-in-screen {
  text-align: left;
  margin: 10px;

  > div {
    padding-bottom: 10px;
  }

  select {
    width: 100%;
    padding: 5px;
  }

  .check-in-buttons {
    margin-top: 15px;
    grid-template-columns: 1fr 1fr;
    display: grid;
    grid-column-gap: 15px;
  }
}

.data-choose-row {
  &--title {
    padding-bottom: 5px;
  }
}

.date-chooser {
  display: flex;

  div + div {
    margin-left: 15px;
  }
}

.time-chooser {
  display: flex;
  justify-content: space-evenly;

  span {
    border: 1px solid #c8c8c8;
    border-radius: 5px;
    padding: 3px 10px;
  }
}
</style>
