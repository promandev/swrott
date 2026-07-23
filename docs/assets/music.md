# Music (Suno.ai) & SFX

> **Music** → `public/audio/music/{id}.ogg`. Filename = the `MusicTrackId` in
> [`audio/types.ts`](../../src/game/audio/types.ts). Suno outputs instrumental score; export OGG.
> For each track: paste the **style prompt** into Suno's Style box, set **Instrumental = ON**
> (unless a choir/diegetic vocal is noted), generate ~2–3 min, pick a loopable section.
>
> Legend: ✅ on disk · ⬜ to produce. **Adding a new track id** also needs wiring: extend the
> `MusicTrackId` union in `audio/types.ts` and set the zone's `musicTrackId` in `data/zones/all-zones.ts`.

## Main & combat

| id | Status | Suno style prompt |
|---|---|---|
| `theme_main` | ✅ | `epic dark orchestral main theme, Star Wars Sith villain grandeur, ominous low brass, deep male choir, taiko drums, soaring tragic strings, slow build to a powerful climax, cinematic, instrumental` |
| `combat_normal` | ✅ | `driving dark hybrid-orchestral battle music, relentless string ostinato, war percussion, brass stabs, electric tension, ~140 bpm, loopable, instrumental` |
| `combat_boss` | ✅ | `epic Sith boss battle, full dramatic choir chanting in Latin, thunderous taiko and timpani, aggressive brass, frantic strings, overwhelming and intense, choir vocals` |

## Per-planet ambient

| id | Status | Suno style prompt |
|---|---|---|
| `korriban_ambient` | ✅ | `desolate dark ambient, Sith tomb world, low ominous drones, distant whispering choir, sparse ethnic percussion, dry desert wind, eerie and ancient, instrumental` |
| `dromund_kaas_ambient` | ⬜ | `imperial capital under eternal storm, dark militaristic orchestral ambient, rain and distant thunder, low foreboding choir, slow ominous brass swells, oppressive grandeur, instrumental` |
| `ziost_ambient` | ⬜ | `glacial dark ambient, frozen dead Sith capital, deep sub-bass drones, ice crackle, a single distant choir note held endlessly (an ancient song waking), creeping dread, instrumental with wordless choir` |
| `nar_shaddaa_ambient` | ✅ | `neon-noir downtempo, smoky synth pads, sultry duduk and saxophone, lazy electronic groove, rain on neon, seedy and nocturnal, instrumental` |
| `onderon_ambient` | ✅ | `regal exotic orchestral, lush strings and woodwinds, light jungle percussion, courtly intrigue with underlying tension, noble and warm, instrumental` |
| `dxun_ambient` | ✅ | `primal tribal war ambient, deep jungle drums, low brass horns, Mandalorian battle-horn calls, dangerous and feral, instrumental` |
| `dantooine_ambient` | ⬜ | `serene melancholic pastoral, soft warm strings, solo woodwind melody, gentle and wistful with an undercurrent of loss, peaceful Jedi ruins, instrumental` |
| `telos_ambient` | ⬜ | `cold hopeful sci-fi ambient, restored space-station synth pads, glassy crystalline textures, fragile optimism over emptiness, instrumental` |
| `malachor_ambient` | ✅ | `bleak cosmic-horror dark ambient, dissonant detuned strings, vast void drones, a choir of the dead murmuring, sparse and crushing, instrumental with eerie choir` |

## Stings & diegetic

| id | Status | Suno style prompt |
|---|---|---|
| `cantina_jizz` | ⬜ | `Star Wars cantina jizz-wail band, upbeat jazzy brass, kloo horn lead, bouncy swing groove, fizzy retro-future lounge, diegetic, instrumental` |
| `victory_sting` | ⬜ | `short triumphant dark fanfare, rising brass and choir hit, resolved on a powerful chord, ~5 seconds, instrumental` |
| `defeat_sting` | ⬜ | `short somber defeat sting, descending strings and a low mournful brass, fading to silence, ~4 seconds, instrumental` |

---

# SFX (15) — synthesized today, replaceable with samples

> All SFX are generated procedurally in [`audio/audio-manager.ts`](../../src/game/audio/audio-manager.ts);
> the `SfxId` type lives in [`audio/types.ts`](../../src/game/audio/types.ts). To swap in samples,
> drop `{id}.ogg` (suggested at `public/audio/sfx/`) and load via Howler. Use **ElevenLabs SFX**
> or similar (Suno is for music). Status: ✅ all wired (synth) · ⬜ no sample files yet.

| SfxId | Use | Sample brief |
|---|---|---|
| `click` | UI button | dry subtle click |
| `hover` | UI hover | soft tick |
| `open_panel` | open panel | metallic whoosh up |
| `close_panel` | close panel | metallic whoosh down |
| `combat_hit_light` | light hit | short saber impact |
| `combat_hit_heavy` | heavy hit (≥60 dmg) | deep impact + body thud |
| `combat_crit` | critical | sharp high clang + reverb |
| `combat_miss` | miss | air whoosh |
| `combat_dodge` | dodge | swish + footstep |
| `saber_swing` | melee windup | lightsaber ignite/hum |
| `force_lightning` | force windup | electric crackle |
| `level_up` | level up | dark ascending chord |
| `item_pickup` | pick up | soft chime/tink |
| `quest_complete` | quest done | brief fanfare |
| `dialogue_advance` | advance text | soft text blip |
