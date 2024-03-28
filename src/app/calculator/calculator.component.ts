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

  value: string = '';

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

    this.generateRiver(this.deck.deck, 5);

    console.log("Hand:" + hand.map(card => card.rank + " " + card.suit).join(', '));
    console.log("River:" + this.river.map(card => card.rank + card.suit).join(', '));


    this.evaluateHand(hand, this.river);

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

  evaluateHand(hand: CardComponent[], river: CardComponent[]): HandRank {
    // Triez les cartes par rang
    hand.sort((a, b) => this.rankToNumber(a.rank) - this.rankToNumber(b.rank));

    // Vérifiez pour une Quinte Flush Royale
    if (this.isRoyalFlush(hand, river)) {

      console.log("RoyalFlush");
      return HandRank.RoyalFlush;
    }

    // Vérifiez pour une Quinte Flush
    if (this.isStraightFlush(hand, river)) {
      console.log("StraightFlush");
      this.value = 'StraightFlush';
      return HandRank.StraightFlush;
    }

    // Vérifiez pour un Carré
    if (this.isFourOfAKind(hand, river)) {
      console.log("FourOfAKind");
      this.value = 'FourOfAKind';
      return HandRank.FourOfAKind;
    }

    // Vérifiez pour un Full House
    if (this.isFullHouse(hand, river)) {
      console.log("FullHouse");
      this.value = 'FullHouse';
      return HandRank.FullHouse;
    }

    // Vérifiez pour une Couleur
    if (this.isFlush(hand, river)) {
      console.log("Flush");
      this.value = 'Flush';
      return HandRank.Flush;
    }

    // Vérifiez pour une Suite
    if (this.isStraight(hand, river)) {
      console.log("Straight");
      this.value = 'Straight';
      return HandRank.Straight;
    }

    // Vérifiez pour un Brelan
    if (this.isThreeOfAKind(hand, river)) {
      console.log("ThreeOfAKind");
      this.value = 'ThreeOfAKind';
      return HandRank.ThreeOfAKind;
    }

    // Vérifiez pour Deux Paires
    if (this.isTwoPairs(hand, river)) {
      console.log("TwoPairs");
      this.value = 'TwoPairs';
      return HandRank.TwoPairs;
    }

    // Vérifiez pour une Paire
    if (this.isPair(hand, river)) {
      console.log("Pair");
      this.value = 'Pair';
      return HandRank.Pair;
    }

    // Si aucune des combinaisons ci-dessus n'est trouvée, retournez Carte Haute
    console.log("HighCard");
    this.value = 'HighCard';
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

  containsHandCards(selectedCards: CardComponent[], hand: CardComponent[]): boolean {
    return selectedCards.includes(hand[0]) && selectedCards.includes(hand[1]);
  }

  isRoyalFlush(hand: CardComponent[], river: CardComponent[]): boolean {
    let handWithRiver = hand.concat(river);
    if (handWithRiver.length < 5) {
      return false;
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
              return true;
            }

          }

        }

      }
      return false;
    }
  }

  isStraightFlush(hand: CardComponent[], river: CardComponent[]): boolean {
    let handWithRiver = hand.concat(river);
    if (handWithRiver.length < 5) {
      return false;
    } else {
      let possibleCombinations = this.getCombinations(handWithRiver, 5);

      for (let combination of possibleCombinations) {
        if (this.isStraight(hand, combination) && this.isFlush(hand, combination)) {
          return true;
        }
      }

      return false;
    }
  }

  isFourOfAKind(hand: CardComponent[], river: CardComponent[]): boolean {
    let handWithRiver = hand.concat(river);
    if (handWithRiver.length < 4) {
      return false;
    } else {
      // TODO: Implement this function
      // Vérifiez si la main contient quatre cartes du même rang
      let possibleCombinations = this.getCombinations(handWithRiver, 4);

      for (let combination of possibleCombinations) {
        if (combination[0].rank === combination[1].rank &&
          combination[0].rank === combination[2].rank &&
          combination[0].rank === combination[3].rank) {
          if (this.containsHandCards(combination, hand)) {
            return true;
          }
        }
      }
      return false;
    }
  }

  isFullHouse(hand: CardComponent[], river: CardComponent[]): boolean {
    let handWithRiver = hand.concat(river);
    if (handWithRiver.length < 5) {
      return false;
    } else {
      // TODO: Implement this function
      // Vérifiez si la main contient un brelan et une paire
      let threeOfAKind;
      let pair;

      let handCardsInThree = 0;
      let handCardsInPair = 0;


      let possibleCombinations = this.getCombinations(handWithRiver, 3);
      for (let combination of possibleCombinations) {
        if (combination[0].rank === combination[1].rank &&
          combination[0].rank === combination[2].rank) {
          if (threeOfAKind == undefined || threeOfAKind < combination[0].rank) {
            threeOfAKind = combination[0].rank;
            if (combination.includes(hand[0]) && combination.includes(hand[1])) {
              handCardsInThree = 2;
            }
            else if (combination.includes(hand[1]) || combination.includes(hand[0])) {
              handCardsInThree = 1;
            }
          }

        }
      }

      if (threeOfAKind != undefined) {
        let possibleCombinations2 = this.getCombinations(handWithRiver, 2);
        for (let combination of possibleCombinations2) {
          if (combination[0].rank === combination[1].rank) {
            if (combination[0].rank != threeOfAKind) {
              if (combination[0].rank !== threeOfAKind)
                if (pair == undefined || pair < combination[0].rank) {
                  pair = combination[0].rank;
                  if (combination.includes(hand[0]) && combination.includes(hand[1])) {
                    handCardsInPair = 2;
                  } else if (combination.includes(hand[1]) || combination.includes(hand[0])) {
                    handCardsInPair = 1;
                  }
                }



            }
          }
        }
      }

      if (threeOfAKind != undefined && pair != undefined && handCardsInThree + handCardsInPair == 2) {
        return true;
      }
      return false;
    }
  }

  isFlush(hand: CardComponent[], river: CardComponent[]): boolean {
    let handWithRiver = hand.concat(river);
    if (handWithRiver.length < 5) {
      return false;
    } else {
      // TODO: Implement this function
      // Vérifiez si la main contient une suite de cinq cartes de la même couleur
      let possibleCombinations = this.getCombinations(handWithRiver, 5);

      // Vérifier si l'une des mains possible contient une quinte royale
      for (let combination of possibleCombinations) {
        if (combination[0].suit === combination[1].suit &&
          combination[0].suit === combination[2].suit &&
          combination[0].suit === combination[3].suit &&
          combination[0].suit === combination[4].suit) {
          if (this.containsHandCards(combination, hand)) {
            return true;
          }

        }
      }
      return false;
    }
  }

  isStraight(hand: CardComponent[], river: CardComponent[]): boolean {
    let handWithRiver = hand.concat(river);
    if (handWithRiver.length < 5) {
      return false;
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
            if (this.containsHandCards(sortedHand.slice(i - 4, i + 1), hand)) {
              return true;
            }
          }
        } else if (this.rankToNumber(sortedHand[i].rank) !== this.rankToNumber(sortedHand[i + 1].rank)) {
          straightCount = 1;
        }
      }

      return false;
    }
  }

  isThreeOfAKind(hand: CardComponent[], river: CardComponent[]): boolean {
    let handWithRiver = hand.concat(river);
    if (handWithRiver.length < 3) {
      return false;
    } else {
      // TODO: Implement this function
      // Vérifiez si la main contient trois cartes du même rang
      let possibleCombinations = this.getCombinations(handWithRiver, 3);

      for (let combination of possibleCombinations) {
        if (combination[0].rank === combination[1].rank &&
          combination[0].rank === combination[2].rank) {
          return true;
        }
      }
      return false;
    }
  }

  isTwoPairs(hand: CardComponent[], river: CardComponent[]): boolean {
    let handWithRiver = hand.concat(river);
    let containsHandCard = false;
    if (handWithRiver.length < 4) {
      return false;
    } else {
      // TODO: Implement this function
      // Vérifiez si la main contient deux paires de cartes
      let possibleCombinations = this.getCombinations(handWithRiver, 2);
      let pairs = 0;

      for (let combination of possibleCombinations) {
        if (combination[0].rank === combination[1].rank) {
          pairs++;
          if (this.containsHandCards(combination, hand)) {
            containsHandCard = true;
          }
        }
      }

      if (pairs >= 2 && containsHandCard) {
        return true;
      }

      return false;
    }
  }

  isPair(hand: CardComponent[], river: CardComponent[]): boolean {
    let handWithRiver = hand.concat(river);
    if (handWithRiver.length < 2) {
      return false;
    } else {
      // TODO: Implement this function
      // Vérifiez si la main contient une paire de cartes
      let possibleCombinations = this.getCombinations(handWithRiver, 2);

      for (let combination of possibleCombinations) {
        if (combination[0].rank === combination[1].rank) {
          return true;
        }
      }
      return false;
    }
  }


  // isHandBetter(hand1: CardComponent[], hand2: CardComponent[]): boolean {
  //   let rank1 = this.evaluateHand(hand1);
  //   let rank2 = this.evaluateHand(hand2);
  //
  //   return rank1 > rank2;
  // }




}
