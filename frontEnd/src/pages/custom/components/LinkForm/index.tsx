import { FC, useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box } from '@mui/material';
import { useMessage } from '@/contexts/messageContext';
import PhotoIcon from '@mui/icons-material/Photo';
import { addDownLink } from '@/api/system';
import { Upload } from '@/components';

interface Props {
  currentItem: any;
  onCancel?: () => void;
  callback?: () => void;
}
const LinkForm: FC<Props> = (props: Props) => {
  const { onCancel, callback, currentItem = {} } = props;
  const fieldProps = {
    fullWidth: true,
    margin: 'normal',
  };
  const form = useRef<HTMLFormElement>(null);
  const { handleSubmit, control, reset } = useForm({
    defaultValues: currentItem,
  });
  const { dispatch: dispatchMessage } = useMessage();

  const onSubmit = async (data: any) => {
    const result = await addDownLink(data);
    if (result.code === 200) {
      dispatchMessage({
        type: 'SET_MESSAGE',
        payload: {
          type: 'success',
          content: result.data,
          delay: 5000,
        },
      });
      onCancel?.();
      callback?.();
      reset();
    }
  };
  return (
    <div>
      <form ref={form} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              id={field.name}
              label="链接名称"
              required
              {...(fieldProps as any)}
              {...field}
            />
          )}
        />
        <Controller
          name="url"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              id={field.name}
              label="链接地址"
              required
              {...(fieldProps as any)}
              {...field}
            />
          )}
        />

        <Box sx={{ paddingTop: '8px', paddingBottom: 0 }}>
          <span style={{ color: 'rgba(0, 0, 0, 0.6)' }}>链接图标：</span>
          <Controller
            name="icon"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Upload
                label=""
                titleDesc="上传LOGO"
                listType="picture-card"
                multiple={false}
                value={
                  field.value && field.value !== ' '
                    ? [
                        {
                          uid: '',
                          name: '',
                          url: field.value,
                        },
                      ]
                    : []
                }
                onChange={(file) => {
                  if (file.length != 0) {
                    const reader = new FileReader();
                    reader.readAsDataURL(file[0].originFileObj);
                    reader.onloadend = async (result) => {
                      field.onChange(result.target.result);
                    };
                  }
                }}
                max={1}>
                <Box
                  sx={{
                    lineHeight: 0,
                  }}>
                  <PhotoIcon
                    sx={{
                      fontSize: 64,
                    }}
                  />
                </Box>
              </Upload>
            )}
          />
        </Box>
      </form>
      <Box
        sx={{
          textAlign: 'right',
          marginBottom: '-12px',
          marginRight: '-16px',
        }}>
        <Button onClick={onCancel} sx={{ mr: 1 }}>
          取消
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={() => {
            form.current?.dispatchEvent(
              new Event('submit', { cancelable: true, bubbles: true })
            );
          }}>
          提交
        </Button>
      </Box>
    </div>
  );
};
export default LinkForm;
