import React from 'react';

import download from 'downloadjs'

import Mapping from './mapping/mapping'
import Matched from './matching/matched'
import Unmatched from './matching/unmatched'
import Approval from './approval/approval'
import {uploadStyle, unmatchedStyle} from './styles'

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rawData: [
                // { "ID": '475517', "Supplier": 'UNFI', "name": 'Mind, Body and Soul' },
                // { "ID": '303537', "Supplier": 'UNFI', "name": 'Mind, Body and Soul' },
                // { "ID": '457481', "Supplier": 'UNFI', "name": 'Earl Grey Black Tea' },
                // { "ID": '684514', "Supplier": 'UNFI', "name": 'Fair Trade English Breakfast Tea' },
                // { "ID": '736488', "Supplier": 'UNFI', "name": 'Gunpowder Green Tea (Special Pin Head)' },
                // { "ID": '272310', "Supplier": 'UNFI', "name": 'Biodynamic' },
                // { "ID": '987420', "Supplier": 'UNFI', "name": 'Breakfast Blend' },
                // { "ID": '992883', "Supplier": 'UNFI', "name": 'Colombian' },
                // { "ID": '1628429', "Supplier": 'KEHE', "name": 'White Rice Flour' },
                // { "ID": '64834', "Supplier": 'KEHE', "name": 'Cornstarch' },
                // { "ID": '340257', "Supplier": 'KEHE', "name": 'Whole Wheat Flour' },
                // { "ID": '113858', "Supplier": 'KEHE', "name": 'Guatemalan Atitlan' },
                // { "ID": '331150', "Supplier": 'KEHE', "name": 'Brown Rice Flour' },
                // { "ID": '10438', "Supplier": 'KEHE', "name": 'Vital Wheat Gluten' },
            ],
            mappedData: [
            ],
            matchedData: [
                { tlId: "10025", distb: "UNFI", distbId: "475517", product: "Mind, Body and Soul", dbProductName: "Mind, Body and Soul", approved: true},
                { tlId: "10025", distb: "UNFI", distbId: "303537", product: "Mind, Body and Soul", dbProductName: "Mind, Body and Soul", approved: true},
                { tlId: "10087", distb: "UNFI", distbId: "457481", product: "Earl Grey Black Tea", dbProductName: "Earl Grey Black Tea", approved: true},
                { tlId: "10088", distb: "UNFI", distbId: "684514", product: "Fair Trade English Breakfast Tea", dbProductName: "Fair Trade English Breakfast Tea", approved: true},
                { tlId: "10134", distb: "UNFI", distbId: "736488", product: "Gunpowder Green Tea (Special Pin Head)", dbProductName: "Gunpowder Green Tea (Special Pin Head)", approved: true},
                { tlId: "10174", distb: "UNFI", distbId: "272310", product: "Biodynamic", dbProductName: "Biodynamic", approved: true},
                { tlId: "10176", distb: "UNFI", distbId: "987420", product: "Breakfast Blend", dbProductName: "Breakfast Blend", approved: true},
                { tlId: "10177", distb: "UNFI", distbId: "992883", product: "Colombian", dbProductName: "Colombian", approved: true},
                { tlId: "12685", distb: "KEHE", distbId: "1628429", product: "White Rice Flour", dbProductName: "White Rice Flour", approved: true},
                { tlId: "11647", distb: "KEHE", distbId: "64834", product: "Cornstarch", dbProductName: "Cornstarch", approved: true},
                { tlId: "12267", distb: "KEHE", distbId: "340257", product: "Whole Wheat Flour", dbProductName: "Whole Wheat Flour", approved: true},
                { tlId: "10680", distb: "KEHE", distbId: "113858", product: "Guatemalan Atitlan", dbProductName: "Guatemalan Atitlan", approved: true},
                { tlId: "12682", distb: "KEHE", distbId: "331150", product: "Brown Rice Flour", dbProductName: "Brown Rice Flour", approved: true},
            ],
            unmatchedData: [
                // { distb: "KEHE", distbId: "10438", product: "Vital Wheat Gluten"}

            ],
            fileName: ''
        };

    

        this.url = 'http://localhost:5000'
        this.name = 'res'
        this.handleUpload = this.handleUpload.bind(this);
        this.submitMapping = this.submitMapping.bind(this);
        this.fetchMatches = this.fetchMatches.bind(this);
        this.createCsv = this.createCsv.bind(this)
        this.approve = this.approve.bind(this)
        this.reject = this.reject.bind(this)
    }

    approve(idx) {
        let matchedData = this.state.matchedData
        matchedData = matchedData.map((row, i) => {
            if (idx === i) {
                return {...row, approved: true}
            } else {
                return row
            }
        })
        this.setState({ ['matchedData']: matchedData})
    }

    reject(idx) {
        let matchedData = this.state.matchedData
        let unmatchedData = this.state.unmatchedData
        unmatchedData.push({
            distb: matchedData[idx].distb,
            distbId: matchedData[idx].distbId,
            product: matchedData[idx].product,
        })
        matchedData = matchedData.filter((row, i) => { return i != idx})
        this.setState({ 
            ['matchedData']: matchedData, 
            ['unmatchedData']: unmatchedData
        })
    }

    createCsv(fileName) {
        const formData = new FormData();
        formData.append('matchedData', JSON.stringify(this.state.matchedData));

        fetch(`${this.url}/api/harmonize/download`, {
            method: 'POST',
            body: formData,
        })
        .then((response) => {
            this.downloadFile(response, fileName)
        });
    }

    downloadFile = async (res, fileName) => {
        const blob = await res.blob();
        download(blob, fileName);
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



    render() {
        return (
            <div>
                {/* <button onClick={() => { console.log(this.state) }}>See State</button> */}
                <form 
                    onSubmit={this.handleUpload}>
                    <div style={uploadStyle.container}>
                        <input 
                            style={{ ...uploadStyle.button, marginRight: 30 }}
                            ref={(ref) => { this.uploadInput = ref; }} type="file" 
                        />
                        <button 
                            style={{ ...uploadStyle.button}}
                        >Search</button>
                    </div>
                </form>
                <Mapping
                    rawData={this.state.rawData}
                    submitMapping={(distbName, distbIdName, productName) => { this.submitMapping(distbName, distbIdName, productName)}}
                />
                <Unmatched
                    unmatchedData={this.state.unmatchedData}
                    fetchMatches={(item) => {this.fetchMatches(item)}}
                />
                <Matched
                    matchedData={this.state.matchedData}
                    approve={(idx) => { this.approve(idx)}}
                    reject={(idx) => { this.reject(idx)}}
                />
                <Approval
                    createCsv={(fileName) => { this.createCsv(fileName) }}
                    incompleteData={(this.state.unmatchedData.length + this.state.mappedData.length + this.state.rawData.length + this.state.matchedData.filter((row) => { return (!row.approved) }).length)}
                    completeData={this.state.matchedData.filter((row) => {return (row.approved)}).length}
                />

            </div>
        );
    }
}

export default Main;




