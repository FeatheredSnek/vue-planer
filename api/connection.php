<?php
  header('Access-Control-Allow-Origin: *');
  header('Access-Control-Allow-Methods: GET');
  header("Access-Control-Allow-Headers: X-Requested-With");
  $dbhost = "host:port";
  $dbuser = "username";
  $dbpass = "password";
  $db = "database";
  $con = mysqli_connect($dbhost, $dbuser, $dbpass , $db) or die($con);
?>
