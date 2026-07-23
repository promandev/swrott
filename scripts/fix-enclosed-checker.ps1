# One-off pass 2: remove ENCLOSED checkerboard remnants from an already
# background-stripped PNG, then re-embed it into the target SVG.
# A remnant is a connected light region that mixes near-white AND pale-gray
# pixels (the checker signature); uniform whites (gloves, blade cores) survive.

param(
    [string]$PngPath = "$env:TEMP\class_assassin.png",
    [string]$SvgPath = "D:\Developement\SWROTT\public\images\characters\class_assassin.svg"
)

Add-Type -AssemblyName System.Drawing

Add-Type @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class EnclosedChecker {
    static bool IsCandidate(byte b, byte g, byte r) {
        int min = Math.Min(b, Math.Min(g, r));
        int max = Math.Max(b, Math.Max(g, r));
        // Low floor (140) so the checker's darker gray squares join the same
        // component as its white squares — otherwise the region fragments
        // into tiny per-square components below the area threshold.
        return min > 140 && (max - min) < 40;
    }

    public static Bitmap Clean(string path) {
        Bitmap src;
        using (var tmp = new Bitmap(path)) {
            src = new Bitmap(tmp.Width, tmp.Height, PixelFormat.Format32bppArgb);
            using (var gfx = Graphics.FromImage(src))
                gfx.DrawImage(tmp, 0, 0, tmp.Width, tmp.Height);
        }
        int w = src.Width, h = src.Height;
        var data = src.LockBits(new Rectangle(0, 0, w, h),
                                ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
        int stride = data.Stride;
        byte[] px = new byte[stride * h];
        Marshal.Copy(data.Scan0, px, 0, px.Length);

        int[] label = new int[w * h]; // 0 = unvisited
        int next = 0;
        int[] dx = { 1, -1, 0, 0 };
        int[] dy = { 0, 0, 1, -1 };

        for (int y = 0; y < h; y++) {
            for (int x = 0; x < w; x++) {
                int i = y * w + x;
                if (label[i] != 0) continue;
                int p = y * stride + x * 4;
                if (px[p + 3] == 0 || !IsCandidate(px[p], px[p + 1], px[p + 2])) continue;

                // BFS this candidate component
                next++;
                var member = new List<int>();
                var queue = new Queue<int>();
                label[i] = next; queue.Enqueue(i);
                int whites = 0, grays = 0;
                while (queue.Count > 0) {
                    int idx = queue.Dequeue();
                    member.Add(idx);
                    int cx = idx % w, cy = idx / w;
                    int cp = cy * stride + cx * 4;
                    int min = Math.Min(px[cp], Math.Min(px[cp + 1], px[cp + 2]));
                    if (min > 238) whites++; else if (min < 228) grays++;
                    for (int d = 0; d < 4; d++) {
                        int nx = cx + dx[d], ny = cy + dy[d];
                        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
                        int ni = ny * w + nx;
                        if (label[ni] != 0) continue;
                        int np = ny * stride + nx * 4;
                        if (px[np + 3] == 0 || !IsCandidate(px[np], px[np + 1], px[np + 2])) continue;
                        label[ni] = next;
                        queue.Enqueue(ni);
                    }
                }

                // Checker signature: sizable region mixing whites and grays
                double total = member.Count;
                bool isChecker = total > 1500 && whites / total > 0.10 && grays / total > 0.10;
                if (isChecker) {
                    foreach (int idx in member) {
                        int cp = (idx / w) * stride + (idx % w) * 4;
                        px[cp] = 0; px[cp + 1] = 0; px[cp + 2] = 0; px[cp + 3] = 0;
                    }
                }
            }
        }

        Marshal.Copy(px, 0, data.Scan0, px.Length);
        src.UnlockBits(data);
        return src;
    }
}
"@ -ReferencedAssemblies System.Drawing

$bmp = [EnclosedChecker]::Clean($PngPath)
$w = $bmp.Width; $h = $bmp.Height
$ms = [System.IO.MemoryStream]::new()
$bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$b64 = [Convert]::ToBase64String($ms.ToArray())
$ms.Dispose()

$svg = @"
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 $w $h" width="$w" height="$h">
  <image href="data:image/png;base64,$b64" width="$w" height="$h"/>
</svg>
"@
[System.IO.File]::WriteAllText($SvgPath, $svg, [System.Text.Encoding]::UTF8)
Write-Host "OK  $SvgPath rebuilt ($w x $h)" -ForegroundColor Green
