import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-company-name',
  templateUrl: './company-name.component.html',
  styleUrls: ['./company-name.component.scss'],
})
export class CompanyNameComponent    {

  constructor() { }
  @Input() companyName: string = 'Mi Empresa'; // Valor predeterminado

}
