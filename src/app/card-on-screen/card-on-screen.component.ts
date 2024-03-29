import {Component, Input} from '@angular/core';
import {Rank, Suit} from "../card/card.component";

@Component({
  selector: 'app-card-on-screen',
  templateUrl: './card-on-screen.component.html',
  styleUrl: './card-on-screen.component.css'
})
export class CardOnScreenComponent {
  @Input() rank!: Rank;
  @Input() suit!: Suit;

  getColor() {
    switch (this.suit) {
      case Suit.Hearts:
        return 'red';
      case Suit.Diamonds:
        return 'red';
      case Suit.Clubs:
        return 'black';
      case Suit.Spades:
        return 'black';
      default:
        return 'black';
    }
  }

}
