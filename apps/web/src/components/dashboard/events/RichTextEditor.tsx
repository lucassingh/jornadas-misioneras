'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TiptapLink from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListOrdered,
  Link2,
  Quote,
  Minus,
} from 'lucide-react';
import type { Level } from '@tiptap/extension-heading';

interface Props {
  value?: string | null;
  onChange: (html: string) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
}

const EMPTY = '<p></p>';

const HEADING_ICONS: Record<number, React.ReactNode> = {
  1: <Heading1 size={14} />,
  2: <Heading2 size={14} />,
  3: <Heading3 size={14} />,
  4: <Heading4 size={14} />,
  5: <Heading5 size={14} />,
  6: <Heading6 size={14} />,
};

export function RichTextEditor({ value, onChange, label, error, helperText, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
      Underline,
      TiptapLink.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: placeholder ?? '' }),
    ],
    content: value ?? '',
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => {
      const html = e.getHTML();
      onChange(html === EMPTY ? '' : html);
    },
    editorProps: {
      attributes: { class: 'rte-content' },
    },
  });

  // Sync value when form resets or loads existing data (only when not focused)
  useEffect(() => {
    if (!editor || editor.isFocused) return;
    const next = value ?? '';
    const current = editor.getHTML();
    const normalizedCurrent = current === EMPTY ? '' : current;
    if (normalizedCurrent !== next) {
      editor.commands.setContent(next || EMPTY, { emitUpdate: false });
    }
  }, [value, editor]);

  const btnSx = (active?: boolean) => ({
    borderRadius: 1,
    p: 0.5,
    bgcolor: active ? 'action.selected' : 'transparent',
    color: active ? 'primary.main' : 'text.secondary',
    '&:hover': { bgcolor: 'action.hover' },
  });

  return (
    <Box sx={{ position: 'relative', mt: label ? '6px' : 0 }}>
      {label && (
        <Typography
          component="span"
          sx={{
            position: 'absolute',
            top: '-8px',
            left: '12px',
            zIndex: 1,
            bgcolor: 'background.paper',
            px: '4px',
            color: error ? 'error.main' : 'text.secondary',
            fontSize: '0.75rem',
            lineHeight: 1,
            userSelect: 'none',
          }}
        >
          {label}
        </Typography>
      )}

      <Box
        sx={{
          border: '1px solid',
          borderColor: error ? 'error.main' : 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          transition: 'border-color 0.2s',
          '&:focus-within': {
            borderColor: error ? 'error.main' : 'primary.main',
          },
        }}
      >
        {/* ── Toolbar ──────────────────────────────────────────────────────── */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 0.25,
            px: 1,
            py: 0.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: 'action.hover',
          }}
        >
          {/* Formato inline */}
          <Tooltip title="Negrita (Ctrl+B)">
            <IconButton type="button" size="small" onClick={() => editor?.chain().focus().toggleBold().run()} sx={btnSx(editor?.isActive('bold'))}>
              <Bold size={14} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Cursiva (Ctrl+I)">
            <IconButton type="button" size="small" onClick={() => editor?.chain().focus().toggleItalic().run()} sx={btnSx(editor?.isActive('italic'))}>
              <Italic size={14} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Subrayado (Ctrl+U)">
            <IconButton type="button" size="small" onClick={() => editor?.chain().focus().toggleUnderline().run()} sx={btnSx(editor?.isActive('underline'))}>
              <UnderlineIcon size={14} />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />

          {/* Títulos H1–H6 */}
          {([1, 2, 3, 4, 5, 6] as Level[]).map((level) => (
            <Tooltip key={level} title={`Título H${level}`}>
              <IconButton
                type="button"
                size="small"
                onClick={() => editor?.chain().focus().toggleHeading({ level }).run()}
                sx={btnSx(editor?.isActive('heading', { level }))}
              >
                {HEADING_ICONS[level]}
              </IconButton>
            </Tooltip>
          ))}

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />

          {/* Listas */}
          <Tooltip title="Lista con viñetas">
            <IconButton type="button" size="small" onClick={() => editor?.chain().focus().toggleBulletList().run()} sx={btnSx(editor?.isActive('bulletList'))}>
              <List size={14} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Lista numerada">
            <IconButton type="button" size="small" onClick={() => editor?.chain().focus().toggleOrderedList().run()} sx={btnSx(editor?.isActive('orderedList'))}>
              <ListOrdered size={14} />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />

          {/* Cita y separador */}
          <Tooltip title="Cita / Blockquote">
            <IconButton type="button" size="small" onClick={() => editor?.chain().focus().toggleBlockquote().run()} sx={btnSx(editor?.isActive('blockquote'))}>
              <Quote size={14} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Separador horizontal">
            <IconButton type="button" size="small" onClick={() => editor?.chain().focus().setHorizontalRule().run()} sx={btnSx()}>
              <Minus size={14} />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />

          {/* Link */}
          <Tooltip title={editor?.isActive('link') ? 'Quitar enlace' : 'Agregar enlace (Ctrl+K)'}>
            <IconButton
              type="button"
              size="small"
              onClick={() => {
                if (!editor) return;
                if (editor.isActive('link')) {
                  editor.chain().focus().unsetLink().run();
                } else {
                  const url = window.prompt('URL del enlace:');
                  if (url) editor.chain().focus().setLink({ href: url }).run();
                }
              }}
              sx={btnSx(editor?.isActive('link'))}
            >
              <Link2 size={14} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* ── Área de contenido ─────────────────────────────────────────────── */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            cursor: 'text',
            minHeight: 120,
            '& .rte-content': {
              outline: 'none',
              minHeight: '100px',
              fontSize: '0.875rem',
              lineHeight: 1.7,
            },
            // Placeholder
            '& .rte-content p.is-editor-empty:first-child::before': {
              color: 'text.disabled',
              content: 'attr(data-placeholder)',
              float: 'left',
              pointerEvents: 'none',
              height: 0,
            },
            // Párrafos con espaciado generoso
            '& .rte-content p': { margin: '0 0 0.75em 0' },
            '& .rte-content p:last-child': { marginBottom: 0 },
            // Títulos con jerarquía visual clara
            '& .rte-content h1': { fontSize: '1.5rem',  fontWeight: 700, lineHeight: 1.3, margin: '1.2em 0 0.4em' },
            '& .rte-content h2': { fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.3, margin: '1em 0 0.35em' },
            '& .rte-content h3': { fontSize: '1.1rem',  fontWeight: 600, lineHeight: 1.3, margin: '0.9em 0 0.3em' },
            '& .rte-content h4': { fontSize: '1rem',    fontWeight: 600, lineHeight: 1.3, margin: '0.8em 0 0.3em' },
            '& .rte-content h5': { fontSize: '0.9rem',  fontWeight: 600, lineHeight: 1.3, margin: '0.7em 0 0.25em' },
            '& .rte-content h6': { fontSize: '0.8rem',  fontWeight: 600, lineHeight: 1.3, margin: '0.6em 0 0.25em' },
            // Primer heading no necesita margen superior
            '& .rte-content :first-child': { marginTop: 0 },
            // Listas
            '& .rte-content ul': { paddingLeft: '1.4em', margin: '0 0 0.75em 0' },
            '& .rte-content ol': { paddingLeft: '1.4em', margin: '0 0 0.75em 0' },
            '& .rte-content li': { margin: '0.2em 0' },
            '& .rte-content li > p': { margin: 0 },
            // Blockquote
            '& .rte-content blockquote': {
              borderLeft: '3px solid',
              borderColor: 'divider',
              paddingLeft: '1em',
              margin: '0.75em 0',
              color: 'text.secondary',
              fontStyle: 'italic',
            },
            // Separador horizontal
            '& .rte-content hr': {
              border: 'none',
              borderTop: '1px solid',
              borderColor: 'divider',
              margin: '1em 0',
            },
            // Links
            '& .rte-content a': { color: 'primary.main', textDecoration: 'underline', cursor: 'pointer' },
            // Negrita
            '& .rte-content strong': { fontWeight: 700 },
          }}
          onClick={() => editor?.commands.focus()}
        >
          {editor ? <EditorContent editor={editor} /> : (
            <Box sx={{ minHeight: 100, color: 'text.disabled', fontSize: '0.875rem', lineHeight: 1.7 }}>
              {placeholder}
            </Box>
          )}
        </Box>

        {/* ── Hint de atajos ───────────────────────────────────────────────── */}
        <Box
          sx={{
            px: 2,
            py: 0.75,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'action.hover',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Typography variant="caption" color="text.disabled">
            <strong>Enter</strong> = punto y aparte (párrafo nuevo con espacio)
          </Typography>
          <Typography variant="caption" color="text.disabled">·</Typography>
          <Typography variant="caption" color="text.disabled">
            <strong>Shift + Enter</strong> = punto y seguido (salto de línea sin espacio extra)
          </Typography>
          <Typography variant="caption" color="text.disabled">·</Typography>
          <Typography variant="caption" color="text.disabled">
            <strong>Ctrl B / I / U</strong> = negrita / cursiva / subrayado
          </Typography>
        </Box>
      </Box>

      {helperText && (
        <Typography
          variant="caption"
          color={error ? 'error' : 'text.secondary'}
          sx={{ px: 1.75, mt: 0.375, display: 'block' }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
}
