/**
 * modal.js — Formulaire modal de création et édition de question.
 *
 * Responsabilité unique : gérer l'ouverture, la fermeture
 * et la validation du formulaire de saisie.
 */

import { questions, addQuestion, updateQuestion, newId } from './store.js';
import { showToast } from './utils.js';
import { renderAdmin } from './admin.js';

/** Id de la question en cours d'édition, null si création. */
let editingId = null;

/** Initialise les événements du modal. */
export function initModal() {
  // Fermer en cliquant sur l'overlay
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });
}

/**
 * Ouvre le modal.
 * @param {string|null} id - Id de la question à éditer, null pour une création.
 */
export function openModal(id = null) {
  editingId = id;
  const q = id ? questions.find(x => x.id === id) : null;

  document.getElementById('modal-title').textContent = q ? 'Modifier la question' : 'Nouvelle question';
  document.getElementById('m-proj').value     = q?.proj       || 'p1';
  document.getElementById('m-freq').value     = q?.freq       || 'hot';
  document.getElementById('m-cat').value      = q?.category   || '';
  document.getElementById('m-them').value     = q?.thematique || '';
  document.getElementById('m-question').value = q?.question   || '';
  document.getElementById('m-answer').value   = q?.answer     || '';

  // Alimenter les datalists avec les valeurs existantes
  const allCats  = [...new Set(questions.map(x => x.category).filter(Boolean))];
  const allThems = [...new Set(questions.map(x => x.thematique).filter(Boolean))];
  document.getElementById('cat-datalist').innerHTML  = allCats.map(c => `<option value="${c}">`).join('');
  document.getElementById('them-datalist').innerHTML = allThems.map(t => `<option value="${t}">`).join('');

  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('m-question').focus();
}

/** Ferme le modal et réinitialise l'état. */
export function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  editingId = null;
}

/**
 * Valide le formulaire, crée ou met à jour la question, puis ferme.
 * Appelé par le bouton "Enregistrer" du modal.
 */
export function saveQuestion() {
  const proj     = document.getElementById('m-proj').value.trim();
  const freq     = document.getElementById('m-freq').value.trim();
  const category = document.getElementById('m-cat').value.trim();
  const them     = document.getElementById('m-them').value.trim();
  const question = document.getElementById('m-question').value.trim();
  const answer   = document.getElementById('m-answer').value.trim();

  if (!proj || !category || !question || !answer) {
    showToast('⚠️ Remplissez tous les champs obligatoires (*).');
    return;
  }

  if (editingId) {
    const ok = updateQuestion(editingId, { proj, freq, category, thematique: them, question, answer });
    showToast(ok ? '✅ Question modifiée.' : '❌ Question introuvable.');
  } else {
    addQuestion({
      id:         newId(proj),
      proj,
      num:        0,
      category,
      thematique: them,
      question,
      answer,
      freq,
    });
    showToast('✅ Question ajoutée.');
  }

  closeModal();
  renderAdmin();
}
