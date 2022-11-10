import { contextConfig } from '../integration-utils/contextConfig';
import { testArbeidssituasjonAnsatt } from '../integration-utils/steps/arbeidssituasjon/ansatt';
import { testArbeidssituasjonFrilanser } from '../integration-utils/steps/arbeidssituasjon/frilanser';
import { mellomlagring } from '../integration-utils/mocks/mellomlagring';
import { testArbeidssituasjonSN } from '../integration-utils/steps/arbeidssituasjon/selvstendigNæringsdrivende';

describe('Arbeidssituasjoner', () => {
    contextConfig({ mellomlagring });
    testArbeidssituasjonAnsatt();
    testArbeidssituasjonFrilanser();
    testArbeidssituasjonSN();
});
