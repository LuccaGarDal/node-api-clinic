<script setup>

import { useRouter } from 'vue-router'
import { ref } from 'vue';
import  api  from '../services/api';

const router = useRouter();
const notas = ref('');
const inicio = ref('');
const cep = ref('');
const numero = ref('');
const complemento = ref('');
const errorMessage = ref('')
const consultaAgendada = ref(false);



const agendar = async () => {
    errorMessage.value = ''

    try {
    const response = await api.post('/api/appointments', {
      notas: notas.value,
      inicio: inicio.value,
      cep: cep.value,
      numero: numero.value,
      complemento: complemento.value
    });

    console.log(response);
    consultaAgendada.value = true;

  } catch (error) {
    console.log(error);
    errorMessage.value = error.response?.data?.message || 'Erro ao agendar consulta';
  }
 
};

const limparFormulario = () => {
  consultaAgendada.value = false

  errorMessage.value = ''

  inicio.value = ''
  notas.value = ''
  cep.value = ''
  numero.value = ''
  complemento.value = ''
}

const formatarData = (data) => {
  const d = new Date(data);

  return d.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  });
};

</script>

<template>
  <div class="consulta">

    <div class="pagina">

      <h1>Agendar Consulta</h1>

      <div v-if="!consultaAgendada" class="formulario">
        <input type="datetime-local" v-model="inicio" />
        <input v-model="notas" placeholder="Observações da consulta" />
        <input v-model="cep" placeholder="CEP" />
        <input v-model="numero" placeholder="Número da residência" />
        <input v-model="complemento" placeholder="Complemento" />

        <button class="botao" @click="agendar">Agendar</button>
      </div>

      <p v-if="errorMessage" class="erro">
        {{ errorMessage }}
      </p>

      <div v-if="consultaAgendada" class="confirmacao">
        <h2>Consulta agendada com sucesso ✅</h2>

        <p><b>Data:</b> {{ formatarData(inicio)}}</p>
        <p><b>Observações:</b> {{ notas }}</p>

        <button class="botao" @click="limparFormulario">Agendar nova consulta</button>
      </div>

    </div>
  </div>
</template>

<style scoped>

.consulta {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f7fb;
}

.pagina {
  background: white;
  padding: 35px;
  border-radius: 16px;
  width: 380px;
  text-align: center;
  box-shadow: 0 15px 35px rgba(0,0,0,0.15);
}

h1 {
  margin-bottom: 20px;
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

input:focus {
  outline: none;
  border-color: #4facfe;
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

.botao:hover {
  opacity: 0.9;
}

.erro {
  color: red;
  margin-top: 10px;
}

.confirmacao {
  margin-top: 20px;
  padding: 15px;
  background: #e8f7ee;
  border-radius: 8px;
  border: 1px solid #4caf50;
}

</style>