import * as React from 'react';
import AppEssentialsLoader from '../app-essentials-loader/AppEssentialsLoader';
import FormikWrapper from '../formik-wrapper/FormikWrapper';
import PleiepengesøknadContent from '../pleiepengesøknad-content/PleiepengesøknadContent';
import IkkeMyndigPage from '../pages/ikke-myndig-page/IkkeMyndigPage';
import { PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';

const renderPleiepengesøknadContent = (mellomlagring: PleiepengesøknadFormData) => (
    <FormikWrapper mellomlagring={mellomlagring} contentRenderer={(formikProps) => <PleiepengesøknadContent formikProps={formikProps} />} />
);

const Pleiepengesøknad = () => (
    <AppEssentialsLoader
        contentLoadedRenderer={(mellomlagring, søkerdata) => {
            if (søkerdata) {
                const { person } = søkerdata;
                if (!person.myndig) {
                    return <IkkeMyndigPage />;
                }
            }
            return renderPleiepengesøknadContent(mellomlagring);
        }}
    />
);
export default Pleiepengesøknad;
