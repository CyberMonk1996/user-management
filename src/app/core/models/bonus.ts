export type BonusType = 
    'Freespin' | 'Freebet' | 'Money';

export interface Bonus {
    number: string;
    userNumber: number;
    type: BonusType;
    bonusQuantity: number;
    currency?: 'GEL' | 'USD';
}