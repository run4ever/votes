import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  distinctUntilChanged,
  filter,
  finalize,
  fromEvent,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { Coproprietaire } from '../interfaces/coproprietaire';

const url = 'http://localhost:3000/coproprietaires/';

@Injectable({
  providedIn: 'root',
})
export class CoproService {
  isLoading = false;
  errorMsg = '';
  pour: number[] = [];
  contre: number[] = [];
  abstention: number[] = [];
  //tantiemesPour: Record<string, number> = {};
  //tantiemesContre: Record<string, number> = {};
  //tantiemesAbstention: Record<string, number> = {};

  nbQuestions = 5;
  myMap = new Map<number, string>();

  nbYes: Map<string, number> = new Map<string, number>();
  nbYesSubject = new Subject<Map<string, number>>();

  nbNo = new Map<string, number>();
  nbNoSubject = new Subject<Map<string, number>>();

  nbNoVote = new Map<string, number>();
  nbNoVoteSubject = new Subject<Map<string, number>>();

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
    console.log('front - debut update');
    return this.http.put<void>(url, coproToUpdate);
  }

  getTotalVote(resolution: string, vote: number): Observable<number> {
    console.log('decompte des voix ' + resolution + ' vote ' + vote);
    return this.copros$.pipe(
      map((copros) => {
        const filteredCopros = copros.filter(
          (c) => c.votes[resolution] === vote
        );
        return filteredCopros.reduce((acc, c) => acc + c.tantiemes, 0);
      })
    );
  }

  refresh(): void {
    this.myMap.clear();
    for (let i = 1; i < this.nbQuestions + 1; i++) {
      const questionName = 'r' + i;

      this.myMap.set(i, questionName);
      this.getTotalVote(questionName, 1).subscribe((y) => {
        this.nbYes.set(questionName, y);
        this.nbYesSubject.next(this.nbYes);
      });

      this.getTotalVote(questionName, -1).subscribe((n) => {
        this.nbNo.set(questionName, n);
      });

      this.getTotalVote(questionName, 0).subscribe((nv) => {
        this.nbNoVote.set(questionName, nv);
      });
    }
  }

  getNbYes(): Observable<Map<string, number>> {
    return this.nbYesSubject.asObservable();
  }

  getNbNo(): Observable<Map<string, number>> {
    return this.nbNoSubject.asObservable();
  }

  getNbNoVote(): Observable<Map<string, number>> {
    return this.nbNoVoteSubject.asObservable();
  }

  /*
  refresh(): Observable<void> {
    console.log('refresh...');
    this.http.get<Coproprietaire[]>(url).subscribe((copros) => {
      this.copros$.next(copros);
    });
    this.getTotalVote('r1', 1).subscribe((p) => {
      this.tantiemesPour['r1'] = p;
    });
    this.getTotalVote('r1', 0).subscribe((p) => {
      this.tantiemesAbstention['r1'] = p;
    });
    this.getTotalVote('r1', -1).subscribe((p) => {
      this.tantiemesContre['r1'] = p;
    });
    console.log('refreshed !');
    return of(undefined);
  }
  */
}
