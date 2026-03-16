<script setup>

import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue';
import  api  from '../services/api';

const router = useRouter();
const errorMessage = ref('');
const consultas = ref([]);
const consultaEditando = ref(null);

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cargo');
    router.push('/');
  }

const editarConsulta = (consulta) => {
  const data = new Date(consulta.inicioOriginal);

  const dataLocal = new Date(
    data.getTime() - data.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16);

  consultaEditando.value = {
    id: consulta.id,
    inicio: dataLocal,
    cep: consulta.address?.cep || '',
    numero: consulta.address?.numero || '',
    complemento: consulta.address?.complemento || ''
  };
};
const formatarData = (data) => {
  const d = new Date(data);
  return d.toLocaleString('pt-BR', {
    timeZone: 'America/Bahia', // força horário de Salvador
    dateStyle: 'short',
    timeStyle: 'short'
  })
  .replace(',', ' às');;
};


const todasConsultas = async () => {
    try {
        const response = await api.get('/api/appointments');
        const result = response.data.data;
        errorMessage.value = '';
        consultas.value = result.map(sessao => ({
            ...sessao,
            inicioOriginal: sessao.inicio,
            fimOriginal: sessao.fim,
            inicio: formatarData(sessao.inicio),
            fim: formatarData(sessao.fim)
}));
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Erro ao buscar consultas';
    }
}

const excluirConsulta = async (id) => {
  const confirmar = confirm('Deseja realmente excluir esta consulta?');

  if (!confirmar) return;
  try {
    await api.delete(`/api/appointments/${id}`);
    consultas.value = consultas.value.filter(c => c.id !== id);
  } catch (error) {
      errorMessage.value = error.response?.data?.message || 'Erro ao deletar consulta';
  }
}

const salvarEdicao = async () => {
  try {
    const payload = {};

    if (consultaEditando.value.inicio) {
      payload.inicio = consultaEditando.value.inicio;
    }

    if (consultaEditando.value.cep) {
      payload.cep = consultaEditando.value.cep;
    }

    if (consultaEditando.value.numero !== null && consultaEditando.value.numero !== '') {
      payload.numero = consultaEditando.value.numero;
    }

    if (consultaEditando.value.complemento !== null && consultaEditando.value.complemento !== '') {
      payload.complemento = consultaEditando.value.complemento;
    }

    await api.put(`/api/appointments/${consultaEditando.value.id}`, payload);

    errorMessage.value = '';

    alert("Consulta atualizada!")

    await todasConsultas();
    consultaEditando.value = null;

  } catch (error) {

  errorMessage.value =
    error.response?.data?.error ||
    error.response?.data?.message ||
    'Erro ao salvar';
  }
};

onMounted (() => {
    todasConsultas();
})

</script>

<template>
  <div class="dashboard">
    <h1>Dashboard</h1> 
    <button @click="logout" class="logout">Sair</button>
    <h2> Lista de consultas</h2>

    <p v-if="errorMessage" class="erro">{{ errorMessage }}</p>

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
          <th>Ações</th>
        </tr>
      </thead>

       <tbody>
        <tr v-for="consulta in consultas" :key="consulta.id">
          <td>{{ consulta.user.nome }}</td>
          <td v-if="consultaEditando?.id === consulta.id">
            <input type="datetime-local" v-model="consultaEditando.inicio"/>
          </td>
          <td v-else>{{ consulta.inicio }}</td>
          <td v-if="consultaEditando?.id === consulta.id">
            <input v-model="consultaEditando.cep"/>
          </td>
          <td v-else>{{ consulta.address.cep }}</td>
          <td v-if="consultaEditando?.id === consulta.id">
            <input v-model="consultaEditando.numero"/>
          </td>
          <td v-else>{{ consulta.address.numero }}</td>
          <td>{{ consulta.address.logradouro}}</td>
          <td v-if="consultaEditando?.id === consulta.id">
            <input v-model="consultaEditando.complemento"/>
          </td>
          <td v-else>{{ consulta.address.complemento }}</td>
          <td>{{ consulta.weather?.message || "Sem previsão" }}</td>
          <td class="acoes">
            <button
             class="editar" v-if="consultaEditando?.id !== consulta.id" @click="editarConsulta(consulta)">
              Editar
            </button>
            <button v-else @click="salvarEdicao">
              Salvar
            </button>
            <button class="excluir" @click="excluirConsulta(consulta.id)">Excluir</button>
          </td>
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

.acoes {
  display: flex;
  gap: 8px;
}

.editar,
.excluir {
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  color: white;
  font-size: 13px;
  transition: 0.2s;
}

.editar {
  background-color: #4facfe;
}

.excluir {
  background-color: #ff4d4f;
}

.editar:hover,
.excluir:hover {
  opacity: 0.85;
}

.erro {
  background-color: #ffeaea;
  color: #d93025;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  border-left: 4px solid #d93025;
}

.logout {
  background: #ff5b5b;
  border: none;
  color: white;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
}

.logout:hover {
  background: #e04848;
}

</style>