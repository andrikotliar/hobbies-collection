import styles from './styles.module.css';
import { type Editor } from '@tiptap/react';
import { ToolButton } from '../tool-button/tool-button';
import { toolsConfig } from '~/shared/components/text-editor/configs/tools-config';
import {
  MenuBarAdditionalOptions,
  type EditorMenuOption,
} from '~/shared/components/text-editor/components/menu-bar-additional-options/menu-bar-additional-options';

type Props = {
  editor: Editor | null;
  menuOptions?: EditorMenuOption[];
};

export const MenuBar = ({ editor, menuOptions }: Props) => {
  if (!editor) {
    return null;
  }

  return (
    <div className={styles.menu}>
      {toolsConfig.map((tool, index) => (
        <ToolButton
          onClick={() => tool.action(editor)}
          isActive={editor.isActive(tool.key, tool.attributes)}
          icon={tool.icon}
          key={index}
        />
      ))}
      {menuOptions && <MenuBarAdditionalOptions options={menuOptions} editor={editor} />}
    </div>
  );
};
