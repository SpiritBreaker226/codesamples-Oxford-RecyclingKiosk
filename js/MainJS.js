var timerAnwser;//holds the timer instance for anwser timer

//prototypes

String.format = function() {
    // The string containing the format items (e.g. "{0}")
    // will and always has to be the first argument.
    var theString = arguments[0];
    
    // start with the second argument (i = 1)
    for (var i = 1; i < arguments.length; i++) 
	{
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }//end of for loop
    
    return theString;
};//end of String.format()

//Device functions

//alert dialog dismissed
function alertDismissed()
{
}//end of alertDismissed()

//Phonegap functions

//Check network status
function reachableCallback()
{
	var networkState = navigator.network.connection.type;

	var states = {};
	states[Connection.UNKNOWN]  = 'Unknown connection';
	states[Connection.ETHERNET] = 'Ethernet connection';
	states[Connection.WIFI]     = 'WiFi connection';
	states[Connection.CELL_2G]  = 'Cell 2G connection';
	states[Connection.CELL_3G]  = 'Cell 3G connection';
	states[Connection.CELL_4G]  = 'Cell 4G connection';
	states[Connection.NONE]     = 'No network connection';

	return states[networkState];
}//end of reachableCallback()

function onGPSFail(error) 
{
	//checks the code if the code is a 2 meaning location is not in service
	//or three meaning the a timeout error has orrured
	if(error.code === 2)
	{
		//displays and Alert to the user
		navigator.notification.alert('Location Service is Turn Off\nGo to Settings->Location Services and turn on Recycling',alertDismissed,'Alert','OK');
	}//end of if
	else if(error.code === 3)
	{
		//displays and Alert to the user
		navigator.notification.alert('Unable to Find Location',alertDismissed,'Alert','OK');		
	}//end of else if
	else
	{
		//displays and Alert to the user
		navigator.notification.alert(error.message,alertDismissed,'Alert','OK');
	}//end of else
	
	//displays the error to the console
	console.log("An GPS error has occurred:\nCode: " + error.code + "\nMessage: " + error.message,alertDismissed);
}//end of onGPSFail()

//writes a CSV file to the device

//writes the file onto the device
function gotCSV(fileSystem)
{
	console.log("Get CSV File");
	
	fileSystem.root.getFile("data.csv", {create: true, exclusive: false}, function(fileEntry){
		fileEntry.createWriter(gotFileCSVWriter, onWriteFail);
	}, onWriteFail);
	
	console.log("Leaving Get CSV File");
}//end of gotCSV()

//writes the file onto the device
function gotFile(fileSystem)
{
	console.log("Get CSV File");
	
	fileSystem.root.getFile("data.csv", {create: true, exclusive: false}, function(fileEntry){
		fileEntry.createWriter(gotFileCSVWriter, onWriteFail);
	}, onWriteFail);
	
	console.log("Leaving Get CSV File");
}//end of gotCSV()

//writes the device
function gotFileCSVWriter(writer) 
{
	console.log("Start Writing CSV File");
	
	console.log("Writing Content");
	
	//does the actully writing on the device	
	writer.write(window.localStorage.getItem("strRawData"));
	
	//runs if the writing is successful
	writer.onwrite = function(evt) {
		console.log("Sending Email" + evt.target.fileName);
		
		//show an email composer + window.localStorage.getItem("strRawData")
		window.plugins.emailComposer.showEmailComposerWithCallback(emailCallback,"Export Data from Recycling Kiosh","Hi,<br/><br/>Here is the data from one of the devices<br/><br/>",[],[],[],true,[evt.target.fileName]);

		console.log("Email Sent");
    };
		
	console.log("End Writing CSV File");
}//end of gotFileCSVWriter()

//writes the fail
function onWriteFail(error) 
{
	console.log("CSV Error\n\nCode: " + error.code + "\nMessage: " + error.message);
}//end of onWriteFail()

//writes the text into a file
function writeCSVText()
{
	console.log("Creating CSV");
		
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotCSV, onWriteFail);
		
	console.log("CSV Created");
}//end of writeCSVText()

// JavaScript Document

//Adds text to any part of the body of a HTML
function addNode(tagParent,strText,boolAddToBack, boolRemoveNode)
{
	var strNode = document.createTextNode(strText);//holds the test which will be added
	 
	//gets the properties of the node
	tagParent = getDocID(tagParent);
	
	//checks if the user whats to replace the node in order to start with a clean slate
	//it also checks if there is a chode node to replace
	if (boolRemoveNode === true && tagParent.childNodes.length > 0)
	{
		//replaces the current node with what the user wants
		tagParent.replaceChild(strNode,tagParent.childNodes[0]);
	}//end of if
	else
	{
		//checks if the user whats to added to the back of the id or the front
		if(boolAddToBack === true)
			tagParent.appendChild(strNode);
		else
			//This is a built-in function of Javascript will add text to the beginning of the child
			insertBefore(strNode,tagParent.firstChild);
	}//end of if else
	
	//returns the divParent in order for the user to use it for more uses
	return tagParent;
}//end of addNode()

