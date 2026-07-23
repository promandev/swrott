/** Music tracks — files expected at public/audio/music/<id>.ogg */
export type MusicTrackId =
  | "theme_main"       // main menu / landing
  | "korriban_ambient" // korriban exploration
  | "nar_shaddaa_ambient"
  | "onderon_ambient"
  | "dxun_ambient"
  | "malachor_ambient"
  | "combat_normal"    // standard combat
  | "combat_boss";     // boss encounters

/** Procedural SFX — generated with Web Audio API, no files needed */
export type SfxId =
  | "click"
  | "hover"
  | "open_panel"
  | "close_panel"
  | "combat_hit_light"
  | "combat_hit_heavy"
  | "combat_crit"
  | "combat_miss"
  | "combat_dodge"
  | "saber_swing"
  | "force_lightning"
  | "level_up"
  | "item_pickup"
  | "quest_complete"
  | "dialogue_advance";
