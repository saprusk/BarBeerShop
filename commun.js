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
/* -------------------------------------------------------------------------
   #carrousel des avis
   Cinq avis, trois visibles a la fois. Les fleches font tourner d'un cran.
   L'inclinaison depend de la PLACE occupee et non de la carte :
       la place du milieu ...... 0 degre
       ses deux voisines ....... 7 degres (a droite) / -7 (a gauche)
       les deux qui attendent .. 14 degres / -14
   Ainsi, quand une carte arrive au centre elle se redresse toute seule.
   ------------------------------------------------------------------------- */
function brancherAvis() {
  const piste = document.querySelector('.avis-piste');
  const precedent = document.getElementById('avisPrecedent');
  const suivant = document.getElementById('avisSuivant');
  if (!piste || !precedent || !suivant) return;

  const cartes = [...piste.querySelectorAll('.avis-carte')];
  if (!cartes.length) return;
  let centre = Math.floor(cartes.length / 2);   // on demarre sur celle du milieu

  /* "anime" vaut vrai seulement quand on clique une fleche : au chargement
     et au redimensionnement, la piste se place d'un coup, sans glissement. */
  function placer(anime) {
    const cible = cartes[centre];
    const fenetre = piste.parentElement.clientWidth;
    if (!cible.offsetWidth || !fenetre) return;   // pas encore mesurable
    // On amene la carte choisie pile au milieu de la fenetre. On se base sur
    // offsetLeft/offsetWidth, qui ignorent l'inclinaison des cartes (leur
    // "getBoundingClientRect" serait fausse par la rotation).
    const decalage = fenetre / 2 - (cible.offsetLeft + cible.offsetWidth / 2);
    if (!anime) piste.style.transition = 'none';
    piste.style.transform = `translateX(${decalage}px)`;
    // unite du site : la descente suit l'echelle de la page
    const u = parseFloat(getComputedStyle(document.body).getPropertyValue('--u')) || 1;
    cartes.forEach((carte, i) => {
      const place = Math.max(-2, Math.min(2, i - centre));   // -2 .. +2
      carte.style.setProperty('--angle', (place * 8) + 'deg');
      // Trajectoire circulaire : la descente augmente comme le CARRE de la
      // distance au centre (place^2). La carte du milieu reste en haut, ses
      // voisines descendent un peu, et les deux qui attendent sur les cotes
      // arrivent nettement plus bas, comme si elles montaient le long d'un
      // cercle avant de se redresser au centre.
      carte.style.setProperty('--descente', (place * place * 46 * u) + 'px');
    });
    if (!anime) {
      piste.getBoundingClientRect();           // on force le calcul...
      piste.style.transition = '';             // ...avant de rendre le glissement
    }
  }

  precedent.addEventListener('click', () => {
    centre = Math.max(0, centre - 1);
    placer(true);
  });
  suivant.addEventListener('click', () => {
    centre = Math.min(cartes.length - 1, centre + 1);
    placer(true);
  });

  placer(false);
  window.addEventListener('resize', () => placer(false));
  window.addEventListener('load', () => placer(false));
  // les polices changent la largeur des cartes une fois chargees : on
  // recale alors la piste, sinon le centrage garde l'ancienne mesure
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => placer(false));
  }
}
brancherAvis();

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


/* -------------------------------------------------------------------------
   #carte du bar sur grand ecran : les fleches font tourner 3 colonnes
   La fenetre laisse voir trois colonnes ; un clic amene les trois
   suivantes. Le glissement au doigt ou au pave tactile marche aussi, la
   fenetre etant deja defilable.
   ------------------------------------------------------------------------- */
(function brancherCarteGrandEcran() {
  const fenetre = document.getElementById('carteFenetre');
  const precedente = document.getElementById('cartePrecedente');
  const suivante = document.getElementById('carteSuivante');
  if (!fenetre || !precedente || !suivante) return;

  function pasDeTroisColonnes() {
    const colonne = fenetre.querySelector('.colonne');
    const piste = fenetre.querySelector('.carte-colonnes');
    if (!colonne || !piste) return 0;
    const ecart = parseFloat(getComputedStyle(piste).columnGap) || 0;
    return (colonne.getBoundingClientRect().width + ecart) * 3;
  }
  precedente.addEventListener('click', () => { fenetre.scrollLeft -= pasDeTroisColonnes(); });
  suivante.addEventListener('click',   () => { fenetre.scrollLeft += pasDeTroisColonnes(); });
})();


/* -------------------------------------------------------------------------
   #glissieres du telephone
   Sur petit ecran, plusieurs blocs ne montrent qu'un element a la fois :
   les avis, les photos Instagram, l'equipe... On leur ajoute deux fleches
   qui font passer d'un element au suivant. Le glissement au doigt continue
   de fonctionner : les fleches ne font que deplacer le defilement.
   Chaque glissiere est decrite par la classe de son conteneur.
   ------------------------------------------------------------------------- */
