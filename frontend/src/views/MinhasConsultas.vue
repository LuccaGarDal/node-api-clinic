<script setup>

import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue';
import  api  from '../services/api';
import { computed } from 'vue';

const router = useRouter();
const errorMessage = ref('');
const consultas = ref([]);

const imagemClima = (mensagem) => {
    if(!mensagem) return '/images/erro.png';

      const text = mensagem.toLowerCase()


    if(text.includes('dia')) return '/images/chuvoso.png';
    if(text.includes('não')) return '/images/ensolarado.png';

    return '/images/erro.png';

}

const formatarData = (data) => {
  const d = new Date(data);
  return d.toLocaleString('pt-BR', {
    timeZone: 'America/Bahia', // força horário de Salvador
    dateStyle: 'short',
    timeStyle: 'short'
  })
  .replace(',', ' às');;
};

const minhasConsultas = async () => {

    try {
        const response = await api.get('/api/myAppointments');
        const result = response.data.data;
        consultas.value = result.map(sessao => ({
            ...sessao,
            inicio: formatarData(sessao.inicio),
            fim: formatarData(sessao.fim)
    }));
    } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Erro ao buscar consultas';
    }
}

onMounted(() => {
    minhasConsultas();
})

</script>

<template>
  <div class="consultas">

    <h1>Minhas Consultas</h1>

    <div
      v-for="consulta in consultas"
      :key="consulta.id"
      class="consulta-itens"
    >

      <p><b>Data:</b> {{ consulta.inicio }}</p>

      <p><b>Observações:</b> {{ consulta.notas || "Sem observações" }}</p>

      <p>
        <b>Endereço:</b>
        {{ consulta.address.logradouro }},
        {{ consulta.address.numero }}
        <span v-if="consulta.address.complemento">
          - {{ consulta.address.complemento }}
        </span>
      </p>

      <div class="clima">
        <p>
          <b>Clima para o dia:</b>
          {{ consulta.weather?.message || "Sem previsão do tempo" }}
        </p>

        <img
          :src="imagemClima(consulta.weather?.message)"
          alt="Clima"
          class="icone-clima"
        />
      </div>
      

    </div>

  </div>
</template>

<style scoped>

.consultas {
  max-width: 700px;
  margin: 40px auto;
}

h1 {
  margin-bottom: 20px;
}

.consulta-itens {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 15px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.consulta-itens p {
  margin: 6px 0;
}

.icone-clima {
  width: 70px;
  height: 70px;
}

.clima {
  display: flex;
  justify-content: space-between;
  align-items: center;
}


</style>