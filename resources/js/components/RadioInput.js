import React from 'react';

class RadioInput extends React.Component {
    render() {
        return (
            <label
                className={`form-radio-group w-full w-full sm:w-1/2 md:w-1/4 ${this.props.cssClass}`}>
                <input type="radio" name="trip_type"
                       value={this.props.inputName}
                       checked={this.props.selectedOption ===
                       this.props.inputName}
                       onChange={this.props.handleOptionChange}/>
                <span className="form-radio-indicator"
                      aria-hidden></span>
                <span
                    className="ml-3 select-none">{this.props.labelName}</span>
            </label>
        );
    }
}

export default RadioInput;
