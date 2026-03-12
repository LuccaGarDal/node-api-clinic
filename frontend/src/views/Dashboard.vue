<script setup>

import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue';
import  api  from '../services/api';

const router = useRouter();
const errorMessage = ref('');
const consultas = ref([]);


const todasConsultas = async () => {
    try {
        const response = await api.get('/api/appointments');
        const result = response.data.data;
        console.log(result);
        consultas.value = result.map(sessao => ({
            ...sessao,
            inicio: sessao.inicio?.replace('T', ' ').slice(0,16),
            fim: sessao.fim?.replace('T', ' ').slice(0,16)
        }));
    } catch (error) {
        console.log(error);
        errorMessage.value = error.response?.data?.message || 'Erro ao buscar consultas';
    }
}

onMounted (() => {
    todasConsultas();
})

</script>



<template>
    <div>
        <h1>Dashboard</h1>
    </div>

    <h2> Lista de consultas</h2>
    <table>
      <thead>
        <tr>
          <th>Paciente</th>
          <th>Data</th>
          <th>CEP</th>
          <th>Número</th>
          <th>Rua</th>
          <th>Complemento</th>
          <th>Clima</th>
        </tr>
      </thead>

       <tbody>
        <tr v-for="consulta in consultas" :key="consulta.id">
          <td>{{ consulta.user.nome }}</td>
          <td>{{ consulta.inicio }}</td>
          <td>{{ consulta.address.cep }}</td>
          <td>{{ consulta.address.numero }}</td>
          <td>{{ consulta.address.logradouro}}</td>
          <td>{{ consulta.address.complemento }}</td>
          <td>{{ consulta.weather?.message || "Não há previsão para esta data" }}</td>

          
        </tr>
      </tbody>
    </table>
</template>