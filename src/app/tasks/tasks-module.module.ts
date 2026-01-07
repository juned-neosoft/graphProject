import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTaskComponent } from './add-task/add-task.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home/home.component';
import { RouterModule } from '@angular/router';
import { TaskRoutingModule } from './tasks-routing.module';
import { TaskRealtimeComponent } from './components/task-realtime.component';
import { TaskDemoComponent } from './components/task-demo.component';


@NgModule({
  declarations: [
    AddTaskComponent,
    EditTaskComponent,
    HomeComponent,
    TaskRealtimeComponent,
    TaskDemoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TaskRoutingModule
  ]
})
export class TasksModuleModule { }
