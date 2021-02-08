import React, {useState} from 'react'

const Matched = (props) => {
    const mappedData = props.mappedData
    if (mappedData.length === 0) {return null}
    

    return(
        <div>{mappedData.map((row) => {
            return (
                <div>
                    <span>{row.tlId? row.tlId: ""}</span> :: 
                    <span>{row.distb}</span> :: 
                    <span>{row.distbId}</span> :: 
                    <span>{row.product}</span> :: 
                </div>
            )
            
        })}</div>
    )
}

export default Matched