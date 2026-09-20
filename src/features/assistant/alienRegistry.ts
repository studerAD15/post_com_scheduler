/**
 * alienRegistry.ts - Registry and Metadata for the 10 Animated Ben 10 Alien Hero Avatars.
 *
 * Provides metadata, lore, elemental power classifications, and animated SVG components
 * based on the iconic Ben 10 roster (Heatblast, Four Arms, XLR8, Diamondhead, Upgrade,
 * Ripjaws, Ghostfreak, Cannonbolt, Stinkfly, Wildmutt).
 */

import React from "react";
import { AlienHeatblast } from "./aliens/AlienHeatblast";
import { AlienFourArms } from "./aliens/AlienFourArms";
import { AlienXLR8 } from "./aliens/AlienXLR8";
import { AlienDiamondhead } from "./aliens/AlienDiamondhead";
import { AlienUpgrade } from "./aliens/AlienUpgrade";
import { AlienRipjaws } from "./aliens/AlienRipjaws";
import { AlienGhostfreak } from "./aliens/AlienGhostfreak";
import { AlienCannonbolt } from "./aliens/AlienCannonbolt";
import { AlienStinkfly } from "./aliens/AlienStinkfly";
import { AlienWildmutt } from "./aliens/AlienWildmutt";

export interface AlienAvatarConfig {
  id: string;
  name: string;
  species: string;
  codename: string;
  element: string;
  color: string;
  description: string;
  greeting: string;
  Component: React.FC<{ className?: string; animated?: boolean }>;
}

export const ALIEN_REGISTRY: AlienAvatarConfig[] = [
  {
    id: "alien-heatblast",
    name: "Heatblast",
    species: "Pyronite (Pyros)",
    codename: "SOLAR-FLAME",
    element: "Fire / Magma",
    color: "#F97316",
    description: "Living magma organism with a smoldering charcoal body, animated flame crown, and volcanic energy manipulation.",
    greeting: "Heatblast initialized! Ready to scorch through your social media queue with fiery precision.",
    Component: AlienHeatblast,
  },
  {
    id: "alien-fourarms",
    name: "Four Arms",
    species: "Tetramand (Khoros)",
    codename: "QUAD-BRAWN",
    element: "Super Strength",
    color: "#DC2626",
    description: "Twelve-foot crimson warrior boasting four muscular arms, armored skin, and devastating kinetic shockwaves.",
    greeting: "Four Arms active! I have the muscle to carry all your multi-platform campaigns at once.",
    Component: AlienFourArms,
  },
  {
    id: "alien-xlr8",
    name: "XLR8",
    species: "Kineceleran (Kinet)",
    codename: "HYPER-VELOCITY",
    element: "Supersonic Speed",
    color: "#00F0FF",
    description: "Streamlined aerodynamic speedster with foot wheel orbs, sweeping laser visor, and friction-free acceleration.",
    greeting: "XLR8 on the track! Instant scheduling and blazing fast composition at the speed of sound.",
    Component: AlienXLR8,
  },
  {
    id: "alien-diamondhead",
    name: "Diamondhead",
    species: "Petrosapien (Petropia)",
    codename: "CRYSTAL-SHARD",
    element: "Crystalline Shards",
    color: "#22D3EE",
    description: "Indestructible organic diamond crystal body with light refraction gleams, sharp back spikes, and crystal blades.",
    greeting: "Diamondhead ready! Shard-sharp character limit validation and unbreakable post formatting.",
    Component: AlienDiamondhead,
  },
  {
    id: "alien-upgrade",
    name: "Upgrade",
    species: "Galvanic Mechamorph (Galvan B)",
    codename: "TECHNO-ORGANIC",
    element: "Nanotech / Cyber",
    color: "#3DDC10",
    description: "Liquid nano-metallic biomechanism with animated flowing green circuitry and optical scanning core.",
    greeting: "Upgrade connected! Enhancing your workflows with cutting-edge telemetry and seamless publishing.",
    Component: AlienUpgrade,
  },
  {
    id: "alien-ripjaws",
    name: "Ripjaws",
    species: "Piscciss Volann (Piscciss)",
    codename: "ABYSS-PREDATOR",
    element: "Aquatic / Pressure",
    color: "#06B6D4",
    description: "Bioluminescent deep-sea predator with glowing angler lure, razor-sharp steel-crushing fangs, and aquatic fins.",
    greeting: "Ripjaws surfaced! Tearing through scheduling roadblocks and diving deep into analytics.",
    Component: AlienRipjaws,
  },
  {
    id: "alien-ghostfreak",
    name: "Ghostfreak",
    species: "Ectonurite (Anur Phaetos)",
    codename: "PHANTOM-PHASE",
    element: "Spectral / Shadow",
    color: "#A855F7",
    description: "Levitating spectral entity with protective shroud, movable cyclops eye on seam track, and intangible stealth.",
    greeting: "Ghostfreak phasing in... Silently monitoring audit logs and keeping your platform drafts secure.",
    Component: AlienGhostfreak,
  },
  {
    id: "alien-cannonbolt",
    name: "Cannonbolt",
    species: "Arburian Pelarota (Arburia)",
    codename: "KINETIC-SPHERE",
    element: "Armored Carapace",
    color: "#F59E0B",
    description: "Heavily plated sphere warrior with golden impact-proof carapace armor segments and bowling-ball roll power.",
    greeting: "Cannonbolt rolling out! Crushing publication errors and shielding your content pipeline.",
    Component: AlienCannonbolt,
  },
  {
    id: "alien-stinkfly",
    name: "Stinkfly",
    species: "Lepidopterran (Lepidopterra)",
    codename: "AERO-STINGER",
    element: "Aerial / Bio-Toxin",
    color: "#84CC16",
    description: "High-agility winged flyer with 4 glowing amber eyestalks, rapid fluttering wings, and precision tail stinger.",
    greeting: "Stinkfly airborne! Surveying your feed from above with 360-degree vision.",
    Component: AlienStinkfly,
  },
  {
    id: "alien-wildmutt",
    name: "Wildmutt",
    species: "Vulpimancer (Vulpin)",
    codename: "FERAL-TRACKER",
    element: "Sensory Tracker",
    color: "#EA580C",
    description: "Feral orange predator with eyeless 3D radar sensing, twitching neck gills, razor fangs, and superhuman tracking.",
    greeting: "Wildmutt locked on! Sniffing out post drafts and tracking upcoming calendar events.",
    Component: AlienWildmutt,
  },
];

export const DEFAULT_ALIEN_ID = "alien-heatblast";

// Legacy ID mapping to guarantee zero crashes if users have older IDs in localStorage
const ID_ALIASES: Record<string, string> = {
  "alien-ignis": "alien-heatblast",
  "alien-velo": "alien-xlr8",
  "alien-crystalo": "alien-diamondhead",
  "alien-tide": "alien-ripjaws",
  "alien-flora": "alien-wildmutt",
  "alien-volt": "alien-upgrade",
  "alien-umbra": "alien-ghostfreak",
  "alien-titan": "alien-fourarms",
  "alien-aero": "alien-stinkfly",
  "alien-cosmo": "alien-cannonbolt",
};

export function getAlienConfig(id: string): AlienAvatarConfig {
  const resolvedId = ID_ALIASES[id] || id;
  return ALIEN_REGISTRY.find((a) => a.id === resolvedId) || ALIEN_REGISTRY[0];
}
