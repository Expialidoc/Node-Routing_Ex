const express = require('express');

const app = express();
const ExpressError = require("./expressError")

app.use(express.json());

function createAndValidateArray(arr) {
    let result = [];

    for (let i = 0; i < arr.length; i++) {
        let valToNumber = Number(arr[i]);

        if (Number.isNaN(valToNumber)) {
            return new Error(
                `The value '${arr[i]}' at index ${i} is not a valid number.`
            );
        }
        result.push(valToNumber);
    }
    return result;
}

app.get("/mean", (req, res, next) => {
    if (!req.query.nums) {
        throw new ExpressError('Enter query key of nums with a comma-separated list of numbers.', 400)
    }
    let numsAsStrings = req.query.nums.split(',');
    let nums = createAndValidateArray(numsAsStrings);

    if (nums instanceof Error) {
        throw new ExpressError(nums.message);
    }

    const mean = nums.reduce((a, b) => (a + b)) / nums.length;
    //    return res.send(`The mean is: ${mean}`)
    return res.json({
        response: {
            operation: "mean",
            value: `${mean}`
        }
    })
})

app.get("/median", (req, res, next) => {
    if (!req.query.nums) {
        throw new ExpressError('Enter query key of nums with a comma-separated list of numbers.', 400)
    }
    let numsAsStrings = req.query.nums.split(',');
    let nums = createAndValidateArray(numsAsStrings);

    if (nums instanceof Error) {
        throw new ExpressError(nums.message);
    }
    nums.sort();
    let half = Math.floor(nums.length / 2);
    if (nums.length % 2) median = nums[half];
    median = (nums[half - 1] + nums[half]) / 2.0;

    return res.json({
        response: {
            operation: "median",
            value: `${median}`
        }
    })
})

app.get("/mode", (req, res, next) => {
    if (!req.query.nums) {
        throw new ExpressError('Enter query key of nums with a comma-separated list of numbers.', 400)
    }
    //    const { nums } = req.query;
    let numsAsStrings = req.query.nums.split(',');                 // console.log(numsAsStrings);
    let nums = createAndValidateArray(numsAsStrings);

    if (nums instanceof Error) {
        throw new ExpressError(nums.message);
    }
    const mode = Object.values(
        nums.reduce((count, e) => {
            if (!(e in count)) {
                count[e] = [0, e];
            }
            count[e][0]++;
            return count;
        }, {})
    ).reduce((a, v) => v[0] < a[0] ? a : v, [0, null])[1];
                                                                    // console.log(req.headers)
    //    return res.send(`The mode is: ${mode}`)
    return res.json({
        response: {
            operation: "mode",
            value: `${mode}`
        }
    })
})


/** general error handler */

app.use(function (req, res, next) {
    const err = new ExpressError("Not Found", 404);

    // pass the error to the next piece of middleware
    return next(err);
});

/** general error handler */

app.use(function (err, req, res, next) {
    res.status(err.status || 500);

    return res.json({
        error: err,
        message: err.message
    });
});


app.listen(3000, () => {
    console.log("Server running on port 3000")
});