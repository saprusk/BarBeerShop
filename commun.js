/* =========================================================================
   SCRIPT COMMUN A TOUTES LES PAGES
   -------------------------------------------------------------------------
   Deux choses seulement :
     1. regler l'unite de mesure "--u" utilisee par tout le CSS
     2. gerer le bouton bascule jour / nuit
   ========================================================================= */

/* -------------------------------------------------------------------------
   #unite de mesure de la page
   Toute la mise en page est calee sur la maquette grace a la variable "--u" :
   1 unite = 1 pixel de la maquette.

   Il existe DEUX maquettes : 1920 px de large pour les grands ecrans, 430
   pour le telephone. On bascule de l'une a l'autre a 1024 px, exactement au
   meme endroit que les deux feuilles de style (commun.css et mobile.css).

   On calcule avec la largeur REELLE de la page, car l'unite "vw" du CSS
   compte aussi la barre de defilement verticale, ce qui decalerait tout
   d'environ 1 %.

   Sur telephone la colonne prend toute la largeur, mais elle arrete de
   grandir a 520 px : au-dela (tablette), elle se centre au lieu de grossir
   indefiniment.
   ------------------------------------------------------------------------- */
const BASCULE_MOBILE = 1024;   // en dessous : maquette telephone
const COLONNE_MAXI   = 520;    // largeur maxi de la colonne du telephone

function reglerUnite() {
  const largeurReelle = document.documentElement.clientWidth;
  /* Il arrive que la page n'ait pas encore de largeur (onglet en arriere-plan,
     fenetre en cours de redimensionnement). Dans ce cas on ne touche a rien :
     sinon toute la mise en page se retrouverait a zero. */
  if (!largeurReelle) return;
  const surTelephone = largeurReelle < BASCULE_MOBILE;
  const largeurUtile  = surTelephone ? Math.min(largeurReelle, COLONNE_MAXI) : largeurReelle;
  const maquette      = surTelephone ? 430 : 1920;
  document.body.style.setProperty('--u', (largeurUtile / maquette) + 'px');
  document.documentElement.classList.toggle('sur-telephone', surTelephone);
}
reglerUnite();
window.addEventListener('resize', reglerUnite);
window.addEventListener('load', reglerUnite);
/* Un observateur, pour les cas ou la largeur de la page change sans qu'un
   evenement "resize" soit emis (barre de defilement qui apparait, fenetre
   redimensionnee avant la fin du chargement...). */
if (window.ResizeObserver) {
  new ResizeObserver(reglerUnite).observe(document.documentElement);
}

/* -------------------------------------------------------------------------
   #menu du telephone
   Le bouton aux trois traits ouvre et ferme le panneau qui glisse depuis la
   gauche. On ferme aussi quand on clique un lien ou quand on appuie sur la
   touche Echap.
   ------------------------------------------------------------------------- */
const boutonMenu = document.getElementById('boutonMenu');
const panneauMenu = document.getElementById('menuMobile');

function reglerMenu(ouvert) {
  if (!boutonMenu || !panneauMenu) return;
  panneauMenu.dataset.ouvert = ouvert ? 'oui' : 'non';
  boutonMenu.setAttribute('aria-expanded', ouvert ? 'true' : 'false');
  document.documentElement.classList.toggle('menu-ouvert', ouvert);
}

if (boutonMenu && panneauMenu) {
  reglerMenu(false);
  boutonMenu.addEventListener('click', () => {
    reglerMenu(panneauMenu.dataset.ouvert !== 'oui');
  });
  panneauMenu.querySelectorAll('a').forEach(lien => {
    lien.addEventListener('click', () => reglerMenu(false));
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') reglerMenu(false);
  });
  // si l'on repasse sur un grand ecran, le menu n'a plus lieu d'etre ouvert
  window.addEventListener('resize', () => {
    if (document.documentElement.clientWidth >= BASCULE_MOBILE) reglerMenu(false);
  });
}

/* -------------------------------------------------------------------------
   #bascule jour / nuit
   Ajoute ou retire la classe "nuit" sur la page. En mode nuit, les surfaces
   claires prennent une teinte plus chaude (mode "Night Shift" de la
   maquette). Le choix est retenu d'une visite a l'autre et d'une page a
   l'autre grace a localStorage.
   ------------------------------------------------------------------------- */
/* Il y a deux boutons de bascule : celui de la barre des grands ecrans et
   celui range dans le menu du telephone. Les deux font la meme chose. */
const boutonsBascule = document.querySelectorAll('#basculeJourNuit, #basculeJourNuitMob');

function noterMode(enModeNuit) {
  boutonsBascule.forEach(b => b.setAttribute('aria-pressed', enModeNuit ? 'true' : 'false'));
}

// on applique le mode choisi lors de la visite precedente
if (localStorage.getItem('modeNuit') === 'oui') {
  document.documentElement.classList.add('nuit');
  noterMode(true);
}

boutonsBascule.forEach(bouton => {
  bouton.addEventListener('click', () => {
    const enModeNuit = document.documentElement.classList.toggle('nuit');
    noterMode(enModeNuit);
    localStorage.setItem('modeNuit', enModeNuit ? 'oui' : 'non');
  });
});

