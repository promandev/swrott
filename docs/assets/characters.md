# Characters — sprites & combat states

> Style: **pixel art**. Each entry below is a **subject line**. Build the final Leonardo prompt
> as: **subject line + [STYLE SUFFIX A]** (full-body) from [`README.md`](README.md), plus the
> global NEGATIVE. Combat-state variants use the pose deltas from README §B.
> Filenames live in `public/images/characters/`. **Filename = id** (or `{id}_{state}`).
>
> Legend: ✅ exists · ⬜ to generate · ♻️ reuses a placeholder · 👑 boss (do 4 states) · ⭐ always on screen

### Two fully-assembled examples (so you can see the complete form)

> **Seyla (idle):**
> `weathered human cantina keeper woman in her 60s, grey hair tied back in a faded bandana, lean wiry build, worn brown leather vest over an olive shirt, heavy utility belt with pouches, steel forearm guards, scuffed boots, one hand on hip, knowing half-smile, full-body pixel-art game sprite, front view, full figure centered with small headroom and floor room, neutral combat-ready stance, crisp clean 1px dark outline, limited cohesive palette (24–32 colours), flat cel shading with a single top-left light, minimal dithering only on large surfaces, sharp readable pixel clusters, no blur, KOTOR-era Star Wars Sith dark fantasy, solid flat #FF00FF magenta background`
>
> **Marauder (attack):**
> `hulking Sith warrior, heavy crimson-and-black plate armor, mid-strike swinging a double-bladed red lightsaber overhead, weight forward, snarling, full-body pixel-art game sprite, front view, ... [STYLE SUFFIX A]`

---

## ⭐ Player Classes — TOP PRIORITY (always on screen → all 4 combat states)

Existing idle art: `class_marauder.svg`, `class_inquisitor.svg`, `class_assassin.svg`. Registry
keys: `marauder` / `inquisitor` / `assassin`. (Generic fallback: `character.svg`.)

### Marauder (Sith Warrior) — `marauder` ✅ idle · ⬜ attack/hurt/down
Subject: `imposing Sith warrior juggernaut, heavy crimson-and-black layered plate armor with spiked pauldrons, battle-scarred, wielding a two-handed red lightsaber (or twin red sabers), tattered war-skirt, heavy boots, aggressive grounded stance`
- **attack** `marauder_attack` — `mid overhead two-handed saber swing, weight forward, snarling`
- **hurt** `marauder_hurt` — `recoiling flinch, guard broken, one step back`
- **down** `marauder_down` — `down on one knee, saber stabbed into ground for support`

### Inquisitor (Sith Sorcerer) — `inquisitor` ✅ idle · ⬜ attack/hurt/down
Subject: `gaunt Sith sorcerer, flowing black-and-violet hooded robes with gilt trim, pale gaunt face, force-lightning crackling around raised fingers, single thin red saber at hip`
- **attack** `inquisitor_attack` — `channeling pose, both hands thrust forward unleashing violet force lightning`
- **hurt** `inquisitor_hurt` — `robe whipping, staggering back, hood falling`
- **down** `inquisitor_down` — `collapsed to knees, robes pooled, one hand on ground`

### Assassin (Sith Shadow) — `assassin` ✅ idle · ⬜ attack/hurt/down
Subject: `lithe hooded Sith assassin, matte-black wrapped armor and cloak, face shadowed, holding a double-bladed red lightsaber, coiled low predatory stance`
- **attack** `assassin_attack` — `spinning double-saber strike, blades arcing, mid-lunge`
- **hurt** `assassin_hurt` — `twisting away, cloak flaring, off-balance`
- **down** `assassin_down` — `crumpled sideways, double-saber fallen, hood off`

---

## Companions (fight beside you → ideal 4 states; minimum idle)

| Companion | id | Status | Recruited on |
|---|---|---|---|
| Kaelis Dren | `kaelis` | ✅ idle | Korriban |
| V3X-9 | `v3x9` | ✅ idle | Korriban |
| Serana Voss | `serana` | ⬜ | Nar Shaddaa |
| Torvak | `torvak` | ⬜ | Dxun |
| Echo Shade | `echo_shade` | ⬜ | Dantooine |

