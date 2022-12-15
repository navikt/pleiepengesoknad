import React from 'react';
import { useFormikContext } from 'formik';
import { StepConfigProps, StepID } from '../søknadStepsConfig';
import { SøkerdataContext } from '../../context/SøkerdataContext';
import { SøknadFormValues, SøknadFormField } from '../../types/SøknadFormValues';
import SøknadFormStep from '../SøknadFormStep';
import AnnetBarnPart from './AnnetBarnPart';
import RegistrertBarnPart from './RegistrertBarnPart';
import { Søkerdata } from '../../types/Søkerdata';
import {
    getTotalSizeOfAttachments,
    MAX_TOTAL_ATTACHMENT_SIZE_BYTES,
} from '@navikt/sif-common-core/lib/utils/attachmentUtils';
import { Attachment } from '@navikt/sif-common-core/lib/types/Attachment';

const harRegistrerteBarn = ({ barn }: Søkerdata) => {
    return barn && barn.length > 0;
};

const OpplysningerOmBarnetStep = ({ onValidSubmit }: StepConfigProps) => {
    const { values } = useFormikContext<SøknadFormValues>();

    const { søknadenGjelderEtAnnetBarn } = values;
    const søkerdata = React.useContext(SøkerdataContext);

    const attachments: Attachment[] = React.useMemo(() => {
        return values && values.fødselsattest ? values[SøknadFormField.fødselsattest] : [];
    }, [values]);
    const hasPendingUploads: boolean = attachments.find((a) => a.pending === true) !== undefined;
    const totalSize = getTotalSizeOfAttachments([...attachments, ...values.legeerklæring]);
    const attachmentsSizeOver24Mb = totalSize > MAX_TOTAL_ATTACHMENT_SIZE_BYTES;

    return (
        <SøknadFormStep
            id={StepID.OPPLYSNINGER_OM_BARNET}
            onValidFormSubmit={onValidSubmit}
            buttonDisabled={hasPendingUploads || attachmentsSizeOver24Mb}>
            {søkerdata && (
                <div data-testid="opplysninger-om-barnet">
                    {harRegistrerteBarn(søkerdata) && <RegistrertBarnPart søkersBarn={søkerdata.barn} />}
                    {(søknadenGjelderEtAnnetBarn || !harRegistrerteBarn(søkerdata)) && (
                        <AnnetBarnPart
                            formValues={values}
                            søkersFødselsnummer={søkerdata.søker.fødselsnummer}
                            attachments={attachments}
                            harRegistrerteBarn={harRegistrerteBarn(søkerdata)}
                        />
                    )}
                </div>
            )}
        </SøknadFormStep>
    );
};

export default OpplysningerOmBarnetStep;
