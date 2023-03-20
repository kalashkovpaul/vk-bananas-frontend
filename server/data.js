const { v4: uuid } = require('uuid');
const path = require('path');

const presId = 121;
const quizId = 1;

let presData = {
    url: "/images/121",
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
            fontSize: 16,
            question: "",
            vote: [],
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
            fontSize: 16,
            vote: [
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
            fontSize: 16,
            question: "",
            vote: [],
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
            fontSize: 16,
            question: "",
            vote: [],
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
            fontSize: 16,
            question: "",
            vote: [],
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
            fontSize: 16,
            question: "",
            vote: [],
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
            fontSize: 16,
            question: "",
            vote: [],
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
            fontSize: 16,
            question: "",
            vote: [],
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
            fontSize: 16,
            question: "",
            vote: [],
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
            fontSize: 16,
            question: "",
            vote: [],
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
            fontSize: 16,
            question: "",
            vote: [],
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
            fontSize: 16,
            question: "",
            vote: [],
            background: "",
            fontColor: "",
            graphColor: "",
        },

    ]
}

const startServer = (app) => {
  app.post("/presentation/create", function (req, res) {
    res.json({
        presId: presId
    });
  });

  app.get(`/presentation/${presId}`, function (req, res) {
    res.json(presData)
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

}

module.exports = startServer;