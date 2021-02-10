import React, {useState} from 'react'
import style from './../styles'


const Approval = (props) => {
    const [fileName, setFileName] = useState('')

    
    let today = new Date(Date.now())
    let year = today.getFullYear().toString().slice(2)
    let month = (today.getMonth() + 1).toString()
    let day = (today.getDate()).toString()
    if (month.length === 1) { month = '0' + month }
    if (day.length === 1) { day = '0' + day }
    let date = `${year}${month}${day}`

    if (props.incompleteData > 0 || props.completeData === 0){return null}

    const handleChange = () => {
        return (e) => {
            setFileName( e.currentTarget.value)
        }
    }

    return (
        <div>
            <input
                placeholder={'filename'}
                value={fileName}
                onChange={handleChange()}
            />
            <span>{date}</span>
            <button
                onClick={() => {
                    props.createCsv((fileName + ` ${date}`))
                }}
            >Approve</button>
        </div>
    )
}

export default Approval