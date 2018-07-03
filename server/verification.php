<?php
$servername = "localhost";
$username = "code";
$password = "XXXX";
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


//get values from query string
$playerID = getIfSet($_REQUEST["pid"],'NN');
$gameID = getIfSet($_REQUEST["gid"],'NN');
$gameVersion = getIfSet($_REQUEST["gv"],'NN');

$verificationCode=getIfSet($_REQUEST["c"],'NN');
$playingDate = getIfSet($_REQUEST["pd"],'NN');
$playingTime = getIfSet($_REQUEST["pt"],'NN');

$gameStat= getIfSet($_REQUEST["gs"],'NN');

//echo "Step 2";

   
$dateTime = date('Y-m-d_H:i:s');
echo $date;


$sql = "INSERT INTO DATA(PLAYER_ID,CREATED_AT ,GAME_ID, GAME_VERSION, VERIFICATION_CODE, PLAYING_DATE ,PLAYING_TIME, STAT)
VALUES ('$playerID','$dateTime','$gameID', '$gameVersion','$verificationCode','$playingDate','$playingTime','$gameStat')";


$template='<html> <header><title>Finished</title> <link rel="stylesheet" href="../css/bootstrap.min.css"> <script src="../js/bootstrap.min.js"></script> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> 		 		<script> function myFunction() {   var copyText = document.getElementById("myInput");   copyText.select();   document.execCommand("Copy");   alert("Copied the text: " + copyText.value); } </script>  </header> <body>  <div class="container"> <div class="panel panel-default">Finished!</div>     <div class="panel-body"> 	<p>Thank you very much for participating in this part of the study.</p> 	<p>Now, please go back to the MTurk website and paste the code below in the corresponding box. Afterwards, please answer the questionnaire on the website.</p> 	<p><input type="text" value='."$verificationCode".' id="myInput"> <button onclick="myFunction()">Copy text</button></p> 	<p></p> 	<p></p> 	 	</div>  </div>     </div> </body> </html> ';



if (mysqli_query($conn, $sql)) {
    echo $template;
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}
/*
*/
mysqli_close($conn);
?>