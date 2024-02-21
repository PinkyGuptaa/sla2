import { Box, Button, FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import Bus_service from '../../Services/Bus_service';
import Select from 'react-select';
import Busavailability_service from '../../Services/Busavailability_service';
import Addbus from '../BusPerformanceMetrics/AddBus';
import AddBusIncentive from '../BusPerformanceMetrics/AddBusIncentive';

import { teal } from '@mui/material/colors';
function Busdetails (props){
    const [radioselected,setRadioselected] = useState("Schedule");
    const [regno,setRegNo] = useState("");
    const [allbuslist,setAllbuslist] = useState([]);
    // const [aftersearch,setAfterseacrch] = useState(false);
    const [loading,setLoading] = useState(false)
    const [busdetails, setBusDetails] = useState([]);
    const [allbusdetails, setAllBusDetails] = useState([]);
     const [unavailablebus, setUnavailablebus] = useState([]);
    const [checktabledata,setChecktabledata] = useState(false);
    const [breakdownFactor, setBreakdownFactor] = useState(0);
    const [month,setMonth] = useState("")

    const [totalActualDistance, setTotalActualDistance] = useState(0);
const [totalCoveredDistance, setTotalCoveredDistance] = useState(0);
  const [aftersearch,setAftersearch] = useState(false);
    const [tripData, setTripData] = useState({
      dispatch: 0,
      waybilltrip: 0,
    });
    const [allreadyfilledbuskm,setAllreadyfilledbuskm] = useState("");
    const [allreadyfilledtripfeq,setAllreadyfilledtripfrq] =useState("");
    const [timeformodal,setTimeformodal] = useState("");
    const [typeformodal,setTypeformodal] = useState("");
    const [opensnack,setOpensnack] = useState(false)
    const [errormessage,setErrormessage] = useState('');
    const [snackcolor,setSnackcolor] = useState('');
  
    // const allmonths = [{key:"January",value:"2023-01-01_2023-01-31"},{key:"February",value:"2023-02-01_2023-02-28"},{key:"March",value:"2023-03-01_2023-03-31"},{key:"April",value:"2023-04-01_2023-04-30"},{key:"May",value:"2023-05-01_2023-05-31"},{key:"June",value:"2023-06-01_2023-06-30"},{key:"July",value:"2023-07-01_2023-07-31"},{key:"August",value:"2023-08-01_2023-08-31"},{key:"September",value:"2023-09-01_2023-09-30"},{key:"October",value:"2023-10-01_2023-10-31"},{key:"November",value:"2023-11-01_2023-11-30"},{key:"December",value:"2023-12-01_2023-12-31"}];
    const allmonths = [{key:"January",value:"01-01_01-31"},{key:"February",value:"02-01_02-28"},{key:"March",value:"03-01_03-31"},{key:"April",value:"04-01_04-30"},{key:"May",value:"05-01_05-31"},{key:"June",value:"06-01_06-30"},{key:"July",value:"07-01_07-31"},{key:"August",value:"08-01_08-31"},{key:"September",value:"09-01_09-30"},{key:"October",value:"10-01_10-31"},{key:"November",value:"11-01_11-30"},{key:"December",value:"12-01_12-31"}];
 const [year, setYear] = useState('');
    const [reportDetails, setReportDetails] = useState({
        countWayBillTrips: 0,
        countWayBillTripsWhereTimeIsNotZero: 0,
        wayBillTripsList: [],
      });
      const [isAddBusOpen, setIsAddBusOpen] = useState(false);
      const [error, setError] = useState(null);
    useEffect(()=>{
        console.log(props.pto)
        setReportDetails({
         countWayBillTrips: 0,
         countWayBillTripsWhereTimeIsNotZero: 0,
         wayBillTripsList: [],
       });
       setAftersearch(false)
        if(Boolean(props.pto)){
         console.log("props present")
         Bus_service.getAllbusbypto(props.pto).then((res)=>{
             let arr1 = [];
             let d1= res.data;
             d1.map((data)=>{
                 var obj1 = {"value":data.regno,"label":data.regno};
                 arr1.push(obj1);
             })
             setAllbuslist(arr1);
           console.log(arr1);
         }).catch((err)=>{
             console.log(err)
         })
        }
        else {
         Bus_service.getAllBus()
         .then((res) => {
             let arr = [];
             let d= res.data;
             d.map((data)=>{
                 var obj = {"value":data.regno,"label":data.regno};
                 arr.push(obj);
             })
             setAllbuslist(arr);
           console.log(arr);
         })
         .catch((err) => console.log(err));
        }
       },[props.pto])

       const fetchTripData = async (regno,startDate, endDate) => {
        // const apiUrl = Bus_service.getTripFrequencyData(regno,startDate, endDate)
        
        const apiUrl = `http://10.226.33.132:9100/busperformance/getMergeMultipleApi/${regno}/${startDate}/${endDate}`;
      
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
    console.log(tripData)
        } catch (error) {
          console.error('Error fetching trip data:', error);
        }
      };
      
      

       const handleGenerateReport = async () => {
        setLoading(true);
        if(radioselected==="Schedule"){
        //   let dateArray = filtervalue === 'buswise' ? month.split('_') : filtervalue === 'quarterly' ? quarter.split('_') : halfyearly.split('_');
        let dateArray = month.split('_');
        if (month && year) {
          let startDate = `${year}-${month.split('_')[0]}`;
          let endDate = `${year}-${month.split('_')[1]}`;
          console.log(startDate,endDate,year,month.split('_')[0]);
          // await Bus_service.getdatabybusnodate(regno,dateArray[0], dateArray[1]).then((res)=>{
            await Bus_service.getdatabybusnodate(regno,startDate, endDate).then((res)=>{
  
          console.log(res)
                setReportDetails({
                  countWayBillTrips: res.data.countWayBillTrips,
                          countWayBillTripsWhereTimeIsNotZero: res.data.countWayBillTripsWhereTimeIsNotZero,
                          wayBillTripsList: res.data.wayBillTripsList,
                  });
                  // res.data.records.length==0?setChecktabledata(true):setChecktabledata(false);
                  // console.log(regno,res.data)
                  setLoading(false);
                  setAftersearch(true)
            }).catch((err)=>{
                console.log(err)
                setLoading(false);
                setAftersearch(false)
            })
          }else {
            setError('Please select both Month and Year');
          }
        }
        else  if(radioselected==="Availability"){
            //   let dateArray = filtervalue === 'buswise' ? month.split('_') : filtervalue === 'quarterly' ? quarter.split('_') : halfyearly.split('_');
            let dateArray = month.split('_');
            if (month && year) {
              let startDate = `${year}-${month.split('_')[0]}`;
              let endDate = `${year}-${month.split('_')[1]}`;
              console.log(startDate,endDate,year,month.split('_')[0]);
              await Busavailability_service.busdatewisedata(regno,startDate, endDate).then((res)=>{

              // await Busavailability_service.busdatewisedata(regno,dateArray[0], dateArray[1]).then((res)=>{
                console.log(res)
                setReportDetails({
                    countWayBillTrips: res.data.count,
                    countWayBillTripsWhereTimeIsNotZero: 0,
                    wayBillTripsList: res.data.records,
                  });
                       res.data.records.length==0?setChecktabledata(true):setChecktabledata(false);
                      // console.log(regno,res.data)
                      setLoading(false);
                      setAftersearch(true)
                }).catch((err)=>{
                    console.log(err)
                    setLoading(false);
                    setAftersearch(false)
                })
              }else {
                setError('Please select both Month and Year');
              }
            }
            else  if(radioselected==="Breakdown"){
                //   let dateArray = filtervalue === 'buswise' ? month.split('_') : filtervalue === 'quarterly' ? quarter.split('_') : halfyearly.split('_');
                let dateArray = month.split('_');
                if (month && year) {
                  let startDate = `${year}-${month.split('_')[0]}`;
                  let endDate = `${year}-${month.split('_')[1]}`;
                  console.log(startDate,endDate,year,month.split('_')[0]);
               
                  await Busavailability_service.busdatewisedatabreakdown(regno,startDate, endDate).then((res)=>{
                    let unavailableBuses = 1;
                    setUnavailablebus(unavailableBuses)
                  console.log(res.data)
                  
                    const totalCoveredDistance = res.data[0]?.totalCoveredDistance;
                    const calculatedBreakdownFactor =  parseFloat((unavailableBuses * 10000) / totalCoveredDistance).toFixed(3);
                    setBreakdownFactor(parseFloat(calculatedBreakdownFactor));
                    console.log(calculatedBreakdownFactor)
                    // setReportDetails({
                    //   countWayBillTrips: res.data.countWayBillTrips,
                    //   countWayBillTripsWhereTimeIsNotZero: res.data.countWayBillTripsWhereTimeIsNotZero,
                    //   wayBillTripsList: res.data.wayBillTripsList,
                    // });
                setAllBusDetails(res.data)
          // setUnavailableBuses(res.data[0].count);
          
          console.log(unavailableBuses);
                console.log(allbusdetails)
                setAftersearch(true); 
                    setLoading(false);
                    }).catch((err)=>{
                        console.log(err)
                        setLoading(false);
                        setAftersearch(false)
                    })
                }

              }
              else if (radioselected === "Frequency") {
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
                let startDate = `${year}-${month.split('_')[0]}`;
                  let endDate = `${year}-${month.split('_')[1]}`;
                  console.log(startDate,endDate,year,month.split('_')[0]);
                  try{
                const res = await Bus_service.getFrequencyData(regno, startDate, endDate)
                const  busData = res.data;
                    
                let unavailableBuses = busData.length;
                setUnavailablebus(unavailableBuses);
              
                const totalActualDistance = busData.reduce((sum, bus) => sum + bus.totalActualDistance, 0);
                const totalCoveredDistance = busData.reduce((sum, bus) => sum + bus.totalCoveredDistance, 0);
              
                const calculatedBreakdownFactor = parseFloat((unavailableBuses * 10000) / totalCoveredDistance).toFixed(3);
                setBreakdownFactor(parseFloat(calculatedBreakdownFactor));
              
                setAllBusDetails(busData);
              //fetch data of dispatch 
                await fetchTripData(regno, startDate, endDate);
              
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
            }
              else {
                setError('Please select both Month and Year');
              }
        
    
          
      }

      function onmonthchange(value){
        setMonth(value);
        // console.log(value)
        // console.log(value.split('_'))
        setAftersearch(false)
        // setReportflag(false);
        // setSelectedeffortdetails([]);
      }

    function handleradiochange(e){
        setRadioselected(e.target.value);
        console.log(e.target.value)
        setReportDetails({
            countWayBillTrips: 0,
                    countWayBillTripsWhereTimeIsNotZero: 0,
                    wayBillTripsList: [],
            });
           
            setLoading(false);
            setAftersearch(false)
            setChecktabledata(false)
    }
    const handleButtonClick = () => {
      setIsAddBusOpen(true);
    };
    const handleButtonClickIncentive = () => {
      setIsAddBusOpen(true);
    };
    //method to calculate trip freq 
  const totalScheduledTrips = tripData.dispatch;
  const totalCompletedTrips = tripData.waybilltrip;
  
  const tripFrequency = totalScheduledTrips > 0
    ? (((totalCompletedTrips) / totalScheduledTrips) * 100).toFixed(2)
    : 0;
    
  //method to calculate bus km freq

  const BusKMsFrequency =  totalActualDistance > 0 
  ? (((totalCoveredDistance) / totalActualDistance) * 100).toFixed(2) : 0;
 
  return (  
  <div style={{ display: 'flex',flexDirection:"column", justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
     <div className='pageheader'>
        
      <Typography variant="h5" align="center" style={{marginLeft:'20px',color:"white",fontWeight:'900'}} gutterBottom>
        Bus Details
      </Typography>
      </div>

      <Box style={{ display: 'flex',flexDirection:"column", alignItems: 'center',background:"#267871",width:"100%" }}>
       
       <div style={{display:'flex',color:"white"}}>
       <FormControl style={{color:"white"}}>
      <FormLabel id="demo-row-radio-buttons-group-label"></FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
        value={radioselected}
        onChange = {handleradiochange}
        color="white"
      >
        <FormControlLabel value="Schedule" control={<Radio sx={{
          
          '&.Mui-checked': {
            color: teal[900],
          },
        }} />} color="white" label="Schedule" />
        <FormControlLabel value="Breakdown" control={<Radio sx={{
          
          '&.Mui-checked': {
            color: teal[900],
          },
        }} />} label="Breakdown" />
        <FormControlLabel value="Availability" control={<Radio sx={{
          
          '&.Mui-checked': {
            color: teal[900],
          },
        }} />} label="Availability" />

        <FormControlLabel value="Frequency" control={<Radio sx={{
          
          '&.Mui-checked': {
            color: teal[900],
          },
        }} />} label="Frequency" />

        <FormControlLabel value="Safety of Operation" control={<Radio sx={{
          
          '&.Mui-checked': {
            color: teal[900],
          },
        }} />} label="Safety of Operation" />
      </RadioGroup>
    </FormControl>
       </div>

       <Box style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
      {/* <TextField
      id="outlined-select-currency"
      select
      label="Select Bus No."
      value={regno}
      onChange={(e)=>setRegNo(e.target.value)}
      required={true}
      variant="filled"

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
  {allbuslist.map((option) => (
    <MenuItem key={option.value} value={option.value}>
      {option.value}
    </MenuItem>
  ))}
</TextField> */}

<TextField
          id="outlined-select-currency"
          select
          label="Select Bus No."
          value={regno}
          onChange={(e)=>setRegNo(e.target.value)}
          required={true}
          variant="filled"
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: {
                  maxHeight: '200px', 
                },
              },
            },
          }}

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
            {allbuslist.map((option) => (
    <MenuItem key={option.value} value={option.value}>
      {option.value}
    </MenuItem>
  ))}
        
        </TextField>

        
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
            }
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
    }
  }}
