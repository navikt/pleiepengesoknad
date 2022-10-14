const dayjs = require('dayjs');
const isoWeek = require('dayjs/plugin/isoWeek');
const locale = require('dayjs/locale/nb');
const {
    clickFortsett,
    clickSendInnSøknad,
    selectRadioYes,
    setInputTime,
    getTestElement,
    getTestElementByClass,
} = require('../integration-utils/utils');
const { fyllUtArbeidssituasjonSteg } = require('../integration-utils/steps/arbeidssituasjon');
const { fyllUtArbeidIPeriode } = require('../integration-utils/steps/arbeidIPeriode');

dayjs.extend(isoWeek);
dayjs.locale(locale);

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

        const expectedSøkersNavn = 'Test Testesen'; // avhenger av mock data
        const expectedSøkersFødselsnummer = '23058916765'; // avhenger av mock data
        const expectedOrgNavn = 'Karis gullfisker'; // avhenger av mock data
        const expectedOrgNummer = '112233445'; // avhenger av mock data

        const barnetsNavn = 'Barn Barnet';
        const barnetsFødselsnummer = '25848497005';
        const expectedRelasjonTilBarn = 'mor';

        const fraDato = dayjs().startOf('month').format('YYYY-MM-DD');
        const tilDato = dayjs().startOf('month').add(1, 'month').format('YYYY-MM-DD');
        const expectedLand = 'Albania'; // Land #2 i listen

        const fomTomMedlemskapSiste12 = dayjs().startOf('day').subtract(1, 'day').format('YYYY-MM-DD');
        const fomTomMedlemskapNeste12 = dayjs().startOf('day').add(1, 'day').format('YYYY-MM-DD');
        const nattevåkTilleggsinfo = 'Test nattevåk tilleggsinfo';
        const beredskapTilleggsinfo = 'Test beredskap tilleggsinfo';

        const expectedFilename = 'navlogopng.png';

        it('Velkommenside', () => {
            cy.get('.bekreftCheckboksPanel label').click();

            cy.get('button[class="knapp welcomingPage__startApplicationButton knapp--hoved"]').click();
        });
        it('STEG 1: Barn', () => {
            cy.get('input[name=søknadenGjelderEtAnnetBarn]').click({ force: true });

            cy.get('input[name=barnetsFødselsnummer]').click().type(barnetsFødselsnummer).blur();

            cy.get('input[name=barnetsNavn]').click().type(barnetsNavn).blur();
            cy.get('input[name=relasjonTilBarnet]').first().check({ force: true });

            clickFortsett();
        });

        it('STEG 2: Periode', () => {
            cy.get('input[name=periodeFra]').click().type(fraDato).blur();
            cy.get('input[name=periodeTil]').click().type(tilDato).blur();
            selectRadioYes('er-annenSamtidig');
            selectRadioYes('er-samtidigHjemme');

            selectRadioYes('er-iUtlandetIPerioden');
            cy.get('button').contains('Legg til utenlandsopphold').click();
            cy.get('input[name=fom]').click().type(fraDato).blur();
            cy.get('input[name=tom]').click().type(tilDato).blur();
            cy.get('select').select(2); // Valg land #2 fra listen
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

        it('STEG 5: Omsorgstilbud', () => {
            selectRadioYes('erIOmsorgstilbud-fortid');
            selectRadioYes('erIOmsorgstilbud-fremtid');
            selectRadioYes('omsorgstilbud-erLiktHverUke');

            setInputTime('fasteDager__monday', 5, 0);
            setInputTime('fasteDager__tuesday', 2, 0);
            setInputTime('fasteDager__wednesday', 5, 0);
            setInputTime('fasteDager__friday', 5, 0);

            clickFortsett();
        });

        it('STEG 6: Nattevåk og beredskap', () => {
            selectRadioYes('nattevåk');
            cy.get('textarea[data-testid=nattevåk-tilleggsinfo]').click().type(nattevåkTilleggsinfo).blur();

            selectRadioYes('beredskap');
            cy.get('textarea[data-testid=beredskap-tilleggsinfo]').click().type(beredskapTilleggsinfo).blur();

            clickFortsett();
        });
        it('STEG 7: Medlemskap', () => {
            selectRadioYes('medlemsskap-annetLandSiste12');

            getTestElement('bostedUtlandList-annetLandSiste12').within(() => {
                cy.get('button').contains('Legg til nytt utenlandsopphold').click();
            });
            cy.get('input[name=fom]').click().type(fomTomMedlemskapSiste12).blur();
            cy.get('input[name=tom]').click().type(fomTomMedlemskapSiste12).blur();
            cy.get('select').select(2); // Valg land #2 fra listen
            cy.get('button').contains('Ok').click();

            selectRadioYes('medlemsskap-annetLandNeste12');

            getTestElement('bostedUtlandList-annetLandNeste12').within(() => {
                cy.get('button').contains('Legg til nytt utenlandsopphold').click();
            });

            cy.get('input[name=fom]').click().type(fomTomMedlemskapNeste12).blur();
            cy.get('input[name=tom]').click().type(fomTomMedlemskapNeste12).blur();
            cy.get('select').select(2); // Valg land #2 fra listen
            cy.get('button').contains('Ok').click();
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

        it('STEG 9: Oppsummering - om Deg test', () => {
            getTestElement('oppsummering-søker-navn').should((element) =>
                expect(expectedSøkersNavn).equal(element.text())
            );
            getTestElement('oppsummering-søker-fødselsnummer').should((element) =>
                expect(`Fødselsnummer: ${expectedSøkersFødselsnummer}`).equal(element.text())
            );
        });
        it('STEG 9: Oppsummering - om Barn test', () => {
            getTestElement('oppsummering-barnets-navn').should((element) =>
                expect(`Navn: ${barnetsNavn}`).equal(element.text())
            );
            getTestElement('oppsummering-barnets-fødselsnummer').should((element) =>
                expect(`Fødselsnummer: ${barnetsFødselsnummer}`).equal(element.text())
            );

            getTestElement('oppsummering-barn-relasjon').should((element) =>
                expect(`Du er ${expectedRelasjonTilBarn} til barnet`).equal(element.text())
            );
        });
        it('STEG 9: Oppsummering - Perioden du søker pleiepenger for test', () => {
            const expectedFomTom = `${dayjs(fraDato).format('D. MMMM YYYY')} - ${dayjs(tilDato).format(
                'D. MMMM YYYY'
            )}`;
            getTestElement('oppsummering-tidsrom-fomtom').should((element) =>
                expect(expectedFomTom).equal(element.text())
            );
            getTestElement('oppsummering-annenSøkerSammePeriode').within(() => {
                getTestElementByClass('summaryBlock__content').should((element) => expect('Ja').equal(element.text()));
            });
            getTestElement('oppsummering-samtidigHjemme').within(() => {
                getTestElementByClass('summaryBlock__content').should((element) => expect('Ja').equal(element.text()));
            });
            getTestElement('oppsummering-utenlandsoppholdIPerioden').should((element) =>
                expect('Ja').equal(element.text())
            );
            getTestElement('oppsummering-utenlandsoppholdIPerioden-list').within(() => {
                const expectedDate = `${dayjs(fraDato).format('D. MMM YYYY')} - ${dayjs(tilDato).format(
                    'D. MMM YYYY'
                )}`;
                getTestElementByClass('utenlandsoppholdSummaryItem__dates').should((element) =>
                    expect(expectedDate).equal(element.text())
                );
                getTestElementByClass('utenlandsoppholdSummaryItem__country').should((element) =>
                    expect(expectedLand).equal(element.text())
                );
            });
            getTestElement('oppsummering-ferieuttakIPerioden').should((element) => expect('Ja').equal(element.text()));
            getTestElement('oppsummering-ferieuttakIPerioden-list').within(() => {
                const expectedDate = `${dayjs(fraDato).format('D. MMM YYYY')} - ${dayjs(tilDato).format(
                    'D. MMM YYYY'
                )}`;
                getTestElementByClass('utenlandsoppholdSummaryItem__dates').should((element) =>
                    expect(expectedDate).equal(element.text())
                );
            });
        });
        it('STEG 9: Oppsummering - Din arbeidssituasjon test', () => {
            getTestElement('oppsummering-arbeidssituasjon-ansatt').within(() => {
                getTestElementByClass('typo-normal contentWithHeader__header').should((element) =>
                    expect(`${expectedOrgNavn} (organisasjonsnummer ${expectedOrgNummer})`).equal(element.text())
                );

                cy.get('li')
                    .eq(0)
                    .should((element) => expect('Er ansatt').equal(element.text()));
                cy.get('li')
                    .eq(1)
                    .should((element) => expect('Arbeider heltid').equal(element.text()));
                cy.get('li')
                    .eq(2)
                    .should((element) => expect('Arbeider ikke fast lørdag og/eller søndag').equal(element.text()));
            });
        });

        it('STEG 9: Oppsummering -  Omsorgstilbud i søknadsperioden test', () => {
            getTestElement('oppsummering-omsorgstilbud-svarFortid').should((element) =>
                expect('Ja').equal(element.text())
            );
        });
        it('STEG 9: Oppsummering - Nattevåk og beredskap', () => {
            getTestElement('oppsummering-nattevåk').should((element) => expect('Ja').equal(element.text()));
            getTestElement('oppsummering-nattevåk-tilleggsinformasjon').should((element) =>
                expect(nattevåkTilleggsinfo).equal(element.text())
            );

            getTestElement('oppsummering-beredskap').should((element) => expect('Ja').equal(element.text()));
            getTestElement('oppsummering-beredskap-tilleggsinformasjon').should((element) =>
                expect(beredskapTilleggsinfo).equal(element.text())
            );
        });

        it('STEG 9: Oppsummering - Medlemskap i folketrygden', () => {
            getTestElement('oppsummering-medlemskap-utlandetSiste12').should((element) =>
                expect('Ja').equal(element.text())
            );
            getTestElement('oppsummering-medlemskap-utlandetSiste12-list').within(() => {
                const expectedDate = `${dayjs(fomTomMedlemskapSiste12).format('D. MMM YYYY')} - ${dayjs(
                    fomTomMedlemskapSiste12
                ).format('D. MMM YYYY')}`;
                getTestElementByClass('utenlandsoppholdSummaryItem__dates').should((element) =>
                    expect(expectedDate).equal(element.text())
                );
                getTestElementByClass('utenlandsoppholdSummaryItem__country').should((element) =>
                    expect(expectedLand).equal(element.text())
                );
            });

            getTestElement('oppsummering-medlemskap-utlandetNeste12').should((element) =>
                expect('Ja').equal(element.text())
            );
            getTestElement('oppsummering-medlemskap-utlandetNeste12-list').within(() => {
                const expectedDate = `${dayjs(fomTomMedlemskapNeste12).format('D. MMM YYYY')} - ${dayjs(
                    fomTomMedlemskapNeste12
                ).format('D. MMM YYYY')}`;
                getTestElementByClass('utenlandsoppholdSummaryItem__dates').should((element) =>
                    expect(expectedDate).equal(element.text())
                );
                getTestElementByClass('utenlandsoppholdSummaryItem__country').should((element) =>
                    expect(expectedLand).equal(element.text())
                );
            });
        });
        it('STEG 9: Oppsummering - Vedlegg', () => {
            getTestElementByClass('lenke attachmentLabel__text').should((element) =>
                expect(expectedFilename).equal(element.text())
            );
        });

        it('STEG 9: Oppsummering - send', () => {
            cy.get('.bekreftCheckboksPanel label').click();
        });
        it('STEG 10: Kvittering', () => {
            clickSendInnSøknad();
        });
    });
});
