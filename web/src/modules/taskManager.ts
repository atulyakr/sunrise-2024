
import Task from "@/model/Task";
import { initialTasks } from "@/utils/TaskList";



let tasks: Task[] = [...initialTasks];

tasks[0].inProgress=true;
tasks[1].inProgress=true;

export function initializeTasks() {
   
}

export function getActiveTasks(): Task[] {

    return tasks.filter(task => task.inProgress);
}

export function getCompletedTasks(): Task[] {
    return tasks.filter(task => task.completed);
}

export function getAllTasks(): Task[] {
    return tasks;
}

export function completeTask(taskTitle: string): void {

    const taskIndex = tasks.findIndex(task => task.title === taskTitle);
    
        if (taskIndex !== -1) {
            tasks[taskIndex].inProgress = false;
            tasks[taskIndex+1].inProgress=true;
            
            //present group number
            let activeGroup=tasks[taskIndex].group;

            if((tasks.filter(task=>task.group==activeGroup && task.completed==true)).length==1){
                tasks[taskIndex+2].inProgress=true;
            }


            tasks[taskIndex].completed = true;

          } else {
            console.error(`Task with title "${taskTitle}" not found`);
          }
    
    
}

export function createTask(title: string, description: string, persona: string, group: number): void {
    let id=0;
    if(tasks.length>0){
        id=tasks[(tasks.length)-1].id+1;
    }
    else{
        id=1;
    }
    let newTask=new Task(id,title,description,persona,group)
    
    //check if the group number of the current task is less than or equal to the last active task, as it has to be inprogress and get completed before, if that's the case. 
    let active=getActiveTasks();
    let activeGroup=active[active.length-1].group
    if(group<=activeGroup){
        newTask.inProgress=true;
    }

    tasks.push(newTask);
    tasks.sort((a, b) => a.group - b.group);
}

export function updateTask(taskId: number, updatedTask: Partial<Omit<Task, 'id'>>): void {
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
    } else {
      console.error(`Task with ID ${taskId} not found`);
    }
}

export function deleteTask(taskId: number): void {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
    } else {
        console.error(`Task with ID ${taskId} not found`);
    }
}
