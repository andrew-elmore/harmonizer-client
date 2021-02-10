import React, { useState } from 'react'
import { unmatchedStyle } from '../styles'


const UnmatchedElement = (props) => {
    const [unmatchedItem, setUnmatchedItem] = useState(props.unmatchedItem)
    if (unmatchedItem.length === 0) { return null }

    const handleChange = (field) => {
        return (e) => {
            setUnmatchedItem({ ...unmatchedItem, [field]: e.currentTarget.value })
        }
    }

    return (
        <div style={unmatchedStyle.field.container}>
            DISTB_ID: <input
                value={unmatchedItem.distbId}
                onChange={handleChange('distbId')}
            />
            <br />
            <br />
            DISTB: <input
                value={unmatchedItem.distb}
                onChange={handleChange('distb')}
            />
            <br />
            <br />
            <div>PRODUCT: {unmatchedItem.product}</div>
            <button
                style={unmatchedStyle.searchButton}
                onClick={() => { props.fetchMatches([unmatchedItem]) }}
            >Search</button>
        </div>

    )
}

export default UnmatchedElement