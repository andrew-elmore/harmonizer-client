import React, {useState} from 'react'

const Mapping = (props) => {


    

    const [distb, setDistib] = useState('Supplier')
    const [distbId, setDistibId] = useState('ID')
    const [product, setProduct] = useState('name')
    // const [distb, setDistib] = useState('')
    // const [distbId, setDistibId] = useState('')
    // const [product, setProduct] = useState('')


    
    if (props.rawData.length === 0) {return null}


    const sourceFields = Object.keys(props.rawData[0])
    if (sourceFields.includes('DISTB_ID')) { setDistibId('DISTB_ID')}
    if (sourceFields.includes('DISTB')) { setDistibId('DISTB')}
    if (sourceFields.includes('PRODUCT')) { setProduct('PRODUCT')}
    return (
        <div>
            <div>
                DISTB: {sourceFields.map((sourceField) => {
                    let color = 'lightgrey'
                    if (sourceField === distb) {color = 'black'}
                    return <button
                        style={{color}}
                        onClick={() => { setDistib (sourceField)}}
                    >
                        {sourceField}
                    </button>
                })}

                <br/>

                DISTB_ID: {sourceFields.map((sourceField) => {
                    let color = 'lightgrey'
                    if (sourceField === distbId) {color = 'black'}
                    return <button
                        style={{color}}
                        onClick={() => { setDistibId (sourceField)}}
                    >
                        {sourceField}
                    </button>
                })}
                <br/> 
                PRODUCT: {sourceFields.map((sourceField) => {
                    let color = 'lightgrey'
                    if (sourceField === product) {color = 'black'}
                    return <button
                        style={{color}}
                        onClick={() => { setProduct (sourceField)}}
                    >
                        {sourceField}
                    </button>
                })}
            </div>
            <button onClick={() => { props.submitMapping(distb, distbId, product)}}>Map Fields</button>
        </div>
    )


}

export default Mapping


