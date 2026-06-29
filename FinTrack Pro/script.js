// Simple global variables for the app
var transactions = [];
var currentFilter = "all";
var chartCanvas;

window.addEventListener("load", startApp);
window.addEventListener("resize", drawChart);

function startApp() {
  chartCanvas = document.getElementById("cash-flow-chart");

  document.getElementById("show-register-button").addEventListener("click", showRegisterPage);
  document.getElementById("show-login-button").addEventListener("click", showLoginPage);
  document.getElementById("register-form").addEventListener("submit", registerUser);
  document.getElementById("login-form").addEventListener("submit", loginUser);
  document.getElementById("logout-button").addEventListener("click", logoutUser);

  document.getElementById("dashboard-button").addEventListener("click", showDashboard);
  document.getElementById("settings-button").addEventListener("click", showSettings);

  document.getElementById("add-transaction-button").addEventListener("click", openTransactionModal);
  document.getElementById("close-modal-button").addEventListener("click", closeTransactionModal);
  document.getElementById("cancel-modal-button").addEventListener("click", closeTransactionModal);
  document.getElementById("transaction-form").addEventListener("submit", addTransaction);

  document.getElementById("transaction-search").addEventListener("input", showTransactions);
  document.getElementById("transaction-filter").addEventListener("change", changeTransactionFilter);

  document.getElementById("profile-form").addEventListener("submit", saveProfile);
  document.getElementById("currency-select").addEventListener("change", changeCurrency);
  document.getElementById("dark-mode-toggle").addEventListener("change", changeTheme);
  document.getElementById("reset-button").addEventListener("click", resetData);

  document.getElementById("transaction-modal").addEventListener("click", function (event) {
    if (event.target.id === "transaction-modal") {
      closeTransactionModal();
    }
  });

  checkLogin();
}

function showLoginPage() {
  document.getElementById("login-card").hidden = false;
  document.getElementById("register-card").hidden = true;
  document.getElementById("login-message").textContent = "";
  document.getElementById("register-message").textContent = "";
}

function showRegisterPage() {
  document.getElementById("login-card").hidden = true;
  document.getElementById("register-card").hidden = false;
  document.getElementById("login-message").textContent = "";
  document.getElementById("register-message").textContent = "";
}

function registerUser(event) {
  event.preventDefault();

  var username = document.getElementById("register-username").value.trim();
  var password = document.getElementById("register-password").value;
  var message = document.getElementById("register-message");

  if (username === "" || password === "") {
    message.textContent = "Username and password are required.";
    return;
  }

  var users = getUsers();

  for (var i = 0; i < users.length; i++) {
    if (users[i].username.toLowerCase() === username.toLowerCase()) {
      message.textContent = "This username already exists.";
      return;
    }
  }

  var newUser = {
    username: username,
    password: password,
    displayName: username,
    currency: "USD"
  };

  users.push(newUser);
  saveUsers(users);
  localStorage.setItem("transactions_" + username, JSON.stringify([]));

  document.getElementById("register-form").reset();
  document.getElementById("login-username").value = username;
  document.getElementById("login-password").value = "";
  showLoginPage();
  document.getElementById("login-message").textContent = "Registration successful. Please login.";
}

function loginUser(event) {
  event.preventDefault();

  var username = document.getElementById("login-username").value.trim();
  var password = document.getElementById("login-password").value;
  var users = getUsers();
  var foundUser = null;

  for (var i = 0; i < users.length; i++) {
    if (users[i].username === username && users[i].password === password) {
      foundUser = users[i];
    }
  }

  if (foundUser === null) {
    document.getElementById("login-message").textContent = "Invalid username or password.";
    return;
  }

  var loggedInUser = {
    username: foundUser.username,
    displayName: foundUser.displayName,
    currency: foundUser.currency
  };

  localStorage.setItem("user", JSON.stringify(loggedInUser));
  document.getElementById("login-form").reset();
  checkLogin();
}

