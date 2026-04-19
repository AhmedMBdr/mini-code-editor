package assign;

import java.io.IOException;

public class Main {
        public static void main(String[] args) throws IOException {
            
            sortContext context = new sortContext(new BubbleSort());
            context.sortFile("D:\\assign\\text.txt");
        }
}
