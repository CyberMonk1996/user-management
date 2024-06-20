import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from './core/components/sidenav/sidenav.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { UserStore } from './store/user.store';
import { getState } from '@ngrx/signals';
import { UsersState } from './core/models/general-types';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatSidenavModule, SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  store = inject(UserStore);

  constructor(
    private snackBar: MatSnackBar
  ) {
    effect(() => {
      const state: UsersState = getState(this.store);
      if (state.error) {
        this.snackBar.open(state.error);
      }
    })
  }
}
