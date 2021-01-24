export const enum ErrorKeys {
  UserDoesNotExist = 'User does not exist',
  UserInactive = 'User is inactive',
  TokenRevoked = 'Token is revoked',
  TempPasswordLoginDisallowed = 'Login not allowed using temporary password. Please reset password.',
  CategoryAlreadyExists = 'Category already exists !',
  IncorrectStoreDetails = 'Store details are not correct !',
  InvalidPhone = 'Phone number invalid.',
  RoleInfoMissing = 'Role information is missing.',
  IncorrectStoreInfo = 'Store information is not correct!',
  ErrorInHashingPassword = 'Error while hashing password',
  SamePasswordError = 'Password cannot be same as previous password!',
}
