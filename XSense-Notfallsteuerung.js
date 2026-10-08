/************************************************************
 * XSense Notfallsteuerung
 * Version: 1.0 FINAL
 *
 * Funktion:
 * - Bei Rauchalarm:
 *   1. Alle Rollos hochfahren
 *   2. Haustür entriegeln
 *   3. Alle Lichter einschalten
 *
 * Wichtig:
 * - Haustür wird NUR entriegelt, NICHT geöffnet.
 * - Es gibt KEIN automatisches Zurücksetzen.
 * - Die Notfallroutine wird pro Alarm nur einmal ausgeführt.
 *
 * Test-Datenpunkte:
 * 0_userdata.0.XSense.Testnotfall
 *   ├── Test_Rollos
 *   ├── Test_Haustuer
 *   ├── Test_Lichter
 *   └── Test
 ************************************************************/


/************************************************************
 * KONFIGURATION
 ************************************************************/

const CONFIG = {

    /************************************************
     * XSense Rauchmelder
     ************************************************/
    rauchmelder: {

        'RM WoZi-EG': {
            raum: 'Wohnzimmer im Erdgeschoss',

            alarmStatus:
                'xsense.0.devices.Nega.xxxxxx.00000001.alarmStatus'
        }

    },


    /************************************************
     * ROLLOS
     *
     * 100 = vollständig geöffnet
     ************************************************/
    rollos: [

        {
            name: 'Kinderzimmer',
            level: 'alias.0.EG.Rollo.Kinderzimmer'
        },

        {
            name: 'Küche',
            level: 'alias.0.EG.Rollo.Küche'
        },

        {
            name: 'Schlafzimmer',
            level: 'alias.0.EG.Rollo.Schlafzimmer'
        },

        {
            name: 'Wintergarten',
            level: 'alias.0.EG.Rollo.Wintergarten'
        }

    ],


    /************************************************
     * HAUSTÜR
     *
     * 1 = entriegelt
     *
     * WICHTIG:
     * Es wird ausschließlich LOCK_TARGET_LEVEL
     * verwendet.
     *
     * KEIN Öffnen der Tür!
     ************************************************/
    haustuer: {

        name: 'Haustür',

        lockTargetLevel:
            'hm-rpc.0.0047E2698EB3D9.1.LOCK_TARGET_LEVEL',

        entriegeltWert: 1

    },


    /************************************************
     * LICHTER
     ************************************************/
    lichter: [

        {
            name: 'Bad',
            state: 'alias.0.EG.Licht.Bad'
        },

        {
            name: 'Garten',
            state: 'alias.0.EG.Licht.Garten'
        },

        {
            name: 'Kinderzimmer',
            state: 'alias.0.EG.Licht.Kinderzimmer'
        },

        {
            name: 'Küche',
            state: 'alias.0.EG.Licht.Küche'
        },

        {
            name: 'Schlafzimmer',
            state: 'alias.0.EG.Licht.Schlafzimmer'
        },

        {
            name: 'Wintergarten',
            state: 'alias.0.EG.Licht.Wintergarten'
        },

        {
            name: 'Wintergarten-Strip',
            state: 'alias.0.EG.Licht.Wintergarten-Strip'
        },

        {
            name: 'Wohnzimmer',
            state: 'alias.0.EG.Licht.Wohnzimmer'
        }

    ],


    /************************************************
     * TEST-DATENPUNKT
     ************************************************/
    testDp:
        '0_userdata.0.XSense.Testnotfall'

};


/************************************************************
 * INTERNE STATUSVARIABLE
 *
 * Verhindert, dass bei einem weiterhin aktiven Alarm
 * die Notfallroutine mehrfach ausgeführt wird.
 ************************************************************/

const notfallAktiv = {};


/************************************************************
 * HILFSFUNKTION
 *
 * Prüft, ob ein Datenpunkt existiert und schreibt
 * anschließend den gewünschten Wert.
 ************************************************************/

function setStateSafe(id, value) {

    if (!existsState(id)) {

        log(
            `❌ Datenpunkt nicht gefunden: ${id}`,
            'error'
        );

        return false;
    }

    setState(id, value);

    return true;
}


