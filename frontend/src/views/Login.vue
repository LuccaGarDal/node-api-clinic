<script setup>

import { useRouter } from 'vue-router'
import { ref } from 'vue';
import  api  from '../services/api';

const router = useRouter();
const email = ref('');
const senha = ref('');
const errorMessage = ref('')

const login = async () => {
  
    try {
    const response = await api.post('/auth/login', {
      email: email.value,
      senha: senha.value
    });

    localStorage.setItem('token', response.data.token);
    router.push('/dashboard');

  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erro ao fazer login';
  }
 
};
</script>

<template>
  <div>
    <h1>Login</h1>

    <input v-model="email" placeholder="Email" />
    <input v-model="senha" type="password" placeholder="Senha" />

    <button @click="login">Entrar</button>
    <p v-if="errorMessage" class="text-red-500">
    {{ errorMessage }}  
    </p>
  </div>
</template>