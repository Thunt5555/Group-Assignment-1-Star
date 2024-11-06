import org.junit.Assert;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.*;
import java.util.ArrayList;

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
    void PrintnameTest(){
        temp.PrintName();
    }
    @Test
    void SortHand(){
        temp.Hand.add(new PlayingCard("2","Spades"));
        temp.Hand.add(new PlayingCard("6","Hearts"));
        temp.Hand.add(new PlayingCard("4","Clubs"));
        temp.Hand.add(new PlayingCard("Ace","Diamonds"));
        temp.DisplayHand();
        temp.Sort_Hand();
        temp.DisplayHand();
    }


    @Test
    void PickingCards(){
        int[] indices = new int[4];
        indices[0] = 0;
        indices[1] = 1;
        indices[2] = 2;
        indices[3] = 3;
        temp.Hand.add(new PlayingCard("Ace","Spades"));
        temp.Hand.add(new PlayingCard("Ace","Hearts"));
        temp.Hand.add(new PlayingCard("Ace","Clubs"));
        temp.Hand.add(new PlayingCard("Ace","Diamonds"));
        temp.Pick_Cards(indices);
        temp.DisplayHand();
    }

    @Test
    void GetAcesTest(){
        temp.Hand.add(new PlayingCard("2","Spades"));
        temp.Hand.add(new PlayingCard("3","Hearts"));
        temp.Hand.add(new PlayingCard("4","Clubs"));
        temp.Hand.add(new PlayingCard("Ace","Diamonds"));
        Assert.assertTrue(temp.Get_Aces());
    }
}