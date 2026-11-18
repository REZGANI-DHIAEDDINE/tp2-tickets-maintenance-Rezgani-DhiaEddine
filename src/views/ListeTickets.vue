<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getTickets, updateStatut, deleteTicket } from '../services/ticketService.js'
import { messageErreur, formaterDate } from '../utils/erreurs.js'
import TicketBadge from '../components/TicketBadge.vue'

const router = useRouter()

const tickets = ref([])
const chargement = ref(true)
const erreur = ref('')          // erreur de chargement (liste)
const erreurAction = ref('')    // erreur d'une action (suppression, statut) : non bloquante
const enCours = ref(null)       // id du ticket en cours de modification

const recherche = ref('')
const filtreStatut = ref('Tous')
const filtrePriorite = ref('Toutes')

const ORDRE_STATUTS = ['Ouvert', 'En cours', 'Résolu', 'Fermé']

async function charger() {
  chargement.value = true
  erreur.value = ''
  try {
    tickets.value = await getTickets()
  } catch (e) {
    erreur.value = messageErreur(e, 'charger les tickets')
  } finally {
    chargement.value = false
  }
}
onMounted(charger)

// --- Recherche et filtres (conservés du TP1) ---
const ticketsFiltres = computed(() => {
  const mot = recherche.value.trim().toLowerCase()
  return tickets.value.filter(
    (t) =>
      t.titre.toLowerCase().includes(mot) &&
      (filtreStatut.value === 'Tous' || t.statut === filtreStatut.value) &&
      (filtrePriorite.value === 'Toutes' || t.priorite === filtrePriorite.value),
  )
})

// --- Bonus : tableau de bord par statut ---
const compteurs = computed(() =>
  ORDRE_STATUTS.map((s) => ({ statut: s, nombre: tickets.value.filter((t) => t.statut === s).length })),
)

function reinitialiser() {
  recherche.value = ''
  filtreStatut.value = 'Tous'
  filtrePriorite.value = 'Toutes'
}

// --- Changement rapide de statut : Ouvert -> En cours -> Résolu -> Fermé ---
function statutSuivant(statut) {
  const i = ORDRE_STATUTS.indexOf(statut)
  return i >= 0 && i < ORDRE_STATUTS.length - 1 ? ORDRE_STATUTS[i + 1] : null
}

async function avancerStatut(ticket) {
  const suivant = statutSuivant(ticket.statut)
  if (!suivant || enCours.value) return
  enCours.value = ticket.id
  erreurAction.value = ''
  try {
    const maj = await updateStatut(ticket.id, suivant) // PATCH sur l'API
    const i = tickets.value.findIndex((t) => t.id === ticket.id)
    tickets.value[i] = maj // l'interface se met à jour sans recharger la page
  } catch (e) {
    erreurAction.value = messageErreur(e, 'changer le statut')
  } finally {
    enCours.value = null
  }
}

// --- Suppression avec confirmation ---
async function supprimer(ticket) {
  if (!confirm(`Supprimer définitivement le ticket « ${ticket.titre} » ?`)) return
  if (enCours.value) return
  enCours.value = ticket.id
  erreurAction.value = ''
  try {
    await deleteTicket(ticket.id)
    tickets.value = tickets.value.filter((t) => t.id !== ticket.id)
  } catch (e) {
    erreurAction.value = messageErreur(e, 'supprimer le ticket')
  } finally {
    enCours.value = null
  }
}
</script>

