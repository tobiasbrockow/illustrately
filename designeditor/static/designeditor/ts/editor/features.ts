import html2canvas from "../../js-external/html2canvas.esm.js";
import { resizeEditorOnReload } from "./reload.js";
import {
  exportBtn,
  designTitleSpan,
  primaryColorBtn,
  colorOneInput,
  resizeBtn,
  resizeBtnTwo,
  resizeDropdownDiv,
  resizeWidthInput,
  resizeHeightInput,
  illustrationDiv,
} from "../elements.js";

var colorOnePathList = document.querySelectorAll("[color-id='1']")!;

function activateExportFeature() {
  exportBtn.addEventListener("click", function () {
    html2canvas(document.querySelector(".editor-5")).then(function (
      canvas: HTMLCanvasElement
    ) {
      saveImage(canvas.toDataURL(), designTitleSpan.innerText + ".png");
    });
  });

  function saveImage(uri: string, filename: string) {
    let a = document.createElement("a");
    a.href = uri;
    a.download = filename;
    a.click();
  }
}

function activateColoringFeature() {
  attachColorIDs();
  primaryColorBtn.addEventListener("change", () => updateColor());
  primaryColorBtn.setAttribute(
    "value",
    colorOnePathList[0].getAttribute("fill")!
  );

  function updateColor() {
    colorOnePathList.forEach((e) =>
      e.setAttribute("fill", colorOneInput.value)
    );
  }

  function attachColorIDs() {
    if (colorOnePathList.length == 0) {
      document
        .querySelectorAll("svg [fill='#6C63FF']")
        .forEach((e) => e.setAttribute("color-id", "1"));
    } else {
      return;
    }
  }
}

function activateResizeFeature() {
  resizeBtn.addEventListener("click", () => clickedResize());

  function clickedResize() {
    resizeWidthInput.value = illustrationDiv.offsetWidth.toString();
    resizeHeightInput.value = illustrationDiv.offsetHeight.toString();
    resizeBtnTwo.addEventListener("click", resizeCanvas);
    resizeDropdownDiv.style.display = "flex";
    document.addEventListener("click", showHideDropdown);
  }

  function showHideDropdown(e: MouseEvent) {
    let isClickInElement =
      resizeDropdownDiv.contains(e.target as Node) ||
      resizeBtn.contains(e.target as Node);
    if (!isClickInElement) {
      resizeDropdownDiv.style.display = "none";
      document.removeEventListener("click", showHideDropdown);
    }
  }

  function resizeCanvas() {
    illustrationDiv.style.width = resizeWidthInput.value.toString() + "px";
    illustrationDiv.style.height = resizeHeightInput.value.toString() + "px";
    resizeEditorOnReload();
  }
}

export {
  activateColoringFeature,
  activateResizeFeature,
  activateExportFeature,
};
