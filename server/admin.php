<?php
//should be edited
$servername = "localhost";
$username = "XXX";
$password = "XXX";
$dbname = "TUB_GAMING";

echo "1";
// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT * FROM data";
$result = $conn->query($sql);

 
echo " 
<html>
<head>
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
";

echo "<table border='1'>
<tr>
<th>name</th>
<th>cloudKey</th>
<th>dateTime</th>
<th>score</th>
<th>version</th>
<th>numOfJump</th>
<th>numOfFallingDown</th>
<th>numOfShootUzi</th>
<th>numOfhitUzi</th>
<th>numOfShootShotGun</th>
<th>numOfhitShotGun</th>
<th>dateGame</th>
<th>timeGame</th>

<th>inputs</th>


</tr>";
 
if ($result->num_rows > 0) {

    while($row = $result->fetch_assoc()) {

    
	  echo "<tr>";
	  echo "<td>" . $row['username'] . "</td>";
	  echo "<td>" . $row['cloudKey'] . "</td>";
	  echo "<td>" . $row['dateTime'] . "</td>";
	  echo "<td>" . $row['score'] . "</td>";
	  echo "<td>" . $row['version'] . "</td>";
	  echo "<td>" . $row['numOfJump'] . "</td>";
	  echo "<td>" . $row['numOfFallingDown'] . "</td>";
	  echo "<td>" . $row['numOfShootUzi'] . "</td>";
	  echo "<td>" . $row['numOfhitUzi'] . "</td>";
	  echo "<td>" . $row['numOfShootShotGun'] . "</td>";
	  echo "<td>" . $row['numOfhitShotGun'] . "</td>";
	  echo "<td>" . $row['dateGame'] . "</td>";
	  echo "<td>" . $row['timeGame'] . "</td>";
	  echo "<td>" . $row['inputs'] . "</td>";
	  echo "</tr>";
	  
  
    }
} else {
    echo "0 results";
}
$conn->close();
?>