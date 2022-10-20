import { contextConfig } from '../integration-utils/contextConfig';
import { mellomlagring } from '../integration-utils/mocks/mellomlagring';
import { oppsummeringTestArbeidssituasjon } from '../integration-utils/steps/arbeidssituasjon/arbeidssituasjonOppsummering';

describe('Oppsummering arbeidssituasjon', () => {
    contextConfig({ mellomlagring, step: 'oppsummering' });
    oppsummeringTestArbeidssituasjon();
});