- **Kaelis Dren** — `kaelis` ✅ — `honorable young Sith duelist, dark red and black light armor, short dark hair, single red saber held in a clean duelist's guard, proud bearing`
- **V3X-9** — `v3x9` ✅ — `ancient battered assassin droid, humanoid chassis, scratched matte-grey plating with exposed wiring, one glowing red optic, vibroblade forearms, hunched efficient posture`
- **Serana Voss** — `serana` ⬜ 👑-quality — `former Jedi padawan turning to the dark side, light leather robes torn and re-stitched in Sith style, auburn hair, conflicted expression, a single blue-fading-to-violet saber`
- **Torvak** — `torvak` ⬜ 👑-quality — `battle-hardened Mandalorian warrior, dented beskar plate in earth-and-iron tones, T-visor helmet under arm, heavy vibrosword and gauntlet flamethrower, scarred jaw`
- **Echo Shade** — `echo_shade` ⬜ 👑-quality — `translucent Sith force-ghost, semi-transparent cyan-violet spectral robes trailing into mist, hollow glowing eyes, ancient and serene, bound to a floating shard artifact`

---

## KORRIBAN (Lv 1–10) — Sith homeworld

### NPCs
- **Darth Voren** — `npc_darth_voren` ✅ — `tall imposing Sith Lord, grey corpse-pale skull-like face with glowing red eyes, black robe lined in dark crimson, armored steel pauldrons, commanding`
- **Archivist Kheln** — `npc_archivist_kheln` ✅ — `red-skinned Sith pureblood archivist, deep black hood, dark-red robe embroidered with gold Sith glyphs down the front, cradling a golden orrery-orb, white goatee`
- **Overseer Raxis** — `npc_overseer_raxis` ✅ — `stern human woman, cropped auburn hair, red ritual scar across the brow, dark purple-black overseer armor with a long tabard, gold earrings, gloved`
- **Daryth** — `npc_daryth` ✅ — `young male Sith acolyte, plain dark grey-black robes, brown hair, blue eyes, faint confident smirk`
- **Kira** — `npc_kira_slave` ✅ — `blue-skinned Twi'lek slave girl, dark headband, ragged maroon wrap-dress, broken chains on wrists, defiant eyes`
- **Grot** — `npc_merchant_grot` ✅ — `green-skinned goblin-like merchant with large ears, worn leather utility vest, satchel of tools and trinkets, shrewd grin`
- **Seyla** — `npc_seyla` ✅ — `weathered human cantina keeper, 60s, grey hair in a faded bandana, brown leather vest, heavy utility belt, knowing half-smile`
- **Varn Dassik** — `npc_czerka_varn` ✅ — `sweating human corporate man in an immaculate navy Czerka suit, red tie, slicked hair, clutching a datapad, nervous smile`
- **Thane** — `npc_thane` ✅ — `frightened young man, low brown hood and cloak, dark-red under-robe, downcast trembling, branded deserter`
- **Dregg** — `npc_arena_master_dregg` ⬜ — `broad-shouldered Zabrak arena master, facial horns and tattoos, sleeveless leather harness over scarred muscle, betting chits at his belt, arms crossed`
- **Rhen** — `npc_acolyte_rhen` ⬜ — `slight timid young acolyte, oversized grey acolyte robes, hunched and anxious, clutching an unlit training saber`
- **Senna Vael** — `npc_dreshdae_senna` ⬜ — `washed-out former acolyte woman, threadbare civilian clothes over Academy underlayers, hollow-eyed and indebted, defensive posture` (Dreshdae)

