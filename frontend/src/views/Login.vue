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

    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('cargo' , response.data.data.user.cargo);
    if(response.data.data.user.cargo === 'PACIENTE') {
      router.push('/portal');
    } else {
      router.push('/dashboard');
    }

  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Erro ao fazer login';
  }
 
};
</script>

<template>
  <div class = "login-container">
    <div class = "pagina">
      <h1>Login</h1>

      <div class = "formulario">
        <input v-model="email" placeholder="Email" />
        <input v-model="senha" type="password" placeholder="Senha" />
      </div>

      <button class = "botao" @click="login">
        Entrar
      </button>

      <p v-if="errorMessage" class="erro">
      {{ errorMessage }}  
      </p>

    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.pagina {
  background: white;
  padding: 40px;
  border-radius: 16px;
  width: 350px;
  text-align: center;
  box-shadow: 0 15px 35px rgba(0,0,0,0.15);
}

h1 {
  margin-bottom: 25px;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.botao {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #4facfe;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;
}

.erro {
  color: red;
  margin-top: 10px;
}
</style>