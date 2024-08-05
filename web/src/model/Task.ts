

export default class Task {
    id: number;
    title: string;
    description: string;
    persona: string;
    group: number;
    inProgress:boolean;
    completed: boolean;

  
    constructor(id: number, title: string, description: string, persona: string, group: number, inProgress:boolean=false,completed: boolean = false) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.persona = persona;
      this.group = group;
      this.inProgress=inProgress;
      this.completed = completed;
    }
  }
  