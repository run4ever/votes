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

  constructor(protected readonly coproService: CoproService) {}

  update(id: string, event: any) {
    const selectedValue = event.target.selectedOptions[0].value;
    console.log('update copro ' + id + ' valeur choisie : ' + selectedValue);
    this.coproService.getOneCoproById(id).subscribe((coproToUpdate) => {
      if (coproToUpdate) {
        coproToUpdate.vote01 = selectedValue;
        of(undefined)
          .pipe(
            switchMap(() => {
              return this.coproService.update(coproToUpdate);
            }),
            catchError((err) => {
              console.log('err: ', err);
              return of(undefined);
            })
          )
          .subscribe();
      } else {
        // Traiter l'erreur ici
        console.log('copro non trouvé');
      }
    });
  }

  ngOnDestroy(): void {
    console.log('bye bye');
  }
}
