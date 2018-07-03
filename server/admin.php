<?php
//should be edited
$servername = "localhost";
$username = "code";
$password = "XXXX";
$dbname = "TUB_GAMING";

//echo "1";
// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT * FROM DATA";
$result = $conn->query($sql);

 
echo ' 
<html>
<head>
<link rel="stylesheet" href="../css/bootstrap.min.css"> <script src="../js/bootstrap.min.js"></script> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> 		 		

//css
<style>
table
{
border-style:solid;
border-width:2px;
border-color:pink;
}
</style>
</head>
';

echo "<table border='1'>
<tr>
<th>ID</th>
<th>Created at</th>

<th>Game ID</th>
<th>Game version</th>
<th>Player ID</th>

<th>Code</th>

<th>Playing date</th>
<th>Playing time</th>
<th>Stat</th>

</tr>";
 
if ($result->num_rows > 0) {

    while($row = $result->fetch_assoc()) {

    
	  echo "<tr>";
	  echo "<td>" . $row['ID'] . "</td>";
	  echo "<td>" . $row['CREATED_AT'] . "</td>";
	  echo "<td>" . $row['GAME_ID'] . "</td>";
	  echo "<td>" . $row['GAME_VERSION'] . "</td>";
	  echo "<td>" . $row['PLAYER_ID'] . "</td>";
	  echo "<td>" . $row['VERIFICATION_CODE'] . "</td>";
	  echo "<td>" . $row['PLAYING_DATE'] . "</td>";
	  echo "<td>" . $row['PLAYING_TIME'] . "</td>";
	  echo "<td>" . $row['STAT'] . "</td>";
	  echo "</tr>";
	  
  
    }
} else {
    echo "0 results";
}
$conn->close();
?>