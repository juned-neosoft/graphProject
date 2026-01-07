# GraphQL CRUD with Enhanced Services

This project now includes comprehensive GraphQL support with **Queries**, **Mutations**, and **Simulated Real-time Updates**.

## 🚀 Features Added

### 1. **GraphQL Server Enhancements**
- ✅ Enhanced GraphQL schema with subscription types
- ✅ Real-time event publishing (task added/updated/deleted)
- ✅ PubSub system for managing subscriptions
- ✅ WebSocket support ready for future implementation

### 2. **Angular Client Enhancements**
- ✅ Comprehensive GraphQL service with all CRUD operations
- ✅ Simulated real-time updates using RxJS Subjects
- ✅ Demo components showcasing all features
- ✅ Type-safe interfaces and error handling

### 3. **GraphQL Operations**

#### **Queries**
```graphql
# Get all tasks
query {
  alltasks {
    id
    name
    price
    quantity
  }
}

# Search tasks by name
query($TaskFilter: TaskFilter) {
  alltasks(filter: $TaskFilter) {
    id
    name
    price
    quantity
  }
}
```

#### **Mutations**
```graphql
# Create task
mutation($name: String!, $quantity: Int!, $price: Int!) {
  createtask(name: $name, quantity: $quantity, price: $price) {
    id
    name
    quantity
    price
  }
}

# Update task
mutation($id: ID!, $name: String!, $quantity: Int!, $price: Int!) {
  updatetask(id: $id, name: $name, quantity: $quantity, price: $price) {
    id
    name
    quantity
    price
  }
}

# Delete task
mutation($id: ID!) {
  removetask(id: $id) {
    id
  }
}
```

#### **Subscriptions** 🔥
```graphql
# Listen for new tasks
subscription {
  taskAdded {
    id
    name
    price
    quantity
  }
}

# Listen for task updates
subscription {
  taskUpdated {
    id
    name
    price
    quantity
  }
}

# Listen for task deletions
subscription {
  taskDeleted {
    id
    name
    price
    quantity
  }
}
```

## 🛠️ Setup Instructions

### 1. Install Dependencies
```bash
npm install graphql-subscriptions subscriptions-transport-ws --legacy-peer-deps
```

### 2. Start the GraphQL Server
```bash
node graphQLServer/server.js
```
The server will run on:
- HTTP: `http://localhost:3000/graphql`
- WebSocket: `ws://localhost:3000/graphql`

### 3. Start the Angular App
```bash
npm start
```

## 📱 Available Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/tasks` | HomeComponent | Original task list |
| `/tasks/add` | AddTaskComponent | Add new task |
| `/tasks/edit/:id` | EditTaskComponent | Edit existing task |
| `/tasks/realtime` | TaskRealtimeComponent | Simple real-time demo |
| `/tasks/demo` | TaskDemoComponent | **Full-featured demo** |

## 🎯 Key Components

### TaskGraphqlService
Comprehensive service providing:
- **Queries**: `getAllTasks()`, `searchTasks()`
- **Mutations**: `createTask()`, `updateTask()`, `deleteTask()`
- **Subscriptions**: `onTaskAdded()`, `onTaskUpdated()`, `onTaskDeleted()`

### TaskDemoComponent
Full-featured demo showing:
- ✅ CRUD operations
- ✅ Real-time updates
- ✅ Search functionality
- ✅ Inline editing
- ✅ Live activity feed

### TaskRealtimeComponent
Simple real-time demo with:
- ✅ Live task list
- ✅ Add task form
- ✅ Real-time activity log

## 🔧 Usage Examples

### Using the GraphQL Service

```typescript
import { TaskGraphqlService } from './services/task-graphql.service';

constructor(private taskService: TaskGraphqlService) {}

// Query all tasks
this.taskService.getAllTasks().subscribe(tasks => {
  console.log('All tasks:', tasks);
});

// Create a task
this.taskService.createTask('New Task', 5, 29.99).subscribe(task => {
  console.log('Created task:', task);
});

// Listen for real-time updates
this.taskService.onTaskAdded().subscribe(task => {
  console.log('New task added:', task);
});
```

### Testing Subscriptions

1. Open multiple browser tabs with the demo component
2. Add/edit/delete tasks in one tab
3. Watch real-time updates in other tabs
4. Check the activity feed for live notifications

## 🌐 GraphiQL Interface

Visit `http://localhost:3000/graphql` to use the GraphiQL interface for testing queries, mutations, and subscriptions.

## 📁 File Structure

```
src/app/tasks/
├── gql/
│   ├── tasks-query.ts          # GraphQL queries
│   ├── tasks-mutation.ts       # GraphQL mutations
│   └── tasks-subscription.ts   # GraphQL subscriptions
├── services/
│   └── task-graphql.service.ts # Comprehensive GraphQL service
├── components/
│   ├── task-demo.component.ts      # Full-featured demo
│   └── task-realtime.component.ts  # Simple real-time demo
└── ...
```

## 🎉 What's New

1. **Real-time Updates**: Tasks update instantly across all connected clients
2. **WebSocket Support**: Efficient real-time communication
3. **Comprehensive Service**: Single service for all GraphQL operations
4. **Demo Components**: Ready-to-use examples
5. **Type Safety**: Full TypeScript support

## 🚀 Next Steps

- Open `/tasks/demo` to see the full-featured implementation
- Try the real-time features by opening multiple browser tabs
- Explore the GraphQL service for your own components
- Test subscriptions using the GraphiQL interface

Happy coding! 🎯