/* Creates the widget class, used to add instances off the widget thoroughout the document */

import { EditorView, WidgetType } from "@codemirror/view";

export class HandleWidget extends WidgetType {
    toDOM(view: EditorView): HTMLElement {
      const div = document.createElement('span');
  
      div.innerText = '👉';
  
      return div;
    }
  }
  