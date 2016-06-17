package diagram

import "fmt"

// Produces an arrow from origin to destination with the specified label
func LogMsg(origin string, dest string, label string) {
	fmt.Println("@|msg|" + origin + "|->|" + dest + "|" + label)
}

// Produces a title with the specfied label
func LogTitle(label string) {
	fmt.Println("@|title|" + label)
}

// Produces a state circle with the specfied color and label.
// color can be: "red", "green", "yellow"
func LogState(color string, node string, label string) {
	fmt.Println("@|state|" + color + "|" + node + "|" + label)
}

// Produces an information icon with a text tooltip
func LogInfo(node string, label string) {
	fmt.Println("@|info|" + node + "|" + label)
}

// Produces a table around a text of formated key:value pairs. Example: "A:23, B:45, C:63"
func LogTable(node string, tableText string) {
	fmt.Println("@|table|" + node + "|" + tableText)
}

// Skips some vertical space; useful for separating events in the diagram
func LogNext() {
	fmt.Println("@|next")
}