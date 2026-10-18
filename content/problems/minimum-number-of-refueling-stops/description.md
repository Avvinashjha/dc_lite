A car begins a trip with `startFuel` units of fuel in its tank and must travel a distance of `target`. Along the route sit several gas stations, each given as a `[position, fuel]` pair describing its location and how much fuel it adds to the tank. One unit of fuel covers one unit of distance. Work out the fewest refueling stops needed to reach (or pass) `target`, or return `-1` if the car can't make it.

The tank has unlimited capacity. At a station you may take all its fuel once or skip it. Reaching a station or the destination with exactly zero fuel is allowed. You may only take fuel from stations you can reach; passing a station without refueling does not count as a stop.

In Example 1, take 60 units at position 10 and 40 units at position 60. These two stops provide enough fuel to reach the target.
