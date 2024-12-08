const taskForm=document.getElementById('todoForm');
const taskInput=document.getElementById('taskInput');
const taskList=document.getElementById('taskList');
const filterButtons=document.getElementById('filterButtons');

//load tasks from localStorage when the page loads
document.addEventListener('DOMContentLoaded',loadTasks);

//add a new task
taskForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const task=taskInput.value.trim();
    if(task){
        addTaskToUI(task);
        saveTaskToStorage(task);
        taskInput.value='';
    };
});

//mark task as completed or delete
taskList.addEventListener('click',(e)=>{
    const li=e.target.closest('li');
    const taskText=li.dataset.task;

    if(e.target.classList.contains('delete-task')){
        li.remove();
        removeTaskFromStorage({text:taskText});
    }else if(e.target.type==='checkbox'){
        const isCompleted=e.target.checked;
        li.classList.toggle('completed',isCompleted);
        updateTaskStatusInStorage(taskText, isCompleted);
    }
});
//filter tasks
filterButtons.addEventListener('click',(e)=>{
    const filter=e.target.dataset.filter;
    if(!filter)return;

    document.querySelectorAll('.filter-btn').forEach(btn=> btn.classList.remove('active'));
    e.target.classList.add('active');
    Array.from(taskList.children).forEach(li=>{
        const isCompleted=li.classList.contains('completed');
        if(filter==='all'){
            li.style.display='';
        }else if(filter==='completed'&&isCompleted){
            li.style.display='';
        }else if(filter=== 'pending'&& !isCompleted){
                li.style.display='';
        }else{
            li.style.display='none';
        }
    });
})
//load tasks from localStorage and display them
function loadTasks(){
    const tasks=getTasksFromStorage();
    tasks.forEach(task=> addTaskToUI(task));
}
//add task to the UI
function addTaskToUI(task){
    const li=document.createElement('li');
    li.textContent=task.text||task;
    li.dataset.task=task.text||task;
    if(task.completed)li.classList.add('completed');

    const checkbox=document.createElement('input');
    checkbox.type='checkbox';
    checkbox.checked=task.completed;
    li.prepend(checkbox);

    //add delete button
    const deleteButton=document.createElement('button');
    deleteButton.type='button';
    deleteButton.textContent='Delete';
    deleteButton.classList.add('delete-task');
    deleteButton.addEventListener('click', () => {
        li.remove(); // Remove task from the list
        removeTaskFromStorage(task);
    });
    
    li.appendChild(deleteButton);
    taskList.appendChild(li);
}
//save task to localStorage
function saveTaskToLocalStorage(task){
    const tasks=getTasksFromStorage();
    tasks.push(task);
    localStorage.setItem('tasks',JSON.stringify(tasks))
}

//update task status in localStorage
function updateTaskStatusInStorage(taskText, isCompleted){
    const tasks=getTasksFromStorage();
    const task=tasks.find(t=> t.text===taskText);
    if(task){task.completed=isCompleted;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}
//remove task from localStorage
function removeTaskFromStorage(task){
    const tasks=getTasksFromStorage();
    const updatedTasks=tasks.filter((t) =>t.text !==task.text);
    localStorage.setItem('tasks',JSON.stringify(updatedTasks));
}
//get tasks from localStorage
function getTasksFromStorage(){
    const tasks=localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks):[];
}