<template>
  <div class="barre">
    <h2>Liste des tickets</h2>
    <button class="bouton vert" @click="router.push('/tickets/nouveau')">+ Nouveau ticket</button>
  </div>

  <p v-if="chargement" class="message" role="status">Chargement...</p>

  <div v-else-if="erreur" class="message erreur" role="alert">
    {{ erreur }}
    <button class="bouton petit" @click="charger">Réessayer</button>
  </div>

  <template v-else>
    <div v-if="erreurAction" class="message erreur" role="alert">
      {{ erreurAction }}
      <button class="bouton petit gris" @click="erreurAction = ''">Fermer</button>
    </div>

    <ul class="tableau-bord" aria-label="Nombre de tickets par statut">
      <li v-for="c in compteurs" :key="c.statut"><strong>{{ c.nombre }}</strong> {{ c.statut }}</li>
    </ul>

    <div class="outils">
      <div class="champ grand">
        <label for="recherche">Rechercher par titre</label>
        <input id="recherche" v-model="recherche" type="search" placeholder="Ex : Wi-Fi" />
      </div>
      <div class="champ">
        <label for="fstatut">Statut</label>
        <select id="fstatut" v-model="filtreStatut">
          <option>Tous</option>
          <option v-for="s in ORDRE_STATUTS" :key="s">{{ s }}</option>
        </select>
      </div>
      <div class="champ">
        <label for="fpriorite">Priorité</label>
        <select id="fpriorite" v-model="filtrePriorite">
          <option>Toutes</option>
          <option>Haute</option>
          <option>Moyenne</option>
          <option>Basse</option>
        </select>
      </div>
    </div>

    <p class="compteur" aria-live="polite">{{ ticketsFiltres.length }} ticket(s) visible(s) sur {{ tickets.length }}</p>

    <p v-if="ticketsFiltres.length === 0" class="message">
      Aucun ticket ne correspond à votre recherche.
      <button class="bouton petit" @click="reinitialiser">Réinitialiser</button>
    </p>

    <div v-else class="tableau-conteneur">
      <table>
        <thead>
          <tr>
            <th>Titre</th><th>Demandeur</th><th>Priorité</th><th>Statut</th><th>Date</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in ticketsFiltres" :key="t.id">
            <td>
              <router-link :to="'/tickets/' + t.id" class="titre">{{ t.titre }}</router-link>
            </td>
            <td>{{ t.demandeur }}</td>
            <td><TicketBadge type="Priorité" :valeur="t.priorite" /></td>
            <td><TicketBadge type="Statut" :valeur="t.statut" /></td>
            <td>{{ formaterDate(t.dateCreation) }}</td>
            <td class="actions">
              <button
                v-if="statutSuivant(t.statut)"
                class="bouton petit"
                :disabled="enCours === t.id"
                @click="avancerStatut(t)"
              >
                → {{ statutSuivant(t.statut) }}
              </button>
              <router-link :to="'/tickets/' + t.id" class="bouton petit gris">Modifier</router-link>
              <button class="bouton petit rouge" :disabled="enCours === t.id" @click="supprimer(t)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
</template>

<style scoped>
.barre { display: flex; justify-content: space-between; align-items: center; margin: 8px 0; }
h2 { margin: 0; }
.tableau-bord { list-style: none; display: flex; gap: 10px; flex-wrap: wrap; padding: 0; margin: 12px 0; }
.tableau-bord li { background: white; border: 1px solid #d1d5db; border-radius: 8px; padding: 8px 14px; }
.tableau-bord strong { font-size: 20px; margin-right: 4px; }
.outils { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 8px; }
.champ { display: flex; flex-direction: column; gap: 4px; }
.champ.grand { flex: 1; min-width: 220px; }
label { font-weight: 600; font-size: 14px; }
input, select { padding: 9px 10px; border: 1px solid #9ca3af; border-radius: 6px; font-size: 15px; background: white; }
.compteur { font-weight: 600; color: #1d4ed8; }
.tableau-conteneur { overflow-x: auto; background: white; border-radius: 8px; border: 1px solid #e5e7eb; }
table { width: 100%; border-collapse: collapse; }
th, td { text-align: left; padding: 11px 12px; border-bottom: 1px solid #e5e7eb; vertical-align: middle; }
th { background: #eef1f7; font-size: 14px; }
.titre { font-weight: 700; color: #1d4ed8; }
.actions { display: flex; gap: 6px; flex-wrap: wrap; }
</style>
