import { ISODateToDate } from '@navikt/sif-common-utils/lib';
import { contextConfig, gotoStep } from '../../contextConfig';
import { mellomlagring } from '../../mocks/mellomlagring';
import { getTestElement, gåTilOppsummeringFraArbeidssituasjon, selectRadioYesOrNo, setInputValue } from '../../utils';

import dayjs = require('dayjs');

/** Formaterte verdier fra mock-data */
const periodeFraString = dayjs(ISODateToDate(mellomlagring.formValues.periodeFra)).format('D. MMMM YYYY');

interface ArbeidssituasjonAnsattValues {
    erAnsatt: boolean;
    sluttetFørSøknadsperiode?: boolean;
    timerPerUke?: string;
}

const ansatt: ArbeidssituasjonAnsattValues = {
    erAnsatt: true,
    timerPerUke: '30',
};

const sluttetISøknadsperiode: ArbeidssituasjonAnsattValues = {
    erAnsatt: false,
    sluttetFørSøknadsperiode: false,
    timerPerUke: '30',
};
const sluttetFørSøknadsperiode: ArbeidssituasjonAnsattValues = {
    erAnsatt: false,
    sluttetFørSøknadsperiode: true,
};

export const ArbeidssituasjonAnsattProfil = {
    ansatt,
    sluttetISøknadsperiode,
    sluttetFørSøknadsperiode,
};

export const fyllUtArbeidssituasjonAnsatt = (values: ArbeidssituasjonAnsattValues) => {
    const { erAnsatt, sluttetFørSøknadsperiode, timerPerUke } = values;
    getTestElement('arbeidssituasjonAnsatt').within(() => {
        selectRadioYesOrNo('er-ansatt', erAnsatt);
        if (!erAnsatt) {
            selectRadioYesOrNo('sluttet-før-søknadsperiode', sluttetFørSøknadsperiode);
        }
        if (erAnsatt || sluttetFørSøknadsperiode === false) {
            setInputValue('normalarbeidstid.timerPerUke', timerPerUke);
        }
    });
};

const ansattHeleSøknadsperiodeTest = () => {
    it('er ansatt og jobber 40 timer hos arbeidsgiver i perioden', () => {
        gotoStep('arbeidssituasjon');
        fyllUtArbeidssituasjonAnsatt({ erAnsatt: true, sluttetFørSøknadsperiode: false, timerPerUke: '40' });
        gåTilOppsummeringFraArbeidssituasjon();

        const el = getTestElement('arbeidssituasjon-ansatt-947064649');
        el.should('contain', 'Er ansatt');
        el.should('contain', 'Jobber normalt 40 timer per uke');
    });
};

const ansattISøknadsperiodeTest = () => {
    it('er ikke ansatt lenger, men sluttet inne i søknadsperioden perioden. Jobber 30 timer i uken.', () => {
        gotoStep('arbeidssituasjon');
        fyllUtArbeidssituasjonAnsatt({ erAnsatt: false, sluttetFørSøknadsperiode: false, timerPerUke: '30' });
        gåTilOppsummeringFraArbeidssituasjon();

        const el = getTestElement('arbeidssituasjon-ansatt-947064649');
        el.should('contain', 'Er ikke lenger ansatt');
        el.should('contain', 'Jobbet normalt 30 timer per uke');
        el.should('contain', `Sluttet etter ${periodeFraString}`);
    });
};

const sluttetFørSøknadsperiodeTest = () => {
    it('er ikke ansatt og sluttet før søknadsperiode', () => {
        gotoStep('arbeidssituasjon');
        fyllUtArbeidssituasjonAnsatt({ erAnsatt: false, sluttetFørSøknadsperiode: true });
        gåTilOppsummeringFraArbeidssituasjon();

        const el = getTestElement('arbeidssituasjon-ansatt-947064649');
        el.should('contain', 'Er ikke lenger ansatt');
        el.should('contain', `Sluttet før ${periodeFraString}`);
    });
};

export const testArbeidssituasjonAnsatt = () => {
    contextConfig({ mellomlagring });
    describe('Arbeidssituasjon ansatt', () => {
        ansattHeleSøknadsperiodeTest();
        ansattISøknadsperiodeTest();
        sluttetFørSøknadsperiodeTest();
    });
};
