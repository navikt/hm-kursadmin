# hm-kursadmin

Frontend for visning av hjelpemiddelformidlere med godkjent kurs for personløftere, senger eller elektriske rullestoler og registrering av praktisk del for elektriske rullestoler.

«Godkjenn del 2» åpner et skjema med vanlig registrering forhåndsvalgt. Velg «Gjenopprett fra kursbevis» for å verifisere tidligere gjennomføring med dato og verifikasjonskode fra kursbeviset. Gjenoppretting registrerer del 2 uten å sende et nytt kursbevis.

Koden er delt i to separate moduler:

- `server` – Go-backend
- `client` – React-frontend

## Kom i gang

### Forutsetninger

- Node ≥ 20
- pnpm (aktiveres med `corepack enable`)
- Go ≥ 1.25 (for serveren)

### Installere avhengigheter

Prosjektet bruker **pnpm**. Aktiver det med:

```bash
corepack enable
```

Installer avhengigheter:

```bash
cd client
pnpm install
```

## Kjøre lokalt med mockede data

1. `pnpm install` (for å installere `@navikt`-pakker må man logge inn mot npm.pkg.github.com med PAT første gang)

2. Start applikasjonen med `pnpm run dev`. Da brukes [Mock Service Worker](https://mswjs.io/) for å mocke API-endepunkter, slik at man ikke trenger å starte noen backend.
3. Gå til `localhost:5173`

# Gjenoppretting av kursbevis med mockdata
Klikk Godkjenn del 2, på Siri Marie Testbergm og velg «Gjenopprett fra kursbevis». 
Fyll inn kursbevisets dato og verifikasjonskode:
dato: `10.03.2025` 
verifiseringskode: `BBNU-BDXH-4QPF`. 

