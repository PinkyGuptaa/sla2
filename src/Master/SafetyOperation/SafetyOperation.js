

import { Box, Button, MenuItem, TextField, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import Select from 'react-select';
import Bus_service from '../../Services/Bus_service';
import IncentivePage from '../BusPerformanceMetrics/AddBusIncentive';
import PenaltyPage from '../BusPerformanceMetrics/AddBus';

import { Edit } from '@mui/icons-material';
import Addbus from '../BusPerformanceMetrics/AddBus';
import AddBusIncentive from '../BusPerformanceMetrics/AddBusIncentive';
// import './SO.css';
function SafetyOperation(props) {
  const [regno, setRegNo] = useState('');
  const [busdetails, setBusDetails] = useState([]);
  const [allbusdetails, setAllBusDetails] = useState([]);

  const [unavailablebus, setUnavailablebus] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [filtervalue,setFiltervalue] = useState('monthwise');
  const [month,setMonth] = useState('');
  const [quarter,setQuarter] = useState('');
  const [halfyearly,setHalfyearly] = useState("")

  const [breakdownFactor, setBreakdownFactor] = useState(0);
const [totalActualDistance, setTotalActualDistance] = useState(0);
const [totalCoveredDistance, setTotalCoveredDistance] = useState(0);
  const [aftersearch,setAftersearch] = useState(false);

  const allmonths = [{key:"January",value:"01-01_01-31"},{key:"February",value:"02-01_02-28"},{key:"March",value:"03-01_03-31"},{key:"April",value:"04-01_04-30"},{key:"May",value:"05-01_05-31"},{key:"June",value:"06-01_06-30"},{key:"July",value:"07-01_07-31"},{key:"August",value:"08-01_08-31"},{key:"September",value:"09-01_09-30"},{key:"October",value:"10-01_10-31"},{key:"November",value:"11-01_11-30"},{key:"December",value:"12-01_12-31"}];

  const allquarters = [{key:"January-March",value:"2023-01-01_2023-03-31"},{key:"April-June",value:"2023-04-01_2023-06-30"},{key:"July-Sep",value:"2023-07-01_2023-09-30"},{key:"Oct-Dec",value:"2023-10-01_2023-12-31"}];
  const allhalfyearly = [{key:"January-June",value:"2023-01-01_2023-06-30"},{key:"July-December",value:"2023-07-01_2023-12-31"}];
    
 
  const [reportDetails, setReportDetails] = useState({
    countWayBillTrips: 0,
    countWayBillTripsWhereTimeIsNotZero: 0,
    wayBillTripsList: [],
  });

  const [tripData, setTripData] = useState({
    dispatch: 0,
    waybilltrip: 0,
  });
  const [totalDispatch, setTotalDispatch] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalopen,setModalopen] = useState(false)
  const [updateid,setUpdateid] = useState('');
  // const [typeformodal,setTypeformodal] = useState("");
  const [isAddBusOpen, setIsAddBusOpen] = useState(false);
  const [selectedRegNo, setSelectedRegNo] = useState(''); 
  const [year, setYear] = useState('');
  const [showIncentivePage, setShowIncentivePage] = useState(false);
  const [showPenaltyPage, setShowPenaltyPage] = useState(false);
  const [timeformodal,setTimeformodal] = useState("");
  const [typeformodal,setTypeformodal] = useState("");
  const [minorIncidents, setMinorIncidents] = useState([]);
  const [majorIncidents, setMajorIncidents] = useState([]);
  const [majorCount, setMajorCount] = useState(0);
  const [minorCount, setMinorCount] = useState(0);
  const [distance, setDistance] = useState(0);
  const [alreadyfilledMinor,setAlreadyfilledMinor] = useState("");
  const [alreadyfilledMajor,setAlreadyfilledMajor] =useState("");
  const styles = {
      
    valueContainer: (css) => ({
      ...css,
      ...{ width: "200px",
         textAlign:"left !important" }
    })
  };

  useEffect(() => {
    Bus_service.getAllBus()
      .then((res) => {
        setBusDetails(res.data);
        // console.log(res.data)
      })
      .catch((err) => console.log(err));
  }, []);
  const changeFiltervalue = (e)=>{
    setFiltervalue(e);
    setReportDetails({
        countWayBillTrips: 0,
        countWayBillTripsWhereTimeIsNotZero: 0,
        wayBillTripsList: [],
      });
  }
  const fetchTripData = async (startDate, endDate) => {
    const apiUrl = `http://10.226.33.132:9100/busperformance/getMergeDataSum/${startDate}/${endDate}`;
  
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch trip data');
      }
  
      const data = await response.json();
  
      // Assuming the data structure for total scheduled and completed trips is available in data
      setTripData({
        dispatch: data.dispatch,
        waybilltrip: data.waybilltrip,
      });

    } catch (error) {
      console.error('Error fetching trip data:', error);
    }
  };
