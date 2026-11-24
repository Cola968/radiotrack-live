# RadioTrack 2.0 — 100 konkrete Änderungen

Status: umgesetzt im statischen Web-Client. **100 Änderungen sind nicht 100 vollständige Produktmodule**: Hier sind Funktionen, Bedienungsdetails, Datenkorrekturen und UI-Verbesserungen getrennt aufgeführt. Es gibt weiterhin **keinen durchlaufenden Server-Sammler**. Ein Browser zählt nur vom Anbieter gemeldete und auf diesem Gerät beobachtete Ausstrahlungen. Live-Stream-Verbindungen sind keine repräsentative Hörerreichweite.

## UI & Zugänglichkeit
1. Neues dunkles Oberflächendesign mit konsistentem Farbsystem.
2. Eigenständiges helles Farbschema.
3. System-Farbschema als dritte Option.
4. Responsive Dashboard-Karten für große Bildschirme.
5. Mobile Navigation mit fünf festen Zielen.
6. Desktop-Seitenleiste mit vollständiger Hauptnavigation.
7. Dauerhaft sichtbarer Mini-Radioplayer am unteren Rand.
8. Kompakter Listenmodus als Einstellung.
9. Reduzierte Animationen als Einstellung.
10. Sichtbare Tastatur-Fokusmarkierungen für Bedienelemente.

## Live-Dashboard
11. Aktuell gespielter Song als Haupttitel.
12. Künstlerangabe des Live-Songs.
13. Klar erkennbarer Sendername im Hero-Bereich.
14. Angezeigte Startzeit eines Songs.
15. Laufend aktualisierte vergangene Spielzeit.
16. Titeldauer anhand der Anbieter-Metadaten.
17. Fortschrittsbalken, soweit Zeitstempel vorhanden.
18. Gleichzeitige laut.fm-Streamverbindungen im separaten Kartenbereich.
19. Verlaufsgrafik lokal beobachteter Hörer-Schnappschüsse.
20. Zeitpunkt der letzten erfolgreichen Metadaten-Aktualisierung.

## Sendersuche
21. Echte Abfrage der laut.fm-Sendersuche.
22. Suchbegriffe für Musikgenres.
23. Darstellung der realen Katalogsuchergebnisse.
24. Globale Suchdialog-Ansicht.
25. Tastaturkürzel `/` zum Öffnen der Suche.
26. Verzögerte Suche, um unnötige API-Anfragen zu vermeiden.
27. Suche auch per Enter-Taste ausführbar.
28. Zehn redaktionell vorausgewählte laut.fm-Sender zum Einstieg.
29. Genre-Chips und Genres auf den Senderkarten.
30. Alphabetische Sendersortierung auf- und absteigend.

## Navigation & Senderverwaltung
31. Eigene Dashboard-Ansicht.
32. Eigene Sender-Katalogansicht.
33. Eigene Airplay-Charts-Ansicht.
34. Eigene Insights-Ansicht.
35. Eigene Favoriten-Ansicht.
36. Zuletzt angesehene Sender als Liste.
37. Schnellwechsel über Sender in der Desktop-Seitenleiste.
38. Sender direkt aus Katalogkarte abspielen.
39. Sender aus Katalogkarte öffnen, ohne Wiedergabe zu erzwingen.
40. Sendersortierung: Favoriten zuerst.

## Audio-Wiedergabe
41. Play-Taste im Mini-Player und Dashboard.
42. Pausieren eines laufenden Audiostreams.
43. Bevorzugung der echten Stream-URL aus den Anbieterdaten.
44. Fallback auf das allgemeine HTTPS-Streamformat von laut.fm.
45. Regler für die Audiolautstärke.
46. Mute-Taste im Mini-Player.
47. Wiederherstellen des Tons beim Verändern der Lautstärke.
48. Sleep-Timer für fünf Minuten.
49. Sleep-Timer für 15, 30 oder 60 Minuten.
50. Explizite Fehlermeldungen, falls der Audiostream nicht abgespielt werden kann.

