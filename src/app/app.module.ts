import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { CardComponent } from './card/card.component';
import { DeckComponent } from './deck/deck.component';
import { CardOnScreenComponent } from './card-on-screen/card-on-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    CalculatorComponent,
    CardComponent,
    DeckComponent,
    CardOnScreenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
