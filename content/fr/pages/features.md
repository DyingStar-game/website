---
title: "Fonctionnalités"
description: "Découvrez les fonctionnalités déjà développées dans Dying Star : système stellaire à l'échelle 1:1, atmosphère physique, personnage, véhicules, minage, interface et outillage du MMO spatial."
keywords:
  - "Dying Star"
  - "DyingStar"
  - "fonctionnalités"
  - "MMO spatial"
  - "système stellaire"
  - "atmosphère"
  - "véhicules"
  - "minage"
  - "Godot"
  - "open source"
---

## Système stellaire

- Orbites des 8 planètes et de leurs 10 lunes (lois de Kepler réelles)

![Carte stellaire affichant les orbites du système|md](/assets/images/features/star-map.png)

- Rotation propre de chaque corps sur son axe
- Taille du système à l'échelle 1:1
- Heure locale du corps sur lequel on se tient
- Carte stellaire permettant d'afficher les orbites, les faces jour/nuit, les distances et notre position
- Lecture de l'altitude, de la longitude et de la latitude au HUD
- Outil de vol libre EVA pour inspecter les corps (debug)

![Surface d'une planète avec des structures au sol|md](/assets/images/features/planet-surface.png)

## Atmosphère, ciel et lumière

- Modèle de diffusion atmosphérique physique (Rayleigh + Mie), du sol à l'orbite
- Profils atmosphériques dérivés pour chaque corps à partir des données du système

![Lever d'étoile vu depuis le sol|sm](/assets/images/features/atmosphere-sunrise.png)
![Ciel de jour vu depuis le sol|sm](/assets/images/features/atmosphere-day.png)
![Ciel au crépuscule vu depuis le sol|sm](/assets/images/features/atmosphere-dusk.png)

- Éclairage par la vraie étoile du système (irradiance et diamètre apparent physiques)
- Lumière des lunes avec phase, élévation et extinction
- Terminateur jour/nuit

![Atmosphère d'une planète vue depuis l'orbite|md](/assets/images/features/atmosphere-orbit.png)

## Textures, matériaux et VFX

- Frange de contact : les objets posés ne flottent plus au-dessus du sol

![Frange de contact entre un mur et le sol|md](/assets/images/features/ground-contact.png)

- Bibliothèque de matériaux PBR partagée avec un plugin Blender

![Bibliothèque de matériaux PBR dans Blender|md](/assets/images/features/blender-pbr-library.png)

## Personnage

- Système d'animation réseau complet
- Marche directionnelle dans 8 directions
- Franchissement : marche, vault, escalade de 1 m et 2 m
- Head-look : l'avatar tourne la tête vers ce qu'on vise
- Roue d'emotes
- Rotation d'un objet porté à la molette ou librement sur tous les axes
- Sons de pas par famille de surface, lue dans le matériau

## Véhicules

- Framework de véhicules générique et paramétrable dans l'éditeur
- Camion MVP jouable

![Camion MVP avec sa benne|md](/assets/images/features/mvp-truck.png)

- Support des modèles 3D réels : roues, volant, portières, poignées
- Sièges multiples, occupation répliquée, conduite et passagers
- Benne fonctionnelle : chargement, pesée réelle, surcharge
- Tableau de bord en écran 3D : vitesse, régime et charge en direct
- Rétroviseurs et caméra de recul
- Moteurs T1 physicalisés : les performances sont dérivées des moteurs installés
- Suspension répliquée
- Sons de pneus par surface

## Minage et industrie

- Outil perforateur synchronisé en multijoueur
- Visée au réticule et animation du foret
- Failles de fracture déterministes, dérivées de l'identifiant du rocher
- Masse proportionnelle au volume retiré
- Minerai visible dans la roche grâce à un shader volumétrique
- Zones de minage : champs de rochers générés côté serveur
- Minerai propre à chaque zone
- Dépôt minier produisant des caisses de minerai
- Caisses, palettes et conteneurs synchronisés en réseau
- Identifiant unique visible sur les caisses

![Caisses de minerai avec leur identifiant unique|md](/assets/images/features/ore-crates.png)

- Téléporteur avec interface 3D pilotée à la souris (debug)

![Interface 3D du téléporteur|md](/assets/images/features/teleporter.png)

## Interface, réglages et multilingue

- Multilingue complet : anglais et français
- 46 actions joueur entièrement remappables

![Menu de configuration des touches|md](/assets/images/features/controls-settings.png)

- Menus de réglages : contrôles, plein écran, résolution, FPS, FOV, audio, ombres
- Chat textuel (broker MQTT et authentification JWT)
- VOIP de proximité
- Launcher du jeu : univers Live et univers de test

![Launcher DyingStar|md](/assets/images/features/launcher.png)

## Qualité de code

- Principes SOLID et DRY
- Suites de tests GUT : véhicule, composants, localisation, franchissement
- gdlint passé avant chaque commit

## Documentation et outillage

- Plus de 40 pages de documentation technique publique

![Page de la documentation technique sur l'animation des personnages|md](/assets/images/features/technical-docs.png)

- Recherche hors ligne ajoutée au site de documentation (Docusaurus)
- Plugin éditeur Godot d'import/export des props serveur
- Plugin éditeur Blender pour la gestion de la bibliothèque PBR partagée
- Enregistreur vidéo en jeu (touche F6)
