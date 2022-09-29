const dayjs = require('dayjs');
const { getTestElement, selectRadioNo, selectRadioYes, setInputTime, setInputValue } = require('../utils');

const fyllUtNormalarbeidstidFasteDager = () => {
    selectRadioYes('jobber-heltid');
    selectRadioNo('jobber-fast-helg');
    selectRadioYes('like-mange-timer-hver-uke');
    selectRadioYes('er-faste-ukedager');
    setInputTime('tid-faste-ukedager__monday', 5, 0);
    setInputTime('tid-faste-ukedager__tuesday', 2, 0);
    setInputTime('tid-faste-ukedager__wednesday', 5, 0);
    setInputTime('tid-faste-ukedager__friday', 5, 0);
};

const fyllUtArbeidssituasjonAnsatt = () => {
    getTestElement('arbeidssituasjonAnsatt').within(() => {
        selectRadioYes('er-ansatt');
        fyllUtNormalarbeidstidFasteDager();
    });
};
const fyllUtArbeidssituasjonFrilanser = () => {
    getTestElement('arbeidssituasjonFrilanser').then(($body) => {
        if ($body.find('[data-testid=er-frilanser_yes]').length) {
            selectRadioYes('er-frilanser');
        }
        // getTestElement('arbeidssituasjonFrilanser').within(() => {
        if ($body.find('[data-testid=fosterhjemsgodtgjørelse_mottar]').length) {
            selectRadioYes('fosterhjemsgodtgjørelse_mottar');
        }

        // });
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
