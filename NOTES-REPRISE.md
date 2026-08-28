# Notes de reprise — Page Barber V2 (fidélité XD)

> Point d'étape avant pause. Tout ce qui suit est déjà fait et prêt à l'emploi.
> Reprise : lire ce fichier, puis écrire `barber.html` + `barber.css`.

---

## 1. Contexte

**Objectif** : reproduire à l'identique la page **Barber** de la NOUVELLE maquette XD.

- **Lien XD (version finale)** :
  https://xd.adobe.com/view/dec42f6b-9d83-4d4c-b8e8-98597dab34d5-8b97/screen/94b0c79c-d237-40bc-9686-a2e67f58179a
- L'écran ciblé par le lien = artboard **« Page Barber – 3 »**, format **1920 × 5378**
- ⚠️ C'est un **fichier XD différent** de celui utilisé avant (ancien ID `d834adba…`, nouveau `dec42f6b…`)

**Méthode validée avec la designer** : Bootstrap sert de base (navbar, structure), mais
le résultat final doit coller à XD au pixel près. Elle a donné carte blanche pour
prendre les initiatives nécessaires à la fidélité.

**Où on travaille** : repo de la designer `saprusk/BarBeerShop`, branche **`barber-v2`**
(créée depuis `main` propre, donc l'ancienne V1 n'interfère plus).
Dossier local : `C:\Users\mivan\Desktop\barbeershop-site`

---

## 2. Ce qui est DÉJÀ FAIT

### Assets prêts dans `sources/`

**Polices** (`sources/fonts/`) : les 6 graisses PP Formula en `.woff2`
(Thin 100, Regular 400, Medium 500, Bold 700, Extrabold 800, Black 900).
DeLittle Chromatic (logo) via le kit Adobe : `<link rel="stylesheet" href="https://use.typekit.net/kuv5thu.css">`
→ famille CSS : `"delittle-chromatic"`.

**Images WebP** (converties avec Pillow, 1,2 Mo au total) :

| Fichier | Usage |
|---|---|
| `hero-barber.webp` | grande photo du salon (hero) |
| `avatar-compte.webp` | photo de profil dans la navbar |
| `produits.webp` | photo produits (carte Soin Signature + bloc « Nos produits utilisés ») |
| `g1-1` … `g1-6.webp` | galerie, rangée 1 (6 photos) |
| `g2-1` … `g2-6.webp` | galerie, rangée 2 (6 photos) |

**Vectoriels SVG** (extraits du fichier XD) :

| Fichier | Usage |
|---|---|
| `icone-jour-nuit.svg` | icône soleil (bascule jour/nuit dans la navbar) |
| `carte-fidelite.svg` | visuel de la carte de fidélité (hero) |
| `bouton-remonter.svg` | pastille rouge « remonter » collée au bord gauche |
| `fleche-bas.svg` | triangle blanc sous « différentes formules » |
| `illus-thomas.svg` / `illus-yves.svg` / `illus-rosalie.svg` | illustrations de l'équipe |
| `fleur-1.svg` / `fleur-2.svg` / `fleur-3.svg` | fleurs blanches décoratives |
| `reseaux-sociaux.svg` | icônes Facebook / Instagram / TikTok (pied de page) |
| `bulles-495 / 496 / 521 / 522 / 523 / 546.svg` | **6 couches de bulles** pour la transition |

Les logos de la designer sont déjà là : `Logo.png` (icône + mot BARBEERSHOP), `Favicon-Blanc.png`.

---

## 3. Mesures exactes relevées dans XD

Origine de l'artboard : `x = -3450`, `y = -8848`. Toutes les coordonnées ci-dessous
sont **relatives au coin haut-gauche de la page**, en pixels maquette (base 1920).

### Couleurs
| Rôle | Code |
|---|---|
| Brun (grande zone) | `#695E45` |
| Rouge (accents, boutons) | `#E13950` (carte produits : `#E23950`) |
| Beige (bande « Découvrir ») | `#DDCDB0` |
| Noir (navbar + pied de page) | `#1A1A1E` |
| Crème (textes clairs) | `#FFFEF8` |

