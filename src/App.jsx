import { useState, useEffect } from "react";
import "./App.css";

let shirtsize = "S";
let sheetData;

function App() {
  const [showTshirt, setShowTshirt] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");

  useEffect(() => {
    getSheetData().then((result) => {
      sheetData = result;
    });
  }, []);

  if (showTshirt) {
    console.log("here");
    return (
      <div className="app">
        <div className="header">
          Please show your screen to registration to receive your swag
        </div>
        <div className="t-shirt-box-parent">
          <div className="t-shirt-box">
            <div className={shirtsize}>{shirtsize}</div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="app">
      <div className="header">HackWashU Check In 2023</div>
      <div className="check-in-box-parent">
        <div className="check-in-box">
          <input
            value={nameValue}
            onInput={(e) => setNameValue(e.target.value)}
            type="text"
            placeholder="First Name"
          ></input>
          <br />
          <input
            value={emailValue}
            onInput={(e) => setEmailValue(e.target.value)}
            type="text"
            placeholder="Email"
          ></input>
          <br></br>
          <div
            className="button"
            onClick={() => {
              submitButton(setShowTshirt, nameValue, emailValue).then(
                (result) => {
                  shirtsize = result;
                  setShowTshirt(true);
                }
              );
            }}
          >
            Submit
          </div>
        </div>
      </div>
    </div>
  );
}

async function getSheetData() {
  let retvalue;
  await fetch("https://sheetdb.io/api/v1/6dsy2cvuzwdcr")
    .then((response) => response.json())
    .then((data) => {
      retvalue = data;
    });
  return retvalue;
}

async function submitButton(setShowTshirt, nameValue, emailValue) {
  let person = sheetData.find((person) => {
    return person.Email.toLowerCase() == emailValue.toLowerCase();
  });
  console.log(person);
  await fetch("https://sheetdb.io/api/v1/6dsy2cvuzwdcr/Email/" + emailValue, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        CheckedIn: "Yes",
      },
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
  return person["T-shirt"];
}

export default App;
