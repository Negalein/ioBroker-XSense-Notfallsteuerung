# 🚨 XSense Notfallsteuerung für ioBroker

Eine automatische Notfallsteuerung für XSense Rauchmelder in ioBroker.

Bei einem erkannten Rauchalarm werden definierte Notfallmaßnahmen automatisch ausgeführt:

- 🪟 Alle konfigurierten Rollos werden geöffnet
- 🚪 Die Haustür wird entriegelt
- 💡 Alle konfigurierten Lichter werden eingeschaltet

Die Notfallmaßnahmen werden nach dem Auslösen **nicht automatisch zurückgesetzt**.

---

## 📋 Funktionen

### 🚨 Automatischer Notfall

Das Skript überwacht den XSense-Datenpunkt `alarmStatus`.

Bei einem Zustandswechsel von `false → true` wird die Notfallroutine einmalig ausgelöst.

Die Reihenfolge lautet:

1. 🪟 Rollos öffnen
2. 🚪 Haustür entriegeln
3. 💡 Lichter einschalten

---

## 🪟 Rollos

Beim Notfall werden alle konfigurierten Rollos auf `100` gesetzt.

In der verwendeten ioBroker-Konfiguration entspricht dies dem vollständig geöffneten Zustand.

Aktuell konfiguriert:

- Kinderzimmer
- Küche
- Schlafzimmer
- Wintergarten

---

## 🚪 Haustür

Die Haustür wird ausschließlich entriegelt.

Verwendeter Datenpunkt:

`hm-rpc.0.0047E2698EB3D9.1.LOCK_TARGET_LEVEL`

Der Wert `1` wird zum Entriegeln geschrieben.

### ⚠️ Wichtig

Die Haustür wird **nicht geöffnet**.

Es wird ausschließlich der Entriegelungsbefehl verwendet.

---

## 💡 Lichter

Beim Notfall werden alle konfigurierten Lichter eingeschaltet.

Aktuell konfiguriert:

- Bad
- Garten
- Kinderzimmer
- Küche
- Schlafzimmer
- Wintergarten
- Wintergarten-Strip
- Wohnzimmer

Die Lichter werden auf `true` gesetzt.

---

## 🛡️ Einmalige Ausführung

Das Skript verhindert eine mehrfach wiederholte Ausführung während eines aktiven Alarms.

Solange der XSense-Datenpunkt `alarmStatus` auf `true` steht, wird die Notfallroutine nicht erneut ausgelöst.

Erst wenn der Alarm wieder auf `false` wechselt, wird der interne Status zurückgesetzt.

Beim nächsten Alarm kann die Notfallroutine erneut ausgelöst werden.

---

## ⚠️ Kein automatisches Zurücksetzen

Nach dem Auslösen des Notfalls erfolgt **kein automatisches Zurücksetzen**.

Das bedeutet:

- 🪟 Rollos bleiben geöffnet
- 💡 Lichter bleiben eingeschaltet
- 🚪 Haustür bleibt entriegelt

Diese Zustände müssen anschließend bei Bedarf manuell zurückgesetzt werden.

---

# 🔧 Voraussetzungen

Benötigt werden:

- ioBroker
- XSense ioBroker Adapter
- JavaScript-Adapter
- konfigurierte Alias-Datenpunkte für Rollos
- konfigurierte Alias-Datenpunkte für Lichter

---

# 📦 Installation

1. Im ioBroker JavaScript-Adapter ein neues Skript erstellen.
2. Das Skript beispielsweise `XSense Notfallsteuerung` nennen.
3. Den vollständigen JavaScript-Code in das Skript kopieren.
4. Die Konfiguration am Anfang des Skripts überprüfen.
5. Das Skript speichern.
6. Das Skript starten.
7. Anschließend die Testfunktionen durchführen.

---

# ⚙️ Konfiguration

Die gesamte Konfiguration befindet sich am Anfang des Skripts innerhalb von `const CONFIG`.

Dadurch können Geräte und Datenpunkte angepasst werden, ohne die eigentliche Programmlogik verändern zu müssen.

### 🚨 XSense Rauchmelder

Aktuell verwendet das Projekt:

- Name: `RM WoZi-EG`
- Raum: `Wohnzimmer im Erdgeschoss`
- Alarm-Datenpunkt: `xsense.0.devices.Nega.163988C7.00000001.alarmStatus`

### 🪟 Rollos

Aktuell verwendet das Projekt folgende Alias-Datenpunkte:

- `alias.0.EG.Rollo.Kinderzimmer`
- `alias.0.EG.Rollo.Küche`
- `alias.0.EG.Rollo.Schlafzimmer`
- `alias.0.EG.Rollo.Wintergarten`

Zum vollständigen Öffnen wird der Wert `100` geschrieben.

### 🚪 Haustür

Aktuell verwendet das Projekt:

