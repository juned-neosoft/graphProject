import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { CREATE_task } from '../gql/tasks-mutation';
import { GET_tasks } from '../gql/tasks-query';
import { Tasks } from 'src/app/tasks/tasks';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {

  constructor(private apollo: Apollo, private router: Router) {}

  taskForm: Tasks = {
    id: 0,
    name: '',
    price: 0,
    quantity: 0,
  };

  ngOnInit(): void {}

  create() {
    this.apollo
      .mutate<{ createtask: Tasks }>({
        mutation: CREATE_task,
        variables: {
          name: this.taskForm.name,
          price: this.taskForm.price,
          quantity: this.taskForm.quantity,
        },
        update: (store, { data }) => {
          // Access the in-memory cache and update it with the new task
          if (data?.createtask) {
            var allData = store.readQuery<{ alltasks: Tasks[] }>({
              query: GET_tasks,
            });
  
            if (allData && allData?.alltasks?.length > 0) {
              var newData: Tasks[] = [...allData.alltasks];
              newData?.unshift(data.createtask);
  
              store.writeQuery<{ alltasks: Tasks[] }>({
                query: GET_tasks,
                data: { alltasks: newData },
              });
            }
          }
        },
      })
      .subscribe({
        next: (response) => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Mutation failed:', err.message || err);
        },
      });
  }
  
}
