import { useState, useEffect, useRef } from 'react';
import { run } from './SIR'
import "./Feature3.scss"

export default function Feature3({ data, theme }) {
    const [covidData, setData] = useState()
    const [object, setObject] = useState(null)
    const [feature3Theme, setTheme] = useState("Feature3-light")

    const countryRef = useRef()
    const vacRateRef = useRef()
    const dayNumRef = useRef()

    useEffect(() => {
        var obj = data
        if (data !== undefined) {
            var result = Object.keys(obj).map((key) => [key, obj[key]]);
        }
        setData(result)
    }, [data])

    useEffect(() => {
        if (theme === "App-light"){
            setTheme("Feature3-light")
        }
        else{
            setTheme("Feature3-dark")
        }
    }, [theme])

    /**
     * Looks through all data in covid data and retrieves only the population, deaths and cases 
     * data for the specific country
     * 
     * @param {string} country string containing country of the data 
     * @returns array of population, deaths and daily cases data in its 0th ... 2nd index respectively
     */
    function UseData(country) {

        data = []
        for (let i = 0; i < covidData.length; i++) {
            if (covidData[i][1].location === country) {
                data.push(covidData[i][1].population)

                // add deaths to data
                data.push(covidData[i][1].data[covidData[i][1].data.length - 1].total_deaths)

                // add cases to data
                let cases = []
                for (let j = 0; j < (covidData[i][1].data.length); j++) {
                    cases.push(covidData[i][1].data[j].new_cases)
                }
                data.push(cases)
            }
        }
        return data
    }

    /**
     * Performs the calculations for the new cases and deaths for a specified day number for 
     * a given country with given vaccination rate. Uses the SIR model to perform the calculations. 
     * 
     * @param {string} country string of target country 
     * @param {number} vacRate vaccination rate for SIR model 
     * @param {number} day day number for SIR model
     * @returns object with the result newCases and death as keys, both numbers
     */
    function SIRcal(country, vacRate, day) {
        var dataSIR = UseData(country)
        var population = dataSIR[0]
        var deaths = dataSIR[1]
        var cases = dataSIR[2]
        let object = run(cases, population, deaths, vacRate / 100, day)
        return object
    }

    /**
     * Generates html string for dropdown box options of countries from available data
     * 
     * @returns string containing the HTML element for the drop box of countries
     */
    function htmlCountryList() {
        if (typeof covidData !== "undefined") {
            let htmlCountryString = `<datalist id="countryList">`
            for (let i = 0; i < covidData.length; i++) {
                htmlCountryString += `<option value="${covidData[i][1].location}"></option>`
            }
            htmlCountryString += `</datalist>`
            return htmlCountryString
        }
    }

   /**
    * Performs error checks for user input then calls the SIR calculation function and displays the output
    */
    function runEngine() {

        // check if data loaded in yet
        if (covidData === undefined) {
            // data is not yet loaded
            alert("No data yet, please try again shortly")
            return
        }

        let vacRate = vacRateRef.current.value
        let day = dayNumRef.current.value
        let countrySelection = countryRef.current.value

        // Performing error checks for user input
        if (vacRate !== undefined && vacRate !== null && vacRate >= 0 && vacRate <= 100 && vacRate.length !== 0) {
            if (day !== undefined && day !== null && day.length !== 0) {
                let foundCountry = false
                for (let i = 0; i < covidData.length; i++) {
                    if (covidData[i][1].location === countrySelection) {
                        let population = covidData[i][1].population
                        // alert(`Engine successfully ran!
                        // Output: ${SIRcal(countrySelection, vacRate)}`)
                        // engineOutput = `For the given vaccination rate of ${vacRate}% in the country ${countrySelection} there are '{SIRcal(countrySelection, vacRate)}' blah blah`
                        foundCountry = true
                        break
                    }

                }
                if (!foundCountry) {
                    alert("Your selected country is invalid or empty")
                    return
                }
            }
            else {
                alert("Your other input was invalid or empty")
                return
            }
        }
        else {
            alert("Your input was invalid or empty, please ensure the vaccination rate is given as a valid percentage. (eg. input '50' for 50%)")
            return
        }
        let ob = SIRcal(countrySelection, vacRate, day)
        setObject(ob)
    }

    /**
     * Creates the HTML elements for the the cases and death each day
     * 
     * @returns HTML element for the graph
     */
    function Show() {
        if (object !== null) {
            return <div>
                <h2>New cases each day: {object.newCases}</h2>
                <h2>New death each day: {object.deaths}</h2>
            </div>
        }
        else {
            return null
        }
    }

    return (
        <div className={feature3Theme}>
            <h1 className="feature-heading"> Covid Engine</h1>
            <br></br>

            <div id="innerDiv3">
                <div id="innerLabelsDiv3">
                    <label className="input-label-3">Vaccination Rate (%):</label>
                    <br></br>
                    <label className="input-label-3">Day Number:</label>
                    <br></br>
                    <label className="input-label-3">Country selection:</label>
                </div>
                <div id="innerInputsDiv3">
                    <input ref={vacRateRef} type="number" id="inputVRate" name="inputVRate" className="input-field-3" min="0" max="100"></input>
                    <br></br>
                    <input ref={dayNumRef} type="number" id="inputNo2" name="inputNo2" className="input-field-3" min="1"></input>
                    <br></br>
                    <input ref={countryRef} list="countryList" id="countrySelection" name="countrySelection" className="input-field-3" />
                    <div dangerouslySetInnerHTML={{ __html: htmlCountryList() }} />
                </div>

                <div id="buttonDiv3">
                    <button className="submit-button" onClick={() => {
                        runEngine()
                    }}>Submit and Run</button>
                </div>
            </div>

            <Show></Show>

        </div>
    )
}
