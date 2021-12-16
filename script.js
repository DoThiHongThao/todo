let todos = [];
const todoForm = document.querySelector(".todo-form");
const todoInput = document.querySelector(".todo-input");
const todoItemsList = document.querySelector(".list-item");

var list_action = document.getElementById("action");
var btns = list_action.getElementsByClassName("btn-select");
for (var i = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function () {
    var current = document.getElementsByClassName("btn-action");
    if (current.length > 0) {
      current[0].className = current[0].className.replace(" btn-action", "");
    }
    this.className += " btn-action";
    getListItem();
  });
}

todoForm.addEventListener("submit", function (event) {
  event.preventDefault();
  addTodo(todoInput.value);
});

// add, edit, delete todo
function addTodo(item) {
  if (todoInput.value == "") {
    alert("Please enter the content of todo");
  } else {
    const todo = {
      id: Date.now(),
      content: item,
      completed: false,
    };
    todos.push(todo);
    addToLocalStorage(todos);
    todoInput.value = "";
  }
}
function editTodo(id, value) {
  todos.forEach(function (item) {
    if (item.id == id) {
      item.content = value;
    }
    return id;
  });
  console.log(todos);
  addToLocalStorage(todos);
}

function deleteTodo(id) {
  todos = todos.filter(function (item) {
    return item.id != id;
  });

  addToLocalStorage(todos);
}

//render item
function renderItem(item) {
  const checked = item.completed ? "checked" : null;
  const li = document.createElement("li");
  li.setAttribute("data-key", item.id);
  li.setAttribute("class", "content");
  if (item.completed === true) {
    li.classList.add("checked");
  }

  li.innerHTML = `
    <input type="checkbox" class="checkbox" ${checked}>
    <span class="item-content" title="Click edit">${item.content}</span>
    <i class="fa fa-trash icon delete-button"></i>
  `;
  todoItemsList.append(li);
}

// select all, todo, done
function renderAll(todos) {
  todoItemsList.innerHTML = "";
  todos.forEach(function (item) {
    renderItem(item);
  });
}
function renderCompleted(todos) {
  todoItemsList.innerHTML = "";
  todos.forEach(function (item) {
    if (item.completed) {
      renderItem(item);
    }
  });
}
function renderTodo(todos) {
  todoItemsList.innerHTML = "";
  todos.forEach(function (item) {
    if (!item.completed) {
      renderItem(item);
    }
  });
}

//localStorage
function addToLocalStorage(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
  getListItem();
}

function getFromLocalStorage(action) {
  const reference = localStorage.getItem("todos");
  if (reference) {
    todos = JSON.parse(reference);
    if (action == "all") {
      renderAll(todos);
    } else if (action == "todo") {
      renderTodo(todos);
    } else {
      renderCompleted(todos);
    }
  }
}

// mark the job as done
function mark_complete(id) {
  todos = todos.filter(function (item) {
    if (item.id == id) {
      item.completed = true;
    }
    return id;
  });

  addToLocalStorage(todos);
}

// unmark job done
function unmark_complete(id) {
  todos = todos.filter(function (item) {
    if (item.id == id) {
      item.completed = false;
    }
    return id;
  });

  addToLocalStorage(todos);
}


function getListItem() {
  var div_button = document.getElementById("action");
  var btns = div_button.getElementsByClassName("btn-action")[0].id;
  if (btns == "todo") {
    getFromLocalStorage("todo");
  } else if (btns == "all") {
    getFromLocalStorage("all");
  } else {
    getFromLocalStorage("done");
  }
}

function getContent(id) {
  todo = todos.filter(function (item) {
    return item.id == id;
  });
  return todo[0].content;
}

todoItemsList.addEventListener("click", function (event) {
  if (event.target.type === "checkbox") {
    if (event.target.checked) {
      mark_complete(event.target.parentElement.getAttribute("data-key"));
    } else {
      unmark_complete(event.target.parentElement.getAttribute("data-key"));
    }
    getListItem();
  }
  if (event.target.classList.contains("item-content")) {
    var span = event.target.parentElement.getElementsByTagName("span");
    var id = event.target.parentElement.getAttribute("data-key");
    var content = getContent(id);
    span[0].innerHTML = `<input value="${content}" id="editInput">`;
    var input = document.getElementById("editInput");
    input.addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        if (input.value == '') {
          alert("Please enter the content of todo");
        } else {
          editTodo(id, input.value);
          span[0].innerHTML = `<span class="item-content">${input.value}</span>`;
        }
      }
    });
    console.log(span);
  }

  if (event.target.classList.contains("delete-button")) {
    deleteTodo(event.target.parentElement.getAttribute("data-key"));
  }
});

getFromLocalStorage("todo");
getListItem();
