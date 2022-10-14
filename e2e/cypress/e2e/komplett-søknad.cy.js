const { contextConfig } = require('../integration-utils/contextConfig');
const { fyllUtVelkommenSide } = require('../integration-utils/steps/velkommenside');
const { fyllUtOmBarnSteg, oppsummeringTestOmBarn } = require('../integration-utils/steps/opplysningerOmBarnet');
const { fyllUtPeriodeSteg, oppsummeringTestPeriodeSteg } = require('../integration-utils/steps/periode');
const {
    fyllUtArbeidssituasjon,
    oppsummeringTestArbeidssituasjonSteg,
} = require('../integration-utils/steps/arbeidssituasjon');
const { fyllUtArbeidIPeriodeSteg } = require('../integration-utils/steps/arbeidIPeriode');
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

describe('Kan jeg klikke meg komplett1 gjennom en hele søknad ', () => {
    context('med utmocket, tom mellomlagring', () => {
        contextConfig();

        fyllUtVelkommenSide();

        fyllUtOmBarnSteg('barnUtenFnr');
        fyllUtPeriodeSteg('full');
        fyllUtArbeidssituasjon('komplett');
        fyllUtArbeidIPeriodeSteg('redusertArbeid');
        fyllUtOmsorgstilbudSteg('fortidFremtid'); // Avhenger av peroden !!!
        fyllUtNattevåkOgBeredskapSteg('full');
        fyllUtMedlemskapSteg('full');
        fyllUtLegeerklæringSteg('enFil');

        it('STEG 9: Oppsummering - test', () => {
            oppsummeringTestOmDeg();
            oppsummeringTestOmBarn('barnUtenFnr');
            oppsummeringTestPeriodeSteg('full');
            oppsummeringTestArbeidssituasjonSteg('komplett');
            oppsummeringTestOmsorgstilbudSteg('fortidFremtid');
            oppsummeringTestNattevåkOgBeredskapSteg('full');
            oppsummeringTestMedlemskapSteg('full');
            oppsummeringTestLegeerklæringSteg('enFil');
        });

        kvittering();
    });
});