### Navbar (hauteur 212)
| Élément | x | y | Taille / police |
|---|---|---|---|
| Logo « BarBeerShop » | 227 | 98 | 38 px DeLittleChromatic |
| Pilule blanche (contour) | 716 | 43 | 494 × 73, rayon 36 |
| Pilule **rouge** « Prendre RDV » | 724 | 45 | 245 × 69, rayon 36, texte 23 px Extrabold blanc |
| « Réserver ma soirée » (2 lignes) | 1020 | 56 | 23 px Extrabold, `#1A1A1E` |
| Icône jour/nuit | 1247 | 54 | 52 × 52 |
| Avatar (rogné en cercle) | 1674 | 35 | 86 × 129 |
| ACCUEIL / BARBER / BAR | 652 / 854 / 1061 | 170 | 23 px Extrabold blanc |
| NOTRE CONCEPT (2 lignes) | 1275 | 157 | 22 px Extrabold blanc |

### Hero
- Photo : x `-32`, y `-175`, **1984 × 1487** (passe derrière la navbar)
- Panneau carte fidélité (verre dépoli) : x `650`, y `423`, **646 × 290**
- Texte carte fidélité : y `480`, **36 px PPFormula-Regular**, centré (x 977)
- Visuel carte de fidélité : x `1222`, y `461`, 175 × 148
- Bouton « Créer mon compte » : x `830`, y `679`, **313 × 68**, fond rouge
- Bouton « remonter » : x `-36`, y `464`, 120 × 80

### Transition bulles (le point clé du retour designer)
**6 couches** empilées, à superposer telles quelles :

| Couche | x | y | Taille |
|---|---|---|---|
| `bulles-495` | 0 | 621 | 1923 × 485 |
| `bulles-522` | -39 | 883 | 1920 × 485 |
| `bulles-521` | -71 | 902 | 1920 × 485 |
| `bulles-496` | -11 | 902 | 2494 × 630 |
| `bulles-546` | -727 | 904 | 2806 × 709 |
| `bulles-523` | -2 | 915 | 1920 × 485 |

**Frontière photo / brun mesurée sur le rendu** : le brun devient plein vers **y ≈ 1017**,
la zone de mélange (bulles sur la photo) va de **y ≈ 860 à 1017**.
Rectangle brun officiel : x `-34`, y `1017`, 1961 × 4836.

