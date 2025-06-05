import {ViewPlugin, Decoration, WidgetType} from '@codemirror/view';
import {RangeSetBuilder} from '@codemirror/state';
import {MarkdownView} from 'obsidian';

// A widget representing the draggable handle shown before each line
class HandleWidget extends WidgetType {
  constructor(view, line, plugin) {
    super();
    this.view = view;
    this.line = line;
    this.plugin = plugin;
  }

  eq(other) {
    return other.line === this.line;
  }

  toDOM(view) {
    const indicator = document.createElement('div');
    indicator.className = 'drag-handle-indicator';
    indicator.setAttribute('contenteditable', 'false');
    indicator.setAttribute('aria-hidden', 'true');
    indicator.draggable = true;

    const icon = indicator.appendChild(document.createElement('div'));
    icon.className = 'drag-handle-icon';
    icon.innerText = '⠿';
    icon.setAttribute('contenteditable', 'false');
    icon.setAttribute('aria-hidden', 'true');

    indicator.ondragstart = event => {
      const parentEl = indicator.parentElement;
      if (parentEl) {
        parentEl.style.backgroundColor = 'var(--interactive-hover)';
        parentEl.style.borderRadius = '5px';
        parentEl.style.boxShadow = '3px 3px 5px black';
        event.dataTransfer?.setData('text/plain', view.state.doc.lineAt(this.line).text);
        event.dataTransfer?.setDragImage(parentEl, 0, parentEl.clientHeight / 2);
      }
    };

    indicator.ondrop = event => {
      event.preventDefault();
      const data = event.dataTransfer?.getData('text/plain');
      const coords = {x: event.clientX, y: event.clientY};
      const newPos = view.posAtCoords(coords);
      if (data != null && newPos != null) {
        const newLine = view.state.doc.lineAt(newPos);
        // Simple replace of dropped text
        view.dispatch({
          changes: {from: newLine.from, to: newLine.to, insert: data}
        });
      }
    };

    return indicator;
  }
}

// CodeMirror view plugin that inserts a HandleWidget before each visible line
class HandleViewPlugin {
  constructor(view) {
    this.decorations = this.buildDecorations(view);
  }

  update(update) {
    if (update.docChanged || update.viewportChanged || update.focusChanged) {
      this.decorations = this.buildDecorations(update.view);
    }
  }

  destroy() {}

  buildDecorations(view) {
    const builder = new RangeSetBuilder();
    for (const {from, to} of view.visibleRanges) {
      for (let pos = from; pos <= to;) {
        const line = view.state.doc.lineAt(pos);
        builder.add(line.from, line.from, Decoration.widget({
          widget: new HandleWidget(view, line.number, this.plugin),
          side: -1,
          inlineOrder: true,
        }));
        pos = line.to + 1;
      }
    }
    return builder.finish();
  }
}

const handleRender = ViewPlugin.fromClass(HandleViewPlugin, {
  decorations: v => v.decorations,
});

export default class DragHandle {
  constructor(plugin, settings) {
    this.plugin = plugin;
    this.settings = settings;
    this.dropZonePadding = null;
    this.dropZone = null;
    this.extensionAdded = false;
    this.enabled = false;
    this.update = this.update.bind(this);
  }

  async load() {
    this.settings.onChange(this.update);
    this.update();
  }

  async unload() {
    this.settings.removeCallback(this.update);
    this.disable();
  }

  update() {
    if (this.settings.dragHandles && !this.enabled) {
      this.enable();
    } else if (!this.settings.dragHandles && this.enabled) {
      this.disable();
    }
  }

  enable() {
    if (!this.extensionAdded) {
      this.plugin.registerEditorExtension(handleRender);
      this.extensionAdded = true;
    }
    this.createDropZone();
    document.addEventListener('dragenter', this.handleDragEnter);
    document.body.classList.remove('hide-drag-handles');
    this.enabled = true;
  }

  disable() {
    this.removeDropZone();
    document.removeEventListener('dragenter', this.handleDragEnter);
    document.body.classList.add('hide-drag-handles');
    this.enabled = false;
  }

  createDropZone() {
    this.dropZonePadding = document.createElement('div');
    this.dropZonePadding.classList.add('drop-zone-padding');
    this.dropZone = this.dropZonePadding.appendChild(document.createElement('div'));
    this.dropZone.classList.add('drop-zone');
    this.dropZone.style.display = 'none';
    document.body.appendChild(this.dropZonePadding);
  }

  removeDropZone() {
    if (this.dropZonePadding && this.dropZonePadding.parentElement) {
      this.dropZonePadding.parentElement.removeChild(this.dropZonePadding);
    }
    this.dropZonePadding = null;
    this.dropZone = null;
  }

  handleDragEnter = event => {
    event.preventDefault();
    event.stopPropagation();
  };
}
