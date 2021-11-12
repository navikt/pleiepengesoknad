const clickFortsett = () => cy.get('button[aria-label="Gå til neste steg"]').click();
const clickSendInnSøknad = () => cy.get('button[aria-label="Send inn søknaden"]').click();

const PUBLIC_PATH = '/familie/sykdom-i-familien/soknad/pleiepenger';

const clickNeiPaAlleSporsmal = () => {
    cy.get('label[class="inputPanel radioPanel"]').each((element) => {
        if (element.text() === 'Nei') {
            element.click();
        }
    });
};

describe('Kan jeg klikke meg gjennom en hele søknad på enklest mulig måte', () => {
    context('med utmocket, tom mellomlagring', () => {
        beforeEach('intercept mellomlagring og levere tomt objekt', () => {
            cy.server();
            cy.route(`/mellomlagring`, {}); // mellomlagring må slås av.
        });
        before('gå til startsiden', () => {
            cy.visit(`${PUBLIC_PATH}/soknad`);
        });
        it('VELKOMMEN SIDE', () => {
            cy.get('.bekreftCheckboksPanel label').click();
            cy.get('button[class="knapp welcomingPage__startApplicationButton knapp--hoved"]').click();
        });
        it('STEG 1: BARN', () => {
            cy.get('[type="radio"').first().check({ force: true });

            clickFortsett(cy);
        });

        it('STEG 2: PERIODEN MED PLEIEPENGER', () => {
            // Velg periode, fom
            cy.get('[class=nav-datovelger__kalenderknapp]').first().click();
            cy.get('[class=DayPicker-Day]').not('.DayPicker-Day--disabled').first().click();

            // Velg periode, tom
            cy.get('[class=nav-datovelger__kalenderknapp]').last().click();
            cy.get('[class=DayPicker-Day]').not('.DayPicker-Day--disabled').first().click();

            clickNeiPaAlleSporsmal();
            clickNeiPaAlleSporsmal();

            clickFortsett(cy);
        });

        it('STEG 3: Arbeidssituasjon', () => {
            cy.get('input[name*="erAnsatt"][value="yes"]').parent('label').click({ multiple: true });
            cy.get('input[name*="frilans"][value="no"]').parent('label').click();
            cy.get('input[name*="selvstendig"][value="no"]').parent('label').click();

            cy.get('input[name*="jobberNormaltTimer"]').first().type('10');

            clickFortsett(cy);
        });

        it('STEG 4: Jobb til nå', () => {
            clickNeiPaAlleSporsmal();
            clickFortsett(cy);
        });

        it('STEG 6: Omsorgstilbud', () => {
            clickNeiPaAlleSporsmal();
            clickFortsett(cy);
        });

        it('STEG 7: Medlemskap', () => {
            clickNeiPaAlleSporsmal();
            clickFortsett(cy);
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
            clickFortsett(cy);
        });

        it('STEG 9: Oppsummering', () => {
            cy.get('.bekreftCheckboksPanel label').click();
            clickSendInnSøknad(cy);
        });

        // it('SØKNAD SENDT page should have h1 header', () => {
        //     cy.get('h1').contains('Vi har mottatt søknad fra deg om pleiepenger');
        // });
    });
});
