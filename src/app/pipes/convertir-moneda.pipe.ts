import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertirMoneda',
  standalone: false
})
export class ConvertirMonedaPipe implements PipeTransform {

  transform(value: number, tasaCambio: number = 950): string {
    const precioConvertido = value * tasaCambio;
    return `$${precioConvertido.toFixed(0)} CLP`;
  }

}