function logoutUser() {
  localStorage.removeItem("user");
  transactions = [];
  document.body.classList.remove("dark");
  document.documentElement.classList.remove("dark");
  checkLogin();
}

function checkLogin() {
  var user = getCurrentUser();

  if (user === null) {
    document.getElementById("auth-section").hidden = false;
    document.getElementById("app-section").hidden = true;
    showLoginPage();
    return;
  }

  document.getElementById("auth-section").hidden = true;
  document.getElementById("app-section").hidden = false;

  loadProfile();
  loadTheme();
  loadTransactions();
  currentFilter = "all";
  document.getElementById("transaction-search").value = "";
  document.getElementById("transaction-filter").value = "all";
  showDashboard();
  updateDashboard();
}

function getUsers() {
  var savedUsers = localStorage.getItem("registeredUsers");

  if (savedUsers === null) {
    return [];
  }

  return JSON.parse(savedUsers);
}

function saveUsers(users) {
  localStorage.setItem("registeredUsers", JSON.stringify(users));
}

function getCurrentUser() {
  var savedUser = localStorage.getItem("user");

  if (savedUser === null) {
    return null;
  }

  return JSON.parse(savedUser);
}

function saveCurrentUser(user) {
  localStorage.setItem("user", JSON.stringify(user));

  var users = getUsers();

  for (var i = 0; i < users.length; i++) {
    if (users[i].username === user.username) {
      users[i].displayName = user.displayName;
      users[i].currency = user.currency;
    }
  }

  saveUsers(users);
}

function getTransactionKey() {
  var user = getCurrentUser();
  return "transactions_" + user.username;
}

function getThemeKey() {
  var user = getCurrentUser();
  return "theme_" + user.username;
}

function loadTransactions() {
  var savedTransactions = localStorage.getItem(getTransactionKey());

  if (savedTransactions === null) {
    transactions = [];
  } else {
    transactions = JSON.parse(savedTransactions);
  }
}

function saveTransactions() {
  localStorage.setItem(getTransactionKey(), JSON.stringify(transactions));
}

function loadProfile() {
  var user = getCurrentUser();

  document.getElementById("display-name").value = user.displayName;
  document.getElementById("currency-select").value = user.currency;
  document.getElementById("active-username").textContent = user.username;
  document.getElementById("welcome-text").textContent = "Welcome, " + user.displayName;
}

function saveProfile(event) {
  event.preventDefault();

  var user = getCurrentUser();
  var newName = document.getElementById("display-name").value.trim();
  var newCurrency = document.getElementById("currency-select").value;

  if (newName === "") {
    newName = user.username;
  }

  user.displayName = newName;
  user.currency = newCurrency;
  saveCurrentUser(user);

  loadProfile();
  updateDashboard();
  showShortMessage("profile-message", "Profile saved.");
}

function changeCurrency() {
  var user = getCurrentUser();
  user.currency = document.getElementById("currency-select").value;
  saveCurrentUser(user);
  updateDashboard();
  showShortMessage("profile-message", "Currency updated.");
}

function loadTheme() {
  var theme = localStorage.getItem(getThemeKey());
  var darkModeInput = document.getElementById("dark-mode-toggle");

  if (theme === "dark") {
    document.body.classList.add("dark");
    document.documentElement.classList.add("dark");
    darkModeInput.checked = true;
  } else {
    document.body.classList.remove("dark");
    document.documentElement.classList.remove("dark");
    darkModeInput.checked = false;
  }
}

function changeTheme() {
  var darkModeInput = document.getElementById("dark-mode-toggle");

  if (darkModeInput.checked) {
    document.body.classList.add("dark");
    document.documentElement.classList.add("dark");
    localStorage.setItem(getThemeKey(), "dark");
  } else {
    document.body.classList.remove("dark");
    document.documentElement.classList.remove("dark");
    localStorage.setItem(getThemeKey(), "light");
  }

  drawChart();
}

