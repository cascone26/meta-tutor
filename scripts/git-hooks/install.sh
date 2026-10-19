#!/bin/bash
# Installs this repo's git hooks into .git/hooks/ — needed because git does
# NOT version-control .git/hooks/ itself, so a hook only existing there is
# invisible to any other checkout/machine/session. Confirmed live 2026-09:
# a pre-commit dup-blog-slug check existed only on one Mac's checkout, so
# every OTHER session adding blog posts never saw it, and duplicates kept
# re-accreting despite the check "existing." Run this once per checkout:
#   bash scripts/git-hooks/install.sh
cd "$(git rev-parse --show-toplevel)" || exit 1
cp scripts/git-hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
echo "Installed pre-commit hook from scripts/git-hooks/pre-commit"
