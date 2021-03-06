// base URL
const BASE_URL = "http://localhost:8081/";
// CRUD URLs
const CREATE_URL = BASE_URL + "task/create/";
const READ_URL = BASE_URL + "list/read/";
const PARTIAL_UPDATE_URL = BASE_URL + "task/patch/"
const DELETE_URL = BASE_URL + "task/delete/"

const params = new URLSearchParams(window.location.search);

var todoListForm = document.querySelector('.form');
var todoListItem = document.querySelector('.todo-list');
var todoListInput = document.querySelector('.todo-list-input');

// create
postData = (url, data) => {

    const settings = {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    };

    fetch(url, settings)
    .then(res => res.json())
    .then(function(data) {

        let newListItem = document.createElement("li");
        newListItem.setAttribute('id', data['id']);
        newListItem.innerHTML = "<div class='form-check'>" +
        "<label class='form-check-label'><input class='checkbox' type='checkbox'>" + data['name'] + 
        "<i class='input-helper'></i></label></div>" + 
        "<i class='fas fa-edit'></i> <i class='fas fa-trash-alt'></i>";
        todoListItem.append(newListItem);

        setRemoveListener(newListItem.querySelector('.fa-trash-alt'));
        setEditListener(newListItem.querySelector('.fa-edit'));
        setCheckboxListener(newListItem.querySelector('.checkbox'));
    } )
}

// read one list
getData = (url) => {

    fetch(url + params.get('id'))
    .then(response => response.json())
    .then(function(data) {
        document.querySelector('.card-title').innerHTML = data['topic'];
        console.log(data['topic']);
        let tasks = data['tasks'];
        for (let key in tasks) {

            let newListItem = document.createElement("li");
            newListItem.setAttribute('id', tasks[key]['id']);
            newListItem.innerHTML = "<div class='form-check'>" + 
            "<label class='form-check-label'><input class='checkbox' type='checkbox'>" + tasks[key]['name'] + 
            "<i class='input-helper'></i></label></div> " + 
            "<i class='fas fa-edit'></i> <i class='fas fa-trash-alt'></i>";
            todoListItem.append(newListItem);

            setRemoveListener(newListItem.querySelector('.fa-trash-alt'));
            setEditListener(newListItem.querySelector('.fa-edit'));
            setCheckboxListener(newListItem.querySelector('.checkbox'));

        };
    })

}

// (partial) update
partialUpdateData = (url, id, data) => {

    settings ={
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }

    fetch(url + id, settings)
    .then(response => response.json())
    .then(data => console.log(data));

}

// delete
deleteData = (url, id) => {

    fetch(url + id, {
        method: 'DELETE'
    })
    .then(res => res.text())
    .then(res => console.log(res))

}

// item listeners

setCheckboxListener = (item) => {

    item.addEventListener('change', function () {
        if (this.getAttribute('checked')) {
            this.removeAttribute('checked');
        } else {
            this.setAttribute('checked', 'checked');
        }
        this.closest("li").classList.toggle('completed');
    });

}

setEditListener = (item) => {

    item.addEventListener('click', function() {

        let name = prompt("Please enter a new task name");

        data = {
            "name": name
        }
        
        let id = this.parentElement.id;

        partialUpdateData(PARTIAL_UPDATE_URL, id, data);

        console.log(this.parentElement.querySelector('.form-check-label').textContent);

        let label = this.parentElement.querySelector('.form-check-label');
        label.childNodes[1].textContent = name;
    });
}

setRemoveListener = (item) => {

    item.addEventListener('click', function() {
        let id = this.parentElement.id;
        this.parentElement.remove();
        deleteData(DELETE_URL, id)
    });

}

// create new task on load (only executes once, unless user clears local storage)
window.onload = function () {
    if (localStorage.getItem("newTaskCreated") === null) {
        postData(CREATE_URL, { "name": "new task", "tdList": { "id": 1 } });
        localStorage.setItem("newTaskCreated", true);
    }
}

// populate list
getData(READ_URL);

// set listeners
todoListForm
.addEventListener("submit", function(event) {
    event.preventDefault();

    let newItem = todoListInput.value;  // post

    if (newItem) {

        // data
        const tdList = {
            "name": newItem,
            "tdList": {
                "id": params.get('id')
            }
        }
        
        postData(CREATE_URL, tdList);
        todoListInput.value = '';
    }
});