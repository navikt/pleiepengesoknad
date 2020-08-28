import * as React from 'react';
import { useState } from 'react';
import { BarnResponse } from '../../types/ListeAvBarn';
import { PersonResponse } from '../../types/PersonResponse';
import { isMellomlagringData, MaybeMellomlagringData } from '../../types/storage';
import { initialValues, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { StepID } from '../../config/stepConfig';
import IkkeMyndigPage from '../pages/ikke-myndig-page/IkkeMyndigPage';
import { FormikProps } from 'formik';
import { SøkerdataContextProvider } from '../../context/SøkerdataContext';
import PleiepengesøknadContent from '../pleiepengesøknad-content/PleiepengesøknadContent';
import { Arbeidsgiver } from '../../types/ArbeidsgiverResponse';
import ApplicationFormComponents from '../../types/ApplicationFormComponents';

interface Props {
    personResponse: PersonResponse;
    barnResponse: BarnResponse;
    maybeMellomlagringData: MaybeMellomlagringData;
}

const Something: React.FC<Props> = ({ personResponse, barnResponse, maybeMellomlagringData }: Props) => {
    const [arbeidsgivere, setArbeidsgivere] = useState<Arbeidsgiver[] | undefined>(undefined);

    const formdata: PleiepengesøknadFormData = isMellomlagringData(maybeMellomlagringData)
        ? maybeMellomlagringData.formData
        : initialValues;

    const maybeStepID: StepID | undefined = isMellomlagringData(maybeMellomlagringData)
        ? maybeMellomlagringData.metadata.lastStepID
        : undefined;

    if (!personResponse.myndig) {
        return <IkkeMyndigPage />;
    }

    return (
        <ApplicationFormComponents.FormikWrapper
            initialValues={formdata}
            onSubmit={() => null}
            renderForm={(formikProps: FormikProps<PleiepengesøknadFormData>) => (
                <SøkerdataContextProvider
                    value={{
                        arbeidsgivere: arbeidsgivere,
                        setArbeidsgivere: setArbeidsgivere,
                        person: personResponse,
                        barn: barnResponse.barn,
                    }}>
                    <PleiepengesøknadContent lastStepID={maybeStepID} formikProps={formikProps} />
                </SøkerdataContextProvider>
            )}
        />
    );
};

export default Something;
