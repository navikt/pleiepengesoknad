export const mellomlagring = {
    formValues: {
        periodeFra: '2022-10-07',
        periodeTil: '2022-10-30',
        barnetsNavn: '',
        barnetsFødselsnummer: '',
        barnetSøknadenGjelder: '2811762539343',
        harForståttRettigheterOgPlikter: true,
        harBekreftetOpplysninger: false,
        søknadenGjelderEtAnnetBarn: false,
        barnetHarIkkeFnr: false,
        legeerklæring: [],
        ansatt_arbeidsforhold: [
            {
                arbeidsgiver: {
                    type: 'ORGANISASJON',
                    id: '947064649',
                    organisasjonsnummer: '947064649',
                    navn: 'SJOKKERENDE ELEKTRIKER',
                    ansattFom: '2022-01-01',
                },
                erAnsatt: 'yes',
                normalarbeidstid: {
                    timerPerUke: '10',
                },
                arbeidIPeriode: {
                    arbeiderIPerioden: 'HELT_FRAVÆR',
                },
            },
        ],
        nyttFrilansoppdrag: [],
        frilansoppdrag: [
            {
                arbeidsgiver: {
                    type: 'FRILANSOPPDRAG',
                    id: '991012133',
                    organisasjonsnummer: '991012133',
                    navn: 'Hurdal frilanssenter',
                    ansattFom: '2022-01-01',
                },
                frilansoppdragIPerioden: 'JA',
                frilansoppdragKategori: 'FRILANSER',
                normalarbeidstid: {
                    timerPerUke: '20',
                },
                arbeidIPeriode: {
                    arbeiderIPerioden: 'HELT_FRAVÆR',
                },
            },
        ],
        harBoddUtenforNorgeSiste12Mnd: 'no',
        utenlandsoppholdSiste12Mnd: [],
        skalBoUtenforNorgeNeste12Mnd: 'no',
        utenlandsoppholdNeste12Mnd: [],
        skalOppholdeSegIUtlandetIPerioden: 'no',
        utenlandsoppholdIPerioden: [],
        skalTaUtFerieIPerioden: 'no',
        ferieuttakIPerioden: [],
        harMedsøker: 'no',
        samtidigHjemme: 'unanswered',
        omsorgstilbud: {
            erIOmsorgstilbudFremtid: 'no',
            erIOmsorgstilbudFortid: 'no',
        },
        harNattevåk: 'unanswered',
        harBeredskap: 'unanswered',
        selvstendig: {
            harHattInntektSomSN: 'no',
        },

        harOpptjeningUtland: 'no',
        opptjeningUtland: [],
        harUtenlandskNæring: 'no',
        utenlandskNæring: [],
    },
    metadata: {
        lastStepID: 'legeerklaering',
        version: '13.0.0',
        updatedTimestemp: '2022-10-19T13:14:12.851Z',
    },
};
