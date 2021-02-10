import React, {useState}from 'react'
import style from './../styles'


const Unmatched = (props) => {
    const [unmatchedItem, setUnmatchedItem] = useState(props.unmatchedItem)
    if (unmatchedItem.length === 0){ return null}

    const handleChange = (field) => {
        return (e) => {
            setUnmatchedItem({...unmatchedItem, [field]: e.currentTarget.value })
        }
    }

    return (
        <div>
            <input
                value={unmatchedItem.distbId}
                onChange={handleChange('distbId')}
            />
            <input
                value={unmatchedItem.distb}
                onChange={handleChange('distb')}
            />
            <span>{unmatchedItem.product}</span>
            <button
                onClick={() => {props.fetchMatches([unmatchedItem])}}
            >Search</button>
        </div>

    )
}

export default Unmatched