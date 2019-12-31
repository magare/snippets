var db = new Dexie("SnippetsDatabase");
db.version(1).stores({
  snippets: "name,snippet",
  settings: "item,setting"
});

// Binding snippet names to snippet container
// to do => adding sorting and grouping
let renderAllSnippets = () => {
  // Get the snippets
  db.snippets.toArray(response => {
    let snippetsArray = response.map(i => {
      return `
      <span style="font-size: 130%;" onclick="handleOnSnippetClick('${i.name}')">
        <a href="#" class="badge badge-pill badge-primary">${i.name}</a>
      </span>
      `;
    });
    // bind the snippets
    document.getElementById(
      "snippetPillContainer"
    ).innerHTML = snippetsArray.join("\n");
  });
};

// Invoked on Snippet pill click
let handleOnSnippetClick = i => {
  db.snippets.get(i, response => {
    document.getElementById("codeSnippet").innerText = `${response.snippet}`;
  });
};

// For showing alert message
let showAlertMessage = (type, message, timeout) => {
  document.getElementById(
    "alert"
  ).innerHTML = `<div class="alert alert-${type} container" role="alert">${message}</div>`;
  setTimeout(() => {
    document.getElementById("alert").innerHTML = "";
  }, timeout);
};

// adding snippet to db
let addSnippet = () => {
  let name = document.getElementById("inputSnippetName").value;
  let snippet = document.getElementById("inputSnippet").value;

  db.snippets
    .add({
      name: name,
      snippet: snippet
    })
    .then(response => {
      renderAllSnippets();
      // make the modal enteries empty
      document.getElementById("inputSnippetName").value = "";
      document.getElementById("inputSnippet").value = "";

      showAlertMessage("success", `Snippet "${response}" has been added`, 3000);
    })
    .catch(error => {
      showAlertMessage(
        "danger",
        `Error in adding snippet <br> ${error.message} `,
        10000
      );
    });
};

// Removing snippet from db
let removeSnippet = () => {
  let name = document.getElementById("removeSnippetName").value;

  db.snippets
    .delete(name)
    .then(response => {
      renderAllSnippets();
      document.getElementById("removeSnippetName").value = "";

      // Alert success
      showAlertMessage("success", `Snippet ${response} has been removed`, 3000);
    })
    .catch(error => {
      // Alert failure
      showAlertMessage(
        "danger",
        `Error in removing snippet <br> ${error.message} `,
        10000
      );
    });
};

// Copies the snippet shown on right hand side to the clipboard
let copySnippet = () => {
  if (document.selection) {
    // IE
    let range = document.body.createTextRange();
    range.moveToElementText(document.getElementById("codeSnippet"));
    range.select();
  } else if (window.getSelection) {
    let range = document.createRange();
    range.selectNode(document.getElementById("codeSnippet"));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  }
  try {
    document.execCommand("copy");
    // Alert success
    showAlertMessage("success", "Copied", 3000);
  } catch (error) {
    // Alert failure
    showAlertMessage("danger", `Can't Copy`, 3000);
  }
};

let addSettings = (item, setting) => {
  db.settings.update(item, { item, setting }).then(response => {
    // If db entry is not present for settings create one
    if (!response) {
      db.settings
        .add({
          item,
          setting
        })
        .then(response => {
          renderAllSnippets();
        })
        .catch(error => {
          console.log(error);
        });
    }
  });
};

renderAllSnippets();
