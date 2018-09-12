(function() {
  let todos = document.getElementById("todos");
  let form = document.getElementById("form");
  let submitButton = document.getElementById("submit-button");
  let input = document.getElementById("input");

  form.addEventListener("submit", handleSubmit);
  submitButton.addEventListener("click", handleSubmit);
  todos.addEventListener("click", handleRemove);

  function handleSubmit(e) {
    e.preventDefault();
    let newTodo = document.createElement("div");
    newTodo.className = "todo";
    newTodo.innerHTML = `
      <p>${input.value}</p>
      <img class="close" src="close.svg">
    `;
    todos.appendChild(newTodo);
    setTimeout(function() {
      newTodo.className = newTodo.className + " show";
    }, 10);
    input.value = "";
    input.focus();
  }

  function handleRemove(e) {
    if (e.target && e.target.classList.value === "close") {
      e.preventDefault();
      e.target.parentElement.className = "todo";
      setTimeout(() => {
        todos.removeChild(e.target.parentElement);
      }, 400);
    }
  }
})();
