module.exports = function () {
    let text = 'Hello, this is a test npm package'
    return {
        init: () => {
            console.log(text)
        }

    }
}