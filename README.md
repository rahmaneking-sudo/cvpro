# CV PRO

CV PRO est une plateforme complète pour la création de CV et Portfolios professionnels, avec une interface moderne et des options de paiement adaptées au marché africain.

## Fonctionnalités Principales

- **Générateur de CV** avec des modèles premium
- **Créateur de Portfolio** personnalisable
- **Système de tarification** interactif (classique et sur devis)
- **Tableau de bord utilisateur** pour la gestion des créations
- **Tableau de bord Administrateur** pour les statistiques et gestion

## Mises à jour Récentes

### 1. Refonte du Système de Paiement (Checkout Afrique)
- **Moyens de paiement locaux :** Intégration de Wave et Orange Money avec logos officiels au format SVG.
- **Paiement par carte :** Prise en charge de Visa et Mastercard. (PayPal retiré temporairement).
- **Formatage Automatique :**
  - Ajout automatique du `/` lors de la saisie de la date d'expiration.
  - Espacement automatique (tous les 4 chiffres) pour le numéro de carte bancaire.
- **Accessibilité & UX :** Correction de la visibilité des textes saisis (texte sombre sur fond blanc).
- **Responsive Design :** Interface de paiement parfaitement adaptée aux appareils mobiles.

### 2. Logique de Tarification (Pricing)
- **Vérification d'authentification :** Les boutons de sélection de forfait vérifient la connexion de l'utilisateur. 
  - Redirection automatique vers la connexion si nécessaire, avec retour fluide vers les tarifs une fois connecté.
- **Modal de Contact pour les devis :** Les forfaits "Sur devis" ouvrent un modal interactif proposant :
  - Un contact par e-mail direct.
  - Un contact rapide via WhatsApp ou téléphone.
- **Intégration du Paiement :** Les forfaits standards ouvrent directement le nouveau modal de paiement avec les prix correctement formatés.

## Installation et Lancement

### Prérequis
- Node.js (v18+)
- NPM ou Yarn

### Lancement en développement
```bash
# Lancer le client
cd client
npm install
npm run dev

# Lancer le serveur (si applicable)
cd server
npm install
npm start
```

### Construction pour la production
```bash
cd client
npm run build
```
