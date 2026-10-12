param([string]$ArchiveName = 'beauty-me-admin-source.zip')
$ErrorActionPreference = 'Stop'
if ($ArchiveName -notmatch '^[a-z0-9-]+\.zip$') { throw 'Use a simple ZIP filename.' }
$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$archivePath = Join-Path $projectRoot $ArchiveName
$sourceDirs = @('src', 'public', 'scripts', 'tests', 'supabase', 'netlify')
$sourceFiles = @('package.json', 'package-lock.json', 'astro.config.mjs', 'netlify.toml', 'tsconfig.json', '.gitignore', '.env.example', 'README.md', 'ADMIN_SETUP.md', 'ADMIN_IMPLEMENTATION.md', 'ADMIN_PANEL_PLAN.md', 'ADMIN_MOBILE_POLISH_PLAN.md', 'ADMIN_MOBILE_QA.md', 'media-inbox/selection.json', 'PUBLIC_MOBILE_AUDIT_AND_PLAN.md', 'PUBLIC_MOBILE_QA.md', 'test-results/public-mobile-baseline.json', 'test-results/public-mobile-verification.json', 'DEPLOYMENT.json', 'NETLIFY_DEMO_DEPLOYMENT.md', 'test-results/live-mobile-deployment.json', 'test-results/live-mobile-browser.json', 'test-results/live-admin-demo.json', 'ADMIN_DEMO_QA.md')
$entries = [System.Collections.Generic.List[System.IO.FileInfo]]::new()
foreach ($relativeDir in $sourceDirs) {
    $directoryPath = Join-Path $projectRoot $relativeDir
    foreach ($entry in Get-ChildItem -LiteralPath $directoryPath -Recurse -File) {
        $entries.Add($entry)
    }
}
foreach ($relativeFile in $sourceFiles) {
    $entries.Add((Get-Item -LiteralPath (Join-Path $projectRoot $relativeFile)))
}
Add-Type -AssemblyName System.IO.Compression
$stream = [System.IO.File]::Open($archivePath, [System.IO.FileMode]::Create)
$archive = [System.IO.Compression.ZipArchive]::new($stream, [System.IO.Compression.ZipArchiveMode]::Create)
try {
    foreach ($entry in $entries) {
        if (-not $entry.FullName.StartsWith($projectRoot + '\', [System.StringComparison]::OrdinalIgnoreCase)) {
            throw 'An archive entry is outside the project directory.'
        }
        $relative = $entry.FullName.Substring($projectRoot.Length + 1).Replace('\', '/')
        if ($relative -match '(^|/)(\.local-admin|\.env|LOCAL_ADMIN_ACCESS\.md|node_modules|\.npm-cache)(/|$)') {
            throw 'A private file was selected for packaging.'
        }
        $zipEntry = $archive.CreateEntry($relative, [System.IO.Compression.CompressionLevel]::Optimal)
        $sourceStream = $entry.OpenRead()
        $targetStream = $zipEntry.Open()
        try { $sourceStream.CopyTo($targetStream) }
        finally { $targetStream.Dispose(); $sourceStream.Dispose() }
    }
} finally { $archive.Dispose(); $stream.Dispose() }
Write-Output "Source package created: $($entries.Count) files. Credentials, customer data, node_modules and build output excluded."
