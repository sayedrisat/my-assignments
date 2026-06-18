"use strict";

var STORAGE_KEY = "dom-explorer-task-manager";

var categories = [
  { value: "general", label: "General" },
  { value: "study", label: "Study" },
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
  { value: "javascript", label: "JavaScript" }
];

var tasks = [];
var nextTaskId = 1;
var els = {};

document.addEventListener("DOMContentLoaded", function () {
  makePage();
  loadSavedTasks();
  drawTaskBoard();
  updateNumbers();
});

function makePage() {
  var app = document.getElementById("app");
  var shell = document.createElement("div");
  shell.className = "dashboard-shell";

  shell.appendChild(makeSidebar());
  shell.appendChild(makeMainContent());
  app.appendChild(shell);
}

function makeSidebar() {
  var sidebar = document.createElement("aside");
  sidebar.className = "sidebar";

  var topPart = document.createElement("div");

  var brand = document.createElement("div");
  brand.className = "brand";

  var mark = textEl("div", "D", "brand-mark");
  var brandWords = document.createElement("div");
  brandWords.appendChild(textEl("p", "DOM Tasks", "brand-name"));
  brandWords.appendChild(textEl("p", "vanilla-js@app.com", "brand-email"));

  brand.appendChild(mark);
  brand.appendChild(brandWords);

  var searchBox = document.createElement("input");
  searchBox.className = "sidebar-search";
  searchBox.id = "taskSearchInput";
  searchBox.type = "search";
  searchBox.placeholder = "Search";

  var navTitle = textEl("p", "Dashboard", "nav-label");

  var nav = document.createElement("div");
  nav.className = "nav-list";
  nav.appendChild(sidebarButton("Overview", true));
  nav.appendChild(sidebarButton("Tasks", false));
  nav.appendChild(sidebarButton("Calendar", false));
  nav.appendChild(sidebarButton("Reports", false));

  topPart.appendChild(brand);
  topPart.appendChild(searchBox);
  topPart.appendChild(navTitle);
  topPart.appendChild(nav);

  var bottomPart = document.createElement("div");
  bottomPart.className = "sidebar-bottom";
  bottomPart.appendChild(sidebarButton("Help Center", false));
  bottomPart.appendChild(sidebarButton("Settings", false));

  var profile = document.createElement("div");
  profile.className = "profile-card";

  var profilePic = textEl("div", "JS", "profile-avatar");
  var profileInfo = document.createElement("div");
  profileInfo.appendChild(textEl("p", "Student User", "profile-name"));
  profileInfo.appendChild(textEl("p", "Learning DOM", "profile-role"));

  profile.appendChild(profilePic);
  profile.appendChild(profileInfo);
  bottomPart.appendChild(profile);

  sidebar.appendChild(topPart);
  sidebar.appendChild(bottomPart);

  els.searchInput = searchBox;
  searchBox.addEventListener("input", drawTaskBoard);

  return sidebar;
}

function sidebarButton(label, active) {
  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "nav-item";

  if (active) {
    btn.classList.add("active");
  }

  btn.appendChild(document.createTextNode(label));
  return btn;
}

function makeMainContent() {
  var main = document.createElement("section");
  main.className = "main-panel";

  main.appendChild(makeTopbar());
  main.appendChild(makeWelcomeCard());
  main.appendChild(makeStats());
  main.appendChild(makeTaskForm());
  main.appendChild(makeBoardTools());
  main.appendChild(makeBoard());

  return main;
}

function makeTopbar() {
  var bar = document.createElement("header");
  bar.className = "topbar";

  var breadcrumb = textEl("p", "Dashboard / Overview", "breadcrumb");
  var rightSide = document.createElement("div");
  rightSide.className = "topbar-actions";

  var people = document.createElement("div");
  people.className = "avatar-group";
  people.appendChild(textEl("span", "A", "mini-avatar first"));
  people.appendChild(textEl("span", "B", "mini-avatar second"));
  people.appendChild(textEl("span", "C", "mini-avatar third"));

  var themeBtn = textEl("button", "Dark", "button small-button");
  themeBtn.type = "button";
  themeBtn.id = "themeToggleButton";

  themeBtn.dataset.theme = "light";
  themeBtn.setAttribute("data-theme", "light");

  var createBtn = textEl("button", "+ Create Task", "button black-button");
  createBtn.type = "button";

  rightSide.appendChild(people);
  rightSide.appendChild(themeBtn);
  rightSide.appendChild(createBtn);

  bar.appendChild(breadcrumb);
  bar.appendChild(rightSide);

  els.themeButton = themeBtn;

  themeBtn.addEventListener("click", changeTheme);
  createBtn.addEventListener("click", function () {
    els.taskTitleInput.focus();
  });

  return bar;
}

