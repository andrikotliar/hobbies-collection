import styles from './styles.module.css';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { FieldLabel } from '../field-label';
import { FieldError } from '../field-error';
import { useEffect, useImperativeHandle } from 'react';
import type { FormError } from '~/shared/types/form-error';
import { MenuBar } from './components/menu-bar/menu-bar';
import type { EditorMenuOption } from './components/menu-bar-additional-options/menu-bar-additional-options';

const extensions = [
  StarterKit,
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: 'https',
    protocols: ['https'],
  }),
];

type Props = {
  label?: string;
  error?: FormError;
  content?: string;
  onChange: (content: string) => void;
  menuOptions?: EditorMenuOption[];
  ref?: React.RefObject<EditorRef | null>;
};

export type EditorRef = {
  setContent: (content: string) => boolean | undefined;
};

export const TextEditor = ({ label, error, content = '', onChange, menuOptions, ref }: Props) => {
  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class: styles.editor,
      },
    },
    onUpdate: (props) => onChange(props.editor.getHTML()),
  });

  useEffect(() => {
    if (editor && content?.length && !editor.getText().length) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useImperativeHandle(ref, () => ({
    setContent: (content: string) => editor?.commands.setContent(content),
  }));

  return (
    <div className={styles.editor_wrapper}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div>
        <MenuBar editor={editor} menuOptions={menuOptions} />
        <EditorContent editor={editor} />
      </div>
      <FieldError error={error} />
    </div>
  );
};
