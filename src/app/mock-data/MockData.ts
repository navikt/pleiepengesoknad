import { ISODateToDate } from '@navikt/sif-common-utils';

export const arbeidsgivereMock = {
    organisasjoner: [{ navn: 'Karls godteributikk', organisasjonsnummer: '123451234' }],
};

export const barnMock = {
    barn: [
        {
            fødselsdato: ISODateToDate('2021.01.01'),
            fornavn: 'Barn',
            etternavn: 'Barnesen',
            aktørId: '1',
            harSammeAdresse: true,
        },
    ],
};

export const søkerMock = {
    fornavn: 'Kari',
    mellomnavn: 'Testesen',
    etternavn: 'Nordmann',
    fødselsnummer: '12345678901',
    kjønn: 'M',
};