function showDashboard() {
  document.getElementById("dashboard-page").hidden = false;
  document.getElementById("settings-page").hidden = true;
  document.getElementById("dashboard-button").classList.add("active");
  document.getElementById("settings-button").classList.remove("active");
}

function showSettings() {
  document.getElementById("dashboard-page").hidden = true;
  document.getElementById("settings-page").hidden = false;
  document.getElementById("dashboard-button").classList.remove("active");
  document.getElementById("settings-button").classList.add("active");
}

function openTransactionModal() {
  document.getElementById("transaction-form").reset();
  document.getElementById("transaction-date").value = getTodayDate();
  document.getElementById("form-message").textContent = "";
  document.getElementById("transaction-modal").hidden = false;
  document.body.classList.add("modal-open");
}

function closeTransactionModal() {
  document.getElementById("transaction-modal").hidden = true;
  document.body.classList.remove("modal-open");
}

function addTransaction(event) {
  event.preventDefault();

  var type = document.getElementById("transaction-type").value;
  var description = document.getElementById("transaction-description").value.trim();
  var amount = Number(document.getElementById("transaction-amount").value);
  var date = document.getElementById("transaction-date").value;
  var category = document.getElementById("transaction-category").value;
  var message = document.getElementById("form-message");

  if (type === "" || description === "" || amount <= 0 || date === "" || category === "") {
    message.textContent = "Please complete every field with a valid amount.";
    return;
  }

  var newTransaction = {
    id: Date.now(),
    type: type,
    description: description,
    amount: amount,
    date: date,
    category: category
  };

  transactions.push(newTransaction);
  saveTransactions();
  closeTransactionModal();
  updateDashboard();
}

function deleteTransaction(id) {
  var newList = [];

  for (var i = 0; i < transactions.length; i++) {
    if (transactions[i].id !== id) {
      newList.push(transactions[i]);
    }
  }

  transactions = newList;
  saveTransactions();
  updateDashboard();
}

function changeTransactionFilter() {
  currentFilter = document.getElementById("transaction-filter").value;
  showTransactions();
}

function updateDashboard() {
  loadTransactions();
  updateCards();
  showTransactions();
  drawChart();
}

function updateCards() {
  var totalIncome = 0;
  var totalExpense = 0;

  for (var i = 0; i < transactions.length; i++) {
    if (transactions[i].type === "income") {
      totalIncome = totalIncome + Number(transactions[i].amount);
    } else {
      totalExpense = totalExpense + Number(transactions[i].amount);
    }
  }

  var balance = totalIncome - totalExpense;

  document.getElementById("balance-amount").textContent = formatMoney(balance);
  document.getElementById("income-amount").textContent = formatMoney(totalIncome);
  document.getElementById("expense-amount").textContent = formatMoney(totalExpense);
  document.getElementById("transaction-count").textContent = transactions.length;
}

function showTransactions() {
  var tableBody = document.getElementById("transaction-table-body");
  var emptyMessage = document.getElementById("empty-message");
  var searchText = document.getElementById("transaction-search").value.toLowerCase();
  var visibleCount = 0;

  tableBody.innerHTML = "";

  for (var i = transactions.length - 1; i >= 0; i--) {
    var item = transactions[i];
    var matchesType = currentFilter === "all" || item.type === currentFilter;
    var searchableText = item.description + " " + item.category + " " + item.type + " " + item.date;
    var matchesSearch = searchableText.toLowerCase().indexOf(searchText) !== -1;

    if (matchesType && matchesSearch) {
      visibleCount++;
      addTransactionRow(tableBody, item);
    }
  }

  if (visibleCount === 0) {
    emptyMessage.hidden = false;
  } else {
    emptyMessage.hidden = true;
  }

  document.getElementById("table-summary").textContent = "Showing " + visibleCount + " entries from " + getFilterText() + ".";
}

