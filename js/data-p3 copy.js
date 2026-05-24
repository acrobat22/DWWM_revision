// Fichier généré automatiquement — coller dans js/data-p3.js
// 32 questions — 24/05/2026 20:36:56

export const DATA_P3 = [
  {id:`p3_git_1`,proj:`p3`,num:1,category:`Git & GitHub`,thematique:`Git`,question:`Qu'est-ce que Git et pourquoi l'utiliser ?`,answer:`<p><b>Git</b> est un système de contrôle de version distribué. Il permet de suivre l'historique des modifications d'un projet, de travailler à plusieurs sans écraser le travail des autres, et de revenir à n'importe quelle version précédente.</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Historique</b> : chaque modification est enregistrée avec qui, quand et pourquoi</li>
  <li><b>Branches</b> : développer une fonctionnalité sans toucher au code stable</li>
  <li><b>Collaboration</b> : fusionner le travail de plusieurs développeurs</li>
  <li><b>Sauvegarde</b> : le dépôt distant (GitHub) protège contre la perte locale</li>
</ul>
<pre>git init                    # Initialiser un dépôt local
git clone URL               # Copier un dépôt distant en local
git status                  # État des fichiers modifiés/ajoutés
git log --oneline           # Historique compact des commits</pre>`,freq:`hot`,},
  {id:`p3_git_2`,proj:`p3`,num:2,category:`Git & GitHub`,thematique:`Git`,question:`Expliquez le cycle de vie d'un commit Git.`,answer:`<p>Un fichier passe par 3 zones avant d'être enregistré dans l'historique :</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Working directory</b> : fichiers modifiés mais non suivis par Git</li>
  <li><b>Staging area (index)</b> : fichiers préparés pour le prochain commit (<code>git add</code>)</li>
  <li><b>Repository</b> : historique permanent des commits (<code>git commit</code>)</li>
</ul>
<pre>git add fichier.py          # Ajouter un fichier au staging
git add .                   # Ajouter tous les fichiers modifiés
git commit -m "feat: ajoute la page de connexion"  # Enregistrer

# Convention de nommage des commits (Conventional Commits)
# feat: nouvelle fonctionnalité
# fix: correction de bug
# docs: documentation
# refactor: restructuration sans changement de comportement
# test: ajout ou modification de tests

git commit --amend          # Modifier le dernier commit (avant push)</pre>`,freq:`hot`,},
  {id:`p3_git_3`,proj:`p3`,num:3,category:`Git & GitHub`,thematique:`Git`,question:`Qu'est-ce qu'une branche Git et comment gérer le workflow ?`,answer:`<pre>git branch                          # Lister les branches locales
git branch nom-de-la-fonctionnalite # Créer une branche
git checkout -b nom-fonctionnalite  # Créer ET basculer sur la branche
git switch nom-fonctionnalite       # Basculer (syntaxe moderne)

# Workflow typique
git checkout -b feature/page-connexion  # Nouvelle branche de fonctionnalité
# ... développement et commits ...
git checkout main                       # Retour sur la branche principale
git merge feature/page-connexion        # Fusionner
git branch -d feature/page-connexion    # Supprimer la branche

# Branches protégées sur GitHub
# main   → code en production, protégée (merge via Pull Request uniquement)
# develop → intégration des fonctionnalités
# feature/* → une branche par fonctionnalité</pre>`,freq:`hot`,},
  {id:`p3_git_4`,proj:`p3`,num:4,category:`Git & GitHub`,thematique:`Git`,question:`Quelle est la différence entre \`merge\` et \`rebase\` ?`,answer:`<p>Les deux fusionnent des branches, mais avec des historiques différents.</p>
<pre># merge — conserve l'historique de toutes les branches
git checkout main
git merge feature/login
# Crée un "merge commit" visible dans l'historique

# rebase — rejoue les commits sur une autre base (historique linéaire)
git checkout feature/login
git rebase main
# Les commits de feature/login sont réappliqués après main

# Règle d'or : ne JAMAIS rebase une branche partagée (main, develop)
# rebase réécrit l'historique — dangereux sur du code public</pre>
<p><b>Quand utiliser quoi ?</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><code>merge</code> : pour fusionner des branches partagées</li>
  <li><code>rebase</code> : pour nettoyer l'historique d'une branche locale avant un merge</li>
</ul>`,freq:`med`,},
  {id:`p3_git_5`,proj:`p3`,num:5,category:`Git & GitHub`,thematique:`Git`,question:`Comment résoudre un conflit Git ?`,answer:`<p>Un conflit survient quand deux branches modifient la même ligne d'un fichier. Git marque le conflit dans le fichier.</p>
<pre># Git marque le conflit ainsi :
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD (votre branche)
return "Bonjour " + prenom
=======
return f"Bonjour {prenom} !"
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/salutation

# Étapes de résolution :
# 1. Ouvrir le fichier et choisir la bonne version (ou combiner les deux)
# 2. Supprimer les marqueurs &lt;&lt;&lt;, ===, &gt;&gt;&gt;
# 3. git add fichier_resolu.py
# 4. git commit  (Git propose un message de merge automatiquement)

# Outils visuels
git mergetool       # Lance l'outil de merge configuré (VS Code, etc.)
git diff            # Voir les différences avant de résoudre</pre>`,freq:`hot`,},
  {id:`p3_git_6`,proj:`p3`,num:6,category:`Git & GitHub`,thematique:`Git`,question:`Qu'est-ce qu'une Pull Request et pourquoi l'utiliser ?`,answer:`<p>Une <b>Pull Request</b> (PR) — ou Merge Request sur GitLab — est une demande de fusion d'une branche vers une autre sur GitHub. Elle permet la <b>revue de code</b> avant d'intégrer les modifications.</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li>Discussion et commentaires ligne par ligne</li>
  <li>Validation par un ou plusieurs relecteurs avant merge</li>
  <li>Déclenchement automatique des tests CI/CD</li>
  <li>Traçabilité : chaque fonctionnalité liée à une PR</li>
</ul>
<pre># Workflow avec PR
git checkout -b feature/inscription
# ... développement ...
git push origin feature/inscription
# Ouvrir une PR sur GitHub : feature/inscription → main
# Revue de code par un collègue
# Tests CI passent
# Merge via GitHub (merge commit ou squash)</pre>`,freq:`hot`,},
  {id:`p3_git_7`,proj:`p3`,num:7,category:`Git & GitHub`,thematique:`Git`,question:`Qu'est-ce que \`.gitignore\` et que faut-il y mettre ?`,answer:`<p>Le fichier <code>.gitignore</code> liste les fichiers et dossiers que Git doit ignorer et ne jamais versionner.</p>
<pre># .gitignore typique pour un projet Python/Django + Node.js

# Environnements virtuels
venv/
env/
node_modules/

# Variables d'environnement — JAMAIS versionner les secrets !
.env
.env.local
.env.production

# Fichiers générés
__pycache__/
*.pyc
*.pyo
dist/
build/
*.egg-info/

# Base de données locale
*.sqlite3
*.db

# Fichiers d'IDE
.vscode/
.idea/
*.swp

# Fichiers système
.DS_Store       # macOS
Thumbs.db       # Windows

# Logs
*.log
logs/</pre>
<p>⚠️ Si un fichier sensible a été committé par erreur, le supprimer de l'historique est complexe — mieux vaut changer les secrets immédiatement et le retirer avec <code>git rm --cached</code>.</p>`,freq:`hot`,},
  {id:`p3_rgpd_1`,proj:`p3`,num:8,category:`RGPD & Données personnelles`,thematique:`RGPD`,question:`Qu'est-ce que le RGPD et quelles sont ses obligations principales ?`,answer:`<p>Le <b>RGPD</b> (Règlement Général sur la Protection des Données, entré en vigueur mai 2018) est le cadre légal européen qui réglemente la collecte et le traitement des données personnelles.</p>
<p><b>Les 5 obligations principales :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Licéité</b> : collecter des données uniquement avec une base légale (consentement, contrat, obligation légale…)</li>
  <li><b>Transparence</b> : informer clairement l'utilisateur de ce qu'on collecte et pourquoi</li>
  <li><b>Minimisation</b> : ne collecter que les données strictement nécessaires</li>
  <li><b>Sécurité</b> : protéger les données contre les fuites (chiffrement, accès restreints)</li>
  <li><b>Droits des personnes</b> : accès, rectification, effacement, portabilité, opposition</li>
</ul>
<p>Sanctions : jusqu'à <b>20 millions d'euros ou 4% du CA mondial</b>.</p>`,freq:`hot`,},
  {id:`p3_rgpd_2`,proj:`p3`,num:9,category:`RGPD & Données personnelles`,thematique:`RGPD`,question:`Qu'est-ce qu'une donnée personnelle ? Donnez des exemples.`,answer:`<p>Une <b>donnée personnelle</b> est toute information permettant d'identifier directement ou indirectement une personne physique.</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Directes</b> : nom, prénom, adresse email, numéro de téléphone, photo</li>
  <li><b>Indirectes</b> : adresse IP, cookie, numéro de client, plaque d'immatriculation</li>
  <li><b>Sensibles</b> (protection renforcée) : origine ethnique, opinions politiques, données de santé, orientation sexuelle, données biométriques</li>
</ul>
<p><b>Dans vos projets :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li>Hacher les mots de passe (bcrypt) — jamais en clair</li>
  <li>Ne pas logger les données sensibles</li>
  <li>Prévoir une fonctionnalité de suppression de compte (droit à l'effacement)</li>
  <li>Informer dans les CGU/politique de confidentialité</li>
</ul>`,freq:`hot`,},
  {id:`p3_rgpd_3`,proj:`p3`,num:10,category:`RGPD & Données personnelles`,thematique:`RGPD`,question:`Qu'est-ce que le consentement RGPD et comment l'implémenter ?`,answer:`<p>Le <b>consentement</b> doit être <b>libre, spécifique, éclairé et non ambigu</b>. Une case pré-cochée n'est pas un consentement valide.</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li>L'utilisateur doit effectuer une action positive (cocher une case non pré-cochée)</li>
  <li>Aussi facile de retirer le consentement que de le donner</li>
  <li>Tracer et horodater le consentement</li>
  <li>Expliquer clairement à quoi sert chaque donnée collectée</li>
</ul>
<pre># Exemple en Python/Django — enregistrement du consentement
class ProfilUtilisateur(models.Model):
    utilisateur                  = models.OneToOneField(User, on_delete=models.CASCADE)
    consentement_newsletter      = models.BooleanField(default=False)
    date_consentement_newsletter = models.DateTimeField(null=True, blank=True)

    def donner_consentement_newsletter(self):
        self.consentement_newsletter = True
        self.date_consentement_newsletter = timezone.now()
        self.save()</pre>`,freq:`med`,},
  {id:`p3_agile_1`,proj:`p3`,num:11,category:`Méthodes Agile & Scrum`,thematique:`Agile`,question:`Qu'est-ce que la méthode Agile et en quoi diffère-t-elle de la méthode en cascade ?`,answer:`<p><b>Cascade (Waterfall)</b> : étapes séquentielles figées — analyse complète → conception → développement → tests → livraison. Long cycle, peu flexible aux changements.</p>
<p><b>Agile</b> : développement itératif en courtes périodes (sprints). On livre régulièrement des versions fonctionnelles et on s'adapte aux retours.</p>
<p><b>Les 4 valeurs du Manifeste Agile :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li>Les <b>individus et interactions</b> plutôt que les processus et outils</li>
  <li>Un <b>logiciel fonctionnel</b> plutôt qu'une documentation exhaustive</li>
  <li>La <b>collaboration avec le client</b> plutôt que la négociation contractuelle</li>
  <li>L'<b>adaptation au changement</b> plutôt que le suivi d'un plan</li>
</ul>`,freq:`hot`,},
  {id:`p3_agile_2`,proj:`p3`,num:12,category:`Méthodes Agile & Scrum`,thematique:`Agile`,question:`Expliquez le framework Scrum : rôles, cérémonies et artefacts.`,answer:`<p><b>Les 3 rôles :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Product Owner</b> : représente le client, priorise le backlog</li>
  <li><b>Scrum Master</b> : facilite le processus, lève les obstacles</li>
  <li><b>Équipe de développement</b> : auto-organisée, livre l'incrément</li>
</ul>
<p><b>Les 4 cérémonies :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Sprint Planning</b> : planifier le travail du sprint (1-4 semaines)</li>
  <li><b>Daily Scrum</b> : réunion quotidienne de 15 min (quoi hier, quoi aujourd'hui, blocages ?)</li>
  <li><b>Sprint Review</b> : démo du travail terminé au client</li>
  <li><b>Rétrospective</b> : amélioration du processus de l'équipe</li>
</ul>
<p><b>Les 3 artefacts :</b> Product Backlog (liste complète des fonctionnalités), Sprint Backlog (tâches du sprint en cours), Incrément (version livrée).</p>`,freq:`hot`,},
  {id:`p3_agile_3`,proj:`p3`,num:13,category:`Méthodes Agile & Scrum`,thematique:`Agile`,question:`Qu'est-ce qu'une User Story et comment la rédiger ?`,answer:`<p>Une <b>User Story</b> décrit une fonctionnalité du point de vue de l'utilisateur final, en suivant le format :</p>
<p><b>"En tant que [rôle], je veux [action] afin de [bénéfice]."</b></p>
<pre># Exemples de User Stories

"En tant qu'étudiant, je veux filtrer les questions par thématique
 afin de réviser une technologie spécifique."

"En tant qu'administrateur, je veux ajouter une question depuis
 l'interface web afin de ne pas modifier le code source."

# Critères d'acceptation (Definition of Done)
Donné que je suis sur la page quiz,
Quand je sélectionne "Node.js" dans le filtre thématique,
Alors seules les questions Node.js sont affichées.

# Estimation en points de complexité (Fibonacci : 1, 2, 3, 5, 8, 13…)
# Planning Poker : chaque membre vote simultanément</pre>`,freq:`hot`,},
  {id:`p3_http_1`,proj:`p3`,num:14,category:`HTTP & Web`,thematique:`HTTP`,question:`Quels sont les codes de statut HTTP et que signifient-ils ?`,answer:`<p>Les codes HTTP indiquent le résultat d'une requête. Ils sont groupés par centaines :</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>2xx — Succès</b> : <code>200</code> OK, <code>201</code> Créé, <code>204</code> Pas de contenu</li>
  <li><b>3xx — Redirection</b> : <code>301</code> Permanent, <code>302</code> Temporaire, <code>304</code> Non modifié (cache)</li>
  <li><b>4xx — Erreur client</b> : <code>400</code> Mauvaise requête, <code>401</code> Non authentifié, <code>403</code> Interdit, <code>404</code> Non trouvé, <code>422</code> Données invalides, <code>429</code> Trop de requêtes</li>
  <li><b>5xx — Erreur serveur</b> : <code>500</code> Erreur interne, <code>502</code> Bad gateway, <code>503</code> Service indisponible</li>
</ul>
<pre># Dans une API REST — utiliser les bons codes
res.status(201).json({ id: nouvelUtilisateur.id })  // Création réussie
res.status(400).json({ error: 'Email invalide' })    // Données invalides
res.status(401).json({ error: 'Token manquant' })    // Non authentifié
res.status(403).json({ error: 'Accès refusé' })      // Authentifié mais interdit
res.status(404).json({ error: 'Ressource introuvable' })</pre>`,freq:`hot`,},
  {id:`p3_http_2`,proj:`p3`,num:15,category:`HTTP & Web`,thematique:`HTTP`,question:`Quelle est la différence entre les méthodes HTTP GET, POST, PUT, PATCH et DELETE ?`,answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>GET</b> : lire une ressource — sans effet de bord, idempotent, paramètres dans l'URL</li>
  <li><b>POST</b> : créer une ressource — body JSON, non idempotent (deux appels = deux créations)</li>
  <li><b>PUT</b> : remplacer une ressource entière — envoie l'objet complet</li>
  <li><b>PATCH</b> : modifier partiellement une ressource — envoie seulement les champs modifiés</li>
  <li><b>DELETE</b> : supprimer une ressource — idempotent</li>
</ul>
<pre># Exemple API REST d'articles
GET    /api/articles           → Liste tous les articles
GET    /api/articles/42        → Détail de l'article 42
POST   /api/articles           → Créer un article (body: titre, contenu)
PUT    /api/articles/42        → Remplacer l'article 42 entièrement
PATCH  /api/articles/42        → Modifier seulement le titre de l'article 42
DELETE /api/articles/42        → Supprimer l'article 42

# PUT vs PATCH
PUT   { "titre": "Nouveau", "contenu": "...", "auteur": "Alice" }  // Champs complets
PATCH { "titre": "Nouveau" }  // Seulement ce qui change</pre>`,freq:`hot`,},
  {id:`p3_http_3`,proj:`p3`,num:16,category:`HTTP & Web`,thematique:`HTTP`,question:`Qu'est-ce qu'une API REST et quels sont ses principes ?`,answer:`<p>REST (Representational State Transfer) est une architecture pour concevoir des APIs web. Une API REST respecte 6 contraintes :</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Sans état (stateless)</b> : chaque requête contient toutes les informations nécessaires (pas de session serveur)</li>
  <li><b>Interface uniforme</b> : URLs pour les ressources, verbes HTTP pour les actions</li>
  <li><b>Client-serveur</b> : séparation claire front-end / back-end</li>
  <li><b>Cacheable</b> : les réponses indiquent si elles peuvent être mises en cache</li>
  <li><b>Système en couches</b> : proxy, load balancer transparents pour le client</li>
</ul>
<pre># Bonnes pratiques REST
GET  /api/v1/utilisateurs            # Pluriel pour les collections
GET  /api/v1/utilisateurs/42         # Identifiant en chemin
GET  /api/v1/utilisateurs/42/articles # Ressource imbriquée

# Versionnage : /api/v1/ permet d'évoluer sans casser les clients existants
# Format : JSON standard, Content-Type: application/json</pre>`,freq:`hot`,},
  {id:`p3_a11y_1`,proj:`p3`,num:17,category:`Accessibilité web (a11y)`,thematique:`Accessibilité`,question:`Qu'est-ce que l'accessibilité web et pourquoi est-ce obligatoire en France ?`,answer:`<p>L'accessibilité web consiste à rendre les sites utilisables par <b>toutes les personnes</b>, y compris celles en situation de handicap (visuel, moteur, cognitif, auditif).</p>
<p><b>Obligations légales :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li>En France, le <b>RGAA</b> (Référentiel Général d'Amélioration de l'Accessibilité) impose l'accessibilité aux sites publics et grandes entreprises</li>
  <li>Basé sur les normes <b>WCAG 2.1</b> du W3C (4 principes : Perceptible, Utilisable, Compréhensible, Robuste)</li>
  <li>Amendes jusqu'à 20 000€ pour les organismes publics non conformes</li>
</ul>
<p><b>Bénéfices au-delà du handicap :</b> meilleur SEO, meilleure expérience mobile, navigation clavier plus rapide pour tous.</p>`,freq:`hot`,},
  {id:`p3_a11y_2`,proj:`p3`,num:18,category:`Accessibilité web (a11y)`,thematique:`Accessibilité`,question:`Quels sont les critères d'accessibilité HTML à connaître ?`,answer:`<pre>&lt;!-- 1. Attribut alt sur les images --&gt;
&lt;img src="logo.png" alt="Logo DWWM Formation"&gt;
&lt;img src="decoration.png" alt=""&gt; &lt;!-- alt vide si purement décoratif --&gt;

&lt;!-- 2. Labels associés aux champs de formulaire --&gt;
&lt;label for="email-utilisateur"&gt;Adresse email *&lt;/label&gt;
&lt;input type="email" id="email-utilisateur" required
       aria-describedby="email-aide"&gt;
&lt;span id="email-aide"&gt;Format : prenom@domaine.fr&lt;/span&gt;

&lt;!-- 3. Hiérarchie de titres cohérente --&gt;
&lt;h1&gt;Une seule balise h1 par page&lt;/h1&gt;
&lt;h2&gt;Sections principales&lt;/h2&gt;
&lt;h3&gt;Sous-sections (pas de sauts h1 → h3)&lt;/h3&gt;

&lt;!-- 4. Contraste de couleurs (ratio min 4.5:1 pour le texte) --&gt;
&lt;!-- 5. Navigation au clavier (tabIndex, focus visible) --&gt;
&lt;!-- 6. Rôles ARIA quand le HTML sémantique ne suffit pas --&gt;
&lt;button aria-label="Fermer la fenêtre"&gt;✕&lt;/button&gt;
&lt;div role="alert" aria-live="polite"&gt;Fichier enregistré&lt;/div&gt;</pre>`,freq:`hot`,},
  {id:`p3_bdd_1`,proj:`p3`,num:19,category:`Bases de données`,thematique:`Bases de données`,question:`Quelle est la différence entre SQL et NoSQL ?`,answer:`<p><b>SQL (relationnel)</b> : données structurées en tables avec schéma fixe, relations entre tables, langage SQL standardisé. Exemples : PostgreSQL, MySQL, SQLite.</p>
<p><b>NoSQL (non-relationnel)</b> : schéma flexible, adapté aux grandes volumétries et aux données non-structurées. Plusieurs types :</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Document</b> : JSON/BSON (MongoDB, CouchDB)</li>
  <li><b>Clé-valeur</b> : Redis, DynamoDB</li>
  <li><b>Colonne</b> : Cassandra (big data)</li>
  <li><b>Graphe</b> : Neo4j (réseaux sociaux)</li>
</ul>
<p><b>Quand choisir ?</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li>SQL : données structurées, relations complexes, transactions critiques (comptabilité, e-commerce)</li>
  <li>NoSQL : données variables, hautes performances, scalabilité horizontale (logs, catalogue produits, temps réel)</li>
</ul>`,freq:`hot`,},
  {id:`p3_bdd_2`,proj:`p3`,num:20,category:`Bases de données`,thematique:`Bases de données`,question:`Qu'est-ce qu'une transaction SQL et les propriétés ACID ?`,answer:`<p>Une <b>transaction</b> est un ensemble d'opérations SQL qui doivent toutes réussir ou toutes échouer (atomicité).</p>
<p><b>ACID</b> :</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Atomicité</b> : tout ou rien — si une opération échoue, toutes sont annulées</li>
  <li><b>Cohérence</b> : la base reste dans un état valide avant et après</li>
  <li><b>Isolation</b> : les transactions concurrentes ne s'interfèrent pas</li>
  <li><b>Durabilité</b> : une fois validée (<code>COMMIT</code>), la transaction est permanente même en cas de panne</li>
</ul>
<pre># Exemple Python avec better-sqlite3
transaction_virement = db.transaction(lambda: (
    db.prepare("UPDATE comptes SET solde = solde - ? WHERE id = ?").run(100, 1),
    db.prepare("UPDATE comptes SET solde = solde + ? WHERE id = ?").run(100, 2)
))
transaction_virement()  # Si l'une échoue, les deux sont annulées</pre>`,freq:`med`,},
  {id:`p3_tests_1`,proj:`p3`,num:21,category:`Tests logiciels`,thematique:`Tests`,question:`Quelle est la différence entre tests unitaires, tests d'intégration et tests end-to-end ?`,answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Tests unitaires</b> : testent une seule fonction isolée, sans dépendances externes (tout est mocké). Rapides, nombreux.</li>
  <li><b>Tests d'intégration</b> : testent plusieurs composants ensemble (ex: une route Express + la base de données réelle). Vérifient que les parties communiquent correctement.</li>
  <li><b>Tests end-to-end (E2E)</b> : simulent un utilisateur réel dans un vrai navigateur (Cypress, Playwright). Lents mais proches de la réalité.</li>
</ul>
<pre># Pyramide des tests (Martin Fowler)
#          /#         /E2E        ← Peu nombreux, lents, coûteux
#        /------#       /Intégrat.    ← Nombre moyen
#      /------------#     / Unitaires     ← Très nombreux, très rapides
#    /__________________
# Règle : beaucoup de tests unitaires, moins d'intégration, peu d'E2E</pre>`,freq:`hot`,},
  {id:`p3_tests_2`,proj:`p3`,num:22,category:`Tests logiciels`,thematique:`Tests`,question:`Qu'est-ce que le TDD (Test-Driven Development) ?`,answer:`<p>Le <b>TDD</b> consiste à écrire les tests <b>avant</b> le code de production. Le cycle est : Rouge → Vert → Refactoring.</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Rouge</b> : écrire un test qui échoue (la fonctionnalité n'existe pas encore)</li>
  <li><b>Vert</b> : écrire le minimum de code pour que le test passe</li>
  <li><b>Refactoring</b> : améliorer le code sans casser les tests</li>
</ul>
<pre># 1. Rouge — écrire le test d'abord
def test_calculer_tva():
    assert calculer_tva(100, 0.20) == 20.0  # ❌ Échoue car la fonction n'existe pas

# 2. Vert — implémenter le minimum
def calculer_tva(prix_ht: float, taux: float) -> float:
    return prix_ht * taux  # ✅ Test passe

# 3. Refactoring — améliorer
def calculer_tva(prix_ht: float, taux: float) -> float:
    """Calcule la TVA. Args: prix_ht: Prix hors taxes. taux: Taux (ex: 0.20 pour 20%)."""
    if taux < 0 or taux > 1:
        raise ValueError(f"Taux invalide : {taux}")
    return round(prix_ht * taux, 2)</pre>`,freq:`med`,},
  {id:`p3_deploy_1`,proj:`p3`,num:23,category:`Déploiement & DevOps`,thematique:`Déploiement`,question:`Qu'est-ce que CI/CD et pourquoi l'utiliser ?`,answer:`<p><b>CI (Intégration Continue)</b> : à chaque push, les tests s'exécutent automatiquement pour détecter les régressions immédiatement.</p>
<p><b>CD (Déploiement Continu)</b> : si les tests passent, le code est déployé automatiquement en production.</p>
<pre># Exemple GitHub Actions — .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: { node-version: '18' }
      - run: npm install
      - run: npm test          # Lance Jest
      - run: npm run lint      # Vérifie le style du code</pre>
<p><b>Avantages :</b> détection immédiate des bugs, déploiements fréquents et fiables, moins de stress lors des mises en production.</p>`,freq:`med`,},
  {id:`p3_deploy_2`,proj:`p3`,num:24,category:`Déploiement & DevOps`,thematique:`Déploiement`,question:`Qu'est-ce que Docker et pourquoi l'utiliser pour déployer ?`,answer:`<p>Docker est un outil qui <b>empaquète une application et toutes ses dépendances</b> dans un conteneur léger et portable.</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li>Même comportement en dev, staging et production ("ça marche sur ma machine" résolu)</li>
  <li>Isolation : chaque service dans son conteneur</li>
  <li>Déploiement rapide et reproductible</li>
</ul>
<pre># Dockerfile pour une app Node.js
FROM node:18-alpine        # Image de base légère

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev  # Seulement les dépendances de prod

COPY . .
EXPOSE 3001
CMD ["node", "server.js"]

# Construire et lancer
# docker build -t quizz-app .
# docker run -p 3001:3001 --env-file .env quizz-app

# docker-compose.yml — orchestrer plusieurs services
# services:
#   app:  build: .  ports: ["3001:3001"]
#   db:   image: postgres:15</pre>`,freq:`easy`,},
  {id:`p3_secu_1`,proj:`p3`,num:25,category:`Sécurité web`,thematique:`Sécurité`,question:`Quelles sont les 5 attaques web les plus courantes (OWASP Top 10) ?`,answer:`<p>L'<b>OWASP Top 10</b> liste les vulnérabilités web les plus critiques :</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Injection SQL</b> : injecter du SQL malveillant via les inputs — <b>protection : requêtes paramétrées</b></li>
  <li><b>Authentification brisée</b> : mots de passe faibles, tokens prévisibles — <b>protection : bcrypt, JWT, 2FA</b></li>
  <li><b>XSS</b> : injection de JavaScript — <b>protection : échapper les sorties HTML, CSP</b></li>
  <li><b>Contrôle d'accès défaillant</b> : accéder à des ressources non autorisées — <b>protection : vérification des permissions côté serveur</b></li>
  <li><b>Mauvaise configuration de sécurité</b> : DEBUG=True en prod, secrets dans le code — <b>protection : Helmet, variables d'environnement</b></li>
</ul>
<pre># Injection SQL — exemple d'attaque et protection
# ❌ DANGEREUX
query = f"SELECT * FROM users WHERE email = '{email}'"  # email = "' OR '1'='1"

# ✅ PROTÉGÉ
utilisateur = db.prepare("SELECT * FROM users WHERE email = ?").get(email)</pre>`,freq:`hot`,},
  {id:`p3_perf_1`,proj:`p3`,num:26,category:`Performance web`,thematique:`Performance`,question:`Quelles sont les techniques d'optimisation des performances web ?`,answer:`<p>Les performances web impactent directement l'expérience utilisateur et le SEO.</p>
<p><b>Côté réseau :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li>Compression gzip/Brotli des réponses HTTP</li>
  <li>CDN (Content Delivery Network) pour les assets statiques</li>
  <li>HTTP/2 : multiplexage des requêtes</li>
  <li>Cache HTTP (<code>Cache-Control</code>, <code>ETag</code>)</li>
</ul>
<p><b>Côté front-end :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li>Minification CSS/JS, tree-shaking (supprimer le code mort)</li>
  <li>Lazy loading des images (<code>loading="lazy"</code>)</li>
  <li>Formats modernes : WebP pour les images, WOFF2 pour les polices</li>
</ul>
<p><b>Côté base de données :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li>Index sur les colonnes fréquemment filtrées</li>
  <li>Éviter le problème N+1 (charger les relations en une seule requête)</li>
  <li>Mise en cache des requêtes lentes (Redis)</li>
</ul>`,freq:`med`,},
  {id:`p3_archi_1`,proj:`p3`,num:27,category:`Architecture logicielle`,thematique:`Architecture`,question:`Qu'est-ce que le principe SOLID ?`,answer:`<p>SOLID regroupe 5 principes de conception orientée objet pour un code maintenable :</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>S — Single Responsibility</b> : une classe/fonction = une seule responsabilité. <em>(Ex: votre admin.js n'affiche que le tableau admin, votre modal.js gère uniquement le formulaire)</em></li>
  <li><b>O — Open/Closed</b> : ouvert à l'extension, fermé à la modification</li>
  <li><b>L — Liskov Substitution</b> : une sous-classe doit pouvoir remplacer sa classe parente</li>
  <li><b>I — Interface Segregation</b> : préférer plusieurs interfaces spécifiques à une seule générale</li>
  <li><b>D — Dependency Inversion</b> : dépendre des abstractions, pas des implémentations concrètes</li>
</ul>
<p>Le plus appliqué en pratique quotidienne : <b>S (SRP)</b> — chaque module fait une seule chose bien.</p>`,freq:`hot`,},
  {id:`p3_archi_2`,proj:`p3`,num:28,category:`Architecture logicielle`,thematique:`Architecture`,question:`Qu'est-ce que le pattern MVC et comment Django et Express l'implémentent-ils ?`,answer:`<p>MVC (Model-View-Controller) sépare une application en 3 couches :</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Model</b> : données et logique métier (base de données)</li>
  <li><b>View</b> : présentation et interface utilisateur</li>
  <li><b>Controller</b> : reçoit les requêtes, interroge le Model, renvoie la View</li>
</ul>
<pre># Django — pattern MVT (Model-View-Template)
# Model    → models.py     (ORM, structure des données)
# View     → views.py      (logique de traitement = Controller en MVC)
# Template → templates/    (HTML = View en MVC)

# Express — pas de MVC imposé, organisation recommandée
# routes/      → reçoit les requêtes HTTP (Controller)
# controllers/ → logique métier (Controller)
# models/      → accès à la base de données (Model)
# views/       → templates EJS/Pug (View) ou API JSON pure</pre>`,freq:`hot`,},
  {id:`p3_veille_1`,proj:`p3`,num:29,category:`Veille technologique`,thematique:`Veille`,question:`Comment faites-vous votre veille technologique ?`,answer:`<p>La veille technologique est une compétence attendue au DWWM — il faut montrer que vous restez à jour.</p>
<p><b>Sources recommandées :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Documentation officielle</b> : docs.python.org, expressjs.com, socket.io/docs, developer.mozilla.org (MDN)</li>
  <li><b>Newsletters</b> : JavaScript Weekly, Python Weekly, TLDR Tech</li>
  <li><b>Plateformes</b> : Dev.to, Medium, Hashnode, Reddit r/webdev</li>
  <li><b>GitHub</b> : suivre les dépôts des projets utilisés, explorer les releases notes</li>
  <li><b>Podcasts</b> : Syntax.fm, Changelog, Les Cast Codeurs (FR)</li>
  <li><b>Conférences</b> : PyCon, NodeConf, talks YouTube</li>
</ul>
<p><b>Conseil pour l'oral</b> : citez une nouveauté récente que vous avez découverte et ce qu'elle apporte (ex: les f-strings améliorées de Python 3.12, ou les améliorations de performances de Node.js 22).</p>`,freq:`hot`,},
  {id:`p3_veille_2`,proj:`p3`,num:30,category:`Veille technologique`,thematique:`Veille`,question:`Comment présenter et défendre vos choix techniques à l'oral ?`,answer:`<p>Le jury évalue votre capacité à <b>justifier vos décisions</b>, pas seulement à les lister.</p>
<p><b>Structure recommandée pour chaque choix :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Contexte</b> : "Pour ce projet, j'avais besoin de…"</li>
  <li><b>Options considérées</b> : "J'ai évalué X et Y"</li>
  <li><b>Critères de décision</b> : "J'ai choisi X car…"</li>
  <li><b>Limites assumées</b> : "Cette solution a comme inconvénient…"</li>
</ul>
<p><b>Exemples de justifications solides :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li>"J'ai choisi SQLite plutôt que PostgreSQL car l'application tourne en réseau local sans connexion internet — la simplicité d'un seul fichier primait sur la scalabilité."</li>
  <li>"J'ai choisi JWT plutôt que les sessions car l'architecture est stateless, ce qui facilite le déploiement sur plusieurs serveurs."</li>
  <li>"J'ai choisi Socket.io plutôt que des WebSockets natifs pour son fallback automatique en polling et sa gestion des rooms intégrée."</li>
</ul>`,freq:`hot`,},
  {id:`p3_1779640670298`,proj:`p3`,num:0,category:`Data`,thematique:`Vocabulaires`,question:`C'est quoi la sanitisation ?`,answer:`<p>
La sanitisation c'est le fait de nettoyer une donnée entrante avant de l'utiliser, pour qu'elle ne puisse pas faire de dégâts.
</p>`,freq:`med`,},
  {id:`p3_1779641244970`,proj:`p3`,num:0,category:`Data`,thematique:`Vocabulaires`,question:`Streak ?`,answer:`<p>Streak c'est une série consécutive — un enchaînement sans interruption.
Dans le contexte courant
Tu le rencontres surtout dans deux univers :</p>
<p>Les apps de progression (Duolingo, GitHub, habitudes…) — un streak c'est le nombre de jours consécutifs où tu as fait quelque chose. Si tu codes tous les jours pendant 10 jours, tu as un streak de 10. Tu sautes un jour, il tombe à zéro.
</p>
<p>Le sport / jeux — une équipe qui gagne 5 matchs d'affilée est sur un 'winning streak'. Un joueur qui rate plusieurs tirs de suite est sur un 'cold streak (série froide).</p>
<p>L'idée centrale</p>

<p>Ce qui compte c'est la continuité. Pas le total accumulé, mais le fait de ne pas avoir rompu la chaîne. C'est d'ailleurs pourquoi ça motive autant psychologiquement — perdre un streak de 30 jours fait plus mal que de n'avoir jamais commencé.<p>
<p>Ce mot n'a pas de lien direct avec le développement web ou Django, c'est un terme anglais général.</p>`,freq:`easy`,}
];
