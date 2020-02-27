import React from 'react';
import Loader from './Loader';

class Button extends React.Component {
    render() {
        return (
            <div>
                {this.props.disabledButton ? <Loader/> :
                    <button type="submit"
                            className="inline-flex items-center leading-tight bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold px-5 py-3 rounded-lg"
                    >
                        <svg className="h-6 w-6 fill-current"
                             xmlns="http://www.w3.org/2000/svg"
                             viewBox="0 0 20 20">
                            <path
                                d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"/>
                        </svg>
                        <span className="ml-2">Pretraži</span>
                    </button>
                }
                    < /div>
        )
    }
}

export default Button;
