import { getTestElement, selectRadioYesOrNo, setInputValue } from '../../utils';

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
