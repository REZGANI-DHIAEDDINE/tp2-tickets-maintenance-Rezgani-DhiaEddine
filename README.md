# TP2 — Gestion des tickets de maintenance (Vue 3 + Vue Router + Axios + JSON Server)

**Identité :** DhiaEddine Rezgani L2DSI1

## Prérequis
- Node.js 18 ou plus récent et npm
- Git

## Installation
```bash
git clone <URL-du-dépôt>
cd <dossier-du-dépôt>
npm install
```

## Lancement (deux terminaux, les deux restent ouverts)

**Terminal 1 — API JSON Server**
```bash
npx json-server db.json --port 3000
```
Vérifier : http://localhost:3000/tickets

**Terminal 2 — application Vue**
```bash
npm run dev
```
Ouvrir http://localhost:5173

## Routes
| URL | Page |
|---|---|
| /tickets | Liste (recherche, filtres, statut rapide, suppression) |
| /tickets/nouveau | Création |
| /tickets/:id | Détail, modification, suppression (message 404 si l'id n'existe pas) |

## Fonctionnalités réalisées
- Création : formulaire, validation (titre, description, demandeur), `POST /tickets`, statut « Ouvert » et date du jour automatiques
- Modification : `PUT /tickets/:id` depuis la page de détail
- Changement rapide de statut dans la liste (Ouvert → En cours → Résolu → Fermé) : `PATCH /tickets/:id`
- Suppression avec boîte de confirmation : `DELETE /tickets/:id`
- Interface mise à jour après chaque opération sans recharger la page
- Vue Router : liste, création, détail, message 404 pour un identifiant inexistant
- Service Axios : `getTickets`, `getTicket`, `createTicket`, `updateTicket`, `updateStatut`, `deleteTicket`
- `async/await` + `try/catch` partout ; messages d'erreur non bloquants
- Bouton de soumission désactivé pendant l'enregistrement
- Recherche et filtres du TP1 conservés
- Bonus : tableau de bord (nombre de tickets par statut)

## Structure
```
db.json
src/router/index.js
src/services/ticketService.js
src/utils/erreurs.js            messages d'erreur, dates
src/components/TicketForm.vue   formulaire + validation (création et édition)
src/components/TicketBadge.vue
src/views/ListeTickets.vue
src/views/NouveauTicket.vue
src/views/DetailTicket.vue
captures/
```

## Questions

**Différence entre POST, PUT et PATCH ?**
`POST` crée une nouvelle ressource (le serveur génère l'id). `PUT` remplace toute la ressource :
on doit renvoyer tous les champs, sinon ceux qui manquent sont perdus. `PATCH` modifie seulement
les champs envoyés (ici, le changement rapide de statut envoie uniquement `{ statut }`).

**Pourquoi une confirmation avant DELETE ?**
La suppression est définitive et irréversible (le ticket disparaît de `db.json`). La confirmation
évite les suppressions accidentelles dues à un clic par erreur.

**Quel est le rôle de Vue Router ?**
Il associe des URL à des composants (pages) sans recharger le navigateur : `/tickets`,
`/tickets/nouveau`, `/tickets/:id`. Il lit les paramètres d'URL (`route.params.id`), permet
la navigation (`router-link`, `router.push`) et rend les pages accessibles directement par leur adresse.

**Comment éviter les doublons lors de l'enregistrement ?**
Un indicateur `enregistrement` passe à `true` dès l'envoi : le bouton est désactivé
(`:disabled`) et la fonction retourne immédiatement si un envoi est déjà en cours. Il repasse
à `false` en cas d'erreur pour pouvoir réessayer. Après succès on quitte la page.

## Difficultés rencontrées
- À compléter avec vos propres difficultés.

## Scénario de validation
Créer « Clavier défectueux » (Haute) → vérifier la liste et `db.json` → modifier priorité/statut →
ouvrir `/tickets/ID` → supprimer → arrêter JSON Server et vérifier le message d'erreur.

## Captures
Dossier `captures/` (01 à 07).
