import { useState, useEffect } from "react";
import axios from "axios";

//  const getApi = (url1, url2) => {
//   const Token = localStorage.getItem('token') || '';
//   const [data1, setData1] = useState(null);
//   const [data2, setData2] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         let requests = [axios.get(url1, { headers: { Authorization: `Bearer ${Token}` } })];
//         if (url2) requests.push(axios.get(url2, { headers: { Authorization: `Bearer ${Token}` } }));

//         const responses = await Promise.all(requests);
//         setData1(responses[0]?.data?.data);
//         if (url2) setData2(responses[1]?.data?.data);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [url1, url2]);
//   return { data1, data2, loading, error };
// };
// export default getApi;

const getApi = (url) => {
  const [data1, setData1] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Token = localStorage.getItem("token") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${Token}` },
        });
        setData1(response?.data?.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);
  return { data1, loading, error };
};
export default getApi;
