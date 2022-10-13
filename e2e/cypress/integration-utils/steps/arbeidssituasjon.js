const dayjs = require('dayjs');
const { getTestElement, selectRadioNo, selectRadioYes, setInputValue } = require('../utils');

const fyllUtArbeidssituasjonAnsatt = () => {
    getTestElement('arbeidssituasjonAnsatt').within(() => {
        selectRadioYes('er-ansatt');
        setInputValue('ansatt_arbeidsforhold.0.normalarbeidstid.timerPerUke', '30');
    });
};
const fyllUtArbeidssituasjonFrilanser = () => {
    getTestElement('arbeidssituasjonFrilanser').then(($body) => {
        if ($body.find('[data-testid=er-frilanser_yes]').length) {
            selectRadioYes('er-frilanser');
        }
        if ($body.find('[data-testid=fosterhjemsgodtgjørelse_mottar]').length) {
            selectRadioYes('fosterhjemsgodtgjørelse_mottar');
        }
        const startDato = dayjs().startOf('month').subtract(1, 'month').startOf('isoWeek').format('YYYY-MM-DD');
        cy.get('[name="frilans.startdato"]').click().type(startDato).blur();
        selectRadioYes('erFortsattFrilanser');
        setInputValue('frilans.arbeidsforhold.normalarbeidstid.timerPerUke', '5');
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
    fyllUtArbeidssituasjonAnsatt();
    fyllUtArbeidssituasjonFrilanser();
    fyllUtArbeidssituasjonSelvstendig();
    fyllUtArbeidssituasjonOpptjeningUtland();
    fyllUtArbeidssituasjonUtenlandskNæring();
};
