import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyAwTN162IXk1fl-K-ubjL8-KrSYr3r-6nU" }); // Replace with your actual API key

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

generateTaskBreakdown(taskDescription, difficultyLevel);

// Handles AI task breakdown
async function getTaskBreakdown(task, difficulty) {
  const prompt = `Break down the following task into smaller tasks based on the difficulty level: 
  Task: ${task}
  Difficulty: ${difficulty}
  Please list the tasks with suggested time to complete each.`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ai}`
    },
    body: JSON.stringify({
      model: 'gemini-2.0-flash', // or other GPT models if you prefer
      prompt: prompt,
      max_tokens: 500,
    })
  });

  const data = await response.json();
  return data.choices[0].text.trim(); // Returning the breakdown text
}

// Event listener for the "Break it down" button
document.getElementById('generateBtn').addEventListener('click', async () => {
  const task = document.getElementById('taskInput').value;
  const difficulty = document.getElementById('difficulty').value;
  console.log("Button clicked. Task:", task, "Difficulty:", difficulty);

  if (task && difficulty) {
    const breakdown = await getTaskBreakdown(task, difficulty);
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

// Function to handle task completion
function completeTask(difficulty) {
  const points = calculatePoints(difficulty);
  alert(`You earned ${points} points for this task!`);
  // Add points to the user's total (this can be expanded to track overall points)
  let totalPoints = parseInt(localStorage.getItem('totalPoints')) || 0;
  totalPoints += points;
  localStorage.setItem('totalPoints', totalPoints);
  console.log("Total Points: ", totalPoints); // Update in console for testing
}

// Simulate task completion after Pomodoro
document.getElementById('tasksContainer').addEventListener('click', (event) => {
  if (event.target.classList.contains('task')) {
    const difficulty = document.getElementById('difficulty').value;
    completeTask(difficulty);
  }
});


