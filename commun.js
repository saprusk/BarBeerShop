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
   1 unite = 1 pixel de la maquette (qui fait 1920 de large).
   On la calcule ici avec la largeur REELLE de la page, car l'unite "vw" du
   CSS compte aussi la barre de defilement verticale, ce qui decalerait tout
   d'environ 1 %.
   ------------------------------------------------------------------------- */
function reglerUnite() {
  const largeurReelle = document.documentElement.clientWidth;
  document.body.style.setProperty('--u', (largeurReelle / 1920) + 'px');
}
reglerUnite();
window.addEventListener('resize', reglerUnite);

/* -------------------------------------------------------------------------
   #bascule jour / nuit
   Ajoute ou retire la classe "nuit" sur la page. En mode nuit, les surfaces
   claires prennent une teinte plus chaude (mode "Night Shift" de la
   maquette). Le choix est retenu d'une visite a l'autre et d'une page a
   l'autre grace a localStorage.
   ------------------------------------------------------------------------- */
const boutonBascule = document.getElementById('basculeJourNuit');

// on applique le mode choisi lors de la visite precedente
if (localStorage.getItem('modeNuit') === 'oui') {
  document.documentElement.classList.add('nuit');
  if (boutonBascule) boutonBascule.setAttribute('aria-pressed', 'true');
}

if (boutonBascule) {
  boutonBascule.addEventListener('click', () => {
    const enModeNuit = document.documentElement.classList.toggle('nuit');
    boutonBascule.setAttribute('aria-pressed', enModeNuit ? 'true' : 'false');
    localStorage.setItem('modeNuit', enModeNuit ? 'oui' : 'non');
  });
}

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
