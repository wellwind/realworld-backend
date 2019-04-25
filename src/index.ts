import bodyParser from 'body-parser';
import express from 'express';
import * as articleController from './apis/articles';
import * as authController from './apis/users';
import * as authUtils from './utils/auth';
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

var router = express.Router();

router.post('/users/login', authController.login);
router.get('/articles', articleController.articles);
router.post('/articles', authUtils.verifyTokenMiddleware, articleController.createArticle);

app.use('/api', router);
app.listen(port);
console.log(`Dev server listening ${port}`);
