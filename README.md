# Fake Store — Report vendite e clienti

Applicazione TypeScript che recupera prodotti, carrelli e utenti da Fake Store API e genera due report JSON:
- `report_prodotti.json`: top 3 prodotti per unità vendute;
- `report_clienti.json`: top 3 clienti per spesa totale.

I report vengono salvati nella cartella `output/` e stampati nella console.



## Definizione di «ultimo mese»

L'API fornisce dati di esempio potenzialmente storici; perciò «ultimo mese» è definito come i 30 giorni mobili che terminano alla data del carrello più recente con una data valida. Entrambi gli estremi sono inclusi. Data di ancoraggio e intervallo ISO 8601 sono esposti nei report.

## Ranking e casi particolari

- Prodotti: unità vendute in ordine decrescente; a parità, `product_id` crescente.
- Clienti: spesa totale in ordine decrescente; a parità, `user_id` crescente.
- Il conteggio ordini considera i carrelli con data valida inclusi nel periodo.
- Un prodotto presente nei carrelli ma assente dal catalogo viene mantenuto nel conteggio delle unità; titolo e categoria vengono segnalati come mancanti e prezzo/fatturato sono `null` perché non calcolabili senza prezzo di catalogo.
- Un utente presente nei carrelli ma assente dall'anagrafica resta nel report con i campi anagrafici impostati a `null`.
- Carrelli con data non valida vengono ignorati perché non possono essere assegnati a un periodo in modo affidabile. Quantità non valide o non positive vengono ignorate.
- Se non ci sono carrelli con date valide, l'intervallo è `null` e le classifiche del periodo `last_month` sono vuote.

## Struttura del progetto

```text
fake-store-sales-reports/
├── src/
│   ├── api.ts
│   ├── index.ts
│   ├── reports.ts
│   └── types.ts
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```
