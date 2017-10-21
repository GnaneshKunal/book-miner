#!/bin/bash
num=$((10#$1))

num2=$(( $num + 250 ))

num3=$((10#$2))

while [ $num -le $num3  ]
do
	node ../dist/crawler/crawler.js --min=$num --max=$num2
    $num + $num2
	num=$(( $num2 ))
	num2=$(( $num2 + 250 ))
done
