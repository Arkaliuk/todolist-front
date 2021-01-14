const filterOption = document.querySelector(".filter-todo");
let todoList = document.getElementById("todolist");
filterOption.addEventListener('click', filterTodo);

function filterTodo(e) {
    let todos = Array.from(todoList.children);
    for (todo of todos) {
        checkTarget(e.target.value, todo);
    }
}
function checkTarget(type, todo) {
    switch (type) {
        case "all":
            todo.style.display = 'block';
            break;
        case "completed":
            if (todo.classList.contains('checked')) {
                todo.style.display = 'block';
            } else {
                todo.style.display = 'none';
            }
            break;
        case "uncompleted":
            if (todo.classList.contains('checked')) {
                todo.style.display = 'none';
            } else {
                todo.style.display = 'block';
            }
            break;
    }
};

// Close button
let myNodelist = document.getElementsByTagName("LI");

for (i = 0; i < myNodelist.length; i++) {
    let span = document.createElement("SPAN");
    let txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    myNodelist[i].appendChild(span);
}

let close = document.getElementsByClassName("close");

for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
        let div = this.parentElement;
        list.removeChild(div);
    }
}

// Add a "checked" symbol 
let list = document.querySelector('ul');
list.addEventListener('click', function (ev) {
    if (ev.target.tagName === 'LI') {

        ev.target.classList.toggle('checked');
        let target = document.querySelector(".filter-todo").value;
        checkTarget(target, ev.target);
    }
});

function check(item) {

    if (item.done === true) {
        title.classList.add("title_done");
    }

    if (item.dueDate < new Date()) {
        dueDate.classList.add("date_done");
    }
}

function newElement(item) {
    let li = document.createElement("li");
    let normallyDate = item.dueDate;
    // ? item.dueDate.getDate() + '.' + (item.dueDate.getMonth() + 1) + '.' + item.dueDate.getFullYear() : "";
    let title = document.createElement("p");
    title.classList.add("title");
    let desc = document.createElement("p");
    desc.classList.add("desc")
    let dueDate = document.createElement("p");

    if (item.dueDate < new Date()) {
        dueDate.classList.add("date_done");
    }
    desc.classList.add("desc");
    title.textContent = item.title;
    desc.textContent = item.description;
    dueDate.textContent = normallyDate;
    li.append(title, desc, dueDate);


    document.getElementById("todolist").appendChild(li);

    document.getElementById("myInput").value = "";
    document.getElementById("description").value = "";
    document.getElementById("dueDate").value = ""

    let span = document.createElement("SPAN");
    let txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);

    for (i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            var div = this.parentElement;
            list.removeChild(div);
        }
    }
}
const formsValue = document.forms['todo-list'];

formsValue.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(formsValue);
    let title = formData.get('title');

    let date = formData.get('dueDate');

    let description = formData.get('description');
    if (!title) {
        alert("You must write title!")
        return;
    }
    const todo = {
        title: title,
        description: description,
        done: false,
        dueDate: date ? new Date(date) : null,
        todoList: {
            id: 1
        }
    };
    createTodo(todo)
        .then(newElement, alert)
        .then(_ => formsValue.reset())
})

const todoURL = 'http://localhost:8080/todo';

function createTodo(todo) {
    return fetch(todoURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
    })
        .then(response => response.json())
}



function getAllTasks() {
    return fetch(todoURL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
}

getAllTasks()
    .then(r => r.map(e => new TodoList(e.title, e.description, e.done, e.dueDate)))
    .then(r => r.forEach(newElement))


class TodoList {
    constructor(title, description, done, dueDate) {
        if (typeof title === 'object') {
            Object.assign(this, title);
        } else {
            this.title = title;
            this.description = description;
            this.done = done;
            this.dueDate = dueDate;
        }
    }

    toString() {
        return `${this.title} ${this.description} ${this.done} ${this.dueDate}`;
    }
}