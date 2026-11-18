<script setup>
// Badge accessible : l'information n'est pas donnée par la couleur seule,
// il y a toujours un texte (et un symbole décoratif).
defineProps({
  type: { type: String, required: true }, // 'priorite' ou 'statut'
  valeur: { type: String, required: true },
})

const classes = {
  Haute: 'rouge', Moyenne: 'orange', Basse: 'vert',
  Ouvert: 'rouge', 'En cours': 'orange', 'Résolu': 'vert',
}
const symboles = {
  Haute: '▲', Moyenne: '■', Basse: '▼',
  Ouvert: '●', 'En cours': '◐', 'Résolu': '✔',
}
</script>

<template>
  <span class="badge" :class="classes[valeur] || 'gris'" :aria-label="type + ' : ' + valeur">
    <span aria-hidden="true">{{ symboles[valeur] }}</span>
    {{ valeur }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  border: 1px solid transparent;
}
/* couleurs à fort contraste (texte foncé sur fond clair) */
.rouge  { background: #fde2e2; color: #8a1313; border-color: #e99a9a; }
.orange { background: #fdecc8; color: #7a4a00; border-color: #e5b45c; }
.vert   { background: #d8f3e0; color: #0e5a2a; border-color: #86c99b; }
.gris   { background: #e5e7eb; color: #374151; }
</style>
