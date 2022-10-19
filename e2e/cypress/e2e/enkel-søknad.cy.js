const { contextConfig } = require('../integration-utils/contextConfig');
const { fyllUtVelkommenSide } = require('../integration-utils/steps/velkommenside');
const { fyllUtOmBarnSteg, oppsummeringTestOmBarn } = require('../integration-utils/steps/opplysningerOmBarnet');
const { fyllUtPeriodeSteg, oppsummeringTestPeriodeSteg } = require('../integration-utils/steps/periode');
const { fyllUtArbeidssituasjonSteg } = require('../integration-utils/steps/arbeidssituasjon/arbeidssituasjon');
const { fyllUtArbeidIPeriodeSteg } = require('../integration-utils/steps/arbeid-i-periode/arbeidIPeriode');
const {
    fyllUtOmsorgstilbudSteg,
    oppsummeringTestOmsorgstilbudSteg,
} = require('../integration-utils/steps/omsorgstilbud');
const { fyllUtMedlemskapSteg, oppsummeringTestMedlemskapSteg } = require('../integration-utils/steps/medlemskap');
const {
    fyllUtLegeerklæringSteg,
    oppsummeringTestLegeerklæringSteg,
} = require('../integration-utils/steps/legeerklæring');
const { oppsummeringTestOmDeg } = require('../integration-utils/steps/omDegOppsummering');
const { kvittering } = require('../integration-utils/steps/kvittering');

describe('Kan jeg klikke meg enkelt gjennom en hele søknad ', () => {
    context('med utmocket, tom mellomlagring', () => {
        contextConfig();

        fyllUtVelkommenSide();

        fyllUtOmBarnSteg();
        fyllUtPeriodeSteg();
        fyllUtArbeidssituasjonSteg();
        fyllUtArbeidIPeriodeSteg();
        fyllUtOmsorgstilbudSteg(); // Avhenger av peroden !!!
        fyllUtMedlemskapSteg();
        fyllUtLegeerklæringSteg();

        it('STEG 9: Oppsummering - test', () => {
            oppsummeringTestOmDeg();
            oppsummeringTestOmBarn();
            oppsummeringTestPeriodeSteg();
            oppsummeringTestOmsorgstilbudSteg();
            oppsummeringTestMedlemskapSteg();
            oppsummeringTestLegeerklæringSteg();
        });

        kvittering();
    });
});
