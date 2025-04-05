let pomodoroTimer;

function startPomodoro(task) {
  let workTime = 25 * 60;
  let breakTime = 5 * 60;
  let isWorking = true;

  const timerDisplay = document.createElement("div");
  timerDisplay.id = "pomodoroTimer";
  timerDisplay.innerText = `Starting Pomodoro for: ${task}`;
  document.getElementById("tasksContainer").appendChild(timerDisplay);

  function updateTimer() {
    const minutes = Math.floor(workTime / 60);
    const seconds = workTime % 60;
    timerDisplay.innerText = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

    if (workTime <= 0) {
      if (isWorking) {
        workTime = breakTime;
        isWorking = false;
        timerDisplay.innerText = "Take a break!";
      } else {
        clearInterval(pomodoroTimer);
        alert("Pomodoro session complete!");
      }
    } else {
      workTime--;
    }
  }

  pomodoroTimer = setInterval(updateTimer, 1000);
}

function calculatePoints(difficulty) {
  if (difficulty === "easy") return 10;
  if (difficulty === "medium") return 20;
  if (difficulty === "hard") return 30;
  return 0;
}

function completeTask(difficulty) {
  const points = calculatePoints(difficulty);
  let totalPoints = parseInt(localStorage.getItem("totalPoints")) || 0;
  totalPoints += points;
  localStorage.setItem("totalPoints", totalPoints);
  alert(`You earned ${points} points! Total: ${totalPoints}`);
}

document.getElementById("tasksContainer").addEventListener("click", (event) => {
  if (event.target.classList.contains("task")) {
    const task = event.target.innerText;
    const difficulty = document.getElementById("difficulty").value;
    startPomodoro(task);
    completeTask(difficulty);
  }
});
