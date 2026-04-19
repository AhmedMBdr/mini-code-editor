package assign.Task1;


public class sortContext {
    private SortStrategy strategy;

    public sortContext(SortStrategy strategy) {
        this.strategy = strategy;
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
