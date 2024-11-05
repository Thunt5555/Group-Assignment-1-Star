import org.junit.Assert;
import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import java.util.*;
public class DeckTest {
    Card_Deck temp = new Card_Deck();

    //Tests to make sure the deck is properly initialized
    //Makes sure that every last card of a suit is present and accounted for
    @Test
    public void initTest(){
        Assert.assertEquals(temp.initDeck(),temp.initDeck());
        for(int i = 0;i<52;i++) {
            System.out.print(temp.deck_of_cards.get(i).rank + " of ");
            System.out.print(temp.deck_of_cards.get(i).suit + "\n");
        }
        Assert.assertEquals("Ace", temp.deck_of_cards.get(12).rank);
        Assert.assertEquals("Hearts",temp.deck_of_cards.get(12).suit);
        Assert.assertEquals("Ace",temp.deck_of_cards.get(25).rank);
        Assert.assertEquals("Clubs",temp.deck_of_cards.get(25).suit);
        Assert.assertEquals("Ace",temp.deck_of_cards.get(38).rank);
        Assert.assertEquals("Diamonds",temp.deck_of_cards.get(38).suit);
        Assert.assertEquals("Ace",temp.deck_of_cards.get(51).rank);
        Assert.assertEquals("Spades",temp.deck_of_cards.get(51).suit);
    }

    //Designed to check and make sure cards were not overwritten
    // as to make sure the same number of every suit is present
    @Test
    public void shuffleTest(){
        int counterspades = 0;
        int counterdiamonds = 0;
        int counterclubs = 0;
        int counterhearts = 0;
        temp.initDeck();
        temp.shuffleDeck();
        Assert.assertTrue(temp.initDeck().get(0) != temp.shuffleDeck().get(0));
        for(int i = 0;i<52;i++) {
            if (temp.deck_of_cards.get(i).suit == "Spades") {
                counterspades += 1;
            }
            if(temp.deck_of_cards.get(i).suit == "Hearts"){
                counterhearts +=1;
            }
            if(temp.deck_of_cards.get(i).suit == "Clubs"){
                counterclubs +=1;
            }
            if(temp.deck_of_cards.get(i).suit == "Diamonds"){
                counterdiamonds +=1;
            }
        }
        Assert.assertEquals(13,counterclubs);
        Assert.assertEquals(13,counterhearts);
        Assert.assertEquals(13,counterspades);
        Assert.assertEquals(13,counterdiamonds);

    }
}
