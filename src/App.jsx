import { useState, useEffect } from "react";
import "./App.css";

let shirtsize = "S";
let sheetData;

function App() {
  const [showTshirt, setShowTshirt] = useState(false);
  const [error, setError] = useState("no-error");
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
          <p className="headline">
            Please show your screen to registration to receive your swag
          </p>
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
      <div className="header">
        <p className="headline">HackWashU Check In 2023</p>
      </div>
      <div className="header-error">
        <p className={error}>
          Invalid email, please use the email you used to apply to our hackathon
        </p>
      </div>
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
              submitButton(emailValue, setError).then((result) => {
                shirtsize = result;
                if (shirtsize !== "") {
                  setShowTshirt(true);
                }
              });
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

async function submitButton(emailValue, setError) {
  let shirt = "";
  setError("no-error");
  let person = sheetData.find((person) => {
    if (person.Email.toLowerCase() == emailValue.toLowerCase()) {
      shirt = person["T-shirt"];
      addPersonToCheckInSheet(person);
    }
    return person.Email.toLowerCase() == emailValue.toLowerCase();
  });
  if (!person) {
    setError("error");
  }
  console.log(person);
  try {
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
      .then((data) => console.log(data));
  } catch (error) {
    console.log(error);
  }
  return shirt;
}

function addPersonToCheckInSheet(person) {
  fetch("https://sheetdb.io/api/v1/cl5b51z2km0kn", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: person,
    }),
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
}

export default App;
