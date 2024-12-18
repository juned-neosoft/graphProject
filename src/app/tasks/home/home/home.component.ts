import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Tasks } from '../../tasks';
import { map, Observable, of } from 'rxjs';
import { GET_Search, GET_tasks } from '../../gql/tasks-query';
import { Delete_task } from '../../gql/tasks-mutation';
declare var window: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  allTasks$: Observable<Tasks[]> = of([]);
  searchName: string = '';

  deleteModal: any;
  idTodelete: number = 0;

  constructor(private apollo: Apollo) { }

  ngOnInit(): void {  
    setTimeout(() => {
      this.deleteModal = new window.bootstrap.Modal(
        document.getElementById('deleteModal')
      );
    }, 0);
  
    // Fetch all tasks and log them
    this.allTasks$ = this.apollo
      .watchQuery<{ alltasks: Tasks[] }>({ query: GET_tasks })
      .valueChanges.pipe(
        map((result) => result.data.alltasks) // Extract the 'alltasks' array
      );
  
    // Subscribe to log the tasks
    this.allTasks$.subscribe({
      next: (tasks) => {
      },
      error: (err) => {
      },
    });
  }

  onSearchNameChange(value: string): void {
    this.searchName = value;
    if (!this.searchName.trim()) {
      this.ngOnInit(); // Reinitialize the component if searchName is empty
    } else {
      this.search(this.searchName); // Perform the search
    }
  }

  search(searchName: string) {
    this.allTasks$ = this.apollo
      .watchQuery<{ alltasks: Tasks[] }>({
        query: GET_Search,
        variables: { taskFilter: { name: searchName } }, // Filter based on searchName
      })
      .valueChanges.pipe(
        map((result) => {
          const filteredTasks = result.data.alltasks.filter((task) =>
            task.name.toLowerCase().includes(searchName.toLowerCase())
          ); // Filter tasks by name
          return filteredTasks; // Return the filtered list
        })
      );
  }

  openDeleteModal(id: number) {
    this.idTodelete = id;
    this.deleteModal.show();
  }

  delete() {
    this.apollo
      .mutate<{ removeFruit: Tasks }>({
        mutation: Delete_task,
        variables: {
          id: this.idTodelete,
        },
        update: (store, { data }) => {
          if (data?.removeFruit) {
            var allData = store.readQuery<{ allFruits: Tasks[] }>({
              query: GET_tasks,
            });

            if (allData && allData?.allFruits?.length > 0) {
              var newData: Tasks[] = [...allData.allFruits];
              newData = newData.filter((_) => _.id != data.removeFruit.id);

              store.writeQuery<{ allFruits: Tasks[] }>({
                query: GET_tasks,
                data: { allFruits: newData },
              });
            }
          }
        },
      })
      .subscribe(({ data }) => {
        this.deleteModal.hide();
      });
  }
}
