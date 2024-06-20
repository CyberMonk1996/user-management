import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../core/models/user';

import { MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIcon} from '@angular/material/icon'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { UserStore } from '../../store/user.store';
import { Router } from '@angular/router';
import { AppUrlEnum } from '../../core/const/route.enums';
import { defaultImageUrl } from '../../core/const/default-links';


@Component({
  standalone: true,
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  imports: [CommonModule, MatProgressSpinnerModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIcon]
})
export class UserListComponent implements OnInit {
  @Input({required: true}) users: User[] = [];
  store = inject(UserStore); 
  router = inject(Router);
  displayedColumns: string[] = ['image', 'firstName', 'lastName', 'gender', 'idNumber', 'phone', 'address', 'delete'];
  isLoadingResults = true;
  resultsLength = 20;

  AppUrlEnum = AppUrlEnum;
  previousSortColumn: string = '';
  sortDirectionCounter: number = 0;
  pageSize = 5;
  pageIndex = 0;

  defaultImgUrl = defaultImageUrl;

  constructor() { }

  ngOnInit() {
    this.store.loadUsers({
      page: this.pageIndex,
      size: this.pageSize
    });
    this.isLoadingResults = this.store.loading();
    this.resultsLength = this.store.users().length;
  }

  onRemoveUser(id: string, event: Event) {
    event.stopImmediatePropagation();
    this.store.removeUser(id);
  }

  openUser(userId: string) {
    this.store.getUser(userId);
    this.router.navigate([`${AppUrlEnum.USER}/${userId}`])
  }

  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    console.log(event);
    this.store.loadUsers({
      page: event.pageIndex + 1,
      size: event.pageSize,
    });
  }

  sort(columnName: any) {
    // If user clicks on different column, restart count
    if(this.previousSortColumn !== '' && this.previousSortColumn !== columnName){
      this.sortDirectionCounter = 0;
    };

    this.store.sortUsers({
      property: columnName,
      orderAsc: this.sortDirectionCounter % 2 === 0,
    });

    this.sortDirectionCounter = this.sortDirectionCounter + 1; // Increment count
    this.previousSortColumn = columnName;
    localStorage.setItem('sort', JSON.stringify({
      sortDirectionCounter: this.sortDirectionCounter,
      sortColumn: columnName,
    }))
  }

}
