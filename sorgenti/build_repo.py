#!/usr/bin/env python3
"""
Genera la versione per GitHub Pages: repo-github/index.html con le immagini
lasciate in assets/ (niente data URI, pagina leggera) e i sorgenti aggiornati.

Uso:  python3 build_repo.py
"""
import pathlib
import shutil
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))

HERE = pathlib.Path(__file__).resolve().parent
ROOT = HERE.parent
REPO = ROOT / "repo-github"

ns = {"__file__": str(HERE / "build.py")}
exec(HERE.joinpath("build.py").read_text(encoding="utf-8").split("MIMES = {")[0], ns)
IMAGES, AI_ASSETS = ns["IMAGES"], ns["AI_ASSETS"]


def main() -> None:
    head    = (HERE / "head.html").read_text(encoding="utf-8")
    content = (HERE / "content.html").read_text(encoding="utf-8")
    body    = (HERE / "body.html").read_text(encoding="utf-8")
    script  = (HERE / "script.html").read_text(encoding="utf-8")
    schema  = (HERE / "schema.html").read_text(encoding="utf-8")

    for token, rel in list(IMAGES.items()) + list(AI_ASSETS.items()):
        sub = rel.split("img/", 1)[1]
        src = HERE / rel
        dst = REPO / "assets" / sub
        if not src.exists():
            raise SystemExit(f"Immagine mancante: {src}")
        dst.parent.mkdir(parents=True, exist_ok=True)
        if not dst.exists() or dst.stat().st_mtime < src.stat().st_mtime:
            shutil.copy2(src, dst)
        path = "assets/" + sub
        head = head.replace(token, path)
        content = content.replace(token, path)
        body = body.replace(token, path)

    out = ('<!DOCTYPE html>\n<html lang="it">\n<head>\n'
           + head + content + schema
           + "</head>\n<body>\n" + body + script + "\n</body></html>\n")

    left = [t for t in ("__IMG_", "__BG_", "__GLOBE_", "__HERO_", "__PLAT_", "__PREMIO_", "__ICB_") if t in out]
    if left:
        raise SystemExit(f"Segnaposto non sostituiti: {left}")

    (REPO / "index.html").write_text(out, encoding="utf-8")

    for n in ("head.html", "content.html", "body.html", "script.html", "schema.html", "build.py", "build_repo.py",
              "build_pages.py", "pagine.py"):
        shutil.copy2(HERE / n, REPO / "sorgenti" / n)

    kb = (REPO / "index.html").stat().st_size / 1024
    print(f"Fatto: {REPO / 'index.html'}  ({kb:.0f} KB)")

    # pagine dedicate, sitemap, robots, llms.txt, icone (vedi build_pages.py)
    import build_pages
    build_pages.main()


if __name__ == "__main__":
    main()
