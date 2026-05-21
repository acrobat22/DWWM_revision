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
 * Échappe les caractères spéciaux XML dans les attributs et texte.
 * @param {string} str
 * @returns {string}
 */
function xmlEsc(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&apos;');
}

/**
 * Sérialise toutes les questions en XML et déclenche le téléchargement.
 * Les contenus riches (question HTML, answer HTML) utilisent CDATA.
 */
export function exportXML() {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<questions exported="${new Date().toISOString()}">`,
  ];

  questions.forEach(q => {
    lines.push('  <question>');
    lines.push(`    <id>${xmlEsc(q.id)}</id>`);
    lines.push(`    <proj>${xmlEsc(q.proj)}</proj>`);
    lines.push(`    <category>${xmlEsc(q.category || '')}</category>`);
    lines.push(`    <thematique>${xmlEsc(q.thematique || '')}</thematique>`);
    lines.push(`    <freq>${xmlEsc(q.freq || 'easy')}</freq>`);
    lines.push(`    <question_text><![CDATA[${q.question}]]></question_text>`);
    lines.push(`    <answer><![CDATA[${q.answer}]]></answer>`);
    lines.push('  </question>');
  });

  lines.push('</questions>');

  const xml  = lines.join('\n');
  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `questions_dwwm_${new Date().toISOString().slice(0, 10)}.xml`;
  a.click();
  URL.revokeObjectURL(url);

  showToast(`⬇ ${questions.length} questions exportées.`);
}

/** Ouvre le sélecteur de fichier pour l'import XML. */
export function importXML() {
  document.getElementById('xml-file-input').click();
}

/**
 * Traite le fichier XML sélectionné par l'utilisateur.
 * @param {Event} event - Événement change de l'input file.
 */
export function handleXMLImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => parseAndImport(e.target.result);
  reader.onerror = () => showToast('❌ Impossible de lire le fichier.');
  reader.readAsText(file, 'UTF-8');

  // Réinitialise l'input pour permettre un ré-import du même fichier
  event.target.value = '';
}

/**
 * Parse le contenu XML et importe les questions après confirmation.
 * @param {string} xmlString - Contenu brut du fichier XML.
 */
function parseAndImport(xmlString) {
  let doc;
  try {
    doc = new DOMParser().parseFromString(xmlString, 'application/xml');
  } catch {
    showToast('❌ Fichier XML invalide.');
    return;
  }

  // Vérifie les erreurs de parsing
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    showToast('❌ Erreur de syntaxe XML.');
    return;
  }

  const items = doc.querySelectorAll('question');
  if (!items.length) {
    showToast('⚠️ Aucune question trouvée dans le fichier XML.');
    return;
  }

  const imported = Array.from(items).map(el => ({
    id:         el.querySelector('id')?.textContent             || `import_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    proj:       el.querySelector('proj')?.textContent           || 'p1',
    category:   el.querySelector('category')?.textContent       || '',
    thematique: el.querySelector('thematique')?.textContent     || '',
    freq:       el.querySelector('freq')?.textContent           || 'easy',
    question:   el.querySelector('question_text')?.textContent  || '',
    answer:     el.querySelector('answer')?.textContent         || '',
    num:        0,
  })).filter(q => q.question && q.answer); // Rejette les entrées incomplètes

  if (!imported.length) {
    showToast('⚠️ Aucune question valide dans le fichier.');
    return;
  }

  if (!confirm(`Importer ${imported.length} question(s) ?\n\nATTENTION : toutes les données actuelles seront remplacées.`)) return;

  replaceAll(imported);
  renderAdmin();
  renderQuiz();
  showToast(`✅ ${imported.length} questions importées.`);
}
