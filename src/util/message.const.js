
const statusMessage = {
    SUCCESS: "successfull",
    BAD_REQUEST: "bad request",
    NOT_FOUND: "not found",
    ERROR_SERVER: "error from server",
    SERVER_CLOSE: "server is close"
}

const updateMessage = {
    SUCCESS: "update successfully",
    FAILD: "update failed"
}

const createMessage = {
    SUCCESS: "create successfully",
    FAILD: "create failed",
    EXISTING: 'existing'
}

const deleteMessage = {
    SUCCESS: "delete successfully",
    FAILD: "delete failed"
}


module.exports = {
    statusMessage,
    updateMessage,
    createMessage,
    deleteMessage
}