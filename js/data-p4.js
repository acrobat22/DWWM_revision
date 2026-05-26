/**
 * data-p4.js — Questionnaire Professionnel DWWM.
 *
 * Simule l'épreuve officielle du référentiel d'évaluation (RE TP-01280 v04) :
 *   - Lecture d'une documentation technique rédigée en anglais.
 *   - 2 questions fermées à choix unique posées en français (QCM).
 *   - 2 questions ouvertes posées en anglais avec réponse courte en anglais.
 *
 * Thèmes couverts (définis dans le RE) :
 *   - Installer et configurer son environnement de travail (Docker, Git, VS Code)
 *   - Mettre en place une base de données relationnelle (modélisation, SQL, sécurité)
 *   - Déploiement documenté d'une application web dynamique
 *   - Environnement de développement et outils collaboratifs
 *
 * Format des questions :
 *   - Les questions françaises (type QCM) ont freq:'hot' ou 'med'.
 *   - Les questions ouvertes en anglais ont freq:'easy' pour les distinguer visuellement.
 *   - La thematique indique le type : 'QCM', 'Open EN', 'Lecture doc'.
 *
 * Source officielle : https://travail-emploi.gouv.fr/
 *   RE DWWM TP-01280 millésime 04, arrêté du 26/04/2023, mis à jour le 02/07/2024.
 */

