Quand vous ajoutez une question via l'admin, elle est sauvegardée dans le localStorage du navigateur — c'est de la mémoire temporaire côté client, pas un fichier sur votre disque.
Le bouton "Copier le JS" va lire toutes les questions actuellement en mémoire (y compris celles que vous avez ajoutées), les sérialiser au format JS exact attendu par data-p1.js ou data-p2.js, et copier ce texte dans votre presse-papiers.
Vous n'avez ensuite qu'à ouvrir le fichier data-p1.js dans votre éditeur, tout sélectionner, et coller — le fichier est remis à jour avec vos nouvelles questions. Au prochain chargement, elles font partie des données initiales et ne dépendent plus du localStorage.
C'est la seule façon d'avoir une vraie persistance dans un projet de fichiers statiques sans serveur.


Workflow complet pour pérenniser une question

Vous ajoutez une question via l'admin → elle est en localStorage.
Vous cliquez sur 📋 Copier JS — P1 (ou P2 selon le projet).
Le code JS complet de toutes les questions du projet est copié dans votre presse-papiers.
Vous ouvrez js/data-p1.js dans votre éditeur (VS Code, etc.).
Ctrl+A pour tout sélectionner → Ctrl+V pour coller.
Vous sauvegardez le fichier et le poussez sur GitHub.
Désormais la question fait partie des données initiales — elle sera là même sur un nouvel appareil ou après vidage du cache.

Le fallback : si vous êtes sur http:// sans localhost (certains serveurs locaux), l'API navigator.clipboard est bloquée par le navigateur pour des raisons de sécurité. Dans ce cas, une modale s'ouvre avec le code dans une zone de texte — vous sélectionnez tout et copiez manuellement.