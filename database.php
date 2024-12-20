<?php

$host = "localhost";
$dbusername = "root";
$dbpassword = "";
$dbname = "Techhub";

$connect = mysqli_connect($host, $dbusername, $dbpassword, $dbname);

if (!$connect) {
    echo "failed";
} else {
    // echo "success";

}
