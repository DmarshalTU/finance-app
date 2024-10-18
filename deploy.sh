#!/bin/bash

echo "Preparing for Git commit and push..."

# Check for .env.local
if [ -f .env.local ]; then
    echo "Warning: .env.local file detected. Ensure it's in .gitignore and not staged for commit."
    if git check-ignore .env.local > /dev/null 2>&1; then
        echo ".env.local is correctly ignored by Git."
    else
        echo "Error: .env.local is not ignored by Git. Add it to .gitignore immediately."
        exit 1
    fi
fi

# Check for any files containing potential sensitive information
sensitive_files=$(grep -r -i -E "api_key|secret|password|token" --exclude-dir=node_modules --exclude-dir=.next --exclude=deploy.sh --exclude=deploy.ps1 .)

if [ ! -z "$sensitive_files" ]; then
    echo "Warning: Potential sensitive information found in the following files:"
    echo "$sensitive_files"
    echo "Please review these files and ensure no actual sensitive data is being committed."
    read -p "Do you want to continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]
    then
        echo "Operation cancelled."
        exit 1
    fi
fi

# Git operations
echo "Proceeding with Git operations..."

# Add all changes
git add .

# Show staged changes
echo "The following changes will be committed:"
git diff --cached --name-status

# Prompt for commit message
read -p "Enter commit message: " commit_message

# Commit changes
git commit -m "$commit_message"

# Push to remote
read -p "Push to remote? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    git push
    echo "Changes pushed to remote repository."
else
    echo "Changes committed locally but not pushed."
fi

echo "Operation complete!"