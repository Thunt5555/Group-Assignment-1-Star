import org.junit.Assert;
import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import java.util.Scanner;

public class CardTest {
    PlayingCard Ace_of_Spades = new PlayingCard("Ace", "Spades");

@Test
public void TestPlayingCardRank(){
    Assert.assertEquals("Ace",Ace_of_Spades.rank);
}
@Test
public void TestPlayingCardSuit(){
    Assert.assertEquals("Spades",Ace_of_Spades.suit);
}

@Test
public void PrintCardTest(){
    Ace_of_Spades.Print_Card();
    Assert.assertEquals("Ace of Spades",Ace_of_Spades.Print_Card());
}


}
