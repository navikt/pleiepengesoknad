import { InputTime } from '@navikt/sif-common-formik/lib';
import React from 'react';
import FormattedTimeText from '../../../components/formatted-time-text/FormattedTimeText';
import './tidArbeidEnkeltdag.less';

interface Props {
    tid: InputTime;
    prosent?: number;
}

const TidArbeidEnkeltdag: React.FunctionComponent<Props> = ({ prosent, tid }) => {
    if (prosent !== undefined && prosent > 0) {
        return (
            <span className="tidArbeidEnkeltdag">
                <span className={'tidArbeidEnkeltdag__prosent'}>{prosent} %</span>
                <span className="tidArbeidEnkeltdag__timer">
                    (<FormattedTimeText time={tid} />)
                </span>
            </span>
        );
    }
    if (tid.hours === '0' && tid.minutes === '0') {
        return <></>;
    }
    return <FormattedTimeText time={tid} />;
};

export default TidArbeidEnkeltdag;
