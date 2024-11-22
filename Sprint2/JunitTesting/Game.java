import java.util.*;
import java.io.*;
import java.util.ArrayList;
import java.util.List;


public class Game {
    Game_Room Current_Game_Room = new Game_Room();
    ArrayList<Player> Turn_Order = new ArrayList<>();
    String rank_ordering[] = {"Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"};
    int Number_of_Turns = 0;
    String Winner;


    //Adds players in order to the turn order
    public void Turn_Order_Init(){
        int first_player;
        first_player = Current_Game_Room.First_Player();
        for(int i = first_player;i<Current_Game_Room.Current_Players.size();i++){
            Turn_Order.add(Current_Game_Room.Current_Players.get(i));
        }
        if(first_player != 0){
            for(int i = 0;i<first_player -1; i++){
                Turn_Order.add(Current_Game_Room.Current_Players.get(i));
            }
        }
    }


    public void Take_Turn(int[] Choices) {
        //System.out.print("\n" + Number_of_Turns % Turn_Order.size() + "\n");
        Turn_Order.get(Number_of_Turns % Turn_Order.size() ).Pick_Cards(Choices);


        Current_Game_Room.Play_Cards(Turn_Order.get(Number_of_Turns % Turn_Order.size() ));
        if(Turn_Order.get(Number_of_Turns % Turn_Order.size()).Hand.isEmpty()){
            Winner = Turn_Order.get(Number_of_Turns % Turn_Order.size()).name;
        }
        Number_of_Turns += 1;
    }


    //Calls the last cards played and checks it against what the suit should have been
    public boolean Call_BS(Player Call){
        if(Current_Game_Room.Current_Pile_Check()){
            return false;
        }
        ArrayList<PlayingCard> Checking = new ArrayList<>();
        //Grabs the last collection of cards played together
        Checking = Current_Game_Room.BS_Grab();
        for(int i = 0; i<Checking.size() - 1;i++){
            //Checks if the current card is not equal to prior rank
            if(!Checking.get(i).rank.equals(rank_ordering[(Number_of_Turns-1) % 13])){
                //System.out.print("Ifcase Game \n");
                Add_To_Hand(Turn_Order.get((Number_of_Turns-1)%Turn_Order.size()));
                //Add_To_Hand(Call);
                return false;
            }
        }
        //Only is called if all cards played are of the correct rank
        //System.out.print("elsecase Game \n");
        Add_To_Hand(Call);
        //Add_To_Hand(Turn_Order.get((Number_of_Turns-1)%Turn_Order.size()));
        return true;
    }


    public void Add_To_Hand(Player Call){
        for(int i = 0;i<Current_Game_Room.Current_Pile.size();i++) {
            for (int j = 0;j<Current_Game_Room.Current_Pile.get(i).size();j++){
                Call.Hand.add(Current_Game_Room.Current_Pile.get(i).get(j));
            }
        }
        Current_Game_Room.Current_Pile.clear();
    }


    public int Who_Played_Last(){
        if(Number_of_Turns % Turn_Order.size() != 0) {
            return (Number_of_Turns - 1) % Turn_Order.size();
        }
        else{
            return Turn_Order.size() -1;
        }
    }


    //Tracks what suit it is supposed to be
    public String Current_Rank(){
        return rank_ordering[Number_of_Turns%13];
    }


    //Tracks Whose Turn it is
    public int Current_Turn(){
        return Number_of_Turns % Turn_Order.size();
    }






}
