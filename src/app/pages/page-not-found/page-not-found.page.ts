import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.page.html',
  styleUrls: ['./page-not-found.page.scss'],
  standalone: false
})
export class PageNotFoundPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    console.log('📄 Página 404 cargada');
  }

  volverAlHome() {
    this.router.navigate(['/home']);
  }

  volverAlLogin() {
    this.router.navigate(['/login']);
  }

}