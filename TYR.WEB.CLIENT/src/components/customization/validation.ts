const validateOrganizationInfo = (organizationInfo: any) => {
  // eslint-disable-next-line
  if (!organizationInfo.organizationName) {
    return { validateStatus: 'error', message: 'Please enter organization info' };
  }
  // eslint-disable-next-line
  if (organizationInfo.organizationName.split('').length > 15) {
    return { validateStatus: 'error', message: 'Should be less than 15 characters' };
  // eslint-disable-next-line
  } 
  // eslint-disable-next-line
  else {
    return { validateStatus: 'success' };
  }
  // eslint-disable-next-line
}

const vaccineInventoryValidate = (vaccineInInventoryForm: any) => {
  const error = [];
  if (!vaccineInInventoryForm.kind) {
    error.push('Vaccine Kind is required');
  } else if (vaccineInInventoryForm.kind.split('').length > 15) {
    error.push('Should be less than 15 characters');
  } else {
    error.push('');
  }

  if (!vaccineInInventoryForm.animalTypeId) {
    error.push('Animal Type is required');
  } else {
    error.push('');
  }
  return error;
};

const addUserValidate = (userForm: any) => {
  const error = [];
  if (!userForm.firstName) {
    error.push('First name is required');
  } else if (userForm.firstName.split('').length > 15) {
    error.push('Should be less than 15 characters');
  } else {
    error.push('');
  }

  if (!userForm.lastName) {
    error.push('Last name is required');
  } else if (userForm.lastName.split('').length > 15) {
    error.push('Should be less than 15 characters');
  } else {
    error.push('');
  }

  if (!userForm.email) {
    error.push('Last name is required');
  } else if (userForm.email.split('').length > 15) {
    error.push('Invalid Email');
  } else {
    error.push('');
  }

  if (!userForm.role) {
    error.push('Role is required');
  } else {
    error.push('');
  }
  return error;
};

export { validateOrganizationInfo, vaccineInventoryValidate, addUserValidate };
