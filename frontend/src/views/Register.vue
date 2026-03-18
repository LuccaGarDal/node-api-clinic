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
  <div class="registro-container">
    <div class = "pagina">
      <h1>Cadastro</h1>

      <div class = "formulario">
        <input v-model="nome" placeholder="Nome" />
        <input v-model="email" placeholder="Email" />
        <input v-model="senha" type="password" placeholder="Senha" />
        <select v-model="cargo">
          <option disabled value="">Selecione o cargo</option>
          <option value="PACIENTE">Paciente</option>
          <option value="SECRETARIO">Secretário</option>
        </select>
      </div>

      <button class = "botao" @click="register">Registrar</button>

      <p v-if="errorMessage" class="erro">
      {{ errorMessage }}  
      </p>

    </div>
  </div>
</template>

<style scoped>
.registro-container {
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

input, select {
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