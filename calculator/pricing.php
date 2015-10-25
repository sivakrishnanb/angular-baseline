<?php
header('Content-Type: application/json');
$req = "30.4";
$sku = 0;
$storagePrice = 0.0;
$ft3 = 0.0;
$price_per_item  = 0.0;
$price_per_order = 0.0;
$items_per_order = 0;
$max_orders_per_month = 0;

// range limits for Orders per month
$max_orders_per_month_range1 = 0;
$max_orders_per_month_range2 = 100;
$max_orders_per_month_range3 = 200;
$max_orders_per_month_range4 = 500;
$max_orders_per_month_range5 = 800;
$max_orders_per_month_range6 = 1000;

// range limits for number of SKUs in stock
$skurange1 = 0;
$skurange2 = 10;
$skurange3 = 25;
$skurange4 = 50;
$skurange5 = 75;
$skurange6 = 100;
$skurange7 = 150;
$skurange8 = 200;
$skurange9 = 250;
$skurange10 = 400;
$skurange11 = 600;

// range limits for cbm in Storage. Variable name is ft3 but all values are in cbm
$ft3range1 = 0.0;
$ft3range2 = 5.0;
$ft3range3 = 8.0;
$ft3range4 = 15.0;
$ft3range5 = 25.0;
$ft3range6 = 35.0;
$ft3range7 = 45.0;
$ft3range8 = 55.0;
$ft3range9 = 75.0;
$ft3range10 = 100.0;

// if loop to find right bucket for Handling and PickPack rate
if(isset($_POST['max_orders_per_month'])){
	$req = $_POST['max_orders_per_month'];
	$max_orders_per_month = $_POST['max_orders_per_month'];
}

if(isset($_POST['max_skus'])){
	$sku = $_POST['max_skus'];
}

if(isset($_POST['max_storage_ft3'])){
	$ft3 = $_POST['max_storage_ft3'];
}

if(isset($_POST['items_per_order'])){
$items_per_order = $_POST['items_per_order'];
}
//echo $max_orders_per_month;
if($max_orders_per_month >=$max_orders_per_month_range1 && $max_orders_per_month <= $max_orders_per_month_range2){
	$price_per_order = 3.00 + ($items_per_order * 0.75);
	
}else if($max_orders_per_month >=$max_orders_per_month_range2 && $max_orders_per_month <= $max_orders_per_month_range3){
	$price_per_order = 3.00 + ($items_per_order * 0.70);
	
}else if($max_orders_per_month >=$max_orders_per_month_range3 && $max_orders_per_month <= $max_orders_per_month_range4){
	$price_per_order = 3.00 + ($items_per_order * 0.65);
	
}else if($max_orders_per_month >=$max_orders_per_month_range4 && $max_orders_per_month <= $max_orders_per_month_range5){
	$price_per_order = 3.00 + ($items_per_order * 0.60);
	
}else if($max_orders_per_month >=$max_orders_per_month_range5 && $max_orders_per_month <= $max_orders_per_month_range6){
	$price_per_order = 3.00 + ($items_per_order * 0.55);
	
}else if($max_orders_per_month >$max_orders_per_month_range6){
	$price_per_order = 2.75 + ($items_per_order * 0.50);
	
}
$price_per_order = round($price_per_order,2);

// if loop to find price per item from price per order
if($items_per_order > 0 )
	$price_per_item = round($price_per_order / $items_per_order,2);
else
	$price_per_item = 0;

