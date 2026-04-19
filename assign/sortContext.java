package assign;
import java.io.File;
import java.util.Scanner;
import java.io.FileWriter;
import java.io.IOException;
public class sortContext {
    private SortStrategy strategy;
    public sortContext(SortStrategy strategy) {
        this.strategy = strategy;
    }

    public void sortFile(String filePath) throws IOException {
        File file = new File(filePath);
        if (!file.exists()) {
            throw new IOException("File not found: " + filePath);            
        }
        Scanner scanner = new Scanner(file);
        String content = "";
        while (scanner.hasNextLine()) {
            content += scanner.nextLine() + "\n";
        }
        scanner.close();
        content = content.trim();
        if(content.isEmpty()) {
            throw new IOException("The file is empty: " + filePath);
        }
        String regex = "[,\\.\\s]+";
        String[] elements = content.split(regex);
        int[] array = new int[elements.length];
        for (int i = 0; i < elements.length; i++) {
            try {
                array[i] = Integer.parseInt(elements[i]);
            } catch (NumberFormatException e) {
                throw new IOException("Invalid number format in file: " + elements[i]);
            }
        }
        strategy.sort(array);
        try (FileWriter writer = new FileWriter(filePath)) {
            for (int num : array) {
                writer.write(num + " ");
            }
            writer.close();
        } catch (IOException e) {
            throw new IOException("Error writing to file: " + e.getMessage());
        }

    }
    public void setStrategy(SortStrategy strategy) {
        this.strategy = strategy;
    }

    public void sort(int[] array) {
        if (strategy == null) {
            throw new IllegalStateException("Sort strategy is not set.");
        }
        strategy.sort(array);
    }
}
