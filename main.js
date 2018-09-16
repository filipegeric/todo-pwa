'use strict';

(function() {
  const todos = document.getElementById('todos');
  const form = document.getElementById('form');
  const submitButton = document.getElementById('submit-button');
  const input = document.getElementById('input');
  let storedItems = JSON.parse(localStorage.getItem('items'));
  let sw = null;

  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker
      .register('service-worker.js')
      .then(swReg => {
        sw = swReg;
        console.log('Service Worker Registered', sw);
      })
      .then(() => {
        sw.pushManager.getSubscription().then(sub => {
          if (!sub) {
            subscribeUser();
          }
        });
      });
  }

  checkStoredItems();
  form.addEventListener('submit', handleSubmit);
  submitButton.addEventListener('click', handleSubmit);
  todos.addEventListener('click', handleRemove);

  function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(
      'BCzBS4mgym5ovkb6cIQHyok1yi1HManGSCctWuEiHKefkyWfpxFDD_OvdttgYq3sr3DfmLQG0GJy__ieV9yAnt4'
    );
    sw.pushManager
      .subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      })
      .then(subscription => {
        console.log(JSON.stringify(subscription));
        // this is just temporary
        // here subscription should be sent to the server and stored in database
        const s = composeNewTodo(JSON.stringify(subscription), true);
        s.setAttribute('style', 'height: 100%; word-wrap: break-word;');
        s.children[0].setAttribute(
          'style',
          'word-wrap: break-word; width: 100%; height: 100%;'
        );
        todos.appendChild(s);
        //-----------------------
      });
  }

  function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.value) {
      return;
    }
    const newTodo = composeNewTodo(input.value);
    todos.appendChild(newTodo);
    setTimeout(function() {
      newTodo.className += ' show';
    }, 10);

    // scroll to bottom animation after adding new item
    setTimeout(() => {
      const interval = setInterval(() => {
        todos.scrollTop = todos.scrollTop + 1;
        if (
          Math.abs(
            todos.scrollTop - (todos.scrollHeight - todos.clientHeight)
          ) <= 5
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

      const index = storedItems.indexOf(
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
    const newTodo = document.createElement('div');
    if (show) {
      newTodo.className = 'todo show';
    } else {
      newTodo.className = 'todo';
    }
    const paragraphElement = document.createElement('p');
    paragraphElement.innerText = string;
    const imgElement = document.createElement('img');
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
        const a = document.querySelectorAll('.todo');
        for (let i = 0; i < a.length; i++) {
          a[i].className += ' show';
        }
      }, 50);
    } else {
      storedItems = [];
    }
  }
})();
