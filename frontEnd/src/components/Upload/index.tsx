import { FC, useEffect, useState, forwardRef } from 'react';
import {
  FormControl,
  FormLabel,
  Box,
  IconButton,
  Modal,
  FormHelperText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';

interface fileListItem {
  uid: string;
  name: string;
  url: string;
  originFileObj?: File;
  status?: 'uploading' | 'done';
  type?: string;
  size?: number;
}
interface UploadProps {
  label: string;
  value?: fileListItem[];
  children?: React.ReactNode;
  name?: string;
  listType?: 'text' | 'picture' | 'picture-card';
  fileList?: fileListItem[];
  multiple?: boolean;
  // onChange?: (val: { file: File; fileList: fileListItem[] }) => void;
  onChange?: (val: fileListItem[]) => void;
  error?: boolean;
  helperText?: string;
  [key: string]: any;
}
interface PictureCardFileListItemProp {
  children?: React.ReactNode;
  error?: boolean;
}
interface PictureCardFileListWrapperProp {
  children?: React.ReactNode;
}
const PictureCardFileListWrapper: FC<PictureCardFileListWrapperProp> = (
  props: PictureCardFileListWrapperProp
) => {
  const { children } = props;
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 2,
      }}>
      {children}
    </Box>
  );
};
const PictureCardFileListItem: FC<PictureCardFileListItemProp> = (
  props: PictureCardFileListItemProp
) => {
  const { children, error } = props;
  const hoverStyle = {
    border: 3,
    transform: 'scale(1.04)',
    borderStyle: 'dashed',
    borderColor: 'divider',
    boxSizing: 'border-box',
  };
  const errorStyle = error
    ? {
        ...hoverStyle,
        borderColor: 'error.main',
      }
    : {};
  return (
    <Box
      sx={{
        width: 150,
        height: 150,
        backgroundColor: '#f5f5f5',
        cursor: 'pointer',
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'primary.main',
        position: 'relative',
        '&:hover': {
          ...hoverStyle,
        },
        '&:hover > div': {
          opacity: 1,
        },
        ...errorStyle,
      }}>
      {children ? children : <AddIcon />}
    </Box>
  );
};
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
const Upload: FC<UploadProps> = forwardRef((props: UploadProps, ref) => {
  const {
    label = '',
    children,
    listType,
    fileList = [],
    multiple,
    value = [],
    onChange,
    error = false,
    helperText,
    ...other
  } = props;
  const [fileListState, setFileListState] = useState<fileListItem[]>(value);
  const [url, setUrl] = useState<string>('');
  const [isPreview, setIsPreview] = useState(false);
  const FileListStateSetter = (fileList: File[]) => {
    fileList.forEach((item) => {
      const reader = new FileReader();
      reader.readAsDataURL(item);
      reader.onload = () => {
        const fileListItem: fileListItem = {
          uid: item.name,
          name: item.name,
          url: reader.result as string,
          status: 'uploading',
          originFileObj: item,
          type: item.type,
          size: item.size,
        };
        setFileListState((prev) => {
          // onChange?.({
          //   file: item,
          //   fileList: [...prev, fileListItem],
          // });
          onChange?.([...prev, fileListItem]);
          return [...prev, fileListItem];
        });
      };
    });
  };
  const handleChange = (val: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = val.target;
    if (files) {
      FileListStateSetter(Array.from(files));
    }
  };
  const handleRemove = (uid: string) => {
    setFileListState((prev) => {
      const index = prev.findIndex((item) => item.uid === uid);
      prev.splice(index, 1);
      onChange?.(prev);
      return [...prev];
    });
  };
  useEffect(() => {
    setFileListState(value === undefined ? [] : value);
  }, [props.value]);
  return (
    <>
      <FormControl
        component="fieldset"
        variant="standard"
        margin={other.margin}
        error={error}
        sx={{
          width: '100%',
          mt: 0,
        }}>
        <FormLabel
          component="legend"
          sx={{
            mb: 2,
          }}>
          {label}
        </FormLabel>
        {listType === 'picture-card' && (
          <PictureCardFileListWrapper>
            {fileListState.map((item) => {
              return (
                <PictureCardFileListItem key={item.uid}>
                  <img
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    src={item.url}
                    alt={item.name}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      left: 0,
                      right: 0,
                      display: 'flex',
                      justifyContent: 'space-around',
                      alignItems: 'center',
                      p: 3,
                      opacity: 0,
                      background:
                        'radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)',
                      transition: 'opacity 0.3s ease',
                      color: 'white',
                    }}>
                    <div
                      onClick={() => {
                        setIsPreview(true);
                        setUrl(item.url);
                      }}>
                      <RemoveRedEyeIcon fontSize="large" />
                    </div>
                    <div onClick={() => handleRemove(item.uid)}>
                      <DeleteIcon fontSize="large" />
                    </div>
                  </Box>
                </PictureCardFileListItem>
              );
            })}
            <PictureCardFileListItem error={error}>
              <IconButton component="label">
                {children}
                <VisuallyHiddenInput
                  ref={ref as React.MutableRefObject<HTMLInputElement>}
                  type="file"
                  multiple={multiple}
                  onChange={handleChange.bind(this)}
                  value={''}
                  {...other}
                />
              </IconButton>
            </PictureCardFileListItem>
          </PictureCardFileListWrapper>
        )}
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
      <Modal
        open={isPreview}
        onClose={() => setIsPreview(false)}
        sx={{
          display: 'grid',
          placeItems: 'center',
        }}>
        <Box
          sx={{
            backgroundColor: 'white',
            height: '60vh',
            p: 2,
          }}>
          <img
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
            src={url}
          />
        </Box>
      </Modal>
    </>
  );
});
export default Upload;
