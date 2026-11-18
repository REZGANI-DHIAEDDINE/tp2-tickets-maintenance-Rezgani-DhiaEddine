<script setup>
import { reactive, ref } from 'vue'

const props = defineProps({
  // valeurs de départ (vide en création, ticket existant en édition)
  initial: { type: Object, default: () => ({}) },
  // en création le statut est imposé à "Ouvert"
  modeCreation: { type: Boolean, default: false },
  // vrai pendant l'appel à l'API : désactive le bouton
  enregistrement: { type: Boolean, default: false },
  texteBouton: { type: String, default: 'Enregistrer' },
})
const emit = defineEmits(['soumettre', 'annuler'])

// copie locale : on ne modifie pas l'objet d'origine tant qu'on n'a pas enregistré
const form = reactive({
  titre: '',
  description: '',
  demandeur: '',
  priorite: 'Moyenne',
  statut: 'Ouvert',
  ...props.initial,
})
const erreurs = ref({})

function valider() {
  const e = {}
  if (!form.titre.trim()) e.titre = 'Le titre est obligatoire.'
  if (!form.description.trim()) e.description = 'La description est obligatoire.'
  if (!form.demandeur.trim()) e.demandeur = 'Le demandeur est obligatoire.'
  erreurs.value = e
  return Object.keys(e).length === 0
}

function soumettre() {
  if (props.enregistrement) return // sécurité anti double-clic
  if (!valider()) return // formulaire invalide : rien n'est envoyé
  emit('soumettre', {
    ...form,
    titre: form.titre.trim(),
    description: form.description.trim(),
    demandeur: form.demandeur.trim(),
  })
}
</script>

<template>
  <form class="formulaire" novalidate @submit.prevent="soumettre">
    <div class="champ">
      <label for="titre">Titre *</label>
      <input id="titre" v-model="form.titre" type="text" :aria-invalid="!!erreurs.titre" />
      <p v-if="erreurs.titre" class="erreur-champ" role="alert">{{ erreurs.titre }}</p>
    </div>

    <div class="champ">
      <label for="description">Description *</label>
      <textarea id="description" v-model="form.description" rows="4" :aria-invalid="!!erreurs.description"></textarea>
      <p v-if="erreurs.description" class="erreur-champ" role="alert">{{ erreurs.description }}</p>
    </div>

    <div class="champ">
      <label for="demandeur">Demandeur *</label>
      <input id="demandeur" v-model="form.demandeur" type="text" :aria-invalid="!!erreurs.demandeur" />
      <p v-if="erreurs.demandeur" class="erreur-champ" role="alert">{{ erreurs.demandeur }}</p>
    </div>

    <div class="ligne">
      <div class="champ">
        <label for="priorite">Priorité</label>
        <select id="priorite" v-model="form.priorite">
          <option>Basse</option>
          <option>Moyenne</option>
          <option>Haute</option>
        </select>
      </div>

      <div class="champ">
        <label for="statut">Statut</label>
        <select id="statut" v-model="form.statut" :disabled="modeCreation">
          <option>Ouvert</option>
          <option>En cours</option>
          <option>Résolu</option>
          <option>Fermé</option>
        </select>
        <small v-if="modeCreation">Un nouveau ticket est toujours « Ouvert ».</small>
      </div>
    </div>

    <div class="boutons">
      <button type="button" class="bouton gris" @click="emit('annuler')">Annuler</button>
      <button type="submit" class="bouton vert" :disabled="enregistrement">
        {{ enregistrement ? 'Enregistrement...' : texteBouton }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.formulaire { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; display: flex; flex-direction: column; gap: 14px; }
.champ { display: flex; flex-direction: column; gap: 4px; flex: 1; }
label { font-weight: 600; font-size: 14px; }
input, textarea, select {
  padding: 9px 10px; border: 1px solid #9ca3af; border-radius: 6px; font-size: 15px; font-family: inherit; background: white;
}
[aria-invalid='true'] { border-color: #b91c1c; background: #fff5f5; }
.erreur-champ { color: #b91c1c; font-size: 13px; margin: 0; font-weight: 600; }
small { color: #4b5563; }
.ligne { display: flex; gap: 16px; flex-wrap: wrap; }
.boutons { display: flex; justify-content: flex-end; gap: 10px; }
</style>
