const Sampling = require('../modules/Sampling');
const Random = require('../modules/Random');
const Descriptive = require('../modules/Descriptive');
const jstat = require('jstat');
const seed = 10;
const verboseOutput = true;

test('Simple random sampling', () => {
    let size = 10;
    let arrList = Random.randomIntListSeeded(seed, 10, 100, size);
    let sampleSize = Random.randomIntSeed(seed, 1, size - 1);
    let sampleArr1 = Sampling.simpleRandSample(arrList, sampleSize, seed);
    let sampleArr2 = Sampling.simpleRandSample(arrList, sampleSize, seed);
    if (verboseOutput) {
        console.log('Simple random sample:', sampleArr1, "from", arrList);
    }
    expect(sampleArr1).toHaveLength(sampleSize);
    expect(sampleArr1).toEqual(sampleArr2);
});

test('Systematic random sampling', () => {
    let size = 10;
    let arrList = Random.randomIntListSeeded(seed, 10, 100, size);
    let sampleSize = Random.randomIntSeed(seed,1, size - 1);
    let sampleArr = Sampling.systematicSample(arrList, sampleSize);
    if (verboseOutput) {
        console.log('Systematic random sample:', sampleArr, "from", arrList);
    }
    expect(sampleArr).toHaveLength(sampleSize);
});

test('Get z-score from confidence level', () => {
    expect(Sampling.getZFromConfidence(80)).toEqual(1.28);
    expect(Sampling.getZFromConfidence(95)).toEqual(1.96);
});

test('Find margin of error', () => {
    let size = 10;
    let sampleArr = Random.randomIntListSeeded(seed, -100, 100, size);
    let confidence = Math.floor(Random.randomIntSeed(seed, 50, 95) /  5) * 5;
    let calc = Sampling.marginOfError(sampleArr, confidence);
    if (verboseOutput) {
        console.log("Array:", sampleArr);
        console.log("MoE is", calc, "with", confidence.toString() + "% confidence");
    }
    expect(calc).toBeGreaterThan(0);
});

test('Confidence interval', () => {
    let size = 10;
    let sampleArr = Random.randomIntListSeeded(seed, -100, 100, size);
    let confidence = Math.floor(Random.randomIntSeed(seed, 50, 95) /  5) * 5;
    let calc = Sampling.confidenceInterval(sampleArr, confidence);
    if (verboseOutput) {
        console.log("Array:", sampleArr);
        console.log("With", confidence.toString() + "% confidence, mean is in range", calc);
    }
    let mean = Descriptive.mean(sampleArr);
    expect(calc).toHaveLength(2);
    expect(calc[0]).toBeLessThan(mean);
    expect(calc[1]).toBeGreaterThan(mean);
});

test('Cochran sample size', () => {
    expect(Sampling.cochranFormula(95, 5)).toEqual(385);
    expect(Sampling.cochranFormula(95, 5, 0.5)).toEqual(385);
    expect(Sampling.cochranFormula(95, 5, 0.5, 1000)).toEqual(278);
});

test('Finding sample size', () => {
    let size = 10;
    let sampleArr = Random.randomIntListSeeded(seed, -100, 100, size);
    let confidence = Math.floor(Random.randomIntSeed(seed, 50, 95) /  5) * 5;
    let stdDev = Descriptive.stdDev(sampleArr);
    let n1 = Sampling.findSampleSizeNoStdDev(95,10, 0.5);
    let n2 = Sampling.findSampleSizeWithStdDev(95, 10, stdDev);
    if (verboseOutput) {
        console.log(n1, n2);
    }
    expect(n1).toBeGreaterThan(0);
    expect(n2).toBeGreaterThan(0);
});