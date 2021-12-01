const omsorgstilbudMessages = {
    nb: {
        'omsorgstilbud.validation.hoursAreInvalid': 'Antall timer {dag} er ikke et gyldig tall.',
        'omsorgstilbud.validation.minutesAreInvalid': 'Antall minutter {dag} er ikke et gyldig tall.',
        'omsorgstilbud.validation.tooManyHours': 'Antall timer {dag} er for høyt. Maks antall timer er {maksTimer}.',
        'omsorgstilbud.validation.tooManyMinutes': 'Antall minutter {dag} er for høyt. Maks antall minutter er 59.',
        'omsorgstilbud.validation.durationIsTooLong':
            'Antall timer og minutter {dag} er for høyt. Tiden kan ikke være mer enn 7 timer og 30 minutter.',
        'omsorgstilbud.validation.durationIsTooShort':
            'Antall timer og minutter {dag} er for lavt. Tiden må være minst ett minutt.',
        'omsorgstilbud.uke': 'Uke {uke}',
        'omsorgstilbud.ukeOgÅr': 'Omsorgstilbud {ukeOgÅr}',
        'omsorgstilbud.ingenDagerRegistrert': 'Ingen dager med omsorgstilbud registrert',
        'omsorgstilbud.form.tittel': 'Omsorgstilbud - {måned}',
        'omsorgstilbud.form.intro.1':
            'Fyll ut antall timer og minutter barnet skal være fast og regelmessig i et omsorgstilbud. Du trenger ikke fylle ut noe de dagene barnet ikke skal være der. ',
        'omsorgstilbud.form.intro_fortid.1':
            'Fyll ut antall timer og minutter barnet var fast og regelmessig i et omsorgstilbud. Du trenger ikke fylle ut noe de dagene barnet ikke var der.',
        'omsorgstilbud.form.intro.2': 'Du kan registrere opp til 7 timer og 30 minutter per dag.',
        'omsorgstilbud.ukeForm.tittel': 'Uke {uke}, {år}',

        'omsorgstilbud.svar.ja': 'Ja',
        'omsorgstilbud.svar.nei': 'Nei',

        'omsorgstilbud.timerPerDag.timerOgMinutter': '{hours}t {minutes}m',
        'omsorgstilbud.timerPerDag.timer': '{hours}t',
        'omsorgstilbud.timerPerDag.minutter': '{minutes}m',
        'omsorgstilbud.ingenDagerValgt': 'Ingen dager med tilsyn er registrert',

        'omsorgstilbud.addLabel': 'Registrer omsorgstilbud {periode}',
        'omsorgstilbud.deleteLabel': 'Fjern alle timer',
        'omsorgstilbud.editLabel': 'Endre omsorgstilbud {periode}',
        'omsorgstilbud.modalTitle': 'Omsorgstilbud - ${periode}',

        'omsorgstilbud.flereBarn.tittel': 'Hvordan fyller jeg ut om omsorgstilbud når jeg pleier flere barn samtidig?',
        'omsorgstilbud.flereBarn':
            'Du skal svare ja på at barna er i et fast og regelmessig omsorgstilbud bare hvis de skal være der samtidig. Du skal svare nei hvis barna skal være i omsorgstilbudet på ulike tider, eller hvis minst ett barn ikke skal være i et omsorgstilbud i det hele tatt.',
    },
};

export default omsorgstilbudMessages;
