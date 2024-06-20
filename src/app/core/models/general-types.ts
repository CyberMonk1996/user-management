import { ValidatorFn } from "@angular/forms";
import { User } from "./user"
import { Bonus } from "./bonus";

export type UsersState = {
    users: User[];
    currentUser: Partial<User>;
    userQuantity: number | null;
    currentUserBonuses: Bonus[];
    filter: string;
    loading: boolean;
    error: string | undefined;
}

export interface SortParams {
    property: string;
    orderAsc: boolean;
}

export interface PaginationParams {
    page: number;
    size: number;
}

export interface FilterOption {
    label: string;
    value: string;
    placeholder?: string;        // Optional
    validators?: ValidatorFn[];  // Optional
    mask?: string;               // Optional
    minLength?: number;          // Optional
    maxLength?: number;          // Optional
}