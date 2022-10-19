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
const {
    fyllUtNattevåkOgBeredskapSteg,
    oppsummeringTestNattevåkOgBeredskapSteg,
} = require('../integration-utils/steps/nattevåkOgBeredskap');
const { fyllUtMedlemskapSteg, oppsummeringTestMedlemskapSteg } = require('../integration-utils/steps/medlemskap');

const {
    fyllUtLegeerklæringSteg,
    oppsummeringTestLegeerklæringSteg,
} = require('../integration-utils/steps/legeerklæring');
const { oppsummeringTestOmDeg } = require('../integration-utils/steps/omDegOppsummering');
const { kvittering } = require('../integration-utils/steps/kvittering');

const TEST_TYPE = 'komplett';

describe('Kan jeg klikke meg komplett gjennom en hele søknad ', () => {
    context('med utmocket, tom mellomlagring', () => {
        contextConfig();

        fyllUtVelkommenSide();

        fyllUtOmBarnSteg(TEST_TYPE);
        fyllUtPeriodeSteg(TEST_TYPE);
        fyllUtArbeidssituasjonSteg(TEST_TYPE);
        fyllUtArbeidIPeriodeSteg('redusertArbeid');
        fyllUtOmsorgstilbudSteg(TEST_TYPE); // Avhenger av peroden !!!
        fyllUtNattevåkOgBeredskapSteg(TEST_TYPE);
        fyllUtMedlemskapSteg(TEST_TYPE);
        fyllUtLegeerklæringSteg(TEST_TYPE);

        it('STEG 9: Oppsummering - test', () => {
            oppsummeringTestOmDeg();
            oppsummeringTestOmBarn(TEST_TYPE);
            oppsummeringTestPeriodeSteg(TEST_TYPE);
            oppsummeringTestOmsorgstilbudSteg(TEST_TYPE);
            oppsummeringTestNattevåkOgBeredskapSteg(TEST_TYPE);
            oppsummeringTestMedlemskapSteg(TEST_TYPE);
            oppsummeringTestLegeerklæringSteg(TEST_TYPE);
        });

        kvittering();
    });
});
