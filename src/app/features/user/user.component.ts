import { CommonModule } from '@angular/common';
import { Component, effect, inject, } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask, } from 'ngx-mask';
import { UserStore } from '../../store/user.store';
import { ActivatedRoute } from '@angular/router';
import { getState } from '@ngrx/signals';
import { UsersState } from '../../core/models/general-types';
import { User } from '../../core/models/user';
import { Subject, map, takeUntil } from 'rxjs';
import { defaultImageUrl } from '../../core/const/default-links';
import { BonusListComponent } from '../../core/components/bonus-list/bonus-list.component';

@Component({
  selector: 'user',
  standalone: true,
  imports: [ 
    CommonModule, ReactiveFormsModule, MatFormFieldModule, 
    MatInputModule, MatIconModule, MatSelectModule, MatButton,
    NgxMaskDirective, NgxMaskPipe, BonusListComponent,
  ],
  providers: [provideNgxMask()],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export default class UserComponent {
  store = inject(UserStore);
  route = inject(ActivatedRoute);
  destroy$: Subject<void> = new Subject();
  userForm!: FormGroup;
  showFooterButtons: boolean = true;

  defaultImgUrl = defaultImageUrl;


  constructor(private fb: FormBuilder) { 
    effect(() => {
      const state: UsersState = getState(this.store);
      if(Object.keys(state.currentUser).length) {
        this.patchUserData(state.currentUser);
      };
    })
  }

  ngOnInit(): void {
    this.buildForm();
    this.retrieveRouteParams();
  }

  retrieveRouteParams() {
    this.route.params.pipe(
      takeUntil(this.destroy$),
      map((p) => p['id'])
    )
      .subscribe(userId => {
        //if 'id' is present, it means that we are checking existing user's account
        userId 
          ? this.store.getUser(userId)
          : this.userAddingMode();
      });
  }
  userAddingMode() {
    this.store.removeCurrentUser();
    this.userForm.reset();
    this.userForm.enable();
    this.showFooterButtons = true;
  }

  buildForm() {
    this.userForm = this.fb.group({
      firstName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      gender: [null, Validators.required],
      idNumber: [null, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      phone: [null, [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      address: [null, Validators.required],
      img: [null]
    });
  }

  onSubmit(value: Partial<User>) {
    // If current user is present, then we Modify 
    if(Object.keys(this.store.currentUser()).length) {
      this.store.updateUser(value);
    } else { // If not, we add an User
      this.store.addUser(value);
    }

    this.cancelModification();
  }


  cancelModification() {
    this.showFooterButtons = false;
    this.userForm.disable();
  }

  patchUserData(currentUser: Partial<User>) {
    Object.entries(currentUser).forEach(([key, value]) => 
      this.userForm.get(key)?.patchValue(value)
    )
    this.userForm.disable();
    this.showFooterButtons = false;
  }


  imageInputChange(event: Event) {
    const fileList: FileList = (event.target as HTMLInputElement).files!;
    if (fileList.length > 0) {
      const file: File = fileList[0];

      // Here we read File Data in Base 64 encoding
      const reader = new FileReader();
      reader.onload = (e) => {
        // Patching the img control with the base64-encoded image data
        this.userForm.patchValue({
          img: e.target?.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  deleteImage() {
    this.userForm.get('img')?.patchValue(null);
  }

  modifyUser() {
    this.userForm.enable();
    this.showFooterButtons = true;
  }

  ngOnDestroy() {
    this.store.removeCurrentUser;
    this.destroy$.next();
  }

}

