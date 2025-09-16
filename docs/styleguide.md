# Charte graphique — Styleguide du projet

Ce document recense les fondations de style (couleurs, typo, espacements, points de rupture) et les composants UI clés (boutons, header, footer, surbar) afin de faciliter l’itération sur la charte graphique.

## Fondations

- Police principale: `Inter`, sans-serif
- Police code Light: `JetBrains Mono`, monospace
- Police code Dark: `Fira Code`, monospace
- Corps de texte: `16px` — Interlignage: `1.6`

### Breakpoints

- `sm`: 576px
- `md`: 768px
- `lg`: 992px
- `xl`: 1200px

### Échelle d’espacements

- `xs`: 0.5rem
- `sm`: 1rem
- `md`: 2rem
- `lg`: 3rem
- `xl`: 4rem
- `unit`: 1rem

### Couleurs SCSS (variables utilitaires)

- `color-secondary`: `#1D4ED8` (light) / `#F59E0B` (dark)
- `color-danger`: `#EF4444`
- `color-success`: `#10B981`

### Thèmes (variables CSS dynamiques)

Les thèmes sont pilotés via l’attribut `data-theme` sur la balise `html`.

- Thème clair `:root[data-theme='light']` — Tech Moderne
  - `--color-bg`: `#ffffff`
  - `--color-text`: `#0F172A`
  - `--color-primary`: `#3B82F6`
  - `--color-accent`: `#10B981`
  - `--color-muted`: `#64748B`
  - `--color-border`: `#E2E8F0`
  - `--color-bg-alt`: `#F8FAFC`
  - `--icon-filter`: `none`

- Thème sombre `:root[data-theme='dark']` — Dark Professional
  - `--color-bg`: `#0A0A0B`
  - `--color-text`: `#FFFFFF`
  - `--color-primary`: `#FBBF24`
  - `--color-accent`: `#8B5CF6`
  - `--color-muted`: `#A1A1AA`
  - `--color-border`: `#333333`
  - `--color-bg-alt`: `#1A1A1B`
  - `--icon-filter`: `invert(1) brightness(1.25)`

- Variables globales non liées au thème
  - `--surbar-height`: `40px`
  - `--surbar-border`: `1px`

## Styles de base

- Texte: suit `--color-text`; fond: `--color-bg` (transition 0.3s)
- Liens: couleur `--color-accent` avec hover ajusté
- Titres: poids 600–700, couleur `--color-primary`
- Conteneur `.container`: max 1200px + paddings responsives
- Border radius: `8px` (coins arrondis en light, plus nets en dark)

## Boutons

Classes et comportements adaptés aux thèmes:

- Socle commun
  - `.button` / `.btn`: padding `0.75/1.5rem`, `font-weight:600`, `border-radius:8px`, famille Inter
  - Transitions: `all 0.3s ease`

- Thème Light (Tech Moderne)
  - `.btn-primary`: dégradé bleu `#3B82F6 → #1D4ED8`, texte blanc, `box-shadow` subtile
  - `.btn-primary:hover`: translation `Y(-2px)`, shadow renforcée
  - `.btn-secondary`: transparent, bordure `--color-accent`, hover avec remplissage

- Thème Dark (Dark Professional)
  - `.btn-primary`: transparent, bordure `--color-primary`, texte doré
  - `.btn-primary:hover`: remplissage doré, effet glow
  - `.btn-secondary`: transparent, bordure `--color-accent`, hover avec remplissage violet

- Variantes communes
  - `.btn-muted`: fond `--color-muted`, texte `--color-bg`
  - `.btn-sm`: version compacte (`0.5/1rem`)
  - `.button-icon`: bouton icône circulaire `2.75rem`

## Layout

- `.section`: padding vertical `xl`, variantes `.light` / `.dark`
- `.row` / `.col`: grille flex responsive (100% puis 50% ≥ `md`)
- `.card`: fond `--color-bg-alt`, bordure `1px`, `border-radius: 8px`, padding `1.5rem`
- Utilitaires: `mt-*`, `mb-*` pour marges verticales

## Composants

### Header `.main-header`

- Fond `--color-bg`, bordure `--color-border`, padding responsive
- Logo adapté aux couleurs thématiques (`--color-primary`)
- Menu avec soulignement animé selon `--color-accent`
- Mode réduit `.shrink`, bouton `.theme-toggle` avec `--icon-filter`

### Footer `.main-footer`

- Fond `--color-bg`, texte `--color-text`, animation de fondu/slide en `&.visible`
- Liens sociaux avec `--icon-filter` et hover scale
- Bouton retour haut `.scroll-top` (flottant) avec couleur `--color-accent`

### Surbar `.surbar`

- Bandeau fixe en haut
- Light: gradient subtil `--color-primary → --color-bg`
- Dark: gradient doré avec bordure nette
- Bordure `--color-border`, `backdrop-filter: blur`, actions sociales arrondies

## Animations & Effets

- Thème Light (Tech Moderne)
  - Hover: `translateY(-2px)` sur boutons et cards
  - Ombres: `box-shadow` subtiles avec couleurs primaires
  - Transitions: `0.3s ease`

- Thème Dark (Dark Professional)
  - Hover: effets glow avec `box-shadow` colorés
  - Transitions: `0.4s ease`
  - `backdrop-filter: blur` sur certains éléments

## Accès rapide

- Page visuelle: `public/styleguide.html` (aperçu couleurs, typo, espacements et boutons avec toggle Tech Moderne/Dark Professional)

## Pistes d’itération

- Décliner une échelle d’états (hover/active/focus) homogène pour chaque thème
- Définir une échelle de radius: `4px` (subtle), `8px` (standard), `12px` (rounded)
- Ajouter des tokens pour ombres: `--shadow-subtle`, `--shadow-medium`, `--shadow-glow`
- Créer des variables pour les dégradés: `--gradient-primary-light`, `--gradient-glow-dark`
- Harmoniser les animations selon le thème (smooth vs dramatic)
- Considérer des micro-interactions spécifiques par thème