function makeWelcomeCard() {
  var card = document.createElement("section");
  card.className = "welcome-panel";

  var wrapper = document.createElement("div");
  wrapper.appendChild(textEl("h1", "Welcome Back..!", "welcome-title"));
  wrapper.appendChild(textEl(
    "p",
    "Stay on top of your tasks, monitor progress, and track status.",
    "welcome-text"
  ));

  var notice = document.createElement("div");
  notice.className = "notice-strip";
  notice.appendChild(textEl("span", "Today focus: finish important tasks first.", "notice-text"));

  wrapper.appendChild(notice);
  card.appendChild(wrapper);

  return card;
}

function makeStats() {
  var row = document.createElement("section");
  row.className = "stats-grid";

  var total = statBox("Total Tasks", "0");
  var active = statBox("Active Tasks", "0");
  var done = statBox("Completed", "0");
  var progress = statBox("Progress", "0%");

  row.appendChild(total.box);
  row.appendChild(active.box);
  row.appendChild(done.box);
  row.appendChild(progress.box);

  els.totalCounter = total.number;
  els.activeCounter = active.number;
  els.completedCounter = done.number;
  els.progressCounter = progress.number;

  return row;
}

function statBox(label, startingValue) {
  var box = document.createElement("article");
  box.className = "stat-box";

  var top = document.createElement("div");
  top.className = "stat-topline";

  var dot = document.createElement("span");
  dot.className = "stat-dot";

  top.appendChild(dot);
  top.appendChild(textEl("span", label, "stat-label"));

  var number = textEl("strong", startingValue, "stat-number");

  box.appendChild(top);
  box.appendChild(number);

  return {
    box: box,
    number: number
  };
}

function makeTaskForm() {
  var panel = document.createElement("section");
  panel.className = "task-form-card";

  var heading = document.createElement("div");
  heading.className = "form-heading";
  heading.appendChild(textEl("h2", "Create Task", "section-title"));
  heading.appendChild(textEl("p", "Add a task title and choose a category.", "section-subtitle"));

  var form = document.createElement("form");
  form.id = "taskForm";
  form.className = "task-form";

  var titleWrap = document.createElement("div");
  titleWrap.className = "field-group";

  var titleLabel = textEl("label", "Task title", "field-label");
  titleLabel.setAttribute("for", "taskTitleInput");

  var titleInput = document.createElement("input");
  titleInput.className = "text-input";
  titleInput.id = "taskTitleInput";
  titleInput.type = "text";
  titleInput.placeholder = "Example: Finish DOM assignment";
  titleInput.autocomplete = "off";

  // value property changes when user types; value attribute stays as the starting value.
  titleInput.setAttribute("value", "");

  titleWrap.appendChild(titleLabel);
  titleWrap.appendChild(titleInput);

  var catWrap = document.createElement("div");
  catWrap.className = "field-group";

  var catLabel = textEl("label", "Category", "field-label");
  catLabel.setAttribute("for", "taskCategorySelect");

  var catSelect = document.createElement("select");
  catSelect.className = "select-input";
  catSelect.id = "taskCategorySelect";
  putCategoryOptions(catSelect, categories, false);

  catWrap.appendChild(catLabel);
  catWrap.appendChild(catSelect);

  var addBtn = textEl("button", "+ Add Task", "button black-button add-button");
  addBtn.type = "submit";
  addBtn.dataset.phaseDemo = "add-task";

  var msg = textEl("p", "", "form-message");

  form.appendChild(titleWrap);
  form.appendChild(catWrap);
  form.appendChild(addBtn);

  panel.appendChild(heading);
  panel.appendChild(form);
  panel.appendChild(msg);

  els.taskForm = form;
  els.taskTitleInput = titleInput;
  els.taskCategorySelect = catSelect;
  els.formMessage = msg;

  form.addEventListener("submit", addTaskFromForm);

  // Small event phase demo for console only.
  panel.addEventListener("click", function (event) {
    if (event.target.dataset.phaseDemo === "add-task") {
      console.log("Capturing: parent panel saw the Add Task click first.");
    }
  }, true);

  form.addEventListener("click", function (event) {
    if (event.target.dataset.phaseDemo === "add-task") {
      console.log("Bubbling: form saw the Add Task click after the button.");
    }
  });

  return panel;
}

