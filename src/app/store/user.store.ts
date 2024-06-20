import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { PaginationParams, SortParams, UsersState } from "../core/models/general-types";
import { inject } from "@angular/core";
import { User } from "../core/models/user";
import { catchError, delay, map, of, pipe, switchMap, tap } from "rxjs";
import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { Utils } from "../core/utils/utility.methods";
import { environment } from "../../environments/environment";
import { ApiEnum } from "../core/const/api.enums";
import { Bonus } from "../core/models/bonus";



const initialUsersState: UsersState = {
    users: [],
    currentUser: {},
    userQuantity: null,
    currentUserBonuses: [],
    filter: '',
    loading: false,
    error: undefined,
}

export const UserStore = signalStore(
    { providedIn: 'root' },
    withState(initialUsersState),

    withMethods((
        store, 
        http = inject(HttpClient)
    ) => ({
        loadUsers: rxMethod<PaginationParams>(
            pipe(
                switchMap((params) =>
                    http.get<User[]>(`${environment.baseUrl_api}/${ApiEnum.USERS}?_page=${params.page}&_limit=${params.size}`, {observe: 'response'})
                ),
                tap(res => console.log(res.body)),
                catchError((err) => {
                    return of(err);
                }),
                tap((response: HttpResponse<User[]> | HttpErrorResponse) => {
                    response instanceof HttpErrorResponse
                        ? patchState(store, { error: `Status Code${Utils.trimErrorString(response.message)}` })
                        : patchState(store, { 
                            users: response.body!, 
                            userQuantity: Number(response.headers.get('X-Total-Count')), 
                            loading: false 
                    });
                })
            )
        ),

        sortUsers: rxMethod<SortParams>(
            pipe(
                switchMap((sortParams) => {
                    console.log(sortParams)
                    return http.get<User[]>(
                        `${environment.baseUrl_api}/${ApiEnum.USERS}?_sort=${sortParams.orderAsc ? '' : '-'}${sortParams.property}`
                    )

                }
                ),
                catchError((err) => {
                    return of(err);
                }),
                tap((response: User[] | HttpErrorResponse) => {
                    response instanceof HttpErrorResponse
                        ? patchState(store, { error: `Status Code${Utils.trimErrorString(response.message)}` })
                        : patchState(store, { 
                            users: response, 
                            loading: false 
                        });
                })
            )
        ),
        filterUsers: rxMethod<string>(
            pipe(
                switchMap((string) => {
                    console.log(string);
                    return http.get<User[]>(
                        `${environment.baseUrl_api}/${ApiEnum.USERS}${string}`
                    )
                }
                ),
                catchError((err) => {
                    return of(err);
                }),
                tap((response: User[] | HttpErrorResponse) => {
                    response instanceof HttpErrorResponse
                        ? patchState(store, { error: `Status Code${Utils.trimErrorString(response.message)}` })
                        : patchState(store, { 
                            users: response, 
                            loading: false 
                        });
                })
            )
        ),
        removeUser: rxMethod<string>(
            pipe(
                switchMap((userId: string) => http.delete<void>(
                    `${environment.baseUrl_api}/${ApiEnum.USERS}/${userId}`
                ).pipe(
                    map(result => ({ userId, result }))
                )),
                
                tap(({ userId }) => {
                    const updatedUsers = store.users().filter(user => user.id !== userId);
                    patchState(store, { users: updatedUsers });
                })
            )
        ),

        removeBonus: rxMethod<string>(
            pipe(
                switchMap((bonusNumber: string) => http.delete<void>(
                    `${environment.baseUrl_api}/${ApiEnum.USERS}/${bonusNumber}`
                ).pipe(
                    map(result => ({ bonusNumber, result }))
                )),
                
                tap(({ bonusNumber }) => {
                    const updatedUsers = store.currentUserBonuses().filter(bonus => bonus.number !== bonusNumber);
                    patchState(store, { currentUserBonuses: updatedUsers });
                })
            )
        ),

        getUser: rxMethod<string>(
            pipe(
                switchMap((userId: string) => http.get<User>(
                    `${environment.baseUrl_api}/${ApiEnum.USERS}/${userId}`
                )),
                catchError((err) => {
                    return of(err);
                  }),
                  tap((response: User | HttpErrorResponse) => {
                    if (response instanceof HttpErrorResponse) {
                      patchState(store, { error: `Status Code${Utils.trimErrorString(response.message)}` });
                    } else {
                      patchState(store, { currentUser: response });
                    }
                })
            )
        ),

        loadBonuses: rxMethod<number>(
            pipe(
              switchMap((userId: number) => {
                patchState(store, { loading: true });
                return http
                  .get<Bonus[]>(`${environment.baseUrl_api}/${ApiEnum.BONUSES}`)
                  .pipe(
                    map((response) => ({
                      userId,
                      filteredBonuses: response.filter(bonus => bonus.userNumber === userId)
                    }))
                  );
              }),
          
              tap(({ filteredBonuses }) => {
                patchState(store, { currentUserBonuses: filteredBonuses, loading: false });
              })
            )
          ),

        updateUser: rxMethod<Partial<User>>(
            pipe(
                switchMap((user: Partial<User>) => http.patch<User>(
                    `${environment.baseUrl_api}/${ApiEnum.USERS}/${store.currentUser().id}`, user
                )),
                catchError((err) => {
                    return of(err);
                }),
                tap((response: User | HttpErrorResponse) => {
                if (response instanceof HttpErrorResponse) {
                    const error = `Status Code${Utils.trimErrorString(response.message)}`;
                    patchState(store, { error: error });
                } else {
                    patchState(store, { currentUser: response as User });
                }
                })
            )
        ),

        addUser: rxMethod<Partial<User>>(
            pipe(
                switchMap((user: Partial<User>) => http.post<User>(
                    `${environment.baseUrl_api}/${ApiEnum.USERS}`, user
                )),
                catchError((err) => {
                    return of(err);
                }),
                tap((response: User | HttpErrorResponse) => {
                if (response instanceof HttpErrorResponse) {
                    const error = `Status Code${Utils.trimErrorString(response.message)}`;
                    patchState(store, { error: error });
                } else {
                    patchState(store, { currentUser: response as User });
                }
                })
            )
        ),
        removeCurrentUser: () => {
            patchState(store, { currentUser: {} as User, error: undefined })
        }
    })),
)