### Enemies
- **Sith Acolyte** — `sith_acolyte` ✅ — `rival Sith acolyte, black training robes with a red sash belt, brown hair, green eyes, red ritual cheek-marks, fists clenched`
- **K'lor'slug** — `klor_slug` ⬜ — `venomous insectoid burrower, segmented chitinous grey-green body, many legs, dripping mandibles, hunched low`
- **Tuk'ata** — `tuk_ata` ⬜ — `Sith hound, muscular six-legged beast, leathery red-black hide, bony facial crests and spines, snarling`
- **Shyrack** — `shyrack` ⬜ — `bat-like cave creature, leathery wings, eyeless screeching maw of teeth, pale grey membrane`
- **Tomb Guardian Droid** — `tomb_droid` ⬜ — `ancient four-legged security droid, corroded bronze armor plating, single red sensor, integrated blaster arm`
- **Sith Pureblood Warrior** — `sith_pureblood` ♻️(kheln) — `crimson-skinned Sith pureblood warrior, tendril cheeks, ornate black-and-gold battle armor, dual short sabers, contemptuous sneer`
- **Tomb Wraith** — `tomb_wraith` ⬜ — `spectral Sith lord remnant, semi-transparent tattered robes, skeletal glowing face, phasing wisps of dark energy`
- **Tomb Guardian** 👑 — `tomb_guardian_boss` ⬜ — `towering ancient Sith war construct, massive stone-and-bronze body carved with glyphs, glowing red core, huge fists`
- **Tomb Beast** — `tomb_beast` ⬜ — `gaunt carrion tomb predator, mottled grey hide stretched over ribs, long claws, blood-matted maw`
- **Daryth (rival)** 👑 — `daryth_rival` ♻️(npc_daryth) — `Daryth in arena combat, dark acolyte robes, single red saber raised, cruel ambition on his face`
- **K'lor'slug Queen** 👑 — `klor_slug_queen` ⬜ — `bloated insectoid queen the size of a speeder, swollen grey-green egg-sac abdomen, clicking mandibles, small thrashing limbs`
- **Alpha Tuk'ata** 👑 — `tukata_alpha` ⬜ — `huge pack-leader Sith hound, bristling dark-side mane crackling with energy, scarred red-black hide, double the size of its kin`
- **Hssiss** — `hssiss` ⬜ — `dark-side dragon, serpentine scaled body, four clawed legs, venom dripping from fangs, glowing violet eyes`
- **Terentatek** 👑 — `terentatek` ⬜ — `massive tomb-horror, hunched ape-like body, black spines and tusks, huge poison claws, beady hungry eyes, feeds on Force-blood`
- **Overseer Drex** 👑 — `mine_overseer` ♻️(raxis) — `brutal mine slave-driver, heavy dark armor, shock-lash whip coiled in one fist, vibroblade at hip, cruel scarred face`
- **Tomb Raider** — `smuggler_raider` ⬜ — `off-world smuggler, scuffed spacer jacket and bandolier, blaster pistol drawn, artifact sack over shoulder, shifty stance`
- **Thane (last stand)** — `thane_deserter` ♻️(npc_thane) — `cornered deserter acolyte, hood thrown back, knife drawn in a shaking grip, desperate`
- **Spirit of Marka Ragnos** 👑 — `ragnos_spirit` ⬜ — `colossal ancient Sith lord ghost, semi-transparent gold-and-green spectral armor and crown, beard of mist, radiating power` (dungeon boss)

---

## DROMUND KAAS (Lv 8–12) — Imperial capital, perpetual storm

> Note: a few Dromund Kaas NPC ids are duplicated across data files; point the same art at the
> id the zone hotspot uses.

### NPCs
- **Lord Malvek** — `npc_lord_malvek` ⬜ — `lean Sith magistrate, silver hair slicked back, manicured, fine black-and-violet court robes, serpentine smile, steepled fingers`
- **Tavros the Unseen** — `npc_blind_seer_tavros` ⬜ — `blind seer, grey rag robes, eyes wrapped in stained bandages, gnarled staff, prophetic stillness`
- **Captain Rhea Vayne** — `npc_captain_rhea` ⬜ — `Imperial garrison commander woman, sleek black Imperial officer armor and cap, blaster sidearm, weary resentful eyes`
- **Darth Seris** — `npc_darth_seris` ⬜ — `cold Sith Lord woman of the Dark Council, floor-length black silk robes with silver filigree, severe beauty, presence that chills the room`
- **Moff Kallus** — `npc_moff_kallus` ⬜ — `polished Imperial Moff, immaculate grey-green uniform with rank plaque, cold grey eyes, gloved hands clasped`
- **Acolyte Thirix** — `npc_acolyte_thirix` ⬜ — `young frightened Zabrak acolyte, small facial horns, grey initiate robes, glancing over shoulder, on edge`
- **Drayven** — `npc_merchant_drayven` ⬜ — `Sith artificer armorer, heavy leather apron over dark clothes, kyber-tool harness, cybernetic eye loupe, forge-smudged hands`
- **Vex** — `npc_informant_vex` ⬜ — `scarred Twi'lek information broker, dark hooded jacket, lekku wrapped, sly distrustful grin`
- **Jorra** — `npc_jorra_cantina` ⬜ — `weathered Mirialan cantina keeper woman, green skin with geometric chin tattoos, apron, pouring a drink, listening face`
- **Veyra** — `npc_agent_veyra` ⬜ — `watchful undercover agent woman, plain civilian coat hiding a holster, restless darting eyes, cold caf cup`
- **Brakk** — `npc_hunter_brakk` ⬜ — `Trandoshan hunter, green reptilian scales, cybernetic stump on one arm, trophy-strung harness, slug-thrower rifle`

