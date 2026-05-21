export const DATA_P1 = [
  {id:"p1_1",proj:"p1",num:1,category:`Modèles & Base de données`,thematique:"",question:`Comment créer des relations entre les modèles Django ?`,answer:`<p>Django propose 3 types de relations :</p>
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
<b>on_delete</b> définit ce qui se passe si l'objet lié est supprimé : <code>CASCADE</code> supprime en cascade, <code>PROTECT</code> interdit la suppression, <code>SET_NULL</code> met à null.</p>`,freq:"hot",},
  {id:"p1_2",proj:"p1",num:2,category:`Modèles & Base de données`,thematique:"",question:`Qu'est-ce qu'un mixin et pourquoi l'utilisez-vous ?`,answer:`<p>Un mixin est une classe qui apporte des fonctionnalités réutilisables par héritage multiple, sans être une classe complète elle-même.</p>
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
<p>Sans mixin, il faudrait copier-coller ce code dans chaque classe d'admin. Avec le mixin, on l'écrit une seule fois et on l'hérite partout.</p>`,freq:"hot",},
  {id:"p1_3",proj:"p1",num:3,category:`Modèles & Base de données`,thematique:"",question:`Qu'est-ce qu'une méthode statique ? Pourquoi l'utiliser dans votre service ?`,answer:`<p>Une méthode statique (<code>@staticmethod</code>) appartient à la classe mais ne dépend ni de l'instance (<code>self</code>) ni de la classe (<code>cls</code>). On l'appelle directement sur la classe.</p>
<pre>class MaterielService:
    @staticmethod
    def get_historique_prets(materiel):
        """Pas besoin de self : on ne touche pas à l'état de la classe."""
        return materiel.prets.select_related('utilisateur').order_by('-date_pret')

# Appel : pas besoin d'instancier la classe
historique = MaterielService.get_historique_prets(mon_materiel)</pre>
<p>On l'utilise quand la logique est liée conceptuellement à la classe mais ne modifie aucun attribut. Cela rend le code plus lisible et testable.</p>`,freq:"hot",},
  {id:"p1_4",proj:"p1",num:4,category:`Modèles & Base de données`,thematique:"",question:`Qu'est-ce qu'un signal Django ? Donnez un exemple concret.`,answer:`<p>Un signal est un mécanisme d'événement : quand une action se produit (ex : sauvegarde d'un objet), Django "émet" un signal, et les fonctions qui "écoutent" ce signal sont exécutées automatiquement.</p>
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
<p>Ici le signal clôture l'ancienne affectation sans que l'utilisateur ait à y penser. C'est de la logique automatique et transparente.</p>`,freq:"hot",},
  {id:"p1_5",proj:"p1",num:5,category:`Modèles & Base de données`,thematique:"",question:`Qu'est-ce que <code>select_related()</code> et pourquoi l'utilisez-vous ?`,answer:`<p><code>select_related()</code> résout le problème N+1 : sans lui, Django fait une requête SQL par objet lié. Avec lui, il fait un seul JOIN SQL.</p>
<pre># Sans select_related → 1 requête pour les prêts + 1 par utilisateur
for pret in Pret.objects.all():
    print(pret.utilisateur.nom)  # requête SQL à chaque itération !

# Avec select_related → 1 seule requête SQL avec JOIN
for pret in Pret.objects.select_related('utilisateur'):
    print(pret.utilisateur.nom)  # déjà en mémoire</pre>
<p>Utilisez <code>select_related</code> pour les FK/OneToOne, et <code>prefetch_related</code> pour les ManyToMany.</p>`,freq:"med",},
  {id:"p1_6",proj:"p1",num:6,category:`Modèles & Base de données`,thematique:"",question:`Qu'est-ce qu'une transaction atomique et pourquoi en avez-vous besoin ?`,answer:`<p>Une transaction atomique garantit que plusieurs opérations en base de données réussissent toutes ensemble, ou qu'aucune n'est appliquée (tout ou rien).</p>
<pre>from django.db import transaction

with transaction.atomic():
    materiel.statut = 'stock'
    materiel.save()           # Si ça plante ici...
    pret.est_rendu = True
    pret.save()               # ...cette ligne n'est pas exécutée non plus</pre>
<p>Dans le retour de prêt, si la mise à jour du statut réussit mais que la sauvegarde du prêt échoue, on aurait un état incohérent. La transaction atomique évite ça.</p>`,freq:"hot",},
  {id:"p1_7",proj:"p1",num:7,category:`Modèles & Base de données`,thematique:"",question:`Qu'est-ce que <code>select_for_update()</code> et pourquoi l'utilisez-vous pour les codes matériel ?`,answer:`<p><code>select_for_update()</code> pose un verrou sur les lignes lues, empêchant d'autres transactions de les modifier jusqu'à la fin. Cela évite les doublons en accès concurrent.</p>
<pre>with transaction.atomic():
    # Verrouille toutes les lignes PC avant de lire la séquence max
    qs = Materiel.objects.select_for_update().filter(type_materiel=type_pc)
    dernier = qs.order_by('-sequence').first()
    prochain = 1 if dernier is None else dernier.sequence + 1
    instance.code = f"PC-{prochain:02d}"</pre>
<p>Sans ce verrou, deux créations simultanées pourraient lire la même séquence et générer deux fois <code>PC-01</code>.</p>`,freq:"med",},
  {id:"p1_8",proj:"p1",num:8,category:`Modèles & Base de données`,thematique:"",question:`Quelle est la différence entre <code>clean()</code> et <code>save()</code> dans un modèle ?`,answer:`<p><code>clean()</code> valide les données avant de les enregistrer (lève une <code>ValidationError</code> si les données sont incorrectes). <code>save()</code> écrit en base de données.</p>
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
        super().save(*args, **kwargs)</pre>`,freq:"med",},
  {id:"p1_9",proj:"p1",num:9,category:`Modèles & Base de données`,thematique:"",question:`Qu'est-ce qu'une <code>CheckConstraint</code> et pourquoi l'utilisez-vous en plus de <code>clean()</code> ?`,answer:`<p>Une <code>CheckConstraint</code> est une contrainte directement en base de données (SQL CHECK). Elle garantit l'intégrité même si quelqu'un insère des données sans passer par Django (import CSV, accès direct SQL).</p>
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
<p><code>clean()</code> protège via Python (côté applicatif). <code>CheckConstraint</code> protège au niveau BDD. Les deux ensemble = double protection.</p>`,freq:"med",},
  {id:"p1_10",proj:"p1",num:10,category:`ORM & Requêtes`,thematique:"",question:`Comment fonctionne l'ORM Django ? Pourquoi protège-t-il des injections SQL ?`,answer:`<p>L'ORM (Object-Relational Mapper) traduit les objets Python en requêtes SQL. Il utilise des requêtes paramétrées : les valeurs ne sont jamais insérées directement dans le SQL, elles sont toujours passées séparément au moteur de BDD.</p>
<pre># Ce que vous écrivez en Python :
Materiel.objects.filter(statut='en_service', structure=ma_structure)

# Ce que Django envoie à SQLite (paramétré) :
# SELECT * FROM materiel WHERE statut = ? AND structure_id = ?
# params: ('en_service', 5)  ← jamais concaténé dans la chaîne SQL</pre>
<p>Même si un utilisateur malveillant saisit <code>' OR 1=1 --</code>, cette valeur est traitée comme un texte littéral, jamais comme du SQL exécutable.</p>`,freq:"hot",},
  {id:"p1_11",proj:"p1",num:11,category:`ORM & Requêtes`,thematique:"",question:`Qu'est-ce qu'une migration Django et comment cela fonctionne-t-il ?`,answer:`<p>Une migration est un fichier Python qui décrit une modification du schéma de la base de données (ajout de table, de colonne, de contrainte…). C'est le système de versionnage du schéma.</p>
<pre># 1. Créer la migration après modification du modèle
python manage.py makemigrations

# 2. Appliquer la migration en base
python manage.py migrate

# Voir l'état des migrations
python manage.py showmigrations</pre>
<p>Chaque migration est numérotée (<code>0001_initial.py</code>, <code>0002_add_column.py</code>…) et peut être rejouée sur n'importe quel environnement. C'est ce qui permet à <code>deploy.sh</code> de mettre à jour la BDD en production automatiquement.</p>`,freq:"easy",},
  {id:"p1_12",proj:"p1",num:12,category:`Sécurité`,thematique:"",question:`Qu'est-ce qu'une attaque CSRF et comment Django s'en protège-t-il ?`,answer:`<p>CSRF (Cross-Site Request Forgery) : un site malveillant force le navigateur de l'utilisateur connecté à envoyer une requête à votre site à son insu.</p>
<p>Django génère un token CSRF unique par session, caché dans chaque formulaire. Le serveur vérifie ce token à chaque requête POST. Un site externe ne peut pas connaître ce token.</p>
<pre>&lt;!-- Dans chaque formulaire Django --&gt;
{% csrf_token %}
&lt;!-- Génère : &lt;input type="hidden" name="csrfmiddlewaretoken" value="abc123..."&gt; --&gt;

// Dans les requêtes AJAX :
headers: { 'X-CSRFToken': csrfToken }</pre>`,freq:"hot",},
  {id:"p1_13",proj:"p1",num:13,category:`Sécurité`,thematique:"",question:`Qu'est-ce qu'une attaque XSS et comment l'avez-vous évitée ?`,answer:`<p>XSS (Cross-Site Scripting) : un attaquant injecte du code JavaScript malveillant dans une page pour voler des données ou prendre le contrôle du navigateur.</p>
<p>Django échappe automatiquement tous les caractères dangereux dans les templates : <code>&lt;</code> devient <code>&amp;lt;</code>, <code>&gt;</code> devient <code>&amp;gt;</code>, etc. Même si un utilisateur saisit <code>&lt;script&gt;alert('hack')&lt;/script&gt;</code>, Django l'affiche comme du texte, il n'est pas exécuté.</p>`,freq:"hot",},
  {id:"p1_14",proj:"p1",num:14,category:`Sécurité`,thematique:"",question:`Pourquoi avez-vous mis en place une session unique par utilisateur ?`,answer:`<p>Pour éviter qu'un technicien reste connecté sur un PC public oublié pendant que quelqu'un d'autre se connecte avec son compte. Quand une nouvelle connexion est détectée, l'ancienne session est immédiatement invalidée.</p>
<pre>class UniqueSessionMiddleware:
    def __call__(self, request):
        if request.user.is_authenticated:
            session_active = SessionActive.objects.filter(user=request.user).first()
            if session_active and session_active.session_key != request.session.session_key:
                # Invalider l'ancienne session
                Session.objects.filter(session_key=session_active.session_key).delete()</pre>`,freq:"hot",},
  {id:"p1_15",proj:"p1",num:15,category:`Sécurité`,thematique:"",question:`Pourquoi stocker les secrets dans un fichier <code>.env</code> plutôt que dans le code ?`,answer:`<p>Si <code>SECRET_KEY</code> est dans le code, elle est visible par tous ceux qui ont accès au dépôt Git (y compris l'historique). Un attaquant connaissant la <code>SECRET_KEY</code> peut forger des cookies de session et des tokens CSRF.</p>
<p>Le fichier <code>.env</code> n'est jamais commité (ajouté au <code>.gitignore</code>). Un fichier <code>.env.example</code> documente les variables attendues sans exposer les valeurs réelles.</p>`,freq:"easy",},
  {id:"p1_16",proj:"p1",num:16,category:`Architecture & Déploiement`,thematique:"",question:`Quel est le rôle de Nginx par rapport à Gunicorn ?`,answer:`<p><b>Nginx</b> est le serveur web en façade : il gère les connexions HTTP/HTTPS, sert les fichiers statiques (CSS, JS, images) très rapidement sans passer par Python, et transfère uniquement les requêtes dynamiques à Gunicorn.</p>
<p><b>Gunicorn</b> est le serveur d'application Python (WSGI) : il exécute Django et gère les requêtes dynamiques avec plusieurs workers en parallèle.</p>
<p>Django seul (<code>runserver</code>) n'est pas fait pour la production : il ne gère pas la concurrence correctement et sert les fichiers statiques lentement.</p>`,freq:"med",},
  {id:"p1_17",proj:"p1",num:17,category:`Architecture & Déploiement`,thematique:"",question:`Comment fonctionne votre script <code>deploy.sh</code> ? Pourquoi le mode <code>--dry-run</code> ?`,answer:`<p>Le script enchaîne toutes les étapes de mise à jour : sauvegarde BDD → git pull → pip install → migrate → collectstatic → restart Gunicorn → reload Nginx. Chaque étape est journalisée avec un horodatage.</p>
<p>Le mode <code>--dry-run</code> affiche ce qui serait exécuté sans rien faire. Il permet de vérifier qu'aucune migration cassante n'attend avant de déployer en production, sans risquer d'interrompre le service.</p>`,freq:"med",},
  {id:"p1_18",proj:"p1",num:18,category:`Architecture & Déploiement`,thematique:"",question:`Pourquoi avez-vous utilisé <code>X-Accel-Redirect</code> pour les fichiers uploadés ?`,answer:`<p>Sans protection, les fichiers dans <code>/media/</code> sont accessibles directement via leur URL, sans authentification. N'importe qui connaissant l'URL pourrait télécharger une facture ou un bon de livraison.</p>
<p>Avec <code>X-Accel-Redirect</code> : Django vérifie d'abord que l'utilisateur est connecté, puis renvoie un header spécial à Nginx pour servir le fichier. Le fichier ne passe jamais par Python, mais il n'est accessible qu'après vérification.</p>`,freq:"med",},
  {id:"p1_19",proj:"p1",num:19,category:`Principes de programmation`,thematique:"",question:`Qu'est-ce que le principe DRY ?`,answer:`<p>DRY = "Don't Repeat Yourself" (ne pas se répéter). Toute logique doit exister à un seul endroit dans le code. Si vous copiez-collez du code, c'est un signal que quelque chose doit être factorisé en fonction, classe ou mixin.</p>
<p>Dans votre projet : le filtrage par structure est dans le mixin <code>StructureFilterMixin</code>, la logique de prêt dans <code>MaterielService</code>. Changer ces règles à un seul endroit met à jour tout le comportement.</p>`,freq:"easy",},
  {id:"p1_20",proj:"p1",num:20,category:`Principes de programmation`,thematique:"",question:`Qu'est-ce que le principe SRP (Single Responsibility Principle) ?`,answer:`<p>SRP : chaque classe ou module ne doit avoir qu'une seule raison de changer — une seule responsabilité.</p>
<p>Dans votre projet :<br/>
        — Le modèle <code>Pret</code> gère la structure de données et la validation.<br/>
        — Le signal gère la clôture automatique des affectations.<br/>
        — <code>MaterielService</code> gère la logique métier réutilisable.<br/>
        Si vous mélangez tout dans le modèle, il devient difficile à tester et à maintenir.</p>`,freq:"easy",},
  {id:"p1_21",proj:"p1",num:21,category:`Principes de programmation`,thematique:"",question:`Qu'est-ce qu'une propriété calculée (<code>@property</code>) en Python ?`,answer:`<p>Un <code>@property</code> permet d'accéder à une valeur calculée comme si c'était un attribut, sans l'écrire en base de données.</p>
<pre>class Pret(models.Model):
    date_restitution = models.DateField()
    est_rendu        = models.BooleanField(default=False)

    @property
    def est_en_retard(self):
        """Calculé à la volée — pas stocké en BDD."""
        if self.est_rendu:
            return False
        return date.today() &gt; self.date_restitution

# Utilisation : pret.est_en_retard  (pas pret.est_en_retard())</pre>`,freq:"med",},
  {id:"p1_22",proj:"p1",num:22,category:`Principes de programmation`,thematique:"",question:`Comment avez-vous réalisé les exports PDF et Excel ?`,answer:`<p><b>PDF</b> avec ReportLab : on construit le document Python en définissant les éléments (titre, tableau, style) puis on génère un fichier binaire qu'on renvoie avec <code>Content-Disposition: attachment</code>.</p>
<p><b>Excel</b> avec openpyxl : on crée un classeur Python, on écrit les données cellule par cellule, on applique des styles, puis on le sauvegarde dans un buffer mémoire et on l'envoie en téléchargement.</p>
<p>Les deux utilisent des vues Django protégées par <code>@login_required</code> — pas de téléchargement anonyme.</p>`,freq:"easy",},
  {id:"p1_23",proj:"p1",num:23,category:`Tests`,thematique:"",question:`Qu'est-ce qu'un test unitaire ? Comment en avez-vous écrit ?`,answer:`<p>Un test unitaire vérifie qu'une fonction ou méthode précise produit le bon résultat dans un cas donné. Il est isolé : il ne dépend pas du réseau, d'autres services ou d'autres tests.</p>
<pre>class MaterielCreationTests(TestCase):
    def test_code_unique_en_creation_concurrente(self):
        """4 threads créent un PC en même temps → codes uniques."""
        from concurrent.futures import ThreadPoolExecutor
        def creer_pc():
            Materiel.objects.create(type_materiel=self.type_pc, ...)
        with ThreadPoolExecutor(max_workers=4) as ex:
            futures = [ex.submit(creer_pc) for _ in range(4)]
        codes = list(Materiel.objects.values_list('code', flat=True))
        self.assertEqual(len(codes), len(set(codes)))  # Pas de doublons</pre>`,freq:"med",},
  {id:"p1_24",proj:"p1",num:24,category:`Tests`,thematique:"",question:`Qu'est-ce qu'un jeu d'essai et comment l'avez-vous construit ?`,answer:`<p>Un jeu d'essai est un ensemble de cas de test qui vérifient qu'une fonctionnalité se comporte correctement. Pour chaque cas, on définit : les données en entrée, le résultat attendu, et le résultat réellement obtenu.</p>
<p>Pour la fonctionnalité de prêt :<br/>
        — Cas nominal : prêt créé avec les bonnes dates → ✅ utilisateur pré-rempli<br/>
        — Cas d'erreur : date restitution avant date prêt → ✅ ValidationError levée<br/>
        — Cas limite : prêt en retard → ✅ badge rouge affiché<br/>
        — Cas concurrence : 4 matériels créés simultanément → ✅ 0 doublon de code</p>`,freq:"hot",},
  {id:"p1_25",proj:"p1",num:25,category:`Tests`,thematique:"",question:`Qu'est-ce qu'une commande de gestion Django (<code>management command</code>) ?`,answer:`<p>C'est un script Python qu'on peut appeler en ligne de commande via <code>python manage.py mon_commande</code>. Il a accès à tout l'environnement Django (modèles, BDD, settings).</p>
<pre># Structure : parcinformatique/management/commands/envoyer_alertes_pret.py
class Command(BaseCommand):
    help = 'Envoie les alertes email pour les prêts en retard'

    def add_arguments(self, parser):
        parser.add_argument('--seuil', type=int, default=7)
        parser.add_argument('--dry-run', action='store_true')

    def handle(self, *args, **options):
        prets = Pret.objects.filter(est_rendu=False, ...)
        # ... logique d'envoi email</pre>
<p>Planifié dans cron : <code>0 8 * * * python manage.py envoyer_alertes_pret --seuil 7</code></p>`,freq:"med",},
  {id:"p1_26",proj:"p1",num:26,category:`Tests`,thematique:"",question:`Qu'est-ce que le Django Admin et comment l'avez-vous personnalisé ?`,answer:`<p>Django Admin est une interface d'administration auto-générée à partir des modèles. Elle permet de créer, lire, modifier et supprimer des données sans développer un front-end custom.</p>
<p>Personnalisations réalisées :<br/>
        — Templates HTML surchargés (<code>base_site.html</code>, <code>nav_sidebar.html</code>, <code>change_list.html</code>) pour la charte graphique<br/>
        — Tailwind CSS pour le style responsive<br/>
        — Filtres avancés personnalisés (<code>list_filter</code>, <code>search_fields</code>)<br/>
        — Actions personnalisées (exporter en PDF/Excel)<br/>
        — Mixins de permission pour le filtrage par structure</p>`,freq:"easy",},
  {id:"p1_27",proj:"p1",num:27,category:`Tests`,thematique:"",question:`Qu'est-ce que <code>update_fields</code> dans <code>save()</code> ?`,answer:`<p>Par défaut, <code>save()</code> met à jour toutes les colonnes de la ligne en BDD. <code>update_fields</code> restreint la mise à jour aux seules colonnes spécifiées, ce qui est plus performant et évite d'écraser des modifications concurrentes.</p>
<pre># Met à jour TOUTES les colonnes (risque d'écrasement)
pret.save()

# Met à jour SEULEMENT est_rendu et date_retour_reelle
pret.save(update_fields=['est_rendu', 'date_retour_reelle'])</pre>
<p>Dans le service de retour de prêt, les 3 objets modifiés utilisent <code>update_fields</code> pour minimiser les requêtes SQL et éviter les conflits.</p>`,freq:"med",},
  {id:"p1_28",proj:"p1",num:28,category:`Tests`,thematique:"",question:`Qu'est-ce que la RGPD et comment en avez-vous tenu compte ?`,answer:`<p>Le RGPD (Règlement Général sur la Protection des Données) impose de protéger les données personnelles des utilisateurs : collecte minimale, sécurisation, accès restreint.</p>
<p>Mesures prises :<br/>
        — Accès par rôle (profil consultation / staff / superuser)<br/>
        — Données personnelles (noms des agents) non exportées en clair dans les CSV publics<br/>
        — Fichiers joints (factures) accessibles uniquement aux utilisateurs connectés<br/>
        — Mots de passe hashés par Django (PBKDF2 SHA-256 par défaut)</p>`,freq:"easy",}
];
