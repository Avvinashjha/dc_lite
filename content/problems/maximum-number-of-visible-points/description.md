From a fixed position `location` on a 2D plane, you may rotate your viewing direction freely but cannot move. Your field of view is a sector of width `angle` degrees. Return the maximum number of input points visible at the same time.

Points on either boundary of the sector count as visible. Distance does not limit visibility, and points do not block one another. Duplicate coordinates represent separate points and each counts. Points exactly at `location` are always visible, regardless of direction.

An angle of `360` sees every point. For narrower angles, the sector can cross any compass direction, including the boundary where angle measurements wrap around.
