# 📊 Configuration Google Analytics 4

## 🚀 Étapes pour activer Google Analytics

### 1. Créer un compte Google Analytics

1. Allez sur [Google Analytics](https://analytics.google.com/)
2. Cliquez sur "Commencer la mesure"
3. Créez un compte pour votre entreprise
4. Créez une propriété pour votre site web

### 2. Obtenir votre ID de mesure

1. Dans votre propriété GA4, allez dans "Administration"
2. Sélectionnez "Flux de données" > "Web"
3. Copiez votre **ID de mesure** (format: `G-XXXXXXXXXX`)

### 3. Configurer votre site

1. Ouvrez `src/app/config/analytics.config.ts`
2. Remplacez `GA_MEASUREMENT_ID` par votre ID réel :

   ```typescript
   GA_MEASUREMENT_ID: 'G-XXXXXXXXXX',
   ```

3. Ouvrez `src/index.html`
4. Remplacez les deux occurrences de `GA_MEASUREMENT_ID` par votre ID réel

### 4. Tester le tracking

1. Déployez votre site
2. Visitez votre site et naviguez entre les pages
3. Envoyez un message via le formulaire de contact
4. Cliquez sur les liens externes (portfolio)
5. Vérifiez dans Google Analytics > "Temps réel" que les données arrivent

## 📈 Événements trackés automatiquement

### Pages vues

- ✅ Navigation entre toutes les pages
- ✅ Noms de pages lisibles (Accueil, À propos, etc.)

### Formulaire de contact

- ✅ Envoi réussi avec le sujet du message
- ✅ Catégorie : `engagement`

### Liens externes

- ✅ Clics sur les projets du portfolio
- ✅ Catégorie : `external_link`

### Personnalisation

Vous pouvez ajouter d'autres événements en utilisant le service :

```typescript
// Dans n'importe quel composant
constructor(private googleAnalytics: GoogleAnalyticsService) {}

// Track un événement personnalisé
this.googleAnalytics.trackEvent('download', 'engagement', 'CV-Jerome-Marlier.pdf');
```

## 🔧 Configuration avancée

### Mode debug

Pour voir les événements dans la console :

```typescript
// Dans analytics.config.ts
DEBUG: true;
```

### Désactiver en développement

```typescript
// Dans analytics.config.ts
ENABLED: false; // Pendant le développement
```

## 📊 Données disponibles dans GA4

- **Audience** : Géographie, appareils, navigateurs
- **Acquisition** : Source du trafic (Google, réseaux sociaux, direct)
- **Engagement** : Pages vues, durée de session, événements
- **Monétisation** : Si vous ajoutez des conversions

## 🎯 Objectifs recommandés

1. **Formulaire de contact** : Conversion principale
2. **Temps sur site** : Engagement des visiteurs
3. **Pages vues** : Contenu populaire
4. **Liens externes** : Intérêt pour vos projets

## 🚨 Respect de la vie privée

Le site utilise Google Analytics conformément aux bonnes pratiques :

- Pas de données personnelles collectées
- ID anonymisés par défaut
- Possibilité d'ajouter un banner de consentement si nécessaire

---

**Note** : Les données peuvent prendre 24-48h pour apparaître dans les rapports standards de GA4.
