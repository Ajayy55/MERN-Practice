import { useState } from "react";
const useSearchFilter = (data,occasionalData,searchKeys,) => {
  const [query, setQuery] = useState("");
  const filteredData = data.filter((item) =>
    item.maidName.toLowerCase().includes(query.toLowerCase())
  );
  const filterDataOccasional=occasionalData.filter((item)=>
    item.entryType.toLowerCase().includes(query.toLowerCase())
  )
  return { query, setQuery, filteredData,filterDataOccasional };
};
export default useSearchFilter;
