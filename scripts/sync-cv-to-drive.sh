#!/usr/bin/env bash
# Mirrors the built CVs into the shared Google Drive folder, replacing the existing
# files in place so their Drive file IDs and share links stay valid.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REMOTE="${CV_DRIVE_REMOTE:-gdrive}"
FOLDER_ID="${CV_DRIVE_FOLDER_ID:-1lGxjBGMk8ZqD6-j7jgT0FltmljYH-EXg}"
FILES=(Rifat_Bin_Siraj_CV.pdf Rifat_Bin_Siraj_CV_ATS.pdf)

if ! command -v rclone >/dev/null 2>&1; then
  echo "sync-cv-to-drive: rclone not installed, skipping Drive upload." >&2
  echo "sync-cv-to-drive: see the CV deployment section of README.md to set it up." >&2
  exit 0
fi

if ! rclone listremotes | grep -qx "${REMOTE}:"; then
  echo "sync-cv-to-drive: rclone remote '${REMOTE}' not configured, skipping Drive upload." >&2
  echo "sync-cv-to-drive: see the CV deployment section of README.md to set it up." >&2
  exit 0
fi

for name in "${FILES[@]}"; do
  if [[ ! -f "$ROOT/$name" ]]; then
    echo "sync-cv-to-drive: $name is missing, run cv/build.sh first." >&2
    exit 1
  fi
done

# --checksum compares content instead of timestamps, so a rebuild that produced an
# identical PDF uploads nothing.
for name in "${FILES[@]}"; do
  rclone copyto --checksum --drive-root-folder-id "$FOLDER_ID" \
    "$ROOT/$name" "${REMOTE}:${name}" --stats-one-line -v
done
