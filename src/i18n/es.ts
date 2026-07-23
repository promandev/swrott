import type { Translations } from "./types";

export const es: Omit<Translations, "content"> = {
  meta: {
    title: "Star Wars: El Ascenso del Triunvirato",
    description:
      "Un CRPG web ambientado en la era del Triunvirato Sith. Forja tu camino a través del poder, la traición o la astucia.",
  },

  landing: {
    era: "Era del Triunvirato Sith",
    riseOfThe: "El Ascenso del",
    triumvirate: "Triunvirato",
    tagline:
      "Comienza como nadie. Asciende a través del poder, la traición o la astucia. Caza reliquias prohibidas, comanda compañeros rotos y decide el destino de la galaxia.",
    newGame: "Nueva Partida",
    continue: "Continuar",
    replayIntro: "Repetir Intro",
    options: "Opciones",
    credits: "Créditos",
    version: "v0.1.0 · Build de Fundación",
  },

  play: {
    awakening: "Despertando…",
    autosaved: "Autoguardado",
  },

  cinematic: {
    cards: [
      {
        primary: "Los Jedi han caído.",
        secondary: "La República yace en cenizas.",
      },
      {
        primary: "Tres Señores Sith se reparten los restos.",
        secondary: "Se hacen llamar el Triunvirato.",
      },
      {
        primary: "Nihilus  ·  Traya  ·  Sion",
      },
      {
        primary: "Bajo las arenas rojas de Korriban,",
        secondary: "un esclavo despierta con poder en su sangre.",
      },
      {
        primary: "Tus cadenas acaban hoy.",
      },
    ],
    skip: "Saltar ›",
    clickToAdvance: "Clic para avanzar",
  },

  creation: {
    forgeYourDestiny: "Forja tu destino",
    newAcolyte: "Nuevo Acólito",
    name: "Nombre",
    namePlaceholder: "ej. Vethri Korr",
    ironman: "Ironman",
    ironmanDesc: "— una sola ranura de autoguardado, muerte permanente, sin recargas.",
    selected: "Seleccionado:",
    back: "Atrás",
    begin: "Comenzar",
    forging: "Forjando…",
    classes: {
      marauder: {
        name: "Merodeador",
        tagline: "Tanque Ofensivo",
        blurb:
          "Un muro de rabia roja. Parte armaduras, resiste golpes, ejecuta a los heridos.",
        trees: ["Juggernaut", "Berserker", "Duelista"],
      },
      inquisitor: {
        name: "Inquisidor",
        tagline: "Lanzador · Control",
        blurb:
          "Doblega mentes, invoca tormentas, drena a los vivos. La galaxia escucha — o grita.",
        trees: ["Hechicero", "Corruptor", "Dominador"],
      },
      assassin: {
        name: "Asesino",
        tagline: "Ráfaga · Sigilo",
        blurb:
          "Desaparece, reaparece tras una garganta. Marca, envenena, caza. Sé el silencio.",
        trees: ["Hoja Sombría", "Envenenador", "Espectro"],
      },
    },
  },

  load: {
    title: "Cargar Partida",
    close: "Cerrar",
    ironman: "Ironman",
  },

  hud: {
    hp: "PV",
    force: "Fuerza",
    korriban: "Korriban",
    academyExterior: "Exterior de la Academia",
    skillSlot: "Ranura de habilidad",
    character: "Personaje",
    inventory: "Inventario",
    journal: "Diario",
    map: "Mapa",
    menu: "Menú",
  },

  panels: {
    characterSheet: "Hoja de Personaje",
    inventoryTitle: "Inventario",
    questJournal: "Diario de Misiones",
    galaxyMap: "Mapa Galáctico",
    gameMenu: "Menú del Juego",
    dialogue: "Diálogo",
    closeEsc: "Cerrar (Esc)",
    underConstruction:
      "El panel de {panel} está en construcción.",
    underConstructionDesc:
      "Llegará en una fase posterior del desarrollo con funcionalidad completa (equipamiento arrastrar y soltar, árboles de talentos, seguimiento de misiones, etc.).",
    saveGame: "Guardar Partida",
    returnToTitle: "Volver al Título",
    audio: "Audio",
    musicVolume: "Volumen de Música",
    sfxVolume: "Volumen de Efectos",
    unmuteAll: "Activar Todo",
    muteAll: "Silenciar Todo",
    gameSaved: "Partida guardada.",
    language: "Idioma",
  },
};
