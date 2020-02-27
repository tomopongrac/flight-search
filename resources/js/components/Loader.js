import React from 'react';
import Loader from 'react-loader-spinner'

export default class App extends React.Component {
    //other logic
    render() {
        return(
            <Loader
                type="Oval"
                color="#00BFFF"
                height={30}
                width={30}

            />
        );
    }
}
