<template>
  <div>
   <h1>Portal da Clínica</h1>

    <nav>
      <router-link to="/portal/consulta">Agendar</router-link>
      |
      <router-link to="/portal/minhas-consultas">Consultas</router-link>
    </nav>

    <router-view />
  </div>
</template>