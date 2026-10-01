---
title: "Features"
description: "Discover the features already developed in Dying Star: 1:1 scale star system, physical atmosphere, character, vehicles, mining, interface and tooling of the space MMO."
keywords:
  - "Dying Star"
  - "DyingStar"
  - "features"
  - "space MMO"
  - "star system"
  - "atmosphere"
  - "vehicles"
  - "mining"
  - "Godot"
  - "open source"
---

## Star system

![Star map showing the orbits of the system|sm](/assets/images/features/star-map-system.png)
![A planet on the star map with its points of interest|sm](/assets/images/features/star-map-pois.png)
![Roads, rails, bridges and tunnels on the star map|sm](/assets/images/features/star-map-roads.png)

- Orbits of the 8 planets and their 10 moons (real Kepler laws)
- Each body rotates on its own axis
- 1:1 scale star system
- Local time of the body you are standing on
- Star map displaying orbits, day/night sides, distances, your position, POIs, roads, rails, bridges and tunnels
- Altitude, longitude and latitude readout on the HUD
- EVA free-flight tool to inspect bodies (debug)

![Planet surface with structures on the ground|md](/assets/images/features/planet-surface.png)

## Planet Tech

- Canyons

![A canyon on a planet's surface|md](/assets/images/features/planet-canyon.png)

- Volcanoes and lava flows

![A volcano and its lava flow|md](/assets/images/features/planet-volcano.png)

- Mountains

![Mountain relief on the horizon|half](/assets/images/features/planet-mountains-relief.png)
![A truck at the foot of the mountains|half](/assets/images/features/planet-mountains-road.png)

- Automatically generated roads, bridges and tunnels

## Atmosphere, sky and light

- Physical atmospheric scattering model (Rayleigh + Mie), from the ground to orbit
- Atmospheric profiles derived for each body from the system data

![Star rising seen from the ground|sm](/assets/images/features/atmosphere-sunrise.png)
![Daytime sky seen from the ground|sm](/assets/images/features/atmosphere-day.png)
![Dusk sky seen from the ground|sm](/assets/images/features/atmosphere-dusk.png)

- Lighting from the system's actual star (physical irradiance and apparent diameter)
- Moonlight with phase, elevation and extinction
- Day/night terminator

![Planet atmosphere seen from orbit|md](/assets/images/features/atmosphere-orbit.png)

## Orbital station

![An orbital station above a planet|md](/assets/images/features/orbital-station.png)

## Textures, materials and VFX

- Contact fringe: objects placed on the ground no longer float above it

![Contact fringe between a wall and the ground|md](/assets/images/features/ground-contact.png)

- PBR material library shared with a Blender plugin

![PBR material library in Blender|md](/assets/images/features/blender-pbr-library.png)

## Character

- Complete networked animation system
- 8-direction directional walking
- Traversal: step, vault, 1 m and 2 m climbing
- Head-look: the avatar turns its head towards what you aim at
- Emote wheel
- Rotate a carried object with the mouse wheel or freely on all axes
- Footstep sounds per surface family, read from the material
- EVA

## Vehicles

- Generic vehicle framework, configurable in the editor
- Playable MVP truck

![MVP truck with its dump body|md](/assets/images/features/mvp-truck.png)

- Support for real 3D models: wheels, steering wheel, doors, handles
- Multiple seats, replicated occupancy, driver and passengers
- Working dump body: loading, real weighing, overload
- 3D screen dashboard: live speed, RPM and load
- Rear-view mirrors and reversing camera
- Physically simulated T1 engines: performance is derived from the installed engines
- Replicated suspension
- Tyre sounds per surface

## Mining and industry

- Drill tool synchronized in multiplayer
- Crosshair aiming and drill bit animation
- Deterministic fracture lines, derived from the rock's identifier
- Mass proportional to the removed volume
- Ore visible inside the rock through a volumetric shader
- Mining zones: rock fields generated server-side
- Ore specific to each zone
- Mining depot producing ore crates

![Mining depot|md](/assets/images/features/mining-depot.png)

- Networked crates, pallets and containers
- Unique identifier visible on crates

![Ore crates with their unique identifier|md](/assets/images/features/ore-crates.png)

- Teleporter with a mouse-driven 3D interface (debug)

![3D teleporter interface|md](/assets/images/features/teleporter.png)

## Interface, settings and localization

- "Scene" menu

![The main menu on its 3D scene|md](/assets/images/features/menu-scene.png)

- Fully localized: English and French
- 46 fully remappable player actions

![Key bindings settings menu|md](/assets/images/features/controls-settings.png)

- Settings menus: controls, fullscreen, resolution, FPS, FOV, audio, shadows
- Text chat (MQTT broker and JWT authentication)
- Proximity VOIP
- Game launcher: Live universe and test universe

![DyingStar launcher|md](/assets/images/features/launcher.png)

## Code quality

- SOLID and DRY principles
- GUT test suites: vehicle, components, localization, traversal
- gdlint run before every commit

## Documentation and tooling

- More than 40 pages of public technical documentation

![Technical documentation page about character animation|md](/assets/images/features/technical-docs.png)

- Offline search added to the documentation site (Docusaurus)
- Godot editor plugin to import/export server props
- Blender editor plugin to manage the shared PBR library
- In-game video recorder (F6 key)
