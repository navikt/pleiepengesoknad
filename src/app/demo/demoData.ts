const demoSøkerdata = {
    barn: [
        {
            fødselsdato: new Date('2008-01-01'),
            fornavn: 'Jan',
            mellomnavn: 'Testperson',
            etternavn: 'Hansen',
            aktørId: '1'
        },
        {
            fødselsdato: new Date('2014-05-02'),
            fornavn: 'Kari',
            mellomnavn: 'Testperson',
            etternavn: 'Hansen',
            aktørId: '2'
        }
    ],
    arbeidsgivere: [
        { navn: 'Bakeriet søtt og godt', organisasjonsnummer: '123451234' },
        { navn: 'Tromsø kommune', organisasjonsnummer: '123451236' }
    ],
    person: {
        fornavn: 'Testperson',
        mellomnavn: '',
        kjønn: 'k',
        etternavn: 'Hansen',
        fødselsnummer: '12345123456',
        myndig: true
    }
};

export default demoSøkerdata;
