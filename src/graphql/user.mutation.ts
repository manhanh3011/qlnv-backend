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

export const mutationDeleteUser = gql`
  mutation DeleteUser($id: Int!) {
    deleteUserById(input: { id: $id }) {
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

export const mutationCreateUsersImportRaw = gql`
  mutation CreateUsersImportRaw($input: CreateUsersImportRawInput!) {
    createUsersImportRaw(input: $input) {
      usersImportRaw {
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
        isScanned
        isValid
        errorMessage
        processedAt
      }
    }
  }
`;

export const mutationUpdateUsersImportRaw = gql`
  mutation UpdateUsersImportRaw($id: Int!, $patch: UsersImportRawPatch!) {
    updateUsersImportRawById(
      input: {
        id: $id
        usersImportRawPatch: $patch
      }
    ) {
      usersImportRaw {
        id
        isScanned
        isValid
        errorMessage
        processedAt
      }
    }
  }
`;
