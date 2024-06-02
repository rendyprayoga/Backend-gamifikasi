require('dotenv').config();
require('express-async-errors');

const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const logger = require('morgan');

const config = require('./config');
const contentType = require('./middleware/content-type');
const handleError = require('./middleware/handle-error');
const notFound = require('./middleware/not-found');
const coreApis = require('./routes/core/apis');
const coreAuth = require('./routes/core/auth');
// const coreFiles = require('./routes/core/files');
const coreRoles = require('./routes/core/roles');
const coreUsers = require('./routes/core/users');
const coreSettings = require('./routes/core/settings');
const corePeople = require('./routes/core/people');
const coreCategories = require('./routes/core/categories');
const coreQuestions = require('./routes/core/questions');
const coreAnswer = require('./routes/core/answers');
const coreReports = require('./routes/core/reports');
const coreRanks = require('./routes/core/ranks');

// const v1Auth = require('./routes/v1/auth');
// const v1Images = require('./routes/v1/images');
// const v1Users = require('./routes/v1/users');
// const v1Settings = require('./routes/v1/settings');
// const v1Categories = require('./routes/v1/categories');
// const v1Questions = require('./routes/v1/questions');
// const v1Submissions = require('./routes/v1/submissions');

const app = express();

app.set('trust proxy', true);

app.use(logger('dev'));
app.use(
  helmet({
    contentSecurityPolicy: false,
    hsts: { preload: true, maxAge: 63072000 },
  })
);
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'static')));
// Needs to be placed before cors, because cors middleware short circuit OPTIONS
// method.
app.use(contentType('json'));
app.use(cors({ origin: config.cors.origin }));

app.use('/cms', express.static(process.env.CMS_BUILD_PATH || '/cms'));
app.use('/core/apis', coreApis);
app.use('/core/auth', coreAuth);
// app.use('/core/files', coreFiles);
app.use('/core/roles', coreRoles);
app.use('/core/users', coreUsers);
app.use('/core/settings', coreSettings);
app.use('/core/people', corePeople);
app.use('/core/categories', coreCategories);
app.use('/core/questions', coreQuestions);
app.use('/core/answers', coreAnswer);
app.use('/core/reports', coreReports);
app.use('/core/ranks', coreRanks);

// app.use('/v1/auth', v1Auth);
// app.use('/v1/images', v1Images);
// app.use('/v1/users', v1Users);
// app.use('/v1/settings', v1Settings);
// app.use('/v1/categories', v1Categories);
// app.use('/v1/questions', v1Questions);
// app.use('/v1/submissions', v1Submissions);

app.use(notFound);
app.use(handleError);

module.exports = app;
