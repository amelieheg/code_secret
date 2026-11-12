# Vérifications dans le navigateur — 12 novembre 2026

Environnement : Microsoft Edge 157.0.4341.46, piloté avec Playwright, en mode sans fenêtre sous Windows. Fichiers locaux de la version du jeu a4438ce, inchangés lors du contrôle. Node.js v24.22.1. Polices distantes bloquées : contrôle avec les polices de remplacement.

Le tirage est fixé à quatre rouges uniquement dans le navigateur de test pour rendre la victoire reproductible ; les fichiers du jeu ne sont pas modifiés.

| Essai | Attendu | Observé |
| --- | --- | --- |
| Largeur 390 px, CSS sauvegardé avant correction | Légende masquée : défaut à reproduire | display: none, défaut reproduit |
| Même largeur, CSS du commit a4438ce | Légende visible et pas de débordement horizontal | display: block, légende visible, pas de débordement |
| Trois rouges puis validation | Refus, essai 1/10, historique vide | Conforme |
| Ajouter le quatrième rouge puis valider | Victoire au premier essai, validation désactivée | Conforme |
| Nouvelle partie | Essai 1/10, secret caché, historique vide | Conforme |
| Largeur 1280 px | Légende visible | Conforme |
| Erreurs JavaScript | Aucune | Aucune erreur pageerror |

Captures : [avant](mobile-avant.png), [après](mobile-apres.png), [ordinateur](ordinateur.png). L’avant est une reconstitution avec la copie réelle du CSS sauvegardée avant correction ; ce n’est pas une capture prise avant le commit historique.

Limites : largeur simulée, aucun téléphone réel ; parcours clavier et lecteur d’écran non vérifiés. Les captures et tests du navigateur ne prouvent pas la publication GitHub Pages.
