import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

// Import GraphQL operations
import { GET_tasks, GET_Search } from '../gql/tasks-query';
import { CREATE_task, Update_task, Delete_task } from '../gql/tasks-mutation';

export interface Task {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface TaskFilter {
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TaskGraphqlService {

  // Simple event emitters for real-time simulation
  private taskAddedSubject = new Subject<Task>();
  private taskUpdatedSubject = new Subject<Task>();
  private taskDeletedSubject = new Subject<Task>();

  constructor(private apollo: Apollo) { }

  // QUERIES
  getAllTasks(): Observable<Task[]> {
    return this.apollo.watchQuery<{alltasks: Task[]}>({
      query: GET_tasks,
      fetchPolicy: 'cache-and-network'
    }).valueChanges.pipe(
      map(result => result.data.alltasks)
    );
  }

  searchTasks(filter: TaskFilter): Observable<Task[]> {
    return this.apollo.watchQuery<{alltasks: Task[]}>({
      query: GET_Search,
      variables: { TaskFilter: filter },
      fetchPolicy: 'cache-and-network'
    }).valueChanges.pipe(
      map(result => result.data.alltasks)
    );
  }

  // MUTATIONS
  createTask(name: string, quantity: number, price: number): Observable<Task> {
    return this.apollo.mutate<{createtask: Task}>({
      mutation: CREATE_task,
      variables: { name, quantity, price },
      refetchQueries: [{ query: GET_tasks }]
    }).pipe(
      map(result => {
        const task = result.data!.createtask;
        // Emit event for real-time simulation
        this.taskAddedSubject.next(task);
        return task;
      })
    );
  }

  updateTask(id: string, name: string, quantity: number, price: number): Observable<Task> {
    return this.apollo.mutate<{updatetask: Task}>({
      mutation: Update_task,
      variables: { id, name, quantity, price },
      refetchQueries: [{ query: GET_tasks }]
    }).pipe(
      map(result => {
        const task = result.data!.updatetask;
        // Emit event for real-time simulation
        this.taskUpdatedSubject.next(task);
        return task;
      })
    );
  }

  deleteTask(id: string): Observable<Task> {
    return this.apollo.mutate<{removetask: Task}>({
      mutation: Delete_task,
      variables: { id },
      refetchQueries: [{ query: GET_tasks }]
    }).pipe(
      map(result => {
        const task = result.data!.removetask;
        // Emit event for real-time simulation
        this.taskDeletedSubject.next(task);
        return task;
      })
    );
  }

  // SIMULATED SUBSCRIPTIONS (using Subjects)
  onTaskAdded(): Observable<Task> {
    return this.taskAddedSubject.asObservable();
  }

  onTaskUpdated(): Observable<Task> {
    return this.taskUpdatedSubject.asObservable();
  }

  onTaskDeleted(): Observable<Task> {
    return this.taskDeletedSubject.asObservable();
  }
}