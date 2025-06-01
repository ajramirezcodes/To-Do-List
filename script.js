const titleInput = document.getElementById("title");
const dateInput = document.getElementById("date");
const timeFrom = document.getElementById("time-from");
const timeTo = document.getElementById("time-to");
const descriptionInput = document.getElementById("description");
const taskButton = document.getElementById("task-button");
const list2 = document.querySelector(".list2");


document.addEventListener("DOMContentLoaded", () => { //loads tasks saved in local storage
   const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
   savedTasks.forEach(task => addTaskToList(task));

})

dateInput.min = new Date().toISOString().split("T")[0]; //ensures they cannot select before todays date

taskButton.addEventListener("click", addTasks);


function addTasks(e) {
   e.preventDefault();

   if (!titleInput.value.trim() || !dateInput.value) {
           alert("Please enter task title and task date.");
           return;
           }
   
   const task = taskObject();
   saveTask(task);
   addTaskToList(task);


   titleInput.value = "";
   dateInput.value = "";
   timeFrom.value = "";
   timeTo.value = "";
   descriptionInput.value = "";

}

 
function taskObject() {

   return {
       id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
       title: titleInput.value.trim(),
       date: dateInput.value,
       timeFrom: timeFrom.value,
       timeTo: timeTo.value,
       description: descriptionInput.value.trim(),
   }

}


function saveTask(task) {
   const savedTasks = JSON.parse(localStorage.getItem("tasks")) || []; // Gets current tasks from storage
   savedTasks.push(task); // Adds new task to array
   localStorage.setItem("tasks", JSON.stringify(savedTasks)) // Saves back to localStorage (must convert to JSON string)
}


function addTaskToList(task) {
   const taskElement = document.createElement("div");
   taskElement.className = "task";
   taskElement.dataset.id = task.id; //adds ID to element

   const timeFrom12hr = convertTo12HourFormat(task.timeFrom);
   const timeTo12hr = convertTo12HourFormat(task.timeTo);

   taskElement.innerHTML = `
       <h3><strong>Title:</strong> ${task.title}<h3>
       <p><strong>Date:</strong> ${formatDate(task.date)}</p>
       <p><strong>Time:</strong> ${timeFrom12hr} to ${timeTo12hr}</p>
       <p><strong>Description:</strong> ${task.description}</p>
       <button class="delete-button">Delete Task</button>
       <hr>
   `;

   list2.appendChild(taskElement); //Appends to task list
   deleteButton(taskElement, task.id)
}

function formatDate(dateStr) {
      const date = new Date(dateStr);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
}


function convertTo12HourFormat(time24) {
      if (!time24) {
            return "";
      }

      let [hours, minutes] = time24.split(":");
      let period = "AM";

      hours = parseInt(hours); // Convert string to number

      if (hours >= 12) {
         period = "PM";
         if (hours > 12) hours = hours - 12; 
      }

      if (hours === "00") { // Handle midnight
            hours = 12;
      }

      minutes = minutes.padStart(2, "0"); // Add leading zero to minutes if needed

      return `${hours}:${minutes} ${period}`;
}


function deleteButton(element, taskId) {

   const deleteBtn = element.querySelector(".delete-button")
   deleteBtn.addEventListener("click", () => deleteTask(taskId));

}


function deleteTask(id) {
   let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
   savedTasks = savedTasks.filter(task => task.id !== id); // Filters out task with matching ID
   localStorage.setItem("tasks", JSON.stringify(savedTasks)); //Saves updated list

   const taskElement = document.querySelector(`.task[data-id="${id}"]`); //Finds and removes task element from DOM
   if (taskElement) {
           taskElement.remove();
   }
}



