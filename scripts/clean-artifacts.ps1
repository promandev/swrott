# Pass 3: remove remaining artifacts from class portraits and re-embed into SVGs.
#  - marauder:   gray drop-shadow ellipse under the feet (BFS from mid-gray seeds
#                in the bottom band, expanding through low-chroma pixels of any
#                brightness so the white fringe goes too; saber pink/white cores
#                are protected by the chroma gate on expansion).
#  - assassin /
#    inquisitor: enclosed near-white background remnants between arms and torso
#                (connected components with near-white average; gloves and skin
#                are darker/warmer and stay below the average threshold).
# After removal, a 1px defringe pass clears light low-chroma halo pixels that
# touch newly transparent areas.
param(
    [string]$Root = "D:\Developement\SWROTT"
)

Add-Type -AssemblyName System.Drawing
Add-Type @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class ArtifactCleaner {

    static byte[] Load(string path, out int w, out int h, out int stride) {
        Bitmap src;
        using (var tmp = new Bitmap(path)) {
            src = new Bitmap(tmp.Width, tmp.Height, PixelFormat.Format32bppArgb);
            using (var gfx = Graphics.FromImage(src))
                gfx.DrawImage(tmp, 0, 0, tmp.Width, tmp.Height);
        }
        w = src.Width; h = src.Height;
        var data = src.LockBits(new Rectangle(0, 0, w, h),
                                ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
        stride = data.Stride;
        byte[] px = new byte[stride * h];
        Marshal.Copy(data.Scan0, px, 0, px.Length);
        src.UnlockBits(data);
        src.Dispose();
        return px;
    }

    static void Save(byte[] px, int w, int h, int stride, string path) {
        var bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);
        var data = bmp.LockBits(new Rectangle(0, 0, w, h),
                                ImageLockMode.WriteOnly, PixelFormat.Format32bppArgb);
        Marshal.Copy(px, 0, data.Scan0, px.Length);
        bmp.UnlockBits(data);
        bmp.Save(path, ImageFormat.Png);
        bmp.Dispose();
    }

    static int Chroma(byte[] px, int p) {
        int min = Math.Min(px[p], Math.Min(px[p + 1], px[p + 2]));
        int max = Math.Max(px[p], Math.Max(px[p + 1], px[p + 2]));
        return max - min;
    }
    static int MinCh(byte[] px, int p) {
        return Math.Min(px[p], Math.Min(px[p + 1], px[p + 2]));
    }

    // Clear pixels that survive next to fresh transparency and look like halo.
    static void Defringe(byte[] px, int w, int h, int stride, int passes) {
        int[] dx = { 1, -1, 0, 0, 1, 1, -1, -1 };
        int[] dy = { 0, 0, 1, -1, 1, -1, 1, -1 };
        for (int pass = 0; pass < passes; pass++) {
            var clear = new List<int>();
            for (int y = 0; y < h; y++) {
                for (int x = 0; x < w; x++) {
                    int p = y * stride + x * 4;
                    if (px[p + 3] == 0) continue;
                    if (!(MinCh(px, p) > 150 && Chroma(px, p) < 45)) continue;
                    for (int d = 0; d < 8; d++) {
                        int nx = x + dx[d], ny = y + dy[d];
                        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
                        if (px[ny * stride + nx * 4 + 3] == 0) { clear.Add(p); break; }
                    }
                }
            }
            foreach (int p in clear) { px[p] = 0; px[p + 1] = 0; px[p + 2] = 0; px[p + 3] = 0; }
        }
    }

    public static void RemoveFootShadow(string inPath, string outPath) {
        int w, h, stride;
        byte[] px = Load(inPath, out w, out h, out stride);

        int yStart = (int)(h * 0.78);
        bool[] visited = new bool[w * h];
        var queue = new Queue<int>();

        // Seed: clearly-shadow mid grays in the bottom band
        for (int y = yStart; y < h; y++) {
            for (int x = 0; x < w; x++) {
                int p = y * stride + x * 4;
                if (px[p + 3] == 0) continue;
                if (MinCh(px, p) > 110 && MinCh(px, p) < 225 && Chroma(px, p) < 20) {
                    int i = y * w + x;
                    if (!visited[i]) { visited[i] = true; queue.Enqueue(i); }
                }
            }
        }

        // Expand through any low-chroma light pixel (catches the white fringe);
        // saber glow is pink (high chroma) so expansion cannot reach blade cores.
        int[] dx = { 1, -1, 0, 0 };
        int[] dy = { 0, 0, 1, -1 };
        int removed = 0;
        while (queue.Count > 0) {
            int idx = queue.Dequeue();
            int cx = idx % w, cy = idx / w;
            int cp = cy * stride + cx * 4;
            px[cp] = 0; px[cp + 1] = 0; px[cp + 2] = 0; px[cp + 3] = 0;
            removed++;
            for (int d = 0; d < 4; d++) {
                int nx = cx + dx[d], ny = cy + dy[d];
                if (nx < 0 || ny < yStart || nx >= w || ny >= h) continue;
                int ni = ny * w + nx;
                if (visited[ni]) continue;
                int np = ny * stride + nx * 4;
                if (px[np + 3] == 0) continue;
                if (!(MinCh(px, np) > 110 && Chroma(px, np) < 22)) continue;
                visited[ni] = true;
                queue.Enqueue(ni);
            }
        }
        Console.WriteLine("shadow removed px: " + removed);

        Defringe(px, w, h, stride, 1);
        Save(px, w, h, stride, outPath);
    }

    public static void RemoveEnclosedWhite(string inPath, string outPath,
                                           int minSize, int minAvg) {
        int w, h, stride;
        byte[] px = Load(inPath, out w, out h, out stride);

        bool[] visited = new bool[w * h];
        int[] dx = { 1, -1, 0, 0 };
        int[] dy = { 0, 0, 1, -1 };

        for (int y = 0; y < h; y++) {
            for (int x = 0; x < w; x++) {
                int i = y * w + x;
                if (visited[i]) continue;
                int p = y * stride + x * 4;
                if (px[p + 3] == 0) continue;
                if (!(MinCh(px, p) > 170 && Chroma(px, p) < 50)) continue;

                visited[i] = true;
                var member = new List<int>();
                var queue = new Queue<int>();
                queue.Enqueue(i);
                long sumMin = 0;
                while (queue.Count > 0) {
                    int idx = queue.Dequeue();
                    member.Add(idx);
                    int cx = idx % w, cy = idx / w;
                    sumMin += MinCh(px, cy * stride + cx * 4);
                    for (int d = 0; d < 4; d++) {
                        int nx = cx + dx[d], ny = cy + dy[d];
                        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
                        int ni = ny * w + nx;
                        if (visited[ni]) continue;
                        int np = ny * stride + nx * 4;
                        if (px[np + 3] == 0) continue;
                        if (!(MinCh(px, np) > 170 && Chroma(px, np) < 50)) continue;
                        visited[ni] = true;
                        queue.Enqueue(ni);
                    }
                }
                if (member.Count >= minSize && (sumMin / member.Count) >= minAvg) {
                    foreach (int idx in member) {
                        int cp = (idx / w) * stride + (idx % w) * 4;
                        px[cp] = 0; px[cp + 1] = 0; px[cp + 2] = 0; px[cp + 3] = 0;
                    }
                    Console.WriteLine("removed white comp size=" + member.Count +
                                      " avgMin=" + (sumMin / member.Count));
                }
            }
        }

        Defringe(px, w, h, stride, 1);
        Save(px, w, h, stride, outPath);
    }
}
"@ -ReferencedAssemblies System.Drawing

