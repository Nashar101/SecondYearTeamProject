import { DOCUMENT } from '@angular/common';
import { Inject, Component, OnInit, RendererFactory2, Renderer2, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import dayjs from 'dayjs/esm';

import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  private renderer: Renderer2;
  private darkMode = false;
  isNavbarOpen = false;
  constructor(
    private accountService: AccountService,
    private titleService: Title,
    private router: Router,
    private translateService: TranslateService,
    private elementRef: ElementRef,
    rootRenderer: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = rootRenderer.createRenderer(document.querySelector('html'), null);
    this.darkMode = localStorage.getItem('darkMode') === 'true';
    this.setTheme();
  }

  ngOnInit(): void {
    // try to log in automatically
    this.accountService.identity().subscribe();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateTitle();
      }
    });

    this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
      this.updateTitle();
      dayjs.locale(langChangeEvent.lang);
      this.renderer.setAttribute(document.querySelector('html'), 'lang', langChangeEvent.lang);
    });
  }

  private getPageTitle(routeSnapshot: ActivatedRouteSnapshot): string {
    const title: string = routeSnapshot.data['pageTitle'] ?? '';
    if (routeSnapshot.firstChild) {
      return this.getPageTitle(routeSnapshot.firstChild) || title;
    }
    return title;
  }

  private updateTitle(): void {
    let pageTitle = this.getPageTitle(this.router.routerState.snapshot.root);
    if (!pageTitle) {
      pageTitle = 'global.title';
    }
    this.translateService.get(pageTitle).subscribe(title => this.titleService.setTitle(title));
  }

  toggleNavbar(): void {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  handleOutsideClick(event: MouseEvent): void {
    const clickedInsideNavbar = this.elementRef.nativeElement.querySelector('.navbar-container').contains(event.target);
    if (!clickedInsideNavbar) {
      this.isNavbarOpen = false;
    }
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', this.darkMode.toString());
    this.setTheme();
  }

  private setTheme() {
    if (this.darkMode) {
      this.document.documentElement.classList.add('dark-mode');
    } else {
      this.document.documentElement.classList.remove('dark-mode');
    }
  }

  // Add this method inside the MainComponent class
  getWindowWidth(): number {
    return window.innerWidth;
  }
}
