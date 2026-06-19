import { gql } from 'graphql-request';

export const queryGetUsers = gql`
  query {
    allUsers {
      nodes {
        id
        employeeId
        firstName
        lastName
        gender
        dateOfBirth
        phone
        email
        address
        level
        role
        department
        startDate
        status
      }
    }
  }
`;

export const queryGetUserById = gql`
  query ($id: Int!) {
    userById(id: $id) {
      id
      employeeId
      firstName
      lastName
      gender
      dateOfBirth
      phone
      email
      address
      level
      role
      department
      startDate
      status
    }
  }
`;
