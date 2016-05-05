try
{
  // Prompt user to select iTunesArtwork file. Clicking "Cancel" returns null.
  var iTunesArtwork = File.openDialog("Select a sqaure PNG file that is at least 2208x2208.", "*.png", false);

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

    if ((doc.width < 2208) || (doc.height < 2208))
    {
        throw "Image is too small!  Image must be at least 2208x2208 pixels.";
    }
    
    // Folder selection dialog
    var destFolder = Folder.selectDialog( "Choose an output folder");

    if (destFolder == null)
    {
      // User canceled, just exit
      throw "";
    }

    // Save images in PNG using Save for Web.
    var sfw = new ExportOptionsSaveForWeb();
    sfw.format = SaveDocumentType.PNG;
    sfw.PNG8 = false; // use PNG-24
    sfw.transparency = false;
    doc.info = null;  // delete metadata

//References:
//http://developer.apple.com/library/ios/#documentation/UserExperience/Conceptual/MobileHIG/IconsImages/IconsImages.html%23//apple_ref/doc/uid/TP40006556-CH14-SW2    

    var splashs = [
    

      {"name": "drawable-port-xxxhdpi-screen", "sizewidth":1280, 'sizeheight':1920},
      {"name": "drawable-port-xxhdpi-screen", "sizewidth":960, "sizeheight":1600},
      {"name": "drawable-port-xhdpi-screen", "sizewidth":720, "sizeheight":1280},
      {"name": "drawable-port-mdpi-screen", "sizewidth":320, "sizeheight":480},
      {"name": "drawable-port-ldpi-screen", "sizewidth":200, "sizeheight":320},
      {"name": "drawable-port-hdpi-screen", "sizewidth":480, "sizeheight":800},
      {"name": "Default-Landscape~ipad", "sizewidth":1024, "sizeheight":768},

      {"name": "drawable-land-xxxhdpi-screen", "sizewidth":1920, "sizeheight":1280},
      {"name": "drawable-land-xxhdpi-screen", "sizewidth":1600, "sizeheight":960},
      {"name": "drawable-land-xhdpi-screen", "sizewidth":1280, "sizeheight":720},
      {"name": "drawable-land-hdpi-screen", "sizewidth":800, "sizeheight":480},
      {"name": "drawable-land-mdpi-screen", "sizewidth":480, "sizeheight":320},
      {"name": "drawable-land-ldpi-screen", "sizewidth":320, "sizeheight":200}

    ];

    var splash;
    for (i = 0; i < splashs.length; i++) 
    {
      splash = splashs[i];

      var bounds,firstpoint,secondpoint,thirdpoint,fouthpoint;
      if(splash.sizewidth > splash.sizeheight){
        doc.resizeImage(splash.sizewidth, splash.sizewidth);
        firstpoint = 0;
        secondpoint = (splash.sizewidth-splash.sizeheight)/2;
        thirdpoint = splash.sizewidth;
        fouthpoint = splash.sizeheight + secondpoint;

      }else{
        doc.resizeImage(splash.sizeheight, splash.sizeheight);
        firstpoint = (splash.sizeheight-splash.sizewidth)/2;
        secondpoint = 0;
        thirdpoint = splash.sizewidth + firstpoint;
        fouthpoint = splash.sizeheight;

      }

      bounds = [firstpoint,secondpoint,thirdpoint,fouthpoint];

      doc.crop(bounds);

      var destFileName = splash.name + ".png";


      doc.exportDocument(new File(destFolder + "/" + destFileName), ExportType.SAVEFORWEB, sfw);
      doc.activeHistoryState = startState; // undo resize
    }

    alert("iOS splash created!");
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