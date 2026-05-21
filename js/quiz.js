/**
 * quiz.js — Vue Quiz : rendu des accordéons, filtres, stats.
 *
 * Responsabilité unique : afficher et filtrer les questions en mode lecture.
 */

import { getFiltered } from './store.js';
import { escHtml } from './utils.js';

const FREQ_LABEL = { hot: 'Très fréquente', med: 'Technique', easy: 'Générale' };
const FREQ_CLS   = { hot: 'tag-hot',        med: 'tag-med',   easy: 'tag-easy' };

/** Projet actif ('p1' ou 'p2') */
let currentProj = 'p1';

/** Initialise les onglets projet et les listeners de filtres. */
export function initQuiz() {
  document.getElementById('ptab-p1').addEventListener('click', e => switchProj('p1', e.currentTarget));
  document.getElementById('ptab-p2').addEventListener('click', e => switchProj('p2', e.currentTarget));
  document.getElementById('q-search').addEventListener('input', renderQuiz);
  document.getElementById('f-cat').addEventListener('change', renderQuiz);
  document.getElementById('f-them').addEventListener('change', renderQuiz);
  document.getElementById('f-freq').addEventListener('change', renderQuiz);
}

/** Change le projet actif et re-rend. */
function switchProj(proj, el) {
  currentProj = proj;
  document.querySelectorAll('.ptab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('q-search').value = '';
  document.getElementById('f-cat').value   = '';
  document.getElementById('f-them').value  = '';
  document.getElementById('f-freq').value  = '';
  renderQuiz();
}

/** Ouvre ou ferme un accordéon. */
export function toggleCard(id) {
  const card = document.getElementById(id);
  if (card) card.classList.toggle('open');
}

/** Rend la liste des questions avec les filtres actifs. */
export function renderQuiz() {
  const search = document.getElementById('q-search').value;
  const fCat   = document.getElementById('f-cat').value;
  const fThem  = document.getElementById('f-them').value;
  const fFreq  = document.getElementById('f-freq').value;

  // Toutes les questions du projet courant pour alimenter les selects
  const projAll = getFiltered({ proj: currentProj });
  populateSelect('f-cat',  [...new Set(projAll.map(q => q.category).filter(Boolean))],   'Toutes catégories');
  populateSelect('f-them', [...new Set(projAll.map(q => q.thematique).filter(Boolean))], 'Toutes thématiques');

  // Questions filtrées
  const filtered = getFiltered({ proj: currentProj, category: fCat, thematique: fThem, freq: fFreq, search });

  renderStats(filtered);

  if (!filtered.length) {
    document.getElementById('q-list').innerHTML =
      `<div class="empty"><div class="empty-icon">🔍</div><p>Aucune question trouvée.</p></div>`;
    return;
  }

  // Regroupement par catégorie
  const bycat = filtered.reduce((acc, q) => {
    const c = q.category || 'Général';
    (acc[c] = acc[c] || []).push(q);
    return acc;
  }, {});

  let num = 0;
  const html = Object.entries(bycat).map(([cat, qs]) => {
    const cards = qs.map(q => {
      num++;
      return buildCard(q, num);
    }).join('');
    return `<div class="cat-label">${escHtml(cat)}</div>${cards}`;
  }).join('');

  document.getElementById('q-list').innerHTML = html;
}

/** Affiche les compteurs de statistiques. */
function renderStats(filtered) {
  const hot  = filtered.filter(q => q.freq === 'hot').length;
  const med  = filtered.filter(q => q.freq === 'med').length;
  const easy = filtered.filter(q => q.freq === 'easy').length;
  document.getElementById('q-stats').innerHTML = `
    <div class="sstat"><b>${filtered.length}</b> questions</div>
    <div class="sstat"><b style="color:#e35336">●</b> Fréquentes : ${hot}</div>
    <div class="sstat"><b style="color:#185FA5">●</b> Techniques : ${med}</div>
    <div class="sstat"><b style="color:#3B6D11">●</b> Générales : ${easy}</div>
  `;
}

/**
 * Construit le HTML d'une carte accordéon.
 * @param {Object} q - La question.
 * @param {number} num - Numéro d'affichage.
 * @returns {string} HTML de la carte.
 */
function buildCard(q, num) {
  const tagCls  = FREQ_CLS[q.freq]   || 'tag-easy';
  const tagTxt  = FREQ_LABEL[q.freq] || '';
  const badge   = q.thematique
    ? `<span class="thematique-badge">${escHtml(q.thematique)}</span>`
    : '';

  return `
    <div class="qcard ${currentProj}" id="card-${q.id}">
      <div class="qhead" onclick="App.toggleCard('card-${q.id}')">
        <div class="qnum">${num}</div>
        <div class="qtxt">${q.question}${badge}</div>
        <div class="qchev">⌄</div>
      </div>
      <div class="qbody">
        <span class="tag ${tagCls}">${tagTxt}</span>
        ${q.answer}
      </div>
    </div>`;
}

/**
 * Alimente un élément <select> avec des options.
 * Préserve la valeur sélectionnée si elle existe toujours.
 * @param {string} id - Id du select.
 * @param {string[]} values - Options à afficher.
 * @param {string} placeholder - Texte de l'option vide.
 */
function populateSelect(id, values, placeholder) {
  const sel = document.getElementById(id);
  const cur = sel.value;
  sel.innerHTML = `<option value="">${placeholder}</option>`;
  values.forEach(v => {
    const opt = document.createElement('option');
    opt.value = v;
    opt.textContent = v;
    if (v === cur) opt.selected = true;
    sel.appendChild(opt);
  });
}
