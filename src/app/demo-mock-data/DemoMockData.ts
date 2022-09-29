import { ISODateToDate } from '@navikt/sif-common-utils/lib';
import { Arbeidsgiver, ArbeidsgiverType, RegistrerteBarn, Søker } from '../types';

interface DemoMockData {
    søker: Søker;
    barn: RegistrerteBarn[];
    arbeidsgivere: Arbeidsgiver[];
}

const demoMockData: DemoMockData = {
    søker: {
        fornavn: 'Test',
        etternavn: 'Demobruker',
        fødselsnummer: '12345678901',
        kjønn: 'Mann',
        mellomnavn: '',
    },
    barn: [{ fødselsdato: ISODateToDate('2021-01-01'), fornavn: 'Barn', etternavn: 'Demobruker', aktørId: '1' }],
    arbeidsgivere: [
        {
            id: '111',
            navn: 'Jans bakeri',
            type: ArbeidsgiverType.ORGANISASJON,
            ansattFom: ISODateToDate('2003-06-01'),
            organisasjonsnummer: '12312312312',
        },
        {
            id: '123',
            navn: 'Tromsø kommune',
            type: ArbeidsgiverType.FRILANSOPPDRAG,
            ansattFom: ISODateToDate('2018-01-01'),
            offentligIdent: '123',
        },
    ],
};
export default demoMockData;
