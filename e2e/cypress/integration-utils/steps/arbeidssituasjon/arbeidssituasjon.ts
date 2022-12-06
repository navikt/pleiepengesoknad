import { TestType } from '../../types/TestTyper';
import { clickFortsett } from '../../utils';
import { fyllUtArbeidssituasjonAnsatt } from './ansatt';
import { fyllUtArbeidssituasjonErIkkeFrilanser } from './frilanser';
//import { fyllUtArbeidssituasjonFrilanser } from './frilanser';
import { fyllUtArbeidssituasjonOpptjeningUtland } from './opptjeningUtland';
import { fyllUtArbeidssituasjonErIkkeSelvstendig } from './selvstendigNæringsdrivende';
import { fyllUtArbeidssituasjonUtenlandskNæring } from './utenlandskNæring';

export const fyllUtArbeidssituasjonSteg = (testType: TestType = TestType.ENKEL) => {
    it('Steg 3: Arbeidssituasjon', () => {
        fyllUtArbeidssituasjonAnsatt();
        fyllUtArbeidssituasjonErIkkeFrilanser();
        //fyllUtArbeidssituasjonFrilanser();
        fyllUtArbeidssituasjonErIkkeSelvstendig();
        fyllUtArbeidssituasjonUtenlandskNæring(testType);
        fyllUtArbeidssituasjonOpptjeningUtland(testType);
        clickFortsett();
    });
};