//removes from view all tags in tagContainer with the expection of tagActive
//It assumes the tagActive and tagContiner already have the properties
function classToggleLayer(tagContainer,tagActive,strClassName,strTAGName)
{
	var arrTAG = tagContainer.getElementsByTagName(strTAGName);//holds all strTAGName in tagContainer
	
	//goes around the for each tag that getElementsByTagName found in tagContainter
	for(var intIndex = arrTAG.length - 1; intIndex > -1; intIndex--) 
	{
		//checks if the class name is the same as strClassName and it is not active if it is active then change the dispaly to block
		if(arrTAG[intIndex].className === strClassName && arrTAG[intIndex].id !== tagActive.id)
		{
			arrTAG[intIndex].style.display = arrTAG[intIndex].style.display? "":"";
		}//end of if
		else if(arrTAG[intIndex].id === tagActive.id && tagActive.style.display === "")
		{
			arrTAG[intIndex].style.display = arrTAG[intIndex].style.display? "":"block";
		}//end of else
	}//end of for loop
}//end of classToggleLayer()

//changes the image of a checkbox from
function changeCheckbox(tagImageCheckbox, strImageFile)
{
	//sets the values for the fields
	tagImageCheckbox = getDocID(tagImageCheckbox);

	//checks if the there is a text field and clear button
	if (tagImageCheckbox !== null)
	{
		//checks which value of the checkbox is false if so then set it to true
		//and sets image of tagImageCheckbox
		if(tagImageCheckbox.alt === "0")
		{
			tagImageCheckbox.alt = "1";	
			tagImageCheckbox.src = "img/Checkmark@2x.png";
		}//end of if
		else
		{
			tagImageCheckbox.alt = "0";
			tagImageCheckbox.src = "img/CheckmarkBox@2x.png";
		}//end of else
	}//end of if
}//end of changeCheckbox()

//Changes the display to either off or on
function changeDisplay(tagLayer,strDisplay)
{
	tagLayer = getDocID(tagLayer);//holds the active Layer
	
	//Checks if there is an active layer
	if (tagLayer !== "")
	{
		tagLayer.style.display = strDisplay;
	}//end of if
}//end of changeDisplay()

//changes the image of tagImage to what is in strImageSrc
function changeImage(tagImage,strImageSrc)
{
    //gets the properties of tagImage
    tagImage = getDocID(tagImage);
    
    //checks if there is a properties
    if(tagImage !== null)
	{
        tagImage.src = strImageSrc;
	}//end of if
}//end of changeImage()

//Changes the tagActive Class to have the an Select only class so that the tagActive will look different from the rest
//It assumes the tagActive and tagContiner already have the properties
function classToggleLayerChangeClass(tagContainer,tagActive,strClassName,strActiveClassName,strTAGName)
{
	var arrTAG = tagContainer.getElementsByTagName(strTAGName);//holds all strTAGName in tagContainer
	
	//goes around the for each tag that getElementsByTagName found in tagContainter
	for(var intIndex = arrTAG.length - 1; intIndex > -1; intIndex--) 
	{
		//checks if the class name is the same as strClassName and it is not active if it is active then adds an strActiveClassName
		if(arrTAG[intIndex].id !== tagActive.id)
		{
			arrTAG[intIndex].className = strClassName;
		}//end of if
		else if(arrTAG[intIndex].id === tagActive.id)
		{
			arrTAG[intIndex].className = strActiveClassName;
		}//end of else
	}//end of for loop
}//end of classToggleLayerChangeClass()

//counts from view all tags in tagContainer
//It assumes the tagContiner already have the properties
function classToggleLayerCounting(tagContainer,strClassName,strTAGName)
{
	var arrTAG = tagContainer.getElementsByTagName(strTAGName);//holds all strTAGName in tagContainer
	var intTag = 0;//holds the number of tags that is using the same class name in the tagContainer
	
	//goes around the for each tag that getElementsByTagName found in tagContainter
	for(var intIndex = arrTAG.length - 1; intIndex > -1; intIndex--) 
	{
		//console.log("Tag Class Name: " + arrTAG[intIndex].className + "\nSelected: " + strClassName + "\nNumber of Tags: " + intTag + "\n\n");
		
		//checks if the class name is the same as strClassName and if so then count it to the number of tags with the same class name
		if(arrTAG[intIndex].className === strClassName)
		{
			intTag++;
		}//end of if
	}//end of for loop
	
	return intTag;
}//end of classToggleLayerCounting()

