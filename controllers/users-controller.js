const usersService = require('../services/users-service');

module.exports = (app) => {
    app.get('/api/users', (req, res) =>
        usersService.findAllUsers()
            .then(allUsers => res.send(allUsers)));

    app.get('/api/users/:uid', (req, res) =>
        usersService.findUserById(req.params.uid)
            .then(user=> res.send(user)));

    app.post("/api/users/register", (req, res) =>
        usersService.register(req.body)
            .then(user => {
                if (isNaN(user)) {
                    req.session["profile"] = user;
                    res.send(user)
                } else {
                    res.sendStatus(user)
                }
            }));

    app.post("/api/users/login", (req, res) =>
        usersService.login(req.body)
            .then(user => {
                if (isNaN(user)) {
                    req.session["profile"] = user;
                    res.send(user)
                } else {
                    res.sendStatus(user)
                }
            }));

    app.get("/api/users/logout", (req, res) => {
        req.session.destroy();
        res.sendStatus(200)
    });

    app.get("/api/users/profile", (req, res) => {
        console.log(req.session["profile"]);
        const user = req.session["profile"];
        if (user) {
            res.send(user)
        } else {
            res.send({})
        }
    });

    app.put('/api/users/:uid', (req, res) =>
        usersService.updateUser(req.params.uid, req.body)
            .then(user => {
                if (isNaN(user)) {
                    req.session["profile"] = user;
                    res.send(user)
                } else {
                    res.sendStatus(user)
                }
            }));

    app.post('/api/users/:uid/seekers', (req, res) => {
        usersService.findUserById(req.params.uid)
            .then(foundUser => {
                if (foundUser.interestedUsers.find(ele => ele === req.body._id) === undefined) {
                    usersService.createSeekerForRecruiter(req.params.uid, req.body)
                        .then(seeker => res.send(seeker));
                } else {
                    // each else statement need a res.send
                    res.send("Already added!");
                }
            })
    });

    app.get('/api/users/:uid/seekers', (req, res) =>
        usersService.findSeekersForUser(req.params.uid)
            .then(seekers => res.send(seekers)));

    app.delete('/api/users/:uid/seekers', (req, res) => {
        usersService.findUserById(req.params.uid)
            .then(foundUser => {
                if (foundUser.interestedUsers.find(ele => ele === req.body._id) === undefined) {
                    res.send("Not found");
                } else {
                    usersService.deleteSeekerForRecruiter(req.params.uid, req.body)
                        .then(seeker => res.send(seeker));
                }
            })
    });
};