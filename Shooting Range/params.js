// ###############################################################
// ########################  Paramters    ########################
// ###############################################################

//############ Adjustable parameters ############
//###############################################
//+++ delay_val: simulates x milliseconds of input delay
//+++ PL: simulates x % of command packets been droped
//+++ fps: sets the frame rate of the game: default = 60
//+++ feedback information: HUD, medals, and sound
//+++ isTraining:
//+++ if set to 0: duration = gamingDuration
//+++ if set to 1: duration = trainingDuration
//+++ showToken:
//+++ if set to 0 = token message will appear on the website
//+++ if set to 1 = no token message will appear on the website
//+++ game_code: name for server log to see which game and  condition was played
//+++ gameVersion: data and version of the game
//+++ SendToServer: send getStats to server or just console log
//+++ baseURL: where the game is located

// network or encoding
var delay_val = 0;
var PL = 0;
var fps = 60;

var feedback = 3;

// set to 1 for training
var isTraining = 0;
// set to 1 for token
var showToken = 1;
// durations
var trainingDuration = 30;
var gamingDuration = 90;

// log information
var game_code = "E";
var gameVersion = "17092018_v4";
var SendToServer = true;

// server information
var baseURL = "http://gamingqoe.qu.tu-berlin.de/store/verification.php?"

