let ul = document.querySelector('ul');
let li = document.querySelector('li');
let postLists = document.querySelector('div');
let formPosts = document.querySelector('form');
let inputTitle = document.querySelector('#title');
let inputAuthor = document.querySelector('#author');
let text = {};

let getJSON = function(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {
            var status = xhr.status;

            if (status === 200) {
                resolve(xhr.response);
            } else {
                reject(status);
            }
        };
        xhr.send();
    });
};
function saveJSON(url, data) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-type', 'application/json', 'charset=utf-8');
        xhr.responseType = 'json';
        xhr.onload = function() {
            var status = xhr.status;
            resolve(xhr.response);
        };
        xhr.onerror = function() {
            reject('Error fetching' + url);
        };
        xhr.send(data);
        li.innerHTML = `new post${inputTitle.value} author ${inputAuthor.value}`;
        ul.append(li);
        console.log('success', text), 
        function(status) {
            console.log('wrong', status)
        }
    })
    
}
getJSON('http://localhost:3000/posts').then((data) => {
    ul.innerHTML = data.map((post)=> {
        let li = `<li> post ${post.title} of ${post.author} </li>`;
        return li;
    }).join('');
    postLists.appendChild(ul);
});

formPosts.addEventListener('submit', (e) => {
    e.preventDefault();
    text = {
        'title': inputTitle.value,
        'author': inputAuthor.value
    }
    saveJSON('http://localhost:3000/posts', JSON.stringify(text)).then((text) => {
        li.innerHTML = `new post ${inputTitle.value} author ${inputAuthor.value}`
        ul.append(li)
        console.log('success', text),
        function(status) {
        console.log('wrong', status)
        }
    })  
})

