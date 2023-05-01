import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SessionStorageService } from 'ngx-webstorage';

import { VERSION } from 'app/app.constants';
import { LANGUAGES } from 'app/config/language.constants';
import { Account } from 'app/core/auth/account.model';
import { AccountService } from 'app/core/auth/account.service';
import { LoginService } from 'app/login/login.service';
import { ProfileService } from 'app/layouts/profiles/profile.service';
import { EntityNavbarItems } from 'app/entities/entity-navbar-items';

@Component({
  selector: 'jhi-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  inProduction?: boolean;
  isNavbarCollapsed = true;
  languages = LANGUAGES;
  openAPIEnabled?: boolean;
  version = '';
  account: Account | null = null;
  entitiesNavbarItems: any[] = [];
  accountTextColor = 'var(--text-color)';

  constructor(
    private loginService: LoginService,
    private translateService: TranslateService,
    private sessionStorageService: SessionStorageService,
    private accountService: AccountService,
    private profileService: ProfileService,
    private router: Router
  ) {
    if (VERSION) {
      this.version = VERSION.toLowerCase().startsWith('v') ? VERSION : `v${VERSION}`;
    }
  }

  ngOnInit(): void {
    this.entitiesNavbarItems = EntityNavbarItems;
    this.profileService.getProfileInfo().subscribe(profileInfo => {
      this.inProduction = profileInfo.inProduction;
      this.openAPIEnabled = profileInfo.openAPIEnabled;
    });

    this.accountService.getAuthenticationState().subscribe(account => {
      this.account = account;
    });
    this.listInit();

    const firstNavItem = document.querySelector('.nav-item');
    if (firstNavItem) {
      firstNavItem.classList.add('init');
    }
  }

  check: number = 0;
  listInit() {
    const liItems = document.querySelectorAll('li');
    liItems.forEach(li => {
      li.addEventListener('DOMContentLoaded', () => {
        liItems.forEach(item => {});
      });
      li.classList.add('clicked');
    });
  }
  //highlight() {
  //  const liItems = document.querySelectorAll('li');
  //  liItems.forEach(li => {
  //    li.addEventListener('load', () => {
  //      console.log('testing');
  //    });
  //  });
  //  this.check++;
  //
  //  liItems.forEach(li => {
  //    li.addEventListener('click', () => {
  //      liItems.forEach(item => {
  //        item.classList.remove('clicked');
  //        li.classList.remove('init');
  //      });
  //      li.classList.add('clicked');
  //    });
  //  });
  //  console.log(this.check);
  //  console.log('I work');
  //}
  changeLanguage(languageKey: string): void {
    this.sessionStorageService.store('locale', languageKey);
    this.translateService.use(languageKey);
  }

  collapseNavbar(): void {
    this.isNavbarCollapsed = true;
  }

  login(): void {
    this.router.navigate(['/login']);
  }

  logout(): void {
    this.collapseNavbar();
    this.loginService.logout();
    this.router.navigate(['']);
  }

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
}
