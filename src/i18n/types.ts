import type { AffixesContent, ItemSetsContent, ItemsContent } from "./content/items.types";

export type Locale = "es" | "en" | "fr";

export interface Translations {
  // Layout metadata
  meta: {
    title: string;
    description: string;
  };

  // Landing / main menu
  landing: {
    era: string;
    riseOfThe: string;
    triumvirate: string;
    tagline: string;
    newGame: string;
    continue: string;
    replayIntro: string;
    options: string;
    credits: string;
    version: string;
  };

  // Play page
  play: {
    awakening: string;
    autosaved: string;
  };

  // Intro cinematic
  cinematic: {
    cards: Array<{
      primary: string;
      secondary?: string;
    }>;
    skip: string;
    clickToAdvance: string;
  };

  // Character creation
  creation: {
    forgeYourDestiny: string;
    newAcolyte: string;
    name: string;
    namePlaceholder: string;
    ironman: string;
    ironmanDesc: string;
    selected: string;
    back: string;
    begin: string;
    forging: string;
    classes: {
      marauder: {
        name: string;
        tagline: string;
        blurb: string;
        trees: string[];
      };
      inquisitor: {
        name: string;
        tagline: string;
        blurb: string;
        trees: string[];
      };
      assassin: {
        name: string;
        tagline: string;
        blurb: string;
        trees: string[];
      };
    };
  };

  // Continue / Load dialog
  load: {
    title: string;
    close: string;
    ironman: string;
  };

  // HUD
  hud: {
    hp: string;
    force: string;
    korriban: string;
    academyExterior: string;
    skillSlot: string; // "Skill slot {n}"
    character: string;
    inventory: string;
    journal: string;
    map: string;
    menu: string;
  };

  // Panel layer
  panels: {
    characterSheet: string;
    inventoryTitle: string;
    questJournal: string;
    galaxyMap: string;
    gameMenu: string;
    dialogue: string;
    closeEsc: string;
    underConstruction: string;
    underConstructionDesc: string;
    saveGame: string;
    returnToTitle: string;
    audio: string;
    musicVolume: string;
    sfxVolume: string;
    unmuteAll: string;
    muteAll: string;
    gameSaved: string;
    language: string;
  };

  // Game content (items, dialogues, quests, etc.) — translated separately
  // from UI chrome. See src/i18n/content/.
  content: {
    items: ItemsContent;
    affixes: AffixesContent;
    itemSets: ItemSetsContent;
  };
}
