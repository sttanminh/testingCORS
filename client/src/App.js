import './App.scss';
import { useState, useEffect, useRef } from 'react';
import Feature3 from './Feature3'
import Feature2 from './Feature2';
import Feature1 from './Feature1'
function App() {
  const [data, setData] = useState()
  const [VictoriaData, setVicData] = useState()
  const [theme, setTheme] = useState("App-light")
  const [modeButton, setButton] = useState({ text: "Light Mode", textColour: "black", bkgColor: "#ffdc3e" })
  const themeButtonRef = useRef()

  useEffect(() => {
    fetch('https://covid.ourworldindata.org/data/owid-covid-data.json')
      .then(response => response.json())
      .then(data => {
        setData(data)
        console.log(data)
      });
  }, [])

  useEffect(() => {
    console.log("before fetch")
    fetch('https://testing-cors-monash.herokuapp.com//victoria-cases')
      .then(response => response.json())
      .then(data => {
        setVicData(data)
        console.log(data)
      })
      .catch(function (err) {
        // There was an error
        console.warn('Something went wrong.', err);
      });
  }, [])

  /**
   * Changes the theme of the app when the button is clicked
   */
  function nightButton() {
    if (theme === "App-light") {
      // direct DOM access to change bkg colour
      document.body.style = "background: #161716"
      setTheme("App-dark");
      setButton({ text: "Dark Mode", textColour: "white", bkgColor: "#38218f" });
    } else {
      setTheme("App-light");
      document.body.style = "background: white"
      setButton({ text: "Light Mode", textColour: "black", bkgColor: "#ffdc3e" });
    }
  }

  return (
    <div className={theme}>

      <Feature3 data={data} theme={theme}></Feature3>

      <Feature2 data={data} theme={theme}></Feature2>

      <Feature1 data={VictoriaData} theme={theme}></Feature1>
      <button ref={themeButtonRef} style={{ color: modeButton.textColour, backgroundColor: modeButton.bkgColor }}
        id="themeButton" onClick={() => { nightButton() }}>{modeButton.text}</button>

    </div>
  );
}

export default App;
