const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');
const fs = require('fs'); // create files/updations/read/write
const path = require('path'); // tells folder path

// Path to your JSON file
const tasksFilePath = path.join(__dirname, 'db.json');
const app = express();
app.use(cors()); // This will allow all origins by default


// Helper function to generate unique IDs
// const generateId = (tasks) => String(tasks.length + 1);

const generateId = (tasks) => {
  if (tasks.length === 0) {
    return "1"; // Start with ID 1 if the tasks array is empty
  }
  const maxId = Math.max(...tasks.map((task) => Number(task.id)));
  return String(maxId + 1); // Generate the next unique ID
};


// GraphQL Schema
const schema = buildSchema(`
  type Task {
    id: ID
    name: String
    price: Int
    quantity: Int
  }

  input TaskFilter {
    name: String
  }

  type Query {
    alltasks(filter: TaskFilter): [Task]
  }

  type Mutation {
    createtask(name: String!, quantity: Int!, price: Int!): Task
    updatetask(id: ID!, name: String!, quantity: Int!, price: Int!): Task
    removetask(id: ID!): Task
  }
`);

// Helper function to read tasks from the JSON file
const readTasksFromFile = () => {
  try {
    // Check if the tasks file exists
    if (!fs.existsSync(tasksFilePath)) {
      // If the file doesn't exist, create it with an empty array
      fs.writeFileSync(tasksFilePath, JSON.stringify([]));
    }
    // Read and return tasks from the file
    const data = fs.readFileSync(tasksFilePath);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tasks from file:', error);
    return [];
  }
};

// Helper function to write tasks to the JSON file
const writeTasksToFile = (tasks) => {
  try {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Error writing tasks to file:', error);
  }
};

// Resolvers
const root = {
  alltasks: ({ filter }) => {
    const tasks = readTasksFromFile();
    if (filter && filter.name) {
      return tasks.filter(task => task.name.toLowerCase().includes(filter.name.toLowerCase()));
    }
    return tasks;
  },
  createtask: ({ name, quantity, price }) => {
    const tasks = readTasksFromFile();
    const newTask = { id: generateId(tasks), name, quantity, price };
    tasks.push(newTask);
    writeTasksToFile(tasks); // Write the updated tasks to the JSON file
    return newTask;
  },
  updatetask: ({ id, name, quantity, price }) => {
    const tasks = readTasksFromFile();
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) throw new Error("Task not found");
    tasks[taskIndex] = { id, name, quantity, price };
    writeTasksToFile(tasks); // Write the updated tasks to the JSON file
    return tasks[taskIndex];
  },
  removetask: ({ id }) => {
    const tasks = readTasksFromFile();
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) throw new Error("Task not found");
    const removedTask = tasks[taskIndex];
    tasks.splice(taskIndex, 1);
    writeTasksToFile(tasks); // Write the updated tasks to the JSON file
    return removedTask;
  },
};

app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enables the GraphiQL UI to test queries/mutations
  })
);

app.listen(3000, () => {
});
