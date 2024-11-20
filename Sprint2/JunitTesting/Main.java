import java.util.ArrayList;
import java.util.Scanner;

public class Main {
    public static void main(String[] args){
        Game tempGame = new Game();
        Scanner scan = new Scanner(System.in);
        System.out.print("How many players would you like? Please input a number between 2 and 6: ");
        int Playernum = scan.nextInt();
        //System.out.print("\n");
        while(!(Playernum > 1 && Playernum < 7)) {
            System.out.print("\nSorry! Unacceptable Player Count, it must be a number between 2 and 6 inclusively: ");
            Playernum = scan.nextInt();
        }
        scan.nextLine();
        for(int i =0;i<=Playernum-1;i++){
            System.out.print("Please type in your username: ");
            String NewPlayer = scan.nextLine();
            tempGame.Current_Game_Room.Current_Players.add(new Player(NewPlayer));
        }
        //Testing code
        for(int i = 0;i<tempGame.Current_Game_Room.Current_Players.size();i++){
           System.out.print(tempGame.Current_Game_Room.Current_Players.get(i).name + "\n");
        }

        tempGame.Current_Game_Room.Deal();
        tempGame.Turn_Order_Init();
        while(tempGame.Winner == null){
            System.out.print("it is: " +tempGame.Turn_Order.get(tempGame.Current_Turn()).name+ "'s turn, your hand is: \n");
            tempGame.Turn_Order.get(tempGame.Current_Turn()).Sort_Hand();
            tempGame.Turn_Order.get(tempGame.Current_Turn()).DisplayHand();
            System.out.print("The Current Rank Required is: " + tempGame.Current_Rank() + "\n");
            System.out.print("How many cards will you choose? It must be between 1 and 4: ");
            int NumOfCards = scan.nextInt();
            while(!(NumOfCards<5 && NumOfCards>0 && NumOfCards <= tempGame.Turn_Order.get(tempGame.Current_Turn()).Hand.size())){
                System.out.print("Invalid Selection, Pick again between 1 and 4 or the maximum number of cards possible: ");
                NumOfCards = scan.nextInt();
            }

            int[] index = new int[NumOfCards];
            ArrayList<Integer> tempArr = new ArrayList<Integer>();
            for(int i = 0;i<NumOfCards;i++){
                System.out.print("Please select valid indexes between 1 and " + tempGame.Turn_Order.get(tempGame.Current_Turn()).Hand.size() + " with no duplicates: ");
                int tempIndex = scan.nextInt();
                scan.nextLine();
                while(!(tempIndex > 0 && tempIndex <= tempGame.Turn_Order.get(tempGame.Current_Turn()).Hand.size() && !tempArr.contains(tempIndex-1) )){
                    System.out.print("Unusable index, pick again: ");
                    tempIndex = scan.nextInt();
                    scan.nextLine();
                }
                tempArr.add(tempIndex-1);
                index[i] = tempIndex-1;
            }
            tempGame.Take_Turn(index);
            for(int i = 0;i<tempGame.Turn_Order.size();i++){
                System.out.print("Would "+tempGame.Turn_Order.get((tempGame.Number_of_Turns+i) % tempGame.Turn_Order.size()).name+" Like to call BS? y/n: ");
                //scan.nextLine();
                String temp = scan.next();
                scan.nextLine();
                if(temp.equals("y")){
                    scan.nextLine();
                    if(tempGame.Call_BS(tempGame.Turn_Order.get(tempGame.Number_of_Turns+i % tempGame.Turn_Order.size()))){
                        System.out.print(tempGame.Turn_Order.get(tempGame.Number_of_Turns+i % tempGame.Turn_Order.size()).name+" was wrong! \n");
                    }
                    else {
                        System.out.print(tempGame.Turn_Order.get(tempGame.Number_of_Turns+i % tempGame.Turn_Order.size()).name+" was right! \n");
                    }
                    i = tempGame.Turn_Order.size();
                }
            }
            if(tempGame.Turn_Order.get((tempGame.Number_of_Turns-1) % tempGame.Turn_Order.size()).Hand.isEmpty()){
                tempGame.Winner = tempGame.Turn_Order.get((tempGame.Number_of_Turns-1) % tempGame.Turn_Order.size()).name;
            }
            //Testing acceptance
            //for (int i = 0;i<index.length;i++){
            //    System.out.print("Index is: " + index[i] + "\n");
            //}
            //tempGame.Winner = "Spongebob";
        }
        System.out.print("\n" + tempGame.Winner + " has won the Game! Congratulations!");
    }
}
