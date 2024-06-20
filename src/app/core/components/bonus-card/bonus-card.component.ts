import { Component, Input, inject } from '@angular/core';
import { Bonus } from '../../models/bonus';
import { MatIcon } from '@angular/material/icon';
import { UserStore } from '../../../store/user.store';

@Component({
  selector: 'bonus-card',
  standalone: true,
  imports: [ MatIcon ],
  templateUrl: './bonus-card.component.html',
  styleUrl: './bonus-card.component.scss',
})
export class BonusCardComponent {
  @Input() bonus!: Bonus ;
  store = inject(UserStore);
  moneySVGsource = '../../../../assets/svgs/money.svg';
  freeBetSVGsource = '../../../../assets/svgs/bet.svg';
  freeSpinSVGsource = '../../../../assets/svgs/spin.svg';
  dollarSVGsource = '../../../../assets/svgs/flag-us-svgrepo-com.svg';
  lariSVGsource = '../../../../assets/svgs/flag-for-flag-georgia-svgrepo-com.svg';

  onRemoveUser() {
    console.log(this.bonus);
    this.store.removeBonus(this.bonus.number);
  }
}
