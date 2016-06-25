package diagram

import "fmt"

var PrintLogs bool = true // change to "false" to stop printing log messages. Use this to activate and deactivate log messages.

// Produces an arrow from origin to destination with the specified label
func LogMsg(origin string, dest string, label string) {
	if (PrintLogs) {
		fmt.Println("@|msg|" + LogName(origin) + "|->|" + LogName(dest) + "|" + label)
	}
}

// Produces a title with the specfied label
func LogTitle(label string) {
	if (PrintLogs) {
		fmt.Println("@|title|" + label)
	}
}

// Produces a state circle with the specfied color and label.
// color can be: "red", "green", "yellow"
func LogState(color string, node string, label string) {
	if (PrintLogs) {
		fmt.Println("@|state|" + color + "|" + LogName(node) + "|" + label)
	}
}

// Produces an information icon with a text tooltip
func LogInfo(node string, label string) {
	if (PrintLogs) {
		fmt.Println("@|info|" + LogName(node) + "|" + label)
	}
}

// Produces a table around a text of formated key:value pairs. Example: "A:23, B:45, C:63"
func LogTable(node string, tableText string) {
	if (PrintLogs) {
		fmt.Println("@|table|" + LogName(node) + "|" + tableText)
	}
}

// Skips some vertical space; useful for separating events in the diagram
func LogNext() {
	if (PrintLogs) {
		fmt.Println("@|next")
	}
}



// Translates the full name of a node to an equivalent ID for the diagram.
// Modify this as needed for your project
func LogName(name string) string {
	switch (name) {
	case "":
		return ""
	case "vs":
		return "vs"
	case "ck":
		return "ck"
	}
	return "s" + fmt.Sprintf("%c", name[len(name) - 1])
}