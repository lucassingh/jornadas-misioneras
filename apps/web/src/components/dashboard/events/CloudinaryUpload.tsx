'use client';

import { useRef, useState, useCallback, useId } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import { Upload, X, ImageIcon, Film, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { COLOR_TOKENS } from '@jornadas/ui';

type ResourceType = 'image' | 'video';

interface Props {
  value?: string | null;
  onChange: (url: string | null) => void;
  label: string;
  disabled?: boolean;
  folder?: 'events' | 'avatars' | 'site';
  /** `image` (default) o `video` — cambia el endpoint de Cloudinary, los formatos y el tamaño máximo. */
  resourceType?: ResourceType;
  /** Sobrescribe el máximo por defecto (5 MB imagen / 100 MB video). */
  maxSizeMb?: number;
  /** Muestra el botón "Quitar" en el archivo cargado (default true). Para campos obligatorios conviene `false`: solo se puede reemplazar. */
  allowRemove?: boolean;
}

type State =
  | { status: 'idle' }
  | { status: 'uploading'; progress: number; fileName: string }
  | { status: 'error'; message: string };

const CONFIG: Record<ResourceType, { maxSizeMb: number; accepted: string[]; formats: string; wrongFormat: string; noun: string }> = {
  image: {
    maxSizeMb: 5,
    accepted: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    formats: 'PNG, JPG, WebP',
    wrongFormat: 'Formato no soportado. Usá PNG, JPG, WebP o GIF.',
    noun: 'imagen',
  },
  video: {
    maxSizeMb: 100,
    accepted: ['video/mp4', 'video/webm', 'video/quicktime'],
    formats: 'MP4, WebM o MOV',
    wrongFormat: 'Formato no soportado. Usá MP4, WebM o MOV.',
    noun: 'video',
  },
};

const RADIUS = '8px';

interface SignatureData {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
}

export function CloudinaryUpload({
  value,
  onChange,
  label,
  disabled,
  folder = 'events',
  resourceType = 'image',
  maxSizeMb,
  allowRemove = true,
}: Props) {
  const [state, setState] = useState<State>({ status: 'idle' });
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);
  const inputId = useId();

  const cfg = CONFIG[resourceType];
  const maxMb = maxSizeMb ?? cfg.maxSizeMb;
  const isVideo = resourceType === 'video';

  const upload = useCallback(async (file: File) => {
    if (!cfg.accepted.includes(file.type)) {
      setState({ status: 'error', message: cfg.wrongFormat });
      return;
    }
    if (file.size > maxMb * 1024 * 1024) {
      setState({ status: 'error', message: `El archivo supera los ${maxMb} MB.` });
      return;
    }

    setState({ status: 'uploading', progress: 0, fileName: file.name });

    let sig: SignatureData;
    try {
      const res = await fetch(`/api/upload/signature?folder=${folder}`);
      if (!res.ok) throw new Error('Error al obtener firma');
      sig = (await res.json()) as SignatureData;
    } catch {
      setState({ status: 'error', message: 'No se pudo conectar con el servidor de archivos.' });
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
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${sig.cloudName}/${resourceType}/upload`);

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
        setState({ status: 'error', message: `Error al subir ${isVideo ? 'el video' : 'la imagen'}. Intentá de nuevo.` });
      }
    };

    xhr.onerror = () => {
      xhrRef.current = null;
      setState({ status: 'error', message: 'Error de conexión. Verificá tu internet.' });
    };

    xhr.send(formData);
  }, [onChange, folder, resourceType, cfg, maxMb, isVideo]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (files?.[0]) upload(files[0]);
  }, [upload]);

  const openPicker = () => inputRef.current?.click();

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const cancelUpload = () => {
    xhrRef.current?.abort();
    setState({ status: 'idle' });
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = () => {
    cancelUpload();
    onChange(null);
  };

  // El input vive fuera de las vistas: así "Cambiar" (archivo ya cargado) y la
  // zona de arrastre (sin archivo) usan el mismo selector.
  const hiddenInput = (
    <input
      ref={inputRef}
      id={inputId}
      type="file"
      accept={cfg.accepted.join(',')}
      style={{ display: 'none' }}
      disabled={disabled}
      onChange={(e) => {
        handleFiles(e.target.files);
        // Permite volver a elegir el mismo archivo después de un error o cancelación
        e.target.value = '';
      }}
    />
  );

  const Label = label ? (
    <Typography variant="caption" color="text.secondary" display="block" mb={0.75} fontWeight={500}>
      {label}
    </Typography>
  ) : null;

  // ── Uploading — progress bar (también al reemplazar un archivo existente) ──
  if (state.status === 'uploading') {
    return (
      <Box>
        {Label}
        {hiddenInput}
        <Box
          sx={{
            p: 3,
            borderRadius: RADIUS,
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
              onClick={cancelUpload}
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
        {Label}
        {hiddenInput}
        <Box
          sx={{
            p: 2.5,
            borderRadius: RADIUS,
            border: '2px solid',
            borderColor: 'error.main',
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
          <Box display="flex" gap={1}>
            <Button type="button" size="small" variant="contained" onClick={openPicker}>
              Elegir otro archivo
            </Button>
            <Button type="button" size="small" variant="text" onClick={() => setState({ status: 'idle' })}>
              {value ? `Conservar ${cfg.noun} actual` : 'Cancelar'}
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  // ── Uploaded — preview + Cambiar / Quitar ──────────────────────────────────
  if (value) {
    return (
      <Box>
        {Label}
        {hiddenInput}
        <Box
          sx={{
            position: 'relative',
            borderRadius: RADIUS,
            overflow: 'hidden',
            border: `2px solid ${COLOR_TOKENS.brand}55`,
            height: isVideo ? 260 : 180,
            bgcolor: isVideo ? '#0d0c0c' : 'background.paper',
          }}
        >
          {isVideo ? (
            <Box
              component="video"
              src={value}
              muted
              playsInline
              controls
              preload="metadata"
              sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
            />
          ) : (
            <Box
              component="img"
              src={value}
              alt={label}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          )}

          {/* Estado — arriba a la izquierda, no tapa los controles del video */}
          <Box
            sx={{
              position: 'absolute', top: 10, left: 10,
              display: 'flex', alignItems: 'center', gap: 0.5,
              px: 1, py: 0.4, borderRadius: '6px',
              bgcolor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
              pointerEvents: 'none',
            }}
          >
            <CheckCircle2 size={13} color={COLOR_TOKENS.secondary} />
            <Typography variant="caption" color="rgba(255,255,255,0.92)" lineHeight={1}>
              {isVideo ? 'Video actual' : 'Imagen actual'}
            </Typography>
          </Box>

          {/* Acciones — arriba a la derecha */}
          {!disabled && (
            <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 0.75 }}>
              <Button
                type="button"
                size="small"
                variant="contained"
                startIcon={<RefreshCw size={13} />}
                onClick={openPicker}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.94)', color: '#0d0c0c',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
                  '&:hover': { bgcolor: '#fff' },
                }}
              >
                {isVideo ? 'Cambiar video' : 'Cambiar imagen'}
              </Button>
              {allowRemove && (
                <Button
                  type="button"
                  size="small"
                  variant="contained"
                  startIcon={<X size={13} />}
                  onClick={handleRemove}
                  sx={{
                    bgcolor: 'rgba(0,0,0,0.55)', color: '#fff', backdropFilter: 'blur(4px)',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: 'rgba(220,30,30,0.8)' },
                  }}
                >
                  Quitar
                </Button>
              )}
            </Box>
          )}
        </Box>
        <Typography variant="caption" color="text.secondary" display="block" mt={0.75}>
          {isVideo
            ? 'Para reemplazarlo, tocá “Cambiar video” y elegí el archivo nuevo.'
            : 'Para reemplazarla, tocá “Cambiar imagen” y elegí el archivo nuevo.'}
        </Typography>
      </Box>
    );
  }

  // ── Idle — dropzone ────────────────────────────────────────────────────────
  return (
    <Box>
      {Label}
      {hiddenInput}
      <Box
        component="label"
        htmlFor={inputId}
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
          borderRadius: RADIUS,
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
            isVideo ? <Film size={24} color={COLOR_TOKENS.brand} /> : <ImageIcon size={24} color={COLOR_TOKENS.brand} />
          ) : (
            <Upload size={24} style={{ opacity: 0.5 }} />
          )}
        </Box>
        <Box textAlign="center">
          <Typography variant="body2" fontWeight={600} color={isDragging ? 'primary' : 'text.primary'}>
            {isDragging ? 'Soltá para subir' : 'Arrastrá o clickeá para subir'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {cfg.formats} · Máx. {maxMb} MB
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
