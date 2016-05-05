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
    
//for Default-568h@2x~iphone 640x1136
      {"name": "Default-568h@2x~iphone", "sizewidth":640, 'sizeheight':1136},

//for Default-667h 750x1134
      {"name": "Default-667h", "sizewidth":750, "sizeheight":1134},
//for Default-736h 1242x2208
      {"name": "Default-736h", "sizewidth":1242, "sizeheight":2208},
//for Default-Landscape-736h 2208x1242
      {"name": "Default-Landscape-736h", "sizewidth":2208, "sizeheight":1242},
//for Default-Landscape@2x~ipad 2048x1536
      {"name": "Default-Landscape@2x~ipad", "sizewidth":2048, "sizeheight":1536},
//for Default-Landscape~ipad 1024x768
      {"name": "Default-Landscape~ipad", "sizewidth":1024, "sizeheight":768},
//for Default-Portrait@2x~ipad 1536x2048
      {"name": "Default-Portrait@2x~ipad", "sizewidth":1536, "sizeheight":2048},
//for Default-Portrait~ipad 768x1024
      {"name": "Default-Portrait~ipad", "sizewidth":768, "sizeheight":1024},
//for Default@2x~iphone 640x960
      {"name": "Default@2x~iphone", "sizewidth":640, "sizeheight":960},
//for Default~iphone 320x480
      {"name": "Default~iphone", "sizewidth":320, "sizeheight":480}
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