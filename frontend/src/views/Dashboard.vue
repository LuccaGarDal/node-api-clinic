<script setup>

import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue';
import  api  from '../services/api';

const router = useRouter();
const errorMessage = ref('');
const consultas = ref([]);

const formatarData = (data) => {
  return new Date(data)
    .toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    .replace(',', ' às');
};

const todasConsultas = async () => {
    try {
        const response = await api.get('/api/appointments');
        const result = response.data.data;
        console.log(result);
        consultas.value = result.map(sessao => ({
            ...sessao,
            inicio: formatarData(sessao.inicio),
            fim: formatarData(sessao.fim)
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
  <div class="dashboard">
    <h1>Dashboard</h1>
    <h2> Lista de consultas</h2>
    <table class = "tabela">
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
          <td>{{ consulta.weather?.message || "Sem previsão" }}</td>
        </tr>
      </tbody>

    </table>

  </div>
</template>

<style scoped>

.dashboard {
  max-width: 1000px;
  margin: 40px auto;
}

h1 {
  margin-bottom: 10px;
}

h2 {
  margin-bottom: 20px;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  border-radius: 10px;
  overflow: hidden;
}

.tabela th {
  background: #4facfe;
  color: white;
  padding: 12px;
  text-align: left;
}

.tabela td {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.tabela tr:hover {
  background: #f5f7fb;
}

</style>