## Datenverlässlichkeit
51. Sendernamen werden vor API-Aufrufen geprüft.
52. Unbekannte Hörerzahlen werden als „–“ angezeigt und nicht erfunden.
53. Aktuelle Songs, letzte Songs, Senderinfos und Hörer werden parallel abgefragt.
54. Netzwerk-Timeouts begrenzen hängende Requests.
55. Frühere Requests werden bei Senderwechsel abgebrochen und ignoriert.
56. Teilausfälle werden getrennt von vollständigem Ausfall dargestellt.
57. Offline-Status löst einen verständlichen Hinweis aus.
58. Nach Internet-Wiederkehr werden Daten erneut abgefragt.
59. Automatisches Abrufen wird bei verstecktem Browserfenster vermieden.
60. Manuelles Aktualisieren ist über eine eigene Schaltfläche möglich.

## Airplay-Auswertung
61. Duplikate desselben Songstarts werden vermieden.
62. Sendergetrennte lokale Airplay-Speicherung.
63. Auswertungsfilter „Heute“.
64. Auswertungsfilter „7 Tage“.
65. Auswertungsfilter „30 Tage“.
66. Automatische Rangliste nach tatsächlich erfassten Spins.
67. Suche nach Interpreten in der Chartliste.
68. Suche nach Songtiteln in der Chartliste.
69. Zeitraumfilter auch auf den Ausstrahlungsverlauf anwendbar.
70. Gespielte Titel nach neuestem oder ältestem Zeitpunkt sortierbar.

## Insights & Statistiken
71. KPI für belegte Airplays.
72. KPI für unterschiedliche Songs.
73. KPI für unterschiedliche Interpreten.
74. Meistgespielter Song in der Statistikberechnung.
75. Siebentägige Verteilung als Balkendiagramm.
76. Stundenverteilung über 24 lokale Stunden als Balkendiagramm.
77. Ranking der häufigsten Interpreten.
78. Vergleich der Airplays mehrerer lokal beobachteter Sender.
79. Im Vergleich zeitpunktbezogene Stream-Hörerzahl, sofern gemessen.
80. Zeitberechnungen passend zur Zeitzone Europe/Berlin.

## Persönliche Sammlung
81. Sender zu Favoriten hinzufügen und wieder entfernen.
82. Favoriten dauerhaft im Browser speichern.
83. Herzsymbol auf der großen Live-Karte.
84. Herzsymbole auf Sender-Katalogkarten.
85. Song per Lesezeichen merken.
86. Eigene Merkliste für gespeicherte Songs.
87. Hinweise auf gemerkte Songs, wenn die App sie neu beobachtet.
88. Live-Song über System-Teilen oder Zwischenablage teilen.
89. Songs aus Listen in die Zwischenablage kopieren.
90. Zuletzt angesehene Sender über neue Sitzungen hinweg erhalten.

## Export, Datenschutz und Bereitstellung
91. CSV-Export der gefilterten Ausstrahlungen.
92. Formel-Injektionsschutz beim CSV-Export.
93. JSON-Backup aller lokal erfassten Songs und Favoriten.
94. JSON-Import von RadioTrack-Backups.
95. Dublettenabgleich beim Import.
96. Löschen persönlicher Daten erst nach ausdrücklicher Bestätigung.
97. Installierbares Web-App-Manifest inklusive RadioTrack-Icon.
98. Offline-Fallback für den bereits geladenen App-Rahmen (nicht für Live-Radiodaten).
99. Benutzerverständliche Statusmeldungen über Toasts und Fehlerhinweise.
100. Ausführliche Trennung von Stream-Hörern, beobachteten Airplays und nicht verfügbaren Reichweiten im Datenhinweis-Dialog.

## Noch offen — ausdrücklich nicht als fertig gezählt

- Historische vollständige Airplay-Zählung für alle 24 Stunden: benötigt einen permanent laufenden Daten-Sammler und Datenbank.
- Offizielle Radio-Reichweiten für RS2, RTL, 1LIVE usw.: benötigen lizenzierte oder veröffentlichte Senderdaten mit Messdatum; keine Echtzeit-Streamzähler.
- Beliebige UKW-/DAB+-Sender mit belastbarem Now-playing: derzeit nur für die über laut.fm bereitgestellten Senderdaten unterstützt.
- Plattformübergreifende Cloud-Synchronisierung: derzeit Speicherung pro Browser und Gerät.
