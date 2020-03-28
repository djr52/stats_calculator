const Random = require('./Random');
const Descriptive = require('./Descriptive');

// map desired confidence levels (as a %) to z-score
// calculated using data taken from https://www.normaltable.com
const percToZScore = new Map([
    [1, 0.01], [2, 0.02], [3, 0.04], [4, 0.05], [5, 0.06], [6, 0.08], [7, 0.09], [8, 0.1], [9, 0.11], [10, 0.13],
    [11, 0.14], [12, 0.15], [13, 0.16], [14, 0.18], [15, 0.19], [16, 0.2], [17, 0.21], [18, 0.23], [19, 0.24], [20, 0.25],
    [21, 0.27], [22, 0.28], [23, 0.29], [24, 0.31], [25, 0.32], [26, 0.33], [27, 0.35], [28, 0.36], [29, 0.37], [30, 0.39],
    [31, 0.4], [32, 0.41], [33, 0.43], [34, 0.44], [35, 0.45], [36, 0.47], [37, 0.48], [38, 0.5], [39, 0.51], [40, 0.52],
    [41, 0.54], [42, 0.55], [43, 0.57], [44, 0.58], [45, 0.6], [46, 0.61], [47, 0.63], [48, 0.64], [49, 0.66], [50, 0.67],
    [51, 0.69], [52, 0.71], [53, 0.72], [54, 0.74], [55, 0.76], [56, 0.77], [57, 0.79], [58, 0.81], [59, 0.82], [60, 0.84],
    [61, 0.86], [62, 0.88], [63, 0.9], [64, 0.92], [65, 0.93], [66, 0.95], [67, 0.97], [68, 0.99], [69, 1.02], [70, 1.04],
    [71, 1.06], [72, 1.08], [73, 1.1], [74, 1.13], [75, 1.15], [76, 1.17], [77, 1.2], [78, 1.23], [79, 1.25], [80, 1.28],
    [81, 1.31], [82, 1.34], [83, 1.37], [84, 1.41], [85, 1.44], [86, 1.48], [87, 1.51], [88, 1.55], [89, 1.6], [90, 1.64],
    [91, 1.7], [92, 1.75], [93, 1.81], [94, 1.88], [95, 1.96], [96, 2.05], [97, 2.17], [98, 2.33], [99, 2.57]
]);

class Sampling {
    static getZFromConfidence(confidence) {
        if ( (typeof confidence !== 'number') || (confidence < 1) || (confidence >= 100) ){
            throw "ERROR: bad input to function Sampling.getZFromConfidence()";
        }
        let perc = Math.floor(confidence);
        return percToZScore.get(perc);
    }

    static simpleRandSample(arrList, sampleSize, seed=100) {
        // pick a simple random sample from array, with replacement and optional seed
        return Random.selectNItemsSeeded(seed, arrList, sampleSize);
    }

    static systematicSample(arrList, sampleSize) {
        // perform 1-in-k sampling, beginning at random element in arrList
        let sample = [];
        let k = Math.floor(arrList.length / sampleSize);
        let startIdx = Random.randomIntNoSeed(0, arrList.length);
        let i = startIdx;
        while (i < arrList.length) {
            if (sample.length < sampleSize) {
                sample.push(arrList[i]);
            }
            i += k;
        }
        i -= arrList.length; // end of list, wrap around to beginning
        for (let i = 0; i < startIdx; i += k) {
            if (sample.length < sampleSize) {
                sample.push(arrList[i]);
            }
            i += k;
        }
        return sample;
    }

    static marginOfError(sampleArr, confidence=95) {
        // given array and confidence level as a percent, return moe
        let z = Sampling.getZFromConfidence(confidence); // 2-sided z-test of sample
        return z * Descriptive.stdDev(sampleArr) / (sampleArr.length ** 0.5);
    }

    static confidenceInterval(sampleArr, confidence=95) {
        //Get all values needed for the Confidence Interval formula
        if (sampleArr.length === 0) {
            throw("ERROR: Empty array, cannot divide by 0");
        }

        let mean = Descriptive.mean(sampleArr);
        let moe = Sampling.marginOfError(sampleArr, confidence);
        return [mean - moe, mean + moe];
    }

    static cochranFormula(confidence, error, p=0.5, N=null) {
        // return recommended sample size given desired confidence (%) and precision/error (%)
        // if p is not known or not provided, takes the maximal value of 0.5
        // if N is provided (because it's "small"), correction is made
        let z = Sampling.getZFromConfidence(confidence);
        let n = z**2 * p * (1-p) / (error/100)**2;
        if (N !== null) {
            n = n / (1 + (n - 1)/N);
        }
        return Math.ceil(n);
    }

    static findSampleSizeNoStdDev(confidence, width, p=0.5) {
        return Sampling.cochranFormula(confidence, width/2, p);
    }

    static findSampleSizeWithStdDev(confidence, width, stdDev) {
        let z = Sampling.getZFromConfidence(confidence);
        return (z * stdDev / width) ** 2;
    }
}

module.exports = Sampling;