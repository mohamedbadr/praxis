import { Component } from '@angular/core';
import { SubscriptionLike as ISubscription } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
          <router-outlet></router-outlet>
          <ng-http-loader [debounceDelay]="200" [backgroundColor]="'#00b8ce'"></ng-http-loader>
  `
})
export class AppComponent {
  title = 'Owl';
  subscription: ISubscription;

  constructor() {
  }

  ngOnInit() {

  }

}
