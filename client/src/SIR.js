// For more detailed explanation of this function, refer to the SIR model document
const k = 15;        // average duration of a COVID case
const a = 1/k;       // rates at which people either recover or die from COVID each date
const b = 1;         // number of contacts each infected individual makes per day
const delta = 0.01;  // COVID's death rates
const x = 0.98;       // percentage reduction of susceptibility to COVID for vaccinated individual
const y = 0.98;       // percentage reduction of death from COVID for vaccinated individual
const N = 100000     // population size. Write code to retrieve it here

// Returns the number of active infections in both vaccinated and unvaccinated individuals. This is the sum all new cases in the last 15 days.
// If the input list's length is shorter than 15, this is just the sum of the whole list. 
function findI0(dailyCaseNumbers) {
    let i0 = 0;
    if (dailyCaseNumbers.length > k) {
        for (let i = dailyCaseNumbers.length-1; i > dailyCaseNumbers.length-1-k; i--) {
            i0 += dailyCaseNumbers[i];
        }
    } else {
        i0 = dailyCaseNumbers.reduce((sum, currentNum) => sum + currentNum);
    }
    return i0;
}

// Returns the starting value of the susceptible group, which includes both vaccinated susceptibles and unvaccinated susceptibles
// This is the current population size - number of current infections
function findS0(populationSize, i0) {
    return populationSize - i0;
}

// Returns the number of recoveries since the beginning of the outbreak. 
// This is calculated by adding all the case number from the beginning of the outbreak to 15 days before today, then minus number of deaths so far
function findR0(dailyCaseNumbers, deaths) {
    let r0 = 0;
    if (dailyCaseNumbers.length > k) {
        for (let i = 0; i < dailyCaseNumbers.length-k; i++) {
            r0 += dailyCaseNumbers[i];
        }
        r0 -= deaths;
    } else {
        r0 = 0;
    }
    return r0;
}

// Returns the number of deaths from the beginning of the outbreak.
function findD0(deathNumbers) {
    let d0 = deathNumbers.reduce((sum, currentNum) => sum + currentNum);
    return d0;
}


// This function receives the inputs of S(0), I(0), R(0), D(0), number of days into the future the user wants to see, vaccination rate and the country's population size
// Returns the predicted number of cases and deaths on that day in the future
function covidSir(s0, i0, r0, d0, day, v, N) {
    let returnObject = {}

    // Declare and nitialise the arrays with their day 0 numbers
    let Suv = [s0*(1-v)]
    let Sv = [s0*v]
    let Iuv = [i0]
    let Iv = [0]
    let D = [d0]
    let R = [r0]

    for (let t = 0; t < day; t++) {
        // Number of new cases
        let newCasesUnvaccinated =  b*(Iuv[t]+Iv[t])*Suv[t]/N;
        newCasesUnvaccinated = newCasesUnvaccinated > Suv[t] ? 0 : newCasesUnvaccinated;
        let newCasesVaccinated =  b*(Iuv[t]+Iv[t])*Sv[t]/N*(1-x);
        newCasesVaccinated = newCasesVaccinated > Sv[t] ? 0 : newCasesVaccinated;

        // Updating susceptible numbers:
        Suv[t+1] = Suv[t] - newCasesUnvaccinated;
        Sv[t+1] = Sv[t] - newCasesVaccinated;

        // Updating infection numbers: 
        Iuv[t+1] = (Iuv[t] + newCasesUnvaccinated - a*Iuv[t]);
        Iv[t+1] = (Iv[t] + newCasesVaccinated - a*Iv[t]);

        // Updating recovery number: 
        R[t+1] = R[t] + a*Iuv[t]*(1-delta) + a*Iv[t]*(1-delta+delta*y);

        // Updating death numbers
        D[t+1] = D[t] + a*Iuv[t]*delta+ a*Iv[t]*delta*(1-y);

        // console.log(`Date: ${t}`)
        // console.log(`New case today: ${Math.round(newCasesUnvaccinated + newCasesVaccinated)}`);
        // console.log(`New deaths: ${Math.round(D[t+1] - D[t])}`)
        // console.log(`Susceptibles: ${Math.round(Suv[t+1] + Sv[t+1])}`)
        // console.log(`Recoveries: ${Math.round(R[t+1])}`)
        // console.log(`Current infections: ${Math.round(Iuv[t+1] + Iv[t+1])}\n`)

        // Update return object on the last day
        if (t == day-1) {
            returnObject["newCases"] = Math.round(newCasesUnvaccinated + newCasesVaccinated);
            returnObject["deaths"] = Math.round(D[t+1] - D[t]);
        }
    }
    return returnObject
}

export function run(cases,populationSize,deaths,vac_rate,day){
    let i0 = findI0(cases);
    let s0 = findS0(populationSize, i0);
    let r0 = findR0(cases, deaths);
    let object = covidSir(s0, i0, r0, deaths, day, vac_rate, populationSize)

    return object
}