function addTransactionRow(tableBody, item) {
  var row = document.createElement("tr");

  var dateCell = document.createElement("td");
  dateCell.textContent = formatDate(item.date);

  var descriptionCell = document.createElement("td");
  descriptionCell.textContent = item.description;

  var categoryCell = document.createElement("td");
  var categoryBadge = document.createElement("span");
  categoryBadge.className = "category-pill";
  categoryBadge.textContent = item.category;
  categoryCell.appendChild(categoryBadge);

  var amountCell = document.createElement("td");
  if (item.type === "income") {
    amountCell.className = "income-text";
    amountCell.textContent = formatMoney(item.amount);
  } else {
    amountCell.className = "expense-text";
    amountCell.textContent = "-" + formatMoney(item.amount);
  }

  var actionCell = document.createElement("td");
  var deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Delete";
  deleteButton.onclick = function () {
    deleteTransaction(item.id);
  };
  actionCell.appendChild(deleteButton);

  row.appendChild(dateCell);
  row.appendChild(descriptionCell);
  row.appendChild(categoryCell);
  row.appendChild(amountCell);
  row.appendChild(actionCell);
  tableBody.appendChild(row);
}

function getFilterText() {
  if (currentFilter === "income") {
    return "income transactions";
  }

  if (currentFilter === "expense") {
    return "expense transactions";
  }

  return "all transactions";
}

function drawChart() {
  if (!chartCanvas) {
    return;
  }

  var box = chartCanvas.parentElement;
  chartCanvas.width = box.clientWidth - 16;
  chartCanvas.height = 270;

  var ctx = chartCanvas.getContext("2d");
  var chartData = getChartData();
  var darkMode = document.body.classList.contains("dark");
  var textColor = darkMode ? "#f8fafc" : "#111827";
  var gridColor = darkMode ? "#334155" : "#dce3ec";

  ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

  drawChartLegend(ctx, chartCanvas.width);
  drawChartGrid(ctx, chartCanvas.width, chartCanvas.height, chartData.maxValue, textColor, gridColor);
  drawChartBars(ctx, chartCanvas.width, chartCanvas.height, chartData, textColor);
}

// This builds a small chart data list from the transactions.
function getChartData() {
  var labels = [];
  var incomes = [];
  var expenses = [];
  var maxValue = 1;

  if (transactions.length === 0) {
    labels.push("Income vs Expenses");
    incomes.push(0);
    expenses.push(0);
  }

  for (var i = 0; i < transactions.length; i++) {
    var item = transactions[i];
    var label = formatDate(item.date);
    var index = labels.indexOf(label);

    if (index === -1) {
      labels.push(label);
      incomes.push(0);
      expenses.push(0);
      index = labels.length - 1;
    }

    if (item.type === "income") {
      incomes[index] = incomes[index] + Number(item.amount);
    } else {
      expenses[index] = expenses[index] + Number(item.amount);
    }
  }

  for (var j = 0; j < labels.length; j++) {
    if (incomes[j] > maxValue) {
      maxValue = incomes[j];
    }
    if (expenses[j] > maxValue) {
      maxValue = expenses[j];
    }
  }

  return {
    labels: labels,
    incomes: incomes,
    expenses: expenses,
    maxValue: maxValue
  };
}

function drawChartLegend(ctx, canvasWidth) {
  var startX = canvasWidth / 2 - 80;

  ctx.fillStyle = "#22c55e";
  ctx.fillRect(startX, 12, 42, 12);
  ctx.fillStyle = "#111827";
  if (document.body.classList.contains("dark")) {
    ctx.fillStyle = "#f8fafc";
  }
  ctx.font = "12px Arial";
  ctx.fillText("Income", startX + 48, 23);

  ctx.fillStyle = "#ef4444";
  ctx.fillRect(startX + 110, 12, 42, 12);
  ctx.fillStyle = "#111827";
  if (document.body.classList.contains("dark")) {
    ctx.fillStyle = "#f8fafc";
  }
  ctx.fillText("Expenses", startX + 158, 23);
}