//clears the text and removes the clear button
function clearText(tagTextField, tagClearButton, tagErrorIcon, boolClearField)
{
	//sets the values for the fields
	tagTextField = getDocID(tagTextField);
	tagClearButton = getDocID(tagClearButton);
	tagErrorIcon = getDocID(tagErrorIcon);

	//checks if the there is a text field and clear button
	if (tagTextField !== null && tagClearButton !== null && tagErrorIcon !== null)
	{
		//checks if the tagTextField needs to be clear
		if(boolClearField === true)
		{
			tagTextField.value = '';
		}//end of if
		
		//checks if the text in the field if so then display the the clear button
		//else remove it
		if(tagTextField.value !== '')
		{
			tagClearButton.style.display = 'block';
		}//end of if
		else
		{
			tagClearButton.style.display = '';
		}//end of else
			
		//removes the error icon as it is not needed
		tagErrorIcon.style.display = '';
	}//end of if
}//end of clearText()

//close the Awnser lightbox as it can only be display for 10 secords or if the user moves 
//a object
function closeGameAnwser()
{
	//checks if the game anwser is on if so then turn off
	if(getDocID("divGameAwnser").style.display === 'block')
	{
		toggleLayer('divGameAwnser','','');
	}//end of if
}//end of closeGameAnwser()

//does the display the a message in a on the page weather then an alert
function displayMessage(tagMessage,strMessText,boolAddToBack, boolRemoveNode)
{
	//gets the message properties and sets the text furthermore it does the display
	tagMessage = addNode(tagMessage,strMessText,boolAddToBack, boolRemoveNode);
	tagMessage.style.display = "block";	
	
	return tagMessage;
}//end of displayMessage()

//this is for the duel layers that sometimes is need
function duelToggleLayer(whichLayer,layer1,layer2)
{
	var activeLayer = "";//holds the active Layer	
	var style2 = "";//holds the style of layer1
	var style3 = "";//holds the style of layer2

	// this is the way the standards work
	if (whichLayer !== ''){activeLayer = getDocID(whichLayer);}
	if (layer1 !== ''){style2 = getDocID(layer1);}
	if (layer2 !== ''){style3 = getDocID(layer2);}

	//Checks if there is an active layer
	if (activeLayer !== "")
	{
		//checks if the activeLayer is already active and if so then skips code
		//since the layer cannot be turn off and leave a hole in the review layer
		if (activeLayer.style.display === "")
		{
			//removes the block from the display in order to make the layer to disapper	
			if (style2 !== ''){style2.style.display = style2.style.display? "":"";}

			//checks if there is a style3
			if (style3 !== ''){style3.style.display = style3.style.display? "":"";}
	
			//displays the new active Layer and updates its id
			activeLayer.style.display = activeLayer.style.display? "":"block";
		}//end of if
	}//end of if
}//end of duelToggleLayer()

//gives the user the message has been sent or not and changes the pop area
function endMessage(tagMessage, tagBody, boolDisplayErrorMessage)
{
	//checks if there is a message if so then reset it
	if(tagMessage !== "")
	{
		//resets the message
		displayMessage(tagMessage,"",true,true);
	}//end of if
		
	//checks if there is a body if so then display it again
	if(tagBody !== null)
	{
		//turn back on the body
		tagBody.style.display = '';
	}//end of if
	
	//checks if the error message should be display	
	if(boolDisplayErrorMessage === true)
	{
		navigator.notification.alert('Error has occur.',alertDismissed);
	}//end of if
}//end of endMessage()

//does a callback for when the email was sent or not
function emailCallback(intEmailCallback)
{
	console.log("Email Results: " + intEmailCallback);
	
	var strMessageID = "divMessage";//holds the id of the message div
	
	//checks which state the email is now in
	switch(intEmailCallback)
	{
		case 0:
			displayMessage(strMessageID,"Email Delete",true,true);
		break;
		case 1:
			displayMessage(strMessageID,"Draft Save",true,true);
		break;
		case 2:
			//displays tells the user that the email has been sent
			displayMessage(strMessageID,"Data Sent",true,true);
			//getDocID('divAdminReportHolder').style.display = '';
		break;
		case 3:
			displayMessage(strMessageID,"Email Send Fail",true,true);
		break;
		case 4:
			displayMessage(strMessageID,"Email Not Sent",true,true);
		break;
	}//end of switch
}//end of emailCallback()

//exports the data using mail to user
function exportData(tagMessage, tagAdminReportHolder)
{
	//checks if there is some raw data to use
	if(window.localStorage.getItem("strRawData") !== null)
		//creates the csv file with the data
		writeCSVText();
	else
		displayMessage(tagMessage,"Unable Send Export",true,true);
}//end of exportData()

