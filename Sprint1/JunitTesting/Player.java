import java.util.ArrayList;

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

    public void DisplayHand(){
        for(int i = 0;i < Hand.size();i++){
            System.out.print(Hand.get(i).rank + " of " + Hand.get(i).suit + "\n");
        }
    }
}
