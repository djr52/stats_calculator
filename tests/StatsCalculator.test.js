const StatsCalculator = require('../StatsCalculator');
const jstat = require('jstat');
let calc = new StatsCalculator();

// RANDOM MODULE
test('Random integer between 10 and 100', () => {
    calc.randomIntNoSeed(10,100);
    expect(calc.result).toBeGreaterThanOrEqual(10);
    expect(calc.result).toBeLessThanOrEqual(100);
});
test('Random float number between 10 and 100', () => {
    calc.randomFlNoSeed(10,100);
    expect(calc.result).toBeGreaterThanOrEqual(10);
    expect(calc.result).toBeLessThanOrEqual(100);
});
test('Random integer between 10 and 100, with seed', () => {
    calc.randomIntSeed(100, 10, 100);
    expect(calc.result).toBeGreaterThanOrEqual(10);
    expect(calc.result).toBeLessThanOrEqual(100);
});
test('Random float number between 10 and 100, with seed', () => {
    calc.randomFlSeed(100, 10, 100);
    expect(calc.result).toBeGreaterThanOrEqual(10);
    expect(calc.result).toBeLessThanOrEqual(100);
});
test('Random list of random seeded numbers, between 10 and 100', () => {
    let size = 10;
    calc.randomIntListSeeded(100, 10, 100, size);
    expect(calc.result).toHaveLength(10);
});
test('Random list of seeded float numbers, between 10 and 100', () => {
    let size = 10;
    calc.randomFlListSeeded(100, 10, 100, size);
    expect(calc.result).toHaveLength(10);
});
test('Selects random item in a list, within a range of 10 to 100', () => {
    let size = 10;
    let arrList = Random.randomIntListSeeded(100, 10, 100, size);
    calc.selectRandomItem(arrList);
    expect(arrList).toContain(calc.result);
});
test('Selects random seeded item in a list, within a range of 10 to 100', () => {
    let size = 10;
    let arrList = Random.randomIntListSeeded(100, 10, 100, size);
    calc.selectRandomItem(arrList);
    expect(arrList).toContain(calc.result);
});
test('Select 5 random items from an established list', () => {
    let size = 10;
    let arrList = Random.randomIntListSeeded(100, 10, 100, size);
    calc.selectNItems(arrList, 5);
    expect(calc.result).toHaveLength(5);
});
test('Selects 5 seeded random items from an established list', () => {
    let size = 10;
    let arrList = Random.randomIntListSeeded(100, 10, 100, size);
    calc.selectNItemsSeeded(100, arrList, 5);
    expect(calc.result).toHaveLength(5);
});

