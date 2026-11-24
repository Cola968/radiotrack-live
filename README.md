# RadioTrack 2.0 — Entdecken. Hören. Verstehen.

Responsives Dashboard für reale laut.fm-Sender mit Suchfunktion, Play/Pause-Audioplayer, Live-Songmetadaten, momentanen Stream-Verbindungen, persönlicher Merkliste, lokal erfassten Songstarts, Diagrammen und Datenexport.

Die neue Oberfläche orientiert sich konzeptionell an der Sendersuche/Player-Bedienung von radio.net, der Playlisthistorie von Online Radio Box und den Auswertungen von WARM. Sie kopiert keine fremden Marken, Designs oder Datenbanken. Die 100 durchgeführten Änderungen sind in [CHANGELOG_100.md](CHANGELOG_100.md) einzeln dokumentiert.

## Datenquellen & Grenzen

- **laut.fm API**: `/station/{name}`, `/current_song`, `/last_songs`, `/listeners` und `/search/stations?query=...`.
- **Live-Hörer**: aktuell veröffentlichte gleichzeitige Stream-Verbindungen, nicht MA-Reichweite, keine UKW- oder DAB+-Zahl.
- **Airplay-Zählung**: nur tatsächlich durch das Gerät erfasste Songstarts mit Zeitstempel. Die laut.fm-API liefert lediglich einen kurzen letzten Verlauf. **Ohne dauerhaft laufenden Server ist 24/7-Gesamtabdeckung nicht möglich.** 7- und 30-Tage-Zahlen beziehen sich ausschließlich auf gespeicherte Beobachtungen.
- **Privatsphäre**: Favoriten, Einstellungen und Beobachtungen werden lokal im Browser gespeichert. Der Browser fragt den offiziellen Radioanbieter ab.
- **Abhängigkeiten**: Streams und externe Daten können ausfallen; die App signalisiert das und erfindet keine Werte.
- **PWA**: App-Rahmen kann offline zwischengespeichert werden, aber keine Live-Daten und kein Livestream ohne Netz.

## Projekt

Technisch: Vanilla JavaScript (ES Modules), CSS, HTML, keine externen npm-Laufzeitabhängigkeiten. Geeignet für statisches Hosting.

```
python3 -m http.server 8080
npm test
```

`node --test tests/*.test.js` testet Daten-Normalisierung, Suchergebnisse, Song-Entdoppelung, Zeitfilter, CSV-Sicherheit, Backups und Vergleichslogik. Für Webserver-Test ist ein echter Browser mit Internetzugriff erforderlich.

## Update 2.1

Neuer Song-Radar, senderübergreifende Suche in lokal gespeicherten Ausstrahlungen, zwei Radiosender live vergleichen, Hörersnapshots und transparenter Erfassungsumfang. Siehe [CHANGELOG_21.md](CHANGELOG_21.md).
