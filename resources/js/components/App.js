import React from 'react';
import DestinationInput from './DestinationInput';
import CalendarInput from './CalendarInput';
import Button from './Button';
import RadioInput from './RadioInput';
import Result from './Result';

class App extends React.Component {
    odrasliRef = React.createRef();
    djecaRef = React.createRef();
    bebeRef = React.createRef();
    state = {
        startDate: new Date(),
        endDate: new Date(),
        selectedOption: 'round_trip',
        rows: {},
        errors: {},
        disabledButton: false,
        isSuccessful: false,
    };

    updateRow = (key, updatedRow, updatedErrors) => {
        const rows = {...this.state.rows};
        rows[key] = updatedRow;
        this.setState({
            rows: rows,
        });

        const errors = {...this.state.errors};
        errors[key] = updatedErrors;
        this.setState({
            errors: errors,
        });
    };
    handleChange = (date, changeEvent) => {
        changeEvent.preventDefault();
        this.setState({
            startDate: date,
        });

        const rows = {
            ...this.state.rows,
            ['datumOdlaska']: date,
        };
        this.setState({
            rows: rows,
        });
    };

    handleChangeEndDate = (date, changeEvent) => {
        changeEvent.preventDefault();
        this.setState({
            endDate: date,
        });
        const rows = {
            ...this.state.rows,
            ['datumPovratka']: date,
        };
        this.setState({
            rows: rows,
        });
    };

    handleOptionChange = changeEvent => {
        this.setState({
            selectedOption: changeEvent.target.value,
        });
    };

