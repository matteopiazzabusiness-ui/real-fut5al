# Real Fut5al

Sito statico di presentazione del Real Fut5al, con home, squadra, calendario,
risultati, palmarès, news, contatti, scheda giocatore e galleria fotografica.

Sito pubblico: https://real-fut5al-presentazione.netlify.app/

## Anteprima locale

```sh
python -m http.server 8765
```

Aprire `http://localhost:8765/`.

## Pubblicazione

I file sorgente sono le pagine HTML nella radice e la cartella `assets/`.
Per aggiornare la cartella `out/` pronta per la pubblicazione:

```sh
python scripts/prepare_publish.py
```

Caricare il contenuto di `out/` nel progetto Netlify esistente.
La cartella `public/` è una copia storica: usare `out/` per gli aggiornamenti.

Alcune sezioni sportive e il modulo contatti sono dimostrativi.
Le immagini e i marchi appartengono ai rispettivi titolari.
