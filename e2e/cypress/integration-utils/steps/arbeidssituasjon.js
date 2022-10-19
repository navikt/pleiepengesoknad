const {
    getTestElement,
    selectRadioNo,
    selectRadioYes,
    setInputTime,
    getInputByName,
    getElement,
    clickFortsett,
    getTestElementByType,
} = require('../utils');
const dayjs = require('dayjs');
const isoWeek = require('dayjs/plugin/isoWeek');
dayjs.extend(isoWeek);

const expectedOrgNavn = 'Karis gullfisker'; // avhenger av mock data
const expectedOrgNummer = '112233445'; // avhenger av mock data
const arbeidsgiverenAnnetEQS = 'Google';
const expectedNæringstype = 'Fisker';
const navnPåVirksomheten = 'Fisk Virksomhet';
const expectedutenlandskNæringLand = 'Belgia';
const virksomhetensOrganisasjonsnummer = '12345Yfjhj98';
const dato = dayjs().startOf('day').subtract(1, 'day');
const fraDatoTilDato = dato.format('DD.MM.YYYY');
const expectedOpptjeningLand = 'Belgia';
const expectedOpptjeningType = 'arbeidstaker';
const expectedOpptjeningDato = `${dato.format('DD. MMM YYYY')} - ${dato.format('DD. MMM YYYY')}`;

const fyllUtNormalarbeidstidFasteDager = () => {
    selectRadioYes('jobber-heltid');
    selectRadioNo('jobber-fast-helg');
    selectRadioYes('like-mange-timer-hver-uke');
    selectRadioYes('er-faste-ukedager');
    setInputTime('tid-faste-ukedager__monday', 5, 0);
    setInputTime('tid-faste-ukedager__tuesday', 2, 0);
    setInputTime('tid-faste-ukedager__wednesday', 5, 0);
    setInputTime('tid-faste-ukedager__friday', 5, 0);
};

const fyllUtArbeidssituasjonAnsatt = () => {
    getTestElement('arbeidssituasjonAnsatt').within(() => {
        selectRadioYes('er-ansatt');
        fyllUtNormalarbeidstidFasteDager();
    });
};

const fyllUtArbeidssituasjonIkkeAnsatt = () => {
    getTestElement('arbeidssituasjonAnsatt').within(() => {
        selectRadioNo('er-ansatt');
        selectRadioYes('sluttet-før-søknadsperiode');
    });
};

const fyllUtArbeidssituasjonFrilanser = () => {
    getTestElement('arbeidssituasjonFrilanser').within(() => {
        selectRadioNo('er-frilanser');
    });
};

const fyllUtArbeidssituasjonSelvstendig = () => {
    getTestElement('arbeidssituasjonSelvstendig').within(() => {
        selectRadioNo('er-selvstendig');
    });
};

const fyllUtArbeidssituasjonOpptjeningUtland = () => {
    getTestElement('arbeidssituasjonOpptjeningUtland').within(() => {
        selectRadioNo('har-opptjeningUtland');
    });
};

const fyllUtArbeidssituasjonOpptjeningUtlandKomplett = () => {
    getTestElement('arbeidssituasjonOpptjeningUtland').within(() => {
        selectRadioYes('har-opptjeningUtland');
    });
    getElement('button').contains('Legg til jobb i et annet EØS-land').click();
    cy.get('[aria-label="Jobbet i et annet EØS-land"]').within(() => {
        getInputByName('fom').click().type(fraDatoTilDato).blur();
        getInputByName('tom').click().type(fraDatoTilDato).blur();
        getElement('select').select(1);
        getTestElementByType('radio').eq(0).check({ force: true });
        getInputByName('navn').click().type(arbeidsgiverenAnnetEQS).blur();
        getElement('button').contains('Ok').click();
    });
};

const fyllUtArbeidssituasjonUtenlandskNæring = () => {
    getTestElement('arbeidssituasjonUtenlandskNæring').within(() => {
        selectRadioNo('har-utenlandskNæring');
    });
};

const fyllUtArbeidssituasjonUtenlandskNæringKomplett = () => {
    getTestElement('arbeidssituasjonUtenlandskNæring').within(() => {
        selectRadioYes('har-utenlandskNæring');
    });
    getElement('button').contains('Legg til næringsvirksomhet i et annet EØS-land').click();
    cy.get('[aria-label="Virksomhet"]').within(() => {
        getTestElementByType('radio').eq(0).check({ force: true });
        getInputByName('navnPåVirksomheten').click().type(navnPåVirksomheten).blur();
        getElement('select').select(1);
        getInputByName('identifikasjonsnummer').click().type(virksomhetensOrganisasjonsnummer).blur();
        getInputByName('fraOgMed').click().type(fraDatoTilDato).blur();
        getTestElementByType('checkbox').check({ force: true });
        getElement('button').contains('Ok').click();
    });
};

