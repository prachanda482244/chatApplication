export const getSender = (loggedUser, users) => {

    if (!users || users.length < 2) {
        return 'Group Created';
    }
    return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
}
export const getSenderFull = (loggedUser, users) => {

    if (!users || users.length < 2) {
        return 'Group Created';
    }
    return users[0]._id === loggedUser._id ? users[1] : users[0];
}