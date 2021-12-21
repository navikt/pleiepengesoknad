const omsorgstilbudEnkeltdagFormMessages = {
    nb: {
        'omsorgstilbudEnkeltdagForm.gjelderFlereDager.label': 'Gjelder flere dager',
        'omsorgstilbudEnkeltdagForm.gjentagelse.helUke': 'Alle hverdager i uke {ukeNavn}.',
        'omsorgstilbudEnkeltdagForm.gjentagelse.delAvUke': 'Hverdager i uke {ukeNavn}.',
        'omsorgstilbudEnkeltdagForm.gjentagelse.helMåned': 'Alle hverdager i {månedNavn}.',
        'omsorgstilbudEnkeltdagForm.gjentagelse.delAvMåned': 'Hverdager i {månedNavn}.',
        'omsorgstilbudEnkeltdagForm.gjentagelse.dagerFremover': 'Hver {dagNavn} fra og med {fra}.',
        'omsorgstilbudEnkeltdagForm.gjentagelse.periode': '({fra} - {til})',
        'omsorgstilbudEnkeltdagForm.stoppGjentagelse.label': 'Velg en annen til og med dato',
        'omsorgstilbudEnkeltdagForm.stopDato.label': 'Velg til og med dato',
        'omsorgstilbudEnkeltdagForm.validation.gjentagelse.noValue':
            'Du må velge hvilke flere dager arbeidstiden skal gjelde, eller velge bort valget om at det gjelder flere dager.',
        'omsorgstilbudEnkeltdagForm.validation.stopDato.dateHasNoValue': 'Du må fylle ut til og med dato.',
        'omsorgstilbudEnkeltdagForm.validation.stopDato.dateHasInvalidFormat':
            'Du må oppgi til og med dato i et gyldig datoformat. Gyldig format er dd.mm.åååå.',
        'omsorgstilbudEnkeltdagForm.validation.stopDato.dateIsBeforeMin':
            'Du kan ikke sette til og med dato til før fra-datoen.',
        'omsorgstilbudEnkeltdagForm.validation.stopDato.dateIsNotWeekday':
            'Til og med datoen må være en lørdag eller søndag. Skriv inn eller velg dato fra kalenderen.',
        'omsorgstilbudEnkeltdagForm.validation.stopDato.dateIsAfterMax':
            'Til og med dato kan ikke være etter perioden du søker for.',

        'omsorgstilbudEnkeltdagForm.validation.tid.hoursAreInvalid': 'Antall timer er ikke et gyldig tall.',
        'omsorgstilbudEnkeltdagForm.validation.tid.minutesAreInvalid': 'Antall minutter er ikke et gyldig tall.',
        'omsorgstilbudEnkeltdagForm.validation.tid.tooManyHours': 'Antall timer er for høyt. Maks antall timer er 7.',
        'omsorgstilbudEnkeltdagForm.validation.tid.tooManyMinutes':
            'Antall minutter er for høyt. Maks antall minutter er 59.',
        'omsorgstilbudEnkeltdagForm.validation.tid.durationIsTooLong':
            'Antall timer og minutter  er for høyt. Tiden kan ikke være mer enn 7 timer og 30 minutter.',
        'omsorgstilbudEnkeltdagForm.validation.tid.durationIsTooShort':
            'Antall timer og minutter er for lavt. Tiden må være minst ett minutt.',
        'omsorgstilbudEnkeltdagForm.validation.tid.hoursAreNegative':
            'Antall timer og minutter er for lavt. Tiden må være minst ett minutt.',
        'omsorgstilbudEnkeltdagForm.validation.tid.minutesAreNegative':
            'Antall timer og minutter er for lavt. Tiden må være minst ett minutt.',
    },
};

export default omsorgstilbudEnkeltdagFormMessages;
