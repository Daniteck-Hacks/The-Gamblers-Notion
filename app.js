  const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";
  const apiKey = "AIzaSyAwTN162IXk1fl-K-ubjL8-KrSYr3r-6nU"; // Keep private in production

  async function getTaskBreakdown(task, difficulty) {
    const prompt = `Break down the following task into smaller tasks based on the difficulty level:
    Task: ${task}
    Difficulty: ${difficulty}
    Please list the tasks with suggested time to complete each.`;

    try {
      const response = await fetch(`${endpoint}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return result || "No breakdown found.";
    } catch (error) {
      console.error("Error from Gemini:", error);
      return "Failed to generate breakdown.";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById('generateBtn');

    generateBtn.addEventListener('click', async () => {
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
  });



