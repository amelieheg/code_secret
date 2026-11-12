# Vérification de la publication — 12 novembre 2026

Version : commit `f4f545c7b99e8e61ad34e10edbaef305ea3c6a7e`, tag annoté `jalon-1` présent localement et sur GitHub.

- [Dépôt](https://github.com/amelieheg/code_secret).
- [Application publiée](https://amelieheg.github.io/code_secret/).
- [Tests GitHub](https://github.com/amelieheg/code_secret/actions/runs/43189471200) : terminés avec succès.
- [Déploiement Pages](https://github.com/amelieheg/code_secret/actions/runs/43189471458) : première tentative échouée à `actions/configure-pages`, car Pages n’était pas activé ; deuxième tentative réussie après activation de Pages avec `build_type: workflow`.

## Essais du site publié

Contrôles exécutés avec Node.js 24.22.1 et Playwright, dans Microsoft Edge 157.0.4341.46 en mode sans fenêtre sous Windows. Les quatre fichiers distants ont été téléchargés puis comparés aux fichiers locaux ; seuls les retours de ligne Windows/Unix ont été normalisés pour la comparaison.

| Cas | Attendu | Observé |
| --- | --- | --- |
| Accès au site | Réponse HTTP 200 et titre « Code secret — À vous de décoder. » | Conforme |
| `index.html`, `style.css`, `game.js`, `app.js` | HTTP 200 et contenu identique à la version locale | Conforme pour les quatre fichiers |
| Légende à une largeur de 390 px | Visible | Conforme |
| Trois rouges puis validation | Refus pour proposition incomplète, essai 1/10, historique vide | Conforme |
| Ajout du quatrième rouge, secret fixé à quatre rouges dans le navigateur de test | Victoire au premier essai | Conforme |
| Nouvelle partie | Secret caché, essai 1/10 | Conforme |
| Erreurs JavaScript du navigateur | Aucune | Aucune erreur `pageerror` |
| Tag distant | `jalon-1` désigne le commit `f4f545c` | Conforme, contrôlé avec `git ls-remote` |

Le tirage fixe concerne uniquement le contexte du navigateur de test : aucun fichier publié n’a été modifié pour ces essais. Ce contrôle ne prouve pas l’usage sur un téléphone réel ni le parcours clavier complet. Ces limites restent dans le README.

La confirmation de publication est enregistrée dans un commit de documentation postérieur au tag ; les fichiers du jeu restent ceux de `jalon-1`.
