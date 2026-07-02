AMAKOPPAR Bank — Frontend React
SAMAKOPPAR Bank est une application bancaire web développée avec React et connectée à une API REST Spring Boot sécurisée par JWT. Elle permet à un utilisateur de s'inscrire, se connecter, consulter ses comptes bancaires, effectuer des transactions (dépôts, retraits, virements) et suivre l'historique de ses opérations.

Technologies utilisées
React (framework frontend)
Tailwind CSS (design et mise en page)
Axios (communication avec l'API)
React Router DOM (navigation entre les pages)
JWT (authentification sécurisée)
LocalStorage (persistance de la session)
Prérequis
Node.js version 18 ou supérieur
Le backend Spring Boot doit être lancé sur http://localhost:8080
Voir le repo backend : https://github.com/Momar-dev/SAMAKOPPAR-Bank---Backend-Spring-Boot-complet
Installation et lancement
Cloner le projet :


git clone https://github.com/Momar-dev/samakoppar-frontend.git
cd samakoppar-frontend
Installer les dépendances :

npm install
Lancer l'application :

npm start
L'application sera disponible sur http://localhost:3000

Fonctionnalités
Authentification

Inscription avec validation des données
Connexion sécurisée avec token JWT
Déconnexion et suppression automatique du token
Protection des routes privées (redirection si non connecté)
Gestion des comptes

Affichage de tous les comptes bancaires de l'utilisateur
Solde en temps réel de chaque compte
Comptes de type Courant, Épargne, etc.
Transactions

Dépôt d'argent sur un compte
Retrait depuis un compte
Virement entre deux comptes
Historique complet des transactions avec date, type et montant
Tableau de bord

Solde total consolidé de tous les comptes
Résumé des dernières transactions
Vue d'ensemble des comptes actifs
Structure du projet

samakoppar-frontend/
├── src/
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── Navbar.jsx
│   │   └── PrivateRoute.jsx
│   ├── context/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Accounts.jsx
│   │   ├── Transactions.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   └── index.js
Backend
Ce frontend fonctionne avec une API REST développée en Spring Boot.

Repo backend : https://github.com/Momar-dev/SAMAKOPPAR-Bank---Backend-Spring-Boot-complet

Stack backend : Java 17, Spring Boot 3, Spring Security, JWT, MySQL, Maven

Auteur
Momar DIOP — Développeur Full-Stack Junior

Portfolio : https://momar-dev.netlify.app
LinkedIn : https://www.linkedin.com/in/momar-diop/
GitHub : https://github.com/Momar-dev
Licence
Ce projet est sous licence MIT.
