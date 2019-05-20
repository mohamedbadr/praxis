import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  lang = environment.defaultLanguage;
  activeParent: string;

  isCompany = false;
  isCustomer = false;


  constructor(private authService: AuthService) { }

  ngOnInit() {
    const userRoles = this.authService.getUserRoles();

    this.isCompany = userRoles.indexOf('Company') > -1;
    this.isCustomer = userRoles.indexOf('Customer') > -1;
  }

  activateMneu(parent: string) {
    this.activeParent = parent;
  }

  SetactiveParent(parent: string) {
    this.activeParent = parent;
  }

}
