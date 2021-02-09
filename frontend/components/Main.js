import React from 'react';

import download from 'downloadjs'

import Mapping from './mapping/mapping'
import Matched from './matching/matched'
import Unmatched from './matching/unmatched'

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rawData: [
                { "ID": '475517', "Supplier": 'UNFI', "name": 'Mind, Body and Soul' },
                { "ID": '303537', "Supplier": 'UNFI', "name": 'Mind, Body and Soul' },
                { "ID": '457481', "Supplier": 'UNFI', "name": 'Earl Grey Black Tea' },
                { "ID": '684514', "Supplier": 'UNFI', "name": 'Fair Trade English Breakfast Tea' },
                { "ID": '736488', "Supplier": 'UNFI', "name": 'Gunpowder Green Tea (Special Pin Head)' },
                { "ID": '272310', "Supplier": 'UNFI', "name": 'Biodynamic' },
                { "ID": '987420', "Supplier": 'UNFI', "name": 'Breakfast Blend' },
                { "ID": '992883', "Supplier": 'UNFI', "name": 'Colombian' },
                { "ID": '1628429', "Supplier": 'KEHE', "name": 'White Rice Flour' },
                { "ID": '64834', "Supplier": 'KEHE', "name": 'Cornstarch' },
                { "ID": '340257', "Supplier": 'KEHE', "name": 'Whole Wheat Flour' },
                { "ID": '113858', "Supplier": 'KEHE', "name": 'Guatemalan Atitlan' },
                { "ID": '331150', "Supplier": 'KEHE', "name": 'Brown Rice Flour' },
                { "ID": '104381', "Supplier": 'KEHE', "name": 'Vital Wheat Gluten' },
            ],
            mappedData: [
            ],
            matchedData: [
            ],
            unmatchedData: [
            ],
            fileName: ''
        };

    

        this.url = 'http://localhost:5000'
        this.name = 'res'
        this.handleUpload = this.handleUpload.bind(this);
        this.submitMapping = this.submitMapping.bind(this);
        this.fetchMatches = this.fetchMatches.bind(this);
        this.createCsv = this.createCsv.bind(this)
    }

    createCsv() {
        const formData = new FormData();
        formData.append('matchedData', JSON.stringify(this.state.matchedData));

        fetch(`${this.url}/api/harmonize/download`, {
            method: 'POST',
            body: formData,
        })
        .then((response) => {
            this.downloadFile(response)
        });
    }


    fetchMatches(sourceData) {
        const distbs = {}
        sourceData.forEach((row) => {
            if (distbs[row["distb"]]) {
                distbs[row["distb"]].push(row["distbId"])
            } else {
                distbs[row["distb"]] = [(row["distbId"])]
            }
        })
        const formData = new FormData();
        formData.append('distbs', JSON.stringify(distbs));

        fetch(`${this.url}/api/harmonize/match`, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then((matches) => {
            
            const matchedData = this.state.matchedData
            let unmatchedData = this.state.unmatchedData

            sourceData.forEach((row) => {
                try{
                    let matchedItems = []
                    Object.entries(matches[row.distb]).forEach(([dbDistbId, dbItem])=>{
                        if (dbDistbId.includes(row.distbId)){
                            matchedItems.push(dbItem)
                        }
                    })
                    console.log(matchedItems.length)
                    let matchedItem = null
                    if (matchedItems.length === 1) {
                        matchedItem = matchedItems[0]
                    } else {
                        throw 'problem';
                    }
                    matchedData.push({ ...row, ["tlId"]: matchedItem.tlId, ["dbProductName"]: matchedItem.dbProductName })
                    unmatchedData = unmatchedData.filter((item) => {return item.product != row.product})
                } catch {
                    unmatchedData.push(row)
                }
            });

            this.setState({
                ["matchedData"]: matchedData,
                ["unmatchedData"]: unmatchedData,
                ['mappedData']: []
            })

        });
    }

    submitMapping(distbName, distbIdName, productName) {
        const rawData = this.state.rawData
        const mappedData = rawData.map((row) => {
            return {
                distb: row[distbName],
                distbId: row[distbIdName],
                product: row[productName]
            }
        })
        this.setState({
            ["rawData"]: [],
            ["mappedData"]: mappedData
        })
        this.fetchMatches(mappedData)

    }

    handleUpload(ev) {
        ev.preventDefault();
        this.name = this.uploadInput.files[0].name
        const data = new FormData();
        data.append('file', this.uploadInput.files[0]);
        data.append('filename', 'convert');

        fetch(`${this.url}/api/harmonize/upload`, {
            method: 'POST',
            body: data,
        }).then(response => response.json())
        .then((data) => {
            console.log(data)
            this.setState({ ['rawData']: data })
        });
    }

    downloadFile = async (res) => {
        const blob = await res.blob();
        download(blob, this.name);
    }

    render() {
        return (
            <div>
                <button onClick={() => { console.log(this.state) }}>See State</button>
                <form onSubmit={this.handleUpload}>
                    <div>
                        <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
                    </div>
                    <div>
                        <button>Search</button>
                    </div>
                </form>
                <Mapping
                    rawData={this.state.rawData}
                    submitMapping={(distbName, distbIdName, productName) => { this.submitMapping(distbName, distbIdName, productName)}}
                />
                <br/>
                {this.state.unmatchedData.map((unmatchedItem) => {
                    return (
                        <Unmatched
                            unmatchedItem={unmatchedItem}
                            fetchMatches={(item) => {this.fetchMatches(item)}}
                        />
                    )
                })}

                <br />
                <br />
                <br />
                <Matched
                    matchedData={this.state.matchedData}
                />
                <button 
                    onClick={() => {
                        this.createCsv()
                    }}
                >Approve</button>
            </div>
        );
    }
}

export default Main;




