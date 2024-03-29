import {Component} from '@angular/core';
import {CardComponent, Rank, Suit} from '../card/card.component';
import {DeckComponent} from '../deck/deck.component';

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
  hand: CardComponent[] = [];
  deck: DeckComponent = new DeckComponent();
  river: CardComponent[] = [];
  rankString!: string;

  constructor() {
    this.randomHandAndRiver();
  }

  setHand() {
    this.hand = [this.card_1, this.card_2];
  }

  randomizeDeck(): void {
    this.deck = new DeckComponent();
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
    this.setHand();
  }

  preflop(): void {
    this.river = [];
    this.randomizeDeck();
    this.dealCards();
    this.rankString = HandRank[this.evaluateHand(this.hand, this.river).handRank];
  }

  flop(): void {
    this.generateRiver(this.deck.deck, 3);
    this.rankString = HandRank[this.evaluateHand(this.hand, this.river).handRank];
  }

  turn(): void {
    if (this.river.length > 3) {
      if (this.river.length === 4) {
        let poppedCard = this.river.pop();
        if (poppedCard) {
          this.deck.deck.push(poppedCard);
        }
      } else {
        let poppedCard1 = this.river.pop();
        let poppedCard2 = this.river.pop();
        if (poppedCard1) {
          this.deck.deck.push(poppedCard1);
        }
        if (poppedCard2) {
          this.deck.deck.push(poppedCard2);
        }
      }

    }
    this.addCardToRiver(this.deck.deck);
    this.rankString = HandRank[this.evaluateHand(this.hand, this.river).handRank];
  }

  riverCard(): void {
    if (this.river.length > 4) {
      let poppedCard = this.river.pop();
      if (poppedCard) {
        this.deck.deck.push(poppedCard);
      }
    }
    this.addCardToRiver(this.deck.deck);
    this.rankString = HandRank[this.evaluateHand(this.hand, this.river).handRank];
  }


  randomHandAndRiver(): void {
    this.randomizeDeck();
    this.dealCards();
    this.hand = [this.card_1, this.card_2];

    this.generateRiver(this.deck.deck, 5);

    this.rankString = HandRank[this.evaluateHand(this.hand, this.river).handRank];
  }

  calculatePreFlopOdds(numberOfPlayers: number): void {
    // TODO: Implement this function
    // 1. Generate all possible combinations of 2-card hands for the specified number of players
    // 2. Generate all possible combinations of 5 cards for the community cards
    // 3. For each combination of player hands and community cards, determine the best poker hand each player can get
    // 4. Count how many times each type of hand appears for each player
    // 5. The pre-flop odds for each type of hand for each player is the number of times that hand appears divided by the total number of combinations

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

  generateRiver(deck: CardComponent[], size: number): void {
    let river: CardComponent[] = [];

    for (let i = 0; i < size; i++) {
      let randomIndex = Math.floor(Math.random() * deck.length);
      river.push(deck[randomIndex]);
      deck.splice(randomIndex, 1);
    }

    this.river = river;
  }

  addCardToRiver(deck: CardComponent[]): void {
    let randomIndex = Math.floor(Math.random() * deck.length);
    this.river.push(deck[randomIndex]);
    deck.splice(randomIndex, 1);
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

  evaluateHand(hand: CardComponent[], river: CardComponent[]): { handRank: HandRank, highCard: Rank } {
    // Triez les cartes par rang
    hand.sort((a, b) => this.rankToNumber(a.rank) - this.rankToNumber(b.rank));

    // Vérifiez pour une Quinte Flush Royale
    let royalFlush = this.isRoyalFlush(hand, river);
    if (royalFlush !== null) {
      return { handRank: HandRank.RoyalFlush, highCard: royalFlush };
    }

    // Vérifiez pour une Quinte Flush
    let straightFlush = this.isStraightFlush(hand, river);
    if (straightFlush !== null) {
      return { handRank: HandRank.StraightFlush, highCard: straightFlush };
    }

    // Vérifiez pour un Carré
    let fourOfAKind = this.isFourOfAKind(hand, river);
    if (fourOfAKind !== null) {
      return { handRank: HandRank.FourOfAKind, highCard: fourOfAKind };
    }

    // Vérifiez pour un Full House
    let fullHouse = this.isFullHouse(hand, river);
    if (fullHouse !== null) {
      return { handRank: HandRank.FullHouse, highCard: fullHouse.threeOfAKind };
    }

    // Vérifiez pour une Couleur
    let flush = this.isFlush(hand, river);
    if (flush !== null) {
      return { handRank: HandRank.Flush, highCard: flush };
    }

    // Vérifiez pour une Suite
    let straight = this.isStraight(hand, river);
    if (straight !== null) {
      return { handRank: HandRank.Straight, highCard: straight };
    }

    // Vérifiez pour un Brelan
    let threeOfAKind = this.isThreeOfAKind(hand, river);
    if (threeOfAKind !== null) {
      return { handRank: HandRank.ThreeOfAKind, highCard: threeOfAKind };
    }

    // Vérifiez pour Deux Paires
    let twoPairs = this.isTwoPairs(hand, river);
    if (twoPairs !== null) {
      return { handRank: HandRank.TwoPairs, highCard: twoPairs[0] };
    }

    // Vérifiez pour une Paire
    let pair = this.isPair(hand, river);
    if (pair !== null) {
      return { handRank: HandRank.Pair, highCard: pair };
    }

    // Si aucune des combinaisons ci-dessus n'est trouvée, retournez Carte Haute
    hand.sort((a, b) => this.rankToNumber(a.rank) - this.rankToNumber(b.rank));
    let highCard = hand[hand.length - 1].rank;
    return { handRank: HandRank.HighCard, highCard: highCard };
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

  containsHandCards(selectedCards: CardComponent[], hand: CardComponent[]): boolean {
    return selectedCards.includes(hand[0]) && selectedCards.includes(hand[1]);
  }

  isRoyalFlush(hand: CardComponent[], river: CardComponent[]): Rank | null {
    let handWithRiver = hand.concat(river);
    if (handWithRiver.length < 5) {
      return null;
    } else {
      // TODO: Implement this function
      // Vérifiez si la main contient un 10, un Valet, une Reine, un Roi et un As de la même couleur
      let possibleCombinations = this.getCombinations(handWithRiver, 5);

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
            if (this.containsHandCards(combination, hand)) {
              return Rank.Ace;
            }

          }

        }

      }
      return null;
    }
  }

  isStraightFlush(hand: CardComponent[], river: CardComponent[]): Rank | null {
    let handWithRiver = hand.concat(river);
    if (handWithRiver.length < 5) {
      return null;
    } else {
      let possibleCombinations = this.getCombinations(handWithRiver, 5);

      for (let combination of possibleCombinations) {
        if (this.isStraight(hand, combination) && this.isFlush(hand, combination)) {
          combination.sort((a, b) => this.rankToNumber(a.rank) - this.rankToNumber(b.rank));
          let highestCard = combination[combination.length - 1]; // Prend le dernier élément, qui est la carte de rang le plus élevé
          return highestCard.rank;
        }
      }

      return null;
    }
  }

  isFourOfAKind(hand: CardComponent[], river: CardComponent[]): Rank | null {
    let handWithRiver = hand.concat(river);
    if (handWithRiver.length < 4) {
      return null;
    } else {
      // TODO: Implement this function
      // Vérifiez si la main contient quatre cartes du même rang
      let possibleCombinations = this.getCombinations(handWithRiver, 4);

      for (let combination of possibleCombinations) {
        if (combination[0].rank === combination[1].rank &&
          combination[0].rank === combination[2].rank &&
          combination[0].rank === combination[3].rank) {
          if (this.containsHandCards(combination, [this.card_1]) || this.containsHandCards(combination, [this.card_2])) {
            return combination[0].rank;
          }
        }
      }
      return null;
    }
  }

  isFullHouse(hand: CardComponent[], river: CardComponent[]): { threeOfAKind: Rank, pair: Rank } | null {
    let handWithRiver = hand.concat(river);
    let foundThreeOfAKindsRank: Rank[] = [];
    let foundPairsRank: Rank[] = [];

    let foundThreeOfAKinds: CardComponent[][] = [];
    let foundPairs: CardComponent[][] = [];

    if (handWithRiver.length < 5) {
      return null;
    } else {
      let possibleCombinationsForThree = this.getCombinations(handWithRiver, 3);
      let possibleCombinationsForTwo = this.getCombinations(handWithRiver, 2);

      for (let combination of possibleCombinationsForThree) {
        if (combination[0].rank === combination[1].rank && combination[0].rank === combination[2].rank) {
          foundThreeOfAKindsRank.push(combination[0].rank);
          foundThreeOfAKinds.push(combination);
        }
      }

      for (let combination of possibleCombinationsForTwo) {
        if (combination[0].rank === combination[1].rank) {
          if (combination[0].rank !== foundThreeOfAKindsRank[0]) {
            foundPairsRank.push(combination[0].rank);
            foundPairs.push(combination);
          }

        }
      }

      // Si un brelan et une paire sont trouvés, vérifiez si les cartes de la main sont incluses dans la combinaison


      if (foundThreeOfAKinds.length >= 1 && foundPairs.length >= 1) {
        foundThreeOfAKinds.sort((a, b) => this.rankToNumber(a[0].rank) - this.rankToNumber(b[0].rank));
        foundPairs.sort((a, b) => this.rankToNumber(a[0].rank) - this.rankToNumber(b[0].rank));

        for (let i= foundPairs.length-1; i>=0; i--) {
          for (let j=foundThreeOfAKinds.length-1; j>=0; j--) {
            let combination = foundPairs[i].concat(foundThreeOfAKinds[j]);
            if (this.containsHandCards(combination, hand)) {
              return {threeOfAKind: foundThreeOfAKindsRank[j], pair: foundPairsRank[i]};
            }
          }
        }

      }

      return null;
    }
  }

  isFlush(hand: CardComponent[], river: CardComponent[]): Rank | null {
    let handWithRiver = hand.concat(river);
    let foundFlush: CardComponent[][] = [];

    if (handWithRiver.length < 5) {
      return null;
    } else {

      let possibleCombinations = this.getCombinations(handWithRiver, 5);

      for (let combination of possibleCombinations) {

        if (combination[0].suit === combination[1].suit &&
          combination[0].suit === combination[2].suit &&
          combination[0].suit === combination[3].suit &&
          combination[0].suit === combination[4].suit) {
          if (this.containsHandCards(combination, hand)) {
            combination.sort((a, b) => this.rankToNumber(a.rank) - this.rankToNumber(b.rank));
            foundFlush.push(combination);

          }
        }


      // let suits = Object.values(Suit);
      //
      // for (let suit of suits) {
      //   let sameSuitCards = handWithRiver.filter(card => card.suit === suit);
      //   if (sameSuitCards.length >= 5) {
      //     if (this.containsHandCards(sameSuitCards, hand)) {
      //       sameSuitCards.sort((a, b) => this.rankToNumber(a.rank) - this.rankToNumber(b.rank));
      //       foundFlush = sameSuitCards;
      //     }
      //
      //   }
      }

      if (foundFlush.length >= 2) {
        // Trier les combinaisons de flush par rang de la carte la plus élevée
        foundFlush.sort((a, b) => this.rankToNumber(a[a.length - 1].rank) - this.rankToNumber(b[b.length - 1].rank));
        let highestCard = foundFlush[foundFlush.length - 1][(foundFlush[foundFlush.length - 1]).length -1]; // Prend le dernier élément, qui est la carte de rang le plus élevé
        return highestCard.rank;
      }

      return null;
    }
  }

  isStraight(hand: CardComponent[], river: CardComponent[]): Rank | null {
    let handWithRiver = hand.concat(river);
    let foundStraights: CardComponent[][] = [];
    if (handWithRiver.length < 5) {
      return null;
    } else {
      // TODO: Implement this function
      // Vérifiez si la main contient une suite de cinq cartes
      let sortedHand = [...handWithRiver].sort((a, b) => this.rankToNumber(a.rank) - this.rankToNumber(b.rank));
      let straightCount = 1;

      for (let i = 0; i < sortedHand.length - 1; i++) {
        if (this.rankToNumber(sortedHand[i].rank) + 1 === this.rankToNumber(sortedHand[i + 1].rank)) {
          straightCount++;
          if (straightCount === 5) {
            // vérifier si les 5 cartes séléctionnée contienne les cartes de la main
            if (this.containsHandCards(sortedHand.slice(i - 3, i + 2), hand)) {
              foundStraights.push(sortedHand.slice(i - 3, i + 2));
            }
          }
        } else if (this.rankToNumber(sortedHand[i].rank) !== this.rankToNumber(sortedHand[i + 1].rank)) {
          straightCount = 1;
        }

        if (foundStraights.length >= 1) {
          foundStraights.sort((a, b) => this.rankToNumber(a[a.length - 1].rank) - this.rankToNumber(b[b.length - 1].rank));
          let highestCard = foundStraights[foundStraights.length - 1][foundStraights[foundStraights.length - 1].length - 1];
          return highestCard.rank;
        }
      }

      return null;
    }
  }

  isThreeOfAKind(hand: CardComponent[], river: CardComponent[]): Rank | null {
    let handWithRiver = hand.concat(river);
    let foundThreeOfAKinds: Rank[] = [];

    if (handWithRiver.length < 3) {
      return null;
    } else {
      let possibleCombinations = this.getCombinations(handWithRiver, 3);

      for (let combination of possibleCombinations) {
        if (combination[0].rank === combination[1].rank &&
          combination[0].rank === combination[2].rank) {
          foundThreeOfAKinds.push(combination[0].rank);
        }
      }

      if (foundThreeOfAKinds.length >= 1) {
        foundThreeOfAKinds.sort((a, b) => this.rankToNumber(a) - this.rankToNumber(b));
        let bestThreeOfAKind = foundThreeOfAKinds[foundThreeOfAKinds.length - 1]; // Prend le dernier élément, qui est le brelan de rang le plus élevé
        return bestThreeOfAKind;
      }

      return null;
    }
  }

  isTwoPairs(hand: CardComponent[], river: CardComponent[]): Rank[] | null {
    let handWithRiver = hand.concat(river);
    let containsHandCard = false;
    let foundPairs: Rank[] = [];

    if (handWithRiver.length < 4) {
      return null;
    } else {
      let possibleCombinations = this.getCombinations(handWithRiver, 2);

      for (let combination of possibleCombinations) {
        if (combination[0].rank === combination[1].rank) {
          foundPairs.push(combination[0].rank);
          if (this.containsHandCards(combination, [hand[0]]) || this.containsHandCards(combination, [hand[1]])) {
            containsHandCard = true;
          }
        }
      }

      if (foundPairs.length >= 2) {
        foundPairs.sort((a, b) => this.rankToNumber(a) - this.rankToNumber(b));
        let bestPairs = foundPairs.slice(-2); // Prend les deux derniers éléments, qui sont les paires de rang le plus élevé
        return bestPairs;
      }

      return null;
    }
  }

  isPair(hand: CardComponent[], river: CardComponent[]): Rank | null {
    let handWithRiver = hand.concat(river);
    let foundPairs: Rank[] = [];

    if (handWithRiver.length < 2) {
      return null;
    } else {
      let possibleCombinations = this.getCombinations(handWithRiver, 2);

      for (let combination of possibleCombinations) {
        if (combination[0].rank === combination[1].rank) {
          foundPairs.push(combination[0].rank);
        }
      }

      if (foundPairs.length >= 1) {
        foundPairs.sort((a, b) => this.rankToNumber(a) - this.rankToNumber(b));
        let bestPair = foundPairs[foundPairs.length - 1]; // Prend le dernier élément, qui est la paire de rang le plus élevé
        return bestPair;
      }

      return null;
    }
  }


  isHandBetter(hand1: CardComponent[], hand2: CardComponent[]): boolean {
    let rank1 = this.evaluateHand(hand1, this.river);
    let rank2 = this.evaluateHand(hand2, this.river);

    let highestCardHand1 = Math.max(...hand1.map(card => this.rankToNumber(card.rank)));
    let highestCardHand2 = Math.max(...hand2.map(card => this.rankToNumber(card.rank)));

    if (rank1.handRank == rank2.handRank) {
      if ( rank1.highCard > rank2.highCard) {
        return highestCardHand1 > highestCardHand2;

      }
      return rank1.highCard > rank2.highCard;
    } else {
      return rank1.handRank > rank2.handRank;
    }
  }




}
