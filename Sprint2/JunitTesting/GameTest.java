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
        int[] indices = new int[] {0,5,4,2};
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alex"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexa"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexei"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexandra"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexander"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexar"));
        GameUse.Current_Game_Room.Deal();
        GameUse.Current_Game_Room.Sort_Higher();
        GameUse.Turn_Order_Init();
        GameUse.Take_Turn(indices);
        GameUse.Take_Turn(indices);
        GameUse.Take_Turn(indices);
        //System.out.print(GameUse.Current_Game_Room.Current_Pile.size());
        int counter = 0;
        for(int i = 0;i < GameUse.Current_Game_Room.Current_Pile.get(2).size()-1 ;i++){
            if(GameUse.Current_Game_Room.Current_Pile.get(2).get(i).rank.equals(GameUse.Current_Game_Room.Current_Pile.get(2).get(0).rank) && GameUse.Current_Game_Room.Current_Pile.get(2).get(i).rank.equals(GameUse.rank_ordering[(GameUse.Number_of_Turns-1) % 13])){
                counter += 1;
            }
        }
        if(counter == 4){
            Assert.assertTrue(GameUse.Call_BS(GameUse.Turn_Order.get(4)));
        }
        else {
            Assert.assertTrue(!GameUse.Call_BS(GameUse.Turn_Order.get(4)));
        }
    }


    @Test
    void who_Played_Last() {
        int[] indices = new int[] {0,5,4,2};
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alex"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexa"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexei"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexandra"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexander"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexar"));
        GameUse.Current_Game_Room.Deal();
        GameUse.Current_Game_Room.Sort_Higher();
        GameUse.Turn_Order_Init();
        GameUse.Take_Turn(indices);
        GameUse.Take_Turn(indices);
        GameUse.Take_Turn(indices);
        Assert.assertEquals(2,GameUse.Who_Played_Last());
    }


    @Test
    void current_Rank() {
        int[] indices = new int[] {0,5,4,2};
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alex"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexa"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexei"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexandra"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexander"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexar"));
        GameUse.Current_Game_Room.Deal();
        GameUse.Current_Game_Room.Sort_Higher();
        GameUse.Turn_Order_Init();
        GameUse.Take_Turn(indices);
        GameUse.Take_Turn(indices);
        GameUse.Take_Turn(indices);
        Assert.assertEquals("4",GameUse.Current_Rank());
    }


    @Test
    void current_Turn() {
        int[] indices = new int[] {0,5,4,2};
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alex"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexa"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexei"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexandra"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexander"));
        GameUse.Current_Game_Room.Current_Players.add(new Player("Alexar"));
        GameUse.Current_Game_Room.Deal();
        GameUse.Current_Game_Room.Sort_Higher();
        GameUse.Turn_Order_Init();
        GameUse.Take_Turn(indices);
        GameUse.Take_Turn(indices);
        GameUse.Take_Turn(indices);
        Assert.assertEquals(3,GameUse.Current_Turn());
    }


    @Test
    void take_Turn(){
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
        GameUse.Take_Turn(indices);
        GameUse.Take_Turn(indices);
        GameUse.Current_Game_Room.Print_Pile();
    }


    @Test
    void Add_to_Hand(){
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
        GameUse.Take_Turn(indices);
        GameUse.Take_Turn(indices);
        GameUse.Take_Turn(indices);
        GameUse.Add_To_Hand(GameUse.Turn_Order.get(4));
        Assert.assertTrue(GameUse.Current_Game_Room.Current_Pile.isEmpty());
        //Testing the output to ensure accuracy
        //System.out.print("Last Turn \n");
        //GameUse.Turn_Order.get(2).DisplayHand();
        //System.out.print("Accuser \n");
        //GameUse.Turn_Order.get(4).DisplayHand();
        //System.out.print("Now Pile" + "\n");
        //GameUse.Current_Game_Room.Print_Pile();
    }
}
