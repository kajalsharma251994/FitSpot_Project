// Add Workout (Add.html)
const form = document.getElementById("workoutForm");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const workout = {
      date: document.getElementById("date").value,
      type: document.getElementById("type").value,
      duration: parseInt(document.getElementById("duration").value),
      calories: parseInt(document.getElementById("calories").value)
    };
    let workouts = JSON.parse(localStorage.getItem("workouts")) || [];
    workouts.push(workout);
    localStorage.setItem("workouts", JSON.stringify(workouts));
    alert("Workout saved successfully!");
    form.reset();
  });
}

// View Workouts (View.html)
function loadWorkouts() {
  const table = document.querySelector("#workoutTable tbody");
  if (!table) return;
  table.innerHTML = "";
  const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
  workouts.forEach((w, i) => {
    table.innerHTML += `
      <tr>
        <td>${w.date}</td>
        <td>${w.type}</td>
        <td>${w.duration}</td>
        <td>${w.calories}</td>
        <td><button onclick="deleteWorkout(${i})" class="btn">Delete</button></td>
      </tr>`;
  });
}

function deleteWorkout(index) {
  const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
  workouts.splice(index, 1);
  localStorage.setItem("workouts", JSON.stringify(workouts));
  loadWorkouts();
}
document.addEventListener("DOMContentLoaded", loadWorkouts);

// Dashboard Data (Index.html)
if (document.getElementById("totalWorkouts")) {
  const workouts = JSON.parse(localStorage.getItem("workouts")) || [];
  const totalWorkouts = workouts.length;
  const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
  const goal = 5;
  const goalProgress = Math.min((totalWorkouts / goal) * 100, 100);

  document.getElementById("totalWorkouts").textContent = totalWorkouts;
  document.getElementById("totalCalories").textContent = totalCalories;
  document.getElementById("goalProgress").textContent = `${goalProgress.toFixed(1)}%`;
}

// Charts (Charts.html)
if (document.getElementById("caloriesChart")) {
  const ctx1 = document.getElementById("caloriesChart");
  const ctx2 = document.getElementById("typeChart");

  const workouts = JSON.parse(localStorage.getItem("workouts")) || [];

  const labels = workouts.map(w => w.date);
  const calories = workouts.map(w => w.calories);

  new Chart(ctx1, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Calories Burned',
        data: calories,
        borderColor: '#0077b6',
        fill: false
      }]
    }
  });

  const typeCount = {};
  workouts.forEach(w => typeCount[w.type] = (typeCount[w.type] || 0) + 1);

  new Chart(ctx2, {
    type: 'pie',
    data: {
      labels: Object.keys(typeCount),
      datasets: [{
        data: Object.values(typeCount),
        backgroundColor: ['#0077b6', '#00b4d8', '#90e0ef', '#caf0f8']
      }]
    }
  });
}
