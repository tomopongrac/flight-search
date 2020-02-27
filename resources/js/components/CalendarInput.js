import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {registerLocale, setDefaultLocale} from 'react-datepicker';
import hr from 'date-fns/locale/hr';

registerLocale('hr', hr);

class CalendarInput extends React.Component {
    state = {
        startDate: (this.props.row && this.props.row[this.props.index]) || '',
    };

    handleChange = (date, changeEvent) => {
        changeEvent.preventDefault();
        this.setState({
            startDate: date,
        });

        const updatedRow = {
            ...this.props.row,
            [this.props.index]: date,
        };
        const errors = {...this.props.errors};
        delete errors[this.props.index];
        this.props.updateRow(this.props.indexKey, updatedRow, errors);
    };

    render() {
        const {value, suggestions} = this.state;

        // Autosuggest will pass through all these props to the input.
        const inputProps = {
            placeholder: '',
            value,
            onChange: this.onChange,
        };

        // Finally, render it!
        return (
            <label className="w-full sm:w-1/2 lg:w-1/4 px-2 mt-4 lg:mt-0">
                <span
                    className="font-semibold text-sm">{this.props.title}</span>
                <span className="form-input-group">
                                    <span className="form-input-icon">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path
    d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z"/></svg>                                        </span>
            <DatePicker selected={this.state.startDate}
                        onChange={this.handleChange}
                        dateFormat="dd-MM-yyyy"
                        shouldCloseOnSelect={true}
                        inline={false}
                        locale="hr"
                        className={`mt-1 form-input pl-8 ${(this.props.errors &&
                            this.props.errors[this.props.index])
                            ? 'border-red-600'
                            : ''}`}
            />
                                            </span>
                {(this.props.errors && this.props.errors[this.props.index]) &&
                <p className="text-red-600 text-xs italic absolute">Obavezno
                    polje</p>
                }
            </label>
        );
    }
}

export default CalendarInput;
