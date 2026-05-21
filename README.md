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
    ├── quiz.js         Vue Quiz — accordéons + filtres
    ├── admin.js        Vue Admin — tableau CRUD
    ├── modal.js        Formulaire création/édition
    ├── xml.js          Export/import XML
    ├── utils.js        Fonctions partagées (escHtml, showToast…)
    ├── data-p1.js      Données Projet 1 — Django (28 questions)
    └── data-p2.js      Données Projet 2 — Node.js/Socket.io (180 questions)
```

## Principe SRP appliqué

| Fichier     | Responsabilité unique                        |
|-------------|----------------------------------------------|
| `store.js`  | Données en mémoire + localStorage            |
| `quiz.js`   | Affichage + filtrage des questions           |
| `admin.js`  | Tableau CRUD                                 |
| `modal.js`  | Formulaire saisie/édition                    |
| `xml.js`    | Sérialisation XML export/import              |
| `utils.js`  | Helpers sans dépendances                     |
| `app.js`    | Navigation + orchestration des modules      |

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

## Export / Import XML

- **Export** : télécharge `questions_dwwm_YYYY-MM-DD.xml`  
- **Import** : remplace toutes les données actuelles (confirmation demandée)

Format XML :
```xml
<questions exported="2026-05-21T...">
  <question>
    <id>p2_1</id>
    <proj>p2</proj>
    <category>WebSocket &amp; Socket.io</category>
    <thematique>Socket.io</thematique>
    <freq>hot</freq>
    <question_text><![CDATA[Qu'est-ce qu'un WebSocket ?]]></question_text>
    <answer><![CDATA[<p>...</p><pre>...</pre>]]></answer>
  </question>
</questions>
```

## Données

- **Projet 1 — Django** : 28 questions
- **Projet 2 — Node.js / Socket.io** : 180 questions
  - dont 140 issues de la documentation officielle (Node.js, Express, Socket.io,
    JWT, bcrypt, Helmet, express-rate-limit, pkg, SQLite, Jest, Supertest)
