const tLBlue = 'rgb(30, 98, 130)'
const tLRed = 'rgb(130, 30, 30)'
const tLGreen = 'rgb(0, 124, 60)'

const button = {
    display: 'inline-block',
    border: 'none',
    borderRadius: 5,
    boxShadow: '1px 1px 5px grey',
    outline: 'none',
}

export const uploadStyle = {
        container: {
            margin: 10
            // border: '1px solid black'
        },
        button: {
            ...button
        }
    }

    
export const mappingStyle = {
        container: {
            margin: 10,
            // border: '1px solid black'
        },
        line: {
            container: {
                margin: 10
            },
            title: {
            },
            unselectedButton: {
                ...button,
                color: 'black',
                backgroundColor: 'lightgrey',
                margin: 5
            },
            selectedButton: {
                ...button,
                color: 'white',
                backgroundColor: tLBlue,
                margin: 5
            }
        },
        submitButton: {
            ...button,
            backgroundColor: tLGreen,
            color: 'white'
        }
    }

    export const matchedStyle = {
        container: {
            margin: 5,
            marginTop: 10,
            paddingTop: 5,
            backgroundColor: 'lightgrey'
        },
        approveButton: {
            ...button,
            backgroundColor: tLGreen,
            color: 'white',
            marginTop: 5,
            width: '100%'
        },
        rejectButton: {
            ...button,
            backgroundColor: tLRed,
            color: 'white',
            marginTop: 5,
            width: '100%'

        },
        data: {
            container: {
                backgroundColor: 'green',
                display: 'flex',
                margin: 10,
                boxShadow: '1px 1px 5px grey',

            },
            originalData: {
                container: {
                    backgroundColor: 'white',
                    width: '50%',
                    padding: 5
                }
            },
            dbData: {
                container: {
                    backgroundColor: 'white',
                    width: '50%',
                    padding: 5

                } 
            }
        }
    }
