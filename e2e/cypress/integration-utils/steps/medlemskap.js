const dayjs = require('dayjs');
const isoWeek = require('dayjs/plugin/isoWeek');
const locale = require('dayjs/locale/nb');
dayjs.extend(isoWeek);
dayjs.locale(locale);

const {
    getTestElement,
    clickFortsett,
    selectRadioYes,
    getInputByName,
    getElement,
    getTestElementByClass,
    selectRadioNo,
} = require('../utils');

const fomTomMedlemskapSiste12 = dayjs().startOf('day').subtract(1, 'day').format('YYYY-MM-DD');
const fomTomMedlemskapNeste12 = dayjs().startOf('day').add(1, 'day').format('YYYY-MM-DD');
const expectedDateMedlemskapSiste12 = `${dayjs(fomTomMedlemskapSiste12).format('D. MMM YYYY')} - ${dayjs(
    fomTomMedlemskapSiste12
).format('D. MMM YYYY')}`;
const expectedDateMedlemskapNeste12 = `${dayjs(fomTomMedlemskapNeste12).format('D. MMM YYYY')} - ${dayjs(
    fomTomMedlemskapNeste12
).format('D. MMM YYYY')}`;
const expectedLand = 'Albania'; // Land #2 i listen

const fyllUtMedlemskapEnkelt = () => {
    selectRadioNo('medlemsskap-annetLandSiste12');
    selectRadioNo('medlemsskap-annetLandNeste12');
    clickFortsett();
};

const fyllUtMedlemskap = () => {
    selectRadioYes('medlemsskap-annetLandSiste12');

    getTestElement('bostedUtlandList-annetLandSiste12').within(() => {
        getElement('button').contains('Legg til nytt utenlandsopphold').click();
    });
    getInputByName('fom').click().type(fomTomMedlemskapSiste12).blur();
    getInputByName('tom').click().type(fomTomMedlemskapSiste12).blur();
    getElement('select').select(2); // Valg land #2 fra listen
    getElement('button').contains('Ok').click();

    selectRadioYes('medlemsskap-annetLandNeste12');

    getTestElement('bostedUtlandList-annetLandNeste12').within(() => {
        getElement('button').contains('Legg til nytt utenlandsopphold').click();
    });

    getInputByName('fom').click().type(fomTomMedlemskapNeste12).blur();
    getInputByName('tom').click().type(fomTomMedlemskapNeste12).blur();
    getElement('select').select(2); // Valg land #2 fra listen
    getElement('button').contains('Ok').click();

    clickFortsett();
};

const oppsummeringTestMedlemskapEnkelt = () => {
    getTestElement('oppsummering-medlemskap-utlandetSiste12').should((element) => expect('Nei').equal(element.text()));
    getTestElement('oppsummering-medlemskap-utlandetNeste12').should((element) => expect('Nei').equal(element.text()));
};

const oppsummeringTestMedlemskap = () => {
    getTestElement('oppsummering-medlemskap-utlandetSiste12').should((element) => expect('Ja').equal(element.text()));
    getTestElement('oppsummering-medlemskap-utlandetSiste12-list').within(() => {
        getTestElementByClass('utenlandsoppholdSummaryItem__dates').should((element) =>
            expect(expectedDateMedlemskapSiste12).equal(element.text())
        );
        getTestElementByClass('utenlandsoppholdSummaryItem__country').should((element) =>
            expect(expectedLand).equal(element.text())
        );
    });

    getTestElement('oppsummering-medlemskap-utlandetNeste12').should((element) => expect('Ja').equal(element.text()));
    getTestElement('oppsummering-medlemskap-utlandetNeste12-list').within(() => {
        getTestElementByClass('utenlandsoppholdSummaryItem__dates').should((element) =>
            expect(expectedDateMedlemskapNeste12).equal(element.text())
        );
        getTestElementByClass('utenlandsoppholdSummaryItem__country').should((element) =>
            expect(expectedLand).equal(element.text())
        );
    });
};

export const fyllUtMedlemskapSteg = (testType) => {
    it('STEG 5: Medlemskap', () => {
        switch (testType) {
            case 'full':
                fyllUtMedlemskap();
                break;
            default:
                fyllUtMedlemskapEnkelt();
                break;
        }
    });
};

export const oppsummeringTestMedlemskapSteg = (testType) => {
    switch (testType) {
        case 'full':
            oppsummeringTestMedlemskap();
            break;
        default:
            oppsummeringTestMedlemskapEnkelt();
            break;
    }
};
