import java.util.*;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class Game_Room {
    Card_Deck House_Deck = new Card_Deck();
    ArrayList<Player> Current_Players = new ArrayList<Player>();
    ArrayList<PlayingCard> Current_Pile = new ArrayList<PlayingCard>();

    public void Deal(){
        House_Deck.initDeck();
        House_Deck.shuffleDeck();
        for(int i = 0;i<House_Deck.deck_of_cards.size();i++){
            Current_Players.get(i%Current_Players.size()).Hand.add(House_Deck.deck_of_cards.get(i));

        }
    }
}
