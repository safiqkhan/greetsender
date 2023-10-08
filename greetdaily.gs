// Send daily emails with positive messages, jokes, fun facts, and quotes to a list of recipients.
function doGet(e) {
  var email = Session.getActiveUser().getEmail();
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Daily Email Sender')
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}
function getuser() {
  var email = Session.getActiveUser().getEmail();
  return email;
}
function sendEmail(inputRecipient, getBody) {
  // Define the list of recipient email addresses and names as an object
  var recipients = {
    'khanjordan440@gmail.com': '',
    'khangayasuddin99@gmail.com': 'Gayasuddin Khan',
    'rajutarannum143@gmail.com': 'MD Shamshad',
    'banumuskaan998@gmail.com': 'Muskaan Banu',
    'khatunsahara77@gmail.com': 'Sahara Khatun',
    'mdkutubuddin33@gmail.com': 'MD Kutubuddin',
    'tabassumsheikh2708@gmail.com': 'Tabassum Nisha',
    'realshad07@gmail.com': 'Shad Perwez',
    'safiquddinkhan@gmail.com': 'Safiquddin Khan',
  };
  // Define the list of recipients for whom you want to send Hindi jokes
  var hindirecipients = [
    'khanjordan440@gmail.com',
    'banumuskaan998@gmail.com',
    'realshad07@gmail.com',
    'mdkutubuddin33@gmail.com',
    'safiquddinkhan@gmail.com',
  ];

  // Subject of the email
  var subject = getTimeOfDay() + ", It's " + getDayOfWeek();

  // Loop through the recipients object and send an email to each recipient
  for (var recipientEmail in recipients) {
    var recipientName = recipients[recipientEmail];
    var dayOfWeek = getDayOfWeek();
    var englishJoke = getEnglishJoke(recipientEmail);
    // Determine whether to send a custom joke or a Hindi joke based on the recipient's email address
    var joke;
    var probability = Math.random() < 0.5; // 50% chance of including an English joke
    // check recipientEmail or inputRecipient in the hindirecipients
    if (hindirecipients.includes(recipientEmail) || (inputRecipient && hindirecipients.includes(inputRecipient))) {
      var apiUrl = "https://v2.jokeapi.dev/joke/Any?format=txt";
      joke = probability ? getCustomJoke(apiUrl) : getHindiJoke(); // Randomly select a joke
    } else { 
      // Send a custom joke for others
      var apiUrl = "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,sexist&format=txt";
      joke = getCustomJoke(apiUrl);
    }
    daymessage = probability ? dayMessages[dayOfWeek] : dayFun[dayOfWeek] ;
    if (inputRecipient) {
      var name = getName(inputRecipient) || 'Friend' ;
    }
    else if(getBody){
      var name = getName(getuser()) || getuser();
    }
    else {
      var name = recipientName || getName(recipientEmail);
    }
    var holidayInfo = getHolidayInfo();
    var isHoliday = holidayInfo.isHoliday;
    var holidayName = holidayInfo.holidayName;
    var emailBody = "Dear " + name + ",\n\n" +
      (isHoliday ? ("Today is a holiday in India:" + holidayName + "\n") : (daymessage || "Have a good day!")) + "\n\n" +
      "Here's to another day of laughter, love, and making wonderful memories together as a family ❤️.\n\n" +
      "As the sun rises, may your heart be light, and your smile be bright. 🌟\n\n" +
      "Here's a joke to start your day with a chuckle:\n" + englishJoke + "\n\n" +
      "And here's another one just for fun:\n" + joke + "\n\n" +
      "Did you know? 🤓\n" + getFunFact() + "\n\n" +
      "Your daily dose of inspiration: 📖 \n" + getQuote() + "\n\n" +
      "Always remember, you're amazing and appreciated every single day. 🎉\n" +
      "Take care of yourself and make today an incredible one! 🌞\n\n" +
      "Warmest wishes,😊\n";
      
    // MailApp.sendEmail(to, replyTo, subject, body)
    emailBody += getName(getuser()) +'\n'+ getuser() ;
    if (inputRecipient) {
      // Check if a valid email is provided
      if (!isValidEmail(inputRecipient)) {
        Logger.log("Invalid email address "+ inputRecipient);
        return 'Invalid email address';
      }
      else {
        try {
          MailApp.sendEmail(inputRecipient, subject, emailBody);
          Logger.log("Email sent successfully \n\n"+ emailBody);
          return 'Greet email sent successfully to: '+ inputRecipient + '\nHere is the email body:\n' + emailBody;
        } catch (error) {
          console.error("Error Sending a mail: " + error + '\nHere is the email body:\n' + emailBody);
          return 'Email sending to ' + inputRecipient + ' failed due to insufficient remaining email quota\nHere is the email body:\n' + emailBody;
        }
      }
    }
    else if (getBody) {
      Logger.log("Here is your Greet body\n\n"+ emailBody);
      return emailBody;
    }
    else {
      try {
        MailApp.sendEmail(recipientEmail, subject, emailBody);
        Logger.log("Email sent successfully \n\n"+ emailBody);
        return 'Greet emails sent successfully\n' + 'Here is the email body:\n' + emailBody;
      } catch(error) {
        console.error("Error Sending a mail: " + error + '\nHere is the email body:\n' + emailBody);
        return 'Email sending failed due to insufficient remaining email quota'+ '\nHere is the email body:\n' + emailBody;
      }
    }
    debugger;
  }
}

