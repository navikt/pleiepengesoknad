const arbeidstidMessages = {
    nb: {
        'arbeidstid.validation.hoursAreInvalid': 'Antall timer {dag} er ikke et gyldig tall.',
        'arbeidstid.validation.minutesAreInvalid': 'Antall minutter {dag} er ikke et gyldig tall.',
        'arbeidstid.validation.tooManyHours': 'Antall timer {dag} er for høyt. Maks antall timer er {maksTimer}.',
        'arbeidstid.validation.tooManyMinutes': 'Antall minutter {dag} er for høyt. Maks antall minutter er 59.',
        'arbeidstid.validation.durationIsTooLong':
            'Antall timer og minutter {dag} er for høyt. Tiden kan ikke være mer enn 24.',
        'arbeidstid.validation.durationIsTooShort':
            'Antall timer og minutter {dag} er for lavt. Tiden må være minst ett minutt.',
        'arbeidstid.uke': 'Uke {uke}',
        'arbeidstid.ukeOgÅr': '{ukeOgÅr}',
        'arbeidstid.form.tittel': 'Arbeidstimer i {måned} - {arbeidsstedNavn}',
        'arbeidstid.ukeForm.tittel': 'Uke {uke}, {år}',
        'arbeidstid.form.intro.1':
            'Endre antall timer og minutter du skal jobbe. Du skal bare fylle ut den tiden du vet med sikkerhet. Du trenger ikke fylle ut noe de dagene du ikke skal jobbe.',
        'arbeidstid.form.intro_fortid.1':
            'Legg inn endringene du ønsker å gjøre i arbeidstimene dine. Det er bare dager du har søkt om som er tilgjengelige for endring.',

        'arbeidstid.svar.ja': 'Ja',
        'arbeidstid.svar.nei': 'Nei',

        'arbeidstid.timerPerDag.timerOgMinutter': '{hours}t {minutes}m',
        'arbeidstid.timerPerDag.timer': '{hours}t',
        'arbeidstid.timerPerDag.minutter': '{minutes}m',

        'arbeidstid.addLabel': 'Endre arbeidstimer {periode} - {arbeidsstedNavn}',
        'arbeidstid.deleteLabel': 'Fjern alle timer',
        'arbeidstid.editLabel': 'Endre arbeidstimer {periode}',
        'arbeidstid.modalTitle': 'Arbeidstimer i {periode} - {arbeidsstedNavn}',
        'arbeidstid.iPeriodePanel.info': '{dager, plural, one {# dag} other {# dager}} med jobb registrert.',
        'arbeidstid.iPeriodePanel.info.ingenDager': 'Ingen dager med jobb registrert.',

        'arbeidsforhold.part.jobber': 'jobber',
        'arbeidsforhold.part.jobbet': 'jobbet',
        'arbeidsforhold.part.skalJobbe': 'skal jobbe',
        'arbeidsforhold.part.hosArbeidsgiver': 'hos {navn}',
        'arbeidsforhold.part.som.ANSATT': 'hos {navn}',
        'arbeidsforhold.part.som.FRILANSER': 'som frilanser',
        'arbeidsforhold.part.som.SELVSTENDIG': 'som selvstendig næringsdrivende',
    },
};

export default arbeidstidMessages;