export const DATA_P4 = [

  // ══════════════════════════════════════════════════════════════════
  //  BLOC 1 — Environnement de travail (QCM français)
  //  Compétence RE : "Installer et configurer son environnement de travail
  //                   en fonction du projet web ou web mobile"
  // ══════════════════════════════════════════════════════════════════

  {
    id: 'p4_env_qcm_1',
    proj: 'p4',
    num: 1,
    category: 'Environnement de travail',
    thematique: 'QCM',
    question: '(QCM) Quelle commande Git permet de copier un dépôt distant en local ?',
    answer: `<p>✅ <b>Bonne réponse : <code>git clone &lt;URL&gt;</code></b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><code>git init</code> — initialise un dépôt vide local (ne copie rien depuis le distant)</li>
  <li><code>git pull</code> — met à jour un dépôt local déjà existant depuis la branche distante</li>
  <li><code>git fetch</code> — télécharge les mises à jour distantes sans les fusionner</li>
  <li><b><code>git clone &lt;URL&gt;</code></b> — crée un dépôt local complet, copie tout l'historique</li>
</ul>
<p><b>Critère RE :</b> "Les outils de gestion des versions et de collaboration sont installés."</p>`,
    freq: 'hot',
  },

  {
    id: 'p4_env_qcm_2',
    proj: 'p4',
    num: 2,
    category: 'Environnement de travail',
    thematique: 'QCM',
    question: '(QCM) Dans un fichier <code>docker-compose.yml</code>, quelle clé définit les services à démarrer ?',
    answer: `<p>✅ <b>Bonne réponse : <code>services</code></b></p>
<pre>version: "3.9"

services:          # ← clé principale : liste des conteneurs
  web:
    build: .
    ports:
      - "8000:8000"
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: secret</pre>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><code>volumes</code> — monte des dossiers locaux dans les conteneurs</li>
  <li><code>networks</code> — configure les réseaux internes entre services</li>
  <li><b><code>services</code></b> — déclare chaque conteneur et sa configuration</li>
</ul>
<p><b>Critère RE :</b> "Les conteneurs implémentent les services requis pour l'environnement de développement."</p>`,
    freq: 'hot',
  },

  {
    id: 'p4_env_qcm_3',
    proj: 'p4',
    num: 3,
    category: 'Environnement de travail',
    thematique: 'QCM',
    question: '(QCM) Quel fichier Git permet d\'exclure des fichiers du suivi de version ?',
    answer: `<p>✅ <b>Bonne réponse : <code>.gitignore</code></b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><code>.env</code> — stocke les variables d'environnement (à exclure via .gitignore)</li>
  <li><code>README.md</code> — documentation du projet</li>
  <li><b><code>.gitignore</code></b> — liste des fichiers/dossiers que Git doit ignorer</li>
  <li><code>package.json</code> — manifeste npm (doit être commité)</li>
</ul>
<pre># Exemple de .gitignore
.env                # Variables d'environnement (secrets)
__pycache__/        # Cache Python
node_modules/       # Dépendances npm (régénérables)
*.sqlite3           # Base de données locale
.DS_Store           # Métadonnées macOS</pre>
<p><b>Critère RE :</b> "Aucun secret en dur — utiliser .env ou un gestionnaire."</p>`,
    freq: 'hot',
  },

  {
    id: 'p4_env_qcm_4',
    proj: 'p4',
    num: 4,
    category: 'Environnement de travail',
    thematique: 'QCM',
    question: '(QCM) Quelle commande installe toutes les dépendances Python listées dans <code>requirements.txt</code> ?',
    answer: `<p>✅ <b>Bonne réponse : <code>pip install -r requirements.txt</code></b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><code>pip freeze</code> — liste les paquets installés (pour générer requirements.txt)</li>
  <li><code>pip install django</code> — installe un seul paquet</li>
  <li><b><code>pip install -r requirements.txt</code></b> — installe tous les paquets du fichier</li>
  <li><code>python setup.py install</code> — ancienne méthode, obsolète</li>
</ul>
<pre># Créer le fichier de dépendances
pip freeze > requirements.txt

# Installer dans un nouvel environnement
pip install -r requirements.txt

# Bonne pratique : toujours travailler dans un venv
python -m venv venv
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows</pre>`,
    freq: 'hot',
  },

  {
    id: 'p4_env_qcm_5',
    proj: 'p4',
    num: 5,
    category: 'Environnement de travail',
    thematique: 'QCM',
    question: '(QCM) Quel outil permet de détecter automatiquement les vulnérabilités dans les paquets npm ?',
    answer: `<p>✅ <b>Bonne réponse : <code>npm audit</code></b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><code>npm test</code> — exécute les tests unitaires</li>
  <li><code>npm outdated</code> — liste les paquets ayant des mises à jour disponibles</li>
  <li><b><code>npm audit</code></b> — analyse les dépendances et signale les CVE connues</li>
  <li><code>eslint .</code> — analyse la qualité du code (linting), pas les vulnérabilités</li>
</ul>
<pre>npm audit                  # Rapport des vulnérabilités
npm audit fix              # Corrige automatiquement les failles non bloquantes
npm audit fix --force      # Force les corrections (peut casser des APIs)

# Équivalent Python :
pip install safety
safety check               # Vérifie requirements.txt contre les CVE connues</pre>
<p><b>Critère RE :</b> "Le système de veille permet de suivre les vulnérabilités de sécurité."</p>`,
    freq: 'hot',
  },

  // ══════════════════════════════════════════════════════════════════
  //  BLOC 2 — Base de données relationnelle (QCM français)
  //  Compétence RE : "Mettre en place une base de données relationnelle"
  // ══════════════════════════════════════════════════════════════════

  {
    id: 'p4_bdd_qcm_1',
    proj: 'p4',
    num: 6,
    category: 'Base de données',
    thematique: 'QCM',
    question: '(QCM) Quelle contrainte SQL garantit qu\'une colonne ne peut pas contenir de valeur <code>NULL</code> ?',
    answer: `<p>✅ <b>Bonne réponse : <code>NOT NULL</code></b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><code>UNIQUE</code> — interdit les doublons, mais autorise NULL (une seule fois selon le SGBD)</li>
  <li><code>PRIMARY KEY</code> — combine UNIQUE + NOT NULL, mais ne s'applique qu'à la clé primaire</li>
  <li><b><code>NOT NULL</code></b> — interdit les valeurs NULL dans la colonne</li>
  <li><code>CHECK</code> — valide une condition logique sur la valeur</li>
</ul>
<pre>CREATE TABLE utilisateur (
    id          INTEGER     PRIMARY KEY AUTOINCREMENT,
    email       VARCHAR(150) NOT NULL UNIQUE,  -- obligatoire + unique
    prenom      VARCHAR(80)  NOT NULL,          -- obligatoire
    date_naissance DATE,                        -- optionnel (NULL autorisé)
    age         INTEGER      CHECK (age >= 0)   -- condition logique
);</pre>
<p><b>Critère RE :</b> "La sécurité, l'intégrité et la confidentialité des données est assurée."</p>`,
    freq: 'hot',
  },

  {
    id: 'p4_bdd_qcm_2',
    proj: 'p4',
    num: 7,
    category: 'Base de données',
    thematique: 'QCM',
    question: '(QCM) Quelle clause SQL filtre les résultats d\'une requête <code>SELECT</code> ?',
    answer: `<p>✅ <b>Bonne réponse : <code>WHERE</code></b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><code>ORDER BY</code> — trie les résultats (ASC/DESC)</li>
  <li><code>GROUP BY</code> — regroupe les lignes pour des agrégats (COUNT, SUM…)</li>
  <li><b><code>WHERE</code></b> — filtre les lignes selon une condition</li>
  <li><code>HAVING</code> — filtre les groupes après GROUP BY (≠ WHERE qui filtre avant)</li>
</ul>
<pre>SELECT nom, email
FROM utilisateur
WHERE actif = 1              -- filtre les lignes
  AND date_inscription > '2024-01-01'
ORDER BY nom ASC;            -- tri après filtrage

-- HAVING filtre les groupes (après agrégation)
SELECT categorie, COUNT(*) AS nb_questions
FROM question
GROUP BY categorie
HAVING COUNT(*) > 5;         -- seulement les catégories avec > 5 questions</pre>`,
    freq: 'hot',
  },

  {
    id: 'p4_bdd_qcm_3',
    proj: 'p4',
    num: 8,
    category: 'Base de données',
    thematique: 'QCM',
    question: '(QCM) Qu\'est-ce qu\'une clé étrangère (<code>FOREIGN KEY</code>) ?',
    answer: `<p>✅ <b>Bonne réponse : une colonne qui référence la clé primaire d'une autre table, garantissant l'intégrité référentielle.</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Clé primaire (PRIMARY KEY)</b> : identifie de manière unique chaque ligne d'une table</li>
  <li><b>Clé étrangère (FOREIGN KEY)</b> : lie deux tables — valeur doit exister dans la table parente</li>
  <li><b>Index</b> : structure pour accélérer les recherches (pas une contrainte d'intégrité)</li>
</ul>
<pre>CREATE TABLE commande (
    id          INTEGER PRIMARY KEY,
    id_client   INTEGER NOT NULL,
    montant     DECIMAL(10,2),

    -- La clé étrangère garantit qu'id_client existe dans la table client
    FOREIGN KEY (id_client) REFERENCES client(id)
        ON DELETE CASCADE    -- supprime les commandes si le client est supprimé
        ON UPDATE CASCADE    -- met à jour si l'id client change
);</pre>
<p><b>Critère RE :</b> "Les données du schéma conceptuel et leurs relations sont identifiées et prises en compte."</p>`,
    freq: 'hot',
  },

  {
    id: 'p4_bdd_qcm_4',
    proj: 'p4',
    num: 9,
    category: 'Base de données',
    thematique: 'QCM',
    question: '(QCM) Quelle est la différence entre <code>INNER JOIN</code> et <code>LEFT JOIN</code> ?',
    answer: `<p>✅ <b>Bonne réponse : INNER JOIN ne retourne que les lignes avec correspondance dans les deux tables ; LEFT JOIN retourne toutes les lignes de la table gauche, même sans correspondance.</b></p>
<pre>-- INNER JOIN : seulement les clients qui ont des commandes
SELECT c.nom, cmd.montant
FROM client c
INNER JOIN commande cmd ON c.id = cmd.id_client;

-- LEFT JOIN : tous les clients, même ceux sans commande (NULL)
SELECT c.nom, cmd.montant
FROM client c
LEFT JOIN commande cmd ON c.id = cmd.id_client;
-- Les clients sans commande auront cmd.montant = NULL</pre>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>INNER JOIN</b> : intersection — lignes présentes dans les deux tables</li>
  <li><b>LEFT JOIN</b> : table gauche complète + correspondances droite (NULL si absent)</li>
  <li><b>RIGHT JOIN</b> : table droite complète + correspondances gauche (NULL si absent)</li>
  <li><b>FULL OUTER JOIN</b> : union des deux tables (toutes les lignes)</li>
</ul>`,
    freq: 'hot',
  },

  {
    id: 'p4_bdd_qcm_5',
    proj: 'p4',
    num: 10,
    category: 'Base de données',
    thematique: 'QCM',
    question: '(QCM) Pourquoi faut-il utiliser des requêtes paramétrées plutôt que la concaténation de chaînes en SQL ?',
    answer: `<p>✅ <b>Bonne réponse : Pour prévenir les injections SQL (OWASP A03).</b></p>
<p>La concaténation directe d'une entrée utilisateur dans une requête SQL permet à un attaquant d'injecter du code malveillant.</p>
<pre>// ❌ DANGEREUX — injection SQL possible
const sql = "SELECT * FROM user WHERE email = '" + req.body.email + "'";
// Si req.body.email = "' OR '1'='1", la requête retourne TOUS les utilisateurs

// ✅ SÉCURISÉ — requête paramétrée (better-sqlite3)
const stmt = db.prepare("SELECT * FROM user WHERE email = ?");
const user = stmt.get(req.body.email);

# ✅ SÉCURISÉ — ORM Django (paramétrage automatique)
user = User.objects.get(email=request.POST['email'])</pre>
<p><b>Règle absolue :</b> toute valeur venant de l'utilisateur (formulaire, URL, header) doit être paramétrée, jamais concaténée.</p>
<p><b>Critère RE :</b> "Toutes les entrées sont contrôlées et validées dans les composants serveurs sécurisés."</p>`,
    freq: 'hot',
  },

  // ══════════════════════════════════════════════════════════════════
  //  BLOC 3 — Questions ouvertes en anglais (Open EN)
  //  Simule les 2 questions ouvertes du questionnaire professionnel.
  //  L'apprenant doit répondre EN ANGLAIS avec des phrases courtes.
  // ══════════════════════════════════════════════════════════════════

  {
    id: 'p4_en_open_1',
    proj: 'p4',
    num: 11,
    category: 'English Questions',
    thematique: 'Open EN',
    question: '(Open EN) What is the purpose of a <code>.env</code> file in a web project?',
    answer: `<p><b>📝 Example answer (write in English):</b></p>
<p><em>"A <code>.env</code> file stores environment-specific configuration values such as database credentials, API keys, and secret tokens. It keeps sensitive data out of the source code and version control. Each developer or server has its own <code>.env</code> file, and it is always listed in <code>.gitignore</code>."</em></p>
<hr style="margin:10px 0;border:none;border-top:1px solid #e8e0de">
<p><b>Key vocabulary to use:</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>environment variables</b> — variables d'environnement</li>
  <li><b>sensitive data / credentials</b> — données sensibles / identifiants</li>
  <li><b>version control</b> — contrôle de version</li>
  <li><b>configuration</b> — paramétrage</li>
</ul>
<pre># Example .env file
DATABASE_URL=postgresql://user:password@localhost/mydb
SECRET_KEY=my-very-secret-key-12345
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1</pre>
<p><b>RE criterion:</b> "No hardcoded secrets — use .env or a secrets manager."</p>`,
    freq: 'hot',
  },

  {
    id: 'p4_en_open_2',
    proj: 'p4',
    num: 12,
    category: 'English Questions',
    thematique: 'Open EN',
    question: '(Open EN) What does <code>git commit</code> do and what is a good commit message?',
    answer: `<p><b>📝 Example answer (write in English):</b></p>
<p><em>"The <code>git commit</code> command saves staged changes to the local repository history with a descriptive message. A good commit message follows the Conventional Commits format: a short type prefix (feat, fix, docs, refactor), followed by a concise description of what changed and why."</em></p>
<hr style="margin:10px 0;border:none;border-top:1px solid #e8e0de">
<p><b>Key vocabulary to use:</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>staged changes</b> — modifications en attente (staging area)</li>
  <li><b>repository history</b> — historique du dépôt</li>
  <li><b>descriptive message</b> — message explicite</li>
  <li><b>Conventional Commits</b> — convention de nommage</li>
</ul>
<pre>git add .
git commit -m "feat: add user login form with CSRF protection"

# Conventional Commits prefixes:
# feat     → new feature
# fix      → bug fix
# docs     → documentation only
# refactor → code change without feature/fix
# test     → adding tests
# chore    → maintenance tasks</pre>`,
    freq: 'hot',
  },

  {
    id: 'p4_en_open_3',
    proj: 'p4',
    num: 13,
    category: 'English Questions',
    thematique: 'Open EN',
    question: '(Open EN) What is Docker and why is it useful for a web development project?',
    answer: `<p><b>📝 Example answer (write in English):</b></p>
<p><em>"Docker is a containerization platform that packages an application and all its dependencies into isolated containers. It ensures the application runs identically on every machine — developer laptop, CI server, or production server — solving the 'it works on my machine' problem."</em></p>
<hr style="margin:10px 0;border:none;border-top:1px solid #e8e0de">
<p><b>Key vocabulary to use:</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>container</b> — conteneur isolé</li>
  <li><b>image</b> — modèle immuable du conteneur</li>
  <li><b>isolated environment</b> — environnement isolé</li>
  <li><b>dependencies</b> — dépendances</li>
  <li><b>reproducible</b> — reproductible</li>
</ul>
<pre>docker build -t myapp .          # Build an image from Dockerfile
docker run -p 8000:8000 myapp    # Run a container from the image
docker-compose up --build        # Start all services (app + db + cache)</pre>
<p><b>RE criterion:</b> "Containers implement the required services for the development environment."</p>`,
    freq: 'med',
  },

  {
    id: 'p4_en_open_4',
    proj: 'p4',
    num: 14,
    category: 'English Questions',
    thematique: 'Open EN',
    question: '(Open EN) What is the difference between <code>GET</code> and <code>POST</code> HTTP methods?',
    answer: `<p><b>📝 Example answer (write in English):</b></p>
<p><em>"GET retrieves data from the server without modifying it. Parameters are visible in the URL, so it should never be used to send sensitive data. POST sends data in the request body to create or modify a resource on the server. It is the correct method for forms with passwords or personal information."</em></p>
<hr style="margin:10px 0;border:none;border-top:1px solid #e8e0de">
<p><b>Key vocabulary to use:</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>request body</b> — corps de la requête</li>
  <li><b>query string / URL parameters</b> — paramètres dans l'URL</li>
  <li><b>idempotent</b> — idempotent (même résultat si répété)</li>
  <li><b>sensitive data</b> — données sensibles</li>
</ul>
<pre>GET  /search?q=django&page=2   → retrieves data, visible in URL, bookmarkable
POST /login                    → sends email + password in body (not in URL)
PUT  /users/42                 → replaces the entire resource
PATCH /users/42                → partially updates a resource
DELETE /users/42               → deletes the resource</pre>`,
    freq: 'hot',
  },

  {
    id: 'p4_en_open_5',
    proj: 'p4',
    num: 15,
    category: 'English Questions',
    thematique: 'Open EN',
    question: '(Open EN) What is a <code>README.md</code> file and what should it contain?',
    answer: `<p><b>📝 Example answer (write in English):</b></p>
<p><em>"A README.md is a Markdown documentation file at the root of a project. It explains what the project does, how to install and run it, the technologies used, and any relevant configuration. It is the first file a developer reads when discovering a project."</em></p>
<hr style="margin:10px 0;border:none;border-top:1px solid #e8e0de">
<p><b>Key vocabulary to use:</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>installation steps</b> — étapes d'installation</li>
  <li><b>prerequisites</b> — prérequis</li>
  <li><b>configuration</b> — configuration</li>
  <li><b>usage examples</b> — exemples d'utilisation</li>
</ul>
<pre># Project Name

## Description
Brief description of what the project does.

## Prerequisites
- Python 3.11+
- Docker Desktop

## Installation
\`\`\`bash
git clone https://github.com/user/project
cp .env.example .env     # Fill in your credentials
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
\`\`\`

## Technologies
- Django 4.2, SQLite3, Bootstrap 5</pre>
<p><b>RE criterion:</b> "The deployment procedure is written or updated. Deployment scripts are written and documented."</p>`,
    freq: 'med',
  },

  // ══════════════════════════════════════════════════════════════════
  //  BLOC 4 — Lecture de documentation technique en anglais
  //  Exercice : lire un extrait de doc et répondre aux questions
  // ══════════════════════════════════════════════════════════════════

  {
    id: 'p4_doc_1',
    proj: 'p4',
    num: 16,
    category: 'Lecture documentation',
    thematique: 'Lecture doc',
    question: 'Lire l\'extrait de doc suivant (MDN Web Docs — CSRF) et répondre : qu\'est-ce qu\'une attaque CSRF et quel mécanisme Django utilise-t-il pour s\'en protéger ?',
    answer: `<p><b>📄 Extrait de documentation (en anglais) :</b></p>
<pre style="font-style:italic">Cross-Site Request Forgery (CSRF) is an attack that forces an end user
to execute unwanted actions on a web application in which they're
currently authenticated. CSRF attacks target state-changing requests,
not theft of data, since the attacker has no way to see the response
to the forged request.

Django provides built-in CSRF protection via a middleware and a template
tag. The {% csrf_token %} tag inserts a hidden form field containing a
token. The server validates this token on every POST, PUT, PATCH, or
DELETE request to confirm the request originated from the legitimate site.</pre>
<hr style="margin:10px 0;border:none;border-top:1px solid #e8e0de">
<p><b>✅ Réponse attendue :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>CSRF</b> : attaque qui force un utilisateur authentifié à exécuter des actions non voulues (ex : un site malveillant qui soumet un formulaire sur votre banque à votre insu).</li>
  <li><b>Protection Django</b> : le middleware <code>CsrfViewMiddleware</code> + la balise <code>{% csrf_token %}</code> dans les formulaires. Un token unique est généré côté serveur et vérifié à chaque requête POST/PUT/PATCH/DELETE.</li>
</ul>
<pre>&lt;!-- Dans chaque formulaire Django --&gt;
&lt;form method="post" action="/login/"&gt;
  {% csrf_token %}   &lt;!-- Génère un champ hidden avec le token --&gt;
  &lt;input type="text" name="username"&gt;
  &lt;button type="submit"&gt;Se connecter&lt;/button&gt;
&lt;/form&gt;</pre>
<p><b>Critère RE :</b> "Les recommandations de sécurité liées aux applications web et web mobile sont respectées."</p>`,
    freq: 'hot',
  },

  {
    id: 'p4_doc_2',
    proj: 'p4',
    num: 17,
    category: 'Lecture documentation',
    thematique: 'Lecture doc',
    question: 'Lire l\'extrait de doc suivant (Docker Hub — Postgres) et répondre : quelles variables d\'environnement sont nécessaires pour initialiser un conteneur PostgreSQL ?',
    answer: `<p><b>📄 Extrait de documentation (en anglais) :</b></p>
<pre style="font-style:italic">The postgres image uses several environment variables to configure the
PostgreSQL instance on first start:

  POSTGRES_PASSWORD (required)
    Sets the superuser password for PostgreSQL.

  POSTGRES_USER (optional, default: postgres)
    Creates a new superuser with this name.

  POSTGRES_DB (optional, default: value of POSTGRES_USER)
    Creates a new database with this name on initialization.

  POSTGRES_HOST_AUTH_METHOD (optional)
    Controls the auth-method for connections to the default database.</pre>
<hr style="margin:10px 0;border:none;border-top:1px solid #e8e0de">
<p><b>✅ Réponse attendue :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Obligatoire :</b> <code>POSTGRES_PASSWORD</code> — mot de passe du superutilisateur</li>
  <li><b>Optionnels :</b> <code>POSTGRES_USER</code> (défaut : postgres), <code>POSTGRES_DB</code> (défaut : valeur de POSTGRES_USER)</li>
</ul>
<pre># docker-compose.yml
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: \${DB_PASSWORD}   # Depuis .env
      POSTGRES_USER:     \${DB_USER}
      POSTGRES_DB:       \${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data  # Persistance des données

volumes:
  postgres_data:</pre>
<p><b>Critère RE :</b> "La documentation technique de l'environnement de travail est comprise, en langue française ou anglaise (niveau B1 CECRL)."</p>`,
    freq: 'med',
  },

  {
    id: 'p4_doc_3',
    proj: 'p4',
    num: 18,
    category: 'Lecture documentation',
    thematique: 'Lecture doc',
    question: 'Lire l\'extrait de doc suivant (Node.js — fs module) et répondre : quelle est la différence entre <code>readFile</code> et <code>readFileSync</code> ?',
    answer: `<p><b>📄 Extrait de documentation (en anglais) :</b></p>
<pre style="font-style:italic">fs.readFile(path, [options], callback)
  Asynchronously reads the entire contents of a file. The callback is
  called with two arguments (err, data). If no encoding is specified,
  data is returned as a Buffer.

fs.readFileSync(path, [options])
  Synchronously reads the entire contents of a file. Blocks the event
  loop until the file is fully read. Returns the content directly.
  This method should be avoided in production servers handling
  concurrent requests.</pre>
<hr style="margin:10px 0;border:none;border-top:1px solid #e8e0de">
<p><b>✅ Réponse attendue :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>readFile</b> : <b>asynchrone</b> — ne bloque pas l'event loop, utilise un callback (ou Promise). À préférer en production.</li>
  <li><b>readFileSync</b> : <b>synchrone</b> — bloque l'event loop jusqu'à la fin de la lecture. Utilisable uniquement au démarrage du serveur, jamais dans un handler de requête.</li>
</ul>
<pre>// ✅ Asynchrone — ne bloque pas Node.js
const { readFile } = require('fs/promises');
const data = await readFile('./config.json', 'utf-8');

// ⚠️ Synchrone — bloque pendant la lecture (éviter en prod)
const { readFileSync } = require('fs');
const config = readFileSync('./config.json', 'utf-8'); // OK au démarrage</pre>`,
    freq: 'med',
  },

  // ══════════════════════════════════════════════════════════════════
  //  BLOC 5 — Déploiement documenté
  //  Compétence RE : "Documenter le déploiement d'une application
  //                   dynamique web ou web mobile"
  // ══════════════════════════════════════════════════════════════════

  {
    id: 'p4_deploy_qcm_1',
    proj: 'p4',
    num: 19,
    category: 'Déploiement',
    thematique: 'QCM',
    question: '(QCM) Quelle commande Django génère les migrations de base de données depuis les modèles Python ?',
    answer: `<p>✅ <b>Bonne réponse : <code>python manage.py makemigrations</code></b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b><code>makemigrations</code></b> — analyse les modèles et génère les fichiers de migration</li>
  <li><b><code>migrate</code></b> — applique les migrations en base (crée/modifie les tables)</li>
  <li><code>dbshell</code> — ouvre un shell SQL interactif</li>
  <li><code>inspectdb</code> — génère des modèles depuis une base existante</li>
</ul>
<pre># Workflow complet de déploiement Django
git pull origin main                  # 1. Récupérer le code
pip install -r requirements.txt       # 2. Mettre à jour les dépendances
python manage.py makemigrations       # 3. Générer les migrations (si modèles modifiés)
python manage.py migrate              # 4. Appliquer les migrations
python manage.py collectstatic        # 5. Rassembler les fichiers statiques
sudo systemctl restart gunicorn       # 6. Redémarrer le serveur WSGI</pre>
<p><b>Critère RE :</b> "Les scripts de déploiement sont écrits et documentés."</p>`,
    freq: 'hot',
  },

  {
    id: 'p4_deploy_qcm_2',
    proj: 'p4',
    num: 20,
    category: 'Déploiement',
    thematique: 'QCM',
    question: '(Open EN) What is the role of a reverse proxy like Nginx in a Django/Node.js deployment?',
    answer: `<p><b>📝 Example answer (write in English):</b></p>
<p><em>"Nginx acts as a reverse proxy that sits in front of the application server (Gunicorn or Node.js). It handles incoming HTTPS connections, terminates SSL/TLS, serves static files directly (without bothering the app server), and forwards API or dynamic requests to the application. It also provides load balancing and rate limiting."</em></p>
<hr style="margin:10px 0;border:none;border-top:1px solid #e8e0de">
<p><b>Key vocabulary to use:</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>reverse proxy</b> — mandataire inverse</li>
  <li><b>SSL termination</b> — terminaison SSL (déchiffrement HTTPS)</li>
  <li><b>static files</b> — fichiers statiques (CSS, JS, images)</li>
  <li><b>upstream</b> — serveur applicatif en aval</li>
</ul>
<pre># Configuration Nginx simplifiée
server {
    listen 443 ssl;
    server_name monsite.fr;

    # Servir les fichiers statiques directement (sans Gunicorn)
    location /static/ {
        alias /var/www/myapp/staticfiles/;
    }

    # Transférer les requêtes dynamiques à Gunicorn
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
    }
}</pre>
<p><b>Critère RE :</b> "Le système de veille permet de suivre les évolutions technologiques liées au déploiement."</p>`,
    freq: 'med',
  },

  // ══════════════════════════════════════════════════════════════════
  //  BLOC 6 — Jeu d'essai / Tests fonctionnels
  //  Critère RE explicite : "La présentation d'un jeu d'essai élaboré
  //  par le candidat de la fonctionnalité la plus représentative"
  // ══════════════════════════════════════════════════════════════════

  {
    id: 'p4_test_qcm_1',
    proj: 'p4',
    num: 21,
    category: 'Tests & Jeu d\'essai',
    thematique: 'QCM',
    question: '(QCM) Qu\'est-ce qu\'un jeu d\'essai fonctionnel dans le cadre du DWWM ?',
    answer: `<p>✅ <b>Bonne réponse : un ensemble de cas de test qui vérifie une fonctionnalité avec des données en entrée, les résultats attendus et les résultats obtenus.</b></p>
<p>Le référentiel impose de présenter le jeu d'essai de la <b>fonctionnalité la plus représentative</b> du projet.</p>
<table style="width:100%;border-collapse:collapse;font-size:13px;margin-top:8px">
  <thead>
    <tr style="background:#fde8e4">
      <th style="padding:6px;border:1px solid #e8e0de;text-align:left">Cas de test</th>
      <th style="padding:6px;border:1px solid #e8e0de;text-align:left">Données en entrée</th>
      <th style="padding:6px;border:1px solid #e8e0de;text-align:left">Résultat attendu</th>
      <th style="padding:6px;border:1px solid #e8e0de;text-align:left">Résultat obtenu</th>
      <th style="padding:6px;border:1px solid #e8e0de;text-align:left">Statut</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:5px;border:1px solid #e8e0de">Connexion valide</td>
      <td style="padding:5px;border:1px solid #e8e0de">admin / mdp correct</td>
      <td style="padding:5px;border:1px solid #e8e0de">Redirection dashboard, code 302</td>
      <td style="padding:5px;border:1px solid #e8e0de">Redirection dashboard</td>
      <td style="padding:5px;border:1px solid #e8e0de">✅ OK</td>
    </tr>
    <tr style="background:#fde8e4">
      <td style="padding:5px;border:1px solid #e8e0de">Mauvais mot de passe</td>
      <td style="padding:5px;border:1px solid #e8e0de">admin / mauvais_mdp</td>
      <td style="padding:5px;border:1px solid #e8e0de">Message d'erreur, code 200</td>
      <td style="padding:5px;border:1px solid #e8e0de">Message d'erreur</td>
      <td style="padding:5px;border:1px solid #e8e0de">✅ OK</td>
    </tr>
    <tr>
      <td style="padding:5px;border:1px solid #e8e0de">Injection SQL</td>
      <td style="padding:5px;border:1px solid #e8e0de">' OR '1'='1</td>
      <td style="padding:5px;border:1px solid #e8e0de">Connexion refusée</td>
      <td style="padding:5px;border:1px solid #e8e0de">Connexion refusée</td>
      <td style="padding:5px;border:1px solid #e8e0de">✅ OK</td>
    </tr>
  </tbody>
</table>
<p style="margin-top:8px"><b>Critère RE :</b> "La présentation d'un jeu d'essai élaboré par le candidat de la fonctionnalité la plus représentative (données en entrée, données attendues, données obtenues) et analyse des écarts éventuels."</p>`,
    freq: 'hot',
  },

  {
    id: 'p4_test_qcm_2',
    proj: 'p4',
    num: 22,
    category: 'Tests & Jeu d\'essai',
    thematique: 'QCM',
    question: '(QCM) Quelle est la différence entre un test unitaire et un test d\'intégration ?',
    answer: `<p>✅ <b>Bonne réponse :</b></p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Test unitaire</b> : teste une seule fonction/méthode en isolation, sans accès base de données ni réseau. Rapide, ciblé.</li>
  <li><b>Test d'intégration</b> : teste plusieurs composants ensemble (ex: route HTTP + contrôleur + base de données).</li>
</ul>
<pre># Python / Django — Test unitaire
from django.test import TestCase
from .utils import calculer_total

class TestCalculTotal(TestCase):
    def test_total_positif(self):
        # Arrange : préparer les données
        articles = [{'prix': 10}, {'prix': 20}]
        # Act : appeler la fonction
        resultat = calculer_total(articles)
        # Assert : vérifier le résultat
        self.assertEqual(resultat, 30)

# Django — Test d'intégration (requête HTTP complète)
class TestLoginView(TestCase):
    def test_login_valide(self):
        response = self.client.post('/login/', {
            'username': 'admin', 'password': 'mdp_test'
        })
        self.assertEqual(response.status_code, 302)  # Redirection attendue</pre>
<p><b>Critère RE :</b> "Un jeu d'essai fonctionnel et les tests unitaires ont été réalisés pour les composants concernés."</p>`,
    freq: 'hot',
  },

];
