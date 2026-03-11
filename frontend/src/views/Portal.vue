<script setup>
  import { useRouter } from 'vue-router'

  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cargo');
    router.push('/');
  }
</script>


<template>
  <div class="portal-inicial">

    <header class="portal-header">
      <h1>Portal da Clínica</h1>

      <nav class="portal-nav">
        <router-link to="/portal" class="cta-button">Página inicial</router-link>
        |
        <router-link to="/portal/consulta" class="cta-button">Agendar Consulta</router-link>
        |
        <router-link to="/portal/minhas-consultas" class="cta-button">Minhas Consultas</router-link>
        |
        <button @click="logout" class="logout>">Sair</button>
      </nav>
    </header>

    <section v-if="$route.path === '/portal'" class="sobre-clinica">
      <h2>Bem-vindo(a) à nossa clínica!</h2>
      <p>
        Aqui no Portal da Clínica [Nome], você encontra **praticidade e segurança** para gerenciar suas consultas e acompanhar seu histórico de atendimento. 
        Nosso objetivo é oferecer **um atendimento humanizado e de qualidade**, garantindo que cada paciente se sinta acolhido.
      </p>
      <p>
        Navegue pelas opções acima para agendar uma nova consulta ou conferir suas consultas já marcadas. Tudo de forma rápida e online!
      </p>
    </section>

    <!-- Onde os componentes das rotas vão aparecer -->
    <router-view />
  </div>
</template>