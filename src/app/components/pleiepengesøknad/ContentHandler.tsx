import * as React from 'react';
import { PersonResponse } from '../../types/PersonResponse';
import { BarnResponse } from '../../types/BarnResponse';
import { MaybeMellomlagringData } from '../../types/storage';
import IkkeMyndigPage from '../pages/ikke-myndig-page/IkkeMyndigPage';
import MellomlagringsHandler from './MellomlagringsHandler';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';
import ApplicationFormComponents from '../../types/ApplicationFormComponents';
import { SøkerdataContextProvider } from '../../context/SøkerdataContext';
import PleiepengesøknadRoutes from '../pleiepengesøknad-content/PleiepengesøknadContent';

const ContentHandler = ([personResponse, barnResponse, maybeMellomlagringData]: [
    PersonResponse,
    BarnResponse,
    MaybeMellomlagringData
]): React.ReactNode => {
    if (!personResponse.myndig) {
        return <IkkeMyndigPage />;
    }
    return (
        <MellomlagringsHandler
            maybeMellomlagringData={maybeMellomlagringData}
            render={(formdata: PleiepengesøknadFormData) => {
                return (
                    <ApplicationFormComponents.FormikWrapper
                        initialValues={formdata}
                        onSubmit={() => null}
                        renderForm={() => (
                            <SøkerdataContextProvider
                                value={{
                                    person: personResponse,
                                    barn: barnResponse.barn,
                                }}>
                                <PleiepengesøknadRoutes />
                            </SøkerdataContextProvider>
                        )}
                    />
                );
            }}
        />
    );
};

export default ContentHandler;
