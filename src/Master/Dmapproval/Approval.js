import { Box, Button, Checkbox, CircularProgress, Fade, FormControlLabel, Grid, MenuItem, Modal, Radio, RadioGroup, Select, Snackbar, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Bus_service from '../../Services/Bus_service';
import Conductor_service from '../../Services/Conductor_service';
import Driver_service from '../../Services/Driver_service';

import axios from 'axios';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function Approval(props) {
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
  const [sla,setsla] = useState('');
  // const slaMaster = {"id": sla}
  const [slafor,setSlafor] = useState('');
  const slaForMaster = {"id" : slafor}
  const [complaint,setcomplaint] = useState('');
  const [qualitytype, setQualityType]=useState('')
  const [details,setdetails] = useState('');
  const [instance,setinstance] = useState('');
  const [penalty,setpenalty] = useState('');
  const [remarks,setremarks] = useState('');
  const [premium,setPremium] = useState('');
  const [penaltydetail,setpenaltydetail] = useState('');
  const [sladetails,setsladetails] = useState([]);
  const [slafordetails,setslafordetails] = useState([]);
  const [qualitydetails,setqualitydetails] = useState([]);
  const [filedate,setfiledate] = useState('');
  const [resolvedate,setresolvedate] = useState('');
  const [bycustomer,setbycustomer] = useState('');
  const [complaintid, setcomplaintid] = useState('')
  const [complaintdetails,setcomplaintdetails] = useState([]);
  const [byCustomerChecked, setByCustomerChecked] = useState(false);
//   const [approvalid, setapprovalid] = useState(props.updateid);
  const approvalid =  props.updateid;
  const [opensnack,setOpensnack] = useState(false)
  const [errormessage,setErrormessage] = useState('');
  const [snackcolor,setSnackcolor] = useState('');
  const [loading,setLoading] = useState(false)
  const [slaOptions, setSlaOptions] = useState([]);
  const [slafortype,setSlafortype] = useState("");
  
  const cleanform = !props.updateid && props.open ;

  const { updateid } = props.updateid;

  useEffect(()=>{
    const penaltyPercentage = props.updatedetails.penaltypercentage;
    const fixedAmount = 200000; // 2 lakh
    const penaltyAmount = (fixedAmount * penaltyPercentage)/100;
    const amountToPay = fixedAmount+penaltyAmount
    setPremium(amountToPay);

  },[])  // console.log(props.updatedetails)

  useEffect(()=>{
    if(cleanform){
      // setbus('');
      setsla('')
      setcomplaint('')
      setdetails('')
      setfiledate('');
      setinstance('');
      setpenalty('');
      setpenaltydetail('');
      setQualityType('');
      setbycustomer('');
      setcomplaintid('')
    }
  },[cleanform])

  const calculatePenalty = () => {
    console.log("first")
    // Assuming penaltypercentage is in decimal (e.g., 0.05 for 5%)
    const penaltyPercentage = props.updatedetails.penaltypercentage;
    const fixedAmount = 200000; // 2 lakh
    const penaltyAmount = (fixedAmount * penaltyPercentage)/100;
    const amountToPay = fixedAmount+penaltyAmount
   
  console.log(amountToPay);
    return amountToPay;
};
const calculateIncentive = () => {

  const incentivePercentage = props.updatedetails.incentivepercentage;
  const fixedAmount = 200000; // 2 lakh
  const incentiveAmount = (fixedAmount * incentivePercentage)/100;
  const amountToPay = fixedAmount-incentiveAmount
  
  return amountToPay;
};
  const busmasterdetails = (id) =>{
    // console.log('clicked');
    // console.log("g",approvalid);
    // const penaltyAmount = calculatePenalty();
    // console.log("Penalty to Pay:", penaltyAmount);
    const penaltyPercentage = props.updatedetails.penaltypercentage;
    const fixedAmount = 200000; // 2 lakh
    const penaltyAmount = (fixedAmount * penaltyPercentage) / 100;
    const amountToPay = fixedAmount + penaltyAmount;
    
    axios.put(`http://10.226.33.132:9100/busperformance/setisapproved/${approvalid}/${remarks}/${amountToPay}`).then((res)=>{
        props.onClose();
        setSnackcolor("#458a32");
        setErrormessage(" Approved ")
        setOpensnack(true);
      }).catch(err=>{
        console.log(err);
        setSnackcolor("#e34242");
        setErrormessage("Not able to update data. Please try again later !")
        setOpensnack(true);
        props.onClose();
      })
    // var details = remarks;
    return (e) => {
      e.preventDefault();
    //   setLoading(true);
    //     axios.put(`http://10.226.33.132:9100/busperformance/setacceptflag/${approvalid}/${remarks}`).then((res)=>{
    //     props.onClose();
    //     setSnackcolor("#458a32");
    //     setErrormessage(" Approved ")
    //     setOpensnack(true);
    //   }).catch(err=>{
    //     console.log(err);
    //     setSnackcolor("#e34242");
    //     setErrormessage("Not able to update data. Please try again later !")
    //     setOpensnack(true);
    //     props.onClose();
    //   })
    };
  };
  const rejectDetails = (id) =>{
    console.log('clicked');
    console.log("g",approvalid);

    axios.put(`http://10.226.33.132:9100/busperformance/setisreject/${approvalid}/${remarks}`).then((res)=>{
        props.onClose();
        setSnackcolor("#FF0000");
        setErrormessage(" Rejected ")
        setOpensnack(true);
      }).catch(err=>{
        console.log(err);
        setSnackcolor("#e34242");
        setErrormessage("Not able to update data. Please try again later !")
        setOpensnack(true);
        props.onClose();
      })
    // var details = remarks;
    return (e) => {
      e.preventDefault();
    //   setLoading(true);
    //     axios.put(`http://10.226.33.132:9100/busperformance/setacceptflag/${approvalid}/${remarks}`).then((res)=>{
    //     props.onClose();
    //     setSnackcolor("#458a32");
    //     setErrormessage(" Approved ")
    //     setOpensnack(true);
    //   }).catch(err=>{
    //     console.log(err);
    //     setSnackcolor("#e34242");
    //     setErrormessage("Not able to update data. Please try again later !")
    //     setOpensnack(true);
    //     props.onClose();
    //   })
    };
  };

  const handleApproval = async (id) => {
    try {
      console.log('ID being passed:', id);
      let serviceToUpdate;
      let row_id = props.rowId;;
      let updatedSlaOptions;

      if (slafortype === "Bus") {
        serviceToUpdate = Bus_service.setisApproved(row_id);
        setSnackbarMessage('Approved');
        setSnackbarOpen(true);
        props.onClose();
        // serviceToUpdate= axios.post(`http://10.226.33.132:9100//busperformance/setisapproved/${row_id}`);
      } else if (slafortype === "Conductor") {
        serviceToUpdate = Conductor_service.setisApproved(row_id);
        setSnackbarMessage('Approved');
        setSnackbarOpen(true);
        props.onClose();
      } else if (slafortype === "Driver") {
        serviceToUpdate = Driver_service.setisApproved(row_id);
        setSnackbarMessage('Approved');
        setSnackbarOpen(true);
        props.onClose();
      }

      if (serviceToUpdate && serviceToUpdate.setisApproved) {
        serviceToUpdate.setisApproved(row_id);

        console.log(sla.id);
        props.onClose();
        // setSnackcolor("#458a32");
        alert("Approved");
      } else {
        // Handle the scenario where serviceToUpdate is not defined
        console.error('Service not found for the selected type.');
      }
    } catch (error) {
      console.error('Error while approving:', error);
      // Handle error scenarios accordingly
    }
  };

 useEffect(()=>{
    let id= props.updateid;
    console.log("hduhf",props.updateid)
    console.log('new',approvalid);
}, [props.updateid])

const submitbutton = () => {
  const fieldempty = remarks;
  if (fieldempty) {
    console.log("Row ID:", approvalid);
    return (
      <div>
        <Button
          size="large"
          variant="contained"
          onClick={busmasterdetails}
        //   onClick={handleApproval.bind(this, props.rowId)}
          style={{ marginBottom: "20px", marginRight: "10px" }}
        >
          Accept
        </Button>
        <Button
          size="large"
          variant="contained"
          onClick={rejectDetails}
          style={{ marginBottom: "20px",backgroundColor:"maroon" }}
        >
          Reject
        </Button>
       
      </div>
    );
  } else return null;
};

  console.log(slaOptions)

  const handleSnackClose = ()=>{
    setOpensnack(false);
  };
 
  return (
        <div>
          <Snackbar  ContentProps={{
    sx: {
      background: snackcolor,
      color:'white',
      padding:"15px",
      letterSpacing:"1.5px",
      fontWeight:"500",
      textAlign:"center"

    }
  }}
  anchorOrigin={{vertical:'top',horizontal:'center'}}
  open={opensnack}
  autoHideDuration={6000}
  onClose={handleSnackClose}
  message={errormessage}
  />
      <Modal
            // onClose={handlemodalclose}
            // open={modalopen}
            {...props}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
  <Box sx={style}>
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} alignItems={"center"} style={{textAlign:"center"}}>
      <Grid item xs={12}>
        <Typography className='heading' id="modal-modal-title" variant="h6" component="h2" color="primary">
           Approval / Reject 
        </Typography>
     </Grid>
     
     <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '35ch' },
      }}
      style={{width:"100%"}}
      noValidate
      autoComplete="off"
    >

