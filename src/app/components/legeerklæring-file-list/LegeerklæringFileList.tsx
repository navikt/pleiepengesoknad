import * as React from 'react';
import { connect, FormikProps } from 'formik';
import { Field } from '../../types/PleiepengesøknadFormData';
import FileList from './../file-list/FileList';
import { removeElementFromArray } from '../../utils/listHelper';

interface LegeerklæringFileListProps {
    formik: FormikProps<Field>;
}

const LegeerklæringFileList: React.FunctionComponent<LegeerklæringFileListProps> = ({
    formik: { values, setFieldValue }
}) => {
    const legeerklæring = values[Field.legeerklæring];
    return (
        <FileList
            files={legeerklæring}
            onRemoveFileClick={(file: File) =>
                setFieldValue(Field.legeerklæring, removeElementFromArray(file, legeerklæring))
            }
        />
    );
};

export default connect<any, LegeerklæringFileListProps>(LegeerklæringFileList);
