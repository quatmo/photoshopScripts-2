try
{
  // Prompt user to select iTunesArtwork file. Clicking "Cancel" returns null.
  var iTunesArtwork = File.openDialog("Select a sqaure PNG file that is at least 1024x1024.", "*.png", false);

  if (iTunesArtwork !== null) 
  { 
    var doc = open(iTunesArtwork, OpenDocumentType.PNG);
    
    if (doc == null)
    {
      throw "Something is wrong with the file.  Make sure it's a valid PNG file.";
    }

    var startState = doc.activeHistoryState;       // save for undo
    var initialPrefs = app.preferences.rulerUnits; // will restore at end
    app.preferences.rulerUnits = Units.PIXELS;     // use pixels

    if (doc.width != doc.height)
    {
        throw "Image is not square";
    }
    else if ((doc.width < 1024) && (doc.height < 1024))
    {
        throw "Image is too small!  Image must be at least 1024x1024 pixels.";
    }
    else if (doc.width < 1024)
    {
        throw "Image width is too small!  Image width must be at least 1024 pixels.";
    }
    else if (doc.height < 1024)
    {
        throw "Image height is too small!  Image height must be at least 1024 pixels.";
    }
    
    // Folder selection dialog
    var destFolder = Folder.selectDialog( "Choose an output folder");

    if (destFolder == null)
    {
      // User canceled, just exit
      throw "";
    }

    // Save icons in PNG using Save for Web.
    var sfw = new ExportOptionsSaveForWeb();
    sfw.format = SaveDocumentType.PNG;
    sfw.PNG8 = false; // use PNG-24
    sfw.transparency = false;
    doc.info = null;  // delete metadata

//References:
//http://developer.apple.com/library/ios/#documentation/UserExperience/Conceptual/MobileHIG/IconsImages/IconsImages.html%23//apple_ref/doc/uid/TP40006556-CH14-SW2    

    var icons = [
    
//for Ad Hoc Only
      {"name": "iTunesArtwork@2x", "size":1024},
      {"name": "iTunesArtwork",    "size":512},

//for App Icon
      {"name": "icon-60@3x",       "size":180},	//iPhone 6 Plus (@3x)
      {"name": "icon-60@2x",       "size":120}, //iPhone 6 and iPhone 5 (@2x)
      {"name": "icon-60",          "size":60}, //iPhone 6 and iPhone 5 (@1x)
      {"name": "icon-76@2x",       "size":152},	//iPad and iPad mini (@2x)
      {"name": "icon-76",          "size":76},	//iPad 2 and iPad mini (@1x)
      
      {"name": "icon",             "size":57},	//iPhone Non-Retina (iOS 6.1 and Prior)
      {"name": "icon@2x",          "size":114},	//iPhone Retina (iOS 6.1 and Prior)
      {"name": "icon-72",          "size":72},	//iPad Non-Retina (iOS 6.1 and Prior)
      {"name": "icon-72@2x",       "size":144},	//iPad Retina (iOS 6.1 and Prior)
      
//for Spotlight search results icon

      {"name": "icon-40",    "size":40},	//iPad Non-Retina
      {"name": "icon-40@2x", "size":80},    //iPad Retina
      {"name": "icon-40@3x", "size":120},   //iPhone 6 Plus
 
//for Settings icon
  
      {"name": "icon-small",       "size":29},	//iPhone Non-Retina (iOS 6.1 and Prior)
      {"name": "icon-small@2x",    "size":58},	//iPhone Retina (iOS 6.1 and Prior)
      {"name": "icon-small@3x",    "size":87},	//iPhone 6 Plus

      {"name": "icon-50",    "size":50},	//iPad Non-Retina (iOS 6.1 and Prior)
      {"name": "icon-50@2x", "size":100},	//iPad Retina (iOS 6.1 and Prior)
    ];

    var icon;
    for (i = 0; i < icons.length; i++) 
    {
      icon = icons[i];
      doc.resizeImage(icon.size, icon.size, // width, height
                      null, ResampleMethod.BICUBICSHARPER);

      var destFileName = icon.name + ".png";

      if ((icon.name == "iTunesArtwork@2x") || (icon.name == "iTunesArtwork"))
      {
        // iTunesArtwork files don't have an extension
        destFileName = icon.name;
      }

      doc.exportDocument(new File(destFolder + "/" + destFileName), ExportType.SAVEFORWEB, sfw);
      doc.activeHistoryState = startState; // undo resize
    }

    alert("iOS Icons created!");
  }
}
catch (exception)
{
  // Show degbug message and then quit
	if ((exception != null) && (exception != ""))
    alert(exception);
 }
finally
{
    if (doc != null)
        doc.close(SaveOptions.DONOTSAVECHANGES);
  
    app.preferences.rulerUnits = initialPrefs; // restore prefs
}