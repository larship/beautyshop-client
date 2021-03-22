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
      <button @click="nextStep()" v-bind:disabled="name.trim().length < 3">Далее</button>
    </div>
    <div class="user-agreement-info">
      Нажимая на кнопку "Далее", вы принимаете "Пользовательское соглашение"
    </div>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import router from '@/router';
import { checkAuth, setClientData, getClientData } from '@/services/auth';
import Client from '@/models/Client';

enum ShowState {
  phone = 1,
  name = 2,
}

export default defineComponent({
  setup() {
    const currentShowState = ref<ShowState>(ShowState.phone);
    const phoneNumber = ref<string>('');
    const name = ref<string>('');

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
          setClientData(
              {
                phone: '7' + phoneNumber.value.replace(/\D/g, ''),
                name: name.value.replace(/[^а-яА-Яa-zA-Z ]/g, '')
              }
          );
          router.push({name: 'List'});
          break;
      }
    }

    checkAuth().then((client: Client | null) => {
      if (client && getClientData()) {
        // В этом случае экран приветствия не нужен, сразу перебросим на список
        router.push({name: 'List'});
      }
    });

    return {
      ShowState,
      currentShowState,
      phoneNumber,
      name,
      phoneNumberChange,
      nameChange,
      nextStep,
    }
  }
})
</script>