//gets the document properties in order to use them as there are many types of browers with different versions
function getDocID(tagLayer)
{
	var tagProp = "";//holds the proerties of tagLayer
	
	//gets the whichLayer Properties depending of the differnt bowers the user is using
	//this is the way the standards work
	if (document.getElementById)
	{
		tagProp = document.getElementById(tagLayer);
	}//end of if
	//this is the way old msie versions work
	else if (document.all)
	{
		tagProp = document.all[tagLayer];
	}//end of else if
	//this is the way nn4 works
	else if (document.layers)
	{
		tagProp = document.layers[tagLayer];
	}//end of else if
	
	return tagProp;			
}//end of getDocID()


/**
 * Gets the name of the language using language code
 * @param  {String} strFileName                JSON file of where the language is
 * @param  {String} strLanguageCode            Language to load using the code
 * @return {String}
 */
function getLanguageName(strFileName, strLanguageCode)
{
	var strLangName = "";//holds the name of the language that is in the Language file

	//gets the all of the json Language Text
	$.ajax({
		dataType: "json",
		async: false,
		url: strFileName, 
		success: function(jsonData) {
			strLangName = jsonData[strLanguageCode].LangName;
		},
		error: function(jqxhr, textStatus, error) {
			console.log("Getting Language Name Request Failed: " + textStatus + ", " + error);
		}
	});

	return strLangName;
}//end of getLanguageName()

/**
 * Gets all of the text for a language
 * @param  {String} strFileName                JSON file of where the language is
 * @param  {String} strLanguageCode            Language to get using the code
 * @param  {String} strPageWhereTextToBeLoaded Page to get the text for
 */
function getLanguageText(strFileName, strLanguageCode, strPageWhereTextToBeLoaded)
{
	//gets the all of the json Language Text
	$.getJSON(strFileName, function(jsonData) {
			console.log("Getting Text For Language " + jsonData[strLanguageCode].LangName);

			//goes around each local stagoe that need to be called when using Main JS as there are text such as error messages 
			//and other that need to be change
			$.each(jsonData[strLanguageCode]["Main JS"], function(key, val) {
				//because all pages uses javascript it would be best to load it up on both pages
				window.localStorage.setItem(key, val);
			});

			//goes around each field that is in strPageWhereTextToBeLoaded
			$.each(jsonData[strLanguageCode][strPageWhereTextToBeLoaded], function(key, val) {
				var tagSelectTag = $("#" + key);//holds the jquery object of the selected Item tag

				//checks if there is a filed that is found on the page
				if(typeof(tagSelectTag) !== undefined)
				{
					//checks which type of tag the selected tag is
					switch(key.substring(0,3))
					{
						case "img":
							//use the src to display the image
							tagSelectTag.attr("src", val);
						break;
						case "div":
							//checks if this an array and if it is for the bins as it needs to add in the current
							//number of bins for the user to use
							if(Array.isArray(val) && key === "divGameAreaRight")
							{
								var intUseThisBin = 0;//holds the index of where in the array the games bin will be located

								//checks if this game is using the orange other bin as some buildings are using this
								//then selects that bins to use
								switch(window.localStorage.getItem("strGameTypeSpecial")) {
									case "WithOrangeBarttery":
										intUseThisBin = 2;
									break;
									case "WithOrangeOtherRecycling":
										intUseThisBin = 3;
									break;
									case "WithOtherRecycling":
										intUseThisBin = 4;
									break;
									case "WithOtherRecyclingForThreeBins":
										intUseThisBin = 5;
									break;
									default:
										//checks if this building has only two recycling program
										if(parseInt(window.localStorage.getItem("intTypeRecyclingNumber")) === 3)
											intUseThisBin = 1;
									break;
								}// end of switch

								//replaces the name of the id with the bin that is suppose to be in the game
								tagSelectTag.attr("id", val[intUseThisBin]);
							}//end of if
							else
								//replaces the name of the div as it have an differnt
								tagSelectTag.attr("id", val);
						break;
						case "txt":
							//replaces the name of the txt as it have an differnt
							tagSelectTag.attr("placeholder", val);
						break;
						default:
							//checks if this value as both a text and style as 
							if(Array.isArray(val))
							{
								tagSelectTag.html(val[0]);
								tagSelectTag.attr("id", val[1]);
							}//end of if
							else
								//if it the selected tag is an text then use the innerHTML
								tagSelectTag.html(val);
						break;
					}//end of switch
				}//end of if
			});
		})
		.fail(function(jqxhr, textStatus, error) {
			console.log("Getting Language Text Request Failed: " + textStatus + ", " + error);
		});
}//end of geetLanguageText()

