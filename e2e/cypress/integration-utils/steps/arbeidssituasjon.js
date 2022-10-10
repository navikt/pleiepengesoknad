const { getTestElement, selectRadioNo, selectRadioYes, setInputTime, getInputByName } = require('../utils');
const dayjs = require('dayjs');
const isoWeek = require('dayjs/plugin/isoWeek');
dayjs.extend(isoWeek);

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
    getTestElement('arbeidssituasjonFrilanser').within(() => {
        selectRadioNo('er-frilanser');
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

export const fyllUtArbeidssituasjonFrilanserYes = () => {
    getTestElement('arbeidssituasjonFrilanser').within(() => {
        selectRadioYes('er-frilanser');
    });
    const fraDato = dayjs().startOf('month').subtract(1, 'month').startOf('isoWeek').format('YYYY-MM-DD');
    getTestElement('er-frilanser-startdato').click().type(fraDato).blur();
    selectRadioYes('er-frilanser-erFortsattFrilanser');
    getInputByName('frilans.arbeidsforhold.normalarbeidstid.timerPerUke').click().type(5).blur();
};

export const fyllUtKomplettArbeidssituasjonSteg = () => {
    fyllUtArbeidssituasjonAnsatt();
    fyllUtArbeidssituasjonFrilanserYes();
    fyllUtArbeidssituasjonSelvstendig();
    fyllUtArbeidssituasjonOpptjeningUtland();
    fyllUtArbeidssituasjonUtenlandskNæring();
};
