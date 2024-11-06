import java.util.ArrayList;
import java.util.Arrays;
import java.util.Scanner;

public class Player {
    String name;
    ArrayList<PlayingCard> Hand = new ArrayList<PlayingCard>();
    int Chips;
    ArrayList<PlayingCard> Choices_ToPlay = new ArrayList<PlayingCard>();
    String rank_ordering[] = {"Ace" ,"2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"};

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

    public void Sort_Hand(){
        ArrayList<PlayingCard> temp_holder = new ArrayList<>();
        for(int i = 0;i<rank_ordering.length;i++){
            for(int j = Hand.size()-1;j>-1;j--){
                if(rank_ordering[i].equals(Hand.get(j).Get_Rank())){
                    temp_holder.add(Hand.get(j));
                }
            }
        }
        Hand = temp_holder;
    }

    public Boolean Get_Aces(){
        boolean Ace = false;
        for(int i = 0; i< Hand.size();i++){
            if(Hand.get(i).rank.equals("Ace")){
                //Card_AppendChoice(i);
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

    //Rewritten code to clean up and streamline some of the code
    public void Pick_Cards(int[] indices){
        Arrays.stream(indices).sorted();
        //System.out.print(indices.length + "\n");
        for(int i = 0; i < indices.length;i++){
            if(Choices_ToPlay.size() < 4){
                Choices_ToPlay.add(Hand.get(i));
                //System.out.print("Adding " + i + "\n");
            }
        }
        for(int i = indices.length-1; i > -1; i--){
            Hand.remove(indices[i]);
            //System.out.print("Subtracting " + i + "\n");
        }
    }

    //public int Take_Turn(){

    //}

}
