import { gql } from "apollo-angular";

export const TASK_ADDED_SUBSCRIPTION = gql`
  subscription {
    taskAdded {
      id
      name
      price
      quantity
    }
  }
`;

export const TASK_UPDATED_SUBSCRIPTION = gql`
  subscription {
    taskUpdated {
      id
      name
      price
      quantity
    }
  }
`;

export const TASK_DELETED_SUBSCRIPTION = gql`
  subscription {
    taskDeleted {
      id
      name
      price
      quantity
    }
  }
`;