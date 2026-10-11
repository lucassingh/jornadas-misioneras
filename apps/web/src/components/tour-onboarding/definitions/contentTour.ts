import { contentOverviewContent, contentEditorContent } from '../content/tourContent';
import type { TourDefinition } from '../types';

/**
 * Índice de "Contenido del sitio": Jumbotron + grilla de tarjetas (una por
 * sección de la landing). Ambos están siempre en el DOM, sin `onEnter`.
 */
export const contentOverviewTourDefinition: TourDefinition = {
  id: contentOverviewContent.pageId,
  buildSteps: () => [
    {
      id: 'content-overview',
      groupId: 'content.overview',
      target: 'content.jumbotron',
      title: contentOverviewContent.overview.title,
      body: contentOverviewContent.overview.body,
      placement: 'bottom',
    },
    {
      id: 'content-list',
      groupId: 'content.list',
      target: 'content.list',
      title: contentOverviewContent.list.title,
      body: contentOverviewContent.list.body,
    },
  ],
  groupLabels: contentOverviewContent.groupLabels,
};

/**
 * Editor de una sección (`/dashboard/content/[section]`): formulario a la
 * izquierda, vista previa a la derecha, barra fija de acciones abajo. Es la
 * misma pantalla para las 12 secciones, así que un solo tour alcanza.
 */
export const contentEditorTourDefinition: TourDefinition = {
  id: 'contentEditor',
  buildSteps: () => [
    {
      id: 'content-editor-form',
      groupId: 'contentEditor.form',
      target: 'contentEditor.form',
      title: contentEditorContent.form.title,
      body: contentEditorContent.form.body,
      placement: 'right-start',
    },
    {
      id: 'content-editor-preview',
      groupId: 'contentEditor.preview',
      target: 'contentEditor.preview',
      title: contentEditorContent.preview.title,
      body: contentEditorContent.preview.body,
      placement: 'left',
    },
    {
      id: 'content-editor-actions',
      groupId: 'contentEditor.actions',
      target: 'contentEditor.actions',
      title: contentEditorContent.actions.title,
      body: contentEditorContent.actions.body,
      placement: 'top',
    },
  ],
  groupLabels: contentEditorContent.groupLabels,
};
