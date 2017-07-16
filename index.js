let part1 = require('./src/module/index')

module.exports =  {

    init: () => {
            console.log('Hello, this is a test npm package')
        },
    method: part1.init
}