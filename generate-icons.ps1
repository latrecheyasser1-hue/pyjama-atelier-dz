Add-Type -AssemblyName System.Drawing

function Resize-Square ($srcPath, $destPath, $size, $bgWhite) {
    $src = [System.Drawing.Image]::FromFile($srcPath)
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    
    if ($bgWhite) {
        $g.Clear([System.Drawing.Color]::White)
    } else {
        $g.Clear([System.Drawing.Color]::Transparent)
    }
    
    $pad = [int]($size * 0.12)
    $maxW = $size - ($pad * 2)
    $maxH = $size - ($pad * 2)
    $ratio = [Math]::Min($maxW / $src.Width, $maxH / $src.Height)
    $newW = [int]($src.Width * $ratio)
    $newH = [int]($src.Height * $ratio)
    $posX = [int](($size - $newW) / 2)
    $posY = [int](($size - $newH) / 2)
    
    $g.DrawImage($src, $posX, $posY, $newW, $newH)
    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    $src.Dispose()
    Write-Host "Generated $destPath ($size x $size)"
}

$srcFile = "$PSScriptRoot\public\logo.png"
Resize-Square $srcFile "$PSScriptRoot\public\pwa-512x512.png" 512 $false
Resize-Square $srcFile "$PSScriptRoot\public\pwa-192x192.png" 192 $false
Resize-Square $srcFile "$PSScriptRoot\public\pwa-64x64.png" 64 $false
Resize-Square $srcFile "$PSScriptRoot\public\pwa-maskable-512x512.png" 512 $true
