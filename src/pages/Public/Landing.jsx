import React, {useEffect, useState} from 'react'
import Button from '../../components/Botton/Button'



const Landing = () => {
  const API_URL = import.meta.env.VITE_API_BASE_URL
  const [data, setData] = useState(null);
  const domain = window.location.hostname;


  useEffect(()=> {
    const makeReq = async () => {
    const response = await fetch(`${API_URL}/org/public/organization?domain_name=${domain}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
  }
  console.log(domain)
  makeReq();
  }, []);
  return (
    <>
      <h1>Company Name</h1>
      <h3>Company Adrress</h3>
      <h6>Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae fugit optio excepturi architecto cum est quae sapiente dolorem culpa. Neque, deserunt. Sunt deserunt totam reprehenderit excepturi repellat, adipisci possimus repellendus?</h6>
      <Button>Learn More</Button>
    </>
  )
}

export default Landing