import React, { useState, useEffect, useContext } from "react";
import Entry from "./Entry";
import Purpose from "../../src/Purpose/Purpose";
import House from "../../src/Purpose/House";
import Verification from "../PhotoVerify/Verification";
import Navbar from "../Navbar/Navbar";
import { LanguageContext } from "../lib/LanguageContext";
import Tooltip from "@mui/material/Tooltip";
import { DataContext } from "../lib/DataContext";
import { TiTick } from "react-icons/ti";


const FirstPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { language } = useContext(LanguageContext);
  const [purposeData, setPurposeData] = useState([]);
  const { purposeDatas, filteredPurposes, purposeLoading } =
    useContext(DataContext);
  useEffect(() => {
    const storedStep = localStorage.getItem("currentStep");
    if (storedStep) {
      setCurrentStep(Number(storedStep));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("currentStep", currentStep);
  }, [currentStep]);
  const nextStep = (step, id) => {
    if (id) {
      const filteredDataAccToEntry = purposeDatas?.filter(
        (item) => item?.createdBy === id
      );
      console.log(filteredDataAccToEntry)
      setPurposeData(filteredDataAccToEntry);

      if (filteredDataAccToEntry.length === 0) {
        setCurrentStep(3);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };
  const prevStep = () => {
    if (currentStep === 3 && purposeData.length === 0) {
      setCurrentStep(1);
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };
  const getStepClassName = (step) => {
    if (currentStep === step) return "step actives";
    if (currentStep > step) return "step completed";
    return "step";
  };

  return (
    <div>
      <Navbar setCurrentStep={setCurrentStep} />

      <div className="container_stepIndicator">
        <section className="step-indicator">
          <div className={getStepClassName(1)}>
            <Tooltip
              title={
                language === "english" ? "प्रवेश का प्रकार" : "Type of Entry"
              }
              placement="top"
              arrow
            >
              <div className="step-icon"> {currentStep > 1 ? <TiTick className="guard-step-icon"></ TiTick>: '1'}</div>
            </Tooltip>
          </div>{" "}
          <br />
          <div>
            <p></p>
          </div>
          <div
            className={`indicator-line ${currentStep > 1 ? "actives" : ""}`}
          ></div>
          <div className={getStepClassName(2)}>
            <Tooltip
              title={
                language === "english" ? "आने का उद्देश्य" : "Purpose of visit"
              }
              placement="top"
              arrow
            >
              <div className="step-icon">  {currentStep > 2 ?<TiTick className="guard-step-icon"></ TiTick>: '2'}</div>
            </Tooltip>
          </div>
          <div
            className={`indicator-line ${currentStep > 2 ? "actives" : ""}`}
          ></div>
          <div className={getStepClassName(3)}>
            <Tooltip
              title={language === "english" ? "कहाँ जाना है" : "Where to visit"}
              placement="top"
              arrow
            >
              <div className="step-icon">{currentStep > 3 ? <TiTick className="guard-step-icon"></ TiTick> : '3'}</div>
            </Tooltip>
          </div>
          <div
            className={`indicator-line ${currentStep > 3 ? "actives" : ""}`}
          ></div>
          <div className={getStepClassName(4)}>
            <Tooltip
              title={language === "english" ? "सत्यापन" : "Verification"}
              placement="top"
              arrow
            >
              <div className="step-icon"> {currentStep > 4 ? <TiTick className="guard-step-icon"></ TiTick> : '4'}</div>
            </Tooltip>
          </div>
        </section>
      </div>
      {currentStep === 1 && <Entry nextStep={nextStep} />}
      {currentStep === 2 && (
        <Purpose data={purposeData} nextStep={nextStep} prevStep={prevStep} />
      )}
      {currentStep === 3 && <House nextStep={nextStep} prevStep={prevStep} />}
      {currentStep === 4 && (
        <Verification
          nextStep={nextStep}
          setCurrentStep={setCurrentStep}
          prevStep={prevStep}
        />
      )}
    </div>
  );
};

export default FirstPage;
