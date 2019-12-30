var db = new Dexie("SnippetsDatabase");
db.version(1).stores({
  snippets: "name,snippet",
  settings: "item,setting"
});

// Binding snippet names to snippet container
// to do => adding sorting and grouping
let renderAllSnippets = () => {
  db.snippets.toArray(response => {
    let snippetsArray = response.map(i => {
      return `
      <span style="font-size: 130%;" onclick="handleOnClick('${i.name}')">
        <a href="#" class="badge badge-pill badge-primary">${i.name}</a>
      </span>
      `;
    });

    document.getElementById(
      "snippetPillContainer"
    ).innerHTML = snippetsArray.join("\n");
  });
};

// on add snippet button click
handleOnClick = i => {
  db.snippets.get(i, response => {
    document.getElementById("codeSnippet").innerText = `${response.snippet}`;
  });
};

// adding snippet to db
addSnippet = () => {
  let name = document.getElementById("inputSnippetName").value;
  let snippet = document.getElementById("inputSnippet").value;

  db.snippets
    .add({
      name: name,
      snippet: snippet
    })
    .then(response => {
      renderAllSnippets();
      document.getElementById("inputSnippetName").value = "";
      document.getElementById("inputSnippet").value = "";

      document.getElementById(
        "alert"
      ).innerHTML = `<div class="alert alert-success container" role="alert">Snippet ${response} has been added</div>`;
      setTimeout(() => {
        document.getElementById("alert").innerHTML = "";
      }, 3000);
    })
    .catch(error => {
      document.getElementById(
        "alert"
      ).innerHTML = `<div class="alert alert-danger container" role="alert">Error in adding snippet <br> ${error.message} </div>`;
      setTimeout(() => {
        document.getElementById("alert").innerHTML = "";
      }, 10000);
    });
};

// Removing snippet from db
removeSnippet = () => {
  let name = document.getElementById("removeSnippetName").value;

  db.snippets
    .delete(name)
    .then(response => {
      renderAllSnippets();
      document.getElementById("removeSnippetName").value = "";

      document.getElementById(
        "alert"
      ).innerHTML = `<div class="alert alert-success container" role="alert">Snippet ${response} has been removed</div>`;
      setTimeout(() => {
        document.getElementById("alert").innerHTML = "";
      }, 3000);
    })
    .catch(error => {
      document.getElementById(
        "alert"
      ).innerHTML = `<div class="alert alert-danger container" role="alert">Error in removing snippet <br> ${error.message} </div>`;
      setTimeout(() => {
        document.getElementById("alert").innerHTML = "";
      }, 10000);
    });
};

copySnippet = () => {
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
    document.getElementById(
      "alert"
    ).innerHTML = `<div class="alert alert-success container" role="alert">Copied </div>`;
    setTimeout(() => {
      document.getElementById("alert").innerHTML = "";
    }, 3000);
  } catch (error) {
    document.getElementById(
      "alert"
    ).innerHTML = `<div class="alert alert-danger container" role="alert">Can't Copy </div>`;
    setTimeout(() => {
      document.getElementById("alert").innerHTML = "";
    }, 3000);
  }
};

addSettings = (item, setting) => {
  db.settings.update(item, { item, setting }).then(response => {
    // If db entry is not present for settings create one
    if (!response) {
      db.settings
        .add({
          item,
          setting
        })
        .then(response => {
          console.log(response);
          renderAllSnippets();
        })
        .catch(error => {
          console.log(error);
        });
    }
  });
};

renderAllSnippets();
