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



    public void Play_Cards(int player){
        for(int i = 0;i<Current_Players.get(player).Choices_ToPlay.size();i++){
            Current_Pile.add(Current_Players.get(player).Choices_ToPlay.get(i));
        }
    }

    public void Print_Pile(){
        for(int i = 0;i<Current_Pile.size();i++){
            System.out.print(Current_Pile.get(i));
        }
    }



}