/**
 * gets the game details and text from both the database and language file
 * @return {bool}
 */
function loadGameDetailsAndText()
{
	console.log("Loading Game Details For: " + window.localStorage.getItem("intGameTypeID"));

	var arrGameAvailiableGameIDs = window.localStorage.getItem("strGameAvailiableGameIDs").split(",");//holds all of the games that are attach to this building

	console.log("Available Game IDs: " + arrGameAvailiableGameIDs.length);

	//loads the text into the SignUp Page
	getLanguageText(window.localStorage.getItem("strGameLanguageFile"), window.localStorage.getItem("strGameCurrentLanguage"), "Sign Up");

	//checks if this building has only two recycling program
	if(parseInt(window.localStorage.getItem("intTypeRecyclingNumber")) === 3)
		// changes the number of bin icons to two as there is number of major bins that are in this game
		getDocID("imgRecyclingIcons").src = "img/RecyclingIcons-2@2x.png";

	//checks if there is more then one game
	if(arrGameAvailiableGameIDs.length > 1)
	{
		var tagFooterLang = getDocID("divFooterLanguage");//holds the placeholder there the links for the language will be

		//checks if there is a language place holder
		if(tagFooterLang !== null)
		{
			//goes around each game that is in this building and adding it the language placegholder either as a link or as a non linki
			//meaning has been selected
			for (var intIndex = 0; intIndex < arrGameAvailiableGameIDs.length; intIndex++)
			{
				var arrLangTypeGameIDs = arrGameAvailiableGameIDs[intIndex].split(":");//holds both the language(0) and game type id(1) for this game
				var strLanguageName = getLanguageName(window.localStorage.getItem("strGameLanguageFile"), arrLangTypeGameIDs[0]);//holds the name of the language

				//TODO when reading the langugage file find out how to read the anme of thelanguage
				console.log(window.localStorage.getItem("strGameCurrentLanguage") + "=" + arrLangTypeGameIDs[0]);

				//checks this lanaguage has been selected
				if(window.localStorage.getItem("strGameCurrentLanguage") === arrLangTypeGameIDs[0])
					tagFooterLang.innerHTML += "<label class='lblFooterLanguage'>" + strLanguageName + "</label>";
				else
					tagFooterLang.innerHTML += "<a href='javascript:void(0);' onclick='getGameDetails(" + 
					"&quot;divMessage&quot;, " + 
					arrLangTypeGameIDs[1] + ", " + 
					"&quot;SignUp.html&quot;" +
					");' class='aFooterLanguage lblFooterLanguage'>" + strLanguageName + "</a>";
			}//end of for loop
		}//end of if
	}//end of if

	return true;
}//end of loadGameDetailsAndText()

//set up the form to not be used while sending the message
function preSendEMail(tagMessage,strMessage,tagHiddenElement)
{
	//display to the user their message is beening sent and disables the textbox area
	displayMessage(tagMessage,strMessage,true,true);
	tagHiddenElement.style.display = 'none';
}//end of preSendEMail()

