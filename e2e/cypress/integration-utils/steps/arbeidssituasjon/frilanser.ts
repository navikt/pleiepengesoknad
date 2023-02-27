import { contextConfig, gotoStep } from '../../contextConfig';
import { cyApiMockData } from '../../cyApiMockData';
import { mellomlagring } from '../../mocks/mellomlagring';
import {
    getTestElement,
    gåTilOppsummeringFraArbeidssituasjon,
    selectRadioNo,
    selectRadioYes,
    setInputValue,
} from '../../utils';

export const fyllUtArbeidssituasjonFrilanser = () => {
    getTestElement('arbeidssituasjonFrilanser').within(($body) => {
        if ($body.find('[data-testid=mottar-stønadGodtgjørelse_no]').length) {
            selectRadioNo('mottar-stønadGodtgjørelse');
        }

        if ($body.find('[data-testid=er-frilanser_yes]').length) {
            selectRadioYes('er-frilanser');
        }

        // const startDato = mellomlagring.formValues.frilans.;

        //cy.get('[name="frilans.startdato"]').click().type(startDato).blur();
        selectRadioYes('erFortsattFrilanser');
        setInputValue('normalarbeidstid.timerPerUke', '5');
    });
};

export const fyllUtArbeidssituasjonErIkkeFrilanser = () => {
    getTestElement('arbeidssituasjonFrilanser').within(($body) => {
        if ($body.find('[data-testid=mottar-stønadGodtgjørelse_no]').length) {
            selectRadioNo('mottar-stønadGodtgjørelse');
        }
        if ($body.find('[data-testid=er-frilanser_no]').length) {
            selectRadioNo('er-frilanser');
        }
    });
};

const erFrilanserUtenOppdrag = () => {
    contextConfig({ mellomlagring, arbeidsgivere: { ...cyApiMockData.arbeidsgivereMock, frilansoppdrag: [] } });
    it('er frilanser uten oppdrag', () => {
        gotoStep('arbeidssituasjon');
        fyllUtArbeidssituasjonFrilanser();
        gåTilOppsummeringFraArbeidssituasjon();

        const el = getTestElement('arbeidssituasjon-frilanser');
        el.should('contain', 'Startet som frilanser 1. oktober 2010');
        el.should('contain', 'Er fortsatt frilanser');
        el.should('contain', 'Jobber normalt 5 timer per uke');
    });
};

const erFrilanserMedOppdrag = () => {
    it('er frilanser med oppdrag', () => {
        gotoStep('arbeidssituasjon');
        fyllUtArbeidssituasjonFrilanser();
        gåTilOppsummeringFraArbeidssituasjon();

        const el = getTestElement('arbeidssituasjon-frilanser');
        el.should('contain', 'Startet som frilanser 1. oktober 2010');
        el.should('contain', 'Er fortsatt frilanser');
        el.should('contain', 'Jobber normalt 5 timer per uke');
    });
};

const erIkkeFrilanser = () => {
    it('er ikke frilanser', () => {
        gotoStep('arbeidssituasjon');
        fyllUtArbeidssituasjonErIkkeFrilanser();
        gåTilOppsummeringFraArbeidssituasjon();

        const el = getTestElement('arbeidssituasjon-frilanser');
        el.should('contain', 'Er ikke frilanser i perioden det søkes for');
    });
};

export const testArbeidssituasjonFrilanser = () => {
    contextConfig({ mellomlagring });
    describe('Arbeidssituasjon frilanser', () => {
        erIkkeFrilanser();
        erFrilanserUtenOppdrag();
        erFrilanserMedOppdrag();
    });
};
