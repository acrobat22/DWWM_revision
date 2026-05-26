# DWWM Entraînement Oral

Application web autonome pour réviser les questions d'oral DWWM.  
Fonctionne hors ligne — aucun serveur ni installation requise.

## Architecture

```
dwwm_app/
├── index.html          Point d'entrée HTML (structure uniquement)
├── css/
│   └── styles.css      Variables CSS + tous les styles
└── js/
    ├── app.js          Point d'entrée JS — navigation + API window.App
    ├── store.js        État global + persistance localStorage
    ├── quiz.js         Vue Quiz — accordéons + filtres (4 onglets)
    ├── admin.js        Vue Admin — tableau CRUD
    ├── modal.js        Formulaire création/édition
    ├── xml.js          Export/import XML
    ├── utils.js        Fonctions partagées (escHtml, showToast…)
    ├── data-p1.js      Données Projet 1 — Django (78 questions)
    ├── data-p2.js      Données Projet 2 — Node.js/Socket.io (180 questions)
    ├── data-p3.js      Données Transversales — Git, RGPD, Sécurité… (54 questions)
    └── data-p4.js      Données Questionnaire Pro — QCM + Open EN (22 questions)
```

## Principe SRP appliqué

| Fichier      | Responsabilité unique                         |
|--------------|-----------------------------------------------|
| `store.js`   | Données en mémoire + localStorage             |
| `quiz.js`    | Affichage + filtrage des questions            |
| `admin.js`   | Tableau CRUD                                  |
| `modal.js`   | Formulaire saisie/édition                     |
| `xml.js`     | Sérialisation XML export/import               |
| `utils.js`   | Helpers sans dépendances                      |
| `app.js`     | Navigation + orchestration des modules        |

## Utilisation

### En local (recommandé)
Ouvrir via un serveur local (nécessaire pour les modules ES) :
```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .
```
Puis ouvrir `http://localhost:8080`

### Sur GitHub Pages / Netlify Drop
Déposez le dossier `dwwm_app/` — les modules ES fonctionnent nativement.

## Données — 334 questions au total

| Onglet | Fichier       | Contenu                                                   | Questions |
|--------|---------------|-----------------------------------------------------------|-----------|
| P1     | `data-p1.js`  | Projet Django — front, back, BDD, sécurité                | 78        |
| P2     | `data-p2.js`  | Projet Node.js / Socket.io — API, WebSocket, JWT…         | 180       |
| P3     | `data-p3.js`  | Transversales — Git, RGPD, Agile, HTTP, Sécu OWASP, UX…  | 54        |
| P4     | `data-p4.js`  | Questionnaire Professionnel — QCM fr + Open EN + Lectures | 22        |

### Détail P3 — Transversales (54 questions)

Couvre les thèmes évalués par le référentiel d'évaluation (RE TP-01280 v04) :
Git & GitHub, RGPD, Méthodes Agile/Scrum, HTTP & Web, Accessibilité (RGAA/WCAG),
SQL vs NoSQL, Tests logiciels, Déploiement & DevOps, Performance web, Sécurité
web (OWASP Top 10 complet), Architecture logicielle (SOLID, MVC), Veille
technologique, Maquettage & UX, Environnement de travail, CI/CD, Éco-conception, SEO.

### Détail P4 — Questionnaire Professionnel (22 questions)

Simule l'épreuve officielle décrite dans le RE DWWM (section 3.1) :
- **QCM français** (10 questions) : environnement de travail + base de données
  relationnelle — les deux compétences évaluées par le questionnaire professionnel.
- **Questions ouvertes en anglais** (5 questions) : réponses courtes en anglais
  sur .env, Git, Docker, HTTP, README — simule les 2 questions EN du questionnaire.
- **Lectures de documentation technique en anglais** (3 questions) : extraits de
  MDN (CSRF), Docker Hub (Postgres), Node.js docs (fs) avec Q&R.
- **Déploiement & Tests** (4 questions) : scripts de déploiement Django, Nginx,
  jeu d'essai fonctionnel, tests unitaires vs intégration.

## Fonctionnalités

### Quiz (mode lecture)
- 4 onglets de projet : Projet 1, Projet 2, Transversales, Questionnaire Pro
- Filtres combinables : recherche textuelle, catégorie, thématique, niveau
- Accordéons avec tags de fréquence (🔴 Fréquentes / 🔵 Techniques / 🟢 Générales)
- Statistiques dynamiques (nombre de questions filtrées par niveau)

### Admin (accès protégé par mot de passe)
- Créer, modifier, supprimer des questions
- Filtrer par projet et rechercher
- Copier le code JS d'un projet pour mettre à jour les fichiers `data-*.js`
- Export XML (sauvegarde) / Import XML (restauration)
- **🔄 Réinitialiser les données** : efface le localStorage et recharge toutes
  les questions depuis les fichiers `data-*.js` d'origine.
  ⚠️ Action destructive — une confirmation est demandée avant exécution.

## Export / Import XML

- **Export** : télécharge `questions_dwwm_YYYY-MM-DD.xml`
- **Import** : remplace toutes les données actuelles (confirmation demandée)

Format XML :
```xml
<questions exported="2026-05-21T...">
  <question>
    <id>p4_env_qcm_1</id>
    <proj>p4</proj>
    <category>Environnement de travail</category>
    <thematique>QCM</thematique>
    <freq>hot</freq>
    <question_text><![CDATA[Quelle commande Git permet de copier un dépôt distant en local ?]]></question_text>
    <answer><![CDATA[<p>✅ <b>Bonne réponse : <code>git clone &lt;URL&gt;</code></b></p>...]]></answer>
  </question>
</questions>
```

## Persistance des données

Les questions sont stockées dans `localStorage` sous la clé `dwwm_questions_v5`.

**Stratégie de migration automatique :** si localStorage contient des données
d'une version antérieure (sans P3 ou P4), les questions manquantes sont ajoutées
au chargement sans écraser les modifications existantes.

**Réinitialisation manuelle :** le bouton _🔄 Réinitialiser les données_ dans
l'admin efface le localStorage et recharge depuis les fichiers `data-*.js`.

## Référence officielle

Questions basées sur le **RE DWWM TP-01280 millésime 04**  
Arrêté du 26/04/2023 — mis à jour le 02/07/2024  
Source : https://travail-emploi.gouv.fr/
