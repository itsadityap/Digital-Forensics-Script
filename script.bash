#!/bin/bash

# set the IP range to scan

# set the output file for the Nmap scan
OUTPUT_FILE="text.txt"

# run the Nmap scan with the vulnerability script and store the results in the output file
nmap -sV -Pn scanme.org -oN $OUTPUT_FILE

