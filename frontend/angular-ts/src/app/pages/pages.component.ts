import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, ChildActivationEnd, NavigationEnd, Router } from '@angular/router';
import { filter, map, last, first } from 'rxjs/operators';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  constructor(
    private router: Router
  ) {
    // @ts-ignore
    this.router.events
      .pipe(
        // filter(event => event instanceof NavigationEnd  ),
        first(),
      )
      .subscribe(event => {
        console.log(event);
      });
  }

  ngOnInit(): void {
  }

}
