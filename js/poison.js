// Codigo original: https://openprocessing.org/sketch/1552931 lyman zhang

// An implementation of "Fast Poisson Disk Sampling in Arbitrary Dimensions" (only for 2d)
//https://www.cs.ubc.ca/~rbridson/docs/bridson-siggraph07-poissondisk.pdf



function generatePoissonDiskPoints(rMinSpaceBetweenSamples, margin) {
	const startTime = millis();
	const kNumSamplesBeforeRejection = 30;
	const samples = [];
	const [grid, gridCellSize] = createGrid(rMinSpaceBetweenSamples);
	const activeListOfIxes = [];

	//Step 1: Select initial sample x0
	const x0 = randomScreenPosition();
	let indexOfFirstSample = 0;
	samples.push(x0);
	insertIndexIntoGrid(x0, indexOfFirstSample, grid, gridCellSize);
	activeListOfIxes.push(0);

	//Step 2: while active list not empty, choose a random ix from it...
	let numIterations = 0; //max to prevent hanging when task is too big
	while (activeListOfIxes.length > 0 && ++numIterations < 100000) {
		let i = random(activeListOfIxes);
		let numPointsGenerated = 0;
		let success = false;
		//Step 2 continued: 
		// ... generate up to k points chosen from the spherical annulus between r and 2r around 
		// the corresponding sample
		//
		// For each point check its distance from existing samples. (Use the grid to only check neighbours)
		//
		// If it is adequately far from existing samples, emit it as the next sample (i.e. add it to list of samples)
		// and add it to the active list.
		while (!success && ++numPointsGenerated <= kNumSamplesBeforeRejection) {
			const xi = samples[i];
			const pt = p5.Vector.random2D().mult(random(1, 2) * rMinSpaceBetweenSamples).add(xi);
			if (!withinBounds(pt)) {
				continue;
			}

			//Use grid to only test nearby samples
			const samplesToCheck = nearbySamplesFromGrid(pt, grid, gridCellSize, samples);
			const okSpaced = samplesToCheck.every(s => s.dist(pt) > rMinSpaceBetweenSamples);
			if (okSpaced) {
				success = true;
				samples.push(pt);
				newIx = samples.length - 1
				activeListOfIxes.push(newIx);
				insertIndexIntoGrid(pt, newIx, grid, gridCellSize);
			}
		}
		if (!success) {
			const ixToDelete = activeListOfIxes.indexOf(i);
			activeListOfIxes.splice(ixToDelete, 1)
		}
	}
	timeTaken = round(millis() - startTime);
	return samples;
}

function cellIndicesForPos(pos, gridCellSize) {
	let col = floor(pos.x / gridCellSize);
	let row = floor(pos.y / gridCellSize);
	return {
		col,
		row
	};
}

function createGrid(rMinSpaceBetweenSamples) {
	const grid = [];
	const gridCellSize = rMinSpaceBetweenSamples / sqrt(2);
	const numRows = ceil(height / gridCellSize)
	const numCols = ceil(width / gridCellSize)
	for (let col = 0; col < numCols; col++) {
		grid[col] = [];
		for (let row = 0; row < numRows; row++) {
			grid[col][row] = -1;
		}
	}
	return [grid, gridCellSize];
}

function insertIndexIntoGrid(pos, ix, grid, gridCellSize) {
	const {
		col,
		row
	} = cellIndicesForPos(pos, gridCellSize);
	grid[col][row] = ix;
}

function nearbySamplesFromGrid(pt, grid, gridCellSize, samples) {
	const {
		col,
		row
	} = cellIndicesForPos(pt, gridCellSize);
	const offsets = [];
	for (let x = -2; x <= 2; x++) {
		for (let y = -2; y <= 2; y++) {
			offsets.push([x, y]);
		}
	}

	const sampleIndices = offsets.map(([xOffset, yOffset]) => {
		const newCol = col + xOffset;
		const newRow = row + yOffset;
		if (newCol >= 0 && newCol < grid.length && newRow >= 0 && newRow <= grid[0].length) {
			return grid[col + xOffset][newRow]
		} else {
			return -1 //knowing that in the wider grid an index of -1 indicates no sample.
		}
	}).filter(ix => ix >= 0); // filter not only out-of-bounds indices, but also those for which there's no sample
	return sampleIndices.map(ix => samples[ix]);
}

function randomScreenPosition() {
	return createVector(random(width), random(height));
}

function withinBounds(p) {
	return p.x >= 0 && p.x <= width && p.y >= 0 && p.y <= height;
}

