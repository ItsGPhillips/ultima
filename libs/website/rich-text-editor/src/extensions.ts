// Extensions
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { lowlight } from 'lowlight/lib/core';
import Text from '@tiptap/extension-text';
import Color from '@tiptap/extension-color';
import Bold from '@tiptap/extension-bold';
import Strike from '@tiptap/extension-strike';
import Italic from '@tiptap/extension-italic';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';

const CustomParagraph = Paragraph.extend({
  draggable: true,
});

const CustomPlacholder = Placeholder.configure({
  placeholder: 'Write something...',
  showOnlyWhenEditable: true,
});

export const CODE_BLOCK_DATA_ATTR = 'data-code-block';
const CustomCodeBlockLowlight = CodeBlockLowlight.configure({
  HTMLAttributes: {
    [CODE_BLOCK_DATA_ATTR]: true,
  },
  exitOnTripleEnter: true,
  lowlight,
});

export const extensions = () => [
  Document,
  CustomPlacholder,
  CustomParagraph,
  Italic,
  Bold,
  Strike,
  Text,
  Color,
  TextAlign.configure({
    alignments: ['center', 'justify', 'start', 'end'],
    types: ['heading', 'paragraph'],
  }),
  CustomCodeBlockLowlight,
];
