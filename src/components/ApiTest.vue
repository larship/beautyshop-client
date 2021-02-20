<template>
  <div class="button-list">
    <button @click="getBeautyshopsData()">Запрос списка салонов красоты</button>
    <button @click="getServiceTypesData()">Запрос списка услуг</button>
    <button @click="getWorkersData()">Запрос списка мастеров</button>
    <button @click="getScheduleData()">Запрос расписания</button>
  </div>
  <div class="api-result">
    <div v-if="isLoading">
      Выполняется загрузка...
    </div>
    <div v-if="!isLoading && loadedData !== ''">
      <code>
        {{ loadedData }}
      </code>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import { getBeautyshops, getWorkers, getServiceTypes } from '@/models';
import Beautyshop from '@/models/Beautyshop';
import Worker from '@/models/Worker';
import ServiceType from '@/models/ServiceType';

export default defineComponent({
  setup() {
    const isLoading = ref<boolean>(false);
    const loadedData = ref<string>('');

    const getBeautyshopsData = () => {
      isLoading.value = true;
      getBeautyshops('Москва').then((data: Beautyshop[] | null) => {
        loadedData.value = JSON.stringify(data);
        isLoading.value = false;
      });
    }

    const getWorkersData = () => {
      isLoading.value = true;
      getWorkers('73b00c6d-a503-46b2-ae50-2bf609a82973').then((data: Worker[] | null) => {
        loadedData.value = JSON.stringify(data);
        isLoading.value = false;
      });
    }

    const getServiceTypesData = () => {
      isLoading.value = true;
      getServiceTypes('73b00c6d-a503-46b2-ae50-2bf609a82973').then((data: ServiceType[] | null) => {
        loadedData.value = JSON.stringify(data);
        isLoading.value = false;
      });
    }

    const getScheduleData = () => {
      //
    }

    return {
      loadedData,
      isLoading,
      getBeautyshopsData,
      getServiceTypesData,
      getWorkersData,
      getScheduleData,
    }
  }
})
</script>

<style scoped lang="less">
.button-list {
  display: flex;
  flex-direction: column;
  align-items: center;

  button {
    width: 250px;
  }

  button + button {
    margin-top: 5px;
  }
}

.api-result {
  width: 100%;
  height: 300px;
  border-top: 1px solid #999999;
  padding: 10px;
  position: absolute;
  box-sizing: border-box;
  bottom: 0px;
  left: 0px;
  text-align: left;
  background-color: #eeeeee;
}
</style>
