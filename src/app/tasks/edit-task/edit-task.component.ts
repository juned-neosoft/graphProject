import { Component } from '@angular/core';
import { Tasks } from '../tasks';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { GET_Search, GET_tasks } from '../gql/tasks-query';
import { Update_task } from '../gql/tasks-mutation';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent {
  
  constructor(
    private route: ActivatedRoute,
    private apollo: Apollo,
    private router: Router
  ) {}

  fruitForm: Tasks = {
    id: 0,
    name: '',
    price: 0,
    quantity: 0,
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      var id = Number(params.get('id'));
      this.getById(id);
    });
  }

  // getById(id: number) {
  //   this.apollo
  //     .watchQuery<{ allFruits: Tasks[] }>({
  //       query: GET_Search,
  //       variables: { fruitFilter: { id } },
  //     })
  //     .valueChanges.subscribe(({ data }) => {
  //       var fruritById = data.allFruits[0];
  //       this.fruitForm = {
  //         id: fruritById.id,
  //         name: fruritById.name,
  //         price: fruritById.price,
  //         quantity: fruritById.quantity,
  //       };
  //     });
  // }

  getById(id: number) {
    this.apollo
      .watchQuery<{ alltasks: Tasks[] }>({
        query: GET_Search,
        variables: { taskFilter: { id } }, // Ensure the variable matches your schema
      })
      .valueChanges.subscribe({
        next: ({ data }) => {  
          // Find the task with the matching ID
          const taskById = data.alltasks.find((task) => task.id == id);
          if (taskById) {
            this.fruitForm = {
              id: taskById.id,
              name: taskById.name,
              price: taskById.price,
              quantity: taskById.quantity,
            };
          } else {
            console.warn('No task found with the given ID:', id);
          }
        },
        error: (err) => {
          console.error('Error fetching task by ID:', err);
        },
      });
  }
  
  

  update() {
    this.apollo
      .mutate<{ updateFruit: Tasks }>({
        mutation: Update_task,
        variables: {
          name: this.fruitForm.name,
          price: this.fruitForm.price,
          quantity: this.fruitForm.quantity,
          id: this.fruitForm.id,
        },
        update: (store, { data }) => {
          if (data?.updateFruit) {
            var allData = store.readQuery<{ allFruits: Tasks[] }>({
              query: GET_tasks,
            });

            if (allData && allData?.allFruits?.length > 0) {
              var newData: Tasks[] = [...allData.allFruits];
              newData = newData.filter((_) => _.id !== data.updateFruit.id);
              newData.unshift(data.updateFruit);

              store.writeQuery<{ allFruits: Tasks[] }>({
                query: GET_tasks,
                data: { allFruits: newData },
              });
            }
          }
        },
      })
      .subscribe(({ data }) => {
        this.router.navigate(['/']);
      });
  }

}
