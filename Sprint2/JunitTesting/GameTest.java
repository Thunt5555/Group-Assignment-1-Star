import org.junit.Assert;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class GameTest {

    Game GameUse = new Game();

    @Test
    void turn_Order_Init() {
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alex"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexa"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexei"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexandra"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexander"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexar"));
        GameUse.Current_Game_Room.Deal();
        GameUse.Current_Game_Room.Sort_Higher();
        GameUse.Turn_Order_Init();
        System.out.print(GameUse.Turn_Order.get(0).name + "\n");
        System.out.print(GameUse.Current_Game_Room.Current_Players.get(0).name);
    }

    @Test
    void call_BS() {
        int[] indices = new int[] {0,6,4,2};
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alex"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexa"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexei"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexandra"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexander"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexar"));
        GameUse.Current_Game_Room.Deal();
        GameUse.Current_Game_Room.Sort_Higher();
        GameUse.Turn_Order_Init();
        GameUse.Turn_Order.get(0).Pick_Cards(indices);
        GameUse.Turn_Order.get(1).Pick_Cards(indices);
        GameUse.Turn_Order.get(2).Pick_Cards(indices);
        GameUse.Current_Game_Room.Play_Cards(GameUse.Turn_Order.get(0));
        GameUse.Current_Game_Room.Play_Cards(GameUse.Turn_Order.get(1));
        GameUse.Current_Game_Room.Play_Cards(GameUse.Turn_Order.get(2));
        Assert.assertTrue(GameUse.Call_BS());
    }

    @Test
    void who_Played_Last() {
    }

    @Test
    void current_Rank() {
    }

    @Test
    void current_Turn() {
    }
}