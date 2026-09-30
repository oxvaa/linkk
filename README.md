# LINK PWA

Minimalistická česká ukázka aplikace LINK, připravená pro GitHub Pages a instalaci na iPhone jako PWA.

## Publikování přes GitHub Pages

1. Na GitHubu založte veřejný repozitář s názvem **link-pwa**.
2. Nahrajte obsah tohoto balíčku včetně složky `.github/workflows` a souboru `.nojekyll` do větve `main`.
3. V repozitáři otevřete **Settings → Pages** a jako zdroj zvolte **GitHub Actions**.
4. Otevřete kartu **Actions**. Po doběhnutí úlohy bude aplikace dostupná na `https://oxvaa.github.io/link-pwa/`.

Workflow nasazuje statický obsah při každém commitu do `main`. Pro GitHub Pages není potřeba build ani závislosti.

## Přidání na plochu iPhonu

Otevřete publikovanou adresu v Safari → **Sdílet** → **Přidat na plochu**. PWA má vlastní ikonu, režim standalone, safe-area odsazení pro iPhone a offline cache.

## Co ukázka obsahuje

- Zprávy, vyhledávání, poznámky, momenty a profil.
- Odeslání ukázkové zprávy a uložení konverzací lokálně v zařízení.
- Responzivní mobilní rozhraní, instalovatelné PWA a základní offline režim.

Zprávy se ukládají jen v prohlížeči daného zařízení. Tato preview verze nemá serverový backend ani synchronizaci mezi uživateli.
