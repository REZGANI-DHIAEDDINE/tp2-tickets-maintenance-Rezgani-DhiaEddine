import { createRouter, createWebHistory } from 'vue-router'
import ListeTickets from '../views/ListeTickets.vue'
import NouveauTicket from '../views/NouveauTicket.vue'
import DetailTicket from '../views/DetailTicket.vue'

const routes = [
  { path: '/', redirect: '/tickets' },
  { path: '/tickets', name: 'liste', component: ListeTickets },
  // "nouveau" doit être déclaré AVANT ":id", sinon "nouveau" serait pris pour un identifiant
  { path: '/tickets/nouveau', name: 'nouveau', component: NouveauTicket },
  { path: '/tickets/:id', name: 'detail', component: DetailTicket },
  // toute autre URL : page introuvable
  { path: '/:pathMatch(.*)*', redirect: '/tickets' },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