`hm-rpc.0.0047E2698EB3D9.1.LOCK_TARGET_LEVEL`

Zum Entriegeln wird der Wert `1` geschrieben.

### 💡 Lichter

Aktuell verwendet das Projekt:

- `alias.0.EG.Licht.Bad`
- `alias.0.EG.Licht.Garten`
- `alias.0.EG.Licht.Kinderzimmer`
- `alias.0.EG.Licht.Küche`
- `alias.0.EG.Licht.Schlafzimmer`
- `alias.0.EG.Licht.Wintergarten`
- `alias.0.EG.Licht.Wintergarten-Strip`
- `alias.0.EG.Licht.Wohnzimmer`

Zum Einschalten wird `true` geschrieben.

---

# 🧪 Testfunktionen

Das Skript erstellt automatisch den Testbereich:

`0_userdata.0.XSense.Testnotfall`

Folgende Test-Datenpunkte werden erstellt:

- `0_userdata.0.XSense.Testnotfall.Test_Rollos`
- `0_userdata.0.XSense.Testnotfall.Test_Haustuer`
- `0_userdata.0.XSense.Testnotfall.Test_Lichter`
- `0_userdata.0.XSense.Testnotfall.Test`

---

## 🧪 Test Rollos

`0_userdata.0.XSense.Testnotfall.Test_Rollos`

Auf `true` setzen.

Alle konfigurierten Rollos werden auf `100` gesetzt.

---

## 🧪 Test Haustür

`0_userdata.0.XSense.Testnotfall.Test_Haustuer`

Auf `true` setzen.

Die Haustür wird entriegelt.

**Die Tür wird nicht geöffnet.**

---

## 🧪 Test Lichter

`0_userdata.0.XSense.Testnotfall.Test_Lichter`

Auf `true` setzen.

Alle konfigurierten Lichter werden eingeschaltet.

---

## 🧪 Kompletter Notfalltest

`0_userdata.0.XSense.Testnotfall.Test`

Auf `true` setzen.

Damit wird die komplette Notfallroutine ausgeführt:

🪟 Rollos öffnen  
🚪 Haustür entriegeln  
💡 Lichter einschalten

---

# 📊 Test-Datenpunkte

| Datenpunkt | Funktion |
|---|---|
| `0_userdata.0.XSense.Testnotfall.Test_Rollos` | Rollos testen |
| `0_userdata.0.XSense.Testnotfall.Test_Haustuer` | Haustür testen |
| `0_userdata.0.XSense.Testnotfall.Test_Lichter` | Lichter testen |
| `0_userdata.0.XSense.Testnotfall.Test` | kompletter Notfalltest |

---

# 📝 Logging

Das Skript schreibt ausführliche Informationen in das ioBroker-Log.

Beispielsweise werden folgende Ereignisse protokolliert:

- Start der Notfallroutine
- Öffnen der einzelnen Rollos
- Entriegeln der Haustür
- Einschalten der einzelnen Lichter
- Abschluss der Notfallroutine
- nicht vorhandene Datenpunkte

---

# 🔐 Sicherheit

Diese Automation greift aktiv in die Gebäudeautomation ein.

Insbesondere wird ein Türschloss automatisch entriegelt.

Vor dem produktiven Einsatz müssen deshalb alle Datenpunkte sorgfältig überprüft und die Testfunktionen durchgeführt werden.

Die tatsächliche Funktion hängt von der verwendeten Hardware, den ioBroker-Adaptern und der jeweiligen Gebäudeautomation ab.

---

# ⚠️ Haftungsausschluss

Dieses Projekt stellt eine individuelle Automatisierung für ioBroker dar und ersetzt keine zertifizierte Brandmelde-, Alarm- oder Sicherheitstechnik.

Der Autor übernimmt keine Haftung für Schäden oder Folgen, die durch Fehlkonfiguration, Softwarefehler, Hardwarefehler, Netzwerkprobleme, Stromausfälle, Ausfall von ioBroker, Ausfall von Adaptern oder nicht erreichbare Datenpunkte entstehen.

Für sicherheitskritische Anwendungen müssen geeignete, dafür zugelassene Systeme verwendet werden.

---

# 📜 Versionshistorie

## V1.0 – FINAL

- XSense Rauchalarm als Trigger
- automatische Öffnung aller konfigurierten Rollos
- automatische Entriegelung der Haustür
- automatisches Einschalten aller konfigurierten Lichter
- einmalige Ausführung pro Alarm
- kein automatisches Zurücksetzen
- separate Einzeltests
- kompletter Notfalltest
- Prüfung auf vorhandene Datenpunkte
- ausführliches Logging

---

# 👤 Autor

**Christian Wimmer**

Copyright © 2026 Christian Wimmer

---

# 📄 Lizenz

MIT License

Copyright (c) 2026 Christian Wimmer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
