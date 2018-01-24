@import 'common.js'

var onRun = function(context) {
  // reference the sketch document
  var doc = context.document;
  var selection = context.selection;
  
  // make sure something is selected
  if (selection.count() == 0) {
    doc.showMessage("Please select a layer.");
  } else { // good. something is selected.
    //*** let the user specify where to put the XML file
    // setup a variable... allow xml to be written to the folder
    // var fileTypes = [NSArray arrayWithObjects:@"xml", nil]; // --> resulted in "ObjC method arrayWithObjects: requires 1 argument, but JavaScript passed 2 arguments"
    var fileTypes = ["xml"];
    
    // create a folder/directory chooser window
    var panel = [NSOpenPanel openPanel];
    [panel setCanChooseDirectories:true];
    [panel setCanCreateDirectories:true];
    [panel setAllowedFileTypes:fileTypes];
    
    // create variable to check what button was selected/clicked
    var clicked = [panel runModal];
    // check if clicked
    if (clicked == NSFileHandlingPanelOKButton) {
      
      var isDirectory = true;
      // get the folder path
      var firstURL = [[panel URLs] objectAtIndex:0];
      // format it to a string
      var file_path = [NSString stringWithFormat:@"%@", firstURL];
      
      // remove the 'file://'' path from string
      if (0 === file_path.indexOf("file://")) {
        file_path = file_path.substring(7);
      }
      log("Path: " + file_path);

    }
    // loop through the selected layers and export the XML
    for(var i = 0; i < selection.count(); i++){
      var layer = selection[i];
      //log(layer);
      exportXML(layer, file_path);
    }
  }
};

// The heavey-lifting to create the XML data and XML file
function exportXML(layer, file_path) {

  // initialize the root xml element
  var root = [NSXMLElement elementWithName:@"document"];
  // initialize the xml object with the root element
  var xmlObj = [[NSXMLDocument document] initWithRootElement:root];

  // create the variables
  var layerName = layer.name();
  var layerFrame = layer.absoluteRect();
  var layerXpos = String(layerFrame.x());
  var layerYpos = String(layerFrame.y());
  var layerHeight = String(layerFrame.height());
  var layerWidth = String(layerFrame.width());

  // create the first child element and add it to the root
  var layerElement = [NSXMLElement elementWithName:@"layer"];
  [root addChild:layerElement];

  // add elements based on variables to the first child
  var layerNameElement = [NSXMLElement elementWithName:@"name" stringValue:layerName];
  [layerElement addChild:layerNameElement];

  var layerXPosElement = [NSXMLElement elementWithName:@"xPos" stringValue:layerXpos];
  [layerElement addChild:layerXPosElement];

  var layerYPosElement = [NSXMLElement elementWithName:@"yPos" stringValue:layerYpos];
  [layerElement addChild:layerYPosElement];

  var layerHeightElement = [NSXMLElement elementWithName:@"height" stringValue:layerHeight];
  [layerElement addChild:layerHeightElement];

  var layerWidthElement = [NSXMLElement elementWithName:@"width" stringValue:layerWidth];
  [layerElement addChild:layerWidthElement];

  // create the xml file
  var xmlData = [xmlObj XMLDataWithOptions:NSXMLNodePrettyPrint];

  // name the xml file the name of the layer and save it to the folder
  [xmlData writeToFile:file_path+layerName+".xml"];
  var alertMessage = layerName+".xml saved to: " + file_path;

  alert("Layer XML Exported!", alertMessage);
}