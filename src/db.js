const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const stockSchema = new Schema({
    symbol: String, // 股票代码
    name: String,   // 股票名称
});

const Stocks = mongoose.model('stocks', stockSchema);

const singleSchema = new Schema({
    symbol: String,
    name: String,
    timestamp: Number,
    vol: Number,
    open: Number,
    high: Number,
    low: Number,
    close: Number,
    percent: Number,
});

const Singles = mongoose.model('singles', singleSchema);

module.exports = {
    Stocks: Stocks,
    Singles: Singles,
}