#!/usr/bin/env bash
# Rebuilds both CVs from cv/cv.html: the designed CV with a photo, and the plain ATS-friendly one.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"

python3 "$HERE/make_ats.py"
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="$HERE/../Rifat_Bin_Siraj_CV.pdf" "file://$HERE/cv.html"
"$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="$HERE/../Rifat_Bin_Siraj_CV_ATS.pdf" "file://$HERE/cv-ats.html"
