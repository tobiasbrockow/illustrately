import { resizeEditorOnReload, scale } from "./reload.js";
import {
  editorTopDiv,
  editorOverlayDiv,
  sidebarAside,
  sidebarColorsDiv,
  sidebarGraphicOptionsDiv,
} from "../elements.js";

interface Graphic {
  html: string;
  id: string;
}

function handleGraphicSelection() {
  document
    .querySelectorAll<HTMLElement>(".graphic")
    .forEach((e) => makeElementDraggable(e));
  document
    .querySelectorAll<HTMLElement>(".graphic")
    .forEach((e) => makeElementClickable(e));
  document
    .querySelectorAll<HTMLElement>(".graphic")
    .forEach((e) => makeElementSelectable(e));
  document.onmousemove = hideSelectionOnHoverOutsideGraphic;

  function hideSelectionOnHoverOutsideGraphic(m: MouseEvent) {
    let isMouseinEditor = editorTopDiv.contains(m.target as Node);
    if (!isMouseinEditor) {
      editorOverlayDiv.style.borderStyle = "none";
    }
  }

  function makeElementClickable(element: HTMLElement) {
    element.onclick = handleClick;

    function handleClick(m: MouseEvent) {
      document
        .querySelectorAll<HTMLDivElement>(".graphic")
        .forEach((e) => (e !== element ? (e.onmousemove = null) : null));
      document
        .querySelectorAll<HTMLDivElement>(".graphic")
        .forEach((e) => (e !== element ? (e.onmousedown = null) : null));
      document
        .querySelectorAll<HTMLDivElement>(".graphic")
        .forEach((e) => (e !== element ? (e.onclick = null) : null));
      document.onmousemove = null;
      element.onclick = null;

      makeElementResizeable(element);
      openGraphicReplacements(element);
      document
        .querySelectorAll<HTMLDivElement>(".overlay-10")
        .forEach((e) => (e.style.display = "block"));
      resizeOverlay(element);

      document.onclick = addEventToDeactivateState;

      function addEventToDeactivateState(m: MouseEvent) {
        deactivateClickedGraphicState(element, m);
      }
    }
  }

  function deactivateClickedGraphicState(element: HTMLElement, m: MouseEvent) {
    let isClickInElement =
      element.contains(m.target as Node) ||
      sidebarAside.contains(m.target as Node);
    if (!isClickInElement) {
      handleGraphicSelection();
      closeGraphicRepSelection();
      editorOverlayDiv.style.borderStyle = "none";
      document
        .querySelectorAll<HTMLDivElement>(".overlay-10")
        .forEach((e) => (e.style.display = "none"));
      resizeEditorOnReload();
    }
  }

  function openGraphicReplacements(element: HTMLElement) {
    sidebarAside.style.width = "40%";
    sidebarColorsDiv.style.display = "none";
    sidebarGraphicOptionsDiv.style.display = "flex";
    resizeEditorOnReload();

    fetch(window.location.origin + "/design/graphics/" + element.id, {
      method: "GET",
    })
      .then((r) => r.json())
      .then((r) => {
        r.graphics.forEach(createGraphicOnSidebar);
        document
          .querySelectorAll(".graphic-replacement-4")
          .forEach(addClickListenerGraphic);
      });

    function createGraphicOnSidebar(graphic: Graphic) {
      let div = document.createElement("div");
      div.classList.add("graphic-replacement-4");
      div.innerHTML = graphic.html;
      sidebarGraphicOptionsDiv.appendChild(div);
    }

    function addClickListenerGraphic(graphic: HTMLElement) {
      graphic.onclick = replaceGraphic;

      function replaceGraphic(m: MouseEvent) {
        element.innerHTML = graphic.innerHTML;
      }
    }
  }

  function closeGraphicRepSelection() {
    sidebarAside.style.width = "20%";
    sidebarColorsDiv.style.display = "block";
    sidebarGraphicOptionsDiv.style.display = "none";
    document
      .querySelectorAll<HTMLDivElement>(".graphic-replacement-4")
      .forEach((e) => e.remove());
  }

  function makeElementSelectable(element: HTMLElement) {
    element.onmousemove = handleSelection;

    function handleSelection(m: MouseEvent) {
      resizeOverlay(element);
    }
  }

  function resizeOverlay(element: HTMLElement) {
    var style = window.getComputedStyle(element);
    var matrix = new WebKitCSSMatrix(style.transform);

    let transform =
      "translate(" + matrix.m41 * scale + "px, " + matrix.m42 * scale + "px)";
    let width = (element.clientWidth * scale).toString() + "px";
    let height = (element.clientHeight * scale).toString() + "px";

    editorOverlayDiv.style.transform = transform;
    editorOverlayDiv.style.width = width;
    editorOverlayDiv.style.height = height;
    editorOverlayDiv.style.borderStyle = "solid";
  }

  function makeElementResizeable(element: HTMLElement) {
    let startX = 0,
      startY = 0,
      positionDiff = 0,
      newWidth = 0,
      newHeight = 0,
      tX = 0,
      tY = 0,
      newTX = 0,
      newTY = 0,
      startWidth = 0,
      startHeight = 0;
    let dragPos = "";
    let topLeft = document.querySelector<HTMLDivElement>("#resize-top-left")!;
    let topRight = document.querySelector<HTMLDivElement>("#resize-top-right")!;
    let botLeft = document.querySelector<HTMLDivElement>(
      "#resize-bottom-left"
    )!;
    let botRight = document.querySelector<HTMLDivElement>(
      "#resize-bottom-right"
    )!;

    topLeft.onmousedown = dragMouseDown;
    topRight.onmousedown = dragMouseDown;
    botLeft.onmousedown = dragMouseDown;
    botRight.onmousedown = dragMouseDown;

    function dragMouseDown(m: MouseEvent) {
      m.preventDefault();

      startX = m.clientX;
      startY = m.clientY;
      startWidth = element.clientWidth;
      startHeight = element.clientHeight;

      var style = window.getComputedStyle(element);
      var matrix = new WebKitCSSMatrix(style.transform);
      tX = matrix.m41;
      tY = matrix.m42;

      document.onmouseup = closeDragElement;
      if (botRight.contains(m.target as Node)) {
        dragPos = "br";
      } else if (topLeft.contains(m.target as Node)) {
        dragPos = "tl";
      } else if (topRight.contains(m.target as Node)) {
        dragPos = "tr";
      } else if (botLeft.contains(m.target as Node)) {
        dragPos = "bl";
      }
      document.onmousemove = elementDrag;
    }

    function elementDrag(m: MouseEvent) {
      m.preventDefault();

      if (dragPos == "br") {
        positionDiff = (m.clientX - startX + (m.clientY - startY)) / 2;
        newWidth = startWidth + positionDiff;
        newHeight = startHeight + positionDiff;
      } else if (dragPos == "tl") {
        positionDiff = (m.clientX - startX + (m.clientY - startY)) / 2;
        newWidth = startWidth - positionDiff;
        newHeight = startHeight - positionDiff;
        newTX = tX + positionDiff;
        newTY = tY + positionDiff;
        element.style.transform = "translate(" + newTX + "px, " + newTY + "px)";
        editorOverlayDiv.style.transform =
          "translate(" + newTX * scale + "px, " + newTY * scale + "px)";
      } else if (dragPos == "tr") {
        positionDiff = (m.clientX - startX + (startY - m.clientY)) / 2;
        newWidth = startWidth + positionDiff;
        newHeight = startHeight + positionDiff;
        newTY = tY - positionDiff;
        element.style.transform = "translate(" + tX + "px, " + newTY + "px)";
        editorOverlayDiv.style.transform =
          "translate(" + tX * scale + "px, " + newTY * scale + "px)";
      } else if (dragPos == "bl") {
        positionDiff = (startX - m.clientX + (m.clientY - startY)) / 2;
        newWidth = startWidth + positionDiff;
        newHeight = startHeight + positionDiff;
        newTX = tX - positionDiff;
        element.style.transform = "translate(" + newTX + "px, " + tY + "px)";
        editorOverlayDiv.style.transform =
          "translate(" + newTX * scale + "px, " + tY * scale + "px)";
      }

      element.style.width = newWidth + "px";
      element.style.height = newHeight + "px";
      editorOverlayDiv.style.width = newWidth * scale + "px";
      editorOverlayDiv.style.height = newHeight * scale + "px";
    }

    function closeDragElement(m: MouseEvent) {
      document.onmouseup = null;
      document.onmousemove = null;
      document.onclick = null;
      setTimeout(resetClickState, 100, m);
    }

    function resetClickState(m: MouseEvent) {
      document.onclick = addEventToDeactivateState;
      function addEventToDeactivateState(m: MouseEvent) {
        deactivateClickedGraphicState(element, m);
      }
    }
  }

  function makeElementDraggable(element: HTMLElement) {
    let pos1 = 0,
      pos2 = 0,
      startX = 0,
      startY = 0;
    element.onmousedown = dragMouseDown;

    function dragMouseDown(m: MouseEvent) {
      m.preventDefault();
      startX = m.clientX;
      startY = m.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(m: MouseEvent) {
      m.preventDefault();
      pos1 = startX - m.clientX;
      pos2 = startY - m.clientY;
      startX = m.clientX;
      startY = m.clientY;
      var style = window.getComputedStyle(element);
      var matrix = new WebKitCSSMatrix(style.transform);
      element.style.transform =
        "translate(" +
        (matrix.m41 - pos1) +
        "px, " +
        (matrix.m42 - pos2) +
        "px)";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
}

export default handleGraphicSelection;
