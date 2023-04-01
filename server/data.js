const { v4: uuid } = require('uuid');
const path = require('path');

const presId = 1;
const quizId = 1;

let presData = {
    url: "/images/121/",
    slideNum: 12,
    emotions: {
        like: 1,
        love: 2,
        laughter: 3,
        surprise: 4,
        sad: 5,
    },
    quizNum: 1,
    width: 600,
    height: 300,
    code: "1234",
    hash: "a1b2c3d4",
    slides: [
        {
            idx: 0,
            name: "green.png",
            kind: "slide",
            type: "",
            quizId: 0,
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
            type: "horizontal",
            question: "Как настроение?",
            quizId: 0,
            fontSize: "",
            votes: [
                {
                    idx: 0,
                    option: "Хорошее",
                    votes: 2,
                    color: "red",
                },
                {
                    idx: 1,
                    option: "Отличное",
                    votes: 5,
                    color: "blue",
                },
                {
                    idx: 2,
                    option: "Отличное",
                    votes: 5,
                    color: "blue",
                },
                {
                    idx: 3,
                    option: "Отличное",
                    votes: 5,
                    color: "blue",
                },
                {
                    idx: 4,
                    option: "Отличное",
                    votes: 5,
                    color: "blue",
                },
                {
                    idx: 5,
                    option: "Отличное",
                    votes: 5,
                    color: "blue",
                },
                {
                    idx: 6,
                    option: "Отличное",
                    votes: 5,
                    color: "blue",
                },
                {
                    idx: 7,
                    option: "Отличное",
                    votes: 5,
                    color: "blue",
                },
                {
                    idx: 8,
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
            name: "example.png",
            kind: "question",
            type: "doughnut",
            question: "Какое приветствие лучше всех?",
            quizId: 0,
            fontSize: "",
            votes: [
                {
                    idx: 0,
                    option: "Привет",
                    votes: 2,
                    color: "red",
                },
                {
                    idx: 1,
                    option: "Алоха",
                    votes: 5,
                    color: "blue",
                },
                {
                    idx: 2,
                    option: "*молчание*",
                    votes: 5,
                    color: "blue",
                },
            ],
            background: "white",
            fontColor: "#000000",
            graphColor: "#000000",
        },
        {
            idx: 3,
            name: "",
            kind: "slide",
            type: "",
            quizId: 0,
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
            type: "",
            quizId: 0,
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
            type: "",
            quizId: 0,
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
            type: "",
            quizId: 0,
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
            type: "",
            quizId: 0,
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
            type: "",
            quizId: 0,
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
            type: "",
            quizId: 0,
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
            type: "",
            quizId: 0,
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
            type: "",
            quizId: 0,
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

    app.get('/api/v1/user/session', (req, res) => {
        res.json({
            // "id": "1",
        });
    });
    app.post("/api/v1/presentation/create", function (req, res) {
        res.json({
            presId: presId
        });
    });

    app.get(`/api/v1/presentation/${presId}`, function (req, res) {
        res.json({pres: presData})
    });

    app.post('/api/v1/quiz/create', function (req, res) {
        res.json({
            quizId: 1
        })
    });

    app.post('/api/v1/quiz/delete', function (req, res) {
        res.json({

        })
    });

    app.put('/api/v1/quiz/update', function (req, res) {
        res.json({

        })
    });

    app.post('/api/v1/quiz/vote/create', function (req, res) {
        res.json({

        })
    });

    app.post('/api/v1/quiz/vote/delete', function (req, res) {
        res.json({

        })
    });

    app.put('/api/v1/quiz/vote/update', function (req, res) {
        res.json({

        })
    });

    app.post("/api/v1/user/login", function (req, res) {
        const password = req.body.password;
        const email = req.body.email;
        if (!password || !email) {
        return res.status(400).json({ error: 'Не указан E-Mail или пароль' });
        }
        if (!users[email] || users[email].password !== password) {
        return res.status(200).send('Не верный E-Mail и/или пароль');
        }

        const id = uuid();
        ids[id] = email;

        res.cookie('podvorot', id, { expires: new Date(Date.now() + 1000 * 60 * 10) });
        res.status(200).json({
            // id: 1,
            username: users[email].name,
            email: email,
            img: "",
        });
    });

    app.post("/api/v1/user/register", function (req, res) {
        const email = "a@a.ru";
        res.status(200).json({
            // id: 1,
            username: users[email].name,
            email: email,
            img: "",
        });
    });

    app.put("/api/v1/user/logout", function (req, res) {
        res.status(200).json({
        });
    });

    app.get("/api/v1/presentation/view/join/1234", function (req, res) {
        res.status(200).json({
            hash: "a1b2c3d4"
        });
    });

    let index = 1;
    app.get("/api/v1/presentation/view/a1b2c3d4", function(req, res) {
        index++;
        // presData.slides[1].votes[0].votes++;
        if (index > 3)
            index = 0;
        res.json({
            viewMode: true,
            width: presData.width,
            height: presData.height,
            url: presData.url,
            emotions: presData.emotions,
            slide: presData.slides[index]
        });
    });

}

module.exports = startServer;