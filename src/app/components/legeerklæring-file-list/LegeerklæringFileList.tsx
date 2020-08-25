import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect, useFormikContext } from 'formik';
import { Normaltekst } from 'nav-frontend-typografi';
import AttachmentListWithDeletion from '@sif-common/core/components/attachment-list-with-deletion/AttachmentListWithDeletion';
import AttachmentList from '@sif-common/core/components/attachment-list/AttachmentList';
import Box from '@sif-common/core/components/box/Box';
import { Attachment } from '@sif-common/core/types/Attachment';
import { containsAnyUploadedAttachments, fileExtensionIsValid } from '@sif-common/core/utils/attachmentUtils';
import { removeElementFromArray } from '@sif-common/core/utils/listUtils';
import { deleteFile } from '../../api/api';
import { AppFormField, PleiepengesøknadFormData } from '../../types/PleiepengesøknadFormData';

interface LegeerklæringAttachmentListProps {
    includeDeletionFunctionality: boolean;
    wrapNoAttachmentsInBox?: boolean;
}

type Props = LegeerklæringAttachmentListProps;

const LegeerklæringAttachmentList = ({ wrapNoAttachmentsInBox, includeDeletionFunctionality }: Props) => {
    const { values, setFieldValue } = useFormikContext<PleiepengesøknadFormData>();
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
                    if (attachment.url) {
                        deleteFile(attachment.url).then(
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
                    }
                }}
            />
        );
    } else {
        return <AttachmentList attachments={legeerklæring} />;
    }
};

export default connect<LegeerklæringAttachmentListProps, AppFormField>(LegeerklæringAttachmentList);
