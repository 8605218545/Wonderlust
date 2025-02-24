

class ExpressError extends Error {
    constructor(statusCode, message){
        super()
        this.StatusCode = statusCode,
        this.message = message
    }
} 

module.exports = ExpressError;