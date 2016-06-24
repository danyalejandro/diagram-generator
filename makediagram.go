package main

import (
	"fmt"
	"os"
	"log"
	"bufio"
	"strings"
)

func main() {
	fmt.Println("Trying to generate diagram from diagram/test.out...")
	file, err := os.Open("diagram/test.out")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	
	fileOut, _ := os.Create("diagram/data/content.js")
	writer := bufio.NewWriter(fileOut)
	defer fileOut.Close()

	funcSplit := func(c rune) bool {
		return (c == '|')
	}

	fmt.Fprintln(writer, "var dataContent = [")
	writer.Flush()

	var line string
	var evType string
	for scanner.Scan() {
		line = scanner.Text()
		if (len(line) > 0) {
			if (string(line[0]) == "@") {
				//fmt.Println(line)
				words := strings.FieldsFunc(line, funcSplit)
				evType = words[1]
				switch(evType) {
				case "msg":
					if (len(words) >= 5) {
						origin := words[2]
						dest := words[4]
						label := ""
						if (len(words) == 6) {
							label = words[5]
						}
						newLine := fmt.Sprintf("{ type: \"msg\", from: \"%s\", to: \"%s\", label: \"%s\" },", origin, dest, label)
						fmt.Fprintln(writer, newLine)
						writer.Flush()
					} else {
						fmt.Println("ERROR: Could not parse output line:", line, ". IGNORING (please solve)...")
					}

					break
				case "title":
					label := words[2]
					newLine := fmt.Sprintf("{ type: \"title\", label: \"%s\" },", label)
					fmt.Fprintln(writer, newLine)
					writer.Flush()
					break
				case "info":
					node := words[2]
					label := words[3]
					newLine := fmt.Sprintf("{ type: \"info\", node: \"%s\", label: \"%s\" },", node, label)
					fmt.Fprintln(writer, newLine)
					writer.Flush()
					break
				case "table":
					node := words[2]
					text := words[3]
					newLine := fmt.Sprintf("{ type: \"table\", node: \"%s\", text: \"%s\" },", node, text)
					fmt.Fprintln(writer, newLine)
					writer.Flush()
					break
				case "state":
					color := words[2]
					node := words[3]
					label := words[4]
					newLine := fmt.Sprintf("{ type: \"state\", color: \"%s\", node: \"%s\", label: \"%s\" },", color, node, label)
					fmt.Fprintln(writer, newLine)
					writer.Flush()
					break
				case "next":
					fmt.Fprintln(writer, "{ type: \"next\" },")
					writer.Flush()
					break
				}

				
			}
		}
	}

	fmt.Fprintln(writer, "]")
	writer.Flush()
	fmt.Println("Process finished.")

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
}
