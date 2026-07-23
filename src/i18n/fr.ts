import type { Translations } from "./types";

export const fr: Omit<Translations, "content"> = {
  meta: {
    title: "Star Wars : L'Ascension du Triumvirat",
    description:
      "Un CRPG web se déroulant à l'ère du Triumvirat Sith. Forgez votre chemin à travers le pouvoir, la trahison ou la ruse.",
  },

  landing: {
    era: "Ère du Triumvirat Sith",
    riseOfThe: "L'Ascension du",
    triumvirate: "Triumvirat",
    tagline:
      "Commencez en tant que personne. Montez par le pouvoir, la trahison ou la ruse. Chassez des reliques interdites, commandez des compagnons brisés et décidez du destin de la galaxie.",
    newGame: "Nouvelle Partie",
    continue: "Continuer",
    replayIntro: "Revoir l'Intro",
    options: "Options",
    credits: "Crédits",
    version: "v0.1.0 · Build de Fondation",
  },

  play: {
    awakening: "Éveil…",
    autosaved: "Sauvegarde auto",
  },

  cinematic: {
    cards: [
      {
        primary: "Les Jedi sont brisés.",
        secondary: "La République gît en cendres.",
      },
      {
        primary: "Trois Seigneurs Sith se partagent les décombres.",
        secondary: "Ils se font appeler le Triumvirat.",
      },
      {
        primary: "Nihilus  ·  Traya  ·  Sion",
      },
      {
        primary: "Sous les sables rouges de Korriban,",
        secondary: "un esclave s'éveille avec du pouvoir dans le sang.",
      },
      {
        primary: "Vos chaînes prennent fin aujourd'hui.",
      },
    ],
    skip: "Passer ›",
    clickToAdvance: "Cliquez pour avancer",
  },

  creation: {
    forgeYourDestiny: "Forgez votre destin",
    newAcolyte: "Nouvel Acolyte",
    name: "Nom",
    namePlaceholder: "ex. Vethri Korr",
    ironman: "Ironman",
    ironmanDesc: "— un seul emplacement de sauvegarde auto, mort permanente, pas de rechargement.",
    selected: "Sélectionné :",
    back: "Retour",
    begin: "Commencer",
    forging: "Forge en cours…",
    classes: {
      marauder: {
        name: "Maraudeur",
        tagline: "Tank Offensif",
        blurb:
          "Un mur de rage rouge. Fend les armures, encaisse les coups, exécute les blessés.",
        trees: ["Juggernaut", "Berserker", "Duelliste"],
      },
      inquisitor: {
        name: "Inquisiteur",
        tagline: "Lanceur · Contrôle",
        blurb:
          "Plie les esprits, invoque des tempêtes, draine les vivants. La galaxie écoute — ou hurle.",
        trees: ["Sorcier", "Corrupteur", "Dominateur"],
      },
      assassin: {
        name: "Assassin",
        tagline: "Rafale · Furtivité",
        blurb:
          "Disparaissez, réapparaissez derrière une gorge. Marquez, empoisonnez, chassez. Soyez le silence.",
        trees: ["Lame d'Ombre", "Empoisonneur", "Spectre"],
      },
    },
  },

  load: {
    title: "Charger la Partie",
    close: "Fermer",
    ironman: "Ironman",
  },

  hud: {
    hp: "PV",
    force: "Force",
    korriban: "Korriban",
    academyExterior: "Extérieur de l'Académie",
    skillSlot: "Emplacement de compétence",
    character: "Personnage",
    inventory: "Inventaire",
    journal: "Journal",
    map: "Carte",
    menu: "Menu",
  },

  panels: {
    characterSheet: "Fiche de Personnage",
    inventoryTitle: "Inventaire",
    questJournal: "Journal de Quêtes",
    galaxyMap: "Carte Galactique",
    gameMenu: "Menu du Jeu",
    dialogue: "Dialogue",
    closeEsc: "Fermer (Échap)",
    underConstruction:
      "Le panneau {panel} est en construction.",
    underConstructionDesc:
      "Il arrivera dans une phase ultérieure du développement avec des fonctionnalités complètes (équipement glisser-déposer, arbres de talents, suivi de quêtes, etc.).",
    saveGame: "Sauvegarder",
    returnToTitle: "Retour au Titre",
    audio: "Audio",
    musicVolume: "Volume Musique",
    sfxVolume: "Volume Effets",
    unmuteAll: "Réactiver Tout",
    muteAll: "Tout Couper",
    gameSaved: "Partie sauvegardée.",
    language: "Langue",
  },
};
