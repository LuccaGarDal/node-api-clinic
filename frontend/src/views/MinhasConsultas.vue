<script setup>

import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue';
import  api  from '../services/api';

const router = useRouter();
const errorMessage = ref('');
const consultas = ref([]);

const minhasConsultas = async () => {

    try {
        const response = await api.get('/api/myAppointments');
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

onMounted(() => {
    minhasConsultas();
})

</script>

<template>
    <div>
        <h1>Minhas Consultas</h1>
        <div v-for="consulta in consultas":key="consulta.id">
            <p>Data: {{ consulta.inicio }}</p>
            <p>Observações: {{ consulta.notas }}</p>
            <p>Endereço: {{ consulta.address.logradouro }}, {{ consulta.address.numero }}. {{consulta.address.complemento}}</p>
            <p>Clima para o dia: {{ consulta.weather?.message || "Sem previsão do tempo" }} <p>
</p></p>
            <hr>
        </div>
    </div>
</template>