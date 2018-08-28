<?php
$servername = "localhost";
$username = "code";
$password = "XXXXXXX";
$dbname = "TUB_GAMING";

//echo "Step 1";
// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

function getIfSet(&$value, $default = null)
{
    return isset($value) ? $value : $default;
}


function getRealIpAddr()
{
    if (!empty($_SERVER['HTTP_CLIENT_IP']))   //check ip from share internet
    {
      $ip=$_SERVER['HTTP_CLIENT_IP'];
    }
    elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   //to check ip is pass from proxy
    {
      $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    else
    {
      $ip=$_SERVER['REMOTE_ADDR'];
    }
    return $ip;
}



//get values from query string
$playerID = getIfSet($_REQUEST["pid"],getRealIpAddr());
$gameID = getIfSet($_REQUEST["gid"],'NN');
$gameVersion = getIfSet($_REQUEST["gv"],'NN');

$verificationCode=getIfSet($_REQUEST["c"],'NN');
$playingDate = getIfSet($_REQUEST["pd"],'NN');
$playingTime = getIfSet($_REQUEST["pt"],'NN');

$gameStat= getIfSet($_REQUEST["gs"],'NN');
$istraining=getIfSet($_REQUEST["train"],0);
$hasPlayed=getIfSet($_REQUEST["hp"],1);
$md5=getIfSet($_REQUEST["md"],'NN');

//echo "Step 2";

$dateTime = date('Y-m-d_H:i:s');
echo $date;

$sql = "INSERT INTO DATA(PLAYER_ID,CREATED_AT ,GAME_ID, GAME_VERSION, VERIFICATION_CODE, PLAYING_DATE ,PLAYING_TIME, STAT,IS_TRAINING, HAS_PLAYED,MD5)
VALUES ('$playerID','$dateTime','$gameID', '$gameVersion','$verificationCode','$playingDate','$playingTime','$gameStat', '$istraining','$hasPlayed','$md5')";


$template='<html> <header><title>Finished</title><script src="../js/bootstrap.min.js"></script> <link rel="stylesheet" href="../css/bootstrap.min.css">  <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> 		 		<script> function myFunction() {   var copyText = document.getElementById("myInput");   copyText.select();   document.execCommand("Copy");   alert("Copied the text: " + copyText.value); } </script>  </header> <body>  <div class="container"> <div class="panel panel-default"> <div class="panel-heading">Finished!</div> <div class="panel-body"> 	<p>Thank you very much for participating in this part of the study.</p> 	<p>Now, please go back to the MTurk website and paste the code below in the corresponding box. Afterwards, please answer the questionnaire on the website.</p> 	<p><input type="text" value='."$verificationCode".' id="myInput"  size="35"> <button onclick="myFunction()">Copy text</button></p> 	<p></p> 	<p></p> 	 	</div>  </div>     </div> </body> </html> ';

$templateTraining='<html> <header><title>Training session is finished</title> <link rel="stylesheet" href="../css/bootstrap.min.css"> <script src="../js/bootstrap.min.js"></script> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> 		</header> <body>  <div class="container"> <div class="panel panel-default">Training session is finished!"</div>     <div class="panel-body"> 	<p>Good job! Now it is time to play the real games! Please go back to the MTurk website and follow the instruction.</p>  	</div>  </div>     </div> </body> </html>';

$templateNotPlaying='<html> <header><title>Finished</title> <link rel="stylesheet" href="../css/bootstrap.min.css"> <script src="../js/bootstrap.min.js"></script> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> 	<script>function goBack() {    window.history.back()}</script>	</header> <body>  <div class="container"> <div class="panel panel-default">Finished...</div>     <div class="panel-body"> 	<p>During your plaing we collect statistics on your performance. Those indicate that you were not well engaged in the game. This will result to rejection of your answer. So, to avoid that, we are showing this message to you and give you a second opportunity to play the game with attention. </p>  <p>Please understand that we used this information for scientific research, and we would like to avoid you waisting your time.</p>	 <button type="button" class="btn btn-warning" onclick="goBack()">Try Again</button></div>  </div>     </div> </body> </html>';

if (mysqli_query($conn, $sql)) {
  if ($hasPlayed==0){
    echo $templateNotPlaying;
  }elseif ($istraining){
    echo $templateTraining;
  }else{
    echo $template;
    }
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}
/*
*/
mysqli_close($conn);
?>
