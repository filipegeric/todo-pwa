(function() {
  let todos = document.getElementById('todos');
  let form = document.getElementById('form');
  let submitButton = document.getElementById('submit-button');
  let input = document.getElementById('input');
  let storedItems = JSON.parse(localStorage.getItem('items'));
  let sw = null;

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').then((swReg) => {
      sw = swReg;
      console.log('Service Worker Registered');
    });
  }

  checkStoredItems();
  form.addEventListener('submit', handleSubmit);
  submitButton.addEventListener('click', handleSubmit);
  todos.addEventListener('click', handleRemove);

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.value) {
      return;
    }
    let newTodo = composeNewTodo(input.value);
    todos.appendChild(newTodo);
    setTimeout(function() {
      newTodo.className += ' show';
    }, 10);

    // scroll to bottom animation after adding new item
    setTimeout(() => {
      let interval = setInterval(() => {
        todos.scrollTop = todos.scrollTop + 1;
        if (
          todos.scrollTop - (todos.scrollHeight - todos.clientHeight) >= -5 &&
          todos.scrollTop - (todos.scrollHeight - todos.clientHeight) <= 5
        ) {
          clearInterval(interval);
        }
      }, 2);
    }, 100);

    storedItems.push(input.value);
    localStorage.setItem('items', JSON.stringify(storedItems));

    input.value = '';
    input.focus();
  }

  function handleRemove(e) {
    if (e.target && e.target.classList.value === 'close') {
      e.preventDefault();

      let index = storedItems.indexOf(
        e.target.parentElement.children[0].innerText
      );
      if (index !== -1) {
        storedItems.splice(index, 1);
        localStorage.setItem('items', JSON.stringify(storedItems));
        console.log(storedItems);
      }

      // this actually removes 'show' from class name
      e.target.parentElement.className = 'todo';
      setTimeout(() => {
        todos.removeChild(e.target.parentElement);
      }, 400);
    }
  }

  function composeNewTodo(string, show = false) {
    let newTodo = document.createElement('div');
    if (show) {
      newTodo.className = 'todo show';
    } else {
      newTodo.className = 'todo';
    }
    let paragraphElement = document.createElement('p');
    paragraphElement.innerText = string;
    let imgElement = document.createElement('img');
    imgElement.className = 'close';
    imgElement.setAttribute('src', 'close.svg');
    newTodo.appendChild(paragraphElement);
    newTodo.appendChild(imgElement);
    return newTodo;
  }

  function checkStoredItems() {
    if (storedItems) {
      for (let i = 0; i < storedItems.length; i++) {
        todos.appendChild(composeNewTodo(storedItems[i], false));
      }
      setTimeout(() => {
        let a = document.querySelectorAll('.todo');
        for (let i = 0; i < a.length; i++) {
          a[i].className += ' show';
        }
      }, 50);
    } else {
      storedItems = [];
    }
  }
})();
