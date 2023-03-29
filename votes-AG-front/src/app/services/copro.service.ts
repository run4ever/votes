import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  Observable,
  of,
  switchMap,
  tap,
  take,
  first,
} from 'rxjs';
import { Coproprietaire } from '../interfaces/coproprietaire';

const url = 'http://localhost:3000/coproprietaires/';

@Injectable({
  providedIn: 'root',
})
export class CoproService {
  isLoading = false;
  errorMsg = '';

  protected copros$ = new BehaviorSubject<Coproprietaire[]>([]);

  constructor(private readonly http: HttpClient) {
    console.log('instantiate back-end service');
    this.loadCoproprietaires().subscribe();
  }

  loadCoproprietaires(): Observable<void> {
    return of(undefined).pipe(
      tap(() => {
        this.errorMsg = '';
        this.isLoading = true;
      }),
      switchMap(() => this.http.get<Coproprietaire[]>(url)),
      map((copros) => {
        this.copros$.next(copros);
      }),
      finalize(() => {
        this.isLoading = false;
      }),
      catchError((err) => {
        console.log('err: ', err);
        this.errorMsg = 'Erreur Technique';
        return of(undefined);
      })
    );
  }

  getCoproprietaires(): Observable<Coproprietaire[]> {
    return this.copros$.pipe(distinctUntilChanged());
  }

  getOneCoproById(id: string): Observable<Coproprietaire | undefined> {
    return this.copros$.pipe(
      map((copros) => copros.find((c) => c.id === id)),
      filter((c) => c !== undefined)
    );
  }

  update(coproToUpdate: Coproprietaire): Observable<void> {
    return this.http.put<void>(url, coproToUpdate).pipe(
      tap(() => {
        this.refresh();
      })
    );
  }

  refresh(): void {
    console.log('refresh');
    this.http.get<Coproprietaire[]>(url).subscribe((copros) => {
      this.copros$.next(copros);
    });
  }
}