//resets the game for the next round
function resetGame(tagStage, tagGameScore, tagGameResultsScore, tagGameResultsIntroText, tagGameAreaResultStarRate, tagGameBG, tagDidYouKnowInner, tagWrongAwnserBodyContainer, tagLoadingScreen,  tagGameNextStage, tagTrashHolder, tagProgressHolder)
{
	try
	{
		//updates the staging
		window.localStorage.setItem("intCurrentStage", (parseInt(window.localStorage.getItem("intCurrentStage")) + 1));	
		
		console.log("Current Stage: " + window.localStorage.getItem("intCurrentStage"));
		
		//checks if the next stage button is on if so then turn off
		if(getDocID(tagGameNextStage).style.display === 'block')
		{
			//displays the next stage button to alout the user to move to the next stage
			toggleLayer(tagGameNextStage,'','');
		}//end of if
		
		//checks if this was the final stage if so then displays the results to the user
		if(parseInt(window.localStorage.getItem("intCurrentStage")) > 3)
		{
			var intGameResultsByPercent = Math.floor((parseInt(window.localStorage.getItem("intPercent")) / (parseInt(window.localStorage.getItem("intGameTypeObjectsPerStageNumber")) * 3)) * 100);//holds the Percents of the game results

			//sets the score for display to the user
			tagGameResultsScore.innerHTML = tagGameScore.innerHTML;

			//checks if the user get it perfcet
			if(intGameResultsByPercent === 100)
				tagWrongAwnserBodyContainer.style.display = 'none';

			//displays a different message for pepole over 50 sroce
			if(intGameResultsByPercent >= 50)
				tagGameResultsIntroText.innerHTML = String.format(window.localStorage.getItem("strGameResultsIntroText"), intGameResultsByPercent);
			
			//checks which score the user has gotten and then displays the stars base on it
			if(intGameResultsByPercent <= 25)
			{
				tagGameAreaResultStarRate.alt += "1";
				tagGameAreaResultStarRate.src = "img/StarRate1@2x.png";
			}//end of if
			else if(intGameResultsByPercent > 25 && intGameResultsByPercent <= 50)
			{
				tagGameAreaResultStarRate.alt += "2";
				tagGameAreaResultStarRate.src = "img/StarRate2@2x.png";
			}//end of if		
			else if(intGameResultsByPercent > 50 && intGameResultsByPercent <= 75)
			{
				tagGameAreaResultStarRate.alt += "3";
				tagGameAreaResultStarRate.src = "img/StarRate3@2x.png";
			}//end of if
			else if(intGameResultsByPercent > 75 && intGameResultsByPercent <= 99)
			{
				tagGameAreaResultStarRate.alt += "4";
				tagGameAreaResultStarRate.src = "img/StarRate4@2x.png";
			}//end of if
			else
			{
				tagGameAreaResultStarRate.alt += "5";
				tagGameAreaResultStarRate.src = "img/StarRate5@2x.png";
			}//end of if

			//displays the loading page for the time the game is resetting
			toggleLayer(tagLoadingScreen,'divLoadingGrayBG','');
			
			//updates the users score
			updateUser(tagGameScore.innerHTML, tagLoadingScreen);
					
			console.log("intFinalScore=" + tagGameScore.innerHTML + "&UserID=" + window.localStorage.getItem("intUserID"));
					
			return false;
		}//end of if
		//change if this is the 2 stage and if so then change the background to Food Court
		else if(parseInt(window.localStorage.getItem("intCurrentStage")) === 2)
		{
			tagGameBG.src = "img/BGLevelLobby@2x.png";
		}//end of else if
		//change if this is the 3 stage and if so then change the background to Office
		else if(parseInt(window.localStorage.getItem("intCurrentStage")) === 3)
		{
			tagGameBG.src = "img/BGLevelFoodCourt@2x.png";
			
			//changes the Next Button to say Finsh
			getDocID("spanGameNextStage").innerHTML = window.localStorage.getItem("strGameResultsViewResults");
		}//end of else if
					
		//updates the displays for the staging
		tagStage.innerHTML = window.localStorage.getItem("intCurrentStage");
			
		//goes around changing removing all marks and background back to the orginal settings for the next stage
		for(var intIndex = 0; intIndex < parseInt(window.localStorage.getItem("intGameTypeObjectsPerStageNumber")); intIndex++) 
		{
			tagMarkHolder = $("#" + "divGameItemScore" + intIndex);//holds the holder for the marks
			tagMark = getDocID("imgGameItemScore" + intIndex);//holds the image for the marks
			
			//checks if this is the first markholder
			if(intIndex !== parseInt(window.localStorage.getItem("intGameTypeObjectsPerStageNumber")))
			{
				//skip it as it needs to be stay and as the fist item being selected
				tagMarkHolder.removeClass("divGameItemScoreActive");
			}//end of if
			
			//remove the mark from the screen
			tagMark.className = "divJustHidden";
		}//end of for loop
		
		//displays the loading page for the time the game is resetting
		toggleLayer(tagLoadingScreen,'divLoadingGrayBG','');
		
		//sets up the game pices for the next stage
		loadingStage(tagDidYouKnowInner, tagLoadingScreen, tagTrashHolder, tagProgressHolder);
	}//end of try
    catch (ex) {
        console.log("Reset Game Error: " + ex.message);

        return false;
    }//end of catch

	return true;
}//end of resetGame()

//add the user comments about the game attach the user who has just played the game
function sendGameComment(tagMessage, tagUserComment, tagGameCommentsShareIdeas, tagGameCommentsThankYou)
{
	console.log("Add User Comments");
	
	if (tagUserComment.value === "")
	{displayMessage(tagMessage, window.localStorage.getItem("strGameCommentErrorMessage"), true, true);
		return false;}
	
	//adds the user comments
	updateUserComment(tagMessage, tagUserComment, tagGameCommentsShareIdeas, tagGameCommentsThankYou);
	
	return true;
}//end of sendGameComment()

