import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyAwTN162IXk1fl-K-ubjL8-KrSYr3r-6nU" }); // Replace with your actual API key

// Function to generate task breakdown using Gemini API
async function generateTaskBreakdown(taskDescription, difficultyLevel) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Ensure this model name is correct based on your needs
      contents: `Break down the following task into smaller steps based on the difficulty level (${difficultyLevel}):
                 ${taskDescription}`,
    });

    console.log("Generated Task Breakdown:", response.text);
    return response.text;  // Return the text response from Gemini (task breakdown)
  } catch (error) {
    console.error("Error generating content:", error);
    return "Error generating task breakdown.";
  }
}

// Event listener for the "Break it down" button
document.getElementById('generateBtn').addEventListener('click', async () => {
  const task = document.getElementById('taskInput').value;
  const difficulty = document.getElementById('difficulty').value;

  if (task && difficulty) {
    const breakdown = await generateTaskBreakdown(task, difficulty);
    document.getElementById('tasksContainer').innerText = breakdown;
  } else {
    alert("Please enter a task and select a difficulty level.");
  }
});

let pomodoroTimer; // to keep track of the timer

// Function to start the Pomodoro timer
function startPomodoro(task) {
  let workTime = 25 * 60; // 25 minutes of work
  let breakTime = 5 * 60; // 5 minutes of break
  let isWorking = true;

  const timerDisplay = document.createElement("div");
  timerDisplay.id = "pomodoroTimer";
  timerDisplay.innerText = `Starting Pomodoro for: ${task}`;
  document.getElementById('tasksContainer').appendChild(timerDisplay);

  function updateTimer() {
    const minutes = Math.floor(workTime / 60);
    const seconds = workTime % 60;
    timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    if (workTime <= 0) {
      if (isWorking) {
        // Switch to break time
        workTime = breakTime;
        isWorking = false;
        timerDisplay.innerText = "Take a break!";
      } else {
        // Finish Pomodoro session
        clearInterval(pomodoroTimer);
        alert("Pomodoro session complete!");
      }
    } else {
      workTime--;
    }
  }

  pomodoroTimer = setInterval(updateTimer, 1000); // Update every second
}

// Trigger Pomodoro for each task when clicked
document.getElementById('tasksContainer').addEventListener('click', (event) => {
  if (event.target.classList.contains('task')) {
    const task = event.target.innerText;
    startPomodoro(task);
  }
});

// Function to calculate points based on difficulty level
function calculatePoints(difficulty) {
  let points = 0;
  if (difficulty === 'easy') {
    points = 10;
  } else if (difficulty === 'medium') {
    points = 20;
  } else if (difficulty === 'hard') {
    points = 30;
  }
  return points;
}
