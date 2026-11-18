<template>
  <main class="conteneur">
    <header class="entete">
      <h1>Tickets de maintenance</h1>
      <router-link to="/tickets" class="lien-nav">Liste des tickets</router-link>
    </header>
    <router-view />
  </main>
</template>

<style scoped>
.entete { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
.lien-nav { color: #1d4ed8; font-weight: 600; }
</style>
