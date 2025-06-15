import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convetirMoneda'
  ,
  standalone: false
})
export class ConvetirMonedaPipe implements PipeTransform {

  /*
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
    */

  transform(value: number, tasaCambio: number=950): string {
    const precioConvertido = value * tasaCambio;
    return `$${precioConvertido.toFixed(0)} CLP`;; // Redondea a 0 decimales

}
}