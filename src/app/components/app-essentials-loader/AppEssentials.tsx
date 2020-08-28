import * as React from 'react';
import { useState } from 'react';
import { Attachment } from 'common/types/Attachment';
import { StepID } from '../../config/stepConfig';
import { SøkerdataContextProvider } from '../../context/SøkerdataContext';
import { initialValues, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import { MELLOMLAGRING_VERSION, MellomlagringData } from '../../types/storage';
import { Arbeidsgiver, Søkerdata } from '../../types/Søkerdata';
import { PersonResponse } from '../../types/PersonResponse';
import { ListeAvBarn } from '../../types/ListeAvBarn';

export const VERIFY_MELLOMLAGRING_VERSION = true;

interface Props {
    person: PersonResponse;
    barn: ListeAvBarn;
    mellomlagringData: MellomlagringData;
    contentLoadedRenderer: (
        initialValues: PleiepengesøknadFormData,
        lastStepID?: StepID,
        søkerdata?: Søkerdata
    ) => React.ReactNode;
}

interface State {
    arbeidsgivere?: Arbeidsgiver[];
}

const getValidAttachments = (attachments: Attachment[] = []): Attachment[] => {
    return attachments.filter((a) => {
        return a.file?.name !== undefined;
    });
};

const getValidMellomlagring = (data?: MellomlagringData): MellomlagringData | undefined => {
    if (VERIFY_MELLOMLAGRING_VERSION) {
        if (data?.metadata?.version === MELLOMLAGRING_VERSION) {
            return data;
        }
        return undefined;
    }
    return data;
};

export const AppEssentials = (props: Props) => {
    const { person, barn, mellomlagringData, contentLoadedRenderer } = props;
    const [state, setState] = useState<State>({});

    function updateArbeidsgivere(arbeidsgivere: Arbeidsgiver[]) {
        setState({ arbeidsgivere });
    }

    const mellomlagring = getValidMellomlagring(mellomlagringData);
    const formData: PleiepengesøknadFormData = mellomlagring?.formData
        ? {
              ...mellomlagring.formData,
              legeerklæring: getValidAttachments(mellomlagring.formData.legeerklæring),
          }
        : initialValues;
    const søkerdata: Søkerdata = {
        person: person,
        barn: barn,
        setArbeidsgivere: updateArbeidsgivere,
        arbeidsgivere: state.arbeidsgivere,
    };
    return (
        <>
            <SøkerdataContextProvider value={søkerdata}>
                {contentLoadedRenderer(
                    formData || { ...initialValues },
                    mellomlagring?.metadata?.lastStepID,
                    søkerdata
                )}
            </SøkerdataContextProvider>
        </>
    );
};

export default AppEssentials;
