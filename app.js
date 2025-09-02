const polls = [
  { name: "Onko vai ei", description: "Valitse: Onko vai ei?", options: ["On", "Ei"], votes: [0, 0] },
  { name: "1 vai 2", description: "Kumpi on parempi: 1 vai 2?", options: ["1", "2"], votes: [0, 0] }
];

const validUsers = [
  { username: "Matti123", password: "OlenParas2", role: "Normal User" },
  { username: "Teppo123", password: "OikeastiVai4", role: "Moderator" }
];

let currentUser = null;
let votedPolls = {};

function $(id) { return document.getElementById(id); }

$("login-btn").onclick = function() {
  const username = $("login-user").value.trim();
  const password = $("login-pass").value.trim();
  const role = document.querySelector('input[name="role"]:checked').value;
  const user = validUsers.find(u => u.username === username && u.password === password && u.role === role);
  if (user) {
    currentUser = user;
    $("auth").classList.add("hidden");
    $("polls").classList.remove("hidden");
    $("role-switch").classList.remove("hidden");
    showRole();
    showAdminPanel();
    displayPolls();
    $("login-user").value = "";
    $("login-pass").value = "";
  } else {
    $("login-pass").value = "";
    $("login-user").value = "";
    // Voit näyttää virheilmoituksen sivulla jos haluat
  }
};

$("switch-role").onclick = function() {
  $("auth").classList.remove("hidden");
  $("polls").classList.add("hidden");
  $("poll-view").classList.add("hidden"); // <-- tämä piilottaa yksittäisen äänestyksen
  $("admin").classList.add("hidden");
  $("role-switch").classList.add("hidden");
  $("login-user").value = "";
  $("login-pass").value = "";
};

function showRole() {
  if (!currentUser) return;
  $("switch-role").textContent = `Kirjaudu toisella roolilla`;
}

function showAdminPanel() {
  if (!currentUser) return;
  if (currentUser.role === "Moderator") $("admin").classList.remove("hidden");
  else $("admin").classList.add("hidden");
  updateDeletePollSelect();
}

function displayPolls() {
  const list = $("poll-list");
  list.innerHTML = "";
  polls.forEach((poll, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="#" data-idx="${i}" class="poll-link">${poll.name}</a>
      <span style="float:right;">${poll.options[0]}: ${poll.votes[0]} | ${poll.options[1]}: ${poll.votes[1]}</span>`;
    list.appendChild(li);
  });
  document.querySelectorAll(".poll-link").forEach(link => {
    link.onclick = function(e) {
      e.preventDefault();
      showPoll(this.dataset.idx);
    };
  });
}

function showPoll(idx) {
  $("poll-view").classList.remove("hidden");
  const poll = polls[idx];
  $("poll-desc").textContent = poll.description;
  $("poll-view").dataset.idx = idx;

  // Vaihtoehtonapit
  const voteBtns = $("poll-view").querySelectorAll("button");
  voteBtns[0].textContent = poll.options[0];
  voteBtns[1].textContent = poll.options[1];
}

$("vote-yes").onclick = function() {
  vote(0);
};
$("vote-no").onclick = function() {
  vote(1);
};

function vote(optionIdx) {
  const idx = $("poll-view").dataset.idx;
  if (currentUser && idx !== undefined) {
    const key = currentUser.username + "_" + idx;
    if (!votedPolls[key]) {
      polls[idx].votes[optionIdx]++;
      votedPolls[key] = true;
      displayPolls();
    }
  }
}

// Äänestyksen luonti lomakkeella
$("create-poll-form").onsubmit = function(e) {
  e.preventDefault();
  const name = $("poll-name").value.trim();
  const desc = $("poll-desc-input").value.trim();
  const opt1 = $("option1").value.trim();
  const opt2 = $("option2").value.trim();
  if (name && desc && opt1 && opt2) {
    polls.push({ name, description: desc, options: [opt1, opt2], votes: [0, 0] });
    $("poll-name").value = "";
    $("poll-desc-input").value = "";
    $("option1").value = "";
    $("option2").value = "";
    displayPolls();
    updateDeletePollSelect();
  }
};

// Äänestyksen poisto lomakkeella
function updateDeletePollSelect() {
  const select = $("delete-poll-select");
  select.innerHTML = "";
  polls.forEach((poll, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = poll.name;
    select.appendChild(opt);
  });
}

$("delete-poll-form").onsubmit = function(e) {
  e.preventDefault();
  const idx = $("delete-poll-select").value;
  if (idx !== null && idx !== undefined && polls[idx]) {
    polls.splice(idx, 1);
    displayPolls();
    updateDeletePollSelect();
  }
};

// Salasanan näyttö hoverilla
const passInput = $("login-pass");
const showPass = document.getElementById("show-pass");
showPass.addEventListener("mouseenter", function() {
  passInput.type = "text";
});
showPass.addEventListener("mouseleave", function() {
  passInput.type = "password";
});
