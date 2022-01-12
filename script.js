const ul = document.getElementById('list');
const input = document.getElementById('task');
const create = document.getElementById('add');


function getJSON(url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url)

        xhr.responseType = 'json';

        xhr.onload = function () {
            if (xhr.status === 200) {
                let todos = xhr.response
                resolve(xhr.response)
                showTodos(todos)
            } else {
                reject(xhr.status)
            }
        }
        xhr.send();
    })
}

function showTodos(todos) {
    let li = ul.appendChild(document.createElement('li'))
    let lis = '';
    todos.forEach(function (todo) {
        li.innerHTML = todo.task;
        let doneOrNot = todo.complited ? "done" : "not-done";
        lis += `<li class="${doneOrNot}" data-id="${todo.id}">${todo.task}<button class="set-status">Change status</button><button class="delete-task">Delete</button></li>`;
    })
    li.innerHTML = lis;
}

function postJSON(url, data) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();

        xhr.open('POST', url)
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        xhr.responseType = "json";

        xhr.onload = function () {
            if (xhr.status === 200) {
                resolve(xhr.response)
            } else {
                reject(xhr.status)
            }
        }
        xhr.send(JSON.stringify(data));
    });
}

function patchJSON(url, dataId, status) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();

        xhr.open('PATCH', url + `/${dataId}`)
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        xhr.responseType = 'json';

        let data = {
            complited: !status
        }

        xhr.onload = function () {
            if (xhr.status === 200) {
                resolve(xhr.response)
            } else {
                reject(xhr.status)
            }
        }
        xhr.send(JSON.stringify(data));
    })
}

function deleteJSON(url, dataId) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();

        xhr.open('delete', url + `/${dataId}`, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

        xhr.responseType = 'json';

        xhr.onload = function () {
            resolve(xhr.response);
        };

        xhr.send(null);
    });
}

getJSON('http://localhost:3000/todos')
    .then(function (data) {
        console.log('Success ', data);
    }, function (status) {
        console.log('Something went wrong.', status);
    });


create.addEventListener('click', (event) => {

    let jsonArr = {
        "task": input.value,
        "complited": false,
    }

    postJSON('http://localhost:3000/todos', jsonArr)
        .then(function (data) {
            console.log('Success ', data);
        }, function (status) {
            console.log('Something went wrong.', status);
        });
})

ul.addEventListener('click', (event) => {
    let dataId = event.target.closest('[data-id]').dataset.id;
    let trueStatus = event.target.closest('li').classList.contains('done')
    if (event.target.className === 'set-status') {
        patchJSON('http://localhost:3000/todos', dataId, trueStatus)
            .then(function (data) {
                console.log('Success ', data);
            }, function (status) {
                console.log('Something went wrong.', status);
            });
        location.reload();
    }
    if (event.target.className === 'delete-task') {
        deleteJSON('http://localhost:3000/todos', dataId)
            .then(function (data) {
                console.log('Success ', data);
            }, function (status) {
                console.log('Something went wrong.', status);
            });
        location.reload();
    }
})