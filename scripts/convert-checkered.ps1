# ═══════════════════════════════════════════════════════════════════════════
#  SWROTT — Checkered-background converter (one-off variant)
#  scripts/convert-checkered.ps1
#
#  Like convert-characters.ps1, but removes a CHECKERED (white + light gray)
#  background via flood-fill from the image borders instead of a global
#  color-distance pass. Interior whites (gloves, faces, saber cores) survive
#  because they are not connected to the border background.
# ═══════════════════════════════════════════════════════════════════════════

$DIR = "D:\Developement\SWROTT\public\images\characters"

$RENAME_MAP = [ordered]@{
    "class_assassin.jpg"   = "class_assassin"
    "class_inquisitor.jpg" = "class_inquisitor"
}

Add-Type -AssemblyName System.Drawing

Add-Type @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class CheckerRemover {
    // A pixel can be background if it is light and near-gray (white or the
    // pale gray of the transparency checkerboard).
    static bool IsCandidate(byte b, byte g, byte r) {
        int min = Math.Min(b, Math.Min(g, r));
        int max = Math.Max(b, Math.Max(g, r));
        return min > 185 && (max - min) < 32;
    }

    public static Bitmap RemoveBackground(string path) {
        Bitmap src;
        using (var tmp = new Bitmap(path)) {
            src = new Bitmap(tmp.Width, tmp.Height, PixelFormat.Format32bppArgb);
            using (var gfx = Graphics.FromImage(src))
                gfx.DrawImage(tmp, 0, 0, tmp.Width, tmp.Height);
        }
        int w = src.Width, h = src.Height;
        var data = src.LockBits(new Rectangle(0, 0, w, h),
                                ImageLockMode.ReadWrite,
                                PixelFormat.Format32bppArgb);
        int stride = data.Stride;
        byte[] px = new byte[stride * h];
        Marshal.Copy(data.Scan0, px, 0, px.Length);

        bool[] kill = new bool[w * h];
        var queue = new Queue<int>();

        // Seed the flood fill with every border pixel that looks like background
        for (int x = 0; x < w; x++) { Seed(px, stride, kill, queue, x, 0, w); Seed(px, stride, kill, queue, x, h - 1, w); }
        for (int y = 0; y < h; y++) { Seed(px, stride, kill, queue, 0, y, w); Seed(px, stride, kill, queue, w - 1, y, w); }

        int[] dx = { 1, -1, 0, 0 };
        int[] dy = { 0, 0, 1, -1 };
        while (queue.Count > 0) {
            int idx = queue.Dequeue();
            int cx = idx % w, cy = idx / w;
            for (int d = 0; d < 4; d++) {
                int nx = cx + dx[d], ny = cy + dy[d];
                if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
                int ni = ny * w + nx;
                if (kill[ni]) continue;
                int p = ny * stride + nx * 4;
                if (IsCandidate(px[p], px[p + 1], px[p + 2])) {
                    kill[ni] = true;
                    queue.Enqueue(ni);
                }
            }
        }

        // One erosion pass: clear light halo pixels touching removed background
        bool[] halo = new bool[w * h];
        for (int y = 0; y < h; y++) {
            for (int x = 0; x < w; x++) {
                int i = y * w + x;
                if (kill[i]) continue;
                int p = y * stride + x * 4;
                int min = Math.Min(px[p], Math.Min(px[p + 1], px[p + 2]));
                if (min <= 165) continue; // only near-light pixels can be halo
                for (int d = 0; d < 4; d++) {
                    int nx = x + dx[d], ny = y + dy[d];
                    if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
                    if (kill[ny * w + nx]) { halo[i] = true; break; }
                }
            }
        }

        for (int y = 0; y < h; y++) {
            for (int x = 0; x < w; x++) {
                int i = y * w + x;
                if (!kill[i] && !halo[i]) continue;
                int p = y * stride + x * 4;
                px[p] = 0; px[p + 1] = 0; px[p + 2] = 0; px[p + 3] = 0;
            }
        }

        Marshal.Copy(px, 0, data.Scan0, px.Length);
        src.UnlockBits(data);
        return src;
    }

    static void Seed(byte[] px, int stride, bool[] kill, Queue<int> queue, int x, int y, int w) {
        int i = y * w + x;
        if (kill[i]) return;
        int p = y * stride + x * 4;
        if (IsCandidate(px[p], px[p + 1], px[p + 2])) {
            kill[i] = true;
            queue.Enqueue(i);
        }
    }
}
"@ -ReferencedAssemblies System.Drawing

foreach ($entry in $RENAME_MAP.GetEnumerator()) {
    $srcPath  = Join-Path $DIR $entry.Key
    $destPath = Join-Path $DIR "$($entry.Value).svg"

    if (-not (Test-Path $srcPath)) {
        Write-Host "SKIP (not found): $($entry.Key)" -ForegroundColor DarkYellow
        continue
    }

    try {
        $bmp = [CheckerRemover]::RemoveBackground($srcPath)
        $w = $bmp.Width
        $h = $bmp.Height

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
        [System.IO.File]::WriteAllText($destPath, $svg, [System.Text.Encoding]::UTF8)
        Remove-Item $srcPath -Force

        Write-Host "OK  $($entry.Key)  ->  $($entry.Value).svg  ($w x $h)" -ForegroundColor Green
    }
    catch {
        Write-Host "ERR $($entry.Key): $_" -ForegroundColor Red
    }
}

Write-Host "Done." -ForegroundColor Cyan
