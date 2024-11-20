import java.util.*;
import java.io.*;
import java.util.ArrayList;
import java.util.List;


public class Game_Room {
    Card_Deck House_Deck = new Card_Deck();
    ArrayList<Player> Current_Players = new ArrayList<Player>();
    ArrayList<ArrayList<PlayingCard>> Current_Pile = new ArrayList<ArrayList<PlayingCard>>();
    String rank_ordering[] = {"Ace" ,"2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"};

    public void Deal(){
        House_Deck.initDeck();
        House_Deck.shuffleDeck();
        for(int i = 0;i<House_Deck.deck_of_cards.size();i++){
            Current_Players.get(i%Current_Players.size()).Hand.add(House_Deck.deck_of_cards.get(i));

        }
    }

    public ArrayList<PlayingCard> BS_Grab(){
        return Current_Pile.get(Current_Pile.size() -1);
    }

    public boolean Current_Pile_Check(){
        return Current_Pile.isEmpty();
    }

    public void Sort_Higher(){
        for(int i = 0;i<Current_Players.size();i++){
            Current_Players.get(i).Sort_Hand();
        }
    }



    public void Play_Cards(Player player){
        ArrayList<PlayingCard> temp = new ArrayList<>();
        for(int i = 0;i<player.Choices_ToPlay.size();i++){
            temp.add(player.Choices_ToPlay.get(i));
        }
        Current_Pile.add(temp);
        player.Choices_ToPlay.clear();

    }

    public int Print_Pile() {
        int num = 0;
        for (int i = 0; i < Current_Pile.size(); i++) {
            for (int j = 0; j < Current_Pile.get(i).size(); j++) {
                System.out.print(Current_Pile.get(i).get(j).Get_Rank() + " of " + Current_Pile.get(i).get(j).Get_Suit() + "\n");
                num += 1;
            }
        }
        return num;
    }

    //Checks to see which player in join order has an ace to start the game
    public int First_Player(){
        for(int i = 0; i<Current_Players.size();i++){
            if(Current_Players.get(i).Get_Aces() == true){
                return i;
            }
        }
        return 10;
    }




}
