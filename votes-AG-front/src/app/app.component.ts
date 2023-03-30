import { Component, OnDestroy } from '@angular/core';
import { Coproprietaire } from './interfaces/coproprietaire';
import { CoproService } from './services/copro.service';
import { catchError, finalize, of, switchMap, tap, first } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  title = 'votes-AG-front';
  copros: Coproprietaire[] = [];
  myMap = new Map<number, string>();
  //nbQuestions = 5;
  //nbYes = new Map<string, number>();
  //nbNo = new Map<string, number>();
  //nbNoVote = new Map<string, number>();

  nbYes: Map<string, number> = new Map<string, number>();
  nbNo: Map<string, number> = new Map<string, number>();
  nbNoVote: Map<string, number> = new Map<string, number>();

  constructor(protected readonly coproService: CoproService) {}

  update(idCoproToUpdate: string, idResolution: string, event: any) {
    const selectedValue = event.target.selectedOptions[0].value;
    console.log(
      'update copro ' +
        idCoproToUpdate +
        ' / resolution ' +
        idResolution +
        ' / valeur choisie : ' +
        selectedValue
    );
    this.coproService
      .getOneCoproById(idCoproToUpdate)
      .subscribe((coproToUpdate) => {
        if (coproToUpdate) {
          coproToUpdate.votes[`${idResolution}`] = +selectedValue;
          console.log('commençons update');
          of(undefined)
            .pipe(
              switchMap(() => {
                console.log('je passe ici');
                return this.coproService.update(coproToUpdate);
              }),
              catchError((err) => {
                console.log('err: ', err);
                return of(undefined);
              })
            )
            .subscribe();
          console.log('updated copropriétaire :', coproToUpdate);
        } else {
          console.log('copro non trouvé');
        }
      });
  }

  numSequence(n: number): Array<number> {
    return Array(n);
  }

  refresh() {
    // Mettre à jour nbYes dans le service
    this.coproService.refresh();
  }

  ngOnInit() {
    //this.coproService.refresh();

    this.coproService.getNbYes().subscribe((y) => {
      this.nbYes = y;
    });
    this.coproService.getNbNo().subscribe((n) => {
      this.nbNo = n;
    });
    this.coproService.getNbNoVote().subscribe((nv) => {
      this.nbNoVote = nv;
    });

    this.myMap.clear();
    for (let i = 1; i < this.coproService.nbQuestions + 1; i++) {
      const questionName = 'r' + i;

      this.myMap.set(i, questionName);
      this.coproService.getTotalVote(questionName, 1).subscribe((y) => {
        this.nbYes.set(questionName, y);
      });

      this.coproService.getTotalVote(questionName, -1).subscribe((n) => {
        this.nbNo.set(questionName, n);
      });

      this.coproService.getTotalVote(questionName, 0).subscribe((nv) => {
        this.nbNoVote.set(questionName, nv);
      });
    }
  }

  ngOnDestroy(): void {
    console.log('bye bye');
  }
}
