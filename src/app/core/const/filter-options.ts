import { Validators } from "@angular/forms";

export const filterOptionsConfig = [
    {
      label: 'First Name',
      value: 'firstName',
      validators: [
        Validators.minLength(2), 
        Validators.maxLength(50)
      ],
      placeholder: 'Enter first name',
      mask: 'S*',
      minLength: 2,
      maxLength: 50,
    },
    {
      label: 'Last Name',
      value: 'lastName',
      placeholder: 'Enter last name',
      validators: [
        Validators.minLength(2), 
        Validators.maxLength(50)
      ], 
      mask: 'S*',
      minLength: 2,
      maxLength: 50,
    },
    {
      label: 'Gender',
      value: 'gender',
    },
    {
      label: 'Identification',
      value: 'idNumber',
      placeholder: 'Enter ID number',
      validators: [
        Validators.pattern('^[0-9]*$'), 
        Validators.minLength(11), Validators.maxLength(11)
      ],
      mask: "00000000000",      
      minLength: 11,
      maxLength: 11,
    },
    {
      label: 'Phone',
      value: 'phone',
      placeholder: 'Enter phone number',
      validators: [
        Validators.pattern('^[0-9]*$'), 
        Validators.minLength(9), Validators.maxLength(9)
      ],
      mask: "000000000",
      minLength: 9,
      maxLength: 9,
    },
    {
      label: 'Address',
      value: 'address',
      placeHolder: 'Enter address'
    },
  ]