import React, {useState} from 'react'

const Matched = (props) => {
    const matchedData = props.matchedData
    if (matchedData.length === 0) {return null}
    

    return(
        <div>{matchedData.map((row) => {
            return (
                <div>
                    <span>{row.tlId? row.tlId: ""}</span> :: 
                    <span>{row.distb}</span> :: 
                    <span>{row.distbId}</span> :: 
                    <span>{row.product}</span> :: 
                    <span>{row.dbProductName}</span> :: 
                </div>
            )
            
        })}</div>
    )
}

export default Matched