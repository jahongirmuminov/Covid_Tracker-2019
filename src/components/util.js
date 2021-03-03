import React from 'react'
import numeral from 'numeral'
import {Circle,Popup} from 'react-leaflet'



const casesTypeColors={
    cases: {
        hex:"#CC1034",
        multiplier:800
    },
    recovered:{
        hex:"green",
        multiplier:1200,
    },
    deaths:{
        hex:"#fb4443",
        multiplier:2000
    }

}

export const sortData =(data)=>{
    const sortedData=[...data]
return  sortedData.sort((a,b)=> a.cases>b.cases ? -1 : 1)
}

export const prettyPrintStat=(stat)=>
         stat ? `+${numeral(stat).format("0.0a")}`:null

export const showDataonMap =(data,casesType="cases")=>
    data.map((country)=>(
        <Circle
         center={[country.countryInfo.lat,country.countryInfo.long]}
         fillOpacity={0.4}
         color={casesTypeColors[casesType].hex}
         fillColor={casesTypeColors[casesType].hex}
         radius={
             Math.sqrt(country[casesType])*casesTypeColors[casesType].multiplier
         }
        >
            <Popup>
                <div className="info__container">
                    <div className="info__flag"
                      style={{backgroundImage:`url(${country.countryInfo.flag})`}}/>
                    <div className="info__name">{country.country}</div>
                    <div className="info__confirmed">Cases:{numeral(country.cases).format("0,0")}</div>
                    <div className="info__recovered">Recovered:{numeral(country.recovered).format("0,0")}</div>
                    <div className="info__deaths">Deaths:{numeral(country.deaths).format("0.0")}</div>
                </div>
            </Popup>

        </Circle>
    ));
   