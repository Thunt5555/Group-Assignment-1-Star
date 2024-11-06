import org.junit.Assert;
import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;

public class Game_Room_Test {

    @Test
    public void Game_Room_Deal2(){
        Game_Room temproom = new Game_Room();
        temproom.Current_Players.add(new Player("Terry"));
        temproom.Current_Players.add(new Player("Larry"));
        temproom.Deal();
        for(int i = 0;i<temproom.Current_Players.size();i++){
            for(int j = 0; j<temproom.Current_Players.get(i).Hand.size();j++){
                temproom.Current_Players.get(i).Hand.get(j).Print_Card();
                System.out.print("\n");
                temproom.Current_Players.get(i).PrintName();
                System.out.print("\n");
            }
        }
        Assert.assertEquals(26,temproom.Current_Players.get(0).Hand.size());
    }

    @Test
    public void Test_Sort(){
        Game_Room temproom = new Game_Room();
        temproom.Current_Players.add(new Player("Terry"));
        temproom.Current_Players.add(new Player("Larry"));
        temproom.Current_Players.add(new Player("Merry"));
        temproom.Current_Players.add(new Player("Carry"));
        temproom.Deal();
        temproom.Current_Players.get(0).DisplayHand();
        System.out.print("\n");
        temproom.Sort_Higher();
        temproom.Current_Players.get(0).DisplayHand();
    }

    @Test
    public void Game_Room_Deal4(){
        Game_Room temproom = new Game_Room();
        temproom.Current_Players.add(new Player("Terry"));
        temproom.Current_Players.add(new Player("Larry"));
        temproom.Current_Players.add(new Player("Merry"));
        temproom.Current_Players.add(new Player("Carry"));
        temproom.Deal();
        for(int i = 0;i<temproom.Current_Players.size();i++){
            for(int j = 0; j<temproom.Current_Players.get(i).Hand.size();j++){
                temproom.Current_Players.get(i).Hand.get(j).Print_Card();
                System.out.print("\n");
                temproom.Current_Players.get(i).PrintName();
                System.out.print("\n");
            }
        }
        Assert.assertEquals(13,temproom.Current_Players.get(0).Hand.size());
        Assert.assertEquals(13,temproom.Current_Players.get(1).Hand.size());
        Assert.assertEquals(13,temproom.Current_Players.get(2).Hand.size());
        Assert.assertEquals(13,temproom.Current_Players.get(3).Hand.size());
    }


    //Tests to make sure that playing the cards designated operates the way it was intended to
    @Test
    public void Game_Room_Play_Card(){
        Game_Room temproom = new Game_Room();
        temproom.Current_Players.add(new Player("Terry"));
        temproom.Current_Players.add(new Player("Larry"));
        temproom.Current_Players.add(new Player("Carry"));
        temproom.Deal();
        temproom.Current_Players.get(0).Card_AppendChoice(0);
        temproom.Current_Players.get(0).Card_AppendChoice(0);
        temproom.Current_Players.get(0).Card_AppendChoice(0);
        temproom.Play_Cards(temproom.Current_Players.get(0));
        for(int i = 0; i<temproom.Current_Pile.size();i++){
            for(int j = 0;j<temproom.Current_Pile.get(i).size();j++)
                temproom.Current_Pile.get(i).get(j).Print_Card();
        }
    }
    @Test
    public void Game_Room_Print_Pile(){
        Game_Room temproom = new Game_Room();
        temproom.Current_Players.add(new Player("Terry"));
        temproom.Current_Players.add(new Player("Larry"));
        temproom.Current_Players.add(new Player("Carry"));
        temproom.Deal();
        int[] cardsplay = new int[]{7,4,2};
        temproom.Current_Players.get(0).Pick_Cards(cardsplay);
        temproom.Play_Cards(temproom.Current_Players.get(0));
        Assert.assertEquals(3,temproom.Print_Pile());
    }

    @Test
    public void BS_Grab_Test(){
        Game_Room temproom = new Game_Room();
        temproom.Current_Players.add(new Player("Terry"));
        temproom.Current_Players.add(new Player("Larry"));
        temproom.Current_Players.add(new Player("Carry"));
        temproom.Deal();
        int[] cardsplay = new int[]{7,4,2,3};
        temproom.Current_Players.get(0).Pick_Cards(cardsplay);
        temproom.Play_Cards(temproom.Current_Players.get(0));
        Assert.assertEquals(4,temproom.BS_Grab().size());
    }
    @Test
    public void First_Player_Test(){
        Game_Room temproom = new Game_Room();
        temproom.Current_Players.add(new Player("Terry"));
        temproom.Current_Players.add(new Player("Larry"));
        temproom.Current_Players.add(new Player("Carry"));
        temproom.Current_Players.add(new Player("Merry"));
        temproom.Current_Players.add(new Player("Berry"));
        temproom.Current_Players.add(new Player("Jerry"));
        temproom.Deal();
        //temproom.Current_Players.get(temproom.First_Player()).Sort_Hand();
        for(int i = 0;i<temproom.Current_Players.size();i++){
            temproom.Current_Players.get(i).Sort_Hand();
        }
        System.out.print(temproom.First_Player() + "\n");
        System.out.print(temproom.First_Player() + "\n");
        temproom.Current_Players.get(temproom.First_Player()).DisplayHand();
    }
}