//Logs the play of the game
function sendLogPlayGame(tagTargetBin, tagSelectTrash, tagResultWrongAwnser, tagMarkHolder, tagMark, tagGameScore, tagGameAwnserImage, tagGameAwnser, tagLGGameAwnser, tagLoadingScreen, tagGameNextStage)
{
	console.log("Current Trash Number: " + classToggleLayerCounting(getDocID("divGameAreaHeader"),"drag ui-draggable","img"));
		
	//displays the loading page for the time of getting the results of the logging of the game
	toggleLayer(tagLoadingScreen,'divLoadingGrayBG','');
	
	//hides the selceted trash from the user in order for them not to use it again
	tagSelectTrash.className += " divJustHidden";
	
	//adds the game log with the users awnser 
	//and adjust the game field to display their awnser and remove the field
	addGameLog(tagTargetBin, tagSelectTrash, tagResultWrongAwnser, tagMarkHolder, tagMark, tagGameScore, tagGameAwnserImage, tagGameAwnser, tagLGGameAwnser, tagLoadingScreen, tagGameNextStage);
	
	return true;
}//end of sendLogPlayGame()

//Login to the game for the Admin
function sendLogin(tagMessage, tagBuildingID, tagAdminLogin, tagBuildingIDClear, tagAdminLoginClear,  tagAdminLoginError, tagAdminLoginTitle, tagBody)
{
	var boolDisplayError = false;//holds the if there was any error in the display
			
	//checks if there is a Building ID
	if (tagBuildingID.value === "")
	{
		//displays the error and removes the clear button as it is in the same area	
		tagBuildingIDClear.style.display = '';
		tagAdminLoginError.style.display = 'block';
		
		return false;
	}//end of if
	else if(tagBuildingID.value === "@x1O")
		//goes to the Admin section if the user knows some chars
		window.location = 'Admin.html';

	//checks if there is a Admin Login
	if (tagAdminLogin.value === "" && window.localStorage.getItem("intGameTypeID") !== null)
	{
		//displays the error and removes the clear button as it is in the same area	
		tagAdminLoginClear.style.display = '';
		tagAdminLoginError.style.display = 'block';
		
		return false;
	}//end of if
			
	//checks if there is already a building id if so then 
	//add the admin name and go to the sign up page
	if(window.localStorage.getItem("intGameTypeID") !== null)
	{
		//sets the name of the Admin
		window.localStorage.setItem("strAdminName", tagAdminLogin.value);
		
		console.log("Game Type: " + window.localStorage.getItem("intGameTypeID"));
		console.log("Building ID: " + window.localStorage.getItem("intBuildingID"));
		console.log("Admin Name: " + window.localStorage.getItem("strAdminName"));

		//checks if the loads up the default game for this building has any errors if so then stops
		//the app from going into the game also it is here as the select is still going on when crearing language links
		if(getGameDetails(tagMessage, parseInt(window.localStorage.getItem("intGameTypeID")), "SignUp.html") === false)
			return false;
	}//end of if
	
	//sets the page for send to the Database
	preSendEMail(tagMessage, "Checking...", tagBody);
	
	console.log("Checking Building ID");
	
	//checks if there the user is a buidling
	checkBuildingID(tagMessage, tagBuildingID, tagAdminLogin, tagBuildingIDClear, tagAdminLoginClear,  tagAdminLoginError, tagAdminLoginTitle, tagBody);
	
	return true;
}//end of sendLogin()

