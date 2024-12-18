import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTaskComponent } from './add-task/add-task.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home/home.component';
import { RouterModule } from '@angular/router';
import { TaskRoutingModule } from './tasks-routing.module';


@NgModule({
  declarations: [
    AddTaskComponent,
    EditTaskComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TaskRoutingModule
  ]
})
export class TasksModuleModule { }
