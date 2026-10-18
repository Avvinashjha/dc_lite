A row of cards is laid out in front of you, each worth some number of points. On each turn you can grab a card only from the front or the back of the row, and you must grab exactly `k` cards in total. Your score is the sum of the points on the cards you've collected. Return the highest score achievable.

You may switch ends between turns, but cannot take an interior card until it becomes an end card. Taking fewer than `k` cards is not allowed.

For `[9,1,1,9]` with `k = 2`, take one card from each end to score `18`. For `[1,100,2]` with `k = 1`, the answer is `2`: the middle card is not available.
