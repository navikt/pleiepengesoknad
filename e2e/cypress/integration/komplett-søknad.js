const dayjs = require('dayjs');
const isoWeek = require('dayjs/plugin/isoWeek');
const { clickFortsett, clickSendInnSøknad, selectRadioYes, setInputTime } = require('../integration-utils/utils');
const { fyllUtArbeidssituasjonSteg } = require('../integration-utils/steps/arbeidssituasjon');
const { fyllUtArbeidIPeriode } = require('../integration-utils/steps/arbeidIPeriode');

dayjs.extend(isoWeek);

const PUBLIC_PATH = '/familie/sykdom-i-familien/soknad/pleiepenger';

describe('Kan jeg klikke meg komplett gjennom en hele søknad ', () => {
    context('med utmocket, tom mellomlagring', () => {
        beforeEach('intercept mellomlagring og levere tomt objekt', () => {
            cy.server();
            cy.route(`/mellomlagring`, {}); // mellomlagring må slås av.
        });
        before('gå til startsiden', () => {
            cy.visit(`${PUBLIC_PATH}/soknad`);
        });
        it('Velkommenside', () => {
            cy.get('.bekreftCheckboksPanel label').click();
            cy.get('button[class="knapp welcomingPage__startApplicationButton knapp--hoved"]').click();
        });
        it('STEG 1: Barn', () => {
            cy.get('input[name=søknadenGjelderEtAnnetBarn]').click({ force: true });
            const barnetsFødselsnummer = '25848497005';
            cy.get('input[name=barnetsFødselsnummer]').click().type(barnetsFødselsnummer).blur();
            const barnetsNavn = 'Test Testen';
            cy.get('input[name=barnetsNavn]').click().type(barnetsNavn).blur();
            cy.get('input[name=relasjonTilBarnet]').first().check({ force: true });

            clickFortsett();
        });

        it('STEG 2: Periode', () => {
            // Velg periode, fom
            const fraDato = dayjs().startOf('month').startOf('isoWeek').format('YYYY-MM-DD');
            const tilDato = dayjs().startOf('month').add(1, 'month').startOf('isoWeek').format('YYYY-MM-DD');
            cy.get('input[name=periodeFra]').click().type(fraDato).blur();
            cy.get('input[name=periodeTil]').click().type(tilDato).blur();
            selectRadioYes('er-annenSamtidig');
            selectRadioYes('er-samtidigHjemme');

            selectRadioYes('er-iUtlandetIPerioden');
            cy.get('button').contains('Legg til utenlandsopphold').click();
            cy.get('input[name=fom]').click().type(fraDato).blur();
            cy.get('input[name=tom]').click().type(tilDato).blur();
            cy.get('select').select(2);
            cy.get('input[name=erBarnetInnlagt]').check({ force: true });
            cy.get('button').contains('Ok').click();

            selectRadioYes('er-ferieuttakIPerioden');
            cy.get('button').contains('Legg til ferie').click();
            cy.get('input[name=fom]').click().type(fraDato).blur();
            cy.get('input[name=tom]').click().type(tilDato).blur();
            cy.get('button').contains('Ok').click();

            clickFortsett();
        });

        it('STEG 3: Arbeidssituasjon', () => {
            fyllUtArbeidssituasjonSteg();
            clickFortsett();
        });

        it('STEG 4: Arbeid i perioden', () => {
            fyllUtArbeidIPeriode();
            clickFortsett();
        });

        it('STEG 6: Omsorgstilbud', () => {
            selectRadioYes('erIOmsorgstilbud-fortid');
            selectRadioYes('erIOmsorgstilbud-fremtid');
            selectRadioYes('omsorgstilbud-erLiktHverUke');
            setInputTime('fasteDager__monday', 5, 0);
            setInputTime('fasteDager__tuesday', 2, 0);
            setInputTime('fasteDager__wednesday', 5, 0);
            setInputTime('fasteDager__friday', 5, 0);
            clickFortsett();
        });

        it('STEG 7: Nattevåk og beredskap', () => {
            selectRadioYes('nattevåk');
            const nattevåkTilleggsinfo = 'Test nattevåk tilleggsinfo';
            cy.get('textarea[data-testid=nattevåk-tilleggsinfo]').click().type(nattevåkTilleggsinfo).blur();
            selectRadioYes('beredskap');
            const beredskapTilleggsinfo = 'Test beredskap tilleggsinfo';
            cy.get('textarea[data-testid=beredskap-tilleggsinfo]').click().type(beredskapTilleggsinfo).blur();
            clickFortsett();
        });
        it('STEG 8: Medlemskap', () => {
            selectRadioYes('medlemsskap-annetLandSiste12');

            cy.get('button')
                .contains('Legg til nytt utenlandsopphold')
                .then((element) => {
                    element.prevObject[0].click();
                    const fomTom = dayjs().startOf('day').subtract(1, 'day').format('YYYY-MM-DD');
                    cy.get('input[name=fom]').click().type(fomTom).blur();
                    cy.get('input[name=tom]').click().type(fomTom).blur();
                    cy.get('select').select(2);
                    cy.get('button').contains('Ok').click();
                });

            selectRadioYes('medlemsskap-annetLandNeste12');
            cy.get('button')
                .contains('Legg til nytt utenlandsopphold')
                .then((element) => {
                    element.prevObject[1].click();
                    const fomTom = dayjs().startOf('day').add(1, 'day').format('YYYY-MM-DD');
                    cy.get('input[name=fom]').click().type(fomTom).blur();
                    cy.get('input[name=tom]').click().type(fomTom).blur();
                    cy.get('select').select(2);
                    cy.get('button').contains('Ok').click();
                });

            clickFortsett();
        });

        it('STEG 9: LAST OPP LEGEERKLÆRING', () => {
            const fileName = 'navlogopng.png';
            cy.fixture(fileName, 'binary')
                .then(Cypress.Blob.binaryStringToBlob)
                .then((fileContent) =>
                    cy.get('input[type=file]').attachFile({
                        fileContent,
                        fileName,
                        mimeType: 'image/png', //getMimeType(fileName),
                        encoding: 'utf8',
                    })
                );
            clickFortsett();
        });

        it('STEG 9: Oppsummering', () => {
            cy.get('.bekreftCheckboksPanel label').click();
            clickSendInnSøknad();
        });
    });
});