>
<MenuItem value="2023">2023</MenuItem>
<MenuItem value="2024">2024</MenuItem>
</TextField>

        {
        Boolean(regno) && Boolean(month) && Boolean(year)?<Button onClick={handleGenerateReport} className="monthwiseformbutton">
        Search
      </Button>:""
            }
        </Box>

       {
        radioselected  === 'Schedule'?
        <>
       
        
        <Box style={{ display: 'flex',flexDirection:"column", alignItems: 'center', marginTop: '20px' }} >
        {aftersearch?
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
  <p style={{marginLeft : '50px', marginRight: '50px' }}>Total Trips Count: {reportDetails.countWayBillTrips}</p>
  <p style={{ color: reportDetails.countWayBillTripsWhereTimeIsNotZero > 0 ? 'red' : 'inherit' }}>
    Number of Trips Violated: {reportDetails.countWayBillTripsWhereTimeIsNotZero}
  </p>
</div>:"" 
        }

        {reportDetails.wayBillTripsList && reportDetails.wayBillTripsList.length > 0 && (
  
  <table className="report-table">
    <thead>
      <tr>
    
        
        {/* <th>Route Name</th> */}
        {/* <th>Conductor Name</th> */}
        <th>Driver Id</th>
        <th>Conductor Id</th>
       <th>Bus No.</th>
               {/* <th>waybillNo</th> */}
        <th>From Stop</th>
        <th>To Stop</th>
        <th>ETA From Stop</th>
        <th>ATA From Stop</th>
        <th>From Time Difference</th>
        <th>ETA To Stop</th>
        <th>ATA To Stop</th>
        {/* <th>Actual Distance</th> */}
        <th>To Time Difference</th>
        {/* <th>Trip Income</th> */}
        {/* <th>Action</th> */}
        {/* <th>busNo</th> */}
     
      </tr>
    </thead>
    <tbody>
      {reportDetails.wayBillTripsList.map((item, index) => (
        <tr key={index}>
  
          {/* <td>{item.routeName}</td> */}
          {/* <td>{item.conductorName}</td> */}
          <td>{item.driverId}</td>
          <td>{item.conductorId}</td>
        <td>{item.busNo}</td>
          {/* <td>{item.waybillNo}</td> */}
          <td>{item.fromStop}</td>
          <td>{item.toStop}</td>
          <td>{item.etaFromStop.slice(0, 5)}</td>
          <td>{item.ataFromStop.slice(0, 5)}</td>
          <td style={{backgroundColor:item.diffTimeFromMinute>5?"#ed6e6e9c":""}}>{item.diffTimeFrom.slice(0, 5) }</td>
          <td>{item.etaToStop.slice(0, 5)}</td>
          <td>{item.ataToStop.slice(0, 5)}</td>
          <td style={{backgroundColor:item.diffTimeToMinute>15?"#ebb990":""}}>{item.diffTimeTo.slice(0, 5)}</td>
          {/* <td>{item.actualDistance}</td> */}
          {/* <td>{item.tripIncome}</td> */}
         
         
        
  
        </tr>
      ))}
    </tbody>
  </table>
)}

        
      </Box>
        </>:
        radioselected === 'Availability'?
        <>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
{aftersearch?<>
           <p style={{marginLeft : '50px', marginRight: '50px' }}>Total Inactive Count: {reportDetails.countWayBillTrips}</p>
           <p style={{marginLeft : '50px', marginRight: '50px' }} >Availabilty Percentage : {(((Number(allbuslist.length)-Number(reportDetails.countWayBillTrips))/Number(allbuslist.length))*100).toFixed(2)} </p>
           {/* <p>{(((Number(allbuslist.length)-Number(reportDetails.countWayBillTrips))/Number(allbuslist.length))*100).toFixed(2)<95?<button style={{padding:"10px",backgroundColor:"maroon",color:"white"}}> Action </button>:""}</p> */}
  </>:""
}
</div>
      {reportDetails.wayBillTripsList.length > 0 ? 
  <table className="report-table">
    <thead>
      <tr>
        <th>Reg No.</th>
        <th>Reg Date</th>
        <th>Inactive Date</th>
        <th>Fuel Type</th>
      </tr>
    </thead>
    <tbody>
      {reportDetails.wayBillTripsList.map((item, index) => (
        <tr key={index}>
          <td>{item.regnNo}</td>
          <td>{item.regnDt}</td>
          <td>{item.inactiveDt}</td>
          <td>{item.fuelType}</td>

        </tr>
      ))}
    </tbody>
  </table>:reportDetails.wayBillTripsList.length==0 && checktabledata?"":""
  // <div>
  //   No Data Available
  // </div>:""
}
        </>:
        radioselected === "Breakdown"?
        <>
         
      <div style={{marginTop:"20px"}}></div>
        {
            aftersearch?allbusdetails.length > 0?
            <>
             <table className="report-table">
          <thead>
            <tr>
              <th>Bus No.</th>
              <th>Distance To Cover</th>
              <th>Distance Covered</th>
              <th>Distance Difference</th>
            </tr>
          </thead>
          <tbody>
            {allbusdetails.map((bus, index) => (
              <tr key={index}>
                <td>{bus.busNo}</td>
                <td>{bus.totalActualDistance}</td>
                <td>{bus.totalCoveredDistance}</td>
                <td>{bus.totalDifferenceCovered}</td>
            
              </tr>
            ))}
          <tr>
        <td colSpan="1">Total</td>
        <td>
          {allbusdetails.reduce((sum, bus) => sum + bus.totalActualDistance, 0)}
        </td>
        <td>
          {allbusdetails.reduce((sum, bus) => sum + bus.totalCoveredDistance, 0)}
        </td>
        <td>
          {allbusdetails.reduce((sum, bus) => sum + bus.totalDifferenceCovered, 0)}
        </td>

      </tr>
          </tbody>
        </table>
           <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
           <p style={{marginLeft : '50px', marginRight: '50px' }}>Breakdown Factor = {breakdownFactor} </p>
        
           <p>
  {breakdownFactor > 0.5 ? (
    <button onClick={()=>handleButtonClick()} style={{ padding: '10px', backgroundColor: 'maroon', color: 'white' }}>
      Action
    </button>
  ) : breakdownFactor < 0.5 ? (
    <button onClick={handleButtonClickIncentive} style={{ padding: '10px', backgroundColor: 'green', color: 'white' }}>
      Incentive
    </button>
  ) : null}
</p>
{isAddBusOpen && (
  <Addbus
    open
    onClose={() => setIsAddBusOpen(false)}
    //  defaultRegNo={selectedRegNo}
  />
)}
      </div>
            </>:
            <div style={{marginTop:"40px"}}>
                No Data Available
            </div>:""
        }
        </>
        
        :radioselected === "Frequency"?
        <>
         
      <div style={{marginTop:"20px"}}></div>
        {
            aftersearch?allbusdetails.length > 0?
            <>
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
             {/* <table className="report-table">
          <thead>
            <tr>
              <th>Bus No.</th>
              <th>Distance To Cover</th>
              <th>Distance Covered</th>
              <th>Distance Difference</th>
            </tr>
          </thead>
          <tbody>
            {allbusdetails.map((bus, index) => (
              <tr key={index}>
                <td>{bus.busNo}</td>
                <td>{bus.totalActualDistance}</td>
                <td>{bus.totalCoveredDistance}</td>
                <td>{bus.totalDifferenceCovered}</td>
            
              </tr>
            ))}
          <tr>
        <td colSpan="1">Total</td>
        <td>
          {allbusdetails.reduce((sum, bus) => sum + bus.totalActualDistance, 0)}
        </td>
        <td>
          {allbusdetails.reduce((sum, bus) => sum + bus.totalCoveredDistance, 0)}
        </td>
        <td>
          {allbusdetails.reduce((sum, bus) => sum + bus.totalDifferenceCovered, 0)}
        </td>

      </tr>
          </tbody>
        </table> */}
           {/* <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
           <p style={{marginLeft : '50px', marginRight: '50px' }}>Breakdown Factor = {breakdownFactor} </p>
        
           <p>
  {breakdownFactor > 0.5 ? (
    <button onClick={()=>handleButtonClick()} style={{ padding: '10px', backgroundColor: 'maroon', color: 'white' }}>
      Action
    </button>
  ) : breakdownFactor < 0.5 ? (
    <button onClick={handleButtonClickIncentive} style={{ padding: '10px', backgroundColor: 'green', color: 'white' }}>
      Incentive
    </button>
  ) : null}
</p>
{isAddBusOpen && (
  <Addbus
    open
    onClose={() => setIsAddBusOpen(false)}
    //  defaultRegNo={selectedRegNo}
  />
)}
      </div> */}
            </>:
            <div style={{marginTop:"40px"}}>
                No Data Available
            </div>:""
        }
        </>
        
        :""
       }
      </Box>
      </div>
  )
}
export default Busdetails;