/* -------------------------------------------------------------------------
   #carrousels a fleches
   Sert au carrousel des avis (accueil) et a celui des formules (barber).
   Chaque carrousel est decrit par trois identifiants : la fenetre qui
   defile, le bouton "precedent" et le bouton "suivant".
   Un clic fait avancer ou reculer d'UNE carte exactement.
   ------------------------------------------------------------------------- */
function brancherCarrousel(idFenetre, idPrecedent, idSuivant, selecteurCarte) {
  const fenetre = document.getElementById(idFenetre);
  const precedent = document.getElementById(idPrecedent);
  const suivant = document.getElementById(idSuivant);
  if (!fenetre || !precedent || !suivant) return;   // pas ce carrousel sur cette page

  // largeur d'une carte + l'ecart qui la separe de la suivante
  function pasDUneCarte() {
    const carte = fenetre.querySelector(selecteurCarte);
    const piste = carte.parentElement;
    const ecart = parseFloat(getComputedStyle(piste).columnGap) || 0;
    return carte.getBoundingClientRect().width + ecart;
  }

  precedent.addEventListener('click', () => { fenetre.scrollLeft -= pasDUneCarte(); });
  suivant.addEventListener('click',   () => { fenetre.scrollLeft += pasDUneCarte(); });

  // Au chargement, on se cale sur la 2e carte : la 1re depasse alors a
  // gauche et la derniere a droite, comme dans la maquette.
  function calerAuDepart() {
    fenetre.style.scrollBehavior = 'auto';   // pas d'animation au chargement
    fenetre.scrollLeft = pasDUneCarte();
    requestAnimationFrame(() => { fenetre.style.scrollBehavior = ''; });
  }
  window.addEventListener('load', calerAuDepart);
  window.addEventListener('resize', calerAuDepart);
}

// carrousel des avis (page d'accueil)
brancherCarrousel('avisFenetre', 'avisPrecedent', 'avisSuivant', '.avis-carte');

/* -------------------------------------------------------------------------
   #fiche produit (page "Notre concept")
   Un clic sur un produit ouvre une fenetre avec sa fiche detaillee.
   Les informations de chaque produit sont rangees dans une balise
   "template" placee juste a cote de la vignette, dans le HTML.
   ------------------------------------------------------------------------- */
const ficheFond = document.getElementById('ficheFond');

if (ficheFond) {
  const ficheImage       = document.getElementById('ficheImage');
  const ficheNom         = document.getElementById('ficheNom');
  const ficheFamille     = document.getElementById('ficheFamille');
  const ficheDescription = document.getElementById('ficheDescription');
  const fichePrix        = document.getElementById('fichePrix');
  const ficheFermer      = document.getElementById('ficheFermer');

  function ouvrirFiche(idProduit) {
    const infos = document.getElementById('fiche-' + idProduit);
    if (!infos) return;
    ficheImage.src         = infos.dataset.image;
    ficheImage.alt         = infos.dataset.nom;
    ficheNom.textContent   = infos.dataset.nom;
    ficheFamille.textContent = infos.dataset.famille;   // dernier niveau du fil d'Ariane
    fichePrix.textContent  = infos.dataset.prix;
    ficheDescription.textContent = infos.innerHTML.trim();
    ficheFond.hidden = false;
    document.body.style.overflow = 'hidden';   // on bloque le defilement du fond
    ficheFermer.focus();
  }

  function fermerFiche() {
    ficheFond.hidden = true;
    document.body.style.overflow = '';
  }

  // clic sur une vignette de produit
  document.querySelectorAll('.produit-vignette').forEach(bouton => {
    bouton.addEventListener('click', () => ouvrirFiche(bouton.dataset.produit));
  });

  // fermeture : par le bouton, par un clic sur le fond, ou avec la touche Echap
  ficheFermer.addEventListener('click', fermerFiche);
  ficheFond.addEventListener('click', e => { if (e.target === ficheFond) fermerFiche(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') fermerFiche(); });
}


/* -------------------------------------------------------------------------
   #carte du bar : les categories s'ouvrent au toucher
   Sur telephone, les cinq colonnes de la carte deviennent cinq categories
   repliees. Une pression sur un bandeau ouvre la liste et referme les
   autres. Sur grand ecran, tout reste affiche comme avant.
   ------------------------------------------------------------------------- */
(function brancherCarteDuBar() {
  const colonnes = document.querySelectorAll('.carte-colonnes .colonne');
  if (!colonnes.length) return;

  colonnes.forEach(colonne => {
    const bandeau = colonne.querySelector('h3');
    if (!bandeau) return;
    bandeau.setAttribute('role', 'button');
    bandeau.setAttribute('tabindex', '0');
    const basculer = () => {
      const etaitOuverte = colonne.dataset.ouvert === 'oui';
      colonnes.forEach(c => { c.dataset.ouvert = 'non'; });
      colonne.dataset.ouvert = etaitOuverte ? 'non' : 'oui';
    };
    bandeau.addEventListener('click', basculer);
    bandeau.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); basculer(); }
    });
  });

  // au chargement, la maquette montre les bieres rouges ouvertes
  const rouges = [...colonnes].find(c => /rouges/i.test(c.querySelector('h3').textContent));
  if (rouges) rouges.dataset.ouvert = 'oui';
})();