/************************************************************
 * ROLLOS HOCHFAHREN
 ************************************************************/

function rollosHochfahren(quelle = 'Unbekannt') {

    log(
        `🪟 Rollo-Notöffnung gestartet (${quelle})`,
        'warn'
    );

    CONFIG.rollos.forEach(rollo => {

        if (
            setStateSafe(
                rollo.level,
                100
            )
        ) {

            log(
                `🪟 Rollo [${rollo.name}] → 100 %`,
                'warn'
            );

        }

    });

}


/************************************************************
 * HAUSTÜR ENTRIEGELN
 ************************************************************/

function haustuerEntriegeln(quelle = 'Unbekannt') {

    log(
        `🚪 Haustür wird entriegelt (${quelle})`,
        'warn'
    );

    if (
        setStateSafe(
            CONFIG.haustuer.lockTargetLevel,
            CONFIG.haustuer.entriegeltWert
        )
    ) {

        log(
            `🚪 ${CONFIG.haustuer.name} → ENTRIEGELT`,
            'warn'
        );

    }

}


/************************************************************
 * LICHTER EINSCHALTEN
 ************************************************************/

function lichterEinschalten(quelle = 'Unbekannt') {

    log(
        `💡 Alle Lichter werden eingeschaltet (${quelle})`,
        'warn'
    );

    CONFIG.lichter.forEach(licht => {

        if (
            setStateSafe(
                licht.state,
                true
            )
        ) {

            log(
                `💡 Licht [${licht.name}] → EIN`,
                'warn'
            );

        }

    });

}


/************************************************************
 * KOMPLETTE NOTFALLROUTINE
 ************************************************************/

function notfallAusloesen(quelle, raum) {

    log(
        '════════════════════════════════════════',
        'warn'
    );

    log(
        '🚨🚨🚨 NOTFALLROUTINE GESTARTET 🚨🚨🚨',
        'warn'
    );

    log(
        `🔥 Ursache: ${quelle}`,
        'warn'
    );

    if (raum) {

        log(
            `📍 Raum: ${raum}`,
            'warn'
        );

    }

    log(
        '════════════════════════════════════════',
        'warn'
    );


    /************************************************
     * 1. ROLLOS
     ************************************************/

    rollosHochfahren(quelle);


    /************************************************
     * 2. HAUSTÜR
     ************************************************/

    haustuerEntriegeln(quelle);


    /************************************************
     * 3. LICHTER
     ************************************************/

    lichterEinschalten(quelle);


    /************************************************
     * FERTIG
     ************************************************/

    log(
        '════════════════════════════════════════',
        'warn'
    );

    log(
        '🚨 NOTFALLROUTINE ABGESCHLOSSEN',
        'warn'
    );

    log(
        '🪟 Rollos: OFFEN',
        'warn'
    );

    log(
        '🚪 Haustür: ENTRIEGELT',
        'warn'
    );

    log(
        '💡 Lichter: EIN',
        'warn'
    );

    log(
        '⚠️ KEIN automatisches Zurücksetzen!',
        'warn'
    );

    log(
        '════════════════════════════════════════',
        'warn'
    );

}


/************************************************************
 * TEST-DATENPUNKTE ANLEGEN
 ************************************************************/

function testStateErstellen() {

    const testStates = [

        {
            name: 'Test_Rollos',
            commonName: 'Test Rollos hochfahren'
        },

        {
            name: 'Test_Haustuer',
            commonName: 'Test Haustür entriegeln'
        },

        {
            name: 'Test_Lichter',
            commonName: 'Test alle Lichter einschalten'
        },

        {
            name: 'Test',
            commonName: 'KOMPLETTER Notfalltest'
        }

    ];


    testStates.forEach(item => {

        const id =
            `${CONFIG.testDp}.${item.name}`;


        if (!existsState(id)) {

            createState(

                id,

                false,

                {
                    name: item.commonName,
                    type: 'boolean',
                    role: 'button',
                    read: true,
                    write: true,
                    def: false
                }

            );

            log(
                `🧪 Test-Datenpunkt erstellt: ${id}`,
                'info'
            );

        }

    });

}


/************************************************************
 * TEST: ROLLOS
 ************************************************************/