### Formules (le gros morceau)
- Cartes : **largeur 461**, **rayon 69**, **contour blanc 5 px**, pas de fond
- **Écart entre cartes : 40**
- **3 cartes visibles**, la 1re commence à **x = 228** (donc `(1920 − (461×3 + 40×2)) / 2 ≈ 228`)
- Hauteurs **variables** (le cadre s'arrête au texte) :

| Ordre | x | Hauteur | Titre | Prix |
|---|---|---|---|---|
| (hors écran gauche) | -642 | 414 | Formule VIP Barber & Relax | 60 € |
| 1 | **228** | **264** | Coupe Express | 15 € |
| 2 | **730** | **439** | Formule Soin Signature | 30 € |
| 3 | **1231** | **330** | Coupe + Rituel Masque Ayurvédique | 22 € |
| (hors écran droite) | 2101 | 358 | Rituel Total Ayurvédique | 39 € |

- Titres : **22 px PPFormula-Bold**, y ≈ 1317-1330
- Listes : **16 px PPFormula-Thin**, y ≈ 1367-1381
- Prix : **29 px PPFormula-Bold**, pastille crème **à cheval sur le trait du bas**
- **Carte Soin Signature** : image `produits.webp` à x `730`, y `1397`, **462 × 616**
  → même largeur que la carte, **déborde sous le cadre** (carte finit à 1705, image à 2013),
  et le prix **30 €** se pose sur l'**arête basse de l'image** (y ≈ 1915)
- « Sélectionnez votre formule pour réserver votre RDV » : **23 px Thin**, à **droite** (x ≈ 1505, y ≈ 1809), avec une flèche bouclée

### Bloc « Nos produits utilisés »
- Ombre : x `139`, y `2195`, 844 × 342
- Carte rouge : x `155`, y `2206`, **812 × 324** → **collée à gauche**
- Titre : y `2281`, 31 px Bold
- Texte : y `2334`, x `212`, 18 px Regular
- Fleurs décoratives : x `835` / `875`, y `2257` / `2286`
- Bouton « En savoir plus » : **coin bas-droit**, fond rouge / texte blanc dans XD
  ⚠️ (la designer avait demandé blanc→rouge au survol : à reconfirmer avec elle)

### Équipe
| Élément | x | y | Taille |
|---|---|---|---|
| Titre « Nos Professionnels Capillaires » | 960 (centré) | 2750 | 30 px Bold |
| Texte d'intro | 623 | 2832 | 18 px Regular |
| Illustration **Thomas** | 299 | 3054 | 323 × 428 |
| Illustration **Yves** | 830 | 3027 | 307 × 420 |
| Illustration **Rosalie** | 1259 | 3051 | 339 × 389 |
| Nom Thomas | 339 | 3536 | 31 px Bold |
| Nom Yves | 799 | **3525** | 31 px Bold |
| Nom Rosalie | 1301 | 3536 | 31 px Bold |
| Descriptions | 475 / 960 / 1441 | 3576-3578 | 18 px Regular |

⚠️ Dans XD les 3 ne sont **pas parfaitement alignés** (Yves est ~11 px plus haut).
La designer avait reproché un défaut d'alignement : **lui demander** si elle veut
un alignement parfait ou le décalage exact de XD.

### Galerie
- Titre « Galerie des Coupes Réalisées » : x 960 (centré), y `3802`, 30 px Bold
- **2 rangées qui défilent horizontalement**, décalées l'une par rapport à l'autre,
  photos qui dépassent des deux bords (effet bandeau continu)
- Rangée 1 (y ≈ 3790-3847) : x = -1011, -465, **87**, **635**, **1132**, **1714**
- Rangée 2 (y ≈ 4247-4284) : x = -661, **-100**, **452**, **1003**, **1520**, 2098
- Tailles ≈ 462-517 de large, 616-699 de haut, coins arrondis

### Bande « Découvrir notre bar » + pied de page
- Bande beige : x `-68`, y `4861`, 2057 × 160
- Texte « DÉCOUVRIR NOTRE BAR À BIÈRES » : **41 px Bold**, couleur **`#695E45`**,
  répété (x 521 et 1406), y `4952`
- Pastilles rondes entre les textes : y `4904`, x 71 / 955 / 1840
- Pied de page : x `-85`, y `5008`, 2037 × 372
- Champ newsletter : x `1338`, y `5053`, 518 × 68

---

## 4. Méthode d'échelle (à conserver)

Pour coller à XD à toutes les largeurs d'écran :

```css
body { --u: calc(100vw / 1920); }   /* 1 unité = 1 pixel de la maquette */
```

Puis toute valeur s'écrit `calc(var(--u) * <valeur XD>)`.
Un bloc `@media (max-width: 768px)` reprend la main en tailles fixes pour le mobile.

---

## 5. Ce qu'il RESTE à faire

1. **Écrire `barber.html`** : navbar (avec bascule jour/nuit), hero, bulles (6 couches),
   formules (carrousel 3 visibles + flèches), produits, équipe, galerie (2 rangées
   défilantes), bande beige, pied de page. **Commentaires en français partout**,
   style `<!-- bouton réservation -->`.
2. **Écrire `barber.css`** avec le système `--u` ci-dessus.
3. Ajouter les `@font-face` PP Formula dans `Accueil.css` (fichier commun) + le
   `<link>` Typekit dans le `<head>`.
4. **Vérifier** : aucune image cassée, pas de débordement horizontal, positions
   mesurées au DOM comparées au tableau ci-dessus, mobile propre.
5. **Commit + push sur `barber-v2`**, puis **ouvrir une Pull Request** pour la designer.

### Points à lui poser
- Alignement de l'équipe : parfait, ou décalage exact de XD ?
- Bouton « En savoir plus » : XD le montre **rouge/texte blanc**, elle avait demandé
  **blanc/texte rouge puis inversé au survol**. Lequel garder ?
- Une variante **« Page Accueil – Night Shift »** existe dans le fichier XD : la bascule
  jour/nuit de la navbar est-elle à implémenter maintenant ou plus tard ?

---

## 6. Outils réutilisables (scratchpad, à recréer si effacés)

Dossier : `…/scratchpad/xd2/`
- `dl.py` — télécharge manifeste, arbres graphiques (AGC), images, interactions
- `tosvg.py` — convertit un groupe XD en SVG
- `spec.py` — extrait textes / polices / couleurs / images
- `layout.py` — sort la spec de mise en page complète (→ `layout.txt`)

⚠️ **Le jeton d'accès XD expire.** Pour en obtenir un nouveau : ouvrir le lien XD dans
Chrome, puis lire les requêtes réseau vers `cdn-sharing.adobecc.com` et récupérer le
paramètre `access_token`. Jeton utilisé aujourd'hui (périmera) :
`1787719047_urn%3Aaaid%3Asc%3AUS%3Adec42f6b-9d83-4d4c-b8e8-98597dab34d5%3Bpublic_fee3281537e1d08a96e6a2755d66ba9ebaf0ef76`

## 7. Autres artboards du même fichier (pour la suite)

`Page Accueil` (5725) · `Web 1920 – 11` (6258) · **`Page Barber – 3` (5378)** ·
`Concept` (6025) · `Compte` (3792) · `Création compte` (1838) ·
`Modification compte` (1838) · `Web 1920 – 13` (6258) · `Page Accueil – Night Shift` (5725)

---

## 8. Fonds de forme fournis par la designer (PNG → WebP)

Six fichiers PNG reçus (dossier `PNG manquante` sur le bureau), convertis en WebP sans
perte avec Pillow puis rognés à leur contenu utile. Ce sont des **calques de forme** :
les grands ronds de couleur qui se posent **derrière** les photos, débordent d'une
dizaine de pixels (c'est le contour de la maquette), et portent les bulles satellites,
les raccords en goutte et le fil rouge.

| Fichier WebP | Taille | Page | Position (coordonnées maquette) | Repère XD |
|---|---|---|---|---|
| `fond-accueil-bar.webp` | 952×931 | Accueil | x 1084, y 1160 | Tracé 747 (Ø713 en 1323, 1378) |
| `fond-accueil-barber.webp` | 509×573 | Accueil | x 57, y 1548 | Groupe 378 (508×572) |
| `fond-bar-ambiance.webp` | 628×863 | Bar | x 80, y 2990 | Tracé 891 (Ø554) |
| `fond-concept-fil-rouge.webp` | 1964×1899 | Notre Concept | x −250, y 181 | Tracé 1137 + Ellipse 120 + fil rouge |
| `fond-concept-droite.webp` | 676×760 | Notre Concept | x 1391, y 1068 | Ellipse 119 (Ø663) |
| `fond-barber-produits.webp` | 899×499 | Barber | x 109, y 2063 | Rectangle 1647 (844×342) |

**Comment ils ont été calés :** on repère le grand rond du fichier (plus long segment
horizontal opaque), on lit son diamètre exact, puis on le fait coïncider avec le tracé
correspondant de la maquette. Trois fichiers ont été recoupés sur deux ou trois ronds
différents, avec moins de 5 px d'écart.

**Conséquences sur le CSS :**
- Les photos rondes sont désormais **centrées dans le rond du fond** et un peu plus
  petites que lui : le contour bleu (ou brun) vient du fichier, plus d'une bordure CSS.
  La bordure `border: 5px` de `.cercle` (page Concept) a donc été retirée.
- Sur la page Notre Concept, le fichier du fil rouge déborde d'une section à l'autre :
  `.bulles-concept` et `.services` sont devenues transparentes, le crème est posé sur
  le `body`.
- Les bulles BARBER / BAR / Notre CONCEPT de la page Concept sont dessinées **texte
  compris** dans le fichier. Le texte HTML est conservé en lecture d'écran seulement
  (`.hors-ecran`), pour le référencement et l'accessibilité.
- Les traits rouges dessinés à la main (`<svg class="liens">`) ont été supprimés.

## 9. Cadrage des photos rondes

La maquette pose chaque photo **en grand** derrière son rond, qui n'en montre qu'une
partie. `object-fit: cover` ne suffisait donc pas (le grand rond du bar était deux fois
moins zoomé que dans XD). Chaque image est maintenant positionnée en absolu avec la
taille et le décalage relevés dans le fichier XD (`page.images(...)`).

## 10. Piège corrigé : la bascule jour/nuit du `body`

`body { background-color: var(--creme); transition: background-color .3s }` : quand
`--creme` change, Chrome **garde l'ancienne couleur du body**. Le problème ne se voyait
pas tant que chaque section peignait son propre fond ; il est apparu dès que les
sections du Concept sont devenues transparentes. La transition a été retirée du `body`
(dans `commun.css` et `barber.css`) ; les autres blocs gardent leur fondu.

---

# LE RESPONSIVE (mise en page telephone)

## 11. La maquette telephone

Lien XD fourni par la designer : **8 planches, toutes en 430 px de large**.
Ce n'est pas un retrecissement du grand ecran mais une vraie refonte : menu en
trois traits, tout en une seule colonne, carrousels, accordeons.

| Planche | Taille |
|---|---|
| Page accueil - mob | 430 x 5391 |
| Bar - mob | 430 x 6371 |
| Barber - mob | 430 x 4736 |
| Concept mob | 430 x 6282 |
| Compte - mob | 430 x 5036 |
| Creation compte - mob | 430 x 2482 |
| Modification - mob | 430 x 2482 |

Outils dans `…/scratchpad/xd3/` : memes scripts que `xd2`, plus `deplie.py`
(detaille le contenu d'un groupe), `masques.py` (sort la forme qui decoupe
chaque photo), `textes.py` (tous les textes, meme imbriques) et `extraire.py`
(exporte un groupe en SVG). Mesures dans `spec_*.txt`, apercus dans `thumbs/`.

Jeton d'acces de cette maquette (il expirera) :
`1787875625_urn%3Aaaid%3Asc%3AUS%3Af7330b16-a230-4fe2-a1e3-809dacd54b90%3Bpublic_06e84f1137949e814ec2f64b29fa5a75844a5eee`

## 12. L'architecture

Meme principe que le grand ecran : tout en position absolue, cale sur `--u`.
Simplement, **`--u` change de reference selon la largeur** :

- au-dessus de 1024 px : `--u = largeur / 1920` (maquette grand ecran)
- en dessous de 1024 px : `--u = min(largeur, 520) / 430` (maquette telephone)

Le plafond de 520 px evite que tout devienne enorme sur une tablette : au-dela,
la colonne se centre au lieu de grossir, et les bandes de couleur (barre de
navigation, pied de page, sections colorees) continuent d'aller d'un bord a
l'autre grace a un calque `::after` de `100vw` pose derriere elles.

Les feuilles de style sont separees en trois familles, chargees avec un
attribut `media` sur le `<link>` :

| Fichier | Quand |
|---|---|
| `base.css` | toujours (polices, couleurs, mode nuit, `--u`) |
| `commun.css` + `<page>.css` | `media="(min-width: 1024px)"` |
| `mobile.css` + `<page>-mob.css` | `media="(max-width: 1023.98px)"` |

Consequence : **rien du CSS grand ecran ne fuit sur telephone**, on repart
d'une page blanche au lieu d'annuler des centaines de regles.

## 13. Ce qui est fait

Les **sept pages** ont leur mise en page telephone :
`accueil-mob.css`, `barber-mob.css`, `bar-mob.css`, `concept-mob.css`,
`compte-mob.css`, `formulaire-mob.css` (creation + modification), plus
`mobile.css` pour la barre de navigation, le menu et le pied de page.

Hauteurs mesurees contre les maquettes :

| Page | Maquette | Site | Ecart |
|---|---|---|---|
| Accueil | 5391 | 5391 | 0 |
| Barber | 4736 | 4739 | 3 |
| Notre Concept | 6282 | 6283 | 1 |
| Bar | 6371 | 6148 | vide de fin non repris |
| Compte | 5036 | 3960 | vide de fin non repris |
| Creation / Modification | 2482 | 2486 | 4 |

Sur Bar et Compte, la maquette laisse plusieurs centaines de pixels de fond
vide en bas, pour l'ouverture des categories et des questions. On ne les
reproduit pas : la page s'allonge d'elle-meme a l'ouverture.

Verifie sur les sept pages : aucun debordement horizontal, aucune image
cassee, le grand ecran est intact (hauteurs toujours conformes aux maquettes
de 1920).

## 14. Ce qui a ete ajoute au HTML

Le HTML est commun aux deux tailles d'ecran. Quelques blocs n'existent que
sur telephone ; ils sont masques sur grand ecran par une regle de
`commun.css` :
`.barre-nav-mob`, `.menu-mob`, `.mousse-mob`, `.bulles-mob`, `.bloc-brun-mob`,
`.bandeau-mob`, `.concept-mob`.

Dessins extraits de la maquette telephone (formes que le grand ecran n'a pas) :
`mousse-mob.svg`, `mob-bulles-bar.svg`, `mob-bulles-barber.svg`,
`mob-bulles-barber-page.svg`, `mob-loupe.svg`, `mob-concept-haut.svg`,
`mob-concept-fil.svg`, `mob-concept-rond.svg`.

`commun.js` gere en plus : le menu du telephone, la bascule jour/nuit sur ses
deux boutons, et l'accordeon de la carte du bar.

## 15. Pieges rencontres, a retenir

1. **`--u` a zero.** L'observateur de taille se declenche parfois alors que la
   page n'a pas encore de largeur. Sans garde-fou, toute la mise en page
   tombe a zero. `reglerUnite()` sort maintenant si la largeur vaut 0.
2. **Un ancien script dans `barber.html`.** La page avait garde son propre
   `reglerUnite()` (version 1920 uniquement), qui ecrasait celui de
   `commun.js`. Remplace par un appel a `commun.js`.
3. **Un `<link>` en double dans `barber.html`**, sans `media` : la feuille du
   grand ecran s'appliquait aussi sur telephone.
4. **Les valeurs ecrites sur la balise l'emportent.** Les pages de compte
   portent `style="--ligne: 417"` sur chaque champ ; impossible de redefinir
   `--ligne` depuis la feuille mobile. On y ecrit donc `top` directement.
5. **Les `y` d'Adobe XD sont des lignes de base**, pas le haut du bloc. Pour
   poser un texte au bon endroit, on remonte d'environ 0,925 fois la taille
   de la police.
6. **Les captures d'ecran.** Chrome impose une largeur de fenetre minimale
   (~500 px) : on capture donc a 520 px (la largeur plafond) puis on ramene
   l'image a 430 (`scratchpad/capmob.sh`). Et le volet navigateur integre ne
   fait pas avancer les transitions CSS : un panneau qui glisse y parait
   toujours ferme, ce n'est pas un bug de la page.

## 16. Ce qui reste a faire

- La designer n'a pas de photos dans les capsules des brasseurs (page Bar) ni
  de bouteilles decoratives sur telephone : la maquette en montre, le HTML
  n'en a pas. A lui demander.
- Quelques textes different entre les deux maquettes (par exemple
  « Voir la carte » sur telephone contre « Voir notre carte » sur grand
  ecran, ou le titre du second bloc de l'accueil qui dit encore
  « Bar a biere artisanale »). Le HTML etant commun, c'est la version du
  grand ecran qui s'affiche. A trancher avec elle.
- Les fleurs decoratives de la page Notre Concept ne sont pas reprises sur
  telephone.
