Write-Host "Preparing for Git commit and push..." -ForegroundColor Cyan

# Check for .env.local
if (Test-Path .env.local) {
    Write-Host "Warning: .env.local file detected. Ensure it's in .gitignore and not staged for commit." -ForegroundColor Yellow
    $ignored = git check-ignore .env.local
    if ($ignored) {
        Write-Host ".env.local is correctly ignored by Git." -ForegroundColor Green
    } else {
        Write-Host "Error: .env.local is not ignored by Git. Add it to .gitignore immediately." -ForegroundColor Red
        exit
    }
}

# Check for any files containing potential sensitive information
$sensitiveFiles = Get-ChildItem -Recurse -Exclude node_modules,.next,deploy.sh,deploy.ps1 | Select-String -Pattern "api_key|secret|password|token" -CaseSensitive:$false

if ($sensitiveFiles) {
    Write-Host "Warning: Potential sensitive information found in the following files:" -ForegroundColor Red
    $sensitiveFiles | ForEach-Object { Write-Host $_.Path }
    Write-Host "Please review these files and ensure no actual sensitive data is being committed." -ForegroundColor Yellow
    
    $continue = Read-Host "Do you want to continue? (y/n)"
    if ($continue -ne "y") {
        Write-Host "Operation cancelled." -ForegroundColor Red
        exit
    }
}

# Git operations
Write-Host "Proceeding with Git operations..." -ForegroundColor Green

# Add all changes
git add .

# Show staged changes
Write-Host "The following changes will be committed:" -ForegroundColor Cyan
git diff --cached --name-status

# Prompt for commit message
$commitMessage = Read-Host "Enter commit message"

# Commit changes
git commit -m $commitMessage

# Push to remote
$push = Read-Host "Push to remote? (y/n)"
if ($push -eq "y") {
    git push
    Write-Host "Changes pushed to remote repository." -ForegroundColor Green
} else {
    Write-Host "Changes committed locally but not pushed." -ForegroundColor Yellow
}

Write-Host "Operation complete!" -ForegroundColor Green