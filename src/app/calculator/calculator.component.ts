import { Component } from '@angular/core';
import { CardComponent, Rank, Suit } from '../card/card.component';
import { DeckComponent } from '../deck/deck.component';

enum HandRank {
  HighCard,
  Pair,
  TwoPairs,
  ThreeOfAKind,
  Straight,
  Flush,
  FullHouse,
  FourOfAKind,
  StraightFlush,
  RoyalFlush
}

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent {
  card_1!: CardComponent;
  card_2!: CardComponent;
  deck: DeckComponent = new DeckComponent();
  river: CardComponent[] = [];

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
    this.deck.deck = this.filterDeck(this.deck.deck, this.card_1);
    this.card_2 = this.getRandomCard();
    this.deck.deck = this.filterDeck(this.deck.deck, this.card_2);
  }

  calculatePreFlopOdds(numberOfPlayers: number): void {
    // TODO: Implement this function
    // 1. Generate all possible combinations of 2-card hands for the specified number of players
    // 2. Generate all possible combinations of 5 cards for the community cards
    // 3. For each combination of player hands and community cards, determine the best poker hand each player can get
    // 4. Count how many times each type of hand appears for each player
    // 5. The pre-flop odds for each type of hand for each player is the number of times that hand appears divided by the total number of combinations


    let hand = [this.card_1, this.card_2];

    this.generateRiver(this.deck.deck);

    let handWithRiver = hand.concat(this.river);
    handWithRiver.sort((a, b) => this.rankToNumber(a.rank) - this.rankToNumber(b.rank));

    console.log(handWithRiver);

    console.log(this.isRoyalFlush(handWithRiver));

    let playerHands = this.generatePlayerHand(this.deck.deck);

    console.log(playerHands);

  }

  filterDeck(deck: CardComponent[], card: CardComponent): CardComponent[] {
    return deck.filter(deckCard =>
      !(deckCard.rank === card.rank && deckCard.suit === card.suit)
    );
  }

  generatePlayerHand(deck: CardComponent[]): CardComponent[][] {
    let playerHands: CardComponent[][] = [];

    for (let j = 0; j < deck.length; j++) {
      for (let k = j + 1; k < deck.length; k++) {
        playerHands.push([deck[j], deck[k]]);
      }
    }

    return playerHands;
  }

  generateRiver(deck: CardComponent[]): void {
    let river: CardComponent[] = [];

    for (let i = 0; i < 3; i++) {
      let randomIndex = Math.floor(Math.random() * deck.length);
      river.push(deck[randomIndex]);
      deck.splice(randomIndex, 1);
    }

    this.river = river;
  }

  rankToNumber(rank: Rank): number {
    switch (rank) {
      case Rank.Two: return 2;
      case Rank.Three: return 3;
      case Rank.Four: return 4;
      case Rank.Five: return 5;
      case Rank.Six: return 6;
      case Rank.Seven: return 7;
      case Rank.Eight: return 8;
      case Rank.Nine: return 9;
      case Rank.Ten: return 10;
      case Rank.Jack: return 11;
      case Rank.Queen: return 12;
      case Rank.King: return 13;
      case Rank.Ace: return 14;
      default: throw new Error('Invalid rank');
    }
  }
  evaluateHand(hand: CardComponent[]): HandRank {
    // Triez les cartes par rang
    let handWithRiver = hand.concat(this.river);
    handWithRiver.sort((a, b) => this.rankToNumber(a.rank) - this.rankToNumber(b.rank));

    // Vérifiez pour une Quinte Flush Royale
    if (this.isRoyalFlush(hand)) {
      return HandRank.RoyalFlush;
    }

    // Vérifiez pour une Quinte Flush
    if (this.isStraightFlush(hand)) {
      return HandRank.StraightFlush;
    }

    // Vérifiez pour un Carré
    if (this.isFourOfAKind(hand)) {
      return HandRank.FourOfAKind;
    }

    // Vérifiez pour un Full House
    if (this.isFullHouse(hand)) {
      return HandRank.FullHouse;
    }

    // Vérifiez pour une Couleur
    if (this.isFlush(hand)) {
      return HandRank.Flush;
    }

    // Vérifiez pour une Suite
    if (this.isStraight(hand)) {
      return HandRank.Straight;
    }

    // Vérifiez pour un Brelan
    if (this.isThreeOfAKind(hand)) {
      return HandRank.ThreeOfAKind;
    }

    // Vérifiez pour Deux Paires
    if (this.isTwoPairs(hand)) {
      return HandRank.TwoPairs;
    }

    // Vérifiez pour une Paire
    if (this.isPair(hand)) {
      return HandRank.Pair;
    }

    // Si aucune des combinaisons ci-dessus n'est trouvée, retournez Carte Haute
    return HandRank.HighCard;
  }

  getCombinations(cards: CardComponent[], combinationSize: number, startIndex = 0): CardComponent[][] {
    // Si la taille de la combinaison est 0, retournez une liste vide
    if (combinationSize === 0) {
      return [[]];
    }

    let combinations: CardComponent[][] = [];

    // Parcourez la liste de cartes à partir de l'index de départ
    for (let i = startIndex; i <= cards.length - combinationSize; i++) {
      // Obtenez toutes les combinaisons possibles de taille-1 à partir de l'index suivant
      let smallerCombinations = this.getCombinations(cards, combinationSize - 1, i + 1);

      // Ajoutez la carte actuelle à toutes les combinaisons plus petites et ajoutez-les à la liste des combinaisons
      for (let smallerCombination of smallerCombinations) {
        combinations.push([cards[i], ...smallerCombination]);
      }
    }

    return combinations;
  }

  isRoyalFlush(hand: CardComponent[]): boolean {
    if (hand.length < 5) {
      return false;
    } else {
      // TODO: Implement this function
      // Vérifiez si la main contient un 10, un Valet, une Reine, un Roi et un As de la même couleur
      let possibleCombinations = this.getCombinations(hand, 5);

      // Vérifier si l'une des mains possible contient une quinte royale
      for (let combination of possibleCombinations) {

        if (combination[0].rank === Rank.Ten &&
          combination[1].rank === Rank.Jack &&
          combination[2].rank === Rank.Queen &&
          combination[3].rank === Rank.King &&
          combination[4].rank === Rank.Ace) {

          if (combination[0].suit === combination[1].suit &&
            combination[0].suit === combination[2].suit &&
            combination[0].suit === combination[3].suit &&
            combination[0].suit === combination[4].suit) {
            return true;
          }

        }

      }
      return false;
    }
  }

  isStraightFlush(hand: CardComponent[]): boolean {
    if (hand.length < 5) {
      return false;
    } else {
      // TODO: Implement this function
      // Vérifiez si la main contient une suite de cinq cartes de la même couleur
      return true;
    }
  }

  isFourOfAKind(hand: CardComponent[]): boolean {
    if (hand.length < 4) {
      return false;
    } else {
      // TODO: Implement this function
      // Vérifiez si la main contient quatre cartes du même rang
      return true;
    }
  }

  isFullHouse(hand: CardComponent[]): boolean {
    if (hand.length < 5) {
      return false;
    } else {
      // TODO: Implement this function
      // Vérifiez si la main contient un brelan et une paire
      return true;
    }
  }

  isFlush(hand: CardComponent[]): boolean {
    if (hand.length < 5) {
      return false;
    } else {
      // TODO: Implement this function
      // Vérifiez si la main contient cinq cartes de la même couleur
      return true;
    }
  }

  isStraight(hand: CardComponent[]): boolean {
    if (hand.length < 5) {
      return false;
    } else {
      // TODO: Implement this function
      // Vérifiez si la main contient une suite de cinq cartes
      return true;
    }
  }

  isThreeOfAKind(hand: CardComponent[]): boolean {
    if (hand.length < 3) {
      return false;
    } else {
      // TODO: Implement this function
      // Vérifiez si la main contient trois cartes du même rang
      return true;
    }
  }

  isTwoPairs(hand: CardComponent[]): boolean {
    if (hand.length < 4) {
      return false;
    } else {
      // TODO: Implement this function
      // Vérifiez si la main contient deux paires de cartes
      return true;
    }
  }

  isPair(hand: CardComponent[]): boolean {
    if (hand.length < 2) {
      return false;
    } else {
      // TODO: Implement this function
      // Vérifiez si la main contient une paire de cartes
      return true;
    }
  }


  isHandBetter(hand1: CardComponent[], hand2: CardComponent[]): boolean {
    let rank1 = this.evaluateHand(hand1);
    let rank2 = this.evaluateHand(hand2);

    return rank1 > rank2;
  }




}
