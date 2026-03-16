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
  <div class="portal">

    <header class="header">
      <h1>Portal da Clínica</h1>

      <nav class="nav">
        <router-link to="/portal" class="link-nav">Página inicial</router-link>
        |
        <router-link to="/portal/consulta" class="link-nav">Agendar Consulta</router-link>
        |
        <router-link to="/portal/minhas-consultas" class="link-nav">Minhas Consultas</router-link>
        |
        <button @click="logout" class="logout">Sair</button>
      </nav>
    </header>

    <section v-if="$route.path === '/portal'" class="sobre">
      <h2>Bem-vindo(a) à nossa clínica!</h2>
      <p>
        Aqui no Portal da Clínica, você encontra praticidade e segurança para gerenciar suas consultas e acompanhar seu histórico de atendimento. 
        Nosso objetivo é oferecer um atendimento humanizado e de qualidade, garantindo que cada paciente se sinta acolhido.
      </p>
      <p>
        Navegue pelas opções acima para agendar uma nova consulta ou conferir suas consultas já marcadas. Tudo de forma rápida e online!
      </p>
    </section>

    <div class="conteudo">
      <router-view />
    </div>
  </div>
</template>

<style scoped>

.portal{
  min-height: 100vh;
  background: #f4f7fb;
}


.header {
  background: linear-gradient(135deg, #4facfe, #00c6ff);
  color: white;
  padding: 20px;
  text-align: center;
}


.nav {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.link-nav {
  text-decoration: none;
  color: white;
  font-weight: 500;
  padding: 8px 14px;
  border-radius: 6px;
  transition: 0.2s;
}

.link-nav:hover {
  background: rgba(255,255,255,0.2);
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


.conteudo {
  padding: 40px;
}

/* Seção inicial */

.sobre {
  max-width: 700px;
  margin: 40px auto;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.sobre h2 {
  margin-bottom: 15px;
}

.sobre p {
  margin-bottom: 10px;
  line-height: 1.6;
}

</style>