#import('dart:html');

// TODO XSS check

List<TodoElement> todoElements = new List();
Element todoListElement = query("#todo-list");
Element checkAllCheckboxElement = query("#main");
Element footerElement = query("#footer");
Element countElement = query("#todo-count");
Element clearCompletedElement = query("#clear-completed");

void main() {
  InputElement newTodoElement = query("#new-todo");

  newTodoElement.on.keyPress.add((KeyboardEvent e) {
    if(e.keyIdentifier == KeyName.ENTER) {
      String content = newTodoElement.value.trim();
      if(content != "") {
        addTodo(content);
        newTodoElement.value = "";
        updateFooterDisplay();
      }
    }
  });

  clearCompletedElement.on.click.add((MouseEvent e) {
    todoElements.forEach((TodoElement todoElement) {
      if(todoElement.todo.complete) {
        todoElement.element.remove();
        todoElements.removeAt(todoElements.indexOf(todoElement));
      }
    });
    updateFooterDisplay();
  });

  addTodo("truc", true);
  addTodo("machin", false);

  updateFooterDisplay();
}

void addTodo(String content, [bool complete = false]) {
  Todo todo = new Todo();
  todo.complete = complete;
  todo.content = content;

  TodoElement todoElement = new TodoElement(todo);
  todoElements.add(todoElement);
  todoListElement.nodes.add(todoElement.createElement());
}

void updateFooterDisplay() {
  if(todoElements.length == 0) {
    checkAllCheckboxElement.style.display = "none";
    footerElement.style.display = "none";
  } else {
    checkAllCheckboxElement.style.display = "block";
    footerElement.style.display = "block";
  }
  updateCounts();
}

void updateCounts() {
  int complete = 0;
  todoElements.forEach((TodoElement todoElement) {
    if(todoElement.todo.complete) {
      complete++;
    }
  });
  if(complete == 1) {
    countElement.innerHTML = "1 item left";
  } else {
    countElement.innerHTML = "${todoElements.length - complete} items left";
  }
  if(complete == 0) {
    clearCompletedElement.style.display = "none";
  } else {
    clearCompletedElement.style.display = "block";
    clearCompletedElement.innerHTML = "Clear completed (${complete})";
  }
}

class TodoElement {
  Todo todo;
  Element element;

  TodoElement(this.todo) {
  }

  Element createElement() {
    element = new Element.html('''
        <li ${todo.complete ? 'class="completed"' : ''}>
        <div class="view">
        <input class="toggle" type="checkbox" ${todo.complete ? 'checked' : ''}>
        <label class="todo-content">${todo.content}</label>
        <button class="destroy"></button>
        </div>
        <input class="edit" value="${todo.content}">
        </li>
    ''');
    Element contentElement = element.query(".todo-content");
    InputElement editElement = element.query(".edit");

    element.query(".toggle").on.click.add((MouseEvent e) {
      todo.toggle();
      if(todo.complete) {
        element.classes.add("completed");
      } else {
        element.classes.remove("completed");
      }
      updateCounts();
    });
    contentElement.on.doubleClick.add((MouseEvent e) {
      element.classes.add("editing");
      editElement.focus();
    });
    element.query(".destroy").on.click.add((MouseEvent e) {
      element.remove();
      todoElements.removeAt(todoElements.indexOf(this));
      updateFooterDisplay();
    });
    editElement.on.keyPress.add((KeyboardEvent e) {
      if(e.keyIdentifier == KeyName.ENTER) {
        todo.content = editElement.value.trim();
        element.classes.remove("editing");
        contentElement.innerHTML = todo.content;
      }
    });
    return element;
  }
}

class Todo {
  String content;
  bool complete;

  void toggle() {
    complete = !complete;
  }
}