<div style={{display:"flex",flexDirection:"row",width:"100%",justifyContent:"center"}}>
  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start"}}>
  <Typography variant="body1" style={{ marginBottom: "8px" }}>
    <strong>SLA:</strong> {props.updatedetails.slaMaster ? props.updatedetails.slaMaster.sla : 'N/A'}
  </Typography>
  <Typography variant="body1" style={{ marginBottom: "8px" }}>
    <strong>Agency Name:</strong> {props.updatedetails.slaMaster && props.updatedetails.slaMaster.agencyMaster ? props.updatedetails.slaMaster.agencyMaster.agencyname : 'N/A'}
  </Typography>

  <Typography variant="body1" style={{ marginBottom: "8px" }}>
    <strong>File Date:</strong> {props.updatedetails.filedate ? props.updatedetails.filedate : 'N/A'}
  </Typography>
 
  <Typography variant="body1" style={{ marginBottom: "8px" }}>
    <strong>Complaint Number:</strong> {props.updatedetails.customerComplaint ? props.updatedetails.customerComplaint.complaintid : 'N/A'}
  </Typography>
  </div>

  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-start",paddingLeft:"20px"}}>
  <Typography variant="body1" style={{ marginBottom: "8px" }}>
    <strong>SLA Type:</strong> {props.updatedetails.slaMaster && props.updatedetails.slaMaster.slaTypeMaster ? props.updatedetails.slaMaster.slaTypeMaster.slatype : 'N/A'}
  </Typography>
  
  <Typography variant="body1" style={{ marginBottom: "8px" }}>
    <strong>Quality Type:</strong> {props.updatedetails.qualityStandardMaster ? props.updatedetails.qualityStandardMaster.qualitytype : 'N/A'}
  </Typography>

  {props.updatedetails.penalty? 
    <>
    {/* <Typography variant="body1" style={{ marginBottom: "8px" }}>
      <strong>Penalty:</strong> {props.updatedetails.penalty} 
    </Typography> */}
     <Typography variant="body1" style={{ marginBottom: "8px" }}>
       <strong>Penalty Percentage:</strong> {props.updatedetails.penaltypercentage}
     </Typography>
     <Typography variant="body1" style={{ marginBottom: "8px" }}>
       <strong>Monthly Cost:</strong> 2,00,000
     </Typography>
     <Typography variant="body1" style={{ marginBottom: "8px" }}>
       <strong>Premium:</strong> {calculatePenalty()}
     </Typography>
     </>:""
  }


  {props.updatedetails.incentive && (
    <>
    {/* <Typography variant="body1" style={{ marginBottom: "8px" }}>
    <strong>Incentive:</strong> {props.updatedetails.incentive}
    </Typography> */}
     <Typography variant="body1" style={{ marginBottom: "8px" }}>
     <strong> Incentive Percentage:</strong> {props.updatedetails.incentivepercentage}
     </Typography>
     <Typography variant="body1" style={{ marginBottom: "8px" }}>
       <strong>Monthly Cost:</strong> 2,00,000
     </Typography>
     <Typography variant="body1" style={{ marginBottom: "8px" }}>
       <strong>Premium:</strong> {calculateIncentive()}
     </Typography>
     </>
  
    
    )}
  </div>
  
</div>


    <TextField 
      id="standard-basic" 
      label="Remarks"  
      variant="standard" 
      name='remarks' value={remarks} 
      onChange={(e)=>setremarks(e.target.value)} 
      required
        >
        </TextField>
     

    </Box>

    <Grid item xs={12} sx={{mt:2}}>
      {submitbutton()}
      <div style={{display:"inline"}}>
      <Fade
      in={loading}
      style={{
        transitionDelay: loading ? '50ms' : '0ms',
        marginLeft:"10px",
        marginTop:"10px"
      }}
      unmountOnExit
      >
        <CircularProgress style={{marginLeft:"10px",
        marginTop:"10px"}}/>
        </Fade>
        </div>
    </Grid>
    </Grid>
  </Box>

</Modal>
        </div>
    );
}
export default Approval