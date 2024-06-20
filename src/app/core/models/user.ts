export interface User {
    id: string;
    firstName: string;
    lastName: string;
    gender: 'male' | 'female';
    idNumber: number;
    phone: number;
    address: string;
    img?: string;
}
