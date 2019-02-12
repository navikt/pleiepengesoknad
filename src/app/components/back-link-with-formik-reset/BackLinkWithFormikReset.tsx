import * as React from 'react';
import BackLink from '../back-link/BackLink';
import { connect, FormikProps } from 'formik';
import { History } from 'history';

interface BackLinkWithFormikResetProps {
    href: string;
    className?: string;
}

type Props = BackLinkWithFormikResetProps & { formik: FormikProps<any> };

const BackLinkWithFormikReset: React.FunctionComponent<Props> = ({ formik, href, className }) => {
    const { setFormikState } = formik;
    return (
        <BackLink
            href={href}
            className={className}
            onClick={(nextHref: string, history: History, event: React.SyntheticEvent) => {
                event.preventDefault();
                setFormikState({ submitCount: 0 });
                history.push(nextHref);
            }}
        />
    );
};

export default connect<BackLinkWithFormikResetProps, any>(BackLinkWithFormikReset);
