import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formtearFecha',
  standalone:false
})
export class FormtearFechaPipe implements PipeTransform {

  /*transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }*/

    
   transform(value: string): string {
    const fecha = new Date(value);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;  // DD/MM/AAAA
  }

}
