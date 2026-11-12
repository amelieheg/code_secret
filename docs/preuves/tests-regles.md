# Rapport des tests — Code secret

Exécution réelle : 2026-11-12T09:06:39.573Z
Environnement : Node.js v24.22.1, win32.
Commande : node game.test.js --rapport

Ces tests portent sur les règles JavaScript. Ils ne valident pas le rendu visuel du navigateur.

- OK — R1 — Les six identifiants et leur ordre sont exacts
- OK — R1 — Quatre tirages indépendants permettent les répétitions
- OK — R1 — Chacune des six couleurs peut être tirée
- OK — R1 — Le secret reste fixe et caché après une proposition
- OK — R2 — Une nouvelle partie a dix essais et aucun historique
- OK — R2/R5 — L’ordre gauche-droite change les indices
- OK — R3 — Les propositions incomplètes sont refusées sans mutation
- OK — R3 — Les couleurs interdites et les majuscules sont refusées sans mutation
- OK — R4 — Une proposition valide consomme exactement un essai
- OK — R4 — Les propositions et indices restent dans l’historique
- OK — R4 — Modifier une proposition ou une copie de l’état préserve l’historique
- OK — R5 — Priorité aux bien placées avec doublons : 1 / 2
- OK — R5 — Une occurrence rouge ne compte pas quatre fois : 1 / 0
- OK — R5 — Quatre couleurs présentes toutes mal placées : 0 / 4
- OK — R5 — Aucune couleur commune : 0 / 0
- OK — R5 — Vérification exhaustive des 1 679 616 paires de codes
- OK — R6 — La victoire au premier essai révèle le secret
- OK — R6 — La victoire au dixième essai prime sur la défaite
- OK — R6 — Dix propositions sans victoire donnent une défaite
- OK — R7 — Une proposition après victoire ne change plus la partie
- OK — R7 — Une proposition après défaite ne change plus la partie
- OK — R7 — Nouvelle partie remet tout à zéro et tire quatre nouvelles couleurs

**Bilan : 22 tests réussis ; 0 échec(s).**
