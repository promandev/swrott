# ═══════════════════════════════════════════════════════════════════════════
#  SWROTT — Character Image Converter  (multi-seed edge flood-fill edition)
#  scripts/convert-characters.ps1
# ═══════════════════════════════════════════════════════════════════════════
#
#  WHAT IT DOES
#  ────────────
#  Turns a flat-background JPG/PNG sprite into a transparent  {id}.svg  that the
#  game can consume directly (PNG embedded in an SVG wrapper, matching every
#  other portrait in public/images/characters/).
#
#  Unlike a naive "remove one corner color" key, this uses a MULTI-SEED EDGE
#  FLOOD-FILL:
#    • It samples the whole image border, learns the dominant background tones
#      (so checkerboard / two-tone "transparency" backdrops work — e.g. raxis).
#    • It floods inward from the edges, only eating pixels that are within
#      tolerance of a learned background tone AND connected to the border.
#      → Interior highlights (eye glints, white trim) are preserved.
#      → Light drop-shadows under the feet get eaten (raise tolerance if not).
#
#  USAGE
#  ─────
#  1. Drop source art into  $SRC_DIR  (default: characters/full_body_sprite/).
#  2. Edit $RENAME_MAP:  "filename.jpg" = "output_id".
#  3. Tune $TOLERANCE_OVERRIDES per file if a preview looks wrong.
#  4. Run:  & scripts/convert-characters.ps1
#       -Preview       (default ON)  also writes characters/_qa/{id}.png
#                                    (subject composited over magenta for QA)
#       -DeleteSource  (default OFF) removes the source file after success
#  5. Register the result in  src/game/utils/character-images.ts.
#
#  OUTPUT ID = the entity's id field, so the game finds it:
#     Player class →  "marauder" | "inquisitor" | "assassin"
#     NPC          →  NpcDefinition.id      e.g. "npc_darth_voren"
#     Companion    →  CompanionDefinition.id e.g. "kaelis"
#     Enemy        →  EnemyTemplate.id       e.g. "sith_acolyte"
#  State variants  →  "{id}_attack" | "{id}_hurt" | "{id}_down"
# ═══════════════════════════════════════════════════════════════════════════

param(
    [bool]$Preview = $true,
    [switch]$DeleteSource
)

$SRC_DIR           = "D:\Developement\SWROTT\public\images\characters\full_body_sprite"
$OUT_DIR           = "D:\Developement\SWROTT\public\images\characters"
$QA_DIR            = Join-Path $OUT_DIR "_qa"
$DEFAULT_TOLERANCE = 72   # color-distance threshold (0–441) for the flood

# ── RENAME MAP ──────────────────────────────────────────────────────────────
$RENAME_MAP = [ordered]@{
    "daryth.jpg"       = "npc_daryth"
    "grot.jpg"         = "npc_merchant_grot"
    "kheln.jpg"        = "npc_archivist_kheln"
    "raxis.jpg"        = "npc_overseer_raxis"
    "kira.jpg"         = "npc_kira_slave"
    "voren.jpg"        = "npc_darth_voren"
    "sith_acolyte.jpg" = "sith_acolyte"
    "seyla.jpg"        = "npc_seyla"
    "varn_dassik.jpg"  = "npc_czerka_varn"
    "thane.jpg"        = "npc_thane"
}

# ── PER-FILE TOLERANCE OVERRIDES (only when a preview shows trouble) ─────────
$TOLERANCE_OVERRIDES = @{
    "raxis.jpg" = 46   # strong two-tone checkerboard — keep tight, multi-seed handles both tones
    "grot.jpg"  = 56   # faint checker near white
    "kheln.jpg" = 56   # faint checker + top watermark text
}

# ─── No changes needed below this line ───────────────────────────────────────

Add-Type -AssemblyName System.Drawing

