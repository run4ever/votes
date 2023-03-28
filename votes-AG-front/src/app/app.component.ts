import { Component, OnDestroy } from '@angular/core';
import { Coproprietaire } from './interfaces/coproprietaire';
import { CoproService } from './services/copro.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  title = 'votes-AG-front';
  copros: Coproprietaire[] = [];

  constructor(protected readonly coproService: CoproService) {}

  ngOnDestroy(): void {
    console.log('bye bye');
  }
}
