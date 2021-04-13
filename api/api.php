<?php

header("Content-Type:application/json");
include('connection.php');

if (isset($_GET['random_classes'])) {
  $output = array();

  // $query = "SELECT * FROM `classes` ORDER BY RAND() LIMIT 5";
  $count = rand(9, 20);
  $query = "SELECT * FROM `classes` ORDER BY RAND() LIMIT " . strval($count);
  $result = mysqli_query($con,$query);
  while ($row = mysqli_fetch_assoc($result)) {
    array_push($output,$row);
  };

  $response["status"] = "true";
  $response["message"] = "Random classes";
  $response["output"] = $output;
}
else {
  $response["status"] = "false";
  $response["message"] = "No classes found!";
}

echo json_encode($response);
exit;

?>
