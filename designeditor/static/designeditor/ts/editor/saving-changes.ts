import { illustrationDiv, statusSpan, designTitleSpan } from "../elements.js";

type Timer = null | NodeJS.Timeout;

var watchChangesInEditor = function () {
  var timer: Timer = null;
  var timerTwo: Timer = null;

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (timer !== null || timerTwo !== null) {
        clearTimeout(timer!);
        clearTimeout(timerTwo!);
        timer = null;
        timerTwo = null;
      }

      if (statusSpan.innerText != "Unsaved changes") {
        statusSpan.innerText = "Unsaved changes";
      }

      timer = setTimeout(saveStatusHandler, 2000);
      timerTwo = setTimeout(saveHandler, 3000);
    });
  });

  var config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
  };

  observer.observe(illustrationDiv, config);
};

var saveHandler = function () {
  updateIllu(illustrationDiv.outerHTML, designTitleSpan.innerText);
  statusSpan.innerText = "All changes saved";
};

var saveStatusHandler = function () {
  statusSpan.innerText = "Saving changes";
};

var updateIllu = function (html: string, title: string) {
  fetch(window.location.pathname.slice(-36) + "/update", {
    method: "PUT",
    body: JSON.stringify({
      html: html,
      name: title,
    }),
  })
    .then((r) => r.json())
    .then((r) => {
      console.log(r);
    });
};

var handleTitleChange = function () {
  const title = document.querySelector<HTMLSpanElement>("#design-title")!;
  const input = document.querySelector<HTMLInputElement>(
    "#design-title-input"
  )!;
  title.addEventListener("click", () => clickedTitle());

  function clickedTitle() {
    input.value = title.innerText;
    title.classList.add("hide");
    input.classList.remove("hide");
    document.addEventListener("click", showHideInput);
  }

  function showHideInput(e: MouseEvent) {
    let isClickInElement =
      input.contains(e.target as Node) || title.contains(e.target as Node);
    if (!isClickInElement) {
      if (title.innerHTML !== input.value) {
        title.innerHTML = input.value;
        updateIllu(illustrationDiv.outerHTML, input.value);
      }
      input.classList.add("hide");
      title.classList.remove("hide");
      console.log(e);
      document.removeEventListener("click", showHideInput);
    }
  }
};

export { watchChangesInEditor, handleTitleChange };
