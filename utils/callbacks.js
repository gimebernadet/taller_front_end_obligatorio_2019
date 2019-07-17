module.exports = function callback(err, result, operation, model, isList, res) {
    if (err) {
        console.log(`ERROR in ${operation} ${model}`, err);
        res.status(err.status).end(err.toString());
    } else if (!result && !isList) {
        console.log(`ERROR in ${operation} ${model}`, err);
        res.status(err.status).end(err.toString());
    } else if (!result) {
        console.log(`${operation} ${model} is empty`);
        res.send(JSON.stringify([]));
    } else {
        console.log(`${operation} ${model} succeded`);
        res.send(JSON.stringify(teams));
    }
}