on({

    id:
        `${CONFIG.testDp}.Test_Rollos`,

    change: 'ne'

}, obj => {

    if (obj.state.val !== true) {
        return;
    }


    log(
        '🧪 Rollo-Test gestartet',
        'warn'
    );


    rollosHochfahren(
        'MANUELLER TEST'
    );


    setState(
        `${CONFIG.testDp}.Test_Rollos`,
        false
    );

});


/************************************************************
 * TEST: HAUSTÜR
 ************************************************************/

on({

    id:
        `${CONFIG.testDp}.Test_Haustuer`,

    change: 'ne'

}, obj => {

    if (obj.state.val !== true) {
        return;
    }


    log(
        '🧪 Haustür-Test gestartet',
        'warn'
    );


    haustuerEntriegeln(
        'MANUELLER TEST'
    );


    setState(
        `${CONFIG.testDp}.Test_Haustuer`,
        false
    );

});


/************************************************************
 * TEST: LICHTER
 ************************************************************/

on({

    id:
        `${CONFIG.testDp}.Test_Lichter`,

    change: 'ne'

}, obj => {

    if (obj.state.val !== true) {
        return;
    }


    log(
        '🧪 Licht-Test gestartet',
        'warn'
    );


    lichterEinschalten(
        'MANUELLER TEST'
    );


    setState(
        `${CONFIG.testDp}.Test_Lichter`,
        false
    );

});


/************************************************************
 * KOMPLETTER TEST
 ************************************************************/

on({

    id:
        `${CONFIG.testDp}.Test`,

    change: 'ne'

}, obj => {

    if (obj.state.val !== true) {
        return;
    }


    log(
        '🧪🧪🧪 KOMPLETTER NOTFALLTEST GESTARTET',
        'warn'
    );


    notfallAusloesen(
        'MANUELLER KOMPLETTEST',
        'Test'
    );


    setState(
        `${CONFIG.testDp}.Test`,
        false
    );

});


/************************************************************
 * X-SENSE ALARMÜBERWACHUNG
 ************************************************************/

Object.keys(
    CONFIG.rauchmelder
).forEach(name => {

    const melder =
        CONFIG.rauchmelder[name];


    log(
        `👀 XSense überwacht: ${name}`,
        'info'
    );


    on({

        id: melder.alarmStatus,

        change: 'ne'

    }, obj => {


        /************************************************
         * ALARM AKTIV
         ************************************************/

        if (obj.state.val === true) {


            /********************************************
             * Bereits ausgelöst?
             ********************************************/

            if (notfallAktiv[name]) {

                log(
                    `⚠️ Notfall bereits aktiv: ${name}`,
                    'warn'
                );

                return;

            }


            /********************************************
             * Notfall markieren
             ********************************************/

            notfallAktiv[name] = true;


            /********************************************
             * NOTFALL AUSLÖSEN
             ********************************************/

            notfallAusloesen(
                `XSense Rauchalarm: ${name}`,
                melder.raum
            );


        }


        /************************************************
         * ALARM BEENDET
         ************************************************/

        else {

            if (notfallAktiv[name]) {

                log(
                    `✅ XSense Alarm beendet: ${name}`,
                    'info'
                );

            }


            /********************************************
             * Nur internen Status zurücksetzen.
             *
             * Rollos, Licht und Tür bleiben unverändert!
             ********************************************/

            notfallAktiv[name] = false;

        }

    });

});


/************************************************************
 * TEST-DATENPUNKTE INITIALISIEREN
 ************************************************************/

testStateErstellen();


/************************************************************
 * STARTMELDUNG
 ************************************************************/

log(
    '════════════════════════════════════════',
    'info'
);

log(
    '🚨 XSense Notfallsteuerung V1.0 gestartet',
    'info'
);

log(
    `🔥 Überwachte Rauchmelder: ${
        Object.keys(CONFIG.rauchmelder).length
    }`,
    'info'
);

log(
    `🪟 Rollos: ${CONFIG.rollos.length}`,
    'info'
);

log(
    `💡 Lichter: ${CONFIG.lichter.length}`,
    'info'
);

log(
    `🧪 Tests: ${CONFIG.testDp}`,
    'info'
);

log(
    '════════════════════════════════════════',
    'info'
);