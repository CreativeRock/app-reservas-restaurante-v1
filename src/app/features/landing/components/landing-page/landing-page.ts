import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Hero } from '../hero/hero';

@Component({
  selector: 'app-landing-page',
  imports: [Header, Hero],
  templateUrl: './landing-page.html',
  styles: ``
})
export class LandingPage {

}
