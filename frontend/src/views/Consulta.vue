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

const agendar = async () => {
  
    try {
    const response = await api.post('/api/appointments', {
      notas: notas.value,
      inicio: inicio.value,
      cep: cep.value,
      numero: numero.value,
      complemento: complemento.value
    });

  } catch (error) {
    console.log(error);
    errorMessage.value = error.response?.data?.message || 'Erro ao agendar consulta';
  }
 
};

</script>

<template>
    <div>
        <h1>Agendar Consulta</h1>
    </div>
    <div>
        <input type="datetime-local" v-model="inicio" placeholder="Data da consulta" />
        <input v-model="notas" placeholder="Observações da consulta" />
        <input v-model="cep" placeholder="CEP" />
        <input v-model="numero" placeholder="Número da residência" />
        <input v-model="complemento" placeholder="Complemento" />
        <button @click="agendar">Agendar</button>
        <p v-if="errorMessage" class="text-red-500">
    {{ errorMessage }}  
    </p>
    </div>
</template>