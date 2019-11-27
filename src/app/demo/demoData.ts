const demoSøkerdata = {
    barn: [
        {
            fodselsdato: new Date('2008-01-01'),
            fornavn: 'Jan',
            mellomnavn: 'Testperson',
            etternavn: 'Hansen',
            aktoer_id: '1'
        },
        {
            fodselsdato: new Date('2014-05-02'),
            fornavn: 'Kari',
            mellomnavn: 'Testperson',
            etternavn: 'Hansen',
            aktoer_id: '2'
        }
    ],
    ansettelsesforhold: [
        { navn: 'Bakeriet søtt og godt', organisasjonsnummer: '123451234' },
        { navn: 'Tromsø kommune', organisasjonsnummer: '123451236' }
    ],
    person: {
        fornavn: 'Testperson',
        mellomnavn: '',
        kjonn: 'k',
        etternavn: 'Hansen',
        fodselsnummer: '12345123456',
        myndig: true
    }
};

export default demoSøkerdata;
