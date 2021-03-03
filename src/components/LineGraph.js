import React, { useEffect, useState } from 'react'
import {Line} from 'react-chartjs-2'
import numeral from 'numeral'

const options={
    legend:{
        display:false,
    },
    elements:{
        pointns:{
            radius:0,
        },
    },
    maintainAspectRatio:false,
    tooltip:{
        mode:"index",
        intersect:false,
        callback:{
            label:function(tooltipItem,data){
                return numeral(tooltipItem.value).format("+0,0")
            },
        },
    },
    scales:{
        xAxes:[{
              type:"time",
              time:{
                  format:"MM/DD/YY",
                  tooltipFormat:"ll",
              },

        }],
        yAxes:[{
            gridLines:{
                display:false,
            },
            ticks:{
                 //include  a dollar sign in sick 
                 callback:function(value,index,values){
                     return numeral(value).format("0a")
                 }
            }
        }
    ],
    }
}
const bulidCharData=(data,casesType)=>{
    let chartData=[]
    let lastDataPoint;

    for(let date in data.cases){
      if(lastDataPoint){
        let newDataPoint={
           x:date,
           y:data[casesType][date]-lastDataPoint
        };
        chartData.push(newDataPoint)
       }
       lastDataPoint=data[casesType][date];
    }
    return chartData
  }


const LineGraph = ({casesType="cases",...props}) => {
    
    const [data,setData] =useState({})
     useEffect(()=>{
        const fetchData = async ()=>{
        await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=30')
         .then(response =>{
             return response.json();
         })
         .then(data =>{
             let chartData=bulidCharData(data,casesType)
             setData(chartData)
         });
        };
        fetchData()
     },[casesType])

     
    return (
        <div className={props.className}>
            {data?.length>0 && (
               <Line 
               options={options}
                 data={{
                     datasets:[{
                       backgroundColor: 'rgba(204, 16, 54, 0.5)',
                       borderColor:"#CC1034",
                         data:data
                       }]
                 }}
                 
               />
            )}
           
        </div>
    )
}

export default LineGraph
