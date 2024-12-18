import { gql } from "apollo-angular";

export const GET_tasks = gql`
query{
  alltasks{
    id,
    price,
    name,
    quantity
  }
}
`
export const GET_Search = gql`
query($TaskFilter:TaskFilter){
  alltasks(filter:$TaskFilter){
    id
    name
    price
    quantity
  }
}
`


