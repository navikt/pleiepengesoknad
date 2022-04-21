export interface ArbeidstidRegistrertLogProps {
    onArbeidstidEnkeltdagRegistrert?: (info: { antallDager: number }) => void;
    onArbeidPeriodeRegistrert?: (info: { verdi: 'prosent' | 'ukeplan'; prosent?: string }) => void;
}
