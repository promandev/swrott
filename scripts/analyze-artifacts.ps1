# Analysis pass: report connected near-white components (enclosed background
# remnants vs gloves/blades) and bottom-region gray pixels (foot shadow).
param([string]$PngPath)

Add-Type -AssemblyName System.Drawing
Add-Type @"
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

public static class Analyzer {
    public static void Run(string path) {
        Bitmap src;
        using (var tmp = new Bitmap(path)) {
            src = new Bitmap(tmp.Width, tmp.Height, PixelFormat.Format32bppArgb);
            using (var gfx = Graphics.FromImage(src))
                gfx.DrawImage(tmp, 0, 0, tmp.Width, tmp.Height);
        }
        int w = src.Width, h = src.Height;
        var data = src.LockBits(new Rectangle(0, 0, w, h),
                                ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
        int stride = data.Stride;
        byte[] px = new byte[stride * h];
        Marshal.Copy(data.Scan0, px, 0, px.Length);
        src.UnlockBits(data);
        src.Dispose();

        // --- Connected components of light low-chroma pixels ---
        bool[] visited = new bool[w * h];
        int[] dx = { 1, -1, 0, 0 };
        int[] dy = { 0, 0, 1, -1 };
        for (int y = 0; y < h; y++) {
            for (int x = 0; x < w; x++) {
                int i = y * w + x;
                if (visited[i]) continue;
                int p = y * stride + x * 4;
                byte a = px[p + 3];
                if (a == 0) continue;
                int min = Math.Min(px[p], Math.Min(px[p + 1], px[p + 2]));
                int max = Math.Max(px[p], Math.Max(px[p + 1], px[p + 2]));
                if (!(min > 170 && (max - min) < 50)) continue;

                visited[i] = true;
                var queue = new Queue<int>();
                queue.Enqueue(i);
                long count = 0, sumR = 0, sumG = 0, sumB = 0, sumA = 0;
                int minX = x, maxX = x, minY = y, maxY = y;
                while (queue.Count > 0) {
                    int idx = queue.Dequeue();
                    int cx = idx % w, cy = idx / w;
                    int cp = cy * stride + cx * 4;
                    count++;
                    sumB += px[cp]; sumG += px[cp + 1]; sumR += px[cp + 2]; sumA += px[cp + 3];
                    if (cx < minX) minX = cx; if (cx > maxX) maxX = cx;
                    if (cy < minY) minY = cy; if (cy > maxY) maxY = cy;
                    for (int d = 0; d < 4; d++) {
                        int nx = cx + dx[d], ny = cy + dy[d];
                        if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
                        int ni = ny * w + nx;
                        if (visited[ni]) continue;
                        int np = ny * stride + nx * 4;
                        if (px[np + 3] == 0) continue;
                        int nmin = Math.Min(px[np], Math.Min(px[np + 1], px[np + 2]));
                        int nmax = Math.Max(px[np], Math.Max(px[np + 1], px[np + 2]));
                        if (!(nmin > 170 && (nmax - nmin) < 50)) continue;
                        visited[ni] = true;
                        queue.Enqueue(ni);
                    }
                }
                if (count > 200) {
                    Console.WriteLine("LIGHT comp size=" + count +
                        " bbox=(" + minX + "," + minY + ")-(" + maxX + "," + maxY + ")" +
                        " avgRGBA=(" + (sumR / count) + "," + (sumG / count) + "," + (sumB / count) + "," + (sumA / count) + ")");
                }
            }
        }

        // --- Bottom 15%: gray-ish opaque pixels (potential shadow) ---
        long shCount = 0; long sr = 0, sg = 0, sb = 0, sa = 0;
        int sMinX = w, sMaxX = 0, sMinY = h, sMaxY = 0;
        for (int y = (int)(h * 0.82); y < h; y++) {
            for (int x = 0; x < w; x++) {
                int p = y * stride + x * 4;
                byte a = px[p + 3];
                if (a == 0) continue;
                int min = Math.Min(px[p], Math.Min(px[p + 1], px[p + 2]));
                int max = Math.Max(px[p], Math.Max(px[p + 1], px[p + 2]));
                if (min > 90 && min < 230 && (max - min) < 25) {
                    shCount++;
                    sb += px[p]; sg += px[p + 1]; sr += px[p + 2]; sa += a;
                    if (x < sMinX) sMinX = x; if (x > sMaxX) sMaxX = x;
                    if (y < sMinY) sMinY = y; if (y > sMaxY) sMaxY = y;
                }
            }
        }
        if (shCount > 0)
            Console.WriteLine("SHADOW-ZONE grayish: count=" + shCount +
                " bbox=(" + sMinX + "," + sMinY + ")-(" + sMaxX + "," + sMaxY + ")" +
                " avgRGBA=(" + (sr / shCount) + "," + (sg / shCount) + "," + (sb / shCount) + "," + (sa / shCount) + ")");

        // Alpha histogram of bottom zone semi-transparent pixels
        long semi = 0;
        for (int y = (int)(h * 0.82); y < h; y++) {
            for (int x = 0; x < w; x++) {
                int p = y * stride + x * 4;
                if (px[p + 3] > 0 && px[p + 3] < 255) semi++;
            }
        }
        Console.WriteLine("SHADOW-ZONE semi-transparent px: " + semi);
    }
}
"@ -ReferencedAssemblies System.Drawing

[Analyzer]::Run($PngPath)
