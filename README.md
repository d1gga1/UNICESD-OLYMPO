# UNICESD Olympo — sito web

Sito istituzionale di **UNICESD Olympo — Universitas Centro Studi Olympo** (Palermo).
Pagina singola statica, senza framework e senza build di produzione: HTML, CSS e JavaScript scritti a mano.

**Online:** https://unicesd-olympo.com

## Struttura

| Percorso | Cosa contiene |
|---|---|
| `index.html` | La pagina pubblica. **File generato**: non modificarlo a mano, si rigenera. |
| `assets/` | Immagini, loghi e video usati dal sito. |
| `assets/ai/` | Sfondi delle card e video (hero, globo, piattaforma). |
| `assets/partner/` | Loghi delle realtà della rete. |
| `assets/eventi/` | Locandine degli eventi. |
| `sorgenti/content.html` | `<title>` e tutto il CSS: palette, animazioni, responsive. |
| `sorgenti/body.html` | Il markup: header, sezioni, footer, modali. |
| `sorgenti/script.html` | Il JavaScript: animazioni, menu, tab, form, popup, testi dei modali. |
| `sorgenti/build.py` | Ricompone i tre pezzi in `index.html` e sostituisce i segnaposto delle immagini. |
| `CNAME` | Il dominio collegato a GitHub Pages. |
| `.nojekyll` | Dice a GitHub Pages di servire i file così come sono, senza passare da Jekyll. |

## Come modificare il sito

1. Lavora sui file in `sorgenti/` (mai su `index.html`).
2. Rigenera la pagina:

   ```bash
   python3 sorgenti/build.py
   ```

3. Commit e push: GitHub Pages pubblica in un paio di minuti.

Le immagini nel markup sono segnaposto tipo `__IMG_LOGO__`, mappati su file di `assets/`
nei dizionari `IMAGES` e `AI_ASSETS` in cima a `build.py`. Per aggiungere un'immagine:
mettila in `assets/`, aggiungi la riga al dizionario, usa il segnaposto nel markup, rilancia il build.
Se un segnaposto resta senza corrispondenza il build si ferma con un errore invece di pubblicare una pagina rotta.

## Contenuti della pagina

Topbar e header sticky con mega-menu · hero con globo terrestre animato · marquee dei partner ·
numeri istituzionali con contatori · offerta formativa a tab (lauree, master, certificazioni, corsi singoli) ·
Master «Made in Italy Global Leadership» · perché sceglierci · chi siamo e dati camerali · timeline 2015→2026 ·
il fondatore Calogero Di Carlo · interventi e rassegna stampa con modali · la piattaforma e-learning ·
servizi agli studenti · eventi · mappa interattiva del Gruppo Olympo CDC · rete e partnership filtrabili ·
sedi · apri una sede (E-Learning Center Point) · FAQ · form di iscrizione · footer con dati societari.

## Pubblicazione

GitHub Pages serve il contenuto della radice del branch `main`.
Il dominio è impostato dal file `CNAME`; nel DNS del dominio servono i record indicati
in *Settings → Pages* del repository.

## Anteprima in locale

```bash
python3 -m http.server 8000
```

poi apri http://localhost:8000. Aprire `index.html` con un doppio clic funziona quasi del tutto,
ma alcuni browser bloccano il caricamento dei video da `file://`.
