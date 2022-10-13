const dayjs = require('dayjs');
const isoWeek = require('dayjs/plugin/isoWeek');
const {
    getTestElement,
    clickFortsett,
    selectRadioNo,
    clickNeiPaAlleSporsmal,
    clickSendInnSøknad,
} = require('../integration-utils/utils');
const { fyllUtArbeidssituasjonSteg } = require('../integration-utils/steps/arbeidssituasjon');
const { fyllUtArbeidIPeriode } = require('../integration-utils/steps/arbeidIPeriode');

dayjs.extend(isoWeek);

const PUBLIC_PATH = '/familie/sykdom-i-familien/soknad/pleiepenger';

describe('Kan jeg klikke meg gjennom en hele søknad på enklest mulig måte', () => {
    context('med utmocket, tom mellomlagring', () => {
        beforeEach('intercept mellomlagring og levere tomt objekt', () => {
            cy.server();
            cy.route(`/mellomlagring`, {}); // mellomlagring må slås av.
        });
        before('gå til startsiden', () => {
            cy.visit(`${PUBLIC_PATH}/soknad`);
        });
        it('Velkommenside', () => {
            getTestElement('welcomePage').then(($body) => {
                if ($body.find('[data-testid=brukForrigeSøknad_no]').length) {
                    selectRadioNo('brukForrigeSøknad');
                }
                cy.get('.bekreftCheckboksPanel label').click();
                cy.get('button[class="knapp welcomingPage__startApplicationButton knapp--hoved"]').click();
            });
        });
        it('STEG 1: Barn', () => {
            getTestElement('opplysninger-om-barnet').then(() => {
                cy.get('[type="radio"').first().check({ force: true });
                clickFortsett();
            });
        });

        it('STEG 2: Periode', () => {
            // Velg periode, fom
            const fraDato = dayjs().startOf('month').subtract(1, 'month').startOf('isoWeek').format('YYYY-MM-DD');
            const tilDato = dayjs().startOf('month').subtract(1, 'month').startOf('isoWeek').format('YYYY-MM-DD');
            cy.get('input[name=periodeFra]').click().type(fraDato).blur();
            cy.get('input[name=periodeTil]').click().type(tilDato).blur();

            clickNeiPaAlleSporsmal();
            clickNeiPaAlleSporsmal();

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
            clickNeiPaAlleSporsmal();
            clickFortsett();
        });

        it('STEG 7: Medlemskap', () => {
            clickNeiPaAlleSporsmal();
            clickFortsett();
        });

        it('STEG 8: LAST OPP LEGEERKLÆRING', () => {
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
