const { v4: uuid } = require('uuid');
const path = require('path');

const presId = 1;
const quizId = 1;

let presData = {
    url: "images/121/",
    slideNum: 12,
    quizNum: 1,
    slides: [
        {
            idx: 0,
            name: "green.png",
            kind: "slide",
            questionKind: "",
            quizId: 0,
            width: 600,
            height: 300,
            fontSize: "",
            question: "",
            votes: [],
            background: "",
            fontColor: "",
            graphColor: "",
        },
        {
            idx: 1,
            name: "example.png",
            kind: "question",
            questionKind: "horizontal",
            question: "Как настроение?",
            quizId: 0,
            width: 600,
            height: 300,
            fontSize: "",
            votes: [
                {
                    idx: 0,
                    option: "Хорошее",
                    votes: 2,
                    color: "red",
                },
                {
                    idx: 0,
                    option: "Отличное",
                    votes: 5,
                    color: "blue",
                },
            ],
            background: "white",
            fontColor: "#000000",
            graphColor: "#000000",
        },
        {
            idx: 2,
            name: "",
            kind: "slide",
            questionKind: "",
            quizId: 0,
            width: 600,
            height: 300,
            fontSize: "",
            question: "",
            votes: [],
            background: "",
            fontColor: "",
            graphColor: "",
        },
        {
            idx: 3,
            name: "",
            kind: "slide",
            questionKind: "",
            quizId: 0,
            width: 600,
            height: 300,
            fontSize: "",
            question: "",
            votes: [],
            background: "",
            fontColor: "",
            graphColor: "",
        },
        {
            idx: 4,
            name: "",
            kind: "slide",
            questionKind: "",
            quizId: 0,
            width: 600,
            height: 300,
            fontSize: "",
            question: "",
            votes: [],
            background: "",
            fontColor: "",
            graphColor: "",
        },
        {
            idx: 5,
            name: "",
            kind: "slide",
            questionKind: "",
            quizId: 0,
            width: 600,
            height: 300,
            fontSize: "",
            question: "",
            votes: [],
            background: "",
            fontColor: "",
            graphColor: "",
        },
        {
            idx: 6,
            name: "",
            kind: "slide",
            questionKind: "",
            quizId: 0,
            width: 600,
            height: 300,
            fontSize: "",
            question: "",
            votes: [],
            background: "",
            fontColor: "",
            graphColor: "",
        },
        {
            idx: 7,
            name: "",
            kind: "slide",
            questionKind: "",
            quizId: 0,
            width: 600,
            height: 300,
            fontSize: "",
            question: "",
            votes: [],
            background: "",
            fontColor: "",
            graphColor: "",
        },
        {
            idx: 8,
            name: "",
            kind: "slide",
            questionKind: "",
            quizId: 0,
            width: 600,
            height: 300,
            fontSize: "",
            question: "",
            votes: [],
            background: "",
            fontColor: "",
            graphColor: "",
        },
        {
            idx: 9,
            name: "",
            kind: "slide",
            questionKind: "",
            quizId: 0,
            width: 600,
            height: 300,
            fontSize: "",
            question: "",
            votes: [],
            background: "",
            fontColor: "",
            graphColor: "",
        },
        {
            idx: 10,
            name: "",
            kind: "slide",
            questionKind: "",
            quizId: 0,
            width: 600,
            height: 300,
            fontSize: "",
            question: "",
            votes: [],
            background: "",
            fontColor: "",
            graphColor: "",
        },
        {
            idx: 11,
            name: "",
            kind: "slide",
            questionKind: "",
            quizId: 0,
            width: 600,
            height: 300,
            fontSize: "",
            question: "",
            votes: [],
            background: "",
            fontColor: "",
            graphColor: "",
        },

    ]
}

const users = {
    "a@a.ru": {
      name: "aaaaaa",
      email: "a@a.ru",
      password: 'password1',
      avatarSrc: "server/images/adventures.webp",
    },
};

const ids = {};
const id = uuid();
ids[id] = "a@a.ru";

const startServer = (app) => {

    app.get('/api/v1/authcheck', (req, res) => {
        res.json({
            // "ID": "1",
        });
    });
    app.post("/presentation/create", function (req, res) {
        res.json({
            presId: presId
        });
    });

    app.get(`/presentation/${presId}`, function (req, res) {
        res.json({pres: presData})
    });

    app.post('/quiz/create', function (req, res) {
        res.json({
            quizId: 1
        })
    });

    app.post('/quiz/delete', function (req, res) {
        res.json({

        })
    });

    app.put('/quiz/update', function (req, res) {
        res.json({

        })
    });

    app.post('/quiz/vote/create', function (req, res) {
        res.json({

        })
    });

    app.post('/quiz/vote/delete', function (req, res) {
        res.json({

        })
    });

    app.put('/quiz/vote/update', function (req, res) {
        res.json({

        })
    });

    app.post("/api/v1/login", function (req, res) {
        const password = req.body.password;
        const email = req.body.email;
        if (!password || !email) {
        return res.status(400).json({ error: 'Не указан E-Mail или пароль' });
        }
        if (!users[email] || users[email].password !== password) {
        return res.status(200).send('Не верный E-Mail и/или пароль');
        }

        const ID = uuid();
        ids[ID] = email;

        res.cookie('podvorot', ID, { expires: new Date(Date.now() + 1000 * 60 * 10) });
        res.status(200).json({
            ID: 1,
            imgsrc: "server/images/adventures.webp",
            username: users[email].name,
            email: email,
        });
    });

    app.post("/api/v1/logout", function (req, res) {
        res.status(200).json({
        status: 200,
        });
    });


}

module.exports = startServer;