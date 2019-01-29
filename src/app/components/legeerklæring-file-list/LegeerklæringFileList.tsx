import * as React from 'react';
import { connect } from 'formik';
import { Field } from '../../types/PleiepengesøknadFormData';
import FileList from './../file-list/FileList';
import { removeElementFromArray } from '../../utils/listHelper';
import { ConnectedFormikProps } from '../../types/ConnectedFormikProps';

type LegeerklæringFileListProps = ConnectedFormikProps<Field>;
const LegeerklæringFileList: React.FunctionComponent<LegeerklæringFileListProps> = ({
    formik: { values, setFieldValue }
}) => {
    const legeerklæring: Attachment[] = values[Field.legeerklæring];
    return (
        <FileList
            files={legeerklæring.map(({ file }) => file)}
            onRemoveFileClick={(file: File) =>
                setFieldValue(Field.legeerklæring, removeElementFromArray(file, legeerklæring))
            }
            deleteButtonAriaLabel="Fjern vedlegg"
        />
    );
};

export default connect<{}, Field>(LegeerklæringFileList);
