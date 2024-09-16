// Send daily emails with positive messages, jokes, fun facts, and quotes to a list of recipients.
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Daily Email Sender')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function getuser() {
  var email = Session.getActiveUser().getEmail();
  return email;
}
  // Define the list of recipient email addresses and names as an object
var recipients = {
  'tabassumsheikh2708@gmail.com': 'Tabassum Nisha,1994-08-27',
  'realshad07@gmail.com': 'Shad Perwez,1994-10-14',
};
// Define the list of recipients for whom you want to send Hindi jokes
var hindirecipients = [
  'khanjordan440@gmail.com', 'wascr7zafar@gmail.com', 'www.mirzatalifbaig@gmail.com',
];

var gmArray = [
  "<img src='https://drive.google.com/uc?id=1r9VPVfDsRTKNXNAh4_jmJZlAcW2KFsXx' alt='Good Morning' width='147' height='27.5' />\n",
  "<img src='https://drive.google.com/uc?id=1RMwbOwZuRNCT_oUvJhjUIg09n6Y4j9Bv' alt='Good Morning' width='147' height='18' />\n",
  "<img src='https://drive.google.com/uc?id=11mNjlws1MqDKiMz713T_Gipyba9F_UYe' alt='Good Morning' width='147' height='17' />\n",
  "<img src='https://drive.google.com/uc?id=19wVaq5kiyy4GhjREfin6u-L9MxMah0H6' alt='Good Morning' width='147' height='17' />\n",
  "<img src='https://drive.google.com/uc?id=1w7I4uPgos_43cpQVIEstEDBdm5pjLeMg' alt='Good Morning' width='147' height='16' />\n",
];
var hours = new Date().getHours();
let ccAddresses = [];
let successFlag = false; 
var apiUrl1 = "https://v2.jokeapi.dev/joke/Any?format=txt";
var apiUrl2 = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,sexist&format=txt";
var dayOfWeek = getDayOfWeek();
let name = 'Friend';
let emailBody = '';
var callError = '';

