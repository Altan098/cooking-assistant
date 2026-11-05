import { useEffect, useRef, useState } from 'react';
import type { DragEvent } from 'react';
import { Box, Button, FormHelperText, Typography } from '@mui/material';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { ACCEPTED_IMAGE_TYPES } from './validation';

interface Props {
  file: File | null;
  currentUrl: string;
  error?: string;
  disabled: boolean;
  onChange: (file: File) => void;
}

export default function ImagePicker({ file, currentUrl, error, disabled, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!file) return undefined;
    const reader = new FileReader();
    reader.onload = () => setFilePreview(String(reader.result));
    reader.readAsDataURL(file);
    // Если выбрали другой файл, результат чтения предыдущего уже не нужен.
    return () => {
      reader.onload = null;
    };
  }, [file]);

  const preview = filePreview ?? currentUrl;

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const dropped = event.dataTransfer.files[0];
    if (dropped && !disabled) onChange(dropped);
  };

  return (
    <Box component="div">
      <Box
        component="div"
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        sx={{
          minHeight: 220,
          overflow: 'hidden',
          borderRadius: '14px',
          border: '2px dashed',
          borderColor: error ? 'error.main' : isDragging ? 'primary.main' : 'divider',
          bgcolor: isDragging ? 'rgba(181, 71, 46, 0.08)' : 'background.default',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        {preview ? (
          <Box
            component="img"
            src={preview}
            alt="Предпросмотр фото блюда"
            sx={{ display: 'block', width: '100%', maxHeight: 320, objectFit: 'cover' }}
          />
        ) : (
          <Box component="div" sx={{ p: 3, color: 'text.secondary' }}>
            <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography sx={{ mt: 1 }}>Перетащите фото сюда</Typography>
            <Typography variant="caption">JPEG, PNG или WebP, до 5 МБ</Typography>
          </Box>
        )}
      </Box>

      <input
        ref={inputRef}
        type="file"
        hidden
        aria-label="Фото блюда"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        disabled={disabled}
        onChange={(event) => {
          const selected = event.target.files?.[0];
          if (selected) onChange(selected);
          // Иначе повторный выбор того же файла не сработает.
          event.target.value = '';
        }}
      />
      <Button sx={{ mt: 1 }} onClick={() => inputRef.current?.click()} disabled={disabled}>
        {preview ? 'Выбрать другое фото' : 'Выбрать фото'}
      </Button>
      {error && <FormHelperText error>{error}</FormHelperText>}
    </Box>
  );
}
