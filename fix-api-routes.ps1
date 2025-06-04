# PowerShell script to add dynamic exports to all API route files
$apiDir = "src\app\api"
$routeFiles = Get-ChildItem -Path $apiDir -Recurse -Name "route.ts" -File

foreach ($file in $routeFiles) {
    $fullPath = Join-Path $apiDir $file
    $content = Get-Content $fullPath -Raw
    
    # Check if the file already has the dynamic export
    if ($content -notmatch "export const dynamic") {
        # Add the exports at the beginning of the file
        $newContent = "export const dynamic = 'force-dynamic';`nexport const runtime = 'nodejs';`n`n" + $content
        Set-Content -Path $fullPath -Value $newContent
        Write-Host "Updated: $fullPath"
    } else {
        Write-Host "Already updated: $fullPath"
    }
}

Write-Host "All API route files have been updated!"