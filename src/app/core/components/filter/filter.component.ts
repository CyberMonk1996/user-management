import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { filterOptionsConfig } from '../../const/filter-options';
import { Subject, takeUntil, tap } from 'rxjs';
import { FilterOption } from '../../models/general-types';
import { User } from '../../models/user';
import { UserStore } from '../../../store/user.store';

@Component({
  selector: 'filter',
  standalone: true,
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  imports: [
    CommonModule, ReactiveFormsModule, MatFormFieldModule, 
    MatInputModule, MatIconModule, MatSelectModule, MatButton,
    NgxMaskDirective,  NgxMaskPipe
  ],
  providers: [provideNgxMask()],
})
export class FilterComponent implements OnInit, OnDestroy {
  store = inject(UserStore);
  searchString = '';
  filterOptions = filterOptionsConfig;
  formConfigArray: FilterOption[] = [];
  optionsChosen = new FormControl([]);
  filterForm = new FormGroup({});
  destroy$: Subject<void> = new Subject();
  isFormFilled = false;
  filterExecuted = false;

  page = 0;
  pageSize = 5;

  ngOnInit() {
    this.listenToOptions();
    this.listenToFilterForm();
  }

  listenToFilterForm() {
    this.filterForm.valueChanges.pipe(
      takeUntil(this.destroy$),
      tap(res => {
        this.isFormFilled = Object.values(res).some((value) => !!value);
      }),
    ).subscribe();
  }

  listenToOptions() {
    this.optionsChosen.valueChanges.pipe(
      takeUntil(this.destroy$),
      tap(res => {
        if (res) this.addControlToFilterForm(res);
      })
    ).subscribe();
  }

  addControlToFilterForm(controlNames: string[]) {
    const newControlName = controlNames.filter(name => !Object.keys(this.filterForm.value).includes(name))[0];
    const controlConfig = this.filterOptions.find(option => option.value === newControlName);
    this.formConfigArray = this.filterOptions.filter(option => controlNames.includes(option.value));
    this.filterForm.addControl(newControlName, new FormControl(null, controlConfig?.validators));

  }

  onSubmit(filterValues: Partial<User>) {
    this.searchString = '?';
    const filterEntries = Object.entries(filterValues);
    // console.log(filterEntries)
    console.log(filterEntries.length)
    filterEntries.length < 0
    filterEntries.forEach((key, value, arr) => {
      if ( key[1] ) {
        this.searchString = this.searchString + `${key[0]}=${key[1]}${arr.length < filterEntries.length ? '$' : ''}`;
      }
    })
    this.store.filterUsers(this.searchString);
    this.filterExecuted = true;
  }

  showAllUsers() {
    this.store.loadUsers({
      page: this.page,
      size: this.pageSize,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }


}
