import PropTypes from 'prop-types';

// material-ui
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// third-party
import { useDropzone } from 'react-dropzone';

// project import
import FilesPreview from './FilePreview';
import PlaceholderContent from './PlaceHolderContent';
import RejectionFiles from './RejectionFile';
import { DropzoneType } from './Constant';

const DropzoneWrapper = styled('div')(({ theme }) => ({
    outline: 'none',
    padding: theme.spacing(5, 1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    border: `1px dashed ${theme.palette.secondary.main}`,
    '&:hover': { opacity: 0.72, cursor: 'pointer' }
}));

// ==============================|| UPLOAD - MULTIPLE FILE ||============================== //

const MultiFileUpload = ({ error, showList = false, files, type, setFieldValue, sx, onUpload }) => {
    const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
        multiple: true,
        onDrop: (acceptedFiles) => {
            if (files) {
                setFieldValue('files', [
                    ...files,
                    ...acceptedFiles.map((file) =>
                        Object.assign(file, {
                            preview: URL.createObjectURL(file)
                        })
                    )
                ]);
            } else {
                setFieldValue(
                    'files',
                    acceptedFiles.map((file) =>
                        Object.assign(file, {
                            preview: URL.createObjectURL(file)
                        })
                    )
                );
            }
        }
    });

    const onRemoveAll = () => {
        setFieldValue('files', null);
    };

    const onRemove = (file) => {
        const filteredItems = files && files.filter((_file) => _file !== file);
        setFieldValue('files', filteredItems);
    };

    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    ...(type === DropzoneType.standard && { width: 'auto', display: 'flex' }),
                    ...sx
                }}
            >
                <Stack {...(type === DropzoneType.standard && { alignItems: 'center' })}>
                    <DropzoneWrapper
                        {...getRootProps()}
                        sx={{
                            ...(type === DropzoneType.standard && {
                                p: 0,
                                m: 1,
                                width: 64,
                                height: 64
                            }),
                            ...(isDragActive && { opacity: 0.72 }),
                            ...((isDragReject || error) && {
                                color: 'error.main',
                                borderColor: 'error.light',
                                bgcolor: 'error.lighter'
                            })
                        }}
                    >
                        <input {...getInputProps()} />
                        <PlaceholderContent type={type} />
                    </DropzoneWrapper>
                    {type === DropzoneType.standard && files && files.length > 1 && (
                        <Button variant="contained" size="small" color="error" onClick={onRemoveAll} sx={{ px: 0.75 }}>
                            Remove all
                        </Button>
                    )}
                </Stack>
                {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}
                {files && files.length > 0 && <FilesPreview files={files} showList={showList} onRemove={onRemove} type={type} />}
            </Box>

            {type !== DropzoneType.standard && files && files.length > 0 && (
                <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 2 }}>
                    <Button color="error" onClick={onRemoveAll}>
                        Remove all
                    </Button>
                    <Button variant="contained" onClick={onUpload}>
                        Upload files
                    </Button>
                </Stack>
            )}
        </>
    );
};

MultiFileUpload.propTypes = {
    setFieldValue: PropTypes.func,
    sx: PropTypes.object,
    onUpload: PropTypes.func,
    error: PropTypes.bool,
    showList: PropTypes.bool,
    files: PropTypes.array,
    type: PropTypes.string
};

export default MultiFileUpload;
