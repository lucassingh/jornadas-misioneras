'use client';

import { useRef, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import { Upload, X, ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { COLOR_TOKENS } from '@jornadas/ui';

interface Props {
  value?: string | null;
  onChange: (url: string | null) => void;
  label: string;
  disabled?: boolean;
  folder?: 'events' | 'avatars';
}

type State =
  | { status: 'idle' }
  | { status: 'uploading'; progress: number; fileName: string }
  | { status: 'error'; message: string };

const MAX_SIZE_MB = 5;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

interface SignatureData {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
}

export function CloudinaryUpload({ value, onChange, label, disabled, folder = 'events' }: Props) {
  const [state, setState] = useState<State>({ status: 'idle' });
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const upload = useCallback(async (file: File) => {
    if (!ACCEPTED.includes(file.type)) {
      setState({ status: 'error', message: 'Formato no soportado. Usá PNG, JPG, WebP o GIF.' });
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setState({ status: 'error', message: `El archivo supera los ${MAX_SIZE_MB} MB.` });
      return;
    }

    setState({ status: 'uploading', progress: 0, fileName: file.name });

    let sig: SignatureData;
    try {
      const res = await fetch(`/api/upload/signature?folder=${folder}`);
      if (!res.ok) throw new Error('Error al obtener firma');
      sig = (await res.json()) as SignatureData;
    } catch {
      setState({ status: 'error', message: 'No se pudo conectar con el servidor de imágenes.' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', sig.apiKey);
    formData.append('timestamp', String(sig.timestamp));
    formData.append('signature', sig.signature);
    formData.append('folder', sig.folder);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        setState({ status: 'uploading', progress: Math.round((e.loaded / e.total) * 100), fileName: file.name });
      }
    };

    xhr.onload = () => {
      xhrRef.current = null;
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText) as { secure_url: string };
        onChange(data.secure_url);
        setState({ status: 'idle' });
      } else {
        setState({ status: 'error', message: 'Error al subir la imagen. Intentá de nuevo.' });
      }
    };

    xhr.onerror = () => {
      xhrRef.current = null;
      setState({ status: 'error', message: 'Error de conexión. Verificá tu internet.' });
    };

    xhr.send(formData);
  }, [onChange, folder]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (files?.[0]) upload(files[0]);
  }, [upload]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = () => {
    xhrRef.current?.abort();
    setState({ status: 'idle' });
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  // ── Uploaded — show preview ────────────────────────────────────────────────
  if (value) {
    return (
      <Box>
        <Typography variant="caption" color="text.secondary" display="block" mb={0.75} fontWeight={500}>
          {label}
        </Typography>
        <Box
          sx={{
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            border: `2px solid ${COLOR_TOKENS.brand}55`,
            height: 180,
            bgcolor: 'background.paper',
          }}
        >
          <Box
            component="img"
            src={value}
            alt={label}
            sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              p: 1.5,
            }}
          >
            <Box display="flex" alignItems="center" gap={0.5}>
              <CheckCircle2 size={14} color={COLOR_TOKENS.extra2} />
              <Typography variant="caption" color="rgba(255,255,255,0.9)">
                Imagen subida
              </Typography>
            </Box>
            {!disabled && (
              <IconButton
                type="button"
                size="small"
                onClick={handleRemove}
                sx={{ bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': { bgcolor: 'rgba(220,30,30,0.7)' } }}
              >
                <X size={14} />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  // ── Uploading — progress bar ───────────────────────────────────────────────
  if (state.status === 'uploading') {
    return (
      <Box>
        <Typography variant="caption" color="text.secondary" display="block" mb={0.75} fontWeight={500}>
          {label}
        </Typography>
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            border: `2px solid ${COLOR_TOKENS.brand}`,
            bgcolor: `${COLOR_TOKENS.brand}08`,
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5} mb={2}>
            <CircularProgress size={20} thickness={4} />
            <Box flex={1} minWidth={0}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {state.fileName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Subiendo... {state.progress}%
              </Typography>
            </Box>
          </Box>
          <LinearProgress
            variant="determinate"
            value={state.progress}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: `${COLOR_TOKENS.brand}20`,
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: `linear-gradient(90deg, ${COLOR_TOKENS.brand}, ${COLOR_TOKENS.extra2})`,
                transition: 'transform 0.2s linear',
              },
            }}
          />
          <Box display="flex" justifyContent="flex-end" mt={1.5}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ cursor: 'pointer', textDecoration: 'underline', '&:hover': { color: 'error.main' } }}
              onClick={handleRemove}
            >
              Cancelar
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (state.status === 'error') {
    return (
      <Box>
        <Typography variant="caption" color="text.secondary" display="block" mb={0.75} fontWeight={500}>
          {label}
        </Typography>
        <Box
          sx={{
            p: 2.5,
            borderRadius: 2,
            border: '2px solid',
            borderColor: 'error.main',
            bgcolor: 'error.main',
            bgOpacity: 0.05,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <AlertCircle size={28} color="var(--mui-palette-error-main, #d32f2f)" />
          <Typography variant="body2" color="error" textAlign="center">
            {state.message}
          </Typography>
          <Typography
            variant="caption"
            color="primary"
            sx={{ cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
            onClick={() => setState({ status: 'idle' })}
          >
            Reintentar
          </Typography>
        </Box>
      </Box>
    );
  }

  // ── Idle — dropzone ────────────────────────────────────────────────────────
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" display="block" mb={0.75} fontWeight={500}>
        {label}
      </Typography>
      <Box
        component="label"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          height: 180,
          borderRadius: 2,
          border: '2px dashed',
          borderColor: isDragging ? COLOR_TOKENS.brand : 'divider',
          bgcolor: isDragging ? `${COLOR_TOKENS.brand}08` : 'background.paper',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': disabled ? {} : {
            borderColor: COLOR_TOKENS.brand,
            bgcolor: `${COLOR_TOKENS.brand}06`,
          },
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          style={{ display: 'none' }}
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            bgcolor: isDragging ? `${COLOR_TOKENS.brand}20` : 'action.selected',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
        >
          {isDragging ? (
            <ImageIcon size={24} color={COLOR_TOKENS.brand} />
          ) : (
            <Upload size={24} style={{ opacity: 0.5 }} />
          )}
        </Box>
        <Box textAlign="center">
          <Typography variant="body2" fontWeight={600} color={isDragging ? 'primary' : 'text.primary'}>
            {isDragging ? 'Soltá para subir' : 'Arrastrá o clickeá para subir'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            PNG, JPG, WebP · Máx. {MAX_SIZE_MB} MB
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
