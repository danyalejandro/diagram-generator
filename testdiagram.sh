#!/bin/sh
# This script runs "go test" and saves the output into "test.out" in the "diagram" directory.
# Then it runs "makediagram.go" to update the file "diagram/data/content.js"

echo "* Running tests..."
cd viewservice
go test > ../diagram/test.out
cd ..
echo "* Generating diagram..."
go run makediagram.go
echo "* Finished."