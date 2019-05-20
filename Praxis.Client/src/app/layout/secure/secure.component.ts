import { Component, OnInit } from '@angular/core';

declare function adjustHeight(): any;

@Component({
  selector: 'app-secure',
  templateUrl: './secure.component.html'
})
export class SecureComponent implements OnInit {

  public options = {
    position: ['top', 'right'],
    timeOut: 2000,
    showProgressBar: true,
    pauseOnHover: false,
    clickToClose: true
  };

  constructor() { }

  ngOnInit() {
    adjustHeight();
  }

}
