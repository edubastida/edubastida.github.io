# Publicar el porfolio en GitHub Pages

La dirección de esta web será https://edubastida.github.io/.

## Primera publicación

1. Abre https://github.com/edubastida/edubastida.github.io/settings/pages.
2. En **Build and deployment → Source**, selecciona **GitHub Actions**.
3. Sube los cambios de este proyecto a la rama **master**. En GitHub Desktop, selecciona este repositorio, escribe un resumen, pulsa **Commit to master** y después **Push origin** (o **Publish repository**, si aún no está publicado; usa el nombre `edubastida.github.io`).
4. Abre https://github.com/edubastida/edubastida.github.io/actions y entra en **Deploy to GitHub Pages**. Si GitHub pide habilitar los workflows, habilítalos y pulsa **Run workflow → master → Run workflow**.
5. Espera a que **build** y **deploy** terminen en verde. Abre https://edubastida.github.io/; la primera publicación puede tardar unos minutos.

Si prefieres la terminal, desde la carpeta del proyecto:

```sh
git add .github/workflows/deploy.yml .gitignore astro.config.mjs src/data/personal.json src/pages/privacy.astro src/pages/terms.astro pnpm-lock.yaml PUBLICAR.md
git commit -m "Fix GitHub Pages deployment"
git push -u origin master
```

No necesitas crear un token ni añadir secretos: GitHub proporciona `GITHUB_TOKEN` automáticamente. No hace falta ejecutar **Update Dependencies** para publicar. El workflow instala las versiones del archivo de dependencias, genera `dist` y lo publica. En GitHub Free, utiliza un repositorio público para GitHub Pages.

## Actualizaciones

Edita el contenido, guarda, haz commit y pulsa **Push origin**. Cada subida a `master` vuelve a publicar la web. Si cambias el nombre de la rama, actualiza `branches: [master]` en `.github/workflows/deploy.yml`.

## Personalizar la plantilla

La plantilla todavía contiene datos de ejemplo. Antes de compartirla como tu porfolio, sustituye:

- `src/data/personal.json`: nombre, profesión, biografía, correo, teléfono y redes.
- `src/data/site.json`: título, descripción y enlaces del pie.
- Los demás archivos de `src/data/`: proyectos, experiencia, formación y habilidades.
- `public/images/personal/portrait.png`: tu fotografía.

El formulario de contacto necesita una clave válida de Web3Forms en `web3formsKey`, dentro de `src/data/site.json`. El valor de ejemplo no envía mensajes. Esto es independiente de la publicación de la web.

## Si algo falla

- **Configure GitHub Pages** falla: comprueba que Pages esté habilitado y que **Source** sea **GitHub Actions**.
- No aparece ninguna ejecución: comprueba que has subido los cambios a `master` y que Actions está habilitado. También puedes usar **Run workflow**.
- **build** falla: abre el paso rojo y consulta el error. No ejecutes una actualización masiva de dependencias para intentar arreglarlo.
- **deploy** queda bloqueado por el entorno: en **Settings → Environments → github-pages**, comprueba que las reglas de despliegue permitan `master`.
- Sigue apareciendo la página anterior: confirma que el último despliegue está verde y recarga con `Ctrl + F5`.

Referencia oficial: https://docs.astro.build/en/guides/deploy/github/
