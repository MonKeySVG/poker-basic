import { Component } from '@angular/core';
import { CardComponent, Rank, Suit } from '../card/card.component';
import { DeckComponent } from '../deck/deck.component';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent {
  card_1!: CardComponent;
  card_2!: CardComponent;
  deck: DeckComponent = new DeckComponent();

  constructor() {
    this.dealCards();
    this.calculatePreFlopOdds(3);
  }

  getRandomCard(): CardComponent {
    const ranks = Object.values(Rank);
    const suits = Object.values(Suit);
    const randomRank = ranks[Math.floor(Math.random() * ranks.length)];
    const randomSuit = suits[Math.floor(Math.random() * suits.length)];
    return new CardComponent(randomRank, randomSuit);
  }

  dealCards(): void {
    this.card_1 = this.getRandomCard();
    this.card_2 = this.getRandomCard();
  }

  calculatePreFlopOdds(numberOfPlayers: number): void {
    // TODO: Implement this function
    // 1. Generate all possible combinations of 2-card hands for the specified number of players
    // 2. Generate all possible combinations of 5 cards for the community cards
    // 3. For each combination of player hands and community cards, determine the best poker hand each player can get
    // 4. Count how many times each type of hand appears for each player
    // 5. The pre-flop odds for each type of hand for each player is the number of times that hand appears divided by the total number of combinations

    let deckMinusHole = this.filterDeck(this.deck.deck, this.card_1);
    deckMinusHole = this.filterDeck(deckMinusHole, this.card_2);

    let playerHands = this.generatePlayerHands(numberOfPlayers, deckMinusHole);
    console.log(deckMinusHole);
    console.log(playerHands);

  }

  filterDeck(deck: CardComponent[], card: CardComponent): CardComponent[] {
    return deck.filter(deckCard =>
      !(deckCard.rank === card.rank && deckCard.suit === card.suit)
    );
  }

  generatePlayerHands(numberOfPlayers: number, deck: CardComponent[]): CardComponent[][][] {
    let playerHands: CardComponent[][][] = [];

    for (let i = 0; i < numberOfPlayers; i++) {
      playerHands[i] = [];
      for (let j = 0; j < deck.length; j++) {
        for (let k = j + 1; k < deck.length; k++) {
          playerHands[i].push([deck[j], deck[k]]);
        }
      }
    }

    return playerHands;
  }
}
