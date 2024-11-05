import java.util.ArrayList;
import java.util.Scanner;

public class Player {
    String name;
    ArrayList<PlayingCard> Hand = new ArrayList<PlayingCard>();
    int Chips;
    ArrayList<PlayingCard> Choices_ToPlay = new ArrayList<PlayingCard>();

    public Player(String name){
        this.name = name;
    }
    public void PrintName(){
        System.out.print(name);
    }

    public void Card_AppendChoice(int index){
        if(Choices_ToPlay.size() < 4) {
            Choices_ToPlay.add(Hand.get(index));
            Hand.remove(index);
        }
    }

    public Boolean Get_Aces(){
        boolean Ace = false;
        for(int i = 0; i< Hand.size();i++){
            if(Hand.get(i).rank == "Ace"){
                Card_AppendChoice(i);
                Ace = true;
            }
        }
        return Ace;
    }

    public int DisplayHand(){
        for(int i = 0;i < Hand.size();i++){
            System.out.print(Hand.get(i).rank + " of " + Hand.get(i).suit + "\n");
        }
        return Hand.size();
    }

    public void Pick_Cards(){
        Scanner scan_in = new Scanner(System.in);
        boolean keep_picking = true;
        while(Choices_ToPlay.size() < 3 && keep_picking != false){
            System.out.print("Please Select Card index: \n");
            Card_AppendChoice(Integer.parseInt(scan_in.next()));
            System.out.print("Would you like to select another card, y/n?: \n");
            keep_picking = scan_in.nextBoolean();
        }
    }

}
