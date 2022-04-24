import {
  illustrationDiv,
  editorAreaDiv,
  editorTopDiv,
  editorTopOverlayDiv,
  editorLowDiv,
} from "../elements.js";

var scale = 0;

function resizeEditorOnReload() {
  const distance = 100;
  const rWidth = illustrationDiv.offsetWidth;
  const rHeight = illustrationDiv.offsetHeight;
  let cWidth = editorAreaDiv.clientWidth;
  let cHeight = editorAreaDiv.clientHeight;
  let width,
    height = 0;

  if (rWidth + cHeight >= rHeight + cWidth) {
    width = cWidth - distance;
    scale = width / rWidth;
    height = rHeight * scale;
  } else {
    height = cHeight - distance;
    scale = height / rHeight;
    width = rWidth * scale;
  }

  editorTopDiv.style.width = width.toString() + "px";
  editorTopDiv.style.height = height.toString() + "px";

  editorTopOverlayDiv.style.width = width.toString() + "px";
  editorTopOverlayDiv.style.height = height.toString() + "px";

  editorLowDiv.style.width = rWidth.toString() + "px";
  editorLowDiv.style.height = rHeight.toString() + "px";
  editorLowDiv.style.transform = "scale(" + scale.toString() + ")";

  window.addEventListener("resize", resizeEditorOnReload);
}

export { resizeEditorOnReload, scale };