function drawChartGrid(ctx, canvasWidth, canvasHeight, maxValue, textColor, gridColor) {
  var left = 55;
  var top = 45;
  var bottom = 42;
  var chartHeight = canvasHeight - top - bottom;

  ctx.font = "12px Arial";
  ctx.strokeStyle = gridColor;
  ctx.fillStyle = textColor;

  for (var i = 0; i <= 5; i++) {
    var y = top + chartHeight - (chartHeight / 5) * i;
    var value = (maxValue / 5) * i;

    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(canvasWidth - 10, y);
    ctx.stroke();

    ctx.fillText(formatMoney(value), 5, y + 4);
  }
}

function drawChartBars(ctx, canvasWidth, canvasHeight, chartData, textColor) {
  var left = 55;
  var top = 45;
  var bottom = 42;
  var chartWidth = canvasWidth - left - 20;
  var chartHeight = canvasHeight - top - bottom;
  var groupWidth = chartWidth / chartData.labels.length;
  var barWidth = Math.min(34, groupWidth / 5);

  ctx.font = "12px Arial";
  ctx.fillStyle = textColor;
  ctx.textAlign = "center";

  for (var i = 0; i < chartData.labels.length; i++) {
    var middle = left + groupWidth * i + groupWidth / 2;
    var incomeHeight = (chartData.incomes[i] / chartData.maxValue) * chartHeight;
    var expenseHeight = (chartData.expenses[i] / chartData.maxValue) * chartHeight;

    ctx.fillStyle = "#22c55e";
    ctx.fillRect(middle - barWidth - 3, top + chartHeight - incomeHeight, barWidth, incomeHeight);

    ctx.fillStyle = "#ef4444";
    ctx.fillRect(middle + 3, top + chartHeight - expenseHeight, barWidth, expenseHeight);

    ctx.fillStyle = textColor;
    ctx.fillText(chartData.labels[i], middle, canvasHeight - 12);
  }

  ctx.textAlign = "left";
}

function resetData() {
  var answer = confirm("Reset this account's finance data? This cannot be undone.");

  if (!answer) {
    return;
  }

  var user = getCurrentUser();
  transactions = [];
  currentFilter = "all";
  user.displayName = user.username;
  user.currency = "USD";

  saveTransactions();
  saveCurrentUser(user);
  localStorage.setItem(getThemeKey(), "light");

  document.getElementById("transaction-search").value = "";
  document.getElementById("transaction-filter").value = "all";
  document.body.classList.remove("dark");
  document.documentElement.classList.remove("dark");
  document.getElementById("dark-mode-toggle").checked = false;

  loadProfile();
  showDashboard();
  updateDashboard();
}

function formatMoney(value) {
  var user = getCurrentUser();
  var symbol = "$";
  var number = Number(value);
  var sign = "";

  if (number < 0) {
    sign = "-";
    number = number * -1;
  }

  if (user !== null && user.currency === "EUR") {
    symbol = "\u20ac";
  } else if (user !== null && user.currency === "GBP") {
    symbol = "\u00a3";
  } else if (user !== null && user.currency === "INR") {
    symbol = "\u20b9";
  } else if (user !== null && user.currency === "JPY") {
    symbol = "\u00a5";
  }

  var moneyText = number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return sign + symbol + moneyText;
}

function formatDate(value) {
  var date = new Date(value + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function getTodayDate() {
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var day = today.getDate();

  if (month < 10) {
    month = "0" + month;
  }

  if (day < 10) {
    day = "0" + day;
  }

  return year + "-" + month + "-" + day;
}

function showShortMessage(id, text) {
  var message = document.getElementById(id);
  message.textContent = text;

  setTimeout(function () {
    message.textContent = "";
  }, 2500);
}
