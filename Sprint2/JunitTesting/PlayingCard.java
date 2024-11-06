public class PlayingCard {
    String rank;
    String suit;

    public PlayingCard(String rank, String suit){
        this.rank = rank;
        this.suit = suit;
    }

    public String Print_Card(){
        System.out.print(rank + " of " + suit + "\n");
        return rank + " of " + suit;
    }

    public String Get_Rank(){
        return rank;
    }
    public String Get_Suit(){
        return suit;
    }
}