function makeBoardTools() {
  var tools = document.createElement("section");
  tools.className = "board-header";

  var tabs = document.createElement("div");
  tabs.className = "board-tabs";
  tabs.appendChild(textEl("button", "Kanban", "tab-button active"));
  tabs.appendChild(textEl("button", "Timeline", "tab-button"));
  tabs.appendChild(textEl("button", "Calendar", "tab-button"));

  var filterArea = document.createElement("div");
  filterArea.className = "board-filters";

  var filter = document.createElement("select");
  filter.className = "select-input compact-input";
  filter.id = "categoryFilterSelect";
  putCategoryOptions(filter, categories, true);

  var clearBtn = textEl("button", "Clear All", "button danger-button");
  clearBtn.type = "button";
  clearBtn.id = "clearAllTasksButton";

  filterArea.appendChild(filter);
  filterArea.appendChild(clearBtn);

  tools.appendChild(tabs);
  tools.appendChild(filterArea);

  els.filterSelect = filter;
  els.clearAllTasksButton = clearBtn;

  filter.addEventListener("change", drawTaskBoard);
  clearBtn.addEventListener("click", clearEverything);

  return tools;
}

function makeBoard() {
  var board = document.createElement("section");
  board.className = "task-board";
  board.id = "taskBoard";

  var active = makeColumn("Active", "0");
  var completed = makeColumn("Completed", "0");

  board.appendChild(active.column);
  board.appendChild(completed.column);

  els.taskBoard = board;
  els.activeColumnList = active.list;
  els.completedColumnList = completed.list;
  els.activeColumnCount = active.count;
  els.completedColumnCount = completed.count;

  // One board listener handles buttons from all task cards.
  board.addEventListener("click", boardClickHandler);

  return board;
}

function makeColumn(title, countText) {
  var column = document.createElement("article");
  column.className = "board-column";

  var head = document.createElement("div");
  head.className = "column-header";
  head.appendChild(textEl("h3", title, "column-title"));

  var count = textEl("span", countText, "column-count");
  head.appendChild(count);

  var list = document.createElement("div");
  list.className = "column-task-list";

  column.appendChild(head);
  column.appendChild(list);

  return {
    column: column,
    list: list,
    count: count
  };
}

function addTaskFromForm(event) {
  event.preventDefault();

  var input = els.taskTitleInput;
  var select = els.taskCategorySelect;

  console.log("input.value property:", input.value);
  console.log("input.getAttribute('value') attribute:", input.getAttribute("value"));

  var taskTitle = input.value.trim();

  if (taskTitle === "") {
    setText(els.formMessage, "Please type a task title first.");
    input.focus();
    return;
  }

  var task = {
    id: String(nextTaskId),
    title: taskTitle,
    category: select.value,
    status: "active"
  };

  nextTaskId = nextTaskId + 1;
  tasks.push(task);
  saveTasks();

  input.value = "";
  select.value = "general";
  els.searchInput.value = "";
  els.filterSelect.value = "all";
  setText(els.formMessage, "Task added.");

  drawTaskBoard();
  updateNumbers();

  var newCard = els.taskBoard.querySelector('[data-id="' + task.id + '"]');
  if (newCard) {
    showQuickNote(newCard, "New task added.");
  }
}

function boardClickHandler(event) {
  var btn = event.target;
  if (btn.tagName !== "BUTTON") {
    return;
  }

  var action = btn.dataset.action;
  if (action === undefined) {
    return;
  }

  var card = btn.closest(".task-card");
  if (card === null) {
    return;
  }

  if (action === "edit") {
    startEdit(card);
  } else if (action === "complete") {
    switchTaskStatus(card);
  } else if (action === "delete") {
    removeTask(card);
  } else if (action === "save-edit") {
    saveEditedTask(card);
  } else if (action === "cancel-edit") {
    drawTaskBoard();
  }
}

