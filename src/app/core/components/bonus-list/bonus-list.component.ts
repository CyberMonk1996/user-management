import { Component, Input, OnChanges, OnInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserStore } from '../../../store/user.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BonusCardComponent } from '../bonus-card/bonus-card.component';
import { UsersState } from '../../models/general-types';
import { getState } from '@ngrx/signals';
import { User } from '../../models/user';

@Component({
  selector: 'bonus-list',
  standalone: true,
  imports: [CommonModule, BonusCardComponent, MatProgressSpinnerModule],
  templateUrl: './bonus-list.component.html',
  styleUrl: './bonus-list.component.scss',
})
export class BonusListComponent implements OnInit {
  store = inject(UserStore);
  @Input({required: true}) currentUser!: Partial<User>;

  ngOnInit() {  
    this.store.loadBonuses(this.currentUser.idNumber as number);
  }
}
