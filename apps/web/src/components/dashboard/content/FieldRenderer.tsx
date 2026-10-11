'use client';

import { useController, useFormContext } from 'react-hook-form';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { FieldSpec, LeafFieldSpec, ListFieldSpec } from '@/lib/content';
import { MediaField } from './MediaField';

interface Props {
  field: FieldSpec;
  /** Prefijo del nombre en el form, para campos anidados en listas (`pillars.0.`). */
  namePrefix?: string;
}

/**
 * Renderiza un campo del CMS a partir de su `FieldSpec` — la misma
 * declaración que arma el schema Zod, así el límite de caracteres que muestra
 * el contador es exactamente el que valida la API.
 */
export function FieldRenderer({ field, namePrefix = '' }: Props) {
  if (field.kind === 'list') return <ListField field={field} namePrefix={namePrefix} />;
  return <LeafField field={field} name={`${namePrefix}${field.key}`} />;
}

function ListField({ field, namePrefix }: { field: ListFieldSpec; namePrefix: string }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight={700} lineHeight={1.3}>
        {field.label}
      </Typography>
      {field.help && (
        <Typography variant="caption" color="text.secondary" display="block" mb={1.5} sx={{ lineHeight: 1.5 }}>
          {field.help}
        </Typography>
      )}
      {Array.from({ length: field.length }, (_, i) => (
        <Paper key={i} variant="outlined" sx={{ p: 2.5, mb: 2, borderRadius: 2, backgroundImage: 'none' }}>
          <Typography variant="overline" fontWeight={700} color="primary" display="block" mb={2} lineHeight={1}>
            {field.itemLabels?.[i] ?? `${field.label} ${i + 1}`}
          </Typography>
          {field.fields.map((leaf) => (
            <LeafField key={leaf.key} field={leaf} name={`${namePrefix}${field.key}.${i}.${leaf.key}`} />
          ))}
        </Paper>
      ))}
    </Box>
  );
}

function LeafField({ field, name }: { field: LeafFieldSpec; name: string }) {
  const { control } = useFormContext();
  const { field: f, fieldState } = useController({ name, control });

  const error = fieldState.error?.message;
  const value = f.value == null ? '' : String(f.value);

  if (field.kind === 'image' || field.kind === 'video') {
    return (
      <Box sx={{ mb: 3 }}>
        <MediaField
          kind={field.kind}
          label={field.label}
          help={field.help}
          value={value}
          onChange={f.onChange}
          error={error}
          optional={field.optional}
        />
      </Box>
    );
  }

  const maxLength = 'maxLength' in field ? field.maxLength : undefined;
  const over = maxLength != null && value.length > maxLength;

  const helper = (
    <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, lineHeight: 1.5 }}>
      <span>{error ?? field.help ?? ''}</span>
      {maxLength != null && (
        <Box
          component="span"
          sx={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums', fontWeight: over ? 700 : 400, color: over ? 'error.main' : 'inherit' }}
        >
          {value.length}/{maxLength}
        </Box>
      )}
    </Box>
  );

  return (
    <TextField
      label={field.label}
      fullWidth
      sx={{ mb: 3 }}
      value={value}
      onChange={(e) => f.onChange(e.target.value)}
      onBlur={f.onBlur}
      inputRef={f.ref}
      error={!!error || over}
      helperText={helper}
      type={field.kind === 'number' ? 'number' : field.kind === 'email' ? 'email' : 'text'}
      multiline={field.kind === 'textarea'}
      minRows={field.kind === 'textarea' ? field.rows ?? 3 : undefined}
      placeholder={field.kind === 'text' ? field.placeholder : field.kind === 'url' ? 'https://...' : undefined}
      inputProps={field.kind === 'number' ? { min: field.min ?? 0, max: field.max, inputMode: 'numeric' } : undefined}
    />
  );
}
