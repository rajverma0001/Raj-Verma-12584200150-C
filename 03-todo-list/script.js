const taskForm = document.getElementById("taskForm");
const taskField = document.getElementById("taskField");
const taskContainer = document.getElementById("taskContainer");
const pendingCount = document.getElementById("pendingCount");

const todoItems = [
  { label: "Review CSS Flexbox horizontal card layout", done: true },
  { label: "Practice JavaScript DOM chessboard generation", done: false },
  { label: "Prepare Express & MongoDB lab file", done: false },
];

function drawList() {
  taskContainer.innerHTML = "";
  const remaining = todoItems.filter((item) => !item.done).length;
  pendingCount.textContent = `${remaining} pending`;

  todoItems.forEach((item, idx) => {
    const row = document.createElement("li");
    row.className = `row-item${item.done ? " is-done" : ""}`;

    const infoGroup = document.createElement("div");
    infoGroup.className = "row-info";

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = item.done;
    check.addEventListener("change", () => {
      todoItems[idx].done = check.checked;
      drawList();
    });

    const titleSpan = document.createElement("span");
    titleSpan.className = "row-label";
    titleSpan.textContent = item.label;

    infoGroup.append(check, titleSpan);

    const btnGroup = document.createElement("div");
    btnGroup.className = "row-controls";

    const moveUpBtn = document.createElement("button");
    moveUpBtn.type = "button";
    moveUpBtn.className = "ctrl-btn";
    moveUpBtn.textContent = "↑ Up";
    moveUpBtn.disabled = idx === 0;
    moveUpBtn.addEventListener("click", () => {
      if (idx > 0) {
        [todoItems[idx - 1], todoItems[idx]] = [todoItems[idx], todoItems[idx - 1]];
        drawList();
      }
    });

    const moveDownBtn = document.createElement("button");
    moveDownBtn.type = "button";
    moveDownBtn.className = "ctrl-btn";
    moveDownBtn.textContent = "↓ Down";
    moveDownBtn.disabled = idx === todoItems.length - 1;
    moveDownBtn.addEventListener("click", () => {
      if (idx < todoItems.length - 1) {
        [todoItems[idx + 1], todoItems[idx]] = [todoItems[idx], todoItems[idx + 1]];
        drawList();
      }
    });

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "ctrl-btn remove-btn";
    removeBtn.textContent = "Delete";
    removeBtn.addEventListener("click", () => {
      todoItems.splice(idx, 1);
      drawList();
    });

    btnGroup.append(moveUpBtn, moveDownBtn, removeBtn);
    row.append(infoGroup, btnGroup);
    taskContainer.appendChild(row);
  });
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = taskField.value.trim();
  if (!text) return;
  todoItems.push({ label: text, done: false });
  taskField.value = "";
  drawList();
});

drawList();
