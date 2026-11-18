import axios from 'axios'

// Instance Axios : URL de base commune à toutes les requêtes
const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
})

// READ : GET /tickets
export async function getTickets() {
  const reponse = await api.get('/tickets')
  return reponse.data
}

// READ : GET /tickets/:id   (404 si le ticket n'existe pas)
export async function getTicket(id) {
  const reponse = await api.get(`/tickets/${id}`)
  return reponse.data
}

// CREATE : POST /tickets   (JSON Server génère l'id)
export async function createTicket(data) {
  const reponse = await api.post('/tickets', data)
  return reponse.data
}

// UPDATE complet : PUT /tickets/:id   (remplace toute la ressource)
export async function updateTicket(id, data) {
  const reponse = await api.put(`/tickets/${id}`, data)
  return reponse.data
}

// UPDATE partiel : PATCH /tickets/:id   (modifie seulement le champ "statut")
export async function updateStatut(id, statut) {
  const reponse = await api.patch(`/tickets/${id}`, { statut })
  return reponse.data
}

// DELETE : DELETE /tickets/:id
export async function deleteTicket(id) {
  await api.delete(`/tickets/${id}`)
}