### Enemies
- **Imperial Guard** — `imperial_guard` ♻️(sith_acolyte) — `black-armored Imperial soldier, full helmet, vibrosword and blaster, rigid disciplined stance`
- **Vine Cat** — `kaas_vine_cat` ⬜ — `six-limbed jungle predator, sleek wet-black fur, bioluminescent cyan fangs and eyes, low pounce stance`
- **Imperial Shadow** — `kaas_shadow_assassin` ♻️(assassin) — `assassin in matte-black sealed armor, segmented helmet, vibroblades reversed, blurring into rain`
- **The Layered Voice** 👑 — `kaas_temple_voice` ⬜ — `ancient Sith spirit manifest, overlapping translucent robed silhouettes speaking as one, violet eyes, swirling dark mist`
- **Jungle Gundark** — `kaas_gundark` ⬜ — `four-armed jungle brute, grey-green muscled hide, tusked underbite, two upper arms raised`
- **Gundark Alpha** 👑 — `kaas_gundark_alpha` ⬜ — `giant scarred gundark, broken tusks, four massive arms, torn ear, storm-beaten hide`
- **Agent of Mortis** — `mortis_assassin` ⬜ — `unmarked assassin, dark hooded bodysuit, poisoned curved daggers, no insignia, crouched`
- **Temple Sentinel** — `temple_sentinel` ⬜ — `ancient war droid, tall weathered bronze chassis, glaive and shock-emitter, eternal sentry pose`
- **The Sanctum Keeper** 👑 — `sanctum_keeper` ⬜ — `towering construct of carved stone bound with arcing lightning, glowing rune-seams, monolithic guardian`
- **Sludge Creeper** — `sludge_creeper` ⬜ — `pale eyeless cave horror, slick segmented amphibian body, sensory feelers, dripping with sludge`
- **The Undercroft Horror** 👑 — `undercroft_horror` ⬜ — `bloated sithspawn abomination, fused mismatched limbs, tumorous corrupted flesh, many weeping eyes, nesting in black water`

---

## ZIOST (Lv 12–16) — frozen first Sith capital

### NPCs
- **Keeper Veth** — `npc_ziost_keeper` ⬜ — `frost-burned old woman, many layers of pale cortosis-thread wraps, ice-rimed hood, scavenger's pack, shrewd squint`
- **Archivist Sarn** — `npc_ziost_archivist` ⬜ — `pale soft-spoken scholar, dark Sith Archive robes dusted with frost, sleepless shadowed eyes, datapad and stylus, haunted`
- **Overseer Maliss** — `npc_ziost_overseer` ⬜ — `centuries-old Sith warden woman, frost-cracked black-and-ice armor, long white braid, strange faraway gaze`

> Ziost reuses beast/Sith enemy templates (no dedicated roster). Reskin to a cold palette
> (ice-blue rim light, frost crust) when generating Ziost-specific variants later.

---

## NAR SHADDAA (Lv 11–18) — the Smuggler's Moon

