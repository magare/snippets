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

  console.log("name snippet ", name, snippet);

  db.snippets
    .add({
      name: name,
      snippet: snippet
    })
    .then(response => {
      console.log(response);
      renderAllSnippets();
      document.getElementById("inputSnippetName").value = "";
      document.getElementById("inputSnippet").value = "";
    })
    .catch(error => {
      console.log(error);
    });
};

copySnippet = () => {
    if (document.selection) { // IE
        let range = document.body.createTextRange();
        range.moveToElementText(document.getElementById('codeSnippet'));
        range.select();
    } else if (window.getSelection) {
        let range = document.createRange();
        range.selectNode(document.getElementById('codeSnippet'));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
    document.execCommand("copy")
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
