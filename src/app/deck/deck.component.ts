import { Component } from '@angular/core';
import { CardComponent, Rank, Suit } from '../card/card.component';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrl: './deck.component.css'
})
export class DeckComponent {
  deck: CardComponent[] = [];

  constructor() {
    this.createDeck();
  }

  createDeck(): void {
    for (let suitKey in Suit) {
      if (isNaN(Number(suitKey))) { // this will exclude the reverse mapping of numeric enums
        let suit = Suit[suitKey as keyof typeof Suit];
        for (let rankKey in Rank) {
          if (isNaN(Number(rankKey))) { // this will exclude the reverse mapping of numeric enums
            let rank = Rank[rankKey as keyof typeof Rank];
            this.deck.push(new CardComponent(rank, suit));
          }
        }
      }
    }
  }
}
