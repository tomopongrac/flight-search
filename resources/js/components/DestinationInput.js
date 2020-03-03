import React from 'react';
import Autosuggest from 'react-autosuggest';

const renderInputComponent = inputProps => {
    delete inputProps.className;
    return (
        <div>
            <input className={`mt-1 form-input pl-8`} {...inputProps} />
        </div>
    );
};

function renderSuggestionsContainer({containerProps, children, query}) {
    return (
        <div style={{
            position: 'absolute',
            backgroundColor: '#fff',
            zIndex: '20',
            width: '100%'
        }} {...containerProps}>
            {children}
        </div>
    );
}

// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => `${suggestion.name} (${suggestion.code})`;

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
    <div className="py-3 border-b border-l border-r pl-8">
        {suggestion.name} ({suggestion.code})
    </div>
);
const parseData = data => {
    return JSON.parse(data);
};

class DestinationInput extends React.Component {
    constructor(props) {
        super(props);

        // Autosuggest is a controlled component.
        // This means that you need to provide an input value
        // and an onChange handler that updates this value (see below).
        // Suggestions also need to be provided to the Autosuggest,
        // and they are initially empty because the Autosuggest is closed.
        this.state = {
            value: (this.props && this.props.row &&
                this.props.row[this.props.index]) || '',
            suggestions: [],
        };
    }

    onChange = (event, {newValue}) => {
        this.setState({
            value: newValue,
        });

        const updatedRow = {
            ...this.props.row,
            [this.props.index]: newValue,
        };
        const updatedErrors = {...this.props.errors};
        if (newValue !== '') {
            delete updatedErrors[this.props.index];
        }

        this.props.updateRow(this.props.indexKey, updatedRow, updatedErrors);
    };

    // Autosuggest will call this function every time you need to update
    // suggestions. You already implemented this logic above, so just use it.
    onSuggestionsFetchRequested = ({value}) => {
        const inputValue = value.trim().toLowerCase();
        fetch(
            `http://localhost:8888/api/flight-search-suggestion/${inputValue}`).
            then(res => res.json()).
            then((data) => {
                this.setState({
                    suggestions: parseData(data),
                });
            }).
            catch(console.log);

    };

    // Autosuggest will call this function every time you need to clear
    // suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: [],
        });
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
            <label
                className={`w-full sm:w-1/2 lg:w-1/4 px-2 ${this.props.cssClass} ${(this.props.errors &&
                    this.props.errors[this.props.index])
                    ? 'input-error-border'
                    : ''}`}>
                <span
                    className="font-semibold text-sm">{this.props.title}</span>
                <span className="form-input-group">
                                    <span className="form-input-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                         viewBox="0 0 20 20"><path
                                        d="M10 20S3 10.87 3 7a7 7 0 1 1 14 0c0 3.87-7 13-7 13zm0-11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>
                                        </span>
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderInputComponent={renderInputComponent}
                renderSuggestionsContainer={renderSuggestionsContainer}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
                    {(this.props.errors &&
                        this.props.errors[this.props.index]) &&
                    <p className="text-red-600 text-xs italic absolute">Obavezno
                        polje</p>
                    }
                    </span>
            </label>

        );
    }
}

export default DestinationInput;
