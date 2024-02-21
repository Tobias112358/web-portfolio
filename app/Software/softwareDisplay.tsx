'use client'
import { useState, useEffect } from "react";

export default function SoftwareDisplay() {

    const [items, setItems] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/Software", {
          method: "GET",
          headers: {
            "Content-Type": "application/json", // Set the request headers to indicate JSON format
          },
        })
          .then((res) => res.json()) // Parse the response data as JSON
          .then((data) => setItems(data)); // Update the state with the fetched data

    }, [])

    const collection = items.map((item:any) => {
        return (
          <div key={item.id} id={item.id}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </div>
        );
      });

    return collection;
}