// validate the email
function isValidEmail(email) {
  var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
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

function getHindiJoke() {
  try {
    var apiUrl = "https://hindi-jokes-api.onrender.com/jokes/?api_key=e8500b9212bad378bd76bab62fac"; 
    // Make an HTTP GET request to the API
    var response = UrlFetchApp.fetch(apiUrl);
    var jokeData = JSON.parse(response.getContentText());
    return jokeData.jokeContent;
  } catch (error) {
    console.error("Error fetching a Hindi joke: " + error);
    return "अगर आप अपने घर में कचरा नहीं रख सकते; तो दिमाग में कचरा क्यों रखते हो ??";
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
    return "Algorithm: A word used by programmers when they don't want to explain how their code works.";
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

function getName(email) {
  var name = email.split("@")[0]; // Get the part before the @ symbol
  name = name.replace(/[0-9]+/g, ''); // Remove any numbers
  name = name.replace(/[^a-zA-Z ]/g, ''); // Remove any special characters
  name = name.trim(); // Remove leading and trailing spaces
  name = name.charAt(0).toUpperCase() + name.slice(1); // Capitalize the first letter
  return name;
}

var dayMessages = {
  'Sunday': 'Wishing you a relaxing and peaceful Sunday.',
  'Monday': 'Start your week with enthusiasm and determination. Happy Monday!',
  'Tuesday': 'Keep up the great work! It\'s Tuesday! ',
  'Wednesday': 'Halfway through the week! Keep pushing forward.',
  'Thursday': 'You\'re almost there! Thursday is your day to shine.',
  'Friday': 'Happy Friday! Time to relax and enjoy the weekend soon.',
  'Saturday': 'Have a fantastic Saturday filled with joy and adventure!',
};

var dayFun = {
  'Sunday': 'Happy Monday!',
  'Monday': 'Terrific Tuesday!',
  'Tuesday': 'Wonderful Wednesday!',
  'Wednesday': 'Thrilling Thursday!',
  'Thursday': 'Fantastic Friday!',
  'Friday': 'Super Saturday!',
  'Saturday': 'Sunny Sunday!',
};

  // Function to get the current day of the week
function getDayOfWeek() {
  var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var today = new Date();
  return days[today.getDay()];
}

function getTimeOfDay() {
  var currentTime = new Date();
  var hours = currentTime.getHours();
  if (hours >= 5 && hours < 12) {
    return "Good Morning 🌞";
  } else if (hours >= 12 && hours < 17) {
    return "Good Afternoon 🌅";
  } else {
    return "Good Evening 🌙";
  }
}
// https://holidayapi.com/fee77042-0325-4296-b257-d2e728641779
function getHolidayInfo() {
  try {
    var apiKey = '7uw04uwMQUEGctUmIDhBYhJCeuQo3vP7'; // Replace with your Calendarific API key
    var year = new Date().getFullYear();
    var apiUrl = 'https://calendarific.com/api/v2/holidays?api_key='+ apiKey + '&country=IN&year=' + year;
    var response = UrlFetchApp.fetch(apiUrl);
    var holidaysData = JSON.parse(response.getContentText());
    var indianHolidays = holidaysData.response.holidays;
    var today = new Date();
    var formattedDate = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, '0') + "-" + String(today.getDate()).padStart(2, '0');
    
    for (var i = 0; i < indianHolidays.length; i++) {
      var holiday = indianHolidays[i];
      if (holiday.date === formattedDate && holiday.type === "public") {
        return { isHoliday: true, holidayName: holiday.name };
      }
    }
    return { isHoliday: false, holidayName: "" };
  } catch (error) {
    console.error('Error fetching Indian holidays: ' + error);
    return { isHoliday: false, holidayName: "" };
  }
}

// Get the remaining daily email quota
function getQuotaRemaining() {
  var emailQuotaRemaining = MailApp.getRemainingDailyQuota();
  Logger.log("Remaining email quota: " + emailQuotaRemaining);
  return 'Remaining email quota:' + emailQuotaRemaining;
}
