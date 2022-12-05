import React from 'react';
import { useIntl } from 'react-intl';
import { SIFCommonPageKey, useLogSidevisning } from '@navikt/sif-common-amplitude';
import Page from '@navikt/sif-common-core/lib/components/page/Page';
import bemHelper from '@navikt/sif-common-core/lib/utils/bemUtils';
import intlHelper from '@navikt/sif-common-core/lib/utils/intlUtils';
import { StepConfigProps } from '../../søknad/søknadStepsConfig';
import { Søker } from '../../types';
import OmSøknaden from './components/OmSøknaden';
import VelkommenGuide from './components/VelkommenGuide';
import SamtykkeForm from './SamtykkeForm';
import './welcomingPage.less';

const bem = bemHelper('welcomingPage');

type Props = Omit<StepConfigProps, 'formValues'> & { søker: Søker };

const WelcomingPage: React.FunctionComponent<Props> = ({ onValidSubmit, søker }) => {
    const intl = useIntl();
    useLogSidevisning(SIFCommonPageKey.velkommen);

    return (
        <>
            <Page title={intlHelper(intl, 'welcomingPage.sidetittel')} className={bem.block}>
                <VelkommenGuide navn={søker.fornavn} />
                <OmSøknaden />
                <SamtykkeForm onConfirm={onValidSubmit} />
            </Page>
        </>
    );
};

export default WelcomingPage;