function brancherGlissiere(selecteurBande, selecteurElement, pas) {
  pas = pas || 1;   // de combien d'elements on avance a chaque fleche
  const bande = document.querySelector(selecteurBande);
  if (!bande || bande.dataset.glissiere === 'oui') return;

  // ":scope >" : uniquement les enfants DIRECTS, sinon on attraperait aussi
  // les images a l'interieur des liens et le pas serait fausse.
  const elements = [...bande.querySelectorAll(':scope > ' + selecteurElement)];
  if (elements.length < 2) return;
  bande.dataset.glissiere = 'oui';
  let index = 0;

  const aller = () => {
    index = Math.max(0, Math.min(elements.length - 1, index));
    // scrollIntoView centre l'element dans sa bande, quel que soit l'ecart
    // ou le "scroll-snap" (poser scrollLeft directement echouait a cause du
    // snap). "block: nearest" evite de faire defiler la page entiere.
    elements[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  const fleche = (sens, texte, cote) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'glissiere-fleche glissiere-fleche-' + cote;
    b.setAttribute('aria-label', sens < 0 ? 'Précédent' : 'Suivant');
    b.innerHTML = texte;
    b.addEventListener('click', () => { index += sens * pas; aller(); });
    return b;
  };

  const cadre = bande.parentElement;
  if (getComputedStyle(cadre).position === 'static') cadre.style.position = 'relative';
  const gauche = fleche(-1, '&#9664;', 'gauche');
  const droite = fleche(1, '&#9654;', 'droite');
  cadre.appendChild(gauche);
  cadre.appendChild(droite);

  // On centre les fleches verticalement sur la BANDE (et non sur tout le
  // cadre) : ainsi elles se retrouvent pile a hauteur des elements.
  function centrerFleches() {
    const rc = cadre.getBoundingClientRect();
    // on centre les fleches sur la premiere IMAGE (l'illustration ou la photo)
    // et non sur toute la bande, qui inclut aussi le nom et la description.
    const ref = bande.querySelector('img') || bande;
    const rr = ref.getBoundingClientRect();
    const centre = rr.top - rc.top + rr.height / 2;
    // Tant que l'image n'est pas mesurable (pas encore chargee), on ne fige
    // rien : un calcul errone poserait les fleches n'importe ou.
    if (!isFinite(centre) || rr.height === 0) return;
    [gauche, droite].forEach(f => {
      f.style.top = centre + 'px';
      f.style.transform = 'translateY(-50%)';
    });
  }
  centrerFleches();
  window.addEventListener('resize', centrerFleches);
  window.addEventListener('load', centrerFleches);   // apres chargement des images
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(centrerFleches);
  // filet de securite : on recentre une fois la premiere image chargee
  const premiereImage = bande.querySelector('img');
  if (premiereImage && !premiereImage.complete) {
    premiereImage.addEventListener('load', centrerFleches);
  }
  // et quelques recalculs differes, le temps que la mise en page se stabilise
  // (les illustrations SVG ne sont pas toujours mesurables tout de suite)
  [120, 400, 900].forEach(ms => setTimeout(centrerFleches, ms));
}

/* On ne les branche que sur telephone, et on rebranche si la fenetre change
   de taille (par exemple quand on tourne l'appareil). */
function brancherLesGlissieres() {
  if (document.documentElement.clientWidth >= BASCULE_MOBILE) return;
  brancherGlissiere('.instagram-galerie', 'a');
  brancherGlissiere('.equipe', '.membre');
  // la galerie produit est une grille de 3 lignes : une fleche fait donc
  // avancer d'une COLONNE entiere, soit 3 produits d'un coup.
  brancherGlissiere('.grille-produits', 'figure', 3);
}
brancherLesGlissieres();
window.addEventListener('resize', brancherLesGlissieres);


/* -------------------------------------------------------------------------
   #diaporama du hero
   Certaines pages ont un hero a plusieurs "diapos" (ex : le bar alterne
   l'evenement et les horaires). On les fait defiler toutes les 4 secondes,
   aussi bien sur telephone que sur grand ecran.
   ------------------------------------------------------------------------- */
(function brancherHeroDiapos() {
  document.querySelectorAll('.hero-diapos').forEach(conteneur => {
    const diapos = [...conteneur.querySelectorAll('.hero-diapo')];
    if (diapos.length < 2) return;
    let actif = diapos.findIndex(d => d.dataset.actif === 'oui');
    if (actif < 0) actif = 0;
    setInterval(() => {
      diapos[actif].dataset.actif = 'non';
      actif = (actif + 1) % diapos.length;
      diapos[actif].dataset.actif = 'oui';
    }, 4000);
  });
})();


/* -------------------------------------------------------------------------
   #formules du barber sur telephone
   Une pression sur une formule l'ouvre et montre ce qu'elle contient ; une
   seule reste ouverte a la fois. Sur grand ecran, rien ne change : les
   formules sont deja completes.
   ------------------------------------------------------------------------- */
(function brancherFormulesTelephone() {
  const zone = document.querySelector('.zone-brune');
  const formules = [...document.querySelectorAll('.formule')];
  if (!zone || !formules.length) return;

  /* Tous les blocs de la zone brune poses SOUS les formules : quand une
     formule s'ouvre, ceux qui sont plus bas descendent d'autant. On les
     recupere par leur "offsetParent" (la zone elle-meme), et on ajoute a la
     main la photo des produits, seule a etre logee dans la 3e formule. */
  function collecterPile() {
    const pile = [...zone.querySelectorAll('*')].filter(el =>
      el.offsetParent === zone && getComputedStyle(el).position === 'absolute'
    );
    const photo = zone.querySelector('.formule-photo-zone');
    if (photo && !pile.includes(photo)) pile.push(photo);
    return pile;
  }

  let pile = [];
  let hauteurZoneBase = 0;

  function reinitialiser() {
    pile.forEach(el => { el.style.top = ''; });
    zone.style.height = '';
  }

  /* On releve les positions de repos (toutes formules fermees).
     - topBase : le "top" propre a l'element (dans le repere de son parent),
       c'est lui que l'on modifiera ;
     - absBase : sa position absolue dans la zone, pour savoir s'il est au-
       dessus ou au-dessous de la formule ouverte. */
  function mesurer() {
    formules.forEach(f => { f.dataset.ouverte = 'non'; });
    pile = collecterPile();
    reinitialiser();
    const hautZone = zone.getBoundingClientRect().top;
    pile.forEach(el => {
      el._topBase = el.offsetTop;
      el._absBase = el.getBoundingClientRect().top - hautZone;
    });
    formules.forEach(f => { f._hFermee = f.getBoundingClientRect().height; });
    hauteurZoneBase = zone.offsetHeight;
  }

  function appliquer() {
    if (document.documentElement.clientWidth >= BASCULE_MOBILE) { reinitialiser(); return; }
    const ouverte = formules.find(f => f.dataset.ouverte === 'oui');
    let extra = 0;
    let seuil = Infinity;
    if (ouverte) {
      extra = ouverte.getBoundingClientRect().height - ouverte._hFermee;
      seuil = ouverte._absBase;
    }
    pile.forEach(el => {
      const decale = el._absBase > seuil ? extra : 0;
      el.style.top = (el._topBase + decale) + 'px';
    });
    zone.style.height = (hauteurZoneBase + extra) + 'px';
  }

  formules.forEach(formule => {
    formule.style.cursor = 'pointer';
    formule.setAttribute('role', 'button');
    formule.setAttribute('tabindex', '0');
    const basculer = () => {
      if (document.documentElement.clientWidth >= BASCULE_MOBILE) return;
      const ouverte = formule.dataset.ouverte === 'oui';
      formules.forEach(f => { f.dataset.ouverte = 'non'; });
      formule.dataset.ouverte = ouverte ? 'non' : 'oui';
      appliquer();
    };
    formule.addEventListener('click', basculer);
    formule.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); basculer(); }
    });
  });

  window.addEventListener('load', mesurer);
  window.addEventListener('resize', () => { mesurer(); });
  mesurer();
})();


/* -------------------------------------------------------------------------
   #FAQ de l'espace compte sur telephone
   Les blocs de la page sont poses en absolu : la section ne grandit donc
   pas toute seule quand une reponse s'ouvre, et le pied de page passerait
   par-dessus. On recalcule sa hauteur a chaque ouverture.
   ------------------------------------------------------------------------- */
(function ajusterEspaceCompte() {
  const page = document.querySelector('.page-espace');
  const faq = document.querySelector('.faq');
  if (!page || !faq) return;

  function ajuster() {
    page.style.height = '';
    if (document.documentElement.clientWidth >= BASCULE_MOBILE) return;
    const basDeLaFaq = faq.offsetTop + faq.offsetHeight;
    const marge = parseFloat(getComputedStyle(document.body).getPropertyValue('--u')) * 40;
    if (basDeLaFaq + marge > page.offsetHeight) {
      page.style.height = (basDeLaFaq + marge) + 'px';
    }
  }

  page.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', ajuster);
  });
  window.addEventListener('resize', ajuster);
  window.addEventListener('load', ajuster);
  ajuster();
})();
