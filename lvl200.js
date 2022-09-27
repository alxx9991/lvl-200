//Converts a number into base 36 encoding
function encode36(num, maxDigits) {
  const representations_str = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const representations = representations_str.split("");

  let out = "";
  while (num > 0) {
    const remainder = num % 36;
    out = representations[remainder] + out;
    num = Math.floor(num / 36);
  }
  //Append fillers
  for (let i = maxDigits - out.length; i > 0; i--) {
    out = "0" + out;
  }

  return out;
}

//Converts a base36 encoded number back to a normal number
function decode36(encoding) {
  const map = {};

  const representations_str = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const representations = representations_str.split("");

  representations.forEach((ch, idx) => {
    map[ch] = idx;
  });

  let out = 0;

  console.log(encoding);

  for (let i = 0; i < encoding.length; i++) {
    const value =
      Number(map[encoding[encoding.length - i - 1]]) * Math.pow(36, i);
    out += value;
  }

  return out;
}

// TODO: Modify this function
function generateShortCode(storeId, transactionId) {
  const newStoreId = encode36(storeId, 2);
  const newTransactionId = encode36(transactionId, 3);

  const date = new Date();
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear() - 2000;

  const newDay = encode36(day, 1);
  const newMonth = encode36(month, 1);

  //If you want the year to go past 2036, you can delete the hyphen in the middle and allocate two characters to encode the year
  const newYear = encode36(year, 1);

  //Mix up the order to trick even the smartest customers who know base 36 encoding
  return `${newStoreId}${newDay}${newMonth}-${newYear}${newTransactionId}`;
}

// TODO: Modify this function
function decodeShortCode(shortCode) {
  // Logic goes here
  //Format is StoreId(2)Day(1)Month(1)-Year(1)Transaction(3)

  const day = decode36(shortCode.slice(2, 3));
  const storeId = decode36(shortCode.slice(0, 2));
  const month = decode36(shortCode.slice(3, 4)) - 1;
  const transactionId = decode36(shortCode.slice(6, 9));
  const year = decode36(shortCode.slice(5, 6)) + 2000;

  const shopDate = new Date(year, month, day);

  return {
    storeId, // store id goes here,
    shopDate, // the date the customer shopped,
    transactionId, // transaction id goes here
  };
}

// ------------------------------------------------------------------------------//
// --------------- Don't touch this area, all tests have to pass --------------- //
// ------------------------------------------------------------------------------//
function RunTests() {
  var storeIds = [175, 42, 0, 9];
  var transactionIds = [9675, 23, 123, 7];

  storeIds.forEach(function (storeId) {
    transactionIds.forEach(function (transactionId) {
      var shortCode = generateShortCode(storeId, transactionId);
      var decodeResult = decodeShortCode(shortCode);
      $("#test-results").append(
        "<div>" + storeId + " - " + transactionId + ": " + shortCode + "</div>"
      );
      AddTestResult("Length <= 9", shortCode.length <= 9);
      AddTestResult("Is String", typeof shortCode === "string");
      AddTestResult("Is Today", IsToday(decodeResult.shopDate));
      AddTestResult("StoreId", storeId === decodeResult.storeId);
      AddTestResult("TransId", transactionId === decodeResult.transactionId);
    });
  });
}

function IsToday(inputDate) {
  // Get today's date
  var todaysDate = new Date();
  // call setHours to take the time out of the comparison
  return inputDate.setHours(0, 0, 0, 0) == todaysDate.setHours(0, 0, 0, 0);
}

function AddTestResult(testName, testResult) {
  var div = $("#test-results").append(
    "<div class='" +
      (testResult ? "pass" : "fail") +
      "'><span class='tname'>- " +
      testName +
      "</span><span class='tresult'>" +
      testResult +
      "</span></div>"
  );
}
