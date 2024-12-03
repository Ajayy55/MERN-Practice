import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { PORT } from "../../port/Port";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { swal } from "sweetalert2/dist/sweetalert2";

// Mock data

// const  = ["House 1", "House 2", "House 3", "House 4"];
const Token=localStorage.getItem('token');
function GuardAccess() {
  const [entryTypes,setEntries] =useState([])
  const [purposeList,setPurpose]=useState([])
  const [houseList,setHouseList]=useState([])
  const [regularEntryList,setRegularEntryList]=useState([])
  const [selectedEntry,setSelectedEntry]=useState([])
  const [currentStep, setCurrentStep] = useState(1); // Track the active step
  const [formData, setFormData] = useState({
    typeOfEntryId:"",
    entryId: "",
    purposeId: "",
    house: "",
  });

  // Handle selection for cards
  const handleCardSelect = (name, value,type) => {
    console.log(name,value,type);
    
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    console.log(formData);
    
    setSelectedEntry(type);
    
  };

 
  // Navigate to the next or previous step
  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };


  const fetchEntry = async (society,entryId) => {
    try {
      const url = `${PORT}getSocietyRegularEntryById`;
      console.log('fomsta',society,entryId);
    
      const response = await axios.post(url, { society,entry:entryId});
      // console.log('res et',response);

      if (response.status === 200) {
        setRegularEntryList(response.data.response);
      }


    } catch (error) {
      console.error('Error fetching attendance records:', error);
    }
  };

  useEffect(() => {
    if (formData.typeOfEntryId && currentStep==2)  {
      const decode = jwtDecode(Token);
      fetchEntry(decode.society,formData.typeOfEntryId);
    }
  }, [currentStep]);

  const handleSubmit =async () => {
    // console.log("Form Submitted:", formData);
    const decode=await jwtDecode(Token);
    const payload={
      ...formData,
      society:decode.society,
      guardID:decode.id,
      regularEntryID:formData.entryId,
    }

    console.log('payload',payload);
    
    try {
      const url = `${PORT}handleRegularEntryClockIn`;
      const response = await axios.post(url,payload);
      // console.log(response);

      if (response.status === 200) {
    
        setCurrentStep(1);
        setFormData({ 
          typeOfEntryId:"",
          entryId: "",
          purposeId: "",
          house: "",})
        alert("Entry Registered Successfully!");
      }
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      alert("Error!!!  pls do manual entry");
      setTimeout(()=>{
        setCurrentStep(1);
        setFormData({ 
          typeOfEntryId:"",
          entryId: "",
          purposeId: "",
          house: "",})
      },1500)
    }

   
    // Reset form or add further logic here
  };

const getEntriesList=async(society)=>{
  try {
    const url=`${PORT}getSocietyBySocietyID/${society}`;
    const response=await axios.get(url);
    // console.log(response);
    setEntries(response?.data?.response?.typeOfEntries);
    setPurpose(response?.data?.response?.purposeList);
  } catch (error) {
    console.log(error);
    
  }
}
const getHouseList=async(society)=>{
  try {
    const url=`${PORT}getHouseListBySocietyId/${society}`;
    const response=await axios.get(url);
    // console.log('house',response);
    setHouseList(response?.data?.response);
  } catch (error) {
    console.log(error);
    
  }
}

  useEffect(()=>{
    if(Token){
      const decode=jwtDecode(Token);
      getEntriesList(decode.society)
      getHouseList(decode.society)
    }
  },[Token])

  // console.log(entryTypes,purposeList,selectedEntry,regularEntryList);
  
  return (
    <Layout>
        <div className="content-wrapper">
        <div className="col-lg-12 grid-margin stretch-card">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow">
              <div className="card-body">
                {/* Step Indicator */}
                <div className="mb-4">
                  <div className="progress" style={{ height: "10px" }}>
                    <div
                      className="progress-bar bg-primary"
                      style={{
                        width: `${(currentStep / 3) * 100}%`,
                      }}
                      role="progressbar"
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    {["Type of Entry", "Purpose of Visit", "Choose House"].map(
                      (step, index) => (
                        <span
                          key={index}
                          className={`${
                            currentStep === index + 1
                              ? "fw-bold text-primary"
                              : currentStep > index + 1
                              ? "fw-bold text-success"
                              : "text-muted"
                          }`}
                        >
                          {currentStep > index + 1 && (
                            <span className="me-1">✔</span>
                          )}
                          {step}
                        </span>
                      )
                    )}
                  </div>
                </div>

                {/* Step Content */}
                <div>
                  {currentStep === 1 && (
                    <div>
                      <h4 className="mb-3">Step 1: Choose Type of Entry</h4>
                      <div className="row g-3">
                        {entryTypes.map((type, index) => (
                          <div className="col-4" key={type._id}>
                            <button
                              className={`btn btn-outline-primary w-100 ${
                                formData?.typeOfEntryId === type?._id ? "active" : ""
                              }`}
                              onClick={() =>
                                handleCardSelect("typeOfEntryId", type?._id,type.entryType)
                                
                              }
                            >
                              {type.title}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedEntry==='occasional' && currentStep === 2 &&(
                    <div>
                      <h4 className="mb-3">Step 2: Purpose of Visit</h4>
                      <div className="row g-3">
                        {purposeList.map((purpose, index) => (
                          <div className="col-4" key={purpose._id}>
                            <button
                              className={`btn btn-outline-primary w-100 ${
                                formData.purposeId === purpose._id ? "active" : ""
                              }`}
                              onClick={() =>
                                handleCardSelect("purposeId", purpose._id)
                              }
                            >
                              {purpose.purpose}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedEntry==='regular' && currentStep === 2 &&
                  (<div>
                  <h4 className="mb-3">Step 2: Select Entry</h4>
                  <div className="row g-3">
                  {regularEntryList.map((entry, index) => (
                            <div className="col-4" key={entry._id}>
                            <button
                              className={`btn btn-outline-primary w-100 ${
                                formData.purposeId === entry._id ? "active" : ""
                              }`}
                              onClick={() =>{
                                handleCardSelect("purposeId", entry._id);
                                handleCardSelect("entryId", entry._id);
                              }
                              }
                            >
                              {entry.name}
                            </button>
                          </div>
                        ))}
                  </div>
                </div>
                  )}

                  {currentStep === 3 && (
                    <div>
                      <h4 className="mb-3">Step 3: Choose House</h4>
                      <select
                        className="form-select"
                        name="house"
                        value={formData.house}
                        onChange={(e) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            house: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select House</option>
                        {houseList.map((house, index) => (
                          <option key={house._id} value={house._id}>
                            {house.houseNo }
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between mt-4">
                  <button
                    className="btn btn-secondary"
                    onClick={handleBack}
                    disabled={currentStep === 1}
                  >
                    Back
                  </button>
                  {currentStep < 3 ? (
                    <button
                      className="btn btn-primary"
                      onClick={handleNext}
                      disabled={
                        !formData[currentStep === 1 ? "typeOfEntryId" : "purposeId"]
                      }
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      className="btn btn-success"
                      onClick={handleSubmit}
                      disabled={!formData.house}
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default GuardAccess;