//   const handleGenerateReport = async () => {
//     setLoading(true);
//     if(filtervalue==="buswise")
    
    
//   if (regno && selectedDate) {
 
//         const apiUrl = `http://10.226.33.132:9100/busperformance/getData/${regno}/${selectedDate}`;

//         const response = await fetch(apiUrl, {
//           method: 'GET',
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch data');
//         }

//         const data = await response.json();
//         setReportDetails({
//           countWayBillTrips: data.countWayBillTrips,
//           countWayBillTripsWhereTimeIsNotZero: data.countWayBillTripsWhereTimeIsNotZero,
//           wayBillTripsList: data.wayBillTripsList,
//         });
//       } else {
//         setError('Please select both Bus No. and Date');
//       }

//       else if (filtervalue === 'monthwise' || filtervalue === 'quarterly' || filtervalue === 'halfyearly') {
//         let dateArray = filtervalue === 'monthwise' ? month.split('_') : filtervalue === 'quarterly' ? quarter.split('_') : halfyearly.split('_');
//         if (month && year) {
//           let startDate = `${year}-${month.split('_')[0]}`;
//           let endDate = `${year}-${month.split('_')[1]}`;
//           console.log(startDate,endDate,year,month.split('_')[0]);

// try {
//   const res = await Bus_service.getAllAccidents(startDate, endDate); 
//   const busData = res.data;
//   console.log(res)
//   const minorIncidents = [];
// const majorIncidents = [];

// busData.forEach(item => {
//   if (item.incidentType === 'minor') {
//     minorIncidents.push(item);
//   } else if (item.incidentType === 'major') {
//     majorIncidents.push(item);
//   }
// });

// console.log('Minor Incidents:', minorIncidents);
// console.log('Major Incidents:', majorIncidents);
 

//   setAftersearch(true);
//   setLoading(false);
// } catch (error) {
//   console.error('Error fetching data:', error);
//   setLoading(false);
// }

//       }else {
//         setError('Please select both Month and Year');
//       }
//     }
//   };

