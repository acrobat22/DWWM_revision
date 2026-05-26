/**
 * data-p3.js — Questions transversales DWWM.
 *
 * Couvre : Git/GitHub, RGPD, Méthodes Agile/Scrum, HTTP,
 * Accessibilité web, SQL vs NoSQL, Tests, Déploiement.
 */

export const DATA_P3 = [
  // ─── Git & GitHub ──────────────────────────────────────
  {id:"p3_git_1",proj:"p3",num:1,category:"Git & GitHub",thematique:"Git",question:"Qu'est-ce que Git et pourquoi l'utiliser ?",answer:`<p><b>Git</b> est un système de contrôle de version distribué. Il permet de suivre l'historique des modifications d'un projet, de travailler à plusieurs sans écraser le travail des autres, et de revenir à n'importe quelle version précédente.</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Historique</b> : chaque modification est enregistrée avec qui, quand et pourquoi</li>
  <li><b>Branches</b> : développer une fonctionnalité sans toucher au code stable</li>
  <li><b>Collaboration</b> : fusionner le travail de plusieurs développeurs</li>
  <li><b>Sauvegarde</b> : le dépôt distant (GitHub) protège contre la perte locale</li>
</ul>
<pre>git init                    # Initialiser un dépôt local
git clone URL               # Copier un dépôt distant en local
git status                  # État des fichiers modifiés/ajoutés
git log --oneline           # Historique compact des commits</pre>`,freq:"hot"},

  {id:"p3_git_2",proj:"p3",num:2,category:"Git & GitHub",thematique:"Git",question:"Expliquez le cycle de vie d'un commit Git.",answer:`<p>Un fichier passe par 3 zones avant d'être enregistré dans l'historique :</p>
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

git commit --amend          # Modifier le dernier commit (avant push)</pre>`,freq:"hot"},

  {id:"p3_git_3",proj:"p3",num:3,category:"Git & GitHub",thematique:"Git",question:"Qu'est-ce qu'une branche Git et comment gérer le workflow ?",answer:`<pre>git branch                          # Lister les branches locales
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
# feature/* → une branche par fonctionnalité</pre>`,freq:"hot"},

  {id:"p3_git_4",proj:"p3",num:4,category:"Git & GitHub",thematique:"Git",question:"Quelle est la différence entre `merge` et `rebase` ?",answer:`<p>Les deux fusionnent des branches, mais avec des historiques différents.</p>
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
</ul>`,freq:"med"},

  {id:"p3_git_5",proj:"p3",num:5,category:"Git & GitHub",thematique:"Git",question:"Comment résoudre un conflit Git ?",answer:`<p>Un conflit survient quand deux branches modifient la même ligne d'un fichier. Git marque le conflit dans le fichier.</p>
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
git diff            # Voir les différences avant de résoudre</pre>`,freq:"hot"},

  {id:"p3_git_6",proj:"p3",num:6,category:"Git & GitHub",thematique:"Git",question:"Qu'est-ce qu'une Pull Request et pourquoi l'utiliser ?",answer:`<p>Une <b>Pull Request</b> (PR) — ou Merge Request sur GitLab — est une demande de fusion d'une branche vers une autre sur GitHub. Elle permet la <b>revue de code</b> avant d'intégrer les modifications.</p>
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
# Merge via GitHub (merge commit ou squash)</pre>`,freq:"hot"},

  {id:"p3_git_7",proj:"p3",num:7,category:"Git & GitHub",thematique:"Git",question:"Qu'est-ce que `.gitignore` et que faut-il y mettre ?",answer:`<p>Le fichier <code>.gitignore</code> liste les fichiers et dossiers que Git doit ignorer et ne jamais versionner.</p>
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
<p>⚠️ Si un fichier sensible a été committé par erreur, le supprimer de l'historique est complexe — mieux vaut changer les secrets immédiatement et le retirer avec <code>git rm --cached</code>.</p>`,freq:"hot"},

  // ─── RGPD ──────────────────────────────────────────────
  {id:"p3_rgpd_1",proj:"p3",num:8,category:"RGPD & Données personnelles",thematique:"RGPD",question:"Qu'est-ce que le RGPD et quelles sont ses obligations principales ?",answer:`<p>Le <b>RGPD</b> (Règlement Général sur la Protection des Données, entré en vigueur mai 2018) est le cadre légal européen qui réglemente la collecte et le traitement des données personnelles.</p>
<p><b>Les 5 obligations principales :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Licéité</b> : collecter des données uniquement avec une base légale (consentement, contrat, obligation légale…)</li>
  <li><b>Transparence</b> : informer clairement l'utilisateur de ce qu'on collecte et pourquoi</li>
  <li><b>Minimisation</b> : ne collecter que les données strictement nécessaires</li>
  <li><b>Sécurité</b> : protéger les données contre les fuites (chiffrement, accès restreints)</li>
  <li><b>Droits des personnes</b> : accès, rectification, effacement, portabilité, opposition</li>
</ul>
<p>Sanctions : jusqu'à <b>20 millions d'euros ou 4% du CA mondial</b>.</p>`,freq:"hot"},

  {id:"p3_rgpd_2",proj:"p3",num:9,category:"RGPD & Données personnelles",thematique:"RGPD",question:"Qu'est-ce qu'une donnée personnelle ? Donnez des exemples.",answer:`<p>Une <b>donnée personnelle</b> est toute information permettant d'identifier directement ou indirectement une personne physique.</p>
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
</ul>`,freq:"hot"},

  {id:"p3_rgpd_3",proj:"p3",num:10,category:"RGPD & Données personnelles",thematique:"RGPD",question:"Qu'est-ce que le consentement RGPD et comment l'implémenter ?",answer:`<p>Le <b>consentement</b> doit être <b>libre, spécifique, éclairé et non ambigu</b>. Une case pré-cochée n'est pas un consentement valide.</p>
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
        self.save()</pre>`,freq:"med"},

  // ─── Agile & Scrum ─────────────────────────────────────
  {id:"p3_agile_1",proj:"p3",num:11,category:"Méthodes Agile & Scrum",thematique:"Agile",question:"Qu'est-ce que la méthode Agile et en quoi diffère-t-elle de la méthode en cascade ?",answer:`<p><b>Cascade (Waterfall)</b> : étapes séquentielles figées — analyse complète → conception → développement → tests → livraison. Long cycle, peu flexible aux changements.</p>
<p><b>Agile</b> : développement itératif en courtes périodes (sprints). On livre régulièrement des versions fonctionnelles et on s'adapte aux retours.</p>
<p><b>Les 4 valeurs du Manifeste Agile :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li>Les <b>individus et interactions</b> plutôt que les processus et outils</li>
  <li>Un <b>logiciel fonctionnel</b> plutôt qu'une documentation exhaustive</li>
  <li>La <b>collaboration avec le client</b> plutôt que la négociation contractuelle</li>
  <li>L'<b>adaptation au changement</b> plutôt que le suivi d'un plan</li>
</ul>`,freq:"hot"},

  {id:"p3_agile_2",proj:"p3",num:12,category:"Méthodes Agile & Scrum",thematique:"Agile",question:"Expliquez le framework Scrum : rôles, cérémonies et artefacts.",answer:`<p><b>Les 3 rôles :</b></p>
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
<p><b>Les 3 artefacts :</b> Product Backlog (liste complète des fonctionnalités), Sprint Backlog (tâches du sprint en cours), Incrément (version livrée).</p>`,freq:"hot"},

  {id:"p3_agile_3",proj:"p3",num:13,category:"Méthodes Agile & Scrum",thematique:"Agile",question:"Qu'est-ce qu'une User Story et comment la rédiger ?",answer:`<p>Une <b>User Story</b> décrit une fonctionnalité du point de vue de l'utilisateur final, en suivant le format :</p>
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
# Planning Poker : chaque membre vote simultanément</pre>`,freq:"hot"},

  // ─── HTTP ───────────────────────────────────────────────
  {id:"p3_http_1",proj:"p3",num:14,category:"HTTP & Web",thematique:"HTTP",question:"Quels sont les codes de statut HTTP et que signifient-ils ?",answer:`<p>Les codes HTTP indiquent le résultat d'une requête. Ils sont groupés par centaines :</p>
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
res.status(404).json({ error: 'Ressource introuvable' })</pre>`,freq:"hot"},

  {id:"p3_http_2",proj:"p3",num:15,category:"HTTP & Web",thematique:"HTTP",question:"Quelle est la différence entre les méthodes HTTP GET, POST, PUT, PATCH et DELETE ?",answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
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
PATCH { "titre": "Nouveau" }  // Seulement ce qui change</pre>`,freq:"hot"},

  {id:"p3_http_3",proj:"p3",num:16,category:"HTTP & Web",thematique:"HTTP",question:"Qu'est-ce qu'une API REST et quels sont ses principes ?",answer:`<p>REST (Representational State Transfer) est une architecture pour concevoir des APIs web. Une API REST respecte 6 contraintes :</p>
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
# Format : JSON standard, Content-Type: application/json</pre>`,freq:"hot"},

  // ─── Accessibilité ──────────────────────────────────────
  {id:"p3_a11y_1",proj:"p3",num:17,category:"Accessibilité web (a11y)",thematique:"Accessibilité",question:"Qu'est-ce que l'accessibilité web et pourquoi est-ce obligatoire en France ?",answer:`<p>L'accessibilité web consiste à rendre les sites utilisables par <b>toutes les personnes</b>, y compris celles en situation de handicap (visuel, moteur, cognitif, auditif).</p>
<p><b>Obligations légales :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li>En France, le <b>RGAA</b> (Référentiel Général d'Amélioration de l'Accessibilité) impose l'accessibilité aux sites publics et grandes entreprises</li>
  <li>Basé sur les normes <b>WCAG 2.1</b> du W3C (4 principes : Perceptible, Utilisable, Compréhensible, Robuste)</li>
  <li>Amendes jusqu'à 20 000€ pour les organismes publics non conformes</li>
</ul>
<p><b>Bénéfices au-delà du handicap :</b> meilleur SEO, meilleure expérience mobile, navigation clavier plus rapide pour tous.</p>`,freq:"hot"},

  {id:"p3_a11y_2",proj:"p3",num:18,category:"Accessibilité web (a11y)",thematique:"Accessibilité",question:"Quels sont les critères d'accessibilité HTML à connaître ?",answer:`<pre>&lt;!-- 1. Attribut alt sur les images --&gt;
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
&lt;div role="alert" aria-live="polite"&gt;Fichier enregistré&lt;/div&gt;</pre>`,freq:"hot"},

  // ─── SQL vs NoSQL ───────────────────────────────────────
  {id:"p3_bdd_1",proj:"p3",num:19,category:"Bases de données",thematique:"Bases de données",question:"Quelle est la différence entre SQL et NoSQL ?",answer:`<p><b>SQL (relationnel)</b> : données structurées en tables avec schéma fixe, relations entre tables, langage SQL standardisé. Exemples : PostgreSQL, MySQL, SQLite.</p>
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
</ul>`,freq:"hot"},

  {id:"p3_bdd_2",proj:"p3",num:20,category:"Bases de données",thematique:"Bases de données",question:"Qu'est-ce qu'une transaction SQL et les propriétés ACID ?",answer:`<p>Une <b>transaction</b> est un ensemble d'opérations SQL qui doivent toutes réussir ou toutes échouer (atomicité).</p>
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
transaction_virement()  # Si l'une échoue, les deux sont annulées</pre>`,freq:"med"},

  // ─── Tests ─────────────────────────────────────────────
  {id:"p3_tests_1",proj:"p3",num:21,category:"Tests logiciels",thematique:"Tests",question:"Quelle est la différence entre tests unitaires, tests d'intégration et tests end-to-end ?",answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Tests unitaires</b> : testent une seule fonction isolée, sans dépendances externes (tout est mocké). Rapides, nombreux.</li>
  <li><b>Tests d'intégration</b> : testent plusieurs composants ensemble (ex: une route Express + la base de données réelle). Vérifient que les parties communiquent correctement.</li>
  <li><b>Tests end-to-end (E2E)</b> : simulent un utilisateur réel dans un vrai navigateur (Cypress, Playwright). Lents mais proches de la réalité.</li>
</ul>
<pre># Pyramide des tests (Martin Fowler)
#          /\
#         /E2E\        ← Peu nombreux, lents, coûteux
#        /------\
#       /Intégrat.\    ← Nombre moyen
#      /------------\
#     / Unitaires    \ ← Très nombreux, très rapides
#    /__________________\

# Règle : beaucoup de tests unitaires, moins d'intégration, peu d'E2E</pre>`,freq:"hot"},

  {id:"p3_tests_2",proj:"p3",num:22,category:"Tests logiciels",thematique:"Tests",question:"Qu'est-ce que le TDD (Test-Driven Development) ?",answer:`<p>Le <b>TDD</b> consiste à écrire les tests <b>avant</b> le code de production. Le cycle est : Rouge → Vert → Refactoring.</p>
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
    return round(prix_ht * taux, 2)</pre>`,freq:"med"},

  // ─── Déploiement ────────────────────────────────────────
  {id:"p3_deploy_1",proj:"p3",num:23,category:"Déploiement & DevOps",thematique:"Déploiement",question:"Qu'est-ce que CI/CD et pourquoi l'utiliser ?",answer:`<p><b>CI (Intégration Continue)</b> : à chaque push, les tests s'exécutent automatiquement pour détecter les régressions immédiatement.</p>
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
<p><b>Avantages :</b> détection immédiate des bugs, déploiements fréquents et fiables, moins de stress lors des mises en production.</p>`,freq:"med"},

  {id:"p3_deploy_2",proj:"p3",num:24,category:"Déploiement & DevOps",thematique:"Déploiement",question:"Qu'est-ce que Docker et pourquoi l'utiliser pour déployer ?",answer:`<p>Docker est un outil qui <b>empaquète une application et toutes ses dépendances</b> dans un conteneur léger et portable.</p>
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
#   db:   image: postgres:15</pre>`,freq:"easy"},

  // ─── Sécurité générale ──────────────────────────────────
  {id:"p3_secu_1",proj:"p3",num:25,category:"Sécurité web",thematique:"Sécurité",question:"Quelles sont les 5 attaques web les plus courantes (OWASP Top 10) ?",answer:`<p>L'<b>OWASP Top 10</b> liste les vulnérabilités web les plus critiques :</p>
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
utilisateur = db.prepare("SELECT * FROM users WHERE email = ?").get(email)</pre>`,freq:"hot"},

  // ─── Performance web ────────────────────────────────────
  {id:"p3_perf_1",proj:"p3",num:26,category:"Performance web",thematique:"Performance",question:"Quelles sont les techniques d'optimisation des performances web ?",answer:`<p>Les performances web impactent directement l'expérience utilisateur et le SEO.</p>
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
</ul>`,freq:"med"},

  // ─── Architecture ───────────────────────────────────────
  {id:"p3_archi_1",proj:"p3",num:27,category:"Architecture logicielle",thematique:"Architecture",question:"Qu'est-ce que le principe SOLID ?",answer:`<p>SOLID regroupe 5 principes de conception orientée objet pour un code maintenable :</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>S — Single Responsibility</b> : une classe/fonction = une seule responsabilité. <em>(Ex: votre admin.js n'affiche que le tableau admin, votre modal.js gère uniquement le formulaire)</em></li>
  <li><b>O — Open/Closed</b> : ouvert à l'extension, fermé à la modification</li>
  <li><b>L — Liskov Substitution</b> : une sous-classe doit pouvoir remplacer sa classe parente</li>
  <li><b>I — Interface Segregation</b> : préférer plusieurs interfaces spécifiques à une seule générale</li>
  <li><b>D — Dependency Inversion</b> : dépendre des abstractions, pas des implémentations concrètes</li>
</ul>
<p>Le plus appliqué en pratique quotidienne : <b>S (SRP)</b> — chaque module fait une seule chose bien.</p>`,freq:"hot"},

  {id:"p3_archi_2",proj:"p3",num:28,category:"Architecture logicielle",thematique:"Architecture",question:"Qu'est-ce que le pattern MVC et comment Django et Express l'implémentent-ils ?",answer:`<p>MVC (Model-View-Controller) sépare une application en 3 couches :</p>
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
# views/       → templates EJS/Pug (View) ou API JSON pure</pre>`,freq:"hot"},

  // ─── Veille technologique ──────────────────────────────
  {id:"p3_veille_1",proj:"p3",num:29,category:"Veille technologique",thematique:"Veille",question:"Comment faites-vous votre veille technologique ?",answer:`<p>La veille technologique est une compétence attendue au DWWM — il faut montrer que vous restez à jour.</p>
<p><b>Sources recommandées :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Documentation officielle</b> : docs.python.org, expressjs.com, socket.io/docs, developer.mozilla.org (MDN)</li>
  <li><b>Newsletters</b> : JavaScript Weekly, Python Weekly, TLDR Tech</li>
  <li><b>Plateformes</b> : Dev.to, Medium, Hashnode, Reddit r/webdev</li>
  <li><b>GitHub</b> : suivre les dépôts des projets utilisés, explorer les releases notes</li>
  <li><b>Podcasts</b> : Syntax.fm, Changelog, Les Cast Codeurs (FR)</li>
  <li><b>Conférences</b> : PyCon, NodeConf, talks YouTube</li>
</ul>
<p><b>Conseil pour l'oral</b> : citez une nouveauté récente que vous avez découverte et ce qu'elle apporte (ex: les f-strings améliorées de Python 3.12, ou les améliorations de performances de Node.js 22).</p>`,freq:"hot"},

  {id:"p3_veille_2",proj:"p3",num:30,category:"Veille technologique",thematique:"Veille",question:"Comment présenter et défendre vos choix techniques à l'oral ?",answer:`<p>Le jury évalue votre capacité à <b>justifier vos décisions</b>, pas seulement à les lister.</p>
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
</ul>`,freq:"hot"},
{id:"p3_secu_owasp_0",proj:"p3",num:31,category:"Sécurité",thematique:"OWASP",question:`Qu'est-ce que l'OWASP ?`,answer:`<p>L'<b>OWASP</b> (Open Worldwide Application Security Project) est une fondation à but non lucratif qui publie tous les 3-4 ans le classement des vulnérabilités les plus dangereuses pour les applications web. C'est la référence mondiale en cybersécurité web.</p><p>Son document phare, l'<b>OWASP Top 10</b>, liste les 10 risques les plus critiques (dernière édition : 2021). Il sert de base à la plupart des audits de sécurité et des certifications (PCI-DSS, ISO 27001…). L'OWASP produit aussi des guides pratiques, des outils de test (OWASP ZAP) et des checklists — tout est gratuit et open source.</p>`,freq:"hot"},
  {id:"p3_secu_owasp_1",proj:"p3",num:32,category:"Sécurité",thematique:"OWASP",question:`A01 — Contrôle d'accès défaillant : qu'est-ce que c'est et comment s'en protéger ?`,answer:`<p><span style="background:#FCEBEB;color:#A32D2D;padding:2px 8px;border-radius:4px;font-weight:600;font-size:12px">Critique</span> &nbsp; <span style="background:#E6F1FB;color:#185FA5;padding:2px 8px;border-radius:4px;font-size:12px">A01 / 10</span></p><p>Un utilisateur accède à des données ou actions non autorisées. Exemple : un agent "Consultation" qui appelle directement <code>/admin/delete/</code>.</p><p><b>Protection :</b> vérifier les droits côté serveur à chaque requête. Dans le projet : <code>PermissionMixin</code> bloque <code>has_delete_permission</code> pour tous, filtrage QuerySet par structure.</p>`,freq:"hot"},
  {id:"p3_secu_owasp_2",proj:"p3",num:33,category:"Sécurité",thematique:"OWASP",question:`A02 — Défaillances cryptographiques : qu'est-ce que c'est et comment s'en protéger ?`,answer:`<p><span style="background:#FCEBEB;color:#A32D2D;padding:2px 8px;border-radius:4px;font-weight:600;font-size:12px">Critique</span> &nbsp; <span style="background:#E6F1FB;color:#185FA5;padding:2px 8px;border-radius:4px;font-size:12px">A02 / 10</span></p><p>Données sensibles transmises ou stockées sans chiffrement. Exemple : mot de passe en clair en BDD.</p><p><b>Protection :</b> bcrypt/PBKDF2 pour les mots de passe, HTTPS en transit, secrets dans <code>.env</code>. Dans le projet : <code>SESSION_COOKIE_SECURE</code>, <code>CSRF_COOKIE_SECURE</code>, mots de passe Django en PBKDF2 SHA-256, bcrypt (Projet 2).</p>`,freq:"hot"},
  {id:"p3_secu_owasp_3",proj:"p3",num:34,category:"Sécurité",thematique:"OWASP",question:`A03 — Injection SQL : qu'est-ce que c'est et comment s'en protéger ?`,answer:`<p><span style="background:#FCEBEB;color:#A32D2D;padding:2px 8px;border-radius:4px;font-weight:600;font-size:12px">Critique</span> &nbsp; <span style="background:#E6F1FB;color:#185FA5;padding:2px 8px;border-radius:4px;font-size:12px">A03 / 10</span></p><p>Code malveillant injecté via les entrées. Exemple : <code>' OR '1'='1</code> dans un champ pour accéder à toute la BDD.</p><p><b>Protection :</b> requêtes paramétrées ou ORM — jamais de concaténation SQL. Dans le projet : ORM Django 100% (Projet 1), toutes requêtes <code>better-sqlite3</code> préparées dans <code>src/db/statements.js</code> (Projet 2).</p><pre>// ❌ db.exec(\`SELECT * FROM q WHERE cat = '\${req.body.cat}'\`);
// ✅ db.prepare('SELECT * FROM q WHERE cat = ?').all(req.body.cat);</pre>`,freq:"hot"},
  {id:"p3_secu_owasp_4",proj:"p3",num:35,category:"Sécurité",thematique:"OWASP",question:`A04 — Conception non sécurisée : qu'est-ce que c'est et comment s'en protéger ?`,answer:`<p><span style="background:#FAEEDA;color:#854F0B;padding:2px 8px;border-radius:4px;font-weight:600;font-size:12px">Élevé</span> &nbsp; <span style="background:#E6F1FB;color:#185FA5;padding:2px 8px;border-radius:4px;font-size:12px">A04 / 10</span></p><p>Failles intégrées dès la conception. Exemple : formulaire de connexion sans limite de tentatives → brute-force possible.</p><p><b>Protection :</b> modéliser les menaces dès le début, principe du moindre privilège. Dans le projet : session unique par compte, expiration 5 min, deux profils (superuser / consultation), rate limiting sur la route login (Projet 2).</p>`,freq:"hot"},
  {id:"p3_secu_owasp_5",proj:"p3",num:36,category:"Sécurité",thematique:"OWASP",question:`A05 — Mauvaise configuration de sécurité : qu'est-ce que c'est et comment s'en protéger ?`,answer:`<p><span style="background:#FAEEDA;color:#854F0B;padding:2px 8px;border-radius:4px;font-weight:600;font-size:12px">Élevé</span> &nbsp; <span style="background:#E6F1FB;color:#185FA5;padding:2px 8px;border-radius:4px;font-size:12px">A05 / 10</span></p><p>Paramètres dangereux laissés par défaut. Exemple : <code>DEBUG=True</code> en production expose la stack trace et les variables d'environnement.</p><p><b>Protection :</b> désactiver DEBUG en prod, configurer les headers de sécurité. Dans le projet : <code>SECURE_SSL_REDIRECT</code>, <code>X-Frame-Options: DENY</code>, Helmet.js (Projet 2), tous les secrets dans <code>.env</code>.</p>`,freq:"hot"},
  {id:"p3_secu_owasp_6",proj:"p3",num:37,category:"Sécurité",thematique:"OWASP",question:`A06 — Composants vulnérables et obsolètes : qu'est-ce que c'est et comment s'en protéger ?`,answer:`<p><span style="background:#FAEEDA;color:#854F0B;padding:2px 8px;border-radius:4px;font-weight:600;font-size:12px">Élevé</span> &nbsp; <span style="background:#E6F1FB;color:#185FA5;padding:2px 8px;border-radius:4px;font-size:12px">A06 / 10</span></p><p>Dépendances avec des failles connues. Exemple : version Django non patchée avec une CVE publiée.</p><p><b>Protection :</b> surveiller les CVE, mettre à jour régulièrement, utiliser <code>safety check</code> (Python) ou <code>npm audit</code> (Node). Dans le projet : veille via mailing-list <code>django-security</code>, <code>requirements.txt</code> et <code>package-lock.json</code> versionnés.</p>`,freq:"hot"},
  {id:"p3_secu_owasp_7",proj:"p3",num:38,category:"Sécurité",thematique:"OWASP",question:`A07 — Échecs d'identification et d'authentification : qu'est-ce que c'est et comment s'en protéger ?`,answer:`<p><span style="background:#FCEBEB;color:#A32D2D;padding:2px 8px;border-radius:4px;font-weight:600;font-size:12px">Critique</span> &nbsp; <span style="background:#E6F1FB;color:#185FA5;padding:2px 8px;border-radius:4px;font-size:12px">A07 / 10</span></p><p>Failles permettant d'usurper l'identité ou de détourner une session. Exemple : deux personnes connectées avec le même compte simultanément.</p><p><b>Protection :</b> session unique par compte, expiration automatique, cookie HttpOnly + Secure. Dans le projet : <code>UniqueSessionMiddleware</code>, <code>SESSION_COOKIE_AGE=300s</code>, <code>SESSION_EXPIRE_AT_BROWSER_CLOSE=True</code>, HTTPS en production.</p>`,freq:"hot"},
  {id:"p3_secu_owasp_8",proj:"p3",num:39,category:"Sécurité",thematique:"OWASP",question:`A08 — Défaillances logicielles et d'intégrité : qu'est-ce que c'est et comment s'en protéger ?`,answer:`<p><span style="background:#FAEEDA;color:#854F0B;padding:2px 8px;border-radius:4px;font-weight:600;font-size:12px">Élevé</span> &nbsp; <span style="background:#E6F1FB;color:#185FA5;padding:2px 8px;border-radius:4px;font-size:12px">A08 / 10</span></p><p>Mises à jour ou pipelines CI/CD non vérifiés pouvant introduire du code malveillant. Exemple : package npm compromis dans la chaîne de dépendances.</p><p><b>Protection :</b> vérifier les signatures des paquets, utiliser un lock file. Dans le projet : <code>requirements.txt</code> versionné, <code>package-lock.json</code>, script <code>deploy.sh</code> qui vérifie chaque étape avant d'appliquer.</p>`,freq:"med"},
  {id:"p3_secu_owasp_9",proj:"p3",num:40,category:"Sécurité",thematique:"OWASP",question:`A09 — Lacunes dans la journalisation et la surveillance : qu'est-ce que c'est et comment s'en protéger ?`,answer:`<p><span style="background:#FAEEDA;color:#854F0B;padding:2px 8px;border-radius:4px;font-weight:600;font-size:12px">Élevé</span> &nbsp; <span style="background:#E6F1FB;color:#185FA5;padding:2px 8px;border-radius:4px;font-size:12px">A09 / 10</span></p><p>Sans logs ni alertes, une attaque passe inaperçue. Exemple : 10 000 tentatives de connexion sans qu'aucune alerte soit levée.</p><p><b>Protection :</b> journaliser connexions, erreurs 403/500, configurer des alertes. Dans le projet : <code>GAME_LOG=1</code> avec rotation quotidienne (Projet 2), logs Gunicorn/Nginx, <code>journalctl -u quizz</code> via systemd.</p>`,freq:"med"},
  {id:"p3_secu_owasp_10",proj:"p3",num:41,category:"Sécurité",thematique:"OWASP",question:`A10 — Falsification de requête côté serveur (SSRF) : qu'est-ce que c'est et comment s'en protéger ?`,answer:`<p><span style="background:#FAEEDA;color:#854F0B;padding:2px 8px;border-radius:4px;font-weight:600;font-size:12px">Élevé</span> &nbsp; <span style="background:#E6F1FB;color:#185FA5;padding:2px 8px;border-radius:4px;font-size:12px">A10 / 10</span></p><p>Le serveur est trompé pour requêter des ressources internes. Exemple : champ "URL d'image" non filtré permettant d'appeler <code>http://169.254.169.254</code> (métadonnées cloud).</p><p><b>Protection :</b> valider et filtrer toutes les URL entrantes, bloquer les IP privées. Dans le projet : <code>validate_file_type()</code> valide extension ET type MIME — jamais de fetch d'URL externe non vérifiée.</p>`,freq:"easy"},
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
<p>Ce mot n'a pas de lien direct avec le développement web ou Django, c'est un terme anglais général.</p>`,freq:`easy`,},

  // ══════════════════════════════════════════════════════════════════
  //  NOUVELLES QUESTIONS — Ajoutées d'après le RE DWWM TP-01280 v04
  //  Thèmes identifiés comme sous-représentés dans les fichiers data :
  //    - Maquettage & UX (critères RE : enchainement maquettes, charte)
  //    - Accessibilité RGAA (critère RE : "législation relative à l'accessibilité")
  //    - Environnement de travail (critère RE évalué via QCM et entretien)
  //    - Déploiement documenté (critère RE : scripts, procédure, DevOps)
  //    - Éco-conception (critère RE explicite sur les interfaces statiques)
  //    - SEO (critère RE : "Le site est visible sur les moteurs de recherche")
  // ══════════════════════════════════════════════════════════════════

  // ─── Maquettage & UX ──────────────────────────────────────────────

  {id:"p3_ux_1",proj:"p3",num:44,category:"Maquettage & UX",thematique:"UX",
  question:"Quelle est la différence entre wireframe, maquette et prototype ?",
  answer:`<p>Ces trois livrables correspondent à des niveaux de fidélité croissants dans la conception d'interface :</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Wireframe (basse fidélité)</b> : schéma en niveaux de gris, sans couleurs ni images. Pose la structure (disposition des blocs, navigation). Outil : papier, Balsamiq.</li>
  <li><b>Maquette (haute fidélité)</b> : représentation visuelle finale avec couleurs, typographie, images. Ne clique pas. Outil : Figma, Adobe XD.</li>
  <li><b>Prototype interactif</b> : maquette cliquable qui simule la navigation. Permet de tester l'UX avant de coder. Outil : Figma (mode prototype).</li>
</ul>
<p><b>Conseil DWWM :</b> le RE demande de présenter les maquettes <em>et</em> un schéma de l'enchaînement des maquettes (user flow). Ce schéma montre comment l'utilisateur navigue d'un écran à l'autre.</p>
<p><b>Critère RE :</b> "L'enchainement des maquettes est formalisé par un schéma."</p>`,freq:"hot"},

  {id:"p3_ux_2",proj:"p3",num:45,category:"Maquettage & UX",thematique:"UX",
  question:"Qu'est-ce que le Responsive Design et comment l'implémenter ?",
  answer:`<p>Le Responsive Design adapte l'interface à la taille et au type d'écran (mobile, tablette, desktop).</p>
<p><b>Techniques clés :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Viewport meta tag</b> : indispensable sur mobile</li>
  <li><b>Media queries CSS</b> : règles conditionnelles selon la largeur d'écran</li>
  <li><b>Flexbox / Grid</b> : mise en page fluide</li>
  <li><b>Unités relatives</b> : <code>%</code>, <code>rem</code>, <code>vw/vh</code> plutôt que <code>px</code> fixes</li>
</ul>
<pre>&lt;!-- Balise obligatoire dans &lt;head&gt; --&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;

/* Mobile-first : on part du plus petit écran */
.container { padding: 16px; }               /* mobile : défaut */

@media (min-width: 768px) {                  /* tablette ≥ 768px */
  .container { padding: 24px; }
}

@media (min-width: 1200px) {                 /* desktop ≥ 1200px */
  .container { max-width: 1140px; margin: 0 auto; }
}</pre>
<p><b>Critère RE :</b> "L'interface s'adapte au type d'utilisation de l'application, y compris pour les équipements mobiles."</p>`,freq:"hot"},

  {id:"p3_ux_3",proj:"p3",num:46,category:"Maquettage & UX",thematique:"UX",
  question:"Qu'est-ce qu'une charte graphique et pourquoi la respecter dans un projet web ?",
  answer:`<p>Une <b>charte graphique</b> est un ensemble de règles visuelles qui définissent l'identité d'une entreprise ou d'un produit.</p>
<p><b>Elle comprend généralement :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Palette de couleurs</b> : couleurs primaires, secondaires, neutres (ex: rouge #e35336, rouge foncé #c94420)</li>
  <li><b>Typographie</b> : polices autorisées, tailles, graisses</li>
  <li><b>Espacement</b> : marges, padding, grille de mise en page</li>
  <li><b>Composants</b> : style des boutons, formulaires, cartes</li>
  <li><b>Logo</b> : zones de protection, versions autorisées</li>
</ul>
<p>Respecter la charte = cohérence visuelle, reconnaissance de marque, professionnalisme.</p>
<p><b>Critère RE :</b> "La charte graphique de l'entreprise est respectée."</p>`,freq:"hot"},

  // ─── Accessibilité web (RGAA) ─────────────────────────────────────

  {id:"p3_a11y_rgaa_1",proj:"p3",num:47,category:"Accessibilité web (a11y)",thematique:"RGAA",
  question:"Qu'est-ce que le RGAA et pourquoi est-il obligatoire ?",
  answer:`<p>Le <b>RGAA</b> (Référentiel Général d'Amélioration de l'Accessibilité) est le cadre légal français qui impose l'accessibilité numérique.</p>
<p><b>Cadre légal :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Obligatoire pour :</b> administrations publiques, services publics, entreprises > 250M€ de CA</li>
  <li><b>Directive européenne</b> 2016/2102 (sites publics) + <b>European Accessibility Act</b> (2025, secteur privé)</li>
  <li><b>RGAA version actuelle</b> : 4.1 (2021) — basé sur les WCAG 2.1 du W3C</li>
</ul>
<p><b>Les 4 principes WCAG (POUR) :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>P</b>erceptible — toute info doit être perçue par au moins un sens</li>
  <li><b>O</b>pérable — toute interaction doit être réalisable (clavier, souris, vocal)</li>
  <li><b>U</b>tilisable — contenu lisible et prévisible</li>
  <li><b>R</b>obuste — compatible avec les technologies d'assistance (lecteurs d'écran)</li>
</ul>
<p><b>Critère RE :</b> "La règlementation en vigueur est respectée, y compris celle relative à l'accessibilité."</p>`,freq:"hot"},

  {id:"p3_a11y_rgaa_2",proj:"p3",num:48,category:"Accessibilité web (a11y)",thematique:"RGAA",
  question:"Quelles sont les règles d'accessibilité HTML les plus importantes à appliquer ?",
  answer:`<p>Les règles essentielles pour une interface accessible :</p>
<pre>&lt;!-- 1. Texte alternatif pour les images --&gt;
&lt;img src="logo.png" alt="Logo de l'entreprise ACME"&gt;
&lt;img src="decoration.png" alt=""&gt;  &lt;!-- alt vide si purement décoratif --&gt;

&lt;!-- 2. Labels associés aux champs de formulaire --&gt;
&lt;label for="email"&gt;Adresse e-mail *&lt;/label&gt;
&lt;input type="email" id="email" name="email" required
       aria-describedby="email-hint"&gt;
&lt;p id="email-hint"&gt;Format : prenom@domaine.fr&lt;/p&gt;

&lt;!-- 3. Boutons avec texte explicite (pas juste une icône) --&gt;
&lt;button aria-label="Fermer la fenêtre"&gt;✕&lt;/button&gt;

&lt;!-- 4. Structure sémantique (pas de div pour tout) --&gt;
&lt;nav aria-label="Menu principal"&gt;...&lt;/nav&gt;
&lt;main&gt;...&lt;/main&gt;
&lt;footer&gt;...&lt;/footer&gt;

&lt;!-- 5. Contraste suffisant : ratio minimum 4.5:1 (WCAG AA) --&gt;
&lt;!-- Tester : https://webaim.org/resources/contrastchecker/ --&gt;</pre>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li>Navigation au clavier complète (Tab, Entrée, Échap)</li>
  <li>Focus visible sur tous les éléments interactifs</li>
  <li>Titre de page unique et descriptif</li>
</ul>`,freq:"hot"},

  // ─── Environnement de travail ──────────────────────────────────────

  {id:"p3_env_1",proj:"p3",num:49,category:"Environnement de travail",thematique:"Outils",
  question:"Qu'est-ce qu'un environnement virtuel Python et pourquoi en utiliser un ?",
  answer:`<p>Un <b>environnement virtuel</b> (venv) est un dossier isolé qui contient sa propre installation Python et ses propres paquets, indépendants du système global.</p>
<p><b>Problème résolu :</b> sans venv, tous les projets partagent les mêmes paquets — Projet A nécessite Django 3.2, Projet B nécessite Django 4.2 → conflit.</p>
<pre># Créer un environnement virtuel
python -m venv venv                  # Crée le dossier venv/

# Activer (obligatoire avant d'installer ou d'exécuter)
source venv/bin/activate             # Linux / macOS
venv\\Scripts\\activate               # Windows PowerShell

# Vérifier : le prompt change
(venv) $ pip install django          # Installé uniquement dans venv/

# Sauvegarder les dépendances
pip freeze > requirements.txt

# Désactiver
deactivate</pre>
<p>⚠️ Le dossier <code>venv/</code> doit être dans <code>.gitignore</code> — il est régénérable.</p>
<p><b>Critère RE :</b> "Les outils de développement nécessaires sont installés et configurés."</p>`,freq:"hot"},

  {id:"p3_env_2",proj:"p3",num:50,category:"Environnement de travail",thematique:"Outils",
  question:"Qu'est-ce qu'un linter et pourquoi l'utiliser dans un projet web ?",
  answer:`<p>Un <b>linter</b> est un outil d'analyse statique du code qui détecte les erreurs, les mauvaises pratiques et les violations de style <em>avant</em> l'exécution.</p>
<p><b>Avantages :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li>Détecte les bugs potentiels (variables non déclarées, imports inutilisés…)</li>
  <li>Assure la cohérence du style dans une équipe</li>
  <li>Accélère les revues de code</li>
</ul>
<pre># Python — flake8 ou pylint
pip install flake8
flake8 monapp/                # Analyse tous les fichiers .py

# JavaScript / Node.js — ESLint
npm install --save-dev eslint
npx eslint src/               # Analyse le dossier src/

# Intégration VS Code : extensions ESLint et Pylance
# → souligne les erreurs en temps réel dans l'éditeur

# Intégration CI/CD : bloquer un merge si le linter échoue</pre>
<p><b>Critère RE :</b> "Les règles de nommage sont conformes aux normes de qualité de l'entreprise."</p>`,freq:"med"},

  // ─── Déploiement documenté ────────────────────────────────────────

  {id:"p3_deploy_doc_1",proj:"p3",num:51,category:"Déploiement & DevOps",thematique:"Déploiement",
  question:"Comment documenter le déploiement d'une application web selon le RE DWWM ?",
  answer:`<p>Le RE impose de rédiger une <b>procédure de déploiement</b> complète. Voici ce qu'elle doit contenir :</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Prérequis</b> : OS cible, versions (Python, Node, Nginx…), droits serveur</li>
  <li><b>Variables d'environnement</b> : liste de toutes les clés .env nécessaires</li>
  <li><b>Étapes pas à pas</b> : commandes ordonnées, commentées</li>
  <li><b>Scripts de déploiement</b> : fichier bash ou Makefile qui automatise</li>
  <li><b>Vérification</b> : comment tester que le déploiement a réussi</li>
  <li><b>Rollback</b> : comment revenir à la version précédente en cas d'erreur</li>
</ul>
<pre>#!/bin/bash
# deploy.sh — Script de déploiement de l'application
set -e  # Arrête le script à la première erreur

echo "=== 1. Récupération du code ==="
git pull origin main

echo "=== 2. Dépendances ==="
pip install -r requirements.txt --quiet

echo "=== 3. Migrations ==="
python manage.py migrate --noinput

echo "=== 4. Fichiers statiques ==="
python manage.py collectstatic --noinput

echo "=== 5. Redémarrage du service ==="
sudo systemctl restart gunicorn

echo "✅ Déploiement terminé"</pre>
<p><b>Critère RE :</b> "La procédure de déploiement est rédigée ou mise à jour. Les scripts de déploiement sont écrits et documentés."</p>`,freq:"hot"},

  {id:"p3_deploy_doc_2",proj:"p3",num:52,category:"Déploiement & DevOps",thematique:"CI/CD",
  question:"Qu'est-ce que le CI/CD et comment s'inscrit-il dans une démarche DevOps ?",
  answer:`<p><b>CI/CD</b> = Intégration Continue / Déploiement Continu.</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>CI (Continuous Integration)</b> : à chaque push, un pipeline automatique exécute les tests, le linter, les audits de sécurité. Si tout passe → le code est validé.</li>
  <li><b>CD (Continuous Deployment)</b> : si la CI réussit, le code est automatiquement déployé en production (ou staging).</li>
</ul>
<p><b>Outils courants :</b> GitHub Actions, GitLab CI, Jenkins.</p>
<pre># .github/workflows/ci.yml — Pipeline GitHub Actions
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Python dependencies
        run: pip install -r requirements.txt

      - name: Run linter
        run: flake8 myapp/

      - name: Run tests
        run: python manage.py test

      - name: Security audit
        run: safety check</pre>
<p><b>Critère RE :</b> "Le système de veille permet de suivre les évolutions technologiques et les problématiques de sécurité liées au déploiement, y compris dans le cadre d'une démarche DevOps."</p>`,freq:"med"},

  // ─── Éco-conception & SEO ─────────────────────────────────────────

  {id:"p3_eco_1",proj:"p3",num:53,category:"Accessibilité web (a11y)",thematique:"Éco-conception",
  question:"Qu'est-ce que l'éco-conception web et comment l'appliquer ?",
  answer:`<p>L'<b>éco-conception web</b> consiste à réduire l'impact environnemental d'un site ou d'une application web.</p>
<p><b>Critère RE explicite :</b> "L'interface est conforme à la maquette et les besoins en éco-conception sont pris en compte."</p>
<p><b>Pratiques concrètes :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Images optimisées</b> : format WebP, dimensions correctes, attribut <code>loading="lazy"</code></li>
  <li><b>CSS/JS minifiés</b> : supprimer le code mort, utiliser le tree-shaking</li>
  <li><b>Polices système</b> : préférer les polices système plutôt que les webfonts</li>
  <li><b>Pagination</b> : charger les données par lots plutôt que tout en une fois</li>
  <li><b>Cache HTTP</b> : éviter les re-téléchargements inutiles</li>
</ul>
<pre>&lt;!-- Images optimisées et éco-responsables --&gt;
&lt;img src="photo.webp"
     alt="Description"
     loading="lazy"       &lt;!-- Chargement différé = économie réseau --&gt;
     width="800"
     height="600"&gt;       &lt;!-- Dimensions explicites = évite le layout shift --&gt;</pre>`,freq:"med"},

  {id:"p3_seo_1",proj:"p3",num:54,category:"HTTP & Web",thematique:"SEO",
  question:"Qu'est-ce que le SEO et quels éléments HTML l'influencent ?",
  answer:`<p>Le <b>SEO</b> (Search Engine Optimization) regroupe les techniques qui améliorent le positionnement d'un site dans les résultats des moteurs de recherche.</p>
<p><b>Critère RE :</b> "Le site est visible sur les moteurs de recherche et le référencement dépend du public."</p>
<p><b>Éléments HTML qui impactent le SEO :</b></p>
<pre>&lt;!-- Balise title : résumé cliquable dans Google (50-60 caractères) --&gt;
&lt;title&gt;Entraînement DWWM — Quiz interactif oral professionnel&lt;/title&gt;

&lt;!-- Meta description : texte sous le titre (150-160 caractères) --&gt;
&lt;meta name="description"
      content="Quiz de révision pour l'examen DWWM : front-end, back-end, sécurité."&gt;

&lt;!-- Balises Hn : hiérarchie du contenu (H1 unique par page) --&gt;
&lt;h1&gt;Quiz DWWM — Préparation à l'oral&lt;/h1&gt;
&lt;h2&gt;Questions Front-end&lt;/h2&gt;

&lt;!-- Alt des images : indexé par Google, aide aussi l'accessibilité --&gt;
&lt;img src="schema.png" alt="Schéma MVC Django avec views et templates"&gt;

&lt;!-- URLs lisibles --&gt;
&lt;!-- ✅ /blog/apprendre-django/ → ❌ /page?id=42 --&gt;</pre>
<p><b>Autres facteurs :</b> vitesse de chargement (Core Web Vitals), HTTPS obligatoire, responsive design, sitemap XML.</p>`,freq:"med"},

];
