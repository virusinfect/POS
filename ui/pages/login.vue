<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <h2 class="login-title">Login</h2>
      <a-form
          :model="formState"
          name="basic"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
      >
        <a-form-item
            label="Email"
            name="email"
            :rules="[{ required: true, message: 'Please input your email!' }]"
        >
          <a-input v-model:value="formState.email" />
        </a-form-item>

        <a-form-item
            label="Password"
            name="password"
            :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>

        <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
          <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'custom'
})
import { reactive } from 'vue';
import { useAuthStore } from '~/stores/AuthStore.js';

const authStore = useAuthStore();
const formState = reactive({
  email: '',
  password: '',
  remember: true,
});
const onFinish = async values => {

  if (!values.email || !values.password) {
    authStore.error = 'Email and Password are required';
    return;
  }

  await authStore.login(values.email, values.password);
  if (!authStore.error) {
    // Redirect to another page if login is successful
    // Example: navigateTo('/');
  }
};
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
}

.login-form-wrapper {
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

a-form-item {
  margin-bottom: 16px;
}

a-form-item label {
  font-size: 14px;
  color: #333;
}

a-input,
a-input-password {
  width: 100%;
}

a-button {
  width: 100%;
}
</style>