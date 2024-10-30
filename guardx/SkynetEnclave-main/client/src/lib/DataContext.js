// DataContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { PORT } from "../Api/api";
export const DataContext = createContext();
export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [regularOccasionalEntries, setReegularOccasionalEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const society_id = JSON.parse(localStorage.getItem("society_id"));
  const id = JSON.parse(localStorage.getItem("roleId"));
  const getEntries = async () => {
    try {
      let response = await axios.get(`${PORT}/getEntries`);
      const responseData = response.data.data;
      const filterData = responseData.filter(
        (item) => item.society_id === society_id
      );
      setReegularOccasionalEntries(filterData);
      const filteredEntries = filterData.filter(
        (item) => item.entryType === "Regular"
      );
      const sortedEntries = filteredEntries.sort((a, b) => {
        const nameA = a.titleEnglish.toLowerCase();
        const nameB = b.titleEnglish.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
      setData(sortedEntries);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEntries();
  }, []);
  const addItem = (newItem) => {
    setData((prevData) => [...prevData, newItem]);
    getEntries();
  };

  const removeItem = (id) => {
    setData((prevData) => prevData.filter((item) => item._id !== id));
  };

  const updateItem = (updatedItem) => {
    setData((prevData) =>
      prevData.map((item) =>
        item._id === updatedItem._id ? updatedItem : item
      )
    );
  };
  // Guard Data
  //Purpose Data
  const [purposeDatas, setPurposeData] = useState([]);
  const [purposeLoading, setPurposeLoading] = useState(true);
  const [filteredPurposes, setFilteredPurpose] = useState([]);
  const handlePurposeData = async () => {
    try {
      const result = await axios.get(`${PORT}/getUserNonVerfiedPrupose`);
      const response = result.data.data;

      const filterPurposeData = response.filter(
        (item) => item && item.society_id=== society_id
      );
      setPurposeLoading(false);
      setPurposeData(filterPurposeData);
      setFilteredPurpose(filterPurposeData);
      localStorage.setItem("purposeDatas", JSON.stringify(filterPurposeData));
      localStorage.setItem(
        "filteredPurposes",
        JSON.stringify(filterPurposeData)
      );
    } catch (error) {
      console.error("Error fetching purpose data:", error);
    }
  };
  useEffect(() => {
    handlePurposeData();
  }, [society_id]);

  //House list Data
  const [houseDetailss, setHouseDetails] = useState([]);
  const [houseLoading, setHouseLoading] = useState(true);
  const [filteredByHouseNos, setFilteredByHouseNo] = useState([]);
  const handleHouseListData = async () => {
    const response = await axios.get(`${PORT}/getHouseDetails`);
    const res = response.data.data;
    const filterHouseData = res.filter(
      (item) => item && item.society_id === society_id
    );
    setHouseLoading(false);
    setHouseDetails(filterHouseData);
    setFilteredByHouseNo(filterHouseData);
    // Save to localStorage
    localStorage.setItem("houseDetailss", JSON.stringify(filterHouseData));
    localStorage.setItem("filteredByHouseNos", JSON.stringify(filterHouseData));
  };
  useEffect(() => {
    handleHouseListData();
  }, [society_id]);
  // Entry Types
  const [filterUserDatas, setFilterUserData] = useState();
  const [filteredDatas, setFilteredData] = useState([]);
  const [regularEntriess, setRegularEntries] = useState([]);
  const [loadingRegular, setRegularLoading] = useState(true);
  const [occasionalEntriess, setOccasionalEntries] = useState([]);
  const [loadingEntry, setLoadingEntry] = useState(true);

  const getOccasionalEntries = async () => {
    let response = await axios.get(`${PORT}/getEntries`);
    const allEntries = response.data.data;
    const filteredUserData = allEntries.filter(
      (item) =>
        item.entryType === "Occasional" && item.society_id === society_id
    );
    setOccasionalEntries(filteredUserData);
    setLoadingEntry(false);
    localStorage.setItem(
      "occasionalEntriess",
      JSON.stringify(filteredUserData)
    );
    localStorage.setItem("filterUserDatas", JSON.stringify(filteredUserData));
  };
  useEffect(() => {
    getOccasionalEntries();
  }, []);
  //Get RegularEntries
  const getRegularEntries = async () => {
    try {
      let response = await axios.get(`${PORT}/getEntries`);
      const allEntries = response.data.data;

      const filterData = allEntries
        .filter((item) => item._id)
        .map((item) => item._id);

      const getMaid = async () => {
        try {
          const response = await axios.get(`${PORT}/getAllVerifyHouseMaid`);
          const verifyHouseMaid = response.data.verifyHouseMaid;
          const verifiedIds = filterData.filter((id) =>
            verifyHouseMaid?.some((maid) => maid.paramsId === id)
          );

          const filteredUserRegularEntries = allEntries.filter((item) =>
            verifiedIds.includes(item._id)
          );
          const filterRegular = filteredUserRegularEntries.filter(
            (item) => item && item.society_id === society_id
          );

          setRegularLoading(false);
          setRegularEntries(filterRegular);

          localStorage.setItem(
            "regularEntriess",
            JSON.stringify(filterRegular)
          );
        } catch (error) {
          console.log(error);
        }
      };

      return getMaid();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getRegularEntries();
  }, [society_id]);
  // Set societyLogo Functionlaity
  const [societyDetails, setSocietyDetails] = useState([]);
  const getSocietyLogo = async () => {
    await axios.get(`${PORT}/getSocietyData`).then((res) => {
      const getSocietyDetails = res.data.societyData.filter(
        (item) => item._id === society_id
      );
      setSocietyDetails(getSocietyDetails[0]);
    });
  };

  useEffect(() => {
    getSocietyLogo();
  }, []);
  const [societyUserLogo, setSocietyUserLogo] = useState([]);
  // Get User Logo
  const getGuardData = async () => {
    try {
      const response = await axios.get(`${PORT}/getEditWithSocietyUnion/${id}`);
      setSocietyUserLogo(response.data.data[0]);
    } catch (error) {
      console.error("Error fetching guard data:", error);
    }
  };

  useEffect(() => {
    getGuardData();
  }, []);
  return (
    <DataContext.Provider
      value={{
        data,
        loading,
        regularOccasionalEntries,
        addItem,
        removeItem,
        updateItem,
        purposeDatas,
        purposeLoading,
        filteredPurposes,
        houseDetailss,
        filteredByHouseNos,
        filterUserDatas,
        filteredDatas,
        regularEntriess,
        occasionalEntriess,
        loadingEntry,
        loadingRegular,
        houseLoading,
        societyDetails,
        societyUserLogo,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
