import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  email: string = '';
  password: string = '';
  bienvenidos: string = 'Bienvenid@';
  
  // Control del segment activo (comentado pero disponible)
  // segmentSelected: string = 'mis-datos';

  constructor(private route: ActivatedRoute, private menu: MenuController) {}

  ngOnInit() {
    this.menu.close("mainMenu");

    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.password = params['password'];
    });
  }

  // Funcion para cambiar de segment  (comentada pero disponible)
  
  // onSegmentChanged(event: any) {
  //   this.segmentSelected = event.detail.value;
  //   console.log('Segment seleccionado:', this.segmentSelected);
  // }
}