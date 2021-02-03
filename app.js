const createError     = require('http-errors');
const express         = require('express');
const path            = require('path');
const cookieParser    = require('cookie-parser');
const logger          = require('morgan');

const mongoose        = require('mongoose'); 
const dotenv          = require('dotenv');
dotenv.config();

var indexRouter           = require('./routes/index.routes');
var boardRouter           = require('./routes/board.routes');
var boardAppendiceRouter  = require('./routes/board_appendice.routes');
var checklistItemRouter   = require('./routes/checklist_item.routes');
var commentRouter         = require('./routes/comment.routes');
var labelRouter           = require('./routes/label.routes');
var taskTypeRouter        = require('./routes/task_type.routes');
var taskRouter            = require('./routes/task.routes');
var userGroupRouter       = require('./routes/user_group.routes');

var app = express();

//mongoose connection
console.log("Connecting...");

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.Promise = global.Promise;
// mongoose.connect(process.env.MONGO_PROD)
mongoose.connect(process.env.MONGO)
let db = mongoose.connection;
db.once('open', function() { console.log('Connected\n'); }); //if connected
db.on('error', function(err) { console.log('ERROR:\n'); console.log(err); console.log('/n'); }); //if error

var allowCrossDomain = function(req, res, next) {

  var origin = req.headers.origin;
  // console.log('origin', origin);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, ContentType, contentype, content-type,  Accept, authorization, X-XSRF-TOKEN');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS, PUT');
  next();
};

app.use(logger('dev'));

// view engine setup

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(path.join("public")));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(allowCrossDomain);

//routes
app.use('/',                  indexRouter);
app.use('/boards',            boardRouter);
app.use('/board-appendices',  boardAppendiceRouter);
app.use('/checklist-items',   checklistItemRouter);
app.use('/comments',          commentRouter);
app.use('/labels',            labelRouter);
app.use('/task-types',        taskTypeRouter);
app.use('/tasks',             taskRouter);
app.use('/user-groups',       userGroupRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
