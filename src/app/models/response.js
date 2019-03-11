module.exports = (notificationList,data,response) => {
    if (notificationList.length > 0) {
        return response.status(400).send({ errors: notificationList });
    }
    response.send(data);
}