### NPCs
- **Broker Neth** — `npc_broker_neth` ⬜ — `Exchange crime lord, heavyset human in a fine dark coat with metal rings, cigarra, custom armored office chair, long-memory glare`
- **Cyra Venn** — `npc_cyra_venn` ⬜ — `lethal Mirialan bounty hunter woman, green skin with tattoos, sleek charcoal armor, twin blaster pistols, calm professional stare`
- **Kull** — `npc_dockmaster_kull` ⬜ — `massive Gamorrean dockmaster, green porcine bulk, grease-stained work harness, datapad manifest, unexpectedly thoughtful expression`
- **Zek** — `npc_informant_zek` ⬜ — `nervous Duros informant, blue-green skin, large red eyes, rumpled spacer coat, hunched and twitchy`
- **Mira** — `npc_bartender_mira` ⬜ — `sharp-tongued human bartender woman, rolled sleeves, apron, dishrag over shoulder, knowing smirk behind a neon-lit bar`
- **Saka** — `npc_arms_dealer` ⬜ — `Weequay arms dealer, leathery wrinkled skin, beaded braids, mechanical right arm, crate of blasters, sly grin`
- **Ossian** — `npc_alchemist` ⬜ — `rogue Sith alchemist, gaunt robed figure, acid-stained gloves, rack of glowing vials at his belt, unsettling calm`

### Enemies
- **Street Thug** — `street_thug` ⬜ — `lowlife thug, mismatched scavenged armor, stolen blaster pistol, sneering, neon-lit grime`
- **Bounty Hunter** — `bounty_hunter` ⬜ — `professional hunter, sleek armored flight-suit and helmet, carbine and grenades, jetpack, ready stance`
- **Exchange Enforcer** — `exchange_enforcer` ⬜ — `heavy crime-syndicate enforcer, plated black armor, heavy blaster, stun baton, broad menacing build`
- **Rakghoul** — `rakghoul` ⬜ — `mutated rakghoul, hunched grey diseased flesh, claws and fanged maw, plague-sores, feral lunge`
- **The Exchange Boss** 👑 — `exchange_boss` ⬜ — `underworld crime lord, opulent armored coat, cybernetic implants, heavy custom blaster, surrounded by tech, smug power`

---

## ONDERON (Lv 15–22) — walled city, beast-riders

### NPCs
- **Queen Talira Marath** — `npc_queen_talira` ⬜ — `regal Onderonian queen, ornate green-and-gold royal gown with mantle, circlet crown, proud political poise` (alt id `npc_queen_talia`)
- **General Voss Therrik** — `npc_general_voss` ⬜ — `grizzled veteran general, dress military uniform with medals, grey crew cut, scarred jaw, hands behind back` (alt id `npc_general_vaklu`)
- **Ronar Sol** — `npc_hidden_jedi_ronar` ⬜ — `Jedi in hiding, plain Onderonian laborer clothes, weathered calm face, a hidden saber hilt at the belt, watchful`
- **Berga** — `npc_onderon_merchant` ⬜ — `boisterous Onderonian beast-market trader woman, drexl-leather apron, jungle relics on display, hearty grin`
- **Castellan Maron Dree** — `npc_castellan_dree` ⬜ — `grey-haired palace seneschal, formal dark court livery with keys of office, composed and observant`

### Enemies
- **Boma Beast** — `boma_beast` ⬜ — `large quadruped predator, armored grey-brown hide, broad horned head, powerful shoulders mid-charge`
- **Drexl Larva** — `drexl_larva` ⬜ — `juvenile drexl, speeder-sized winged reptilian grub, leathery wings half-spread, snapping beak`

---

## DXUN (Lv 18–28) — Onderon's jungle moon

### NPCs
- **Mandalore** — `npc_mandalore` ⬜ — `masked Mandalorian warlord, battle-worn beskar in clan colors, horned T-visor helm, cape of pelts, commanding stance`
- **Vrenn Ordo** — `npc_mando_armorer` ⬜ — `Mandalorian clan armorer, heavy forge apron over armor, smith's hammer and tongs, visor up, soot-streaked`
- **Sergeant Kessa** — `npc_scout_kessa` ⬜ — `Onderonian scout woman, mud-caked camo fatigues, one arm splinted in a sling, thousand-meter stare, carbine slung`

### Enemies
- **Mandalorian Scout** — `mandalorian_scout` ⬜ — `fast Mandalorian scout, light grey-blue armor, jetpack, blaster carbine, agile ready crouch`
- **Mandalorian Warrior** — `mandalorian_warrior` ⬜ — `veteran Mandalorian, heavy crimson-and-iron beskar plate, gauntlet flamethrower, vibroblade, unflinching`
- **Cannok** — `cannok` ⬜ — `small pack predator, stocky lizard-dog, big jaws, mottled jungle hide, snapping`
- **Tomb Lord of Dxun** 👑 — `tomb_lord_dxun` ⬜ — `ancient Sith spirit, towering spectral robed figure wreathed in shadow and green fire, crowned skull face, commanding the dead`

