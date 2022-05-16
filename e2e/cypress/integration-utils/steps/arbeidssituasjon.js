const { getTestElement, selectRadioNo, selectRadioYes, setInputTime } = require('../utils');

const fyllUtNormalarbeidstidFasteDager = () => {
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

export const fyllUtArbeidssituasjonSteg = () => {
    fyllUtArbeidssituasjonAnsatt();
    fyllUtArbeidssituasjonFrilanser();
    fyllUtArbeidssituasjonSelvstendig();
};
