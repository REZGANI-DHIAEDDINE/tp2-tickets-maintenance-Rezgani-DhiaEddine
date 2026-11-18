<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TicketForm from '../components/TicketForm.vue'
import TicketBadge from '../components/TicketBadge.vue'
import { getTicket, updateTicket, deleteTicket } from '../services/ticketService.js'
import { messageErreur, formaterDate } from '../utils/erreurs.js'

const route = useRoute()
const router = useRouter()

const ticket = ref(null)
const chargement = ref(true)
const introuvable = ref(false)   // 404 : l'identifiant n'existe pas
const erreur = ref('')           // autre erreur (réseau, 500...)
const erreurAction = ref('')
const succes = ref('')
const modeEdition = ref(false)
const enregistrement = ref(false)

async function charger() {
  chargement.value = true
  introuvable.value = false
  erreur.value = ''
  try {
    ticket.value = await getTicket(route.params.id)
  } catch (e) {
    if (e.response && e.response.status === 404) introuvable.value = true
    else erreur.value = messageErreur(e, 'charger le ticket')
  } finally {
    chargement.value = false
  }
}
onMounted(charger)

async function enregistrerModifs(donnees) {
  if (enregistrement.value) return
  enregistrement.value = true
  erreurAction.value = ''
  succes.value = ''
  try {
    // PUT : on envoie le ticket complet (on conserve id et dateCreation)
    ticket.value = await updateTicket(ticket.value.id, {
      ...ticket.value,
      ...donnees,
      id: ticket.value.id,
      dateCreation: ticket.value.dateCreation,
    })
    modeEdition.value = false
    succes.value = 'Ticket modifié avec succès.'
  } catch (e) {
    erreurAction.value = messageErreur(e, 'modifier le ticket')
  } finally {
    enregistrement.value = false
  }
}

async function supprimer() {
  if (!confirm(`Supprimer définitivement le ticket « ${ticket.value.titre} » ?`)) return
  erreurAction.value = ''
  try {
    await deleteTicket(ticket.value.id)
    router.push('/tickets')
  } catch (e) {
    erreurAction.value = messageErreur(e, 'supprimer le ticket')
  }
}
</script>

<template>
  <router-link to="/tickets">← Retour à la liste</router-link>

  <p v-if="chargement" class="message" role="status">Chargement...</p>

  <div v-else-if="introuvable" class="message erreur" role="alert">
    <h2>Ticket introuvable (404)</h2>
    <p>Aucun ticket ne porte l'identifiant « {{ route.params.id }} ». Il a peut-être été supprimé.</p>
    <router-link to="/tickets" class="bouton">Retour à la liste</router-link>
  </div>

  <div v-else-if="erreur" class="message erreur" role="alert">
    {{ erreur }}
    <button class="bouton petit" @click="charger">Réessayer</button>
  </div>

  <template v-else-if="ticket">
    <h2>Ticket n°{{ ticket.id }} — {{ ticket.titre }}</h2>

    <div v-if="succes" class="message succes" role="status">{{ succes }}</div>
    <div v-if="erreurAction" class="message erreur" role="alert">{{ erreurAction }}</div>

    <TicketForm
      v-if="modeEdition"
      :initial="ticket"
      texte-bouton="Enregistrer les modifications"
      :enregistrement="enregistrement"
      @soumettre="enregistrerModifs"
      @annuler="modeEdition = false"
    />

    <template v-else>
      <dl class="fiche">
        <dt>Identifiant</dt><dd>{{ ticket.id }}</dd>
        <dt>Titre</dt><dd>{{ ticket.titre }}</dd>
        <dt>Description</dt><dd>{{ ticket.description }}</dd>
        <dt>Demandeur</dt><dd>{{ ticket.demandeur }}</dd>
        <dt>Priorité</dt><dd><TicketBadge type="Priorité" :valeur="ticket.priorite" /></dd>
        <dt>Statut</dt><dd><TicketBadge type="Statut" :valeur="ticket.statut" /></dd>
        <dt>Date de création</dt><dd>{{ formaterDate(ticket.dateCreation) }}</dd>
      </dl>
      <div class="boutons">
        <button class="bouton" @click="modeEdition = true; succes = ''">Modifier</button>
        <button class="bouton rouge" @click="supprimer">Supprimer</button>
      </div>
    </template>
  </template>
</template>

<style scoped>
h2 { margin: 12px 0; }
.fiche { display: grid; grid-template-columns: 180px 1fr; gap: 10px 16px; background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; }
dt { font-weight: 700; color: #4b5563; }
dd { margin: 0; }
.boutons { display: flex; gap: 10px; margin-top: 16px; }
</style>
