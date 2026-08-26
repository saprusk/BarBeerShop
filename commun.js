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