// DESCRIPTIVE MODULE
test('mean', () => {
    let arr = Random.randomIntListSeeded(100, -100, 100, 10);
    calc.mean(arr);
    expect(calc.result).toEqual(jstat.mean(arr));
});
test('median', () => {
    let arr = Random.randomIntListSeeded(100, -100, 100, 100);
    calc.median(arr);
    expect(calc.result).toEqual(jstat.median(arr));
});
test('mode', () => {
    let arr = Random.randomIntListSeeded(100, -100, 100, 100);
    calc.mode(arr);
    expect(calc.result).toEqual(jstat.mode(arr));
});
test('variance', () => {
    let arr = Random.randomIntListSeeded(100, -100, 100, 10);
    calc.variance(arr);
    let val = calc.result.toFixed(4);
    let actual = jstat.variance(arr, true).toFixed(4);
    expect(val).toEqual(actual);
});
test('variance', () => {
    let arr = Random.randomIntListSeeded(100, -100, 100, 10);
    calc.stdDev(arr);
    let val = calc.result.toFixed(4);
    let actual = jstat.stdev(arr, true).toFixed(4);
    expect(val).toEqual(actual);
});
test('quartiles', () => {
    for (let n = 8; n < 12; n++) {
        let arr = Random.randomIntListSeeded(100, -100, 100, n);
        calc.quartiles(arr);
        let actual = jstat.quartiles(arr);
        expect(calc.result).toHaveLength(3);
    }
});
test('skewness', () => {
    let arr = Random.randomIntListSeeded(100, -100, 100, 100);
    calc.skewness(arr);
    let val = calc.result.toFixed(4);
    let actual = jstat.skewness(arr).toFixed(4);
    expect(val).toEqual(actual);
});
test('sample correlation', () => {
    let xArr = Random.randomIntListSeeded(100, -100, 100, 100);
    let m = Random.randomIntSeed(100, -10, 10);
    let b = Random.randomIntSeed(100, -10, 10);
    let yArr = xArr.map((x) => x*m + b);
    calc.sample_correlation(xArr, yArr);
    let actual = jstat.corrcoeff(xArr, yArr);
    let percError = 10;
    let lowerBound = Math.min(actual * (1 - percError/100), actual * (1 + percError/100));
    let upperBound = Math.max(actual * (1 - percError/100), actual * (1 + percError/100));
    expect(calc.result).toBeGreaterThanOrEqual(lowerBound);
    expect(calc.result).toBeLessThanOrEqual(upperBound);
});
test('z_score', () => {
    let arr = Random.randomIntListSeeded(100, -100, 100, 100);
    let mean = Descriptive.mean(arr);
    let stdDev = Descriptive.stdDev(arr);
    let x = arr[0];
    calc.z_score(x, mean, stdDev);
    let val = calc.result.toFixed(4);
    let actual = jstat.zscore(x, mean, stdDev).toFixed(4);
    expect(val).toEqual(actual);
});
test('meanDeviation', () => {
    let arr = Random.randomIntListSeeded(100, -100, 100, 100);
    calc.meanDeviation(arr);
    let val = calc.result.toFixed(4);
    let actual = jstat.meandev(arr).toFixed(4);
    expect(val).toEqual(actual);
});
test('population correlation', () => {
    let xArr = Random.randomIntListSeeded(100, -100, 100, 100);
    let m = Random.randomIntSeed(100, -10, 10);
    let b = Random.randomIntSeed(100, -10, 10);
    let yArr = xArr.map((x) => x*m + b);
    calc.population_correlation(xArr, yArr);
    let val = calc.result.toFixed(4);
    let actual = jstat.corrcoeff(xArr, yArr).toFixed(4);
    expect(val).toEqual(actual);
});

// SAMPLING MODULE
test('Simple random sampling', () => {
    let size = 10;
    let arrList = Random.randomIntListSeeded(100, 10, 100, size);
    let sampleSize = Random.randomIntSeed(100, 1, size - 1);
    calc.simpleRandSample(arrList, sampleSize, 100);
    expect(calc.result).toHaveLength(sampleSize);
});
test('Systematic random sampling', () => {
    let size = 10;
    let arrList = Random.randomIntListSeeded(100, 10, 100, size);
    let sampleSize = Random.randomIntSeed(100,1, size - 1);
    calc.systematicSample(arrList, sampleSize);
    expect(calc.result).toHaveLength(sampleSize);
});
test('Get z-score from confidence level', () => {
    calc.getZFromConfidence(95);
    expect(calc.result).toEqual(1.96);
});
test('Find margin of error', () => {
    let size = 10;
    let sampleArr = Random.randomIntListSeeded(100, -100, 100, size);
    let confidence = Math.floor(Random.randomIntSeed(100, 50, 95) /  5) * 5;
    calc.marginOfError(sampleArr, confidence);
    expect(calc.result).toBeGreaterThan(0);
});
test('Confidence interval', () => {
    let size = 10;
    let sampleArr = Random.randomIntListSeeded(100, -100, 100, size);
    let confidence = Math.floor(Random.randomIntSeed(100, 50, 95) /  5) * 5;
    calc.confidenceInterval(sampleArr, confidence);
    let mean = Descriptive.mean(sampleArr);
    expect(calc.result).toHaveLength(2);
    expect(calc.result[0]).toBeLessThan(mean);
    expect(calc.result[1]).toBeGreaterThan(mean);
});
test('Cochran sample size', () => {
    calc.cochranFormula(95, 5);
    expect(calc.result).toEqual(385);
});
test('Finding sample size', () => {
    let size = 10;
    let sampleArr = Random.randomIntListSeeded(100, -100, 100, size);
    let confidence = Math.floor(Random.randomIntSeed(100, 50, 95) /  5) * 5;
    let stdDev = Descriptive.stdDev(sampleArr);
    calc.findSampleSizeNoStdDev(95,10, 0.5);
    expect(calc.result).toBeGreaterThan(0);
});