# Create app directory structure
$directories = @(
    "src\app\(auth)",
    "src\app\admin\categories",
    "src\app\admin\products",
    "src\app\admin\dashboard",
    "src\app\api\auth\[...nextauth]",
    "src\components\ui",
    "src\components\layout",
    "src\components\menu",
    "src\components\admin",
    "src\lib\supabase",
    "src\types",
    "src\context",
    "src\hooks",
    "src\app\menu",
    "src\app\events",
    "src\app\about",
    "src\app\contact"
)

foreach ($dir in $directories) {
    $fullPath = Join-Path -Path $PSScriptRoot -ChildPath $dir
    if (-not (Test-Path -Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Host "Created directory: $dir"
    } else {
        Write-Host "Directory already exists: $dir"
    }
}

Write-Host "Directory structure created successfully!" -ForegroundColor Green
