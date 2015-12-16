
var express = require('express');
var router = express.Router();

var quizController = require('./controllers/quiz.server.controller.js');
var subjectController = require('./controllers/subject.server.controller.js');


var securedQuizController = require('./controllers/quiz.secure.controller.js');
var securedSubjectController = require('./controllers/subject.secure.controller.js');

var securedUserController = require('./controllers/user.server.controller.js');
var securedTestController = require('./controllers/test.secure.controller.js');

router.get('/quizzes', quizController.get);
router.get('/quizzes/subject/:subject', quizController.getBySubject);
router.get('/quizzes/:id', quizController.getQuiz);
router.get('/subjects', subjectController.get);

router.get('/s/quizzes/editlist', securedQuizController.getForEditList);
router.get('/s/quizzes/:id', securedQuizController.getForEdit);

router.post('/s/subjects', securedSubjectController.post);
router.post('/s/quizzes', securedQuizController.post);
router.put('/s/quizzes/:id', securedQuizController.put);
router.post('/s/quizzes/:id/publish', securedQuizController.publish);

router.get('/s/users', securedUserController.get);
router.get('/s/users/:id', securedUserController.getById);
router.get('/s/user/me', securedUserController.getMyDetails);
router.post('/s/users/:id/perm', securedUserController.changePerm);

router.post('/s/test/updateprogress', securedTestController.updateProgress);
router.post('/s/test/submit', securedTestController.submitTest);
router.post('/s/test/:id/start', securedTestController.startTest);
router.get('/s/my/tests', securedTestController.myAttemptedTests);

module.exports = router;