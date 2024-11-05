import org.junit.Assert;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.*;

import static org.junit.jupiter.api.Assertions.*;

class PlayerTest {

    Player temp = new Player("Carl");


    @Test
    void printName() {
        Assert.assertEquals("Carl",temp.name);
    }

    @Test
    void card_AppendChoice() {
        temp.Hand.add(new PlayingCard("Ace","Spades"));
        temp.Hand.add(new PlayingCard("Ace","Hearts"));
        temp.Hand.add(new PlayingCard("Ace","Clubs"));
        temp.Hand.add(new PlayingCard("Ace","Diamonds"));
        temp.Card_AppendChoice(2);
        Assert.assertEquals(3,temp.Hand.size());
    }

    @Test
    void displayHand() {
        temp.Hand.add(new PlayingCard("Ace","Spades"));
        temp.Hand.add(new PlayingCard("Ace","Hearts"));
        temp.Hand.add(new PlayingCard("Ace","Clubs"));
        temp.Hand.add(new PlayingCard("Ace","Diamonds"));
        Assert.assertEquals(4,temp.DisplayHand());
    }


    @Test
    void PickingCards(){
        InputStream systemIn = System.in;
        ByteArrayInputStream in = new ByteArrayInputStream("0".getBytes());
        temp.Hand.add(new PlayingCard("Ace","Spades"));
        temp.Hand.add(new PlayingCard("Ace","Hearts"));
        temp.Hand.add(new PlayingCard("Ace","Clubs"));
        temp.Hand.add(new PlayingCard("Ace","Diamonds"));
        temp.Pick_Cards();
    }
}