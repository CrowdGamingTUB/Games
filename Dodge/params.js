// ###############################################################
// ########################  Paramters    ########################
// ###############################################################

//############ Adjustable parameters ############
//###############################################
//+++ delay_val: simulates x milliseconds of input delay
//+++ PL: simulates x % of command packets been droped
//+++ fps: sets the frame rate of the game: default = 60
//+++ isTraining: if set to 1 = changing the duration to trainingDuration, else gamingDuration
//+++ game_code: name for server log to see which game and  condition was played
//+++ gameVersion: data and version of the game
//+++ SendToServer: send getStats to server or just console log
//+++ baseURL: where the game is located

// network or encoding
var delay_val = 0;
var PL = 0;
var fps = 60;

// set to 1 for training
var isTraining = 0;
// durations
var trainingDuration = 30;
var gamingDuration = 90;

// log information
var game_code = "B";
var gameVersion = "28082018_v2";
var SendToServer = true;

// server information
var baseURL = "http://gamingqoe.qu.tu-berlin.de/store/verification.php?"

