import { gql } from 'graphql-request';

export const mutationCreateUser = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        id
        employeeId
        firstName
        lastName
        phone
        email
        address
        gender
        dateOfBirth
        level
        role
        department
        startDate
        status
      }
    }
  }
`;

export const mutationUpdateUser = gql`
  mutation UpdateUser($id: Int!, $patch: UserPatch!) {
    updateUserById(input: { id: $id, userPatch: $patch }) {
      user {
        id
        employeeId
        firstName
        lastName
        phone
        email
        address
        gender
        dateOfBirth
        level
        role
        department
        startDate
        status
      }
    }
  }
`;
