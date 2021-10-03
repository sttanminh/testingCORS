import { useState, useEffect, useRef } from 'react';
import './Feature1.scss'
import { Line } from 'react-chartjs-2'

export default function Feature1({ data, theme }) {
    const [vicData, setVicData] = useState()
    const [feature1Theme, setTheme] = useState("Feature2-light")

    useEffect(() => {
        if (theme === "App-light") {
            setTheme("Feature2-light")
        }
        else {
            setTheme("Feature2-dark")
        }
    }, [theme])

    useEffect(() => {
        setVicData(data)
    }, [data])

    
    /**
     * Creates the HTML elements for the graph and shows it on the page
     * 
     * @returns HTML element for the graph
     */
    function showGraph() {

        if (vicData !== undefined) {
            let dataToDisplay = createGraphData()
            return <Line
                data={dataToDisplay}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: `Victoria daily new cases`,
                            fontSize: 20
                        },
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    },
                    elements: {
                        point: {
                            radius: 0.5
                        }
                    },
                    scales: {
                        case_death: {
                            display: true,
                            position: 'left',
                            type: 'linear',
                            min: 0,
                            title: {
                                display: true,
                                text: 'New Cases/Day'
                            }
                        },
                        date_period: {
                            display: true,
                            position: 'bottom',
                            title: {
                                display: true,
                                text: 'Date Period (dd/mm/yyyy)'
                            }
                        }
                        
                    }
                }}

                // radio of height and width
                height={36}
                width={50}
            ></Line>
        } else {
            return null
        }
    }

    /**
     * Creates and return an object that has the formatted date labels, and cases data array ready to be 
     * 
     * @param {Object} dataObject 
     * @returns Object containing data in the format ready to be graphed using chartjs
     */
    function createGraphData() {

        // let sortedData = UseData(startDay, endDay, smooth)

        // get date labels and number of cases from
        let dateLabels = []
        let casesArray = []
        vicData.forEach(element => { // Later replace vicData with sortedData
            let dateString = element.date
            dateLabels.push(new Date(dateString).toLocaleDateString())
            casesArray.push(element.cases)
        })

        let dataForGraph = {
            labels: dateLabels,
            datasets: [{
                label: 'New cases',
                data: casesArray,
                borderWidth: 1,
                fill: false,
                borderColor: 'rgb(250, 0, 0)',
                tension: 1,
                yAxisID: 'case_death',
                xAxisID: 'date_period'
            }]
        }
        return dataForGraph
    }

    return (
        <div className={feature1Theme}>
            <h1 className="feature-heading">COVID-19 in Victoria</h1>
            <br></br>
            <div id="graph1">
                {showGraph()}
            </div>
        </div>
    )
}