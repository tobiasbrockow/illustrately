document.addEventListener("DOMContentLoaded", function () {
  var newIlluButtons = document.querySelectorAll<HTMLElement>(
    ".new-illus-3 > .illu-4"
  );
  newIlluButtons.forEach(addClickEvent);

  function addClickEvent(value: HTMLElement) {
    value.addEventListener("click", () =>
      newIllu(
        value.firstElementChild!.getAttribute("data-name"),
        value.firstElementChild!.getAttribute("name")
      )
    );
  }
});

function newIllu(dataName: string | null, name: string | null) {
  if (dataName == null || name == null) {
    throw "Couldn't find the base element to create a new illustration from.";
  }
  fetch(
    "http://" +
      window.location.host +
      "/static/designeditor/img/" +
      dataName +
      ".html"
  )
    .then((r) => r.text())
    .then((text) => {
      fetch("new", {
        method: "POST",
        body: JSON.stringify({
          html: text,
          name: name,
        }),
      })
        .then((r) => r.json())
        .then((r) => {
          window.location.href = "editor/" + r.id;
        });
    });
}
