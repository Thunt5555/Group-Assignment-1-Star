import java.util.*;
import java.io.*;
import java.util.ArrayList;
import java.util.List;

public class Game {
    Game_Room Current_Game_Room = new Game_Room();
    ArrayList<Player> Turn_Order = new ArrayList<>();

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



}
