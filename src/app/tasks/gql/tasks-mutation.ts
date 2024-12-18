import { gql } from "apollo-angular";


export const CREATE_task = gql`
mutation($name:String!, $quantity:Int!, $price: Int!){
  createtask(name:$name, quantity: $quantity, price: $price){
    id,
    name,
    quantity,
    price
  }
}
`
export const Update_task = gql`
mutation($id:ID!,$name:String!, $quantity:Int!, $price: Int!){
  updatetask(id:$id,name:$name, quantity: $quantity, price: $price){
    id,
    name,
    quantity,
    price
  }
}
`
export const Delete_task = gql`
mutation($id:ID!){
  removetask(id:$id){
    id
  }
}
`