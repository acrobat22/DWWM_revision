/**
 * xml.js — Export et import des questions au format XML.
 *
 * Responsabilité unique : sérialiser/désérialiser les données
 * vers/depuis le format XML et déclencher le téléchargement/import.
 */

import { questions, replaceAll } from './store.js';
import { showToast } from './utils.js';
import { renderAdmin } from './admin.js';
import { renderQuiz } from './quiz.js';

/**
 * Échappe les caractères spéciaux pour une insertion sécurisée dans du XML.
 * @param {string} chaineAEchapper
 * @returns {string}
 */
function echapperCaracteresXml(chaineAEchapper) {
  return String(chaineAEchapper)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&apos;');
}

/**
 * Sérialise toutes les questions en XML et déclenche le téléchargement.
 * Les contenus riches (HTML) utilisent des sections CDATA.
 */
export function exportXML() {
  const lignesXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<questions exported="${new Date().toISOString()}">`,
  ];

  questions.forEach(question => {
    lignesXml.push('  <question>');
    lignesXml.push(`    <id>${echapperCaracteresXml(question.id)}</id>`);
    lignesXml.push(`    <proj>${echapperCaracteresXml(question.proj)}</proj>`);
    lignesXml.push(`    <category>${echapperCaracteresXml(question.category || '')}</category>`);
    lignesXml.push(`    <thematique>${echapperCaracteresXml(question.thematique || '')}</thematique>`);
    lignesXml.push(`    <freq>${echapperCaracteresXml(question.freq || 'easy')}</freq>`);
    lignesXml.push(`    <question_text><![CDATA[${question.question}]]></question_text>`);
    lignesXml.push(`    <answer><![CDATA[${question.answer}]]></answer>`);
    lignesXml.push('  </question>');
  });

  lignesXml.push('</questions>');

  const contenuXml      = lignesXml.join('\n');
  const blobXml         = new Blob([contenuXml], { type: 'application/xml;charset=utf-8' });
  const urlTelechargement = URL.createObjectURL(blobXml);
  const lienTelechargement = document.createElement('a');
  lienTelechargement.href     = urlTelechargement;
  lienTelechargement.download = `questions_dwwm_${new Date().toISOString().slice(0, 10)}.xml`;
  lienTelechargement.click();
  URL.revokeObjectURL(urlTelechargement);

  showToast(`⬇ ${questions.length} questions exportées.`);
}

/** Ouvre le sélecteur de fichier pour l'import XML. */
export function importXML() {
  document.getElementById('xml-file-input').click();
}

/**
 * Traite le fichier XML sélectionné par l'utilisateur.
 * @param {Event} evenementChangementFichier - Événement change de l'input file.
 */
export function handleXMLImport(evenementChangementFichier) {
  const fichierSelectionne = evenementChangementFichier.target.files[0];
  if (!fichierSelectionne) return;

  const lecteurFichier = new FileReader();
  lecteurFichier.onload  = evenementLecture => analyserEtImporter(evenementLecture.target.result);
  lecteurFichier.onerror = () => showToast('❌ Impossible de lire le fichier.');
  lecteurFichier.readAsText(fichierSelectionne, 'UTF-8');

  // Réinitialise l'input pour permettre un ré-import du même fichier
  evenementChangementFichier.target.value = '';
}

/**
 * Parse le contenu XML et importe les questions après confirmation.
 * @param {string} contenuXmlBrut - Contenu textuel du fichier XML.
 */
function analyserEtImporter(contenuXmlBrut) {
  let documentXml;
  try {
    documentXml = new DOMParser().parseFromString(contenuXmlBrut, 'application/xml');
  } catch {
    showToast('❌ Fichier XML invalide.');
    return;
  }

  const erreurParsing = documentXml.querySelector('parsererror');
  if (erreurParsing) {
    showToast('❌ Erreur de syntaxe XML.');
    return;
  }

  const noeudsQuestion = documentXml.querySelectorAll('question');
  if (!noeudsQuestion.length) {
    showToast('⚠️ Aucune question trouvée dans le fichier XML.');
    return;
  }

  const questionsImportees = Array.from(noeudsQuestion).map(noeudQuestion => ({
    id:         noeudQuestion.querySelector('id')?.textContent            || `import_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    proj:       noeudQuestion.querySelector('proj')?.textContent          || 'p1',
    category:   noeudQuestion.querySelector('category')?.textContent      || '',
    thematique: noeudQuestion.querySelector('thematique')?.textContent    || '',
    freq:       noeudQuestion.querySelector('freq')?.textContent          || 'easy',
    question:   noeudQuestion.querySelector('question_text')?.textContent || '',
    answer:     noeudQuestion.querySelector('answer')?.textContent        || '',
    num:        0,
  })).filter(question => question.question && question.answer);

  if (!questionsImportees.length) {
    showToast('⚠️ Aucune question valide dans le fichier.');
    return;
  }

  if (!confirm(
    `Importer ${questionsImportees.length} question(s) ?\n\nATTENTION : toutes les données actuelles seront remplacées.`
  )) return;

  replaceAll(questionsImportees);
  renderAdmin();
  renderQuiz();
  showToast(`✅ ${questionsImportees.length} questions importées.`);
}
