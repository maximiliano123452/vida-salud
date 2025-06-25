import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-company-name',
  templateUrl: './company-name.component.html',
  styleUrls: ['./company-name.component.scss'],
})
export class CompanyNameComponent {
  @Input() companyName: string = 'Vida Sana'; 
}

