import { contextConfig, gotoStep } from '../integration-utils/contextConfig';
import { mellomlagring } from '../integration-utils/mocks/mellomlagring';
import {
    fyllUtArbeidssituasjonErIkkeFrilanser,
    fyllUtArbeidssituasjonFrilanser,
} from '../integration-utils/steps/arbeidssituasjon/arbeidssituasjon';
import { fyllUtArbeidssituasjonAnsatt } from '../integration-utils/steps/arbeidssituasjon/arbeidssituasjonAnsatt';
import { clickFortsett, getTestElement } from '../integration-utils/utils';

const gåTilOppsummeringFraArbeidssituasjon = () => {
    /** cy.visit reloads, og da må en blir mellomlagring feil - fake click fortsett */
    clickFortsett();
    cy.wait(100);
    clickFortsett();
    cy.wait(100);
    clickFortsett();
    cy.wait(100);
    clickFortsett();
    cy.wait(100);
    clickFortsett();
};

const ansattHeleSøknadsperiode = () => {
    it('er ansatt og jobber 40 timer hos arbeidsgiver i perioden', () => {
        gotoStep('arbeidssituasjon');
        fyllUtArbeidssituasjonAnsatt({ erAnsatt: true, sluttetFørSøknadsperiode: false, timerPerUke: '40' });
        gåTilOppsummeringFraArbeidssituasjon();

        const el = getTestElement('arbeidssituasjon-ansatt-947064649');
        el.should('contain', 'Er ansatt');
        el.should('contain', 'Jobber normalt 40 timer per uke');
    });
};

const ansattISøknadsperiode = () => {
    it('er ikke ansatt lenger, men sluttet inne i søknadsperioden perioden. Jobber 30 timer i uken.', () => {
        gotoStep('arbeidssituasjon');
        fyllUtArbeidssituasjonAnsatt({ erAnsatt: false, sluttetFørSøknadsperiode: false, timerPerUke: '30' });
        gåTilOppsummeringFraArbeidssituasjon();

        const el = getTestElement('arbeidssituasjon-ansatt-947064649');
        el.should('contain', 'Er ikke lenger ansatt');
        el.should('contain', 'Jobbet normalt 30 timer per uke');
        el.should('contain', 'Sluttet etter');
    });
};

const sluttetFørSøknadsperiode = () => {
    it('er ikke ansatt og sluttet før søknadsperiode', () => {
        gotoStep('arbeidssituasjon');
        fyllUtArbeidssituasjonAnsatt({ erAnsatt: false, sluttetFørSøknadsperiode: true });
        gåTilOppsummeringFraArbeidssituasjon();

        const el = getTestElement('arbeidssituasjon-ansatt-947064649');
        el.should('contain', 'Er ikke lenger ansatt');
        el.should('contain', 'Sluttet før');
    });
};

describe('Arbeidssituasjoner hos arbeidsgiver', () => {
    contextConfig({ mellomlagring });
    ansattHeleSøknadsperiode();
    ansattISøknadsperiode();
    sluttetFørSøknadsperiode();
});

const erUregistrertFrilanser = () => {
    it('er frilanser', () => {
        gotoStep('arbeidssituasjon');
        fyllUtArbeidssituasjonFrilanser();
        gåTilOppsummeringFraArbeidssituasjon();

        const el = getTestElement('arbeidssituasjon-frilanser');
        el.should('contain', 'Startet som frilanser 01.10.2010');
        el.should('contain', 'Er fortsatt frilanser');
        el.should('contain', 'Jobber normalt 5 timer per uke');
    });
};

const erIkkeFrilanser = () => {
    it.only('er IKKE frilanser', () => {
        gotoStep('arbeidssituasjon');
        fyllUtArbeidssituasjonErIkkeFrilanser();
        gåTilOppsummeringFraArbeidssituasjon();

        const el = getTestElement('arbeidssituasjon-frilanser');
        el.should('contain', 'Er ikke frilanser i perioden det søkes for');
    });
};

describe('Arbeidssituasjoner som ny frilanser (ikke registrerte oppdrag)', () => {
    contextConfig({ mellomlagring });
    erUregistrertFrilanser();
    // harVærtFrilanserISøknadsperioden();
});

describe('Arbeidssituasjoner - er ikke frilanser', () => {
    contextConfig({ mellomlagring });
    erIkkeFrilanser();
});
