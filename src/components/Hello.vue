<template>
  <div class="hello-screen">
    <template v-if="currentShowState === ShowState.phone">
      <div class="input-title">Ваш телефон:</div>
      <div class="input-container input-container__two-rows">
        <span>+7</span>
        <input
            v-bind:value="phoneNumber"
            v-on:input="phoneNumber = $event.target.value"
            v-bind:class="{'input-wrong': phoneNumber.length !== 15}"
            @input="phoneNumberChange()"
            type="text"
            placeholder="(XXX) XXX-XX-XX"
            maxlength="15"
        />
      </div>
      <button @click="nextStep()" v-bind:disabled="phoneNumber.length !== 15">Далее</button>
    </template>
    <template v-if="currentShowState === ShowState.name" class="342">
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
    </template>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';
import router from '@/router';
import { setClientData } from '@/auth';

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
              '7' + phoneNumber.value.replace(/\D/g, ''),
              name.value.replace(/[^а-яА-Яa-zA-Z ]/g, '')
          );
          router.push('/list');
          break;
      }
    }

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

<style scoped lang="less">
.hello-screen {
  margin-top: 170px;
}

.input-title {
  color: #777777;
  padding-bottom: 10px;
}

.input-container {
  align-items: center;
  margin-bottom: 15px;

  &__two-rows {
    display: grid;
    grid-template-columns: 30px 1fr;
  }

  &:not(&__two-rows) {
    input {
      width: 100%;
      box-sizing: border-box;
    }
  }

  span {
    font-size: 14pt;
    justify-self: center;
  }
}

button {
  width: 100%;
}

//.input-wrong {
//  border: 1px solid #ff0000;
//}
</style>
