import * as dayjs from 'dayjs';
import * as isoWeek from 'dayjs/plugin/isoWeek';
import { getTestElement, selectRadioNo, selectRadioYes, setInputValue, clickFortsett } from '../../utils';
import { ArbeidssituasjonAnsattProfil, fyllUtArbeidssituasjonAnsatt } from './arbeidssituasjonAnsatt';

dayjs.extend(isoWeek);

export const fyllUtArbeidssituasjonFrilanser = () => {
    getTestElement('arbeidssituasjonFrilanser').within(($body) => {
        if ($body.find('[data-testid=er-frilanser_yes]').length) {
            selectRadioYes('er-frilanser');
        }
        if ($body.find('[data-testid=fosterhjemsgodtgjørelse_mottar]').length) {
            selectRadioYes('fosterhjemsgodtgjørelse_mottar');
        }
        const startDato = dayjs().startOf('month').subtract(1, 'month').startOf('isoWeek').format('DD.MM.YYYY');

        cy.get('[name="frilans.startdato"]').click().type(startDato).blur();
        selectRadioYes('erFortsattFrilanser');
        setInputValue('normalarbeidstid.timerPerUke', '5');
    });
};

export const fyllUtArbeidssituasjonErIkkeFrilanser = () => {
    getTestElement('arbeidssituasjonFrilanser').within(($body) => {
        if ($body.find('[data-testid=er-frilanser_no]').length) {
            selectRadioNo('er-frilanser');
        }
    });
};

const fyllUtArbeidssituasjonSelvstendig = () => {
    getTestElement('arbeidssituasjonSelvstendig').within(() => {
        selectRadioNo('er-selvstendig');
    });
};

const fyllUtArbeidssituasjonOpptjeningUtland = () => {
    getTestElement('arbeidssituasjonOpptjeningUtland').within(() => {
        selectRadioNo('har-opptjeningUtland');
    });
};

const fyllUtArbeidssituasjonUtenlandskNæring = () => {
    getTestElement('arbeidssituasjonUtenlandskNæring').within(() => {
        selectRadioNo('har-utenlandskNæring');
    });
};

export const fyllUtArbeidssituasjonSteg = () => {
    it('Steg 3: Arbeidssituasjon', () => {
        fyllUtArbeidssituasjonAnsatt(ArbeidssituasjonAnsattProfil.ansatt);
        fyllUtArbeidssituasjonFrilanser();
        fyllUtArbeidssituasjonSelvstendig();
        fyllUtArbeidssituasjonOpptjeningUtland();
        fyllUtArbeidssituasjonUtenlandskNæring();
        clickFortsett();
    });
};
