import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TaskGraphqlService, Task } from '../services/task-graphql.service';

@Component({
  selector: 'app-task-demo',
  template: `
    <div class="container mt-4">
      <div class="row">
        <div class="col-12">
          <h1>GraphQL CRUD with Subscriptions Demo</h1>
          <p class="text-muted">This demo shows Query, Mutation, and Subscription operations</p>
          
          <!-- Navigation -->
          <nav class="nav nav-pills mb-4">
            <a class="nav-link" [class.active]="activeTab === 'list'" (click)="activeTab = 'list'">Task List</a>
            <a class="nav-link" [class.active]="activeTab === 'realtime'" (click)="activeTab = 'realtime'">Real-time Updates</a>
          </nav>
        </div>
      </div>

      <!-- Task List Tab -->
      <div *ngIf="activeTab === 'list'">
        <div class="row">
          <div class="col-md-8">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h3>Tasks</h3>
              <button class="btn btn-primary" (click)="loadTasks()">Refresh</button>
            </div>
            
            <!-- Search -->
            <div class="mb-3">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Search tasks..." 
                [(ngModel)]="searchTerm"
                (input)="onSearch()">
            </div>

            <!-- Tasks Table -->
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let task of displayTasks">
                    <td>{{ task.id }}</td>
                    <td>
                      <span *ngIf="!task.editing">{{ task.name }}</span>
                      <input *ngIf="task.editing" 
                             type="text" 
                             class="form-control form-control-sm" 
                             [(ngModel)]="task.editName">
                    </td>
                    <td>
                      <span *ngIf="!task.editing">{{ task.quantity }}</span>
                      <input *ngIf="task.editing" 
                             type="number" 
                             class="form-control form-control-sm" 
                             [(ngModel)]="task.editQuantity">
                    </td>
                    <td>
                      <span *ngIf="!task.editing">\${{ task.price }}</span>
                      <input *ngIf="task.editing" 
                             type="number" 
                             class="form-control form-control-sm" 
                             [(ngModel)]="task.editPrice">
                    </td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button *ngIf="!task.editing" 
                                class="btn btn-outline-primary" 
                                (click)="startEdit(task)">Edit</button>
                        <button *ngIf="task.editing" 
                                class="btn btn-success" 
                                (click)="saveEdit(task)">Save</button>
                        <button *ngIf="task.editing" 
                                class="btn btn-secondary" 
                                (click)="cancelEdit(task)">Cancel</button>
                        <button class="btn btn-outline-danger" 
                                (click)="deleteTask(task.id)">Delete</button>
                      </div>
                    </td>
                  </tr>
                  <tr *ngIf="displayTasks.length === 0">
                    <td colspan="5" class="text-center text-muted">No tasks found</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Add Task Form -->
          <div class="col-md-4">
            <h4>Add New Task</h4>
            <form (ngSubmit)="createTask()" #taskForm="ngForm">
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input type="text" 
                       class="form-control" 
                       [(ngModel)]="newTask.name" 
                       name="name" 
                       required>
              </div>
              <div class="mb-3">
                <label class="form-label">Quantity</label>
                <input type="number" 
                       class="form-control" 
                       [(ngModel)]="newTask.quantity" 
                       name="quantity" 
                       required 
                       min="1">
              </div>
              <div class="mb-3">
                <label class="form-label">Price</label>
                <input type="number" 
                       class="form-control" 
                       [(ngModel)]="newTask.price" 
                       name="price" 
                       required 
                       min="0.01" 
                       step="0.01">
              </div>
              <button type="submit" 
                      class="btn btn-primary w-100" 
                      [disabled]="!taskForm.valid">
                Add Task
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Real-time Tab -->
      <div *ngIf="activeTab === 'realtime'">
        <div class="row">
          <div class="col-12">
            <h3>Real-time Activity Monitor</h3>
            <p>This section shows live updates when tasks are added, updated, or deleted from any source.</p>
            
            <div class="alert alert-info">
              <h5>Subscription Status</h5>
              <div class="d-flex gap-3">
                <span class="badge bg-success">Task Added: Active</span>
                <span class="badge bg-warning">Task Updated: Active</span>
                <span class="badge bg-danger">Task Deleted: Active</span>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h5>Live Activity Feed</h5>
              </div>
              <div class="card-body" style="max-height: 400px; overflow-y: auto;">
                <div *ngFor="let activity of realtimeActivities" 
                     class="alert mb-2" 
                     [ngClass]="getActivityAlertClass(activity.type)">
                  <div class="d-flex justify-content-between">
                    <span>{{ activity.message }}</span>
                    <small class="text-muted">{{ activity.timestamp | date:'short' }}</small>
                  </div>
                </div>
                <div *ngIf="realtimeActivities.length === 0" class="text-muted text-center">
                  No real-time activities yet. Try adding, updating, or deleting tasks!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .nav-pills .nav-link.active {
      background-color: #0d6efd;
    }
    .btn-group-sm .btn {
      font-size: 0.75rem;
    }
  `]
})
export class TaskDemoComponent implements OnInit, OnDestroy {
  activeTab = 'list';
  tasks: (Task & { editing?: boolean; editName?: string; editQuantity?: number; editPrice?: number })[] = [];
  displayTasks: (Task & { editing?: boolean; editName?: string; editQuantity?: number; editPrice?: number })[] = [];
  searchTerm = '';
  newTask = { name: '', quantity: 1, price: 0 };
  realtimeActivities: Array<{type: string, message: string, timestamp: Date}> = [];
  