function sendEmail(inputRecipient, inputBody, getBody) {
  var recipientsData = SpreadsheetApp.getActiveSpreadsheet().getDataRange().getValues();
  //var recipientsData = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1').getRange('A2:C').getValues();
  
  for (var i = 0; i < recipientsData.length; i++) {
    var email = recipientsData[i][0];
    var name = recipientsData[i][1];
    var birthdate = recipientsData[i][2];
    
    recipients[email] = name + "," + birthdate;
  }
  // Loop through the recipients object and send an email to each recipient
  var holidayInfo = getHolidayInfo();
  var isHoliday = holidayInfo.isHoliday;
  var holidayName = holidayInfo.holidayName;
  var holidayType = holidayInfo.holidayType;
  var batchCounter = 0;
  for (var recipientEmail in recipients) {
    var recipientInfo = recipients[recipientEmail];
    var recipientInfoArray = recipientInfo.split(',');
    var recipientName = recipientInfoArray[0];
    var recipientDOB = recipientInfoArray[1];
    if (!isValidEmail(recipientEmail)) {
      console.log("Invalid email address "+ recipientEmail);
      //return 'Invalid email address';
      continue;
    }
    var subject = `${getTimeOfDay()}, It's ${dayOfWeek}`;
    var englishJoke = getEnglishJoke(recipientEmail);
    var probability = Math.random() < 0.5; // 50% chance of including an HindiJoke
    var daymessage = dayMessages[dayOfWeek][Math.round(Math.random())];
    // check recipientEmail or inputRecipient in the hindirecipients
    if (hindirecipients.includes(recipientEmail) || (inputRecipient && hindirecipients.includes(inputRecipient))) {
      var joke = probability ? getHindiJoke() : getCustomJoke(apiUrl1); // Randomly select a joke
    } else { 
      var joke = getCustomJoke(apiUrl2); // Send a custom joke for others
    }
    name = (recipientName || getName(recipientEmail)) || name;
    var user = getuser();
    
    // if (inputRecipient) {
    //   var emailParts = inputRecipient.split(",");
    //   var inputEmail = emailParts[0].trim();
    //   var inputName = emailParts[1];
    //   recipientDOB = emailParts[2];
    
    //   if (isValidEmail(inputEmail)) {
    //     name = inputName || recipients[inputEmail]?.split(',')[0] || getName(inputEmail) || name;
    //   } else {
    //     console.log("Invalid email address: " + inputEmail);
    //     continue;
    //   }
    // } else if (getBody) {
    //   name = (recipients[user]?.split(',')[0] || getName(user)) || name;
    // }
    // Add text effect as background image
    var getbgurl = bgUrl();
    var bgurl = getbgurl.bgurl;
    // var textColor = getbgurl.textColor;
    // emailBody = `<div style="background-image: url('${bgurl}'); background-size: cover; background-repeat: no-repeat; background-position: center center; min-height: 400px; color: ${textColor};">`;
    // For fading effect to the background image
    emailBody = `<div style="background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${bgurl}'); background-size: cover; background-repeat: no-repeat; background-position: center center; min-height: 400px; color: white;">`;
    // For Download bgurl
    // emailBody += `<a href="${bgurl}" download="background_image.jpg" style="color: ${textColor};"></a>`;
    emailBody += `Dear ${name}, `;
    if (hours >= 5 && hours < 12) {
      var randomIndex = Math.floor(Math.random() * gmArray.length);
      var gm = gmArray[randomIndex];
      emailBody += gm;
    }
    if (isBirthday(recipientDOB)) {
      subject = `${getTimeOfDay()}, Happy Birthday 🎂`;
      var age = new Date().getFullYear() - new Date(recipientDOB).getFullYear();
      emailBody += `<p>&#127881; Wishing you a very Happy Return of the Day, ${name}! &#129303; Cheers to turning ${age}! &#127874;</p>`;
    }
    if (inputBody) {
      emailBody += `<p>&#128172; ${inputBody}</p>`;
    }
    if (isHoliday) {
      emailBody += `<p>&#127809; Today is a holiday for ${holidayType}: ${holidayName}</p>`;
    } else {
      emailBody += `<p>${daymessage || "&#127775; Have a good day!"}</p>`;
    }
    emailBody += '&#10084; Here\'s to another day of laughter, love, and making wonderful memories together as a family.<br><br>';
    emailBody += '&#127793; As the sun rises, may your heart be light, and your smile be bright.<br><br>';
    emailBody += '&#128513; Here\'s a joke to start your day with a smile:<br>';
    emailBody += `${englishJoke}<br><br>`;
    emailBody += '&#129488; Did you know? Here\'s an interesting fact:<br>';
    emailBody += `${getFunFact()}<br><br>`;
    emailBody += '&#128161; Expand your knowledge with this trivia:<br>';
    emailBody += `${fetchTrivia()}<br><br>`;
    emailBody += '&#128521; And here\'s another one just for fun:<br>';
    emailBody += `${joke}<br><br>`;
    emailBody += '&#128218; Time for some daily wisdom:<br>';
    emailBody += `${getQuote()}<br><br>`;
    emailBody += '&#127800; Take care of yourself and make today an incredible one!<br>';
    if (inputBody && inputBody.length >= 50) {
      var emailBody = `<p>Dear ${name}, </p>`;
      emailBody += inputBody; // Define emailBody if length is met
    }
    emailBody += '<br><br>Warmest wishes, &#128522;<br>';
    if (user === 'khanjordan440@gmail.com') {
      emailBody += 'Safiquddin Khan';
    } else {
      emailBody += (recipients[user] ? recipients[user].split(',')[0] : getName(user));
    }
    // if (!inputRecipient && !getBody) {
      try {
        var threads = GmailApp.search('-in:sent' + 'subject:' + subject + ' To:' + recipientEmail);
        if (threads.length > 0) {
          Logger.log('threads found:' + threads.length);
          // If a thread with the same subject is found, reply to the latest email in the thread
          // var latestThread = threads[0];
          // var replyEmail = latestThread.getMessages()[0];
          // // var replyEmail = latestThread.getMessages().pop();
          // replyEmail.reply("Re: " + subject, { htmlBody: emailBody });
          MailApp.sendEmail(recipientEmail, "Re: " + subject, '', { htmlBody: emailBody });
          ccAddresses.push(recipientEmail);
          successFlag = true;
          console.log(`Replied to an existing subject: ${subject}\nHere is the email body:\n${emailBody}`);
        } else {
          MailApp.sendEmail(recipientEmail, subject, '', { htmlBody: emailBody });
          ccAddresses.push(recipientEmail);
          successFlag = true;
          console.log(`Email sent successfully to: ${recipientEmail}\nHere is the email body:\n${emailBody}`);
        }
        batchCounter++;
        if (batchCounter === 20) {
          Logger.log('Sleep for 1 minute');
          Utilities.sleep(60000); // Sleep for 1 minute (60,000 milliseconds) for 20msg/minutes break as per gmail default
          batchCounter = 0; // Reset the batch counter
        }
      } catch (error) {
        callError = error;
        Utilities.sleep(1000);
        console.error(`Error Sending a mail to: ${recipientEmail}\nHere is the Error:${error}`);
      }
    // }
    debugger;
  }
  // if (inputRecipient) {
  //   try {
  //     var threads = GmailApp.search('-in:sent' + 'subject:' + subject + 'to:' + inputEmail);
  //     if (threads.length > 0) {
  //       // If a thread with the same subject is found, reply to the latest email in the thread
  //       var latestThread = threads[0];
  //       var replyEmail = latestThread.getMessages()[0];
  //       replyEmail.reply(subject, { htmlBody: emailBody });
  //       ccAddresses.push(inputEmail);
  //       successFlag = true;
  //       console.log(`Replied to an existing subject: ${subject}\nHere is the email body:\n${emailBody}`);
  //     } else {
  //       MailApp.sendEmail(inputEmail, subject, '', { htmlBody: emailBody });
  //       ccAddresses.push(inputEmail);
  //       successFlag = true;
  //       console.log("Email sent successfully to: " + inputEmail + '\nHere is the email body:\n' + emailBody);
  //     }
  //   } catch (error) {
  //     callError = error;
  //     console.error("Error Sending an email: " + error + '\nHere is the email body:\n' + emailBody);
  //   }
  // }
  // else if (getBody) {
  //   console.log("Here is your Greet body:\n\n" + emailBody);
  //   return emailBody;
  // }
  var ccAddresseslist = ccAddresses.join('\n');
  if (successFlag) {
    Logger.log(`Email sent successfully to:${ccAddresseslist}\n\nHere is the email body:\n${emailBody}`);
    return `Email sent successfully to:${ccAddresseslist}\n\nHere is the email body:\n${emailBody}`;
  } else {
    Logger.log("Error Sending an emails:" + callError);
    return `Error Sending an emails:${callError}`;
  }
}

