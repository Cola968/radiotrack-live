# RadioTrack 2.1 – Änderungen und technische Grenzen

Veröffentlicht nach bestandenen Unit- und Browser-Tests.

## Neue Funktionen

- **Song-Radar:** Neues Ziel in Desktop- und Mobilnavigation. Sucht Künstler/Titel in allen vom eigenen Browser beobachteten Sendern, sortiert nach den tatsächlich erfassten Ausstrahlungen und zeigt pro Song Stationen und Spins.
- **Live-Vergleich:** Zwei selbst gewählte laut.fm-Sender nebeneinander: aktueller Song, Künstler, gleichzeitige Stream-Verbindungen, Weiterleitung zum Sender und direktes Anhören. Live-Vergleich wird auf Knopfdruck aktualisiert; fehlende Metadaten werden nicht erfunden.
- **Hörertrend:** Für den aktiven Sender werden lokale, zeitgestempelte Hörer-Momentaufnahmen angezeigt (Minimum, Maximum, arithmetischer Durchschnitt der Snapshots). Kein Quoten-, Reichweiten- oder Tageshörerwert.
- **Datengüte:** Anzahl der erfassten Songstarts, Stunden mit mindestens einem erfassten Start sowie erster und letzter Zeitstempel. Diese Werte belegen ausdrücklich **keine lückenlose Überwachung**.
- **Heute / 7 / 30 Tage:** Zeitraumfilter auch im Radar; bei wenigen Daten keine Scheingenauigkeit.
- **Mobile Player:** Der Sleep-Timer ist jetzt auch bei schmalen Bildschirmen direkt erreichbar.
- **Datenkorrektur:** Derselbe Song zur selben Sekunde auf zwei verschiedenen Sendern zählt korrekt als zwei Ausstrahlungen. CSV-Export behält diese beiden Zeilen bei.
- **UI & Barrierefreiheit:** Neue Radar-Karten, Stationsauswahl, adaptive Live-Vergleichsliste und mobil eine eigene Radar-Navigation.
- **Aktualisierung:** PWA-Cache-Version erhöht, damit ältere App-Versionen nach Aktualisierung nicht dauerhaft liegen bleiben.

## Nicht enthalten

- Kein zentraler Server, der alle Sender rund um die Uhr aufzeichnet. Der Radar zeigt ausdrücklich nur die in diesem Browser erfassten Titel.
- Kein landesweiter Hörerwert für UKW/DAB+ oder Live-Hörerschaft großer Privatsender. Die Werte sind vom Anbieter gelieferte Momentaufnahmen der **Internetradio-Streams**.
- Kein Versprechen, dass jeder von laut.fm gelistete Radiostream in jedem Browser funktioniert; Sender bestimmen die Verfügbarkeit.

## Nachweise

`npm test` – 23 Tests; zusätzlich Browser-Smoke mit simulierten laut.fm-API-Antworten im Desktop- und 390px-Android-Viewport, inklusive Navigation, API-Verarbeitung, Vergleich, Favoriten, mobiler Timer und Overflow-Prüfung. Ein zusätzlicher Live-End-to-End-Test nach Deployment ist erforderlich.
