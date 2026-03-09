<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue';
import api from '@/services/api';

const router = useRouter();
const nome = ref('');
const email = ref('');
const senha = ref('');
const cargo = ref('');
const errorMessage = ref('')

const register = async () => {
    try {
    await api.post('/auth/register', {
        nome: nome.value,
        email: email.value,
        senha: senha.value,
        cargo: cargo.value
    });
    alert('Usuário registrado com sucesso!');
    router.push('/login');
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Erro ao registrar usuário';
    }
};
</script>

<template>
  <div>
    <h1>Register</h1>

    <input v-model="nome" placeholder="Nome" />
    <input v-model="email" placeholder="Email" />
    <input v-model="senha" type="password" placeholder="Senha" />
    <input v-model="cargo" placeholder="Cargo" />

    <button @click="register">Registrar</button>
    <p v-if="errorMessage" class="text-red-500">
    {{ errorMessage }}  
    </p>
  </div>
</template>