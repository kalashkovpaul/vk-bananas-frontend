const { v4: uuid } = require('uuid');
const path = require('path');

const presId = 1;
const quizId = 1;

let presData = {
    url: "/images/121/",
    slideNum: 12,
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
        // {
        //     idx: 4,
        //     name: "",
        //     kind: "slide",
        //     type: "",
        //     quizId: 0,
        //     fontSize: "",
        //     question: "",
        //     votes: [],
        //     background: "",
        //     fontColor: "",
        //     graphColor: "",
        // },
        // {
        //     idx: 5,
        //     name: "",
        //     kind: "slide",
        //     type: "",
        //     quizId: 0,
        //     fontSize: "",
        //     question: "",
        //     votes: [],
        //     background: "",
        //     fontColor: "",
        //     graphColor: "",
        // },
        // {
        //     idx: 6,
        //     name: "",
        //     kind: "slide",
        //     type: "",
        //     quizId: 0,
        //     fontSize: "",
        //     question: "",
        //     votes: [],
        //     background: "",
        //     fontColor: "",
        //     graphColor: "",
        // },
        // {
        //     idx: 7,
        //     name: "",
        //     kind: "slide",
        //     type: "",
        //     quizId: 0,
        //     fontSize: "",
        //     question: "",
        //     votes: [],
        //     background: "",
        //     fontColor: "",
        //     graphColor: "",
        // },
        // {
        //     idx: 8,
        //     name: "",
        //     kind: "slide",
        //     type: "",
        //     quizId: 0,
        //     fontSize: "",
        //     question: "",
        //     votes: [],
        //     background: "",
        //     fontColor: "",
        //     graphColor: "",
        // },
        // {
        //     idx: 9,
        //     name: "",
        //     kind: "slide",
        //     type: "",
        //     quizId: 0,
        //     fontSize: "",
        //     question: "",
        //     votes: [],
        //     background: "",
        //     fontColor: "",
        //     graphColor: "",
        // },
        // {
        //     idx: 10,
        //     name: "",
        //     kind: "slide",
        //     type: "",
        //     quizId: 0,
        //     fontSize: "",
        //     question: "",
        //     votes: [],
        //     background: "",
        //     fontColor: "",
        //     graphColor: "",
        // },
        // {
        //     idx: 11,
        //     name: "",
        //     kind: "slide",
        //     type: "",
        //     quizId: 0,
        //     fontSize: "",
        //     question: "",
        //     votes: [],
        //     background: "",
        //     fontColor: "",
        //     graphColor: "",
        // },

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

const emotions = {
    like: 1,
    love: 2,
    laughter: 3,
    surprise: 4,
    sad: 5,
};

const userQuestions =
[
    // {
    //     idx: 0,
    //     question: "Что связывал гордиев узел?",
    //     likes: 9,
    // },
    // {
    //     idx: 1,
    //     question: "А как я буду звать Красную Шапочку, если она снимет красную шапочку?",
    //     likes: 8,
    // },
    // {
    //     idx: 2,
    //     question: "Почему утконос, а не уткоклюв?",
    //     likes: 13,
    // },
    // {
    //     idx: 3,
    //     question: "Если мы должны следовать некоторым правилам во что бы то ни стало, зачем существуют исключения из таких правил?",
    //     likes: 7,
    // },
    // {
    //     idx: 4,
    //     question: "Почему ванильное мороженное желтого цвета, если сама ваниль коричневая?",
    //     likes: 6,
    // },
    // {
    //     idx: 5,
    //     question: "Если прорыть тоннель через центр Земли и прыгнуть в него, мы будем лететь вниз или вверх?",
    //     likes: 8,
    // },
    // {
    //     idx: 6,
    //     question: "Почему есть фраза “Спит как младенец”, означающая крепкий сон, если младенцы, наоборот, плохо спят?",
    //     likes: 13,
    // },
    // {
    //     idx: 7,
    //     question: "У человеческих достижений есть долговременное вселенское значение, или с концом света исчезнет все, чего мы добились?",
    //     likes: 7,
    // },
    // {
    //     idx: 8,
    //     question: "Как далеко заходят лысые люди, когда умываются?",
    //     likes: 6,
    // },
    // {
    //     idx: 9,
    //     question: "Если дерево упадет в лесу, но никто его не услышит, издало ли оно звук при падении?",
    //     likes: 9,
    // },
    // {
    //     idx: 10,
    //     question: "Если помидоры являются фруктами, можно ли считать кетчуп смузи?",
    //     likes: 4,
    // },
    // {
    //     idx: 11,
    //     question: "Чего пытался добиться человек, который впервые подоил корову?",
    //     likes: 6,
    // },
    // {
    //     idx: 12,
    //     question: "Можно ли стоять лицом назад на лестничном пролете?",
    //     likes: 12,
    // },
    // {
    //     idx: 13,
    //     question: "Какого цвета зеркало?",
    //     likes: 40,
    // },
    // {
    //     idx: 14,
    //     question: "Если нам было весело, когда мы потратили время, можно ли это время называть потраченным?",
    //     likes: 9,
    // },
    // {
    //     idx: 15,
    //     question: "Какой подлокотник ваш в кинотеатре?",
    //     likes: 4,
    // },
    // {
    //     idx: 16,
    //     question: "Откуда мы знаем, что видим цвета так же, как и другие люди - красное, они видят, как синее, но все равно называют это красным?",
    //     likes: 13,
    // },
    // {
    //     idx: 17,
    //     question: "Был ли промежуток во времени, в который ничего не существовало или всегда было что-то?",
    //     likes: 1,
    // },
    // {
    //     idx: 18,
    //     question: "Был ли промежуток во времени, в который ничего не существовало или всегда было что-то?",
    //     likes: 1,
    // },
    // {
    //     idx: 19,
    //     question: "Был ли промежуток во времени, в который ничего не существовало или всегда было что-то?",
    //     likes: 1,
    // },
    // {
    //     idx: 20,
    //     question: "Если зомби укусит вампира, вампир станет зомби или зомби станет вампиром?",
    //     likes: 12,
    // },
    // {
    //     idx: 21,
    //     question: "Как далеко нужно зайти на восток, чтобы начать идти на запад?",
    //     likes: 14,
    // },
    // {
    //     idx: 22,
    //     question: "Когда небо прекращает быть частично солнечным и становится частично облачным?",
    //     likes: 12,
    // },
    // {
    //     idx: 23,
    //     question: "Если ожидать неожиданное, станет ли неожиданное ожидаемым?",
    //     likes: 7,
    // },
    // {
    //     idx: 25,
    //     question: "Если заменить все детали корабля по очереди, пока не останется ни одной оригинальной, это будет тот же или другой корабль?",
    //     likes: 12,
    // },
];

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
    // let e = emotions;
    app.get("/api/v1/presentation/view/a1b2c3d4", function(req, res) {
        index++;
        // let keys = Object.keys(e);
        // e[keys[ keys.length * Math.random() << 0]]+=3;
        // presData.slides[1].votes[0].votes++;
        if (index > 3)
            index = 0;
        res.json({
            viewMode: true,
            width: presData.width,
            height: presData.height,
            url: presData.url,
            emotions: emotions,
            slide: presData.slides[0],
            questions: userQuestions,
        });
    });

}

module.exports = startServer;