Add-Type @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class BgFlood {
    const double POCKET_TOL = 40;   // pass 2: tight, so it only eats bg-toned pixels, never colored subject
    const int    POCKET_MIN = 120;  // pass 2: only remove LARGE enclosed pockets, keep tiny specular highlights
    const double LIGHT_BG   = 200;  // pass 2 only runs when the bg is this bright (protects gray-bg art like raxis)
    const double SHADOW_Y   = 0.62; // pass 3: only the bottom band can lose pixels
    const int    SHADOW_SAT = 30;   // pass 3: max-min channel spread — shadows are near-neutral (lavender-tinted ok)
    const int    SHADOW_LUM = 188;  // pass 3: pale shadows are bright; subject grays (gloves/armor) sit below this

    static double Dist(int b,int g,int r,int bb,int bg,int br){
        double db=b-bb, dg=g-bg, dr=r-br;
        return Math.Sqrt(db*db+dg*dg+dr*dr);
    }

    // Returns transparent bitmap. refsOut receives a human-readable palette summary.
    public static Bitmap Remove(string path, double tol, out string refsOut) {
        Bitmap src;
        using (var tmp = new Bitmap(path)) {
            src = new Bitmap(tmp.Width, tmp.Height, PixelFormat.Format32bppArgb);
            using (var g = Graphics.FromImage(src))
                g.DrawImage(tmp, 0, 0, tmp.Width, tmp.Height);
        }
        int w = src.Width, h = src.Height;
        var data = src.LockBits(new Rectangle(0,0,w,h), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
        int stride = data.Stride;
        byte[] px = new byte[stride*h];
        Marshal.Copy(data.Scan0, px, 0, px.Length);

        // ── Learn background palette from the border (quantized to /8 buckets) ──
        var hist = new Dictionary<int,int>();
        Action<int,int> tally = (x,y) => {
            int i = y*stride + x*4;
            int qb=(px[i]/8)*8, qg=(px[i+1]/8)*8, qr=(px[i+2]/8)*8;
            int key=(qr<<16)|(qg<<8)|qb;
            hist[key] = hist.ContainsKey(key) ? hist[key]+1 : 1;
        };
        for (int x=0;x<w;x++){ tally(x,0); tally(x,h-1); }
        for (int y=0;y<h;y++){ tally(0,y); tally(w-1,y); }
        int borderCount = 2*(w+h)-4;
        int thresh = Math.Max(1,(int)(borderCount*0.02)); // a tone must cover >=2% of border

        var refsB=new List<int>(); var refsG=new List<int>(); var refsR=new List<int>();
        var summary=new System.Text.StringBuilder();
        foreach (var kv in hist){
            if (kv.Value>=thresh){
                int r=(kv.Key>>16)&0xff, g=(kv.Key>>8)&0xff, b=kv.Key&0xff;
                refsR.Add(r); refsG.Add(g); refsB.Add(b);
                summary.Append(String.Format("rgb({0},{1},{2})x{3:P0} ", r,g,b, (double)kv.Value/borderCount));
            }
        }
        if (refsR.Count==0){ // fallback: pure top-left corner
            refsB.Add(px[0]); refsG.Add(px[1]); refsR.Add(px[2]);
            summary.Append("fallback-corner ");
        }
        refsOut = summary.ToString();

        Func<int,bool> isBg = (i) => {
            int b=px[i], g=px[i+1], r=px[i+2];
            for (int k=0;k<refsR.Count;k++)
                if (Dist(b,g,r, refsB[k],refsG[k],refsR[k]) < tol) return true;
            return false;
        };

        // ── Flood fill inward from every background-colored border pixel ──
        bool[] visited = new bool[w*h];
        var stack = new Stack<int>();
        Action<int,int> seed = (x,y) => {
            int i=y*stride+x*4; int id=y*w+x;
            if (!visited[id] && isBg(i)){ visited[id]=true; stack.Push(id); }
        };
        for (int x=0;x<w;x++){ seed(x,0); seed(x,h-1); }
        for (int y=0;y<h;y++){ seed(0,y); seed(w-1,y); }

        while (stack.Count>0){
            int id=stack.Pop();
            int x=id%w, y=id/w;
            int i=y*stride+x*4;
            px[i+3]=0; // transparent
            // 4-neighbours
            if (x>0){ int n=id-1; if(!visited[n] && isBg((y)*stride+(x-1)*4)){visited[n]=true;stack.Push(n);} }
            if (x<w-1){ int n=id+1; if(!visited[n] && isBg((y)*stride+(x+1)*4)){visited[n]=true;stack.Push(n);} }
            if (y>0){ int n=id-w; if(!visited[n] && isBg((y-1)*stride+(x)*4)){visited[n]=true;stack.Push(n);} }
            if (y<h-1){ int n=id+w; if(!visited[n] && isBg((y+1)*stride+(x)*4)){visited[n]=true;stack.Push(n);} }
        }

        // ── PASS 2: enclosed light-bg pockets (armpit/leg gaps the edge flood can't reach) ──
        // Only for light backgrounds, and only pixels TIGHTLY matching a bg tone, so colored
        // subject (skin, robes, even a blue-white shirt) is never touched.
        double minLum = 999;
        for (int k=0;k<refsR.Count;k++){ double l=(refsR[k]+refsG[k]+refsB[k])/3.0; if(l<minLum) minLum=l; }
        if (minLum >= LIGHT_BG) {
            // candidate = opaque pixel that tightly matches a learned bg tone
            bool[] cand = new bool[w*h];
            for (int y=0;y<h;y++) for (int x=0;x<w;x++){
                int i=y*stride+x*4;
                if (px[i+3]==0) continue;
                int b=px[i],g=px[i+1],r=px[i+2];
                for (int k=0;k<refsR.Count;k++)
                    if (Dist(b,g,r, refsB[k],refsG[k],refsR[k]) < POCKET_TOL){ cand[y*w+x]=true; break; }
            }
            // remove only LARGE connected components (true enclosed gaps); keep tiny specular specks
            bool[] seen = new bool[w*h];
            var comp = new List<int>();
            var st2 = new Stack<int>();
            for (int id0=0; id0<w*h; id0++){
                if (!cand[id0] || seen[id0]) continue;
                comp.Clear(); st2.Push(id0); seen[id0]=true;
                while (st2.Count>0){
                    int id=st2.Pop(); comp.Add(id);
                    int x=id%w, y=id/w;
                    if (x>0   && cand[id-1] && !seen[id-1]){ seen[id-1]=true; st2.Push(id-1); }
                    if (x<w-1 && cand[id+1] && !seen[id+1]){ seen[id+1]=true; st2.Push(id+1); }
                    if (y>0   && cand[id-w] && !seen[id-w]){ seen[id-w]=true; st2.Push(id-w); }
                    if (y<h-1 && cand[id+w] && !seen[id+w]){ seen[id+w]=true; st2.Push(id+w); }
                }
                if (comp.Count >= POCKET_MIN)
                    foreach (int cid in comp){ int cx=cid%w, cy=cid/w; px[cy*stride+cx*4+3]=0; }
            }
        }

        // ── PASS 3: pale drop-shadows under the feet (bottom band only, connected to outside) ──
        bool[] vis2 = new bool[w*h];
        var s3 = new Stack<int>();
        for (int id=0; id<w*h; id++){ int x=id%w,y=id/w; if (px[y*stride+x*4+3]==0){ vis2[id]=true; s3.Push(id); } }
        int yMin = (int)(h*SHADOW_Y);
        Action<int,Stack<int>> tryEat = (n, st) => {
            if (vis2[n]) return; vis2[n]=true;
            int nx=n%w, ny=n/w; if (ny<yMin) return;
            int i=ny*stride+nx*4; if (px[i+3]==0) return;
            int b=px[i],g=px[i+1],r=px[i+2];
            int mx=Math.Max(b,Math.Max(g,r)), mn=Math.Min(b,Math.Min(g,r));
            if ((mx-mn)<=SHADOW_SAT && mx>=SHADOW_LUM){ px[i+3]=0; st.Push(n); }
        };
        while (s3.Count>0){
            int id=s3.Pop(); int x=id%w,y=id/w;
            if (x>0)   tryEat(id-1, s3);
            if (x<w-1) tryEat(id+1, s3);
            if (y>0)   tryEat(id-w, s3);
            if (y<h-1) tryEat(id+w, s3);
        }

        Marshal.Copy(px,0,data.Scan0,px.Length);
        src.UnlockBits(data);
        return src;
    }

    // Composite a transparent bitmap over solid magenta for visual QA.
    public static Bitmap PreviewOverMagenta(Bitmap t){
        int w=t.Width,h=t.Height;
        var outp=new Bitmap(w,h,PixelFormat.Format32bppArgb);
        using(var g=Graphics.FromImage(outp)){
            g.Clear(Color.FromArgb(255,255,0,255));
            g.DrawImage(t,0,0);
        }
        return outp;
    }
}
"@ -ReferencedAssemblies System.Drawing

if (-not (Test-Path $QA_DIR)) { New-Item -ItemType Directory -Path $QA_DIR -Force | Out-Null }

foreach ($entry in $RENAME_MAP.GetEnumerator()) {
    $srcPath  = Join-Path $SRC_DIR $entry.Key
    $destName = $entry.Value
    $destPath = Join-Path $OUT_DIR "$destName.svg"

    if (-not (Test-Path $srcPath)) {
        Write-Host "SKIP (not found): $($entry.Key)" -ForegroundColor DarkYellow
        continue
    }

    $tol = $DEFAULT_TOLERANCE
    if ($TOLERANCE_OVERRIDES.ContainsKey($entry.Key)) { $tol = $TOLERANCE_OVERRIDES[$entry.Key] }

    try {
        $refs = ""
        $bmp  = [BgFlood]::Remove($srcPath, [double]$tol, [ref]$refs)
        $w = $bmp.Width; $h = $bmp.Height

        $ms = [System.IO.MemoryStream]::new()
        $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
        $b64 = [Convert]::ToBase64String($ms.ToArray())
        $ms.Dispose()

        $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 $w $h" width="$w" height="$h">
  <image href="data:image/png;base64,$b64" width="$w" height="$h"/>
</svg>
"@
        [System.IO.File]::WriteAllText($destPath, $svg, [System.Text.Encoding]::UTF8)

        if ($Preview) {
            $prev = [BgFlood]::PreviewOverMagenta($bmp)
            $prev.Save((Join-Path $QA_DIR "$destName.png"), [System.Drawing.Imaging.ImageFormat]::Png)
            $prev.Dispose()
        }
        $bmp.Dispose()

        if ($DeleteSource) { Remove-Item $srcPath -Force }

        Write-Host ("OK  {0,-18} -> {1}.svg  ({2}x{3}, tol={4})" -f $entry.Key,$destName,$w,$h,$tol) -ForegroundColor Green
        Write-Host ("      bg palette: {0}" -f $refs) -ForegroundColor DarkGray
    }
    catch {
        Write-Host "ERR $($entry.Key): $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Done. SVGs -> $OUT_DIR" -ForegroundColor Cyan
if ($Preview) { Write-Host "QA previews (over magenta) -> $QA_DIR" -ForegroundColor Cyan }