const fetchAccidentsData = async () => {
  try {
    const startDate = `${year}-${month.split('_')[0]}`;
    const endDate = `${year}-${month.split('_')[1]}`;
    const res = await Bus_service.getAllAccidents(startDate, endDate);
    console.log(res.data)
    const accidentsData = res.data.IncidentData;
    console.log(accidentsData)
    let majoraccident = res.data.countMajorIncident;
    let minoraccident = res.data.countMinorIncident;
    let kmsRun = res.data.distance
    setMajorCount(majoraccident);
    setMinorCount(minoraccident);
    
    console.log(majorCount);
    console.log(minorCount);
    console.log(distance)
    const minorIncidentsData = [];
    const majorIncidentsData = [];

    accidentsData.forEach(item => {
      if (item.incidentType === 'minor') {
        minorIncidentsData.push(item);
      } else if (item.incidentType === 'major') {
        majorIncidentsData.push(item);
      }
    });

    setMinorIncidents(minorIncidentsData);
    setMajorIncidents(majorIncidentsData);
    setDistance(kmsRun)
    setAftersearch(true);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// const fetchAccidentsData = async () => {
//   try {
//     const startDate = `${year}-${month.split('_')[0]}`;
//     const endDate = `${year}-${month.split('_')[1]}`;
//     const res = await Bus_service.getAllAccidents(startDate, endDate);
//     console.log(res.data)
//     const accidentsData = res.data.IncidentData;
//     console.log(accidentsData)
//     let majoraccident = res.data.countMajorIncident;
//     let minoraccident = res.data.countMinorIncident;
//     let kmsRun = res.data.distance
//     setMajorCount(majoraccident);
//     setMinorCount(minoraccident);
    
//     console.log(majorCount);
//     console.log(minorCount);
//     console.log(distance)

//     if (Array.isArray(accidentsData)) {
//       const minorIncidentsData = [];
//       const majorIncidentsData = [];

//       accidentsData.forEach(item => {
//         if (item.incidentType === 'minor') {
//           minorIncidentsData.push(item);
//         } else if (item.incidentType === 'major') {
//           majorIncidentsData.push(item);
//         }
//       });

//       setMinorIncidents(minorIncidentsData);
//       setMajorIncidents(majorIncidentsData);
//     } else {
//       console.error('Accidents data is not an array:', accidentsData);
//     }

//     setDistance(kmsRun)
//     setAftersearch(true);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// };


const handleGenerateReport = () => {
  if (filtervalue === 'monthwise' && month && year) {
    fetchAccidentsData();
  } else {
    alert('Please select both Month and Year');
  }
};
  const handleChangeforbus = (e)=>{
    setRegNo(e.value);
    setSelectedDate(e.value);
  }
  const openIncentivePage = () => {
    setShowIncentivePage(true);
    // Additional logic if needed
  };

  const openPenaltyPage = () => {
    setShowPenaltyPage(true);
    // Additional logic if needed
  };
  const handleButtonClick = (time,type) => {
    setTimeformodal(time);
    setTypeformodal(type)
    setIsAddBusOpen(true);

    
  
  
  };
  function onmonthchange(value) {
    setMonth(value);

  }

  function onquarterchange(value){
    setQuarter(value);
    console.log(value)
  }

  function onhalfyearlychange(value){
    setHalfyearly(value);
    console.log(value)
  }
  const updatedata = (id) =>{
    setUpdateid(id);
    setModalopen(true);
}
const handleEyeClick = () => {
    setIsAddBusOpen(true);
  };
 
//calculate minor accident percentage 
  const MinorAccident =  minorCount > 0 
  ? (minorCount*10000/distance).toFixed(2) : 0;
 
console.log(MinorAccident)
 

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <div className='pageheader'>
    <Typography variant="h5" align="center" style={{marginLeft:'20px',color:"white",fontWeight:'900'}} gutterBottom>
   Safety of Operation
      </Typography>
      
      <div style={{display:"flex",alignItems:"center"}}>
        <div style={{marginRight:"10px",color:"white",fontWeight:'600'}}>
            Filter By :  
        </div>
        <div style={{marginRight:"10px"}}>
      
      <TextField
       style={{ margin: '10px'}}
id="outlined-select-currency"
select
label="Select Filter"
name="filter"
value={filtervalue}
onChange={(e)=>changeFiltervalue(e.target.value)}
required
variant="filled"
sx={{
'& > :not(style)': {  width: '25ch',marginRight:"20px",textAlign:"left !important" },
'& .css-e4w4as-MuiFormLabel-root-MuiInputLabel-root':{
color:"white"
},
'& .css-1wc848c-MuiFormHelperText-root':{
color:"white"
},
'& .css-o943dk-MuiFormLabel-root-MuiInputLabel-root':{color:"white"},
'& .css-19mk8g1-MuiInputBase-root-MuiFilledInput-root':{
color:"white"
},
'& .css-hfutr2-MuiSvgIcon-root-MuiSelect-icon':{
color:"rgb(255 255 255 / 71%)",
fill:"rgb(255 255 255 / 71%)"
},
'& .css-o943dk-MuiFormLabel-root-MuiInputLabel-root.Mui-focused':{
  color:"white"
}
}}
>
<MenuItem key={1} value="monthwise">
        Month Wise
      </MenuItem>
</TextField>
  </div>
      </div>
      </div>
     
     
    {filtervalue==='buswise'?
     <Box style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
      <TextField
  style={{ width: '200px', marginRight: '10px' }}
  id="standard-basic"
  label="Select Bus No."
  variant="outlined"
  select
  name="regno"
  value={regno}
  onChange={(e) => setRegNo(e.target.value)}
  required
  SelectProps={{
    MenuProps: {
      PaperProps: {
        style: {
          maxHeight: '200px', 
        },
      },
    },
  }}
>
  {busdetails.map((option) => (
    <MenuItem key={option.regno} value={option.regno}>
      {option.regno}
    </MenuItem>
  ))}
</TextField>
        <input
          type="date"
          style={{
            outlineColor: 'blue',
            borderColor: 'lightgrey',
            height: '58px',
            width: '170px',
            borderRadius: '5px',
            paddingLeft: '10px',
          }}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        <Button onClick={handleGenerateReport} style={{ marginLeft: '30px',padding:"15px",background:"#136a8a",color:"white",borderRadius:"5px",fontWeight:'600',cursor:"pointer" }}>
          Search
        </Button>
        {/* {loading && <p>Loading...</p>} */}
      </Box>:
      filtervalue==='monthwise'?
      <Box className='monthwiseform'>
      <div style={{display:"flex"}}>
     <TextField
        id="outlined-select-currency"
        select
        label="Month"
        value={month}
        onChange={(e)=>onmonthchange(e.target.value)}
        required={true}
        variant="filled"
      
        sx={{
          '& > :not(style)': {  width: '25ch',marginRight:"20px",textAlign:"left !important" },
          '& .css-e4w4as-MuiFormLabel-root-MuiInputLabel-root':{
            color:"white"
          },
          '& .css-1wc848c-MuiFormHelperText-root':{
            color:"white"
          },
          '& .css-o943dk-MuiFormLabel-root-MuiInputLabel-root':{color:"white"},
          '& .css-19mk8g1-MuiInputBase-root-MuiFilledInput-root':{
            color:"white"
          },
          '& .css-hfutr2-MuiSvgIcon-root-MuiSelect-icon':{
            color:"rgb(255 255 255 / 71%)",
            fill:"rgb(255 255 255 / 71%)"
          },
          '& .css-o943dk-MuiFormLabel-root-MuiInputLabel-root.Mui-focused':{
            color:"white"
          },
        }}
      >
            {allmonths.map((option) => (
              
          <MenuItem key={option.key} value={option.value}>
            {option.key}
          </MenuItem>
        ))}
      
      </TextField>
      <TextField
id="outlined-select-currency"
select
label="Year"
value={year}
onChange={(e) => setYear(e.target.value)}
required={true}
variant="filled"
sx={{
  '& > :not(style)': {  width: '25ch',marginRight:"20px",textAlign:"left !important" },
  '& .css-e4w4as-MuiFormLabel-root-MuiInputLabel-root':{
    color:"white"
  },
  '& .css-1wc848c-MuiFormHelperText-root':{
    color:"white"
  },
  '& .css-o943dk-MuiFormLabel-root-MuiInputLabel-root':{color:"white"},
  '& .css-19mk8g1-MuiInputBase-root-MuiFilledInput-root':{
    color:"white"
  },
  '& .css-hfutr2-MuiSvgIcon-root-MuiSelect-icon':{
    color:"rgb(255 255 255 / 71%)",
    fill:"rgb(255 255 255 / 71%)"
  },
  '& .css-o943dk-MuiFormLabel-root-MuiInputLabel-root.Mui-focused':{
    color:"white"
  },
}}
>
<MenuItem value="2023">2023</MenuItem>
<MenuItem value="2024">2024</MenuItem>
</TextField>
     {Boolean(month) && Boolean(year)?<Button onClick={handleGenerateReport} className="monthwiseformbutton">
        Search
      </Button>:""
    }
    
   </div>
    </Box>
    :
      filtervalue==="quarterly"?
      <Box style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
      <TextField
         id="outlined-select-currency"
         select
         label="Quarter"
         value={quarter}
         onChange={(e)=>onquarterchange(e.target.value)}
         required={true}
         variant="filled"
         

         sx={{
           '& > :not(style)': {  width: '25ch',marginRight:"20px",textAlign:"left !important" },
           '& .css-e4w4as-MuiFormLabel-root-MuiInputLabel-root':{
             color:"black"
           },
           '& .css-1wc848c-MuiFormHelperText-root':{
             color:"black"
           },
           '& .css-o943dk-MuiFormLabel-root-MuiInputLabel-root':{color:"black"}
         }}
       >
             {allquarters.map((option) => (
               
           <MenuItem key={option.key} value={option.value}>
             {option.key}
           </MenuItem>
         ))}
       
       </TextField>

       <button onClick={handleGenerateReport} style={{ marginLeft: '30px',padding:"15px",background:"#136a8a",color:"white",borderRadius:"5px",fontWeight:'600' }}>
         Search
       </button>
       {/* {loading && <p>Loading...</p>} */}
     </Box>:
     filtervalue==="halfyearly"?
     <Box style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
      <TextField
         id="outlined-select-currency"
         select
         label="Half Yearly"
         value={halfyearly}
         onChange={(e)=>onhalfyearlychange(e.target.value)}
         required={true}
         variant="filled"
         

         sx={{
           '& > :not(style)': {  width: '25ch',marginRight:"20px",textAlign:"left !important" },
           '& .css-e4w4as-MuiFormLabel-root-MuiInputLabel-root':{
             color:"black"
           },
           '& .css-1wc848c-MuiFormHelperText-root':{
             color:"black"
           },
           '& .css-o943dk-MuiFormLabel-root-MuiInputLabel-root':{color:"black"}
         }}
       >
             {allhalfyearly.map((option) => (
               
           <MenuItem key={option.key} value={option.value}>
             {option.key}
           </MenuItem>
         ))}
       
       </TextField>

       <button onClick={handleGenerateReport} style={{ marginLeft: '30px',padding:"15px",background:"#136a8a",color:"white",borderRadius:"5px",fontWeight:'600' }}>
         Search
       </button>
       {/* {loading && <p>Loading...</p>} */}
     </Box>:""

  }
  {aftersearch && (
  <div style={{ display: 'flex',width: "100%",justifyContent: "center",
  // backgroundColor: "#267871",
  
  paddingBottom: "50px",
  paddingTop: "20px", }}>

    <div style={{display: "flex",marginRight: "20px",width: "40%",flexDirection: "column", alignItems: "center",
    backgroundColor: "#136a8a54"}}>
     <h2>Minor Accidents</h2>
  <table className="accident-table">
    <thead>
      <tr>
        <th>Depot Code</th>
        <th>Trip No.</th>
        <th>Lot No.</th>
        <th>Incident</th>
        <th>Exact Location</th>
        <th>Exact Time</th>
        <th>Remarks</th>
      </tr>
    </thead>
    <tbody>
      {minorIncidents.map((incident, index) => (
        <tr key={index}>
          <td>{incident.depotCode}</td>
          <td>{incident.tripNo}</td>
          <td>{incident.lotno}</td>
          <td>{incident.incident}</td>
          <td>{incident.exactLocation}</td>
          <td>{incident.exactTime}</td>
          <td>{incident.remarks}</td>
        </tr>
      ))}
    </tbody>
  </table>
  <p> Minor Accidents Factor: {MinorAccident}</p>
  {alreadyfilledMinor?<p style={{color:"red"}}>Incentive/Penalty already filled.</p>:""}
  <p>{MinorAccident>=0.01?
           <Button onClick={()=>handleButtonClick("minoraccident","penalty")}
           disabled={alreadyfilledMinor}
           style={{padding:"10px",
           backgroundColor:alreadyfilledMinor?"lightgrey":"maroon",
           color:"white",cursor:"pointer"}}>
             Action </Button>
             :MinorAccident<0.01?
             <Button 
             onClick={()=>handleButtonClick("minoraccident","incentive")}
             disabled={alreadyfilledMinor} 
             style={{padding:"10px",backgroundColor:alreadyfilledMinor?"lightgrey":"#188718",color:"white",cursor:"pointer"}}>
             Incentive </Button>:""}</p>
</div>


    {/* Major Accident Table */}
    <div style={{display: "flex",marginRight: "20px",width: "40%",flexDirection: "column", alignItems: "center",
    backgroundColor: "#136a8a54" }}>
   <h2>Major Accidents</h2>
     
  <table className="accident-table">
    <thead>
      <tr>
      <th>Depot Code</th>
        <th>Trip No.</th>
        <th>Lot No.</th>
        <th>Incident</th>
        <th>Exact Location</th>
        <th>Exact Time</th>
        <th>Remarks</th>
      </tr>
    </thead>
    <tbody>
      {majorIncidents.map((incident, index) => (
        <tr key={index}>
            <td>{incident.depotCode}</td>
          <td>{incident.tripNo}</td>
          <td>{incident.lotno}</td>
          <td>{incident.incident}</td>
          <td>{incident.exactLocation}</td>
          <td>{incident.exactTime}</td>
          <td>{incident.remarks}</td>
        </tr>
      ))}
    </tbody>
  </table>

   <p>No. of Major Accidents: {majorCount}  </p> 
   {alreadyfilledMajor?<p style={{color:"red"}}>Penalty already filled.</p>:""}
<p>
   {majorCount>=1?
           <Button onClick={()=>handleButtonClick("majoraccident","penalty")} 
           disabled={alreadyfilledMajor}
           style={{padding:"10px",
           backgroundColor:alreadyfilledMajor?"lightgrey":"maroon",
           color:"white",cursor:"pointer",marginLeft:"10px"}}>
             Action </Button>:""}</p> 
            
             {isAddBusOpen?typeformodal==="penalty"?
  <Addbus open onClose={() => setIsAddBusOpen(false)} 
  from="SafetyOperation"
  minorpercent={MinorAccident}
  majorpercent={majorCount}
  timeformodal={timeformodal}
  month={month.substring(0,2)} year={year}
/>:<AddBusIncentive open onClose={() => setIsAddBusOpen(false)} 
    from="SafetyOperation"
    majorpercent={majorCount}
    timeformodal={timeformodal}
    month={month.substring(0,2)} year={year}
    />:""
} 
    </div>

    {/* Add styling for the tables */}
    <style jsx>{`
      .accident-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }
      .accident-table th, .accident-table td {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 8px;
      }
      .accident-table th {
        background-color: #f2f2f2;
      }
      .accident-table tbody tr:nth-child(even) {
        background-color: #f2f2f2;
      }
      .accident-table tbody tr:hover {
        background-color: #ddd;
      }
    `}</style>
  </div>
)}



     </div>
   );
 }
export default SafetyOperation;