    handleSubmit = event => {
        this.setState({
            disabledButton: true,
        });

        const rows = {...this.state.rows};
        const updatedRow = {
            'trip_type': this.state.selectedOption,
            'odrasli': this.odrasliRef.current.value,
            'djeca': this.djecaRef.current.value,
            'bebe': this.bebeRef.current.value,
        };
        rows[0] = updatedRow;
        this.setState({
            rows: rows,
        });

        event.preventDefault();
        const errors = [];
        const countRows = Object.keys(this.state.rows).length;
        if (countRows == 0 || countRows == 1) {
            const error = {};
            error['datumOdlaska'] = true;
            error['datumPovratka'] = true;
            error['mjestoPolaska'] = true;
            error['mjestoDolaska'] = true;
            errors[1] = error;
        }
        const errorZero = {};
        if (this.state.selectedOption === '') {
            errorZero['trip_type'] = true;
        }
        if ((this.odrasliRef.current.value.trim() === '' ||
            this.odrasliRef.current.value == 0) &&
            (this.djecaRef.current.value.trim() === '' ||
                this.djecaRef.current.value == 0) &&
            (this.bebeRef.current.value.trim() === '' ||
                this.bebeRef.current.value == 0)) {
            errorZero['brojOsoba'] = true;
        }
        errors[0] = errorZero;
        Object.keys(this.state.rows).map(key => {
            const error = {};
            if (key != 0) {
                if (this.state.rows[key]['datumOdlaska'] === undefined ||
                    this.state.rows[key]['datumOdlaska'] === '') {
                    error['datumOdlaska'] = true;
                }
                if ((this.state.rows[key]['datumPovratka'] === undefined ||
                    this.state.rows[key]['datumPovratka'] === '') &&
                    this.state.selectedOption === 'round_trip') {
                    error['datumPovratka'] = true;
                }
                if (this.state.rows[key]['mjestoPolaska'] === undefined ||
                    this.state.rows[key]['mjestoPolaska'] === '') {
                    error['mjestoPolaska'] = true;
                }
                if (this.state.rows[key]['mjestoDolaska'] === undefined ||
                    this.state.rows[key]['mjestoDolaska'] === '') {
                    error['mjestoDolaska'] = true;
                }
                errors[key] = error;
            }
        });
        this.setState({
            errors: errors,
        });
        let noErrors = true;
        Object.keys(errors).map(key => {
            if (Object.keys(errors[key]).length !== 0) {
                noErrors = false;
            }
        });
        if (noErrors) {
            fetch(
                `http://localhost:8888/api/flight-search`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    body: JSON.stringify(this.state.rows),
                }).
                then(res => res.json()).
                then((data) => {
                    this.setState({
                        isSuccessful: true,
                    });
                }).
                catch(console.log);
        }
        else {
            this.setState({
                disabledButton: false,
            });

        }
    };

    render() {
        return (
            <div>
                <div className="text-center py-16">
                    <h1 className="text-5xl text-white">Gdje ćete danas
                        putovati?</h1>
                    <p className="text-3xl text-blue-300">Putujte svijetom uz
                        najjeftiniju cijenu.</p>
                </div>
                {this.state.isSuccessful ? <Result/> : (
                    <form className="rounded-lg" onSubmit={this.handleSubmit}>
                        <div className="bg-white px-8 py-6">
                            <div className="flex flex-wrap">
                                <RadioInput
                                    handleOptionChange={this.handleOptionChange}
                                    selectedOption={this.state.selectedOption}
                                    inputName="round_trip"
                                    labelName="Povratni let"
                                    cssClass={''}
                                />
                                <RadioInput
                                    handleOptionChange={this.handleOptionChange}
                                    selectedOption={this.state.selectedOption}
                                    inputName="one_way"
                                    labelName="Jednosmjerni let"
                                    cssClass={'mt-4 md:mt-0 md:ml-8 '}
                                />
                                <RadioInput
                                    handleOptionChange={this.handleOptionChange}
                                    selectedOption={this.state.selectedOption}
                                    inputName="multi_city"
                                    labelName="Više destinacija"
                                    cssClass={'mt-4 md:mt-0 md:ml-8 '}
                                />
                            </div>
                            <div className="flex flex-wrap -mx-2 mt-6">
                                <DestinationInput cssClass={''}
                                                  title={'Mjesto polaska'}
                                                  index={'mjestoPolaska'}
                                                  indexKey={'1'}
                                                  row={this.state.rows[1]}
                                                  updateRow={this.updateRow}
                                                  errors={this.state.errors[1]}/>
                                <DestinationInput cssClass={' mt-4 sm:mt-0'}
                                                  title={'Mjesto dolaska'}
                                                  index={'mjestoDolaska'}
                                                  indexKey={'1'}
                                                  row={this.state.rows[1]}
                                                  updateRow={this.updateRow}
                                                  errors={this.state.errors[1]}/>
                                <CalendarInput title={'Odlazak'}
                                               index={'datumOdlaska'}
                                               indexKey={'1'}
                                               row={this.state.rows[1]}
                                               updateRow={this.updateRow}
                                               errors={this.state.errors[1]}/>
                                {this.state.selectedOption === 'round_trip' &&
                                <CalendarInput title={'Povratak'}
                                               index={'datumPovratka'}
                                               indexKey={'1'}
                                               row={this.state.rows[1]}
                                               updateRow={this.updateRow}
                                               errors={this.state.errors[1]}/>
                                }
                            </div>
                            {this.state.selectedOption === 'multi_city' &&
                            <div className="flex flex-wrap -mx-2 mt-6">
                                <DestinationInput cssClass={''}
                                                  title={'Mjesto polaska'}
                                                  index={'mjestoPolaska'}
                                                  indexKey={'2'}
                                                  row={this.state.rows[2]}
                                                  updateRow={this.updateRow}
                                                  errors={this.state.errors[2]}/>
                                <DestinationInput cssClass={' mt-4 sm:mt-0'}
                                                  title={'Mjesto dolaska'}
                                                  index={'mjestoDolaska'}
                                                  indexKey={'2'}
                                                  row={this.state.rows[2]}
                                                  updateRow={this.updateRow}
                                                  errors={this.state.errors[2]}/>
                                <CalendarInput title={'Odlazak'}
                                               index={'datumOdlaska'}
                                               indexKey={'2'}
                                               row={this.state.rows[2]}
                                               updateRow={this.updateRow}
                                               errors={this.state.errors[2]}/>
                            </div>
                            }
                            <div className="flex flex-wrap -mx-2 mt-6">
                                <label
                                    className={`w-full sm:w-1/2 lg:w-1/6 px-2 mt-4 sm:mt-0 ${(this.state.errors[0] &&
                                        this.state.errors[0]['brojOsoba'])
                                        ? 'input-error-border'
                                        : ''}`}>
                                <span
                                    className="font-semibold text-sm">Odrasli</span>
                                    <span className="form-input-group">
                                    <span className="form-input-icon">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path
    d="M2 6H0v2h2v2h2V8h2V6H4V4H2v2zm7 0a3 3 0 0 1 6 0v2a3 3 0 0 1-6 0V6zm11 9.14A15.93 15.93 0 0 0 12 13c-2.91 0-5.65.78-8 2.14V18h16v-2.86z"/></svg>                                        </span>
                                <input
                                    className="mt-1 pl-8 block w-full bg-gray-100 focus:bg-white border border-gray-200 rounded px-5 py-3 leading-tight text-gray-800"
                                    ref={this.odrasliRef}
                                    defaultValue="1"/>
                                </span>
                                </label>
                                <label
                                    className={`w-full sm:w-1/2 lg:w-1/6 px-2 mt-4 sm:mt-0 ${(this.state.errors[0] &&
                                        this.state.errors[0]['brojOsoba'])
                                        ? 'input-error-border'
                                        : ''}`}>
                                <span
                                    className="font-semibold text-sm">Djeca
                                </span>
                                    <span className="form-input-group">
                                    <span className="form-input-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             viewBox="0 0 20 20"><path
                                            d="M2 6H0v2h2v2h2V8h2V6H4V4H2v2zm7 0a3 3 0 0 1 6 0v2a3 3 0 0 1-6 0V6zm11 9.14A15.93 15.93 0 0 0 12 13c-2.91 0-5.65.78-8 2.14V18h16v-2.86z"/></svg>
                                    </span>
                                    <input
                                        className="mt-1 pl-8 block w-full bg-gray-100 focus:bg-white border border-gray-200 rounded px-5 py-3 leading-tight text-gray-800"
                                        ref={this.djecaRef}
                                    />
                                </span>
                                </label>
                                <label
                                    className={`w-full sm:w-1/2 lg:w-1/6 px-2 mt-4 sm:mt-0 ${(this.state.errors[0] &&
                                        this.state.errors[0]['brojOsoba'])
                                        ? 'input-error-border'
                                        : ''}`}>
                                <span
                                    className="font-semibold text-sm">Bebe
                                </span>
                                    <span className="form-input-group">
                                    <span className="form-input-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                             viewBox="0 0 20 20"><path
                                            d="M2 6H0v2h2v2h2V8h2V6H4V4H2v2zm7 0a3 3 0 0 1 6 0v2a3 3 0 0 1-6 0V6zm11 9.14A15.93 15.93 0 0 0 12 13c-2.91 0-5.65.78-8 2.14V18h16v-2.86z"/></svg>
                                    </span>
                                    <input
                                        className="mt-1 pl-8 block w-full bg-gray-100 focus:bg-white border border-gray-200 rounded px-5 py-3 leading-tight text-gray-800"
                                        ref={this.bebeRef}/>
                                </span>
                                </label>
                                {(this.state.errors[0] &&
                                    this.state.errors[0]['brojOsoba']) &&
                                <p className="w-full px-2 text-red-600 text-xs italic ">Morate
                                    upisati broj osoba</p>
                                }
                            </div>
                        </div>
                        <div
                            className="bg-gray-100 px-8 py-3 flex items-center justify-center">
                            <Button disabledButton={this.state.disabledButton}/>
                        </div>
                    </form>
                )}
            </div>
        );
    }
}

export default App;
