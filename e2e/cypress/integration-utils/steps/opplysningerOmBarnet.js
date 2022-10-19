const { getTestElement, getInputByName, clickFortsett, getTestElementByType } = require('../utils');
const dayjs = require('dayjs');
const isoWeek = require('dayjs/plugin/isoWeek');
const locale = require('dayjs/locale/nb');
dayjs.extend(isoWeek);
dayjs.locale(locale);

const barnetsNavnRegistrert = 'Barn Barne Barnesen'; //Fra mock
const barnetsFødselsdatoRegistrert = dayjs('01.01.2021').format('DD.MM.YYYY');
const barnetsNavn = 'Barn Barnet';
const barnetsFødselsnummer = '25848497005';
const barnetsFødselsdato = dayjs().startOf('month').subtract(5, 'month').format('DD.MM.YYYY');
const expectedRelasjonTilBarn = 'mor';
const relasjonAnnetBeskrivelse = 'Annet relasjon beskrivelse';
const årsakManglerIdentitetsnummer = 'Barnet bor i utlandet';
const fileName = 'fødselsattest.png';
// const ingenVedleggText = 'Ingen vedlegg er lastet opp';

export const fyllUtBarnRegistrert = () => {
    getTestElement('opplysninger-om-barnet').then(() => {
        getTestElementByType('radio').first().check({ force: true });

        clickFortsett();
    });
};

export const fyllUtAnnetBarnMedFnr = () => {
    getTestElement('opplysninger-om-barnet').then(() => {
        getInputByName('søknadenGjelderEtAnnetBarn').click({ force: true });
        getInputByName('barnetsFødselsnummer').click().type(barnetsFødselsnummer).blur();
        getInputByName('barnetsNavn').click().type(barnetsNavn).blur();
        getInputByName('relasjonTilBarnet').first().check({ force: true });

        clickFortsett();
    });
};

export const fyllUtAnnetBarnUtenFnr = () => {
    getTestElement('opplysninger-om-barnet').then(() => {
        getInputByName('søknadenGjelderEtAnnetBarn').click({ force: true });
        getInputByName('barnetHarIkkeFnr').click({ force: true });
        getInputByName('årsakManglerIdentitetsnummer').eq(1).check({ force: true });
        getInputByName('barnetsNavn').click().type(barnetsNavn).blur();
        getInputByName('barnetsFødselsdato').click().type(barnetsFødselsdato).blur();
        getInputByName('relasjonTilBarnet').eq(4).check({ force: true }); //Velg annet
        getTestElement('opplysninger-om-barnet-relasjonAnnetBeskrivelse').click().type(relasjonAnnetBeskrivelse).blur();
        cy.fixture(fileName, 'binary')
            .then(Cypress.Blob.binaryStringToBlob)
            .then((fileContent) =>
                getTestElementByType('file').attachFile({
                    fileContent,
                    fileName,
                    mimeType: 'image/png', //getMimeType(fileName),
                    encoding: 'utf8',
                })
            );
        clickFortsett();
    });
};

export const oppsummeringTestRegistrertBarn = () => {
    getTestElement('oppsummering-barnets-navn-registert').should((element) =>
        expect(`Navn: ${barnetsNavnRegistrert}`).equal(element.text())
    );
    getTestElement('oppsummering-barnets-fødselsdato-registrert').should((element) =>
        expect(`Fødselsdato: ${barnetsFødselsdatoRegistrert}`).equal(element.text())
    );
};

export const oppsummeringTestAnnetBarnMedFnr = () => {
    getTestElement('oppsummering-barnets-navn').should((element) =>
        expect(`Navn: ${barnetsNavn}`).equal(element.text())
    );
    getTestElement('oppsummering-barnets-fødselsnummer').should((element) =>
        expect(`Fødselsnummer: ${barnetsFødselsnummer}`).equal(element.text())
    );

    getTestElement('oppsummering-barn-relasjon').should((element) =>
        expect(`Du er ${expectedRelasjonTilBarn} til barnet`).equal(element.text())
    );
};

export const oppsummeringTestAnnetBarnUtenFnr = () => {
    getTestElement('oppsummering-barnets-fødselsdato').should((element) =>
        expect(`Fødselsdato: ${barnetsFødselsdato}`).equal(element.text())
    );
    getTestElement('oppsummering-barnets-navn').should((element) =>
        expect(`Navn: ${barnetsNavn}`).equal(element.text())
    );

    getTestElement('oppsummering-årsakManglerIdentitetsnummer').should((element) =>
        expect(`Oppgitt grunn for at barnet ikke har fødselsnummer/D-nummer: ${årsakManglerIdentitetsnummer}`).equal(
            element.text()
        )
    );

    getTestElement('oppsummering-barn-relasjon-annet-beskrivelse').should((element) =>
        expect(relasjonAnnetBeskrivelse).equal(element.text())
    );
};

export const fyllUtOmBarnSteg = (testType) => {
    it('STEG 1: Barn', () => {
        switch (testType) {
            case 'komplett':
                fyllUtAnnetBarnUtenFnr();
                break;
            case 'barnMedFnr':
                oppsummeringTestAnnetBarnMedFnr();
                break;
            default:
                fyllUtBarnRegistrert();
                break;
        }
    });
};

export const oppsummeringTestOmBarn = (testType) => {
    switch (testType) {
        case 'komplett':
            oppsummeringTestAnnetBarnUtenFnr();
            break;
        case 'barnMedFnr':
            oppsummeringTestAnnetBarnMedFnr();
            break;
        default:
            oppsummeringTestRegistrertBarn();
            break;
    }
};
