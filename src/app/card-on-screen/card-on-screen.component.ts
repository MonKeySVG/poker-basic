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
        return '#D04255';
      case Suit.Diamonds:
        return '#D04255';
      case Suit.Clubs:
        return '#E3E0F2';
      case Suit.Spades:
        return '#E3E0F2';
      default:
        return '#E3E0F2';
    }
  }

  areRankAndSuitInitialized(): boolean {
    return this.rank !== undefined && this.suit !== undefined;
  }

}
