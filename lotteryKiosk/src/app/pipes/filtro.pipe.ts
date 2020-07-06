import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  transform(data: any[], params: string) {
    if (!params ) return data
    params = params.toLocaleLowerCase()
    return data.filter( dataLine => {
      if ( dataLine.hasOwnProperty('nick') ) {
        return dataLine['name'].toLocaleLowerCase().includes( params ) || dataLine['nick'].toLocaleLowerCase().includes( params )  
      }else{
        return dataLine['name'].toLocaleLowerCase().includes( params )
      }
    })
  }

}