// validate the email
function isValidEmail(email) {
  var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}

function getName(emailid) {
  if (!isValidEmail(emailid)) {
    return 'Invalid User'; 
    // Logger.log('invalidgetName')
  }
  var name = emailid.split("@")[0]; // Get the part before the @ symbol
  name = name.split('.').join(' '); // Replace dots with spaces
  name = name.replace(/[0-9]+/g, ''); // Remove any numbers
  name = name.replace(/[^a-zA-Z ]/g, ''); // Remove any special characters
  name = name.trim(); // Remove leading and trailing spaces
  name = name.charAt(0).toUpperCase() + name.slice(1); // Capitalize the first letter
  return name;
}

function getEnglishJoke(recipient) {
  try {
    var seed = recipient;
    // Make an HTTP GET request to the API
    var apiUrl = "https://official-joke-api.appspot.com/random_joke?seed=" + seed;
    var response = UrlFetchApp.fetch(apiUrl);
    var jokeData = JSON.parse(response.getContentText());
    return jokeData.setup + ": " + jokeData.punchline;
  } catch (error) {
    // Handle any errors that occur during the API request
    console.error("Error fetching a joke: " + error);
    return "what do you call a dog that can do magic tricks? - a labracadabrador";
  }
}

function convertEmojisToEntities(text) {
  // Define a mapping of emoji characters to their HTML entities
  var emojiEntities = {
    '🧐': '&#129488;', '😆': '&#128514;', '🤣': '&#129315;', '😋': '&#128523;', '😉': '&#128521;', 
    '😂': '&#128514;', '😃': '&#128515;', '😊': '&#128522;', '😏': '&#128527;', '😁': '&#128513;',
    '😎': '&#128526;', '😬': '&#128556;', '😝': '&#128541;', '😜': '&#128540;', '👗': '&#128089;',
    '👓' : '&#128083;', '💄': '&#128132;', '👠': '&#128096;', '🎀': '&#127873;',
    // Add more emoji-to-HTML-entity mappings as needed
  };
  // Use a regular expression to search for and replace emojis with HTML entities
  var emojiRegex = new RegExp(Object.keys(emojiEntities).join('|'), 'g');
  return text.replace(emojiRegex, function (match) {
    return emojiEntities[match];
  });
}

