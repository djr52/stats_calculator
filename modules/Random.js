const seedrandom = require('seedrandom');

class Random {
    //Gets a random integer (without seed)
    static randomIntNoSeed(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    //Gets a random float number (without seed)
    static randomFlNoSeed(min, max) {
        let decimalPlaces = Math.pow(10 ,2); //Sets decimal place to 2
        let randomNo = Math.random() * (max - min) + min;
        return Math.floor(randomNo * decimalPlaces) / decimalPlaces;
    }

    //Get a random integer using a seed
    static randomIntSeed(seed, min, max) {
        seedrandom(seed, { global: true });
        return Math.floor(Math.random() * (max - min) + min);
    }

    //Generates a random seeded float number
    static randomFlSeed(seed, min, max) {
        seedrandom(seed, { global: true });
        let decimalPlaces = Math.pow(10 ,2); //Sets decimal place to 2
        let randomNo = Math.random() * (max - min) + min;
        return Math.floor(randomNo * decimalPlaces) / decimalPlaces;
    }

    //Creates a seeded decimal list
    static randomFlListSeeded(seed, min, max, n) {
        let randArray = [];
        seedrandom(seed, { global: true });
        let decimalPlaces = Math.pow(10 ,2); //Sets decimal place to 2

        for(let i = 0; i < n; i++ ) {
            let randomNo = Math.random() * (max - min) + min;
            randArray[i] = Math.floor(randomNo * decimalPlaces) / decimalPlaces;
        }
        return randArray;
    }

    //Creates a int list of seeded items
    static randomIntListSeeded(seed, min, max, n) {
        let randArray = [];
        seedrandom(seed, { global: true });

        for(let i = 0; i < n; i++ ){
            randArray[i] = Math.floor(Math.random() * (max - min) + min);

        }
        return randArray;
    }

    //Selects random Item
    static selectRandomItem(arrList) {
        let randItem = Math.floor(Math.random() * arrList.length);
        return arrList[randItem];
    }

    //Selects a random seeded item
    static selectRandomSeededItem(seed, arrList) {
        seedrandom(seed, { global: true });
        let randItem = Math.floor(Math.random() * arrList.length);
        return arrList[randItem];
    }

    //Selects N amount of random items, with replacement
    static selectNItems(arrList, n) {
        let newList = [];
        let randItemInList;
        if(n <= arrList.length && n > 0)
        {
            for(let i = 0; i < n; i++)
            {
                randItemInList = arrList[Math.floor(Math.random() * arrList.length)];
                newList[i] = randItemInList;
            }
            return newList;
        }
    }

    //Selects N amount of seeded items, with replacement
    static selectNItemsSeeded(seed, arrList, n) {
        seedrandom(seed, { global: true });
        let newSeededList = [];
        let randItemInList;
        if(n <= arrList.length && n > 0)
        {
            for(let i = 0; i < n; i++)
            {
                randItemInList = arrList[Math.floor(Math.random() * arrList.length)];
                newSeededList[i] = randItemInList;
            }
            return newSeededList;
        }
    }
}

module.exports = Random;