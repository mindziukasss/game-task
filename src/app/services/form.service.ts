import { Injectable } from '@angular/core';
import { FormComponent } from '../components/form/form.component';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  constructor(
    private urlForm: FormComponent
  ) { }

  getBaseUrl(): string
  {
    let link = this.urlForm.urlInput.value.url;

    return typeof link === 'string' ? link : '';
  }
}
