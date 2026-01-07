import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { EditTaskComponent } from './edit-task/edit-task.component';
import { TaskRealtimeComponent } from './components/task-realtime.component';
import { TaskDemoComponent } from './components/task-demo.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'add', component:AddTaskComponent},
  {path: 'edit/:id', component:EditTaskComponent},
  {path: 'realtime', component: TaskRealtimeComponent},
  {path: 'demo', component: TaskDemoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskRoutingModule { }
