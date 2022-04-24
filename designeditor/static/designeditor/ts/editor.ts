import {
  watchChangesInEditor,
  handleTitleChange,
} from "./editor/saving-changes.js";
import {
  activateColoringFeature,
  activateResizeFeature,
  activateExportFeature,
} from "./editor/features.js";
import handleGraphicSelection from "./editor/graphic.js";
import { resizeEditorOnReload } from "./editor/reload.js";

document.addEventListener("DOMContentLoaded", function () {
  watchChangesInEditor();
  handleTitleChange();
  handleGraphicSelection();
  resizeEditorOnReload();
  activateColoringFeature();
  activateResizeFeature();
  activateExportFeature();
});