function makeTaskCard(task) {
  var card = document.createElement("article");
  card.className = "task-card";

  card.setAttribute("data-id", task.id);
  card.setAttribute("data-status", task.status);
  card.setAttribute("data-category", task.category);

  var top = document.createElement("div");
  top.className = "task-topline";

  top.appendChild(textEl("span", "WEB - " + task.id, "task-code"));
  top.appendChild(textEl("span", priorityFor(task.category), "priority-pill"));

  var title = textEl("h4", task.title, "task-title");

  var meta = document.createElement("div");
  meta.className = "task-meta";

  var categoryName = labelForCategory(card.dataset.category);
  meta.appendChild(textEl("span", categoryName, "pill"));
  meta.appendChild(textEl("span", task.status, "pill status-pill"));

  var actions = document.createElement("div");
  actions.className = "task-actions";

  var editBtn = actionButton("Edit", "edit", "button ghost-button");
  var completeBtn = actionButton(completeButtonText(task.status), "complete", "button ghost-button");
  var deleteBtn = actionButton("Delete", "delete", "button danger-button");

  actions.append(editBtn, completeBtn, deleteBtn);

  card.appendChild(top);
  card.appendChild(title);
  card.appendChild(meta);
  card.appendChild(actions);

  return card;
}

function startEdit(card) {
  var task = getTaskById(card.dataset.id);

  if (task === null) {
    return;
  }

  var oldTitle = card.querySelector(".task-title");
  if (oldTitle === null) return;

  var box = document.createElement("div");
  box.className = "edit-box";

  var input = document.createElement("input");
  input.className = "text-input edit-input";
  input.type = "text";
  input.value = task.title;
  input.setAttribute("value", task.title);

  var saveBtn = actionButton("Save", "save-edit", "button black-button");
  var cancelBtn = actionButton("Cancel", "cancel-edit", "button ghost-button");

  box.appendChild(input);
  input.after(saveBtn);
  saveBtn.after(cancelBtn);

  oldTitle.replaceWith(box);
  input.focus();
}

function saveEditedTask(card) {
  var task = getTaskById(card.dataset.id);
  var input = card.querySelector(".edit-input");

  if (task === null || input === null) {
    return;
  }

  var newTitle = input.value.trim();
  if (newTitle === "") {
    input.focus();
    return;
  }

  task.title = newTitle;
  saveTasks();
  drawTaskBoard();
}

function switchTaskStatus(card) {
  var task = getTaskById(card.dataset.id);

  if (task === null) {
    return;
  }

  if (card.hasAttribute("data-status")) {
    var oldStatus = card.getAttribute("data-status");
    var newStatus = "completed";

    if (oldStatus === "completed") {
      newStatus = "active";
    }

    card.setAttribute("data-status", newStatus);
    task.status = newStatus;
  }

  saveTasks();
  drawTaskBoard();
  updateNumbers();
}

function removeTask(card) {
  var id = card.dataset.id;
  var index = getTaskIndex(id);

  if (index === -1) {
    return;
  }

  tasks.splice(index, 1);
  saveTasks();

  card.remove();
  drawTaskBoard();
  updateNumbers();
}

function drawTaskBoard() {
  emptyNode(els.activeColumnList);
  emptyNode(els.completedColumnList);

  var visible = filteredTasks();
  var activeTasks = [];
  var completedTasks = [];

  visible.forEach(function (task) {
    if (task.status === "completed") {
      completedTasks.push(task);
    } else {
      activeTasks.push(task);
    }
  });

  fillColumn(els.activeColumnList, activeTasks, "No active tasks.");
  fillColumn(els.completedColumnList, completedTasks, "No completed tasks.");

  setText(els.activeColumnCount, String(activeTasks.length));
  setText(els.completedColumnCount, String(completedTasks.length));
}

function fillColumn(container, list, emptyText) {
  if (list.length === 0) {
    container.appendChild(textEl("p", emptyText, "empty-state"));
    return;
  }

  list.forEach(function (task) {
    container.appendChild(makeTaskCard(task));
  });
}

function filteredTasks() {
  var word = els.searchInput.value.trim().toLowerCase();
  var chosenCategory = els.filterSelect.value;
  var result = [];

  tasks.forEach(function (task) {
    var titleOk = task.title.toLowerCase().indexOf(word) !== -1;
    var categoryOk = chosenCategory === "all" || task.category === chosenCategory;

    if (titleOk && categoryOk) {
      result.push(task);
    }
  });

  return result;
}

