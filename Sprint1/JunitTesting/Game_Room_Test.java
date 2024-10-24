import org.junit.Assert;
import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;

public class Game_Room_Test {

    @Test
    public void Game_Room_Deal(){
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
    public void Game_Room_Deal2(){
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

}
