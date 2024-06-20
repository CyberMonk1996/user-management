import { Component, inject } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppUrlEnum } from '../../const/route.enums';
import { FilterComponent } from '../filter/filter.component';
import { MatButtonModule } from '@angular/material/button';
import { Subject, filter, map, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'sidenav',
  standalone: true,
  imports: [MatDividerModule, MatListModule, FilterComponent, MatButtonModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
  router = inject(Router);
  destroy$: Subject<void> = new Subject();
  AppUrlEnum = AppUrlEnum;
  showFilter = false;
  filterShouldBeDisplayed = false;

  ngOnInit() {
    // Show Filter button only should be displayed on user list page
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$),
    ).subscribe(event => {
      if(event instanceof NavigationEnd) {
        this.filterShouldBeDisplayed = event.url.includes('list');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }


}