//Register to the game
function sendRegister(tagMessage, tagFirstName, tagLastName, tagOrg, tagEMail, tagKeepMe, tagFirstNameClear, tagLastNameClear, tagOrgClear, tagEMailClear, tagFirstNameError, tagLastNameError, tagOrgError, tagEMailError, tagBody, tagBottomBody, tagLoadingScreen)
{
	var strEmailFilter = /^.+@.+\..{2,3}$/;//holds the filtter for the Email
	var boolDisplayError = false;//holds the if there was any error in the display
	var boolKeep = true;//holds the value of if the uer wants to be keep up with information
			
	//checks if there is a First Name
	if (tagFirstName.value === "")
	{
		//displays the error and removes the clear button as it is in the same area	
		tagFirstNameClear.style.display = '';
		tagFirstNameError.style.display = 'block';
		
		//sets the mark to stop the fourm
		boolDisplayError = true;
	}//end of if
			
	//checks if there is a Last Name
	if (tagLastName.value === "")
	{
		//displays the error and removes the clear button as it is in the same area	
		tagLastNameClear.style.display = '';
		tagLastNameError.style.display = 'block';
		
		//sets the mark to stop the fourm
		boolDisplayError = true;
	}//end of if
			
	//checks if there is a Organization
	if (tagOrg.value === "")
	{
		//displays the error and removes the clear button as it is in the same area	
		tagOrgClear.style.display = '';
		tagOrgError.style.display = 'block';
		
		//sets the mark to stop the fourm
		boolDisplayError = true;
	}//end of if
				
	//checks if there is a Email
	if (tagEMail.value === "")
	{
		//displays the error and removes the clear button as it is in the same area	
		tagEMailClear.style.display = '';
		tagEMailError.style.display = 'block';
		
		//sets the mark to stop the fourm
		boolDisplayError = true;
	}//end of if
	
	//checks if there is a error with the fourm
	if(boolDisplayError === true)
		return false;
	
	//checks if the Email Format is current
	if (strEmailFilter.test(tagEMail.value) === false)
		{displayMessage(tagMessage,window.localStorage.getItem("strEmailAddressErrorValid"),true,true);
			return false;}
	else if (tagEMail.value.match(/[\(\)\<\>\,\;\:\\\/\"\[\]]/))
		{displayMessage(tagMessage,window.localStorage.getItem("strEmailAddressErrorillegalChar"), true, true);
			return false;}
			
	//checks if tagKeepMe.alt is 0 meaning that the user does not want to get updates
	if(tagKeepMe.alt === "0")
		boolKeep = false;
		
	//displays the loading page for the time the game is resetting
	toggleLayer(tagLoadingScreen,'divLoadingGrayBG','');
	
	//add the user to the database and starts the game
	addUser(tagMessage, tagFirstName, tagLastName, tagOrg, tagEMail, boolKeep, tagLoadingScreen);
	
	return true;
}//end of sendRegister()

//starts up the game page
function startUpGame()
{
	console.log("Game Area Loading - Set Percent And Current Stage for Local Storage");

	//sets the Percent of the recyclable items
	window.localStorage.setItem("intPercent", "0");
					
	//sets the default for the current stage in order to keep track of it
	window.localStorage.setItem("intCurrentStage", "0");
	
	console.log("Game Area Loading - Language File");

	//Loading Up the text For the Game Area
	getLanguageText(window.localStorage.getItem("strGameLanguageFile"), window.localStorage.getItem("strGameCurrentLanguage"), "Play Area");

	console.log("Game Area Loading - Recycling program");

	//checks if this building has only two recycling program
	if(parseInt(window.localStorage.getItem("intTypeRecyclingNumber")) === 3)
	{
		//change the lightbox for two recycling
		getDocID("divGameAreaPlayNowRight").style.display = 'none';
		getDocID("divGameAreaPlayNowLeft").id = "divGameAreaPlayNowLeftTwoRecycling";
		getDocID("divGameAreaPlayNowMiddle").id = "divGameAreaPlayNowMiddleTwoRecycling";
		
		//sets the bins to display for two recycling
		getDocID("1").className += " divGameAreaBinLeftTwoRecycling";
		getDocID("2").className += " divGameAreaBinLeftTwoRecycling";
		getDocID("3").style.display = 'none';
		getDocID("4").className += " divGameAreaBinRightTwoRecycling";
	}//end of if

	console.log("Game Area Loading - Objects Per Stage");

	//goes around displaying the number of objects per stage that will be display
	for(var intIndex = 0; intIndex < parseInt(window.localStorage.getItem("intGameTypeObjectsPerStageNumber")); intIndex++) 
	{
		tagMarkHolder = $("#" + "divGameItemScore" + intIndex);//holds the holder for the marks
		tagItems = $("#" + "imgGameItem" + intIndex);//holds the image for the items

		//turns on the MarkHolder and Items if it was turn off as there are games that have lesser then objects on the screen
		tagItems.removeClass("divJustHidden");
		tagMarkHolder.removeClass("divJustHidden");
	}//end of for loop
					
	console.log("Game Area Loading - Turns On The Intro Lightbox");
	
	//turns on the intro lightbox to tell the user how to play the game
	toggleLayer('divPlayNow','divGrayBG','');
	
	console.log("Game Area Loading - Reset Game");
	
	//sets the game for the first round this needs a database to work
	resetGame(getDocID("lblGameStage"),getDocID("lblGameScore"),getDocID("spanGameResultsScore"),getDocID("lblGameResultsIntroText"),getDocID("imgGameAreaResultStarRate"),getDocID("imgGameBG"),getDocID("lblDidYouKnowInner"),getDocID("divGameAreaWrongAwnserBodyContent"),"divLoadingScreen","divGameNextStage","divGameAreaHeader","divGameAreaProgress");
	
	console.log("Game Area Loaded");
}//end of startUpGame()

//shoes and hides a <div> using display:block/none from the CSS
function toggleLayer(tagLayer,tagGrayOut,tagMedia)
{
	var tagStyle = '';//holds the style of tagLayer

	//gets the tagLayer and tagGrayOut Properties
	tagStyle = getDocID(tagLayer);
	tagGrayOut = getDocID(tagGrayOut);
	tagMedia = getDocID(tagMedia);
		
	if (tagStyle !== null)
	{tagStyle.style.display = tagStyle.style.display? "":"block";}
	
	if (tagGrayOut !== null)
	{tagGrayOut.style.display = tagGrayOut.style.display? "":"block";}
}//end of toggleLayer()