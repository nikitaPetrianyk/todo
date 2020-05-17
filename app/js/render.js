class RenderTodos {

  constructor() { }

  printInfoAboutEmpty(printArea) {
    printArea.innerHTML = `<p class = "tasks-list__empty">Todos list is empty.</p>`
  }

  getTemplateTodo(status, title, description) {
    return `  <div class="tasks-list__item js-tasksListItem">
                  <span class="tasks-list__item-status js-toDoStatus">${status}</span>
                  <div class = "tasks-list__edit-wrap js-editWrap">
                      <input type="text" class = "tasks-list__edit-title js-editTitle inp" value = "${title}">
                      <input type="text" class = "tasks-list__edit-description js-editDescription inp" value = "${description}">
                      <button class="tasks-list__edit-btn btn js-btnSave">Save</button>
                      <button class="tasks-list__edit-btn btn js-btnCancel">Cancel</button>
                  </div>
                  <div class ="tasks-list__item-wrap js-itemWrap">
                      <h3 class="tasks-list__item-title">${title}</h3>
                      <p class="tasks-list__item-description">${description}</p>
                      <div class="tasks-list__btns-wrap">
                          <button class="tasks-list__item-btn btn js-taskBtnEdit">
                            Edit
                          </button>
                          <button class="tasks-list__item-btn btn js-taskBtnDelete">
                            Delete
                          </button>
                          <button class="tasks-list__item-btn btn js-taskBtnHold">
                            Hold
                          </button>
                          <button class="tasks-list__item-btn btn js-taskBtnDone">
                            Done
                          </button>
                        </div>
                    </div>
                </div>`
  }

  printTodos(todos, printArea) {
    for (let i = 0; i < todos.length; i++) {
      printArea.innerHTML += this.getTemplateTodo(todos[i].status, todos[i].title, todos[i].description);
      this.changeBtnStatus(todos[i], i);
      this.freezeActions(i, todos[i].status);
    }
  }

  render(todos, printArea) {
    printArea.innerHTML = null;
    todos.length == 0 ? this.printInfoAboutEmpty(printArea) : this.printTodos(todos, printArea);
  }

  init(todos, printArea) {
    this.render(todos, printArea)
    this.subscribeListeners(todos, printArea);
  }

  changeToDoStatus(todos, index) {
    let todosStatuses = document.querySelectorAll('.js-toDoStatus');
    todosStatuses[index].innerHTML = todos[index].status;
  }

  changeBtnStatus(todo, index) {
    let btnsDone = document.querySelectorAll('.js-taskBtnDone');
    let btnsHold = document.querySelectorAll('.js-taskBtnHold');
    todo.status === "Done" ? btnsDone[index].innerHTML = "Undo" : btnsDone[index].innerHTML = "Done";
    todo.status === "Hold" ? btnsHold[index].innerHTML = "Unhold" : btnsHold[index].innerHTML = "Hold";
  }

  removeAttributeOnItems(items, attribute) {
    items.forEach((item) => {
      let hasAttribute = item.getAttribute(attribute);
      if (hasAttribute) item.removeAttribute(attribute)
    });
  }

  replaceAttributeOnItems(items, attribute, attributeValue) {
    items.forEach((item) => {
      let attrValue = item.getAttribute(attribute);
      attrValue === attributeValue ? item.removeAttribute(attribute) : item.setAttribute(attribute, attributeValue)
    });
  }

  getItemsActionBtns() {
    let btnsEdit = document.querySelectorAll('.js-taskBtnEdit');
    let btnsDelete = document.querySelectorAll('.js-taskBtnDelete');
    let btnsHold = document.querySelectorAll('.js-taskBtnHold');
    let btnsDone = document.querySelectorAll('.js-taskBtnDone');
    return [btnsEdit, btnsDelete, btnsHold, btnsDone]
  }

  makeArrayOfButtonsForFreezing(index, status, btnsEdit, btnsDelete, btnsHold, btnsDone) {
    let frozenBtns;
    (status === "Hold") ? frozenBtns = [btnsEdit[index], btnsDelete[index], btnsDone[index]] :
      (status === "Done") ? frozenBtns = [btnsEdit[index], btnsHold[index]] :
        frozenBtns = [btnsEdit[index], btnsDelete[index], btnsHold[index], btnsDone[index]]
    return frozenBtns;
  }

  removeOrReplaceAttributesOnItems(items, status, attribute, attributeValue) {
    (status === "Pending") ? this.removeAttributeOnItems(items, attribute)
      : this.replaceAttributeOnItems(items, attribute, attributeValue);
  }

  freezeActions(index, status) {
    let [btnsEdit, btnsDelete, btnsHold, btnsDone] = this.getItemsActionBtns(index);
    let frozenBtns = this.makeArrayOfButtonsForFreezing(index, status, btnsEdit, btnsDelete, btnsHold, btnsDone);
    this.removeOrReplaceAttributesOnItems(frozenBtns, status, 'disabled', 'disable');
  }

  addTimeout(cb, ...paramsOfCb) {
    setTimeout(() => cb(...paramsOfCb), 1000);
  }

  setListener(type, item, cb, ...paramsOfCb) {
    item.addEventListener(type, () => {
      cb(...paramsOfCb);
    })
  }

  openEditingMenu(editWrap, itemWrap, index) {
    editWrap[index].classList.add('active');
    itemWrap[index].classList.add('hide');
  }

  closeEditingMenu(editWrap, itemWrap, index) {
    editWrap[index].classList.remove('active');
    itemWrap[index].classList.remove('hide');
  }

  enablePreloader() {
    let preloaderWrapper = document.querySelector('.js-preloaderWrapper');
    let preloader = new Preloader();
    preloader.setPreloader(preloaderWrapper);
    this.addTimeout(preloader.removePreloader, preloaderWrapper);
  }

  editTodo(changingTitleFields, changingDescriptionFields, todos, index) {
    let changedTaskTitle = changingTitleFields[index].value;
    let changedTaskDescription = changingDescriptionFields[index].value;
    let changedToDo = storage.saveChanges(todos[index], changedTaskTitle, changedTaskDescription);
    return changedToDo;
  }

  printTodosWithChangedToDo(todos, index, changedToDo, printArea) {
    todos.splice(index, changedToDo);
    this.init(todos, printArea);
  }

  handleSaveBtnClick(editTitleFields, editDescriptionFields, todos, index, printArea) {
    this.enablePreloader();
    let changedToDo = this.editTodo(editTitleFields, editDescriptionFields, todos, index);
    this.addTimeout(() => { this.printTodosWithChangedToDo(todos, index, changedToDo, printArea); });
  }

  enableEditingmode(todos, index, printArea) {
    let editWrap = document.querySelectorAll('.js-editWrap');
    let editTitleFields = document.querySelectorAll('.js-editTitle');
    let editDescriptionFields = document.querySelectorAll('.js-editDescription');
    let btnsSave = document.querySelectorAll('.js-btnSave');
    let btnsCancel = document.querySelectorAll('.js-btnCancel');
    let itemWrap = document.querySelectorAll('.js-itemWrap');
    this.openEditingMenu(editWrap, itemWrap, index);
    this.setListener('click', btnsSave[index], () => this.handleSaveBtnClick(editTitleFields, editDescriptionFields, todos, index, printArea))
    this.setListener('click', btnsCancel[index], this.closeEditingMenu, editWrap, itemWrap, index);
  }

  subscribeListeners(todos, printArea) {
    let tasksListItem = document.querySelectorAll('.js-tasksListItem');
    for (let i = 0; i < tasksListItem.length; i++) {
      tasksListItem[i].addEventListener('click', (event) => {
        if (event.target.classList.contains('js-taskBtnEdit')) {
          this.enableEditingmode(todos, i, printArea);
        } else if (event.target.classList.contains('js-taskBtnDelete')) {
          let preloaderWrapper = document.querySelector('.js-preloaderWrapper');
          let preloader = new Preloader();
          preloader.setPreloader(preloaderWrapper);
          setTimeout(() => {
            preloader.removePreloader(preloaderWrapper);
            storage.removeToDo(todos[i], i);
            todos = storage.getTodos();
            this.init(todos, printArea);
          }, 1000);
        } else if (event.target.classList.contains('js-taskBtnHold')) {
          let changedToDo = storage.setStatus(todos[i], "Hold", "Pending");
          todos.splice(i, changedToDo)
          this.changeToDoStatus(todos, i);
          this.changeBtnStatus(todos[i], i);
          this.freezeActions(i, todos[i].status);
        } else if (event.target.classList.contains('js-taskBtnDone')) {
          let changedToDo = storage.setStatus(todos[i], "Done", "Pending");
          todos.splice(i, changedToDo)
          this.changeToDoStatus(todos, i);
          this.changeBtnStatus(todos[i], i);
          this.freezeActions(i, todos[i].status);
        }
      })
    }
  }
}