function updateNumbers() {
  var active = 0;
  var done = 0;

  tasks.forEach(function (task) {
    if (task.status === "completed") {
      done = done + 1;
    } else {
      active = active + 1;
    }
  });

  var percent = 0;
  if (tasks.length > 0) {
    percent = Math.round((done / tasks.length) * 100);
  }

  setText(els.totalCounter, String(tasks.length));
  setText(els.activeCounter, String(active));
  setText(els.completedCounter, String(done));
  setText(els.progressCounter, percent + "%");
}

function showQuickNote(card, message) {
  var note = textEl("p", message, "temporary-notice");

  card.before(note);

  window.setTimeout(function () {
    note.remove();
  }, 1500);
}

function changeTheme() {
  var currentTheme = document.body.dataset.theme;
  var nextTheme = "dark";

  if (currentTheme === "dark") {
    nextTheme = "light";
  }

  applyTheme(nextTheme);
}

function applyTheme(theme) {
  document.body.classList.toggle("dark-theme", theme === "dark");

  document.body.setAttribute("data-theme", theme);
  els.themeButton.dataset.theme = theme;
  els.themeButton.setAttribute("data-theme", theme);

  if (theme === "dark") {
    setText(els.themeButton, "Light");
  } else {
    setText(els.themeButton, "Dark");
  }
}

function clearEverything() {
  tasks = [];
  nextTaskId = 1;

  saveTasks();
  drawTaskBoard();
  updateNumbers();
  setText(els.formMessage, "All tasks cleared.");
}

function saveTasks() {
  var data = {
    nextTaskId: nextTaskId,
    tasks: tasks
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadSavedTasks() {
  var saved = localStorage.getItem(STORAGE_KEY);

  if (saved === null) {
    tasks = starterTasks();
    nextTaskId = 4;
    return;
  }

  try {
    var parsed = JSON.parse(saved);

    if (Array.isArray(parsed.tasks)) {
      tasks = parsed.tasks;
    }

    if (typeof parsed.nextTaskId === "number") {
      nextTaskId = parsed.nextTaskId;
    }
  } catch (error) {
    console.log("Saved task data could not be loaded:", error);
    tasks = [];
    nextTaskId = 1;
  }
}

function starterTasks() {
  return [
    {
      id: "1",
      title: "Build task manager UI",
      category: "work",
      status: "active"
    },
    {
      id: "2",
      title: "Practice event delegation",
      category: "javascript",
      status: "active"
    },
    {
      id: "3",
      title: "Write simple DOM comments",
      category: "study",
      status: "completed"
    }
  ];
}

function putCategoryOptions(select, list, includeAll) {
  if (includeAll === true) {
    var all = document.createElement("option");
    all.setAttribute("value", "all");
    all.appendChild(document.createTextNode("All categories"));
    select.appendChild(all);
  }

  list.forEach(function (item) {
    var option = document.createElement("option");
    option.setAttribute("value", item.value);
    option.appendChild(document.createTextNode(item.label));
    select.appendChild(option);
  });
}

function actionButton(text, action, className) {
  var btn = textEl("button", text, className);
  btn.type = "button";
  btn.dataset.action = action;
  return btn;
}

function textEl(tagName, text, className) {
  var el = document.createElement(tagName);

  if (className !== undefined && className !== "") {
    el.className = className;
  }

  el.appendChild(document.createTextNode(text));
  return el;
}

function setText(node, text) {
  emptyNode(node);
  node.appendChild(document.createTextNode(text));
}

function emptyNode(node) {
  while (node.firstChild !== null) {
    node.removeChild(node.firstChild);
  }
}

function getTaskById(id) {
  var match = null;

  tasks.forEach(function (task) {
    if (task.id === id) {
      match = task;
    }
  });

  return match;
}

function getTaskIndex(id) {
  var foundIndex = -1;

  tasks.forEach(function (task, index) {
    if (task.id === id) {
      foundIndex = index;
    }
  });

  return foundIndex;
}

function labelForCategory(value) {
  var label = "General";

  categories.forEach(function (item) {
    if (item.value === value) {
      label = item.label;
    }
  });

  return label;
}

function completeButtonText(status) {
  if (status === "completed") {
    return "Mark Active";
  }

  return "Complete";
}

function priorityFor(category) {
  if (category === "javascript") {
    return "High";
  }

  if (category === "work") {
    return "Medium";
  }

  return "Normal";
}
