import { contextConfig } from '../integration-utils/contextConfig';
import { fyllUtEnkelSøknad } from '../integration-utils/fyll-ut-søknad';
import { oppsummeringTestArbeidssituasjon } from '../integration-utils/steps/arbeidssituasjon/arbeidssituasjonOppsummering';
import { kvittering } from '../integration-utils/steps/kvittering';
import { oppsummeringTestLegeerklæringSteg } from '../integration-utils/steps/legeerklæring';
import { oppsummeringTestMedlemskapSteg } from '../integration-utils/steps/medlemskap';
import { oppsummeringTestOmDeg } from '../integration-utils/steps/omDegOppsummering';
import { oppsummeringTestOmsorgstilbudSteg } from '../integration-utils/steps/omsorgstilbud';
import { oppsummeringTestOmBarn } from '../integration-utils/steps/opplysningerOmBarnet';
import { oppsummeringTestPeriodeSteg } from '../integration-utils/steps/periode';

describe('Kan jeg klikke meg enkelt gjennom en hele søknad ', () => {
    context('med utmocket, tom mellomlagring', () => {
        contextConfig({ mellomlagring: {} });

        fyllUtEnkelSøknad();

        it('STEG 9: Oppsummering - test', () => {
            oppsummeringTestOmDeg();
            oppsummeringTestOmBarn();
            oppsummeringTestPeriodeSteg();
            oppsummeringTestArbeidssituasjon();
            oppsummeringTestOmsorgstilbudSteg();
            oppsummeringTestMedlemskapSteg();
            oppsummeringTestLegeerklæringSteg();
        });

        kvittering();
    });
});
