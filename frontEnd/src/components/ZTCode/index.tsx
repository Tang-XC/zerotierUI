import { FC, useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { html } from '@codemirror/lang-html';

interface Props {
  height?: string;
  value: string;
  onChange: (value: string) => void;
}
const ZTCode: FC<Props> = (prop: Props) => {
  const { height = '300px', value, onChange } = prop;
  const codeMirrorRef = useRef<HTMLDivElement | Element>(null);
  const editorRef = useRef<EditorView>();
  const initCodeMirror = () => {
    if (!editorRef.current && value) {
      editorRef.current = new EditorView({
        extensions: [
          basicSetup,
          html(),
          EditorView.updateListener.of((e) => {
            let result = e.state.doc.toString();
            result === '' && (result = `<div>\n</div>`);
            onChange(result);
          }),
        ],
        parent: codeMirrorRef.current as Element,
        doc: value,
      });
    }
  };
  useEffect(() => {
    initCodeMirror();
  }, []);
  useEffect(() => {
    initCodeMirror();
  }, [value]);
  return (
    <div
      style={{ maxHeight: height, width: '100%', overflowY: 'auto' }}
      ref={codeMirrorRef as any}></div>
  );
};
export default ZTCode;