function getHindiJoke() {
  try {
    var apiUrl = "https://hindi-jokes-api.onrender.com/jokes/?api_key=e8500b9212bad378bd76bab62fac"; 
    // Make an HTTP GET request to the API
    var response = UrlFetchApp.fetch(apiUrl);
    var jokeData = JSON.parse(response.getContentText());
    var jokeContent = convertEmojisToEntities(jokeData.jokeContent);
    return jokeContent;
  } catch (error) {
    console.error("Error fetching a Hindi joke: " + error);
    return "हालचाल पूछने का जमाना गया साहिब,आदमी online दिख जाए तो समझ लेना सब ठीक है.भगवान हम सबको online रखें.";
  }
}

function fetchTrivia() {
  try {
    var categoryIds = [9, 17, 22, 30]; // Randomly select a category ID
    var selectedCategoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)]; 
    var apiUrl = "https://opentdb.com/api.php?amount=1&category=" + selectedCategoryId + "&type=multiple";
    var response = UrlFetchApp.fetch(apiUrl);
    var data = JSON.parse(response.getContentText());
    var question = data.results[0].question;
    var correctAnswer = data.results[0].correct_answer;
    var trivia = question + "(Answer: " + correctAnswer + ")";
    return trivia;
  }
  catch (error) {
    console.error("Error fetching trivia: " + error);
    return "Which is the largest freshwater lake in the world?\n(Answer: Lake Superior )";
  }
}  

function getCustomJoke(apiUrl) {
  try {
    // Make an HTTP GET request to the custom JokeAPI endpoint - https://jokeapi.dev/#langcodes-endpoint
    var response = UrlFetchApp.fetch(apiUrl);
    var jokeText = response.getContentText();
    return jokeText;
  } catch (error) {
    console.error("Error fetching a custom joke: " + error);
    return "Dark humor is like food, not everyone gets it.";
  }
}

function getFunFact() {
  try {
    var apiUrl = "https://uselessfacts.jsph.pl/api/v2/facts/random?language=en";
    var response = UrlFetchApp.fetch(apiUrl);
    var factData = JSON.parse(response.getContentText());
    return factData.text;
  } catch (error) {
    console.error("Error fetching a factData: " + error);
    return "Over 60% of all those who marry get divorced.";
  }
}

function getQuote() {
  try {
    var apiUrl = "https://api.quotable.io/random";
    var response = UrlFetchApp.fetch(apiUrl);
    var quoteData = JSON.parse(response.getContentText());
    return quoteData.content;
  } catch (error) {
    console.error("Error fetching a factData: " + error);
    return "The universe is made of stories, not atoms.";
  }
}

var dayMessages = {
  'Sunday': ['&#127807; Wishing you a relaxing and peaceful Sunday.','&#127880; Sunny Sunday'],
  'Monday': ['&#128640; Start your week with enthusiasm and determination. Happy Monday!','&#128640; Happy Monday'],
  'Tuesday': ['&#128077; Keep up the great work! It\'s Tuesday!','&#128077; Terrific Tuesday'],
  'Wednesday': ['&#128170; Halfway through the week! Keep pushing forward.','&#128170; Wonderful Wednesday'],
  'Thursday': ['&#128039; You\'re almost there! Thursday is your day to shine.','&#128039; Thrilling Thursday'],
  'Friday': ['&#127939; Happy Friday! Time to relax and enjoy the weekend soon.','&#127939; Fantastic Friday'],
  'Saturday': ['&#127881; Have a fantastic Saturday filled with joy and adventure!','&#128692; Super Saturday'],
};

  // Function to get the current day of the week
function getDayOfWeek() {
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var today = new Date();
  return days[today.getDay()];
}

