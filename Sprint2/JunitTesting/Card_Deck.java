//Author Tim Hunt
import java.util.Random;
import java.util.*;
public class Card_Deck {

String suit[] = {"Hearts", "Clubs", "Diamonds", "Spades"};
String rank[] = {"2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King", "Ace"};

ArrayList<PlayingCard> deck_of_cards = new ArrayList<PlayingCard>();

public ArrayList<PlayingCard> initDeck() {
    int num = 0;

    for (int i = 0; i < 4; i++) {
        for(int j = 0;j<13;j++){
            deck_of_cards.add(new PlayingCard(rank[j], suit[i]));
        }
    }
    return deck_of_cards;
}

public ArrayList<PlayingCard> shuffleDeck(){
    Random rand = new Random();
    for(int i = 0; i<51;i++){
        int randy = rand.nextInt(52);
        PlayingCard temp = deck_of_cards.get(i);
        deck_of_cards.set(i,deck_of_cards.get(randy));
        deck_of_cards.set(randy, temp);
    }
    return deck_of_cards;
}

}


