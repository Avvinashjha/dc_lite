Implement `StockSpanner`, which receives stock prices one day at a time and keeps its history between calls.

- `new StockSpanner()` creates an instance with no recorded prices.
- `next(price)` records today's price and returns its **span**: the number of consecutive days ending today whose prices are all less than or equal to today's price.

Include today, so every returned span is at least `1`. Stop when you reach an earlier price that is strictly greater than today's price; do not skip that day to count older prices. Equal prices are included.

For prices `[100, 80, 60, 70, 60, 75, 85]`, the returned spans are `[1, 1, 1, 2, 1, 4, 6]`. On the day priced `75`, the consecutive prices `[60, 70, 60, 75]` qualify, but the preceding `80` stops the span.

The examples use `constructorArgs = []` and `operations = [["next", price], ...]`. Each example creates a fresh instance, and its output lists the results of the calls in order.
