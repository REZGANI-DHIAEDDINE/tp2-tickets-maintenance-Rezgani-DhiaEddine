<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TicketForm from '../components/TicketForm.vue'
import { createTicket } from '../services/ticketService.js'
import { messageErreur, dateDuJour } from '../utils/erreurs.js'

const router = useRouter()
const enregistrement = ref(false)
const erreur = ref('')

async function creer(donnees) {
  if (enregistrement.value) return // empêche un second envoi
  enregistrement.value = true
  erreur.value = ''
  try {
    await createTicket({
      ...donnees,
      statut: 'Ouvert',            // statut initial imposé
      dateCreation: dateDuJour(),  // date du jour
    })
    router.push('/tickets')         // la liste se recharge depuis l'API
  } catch (e) {
    erreur.value = messageErreur(e, 'créer le ticket')
    enregistrement.value = false    // on réactive le bouton pour pouvoir réessayer
  }
}
</script>

<template>
  <router-link to="/tickets">← Retour à la liste</router-link>
  <h2>Nouveau ticket</h2>
  <div v-if="erreur" class="message erreur" role="alert">{{ erreur }}</div>
  <TicketForm
    mode-creation
    texte-bouton="Créer le ticket"
    :enregistrement="enregistrement"
    @soumettre="creer"
    @annuler="router.push('/tickets')"
  />
</template>
