#!/bin/sh
# Выкладка прототипа на GitHub Pages: исходники в main, сборка в gh-pages.
# Без токена git использует вход, сохранённый в связке ключей macOS.
# С токеном (GH_TOKEN=... ./deploy.sh) ещё и включает Pages через API.
set -e
REPO="${REPO:-dmitrysatin/zetta}"
cd "$(dirname "$0")"
npm run build
if [ -n "$GH_TOKEN" ]; then
  URL="https://x-access-token:${GH_TOKEN}@github.com/${REPO}.git"
else
  URL="https://github.com/${REPO}.git"
fi
git push "$URL" HEAD:main
TMP=$(mktemp -d)
cp -R dist/. "$TMP"
touch "$TMP/.nojekyll"
cd "$TMP"
git init -q -b gh-pages
git add -A
git -c user.name="UsabilityLab" -c user.email="d.satin@usabilitylab.net" commit -qm "Сборка прототипа $(date +%Y-%m-%d\ %H:%M)"
git push -f "$URL" gh-pages
cd - >/dev/null
rm -rf "$TMP"
[ -z "$GH_TOKEN" ] && { echo "Готово. Pages: Settings → Pages → ветка gh-pages"; exit 0; }
# Включить Pages из ветки gh-pages (если уже включено — просто вернёт 409)
curl -s -o /dev/null -w "pages: %{http_code}\n" -X POST -H "Authorization: Bearer ${GH_TOKEN}" \
  -H "Accept: application/vnd.github+json" "https://api.github.com/repos/${REPO}/pages" \
  -d '{"source":{"branch":"gh-pages","path":"/"}}'
curl -s -H "Authorization: Bearer ${GH_TOKEN}" "https://api.github.com/repos/${REPO}/pages" | grep -E '"html_url"|"status"' || true
