import java.util.ArrayList;

public class Player {
    String name;
    ArrayList<PlayingCard> Hand = new ArrayList<PlayingCard>();
    int Chips;

    public Player(String name){
        this.name = name;
    }
    public void PrintName(){
        System.out.print(name);
    }


    public void DisplayHand(){
        for(int i = 0;i < Hand.size();i++){
            System.out.print(Hand.get(i).rank + " of " + Hand.get(i).suit + "\n");
        }
    }
}