function getTimeOfDay() {
  if (hours >= 5 && hours < 12) {
    return "🌄 Good Morning ☕";
  } else if (hours >= 12 && hours < 17) {
    return "🌞 Good Afternoon 👨‍💻";
  } else if (hours >= 17 && hours < 21) {
    return "🌇 Good Evening 🏏";
  } else {
    return "🌃 Good Night ⏰";
  }
}


function isBirthday(dob) {
  if (!dob) {
    return false; // Return false if there is no DOB provided
  }
  var dobDate = new Date(dob);
  var today = new Date();
  return (
    dobDate.getDate() === today.getDate() &&
    dobDate.getMonth() === today.getMonth() &&
    dobDate.getFullYear() !== today.getFullYear()
  );
}

// https://holidayapi.com/fee77042-0325-4296-b257-d2e728641779
function getHolidayInfo() {
  try {
    var apiKey = 'smff3hYqk4Plombur6GrHzpYxQr452sq'; // Replace with your Calendarific API key
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    var formattedDate = year + "-" + String(month).padStart(2, '0') + "-" + String(day).padStart(2, '0');
    var apiUrl = 'https://calendarific.com/api/v2/holidays?api_key=' + apiKey + '&country=IN&year=' + year + '&month=' + month;
    var response = UrlFetchApp.fetch(apiUrl);
    var holidaysData = JSON.parse(response.getContentText());
    var indianHolidays = holidaysData.response.holidays;
    // if (holidaysData.meta.code === 200) { }
    // var allowedTypes = ["Gazetted Holiday", "Season", "Hinduism", "Holiday", "Restricted Holiday", "Observance", "Common local holiday", "Central Government Holiday", "Christian"];
    //  && allowedTypes.includes(holiday.primary_type)
    for (var i = 0; i < indianHolidays.length; i++) {
      var holiday = indianHolidays[i];
      //   Logger.log(holiday.type[i]);
      if (holiday.date.iso === formattedDate) {
        if (holiday.description.includes("restricted")) {
          return { isHoliday: true, holidayName: holiday.name, holidayType: holiday.type[0] };
        } else {
          return { isHoliday: true, holidayName: holiday.description, holidayType: holiday.type[0] };
        }
      }
    }
    Logger.log('no matching holiday found');
    return { isHoliday: false, holidayName: "" };
  } catch (error) {
    console.error('Error fetching Indian holidays: ' + error);
    return "Can't fetch isHoliday";
  }
}


// Function to get a random image URL from the Google Drive folder
function bgUrl() {
  try {
    var blackFolder = '15nzkWXEKWKP7oSxQKTT0VxfbijGDixW0';
    var whiteFolder = '1UFxtCae8fBOI6X0Lx01AAc9lAnTdUHeL';
    var folderId = Math.random() < 0.5 ? blackFolder : whiteFolder;
    var folder = DriveApp.getFolderById(folderId);
    var files = folder.getFilesByType(MimeType.JPEG); // You can adjust the file type as needed

    var imageUrls = [];
    while (files.hasNext()) {
      var file = files.next();
      var imageUrl = file.getDownloadUrl(); // Get the image's download URL
      imageUrls.push(imageUrl);
    }
    
    if (imageUrls.length > 0) {
      var randomIndex = Math.floor(Math.random() * imageUrls.length);
      var bgurl = imageUrls[randomIndex];
      var textColor = folderId === blackFolder ? 'white' : 'black';
      return { bgurl: bgurl, textColor: textColor };
    }
  } catch (e) {
    // Handle any exceptions that may occur
    console.error("An error occurred: " + e);
    return { bgurl: 'https://drive.google.com/uc?id=1VtLbzesdELI47mF14h9AsfOqF7yU8bSX', textColor: 'white' };
    // return { bgurl: '', textColor: '' };
  }
}

// Get the remaining daily email quota
function getQuotaRemaining() {
  var emailQuotaRemaining = MailApp.getRemainingDailyQuota();
  Logger.log("Remaining email quota: " + emailQuotaRemaining);
  return 'Remaining email quota:' + emailQuotaRemaining;
}
// var emailParts = inputRecipient.split(","); // Split the inputRecipient using a comma
// var recipientEmail = emailParts[0]; // The first part is the email address
// var recipientName = emailParts[1]; // The second part is the recipient's name
// var recipientDob = emailParts[2]; // The third part is the date of birth
