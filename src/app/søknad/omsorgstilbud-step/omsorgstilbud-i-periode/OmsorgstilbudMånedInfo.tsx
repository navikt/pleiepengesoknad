import React from 'react';
import { FormattedMessage } from 'react-intl';
import FormBlock from '@navikt/sif-common-core/lib/components/form-block/FormBlock';
import { DateRange } from '@navikt/sif-common-formik/lib';
import dayjs from 'dayjs';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Knapp } from 'nav-frontend-knapper';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { inputTimeDurationIsZero } from '../../../utils/common/inputTimeUtils';
import FormattedTimeText from '../../../components/formatted-time-text/FormattedTimeText';
import TidsbrukKalender from '../../../components/tidsbruk-kalender/TidsbrukKalender';
import { DatoTidMap } from '../../../types';
import { getDagerMedTidITidsrom } from '../../../utils/datoTidUtils';

interface Props {
    måned: DateRange;
    tidOmsorgstilbud: DatoTidMap;
    editLabel: string;
    addLabel: string;
    utilgjengeligeDatoer?: Date[];
    månedTittelHeadingLevel?: number;
    åpentEkspanderbartPanel?: boolean;
    onRequestEdit: (tid: DatoTidMap) => void;
}

const OmsorgstilbudMånedInfo: React.FunctionComponent<Props> = ({
    måned,
    tidOmsorgstilbud,
    utilgjengeligeDatoer,
    månedTittelHeadingLevel = 2,
    onRequestEdit,
    addLabel,
    editLabel,
    åpentEkspanderbartPanel,
}) => {
    const dager: DatoTidMap = getDagerMedTidITidsrom(tidOmsorgstilbud, måned);
    const dagerMedRegistrertOmsorgstilbud: string[] = Object.keys(dager).filter((key) => {
        const datoTid = dager[key];
        return (
            datoTid !== undefined &&
            datoTid.varighet !== undefined &&
            inputTimeDurationIsZero(datoTid.varighet) === false
        );
    });

    return (
        <Ekspanderbartpanel
            renderContentWhenClosed={false}
            apen={åpentEkspanderbartPanel}
            tittel={
                <>
                    <Element tag={`h${månedTittelHeadingLevel}`}>
                        <FormattedMessage
                            id="omsorgstilbud.ukeOgÅr"
                            values={{ ukeOgÅr: dayjs(måned.from).format('MMMM YYYY') }}
                        />{' '}
                        <Normaltekst tag="div">
                            {dagerMedRegistrertOmsorgstilbud.length === 0 ? (
                                <FormattedMessage id="omsorgstilbud.ingenDagerRegistrert" />
                            ) : (
                                <FormattedMessage
                                    id="omsorgstilbud.iPeriodePanel.info"
                                    values={{ dager: dagerMedRegistrertOmsorgstilbud.length }}
                                />
                            )}
                        </Normaltekst>
                    </Element>
                </>
            }>
            <TidsbrukKalender
                periode={måned}
                dager={dager}
                utilgjengeligeDatoer={utilgjengeligeDatoer}
                skjulTommeDagerIListe={true}
                visEndringsinformasjon={false}
                tidRenderer={({ tid, prosent }) => {
                    if (prosent !== undefined && prosent > 0) {
                        return (
                            <>
                                <div>{prosent} %</div>
                                {1 + 1 === 2 && (
                                    <div className="beregnetTid">
                                        (<FormattedTimeText time={tid} />)
                                    </div>
                                )}
                            </>
                        );
                    }
                    if (tid.hours === '0' && tid.minutes === '0') {
                        return <></>;
                    }
                    return <FormattedTimeText time={tid} />;
                }}
            />
            <FormBlock margin="l">
                <Knapp htmlType="button" mini={true} onClick={() => onRequestEdit(tidOmsorgstilbud)}>
                    {dagerMedRegistrertOmsorgstilbud.length === 0 ? addLabel : editLabel}
                </Knapp>
            </FormBlock>
        </Ekspanderbartpanel>
    );
};

export default OmsorgstilbudMånedInfo;
