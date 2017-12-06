function Message(status, message) {
    this.status = status;
    this.success = false;
    this.message = message;
    if (this.status === 200) {
        this.success = true;
    }
}

Message.prototype.send = function (res) {
    res.status(this.status).json({"message": this.message, success: this.status});
};

module.exports = Message;