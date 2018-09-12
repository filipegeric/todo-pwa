(function() {
  let todos = document.getElementById('todos');
  let form = document.getElementById('form');
  let submitButton = document.getElementById('submit-button');
  let input = document.getElementById('input');
  let storedItems = JSON.parse(localStorage.getItem('items'));

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').then(() => {
      console.log('Service Worker Registered');
    });
  }

  if (storedItems) {
    let text = '';
    for (let i = 0; i < storedItems.length; i++) {
      text += `
        <div class="todo show">
          <p>${storedItems[i]}</p>
          <img class="close" src="close.svg">
        </div>
      `;
    }
    todos.innerHTML += text;
  } else {
    storedItems = [];
  }

  form.addEventListener('submit', handleSubmit);
  submitButton.addEventListener('click', handleSubmit);
  todos.addEventListener('click', handleRemove);

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.value) {
      return;
    }
    let newTodo = document.createElement('div');
    newTodo.className = 'todo';
    newTodo.innerHTML = `
      <p>${input.value}</p>
      <img class="close" src="close.svg">
    `;
    todos.appendChild(newTodo);
    setTimeout(function() {
      newTodo.className = newTodo.className + ' show';
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
        e.target.parentElement.children[0].innerHTML
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
})();