const fyllUtArbeidssituasjonVerneplikt = () => {
    selectRadioNo('verneplikt');
};
export const fyllUtArbeidssituasjonSteg = () => {
    fyllUtArbeidssituasjonAnsatt();
    fyllUtArbeidssituasjonFrilanser();
    fyllUtArbeidssituasjonSelvstendig();
    fyllUtArbeidssituasjonOpptjeningUtland();
    fyllUtArbeidssituasjonUtenlandskNæring();
    clickFortsett();
};

export const fyllUtArbeidssituasjonStegKomplett = () => {
    fyllUtArbeidssituasjonAnsatt();
    fyllUtArbeidssituasjonFrilanser();
    fyllUtArbeidssituasjonSelvstendig();
    fyllUtArbeidssituasjonOpptjeningUtlandKomplett();
    fyllUtArbeidssituasjonUtenlandskNæringKomplett();
    clickFortsett();
};

const fyllUtArbeidssituasjonStegEnkelt = () => {
    fyllUtArbeidssituasjonIkkeAnsatt();
    fyllUtArbeidssituasjonFrilanser();
    fyllUtArbeidssituasjonSelvstendig();
    fyllUtArbeidssituasjonOpptjeningUtland();
    fyllUtArbeidssituasjonUtenlandskNæring();
    fyllUtArbeidssituasjonVerneplikt();
    clickFortsett();
};

export const fyllUtArbeidssituasjonFrilanserYes = () => {
    getTestElement('arbeidssituasjonFrilanser').within(() => {
        selectRadioYes('er-frilanser');
    });
    const fraDato = dayjs().startOf('month').subtract(1, 'month').startOf('isoWeek').format('YYYY-MM-DD');
    getTestElement('er-frilanser-startdato').click().type(fraDato).blur();
    selectRadioYes('er-frilanser-erFortsattFrilanser');
    getInputByName('frilans.arbeidsforhold.normalarbeidstid.timerPerUke').click().type(5).blur();
};

export const oppsummeringTestArbeidssituasjonKomplett = () => {
    getTestElement('oppsummering-arbeidssituasjon-ansatt').within(() => {
        getElement('h3').should((element) =>
            expect(`${expectedOrgNavn} (organisasjonsnummer ${expectedOrgNummer})`).equal(element.text())
        );

        getElement('li')
            .eq(0)
            .should((element) => expect('Er ansatt').equal(element.text()));
        getElement('li')
            .eq(1)
            .should((element) => expect('Arbeider heltid').equal(element.text()));
        getElement('li')
            .eq(2)
            .should((element) => expect('Arbeider ikke fast lørdag og/eller søndag').equal(element.text()));
    });

    getTestElement('oppsummering-opptjeningUtland').within(() => {
        getTestElement('oppsummering-opptjeningUtland-date').should((element) =>
            expect(expectedOpptjeningDato).equal(element.text())
        );
        getTestElement('oppsummering-opptjeningUtland-info').should((element) =>
            expect(
                `Jobbet i ${expectedOpptjeningLand} som ${expectedOpptjeningType} hos ${arbeidsgiverenAnnetEQS}`
            ).equal(element.text())
        );
    });
    getTestElement('oppsummering-utenlandskNæring').within(() => {
        getTestElement('oppsummering-utenlandskNæring-navn').should((element) =>
            expect(`Navn: ${navnPåVirksomheten}.`).equal(element.text())
        );
        getTestElement('oppsummering-utenlandskNæring-næringstype').should((element) =>
            expect(`Næringstype: ${expectedNæringstype}.`).equal(element.text())
        );
        getTestElement('oppsummering-utenlandskNæring-registrertILand').should((element) =>
            expect(
                `Registrert i ${expectedutenlandskNæringLand} (organisasjonsnummer ${virksomhetensOrganisasjonsnummer}).`
            ).equal(element.text())
        );

        getTestElement('oppsummering-utenlandskNæring-tidsinfo').should((element) =>
            expect(`Startet ${fraDatoTilDato} (pågående).`).equal(element.text())
        );
    });
};

export const fyllUtArbeidssituasjon = (testType) => {
    it('STEG 3: Arbeidssituasjon', () => {
        switch (testType) {
            case 'komplett':
                fyllUtArbeidssituasjonStegKomplett();
                break;
            case 'full':
                fyllUtArbeidssituasjonSteg();
                break;
            default:
                fyllUtArbeidssituasjonStegEnkelt();
                break;
        }
    });
};

export const oppsummeringTestArbeidssituasjonSteg = (testType) => {
    switch (testType) {
        case 'komplett':
            oppsummeringTestArbeidssituasjonKomplett();
            break;
    }
};
