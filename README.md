# Message Diagram Generator
This is a message diagram generator that takes a text file (ex. console output) as input, detects certain special messages with a special notation, and turns them into a flow of messages (similar to a sequence diagram) between threads/nodes/computers/etc. The generated diagram is an HTML file with SVG graphics, that also includes a view of the console input to facilitate debugging.

This project consists of 2 parts: A web page that shows the contents of 2 JSON files (located in the *diagram/data* directory), and a Go implementation that generates those files. As long as you respect the JSON syntax, you can make your own implementation for any language or use case.

This generator was written to better understand the *primary/backup key/value service* laboratory, part of the Distributed Systems class in the University of Victoria (Canada).

The following is a capture of an example diagram (green, yellow and red orbs show text toltips on hover):

![alt tag](/docs/example.png)

## Installation (for Lab 2)

1. Copy the *diagram* directory and the files *makediagram.go* and *textdiagram.sh* to your *src* folder.
2. Add *import "diagram"* to any source file from where you want to log elements to the diagram (probably all of them).

## Usage

The diagram consists of elements First, edit the file *diagram/data/axis.js* (a file that contains a JSON object; syntax should be self-explanatory) to include any number of nodes you wish to appear in the diagram. For each node, a vertical axis is drawn. Each axis has 3 string properties:
* **id:** Unique axis identificator. Won't appear in the diagram, but identifies the axis in the log messages that generate the diagram.
* **label:** Human readable text that will show for this axis in the diagram (2-3 characters long).
* **color:** HTML color for this axis.

After you have configured the axis you need, you can create diagrams based on your logs. For this, you will need to print messages in a special notation that starts with the character *@*.

The file *diagram/diagram.go* contains the package *diagram* with functions that you can use to log messages that get interpreted by the language generator. Every time you use one of the functions, a new element will appear in your diagram. The included functions are:

#### LogMsg(origin string, dest string, label string)
Produces an arrow from axis *origin* to axis *dest* with the specified *label*. A good place to place this is before and after a client makes a Ping().
Example:
```Go
diagram.LogMsg("s1", "vs", "Ping(0)") // Produces an arrow from s1 to vs with the label Ping(0)
```

#### LogTitle(label string)
Produces an horizontal title with the specfied *label*. Recomended for important test messages in *test_test.go*.
Example:
```Go
diagram.LogTitle("Test: First primary ...")
```

#### LogState(color string, node string, label string)
Produces a circle for the axis with the specfied color and a text label for tooltip on mouse-over. Useful for describing state changes (ex. changing to a new view). Color can be *"red"*, *"yellow"* and *"green"*; they can be used to describe an error, a temporal change or preparation, and a succesful change respectively (you may use them as you like). Recomended for state changes in *server.go*.
Example:
```Go
diagram.LogState("green", "vs", "Received primary ACK!")
```

#### LogTable(node string, tableText string)
Produces a table with 2 rows, for presenting key:value pairs. The key:value pairs must appear in a single string separated by commas, in the format *"P:s1,B:s2,vn:3"*. Can contain any number of key:value pairs. Useful for presenting current view states (ex. before a test starts).
Example:
```Go
diagram.LogTable("vs", "P:s1,B:s2,vn:3")
```

#### LogInfo(node string, label string)
Produces an information icon on an axis with a text tooltip. Useful for presenting miscelaneous information.
Example:
```Go
diagram.LogInfo("s1", "Declared as future primary...")
```

#### LogNext()
Skips some vertical space; useful for separating state circles in the diagram as needed (since appear at the same position as other elements).
```Go
diagram.LogNext()
```

## Helper formatting functions
You may use the following formatting functions (or roll your own as needed) to make it easier to log information; add them to *common.js*.

```Go
// HELPER: formats server name as a short identifier
// In this case, the id is the letter "s" and a number (the last number of the full server name)
func ServerId(me string) string {
	if (len(me) > 0) {
		return "s" + string(me[len(me) - 1])
	}
	return ""
}

// HELPER: formats a view as a short text description
func fView(v View) string {
	p := "_"
	b := "_"
	if (len(v.Primary) > 0) {
		p = string(v.Primary[len(v.Primary) - 1])
	}
	if (len(v.Backup) > 0) {
		b = string(v.Backup[len(v.Backup) - 1])
	}
	return fmt.Sprintf("P%s, B%s, vn%d", p, b, v.Viewnum)
}

// HELPER: Formats the view as a string with key:values separated by commas
// Example: "P:s1,B:s2,vn:3"
// As long as this format is respected, any number of key:values may be included
// and they will be interpreted by the diagram generator.
func FormatViewTable(vx View) string {
	return fmt.Sprintf("P:%s,B:%s,vn:%d", ServerId(vx.Primary), ServerId(vx.Backup), vx.Viewnum)
}
```