  private subscriptions: Subscription[] = [];

  constructor(private taskService: TaskGraphqlService) {}

  ngOnInit() {
    this.loadTasks();
    this.setupSubscriptions();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadTasks() {
    const sub = this.taskService.getAllTasks().subscribe(tasks => {
      this.tasks = tasks.map(task => ({ ...task, editing: false }));
      this.filterTasks();
    });
    this.subscriptions.push(sub);
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      const sub = this.taskService.searchTasks({ name: this.searchTerm }).subscribe(tasks => {
        this.displayTasks = tasks.map(task => ({ ...task, editing: false }));
      });
      this.subscriptions.push(sub);
    } else {
      this.filterTasks();
    }
  }

  filterTasks() {
    this.displayTasks = this.tasks;
  }

  createTask() {
    if (this.newTask.name && this.newTask.quantity > 0 && this.newTask.price > 0) {
      const sub = this.taskService.createTask(
        this.newTask.name, 
        this.newTask.quantity, 
        this.newTask.price
      ).subscribe(() => {
        this.newTask = { name: '', quantity: 1, price: 0 };
        this.loadTasks(); // Refresh the list
      });
      this.subscriptions.push(sub);
    }
  }

  startEdit(task: any) {
    task.editing = true;
    task.editName = task.name;
    task.editQuantity = task.quantity;
    task.editPrice = task.price;
  }

  saveEdit(task: any) {
    const sub = this.taskService.updateTask(
      task.id, 
      task.editName, 
      task.editQuantity, 
      task.editPrice
    ).subscribe(() => {
      task.editing = false;
      this.loadTasks(); // Refresh the list
    });
    this.subscriptions.push(sub);
  }

  cancelEdit(task: any) {
    task.editing = false;
    delete task.editName;
    delete task.editQuantity;
    delete task.editPrice;
  }

  deleteTask(id: string) {
    if (confirm('Are you sure you want to delete this task?')) {
      const sub = this.taskService.deleteTask(id).subscribe(() => {
        this.loadTasks(); // Refresh the list
      });
      this.subscriptions.push(sub);
    }
  }

  setupSubscriptions() {
    // Subscribe to task additions (simulated real-time)
    const addedSub = this.taskService.onTaskAdded().subscribe(task => {
      this.addRealtimeActivity('added', `New task "${task.name}" was created`);
    });

    // Subscribe to task updates (simulated real-time)
    const updatedSub = this.taskService.onTaskUpdated().subscribe(task => {
      this.addRealtimeActivity('updated', `Task "${task.name}" was updated`);
    });

    // Subscribe to task deletions (simulated real-time)
    const deletedSub = this.taskService.onTaskDeleted().subscribe(task => {
      this.addRealtimeActivity('deleted', `Task "${task.name}" was deleted`);
    });

    this.subscriptions.push(addedSub, updatedSub, deletedSub);
  }

  private addRealtimeActivity(type: string, message: string) {
    this.realtimeActivities.unshift({
      type,
      message,
      timestamp: new Date()
    });
    
    // Keep only last 20 activities
    if (this.realtimeActivities.length > 20) {
      this.realtimeActivities = this.realtimeActivities.slice(0, 20);
    }
  }

  getActivityAlertClass(type: string): string {
    switch(type) {
      case 'added': return 'alert-success';
      case 'updated': return 'alert-warning';
      case 'deleted': return 'alert-danger';
      default: return 'alert-info';
    }
  }
}