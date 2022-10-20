import { gotoStep } from '../../contextConfig';
import { clickFortsett, getTestElement } from '../../utils';
import { ArbeidssituasjonAnsattProfil, fyllUtArbeidssituasjonAnsatt } from './arbeidssituasjonAnsatt';

const testArbeidssituasjonAnsatt = () => {
    it('Arbeidssituasjon ansatt', () => {
        const el = getTestElement('arbeidssituasjon-ansatt-947064649');
        el.should('contain', 'Er ansatt');
        el.should('contain', 'Jobber normalt 10 timer per uke');
    });
};

const testArbeidssituasjonFrilanser = () => {
    it('Arbeidssituasjon frilanser', () => {
        const el = getTestElement('arbeidssituasjon-frilanser');
        el.should('contain', 'Startet som frilanser 01.10.2010');
        el.should('contain', 'Er fortsatt frilanser');
        el.should('contain', 'Jobber normalt 20 timer per uke');
    });
};

const testArbeidssituasjonSN = () => {
    it('Arbeidssituasjon SN', () => {
        const el = getTestElement('arbeidssituasjon-sn');
        el.should('contain', 'Er ikke selvstendig næringsdrivende i perioden det søkes for');
    });
};

export const oppsummeringTestArbeidssituasjon = () => {
    testArbeidssituasjonAnsatt();
    testArbeidssituasjonFrilanser();
    // testArbeidssituasjonSN();

    it('sluttet før søknadsperiode', () => {
        gotoStep('arbeidssituasjon');
        fyllUtArbeidssituasjonAnsatt(ArbeidssituasjonAnsattProfil.sluttetFørSøknadsperiode);
        // clickFortsett();
        // gotoStep('oppsummering');
    });
};