function Rebuild-Svg([string]$png, [string]$svg) {
    $bytes = [System.IO.File]::ReadAllBytes($png)
    $b64 = [Convert]::ToBase64String($bytes)
    $content = @"
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 1024 1024" width="1024" height="1024">
  <image href="data:image/png;base64,$b64" width="1024" height="1024"/>
</svg>
"@
    [System.IO.File]::WriteAllText($svg, $content, [System.Text.Encoding]::UTF8)
    Write-Host "rebuilt $svg"
}

$s = Join-Path $Root "scripts"
$c = Join-Path $Root "public\images\characters"

[ArtifactCleaner]::RemoveFootShadow("$s\tmp_class_marauder.png", "$s\out_class_marauder.png")
[ArtifactCleaner]::RemoveEnclosedWhite("$s\tmp_class_assassin.png", "$s\out_class_assassin.png", 800, 240)
[ArtifactCleaner]::RemoveEnclosedWhite("$s\tmp_class_inquisitor.png", "$s\out_class_inquisitor.png", 400, 240)

Rebuild-Svg "$s\out_class_marauder.png"   "$c\class_marauder.svg"
Rebuild-Svg "$s\out_class_assassin.png"   "$c\class_assassin.svg"
Rebuild-Svg "$s\out_class_inquisitor.png" "$c\class_inquisitor.svg"
