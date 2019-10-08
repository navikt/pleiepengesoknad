interface Lenker {
    papirskjemaPrivat: string;
    vilkårPleiepenger: string;
    personvern: string;
    rettOgPlikt: string;
    saksbehandlingstider: string;
}

const LenkerBokmål: Lenker = {
    papirskjemaPrivat: 'https://www.nav.no/soknader/nb/person/familie/omsorgspenger/NAV%2009-11.05/brev',
    vilkårPleiepenger: 'https://www.nav.no/no/Person/Familie/Sykdom+i+familien/pleiepenger+for+pleie+av+sykt+barn',
    personvern:
        'https://www.nav.no/no/NAV+og+samfunn/Om+NAV/personvern-i-arbeids-og-velferdsetaten/personvernerkl%C3%A6ring-for-arbeids-og-velferdsetaten',
    rettOgPlikt: 'https://nav.no/rettOgPlikt',
    saksbehandlingstider: 'https://www.nav.no/no/NAV+og+samfunn/Om+NAV/Saksbehandlingstider+i+NAV'
};

const LenkerNynorsk: Partial<Lenker> = {
    papirskjemaPrivat: 'https://www.nav.no/soknader/nb/person/familie/omsorgspenger/NAV%2009-11.05/brev',
    vilkårPleiepenger:
        'https://www.nav.no/no/Person/Familie/Sykdom+i+familien/Nynorsk/pleiepengar+for+pleie+av+sjukt+barn',
    rettOgPlikt:
        'https://www.nav.no/no/NAV+og+samfunn/Om+NAV/Nynorsk/du-har-plikt-til-%C3%A5-gje-nav-riktige-opplysningar'
};

const getLenker = (locale?: string): Lenker => {
    switch (locale) {
        case 'nn':
            return {
                ...LenkerBokmål,
                ...LenkerNynorsk
            };
        default:
            return LenkerBokmål;
    }
};

export default getLenker;
