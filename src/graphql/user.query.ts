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

export const queryGetUsersPaging = gql`
  query(
    $first: Int!
    $offset: Int!
  ){
    allUsers(
      first: $first
      offset: $offset
    ){
      totalCount
      nodes{
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

export const queryGetUsersImportRawPending = gql`
  query GetUsersImportRawPending($first: Int!) {
    allUsersImportRaws(
      first: $first
      condition: {
        isScanned: false
      }
      orderBy: ID_ASC
    ) {
      nodes {
        id
        employeeId
        firstName
        lastName
        email
        phone
        gender
        dateOfBirth
        address
        department
        role
        level
        startDate
        status
        isScanned
        isValid
        errorMessage
        processedAt
      }
    }
  }
`;

export const queryGetUsersImportRawHistory = gql`
  query GetUsersImportRawHistory(
    $first: Int!
    $offset: Int!
    $condition: UsersImportRawCondition
  ) {
    allUsersImportRaws(
      first: $first
      offset: $offset
      condition: $condition
      orderBy: ID_DESC
    ) {
      totalCount
      nodes {
        id
        employeeId
        firstName
        lastName
        email
        phone
        gender
        dateOfBirth
        address
        department
        role
        level
        startDate
        status
        isScanned
        isValid
        errorMessage
        processedAt
      }
    }

    validRows: allUsersImportRaws(condition: { isValid: true }) {
      totalCount
    }

    invalidRows: allUsersImportRaws(condition: { isValid: false }) {
      totalCount
    }

    pendingRows: allUsersImportRaws(
      condition: { isScanned: false }
    ) {
      totalCount
    }
  }
`;

export const queryFindUserByEmployeeId = gql`
  query FindUserByEmployeeId($employeeId: String!) {
    allUsers(first: 1, condition: { employeeId: $employeeId }) {
      nodes {
        id
        employeeId
      }
    }
  }
`; 

export const queryFindUserByEmail = gql`
  query FindUserByEmail($email: String!) {
    allUsers(first: 1, condition: { email: $email }) {
      nodes {
        id
        email
      }
    }
  }
`;
