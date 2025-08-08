import React, { useEffect, useState } from 'react'
import PageHeader from '../../../components/Layouts/PageHeader'
import { Link } from 'react-router-dom'
import Modal from '../../../components/UI/Modal'
import axios from 'axios'
import UpdateFacebook from './UpdateFacebookToken'
import UpdateFacebookToken from './UpdateFacebookToken'
import { getDate } from '../../../selectOption/selectFunction'

const FacebookToken = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const Token = localStorage.getItem('token') || '';
  const [data, setData] = useState({})

  // let expireData = "2025-05-05 12:30:00";

  const fetchFacebookTokenData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/campaign/get-facebook-token`, {
        headers: {
          Authorization: `Bearer ${Token}`
        }
      });
      setData(()=>({
        ...response.data.data[0]
      }));

    } catch (error) {
      console.log(error)

    }
  };


  useEffect(() => {
    fetchFacebookTokenData();

  }, [])


  return (
    <div>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <div className="row">
            <div className="col-md-12">
              {/* Page Header */}
              <PageHeader title="Facebook Token" />

              {/* /Page Header */}
              <div className="card main-card">
                <div className="card-body">
                  {/* Search */}
                  <div className="search-section">
                    <div className="row">
                      <div className="files-activity">
                        <div className="files-wrap">
                          <div className="row align-items-center">
                            <div className="col-md-8">
                              <div className="file-info">
                                <h4>Current Token</h4>
                                <p>
                                  {data?.fb_exchange_token ? data?.fb_exchange_token : 'No token exists'}
                                  {/* {"EAAUmEV61tDIBO0GGU8VZA7pqEDj3WbMf7J2dgDOiqHoMvpMD2VYeHZCTbz7jjAk3t2CtQXW7ZAp9KZBCqFSIjZAADHDfr4wuq7iNSFOt6cXIwp4XEHAxmFaMvnk3eFyLPpcteZB7GKPS4UfsrZCNZCpZCwpPBnogOhrqRfZAiKTZCpSnDVKoZC8dhDYd51RrghqZBxnepKPzwFOfZAEd5v8VHZCkQZDZD"} */}
                                </p>
                                {/* <p style={{ color: '#E41F07' }}> */}
                                <p style={{ color: '#3767b1' }}>
                                  Expiry Date: {data?.expiryDate ? getDate(data?.expiryDate) : ''}
                                </p>
                              </div>
                            </div>
                            <div className="col-md-4 text-md-end">
                              <ul className="file-action">
                                <li>
                                  <Link
                                    to="#"
                                    className="btn btn-primary"
                                    data-bs-toggle="modal"
                                    data-bs-target="#fackebook_token"
                                  >
                                    Update Token
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /Search */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}

      <Modal id="fackebook_token">
        <UpdateFacebook 
        fetchData={fetchFacebookTokenData}
         />
      </Modal>

    </div>
  )
}

export default FacebookToken