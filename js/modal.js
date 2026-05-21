/**
 * modal.js — Formulaire modal de création et édition de question.
 *
 * Responsabilité unique : gérer l'ouverture, la fermeture
 * et la validation du formulaire de saisie.
 */

import { questions, addQuestion, updateQuestion, newId } from './store.js';
import { showToast } from './utils.js';
import { renderAdmin } from './admin.js';

/** Identifiant de la question en cours d'édition, null si création. */
let questionEnCoursEditionId = null;

/** Initialise les événements du modal. */
export function initModal() {
  document.getElementById('modal-overlay').addEventListener('click', evenement => {
    if (evenement.target === document.getElementById('modal-overlay')) closeModal();
  });
}

/**
 * Ouvre le modal en mode création ou édition.
 * @param {string|null} questionId - Id de la question à éditer, null pour une création.
 */
export function openModal(questionId = null) {
  questionEnCoursEditionId = questionId;
  const questionExistante = questionId ? questions.find(q => q.id === questionId) : null;

  document.getElementById('modal-title').textContent =
    questionExistante ? 'Modifier la question' : 'Nouvelle question';

  document.getElementById('m-proj').value     = questionExistante?.proj       || 'p1';
  document.getElementById('m-freq').value     = questionExistante?.freq       || 'hot';
  document.getElementById('m-cat').value      = questionExistante?.category   || '';
  document.getElementById('m-them').value     = questionExistante?.thematique || '';
  document.getElementById('m-question').value = questionExistante?.question   || '';
  document.getElementById('m-answer').value   = questionExistante?.answer     || '';

  // Alimenter les datalists avec les valeurs existantes
  const toutesLesCategories   = [...new Set(questions.map(q => q.category).filter(Boolean))];
  const toutesLesThematiques  = [...new Set(questions.map(q => q.thematique).filter(Boolean))];

  document.getElementById('cat-datalist').innerHTML =
    toutesLesCategories.map(categorie => `<option value="${categorie}">`).join('');

  document.getElementById('them-datalist').innerHTML =
    toutesLesThematiques.map(thematique => `<option value="${thematique}">`).join('');

  document.getElementById('modal-overlay').classList.remove('hidden');
  document.getElementById('m-question').focus();
}

/** Ferme le modal et réinitialise l'état d'édition. */
export function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  questionEnCoursEditionId = null;
}

/**
 * Valide le formulaire, crée ou met à jour la question, puis ferme le modal.
 * Appelé par le bouton "Enregistrer".
 */
export function saveQuestion() {
  const projetSelectionne  = document.getElementById('m-proj').value.trim();
  const niveauFrequence    = document.getElementById('m-freq').value.trim();
  const categorieQuestion  = document.getElementById('m-cat').value.trim();
  const thematiqueQuestion = document.getElementById('m-them').value.trim();
  const texteQuestion      = document.getElementById('m-question').value.trim();
  const texteReponse       = document.getElementById('m-answer').value.trim();

  if (!projetSelectionne || !categorieQuestion || !texteQuestion || !texteReponse) {
    showToast('⚠️ Remplissez tous les champs obligatoires (*).');
    return;
  }

  if (questionEnCoursEditionId) {
    const modificationReussie = updateQuestion(questionEnCoursEditionId, {
      proj:       projetSelectionne,
      freq:       niveauFrequence,
      category:   categorieQuestion,
      thematique: thematiqueQuestion,
      question:   texteQuestion,
      answer:     texteReponse,
    });
    showToast(modificationReussie ? '✅ Question modifiée.' : '❌ Question introuvable.');
  } else {
    addQuestion({
      id:         newId(projetSelectionne),
      proj:       projetSelectionne,
      num:        0,
      category:   categorieQuestion,
      thematique: thematiqueQuestion,
      question:   texteQuestion,
      answer:     texteReponse,
      freq:       niveauFrequence,
    });
    showToast('✅ Question ajoutée.');
  }

  closeModal();
  renderAdmin();
}
