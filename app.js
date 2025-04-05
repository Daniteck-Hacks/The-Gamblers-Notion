const apiKey = 'AIzaSyAwTN162IXk1fl-K-ubjL8-KrSYr3r-6nU'; // Replace with your Gemini API key
const endpoint = 'https://generativelanguage.googleapis.com'; // Gemini API endpoint

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
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gemini-001', // or other GPT models if you prefer
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

  if (task && difficulty) {
    const breakdown = await getTaskBreakdown(task, difficulty);
    document.getElementById('tasksContainer').innerText = breakdown;
  } else {
    alert("Please enter a task and select a difficulty level.");
  }
});

