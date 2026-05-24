// Fichier généré automatiquement — coller dans js/data-p1.js
// 78 questions — 24/05/2026 20:37:05

export const DATA_P1 = [
  {id:`p1_1`,proj:`p1`,num:1,category:`Modèles & Base de données`,thematique:`Django`,question:`Comment créer des relations entre les modèles Django ?`,answer:`<p>Django propose 3 types de relations :</p>
<pre>class Direction(models.Model):
    nom = models.CharField(max_length=100)

class Service(models.Model):
    # ForeignKey = relation "plusieurs → un"
    # Un service appartient à UNE direction
    direction = models.ForeignKey(Direction, on_delete=models.CASCADE)

class Materiel(models.Model):
    # ManyToManyField = relation "plusieurs ↔ plusieurs"
    logiciels = models.ManyToManyField('Logiciel', through='Installer')</pre>
<p><b>ForeignKey</b> (N→1) : plusieurs matériels pour une structure.<br/>
<b>ManyToManyField</b> (N↔N) : un matériel a plusieurs logiciels, un logiciel est sur plusieurs matériels.<br/>
<b>OneToOneField</b> (1→1) : une seule valeur liée (ex : profil utilisateur).<br/><br/>
<b>on_delete</b> définit ce qui se passe si l'objet lié est supprimé : <code>CASCADE</code> supprime en cascade, <code>PROTECT</code> interdit la suppression, <code>SET_NULL</code> met à null.</p>`,freq:`hot`,},
  {id:`p1_2`,proj:`p1`,num:2,category:`Modèles & Base de données`,thematique:`Django`,question:`Qu'est-ce qu'un mixin et pourquoi l'utilisez-vous ?`,answer:`<p>Un mixin est une classe qui apporte des fonctionnalités réutilisables par héritage multiple, sans être une classe complète elle-même.</p>
<pre>class StructureFilterMixin:
    """Mixin : filtre automatiquement les données par structure."""
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if not request.user.is_superuser:
            return qs.filter(structure=request.user.profil.structure)
        return qs

# On l'applique à plusieurs classes d'admin
class MaterielAdmin(StructureFilterMixin, admin.ModelAdmin): ...
class UtilisateurAdmin(StructureFilterMixin, admin.ModelAdmin): ...</pre>
<p>Sans mixin, il faudrait copier-coller ce code dans chaque classe d'admin. Avec le mixin, on l'écrit une seule fois et on l'hérite partout.</p>`,freq:`hot`,},
  {id:`p1_3`,proj:`p1`,num:3,category:`Modèles & Base de données`,thematique:`Django`,question:`Qu'est-ce qu'une méthode statique ? Pourquoi l'utiliser dans votre service ?`,answer:`<p>Une méthode statique (<code>@staticmethod</code>) appartient à la classe mais ne dépend ni de l'instance (<code>self</code>) ni de la classe (<code>cls</code>). On l'appelle directement sur la classe.</p>
<pre>class MaterielService:
    @staticmethod
    def get_historique_prets(materiel):
        """Pas besoin de self : on ne touche pas à l'état de la classe."""
        return materiel.prets.select_related('utilisateur').order_by('-date_pret')

# Appel : pas besoin d'instancier la classe
historique = MaterielService.get_historique_prets(mon_materiel)</pre>
<p>On l'utilise quand la logique est liée conceptuellement à la classe mais ne modifie aucun attribut. Cela rend le code plus lisible et testable.</p>`,freq:`hot`,},
  {id:`p1_4`,proj:`p1`,num:4,category:`Modèles & Base de données`,thematique:`Django`,question:`Qu'est-ce qu'un signal Django ? Donnez un exemple concret.`,answer:`<p>Un signal est un mécanisme d'événement : quand une action se produit (ex : sauvegarde d'un objet), Django "émet" un signal, et les fonctions qui "écoutent" ce signal sont exécutées automatiquement.</p>
<pre>from django.db.models.signals import pre_save
from django.dispatch import receiver

@receiver(pre_save, sender=Posseder)
def cloture_affectation_precedente(sender, instance, **kwargs):
    """Déclenché AVANT chaque sauvegarde d'une affectation.
    Si c'est une création, on clôture l'ancienne automatiquement."""
    if instance.pk is None and instance.date_fin is None:
        ancienne = Posseder.objects.filter(
            materiel=instance.materiel, date_fin__isnull=True
        ).first()
        if ancienne:
            ancienne.date_fin = instance.date_debut
            ancienne.save()</pre>
<p>Ici le signal clôture l'ancienne affectation sans que l'utilisateur ait à y penser. C'est de la logique automatique et transparente.</p>`,freq:`hot`,},
  {id:`p1_5`,proj:`p1`,num:5,category:`Modèles & Base de données`,thematique:`Django`,question:`Qu'est-ce que <code>select_related()</code> et pourquoi l'utilisez-vous ?`,answer:`<p><code>select_related()</code> résout le problème N+1 : sans lui, Django fait une requête SQL par objet lié. Avec lui, il fait un seul JOIN SQL.</p>
<pre># Sans select_related → 1 requête pour les prêts + 1 par utilisateur
for pret in Pret.objects.all():
    print(pret.utilisateur.nom)  # requête SQL à chaque itération !

# Avec select_related → 1 seule requête SQL avec JOIN
for pret in Pret.objects.select_related('utilisateur'):
    print(pret.utilisateur.nom)  # déjà en mémoire</pre>
<p>Utilisez <code>select_related</code> pour les FK/OneToOne, et <code>prefetch_related</code> pour les ManyToMany.</p>`,freq:`med`,},
  {id:`p1_6`,proj:`p1`,num:6,category:`Modèles & Base de données`,thematique:`Django`,question:`Qu'est-ce qu'une transaction atomique et pourquoi en avez-vous besoin ?`,answer:`<p>Une transaction atomique garantit que plusieurs opérations en base de données réussissent toutes ensemble, ou qu'aucune n'est appliquée (tout ou rien).</p>
<pre>from django.db import transaction

with transaction.atomic():
    materiel.statut = 'stock'
    materiel.save()           # Si ça plante ici...
    pret.est_rendu = True
    pret.save()               # ...cette ligne n'est pas exécutée non plus</pre>
<p>Dans le retour de prêt, si la mise à jour du statut réussit mais que la sauvegarde du prêt échoue, on aurait un état incohérent. La transaction atomique évite ça.</p>`,freq:`hot`,},
  {id:`p1_7`,proj:`p1`,num:7,category:`Modèles & Base de données`,thematique:`Django`,question:`Qu'est-ce que <code>select_for_update()</code> et pourquoi l'utilisez-vous pour les codes matériel ?`,answer:`<p><code>select_for_update()</code> pose un verrou sur les lignes lues, empêchant d'autres transactions de les modifier jusqu'à la fin. Cela évite les doublons en accès concurrent.</p>
<pre>with transaction.atomic():
    # Verrouille toutes les lignes PC avant de lire la séquence max
    qs = Materiel.objects.select_for_update().filter(type_materiel=type_pc)
    dernier = qs.order_by('-sequence').first()
    prochain = 1 if dernier is None else dernier.sequence + 1
    instance.code = f"PC-{prochain:02d}"</pre>
<p>Sans ce verrou, deux créations simultanées pourraient lire la même séquence et générer deux fois <code>PC-01</code>.</p>`,freq:`med`,},
  {id:`p1_8`,proj:`p1`,num:8,category:`Modèles & Base de données`,thematique:`Django`,question:`Quelle est la différence entre <code>clean()</code> et <code>save()</code> dans un modèle ?`,answer:`<p><code>clean()</code> valide les données avant de les enregistrer (lève une <code>ValidationError</code> si les données sont incorrectes). <code>save()</code> écrit en base de données.</p>
<pre>class Pret(models.Model):
    def clean(self):
        # Validation : la date de restitution doit être après la date de prêt
        if self.date_restitution and self.date_pret:
            if self.date_restitution &lt; self.date_pret:
                raise ValidationError(
                    "La date de restitution ne peut pas être antérieure au prêt."
                )

    def save(self, *args, **kwargs):
        self.full_clean()  # Appelle clean() avant d'écrire
        super().save(*args, **kwargs)</pre>`,freq:`med`,},
  {id:`p1_9`,proj:`p1`,num:9,category:`Modèles & Base de données`,thematique:`Django`,question:`Qu'est-ce qu'une <code>CheckConstraint</code> et pourquoi l'utilisez-vous en plus de <code>clean()</code> ?`,answer:`<p>Une <code>CheckConstraint</code> est une contrainte directement en base de données (SQL CHECK). Elle garantit l'intégrité même si quelqu'un insère des données sans passer par Django (import CSV, accès direct SQL).</p>
<pre>class Utilisateur(models.Model):
    service   = models.ForeignKey(Service,   null=True, blank=True, ...)
    direction = models.ForeignKey(Direction, null=True, blank=True, ...)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=(
                    Q(service__isnull=False, direction__isnull=True) |
                    Q(service__isnull=True,  direction__isnull=False)
                ),
                name='utilisateur_service_xor_direction'
            )
        ]</pre>
<p><code>clean()</code> protège via Python (côté applicatif). <code>CheckConstraint</code> protège au niveau BDD. Les deux ensemble = double protection.</p>`,freq:`med`,},
  {id:`p1_10`,proj:`p1`,num:10,category:`ORM & Requêtes`,thematique:`Django`,question:`Comment fonctionne l'ORM Django ? Pourquoi protège-t-il des injections SQL ?`,answer:`<p>L'ORM (Object-Relational Mapper) traduit les objets Python en requêtes SQL. Il utilise des requêtes paramétrées : les valeurs ne sont jamais insérées directement dans le SQL, elles sont toujours passées séparément au moteur de BDD.</p>
<pre># Ce que vous écrivez en Python :
Materiel.objects.filter(statut='en_service', structure=ma_structure)

# Ce que Django envoie à SQLite (paramétré) :
# SELECT * FROM materiel WHERE statut = ? AND structure_id = ?
# params: ('en_service', 5)  ← jamais concaténé dans la chaîne SQL</pre>
<p>Même si un utilisateur malveillant saisit <code>' OR 1=1 --</code>, cette valeur est traitée comme un texte littéral, jamais comme du SQL exécutable.</p>`,freq:`hot`,},
  {id:`p1_11`,proj:`p1`,num:11,category:`ORM & Requêtes`,thematique:`Django`,question:`Qu'est-ce qu'une migration Django et comment cela fonctionne-t-il ?`,answer:`<p>Une migration est un fichier Python qui décrit une modification du schéma de la base de données (ajout de table, de colonne, de contrainte…). C'est le système de versionnage du schéma.</p>
<pre># 1. Créer la migration après modification du modèle
python manage.py makemigrations

# 2. Appliquer la migration en base
python manage.py migrate

# Voir l'état des migrations
python manage.py showmigrations</pre>
<p>Chaque migration est numérotée (<code>0001_initial.py</code>, <code>0002_add_column.py</code>…) et peut être rejouée sur n'importe quel environnement. C'est ce qui permet à <code>deploy.sh</code> de mettre à jour la BDD en production automatiquement.</p>`,freq:`easy`,},
  {id:`p1_12`,proj:`p1`,num:12,category:`Sécurité`,thematique:`Django`,question:`Qu'est-ce qu'une attaque CSRF et comment Django s'en protège-t-il ?`,answer:`<p>CSRF (Cross-Site Request Forgery) : un site malveillant force le navigateur de l'utilisateur connecté à envoyer une requête à votre site à son insu.</p>
<p>Django génère un token CSRF unique par session, caché dans chaque formulaire. Le serveur vérifie ce token à chaque requête POST. Un site externe ne peut pas connaître ce token.</p>
<pre>&lt;!-- Dans chaque formulaire Django --&gt;
{% csrf_token %}
&lt;!-- Génère : &lt;input type="hidden" name="csrfmiddlewaretoken" value="abc123..."&gt; --&gt;

// Dans les requêtes AJAX :
headers: { 'X-CSRFToken': csrfToken }</pre>`,freq:`hot`,},
  {id:`p1_13`,proj:`p1`,num:13,category:`Sécurité`,thematique:`Django`,question:`Qu'est-ce qu'une attaque XSS et comment l'avez-vous évitée ?`,answer:`<p>XSS (Cross-Site Scripting) : un attaquant injecte du code JavaScript malveillant dans une page pour voler des données ou prendre le contrôle du navigateur.</p>
<p>Django échappe automatiquement tous les caractères dangereux dans les templates : <code>&lt;</code> devient <code>&amp;lt;</code>, <code>&gt;</code> devient <code>&amp;gt;</code>, etc. Même si un utilisateur saisit <code>&lt;script&gt;alert('hack')&lt;/script&gt;</code>, Django l'affiche comme du texte, il n'est pas exécuté.</p>`,freq:`hot`,},
  {id:`p1_14`,proj:`p1`,num:14,category:`Sécurité`,thematique:`Django`,question:`Pourquoi avez-vous mis en place une session unique par utilisateur ?`,answer:`<p>Pour éviter qu'un technicien reste connecté sur un PC public oublié pendant que quelqu'un d'autre se connecte avec son compte. Quand une nouvelle connexion est détectée, l'ancienne session est immédiatement invalidée.</p>
<pre>class UniqueSessionMiddleware:
    def __call__(self, request):
        if request.user.is_authenticated:
            session_active = SessionActive.objects.filter(user=request.user).first()
            if session_active and session_active.session_key != request.session.session_key:
                # Invalider l'ancienne session
                Session.objects.filter(session_key=session_active.session_key).delete()</pre>`,freq:`hot`,},
  {id:`p1_15`,proj:`p1`,num:15,category:`Sécurité`,thematique:`Django`,question:`Pourquoi stocker les secrets dans un fichier <code>.env</code> plutôt que dans le code ?`,answer:`<p>Si <code>SECRET_KEY</code> est dans le code, elle est visible par tous ceux qui ont accès au dépôt Git (y compris l'historique). Un attaquant connaissant la <code>SECRET_KEY</code> peut forger des cookies de session et des tokens CSRF.</p>
<p>Le fichier <code>.env</code> n'est jamais commité (ajouté au <code>.gitignore</code>). Un fichier <code>.env.example</code> documente les variables attendues sans exposer les valeurs réelles.</p>`,freq:`easy`,},
  {id:`p1_16`,proj:`p1`,num:16,category:`Architecture & Déploiement`,thematique:`Django`,question:`Quel est le rôle de Nginx par rapport à Gunicorn ?`,answer:`<p><b>Nginx</b> est le serveur web en façade : il gère les connexions HTTP/HTTPS, sert les fichiers statiques (CSS, JS, images) très rapidement sans passer par Python, et transfère uniquement les requêtes dynamiques à Gunicorn.</p>
<p><b>Gunicorn</b> est le serveur d'application Python (WSGI) : il exécute Django et gère les requêtes dynamiques avec plusieurs workers en parallèle.</p>
<p>Django seul (<code>runserver</code>) n'est pas fait pour la production : il ne gère pas la concurrence correctement et sert les fichiers statiques lentement.</p>`,freq:`med`,},
  {id:`p1_17`,proj:`p1`,num:17,category:`Architecture & Déploiement`,thematique:`Django`,question:`Comment fonctionne votre script <code>deploy.sh</code> ? Pourquoi le mode <code>--dry-run</code> ?`,answer:`<p>Le script enchaîne toutes les étapes de mise à jour : sauvegarde BDD → git pull → pip install → migrate → collectstatic → restart Gunicorn → reload Nginx. Chaque étape est journalisée avec un horodatage.</p>
<p>Le mode <code>--dry-run</code> affiche ce qui serait exécuté sans rien faire. Il permet de vérifier qu'aucune migration cassante n'attend avant de déployer en production, sans risquer d'interrompre le service.</p>`,freq:`med`,},
  {id:`p1_18`,proj:`p1`,num:18,category:`Architecture & Déploiement`,thematique:`Django`,question:`Pourquoi avez-vous utilisé <code>X-Accel-Redirect</code> pour les fichiers uploadés ?`,answer:`<p>Sans protection, les fichiers dans <code>/media/</code> sont accessibles directement via leur URL, sans authentification. N'importe qui connaissant l'URL pourrait télécharger une facture ou un bon de livraison.</p>
<p>Avec <code>X-Accel-Redirect</code> : Django vérifie d'abord que l'utilisateur est connecté, puis renvoie un header spécial à Nginx pour servir le fichier. Le fichier ne passe jamais par Python, mais il n'est accessible qu'après vérification.</p>`,freq:`med`,},
  {id:`p1_19`,proj:`p1`,num:19,category:`Principes de programmation`,thematique:`Django`,question:`Qu'est-ce que le principe DRY ?`,answer:`<p>DRY = "Don't Repeat Yourself" (ne pas se répéter). Toute logique doit exister à un seul endroit dans le code. Si vous copiez-collez du code, c'est un signal que quelque chose doit être factorisé en fonction, classe ou mixin.</p>
<p>Dans votre projet : le filtrage par structure est dans le mixin <code>StructureFilterMixin</code>, la logique de prêt dans <code>MaterielService</code>. Changer ces règles à un seul endroit met à jour tout le comportement.</p>`,freq:`easy`,},
  {id:`p1_20`,proj:`p1`,num:20,category:`Principes de programmation`,thematique:`Django`,question:`Qu'est-ce que le principe SRP (Single Responsibility Principle) ?`,answer:`<p>SRP : chaque classe ou module ne doit avoir qu'une seule raison de changer — une seule responsabilité.</p>
<p>Dans votre projet :<br/>
        — Le modèle <code>Pret</code> gère la structure de données et la validation.<br/>
        — Le signal gère la clôture automatique des affectations.<br/>
        — <code>MaterielService</code> gère la logique métier réutilisable.<br/>
        Si vous mélangez tout dans le modèle, il devient difficile à tester et à maintenir.</p>`,freq:`easy`,},
  {id:`p1_21`,proj:`p1`,num:21,category:`Principes de programmation`,thematique:`Django`,question:`Qu'est-ce qu'une propriété calculée (<code>@property</code>) en Python ?`,answer:`<p>Un <code>@property</code> permet d'accéder à une valeur calculée comme si c'était un attribut, sans l'écrire en base de données.</p>
<pre>class Pret(models.Model):
    date_restitution = models.DateField()
    est_rendu        = models.BooleanField(default=False)

    @property
    def est_en_retard(self):
        """Calculé à la volée — pas stocké en BDD."""
        if self.est_rendu:
            return False
        return date.today() &gt; self.date_restitution

# Utilisation : pret.est_en_retard  (pas pret.est_en_retard())</pre>`,freq:`med`,},
  {id:`p1_22`,proj:`p1`,num:22,category:`Principes de programmation`,thematique:`Django`,question:`Comment avez-vous réalisé les exports PDF et Excel ?`,answer:`<p><b>PDF</b> avec ReportLab : on construit le document Python en définissant les éléments (titre, tableau, style) puis on génère un fichier binaire qu'on renvoie avec <code>Content-Disposition: attachment</code>.</p>
<p><b>Excel</b> avec openpyxl : on crée un classeur Python, on écrit les données cellule par cellule, on applique des styles, puis on le sauvegarde dans un buffer mémoire et on l'envoie en téléchargement.</p>
<p>Les deux utilisent des vues Django protégées par <code>@login_required</code> — pas de téléchargement anonyme.</p>`,freq:`easy`,},
  {id:`p1_23`,proj:`p1`,num:23,category:`Tests`,thematique:`Django`,question:`Qu'est-ce qu'un test unitaire ? Comment en avez-vous écrit ?`,answer:`<p>Un test unitaire vérifie qu'une fonction ou méthode précise produit le bon résultat dans un cas donné. Il est isolé : il ne dépend pas du réseau, d'autres services ou d'autres tests.</p>
<pre>class MaterielCreationTests(TestCase):
    def test_code_unique_en_creation_concurrente(self):
        """4 threads créent un PC en même temps → codes uniques."""
        from concurrent.futures import ThreadPoolExecutor
        def creer_pc():
            Materiel.objects.create(type_materiel=self.type_pc, ...)
        with ThreadPoolExecutor(max_workers=4) as ex:
            futures = [ex.submit(creer_pc) for _ in range(4)]
        codes = list(Materiel.objects.values_list('code', flat=True))
        self.assertEqual(len(codes), len(set(codes)))  # Pas de doublons</pre>`,freq:`med`,},
  {id:`p1_24`,proj:`p1`,num:24,category:`Tests`,thematique:`Django`,question:`Qu'est-ce qu'un jeu d'essai et comment l'avez-vous construit ?`,answer:`<p>Un jeu d'essai est un ensemble de cas de test qui vérifient qu'une fonctionnalité se comporte correctement. Pour chaque cas, on définit : les données en entrée, le résultat attendu, et le résultat réellement obtenu.</p>
<p>Pour la fonctionnalité de prêt :<br/>
        — Cas nominal : prêt créé avec les bonnes dates → ✅ utilisateur pré-rempli<br/>
        — Cas d'erreur : date restitution avant date prêt → ✅ ValidationError levée<br/>
        — Cas limite : prêt en retard → ✅ badge rouge affiché<br/>
        — Cas concurrence : 4 matériels créés simultanément → ✅ 0 doublon de code</p>`,freq:`hot`,},
  {id:`p1_25`,proj:`p1`,num:25,category:`Tests`,thematique:`Django`,question:`Qu'est-ce qu'une commande de gestion Django (<code>management command</code>) ?`,answer:`<p>C'est un script Python qu'on peut appeler en ligne de commande via <code>python manage.py mon_commande</code>. Il a accès à tout l'environnement Django (modèles, BDD, settings).</p>
<pre># Structure : parcinformatique/management/commands/envoyer_alertes_pret.py
class Command(BaseCommand):
    help = 'Envoie les alertes email pour les prêts en retard'

    def add_arguments(self, parser):
        parser.add_argument('--seuil', type=int, default=7)
        parser.add_argument('--dry-run', action='store_true')

    def handle(self, *args, **options):
        prets = Pret.objects.filter(est_rendu=False, ...)
        # ... logique d'envoi email</pre>
<p>Planifié dans cron : <code>0 8 * * * python manage.py envoyer_alertes_pret --seuil 7</code></p>`,freq:`med`,},
  {id:`p1_26`,proj:`p1`,num:26,category:`Tests`,thematique:`Django`,question:`Qu'est-ce que le Django Admin et comment l'avez-vous personnalisé ?`,answer:`<p>Django Admin est une interface d'administration auto-générée à partir des modèles. Elle permet de créer, lire, modifier et supprimer des données sans développer un front-end custom.</p>
<p>Personnalisations réalisées :<br/>
        — Templates HTML surchargés (<code>base_site.html</code>, <code>nav_sidebar.html</code>, <code>change_list.html</code>) pour la charte graphique<br/>
        — Tailwind CSS pour le style responsive<br/>
        — Filtres avancés personnalisés (<code>list_filter</code>, <code>search_fields</code>)<br/>
        — Actions personnalisées (exporter en PDF/Excel)<br/>
        — Mixins de permission pour le filtrage par structure</p>`,freq:`easy`,},
  {id:`p1_27`,proj:`p1`,num:27,category:`Tests`,thematique:`Django`,question:`Qu'est-ce que <code>update_fields</code> dans <code>save()</code> ?`,answer:`<p>Par défaut, <code>save()</code> met à jour toutes les colonnes de la ligne en BDD. <code>update_fields</code> restreint la mise à jour aux seules colonnes spécifiées, ce qui est plus performant et évite d'écraser des modifications concurrentes.</p>
<pre># Met à jour TOUTES les colonnes (risque d'écrasement)
pret.save()

# Met à jour SEULEMENT est_rendu et date_retour_reelle
pret.save(update_fields=['est_rendu', 'date_retour_reelle'])</pre>
<p>Dans le service de retour de prêt, les 3 objets modifiés utilisent <code>update_fields</code> pour minimiser les requêtes SQL et éviter les conflits.</p>`,freq:`med`,},
  {id:`p1_28`,proj:`p1`,num:28,category:`Tests`,thematique:`Django`,question:`Qu'est-ce que la RGPD et comment en avez-vous tenu compte ?`,answer:`<p>Le RGPD (Règlement Général sur la Protection des Données) impose de protéger les données personnelles des utilisateurs : collecte minimale, sécurisation, accès restreint.</p>
<p>Mesures prises :<br/>
        — Accès par rôle (profil consultation / staff / superuser)<br/>
        — Données personnelles (noms des agents) non exportées en clair dans les CSV publics<br/>
        — Fichiers joints (factures) accessibles uniquement aux utilisateurs connectés<br/>
        — Mots de passe hashés par Django (PBKDF2 SHA-256 par défaut)</p>`,freq:`easy`,},
  {id:`p1_python_1`,proj:`p1`,num:29,category:`Python 3.12 — Fondamentaux`,thematique:`Python 3.12`,question:`Qu'est-ce que Python et quelles sont les nouveautés de la version 3.12 ?`,answer:`<p>Python est un langage interprété, à typage dynamique, orienté objet et très lisible.
Les principales nouveautés de Python 3.12 (sortie octobre 2023) :</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>f-strings améliorées</b> : expressions imbriquées et guillemets libres à l'intérieur</li>
  <li><b>Meilleure gestion des erreurs</b> : messages d'erreur encore plus précis (suite de 3.11)</li>
  <li><b>Type Parameter Syntax</b> : nouvelle syntaxe <code>type</code> pour les alias de types</li>
  <li><b>Performances</b> : CPython 3.12 est ~5% plus rapide que 3.11</li>
  <li><b>Suppression des <code>distutils</code></b> (déprécié depuis 3.10)</li>
</ul>
<pre>python3 --version  # Python 3.12.x
# Nouvelle syntaxe d'alias de type
type Vecteur = list[float]</pre>`,freq:`hot`,},
  {id:`p1_python_2`,proj:`p1`,num:30,category:`Python 3.12 — Fondamentaux`,thematique:`Python 3.12`,question:`Quelle est la différence entre une liste, un tuple et un set en Python ?`,answer:`<p>Ces trois structures stockent des collections de valeurs, mais avec des comportements différents :</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>list</b> : ordonnée, <b>modifiable</b>, doublons autorisés — <code>[1, 2, 3]</code></li>
  <li><b>tuple</b> : ordonnée, <b>non modifiable</b> (immuable), doublons autorisés — <code>(1, 2, 3)</code></li>
  <li><b>set</b> : non ordonnée, modifiable, <b>pas de doublons</b> — <code>{1, 2, 3}</code></li>
</ul>
<pre>liste = [1, 2, 2, 3]     # ['duplicatas autorisés']
tuple_ex = (1, 2, 3)     # immuable, TypeError si on essaie de modifier
ensemble = {1, 2, 2, 3}  # {1, 2, 3} — les doublons sont supprimés

# Quand utiliser quoi ?
# list  → données qui changent (panier, résultats)
# tuple → coordonnées, clés de dictionnaire
# set   → vérifier l'appartenance rapidement</pre>`,freq:`hot`,},
  {id:`p1_python_3`,proj:`p1`,num:31,category:`Python 3.12 — Fondamentaux`,thematique:`Python 3.12`,question:`Qu'est-ce qu'un dictionnaire en Python et comment l'utiliser ?`,answer:`<p>Un dictionnaire (<code>dict</code>) stocke des paires <b>clé → valeur</b>. Les clés sont uniques et doivent être immuables.</p>
<pre>etudiant = {
    "nom":    "Alice",
    "age":    25,
    "notes":  [14, 16, 18]
}

# Accès
print(etudiant["nom"])             # "Alice"
print(etudiant.get("email", "—"))  # "—" si clé absente (pas d'erreur)

# Modification
etudiant["age"] = 26

# Itération
for cle, valeur in etudiant.items():
    print(f"{cle} : {valeur}")

# Python 3.12 : les dicts conservent l'ordre d'insertion (depuis 3.7)</pre>`,freq:`hot`,},
  {id:`p1_python_4`,proj:`p1`,num:32,category:`Python 3.12 — Fondamentaux`,thematique:`Python 3.12`,question:`Qu'est-ce qu'une f-string et quelles sont les améliorations de Python 3.12 ?`,answer:`<p>Une f-string (<code>f"..."</code>) permet d'insérer des expressions Python directement dans une chaîne.</p>
<p><b>Python 3.12</b> lève les restrictions sur les guillemets à l'intérieur des f-strings :</p>
<pre># Avant Python 3.12 — impossible de réutiliser le même guillemet
nom = "Alice"
print(f"Bonjour {nom.upper()}")  # Bonjour ALICE

# Python 3.12 — guillemets libres dans les expressions
prenoms = ["Alice", "Bob"]
print(f"Premier : {prenoms[0]}")              # OK dans toutes versions
print(f"Noms : {", ".join(prenoms)}")         # Nouveau en 3.12 !
print(f"{'Alice' if True else 'Bob'}")        # Nouveau en 3.12 !

# Multi-ligne aussi supporté en 3.12
message = (
    f"Nom : {nom!r}"    # !r = repr(), !s = str(), !a = ascii()
)</pre>`,freq:`hot`,},
  {id:`p1_python_5`,proj:`p1`,num:33,category:`Python 3.12 — Fondamentaux`,thematique:`Python 3.12`,question:`Comment fonctionne la gestion des exceptions avec try/except/finally ?`,answer:`<p>Le bloc <code>try</code> tente d'exécuter du code ; <code>except</code> intercepte les erreurs ; <code>finally</code> s'exécute toujours.</p>
<pre>def diviser(numerateur, denominateur):
    try:
        resultat = numerateur / denominateur
    except ZeroDivisionError:
        print("Division par zéro impossible")
        return None
    except TypeError as erreur:
        print(f"Type invalide : {erreur}")
        return None
    else:
        # Exécuté uniquement si aucune exception
        print(f"Résultat : {resultat}")
        return resultat
    finally:
        # Toujours exécuté (nettoyage, fermeture de fichier…)
        print("Calcul terminé")

# Python 3.11+ : ExceptionGroup (capture plusieurs exceptions simultanées)
try:
    raise ExceptionGroup("erreurs", [ValueError("v"), TypeError("t")])
except* ValueError as groupe:
    print("ValueError interceptée")</pre>`,freq:`hot`,},
  {id:`p1_python_6`,proj:`p1`,num:34,category:`Python 3.12 — Fondamentaux`,thematique:`Python 3.12`,question:`Qu'est-ce que le mot-clé \`with\` et les context managers ?`,answer:`<p>Le mot-clé <code>with</code> garantit qu'une ressource (fichier, connexion BDD) est correctement fermée même en cas d'erreur.</p>
<pre># Sans with — risque de ne pas fermer le fichier en cas d'erreur
fichier = open("data.txt", "r")
contenu = fichier.read()
fichier.close()  # Oublié si une exception survient avant

# Avec with — fermeture automatique garantie
with open("data.txt", "r", encoding="utf-8") as fichier:
    contenu = fichier.read()
# fichier.close() appelé automatiquement ici

# Plusieurs ressources simultanées
with open("source.txt") as source, open("dest.txt", "w") as dest:
    dest.write(source.read())

# Créer son propre context manager avec __enter__ / __exit__
class Minuteur:
    def __enter__(self):
        import time; self.debut = time.time(); return self
    def __exit__(self, *args):
        print(f"Durée : {time.time() - self.debut:.2f}s")</pre>`,freq:`med`,},
  {id:`p1_python_7`,proj:`p1`,num:35,category:`Python 3.12 — Fonctions`,thematique:`Python 3.12`,question:`Quelle est la différence entre arguments positionnels, nommés et \`*args\`/\`**kwargs\` ?`,answer:`<pre>def exemple(obligatoire, optionnel="valeur_defaut", *arguments_positionnels, **arguments_nommes):
    print(obligatoire)               # Argument obligatoire
    print(optionnel)                 # Optionnel avec valeur par défaut
    print(arguments_positionnels)   # Tuple des arguments positionnels supplémentaires
    print(arguments_nommes)         # Dict des arguments nommés supplémentaires

exemple("requis", "opt", 1, 2, 3, couleur="rouge", taille=42)
# "requis"
# "opt"
# (1, 2, 3)
# {'couleur': 'rouge', 'taille': 42}

# Python 3.12 — paramètres positionnels uniquement (/)
def position_seulement(x, y, /, z):
    return x + y + z
# position_seulement(1, 2, z=3)  ✅
# position_seulement(x=1, y=2, z=3)  ❌ TypeError</pre>`,freq:`med`,},
  {id:`p1_python_8`,proj:`p1`,num:36,category:`Python 3.12 — Fonctions`,thematique:`Python 3.12`,question:`Qu'est-ce qu'une fonction lambda et quand l'utiliser ?`,answer:`<p>Une <b>lambda</b> est une fonction anonyme sur une seule ligne. Elle est utile pour des opérations courtes passées en argument.</p>
<pre># Syntaxe : lambda parametres: expression
doubler = lambda x: x * 2
print(doubler(5))  # 10

# Cas d'usage typique : tri personnalisé
etudiants = [{"nom": "Bob", "note": 14}, {"nom": "Alice", "note": 18}]
etudiants.sort(key=lambda etudiant: etudiant["note"], reverse=True)

# Avec map() et filter()
nombres = [1, 2, 3, 4, 5]
carres  = list(map(lambda n: n**2, nombres))      # [1, 4, 9, 16, 25]
pairs   = list(filter(lambda n: n % 2 == 0, nombres))  # [2, 4]

# ⚠️ Pour la lisibilité, préférer une fonction normale si la logique est complexe</pre>`,freq:`med`,},
  {id:`p1_python_9`,proj:`p1`,num:37,category:`Python 3.12 — Fonctions`,thematique:`Python 3.12`,question:`Qu'est-ce qu'un décorateur et comment en créer un ?`,answer:`<p>Un <b>décorateur</b> est une fonction qui enveloppe une autre fonction pour lui ajouter un comportement sans modifier son code.</p>
<pre>import functools

def journaliser(fonction_originale):
    """Décorateur qui affiche les appels de fonction."""
    @functools.wraps(fonction_originale)  # Préserve le nom et la docstring
    def enveloppe(*args, **kwargs):
        print(f"Appel de {fonction_originale.__name__} avec {args}")
        resultat = fonction_originale(*args, **kwargs)
        print(f"Résultat : {resultat}")
        return resultat
    return enveloppe

@journaliser
def additionner(a, b):
    return a + b

additionner(3, 4)
# Appel de additionner avec (3, 4)
# Résultat : 7</pre>`,freq:`med`,},
  {id:`p1_python_10`,proj:`p1`,num:38,category:`Python 3.12 — Fonctions`,thematique:`Python 3.12`,question:`Qu'est-ce qu'un générateur et quelle est la différence avec une liste ?`,answer:`<p>Un <b>générateur</b> produit les valeurs à la demande (lazy evaluation) au lieu de tout stocker en mémoire.</p>
<pre># Liste — tout calculé et stocké en mémoire d'un coup
liste_carres = [x**2 for x in range(1_000_000)]  # ~8 Mo en mémoire

# Générateur — calcule une valeur à la fois, mémoire quasi nulle
def generateur_carres(limite):
    for x in range(limite):
        yield x**2  # yield suspend la fonction et retourne la valeur

gen = generateur_carres(1_000_000)
print(next(gen))  # 0
print(next(gen))  # 1

# Expression génératrice (syntaxe compacte)
somme = sum(x**2 for x in range(1_000_000))  # Pas de liste intermédiaire !

# Quand utiliser ?
# → Fichiers très grands, flux de données, séquences infinies</pre>`,freq:`med`,},
  {id:`p1_python_11`,proj:`p1`,num:39,category:`Python 3.12 — POO`,thematique:`Python 3.12`,question:`Qu'est-ce qu'une classe et comment en créer une ?`,answer:`<pre>class Etudiant:
    """Représente un étudiant avec son nom et ses notes."""

    # Attribut de classe (partagé par toutes les instances)
    etablissement = "DWWM Formation"

    def __init__(self, nom: str, age: int):
        """Constructeur — initialise les attributs d'instance."""
        self.nom  = nom   # Attribut d'instance
        self.age  = age
        self.notes: list[float] = []

    def ajouter_note(self, note: float) -> None:
        """Ajoute une note à la liste."""
        self.notes.append(note)

    def calculer_moyenne(self) -> float:
        """Retourne la moyenne ou 0 si aucune note."""
        return sum(self.notes) / len(self.notes) if self.notes else 0.0

    def __repr__(self) -> str:
        """Représentation lisible pour le débogage."""
        return f"Etudiant(nom={self.nom!r}, moyenne={self.calculer_moyenne():.1f})"

alice = Etudiant("Alice", 25)
alice.ajouter_note(16)
print(alice)  # Etudiant(nom='Alice', moyenne=16.0)</pre>`,freq:`hot`,},
  {id:`p1_python_12`,proj:`p1`,num:40,category:`Python 3.12 — POO`,thematique:`Python 3.12`,question:`Qu'est-ce que l'héritage en Python et comment l'utiliser ?`,answer:`<pre>class Animal:
    def __init__(self, nom: str):
        self.nom = nom

    def parler(self) -> str:
        raise NotImplementedError("Sous-classe doit implémenter parler()")

    def __str__(self) -> str:
        return f"{self.__class__.__name__}({self.nom})"


class Chien(Animal):
    def parler(self) -> str:
        return "Ouaf !"

    def rapporter(self, objet: str) -> str:
        return f"{self.nom} rapporte {objet}"


class Chat(Animal):
    def parler(self) -> str:
        return "Miaou !"


# isinstance() vérifie l'héritage
rex = Chien("Rex")
print(isinstance(rex, Animal))  # True
print(isinstance(rex, Chien))   # True

# super() appelle la méthode de la classe parente
class ChienDressé(Chien):
    def __init__(self, nom: str, commandes: list[str]):
        super().__init__(nom)   # Appelle Animal.__init__
        self.commandes = commandes</pre>`,freq:`hot`,},
  {id:`p1_python_13`,proj:`p1`,num:41,category:`Python 3.12 — POO`,thematique:`Python 3.12`,question:`Que sont les dataclasses et pourquoi les utiliser ?`,answer:`<p>Les <code>dataclasses</code> (module standard) génèrent automatiquement <code>__init__</code>, <code>__repr__</code> et <code>__eq__</code> pour les classes de données.</p>
<pre>from dataclasses import dataclass, field

@dataclass
class Point:
    x: float
    y: float

    def distance_origine(self) -> float:
        return (self.x**2 + self.y**2) ** 0.5

# __init__, __repr__ et __eq__ générés automatiquement
point_a = Point(3.0, 4.0)
point_b = Point(3.0, 4.0)
print(point_a)           # Point(x=3.0, y=4.0)
print(point_a == point_b)  # True

@dataclass
class Etudiant:
    nom: str
    age: int
    notes: list[float] = field(default_factory=list)  # Valeur mutable par défaut

    # Python 3.12 : @dataclass(slots=True) pour de meilleures performances
</pre>`,freq:`med`,},
  {id:`p1_python_14`,proj:`p1`,num:42,category:`Python 3.12 — Typage`,thematique:`Python 3.12`,question:`Qu'est-ce que le type hinting et comment l'utiliser ?`,answer:`<p>Le <b>type hinting</b> documente les types attendus sans les imposer à l'exécution. Utile pour les IDE et les outils d'analyse statique (mypy).</p>
<pre>from typing import Optional

# Python 3.12 — nouvelle syntaxe type alias
type Identifiant = int
type ListeNotes  = list[float]

def calculer_moyenne(notes: ListeNotes) -> float:
    """
    Args:
        notes: Liste de notes entre 0 et 20.
    Returns:
        Moyenne des notes, 0.0 si liste vide.
    """
    return sum(notes) / len(notes) if notes else 0.0

def chercher_etudiant(identifiant: Identifiant) -> Optional[str]:
    """Retourne le nom ou None si non trouvé."""
    base = {1: "Alice", 2: "Bob"}
    return base.get(identifiant)

# Python 3.10+ : X | Y au lieu de Optional[X]
def chercher_v2(identifiant: int) -> str | None:
    return None</pre>`,freq:`med`,},
  {id:`p1_python_15`,proj:`p1`,num:43,category:`Python 3.12 — Fichiers`,thematique:`Python 3.12`,question:`Comment lire et écrire des fichiers en Python ?`,answer:`<pre>from pathlib import Path

# Lecture — méthode recommandée avec pathlib (Python 3.4+)
chemin_fichier = Path("data") / "questions.txt"

if chemin_fichier.exists():
    contenu = chemin_fichier.read_text(encoding="utf-8")
    lignes  = chemin_fichier.read_text(encoding="utf-8").splitlines()

# Écriture
chemin_fichier.write_text("Contenu du fichier", encoding="utf-8")

# Append (ajout sans écraser)
with open(chemin_fichier, "a", encoding="utf-8") as fichier:
    fichier.write("Nouvelle ligne\\n")

# Lecture CSV avec le module standard
import csv
with open("notes.csv", encoding="utf-8") as fichier_csv:
    lecteur = csv.DictReader(fichier_csv)
    for ligne in lecteur:
        print(ligne["nom"], ligne["note"])</pre>`,freq:`med`,},
  {id:`p1_python_16`,proj:`p1`,num:44,category:`Python 3.12 — Fichiers`,thematique:`Python 3.12`,question:`Comment manipuler des fichiers JSON en Python ?`,answer:`<pre>import json
from pathlib import Path

# Données Python → JSON (sérialisation)
donnees = {"nom": "Alice", "notes": [14, 16, 18], "actif": True}

# Écrire dans un fichier
with open("etudiant.json", "w", encoding="utf-8") as fichier_json:
    json.dump(donnees, fichier_json, ensure_ascii=False, indent=2)

# Lire depuis un fichier (désérialisation)
with open("etudiant.json", encoding="utf-8") as fichier_json:
    etudiant_charge = json.load(fichier_json)

# Convertir en/depuis string
chaine_json    = json.dumps(donnees, ensure_ascii=False)
objet_depuis_chaine = json.loads(chaine_json)

# Types supportés : str, int, float, bool, None, list, dict
# ⚠️ datetime n'est pas sérialisable → convertir en str avant</pre>`,freq:`hot`,},
  {id:`p1_python_17`,proj:`p1`,num:45,category:`Python 3.12 — Modules`,thematique:`Python 3.12`,question:`Comment créer et importer un module Python ?`,answer:`<pre># calculs.py — module personnalisé
"""Module de calculs mathématiques pour DWWM."""

PI = 3.14159

def aire_cercle(rayon: float) -> float:
    """Calcule l'aire d'un cercle."""
    return PI * rayon ** 2

def _fonction_privee():  # _ = convention : usage interne uniquement
    pass


# main.py — import du module
import calculs                          # Import du module entier
from calculs import aire_cercle, PI    # Import sélectif
from calculs import aire_cercle as aire  # Alias

print(calculs.aire_cercle(5))  # 78.53975
print(aire_cercle(5))          # 78.53975

# Package = dossier contenant un fichier __init__.py
# monpackage/
#   __init__.py
#   calculs.py
#   statistiques.py</pre>`,freq:`med`,},
  {id:`p1_python_18`,proj:`p1`,num:46,category:`Python 3.12 — Modules`,thematique:`Python 3.12`,question:`Quels sont les modules de la bibliothèque standard les plus utiles ?`,answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>os / pathlib</b> : manipulation de fichiers et répertoires</li>
  <li><b>sys</b> : interaction avec l'interpréteur Python</li>
  <li><b>datetime</b> : dates et heures</li>
  <li><b>json</b> : sérialisation JSON</li>
  <li><b>re</b> : expressions régulières</li>
  <li><b>collections</b> : Counter, defaultdict, deque</li>
  <li><b>itertools</b> : combinaisons, permutations, chaînage</li>
  <li><b>functools</b> : lru_cache, partial, reduce</li>
  <li><b>logging</b> : journalisation structurée</li>
  <li><b>unittest</b> : tests unitaires</li>
</ul>
<pre>from datetime import datetime, timedelta
from collections import Counter
import re

maintenant = datetime.now()
dans_une_semaine = maintenant + timedelta(weeks=1)

occurences = Counter(["pomme", "banane", "pomme", "cerise"])
print(occurences.most_common(2))  # [('pomme', 2), ('banane', 1)]

courriel_valide = re.match(r"[^@]+@[^@]+\\.[^@]+", "alice@example.com")</pre>`,freq:`med`,},
  {id:`p1_python_19`,proj:`p1`,num:47,category:`Python 3.12 — Modules`,thematique:`Python 3.12`,question:`Comment déboguer avec le module \`logging\` ?`,answer:`<p>Le module <code>logging</code> est préférable à <code>print()</code> en production car il gère les niveaux de gravité et peut écrire dans des fichiers.</p>
<pre>import logging

# Configuration de base
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s : %(message)s",
    handlers=[
        logging.StreamHandler(),                    # Console
        logging.FileHandler("app.log", encoding="utf-8")  # Fichier
    ]
)

logger = logging.getLogger(__name__)  # Nom du module courant

logger.debug("Détail technique (dev)")
logger.info("Information générale")
logger.warning("Avertissement — comportement inattendu")
logger.error("Erreur — fonctionnalité échouée")
logger.critical("Critique — application compromise")

# Niveaux : DEBUG < INFO < WARNING < ERROR < CRITICAL</pre>`,freq:`med`,},
  {id:`p1_python_20`,proj:`p1`,num:48,category:`Python 3.12 — Performance`,thematique:`Python 3.12`,question:`Qu'est-ce que \`lru_cache\` et comment accélérer une fonction ?`,answer:`<p><code>lru_cache</code> met en cache les résultats d'une fonction pour éviter de recalculer les mêmes appels (mémoïsation).</p>
<pre>from functools import lru_cache
import time

# Sans cache — très lent pour de grands n
def fibonacci_lent(n: int) -> int:
    if n <= 1: return n
    return fibonacci_lent(n - 1) + fibonacci_lent(n - 2)

# Avec cache — quasi instantané même pour n=500
@lru_cache(maxsize=None)  # None = taille illimitée
def fibonacci_rapide(n: int) -> int:
    if n <= 1: return n
    return fibonacci_rapide(n - 1) + fibonacci_rapide(n - 2)

debut = time.perf_counter()
fibonacci_rapide(35)
print(f"Avec cache : {time.perf_counter() - debut:.6f}s")  # ~0.000001s

# Vider le cache si nécessaire
fibonacci_rapide.cache_clear()
print(fibonacci_rapide.cache_info())  # hits, misses, maxsize, currsize</pre>`,freq:`med`,},
  {id:`p1_python_21`,proj:`p1`,num:49,category:`Python 3.12 — Performance`,thematique:`Python 3.12`,question:`Qu'est-ce qu'une compréhension de liste et quand l'utiliser ?`,answer:`<p>Les <b>compréhensions</b> permettent de créer des collections de façon concise et souvent plus rapide qu'une boucle.</p>
<pre>nombres = range(10)

# Compréhension de liste
carres_pairs = [x**2 for x in nombres if x % 2 == 0]
# [0, 4, 16, 36, 64]

# Compréhension de dictionnaire
carre_par_nombre = {x: x**2 for x in range(5)}
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# Compréhension de set
premiers_carres = {x**2 for x in range(10)}

# Compréhension imbriquée (matrice)
matrice = [[ligne * colonne for colonne in range(1, 4)] for ligne in range(1, 4)]

# ⚠️ Éviter les compréhensions trop complexes (> 2 conditions)
# → Préférer une boucle explicite pour la lisibilité</pre>`,freq:`hot`,},
  {id:`p1_python_22`,proj:`p1`,num:50,category:`Python 3.12 — Tests`,thematique:`Python 3.12`,question:`Comment écrire des tests unitaires avec \`unittest\` ?`,answer:`<pre>import unittest

def diviser(numerateur: float, denominateur: float) -> float:
    if denominateur == 0:
        raise ValueError("Le dénominateur ne peut pas être zéro")
    return numerateur / denominateur


class TestDivision(unittest.TestCase):

    def test_division_normale(self):
        self.assertEqual(diviser(10, 2), 5.0)

    def test_division_virgule(self):
        self.assertAlmostEqual(diviser(1, 3), 0.333, places=3)

    def test_division_par_zero(self):
        with self.assertRaises(ValueError):
            diviser(10, 0)

    def setUp(self):
        """Exécuté avant chaque test — initialisation."""
        pass

    def tearDown(self):
        """Exécuté après chaque test — nettoyage."""
        pass


if __name__ == "__main__":
    unittest.main(verbosity=2)</pre>`,freq:`hot`,},
  {id:`p1_python_23`,proj:`p1`,num:51,category:`Python 3.12 — Tests`,thematique:`Python 3.12`,question:`Quelle est la différence entre \`assertEqual\`, \`assertIn\` et \`assertRaises\` ?`,answer:`<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><code>assertEqual(a, b)</code> : vérifie que a == b</li>
  <li><code>assertNotEqual(a, b)</code> : vérifie que a != b</li>
  <li><code>assertTrue(condition)</code> : vérifie que condition est vraie</li>
  <li><code>assertFalse(condition)</code> : vérifie que condition est fausse</li>
  <li><code>assertIn(item, collection)</code> : vérifie que item est dans collection</li>
  <li><code>assertIsNone(valeur)</code> : vérifie que valeur est None</li>
  <li><code>assertRaises(Exception)</code> : vérifie qu'une exception est levée</li>
  <li><code>assertAlmostEqual(a, b, places=N)</code> : égalité approchée pour les flottants</li>
</ul>
<pre>self.assertEqual([1, 2, 3], [1, 2, 3])      # ✅
self.assertIn("Alice", ["Alice", "Bob"])      # ✅
self.assertIsNone(valeur_optionnelle)         # ✅
self.assertAlmostEqual(0.1 + 0.2, 0.3, places=5)  # ✅ (flottants)</pre>`,freq:`med`,},
  {id:`p1_python_24`,proj:`p1`,num:52,category:`Python 3.12 — Environnement`,thematique:`Python 3.12`,question:`Qu'est-ce qu'un environnement virtuel et pourquoi l'utiliser ?`,answer:`<p>Un <b>environnement virtuel</b> isole les dépendances d'un projet pour éviter les conflits entre projets.</p>
<pre># Créer un environnement virtuel
python3 -m venv mon_env

# Activer (Linux/macOS)
source mon_env/bin/activate

# Activer (Windows)
mon_env\\Scripts\\activate

# Installer des dépendances dans l'env
pip install django==4.2 requests

# Sauvegarder les dépendances
pip freeze > requirements.txt

# Recréer l'environnement ailleurs
pip install -r requirements.txt

# Désactiver
deactivate</pre>
<p>⚠️ Ne jamais committer le dossier <code>mon_env/</code> dans Git. Ajouter dans <code>.gitignore</code>.</p>`,freq:`hot`,},
  {id:`p1_python_25`,proj:`p1`,num:53,category:`Python 3.12 — Environnement`,thematique:`Python 3.12`,question:`Comment utiliser \`pip\` et \`requirements.txt\` ?`,answer:`<pre># Installer un paquet
pip install requests

# Installer une version précise
pip install django==4.2.0

# Mettre à jour un paquet
pip install --upgrade django

# Lister les paquets installés
pip list
pip show django  # Détails d'un paquet

# Générer requirements.txt
pip freeze > requirements.txt
# Contenu : Django==4.2.0
requests==2.31.0
...

# Installer depuis requirements.txt
pip install -r requirements.txt

# Désinstaller
pip uninstall django

# Vérifier les paquets obsolètes
pip list --outdated</pre>`,freq:`easy`,},
  {id:`p1_python_26`,proj:`p1`,num:54,category:`Python 3.12 — Avancé`,thematique:`Python 3.12`,question:`Qu'est-ce que le walrus operator \`:=\` et quand l'utiliser ?`,answer:`<p>L'opérateur <code>:=</code> (walrus, Python 3.8+) assigne et retourne une valeur dans la même expression.</p>
<pre>import re

# Sans walrus — on appelle la fonction deux fois ou on crée une variable avant
correspondance = re.search(r"\\d+", "Prix: 42€")
if correspondance:
    print(f"Nombre trouvé : {correspondance.group()}")

# Avec walrus — plus concis
if correspondance := re.search(r"\\d+", "Prix: 42€"):
    print(f"Nombre trouvé : {correspondance.group()}")  # "42"

# Dans une boucle while — lecture de fichier par blocs
with open("gros_fichier.txt") as fichier:
    while bloc := fichier.read(4096):
        traiter(bloc)

# ⚠️ Ne pas abuser — nuire à la lisibilité si utilisé partout</pre>`,freq:`med`,},
  {id:`p1_python_27`,proj:`p1`,num:55,category:`Python 3.12 — Avancé`,thematique:`Python 3.12`,question:`Qu'est-ce que le pattern matching (\`match/case\`) introduit en Python 3.10 ?`,answer:`<p>Le <code>match/case</code> (Python 3.10+) est un switch/case puissant qui supporte la déconstruction de structures.</p>
<pre>def traiter_commande(commande: dict):
    match commande:
        case {"action": "creer", "nom": str(nom_utilisateur)}:
            print(f"Création de {nom_utilisateur}")

        case {"action": "supprimer", "id": int(identifiant)} if identifiant > 0:
            print(f"Suppression de l'id {identifiant}")

        case {"action": action_inconnue}:
            print(f"Action inconnue : {action_inconnue}")

        case _:
            print("Commande invalide")

traiter_commande({"action": "creer", "nom": "Alice"})
# Création de Alice

# Déconstruction de tuples/listes
match coordonnees:
    case (0, 0):      print("Origine")
    case (x, 0):      print(f"Axe X : {x}")
    case (0, y):      print(f"Axe Y : {y}")
    case (x, y):      print(f"Point ({x}, {y})")</pre>`,freq:`med`,},
  {id:`p1_python_28`,proj:`p1`,num:56,category:`Python 3.12 — Avancé`,thematique:`Python 3.12`,question:`Qu'est-ce que \`asyncio\` et la programmation asynchrone en Python ?`,answer:`<p><code>asyncio</code> permet d'écrire du code concurrent sans threads, en utilisant des coroutines (<code>async/await</code>).</p>
<pre>import asyncio
import aiohttp  # pip install aiohttp

async def recuperer_url(session, url: str) -> str:
    """Télécharge le contenu d'une URL de façon asynchrone."""
    async with session.get(url) as reponse:
        return await reponse.text()

async def telecharger_plusieurs(urls: list[str]) -> list[str]:
    """Télécharge plusieurs URLs en parallèle."""
    async with aiohttp.ClientSession() as session:
        taches = [recuperer_url(session, url) for url in urls]
        return await asyncio.gather(*taches)  # Lance toutes les tâches en parallèle

# Point d'entrée
if __name__ == "__main__":
    urls = ["https://python.org", "https://pypi.org"]
    resultats = asyncio.run(telecharger_plusieurs(urls))</pre>
<p><b>Quand utiliser asyncio ?</b> Pour les opérations I/O intensives (réseau, fichiers) avec beaucoup de concurrence.</p>`,freq:`med`,},
  {id:`p1_python_29`,proj:`p1`,num:57,category:`Python 3.12 — Avancé`,thematique:`Python 3.12`,question:`Qu'est-ce que \`__slots__\` et comment réduire la mémoire des instances ?`,answer:`<p><code>__slots__</code> remplace le dictionnaire interne de chaque instance par un tableau fixe, réduisant l'usage mémoire de ~40%.</p>
<pre>class PointSansSlots:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
    # Chaque instance possède un __dict__ dynamique

class PointAvecSlots:
    __slots__ = ("x", "y")  # Liste fixe des attributs autorisés

    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y
    # Pas de __dict__ → ~40% moins de mémoire

import sys
sans_slots = PointSansSlots(1.0, 2.0)
avec_slots = PointAvecSlots(1.0, 2.0)
print(sys.getsizeof(sans_slots.__dict__))  # ~232 octets
# avec_slots n'a pas de __dict__ du tout

# Python 3.12 : @dataclass(slots=True) pour les dataclasses
from dataclasses import dataclass

@dataclass(slots=True)
class Point3D:
    x: float
    y: float
    z: float</pre>`,freq:`easy`,},
  {id:`p1_python_30`,proj:`p1`,num:58,category:`Python 3.12 — Avancé`,thematique:`Python 3.12`,question:`Comment fonctionne le ramasse-miettes (garbage collector) en Python ?`,answer:`<p>Python utilise deux mécanismes pour libérer la mémoire :</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b>Comptage de références</b> : chaque objet compte le nombre de références qui le pointent. Quand ce compteur tombe à 0, l'objet est immédiatement libéré.</li>
  <li><b>Garbage collector cyclique</b> : détecte et libère les références circulaires (A → B → A).</li>
</ul>
<pre>import gc

# Vérifier l'état du GC
print(gc.isenabled())       # True par défaut
print(gc.get_threshold())   # (700, 10, 10)

# Forcer un cycle de collecte (rarement nécessaire)
gc.collect()

# Exemple de référence circulaire — sans GC, fuite mémoire
class Noeud:
    def __init__(self):
        self.reference = None

noeud_a = Noeud()
noeud_b = Noeud()
noeud_a.reference = noeud_b  # A → B
noeud_b.reference = noeud_a  # B → A (cycle !)
# Le GC détecte ce cycle et libère les deux objets</pre>`,freq:`easy`,},
  {id:`p1_python_31`,proj:`p1`,num:59,category:`Python 3.12 — Sécurité`,thematique:`Python 3.12`,question:`Comment valider et assainir les entrées utilisateur en Python ?`,answer:`<p>Ne jamais faire confiance aux données entrantes — toujours valider avant utilisation.</p>
<pre>import re
from pathlib import Path

def valider_nom_utilisateur(nom: str) -> str:
    """
    Valide un nom d'utilisateur : 3-30 caractères alphanumériques.
    Raises:
        ValueError: Si le nom ne respecte pas les règles.
    Returns:
        Le nom nettoyé.
    """
    nom_nettoye = nom.strip()
    if not re.match(r"^[a-zA-Z0-9_]{3,30}$", nom_nettoye):
        raise ValueError(f"Nom invalide : {nom_nettoye!r}")
    return nom_nettoye

def chemin_securise(nom_fichier: str, dossier_base: Path) -> Path:
    """Empêche le path traversal (../../etc/passwd)."""
    chemin = (dossier_base / nom_fichier).resolve()
    if not chemin.is_relative_to(dossier_base.resolve()):
        raise PermissionError("Accès interdit en dehors du dossier autorisé")
    return chemin</pre>`,freq:`hot`,},
  {id:`p1_python_32`,proj:`p1`,num:60,category:`Python 3.12 — Sécurité`,thematique:`Python 3.12`,question:`Comment utiliser \`secrets\` pour générer des tokens sécurisés ?`,answer:`<p>Le module <code>secrets</code> génère des valeurs cryptographiquement sûres, contrairement à <code>random</code> qui est prévisible.</p>
<pre>import secrets
import hashlib

# ✅ Token URL-safe pour les liens de réinitialisation de mot de passe
token_reinitialisation = secrets.token_urlsafe(32)
# Ex: "xK9_mN2pQ8rT..." (43 caractères, URL-safe)

# ✅ Token hexadécimal pour les clés d'API
cle_api = secrets.token_hex(32)
# Ex: "a1b2c3d4..." (64 caractères hex)

# ✅ Entier aléatoire sécurisé (PIN à 6 chiffres)
code_pin = secrets.randbelow(1_000_000)

# ✅ Comparaison en temps constant — évite les timing attacks
def verifier_token(token_recu: str, token_attendu: str) -> bool:
    return secrets.compare_digest(token_recu, token_attendu)

# ❌ À éviter pour la sécurité
import random
token_non_securise = random.randbytes(32)  # Prévisible !</pre>`,freq:`med`,},
  {id:`p1_django_vues_1`,proj:`p1`,num:61,category:`Django — Vues`,thematique:`Django`,question:`Quelle est la différence entre une Function-Based View (FBV) et une Class-Based View (CBV) ?`,answer:`<p>Une <b>FBV</b> est une simple fonction Python qui reçoit une requête et retourne une réponse. Une <b>CBV</b> est une classe qui hérite des vues génériques Django et évite la répétition de code.</p>
<pre># FBV — explicite, lisible pour les débutants
from django.shortcuts import render, get_object_or_404

def detail_article(requete, identifiant_article):
    article = get_object_or_404(Article, pk=identifiant_article)
    return render(requete, 'articles/detail.html', {'article': article})

# CBV — générique, moins de code pour les cas standards
from django.views.generic import DetailView

class DetailArticleView(DetailView):
    model         = Article
    template_name = 'articles/detail.html'
    context_object_name = 'article'  # Nom de la variable dans le template</pre>
<p><b>Quand utiliser quoi ?</b> FBV pour la logique complexe ou personnalisée. CBV pour les opérations CRUD standards (liste, détail, création, modification, suppression).</p>`,freq:`hot`,},
  {id:`p1_django_vues_2`,proj:`p1`,num:62,category:`Django — Vues`,thematique:`Django`,question:`Quelles sont les CBV génériques les plus utiles de Django ?`,answer:`<pre>from django.views.generic import (
    ListView,       # Affiche une liste d'objets
    DetailView,     # Affiche le détail d'un objet
    CreateView,     # Formulaire de création
    UpdateView,     # Formulaire de modification
    DeleteView,     # Confirmation de suppression
)

# Exemple ListView avec filtrage
class ListeArticlesView(ListView):
    model               = Article
    template_name       = 'articles/liste.html'
    context_object_name = 'liste_articles'
    paginate_by         = 10  # Pagination automatique

    def get_queryset(self):
        # Surcharge pour filtrer selon l'utilisateur connecté
        return Article.objects.filter(auteur=self.request.user)

    def get_context_data(self, **donnees_contexte):
        # Ajouter des données supplémentaires au template
        contexte = super().get_context_data(**donnees_contexte)
        contexte['nombre_total'] = Article.objects.count()
        return contexte</pre>`,freq:`hot`,},
  {id:`p1_django_vues_3`,proj:`p1`,num:63,category:`Django — Vues`,thematique:`Django`,question:`Qu'est-ce que \`render\`, \`redirect\` et \`get_object_or_404\` ?`,answer:`<pre>from django.shortcuts import render, redirect, get_object_or_404

def modifier_article(requete, identifiant_article):
    # get_object_or_404 : récupère l'objet ou retourne une page 404
    article = get_object_or_404(Article, pk=identifiant_article)

    if requete.method == 'POST':
        formulaire = FormulaireArticle(requete.POST, instance=article)
        if formulaire.is_valid():
            formulaire.save()
            # redirect : redirige vers une autre URL (évite double-soumission)
            return redirect('detail_article', pk=article.pk)
    else:
        formulaire = FormulaireArticle(instance=article)

    # render : charge un template avec un contexte et retourne une HttpResponse
    return render(requete, 'articles/modifier.html', {
        'formulaire': formulaire,
        'article':    article,
    })</pre>`,freq:`hot`,},
  {id:`p1_django_forms_1`,proj:`p1`,num:64,category:`Django — Formulaires`,thematique:`Django`,question:`Qu'est-ce qu'un ModelForm et comment l'utiliser ?`,answer:`<p>Un <b>ModelForm</b> génère automatiquement un formulaire HTML à partir d'un modèle Django, sans redéfinir chaque champ manuellement.</p>
<pre>from django import forms
from .models import Article

class FormulaireArticle(forms.ModelForm):
    class Meta:
        model  = Article
        fields = ['titre', 'contenu', 'categorie']  # Champs inclus
        # Ou : exclude = ['auteur', 'date_creation']

        widgets = {
            'contenu': forms.Textarea(attrs={'rows': 8, 'class': 'form-control'}),
        }
        labels = {
            'titre': 'Titre de l'article',
        }

    # Validation personnalisée d'un champ
    def clean_titre(self):
        titre = self.cleaned_data['titre']
        if len(titre) < 5:
            raise forms.ValidationError("Le titre doit faire au moins 5 caractères.")
        return titre.strip()  # Toujours retourner la valeur nettoyée</pre>`,freq:`hot`,},
  {id:`p1_django_forms_2`,proj:`p1`,num:65,category:`Django — Formulaires`,thematique:`Django`,question:`Comment fonctionne la validation d'un formulaire Django (\`is_valid\`, \`cleaned_data\`) ?`,answer:`<pre>def creer_article(requete):
    if requete.method == 'POST':
        # Lie le formulaire aux données POST et aux fichiers uploadés
        formulaire = FormulaireArticle(requete.POST, requete.FILES)

        if formulaire.is_valid():
            # cleaned_data contient les données validées et nettoyées
            titre_valide   = formulaire.cleaned_data['titre']
            contenu_valide = formulaire.cleaned_data['contenu']

            # save() crée l'objet en base — commit=False pour modifier avant
            article = formulaire.save(commit=False)
            article.auteur = requete.user  # Ajouter l'auteur avant sauvegarde
            article.save()
            return redirect('liste_articles')
    else:
        formulaire = FormulaireArticle()

    return render(requete, 'articles/creer.html', {'formulaire': formulaire})

# Dans le template
# {{ formulaire.as_p }}           → champs dans des <p>
# {{ formulaire.titre }}          → champ seul
# {{ formulaire.titre.errors }}   → erreurs du champ</pre>`,freq:`hot`,},
  {id:`p1_django_templates_1`,proj:`p1`,num:66,category:`Django — Templates`,thematique:`Django`,question:`Quelles sont les balises de template Django les plus importantes ?`,answer:`<pre>{# Commentaire dans un template Django #}

{# Héritage — base.html définit la structure commune #}
{% extends 'base.html' %}

{% block titre %}Mes articles{% endblock %}

{% block contenu %}
  {# Boucle for #}
  {% for article in liste_articles %}
    &lt;h2&gt;{{ article.titre }}&lt;/h2&gt;
    &lt;p&gt;{{ article.contenu|truncatewords:30 }}&lt;/p&gt;

    {# URL inversée — évite de coder les URLs en dur #}
    &lt;a href="{% url 'detail_article' pk=article.pk %}"&gt;Lire la suite&lt;/a&gt;
  {% empty %}
    &lt;p&gt;Aucun article disponible.&lt;/p&gt;
  {% endfor %}

  {# Condition #}
  {% if request.user.is_authenticated %}
    &lt;a href="{% url 'creer_article' %}"&gt;+ Nouvel article&lt;/a&gt;
  {% endif %}

  {# Inclusion d'un sous-template #}
  {% include 'partials/pagination.html' with page_obj=page_obj %}
{% endblock %}</pre>`,freq:`hot`,},
  {id:`p1_django_templates_2`,proj:`p1`,num:67,category:`Django — Templates`,thematique:`Django`,question:`Qu'est-ce que les filtres de template Django et donnez 5 exemples utiles ?`,answer:`<p>Les <b>filtres</b> transforment une variable dans le template avec la syntaxe <code>{{ variable|filtre }}</code> ou <code>{{ variable|filtre:argument }}</code>.</p>
<pre>{{ article.titre|upper }}                {# TITRE EN MAJUSCULES #}
{{ article.titre|lower }}                {# titre en minuscules #}
{{ article.contenu|truncatewords:20 }}   {# 20 premiers mots... #}
{{ article.contenu|truncatechars:100 }}  {# 100 premiers caractères #}
{{ article.date_creation|date:"d/m/Y" }} {# 21/05/2026 #}
{{ article.date_creation|timesince }}    {# "3 jours" #}
{{ prix|floatformat:2 }}                 {# 12.50 #}
{{ liste_tags|join:", " }}               {# "Python, Django, Web" #}
{{ texte_html|safe }}                    {# Affiche le HTML sans l'échapper #}
{{ valeur|default:"Non renseigné" }}     {# Valeur par défaut si vide #}
{{ nombre|divisibleby:2 }}              {# True/False #}</pre>
<p>⚠️ N'utiliser <code>|safe</code> que pour du contenu que vous contrôlez totalement — jamais sur des données utilisateur (risque XSS).</p>`,freq:`med`,},
  {id:`p1_django_auth_1`,proj:`p1`,num:68,category:`Django — Authentification`,thematique:`Django`,question:`Comment protéger une vue avec \`login_required\` ?`,answer:`<pre>from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth.mixins import LoginRequiredMixin

# Décorateur pour les FBV
@login_required(login_url='/connexion/')  # Redirige si non connecté
def tableau_de_bord(requete):
    return render(requete, 'dashboard.html')

# Mixin pour les CBV
class TableauDeBordView(LoginRequiredMixin, ListView):
    login_url    = '/connexion/'
    redirect_field_name = 'next'  # URL de retour après connexion
    model        = Article

# Vérifier les permissions
@permission_required('articles.add_article', raise_exception=True)
def creer_article(requete):
    pass

# Dans les templates
{% if request.user.is_authenticated %}
    Bonjour {{ request.user.username }} !
    &lt;a href="{% url 'logout' %}"&gt;Se déconnecter&lt;/a&gt;
{% else %}
    &lt;a href="{% url 'login' %}"&gt;Se connecter&lt;/a&gt;
{% endif %}</pre>`,freq:`hot`,},
  {id:`p1_django_auth_2`,proj:`p1`,num:69,category:`Django — Authentification`,thematique:`Django`,question:`Comment fonctionne le système d'authentification intégré de Django ?`,answer:`<pre>from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

# Créer un utilisateur
nouvel_utilisateur = User.objects.create_user(
    username='alice',
    email='alice@example.com',
    password='motdepasse_securise'  # Django hache automatiquement (PBKDF2)
)

# Authentifier un utilisateur
def vue_connexion(requete):
    if requete.method == 'POST':
        nom_utilisateur = requete.POST['username']
        mot_de_passe    = requete.POST['password']

        utilisateur = authenticate(requete, username=nom_utilisateur, password=mot_de_passe)
        if utilisateur is not None:
            login(requete, utilisateur)  # Crée la session
            return redirect('tableau_de_bord')
        else:
            messages.error(requete, 'Identifiants incorrects.')

    return render(requete, 'auth/connexion.html')

def vue_deconnexion(requete):
    logout(requete)  # Détruit la session
    return redirect('accueil')</pre>`,freq:`hot`,},
  {id:`p1_django_migrations_1`,proj:`p1`,num:70,category:`Django — Migrations`,thematique:`Django`,question:`Quelle est la différence entre \`makemigrations\` et \`migrate\` ?`,answer:`<p>Ces deux commandes fonctionnent en deux étapes distinctes :</p>
<ul style="padding-left:1.2rem;margin:6px 0 10px">
  <li><b><code>makemigrations</code></b> : lit vos modèles Python et <b>génère</b> les fichiers de migration (dans <code>migrations/</code>). Ne touche pas encore à la base de données.</li>
  <li><b><code>migrate</code></b> : <b>applique</b> les fichiers de migration à la base de données réelle.</li>
</ul>
<pre># Workflow complet
python manage.py makemigrations          # Génère 0002_article_categorie.py
python manage.py migrate                 # Applique toutes les migrations en attente
python manage.py migrate articles 0001  # Retour en arrière vers une migration précise

# Commandes utiles
python manage.py showmigrations          # Liste l'état de toutes les migrations
python manage.py sqlmigrate articles 0002  # Affiche le SQL généré sans l'exécuter
python manage.py makemigrations --name ajout_categorie  # Nom explicite</pre>
<p>⚠️ Les fichiers de migration doivent être <b>versionnés dans Git</b> — ils font partie du code source.</p>`,freq:`hot`,},
  {id:`p1_django_migrations_2`,proj:`p1`,num:71,category:`Django — Migrations`,thematique:`Django`,question:`Comment gérer les migrations de données (data migrations) ?`,answer:`<p>Une <b>migration de données</b> modifie les données existantes en base (pas seulement le schéma). Elle s'écrit avec <code>RunPython</code>.</p>
<pre># Créer une migration vide
python manage.py makemigrations --empty articles --name initialiser_categories

# Dans le fichier généré : articles/migrations/0003_initialiser_categories.py
from django.db import migrations

def creer_categories_initiales(applications, schema_editor):
    ModeleCategorie = applications.get_model('articles', 'Categorie')
    ModeleCategorie.objects.bulk_create([
        ModeleCategorie(nom='Python'),
        ModeleCategorie(nom='Django'),
        ModeleCategorie(nom='JavaScript'),
    ])

def supprimer_categories_initiales(applications, schema_editor):
    ModeleCategorie = applications.get_model('articles', 'Categorie')
    ModeleCategorie.objects.filter(nom__in=['Python', 'Django', 'JavaScript']).delete()

class Migration(migrations.Migration):
    dependencies = [('articles', '0002_categorie')]
    operations   = [
        # Toujours fournir la fonction inverse pour le rollback
        migrations.RunPython(creer_categories_initiales, supprimer_categories_initiales)
    ]</pre>`,freq:`med`,},
  {id:`p1_django_admin_1`,proj:`p1`,num:72,category:`Django — Interface Admin`,thematique:`Django`,question:`Comment personnaliser l'interface d'administration Django ?`,answer:`<pre>from django.contrib import admin
from .models import Article, Categorie

@admin.register(Article)
class AdminArticle(admin.ModelAdmin):
    # Colonnes affichées dans la liste
    list_display   = ('titre', 'auteur', 'categorie', 'date_creation', 'est_publie')

    # Filtres dans la barre latérale
    list_filter    = ('est_publie', 'categorie', 'date_creation')

    # Barre de recherche
    search_fields  = ('titre', 'contenu', 'auteur__username')

    # Champs en lecture seule
    readonly_fields = ('date_creation', 'date_modification')

    # Organisation des champs dans le formulaire de détail
    fieldsets = (
        ('Contenu',     {'fields': ('titre', 'contenu', 'categorie')}),
        ('Publication', {'fields': ('est_publie', 'date_publication')}),
        ('Métadonnées', {'fields': ('auteur', 'date_creation'), 'classes': ('collapse',)}),
    )

    # Actions personnalisées
    actions = ['publier_articles']

    @admin.action(description='Publier les articles sélectionnés')
    def publier_articles(self, requete, queryset):
        queryset.update(est_publie=True)

admin.site.register(Categorie)
admin.site.site_header = 'Administration DWWM'</pre>`,freq:`hot`,},
  {id:`p1_django_urls_1`,proj:`p1`,num:73,category:`Django — URLs`,thematique:`Django`,question:`Comment structurer les URLs dans Django avec \`path\`, \`include\` et le nommage ?`,answer:`<pre># monprojet/urls.py — fichier racine
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/',    admin.site.urls),
    path('articles/', include('articles.urls', namespace='articles')),
    path('auth/',     include('django.contrib.auth.urls')),  # Login/logout intégrés
]

# articles/urls.py — URLs de l'application
from django.urls import path
from . import views

app_name = 'articles'  # Namespace pour les URLs nommées

urlpatterns = [
    path('',                  views.ListeArticlesView.as_view(), name='liste'),
    path('&lt;int:pk&gt;/',          views.DetailArticleView.as_view(), name='detail'),
    path('creer/',            views.CreerArticleView.as_view(),  name='creer'),
    path('&lt;int:pk&gt;/modifier/', views.ModifierArticleView.as_view(), name='modifier'),
    path('&lt;slug:slug&gt;/',       views.DetailParSlugView.as_view(), name='detail-slug'),
]

# Dans un template : {% url 'articles:detail' pk=article.pk %}
# Dans une vue     : redirect('articles:liste')</pre>`,freq:`hot`,},
  {id:`p1_django_settings_1`,proj:`p1`,num:74,category:`Django — Configuration`,thematique:`Django`,question:`Quels sont les paramètres Django essentiels à configurer pour la production ?`,answer:`<pre># settings.py — paramètres critiques

# ❌ JAMAIS en production
DEBUG = False

# Domaines autorisés
ALLOWED_HOSTS = ['monsite.com', 'www.monsite.com']

# Clé secrète — toujours depuis une variable d'environnement
import os
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')

# Base de données
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME':   os.environ.get('DB_NAME'),
        'USER':   os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST':   os.environ.get('DB_HOST', 'localhost'),
    }
}

# Fichiers statiques (collectstatic avant déploiement)
STATIC_URL  = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'  # Dossier cible de collectstatic

# Fichiers uploadés par les utilisateurs
MEDIA_URL  = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Sécurité HTTPS
SECURE_SSL_REDIRECT         = True
SESSION_COOKIE_SECURE       = True
CSRF_COOKIE_SECURE          = True
SECURE_HSTS_SECONDS         = 31536000</pre>`,freq:`hot`,},
  {id:`p1_django_middleware_1`,proj:`p1`,num:75,category:`Django — Middleware`,thematique:`Django`,question:`Qu'est-ce qu'un middleware Django et quels sont ceux activés par défaut ?`,answer:`<p>Un <b>middleware</b> est une couche de traitement qui s'applique à chaque requête (avant la vue) et à chaque réponse (après la vue). Ils sont empilés dans l'ordre de <code>MIDDLEWARE</code>.</p>
<pre>MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',      # Headers de sécurité
    'django.contrib.sessions.middleware.SessionMiddleware', # Gestion des sessions
    'django.middleware.common.CommonMiddleware',           # Redirections /
    'django.middleware.csrf.CsrfViewMiddleware',          # Protection CSRF
    'django.contrib.auth.middleware.AuthenticationMiddleware', # request.user
    'django.contrib.messages.middleware.MessageMiddleware',    # Système de messages
]

# Créer son propre middleware
class JournaliserRequetesMiddleware:
    def __init__(self, gestionnaire_suivant):
        self.gestionnaire_suivant = gestionnaire_suivant

    def __call__(self, requete):
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"{requete.method} {requete.path} — {requete.user}")

        reponse = self.gestionnaire_suivant(requete)  # Appelle la vue
        return reponse</pre>`,freq:`med`,},
  {id:`p1_django_csrf_1`,proj:`p1`,num:76,category:`Django — Sécurité`,thematique:`Django`,question:`Qu'est-ce qu'une attaque CSRF et comment Django s'en protège-t-il ?`,answer:`<p>Une attaque <b>CSRF</b> (Cross-Site Request Forgery) consiste à faire envoyer une requête à votre application par un utilisateur connecté, depuis un site malveillant.</p>
<p>Django génère un <b>token CSRF</b> unique par session et le vérifie à chaque soumission de formulaire POST.</p>
<pre>{# Dans chaque formulaire POST — OBLIGATOIRE #}
&lt;form method="post" action="{% url 'articles:creer' %}"&gt;
    {% csrf_token %}  {# Génère un input hidden avec le token #}
    {{ formulaire.as_p }}
    &lt;button type="submit"&gt;Créer&lt;/button&gt;
&lt;/form&gt;

# Pour les appels AJAX — envoyer le token dans les headers
# (récupéré depuis le cookie csrftoken)
fetch('/api/articles/', {
    method: 'POST',
    headers: { 'X-CSRFToken': getCookie('csrftoken') },
    body: JSON.stringify(donnees),
})

# Désactiver pour une vue API (si authentification par token JWT)
from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
def mon_endpoint_api(requete):
    pass</pre>`,freq:`hot`,},
  {id:`p1_1779640750027`,proj:`p1`,num:0,category:`Templates`,thematique:``,question:`view FBV ou CBV`,answer:`Dans Django, une **view** (vue) c'est la fonction ou la classe qui reçoit une requête HTTP et décide quoi renvoyer au navigateur. C'est le chef d'orchestre entre l'URL, la base de données et le template.

---

**FBV — Function-Based View**

Une simple fonction Python qui prend une requête et retourne une réponse.

\`\`\`python
def liste_materiels(request):
    materiels = Materiel.objects.all()
    return render(request, 'liste.html', {'materiels': materiels})
\`\`\`

C'est lisible, direct, facile à déboguer. Tu vois exactement ce qui se passe ligne par ligne. Pratique pour des vues simples ou des logiques très spécifiques (comme ton endpoint AJAX \`pret_rendu_view\` dans le projet).

---

**CBV — Class-Based View**

Django fournit des classes prêtes à l'emploi qui gèrent les cas courants sans réécrire le même code à chaque fois.

\`\`\`python
class MaterielListView(ListView):
    model = Materiel
    template_name = 'liste.html'
\`\`\`

\`ListView\` s'occupe tout seul de récupérer les objets, de paginer, de passer le contexte au template. Tu n'écris que ce qui est spécifique à ton cas. Il en existe plusieurs : \`CreateView\`, \`UpdateView\`, \`DeleteView\`, \`DetailView\`…

La vraie puissance des CBV, c'est qu'elles sont **composables par héritage** — ce que tu fais déjà dans ton projet avec tes mixins admin (\`PermissionMixin\`, \`ReadOnlyInfoMixin\`). C'est exactement le même principe appliqué à l'interface d'administration Django.

---

**Dans ton projet**

Ton application utilise principalement l'**admin Django** (qui est lui-même entièrement basé sur des CBV en coulisses), et tu as des vues personnalisées dans \`ViewsMixin\` : \`materiel_detail_view\` est une FBV classique, tandis que les exports et l'AJAX \`pret_rendu_view\` aussi — parce que leur logique est trop spécifique pour bénéficier d'une CBV générique.

En résumé : FBV quand la logique est unique, CBV quand tu fais quelque chose de standard (lister, créer, éditer, supprimer) pour ne pas réinventer la roue.`,freq:`easy`,},
  {id:`p1_1779640816895`,proj:`p1`,num:0,category:`Utils`,thematique:`Vocabulaires`,question:`Le module utils/ regroupe les fonctions pures réutilisables sans état`,answer:`<p><b>Sans état</b> signifie que la fonction ne se souvient de rien entre deux appels et ne dépend de rien d'extérieur à ses arguments.</p>

<p>Concrètement dans ton projet</p>
<code>
def create_statut_badge(statut):
    couleur = COLORS_STATUT.get(statut, '#6B7280')
    return format_html('<span style="background: {}">...</span>', couleur)
</code>

<p>Tu lui passes \`'en_panne'\`, elle te rend toujours exactement le même badge rouge. Elle ne consulte pas la base de données, ne lit pas de session, ne modifie aucune variable globale. Tu peux l'appeler 1 000 fois de suite avec la même valeur, tu obtiens toujours le même résultat.</p>

---
<p>Ce qui aurait de l'état, par opposition</p>

<p>Un mixin d'admin comme \`PermissionMixin\` *a* de l'état : il est attaché à une instance de \`MaterielAdmin\`, qui elle-même connaît \`self.request\`, l'utilisateur connecté, le modèle en cours… Son comportement change selon le contexte dans lequel il vit.

Un modèle Django aussi a de l'état : \`materiel.statut = 'stock'\` modifie l'objet en mémoire avant que tu appelles \`save()\`.</p>

<p>Pourquoi c'est important</p>

<p>Une fonction sans état est très facile à tester, justement parce qu'elle est prévisible :</p>

<code>
assert create_statut_badge('en_panne') == '<span style="background: #EF4444">...</span>'
</code>

<p>Pas besoin de base de données, pas de mock, pas de contexte à préparer. C'est pour ça que les \`utils\` sont séparés des mixins dans ton architecture : les fonctions pures d'un côté, la logique avec contexte de l'autre.</p>`,freq:`hot`,}
];
