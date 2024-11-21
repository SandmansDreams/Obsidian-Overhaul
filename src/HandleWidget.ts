/* Creates the widget class, used to add instances off the widget thoroughout the document */

import { EditorView, WidgetType } from "@codemirror/view";

export class HandleWidget extends WidgetType {
    toDOM(view: EditorView): HTMLElement {
      const div = document.createElement('div');
        
      div.className = 'drag-handle';

      div.innerText = '⠿';
      //div.style.display = 'inline-block';


  
      return div;
    }
  }
  