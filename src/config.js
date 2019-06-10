class Config {
    constructor(page = 1, size = 60) {
        this.url = 'https://xueqiu.com/service/v5/stock/screener/quote/list?';
        this.params = {
            page: page,
            size: size,
            order: 'desc',
            orderby: 'percent',
            order_by: 'percent',
            market: 'CN',
            type: 'sh_sz',
            _: +new Date()
        };
    }

    getUrl() {
        return `${this.url}${this.buildParams()}`;
    }

    buildParams() {
        let ret = [];
        for (let key in this.params) {
            ret.push(`${key}=${this.params[key]}`);
        }
        return ret.join('&');
    }

    nextPage() {
        this.params.page++;
    }
}

module.exports = Config;
