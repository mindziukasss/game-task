import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup} from "@angular/forms";
import { links } from '../../links';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  urlInput = new FormGroup({
    url: new FormControl(links.BASE_URL)
  });

  constructor() { }

  ngOnInit(): void {
  }

  setUrl(event: any): void
  {
    return  event.target?.value ? event.target.value : '';
  }
}
