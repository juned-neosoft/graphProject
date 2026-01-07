import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { TaskGraphqlService, Task } from '../services/task-graphql.service';

@Component({
    selector: 'app-task-realtime',
    template: `
    <div class="container mt-4">
      <h2>Real-time Task Updates</h2>
      
      <!-- Task List -->
      <div class="row">
        <div class="col-md-8">
          <h4>Tasks</h4>
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
                <tr *ngFor="let task of tasks">
                  <td>{{ task.id }}</td>
                  <td>{{ task.name }}</td>
                  <td>{{ task.quantity }}</td>
                  <td>\${{ task.price }}</td>
                  <td>
                    <button class="btn btn-sm btn-danger" (click)="deleteTask(task.id)">
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Add Task Form -->
        <div class="col-md-4">
          <h4>Add New Task</h4>
          <form (ngSubmit)="addTask()" #taskForm="ngForm">
            <div class="mb-3">
              <label class="form-label">Name</label>
              <input type="text" class="form-control" [(ngModel)]="newTask.name" name="name" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Quantity</label>
              <input type="number" class="form-control" [(ngModel)]="newTask.quantity" name="quantity" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Price</label>
              <input type="number" class="form-control" [(ngModel)]="newTask.price" name="price" required>
            </div>
            <button type="submit" class="btn btn-primary" [disabled]="!taskForm.valid">
              Add Task
            </button>
          </form>
        </div>
      </div>
      
      <!-- Real-time Activity Log -->
      <div class="row mt-4">
        <div class="col-12">
          <h4>Real-time Activity</h4>
          <div class="alert alert-info" style="max-height: 200px; overflow-y: auto;">
            <div *ngFor="let activity of activityLog" class="mb-1">
              <small class="text-muted">{{ activity.timestamp | date:'short' }}</small>
              <span [ngClass]="getActivityClass(activity.type)">{{ activity.message }}</span>
            </div>
            <div *ngIf="activityLog.length === 0" class="text-muted">
              No activity yet. Try adding, updating, or deleting tasks to see real-time updates!
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .activity-added { color: #28a745; }
    .activity-updated { color: #ffc107; }
    .activity-deleted { color: #dc3545; }
  `]
})
export class TaskRealtimeComponent implements OnInit, OnDestroy {
    tasks: Task[] = [];
    newTask = { name: '', quantity: 0, price: 0 };
    activityLog: Array<{ type: string, message: string, timestamp: Date }> = [];

    private subscriptions: Subscription[] = [];

    constructor(private taskService: TaskGraphqlService) { }

    ngOnInit() {
        this.loadTasks();
        this.setupSubscriptions();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    loadTasks() {
        const sub = this.taskService.getAllTasks().subscribe(tasks => {
            this.tasks = tasks;
        });
        this.subscriptions.push(sub);
    }

    setupSubscriptions() {
        // Subscribe to task additions
        const addedSub = this.taskService.onTaskAdded().subscribe(task => {
            this.addActivityLog('added', `Task "${task.name}" was added`);
            // Task will be automatically updated via the getAllTasks query refetch
        });

        // Subscribe to task updates
        const updatedSub = this.taskService.onTaskUpdated().subscribe(task => {
            this.addActivityLog('updated', `Task "${task.name}" was updated`);
        });

        // Subscribe to task deletions
        const deletedSub = this.taskService.onTaskDeleted().subscribe(task => {
            this.addActivityLog('deleted', `Task "${task.name}" was deleted`);
        });

        this.subscriptions.push(addedSub, updatedSub, deletedSub);
    }

    addTask() {
        if (this.newTask.name && this.newTask.quantity > 0 && this.newTask.price > 0) {
            const sub = this.taskService.createTask(
                this.newTask.name,
                this.newTask.quantity,
                this.newTask.price
            ).subscribe(() => {
                this.newTask = { name: '', quantity: 0, price: 0 };
            });
            this.subscriptions.push(sub);
        }
    }

    deleteTask(id: string) {
        const sub = this.taskService.deleteTask(id).subscribe();
        this.subscriptions.push(sub);
    }

    private addActivityLog(type: string, message: string) {
        this.activityLog.unshift({
            type,
            message,
            timestamp: new Date()
        });

        // Keep only last 10 activities
        if (this.activityLog.length > 10) {
            this.activityLog = this.activityLog.slice(0, 10);
        }
    }

    getActivityClass(type: string): string {
        return `activity-${type}`;
    }
}