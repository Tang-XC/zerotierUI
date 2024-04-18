import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import React, { useState, useEffect } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import toolbarConfig from './config/toolbarConfig'; //工具栏配置

function Index(props) {
  const { height = '150px' } = props;
  // editor 实例
  const [editor, setEditor] = useState(null); // JS 语法
  // 编辑器配置
  const editorConfig = {
    // JS 语法
    placeholder: '请输入内容...',
  };

  //用于Form组件下，value代表传输过来的值，onChange代表要提交的值
  const { value, onChange } = props;

  // 编辑器内容
  const handleChange = (val) => {
    onChange?.(val.getHtml());
  };
  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  return (
    <>
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={value}
          onCreated={setEditor}
          onChange={handleChange}
          mode="default"
          style={{ height: height, overflowY: 'hidden' }}
        />
      </div>
    </>
  );
}

export default Index;
