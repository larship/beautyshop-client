<template>
  <div class="hello-screen">
    <div v-if="currentShowState === ShowState.phone">
      <span class="input-title">Ваш телефон:</span>
      <div class="input-container input-container__two-rows">
        <span>+7</span>
        <input
            v-bind:value="phoneNumber"
            v-on:input="phoneNumber = $event.target.value"
            @input="phoneNumberChange()"
            type="text"
            placeholder="(XXX) XXX-XX-XX"
            maxlength="15"
        />
      </div>
      <span class="input-desc">
        Телефон нужен администраторам салонов для связи с вами и подтверждения записи,
        мы не используем его в рекламных целях.
      </span>
      <button @click="nextStep()" v-bind:disabled="phoneNumber.length !== 15">Далее</button>
    </div>
    <div v-if="currentShowState === ShowState.name">
      <div class="input-title">Как к вам обращаться?</div>
      <div class="input-container">
        <input
            v-bind:value="name"
            v-on:input="name = $event.target.value"
            @input="nameChange()"
            type="text"
        />
      </div>
      <button @click="nextStep()" v-bind:disabled="name.trim().length < 2">Далее</button>
    </div>
    <div v-if="currentShowState === ShowState.city">
      <div class="input-title">Выберите ваш город</div>
      <div class="input-container">
        <select v-model="selectedCity">
          <option v-for="cityName in cityList" v-bind:value="cityName" v-bind:key="cityName">
            {{ cityName }}
          </option>
        </select>
      </div>
      <button @click="nextStep()" v-bind:disabled="!selectedCity">Далее</button>
    </div>
    <div class="user-agreement-info">
      Нажимая на кнопку "Далее", вы принимаете "Пользовательское соглашение"
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import router from '@/router';
// import { checkAuth, setClientData, getClientDataExtended } from '@/services/auth';
// import Client from '@/models/Client';
import { useStore } from '@/store';
import { ActionTypes } from '@/store/actions';
import Client from '@/models/Client';

enum ShowState {
  phone = 1,
  name = 2,
  city = 3,
}

export default defineComponent({
  setup() {
    const currentShowState = ref<ShowState>(ShowState.phone);
    const phoneNumber = ref('');
    const name = ref('');
    const selectedCity = ref('');
    const store = useStore();
    const cityList = [
      'Москва',
      'Санкт-Петербург',
      'Новосибирск',
      'Владивосток'
    ];

    const phoneNumberChange = () => {
      const phone = phoneNumber.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);

      if (phone == null) {
        return;
      }

      phoneNumber.value = !phone[2] ? phone[1] : '(' + phone[1] + ') ' + phone[2] + (phone[3] ? '-' + phone[3] : '') + (phone[4] ? '-' + phone[4] : '');
    }

    const nameChange = () => {
      name.value = name.value.replace(/[^а-яА-Яa-zA-Z ]/g, '');
    }

    const nextStep = () => {
      switch (currentShowState.value) {
        case ShowState.phone:
          currentShowState.value = ShowState.name;
          break;

        case ShowState.name:
          currentShowState.value = ShowState.city;
          break;

        case ShowState.city:
          store.dispatch(ActionTypes.SetLocation, {
            location: selectedCity.value
          });
          store.dispatch(ActionTypes.CreateNewClient, {
            phone: '7' + phoneNumber.value.replace(/\D/g, ''),
            fullName: name.value.replace(/[^а-яА-Яa-zA-Z ]/g, ''),
          }).then((client: Client | null) => {
            if (client) {
              router.push({name: 'List'});
              console.log('Клиент успешно создан, переходим в список салонов красоты');
            } else {
              console.log('Не удалось создать клиента');
            }
          });

          break;
      }
    }

    const client = store.getters.getClient();

    if (client?.uuid && client?.sessionId && client?.salt) {
      store.dispatch(ActionTypes.AuthorizeClient, {
        clientUuid: client.uuid,
        sessionId: client.sessionId,
        salt: client.salt,
      }).then((client: Client | null) => {
        if (client) {
          router.push({name: 'List'});
          console.log('Клиент успешно авторизован, переходим в список салонов красоты');
        } else {
          console.log('Не удалось авторизовать клиента');
        }
      });
    }

    return {
      ShowState,
      currentShowState,
      phoneNumber,
      name,
      selectedCity,
      cityList,
      phoneNumberChange,
      nameChange,
      nextStep,
    }
  }
})
</script>