// if loop to find right bucket for Storage rate
if($sku > $skurange1 && $sku <= $skurange2){
	if($ft3 > $ft3range1 && $ft3 <= $ft3range2){
		$storagePrice = 14.06;
	}else if($ft3 > $ft3range2 && $ft3 <= $ft3range3){
		$storagePrice =  12.90;
	}else if($ft3 > $ft3range3 && $ft3 <= $ft3range4){
		$storagePrice =  12.24;
	}else if($ft3 > $ft3range4 && $ft3 <= $ft3range5){
		$storagePrice =  11.60;
	}else if($ft3 > $ft3range5 && $ft3 <= $ft3range6){
		$storagePrice =  9.52;
	}else if($ft3 > $ft3range6 && $ft3 <= $ft3range7){
		$storagePrice =  9.68;
	}else if($ft3 > $ft3range7 && $ft3 <= $ft3range8){
		$storagePrice =  9.79;
	}else if($ft3 > $ft3range8 && $ft3 <= $ft3range9){
		$storagePrice =  9.75;
	}else if($ft3 > $ft3range9 && $ft3 <= $ft3range10){
		$storagePrice =  9.63;
	}else {
		$storagePrice =  9.50;
	}
		
}else if($sku > $skurange2 && $sku <= $skurange3){
	if($ft3 > $ft3range1 && $ft3 <= $ft3range2){
		$storagePrice = 14.20;
	}else if($ft3 > $ft3range2 && $ft3 <= $ft3range3){
		$storagePrice =  13.09;
	}else if($ft3 > $ft3range3 && $ft3 <= $ft3range4){
		$storagePrice =  12.49;
	}else if($ft3 > $ft3range4 && $ft3 <= $ft3range5){
		$storagePrice =  11.89;
	}else if($ft3 > $ft3range5 && $ft3 <= $ft3range6){
		$storagePrice =  10.28;
	}else if($ft3 > $ft3range6 && $ft3 <= $ft3range7){
		$storagePrice =  10.31;
	}else if($ft3 > $ft3range7 && $ft3 <= $ft3range8){
		$storagePrice =  10.32;
	}else if($ft3 > $ft3range8 && $ft3 <= $ft3range9){
		$storagePrice =  10.24;
	}else if($ft3 > $ft3range9 && $ft3 <= $ft3range10){
		$storagePrice =  10.06;
	}else {
		$storagePrice =  9.98;
	}
		
}else if($sku > $skurange3 && $sku <= $skurange4){
	if($ft3 > $ft3range1 && $ft3 <= $ft3range2){
		$storagePrice = 14.35;
	}else if($ft3 > $ft3range2 && $ft3 <= $ft3range3){
		$storagePrice =  13.29;
	}else if($ft3 > $ft3range3 && $ft3 <= $ft3range4){
		$storagePrice =  12.74;
	}else if($ft3 > $ft3range4 && $ft3 <= $ft3range5){
		$storagePrice =  12.19;
	}else if($ft3 > $ft3range5 && $ft3 <= $ft3range6){
		$storagePrice =  11.10;
	}else if($ft3 > $ft3range6 && $ft3 <= $ft3range7){
		$storagePrice =  10.98;
	}else if($ft3 > $ft3range7 && $ft3 <= $ft3range8){
		$storagePrice =  10.89;
	}else if($ft3 > $ft3range8 && $ft3 <= $ft3range9){
		$storagePrice =  10.75;
	}else if($ft3 > $ft3range9 && $ft3 <= $ft3range10){
		$storagePrice =  10.52;
	}else {
		$storagePrice =  10.28;
	}
		
}else if($sku > $skurange4 && $sku <= $skurange5){
	if($ft3 > $ft3range1 && $ft3 <= $ft3range2){
		$storagePrice = 14.49;
	}else if($ft3 > $ft3range2 && $ft3 <= $ft3range3){
		$storagePrice =  13.49;
	}else if($ft3 > $ft3range3 && $ft3 <= $ft3range4){
		$storagePrice =  12.99;
	}else if($ft3 > $ft3range4 && $ft3 <= $ft3range5){
		$storagePrice =  12.49;
	}else if($ft3 > $ft3range5 && $ft3 <= $ft3range6){
		$storagePrice =  11.99;
	}else if($ft3 > $ft3range6 && $ft3 <= $ft3range7){
		$storagePrice =  11.69;
	}else if($ft3 > $ft3range7 && $ft3 <= $ft3range8){
		$storagePrice =  11.49;
	}else if($ft3 > $ft3range8 && $ft3 <= $ft3range9){
		$storagePrice =  11.29;
	}else if($ft3 > $ft3range9 && $ft3 <= $ft3range10){
		$storagePrice =  10.99;
	}else {
		$storagePrice =  10.59;
	}
		
}else if($sku > $skurange5 && $sku <= $skurange6){
	if($ft3 > $ft3range1 && $ft3 <= $ft3range2){
		$storagePrice = 15.65;
	}else if($ft3 > $ft3range2 && $ft3 <= $ft3range3){
		$storagePrice =  14.57;
	}else if($ft3 > $ft3range3 && $ft3 <= $ft3range4){
		$storagePrice =  14.03;
	}else if($ft3 > $ft3range4 && $ft3 <= $ft3range5){
		$storagePrice =  13.49;
	}else if($ft3 > $ft3range5 && $ft3 <= $ft3range6){
		$storagePrice =  12.95;
	}else if($ft3 > $ft3range6 && $ft3 <= $ft3range7){
		$storagePrice =  12.45;
	}else if($ft3 > $ft3range7 && $ft3 <= $ft3range8){
		$storagePrice =  12.12;
	}else if($ft3 > $ft3range8 && $ft3 <= $ft3range9){
		$storagePrice =  11.85;
	}else if($ft3 > $ft3range9 && $ft3 <= $ft3range10){
		$storagePrice =  11.48;
	}else {
		$storagePrice =  10.91;
	}
		
}else if($sku > $skurange6 && $sku <= $skurange7){
	if($ft3 > $ft3range1 && $ft3 <= $ft3range2){
		$storagePrice = 16.90;
	}else if($ft3 > $ft3range2 && $ft3 <= $ft3range3){
		$storagePrice =  15.73;
	}else if($ft3 > $ft3range3 && $ft3 <= $ft3range4){
		$storagePrice =  15.15;
	}else if($ft3 > $ft3range4 && $ft3 <= $ft3range5){
		$storagePrice =  14.57;
	}else if($ft3 > $ft3range5 && $ft3 <= $ft3range6){
		$storagePrice =  13.99;
	}else if($ft3 > $ft3range6 && $ft3 <= $ft3range7){
		$storagePrice =  13.26;
	}else if($ft3 > $ft3range7 && $ft3 <= $ft3range8){
		$storagePrice =  12.79;
	}else if($ft3 > $ft3range8 && $ft3 <= $ft3range9){
		$storagePrice =  12.45;
	}else if($ft3 > $ft3range9 && $ft3 <= $ft3range10){
		$storagePrice =  12.00;
	}else {
		$storagePrice =  11.23;
	}
		
}else if($sku > $skurange7 && $sku <= $skurange8){
	if($ft3 > $ft3range1 && $ft3 <= $ft3range2){
		$storagePrice = 18.25;
	}else if($ft3 > $ft3range2 && $ft3 <= $ft3range3){
		$storagePrice =  16.99;
	}else if($ft3 > $ft3range3 && $ft3 <= $ft3range4){
		$storagePrice =  16.36;
	}else if($ft3 > $ft3range4 && $ft3 <= $ft3range5){
		$storagePrice =  15.73;
	}else if($ft3 > $ft3range5 && $ft3 <= $ft3range6){
		$storagePrice =  15.10;
	}else if($ft3 > $ft3range6 && $ft3 <= $ft3range7){
		$storagePrice =  14.12;
	}else if($ft3 > $ft3range7 && $ft3 <= $ft3range8){
		$storagePrice =  13.49;
	}else if($ft3 > $ft3range8 && $ft3 <= $ft3range9){
		$storagePrice =  13.07;
	}else if($ft3 > $ft3range9 && $ft3 <= $ft3range10){
		$storagePrice =  12.54;
	}else {
		$storagePrice =  11.57;
	}
		
}else if($sku > $skurange8 && $sku <= $skurange9){
	if($ft3 > $ft3range1 && $ft3 <= $ft3range2){
		$storagePrice = 19.71;
	}else if($ft3 > $ft3range2 && $ft3 <= $ft3range3){
		$storagePrice =  18.35;
	}else if($ft3 > $ft3range3 && $ft3 <= $ft3range4){
		$storagePrice =  17.67;
	}else if($ft3 > $ft3range4 && $ft3 <= $ft3range5){
		$storagePrice =  16.99;
	}else if($ft3 > $ft3range5 && $ft3 <= $ft3range6){
		$storagePrice =  16.31;
	}else if($ft3 > $ft3range6 && $ft3 <= $ft3range7){
		$storagePrice =  15.04;
	}else if($ft3 > $ft3range7 && $ft3 <= $ft3range8){
		$storagePrice =  14.23;
	}else if($ft3 > $ft3range8 && $ft3 <= $ft3range9){
		$storagePrice =  13.72;
	}else if($ft3 > $ft3range9 && $ft3 <= $ft3range10){
		$storagePrice =  13.11;
	}else {
		$storagePrice =  11.92;
	}
		
}else if($sku > $skurange9 && $sku <= $skurange10){
	if($ft3 > $ft3range1 && $ft3 <= $ft3range2){
		$storagePrice = 21.29;
	}else if($ft3 > $ft3range2 && $ft3 <= $ft3range3){
		$storagePrice =  19.82;
	}else if($ft3 > $ft3range3 && $ft3 <= $ft3range4){
		$storagePrice =  19.09;
	}else if($ft3 > $ft3range4 && $ft3 <= $ft3range5){
		$storagePrice =  18.35;
	}else if($ft3 > $ft3range5 && $ft3 <= $ft3range6){
		$storagePrice =  17.62;
	}else if($ft3 > $ft3range6 && $ft3 <= $ft3range7){
		$storagePrice =  16.02;
	}else if($ft3 > $ft3range7 && $ft3 <= $ft3range8){
		$storagePrice =  15.02;
	}else if($ft3 > $ft3range8 && $ft3 <= $ft3range9){
		$storagePrice =  14.41;
	}else if($ft3 > $ft3range9 && $ft3 <= $ft3range10){
		$storagePrice =  13.70;
	}else {
		$storagePrice =  12.28;
	}
		
}else if($sku > $skurange10 && $sku <= $skurange11){
	if($ft3 > $ft3range1 && $ft3 <= $ft3range2){
		$storagePrice = 22.99;
	}else if($ft3 > $ft3range2 && $ft3 <= $ft3range3){
		$storagePrice =  21.41;
	}else if($ft3 > $ft3range3 && $ft3 <= $ft3range4){
		$storagePrice =  20.61;
	}else if($ft3 > $ft3range4 && $ft3 <= $ft3range5){
		$storagePrice =  19.82;
	}else if($ft3 > $ft3range5 && $ft3 <= $ft3range6){
		$storagePrice =  19.03;
	}else if($ft3 > $ft3range6 && $ft3 <= $ft3range7){
		$storagePrice =  17.06;
	}else if($ft3 > $ft3range7 && $ft3 <= $ft3range8){
		$storagePrice =  15.84;
	}else if($ft3 > $ft3range8 && $ft3 <= $ft3range9){
		$storagePrice =  15.13;
	}else if($ft3 > $ft3range9 && $ft3 <= $ft3range10){
		$storagePrice =  14.31;
	}else {
		$storagePrice =  12.65;
	}
		
}else {
	if($ft3 > $ft3range1 && $ft3 <= $ft3range2){
		$storagePrice = 28.99;
	}else if($ft3 > $ft3range2 && $ft3 <= $ft3range3){
		$storagePrice =  23.12;
	}else if($ft3 > $ft3range3 && $ft3 <= $ft3range4){
		$storagePrice =  22.26;
	}else if($ft3 > $ft3range4 && $ft3 <= $ft3range5){
		$storagePrice =  21.41;
	}else if($ft3 > $ft3range5 && $ft3 <= $ft3range6){
		$storagePrice =  20.55;
	}else if($ft3 > $ft3range6 && $ft3 <= $ft3range7){
		$storagePrice =  18.17;
	}else if($ft3 > $ft3range7 && $ft3 <= $ft3range8){
		$storagePrice =  16.71;
	}else if($ft3 > $ft3range8 && $ft3 <= $ft3range9){
		$storagePrice =  15.89;
	}else if($ft3 > $ft3range9 && $ft3 <= $ft3range10){
		$storagePrice =  14.96;
	}else {
		$storagePrice =  13.02;
	}
}
//echo "\nStorage price ". $storagePrice;

$storagePrice = round($storagePrice * $ft3 * 4.33,2);
$handlingPrice = round( $price_per_order * $max_orders_per_month,2 );
$price = round(( $price_per_order * $max_orders_per_month ) + $storagePrice,2);

//$data = '{"estimatedMonthlyItems":"15.20","storagePrice":"64.95","price":"'+$req+'","price_per_order":"3.80","price_per_item":"1.90","handlingPrice":"200"}';
$data = array('estimatedMonthlyItems' => '15.20', "storagePrice" => number_format($storagePrice,2), "price" => number_format($price,2), "price_per_order" => number_format($price_per_order,2),"price_per_item" =>number_format($price_per_item,2),"handlingPrice" =>number_format($handlingPrice,2));
echo json_encode($data);

?>

