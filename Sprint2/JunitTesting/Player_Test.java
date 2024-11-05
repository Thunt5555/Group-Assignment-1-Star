import org.junit.Assert;
import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;

public class Player_Test {

    Player temp = new Player("Carl");



    @Test
    public void Append_Choice_Test(){
        temp.Hand.add(new PlayingCard("Ace","Spades"));
        temp.Hand.add(new PlayingCard("Ace","Hearts"));
        temp.Hand.add(new PlayingCard("Ace","Clubs"));
        temp.Hand.add(new PlayingCard("Ace","Diamonds"));
        temp.Card_AppendChoice(2);
        for(int i = 0;i<temp.Hand.size();i++){
            temp.Hand.get(i).Print_Card();
        }

    }
}
