<?php
$servername = "localhost";
$username = "XXX";
$password = "XXX";
$dbname = "TUB_GAMING";

echo "Step 1";
// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$playerID = 'playerX';
$gameID= 'gameID';

$playerID = $_REQUEST["pID"];
$gameID = $_REQUEST["gID"];
$gameVersion = $_REQUEST["gv"];

$code=$_REQUEST["c"];
$playingDate = $_REQUEST["pD"];
$playingTime = $_REQUEST["dT"];

$gameStat== $_REQUEST["gs"];

echo "Step 2";

   
$dateTime = date('Y-m-d_H:i:s');
$date = date('H:i:s');
echo $date;


$sql = "INSERT INTO data(username,dateTime,score,inputs,version,numOfhitShotGun,numOfShootShotGun,numOfhitUzi,numOfShootUzi,numOfFallingDown,numOfJump,dateGame,timeGame,cloudKey)
VALUES ('$username2','$dateTime','$score','$inputs','$version','$numOfhitShotGun','$numOfShootShotGun','$numOfhitUzi','$numOfShootUzi','$numOfFallingDown','$numOfJump','$dateGame','$timeGame','$cloudKey')";



if (mysqli_query($conn, $sql)) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}
/*
*/
mysqli_close($conn);
?>