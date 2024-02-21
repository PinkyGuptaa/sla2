

import { Box, Button, MenuItem, Snackbar, TextField, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import Select from 'react-select';
import Bus_service from '../../Services/Bus_service';
import IncentivePage from '../BusPerformanceMetrics/AddBusIncentive';
import PenaltyPage from '../BusPerformanceMetrics/AddBus';

import { Edit } from '@mui/icons-material';
import Addbus from '../BusPerformanceMetrics/AddBus';
import AddBusIncentive from '../BusPerformanceMetrics/AddBusIncentive';

function Frequency(props) {
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
  const [allreadyfilledbuskm,setAllreadyfilledbuskm] = useState("");
  const [allreadyfilledtripfeq,setAllreadyfilledtripfrq] =useState("");
  const [opensnack,setOpensnack] = useState(false)
  const [errormessage,setErrormessage] = useState('');
  const [snackcolor,setSnackcolor] = useState('');

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
  const handleGenerateReport = async () => {
    setLoading(true);
    let penaltycheckbuskm;
    let incrementcheckbuskm;
    let penaltychecktripfrq;
    let incrementchecktripfrq;

    checkiffilledalreadybuskm("Bus KMs Frequency",month,year,aftercheck);
    checkiffilledalreadytripfrq("Trip Frequency",month,year,afterchecktrip);

    async function checkiffilledalreadybuskm(a,m,y){
      let monthnum = m.substr(0,2);
      await Bus_service.checkifalreadyfilledpenalty(a,monthnum,y).then((res)=>{
        penaltycheckbuskm = res.data;
        console.log(res.data);
      }).catch(err=>console.log(err));

      await Bus_service.checkifalreadyfilledincrement(a,monthnum,y).then((res)=>{
        incrementcheckbuskm = res.data;
        console.log(res.data);
      }).catch(err=>console.log(err));

      aftercheck();
    }

    async function checkiffilledalreadytripfrq(a,m,y){
      let monthnum = m.substr(0,2);
      await Bus_service.checkifalreadyfilledpenalty(a,monthnum,y).then((res)=>{
        penaltychecktripfrq = res.data;
        console.log(res.data);
      }).catch(err=>console.log(err));

      await Bus_service.checkifalreadyfilledincrement(a,monthnum,y).then((res)=>{
        incrementchecktripfrq = res.data;
        console.log(res.data);
      }).catch(err=>console.log(err));

      afterchecktrip();
    }

    async function aftercheck(){
      if(penaltycheckbuskm || incrementcheckbuskm){
        setAllreadyfilledbuskm(true);
        
      }
      else {
        setAllreadyfilledbuskm(false);
      }
      
    }

    async function afterchecktrip(){
      if(penaltychecktripfrq || incrementchecktripfrq){
        setAllreadyfilledtripfrq(true);
        
      }
      else {
        setAllreadyfilledtripfrq(false);
      }
      
    }

    if(filtervalue==="buswise")
    // {
    //     const data = await Bus_service.getdatabybusnodate(regno,selectedDate).then((res)=>{
    //           setReportDetails({
    //             countWayBillTrips: data.countWayBillTrips,
    //                   countWayBillTripsWhereTimeIsNotZero: data.countWayBillTripsWhereTimeIsNotZero,
    //                   wayBillTripsList: data.wayBillTripsList,
    //             });
    //             console.log(regno,selectedDate,res.data)
    //             setLoading(false);
    //       }).catch((err)=>{
    //           console.log(err)
    //           setLoading(false);
    //       })
    //   }
    
  if (regno && selectedDate) {
 
        const apiUrl = `http://10.226.33.132:9100/busperformance/getData/${regno}/${selectedDate}`;

        const response = await fetch(apiUrl, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setReportDetails({
          countWayBillTrips: data.countWayBillTrips,
          countWayBillTripsWhereTimeIsNotZero: data.countWayBillTripsWhereTimeIsNotZero,
          wayBillTripsList: data.wayBillTripsList,
        });
      } else {
        setError('Please select both Bus No. and Date');
      }

      else if (filtervalue === 'monthwise' || filtervalue === 'quarterly' || filtervalue === 'halfyearly') {
        let dateArray = filtervalue === 'monthwise' ? month.split('_') : filtervalue === 'quarterly' ? quarter.split('_') : halfyearly.split('_');
        if (month && year) {
          let startDate = `${year}-${month.split('_')[0]}`;
          let endDate = `${year}-${month.split('_')[1]}`;
          console.log(startDate,endDate,year,month.split('_')[0]);
//         try {
//           const res = await Bus_service.getAllMergeData(startDate, endDate);

//           let unavailableBuses = res.data[0].count
//           setUnavailablebus(unavailableBuses)
//           console.log(unavailablebus);
//           console.log(res.data[0].count)
//           console.log(res.data[1])
//           const totalCoveredDistance = allbusdetails.reduce((sum, bus) => sum + bus.totalCoveredDistance, 0);
//           const calculatedBreakdownFactor =  parseFloat((unavailableBuses * 10000) / totalCoveredDistance).toFixed(3);
//           setBreakdownFactor(parseFloat(calculatedBreakdownFactor));
//           console.log(calculatedBreakdownFactor)
//           // setReportDetails({
//           //   countWayBillTrips: res.data.countWayBillTrips,
//           //   countWayBillTripsWhereTimeIsNotZero: res.data.countWayBillTripsWhereTimeIsNotZero,
//           //   wayBillTripsList: res.data.wayBillTripsList,
//           // });
//       setAllBusDetails(res.data[1])
// //setUnavailableBuses(res.data[0].count);
// await fetchTripData(startDate, endDate);
//       console.log(unavailableBuses);
//       console.log(allbusdetails)
//       setAftersearch(true); 
//           setLoading(false);
//         } catch (err) {
//           console.log(err);
//           setLoading(false);
//         }
try {
  const res = await Bus_service.getAllData(startDate, endDate); // Replace with your new API endpoint
  const busData = res.data;

  let unavailableBuses = busData.length;
  setUnavailablebus(unavailableBuses);

  const totalActualDistance = busData.reduce((sum, bus) => sum + bus.totalActualDistance, 0);
  const totalCoveredDistance = busData.reduce((sum, bus) => sum + bus.totalCoveredDistance, 0);

  const calculatedBreakdownFactor = parseFloat((unavailableBuses * 10000) / totalCoveredDistance).toFixed(3);
  setBreakdownFactor(parseFloat(calculatedBreakdownFactor));

  setAllBusDetails(busData);
//fetch data of dispatch 
  await fetchTripData(startDate, endDate);

  console.log(unavailableBuses);
  console.log(allbusdetails);
  console.log(totalActualDistance);

  setTotalActualDistance(totalActualDistance)
  setTotalCoveredDistance(totalCoveredDistance)
console.log(totalActualDistance)
  console.log(totalCoveredDistance);

  setAftersearch(true);
  setLoading(false);
} catch (error) {
  console.error('Error fetching data:', error);
  setLoading(false);
}

      }else {
        setError('Please select both Month and Year');
      }
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
    // setYear(value.split('_')[0]); // Extracting the year from the selected value
    // console.log("Selected Month:", value);
    // console.log("Selected Year:", value.split('_')[0]);
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
 

  useEffect(() => {
   
    const calculateBreakdownFactor = () => {
      if (allbusdetails.length > 0) {
        const totalCoveredDistance = allbusdetails.reduce((sum, bus) => sum + bus.totalCoveredDistance, 0);
        const calculatedBreakdownFactor = parseFloat((unavailablebus * 10000) / totalCoveredDistance).toFixed(3);
        setBreakdownFactor(parseFloat(calculatedBreakdownFactor));
      }  
    };


    calculateBreakdownFactor();
  }, [allbusdetails, unavailablebus]);
//method to calculate trip freq 
  const totalScheduledTrips = tripData.dispatch;
  const totalCompletedTrips = tripData.waybilltrip;
  
  const tripFrequency = totalScheduledTrips > 0
    ? (((totalCompletedTrips) / totalScheduledTrips) * 100).toFixed(2)
    : 0;
    
  //method to calculate bus km freq

  const BusKMsFrequency =  totalActualDistance > 0 
  ? (((totalCoveredDistance) / totalActualDistance) * 100).toFixed(2) : 0;
 
  const handleSnackClose = ()=>{
    setOpensnack(false);
  }; 

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
         <Snackbar  ContentProps={{
    sx: {
      background: snackcolor,
      color:'white',
      padding:"15px",
      letterSpacing:"1.5px",
      fontWeight:"500",
      textAlign:"center",
      
    }
  }}
  anchorOrigin={{vertical:'top',horizontal:'center'}}
  open={opensnack}
  autoHideDuration={6000}
  onClose={handleSnackClose}
  message={errormessage}
  />

    <div className='pageheader'>
    <Typography variant="h5" align="center" style={{marginLeft:'20px',color:"white",fontWeight:'900'}} gutterBottom>
   Frequency
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

        <button onClick={handleGenerateReport} style={{ marginLeft: '30px',padding:"15px",background:"#136a8a",color:"white",borderRadius:"5px",fontWeight:'600',cursor:"pointer" }}>
          Search
        </button>
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

       <Button onClick={handleGenerateReport} style={{ marginLeft: '30px',padding:"15px",background:"#136a8a",color:"white",borderRadius:"5px",fontWeight:'600',cursor:"pointer" }}>
         Search
       </Button>
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
  {aftersearch && allbusdetails && allbusdetails.length > 0 && (
  <div style={{ display: 'flex',width: "100%",justifyContent: "center",backgroundColor: "#267871",paddingBottom: "50px",
  paddingTop: "20px", }}>

    <div style={{display: "flex",marginRight: "20px",width: "40%",flexDirection: "column", alignItems: "center",
    backgroundColor: "#136a8a54"}}>
  <h2>Bus KMs Frequency</h2>
  {/* <p>Number of Unavailable Buses: {unavailablebus}</p> */}
  <p>Total KMs To Run: {totalActualDistance}</p>
  <p>Total Distance Covered: {totalCoveredDistance}</p>
  <p>Bus KMs Frequency = {BusKMsFrequency}
    {/* {totalActualDistance > 0 ? (((totalActualDistance - totalCoveredDistance) / totalActualDistance) * 100).toFixed(2) : 0} % */}
    </p>
    {allreadyfilledbuskm?<p style={{color:"red"}}>Incentive/Penalty already filled.</p>:""}
    <p>{BusKMsFrequency<=93?
           <Button onClick={()=>handleButtonClick("buskmfrequency","penalty")} 
           disabled={allreadyfilledbuskm}
            style={{padding:"10px",
            backgroundColor:allreadyfilledbuskm?"lightgrey":"maroon",
            color:"white",cursor:"pointer"}}>
             Action </Button>:BusKMsFrequency>95?<Button 
             onClick={()=>handleButtonClick("buskmfrequency","incentive")} 
             disabled={allreadyfilledbuskm} style={{padding:"10px",backgroundColor:allreadyfilledbuskm?"lightgrey":"#188718",color:"white",cursor:"pointer"}}>
             Incentive </Button>:""}</p>
            
             {/* {isAddBusOpen?typeformodal==="penalty"?
  <Addbus open onClose={() => setIsAddBusOpen(false)} from="Frequency" frequencyper={tripFrequency}
/>:<AddBusIncentive open onClose={() => setIsAddBusOpen(false)} 
    from="Frequency" frequencyper={tripFrequency} />:""
} */}
  </div>
    <div style={{display: "flex",marginRight: "20px",width: "40%",flexDirection: "column", alignItems: "center",
    backgroundColor: "#136a8a54" }}>
      <h2>Trip Frequency</h2>
      <p>Total Scheduled Trips: {tripData.dispatch}</p>
      <p>Total Completed Trips:{tripData.waybilltrip}</p>
      <p>Trip Frequency = { tripFrequency}
  </p>
  {allreadyfilledtripfeq?<p style={{color:"red"}}>Incentive/Penalty already filled.</p>:""}
           <p>{tripFrequency<=93?
           <Button onClick={()=>handleButtonClick("tripfrequency","penalty")} disabled={allreadyfilledtripfeq} style={{padding:"10px",backgroundColor:allreadyfilledtripfeq?"lightgrey":"maroon",color:"white",cursor:"pointer"}}>
             Action </Button>:tripFrequency>=95?<Button onClick={()=>handleButtonClick("tripfrequency","incentive")}   
             disabled={allreadyfilledtripfeq} style={{padding:"10px",backgroundColor:allreadyfilledtripfeq?"lightgrey":"#188718",color:"white",cursor:"pointer"}}>
             Incentive </Button>:""}</p>
            
             {isAddBusOpen?typeformodal==="penalty"?
  <Addbus open onCloseerror={() => {setIsAddBusOpen(false)
    setOpensnack(true);
    setErrormessage("Not able to submit now. Please try again later"); 
    setSnackcolor("#e34242"); 
   }
 } 
 onClose={() => {setIsAddBusOpen(false)
   setSnackcolor("#458a32");
   setErrormessage(" Data Saved Successfully ")
   setOpensnack(true);
  }
 } 
  from="Frequency"
  buskmfrequencyper={BusKMsFrequency}  
  frequencyper={tripFrequency}
  timeformodal={timeformodal}
  month={month.substring(0,2)} year={year}
/>:<AddBusIncentive open onCloseerror={() => {setIsAddBusOpen(false)
   setOpensnack(true);
   setErrormessage("Not able to submit now. Please try again later"); 
   setSnackcolor("#e34242"); 
  }
} 
onClose={() => {setIsAddBusOpen(false)
  setSnackcolor("#458a32");
  setErrormessage(" Data Saved Successfully ")
  setOpensnack(true);
  handleGenerateReport();
 }
} 
    from="Frequency"
    buskmfrequencyper={BusKMsFrequency}
    frequencyper={tripFrequency} 
    timeformodal={timeformodal}
    month={month.substring(0,2)} year={year}
    />:""
} 
    </div>
    </div>
)}
     </div>
   );
 }
export default Frequency;

