#!/bin/sh
# Builds the small 5-9 sphere thumbnails (public/personal/<hobby>/thumbs/N.jpg) from the
# full photos with macOS sips. Re-run after adding or replacing photos.
set -e
cd "$(dirname "$0")/../public/personal"
for photo in */*.jpg; do
  dir="$(dirname "$photo")/thumbs"
  mkdir -p "$dir"
  out="$dir/$(basename "$photo")"
  [ "$out" -nt "$photo" ] && continue
  sips -s format jpeg -s formatOptions low --resampleWidth 600 "$photo" --out "$out" >/dev/null
done