---

## DANTOOINE (Lv 20–30) — grasslands & Jedi ruins

### NPCs
- **Master Senka Vell** — `npc_jedi_master` ⬜ — `serene Miraluka Jedi woman, eyeless with a cloth band across the brow, simple earth-toned robes, weathered calm, part of the landscape`

### Enemies
- **Kath Hound** — `kath_hound` ⬜ — `pack predator, shaggy tan-brown quadruped, blunt horned snout, bared fangs, lean and fast`
- **Kinrath** — `kinrath` ⬜ — `cave spider-creature, pale armored carapace, many legs, venom-tipped tail, glowing crystal-cave glow`
- **Mercenary** — `mercenary` ⬜ — `ruins salvager merc, patched armor and breath-mask, blaster rifle and vibroblade, opportunist stance`
- **Corrupted Guardian** 👑 — `corrupted_guardian` ⬜ — `dark-twisted Jedi guardian construct, cracked white-and-gold plating bleeding violet corruption, dual sabers, hollow glow`

---

## TELOS IV (Lv 28–38) — orbital station & recovering surface

### NPCs
- **Commander Issa Locke** — `npc_telos_commander` ⬜ — `station security chief woman, blue-grey TSF officer uniform with vest, sidearm, exhausted but sharp, datapad`
- **Renn** — `npc_dockhand_renn` ⬜ — `wiry nervous cargo handler, grease-stained jumpsuit, gloves, eyes flicking to the cameras, sweating`

### Enemies
- **Czerka Mercenary** — `czerka_merc` ⬜ — `corporate enforcer, sleek grey Czerka combat armor with logo, heavy blaster, professional cold stance`
- **Salvage Droid** — `salvage_droid` ⬜ — `bulky reprogrammed construction droid, orange-and-rust industrial plating, hydraulic claw and cutting torch, heavy gait`
- **Wild Beast** — `wild_beast` ⬜ — `mutated surface beast, matted irradiated fur, asymmetric tumorous growths, snarling territorial`
- **Rakata Construct** 👑 — `rakata_construct` ⬜ — `ancient Rakata war construct, smooth obsidian-and-bronze alien design, glowing red disintegration array, energy shield shimmer`

---

## MALACHOR V (Lv 35–50) — the shattered world, endgame

### Enemies
- **Storm Beast** — `storm_beast` ⬜ — `massive dark-side predator, jagged black-grey hide, crackling static along spines, glowing eyes, drawn to the wound`
- **Shadow Assassin** — `shadow_assassin` ♻️(assassin) — `Trayus shadow assassin, sealed matte-black robes and mask, double-bladed red saber, emerging from darkness`
- **Void Wraith** — `void_wraith` ⬜ — `spectral void entity, tattered black-violet wisps around a hollow core, skeletal grasping hands, life-draining aura`
- **Sith Marauder Elite** — `sith_marauder_elite` ♻️(marauder) — `Trayus-trained marauder, scarred blood-red armor, twin red sabers crossed, feral fury`
- **Ghost Captain** 👑 — `ghost_captain` ⬜ — `spectral Republic warship captain, translucent blue-grey uniform, peaked cap, saber-scarred, trapped between life and death`
- **Darth Sion, Lord of Pain** 👑 — `darth_sion` ⬜ — `broken undying Sith lord, body a mosaic of cracked decaying flesh held by rage, glowing fissures, single heavy red saber, hateful glare`
- **Darth Nihilus, Lord of Hunger** 👑 — `darth_nihilus` ⬜ — `void-wreathed Sith lord, cracked white-and-red mask, flowing black-shroud robes dissolving into hungry darkness, no body beneath, devouring presence`
- **Darth Traya, Lord of Betrayal** 👑 — `darth_traya` ⬜ — `Kreia's final form, grey-and-white robes, three lightsabers (red/violet/orange) orbiting her by the Force alone, blind serene authority`
