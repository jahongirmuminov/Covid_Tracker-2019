import React,{useState,useEffect} from 'react'
import { MenuItem,FormControl,Select, Card, CardContent} from '@material-ui/core'
import InfoBox from './components/InfoBox'
import Map from './components/Map'
import './App.css'
import Table from './components/Table'
import LineGraph from './components/LineGraph'
import {sortData,prettyPrintStat} from './components/util'
import 'leaflet/dist/leaflet.css'


const App = () => {
  const [countries,setCountries]=useState([])
  const [country,setCountry]=useState("worldwide")
  const [countryInfo,setCountryInfo]=useState({})
  const [tableData,setTableData]=useState([]) 
  const [mapCenter,setMapCenter]=useState({ lat:34.80746,lng:-40.4796})
  const [mapZoom,setMapZoom]=useState(3)
  const [mapCountries,setMapCountries]=useState([])
  const [casesType,setCaseTypes]=useState("cases")
      
   useEffect(() => {
     fetch("https://disease.sh/v3/covid-19/all")
     .then(response =>response.json())
     .then(data => {
       setCountryInfo(data)
     })
   },[])

 
   
   useEffect(() =>{
    const getCountriesData =async () =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) =>response.json())
      .then((data) =>{
        const countries=data.map(country =>({
          name: country.country, 
          value: country.countryInfo.iso2 // USA ,UK
        }));
           
        const sortedData = sortData(data)
        setTableData(sortedData)
        setMapCountries(data)
        setCountries(countries)
  
      });
    }
    getCountriesData()
   },[])

   const onCountryChange= async(event) =>{
      const countryCode = event.target.value;

      const url= 
      countryCode==="worldwide" ?  "https://disease.sh/v3/covid-19/all" :
       `https://disease.sh/v3/covid-19/countries/${countryCode}`
      
      await fetch(url)
      .then((response) =>response.json())
      .then((data) =>{
        setCountry(countryCode)
        setCountryInfo(data)

        setMapCenter([data.countryInfo.lat,data.countryInfo.long])
        setMapZoom(4)
      })
   }

  return (
    <div className="app">
         <div className="app__left">
         <div className="app__header">
           <h1>COVID-19 TRACKER</h1>
      <FormControl className="app__dropdown">
        <Select variant="outlined"
         onChange={onCountryChange}
        value={country}>
        <MenuItem value="worldwide">{country}</MenuItem>
           {
             countries.map(country =>(
               <MenuItem value={country.value}>{country.name}</MenuItem>
             ))
           }
           </Select>
      </FormControl>
           </div>
           <div className="app__stats">
               <InfoBox 
                 isRed
                 active={casesType==="cases"}
                 onClick={e=>setCaseTypes("cases")} 
                 title="Coronevirus Cases" 
                 cases={prettyPrintStat(countryInfo.todayCases)} 
                 total={prettyPrintStat(countryInfo.cases)} />

               <InfoBox
                 active={casesType==="recovered"}
                 onClick={e=>setCaseTypes("recovered")} 
                 title="Recovered" 
                 cases={prettyPrintStat(countryInfo.todayRecovered)}
                 total={prettyPrintStat(countryInfo.recovered)} />
               
               <InfoBox 
                 isRed
                 active={casesType==="deaths"}
                 onClick={e=>setCaseTypes("deaths")} 
                 title="Deaths" 
                 cases={prettyPrintStat(countryInfo.todayDeaths)} 
                 total={prettyPrintStat(countryInfo.deaths)} />
           </div>
         {/* Maps */}
         <Map 
            casesType={casesType}
            center={mapCenter}
            countries={mapCountries}
            zoom={mapZoom}
           />
         </div>
         
          <Card className="app__right">
            <CardContent>
              <h3>Live Cases By country</h3>
              <Table countries={tableData}/>
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
         {/* Graph */}
           <LineGraph className="app_graph" casesType={casesType}/>
            </CardContent>
          </Card>
     </div>
  )
}

export default App
