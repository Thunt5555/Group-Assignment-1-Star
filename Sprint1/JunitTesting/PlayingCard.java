public class PlayingCard {
    String rank;
    String suit;

    public PlayingCard(String rank, String suit){
        this.rank = rank;
        this.suit = suit;
    }

    public void Print_Card(){
        System.out.print(rank + " of " + suit + "\n");
    }
}
