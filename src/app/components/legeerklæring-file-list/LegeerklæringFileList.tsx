import * as React from 'react';
import { connect } from 'formik';
import { AppFormField } from '../../types/PleiepengesøknadFormData';
import { removeElementFromArray } from 'common/utils/listUtils';
import { ConnectedFormikProps } from '../../../common/types/ConnectedFormikProps';
import { deleteFile } from '../../api/api';
import { containsAnyUploadedAttachments, fileExtensionIsValid } from 'common/utils/attachmentUtils';
import Box from 'common/components/box/Box';
import { Normaltekst } from 'nav-frontend-typografi';
import AttachmentListWithDeletion from 'common/components/attachment-list-with-deletion/AttachmentListWithDeletion';
import { FormattedMessage } from 'react-intl';
import { Attachment } from 'common/types/Attachment';
import AttachmentList from 'common/components/attachment-list/AttachmentList';

interface LegeerklæringAttachmentListProps {
    includeDeletionFunctionality: boolean;
    wrapNoAttachmentsInBox?: boolean;
}

type Props = LegeerklæringAttachmentListProps & ConnectedFormikProps<AppFormField>;

const LegeerklæringAttachmentList: React.FunctionComponent<Props> = ({
    formik: { values, setFieldValue },
    wrapNoAttachmentsInBox,
    includeDeletionFunctionality
}) => {
    const legeerklæring: Attachment[] = values[AppFormField.legeerklæring].filter(({ file }: Attachment) =>
        fileExtensionIsValid(file.name)
    );

    if (!containsAnyUploadedAttachments(legeerklæring)) {
        const noAttachmentsText = (
            <Normaltekst>
                <FormattedMessage id="vedleggsliste.ingenLegeerklæringLastetOpp" />
            </Normaltekst>
        );
        if (wrapNoAttachmentsInBox) {
            return <Box margin="m">{noAttachmentsText}</Box>;
        }
        return noAttachmentsText;
    }

    if (includeDeletionFunctionality) {
        return (
            <AttachmentListWithDeletion
                attachments={legeerklæring}
                onRemoveAttachmentClick={(attachment: Attachment) => {
                    attachment.pending = true;
                    setFieldValue(AppFormField.legeerklæring, legeerklæring);
                    deleteFile(attachment.url!).then(
                        () => {
                            setFieldValue(
                                AppFormField.legeerklæring,
                                removeElementFromArray(attachment, legeerklæring)
                            );
                        },
                        () => {
                            setFieldValue(
                                AppFormField.legeerklæring,
                                removeElementFromArray(attachment, legeerklæring)
                            );
                        }
                    );
                }}
            />
        );
    } else {
        return <AttachmentList attachments={legeerklæring} />;
    }
};

export default connect<LegeerklæringAttachmentListProps, AppFormField>(LegeerklæringAttachmentList);
