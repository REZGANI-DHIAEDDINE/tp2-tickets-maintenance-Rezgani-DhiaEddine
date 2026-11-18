// Transforme une erreur Axios en message lisible pour l'utilisateur
export function messageErreur(e, action = 'effectuer cette opération') {
  if (e.response) {
    if (e.response.status === 404) return 'Ressource introuvable (404).'
    return `Impossible de ${action} : erreur du serveur (code ${e.response.status}).`
  }
  // pas de réponse du tout : serveur arrêté, réseau coupé, timeout...
  return `Impossible de ${action} : l'API ne répond pas. Vérifiez que JSON Server est démarré (npx json-server db.json --port 3000).`
}

// Date du jour au format AAAA-MM-JJ (heure locale)
export function dateDuJour() {
  const d = new Date()
  const mois = String(d.getMonth() + 1).padStart(2, '0')
  const jour = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mois}-${jour}`
}

export function formaterDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR')
}
