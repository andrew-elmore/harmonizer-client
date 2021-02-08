import React from 'react';

import download from 'downloadjs'

import Mapping from './mapping/mapping'
import Matched from './matching/matched'
import Unmatched from './matching/unmatched'

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rawData: [],
            // rawData: [
            //     { ID: "303511", Supplier: "UNFI", name: "Jasmine Green Tea" },
            //     { ID: "276931", Supplier: "UNFI", name: "Fair Trade Darjeeling Black Tea" },
            //     { ID: "36946", Supplier: "UNFI", name: "Indian Spice Herbal Tea Blend" },
            //     { ID: "36941", Supplier: "UNFI", name: "Kukicha Twig Black Tea" },
            //     { ID: "36944", Supplier: "UNFI", name: "Bancha Leaf Tea" },
            //     { ID: "361873", Supplier: "KEHE", name: "Happy House Blend™" },
            //     { ID: "113673", Supplier: "KEHE", name: "Sweet Nothings Decaff™" },
            //     { ID: "340927", Supplier: "KEHE", name: "Wonderbrew™" },
            //     { ID: "68501", Supplier: "KEHE", name: "French Roast" },
            //     { ID: "603193", Supplier: "KEHE", name: "French Roast" },
            //     { ID: "266106", Supplier: "KEHE", name: "Jo-Jo's Java™" },
            //     { ID: "22234", Supplier: "KEHE", name: "Error name" },
            // ],
            // mappedData: [],
            mappedData: [
                { distb: "UNFI", distbId: "303511", product: "Jasmine Green Tea" },
                { distb: "UNFI", distbId: "276931", product: "Fair Trade Darjeeling Black Tea" },
                { distb: "UNFI", distbId: "36946", product: "Indian Spice Herbal Tea Blend" },
                { distb: "UNFI", distbId: "36941", product: "Kukicha Twig Black Tea" },
                { distb: "UNFI", distbId: "36944", product: "Bancha Leaf Tea" },
                { distb: "KEHE", distbId: "361873", product: "Happy House Blend™" },
                { distb: "KEHE", distbId: "113673", product: "Sweet Nothings Decaff™" },
                { distb: "KEHE", distbId: "340927", product: "Wonderbrew™" },
                { distb: "KEHE", distbId: "68501", product: "French Roast" },
                { distb: "KEHE", distbId: "603193", product: "French Roast" },
                { distb: "KEHE", distbId: "266106", product: "Jo-Jo's Java™" },
            ],
            // unmatchedData: [],
            unmatchedData: [{ distbId: "22234", distb: "KEHE", product: "Error name" }],
        };

    

        this.url = 'http://localhost:5000'
        this.name = ''
        this.handleUpload = this.handleUpload.bind(this);
        this.submitMapping = this.submitMapping.bind(this);
        this.fetchMatches = this.fetchMatches.bind(this);
    }

    // fetchNewMatches(data) {
    //     const distbs = {}
    //     data.forEach((row) => {
    //         if (distbs[row["distb"]]) {
    //             distbs[row["distb"]].push(row["distbId"])
    //         } else {
    //             distbs[row["distb"]] = [(row["distbId"])]
    //         }
    //     })
    //     // console.log(distributors)
    //     const formData = new FormData();
    //     formData.append('distbs', JSON.stringify(distbs));

    //     fetch(`${this.url}/api/harmonize/match`, {
    //         method: 'POST',
    //         body: formData,
    //     })
    //         .then(response => response.json())
    //         .then((matches) => {

    //             data.forEach((row) => {
    //                 if (matches[row.distb]) {
    //                     if (matches[row.distb][row.distbId]) {
    //                         mappedData.push({ ...row, ['tlId']: matches[row.distb][row.distbId] })
    //                     } else {
    //                         unmatchedData.push(row)
    //                     }
    //                 }
    //             });

    //             console.log(mappedData)
    //             this.setState({
    //                 ["mappedData"]: mappedData,
    //                 ["unmatchedData"]: unmatchedData
    //             })

    //         });
    // }



    fetchMatches(data) {
        const distbs = {}
        data.forEach((row) => {
            if (distbs[row["distb"]]) {
                distbs[row["distb"]].push(row["distbId"])
            } else {
                distbs[row["distb"]] = [(row["distbId"])]
            }
        })
        // console.log(distributors)
        const formData = new FormData();
        formData.append('distbs', JSON.stringify(distbs));

        fetch(`${this.url}/api/harmonize/match`, {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then((matches) => {
                const mappedData = this.state.mappedData
                let unmatchedData = this.state.unmatchedData
                data.forEach((row) => {
                    if(matches[row.distb]){
                        if (matches[row.distb][row.distbId] ){
                            mappedData.push({...row, ['tlId']: matches[row.distb][row.distbId]})
                            if (unmatchedData.filter((item) => {return(row.product === item.product)})){
                                unmatchedData = unmatchedData.filter((item) => { return (row.product != item.product) })
                            }
                        } else {
                            unmatchedData.push(row)
                        }
                    }
                });
                
                console.log(mappedData)
                this.setState({
                    ["mappedData"]: mappedData,
                    ["unmatchedData"]: unmatchedData
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

    // downloadFile = async (res) => {
    //     const blob = await res.blob();
    //     download(blob, this.name);
    // }

    render() {
        return (
            <div>
                <form onSubmit={this.handleUpload}>
                    <div>
                        <input ref={(ref) => { this.uploadInput = ref; }} type="file" />
                    </div>
                    <br />
                    <div>
                        <button>Convert</button>
                    </div>
                </form>
                <button onClick={ () => {console.log(this.state)} }>See State</button>
                {/* <button onClick={ () => {this.fetchMatches()} }>See Tables</button> */}
                <Mapping
                    rawData={this.state.rawData}
                    submitMapping={(distbName, distbIdName, productName) => { this.submitMapping(distbName, distbIdName, productName)}}
                />
                <br/>
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
                    mappedData={this.state.mappedData}
                />

                <button 
                    onClick={() => {

                    }}
                >Approve</button>
            </div>
        );
    }
}

export default Main;




