import { it, expect, vi } from 'vitest';
import './__mock__/document';
import insertEditor from '../src/js/editor';

it('should insert CodeMirror editor', () => {
  const element = document.createElement('div');
  const code = '// Test';
  const callback = vi.fn();
  const editor = insertEditor(element, code, callback);
  editor.dispatch({
    changes: [{ from: 0, to: code.length, insert: '// Updated' }],
  });
  expect(callback).toHaveBeenCalled();
  editor.dispatch({ changes: [] }); // Should fire callback without changing document
});
